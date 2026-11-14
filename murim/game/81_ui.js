/* ==== murim:ui — 명부, 행낭, 카드 ==== */
const pips=v=>`<span class="mh-pips">${Array.from({length:10},(_,i)=>`<i class="${i<v?'on':''}"></i>`).join('')}</span>`;
const meter=(lab,v,cls)=>`<div class="mh-meter"><span>${cls&&HELP[cls]?hb(cls,lab):lab}</span><span class="mh-bar ${cls||''}"><i style="width:${cl(v)}%"></i></span><span class="mh-num">${Math.round(v)}</span></div>`;
const ptImg=(L,cls)=>`<img class="mh-pt ${cls||''}" src="${portrait(L)}" alt="" width="28" height="28">`;
const diceHtml=d=>d?`<p class="mh-dice">주사위 <b>${d.roll}</b>${d.lo>1?` <small>(천운: ${d.lo}~20에서 나온다)</small>`:''}${d.b?` + 성격 ${d.b}`:''}${d.j?' + 옥패 1':''} · ${d.need} 이상이면 성공 · <b>${d.ok?'성공':'실패'}</b></p>`:'';
function resHtml(lr){ if(m.wait) return '<p class="mh-rolling">주사위가 구른다…</p>'; const rec=lr.pick?`<div class="mh-rec">${lr.q?`<p class="q">${esc(lr.q)}</p>`:''}<p class="p"><span>${lr.auto?'맡김':'고른 길'}</span>${esc(lr.pick)}</p></div>`:''; return `${rec}${diceHtml(lr.dice)}<p class="mh-res ${lr.tone||''}">${esc(lr.t)}</p>`; }
// 신상 칸의 무공 목록: 등급 높은 것부터. 지금 쓰이는 것(가장 센 공격 무공과 가장 높은 보법·안법·외공)에 테를 두른다
let ARTOPEN=false;
function artList(){ const use=combat().art, eye=eyeArt(), st=stepArt(), bd=bodyArt();
  const on=a=>a===use||(a.k==='안법'&&eye>0&&a.p===eye)||(a.k==='보법'&&stepEv(a.p)===st)||(a.k==='외공'&&bd>0&&a.p===bd);
  const rows=m.arts.map(a=>({a,g:artG(a)})).sort((x,y)=>y.g-x.g||artVal(y.a)-artVal(x.a));
  const one=({a,g})=>`<span class="mh-art gr${g}${a.k==='마공'?' m':''}${on(a)?' on':''}">${grTag(g)}<b>${esc(a.n)}</b><small>${esc(artSub(a))} · ${artStat(a)}</small></span>`;
  const top=rows.slice(0,8), rest=rows.slice(8);
  return `<div class="mh-arts">${top.map(one).join('')}</div><p class="mh-helptip">테가 둘린 것이 지금 쓰이는 무공이다. 공격 무공은 든 무기와 합쳐 가장 센 것 하나가 쓰인다.</p>${rest.length?`<details class="mh-artmore" id="mhArtMore" ${ARTOPEN?'open':''}><summary>나머지 ${rest.length}가지</summary><div class="mh-arts">${rest.map(one).join('')}</div></details>`:''}`; }
