/* ==== murim:cathay-screen — 천하 지도 화면: 눌러서 고르고, 길을 따라 움직이고, 가는 동안 철이 간다 ==== */
let CMOVED=false, CATH=null, CT=null, CSEL=null, CBG=null, CHOME=null, CFR=0;
const CATHSPEC={cathay:1,key:'cathay'};
const TYPEN={capital:'도성',city:'성',sect:'문파',clan:'세가',den:'소굴',demon:'마도',camp:'천막',home:'고향'};
const cath=()=>CATH||(CATH=buildCathay());
const inCathay=()=>{ if(!m||!m.map) return false; if(m.map.id==='world'){ const h=homeTile(); m.map={id:'cathay',x:h.x,y:h.y,dir:'d'}; } return m.map.id==='cathay'&&!m.train; };
const regId=()=>m.b.reg==='jiangnan'?'jiangsu':m.b.reg;
const roadish=(x,y)=>{ const g=cath().g[y]&&cath().g[y][x]; return g==='='||g==='B'; };
/* 고향 마을: 태어난 지역의 성에서 길을 따라 조금 떨어진 곳 */
function homeTile(){ if(CHOME&&CHOME.b===m.b) return CHOME; const M=cath(), rid=regId(), o=OR(m.b.o)||{}, own=o.site&&M.spots.find(s=>s.id===o.site), ss=M.spots.filter(s=>s.reg===rid), base=own||ss.find(s=>s.type==='city'||s.type==='capital')||ss[0]||M.spots[0]; let best=null;
  const wants=own?[3,4,2,5,1]:[5+seedOf(m.name||'x')%3,5,4,3,2,1], gap=own?2:3;
  for(const want of wants){ if(best) break; const q=[[base.x,base.y,0]], seen=new Set([base.x+','+base.y]);
    while(q.length&&!best){ const [x,y,d]=q.shift(); if(d===want){ if(!M.spots.some(s=>Math.abs(s.x-x)+Math.abs(s.y-y)<Math.min(gap,want))) best=[x,y]; continue; } for(const v of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+v[0], ny=y+v[1], k=nx+','+ny; if(!seen.has(k)&&roadish(nx,ny)){ seen.add(k); q.push([nx,ny,d+1]); } } } }
  if(!best) best=[base.x,base.y]; CHOME={b:m.b,id:'home',n:homeName(),x:best[0],y:best[1],type:'home',reg:rid}; return CHOME; }
const cSites=()=>cath().spots.concat([homeTile()]);
const site=id=>id==='home'?homeTile():cath().spots.find(s=>s.id===id);
const siteName=id=>{ const s=site(id); return s?s.n:'어딘가'; };
const curSite=()=>{ const h=homeTile(); if(h.x===m.map.x&&h.y===m.map.y) return h; return cath().spots.find(s=>s.x===m.map.x&&s.y===m.map.y)||null; };
const regName=s=>{ const r=CREG.find(r=>r[0]===s.reg); return r?r[1]:''; };
function roadPath(a,b){ const key=(x,y)=>x+','+y, prev=new Map([[key(a[0],a[1]),null]]), q=[a];
  while(q.length){ const [x,y]=q.shift(); if(x===b[0]&&y===b[1]){ const out=[]; let k=key(x,y); while(prev.get(k)){ const [px,py]=k.split(',').map(Number); out.unshift([px,py]); k=prev.get(k); } return out; }
    for(const v of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+v[0], ny=y+v[1], k=key(nx,ny); if(!prev.has(k)&&roadish(nx,ny)){ prev.set(k,key(x,y)); q.push([nx,ny]); } } } return null; }
