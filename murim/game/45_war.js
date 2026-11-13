/* ==== murim:war — 지휘전: 직접 칼을 들지 않고, 사람을 세 갈래에 배치하고 영을 내린다 ====
   결투와 같은 자리(DUEL)에 war:1 을 달고 들어가서, 결투 중에 막히는 것들(지도 걷기, 다음 사건)이 그대로 막힌다.
   규칙: 좌익·중군·우익 세 갈래. 합마다 영(총공격·굳게 지킨다·기습)을 하나 내린다. 적의 영을 맞히면 크게 이긴다.
         적의 중군이 무너지면 이기고, 내 중군이 무너지면 진다. 여섯 합이 지나면 무너뜨린 갈래 수로 가린다. */
const WDMG=27;   // 힘이 같을 때 한 합에 깎이는 기세
const WFRONT=['좌익','중군','우익'], WTER=['산길','대로','강변'], WORD={A:'총공격',G:'굳게 지킨다',F:'기습'}, WMAX=6;
const WORDD={A:'크게 주고 크게 받는다. 기습을 깨뜨린다',G:'덜 주고 덜 받는다. 총공격을 받아넘긴다',F:'지키는 적의 옆구리를 친다'};
const WTELL={A:['적진의 북소리가 빨라진다','적의 깃발이 앞으로 쏠린다','적 선봉이 창을 고쳐 쥔다'],G:['적이 방패를 겹쳐 세운다','적진이 숨을 죽였다','적이 참호를 판다'],F:['적 진영 뒤로 먼지가 인다','적의 깃발 수가 줄었다','숲 쪽에서 새 떼가 날아오른다']};
const WROLE={은사:1.15,사부:1.1,사형:.92,사저:.92,맞수:.95,지기:.82,사제:.76,사매:.76,제자:.72,친구:.68,자식:.66,배우자:.6};
const WALLY={정:[['소림 나한당','monk'],['무당 검진','whitesword'],['화산 검수대','swordsman'],['개방 타구진','oldbeggar'],['남궁세가 가병','soldier'],['아미 검진','whitesword']],
  마:[['혈검대','cultist'],['흑풍대','blackclad'],['귀면대','cultist'],['독수당','blackclad'],['철기대','chief'],['야차대','cultist']]};
// 내 편 부대: 살아 있는 인연 가운데 싸울 만한 사람(많아야 다섯) + 모자란 만큼 우군
function warUnits(sp){ const base=Math.max(20,power()), us=[], used=new Set();
  m.rels.filter(r=>!r.dead&&WROLE[r.role]&&(r.role!=='자식'||m.age-(r.a0||0)>=16||r.a0==null)).map(r=>({r,p:base*WROLE[r.role]*(.85+(strHash(r.name)%30)/100)})).sort((a,b)=>b.p-a.p).slice(0,5)
    .forEach(x=>{ if(used.has(x.r.name)) return; used.add(x.r.name); us.push({n:x.r.name,role:x.r.role,pow:Math.round(x.p),hp:100,look:relLook(x.r),rel:x.r}); });
  const al=WALLY[sp.mySide==='마'?'마':'정'].slice().sort((a,b)=>strHash(a[0]+m.name)%7-strHash(b[0]+m.name)%7);
  for(let i=0;us.length<(sp.size||6);i++){ const a=al[i%al.length]; us.push({n:a[0],role:'우군',pow:Math.round(base*(.7+((strHash(a[0]+m.age)%25)/100))),hp:100,look:(LOOK[a[1]]||LOOK.soldier)()}); }
  us.forEach((u,i)=>{ u.id=i; }); return us; }
function mkWar(sp){ const us=warUnits(sp), tot=us.reduce((a,u)=>a+u.pow,0), ep=tot*(sp.diff||1), sh=sp.shape||[.3,.4,.3];
  const foes=sp.foes.map((f,i)=>({n:f[0],look:(LOOK[f[1]]||LOOK.cultist)(),pow:Math.round(ep*sh[i]*(.92+R()*.16)),hp:100}));
  // 처음 배치: 센 순서로 중군·좌익·우익에 돌아가며 놓는다
  us.slice().sort((a,b)=>b.pow-a.pow).forEach((u,i)=>{ u.front=[1,0,2,1,0,2,1,1][i%8]; });
  const W={war:1,spec:sp,name:sp.name,round:0,phase:'setup',units:us,foes,fell:[0,0,0],banner:1,sel:null,moved:false,lines:[],fx:[],lost:[],
    cmd:Math.min(.6,.12+ST('wit')*.02+m.lv*.015+(m.f.leader?.1:0)),acc:cl(.38+ST('wit')*.035+readBonus(),.4,.95),style:sp.style||{A:.4,G:.3,F:.3}};
  warTell(W); return W; }