/* ---- 낱말 설명: 신상 칸에서 점선 밑줄이 그어진 낱말을 누르면 바로 밑에 설명이 펼쳐진다 ---- */
let HELPK=null;
const hb=(k,lab)=>`<button type="button" class="mh-hb" data-help="${k}" aria-expanded="${HELPK===k}">${lab}</button>`;
const helpBox=(k,tag)=>HELPK===k?`<${tag||'p'} class="mh-helpbox">${HELP[k]()}</${tag||'p'}>`:'';
const HELP={
  hp:()=>'0이 되면 죽는다. 난리·역병·흉년·병은 그 자리에서 목숨을 가져가지 않고 건강을 크게 깎는다. 건강이 30 이상이면 한 번의 화로는 죽지 않고, 30 아래에서 또 화를 입으면 죽는다. 몸 나이 예순부터는 노환으로 갈 수 있다. 60 아래면 병이 들 확률이 1.3배, 35 아래면 2.2배다. 40 아래면 수련이 0.6배로 더디다. 결투에서 버티는 체력은 건강에 비례한다. 마흔다섯 전에는 해마다 3씩 돌아오고 그 뒤로는 해마다 조금씩 깎인다. 쉬거나 약을 쓰면 오르고, 50 아래에서는 쉬는 효과가 두 배다.',
  joy:()=>'70 이상이면 수련이 1.1배다. 30 아래면 수련이 0.85배가 되고 병이 들 확률이 1.25배다. 가만두면 해마다 55 쪽으로 조금씩 돌아간다. 한 생이 끝날 때 인생 등급 점수에도 든다.',
  bond:()=>'사람들과 쌓은 정이다. 60 이상이면 가게 값이 1할 싸지고, 사문 임무로 얻는 공헌이 1.25배다. 가족이나 사문 사람들과 지내면 오르고, 가만두면 해마다 40 쪽으로 조금씩 돌아간다.',
  lv:()=>{ if(!m.f.martial) return '아직 무공을 모른다. 무관에 입문하거나 문파에 들거나 비급을 읽으면 무림인이 된다.'; const cur=Math.floor(m.exp+m.ng*.3), nx=LVX[m.lv+1];
    return `경지는 수련과 내공이 함께 올린다. "무공이 는다"는 수련이 쌓인다는 뜻이고, 수련 + 내공 햇수 × 0.3이 문턱을 넘으면 한 단계 오른다. 지금 ${cur}${nx?`, 다음 경지(${LV[m.lv+1]})는 ${nx}부터`:''}다. 경지가 오르면 무위가 크게 오르고 늙어 죽을 확률이 준다.`; },
  ng:()=>'기력이 아니라 쌓은 공력의 햇수다(60년이 1갑자). 햇수 × 0.35만큼 무위에 더해지고, 경지를 올릴 때 햇수의 3할이 쳐진다. 결투를 시작할 때 기가 더 차 있고(햇수 × 0.5, 많아야 +40), 늙어 죽을 확률을 낮춘다(10갑자까지). 폭포나 산에서 수련하면 더 빨리 쌓이고, 심법·영약·기연으로도 는다.',
  gold:()=>'가진 은자와, 강호 사람 가운데 몇째쯤인지. 열다섯 살까지는 집안의 살림으로 친다.',
  sect:()=>`사문의 임무를 마치면 공헌이 쌓인다(임무마다 4~10, 실패하면 −1, 기한을 넘기면 −3). 공헌 12에 이대제자, 30에 일대제자, 60에 장로가 된다. 서열이 오르면 사문 기본 무공의 위력이 2~3 오르고, 장경각에서 익힐 수 있는 무공이 한 등급 높아진다(삼대제자 B, 이대제자 A, 일대제자 S, 장로 SS). 장로는 대전에서 지휘를 맡는다.`,
  st:()=>'근골은 무위(1당 +1.2)와 수련, 품삯에 든다. 오성은 수련(근골보다 조금 더 크게), 내공이 쌓이는 빠르기, 결투에서 낌새를 읽을 확률(1당 +3.5%)에 든다. 기연은 회심(1당 +1%)과 높은 등급 사건이 나올 확률에 든다. 매력은 사람을 상대하는 선택지에 든다. 네 가지 모두 사건 선택지의 성공 확률에 더해진다.',
  pw:()=>'무위 = 경지에 따른 바탕 + 가장 센 무공(위력 + 든 무기의 공격) + 내공 햇수 × 0.35 + 근골 × 1.2. 무기는 무공과 갈래가 맞아야 공격이 다 들어가고, 안 맞으면 절반만 든다. 결투의 체력과 이길 확률이 여기서 나온다.'
};
function wireHelp(el){ el.querySelectorAll('[data-help]').forEach(b=>b.onclick=()=>{ HELPK=HELPK===b.dataset.help?null:b.dataset.help; renderRec(); renderBag(); }); }
function renderRec(){
  const S=m.sect&&SECTS[m.sect], o=OR(m.b.o), fa=m.rels.find(r=>r.role==='아버지'), mo=m.rels.find(r=>r.role==='어머니');
  const kids=m.rels.filter(r=>r.role==='자식'&&!r.dead).length, others=m.rels.filter(r=>!r.dead&&!['아버지','어머니','배우자','자식'].includes(r.role)).slice(-6);
  $m('mhRec').innerHTML=`
    <div class="mh-id">${ptImg(heroLook(),'big')}<div class="mh-name"><b>${esc(m.name)}</b><span>${m.age}세 · ${m.sex==='m'?'남':'여'}${m.dead?' · 고인':''}</span>${m.alias?`<span class="mh-alias">${esc(m.alias)}</span>`:''}</div></div>
    <div class="mh-meters">${meter('건강',m.hp,'hp')}${meter('행복',m.joy,'joy')}${meter('인연',m.bond,'bond')}
      <div class="mh-meter"><span>${hb('lv','무공')}</span><span><span class="mh-ladder" aria-label="경지 ${LV[m.lv]}">${LV.map((_,i)=>`<i class="${!m.f.martial?'':i<m.lv?'on':i===m.lv?'now':''}"></i>`).join('')}</span></span><span class="mh-lvn">${m.f.martial?LV[m.lv]:'모름'}</span></div></div>
    ${helpBox('hp')}${helpBox('joy')}${helpBox('bond')}${helpBox('lv')}
    <dl class="mh-kv">
      <dt>태어난 곳</dt><dd>${esc(ERAS[m.era].n)} · ${esc(regOf(m.b.reg).n)}</dd>
      <dt>집안</dt><dd>${esc(o.n)}${m.b.hidden&&o.hidden?` <small class="mh-red">(${esc(o.hidden)})</small>`:''}</dd>
      <dt>${hb('gold','재산')}</dt><dd><span class="mh-num">${fmt(m.gold)}냥</span> · ${topStr(pctNow())}</dd>${helpBox('gold','dd')}
      ${m.f.martial?`<dt>${hb('ng','내공')}</dt><dd class="mh-num">${ngStr(m.ng)}</dd>${helpBox('ng','dd')}`:''}
      ${S?`<dt>${hb('sect','사문')}</dt><dd>${esc(S.n)} ${m.f.head?'장문인':srank()}${m.f.leader?' · 무림맹주':''}${m.f.tianmo?' · 천마':''} · 공헌 <span class="mh-num">${Math.round(m.sc||0)}</span>${scNext()}</dd>${helpBox('sect','dd')}`:m.f.leader?'<dt>지위</dt><dd>무림맹주</dd>':''}
      ${m.wins||m.losses?`<dt>싸움</dt><dd class="mh-num">${m.wins||0}승 ${m.losses||0}패${m.kills?` · 벤 사람 ${m.kills}`:''}</dd>`:''}
      <dt>가족</dt><dd>아버지 ${fa.dead?'<s>':''}${esc(fa.name)}${fa.dead?'</s>':''} · 어머니 ${mo.dead?'<s>':''}${esc(mo.name)}${mo.dead?'</s>':''}${m.sib?` · 형제 ${m.sib}`:''}${m.spouse&&!m.spouse.dead?` · 배우자 ${esc(m.spouse.name)}`:''}${kids?` · 자식 ${kids}`:''}</dd>
    </dl>
    ${m.arts.length?`<div><h4>무공<small>${m.arts.length}가지</small></h4>${artList()}</div>`:''}
    ${others.length?`<div><h4>인연</h4><div class="mh-rels">${others.map(r=>`<span class="mh-relc${r.role==='원수'?' m':''}">${ptImg(relLook(r))}<span><small>${esc(r.role)}</small>${esc(r.name)}</span></span>`).join('')}</div></div>`:''}
    <dl class="mh-kv"><dt>성격</dt><dd>${perTags().join(' · ')||'아직 뚜렷하지 않다'}</dd><dt>${hb('st','타고난 것')}</dt><dd>근골 ${ST('body')} · 오성 ${ST('wit')} · 기연 ${ST('luck')} · 매력 ${ST('charm')}${m.b.trait?` · <span class="mh-red">${TR(m.b.trait).n}</span>`:''}${m.f.deaf?' · <span class="mh-red">한쪽 귀를 잃음</span>':''}</dd>${helpBox('st','dd')}</dl>
    <p class="mh-helptip">점선이 그어진 낱말을 누르면 설명이 나온다.</p>`;
  wireHelp($m('mhRec'));
  $m('mhChron').innerHTML=m.log.slice().reverse().slice(0,160).map(x=>`<li class="${x.big?'big':''}"><span class="a">${x.a}세</span><span>${esc(x.t)}</span></li>`).join('');
  const am=$m('mhArtMore'); if(am) am.ontoggle=()=>{ ARTOPEN=am.open; };
}
function renderBag(){ const el=$m('mhBag'); if(!el) return; if(!m||!m.inv||m.phase==='end'){ el.hidden=true; return; } el.hidden=false;
  const dl=id=>{ const d=eqDelta(id); if(!d) return ''; const v=Math.round(d.v*10)/10; return ` <b class="mh-dl ${v>0?'up':v<0?'dn':''}">차면 ${d.k} ${v>0?'+':v<0?'−':'±'}${Math.abs(v)}${d.art&&v!==0?` (${esc(d.art.n)})`:''}</b>`; };
  const inv=m.inv, lock=!!DUEL||m.dead, slot=(s,lab)=>{ const id=inv[s], it=id&&ITEMS[id]; return `<div class="mh-slot${it?' gr'+it.t:''}">${icImg(it?itIcon(id):iconUrl('empty',0))}<span><small>${lab}${it?` ${grTag(it.t)}`:''}</small><b>${it?esc(it.n):'없음'}</b>${it?`<em>${esc(itDesc(it))}${s==='w'&&wMatch()?` · <i class="mh-wm">${esc(wMatch())}</i>`:''}</em>`:''}</span></div>`; };
  const b=inv.bag, cons=Object.keys(b).filter(k=>b[k]>0&&ITEMS[k]&&!ITEMS[k].lore).sort((x,y)=>ITEMS[y].t-ITEMS[x].t).map(k=>{ const it=ITEMS[k], u=k==='salve'||k==='pill'||it.use; return `<span class="mh-con" title="${esc(itDesc(it))}">${icImg(itIcon(k),'sm')}${esc(it.n)} ×${b[k]}${it.t>=1?` ${grTag(it.t)}`:''}${it.use?` <small>${esc(it.book?it.d:useText(it.use))}</small>`:''}${u&&!lock&&(k!=='salve'||m.hp<100)?` <button class="mh-btn sm" type="button" data-use="${esc(k)}">${it.book?'읽기':'쓰기'}</button>`:''}</span>`; }).join('')+(inv.mat>0?`<span class="mh-con">${icImg(itIcon('ore'),'sm')}천외운철 ×${inv.mat}</span>`:'');
  const rare=Object.keys(b).filter(k=>b[k]>0&&ITEMS[k]&&ITEMS[k].lore).map(k=>{ const it=ITEMS[k]; return `<div class="mh-sti mh-rare gr${it.t}">${icImg(itIcon(k))}<span><b>${esc(it.n)} ×${b[k]}</b><small>${grTag(it.t)} ${esc(it.d)}</small><em>${esc(it.lore)}</em></span>${lock?'':`<button class="mh-btn sm" type="button" data-use="${k}">마시기</button>`}</div>`; }).join('');
  el.innerHTML=`<h4>행낭<small>${hb('pw','무위')} ${Math.round(power())}</small></h4>${helpBox('pw')}
    <div class="mh-eq">${SLOTS.map(s=>slot(s,SLOTN[s])).join('')}</div>
    ${inv.stash.length?`<div class="mh-stash">${inv.stash.map((id,i)=>{ const it=ITEMS[id]; return `<div class="mh-sti gr${it.t}">${icImg(itIcon(id),'sm')}<span><b>${esc(it.n)}</b><small>${SLOTN[it.s]} ${grTag(it.t)} ${esc(itDesc(it))}${dl(id)}</small></span>${lock?'':`<button class="mh-btn sm" type="button" data-eq="${i}">차기</button><button class="mh-btn sm" type="button" data-sell="${i}">${Math.round(it.v*.5)}냥에 팔기</button>`}</div>`; }).join('')}</div>`:''}
    ${rare}${cons?`<div class="mh-cons">${cons}</div>`:''}${(m.f.medN||0)>=1?`<p class="mh-tol">내공 약을 여러 번 먹어 약효가 ${Math.round(medTol()*100)}%만 듣는다. 건강 회복은 그대로다.</p>`:''}`;
  wireHelp(el);
  el.querySelectorAll('[data-eq]').forEach(x=>x.onclick=()=>{ equipAt(+x.dataset.eq); render(); save(); });
  el.querySelectorAll('[data-sell]').forEach(x=>x.onclick=()=>{ sellAt(+x.dataset.sell); render(); save(); });
  el.querySelectorAll('[data-use]').forEach(x=>x.onclick=()=>{ useBag(x.dataset.use); render(); save(); });
}
function chBtn(c,i){ let odds='';
  if(c.war) odds=`<span class="odds duel">${icImg(iconUrl('armor',2),'sm')}지휘전</span>`;
  else if(c.duel){ const h=duelHint(c); odds=`<span class="odds duel ${h.cls}">${icImg(iconUrl('sword',h.lethal?2:1),'sm')}${h.lethal?'생사결':'비무'} · ${h.lab}</span>`; }
  else if(c.p){ const need=diceNeed(cl(c.p(),.03,.97)), b=perBonus(c.t).b+(hasFx('dice')?1:0); odds=`<span class="odds">${icImg(iconUrl('dice',0),'sm')}${need}+${b?` · 보정 +${b}`:''}${hasT('star')?` · 천운 ${DICELO()}~20`:''}</span>`; }
  return `<button class="mh-ch" type="button" data-i="${i}" ${m.wait||(m.auto&&!paused)?'disabled':''}><span><span class="k" aria-hidden="true">${i+1}</span><span>${esc(c.t)}${c.s?`<small>${esc(c.s)}</small>`:''}</span></span>${odds}</button>`; }