const cathCost=n=>Math.max(1,Math.round(n/14));
const nearSites=(n)=>{ const x=m.map.x, y=m.map.y; return cSites().filter(s=>!(s.x===x&&s.y===y)).map(s=>({s,d:Math.abs(s.x-x)+Math.abs(s.y-y)})).sort((a,b)=>a.d-b.d).slice(0,n).map(o=>o.s); };
function markSite(group){ const x=m.map&&m.map.id==='cathay'?m.map.x:homeTile().x, y=m.map&&m.map.id==='cathay'?m.map.y:homeTile().y;
  const c=cath().spots.filter(s=>(group==='city')===(s.type==='city'||s.type==='capital')).map(s=>({s,d:Math.abs(s.x-x)+Math.abs(s.y-y)})).filter(o=>o.d>0&&o.d<34).sort((a,b)=>a.d-b.d).slice(0,3); return c.length?pick(c).s.id:null; }
/* ---- 길 떠나기 ---- */
function cathGo(id){ const s=site(id); if(!s||!mapMode()) return false; const p=roadPath([m.map.x,m.map.y],[s.x,s.y]); if(!p||!p.length) return false; CT={to:id,path:p,i:0,f:0,n:0,ticks:0}; CSEL=null; MSHOP=null; sfx('ok'); render(); return true; }
function travelTick(t){ t.ticks++; questTick(); const was=m.sea; m.hp=cl(m.hp-(m.age>=60?1.5:.5)); if(m.gold>=1) gold(-1); m.wldN=(m.wldN||0)+1; m.sea++; if(m.sea>3){ m.sea=0; yearTurn(); }
  if(!m.headless) toast(`길 위에서 ${SEAN[was]}이 갔다`,'',1500);
  if(!m.dead&&!m.pending&&!m.train&&R()<.12){ const bgs=WPOOL.pass, pool=Object.values(EV).filter(e=>!e.wld&&e.min!==e.max&&evOK(e)&&evFresh(e)&&markable(e)&&!(m.mark&&m.mark.id===e.id)&&bgs.includes(evBg(e))); if(pool.length&&startEv(wpick(pool,x=>x.w||1))) m.wevN=(m.wevN||0)+1; }
  render(); save(); }
function cathArrive(){ const s=curSite(); if(s&&m.mark&&m.mark.w===s.id){ const ev=EV[m.mark.id]; m.mark=null; startEv(ev); } sfx('ok'); render(); save(); }
function cathayLoop(dt){ CFR+=dt; if(CT&&!paused){ CT.f+=dt*(m.auto?SPD[spd]:1)*.011;
    while(CT&&CT.f>=1){ CT.f-=1; const p=CT.path[CT.i++], dx=p[0]-m.map.x, dy=p[1]-m.map.y; m.map.dir=dx>0?'r':dx<0?'l':dy>0?'d':'u'; m.map.x=p[0]; m.map.y=p[1]; CT.n++;
      if(CT.i>=CT.path.length){ const t=CT; CT=null; if(!t.ticks) travelTick(t); if(!m.dead) cathArrive(); break; }
      if(CT.n%14===0){ travelTick(CT); if(m.dead||!mapMode()) break; } } }
  cathHero(); if(!CT&&m.auto&&!paused&&mapMode()) cathayAuto(); }