function warTell(W){ const l=W.last, w=Object.assign({},W.style); if(l) w[BEATS[l]]+=.25;   // 내가 같은 영을 되풀이하면 적이 받아칠 준비를 한다
  W.next=wpick(['A','G','F'],k=>w[k]); const shown=R()<W.acc?W.next:pick(['A','G','F'].filter(k=>k!==W.next)); W.tell={s:shown,txt:pick(WTELL[shown])}; }
const warMine=(W,i)=>W.units.filter(u=>u.front===i&&u.hp>0);
const warMor=(W,i)=>{ const a=warMine(W,i); return a.length?Math.round(a.reduce((s,u)=>s+u.hp,0)/a.length):0; };
function warMove(W,id,i){ const u=W.units[id]; if(!u||u.hp<=0||W.fell[i]||u.front===i) return false; if(W.phase==='pick'){ if(W.moved) return false; W.moved=true; } else if(W.phase!=='setup') return false; u.front=i; W.sel=null; return true; }
// 한 합을 치른다
function warRound(W,my){ W.round++; W.fx=[]; const en=W.next, win=BEATS[en]===my, lose=BEATS[my]===en;
  const mm=(win?1.45:lose?.65:1)*(my==='A'?1.15:my==='G'?.8:1)*(en==='G'?.85:1), em=(lose?1.45:win?.65:1)*(en==='A'?1.15:en==='G'?.8:1)*(my==='G'?.85:1);
  const out=[`${W.round}합 · 내 영 ${WORD[my]} ↔ 적 ${WORD[en]}${win?' · 적의 수를 읽었다':lose?' · 수를 읽혔다':''}`];
  const wingsMine=W.fell[0]===-1&&W.fell[2]===-1, wingsFoe=W.fell[0]===1&&W.fell[2]===1;
  for(let i=0;i<3;i++){ if(W.fell[i]) continue; const mine=warMine(W,i), f=W.foes[i];
    let mp=mine.reduce((s,u)=>s+u.pow*(.5+.5*u.hp/100),0)*(W.banner===i?1+W.cmd:1)*(i===1&&wingsMine?.75:1), ep=f.pow*(.5+.5*f.hp/100)*(i===1&&wingsFoe?.7:1);
    if(!mine.length){ W.fell[i]=-1; out.push(`${WFRONT[i]}이 비어 있었다. 적이 그대로 지나갔다`); W.fx.push([i,'붕괴','bad']); continue; }
    const r=mp/(mp+ep), dE=Math.round(WDMG*r*2*mm*(.85+R()*.3)), dM=Math.round(WDMG*(1-r)*2*em*(.85+R()*.3));
    f.hp=Math.max(0,f.hp-dE); mine.forEach(u=>{ u.hp=Math.max(0,Math.round(u.hp-dM*(.8+R()*.4))); });
    W.fx.push([i,'−'+dE,'foe'],[i,'−'+dM,'me']);
    if(f.hp<=0){ W.fell[i]=1; out.push(`${WFRONT[i]} 돌파! ${f.n}${jo(f.n,'이','가')} 무너졌다`); W.fx.push([i,'돌파','good']); }
    else if(!warMine(W,i).length){ W.fell[i]=-1; out.push(`${WFRONT[i]}이 무너졌다`); W.fx.push([i,'붕괴','bad']); }
    W.units.filter(u=>u.front===i&&u.hp<=0&&!u.out).forEach(u=>{ u.out=1; W.lost.push(u); }); }
  // 무너뜨린 갈래의 부대는 아직 싸우는 가장 가까운 갈래로 합친다. 무너진 갈래의 적은 중군에 힘을 보탠다
  for(let i=0;i<3;i++){ if(W.fell[i]===1){ const to=W.fell[1]?[0,2].find(k=>!W.fell[k]):1; if(to!=null) W.units.forEach(u=>{ if(u.front===i&&u.hp>0) u.front=to; }); }
    if(W.fell[i]===-1&&i!==1&&!W.foes[i].joined&&!W.fell[1]){ W.foes[i].joined=1; W.foes[1].pow=Math.round(W.foes[1].pow+W.foes[i].pow*.35*(W.foes[i].hp/100)); } }
  W.last=my; W.moved=false; W.lines=out; return warState(W); }
function warState(W){ if(W.fell[1]===1) return 'win'; if(W.fell[1]===-1) return 'lose'; if(!W.units.some(u=>u.hp>0)) return 'lose';
  if(W.round>=WMAX){ const s=W.fell.filter(x=>x===1).length-W.fell.filter(x=>x===-1).length; return s>0?'win':s<0?'lose':(W.foes[1].hp<warMor(W,1)?'win':'lose'); } return 'go'; }
