// 월세날까지 실시간 접속자 수 서버
// 전 세계 접속자를 하나의 Durable Object("global")가 WebSocket으로 받아 숫자만 돌려준다.
// 하이버네이션 API를 써서 접속이 많아도 대기 시간에는 비용이 거의 들지 않는다.

const ALLOWED = /^(https:\/\/(www\.)?wolseday\.com|https:\/\/([a-z0-9-]+\.)?wolseday\.pages\.dev|http:\/\/localhost(:\d+)?|http:\/\/127\.0\.0\.1(:\d+)?)$/;
const BROADCAST_DELAY_MS = 1500;

export class Presence {
  constructor(ctx) {
    this.ctx = ctx;
    // 클라이언트의 30초 ping에는 객체를 깨우지 않고 바로 pong으로 답한다.
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  async fetch() {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    await this.scheduleBroadcast();
    return new Response(null, { status: 101, webSocket: client });
  }

  // 들어오고 나갈 때마다 바로 보내지 않고 1.5초 모아서 한 번에 알린다.
  async scheduleBroadcast() {
    const pending = await this.ctx.storage.getAlarm();
    if (pending === null) await this.ctx.storage.setAlarm(Date.now() + BROADCAST_DELAY_MS);
  }

  async alarm() {
    const open = this.ctx.getWebSockets().filter((ws) => ws.readyState === 1);
    const chars = { grad: 0, mom: 0, boss: 0 };
    for (const ws of open) {
      const a = ws.deserializeAttachment();
      if (a && a.char in chars) chars[a.char]++;
    }
    const msg = JSON.stringify({ online: open.length, chars });
    for (const ws of open) {
      try { ws.send(msg); } catch (_) { /* 이미 끊긴 연결 */ }
    }
  }

  // 클라이언트는 지금 고른 인물만 알려준다: {"char":"grad"|"mom"|"boss"|null}
  async webSocketMessage(ws, message) {
    if (typeof message !== 'string' || message.length > 64) return;
    let data;
    try { data = JSON.parse(message); } catch (_) { return; }
    const char = ['grad', 'mom', 'boss'].includes(data && data.char) ? data.char : null;
    ws.serializeAttachment({ char });
    await this.scheduleBroadcast();
  }

  async webSocketClose(ws, code) {
    try { ws.close(code === 1005 ? 1000 : code, 'bye'); } catch (_) {}
    await this.scheduleBroadcast();
  }

  async webSocketError() {
    await this.scheduleBroadcast();
  }
}

// ---------------- 오늘의 판 순위표 ----------------
// 판 하나를 시작할 때 /api/start 로 번호를 받고, 끝나면 그 번호로 /api/score 에 기록을 올린다.
// 번호마다 한 번만 올릴 수 있고, 시작부터 너무 빨리 끝난 기록(하루 1.5초 미만)은 받지 않는다.

const CHARS = ['grad', 'mom', 'boss'];
const ENDS = ['broke', 'collapse', 'burnout', 'evicted'];
const BAD_WORDS = ['시발', '씨발', 'ㅅㅂ', '병신', 'ㅂㅅ', '좆', '개새', '니애미', '느금', '섹스', 'fuck', 'shit', 'sex', 'bitch', '창녀', '애미', '애비', '꺼져', '죽어'];
const MIN_MS_PER_DAY = 1500;

function kstDate(offsetDays = 0) {
  return new Date(Date.now() + 9 * 3600e3 + offsetDays * 86400e3).toISOString().slice(0, 10);
}
function validSeed(seed) {
  return typeof seed === 'string' && [kstDate(-1), kstDate(0), kstDate(1)].includes(seed);
}
function cleanName(raw) {
  let name = String(raw || '').normalize('NFC').replace(/[^0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ _.-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 10);
  const flat = name.toLowerCase().replace(/[\s_.-]/g, '');
  if (!name || BAD_WORDS.some((w) => flat.includes(w))) name = '익명의 세입자';
  return name;
}

export class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS runs (id TEXT PRIMARY KEY, seed TEXT, char TEXT, ip TEXT, t0 INTEGER, used INTEGER DEFAULT 0)`);
    this.sql.exec(`CREATE INDEX IF NOT EXISTS runs_ip ON runs (ip, t0)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS scores (id TEXT PRIMARY KEY, seed TEXT, name TEXT, char TEXT, days INTEGER, endt TEXT, rents INTEGER, t INTEGER)`);
    this.sql.exec(`CREATE INDEX IF NOT EXISTS scores_rank ON scores (seed, days DESC, t ASC)`);
    // 이번 판 인물(이름·나이). 처음 배포한 표에는 없던 칸이라 없으면 추가한다.
    const cols = this.sql.exec(`PRAGMA table_info(scores)`).toArray().map((c) => c.name);
    if (!cols.includes('who')) this.sql.exec(`ALTER TABLE scores ADD COLUMN who TEXT`);
    if (!cols.includes('look')) this.sql.exec(`ALTER TABLE scores ADD COLUMN look TEXT`);
    // 끝난 판의 익명 기록 (난이도 조정용)
    this.sql.exec(`CREATE TABLE IF NOT EXISTS runlogs (id INTEGER PRIMARY KEY AUTOINCREMENT, t INTEGER, ip TEXT, mode TEXT, char TEXT, days INTEGER, endt TEXT, rents INTEGER, ukka INTEGER, body TEXT)`);
    this.sql.exec(`CREATE INDEX IF NOT EXISTS runlogs_t ON runlogs (t)`);
  }

  board(seed, limit = 10, char = null) {
    const where = char ? `seed = ? AND char = ?` : `seed = ?`;
    const args = char ? [seed, char] : [seed];
    const top = this.sql.exec(`SELECT id, name, char, who, look, days, rents, endt FROM scores WHERE ${where} ORDER BY days DESC, rents DESC, t ASC LIMIT ?`, ...args, limit).toArray();
    const total = this.sql.exec(`SELECT COUNT(*) AS n FROM scores WHERE ${where}`, ...args).one().n;
    // 버틴 날과 낸 월세가 같으면 같은 순위
    let prev = null, prevRank = 0;
    top.forEach((r, i) => {
      const key = r.days + ':' + r.rents;
      r.rank = key === prev ? prevRank : i + 1; prev = key; prevRank = r.rank;
      try { r.look = r.look ? JSON.parse(r.look) : null; } catch (_) { r.look = null; }
    });
    return { total, top, at: Date.now() };
  }

  async fetch(request) {
    const url = new URL(request.url);
    const ip = request.headers.get('cf-connecting-ip') || 'local';
    const now = Date.now();

    if (url.pathname === '/api/stats') {
      const sinceDays = Math.max(1, Math.min(365, Number(url.searchParams.get('since')) || 30));
      const mode = ['daily', 'practice'].includes(url.searchParams.get('mode')) ? url.searchParams.get('mode') : null;
      return json(this.stats(now - sinceDays * 86400e3, mode));
    }

    if (url.pathname === '/api/board') {
      const seed = url.searchParams.get('seed') || kstDate();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(seed)) return json({ error: 'seed' }, 400);
      const char = CHARS.includes(url.searchParams.get('char')) ? url.searchParams.get('char') : null;
      const limit = Math.max(1, Math.min(100, Math.floor(Number(url.searchParams.get('limit')) || 10)));
      return json(this.board(seed, limit, char));
    }

    let body = null;
    try { body = await request.json(); } catch (_) { return json({ error: 'body' }, 400); }
    if (!body || typeof body !== 'object') return json({ error: 'body' }, 400);

    if (url.pathname === '/api/log') {
      const raw = JSON.stringify(body);
      if (raw.length > 120000) return json({ error: 'too big' }, 413);
      if (!CHARS.includes(body.char)) return json({ error: 'bad' }, 400);
      const days = Math.floor(Number(body.days));
      if (!(days >= 1 && days <= 500)) return json({ error: 'days' }, 400);
      const recent = this.sql.exec(`SELECT COUNT(*) AS n FROM runlogs WHERE ip = ? AND t > ?`, ip, now - 3600e3).one().n;
      if (recent >= 60) return json({ error: 'slow down' }, 429);
      this.sql.exec(`DELETE FROM runlogs WHERE t < ?`, now - 180 * 86400e3);
      this.sql.exec(`INSERT INTO runlogs (t, ip, mode, char, days, endt, rents, ukka, body) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        now, ip, body.mode === 'daily' ? 'daily' : 'practice', body.char, days, ENDS.includes(body.end) ? body.end : 'broke',
        Math.max(0, Math.floor(Number(body.rents) || 0)), Math.max(0, Math.floor(Number(body.ukka) || 0)), raw);
      return json({ ok: true });
    }

    if (url.pathname === '/api/start') {
      if (!validSeed(body.seed) || !CHARS.includes(body.char)) return json({ error: 'bad' }, 400);
      const recent = this.sql.exec(`SELECT COUNT(*) AS n FROM runs WHERE ip = ? AND t0 > ?`, ip, now - 3600e3).one().n;
      if (recent >= 30) return json({ error: 'slow down' }, 429);
      this.sql.exec(`DELETE FROM runs WHERE t0 < ?`, now - 3 * 86400e3);
      const id = crypto.randomUUID();
      this.sql.exec(`INSERT INTO runs (id, seed, char, ip, t0) VALUES (?, ?, ?, ?, ?)`, id, body.seed, body.char, ip, now);
      return json({ id });
    }

    if (url.pathname === '/api/score') {
      const run = typeof body.id === 'string' ? this.sql.exec(`SELECT * FROM runs WHERE id = ?`, body.id).toArray()[0] : null;
      if (!run) return json({ error: 'no run' }, 404);
      if (run.used) return json({ error: 'already' }, 409);
      const days = Math.floor(Number(body.days));
      if (!(days >= 1 && days <= 500)) return json({ error: 'days' }, 400);
      if (now - run.t0 < days * MIN_MS_PER_DAY) return json({ error: 'too fast' }, 400);
      if (body.char !== run.char) return json({ error: 'char' }, 400);
      const endt = ENDS.includes(body.end) ? body.end : 'broke';
      const rents = Math.max(0, Math.min(Math.floor(days / 30), Math.floor(Number(body.rents) || 0)));
      const name = cleanName(body.name);
      const lk = body.look && typeof body.look === 'object' ? body.look : {};
      const hex = (v) => (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : null);
      const look = JSON.stringify({ h: hex(lk.h), sh: hex(lk.sh), l: !!lk.l, g: !!lk.g });
      const who = String(body.who || '').normalize('NFC').replace(/[^0-9가-힣 ]/g, '').trim().slice(0, 12) || null;
      this.sql.exec(`UPDATE runs SET used = 1 WHERE id = ?`, run.id);
      this.sql.exec(`INSERT INTO scores (id, seed, name, char, who, look, days, endt, rents, t) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, run.id, run.seed, name, run.char, who, look, days, endt, rents, now);
      const better = this.sql.exec(`SELECT COUNT(*) AS n FROM scores WHERE seed = ? AND (days > ? OR (days = ? AND rents > ?))`, run.seed, days, days, rents).one().n;
      const b = this.board(run.seed);
      return json({ id: run.id, name, rank: better + 1, total: b.total, board: b });
    }

    return json({ error: 'not found' }, 404);
  }
}

// ---------------- 기록 집계 ----------------
function q(arr, p) { if (!arr.length) return null; const a = [...arr].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(p * a.length))]; }
function avg(arr) { return arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null; }
Board.prototype.stats = function (since, mode) {
  const rows = this.sql.exec(`SELECT t, mode, char, days, endt, body FROM runlogs WHERE t >= ? ${mode ? 'AND mode = ?' : ''} ORDER BY t DESC LIMIT 1500`, ...(mode ? [since, mode] : [since])).toArray();
  const runs = [];
  for (const r of rows) { try { runs.push({ ...JSON.parse(r.body), t: r.t, mode: r.mode, char: r.char, days: r.days, end: r.endt }); } catch (_) {} }
  const CH = ['grad', 'mom', 'boss'];
  const by = (f) => Object.fromEntries(['all', ...CH].map((k) => [k, f(k === 'all' ? runs : runs.filter((r) => r.char === k))]));
  const summary = by((rs) => {
    const d = rs.map((r) => r.days);
    const ends = {}; rs.forEach((r) => (ends[r.end] = (ends[r.end] || 0) + 1));
    return { n: rs.length, avg: avg(d), p10: q(d, 0.1), med: q(d, 0.5), p90: q(d, 0.9), max: d.length ? Math.max(...d) : null, ends,
      rents: avg(rs.map((r) => r.rents || 0)), ukka: avg(rs.map((r) => r.ukka || 0)), rerolls: avg(rs.map((r) => r.rerolls || 0)), prem: avg(rs.map((r) => r.prem || 0)) };
  });
  const maxDay = Math.min(150, Math.max(30, ...runs.map((r) => r.days)));
  const survival = by((rs) => { const out = []; for (let d = 1; d <= maxDay; d++) out.push(rs.length ? Math.round((rs.filter((r) => r.days >= d).length / rs.length) * 1000) / 10 : null); return out; });
  const curves = by((rs) => {
    const sum = { bal: [], hp: [], mp: [] }, cnt = [];
    for (const r of rs) for (const x of r.daysLog || []) {
      const d = x[0]; if (d < 1 || d > maxDay) continue;
      cnt[d] = (cnt[d] || 0) + 1; sum.bal[d] = (sum.bal[d] || 0) + x[2]; sum.hp[d] = (sum.hp[d] || 0) + x[3]; sum.mp[d] = (sum.mp[d] || 0) + x[4];
    }
    const out = { bal: [], hp: [], mp: [] };
    for (let d = 1; d <= maxDay; d++) {
      const n = cnt[d] || 0;
      out.bal.push(n >= 3 ? Math.round(sum.bal[d] / n) : null); out.hp.push(n >= 3 ? Math.round((sum.hp[d] / n) * 10) / 10 : null); out.mp.push(n >= 3 ? Math.round((sum.mp[d] / n) * 10) / 10 : null);
    }
    return out;
  });
  // 이벤트별 선택: 고른 횟수, 그 판의 평균 버틴 날, 사흘 안에 끝난 비율
  const ev = {};
  for (const r of runs) for (const p of r.picks || []) {
    const [day, id, i, pick, won, ok, night, u] = p; const e = (ev[id] = ev[id] || { id, label: p[9] || id, ukka: !!u, night: !!night, n: 0, choices: {} });
    e.n++; const c = (e.choices[pick] = e.choices[pick] || { n: 0, days: 0, diedSoon: 0, ok: 0, rolled: 0, won: 0 });
    c.n++; c.days += r.days; c.won += won || 0; if (r.days - day <= 3) c.diedSoon++; if (ok !== null && ok !== undefined) { c.rolled++; if (ok) c.ok++; }
  }
  const events = Object.values(ev).sort((a, b) => b.n - a.n).map((e) => ({ id: e.id, label: e.label, ukka: e.ukka, night: e.night, n: e.n,
    choices: Object.entries(e.choices).map(([t, c]) => ({ t, n: c.n, share: Math.round((c.n / e.n) * 100), avgDays: Math.round((c.days / c.n) * 10) / 10, diedSoon: Math.round((c.diedSoon / c.n) * 100), okRate: c.rolled ? Math.round((c.ok / c.rolled) * 100) : null, avgWon: Math.round(c.won / c.n) })).sort((a, b) => b.n - a.n) }));
  const lastEv = {}; runs.forEach((r) => { const p = (r.picks || []).slice(-1)[0]; if (p) { const k = p[9] || p[1]; lastEv[k] = (lastEv[k] || 0) + 1; } });
  const acts = {}; runs.forEach((r) => (r.acts || []).forEach(([d, a]) => { const k = String(a).split(':')[0]; acts[k] = (acts[k] || 0) + 1; }));
  const traits = {}; runs.forEach((r) => ((r.person && r.person.traits) || []).forEach((tr) => { (traits[tr] = traits[tr] || []).push(r.days); }));
  return { at: Date.now(), n: runs.length, summary, survival, curves, events: events.slice(0, 120),
    lastEvents: Object.entries(lastEv).sort((a, b) => b[1] - a[1]).slice(0, 15),
    acts: Object.entries(acts).sort((a, b) => b[1] - a[1]).map(([k, n]) => [k, Math.round((n / Math.max(1, runs.length)) * 10) / 10]),
    traits: Object.entries(traits).map(([k, d]) => [k, d.length, avg(d)]).sort((a, b) => b[2] - a[2]),
    recent: runs.slice(0, 30).map((r) => ({ t: r.t, char: r.char, mode: r.mode, days: r.days, end: r.end, rents: r.rents, ukka: r.ukka, age: r.person && r.person.age, title: r.person && r.person.title, traits: r.person && r.person.traits })) };
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}
function withCors(res, origin) {
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', origin);
  h.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'content-type');
  h.set('Access-Control-Max-Age', '86400');
  h.set('Vary', 'Origin');
  return new Response(res.body, { status: res.status, headers: h });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const origin = request.headers.get('Origin') || '';
      if (!ALLOWED.test(origin)) return new Response('Forbidden', { status: 403 });
      if (request.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }), origin);
      if (request.method !== (['/api/board', '/api/stats'].includes(url.pathname) ? 'GET' : 'POST')) return withCors(json({ error: 'method' }, 405), origin);
      const stub = env.BOARD.get(env.BOARD.idFromName('global'));
      return withCors(await stub.fetch(request), origin);
    }
    if (url.pathname !== '/ws') return new Response('wolseday live', { status: 200 });
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('WebSocket only', { status: 426 });
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED.test(origin)) return new Response('Forbidden', { status: 403 });
    const stub = env.PRESENCE.get(env.PRESENCE.idFromName('global'));
    return stub.fetch(request);
  },
};