/* ---- 닿은 곳에서 하는 일 ---- */
const CHINT={home:'나고 자란 마을이다.',capital:'황궁이 있는 도성이다. 사람도, 눈도 많다.',city:'장터와 객잔, 표국이 모여 있는 큰 고을이다.',sect:'산문 너머로 기합 소리가 들린다.',clan:'높은 담장 안에 한 가문이 대를 이어 산다.',den:'관의 손이 닿지 않는 소굴이다. 조심해야 한다.',demon:'검붉은 깃발이 걸려 있다. 오래 머물 곳이 아니다.',camp:'천막과 말 떼가 보인다.'};
function cathActs(){ const s=curSite(), acts=[]; if(!s||CT) return acts; const add=(t,sub,fn,free,w)=>acts.push({t,s:sub,fn,free,w:w==null?1:w}), S=(fid,opt)=>()=>doSeason(fid,opt), mar=m.f.martial, t=s.type;
  if(m.quest&&!m.quest.step&&s.id===m.quest.to) add('임무: '+QT[m.quest.k].act,QT[m.quest.k].n(m.quest),S('quest'),0,9);
  if(t==='home'){ add('마을로 들어간다','',enterVillage,1); return acts; }
  if(t==='city'||t==='capital'){ add(mar&&m.lv>=2?'표국 일을 맡는다':'짐꾼 일을 한다','은자를 번다',S('wwork'),0,2); if(mar) add('비무대에 오른다','비무 · 이기면 판돈과 이름을 얻는다',S('wev',{ev:'wSpar'}),0,1.2); if(m.gold>=3) add('객잔에서 소문을 듣는다','3냥 · 일이 생길 수 있다',S('rumor'),0,.6); add('저잣거리를 돌아본다','무슨 일이 생길지 모른다',S('explore',{pl:'city'}),0,.8);
    add('물건을 본다','',()=>{ MSHOP=MSHOP?null:'city'; render(); },1); if(m.hp<80&&m.gold>=12) add('의원에게 진맥을 받는다','12냥 · 건강 +18',()=>{ gold(-12); m.hp=cl(m.hp+18); sfx('ok'); render(); save(); },1); return acts; }
  const own=!!(s.sect&&m.sect===s.sect);
  if(own){ if(m.quest&&m.quest.step) add('임무를 보고한다',m.quest.fail?'실패를 고한다':'공헌과 상을 받는다',questReport,1); else if(!m.quest) add('임무를 받는다','사문의 일을 맡아 공헌을 쌓는다',questTake,1);
    add(t==='clan'?'가문에 문안을 드린다':t==='demon'?'교에 문안을 드린다':t==='den'?'채에 얼굴을 비춘다':'사문에 문안을 드린다','인연이 오르고 가르침을 받는다',S('wvisit'),0,1); add('연무장에서 수련한다','무공이 는다',S('train'),0,2); }
  else if(t==='sect'&&joinable(s)&&!m.sect&&m.age<30&&sectOpen()) add('입문을 청한다','시험을 본다 · 스무 살 전이면 삼 년 수련기를 보낸다',S('wev',{ev:'wExam'}),0,m.age<20?.08:0);
  if(t==='den'&&!own) add('소굴로 쳐들어간다','생사결이 될 수 있다 · 이기면 전리품',S('wev',{ev:'wBandit'}),0,mar&&m.lv>=3&&m.hp>70?.4:0);
  if(mar) add('근처 산에서 수련한다','내공이 더 붙는다',S('train',{fall:1}),0,2);
  add('약초를 캔다','은자를 번다 · 다칠 수 있다',S('herb'),0,mar?.3:1);
  add('주변을 살핀다','무슨 일이 생길지 모른다',S('explore',{pl:t==='den'?'pass':t==='demon'?'tomb':'deep'}),0,.6);
  add('옛 자취를 찾는다','무슨 일이 생길지 모른다',S('explore',{pl:'tomb'}),0,.3);
  return acts; }
function cathHint(s){ if(s.sect&&m.sect===s.sect) return '내가 속한 곳이다. 문 안에서 익숙한 소리가 들린다.'; if(s.type==='sect'&&!(s.sect&&m.sect===s.sect)){ if(!joinable(s)) return '산문은 닫혀 있다. 아직 바깥사람을 들이지 않는다.'; if(m.sect) return '다른 문파의 산문이다.'; if(!sectOpen()) return `${s.n}는 ${SECTS[s.sect].male?'사내':'여인'}만 받는다.`; if(m.age>=30) return '제자로 들어가기엔 늦었다.'; } return CHINT[s.type]||''; }
function cathayAuto(){ const s=curSite();
  if(m.quest){ const me=mySite(), tgt=m.quest.step?(me&&me.id):m.quest.to; if(tgt){ if(s&&s.id===tgt){ if(m.quest.step) questReport(); else doSeason('quest'); return; } if(R()<.85&&cathGo(tgt)) return; } }
  else if(s&&s.sect&&m.sect===s.sect&&R()<.5){ questTake(); if(m.quest) return; }
  if(m.mark&&!m.mark.skip){ if(R()<.8){ if(m.mark.w){ if(cathGo(m.mark.w)) return; } else { if(s&&s.id==='home'){ enterVillage(); return; } if(cathGo('home')) return; } } m.mark.skip=1; }
  if(!s){ if(!cathGo('home')){ const h=homeTile(); m.map.x=h.x; m.map.y=h.y; render(); } return; }
  if(s.id==='home'){ if(R()<(m.f.martial?.5:.8)){ enterVillage(); return; } }
  else if(m.hp<45||R()<(m.f.martial?.1:.45)){ if(cathGo('home')) return; }
  const acts=cathActs().filter(a=>!a.free&&a.w>0);
  if(acts.length&&R()<.75){ wpick(acts,a=>a.w).fn(); return; }
  if(m.sect&&!m.quest&&mySite()&&s.id!==mySite().id&&R()<.4&&cathGo(mySite().id)) return;
  const near=nearSites(4).filter(x=>x.id!=='home'); if(near.length&&cathGo(pick(near).id)) return; if(acts.length) wpick(acts,a=>a.w).fn(); else doSeason('idle'); }