// 싸움이 끝난 뒤: 쓰러진 사람 가운데 일부는 돌아오지 못한다(큰 싸움일수록)
function warSettle(W,st){ const win=st==='win', res={war:1,win,rounds:W.round,broke:W.fell.filter(x=>x===1).length,lostN:W.fell.filter(x=>x===-1).length,fallen:[],hurt:[],dead:false,fled:false,killed:false};
  W.lost.forEach(u=>{ if(!u.rel) return; if(R()<(W.spec.deadly==null?.12:W.spec.deadly)*(win?.6:1)){ u.rel.dead=1; res.fallen.push(u.n); log(`${W.name}에서 ${u.role} ${iga(u.n)} 돌아오지 못했다`,true); } else res.hurt.push(u.n); });
  if(!win&&W.spec.risk) hurt(ri(W.spec.risk[0],W.spec.risk[1]),W.spec.cause||W.name);
  if(win) m.wins=(m.wins||0)+1; else m.losses=(m.losses||0)+1; return res; }
// 맡기기: 낌새를 믿고 받아치되 가끔 어긋난다. 깃발은 가장 밀리는 갈래에 세운다
function warAutoPick(W){ const bad=[0,1,2].filter(i=>!W.fell[i]).sort((a,b)=>(warMor(W,a)-W.foes[a].hp)-(warMor(W,b)-W.foes[b].hp))[0]; if(bad!=null) W.banner=bad; return R()<.85?BEATS[W.tell.s]:pick(['A','G','F']); }
function quickWar(sp){ const W=mkWar(sp); W.phase='pick'; let st='go'; for(let g=0;g<WMAX+1&&st==='go';g++){ st=warRound(W,warAutoPick(W)); if(st==='go') warTell(W); } return warSettle(W,st); }

/* ---- 화면에서 치르는 지휘전 ---- */
function startWar(sp,done){ if(m.headless){ done(quickWar(sp)); return; }
  const W=mkWar(sp); W.done=done; DUEL=W;
  W.stage=fixStage(Sg('battle',{time:sp.time||'day',name:sp.name,hero:{x:30,face:1,pose:'point'},cast:[0,1,2].map(i=>N('wf'+i,W.foes[i].look,[128,150,172][i],{pose:'guard',tag:i===1?sp.foeName:''})).concat(W.units.slice(0,3).map((u,i)=>N('wu'+i,u.look,[52,72,92][i],{face:1,pose:'guard'})))}),'war:'+String(R()).slice(2,8));
  render(); callout('指揮','duel',1100); sfx('gong'); warKick(W); }
function warKick(W){ clearTimeout(W.tm); if(!m.auto) return; W.tm=setTimeout(()=>{ if(DUEL!==W||!m.auto) return; if(W.phase==='setup') warBegin(); else if(W.phase==='pick') warOrder(warAutoPick(W)); else if(W.phase==='end') warClose(); },INSTANT?0:W.phase==='end'?1600:900); }
function warBegin(){ const W=DUEL; if(!W||!W.war||W.phase!=='setup') return; W.phase='pick'; W.sel=null; sfx('gong'); render(); warKick(W); }
function warOrder(my){ const W=DUEL; if(!W||!W.war||W.phase!=='pick') return; const st=warRound(W,my);
  sfx(W.fx.some(x=>x[2]==='good')?'ult':W.fx.some(x=>x[2]==='bad')?'death':'clash'); shake=6; if(W.fx.some(x=>x[2]==='good')) callout('突破','duel',900);
  if(st==='go'){ warTell(W); render(); warKick(W); return; }
  W.res=warSettle(W,st); W.phase='end'; callout(W.res.win?'勝':'敗',W.res.win?'duel':'duel lethal',1300); sfx(W.res.win?'lv':'fail'); render(); warKick(W); }
