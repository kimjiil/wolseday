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
    const msg = JSON.stringify({ online: open.length });
    for (const ws of open) {
      try { ws.send(msg); } catch (_) { /* 이미 끊긴 연결 */ }
    }
  }

  async webSocketMessage() { /* 클라이언트가 보내는 내용은 쓰지 않는다 */ }

  async webSocketClose(ws, code) {
    try { ws.close(code === 1005 ? 1000 : code, 'bye'); } catch (_) {}
    await this.scheduleBroadcast();
  }

  async webSocketError() {
    await this.scheduleBroadcast();
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/ws') return new Response('wolseday live', { status: 200 });
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('WebSocket only', { status: 426 });
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED.test(origin)) return new Response('Forbidden', { status: 403 });
    const stub = env.PRESENCE.get(env.PRESENCE.idFromName('global'));
    return stub.fetch(request);
  },
};