/* ---- 화면 ---- */
function cathBg(sea){ if(CBG&&CBG.sea===sea&&CBG.ver===SKINVER) return; const M=cath(), el=$m('mhCbg'), o=el.getContext('2d'), sc=el.width/(M.w*TS); o.imageSmoothingEnabled=true;
  const gc=drawGround(M,sea); o.drawImage(gc,0,0,el.width,el.height);
  const list=M.objs.map(ob=>({y:(ob.y+ob.h)*TS,ob})).sort((a,b)=>a.y-b.y);
  for(const it of list){ const ob=it.ob, d=OBJ[ob.k], s=objSprite(ob,sea,0), bx=(ob.x+ob.w/2)*TS, by=(ob.y+ob.h)*TS; if(ob.k==='house') o.drawImage(s,(bx-s.width/2)*sc,(by-s.height)*sc,s.width*sc,s.height*sc); else o.drawImage(s,(bx-d.ax)*sc,(by-d.ay-4)*sc,s.width*sc,s.height*sc); }
  M._gc=null; M._gk=null; CBG={sea,ver:SKINVER}; }
let SKINVER=0;
function cathayShow(){ const box=cv.parentNode; let el=$m('mhCathay');
  if(!el){ el=document.createElement('div'); el.id='mhCathay'; el.className='mh-cathay'; el.innerHTML='<div class="mh-cw" id="mhCw"><canvas class="bg" id="mhCbg" width="1536" height="1152"></canvas><div id="mhCreg" aria-hidden="true"></div><div id="mhCmk"></div><canvas id="mhChero" class="mh-chero" width="120" height="80" aria-hidden="true"></canvas></div>'; box.insertBefore(el,cv.nextSibling);
    $m('mhCreg').innerHTML=CREG.map(r=>`<span style="left:${r[2]/KW*100}%;top:${r[3]/KH*100}%">${r[1]}</span>`).join('');
    $m('mhCw').addEventListener('click',e=>{ if(CMOVED){ CMOVED=false; return; } if(CT||(m.auto&&!paused)) return; let id=null; const b=e.target.closest('[data-s]');
      if(e.detail===0){ if(b) id=b.dataset.s; }   // 키보드로 누른 단추
      else { const w=$m('mhCw').getBoundingClientRect(), px=e.clientX-w.left, py=e.clientY-w.top; let best=30*30; for(const s of cSites()){ const dx=(s.x+.5)/KW*w.width-px, dy=(s.y+.5)/KH*w.height-py, d=dx*dx+dy*dy; if(d<best){ best=d; id=s.id; } } if(!id&&b) id=b.dataset.s; }
      if(!id) return; const cur=curSite(); CSEL=cur&&cur.id===id?null:id; sfx('tick'); render(); });
    let drag=null; el.addEventListener('pointerdown',e=>{ CMOVED=false; if(e.pointerType==='mouse') drag={x:e.clientX,y:e.clientY,l:el.scrollLeft,t:el.scrollTop}; }); window.addEventListener('pointermove',e=>{ if(drag){ if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>6) CMOVED=true; el.scrollLeft=drag.l-(e.clientX-drag.x); el.scrollTop=drag.t-(e.clientY-drag.y); } }); window.addEventListener('pointerup',()=>{ drag=null; }); }
  const was=el.hidden; el.hidden=false; cv.style.display='none'; const tg=$m('mhTags'); if(tg) tg.textContent='';
  cathBg(m.sea); cathMarkers(); cathHero(); if(was!==false||!cathayShow.seen){ cathayShow.seen=1; cathCenter(); } }