function warClose(){ const W=DUEL; if(!W||!W.war||W.phase!=='end') return; clearTimeout(W.tm); DUEL=null; W.done(W.res,W.stage); }
// 전장 그림: 위가 적진, 아래가 우리 진. 세 갈래에 부대가 서 있다
function warDraw(el,W){ const g=el.getContext('2d'), CWd=el.width, CHt=el.height, lw=CWd/3; g.imageSmoothingEnabled=false; g.clearRect(0,0,CWd,CHt);
  const sk=skinImg('map/battle'); if(sk) skinDraw(g,sk,0,0,CWd,CHt); else {
    g.fillStyle='#86a45c'; g.fillRect(0,0,CWd,CHt);
    for(let i=0;i<150;i++){ g.fillStyle=i%3?'#7b9a52':'#93b068'; g.fillRect(Math.floor(hsh(i*3.1)*CWd),Math.floor(hsh(i*7.7)*CHt),3,1); }
    g.fillStyle='#8a7654'; for(let i=0;i<7;i++){ const x=6+hsh(i*5.3)*(lw-34), y=70+hsh(i*2.9)*70; g.beginPath(); g.moveTo(x,y+14); g.lineTo(x+12,y); g.lineTo(x+24,y+14); g.fill(); g.fillStyle=i%2?'#7a6848':'#8a7654'; }
    g.fillStyle='#c9b78c'; g.fillRect(lw+lw/2-20,0,40,CHt); g.fillStyle='#b8a67c'; for(let y=6;y<CHt;y+=18) g.fillRect(lw+lw/2-3,y,6,8);
    g.fillStyle='#5f93b8'; g.fillRect(CWd-26,0,26,CHt); g.fillStyle='#7fb0d0'; for(let y=4;y<CHt;y+=14) g.fillRect(CWd-22+((y/14)%2)*6,y,10,2);
    g.fillStyle='rgba(120,30,30,.28)'; g.fillRect(0,0,CWd,26); g.fillStyle='rgba(30,60,120,.26)'; g.fillRect(0,CHt-26,CWd,26); }
  g.font='700 12px sans-serif'; g.textAlign='center'; g.textBaseline='middle';
  for(let i=0;i<3;i++){ const cxp=lw*i+lw/2, f=W.foes[i], mine=warMine(W,i), fl=W.fell[i];
    g.fillStyle='rgba(20,20,26,.55)'; g.fillRect(lw*i+1,CHt/2-10,lw-2,20); g.fillStyle='#f4f1e4'; g.fillText(`${WFRONT[i]} · ${WTER[i]}`,cxp,CHt/2);
    const row=(looks,y,dir,dim)=>{ const n=Math.min(4,looks.length), w=28, gap=Math.min(30,(lw-16-w)/Math.max(1,n-1)), x0=cxp-((n-1)*gap+w)/2; g.globalAlpha=dim?.35:1; looks.slice(0,n).forEach((L,k)=>{ const sp=charSprite(L,'idle',0,dir), sw=Math.round(sp.width*48/sp.height); g.drawImage(sp,x0+k*gap+(w-sw)/2,y,sw,48); }); g.globalAlpha=1; };
    row([f.look,f.look,f.look].slice(0,f.hp>60?3:f.hp>25?2:1),28,'d',fl===1); row(mine.length?mine.map(u=>u.look):[],CHt-78,'u',false);
    const bar=(y,v,c)=>{ g.fillStyle='#22202a'; g.fillRect(cxp-34,y,68,6); g.fillStyle=c; g.fillRect(cxp-33,y+1,66*Math.max(0,v)/100,4); };
    bar(20,f.hp,'#d0503a'); bar(CHt-26,warMor(W,i),'#4f8fd0');
    if(W.banner===i&&!fl){ g.fillStyle='#22202a'; g.fillRect(cxp+38,CHt-70,2,26); g.fillStyle='#e8c84a'; g.fillRect(cxp+40,CHt-70,14,9); g.fillStyle='#b8321f'; g.fillRect(cxp+44,CHt-67,6,3); }
    if(fl){ g.fillStyle=fl===1?'rgba(217,164,65,.9)':'rgba(180,50,40,.9)'; g.fillRect(cxp-30,fl===1?40:CHt-66,60,20); g.fillStyle='#fff'; g.fillText(fl===1?'돌파':'붕괴',cxp,fl===1?50:CHt-56); } }
  W.fx.forEach(x=>{ const cxp=lw*x[0]+lw/2; if(x[2]==='foe'||x[2]==='me'){ g.font='700 15px sans-serif'; g.fillStyle='#22202a'; g.fillText(x[1],cxp+1,(x[2]==='foe'?84:CHt-92)+1); g.fillStyle=x[2]==='foe'?'#ffe08a':'#ff9a8a'; g.fillText(x[1],cxp,x[2]==='foe'?84:CHt-92); g.font='700 12px sans-serif'; } }); }