// 좁은 화면에서 장면 밑에 붙어 다니는 한 줄 신상. 누르면 신상 칸으로 내려간다
function renderMini(playing){ const el=$m('mhMini'); if(!el) return; const show=playing&&m.phase==='play'; el.hidden=!show; if(!show) return;
  el.innerHTML=`<span class="${m.hp<30?'low':''}"><i>건강</i><b>${Math.round(m.hp)}</b></span><span><i>행복</i><b>${Math.round(m.joy)}</b></span><span><b>${fmt(m.gold)}</b><i>냥</i></span>${m.f.martial?`<span><i>내공</i><b>${esc(ngStr(m.ng))}</b></span>`:''}<span class="go">신상 ▾</span>`;
  el.setAttribute('aria-label','신상과 행낭으로 내려가기'); el.onclick=()=>{ const r=$m('mhRec'); if(r) r.scrollIntoView({behavior:'smooth',block:'start'}); }; }
function renderCtl(){
  const el=$m('mhCtl'), show=m&&m.phase==='play'&&!DUEL; el.hidden=!show; if(!show) return;
  el.innerHTML=`<button class="mh-btn" type="button" id="mhPause">${paused?'▶ 계속':'❚❚ 멈춤'}</button>
    <span class="mh-spd" role="group" aria-label="속도">${SPD.map((v,i)=>`<button type="button" class="mh-btn" data-spd="${i}" aria-pressed="${spd===i}">${v}배</button>`).join('')}</span>
    <label class="mh-auto"><input type="checkbox" id="mhAuto" ${m.auto?'checked':''}> 맡기기</label>
    <button class="mh-btn mh-snd" type="button" id="mhSnd" aria-pressed="${SND}" aria-label="소리 ${SND?'켜짐':'꺼짐'}">♪ ${SND?'켬':'끔'}</button>`;
  $m('mhPause').onclick=()=>{ paused=!paused; render(); };
  el.querySelectorAll('[data-spd]').forEach(b=>b.onclick=()=>{ spd=+b.dataset.spd; renderCtl(); });
  $m('mhAuto').onchange=e=>{ m.auto=e.target.checked; acc=0; if(m.auto&&DUEL) autoKick(DUEL); render(); save(); };
  $m('mhSnd').onclick=()=>{ SND=!SND; lsSet('murim_snd',SND?1:null); if(SND) sfx('get'); renderCtl(); };
}
function glimpse(age){
  const o=m.others&&m.others[0]; if(!o) return '';
  const where=`같은 순간 ${regOf(o.reg).n}의 ${OR(o.o).n} 집에서 태어난 ${o.name}`;
  if(o.age<age) return `${where}${jo(o.name,'은','는')} ${o.age}세에 세상을 떠났다. ${o.cause==='천수를 누림'?'천수를 누렸다.':'사인은 '+esc(o.cause)+'.'}`;
  const last=o.log.filter(x=>x.a<=age).slice(-1)[0];
  return `${where}${jo(o.name,'은','는')} 지금 ${age}세. ${last?esc(last.t):''}`;
}
function renderPlay(card){
  const eye=`<div class="mh-eye"><span class="mh-age">${m.age}세</span>${m.age>=MAPAGE&&!m.train?`<span>${SEAN[cutNow()?cutNow().sea:m.sea]||''}</span>`:''}<span>${esc(ERAS[m.era].n)} · ${esc(regOf(m.b.reg).n)}</span>${m.alias?`<span class="mh-chip">${esc(m.alias)}</span>`:''}${m.f.martial?`<span class="mh-chip j">${LV[m.lv]}</span>`:''}</div>`;
  if(DUEL) return renderDuel(card,eye);
  if(cutNow()) return renderCut(card,eye);
  if(m.milestone){
    card.innerHTML=`${eye}<div class="mh-q"><p class="mh-qa">${m.milestone}세 · 잠깐 멈춤</p><h2>${esc(MILES[m.milestone])}</h2>
      <label class="mh-lab" for="mhAns">한 줄로 남겨도 되고, 비워 둬도 된다</label><input id="mhAns" type="text" maxlength="60" autocomplete="off">
      <p class="mh-glimpse">${glimpse(m.milestone)}</p><button class="mh-go" type="button" id="mhQgo">계속 산다</button></div>`;
    $m('mhQgo').onclick=()=>{ const v=$m('mhAns').value.trim(); m.answers[m.milestone]=v; if(v) log(`${m.milestone}세의 대답: "${v}"`,true); m.milestone=null; acc=0; render(); save(); };
    $m('mhAns').onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); $m('mhQgo').click(); } };
    return;
  }
  if(mapMode()) return inCathay()?renderCathayCard(card,eye):renderMapCard(card,eye);
  if(m.train) return renderTrain(card,eye);
  const ev=m.pending, mp=m.age>=MAPAGE;
  const dec=ev?`<div class="mh-dec${ev.gi?' gi':''}">${ev.gi?'<span class="mh-gi" aria-hidden="true">奇緣</span>':''}<p class="mh-qa">${gradeBadge(ev)}${ev.epn?`${esc(ev.epn)} · ${ev.epi}`:ev.minor?GNAME[ev.grade]:ev.gi?'기연':'갈림길'}</p>${evArt(ev)}<p class="mh-text">${esc(m.evText)}</p><div class="mh-chs">${choicesOf(ev).map(chBtn).join('')}${lockedOf(ev).map(x=>`<button class="mh-ch lock" type="button" disabled><span><span class="k" aria-hidden="true">×</span><span>${esc(x.t)}<small>은자 ${x.need}냥이 있어야 한다 · 지금 ${fmt(m.gold)}냥</small></span></span></button>`).join('')}</div></div>`:'';
  const last=m.lastRes&&m.lastRes.age===m.age&&!ev?resHtml(m.lastRes):'';
  const feed=m.log.slice(-5).reverse().map(x=>`<li class="${x.big?'big':''}${x.a===m.age?'':' old'}"><span class="a">${x.a}세</span><span>${esc(x.t)}</span></li>`).join('');
  const seg=`<div class="mh-focus"><span class="mh-lab">올해의 중심</span><div class="mh-seg" role="radiogroup" aria-label="올해의 중심">${FOCUS.map(f=>`<button type="button" role="radio" aria-checked="${m.focus===f.id&&m.age>=6}" data-focus="${f.id}" ${m.age<6?'disabled':''}>${f.n}</button>`).join('')}</div><span class="mh-hint">${m.age<6?'아직 어리다. 하루하루가 그냥 흘러간다.':esc((FOCUS.find(f=>f.id===m.focus)||FOCUS[1]).h)}</span></div>`;
  card.innerHTML=ev?`${eye}${dec}`:mp||resWait()?`${eye}${last}<button class="mh-go" type="button" id="mhNext" ${m.wait?'disabled':''}>계속</button><ol class="mh-feed">${feed}</ol>`:`${eye}${last}${seg}<ol class="mh-feed">${feed}</ol>`;
  const nx=$m('mhNext'); if(nx) nx.onclick=()=>{ if(m.wait) return; if(m.lastRes) m.lastRes.seen=1; acc=0; render(); save(); };
  card.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ resolve(+b.dataset.i); if(!DUEL) checkTrain(); acc=0; render(); save(); });
  card.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>{ m.focus=b.dataset.focus; render(); save(); });
}
function optGroup(key,label,opts){ return `<fieldset class="mh-opt"><legend>${label}</legend><div class="mh-seg">${opts.map(([v,t])=>`<button type="button" data-k="${key}" data-v="${v}" aria-pressed="${setup[key]===v}">${t}</button>`).join('')}</div><p class="mh-hint" id="mhHint-${key}"></p></fieldset>`; }
const HINTS={era:{peace:ERAS.peace.d,chaos:ERAS.chaos.d,demon:ERAS.demon.d,any:'세 시대 중 하나에 무작위로 태어난다.'},basis:{births:'이 해에 아이가 많이 태어나는 집일수록 그 집에 태어나기 쉽다. 가난한 집일수록 아이가 많다.',pop:'지금 강호에 살아 있는 사람 수만큼의 확률. 살아남은 사람 쪽으로 조금 기운다.'},pace:{fast:'걷기 전 어린 시절은 한 해가 1.5초에 지나간다.',normal:'걷기 전 어린 시절은 한 해가 3초에 지나간다.',slow:'걷기 전 어린 시절은 한 해가 6초에 지나간다.'}};
// 이미지 스킨: 사건 삽화 ev/<사건 이름표>, 등급 공통 삽화 ev/grade_<등급>
const evArt=ev=>{ const u=skinUrl('ev/'+ev.id,gradeOf(ev)?'ev/grade_'+gradeOf(ev):'-'); return u?`<img class="mh-evimg" src="${esc(u)}" alt="">`:''; };
function renderTitle(card){
  const saved=load(), past=lsGet('murim_past')||[];
  card.innerHTML=`${skinUrl('title')?`<img class="mh-titleimg" src="${esc(skinUrl('title'))}" alt="">`:''}<div class="mh-eye"><span>武林初出</span></div>
    <h2>강호의 어느 해, 누군가로 태어난다.</h2>
    <p>어디서 누구의 아이로 태어날지는 고를 수 없다. 강호 사람 대부분은 무공을 모르는 농사꾼으로 태어나 농사꾼으로 죽는다. 다섯 살부터는 고향 마을을 직접 걸어 다닌다. 걷는 데는 시간이 들지 않고, 무엇을 하든 한 번에 한 계절, 석 달이 간다. 봄부터 겨울까지 네 번이면 한 해다.</p>
    <details class="mh-howd" ${isNarrow()?'':'open'}><summary>어떻게 하나</summary><ul class="mh-how">
      <li>${icImg(iconUrl('dice',0),'sm')}<span><b>마을</b> 집, 일터, 무관, 뒷산 폭포, 장터를 오간다. 어딘가에 느낌표가 뜨면 거기 일이 생긴 것이다. 짙은 수풀을 밟고 지나가면 가끔 무언가를 만난다.</span></li>
      <li>${icImg(iconUrl('dice',0),'sm')}<span><b>천하</b> 열다섯이 넘으면 마을 어귀에서 천하 지도로 나간다. 갈 곳을 누르고 길을 떠나면, 가는 동안에도 계절이 바뀐다. 문파에 들었다면 사문에서 임무를 받아 공헌을 쌓을 수 있고, 가끔은 산문이 습격당한다.</span></li>
      <li>${icImg(iconUrl('sword',1),'sm')}<span><b>결투</b> 강공·수비·변초·절초. 상대의 낌새를 읽고 수를 낸다. 생사결에서 지면 죽을 수 있다.</span></li>
      <li>${icImg(iconUrl('armor',2),'sm')}<span><b>장비</b> 무기·갑옷·머리·신발·장신구. 등급은 C에서 SSR까지. 싸워서 빼앗고, 장터에서 사고, 무덤에서 줍는다.</span></li>
      <li>${icImg(iconUrl('scroll',1),'sm')}<span><b>무공</b> 팔백여 가지, 등급은 C에서 SSR까지. 문파 장경각에서 서열대로 익히고, 비급을 읽어 익히고, 기연으로 얻는다.</span></li>
      <li>${icImg(iconUrl('scroll',2),'sm')}<span><b>기연</b> 절벽 아래 동굴, 별똥 쇳덩이, 죽어 가는 노승. 드물게 온다.</span></li>
      <li>${icImg(iconUrl('jade',1),'sm')}<span><b>수련기</b> 무공을 배우면 사문 경내를 걸으며 삼 년을 보낸다. 동문과 정을 쌓고, 때로는 잃는다.</span></li>
    </ul></details>
    ${optGroup('era','태어날 시대',[['peace','태평성대'],['chaos','정사대전기'],['demon','마교 천하'],['any','아무 시대나']])}
    ${optGroup('basis','태어날 곳을 정하는 기준',[['births','이 해에 태어나는 아이들'],['pop','지금 강호에 사는 사람들']])}
    ${optGroup('pace','어린 시절의 속도',[['fast','빠르게'],['normal','보통'],['slow','느긋하게']])}
    <div class="mh-row">${saved?`<button class="mh-btn" type="button" id="mhResume">이어 살기 · ${esc(saved.name)} ${saved.age}세</button>`:''}<button class="mh-go seal" type="button" id="mhStart">태어나기</button></div>
    ${past.length?`<h3>지난 생</h3><div class="mh-past">${past.slice(0,6).map(p=>`<div><span>${p.g?`<span class="mh-gr g-${esc(p.g)}">${esc(p.g)}</span>`:''}${esc(p.al?p.al+' ':'')}${esc(p.n)} · ${esc(p.reg||'')} ${esc(p.o||'')}</span><span>${p.age}세 · ${esc(p.c)}</span></div>`).join('')}</div>`:''}`;
  const hint=()=>['era','basis','pace'].forEach(k=>{ $m('mhHint-'+k).textContent=HINTS[k][setup[k]]; });
  card.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ setup[b.dataset.k]=b.dataset.v; card.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach(x=>x.setAttribute('aria-pressed',x===b)); hint(); });
  hint();
  $m('mhStart').onclick=()=>{ const era=setup.era==='any'?pick(['peace','chaos','demon']):setup.era; roll=makeBirth(era,setup.basis); m={phase:'birth'}; sfx('gong'); render(); };
  if(saved) $m('mhResume').onclick=()=>{ rehydrate(saved); render(); };
}
function renderBirth(card){
  const b=roll, o=OR(b.o), r=regOf(b.reg), t=b.trait&&TR(b.trait), E0=ERAS[b.era], its=(o.it||[]).concat(Object.keys(o.bag||{}));
  card.innerHTML=`<div class="mh-eye"><span>태어났다</span><span class="mh-chip">${esc(E0.n)}</span></div>
    <div class="mh-birth">
      <b>${esc(b.sur+b.given)}</b>
      <span>${b.sex==='m'?'사내아이':'계집아이'} · ${esc(r.n)} · ${esc(o.n)}</span>
      <p class="mh-odds">이 해 강호에서 태어난 아이 약 ${E0.births} 명. 그중 ${o.region?'':esc(r.n)+'의 '}${esc(famAs(o))}에 태어날 확률은 <b>${pctStr(b.P)}%</b>, 대략 <b>${oneIn(b.P)}명 중 1명</b>이다.</p>
      <dl class="mh-kv">
        <dt>고향</dt><dd>${esc(r.n)} · ${esc(r.d)}</dd>
        <dt>집안</dt><dd>${esc(o.d)}</dd>
        <dt>재산</dt><dd>강호 사람 중 ${topStr(b.pct)}</dd>
        <dt>아버지</dt><dd>${esc(b.father.name)} · ${b.father.dead?'태어나기 전에 세상을 떠났다':b.father.age+'세'}</dd>
        <dt>어머니</dt><dd>${esc(b.mother.name)} · ${b.mother.dead?'낳다가 세상을 떠났다':b.mother.age+'세'}</dd>
        <dt>형제</dt><dd>${b.sib?`${b.sib+1}남매 중 ${b.order}째`:'외동'}</dd>
        ${its.length?`<dt>집안 물건</dt><dd class="mh-its">${its.map(id=>`<span>${icImg(itIcon(id),'sm')}${esc(ITEMS[id].n)}</span>`).join('')}</dd>`:''}
      </dl>
      <div class="mh-stats"><div>근골${pips(b.st.body)}</div><div>오성${pips(b.st.wit)}</div><div>기연${pips(b.st.luck)}</div><div>매력${pips(b.st.charm)}</div></div>
      ${t?`<p class="mh-trait">타고난 체질 · ${esc(t.n)}: ${esc(t.d)}</p>`:''}
    </div>
    <div class="mh-row"><button class="mh-go seal" type="button" id="mhLive">이 삶을 산다</button><button class="mh-btn" type="button" id="mhBack">처음으로</button></div>
    <p class="mh-note">같은 순간, 강호 어딘가에서 다른 아이 넷도 태어났다. 그들의 삶은 끝에서 보게 된다.</p>`;
  $m('mhLive').onclick=()=>{
    const others=[0,1,2,3].map(()=>simulate(makeBirth(b.era,setup.basis)));
    m=fresh(roll); m.others=others; m.pace=setup.pace; m.basis=setup.basis;
    log(`${r.n}의 ${famAs(o)}에서 태어났다`,true);
    if(b.father.dead) log('아버지 얼굴을 모른다',true);
    if(b.mother.dead) log('어머니가 낳다가 세상을 떠났다',true);
    paused=false; acc=0; render(); save();
  };
  $m('mhBack').onclick=()=>{ m=null; render(); };
}
function renderFarewell(card){
  if(m.wait){ card.innerHTML='<p class="mh-rolling">주사위가 구른다…</p>'; return; }
  card.innerHTML=`<div class="mh-eye"><span class="mh-age">${m.age}세</span><span>${esc(m.deathCause)}</span></div>
    <h2>${m.f.ascended?'구름이 발밑에 깔린다.':m.age<10?'너무 일찍 숨이 잦아든다.':'숨이 가늘어진다.'}</h2>
    <p>${esc(m.lastRes&&m.lastRes.age===m.age&&m.lastRes.t&&!m.lastRes.train?m.lastRes.t:m.log[m.log.length-1].t)}</p>
    <label class="mh-lab" for="mhBye">마지막으로 남길 말</label><input id="mhBye" type="text" maxlength="60" autocomplete="off" placeholder="비워 둬도 된다">
    <button class="mh-go seal" type="button" id="mhClose">${m.f.ascended?'손을 흔든다':'눈을 감는다'}</button>`;
  $m('mhClose').onclick=()=>{ m.bye=$m('mhBye').value.trim(); finalize(); };
  $m('mhBye').onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); $m('mhClose').click(); } };
}
function otherCard(o){ const L=npcLook({name:o.name,sex:o.sex,age:o.age,sect:o.sect,robe:o.sect?null:FAMROBE[o.o],weapon:o.martial?'sword':null});
  return `<div class="mh-other"><span class="mh-who">${ptImg(L)}<b>${esc(o.alias?o.alias+' ':'')}${esc(o.name)}</b></span><span>${o.sex==='m'?'남':'여'} · ${esc(regOf(o.reg).n)} · ${esc(OR(o.o).n)}</span><span class="mh-num">${oneIn(o.P)}명 중 1명</span><span>향년 ${o.age}세 · ${esc(o.cause)}</span>${o.martial?`<span>${LV[o.lv]}${o.sect?' · '+esc(SECTS[o.sect].n):''}${o.wins?` · ${o.wins}승`:''}${o.wn?` · ${esc(o.wn)}`:''}</span>`:''}${o.hi?`<span class="mh-hi">${esc(o.hi)}</span>`:''}</div>`;
}
function renderEnd(card){
  const o=OR(m.b.o), big=m.log.filter(x=>x.big), inv=m.inv||{}, gear=SLOTS.map(s=>inv[s]).filter(Boolean), G=lifeScore(), C=lifeCard(), fn=`murim-card-${G.g}-${m.age}.png`;   // 파일 이름은 영문으로(한글 이름이 깨지는 환경이 있다)
  card.innerHTML=`<div class="mh-tomb">
      <div class="mh-lg"><span class="mh-gr g-${G.g}">${G.g}</span><b>${G.title}</b><small>인생 점수 ${G.score} · ${G.line}</small></div>
      ${ptImg(heroLook(),'big')}
      ${m.alias?`<span class="al">${esc(m.alias)}</span>`:''}
      <span class="nm">${esc(m.name)}</span>
      <p>${esc(ERAS[m.era].n)} · ${esc(regOf(m.b.reg).n)} · ${esc(o.n)} · ${oneIn(m.b.P)}명 중 1명</p>
      <p>향년 ${m.age}세 · ${esc(m.deathCause)}</p>
      <p class="mh-bye">"${esc(epitaph())}"</p>
    </div>
    <div class="mh-sum"><div>무공<b>${m.f.martial?LV[m.lv]:'모름'}</b></div><div>재산<b>${topStr(pctNow())}</b></div><div>싸움<b>${m.wins||0}승 ${m.losses||0}패</b></div><div>벤 사람<b>${m.kills||0}명</b></div><div>기연<b>${m.giN||0}번</b></div><div>자식<b>${m.rels.filter(r=>r.role==='자식').length}명</b></div><div>행복<b>${Math.round(m.joy)}</b></div></div>
    <h3>인물 카드</h3>
    <div class="mh-cardbox"><img id="mhCardImg" class="mh-cardimg" src="${C.url}" alt="${esc(m.name)}의 인물 카드. 인생 등급 ${G.g}, ${G.title}">
      <div class="mh-row"><button class="mh-go" type="button" id="mhCardSend" data-label="카드 보내기">카드 보내기</button><button class="mh-btn" type="button" id="mhCardSave">그림 저장</button><button class="mh-btn" type="button" id="mhShare" data-label="글로 복사">글로 복사</button></div>
      <p class="mh-hint">휴대폰에서는 공유 창이 뜨고, PC에서는 그림이 복사된다. 안 되면 그림을 길게 눌러 저장한다.</p>
      <textarea id="mhCopy" readonly hidden aria-label="복사할 기록"></textarea>
      <details class="mh-lgd"><summary>점수 내역</summary><div>${G.parts.map(x=>`<span>${x[0]} <b>+${x[1]}</b></span>`).join('')}<span>모두 <b>${G.score}</b></span></div><p class="mh-hint">${LGRADE.map(x=>`${x[1]} ${x[0]}점부터`).join(' · ')}</p></details></div>
    ${gear.length?`<h3>남긴 물건</h3><div class="mh-eq">${gear.map(id=>{ const it=ITEMS[id]; return `<div class="mh-slot gr${it.t}">${icImg(itIcon(id))}<span><small>${SLOTN[it.s]||''} ${grTag(it.t)}</small><b>${esc(it.n)}</b><em>${esc(itDesc(it))}</em></span></div>`; }).join('')}</div>`:''}
    ${Object.keys(m.answers).length?`<h3>대답들</h3><div class="mh-past">${Object.entries(MILES).filter(([a])=>m.answers[a]!=null).map(([a,q])=>`<div><span>${esc(q)}<br><b>${m.answers[a]?esc(m.answers[a]):'(대답하지 않았다)'}</b></span><span>${a}세</span></div>`).join('')}</div>`:''}
    <h3>같은 순간 태어난 네 사람</h3>
    <div class="mh-others">${m.others.map(otherCard).join('')}</div>
    <h3>인생의 기록</h3>
    <div class="mh-past">${big.map(x=>`<div><span>${esc(x.t)}</span><span>${x.a}세</span></div>`).join('')}</div>
    <div class="mh-row"><button class="mh-go seal" type="button" id="mhAgain">다시 태어나기</button></div>`;
  $m('mhAgain').onclick=()=>{ m=null; render(); };
  $m('mhCardSend').onclick=()=>sendCard($m('mhCardSend'));
  if(!C.f){ C.f=1; cardFonts(()=>{ const N=lifeCard(); N.f=1; const im=$m('mhCardImg'); if(im) im.src=N.url; }); }
  $m('mhCardSave').onclick=()=>saveCard(fn);
  $m('mhShare').onclick=()=>{ const txt=shareText(), btn=$m('mhShare'), ta=$m('mhCopy'); const fb=()=>{ ta.value=txt; ta.hidden=false; ta.select(); btn.textContent='아래 글을 복사하세요'; };
    try{ navigator.clipboard.writeText(txt).then(()=>{ btn.textContent='복사했어요'; setTimeout(()=>btn.textContent=btn.dataset.label,1800); },fb); }catch(e){ fb(); } };
}
function shareText(){
  const o=OR(m.b.o), w=m.inv&&m.inv.w?ITEMS[m.inv.w]:null;
  return `무림초출 · ${m.alias?m.alias+' ':''}${m.name}\n${ERAS[m.era].n} ${regOf(m.b.reg).n}, ${famAs(o)} · ${oneIn(m.b.P)}명 중 1명\n향년 ${m.age}세 · ${m.deathCause}${m.f.martial?` · ${LV[m.lv]}`:''}${m.wins||m.losses?` · ${m.wins||0}승 ${m.losses||0}패`:''}${w&&w.t>=2?` · ${w.n}`:''}\n인생 등급 ${lifeScore().g}(${lifeScore().title}) · ${lifeScore().score}점\n"${epitaph()}"\n같은 순간 태어난 넷: ${m.others.map(x=>`${x.name} ${x.age}세`).join(', ')}\nwolseday.com/#murim`;
}
let RKEY='';
// 좁은 화면에서는 장면이 위에 붙어 있어서, 사건이나 결과가 새로 뜨면 카드 머리가 가려지지 않게 끌어온다
function render(){ render0(); try{ const card=$m('mhCard'), on=m&&m.phase==='play'; if(!card) return;
    const rk=!on?'':m.pending?'e:'+m.pending.id:m.tev?'t:'+String(m.tevText||'').slice(0,12):resWait()?'r:'+String(m.lastRes.t||'').slice(0,12):m.milestone?'m:'+m.milestone:'';
    if(rk&&rk!==RKEY&&isNarrow()){ const a=$m('mhMini').parentNode.getBoundingClientRect(), b=card.getBoundingClientRect();
      if(a.top<=2){ if(b.top<a.bottom-2) window.scrollBy({top:b.top-a.bottom-6,behavior:'smooth'}); }
      else { // 아직 맨 위에 있을 때: 고를 것이 화면 밖으로 넘치면 장면을 화면 맨 위에 붙이고 카드를 바로 밑에 댄다
        const bs=[...card.querySelectorAll('.mh-ch,.mh-go,#mhNext')].filter(x=>x.offsetHeight), l=bs[bs.length-1]; if(l&&l.getBoundingClientRect().bottom>innerHeight-4) window.scrollBy({top:b.top-a.height-6,behavior:'smooth'}); } }
    RKEY=rk; }catch(e){} }
function render0(){
  const card=$m('mhCard'); if(!card) return;
  if(afxOpen()&&!(m&&m.phase==='play')) afxClear();
  const playing=!!(m&&['play','farewell','end'].includes(m.phase));
  $m('mhSide').hidden=!playing; $m('mhGrid').classList.toggle('solo',!playing);
  applyStage(stageFor()); postStage();
  $m('mhCapL').textContent=playing?`${m.name} · ${m.age}세`:m&&m.phase==='birth'?'응애':'무림초출';
  renderCtl(); renderHud(); renderMini(playing);
  if(playing){ renderRec(); renderBag(); }
  if(!m||!m.phase||m.phase==='title') renderTitle(card);
  else if(m.phase==='birth') renderBirth(card);
  else if(m.phase==='farewell') renderFarewell(card);
  else if(m.phase==='end') renderEnd(card);
  else renderPlay(card);
  flushVfx();
}