function cathayHide(){ const el=$m('mhCathay'); if(el&&!el.hidden){ el.hidden=true; cv.style.display=''; } }
function cathMarkers(){ const el=$m('mhCmk'); if(!el) return; const cur=curSite(), qid=m.quest?(m.quest.step?(mySite()||{}).id:m.quest.to):null;
  el.innerHTML=cSites().map(s=>`<button type="button" class="mh-cs t-${s.type}${cur&&cur.id===s.id?' on':''}${CSEL===s.id?' sel':''}" data-s="${s.id}" style="left:${(s.x+.5)/KW*100}%;top:${(s.y+.5)/KH*100}%"><i></i><span>${esc(s.n)}${m.mark&&(m.mark.w===s.id||(!m.mark.w&&s.id==='home'))?' <b class="mh-mk">!</b>':''}${qid===s.id?' <b class="mh-qm">◆</b>':''}</span></button>`).join(''); }
function cathHero(){ const el=$m('mhChero'); if(!el||$m('mhCathay').hidden) return; const walking=!!CT&&!paused, d=m.map.dir||'d', spr=charSprite(heroLook(),walking?'walk':'idle',walking?Math.floor(CFR/130)%4:Math.floor(CFR/500)%2,d==='u'||d==='d'?d:''), g=el.getContext('2d');
  g.clearRect(0,0,el.width,el.height); g.save(); if(d==='l'){ g.translate(el.width,0); g.scale(-1,1); } g.drawImage(spr,0,0,el.width,el.height); g.restore();
  const fx=CT?(m.map.x+.5):m.map.x+.5, fy=m.map.y+.5; el.style.left=fx/KW*100+'%'; el.style.top=fy/KH*100+'%'; if(CT) cathCenter(1); }