function renderWar(card){ const W=DUEL, busy=m.auto, st=W.phase;
  const head=`<div class="mh-dhead"><p class="mh-qa">지휘전 · ${st==='setup'?'배치':st==='end'?'끝':`${W.round+1}합째 / ${WMAX}합`}</p><b>${esc(W.name)}</b><small>적 ${esc(W.spec.foeName)}</small></div>`;
  const chip=u=>`<button type="button" class="mh-wu${W.sel===u.id?' on':''}${u.hp<=0?' out':''}" data-wu="${u.id}" ${u.hp<=0||st==='end'||busy||W.fell[u.front]?'disabled':''}>${ptImg(u.look)}<span><b>${esc(u.n)}</b><small>${esc(u.role)} · 무위 ${u.pow}</small><i><em style="width:${u.hp}%"></em></i></span></button>`;
  const cols=[0,1,2].map(i=>{ const f=W.foes[i], fl=W.fell[i], can=!fl&&st!=='end'&&!busy; return `<div class="mh-wcol${fl===1?' won':fl===-1?' lost':''}"><div class="mh-wfoe"><b>${esc(f.n)}</b><small>무위 ${f.pow}${f.joined?' · 중군에 합류':''}</small></div>
      <div class="mh-wmine">${W.units.filter(u=>u.front===i).map(chip).join('')||'<small class="mh-wempty">비어 있다</small>'}</div>
      <div class="mh-wbtn"><button type="button" class="mh-btn sm" data-wmv="${i}" ${can&&W.sel!=null&&(st==='setup'||!W.moved)?'':'disabled'}>여기로 보낸다</button><button type="button" class="mh-btn sm${W.banner===i?' on':''}" data-wbn="${i}" ${can?'':'disabled'}>${W.banner===i?'깃발 있음':'깃발'}</button></div></div>`; }).join('');
  let foot;
  if(st==='setup') foot=`<p class="mh-wnote">사람을 누르고 "여기로 보낸다"로 갈래를 정한다. 깃발을 세운 갈래는 내가 직접 지휘해 힘이 ${Math.round(W.cmd*100)}% 는다. 적의 중군을 무너뜨리면 이긴다.</p><div class="mh-row"><button type="button" class="mh-btn pri" id="mhWgo" ${busy?'disabled':''}>진을 다 쳤다. 북을 울린다</button></div>`;
  else if(st==='pick') foot=`<p class="mh-tell"><span class="mh-lab">낌새</span> <span>${esc(W.tell.txt)}. <b class="mh-st ${W.tell.s}">${WORD[W.tell.s]}</b>의 기미</span> <small>읽을 확률 ${Math.round(W.acc*100)}%</small></p>
      <div class="mh-chs mh-word">${['A','G','F'].map((k,i)=>`<button type="button" class="mh-ch" data-wo="${k}" ${busy?'disabled':''}><span><span><span class="mh-key">${i+1}</span>${WORD[k]}</span><small>${WORDD[k]}</small></span></button>`).join('')}</div>
      <p class="mh-wnote">${W.moved?'이번 합에는 이미 한 사람을 옮겼다.':'합마다 한 사람을 다른 갈래로 옮길 수 있다.'}</p>`;
  else { const r=W.res; foot=`<p class="mh-wres ${r.win?'good':'bad'}">${r.win?'이겼다':'졌다'} · ${r.rounds}합 · 돌파 ${r.broke}갈래 · 무너진 갈래 ${r.lostN}${r.fallen.length?`<br>돌아오지 못한 사람: ${esc(r.fallen.join(', '))}`:''}${r.hurt.length?`<br>다친 사람: ${esc(r.hurt.join(', '))}`:''}</p><div class="mh-row"><button type="button" class="mh-btn pri" id="mhWend" ${busy?'disabled':''}>계속</button></div>`; }
  card.innerHTML=`<div class="mh-war">${head}<canvas id="mhWar" width="384" height="230" role="img" aria-label="세 갈래 전장"></canvas><div class="mh-wgrid">${cols}</div>${W.lines.length?`<ul class="mh-wlog">${W.lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`:''}${foot}</div>`;
  warDraw($m('mhWar'),W);
  card.querySelectorAll('[data-wu]').forEach(b=>b.onclick=()=>{ W.sel=W.sel===+b.dataset.wu?null:+b.dataset.wu; render(); });
  card.querySelectorAll('[data-wmv]').forEach(b=>b.onclick=()=>{ if(W.sel!=null&&warMove(W,W.sel,+b.dataset.wmv)){ sfx('ok'); render(); } });
  card.querySelectorAll('[data-wbn]').forEach(b=>b.onclick=()=>{ W.banner=+b.dataset.wbn; sfx('tick'); render(); });
  card.querySelectorAll('[data-wo]').forEach(b=>b.onclick=()=>warOrder(b.dataset.wo));
  const go=$m('mhWgo'); if(go) go.onclick=warBegin; const en=$m('mhWend'); if(en) en.onclick=warClose; }