function cathCenter(soft){ const el=$m('mhCathay'), w=$m('mhCw'); if(!el||!w) return; const x=(m.map.x+.5)/KW*w.clientWidth-el.clientWidth/2, y=(m.map.y+.5)/KH*w.clientHeight-el.clientHeight/2; if(soft){ el.scrollLeft+=(x-el.scrollLeft)*.2; el.scrollTop+=(y-el.scrollTop)*.2; } else { el.scrollLeft=x; el.scrollTop=y; } }
function renderCathayCard(card,eye){ const s=curSite(), busy=m.auto&&!paused, acts=cathActs();
  const seas=`<div class="mh-seas" aria-label="올해의 철">${SEAN.map((n,i)=>`<span class="${i===m.sea?'on':i<m.sea?'done':''}">${n}</span>`).join('')}</div>`;
  const feed=`<ol class="mh-feed">${m.log.slice(-4).reverse().map(x=>`<li class="${x.big?'big':''}${x.a===m.age?'':' old'}"><span class="a">${x.a}세</span><span>${esc(x.t)}</span></li>`).join('')}</ol>`;
  cathBg(m.sea); cathMarkers();
  if(CT){ const to=site(CT.to), left=CT.path.length-CT.i; card.innerHTML=`${eye}${seas}<div class="mh-dec"><p class="mh-qa">천하 · 길 위</p><h3 class="mh-pl">${esc(to.n)} 가는 길</h3><p class="mh-hint">앞으로 ${cathCost(left)}철쯤 남았다. 걷는 동안에도 철은 간다.</p><button class="mh-btn" type="button" id="mhCstop" ${busy?'disabled':''}>여기서 멈춘다</button></div>${feed}`;
    const st=$m('mhCstop'); if(st) st.onclick=()=>{ CT=null; render(); save(); }; return; }
  const sel=CSEL?site(CSEL):null; let selH='';
  if(sel){ const p=roadPath([m.map.x,m.map.y],[sel.x,sel.y]); selH=p&&p.length?`<div class="mh-cgo"><p><b>${esc(sel.n)}</b><small>${esc(regName(sel))} · ${TYPEN[sel.type]}</small></p><button class="mh-go" type="button" id="mhCgo" ${busy?'disabled':''}>길을 떠난다 · ${cathCost(p.length)}철</button></div>`:`<div class="mh-cgo"><p><b>${esc(sel.n)}</b><small>갈 수 있는 길이 없다</small></p></div>`; }
  const mkT=m.mark?(m.mark.w?siteName(m.mark.w):'고향 마을')+'에 무슨 일이 있다':'';
  const ah=acts.length?`<div class="mh-chs">${acts.map((c,i)=>`<button class="mh-ch" type="button" data-ma="${i}" ${busy?'disabled':''}><span><span class="k" aria-hidden="true">${i+1}</span><span>${esc(c.t)}${c.s?`<small>${esc(c.s)}</small>`:''}</span></span><span class="odds">${c.free?'':'한 철'}</span></button>`).join('')}</div>`:'';
  const shop=MSHOP?`<div class="mh-shop"><p class="mh-qa">파는 물건 · 가진 돈 ${fmt(m.gold)}냥</p>${shopList(MSHOP).map((x,i)=>`<button class="mh-ch" type="button" data-buy="${i}" ${m.gold<x.pr?'disabled':''}><span><span>${icImg(itIcon(x.id),'sm')} ${esc(ITEMS[x.id].n)}<small>${esc(itDesc(ITEMS[x.id]))}</small></span></span><span class="odds">${x.pr}냥</span></button>`).join('')}</div>`:'';
  const near=`<div class="mh-places"><span class="mh-lab">가까운 곳</span>${nearSites(6).map(x=>`<button type="button" class="mh-btn${CSEL===x.id?' on':''}" data-cs="${x.id}" ${busy?'disabled':''}>${esc(x.n)}</button>`).join('')}</div>`;
  card.innerHTML=`${eye}${seas}<div class="mh-dec"><p class="mh-qa">천하${s?' · '+esc(regName(s)):''}${mkT?` · <span class="mh-mk">${esc(mkT)}</span>`:''}</p><h3 class="mh-pl">${esc(s?s.n:'길 위')}</h3><p class="mh-hint">${esc(s?cathHint(s):'길 한가운데다. 지도에서 갈 곳을 고른다.')}</p>${s&&s.sect&&m.sect===s.sect?`<p class="mh-rank"><b>${srank()}</b> 공헌 ${Math.round(m.sc||0)}${(m.qn||0)?` · 마친 임무 ${m.qn}`:''}</p>`:''}${m.quest?`<p class="mh-quest"><b class="mh-qm">◆</b> 임무 · ${esc(QT[m.quest.k].n(m.quest))}${m.quest.step?(m.quest.fail?' — 실패했다. 사문에 돌아가 고한다':' — 끝냈다. 사문에 돌아가 보고한다'):''} <small>${m.quest.due}세까지</small></p>`:''}${ah}${shop}</div>${selH}${near}<p class="mh-hint">지도에서 갈 곳을 누르면 걸리는 철 수가 나온다. 길을 떠나면 가는 동안 철이 간다.</p>${feed}`;
  card.querySelectorAll('[data-ma]').forEach(b=>b.onclick=()=>{ const c=acts[+b.dataset.ma]; if(c) c.fn(); });
  card.querySelectorAll('[data-cs]').forEach(b=>b.onclick=()=>{ CSEL=CSEL===b.dataset.cs?null:b.dataset.cs; cathMarkers(); render(); });
  card.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{ const x=shopList(MSHOP)[+b.dataset.buy]; if(!x||m.gold<x.pr) return; gold(-x.pr); give(x.id,{}); sfx('get'); render(); save(); });
  const go=$m('mhCgo'); if(go) go.onclick=()=>cathGo(CSEL); }
