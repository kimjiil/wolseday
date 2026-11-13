/* ==== murim:duel — 장면 연출(시퀀스)과 초식 결투 ==== */
/* ---- 시퀀스: 프레임 단위로 배우를 움직인다. 움직임을 줄인 환경이나 가려진 탭에서는 한 번에 끝낸다. ---- */
const SEQS=[]; let INSTANT=false;
function seq(build,done){ const q={it:[],t:0,end:0,done:done||null};
  const at=(f,fn)=>{ q.it.push([f,f,fn]); if(f>q.end) q.end=f; }, during=(f0,f1,fn)=>{ q.it.push([f0,f1,fn]); if(f1>q.end) q.end=f1; };
  build(at,during);
  if(RED||INSTANT||document.hidden){ q.it.slice().sort((a,b)=>a[1]-b[1]).forEach(x=>{ try{ x[2](1); }catch(e){} }); if(q.done) q.done(); return; }
  SEQS.push(q); }
function seqStep(){ for(let i=SEQS.length-1;i>=0;i--){ const q=SEQS[i], t=q.t;
    for(const x of q.it){ try{ if(x[0]===x[1]){ if(t===x[0]) x[2](1); } else if(t>=x[0]&&t<=x[1]) x[2]((t-x[0])/(x[1]-x[0])); }catch(e){} }
    q.t++; if(q.t>q.end){ SEQS.splice(i,1); if(q.done){ try{ q.done(); }catch(e){ console.error(e); } } } } }
onFrame=seqStep;
const A=id=>actorOf(id);
function emo(id,e,ms){ const a=A(id); if(!a) return; a.emote=e; if(ms) setTimeout(()=>{ if(a.emote===e) a.emote=null; },ms); }
function setPose(id,p,o){ const a=A(id); if(!a) return; a.pose=p; a.pose0=p; a.f=0; a.act=null; a.ay=0; if(o) Object.assign(a,o); }
function walkTo(id,x,spd){ const a=A(id); if(!a) return; a.goto=x; if(spd) a.spd=spd; }
const visOf=L=>L.animal?'beast':(L.weapon==='sword'||L.weapon==='saber'||L.weapon==='staff'||L.weapon==='stick'||L.weapon==='darts')?L.weapon:'palm';
const atkPose=a=>visOf(a.L)==='palm'||visOf(a.L)==='darts'?'cast':'atk';
function blood(x,y,dir){ for(let i=0;i<8;i++) FX.push({t:'blood',x,y,vx:dir*(.3+R()*.9),vy:-.6-R()*.9,life:22,max:22}); }
function strikeFx(src,tgt,dir,o){ o=o||{}; const v=visOf(src.L), x=tgt.x+tgt.ax-dir*6, y=tgt.y-13, c=o.mine?'#ffffff':'#ffd9cc';
  if(o.ult){ if(v==='palm'){ FX.push({t:'beam',x0:src.x+src.ax+dir*8,x1:tgt.x+tgt.ax,y,dir,c:o.red?'#ff7a5a':'#9fe0ff',life:14,max:14}); } else if(v==='darts'){ for(let i=0;i<3;i++) FX.push({t:'dart',x0:src.x+src.ax+dir*8,x1:tgt.x+tgt.ax,y:y-4+i*4,dir,life:6+i*2,max:6+i*2}); } else { fxSlash(x,y,dir,c,true); fxSlash(x,y-2,-dir,o.red?'#ff7a5a':'#ffe9a0',true); } fxBurst(x,y,o.red?'#ff8a70':'#ffe9a0',12); }
  else if(v==='beast'){ for(let i=0;i<3;i++) FX.push({t:'thrust',x:x-dir*8,y:y-4+i*4,dir,c:'#ffffff',life:8,max:8}); }
  else if(v==='palm'){ FX.push({t:'ring',x,y,life:10,max:10,c:'#ffd870'}); fxBurst(x,y,'#ffd870',6); }
  else if(v==='darts'){ FX.push({t:'dart',x0:src.x+src.ax+dir*8,x1:tgt.x+tgt.ax,y,dir,life:6,max:6}); }
  else if(o.kind==='F'){ FX.push({t:'thrust',x:x-dir*10,y,dir,c,life:9,max:9}); }
  else fxSlash(x,y,dir,c,false);
  sfx('slash'); }
// 두 배우가 맞붙는 구경거리. winner 'a'|'b', kill이면 진 쪽이 숨진다.
function npcFight(aId,bId,o,done){ o=o||{}; const a=A(aId), b=A(bId); if(!a||!b){ if(done) done(); return; }
  const n=o.rounds||3, dir=a.x<b.x?1:-1, gap=Math.abs(b.x-a.x), L=Math.max(3,(gap-26)/2), win=o.winner==='b'?b:a, los=win===a?b:a, wd=win===a?dir:-dir;
  a.lock=b.lock=true; a.goto=b.goto=null; a.face=dir; b.face=-dir; a.act=b.act=null; a.ay=b.ay=0;
  seq((at,during)=>{ let t=4;
    at(0,()=>{ a.pose=b.pose='guard'; a.emote=b.emote=null; });
    for(let i=0;i<n;i++){ const f0=t;
      during(f0,f0+6,p=>{ a.ax=dir*L*p; b.ax=-dir*L*p; a.pose=atkPose(a); b.pose=atkPose(b); });
      at(f0+7,()=>{ fxSpark((a.x+a.ax+b.x+b.ax)/2,a.y-14,'#fff3c0',8); shake=3; sfx('clash'); if(i%2) fxSlash(b.x+b.ax-dir*6,b.y-13,dir,'#ffffff'); else fxSlash(a.x+a.ax+dir*6,a.y-13,-dir,'#ffffff'); });
      during(f0+9,f0+17,p=>{ a.ax=dir*L*(1-p); b.ax=-dir*L*(1-p); });
      at(f0+17,()=>{ a.pose=b.pose='guard'; }); t=f0+24; }
    if(o.draw){ at(t,()=>{ a.pose=b.pose='idle'; a.lock=b.lock=false; }); return; }
    during(t,t+6,p=>{ win.ax=wd*Math.max(4,gap-26)*p; win.pose=atkPose(win); });
    at(t+7,()=>{ strikeFx(win,los,wd,{mine:1,ult:!!o.kill}); los.flash=10; los.pose='hit'; shake=6; sfx('hit'); if(o.kill) blood(los.x,los.y-12,wd); });
    during(t+7,t+13,p=>{ los.ax=wd*6*p; });
    at(t+16,()=>{ los.pose=o.kill?'dead':'down'; los.pose0=los.pose; fxDust(los.x+los.ax,los.y); if(o.kill){ flashA=.45; flashC='#b8321f'; sfx('death'); } });
    during(t+16,t+26,p=>{ win.ax*=(1-p); });
    at(t+26,()=>{ win.ax=0; win.pose='idle'; win.pose0='idle'; });
    at(t+44,()=>{});
  },done); }

/* ---- 결투 규칙 ---- */
const STN={A:'강공',G:'수비',F:'변초',U:'절초'};
const STH={A:'변초를 깬다',G:'강공을 되받는다',F:'수비를 뚫는다',U:'기 60 · 큰 일격'};
// DM[내 수][상대 수] = [내가 주는 배율, 내가 받는 배율]
const DM={A:{A:[.6,.6],G:[.15,.7],F:[1,0],U:[.3,1.7]},G:{A:[.7,.15],G:[0,0],F:[0,.9],U:[0,.8]},F:{A:[0,1],G:[.9,0],F:[.4,.4],U:[0,1.7]},U:{A:[1.7,.3],G:[.8,0],F:[1.7,0],U:[1.2,1.2]}};
const STYLE={brute:{A:.55,G:.15,F:.3},bandit:{A:.45,G:.2,F:.35},sword:{A:.34,G:.33,F:.33},monk:{A:.25,G:.5,F:.25},assassin:{A:.3,G:.1,F:.6},even:{A:.34,G:.33,F:.33},beast:{A:.7,G:.05,F:.25}};
const BEATS={A:'G',G:'F',F:'A',U:'G'};
const TELLS={A:['어깨가 내려앉는다','발끝이 땅을 판다','숨을 크게 들이쉰다'],G:['무게가 뒤로 실린다','칼끝이 낮게 깔린다','눈이 내 손만 본다'],F:['손목이 풀려 있다','걸음이 엇박자다','시선이 한 번 흔들린다'],U:['기가 한 점에 모인다','옷자락이 바람 없이 떤다','공기가 무거워진다']};
const TELLEMO={A:'anger',G:'...',F:'?',U:'!'};
function mkFoe(s){ const pow=Math.max(3,Math.round(s.pow)), hp=Math.round(34+pow*1.1);
  return {name:s.name||'상대',look:s.look||LOOK.bandit(),pow,hpMax:hp,hp,qi:Math.round(Math.min(50,10+pow*.3)),def:100/(100+pow/14*6),style:s.style||'even',lv:cl(Math.round(pow/14),0,8),art:s.art||'',mercy:s.mercy==null?.5:s.mercy,beast:!!(s.look&&s.look.animal),title:s.title||'',crit:.06,last:[]}; }
// 내 기력도 상대와 같은 식으로 잰다. 지금 건강이 그 몇 할을 채우고 들어가는지를 정한다.
function mkMe(){ const c=combat(), ar=eq('def'), pw=power(), mx=Math.round(34+pw*1.1)+eq('hp');
  return {name:m.name,pow:pw,hpMax:mx,hp:Math.max(1,Math.round(mx*cl(m.hp)/100)),qi:Math.round(20+Math.min(40,m.ng*.5)),def:100/(100+ar*4+m.lv*6),evade:Math.min(.4,stepArt()+eq('ev')),art:c.art?c.art.n:'',crit:Math.min(.5,.05+ST('luck')*.01+eq('cr')),last:[]}; }
function mkDuel(spec){ const foes=spec.chain||[spec.foe]; const D={spec,foes,idx:0,won:0,round:0,total:0,lethal:!!spec.lethal,me:mkMe(),foe:mkFoe(foes[0]),taken:0,lines:[],phase:'pick',mirror:false,hp0:m.hp};
  if(spec.qi) D.me.qi=Math.min(100,D.me.qi+spec.qi); D.qi0=D.me.qi; mkTell(D); return D; }
function foePick(D){ const f=D.foe, l=D.me.last; if(f.qi>=60&&R()<.55) return 'U';
  const w=Object.assign({},STYLE[f.style]||STYLE.even); const n=l.length; if(n>=2&&l[n-1]===l[n-2]&&l[n-1]!=='U') w[BEATS[l[n-1]]]+=.4;
  return wpick(['A','G','F'],k=>w[k]); }
function mkTell(D){ const f=D.foe; D.next=foePick(D); const acc=cl(.38+ST('wit')*.035+(m.lv-f.lv)*.03+readBonus(),.4,.95);
  const shown=R()<acc?D.next:pick(['A','G','F','U'].filter(k=>k!==D.next&&(k!=='U'||f.qi>=60))); D.tell={s:shown,acc,txt:pick(TELLS[shown])}; }
function autoPick(D){ const me=D.me, t=D.tell.s; if(D.lethal&&me.hp<me.hpMax*.28&&m.inv.bag.salve>0) return 'salve';
  if(me.qi>=60&&t!=='G'&&R()<.8) return 'U'; if(R()<.15) return pick(['A','G','F']); return BEATS[t]||'A'; }
function dmgOf(a,mul,b){ if(mul<=0) return 0; return Math.max(1,Math.round((6+a.pow*.3)*mul*(.85+R()*.3)*b.def)); }
function roundText(D,ev){ const stn=D.spec.stn||STN, a=stn[ev.my]||(ev.my==='salve'?'금창약':'물러서기'), b=stn[ev.fs], p=[];
  if(ev.heal) p.push(`체력 +${ev.heal}`); if(ev.dm) p.push(`상대 −${ev.dm}${ev.cm?' 회심':''}`); if(ev.ally) p.push(`조력 −${ev.ally}`);
  if(ev.df) p.push(`나 −${ev.df}${ev.cf?' 회심':''}`); if(ev.ev) p.push('흘려 냈다'); if(ev.fled) p.push('몸을 뺐다'); if(!p.length) p.push('서로 틈만 보았다');
  return `${a} ↔ ${b} · ${p.join(' · ')}`; }
function applyRound(D,my){
  const me=D.me, f=D.foe, fs=D.next; D.round++; D.total++;
  const ev={my,fs,dm:0,df:0,cm:false,cf:false,ev:false,heal:0,fled:false,ally:0}; let mm=0, fm=0;
  const free=fs==='G'?0:fs==='U'?1.3:.7;
  if(my==='salve'){ m.inv.bag.salve--; ev.heal=Math.min(Math.round(me.hpMax*.25),me.hpMax-me.hp); me.hp+=ev.heal; fm=free; }
  else if(my==='flee'){ if(!D.lethal||R()<.4+(me.evade?.25:0)+(ST('luck')-5)*.02) ev.fled=true; else fm=free; }
  else { const r=DM[my][fs]; mm=r[0]; fm=r[1]; me.last.push(my); }
  if(mm>0){ ev.dm=dmgOf(me,mm,f); if(mm>=.6&&R()<me.crit){ ev.dm=Math.round(ev.dm*1.5); ev.cm=true; } }
  if(fm>0){ if(R()<me.evade) ev.ev=true; else { ev.df=dmgOf(f,fm,me); if(fm>=.6&&R()<f.crit){ ev.df=Math.round(ev.df*1.5); ev.cf=true; } } }
  if(D.spec.ally&&!ev.fled) ev.ally=Math.max(1,Math.round((4+D.spec.ally.pow*.12)*(.8+R()*.4)));
  f.hp=Math.max(0,f.hp-ev.dm-ev.ally); me.hp=Math.max(0,me.hp-ev.df); D.taken+=ev.df;
  if(my==='U') me.qi-=60; if(fs==='U') f.qi-=60;
  const gg=my==='G'&&fs==='G'?8:0;
  me.qi=Math.min(100,me.qi+12+eq('qi')+(my==='G'&&(fs==='A'||fs==='U')?15:0)+gg);
  f.qi=Math.min(100,f.qi+12+(fs==='G'&&(my==='A'||my==='U')?15:0)+gg);
  ev.txt=roundText(D,ev); D.lines.push(ev.txt); if(D.lines.length>3) D.lines.shift(); D.ev=ev; return ev; }
function duelState(D){ const me=D.me, f=D.foe; D.mirrorNow=false;
  if(D.ev&&D.ev.fled) return 'fled';
  if(f.hp<=0){ me.hp=Math.max(1,me.hp); return 'win'; }
  if(me.hp<=0){ if(D.lethal&&hasFx('guard')&&!D.mirror){ D.mirror=true; D.mirrorNow=true; me.hp=Math.round(me.hpMax*.15); m.inv.c=null; return 'go'; } return 'lose'; }
  if(D.spec.survive&&D.round>=D.spec.survive) return 'win';
  if(D.round>=16) return me.hp/me.hpMax>=f.hp/f.hpMax?'win':'lose';
  return 'go'; }
function nextFoe(D){ D.idx++; D.round=0; D.foe=mkFoe(D.foes[D.idx]); D.me.hp=Math.min(D.me.hpMax,D.me.hp+Math.round(D.me.hpMax*.14)); D.me.qi=Math.max(D.me.qi,D.qi0); D.me.last=[]; mkTell(D); }
function settle(D,state){ const me=D.me, sp=D.spec, f=D.foe;
  const res={win:state==='win',fled:state==='fled',won:D.won,dead:false,rounds:D.total,foe:f.name,lethal:D.lethal};
  if(D.lethal){
    if(state==='lose'){ if(R()<f.mercy){ m.hp=ri(3,9); res.mercy=true; if(sp.rob){ res.robbed=Math.round(m.gold*sp.rob); gold(-res.robbed); } } else { m.hp=0; res.dead=true; m.deathCause=sp.cause||`${f.name}의 칼`; } }
    else { const left=me.hp/me.hpMax*100; m.hp=cl(Math.round(D.hp0-Math.max(0,D.hp0-left)*.6),1,100); }
  } else { const loss=D.taken>0?Math.max(3,Math.round(D.taken/me.hpMax*100*.25)):0; m.hp=Math.max(1,Math.round(D.hp0-loss)); }
  if(res.win){ m.wins=(m.wins||0)+1; m.fame+=f.pow>=me.pow?2:1; } else m.losses=(m.losses||0)+1;
  return res; }
function mercyApply(D,res,k){ const f=D.foe;
  if(k==='kill'){ res.killed=true; m.kills=(m.kills||0)+1; m.per.담=cl((m.per.담||0)+4,-100,100); m.per.정=cl((m.per.정||0)-5,-100,100); m.ak+=D.spec.good?12:2;
    if(!D.spec.noReturn&&R()<.3&&!m.q.some(q=>q.id==='kinRevenge')){ m.f.kinOf=f.name; m.q.push({age:m.age+ri(5,10),id:'kinRevenge'}); } }
  else { res.spared=true; m.hy+=3; m.per.정=cl((m.per.정||0)+5,-100,100); m.spared=m.spared||[]; if(!D.spec.noReturn&&m.spared.length<3) m.spared.push({n:f.name,a:m.age,pow:f.pow,lk:f.look}); } }
function lootOf(D,res){ const L=D.spec.loot; if(!L) return; if(L.g){ const g=Math.round(ri(L.g[0],L.g[1])*(res.killed?1.5:1)); gold(g); res.gold=g; }
  (L.it||[]).forEach(x=>{ if(R()<x[1]){ give(x[0]); (res.items=res.items||[]).push(x[0]); } }); }
// 이긴 싸움에서 덤으로 떨어지는 물건. 상대가 셀수록 등급이 높다
function dropOf(D,res){ if(D.spec.noDrop||R()>(D.lethal?.3:.08)) return; const p=Math.max.apply(null,D.foes.map(f=>f.pow)), r=R(), t=p<18?(r<.6?0:1):p<30?(r<.6?1:2):p<45?(r<.7?2:3):p<60?(r<.75?3:2):(r<.8?3:4); const id=dropItem(t); if(id) (res.items=res.items||[]).push(id); }
const mercyAuto=()=>((m.per&&m.per.협)||0)>=-10?'spare':'kill';
const needMercy=(D,res)=>res.win&&D.lethal&&!D.foe.beast&&!D.spec.noMercy;
function quickDuel(spec){ const D=mkDuel(spec); let st='go';
  for(let g=0;g<90;g++){ applyRound(D,autoPick(D)); st=duelState(D);
    if(st==='win'){ D.won++; if(D.idx<D.foes.length-1){ nextFoe(D); st='go'; continue; } break; }
    if(st!=='go') break; mkTell(D); }
  const res=settle(D,st); res.won=D.won; if(needMercy(D,res)) mercyApply(D,res,mercyAuto()); if(res.win){ lootOf(D,res); dropOf(D,res); } return res; }

/* ---- 화면에서 치르는 결투 ---- */
const autoOn=D=>!!(m.auto||D.autoRest);
function watchers(looks){ const xs=[14,178,26,166]; return (looks||[]).slice(0,4).map((L,i)=>({id:'w'+i,look:L,x:xs[i],face:i%2?-1:1,act:'cheer'})); }
function duelStage(D){ const b=D.base||{}, f=D.foe, sp=D.spec;
  const cast=[{id:'foe',look:f.look,x:132,face:-1,pose:'guard',tag:f.name,tagc:'foe',enter:D.idx>0?'right':null}];
  if(sp.ally) cast.push({id:'ally',look:sp.ally.look,x:30,face:1,pose:'guard',tag:sp.ally.name});
  (sp.extras||[]).forEach(c=>cast.push(c));
  D.stage={key:'duel:'+(D.sid||(D.sid=String(R()).slice(2,8)))+':'+D.idx,bg:sp.bg||b.bg||'road',time:sp.time||b.time,wx:sp.wx||b.wx,tint:sp.tint||b.tint,biome:b.biome,season:b.season,props:sp.bg?null:b.props,noProps:sp.bg?false:b.noProps,name:b.name,
    hero:{look:heroLook(),x:60,face:1,pose:'guard',tag:m.name,tagc:'me'},cast};
  applyStage(D.stage); const h=A('hero'), e=A('foe'); if(h){ h.lock=true; h.goto=null; } if(e) e.lock=true; barsT=6; renderHud(); }
function showTell(D){ const e=A('foe'); if(e) e.emote=TELLEMO[D.tell.s]; }
function startDuel(spec,done){
  if(m.headless){ done(quickDuel(spec)); return; }
  const D=mkDuel(spec); D.done=done; D.base=LASTSPEC; DUEL=D; D.phase='anim'; duelStage(D); render();
  seq((at)=>{ at(2,()=>{ callout(D.lethal?'生死決':'比武',D.lethal?'duel lethal':'duel',1000); sfx('gong'); }); at(44,()=>{}); },()=>{ if(DUEL!==D) return; D.phase='pick'; showTell(D); render(); autoKick(D); }); }
function autoKick(D){ if(D.war) return warKick(D); clearTimeout(D.tm); if(!autoOn(D)) return;
  D.tm=setTimeout(()=>{ if(DUEL!==D||!autoOn(D)) return; if(D.phase==='pick') duelPick(autoPick(D)); else if(D.phase==='mercy') duelMercy(mercyAuto()); else if(D.phase==='end') duelClose(); },INSTANT?0:D.phase==='pick'?420:1200); }
function duelPick(my){ const D=DUEL; if(!D||D.phase!=='pick') return; if(my==='U'&&D.me.qi<60) return; if(my==='salve'&&!(m.inv.bag.salve>0)) return;
  D.phase='anim'; const ev=applyRound(D,my), st=duelState(D), mir=D.mirrorNow; render();
  animRound(D,ev,()=>{ if(DUEL!==D) return; if(mir){ callout('호심경이 깨졌다','warn',1200); const h=A('hero'); if(h) fxBurst(h.x,h.y-14,'#cfe8fa',14); sfx('block'); renderBag&&renderBag(); } duelAfter(D,st); }); }
function duelAfter(D,st){
  if(st==='go'){ mkTell(D); D.phase='pick'; showTell(D); render(); autoKick(D); return; }
  if(st==='win') D.won++;
  const more=st==='win'&&D.idx<D.foes.length-1;
  animEnd(D,st,()=>{ if(DUEL!==D) return;
    if(more){ nextFoe(D); duelStage(D); D.phase='pick'; showTell(D); render(); autoKick(D); return; }
    const res=settle(D,st); res.won=D.won; D.res=res;
    if(needMercy(D,res)){ D.phase='mercy'; render(); autoKick(D); return; }
    duelFinish(D); }); }
function duelMercy(k){ const D=DUEL; if(!D||D.phase!=='mercy') return; D.phase='anim'; mercyApply(D,D.res,k); render();
  const h=A('hero'), e=A('foe');
  seq((at,during)=>{ if(!h||!e) return;
    if(k==='kill'){ during(0,6,p=>{ h.ax=44*p; h.pose=atkPose(h); }); at(7,()=>{ strikeFx(h,e,1,{mine:1,ult:1,red:1}); blood(e.x,e.y-10,1); e.flash=10; shake=7; flashA=.5; flashC='#b8321f'; sfx('death'); });
      at(12,()=>{ e.pose='dead'; e.pose0='dead'; e.emote=null; fxDust(e.x,e.y); }); during(14,24,p=>{ h.ax=44*(1-p); }); at(24,()=>{ h.ax=0; h.pose='idle'; h.emote=null; }); at(44,()=>{}); }
    else { at(0,()=>{ h.pose='idle'; h.emote='...'; e.pose='bow'; e.emote='tear'; }); at(30,()=>{ e.emote=null; e.lock=false; e.pose0='walk'; e.goto=W+20; }); at(56,()=>{ h.emote=null; }); }
  },()=>{ if(DUEL===D) duelFinish(D); }); }
function duelFinish(D){ const res=D.res; if(res.win){ lootOf(D,res); dropOf(D,res); }
  if(res.dead){ D.phase='anim'; const h=A('hero'), e=A('foe');
    seq((at,during)=>{ if(h&&e){ during(0,6,p=>{ e.ax=-44*p; e.pose=atkPose(e); }); at(7,()=>{ strikeFx(e,h,-1,{ult:1,red:1}); blood(h.x,h.y-10,-1); h.flash=12; shake=8; flashA=.7; flashC='#b8321f'; sfx('death'); }); at(12,()=>{ h.pose='dead'; h.pose0='dead'; h.emote=null; }); during(14,26,p=>{ e.ax=-44*(1-p); }); at(26,()=>{ e.ax=0; e.pose='idle'; }); } at(60,()=>{ barsT=12; }); },
      ()=>{ if(DUEL!==D) return; D.phase='end'; render(); autoKick(D); }); return; }
  D.phase='end'; render(); flushVfx(); autoKick(D); }
function duelClose(){ const D=DUEL; if(!D||D.phase!=='end') return; clearTimeout(D.tm); DUEL=null; barsT=0; renderHud(); const e=A('foe'); if(e) e.emote=null; D.done(D.res,D.stage); }
function duelSummary(D){ const r=D.res, f=D.foe, n=f.name; let t;
  if(r.dead) t=`${n}의 일격이 깊었다.`;
  else if(r.fled) t=D.lethal?'틈을 보아 몸을 빼 달아났다.':'손을 들어 졌다고 했다.';
  else if(r.win) t=D.spec.survive&&f.hp>0?`${D.spec.survive}합을 버텨 냈다.`:`${r.rounds}합 만에 ${eul(n)} 꺾었다.${r.killed?' 칼을 거두지 않았다.':r.spared?' 목숨은 거두지 않았다.':''}`;
  else t=D.lethal?`쓰러졌다. ${eun(n)} 목숨만은 남겨 두고 갔다.${r.robbed?` ${fmt(r.robbed)}냥을 털렸다.`:''}`:`${n}에게 졌다.`;
  if(r.gold) t+=` 전리품 ${fmt(r.gold)}냥.`; return t; }

/* ---- 한 합의 움직임 ---- */
function animRound(D,ev,cb){ const h=A('hero'), e=A('foe'); if(!h||!e){ renderHud(); cb(); return; }
  const stn=D.spec.stn||STN, myAct=ev.my==='A'||ev.my==='F'||ev.my==='U', foAct=ev.fs==='A'||ev.fs==='F'||ev.fs==='U';
  seq((at,during)=>{
    at(0,()=>{ h.emote=null; e.emote=null; h.pose=e.pose='guard'; floatText(h.x,h.y-30,stn[ev.my]||(ev.my==='salve'?'금창약':'물러선다'),'st'); floatText(e.x,e.y-30,stn[ev.fs],'st foe'); });
    let f0=6;
    if(ev.my==='U'||ev.fs==='U'){ at(3,()=>{ barsT=13; sfx('ult'); flashA=.45; flashC='#ffffff'; const mine=ev.my==='U'; callout(mine?(D.me.art||'절초'):(D.foe.art||'절초'),mine?'ult':'ult foe',900); const u=mine?h:e; for(let i=0;i<10;i++) FX.push({t:'aura',x:u.x-8+i*1.7,y:u.y-2,life:18+i,max:28,c:mine?'#9fe0ff':'#ff8a70'}); }); at(26,()=>{ barsT=6; }); f0=24; }
    if(ev.heal) at(2,()=>{ healFx(); fxNum(h.x,h.y-27,'+'+ev.heal,'#7fe0a0'); sfx('ok'); renderHud(); });
    const lunge=(a,dir,L,t0,kind)=>during(t0,t0+7,p=>{ a.ax=dir*L*p; a.pose=kind==='F'?'atk2':atkPose(a); a.f=kind==='F'&&p>.5?1:0; });
    const back=(a,t0)=>{ let x0=null; during(t0,t0+10,p=>{ if(x0==null) x0=a.ax; a.ax=x0*(1-p); }); at(t0+10,()=>{ a.ax=0; if(a.pose!=='down') a.pose='guard'; a.f=0; }); };
    const hit=(src,tgt,dir,t0,dmg,o)=>{ at(t0,()=>{ strikeFx(src,tgt,dir,o); if(dmg>0){ tgt.flash=8; tgt.pose='hit'; shake=o.crit||o.ult?7:4; fxNum(tgt.x+tgt.ax,tgt.y-27,dmg,o.mine?(o.crit?'#ffe070':'#ffffff'):'#ff7a6a'); if(D.lethal&&dmg>=6) blood(tgt.x+tgt.ax,tgt.y-12,dir); sfx('hit'); } else { fxSpark(tgt.x+tgt.ax-dir*8,tgt.y-13,'#fff3c0',6); sfx('block'); } renderHud(); });
      if(dmg>0){ let x0=null; during(t0+1,t0+6,p=>{ if(x0==null) x0=tgt.ax; tgt.ax=x0+dir*5*p; }); } };
    const dodge=(t0)=>at(t0,()=>{ floatText(h.x,h.y-36,'흘림','good'); fxDust(h.x,h.y); });
    const om={mine:1,crit:ev.cm,ult:ev.my==='U',kind:ev.my}, of={crit:ev.cf,ult:ev.fs==='U',kind:ev.fs,red:1};
    let end=f0+30;
    if(myAct&&foAct){ lunge(h,1,22,f0,ev.my); lunge(e,-1,22,f0,ev.fs);
      at(f0+7,()=>{ fxSpark((h.x+h.ax+e.x+e.ax)/2,h.y-14,'#fff3c0',8); sfx('clash'); });
      if(ev.dm>0) hit(h,e,1,f0+8,ev.dm,om); if(ev.df>0) hit(e,h,-1,f0+8,ev.df,of); else if(ev.ev) dodge(f0+8);
      back(h,f0+20); back(e,f0+20); end=f0+34; }
    else if(myAct){ lunge(h,1,44,f0,ev.my); hit(h,e,1,f0+8,ev.dm,om);
      if(ev.df>0){ lunge(e,-1,6,f0+12,ev.fs); hit(e,h,-1,f0+17,ev.df,of); } else if(ev.ev) dodge(f0+17);
      back(h,f0+22); back(e,f0+22); end=f0+36; }
    else if(foAct){ lunge(e,-1,44,f0,ev.fs); if(ev.df>0||!ev.ev) hit(e,h,-1,f0+8,ev.df,of); else dodge(f0+8);
      if(ev.dm>0){ lunge(h,1,6,f0+12,ev.my); hit(h,e,1,f0+17,ev.dm,om); }
      back(h,f0+22); back(e,f0+22); end=f0+36; }
    else { at(f0,()=>{ for(let i=0;i<6;i++){ FX.push({t:'aura',x:h.x-6+i*2.4,y:h.y-2,life:20+i*2,max:30,c:'#9fe0ff'}); FX.push({t:'aura',x:e.x-6+i*2.4,y:e.y-2,life:20+i*2,max:30,c:'#ff8a70'}); } renderHud(); }); end=f0+26; }
    if(ev.ally){ const al=A('ally'); if(al){ during(f0+10,f0+16,p=>{ al.ax=40*p; al.pose=atkPose(al); }); at(f0+17,()=>{ fxSlash(e.x-8,e.y-14,1,'#ffe9a0'); fxNum(e.x+6,e.y-34,ev.ally,'#ffe070'); e.flash=6; renderHud(); }); during(f0+18,f0+28,p=>{ al.ax=40*(1-p); }); at(f0+28,()=>{ al.ax=0; al.pose='guard'; }); end=Math.max(end,f0+32); } }
    if(ev.fled){ at(f0,()=>{ h.lock=false; h.pose0='walk'; h.goto=-20; h.spd=1.6; }); end=f0+40; }
    at(end,()=>{});
  },cb); }
function animEnd(D,st,cb){ const h=A('hero'), e=A('foe');
  seq((at)=>{ if(!h||!e) return;
    if(st==='win'){ at(2,()=>{ e.pose=D.lethal&&!D.spec.survive?'down':'kneel'; e.emote=null; e.ax=0; fxDust(e.x,e.y); if(D.spec.survive&&e.pose==='kneel') e.pose='idle'; });
      at(16,()=>{ h.pose='cheer'; h.emote='star'; callout('勝','vic',1000); sfx('ok'); barsT=0; }); at(62,()=>{ h.emote=null; }); }
    else if(st==='lose'){ at(2,()=>{ h.pose='down'; h.emote=null; h.ax=0; fxDust(h.x,h.y); e.pose='idle'; });
      at(16,()=>{ callout('敗','def',1000); sfx('fail'); barsT=0; }); at(62,()=>{}); }
    else { at(30,()=>{ barsT=0; }); }
  },cb); }

/* ---- 결투 표시 ---- */
function renderHud(){ const el=$m('mhHud'); if(!el) return; const D=DUEL; if(!D||D.war){ el.hidden=true; el.textContent=''; return; } el.hidden=false;
  const bar=(x,cls,L)=>`<div class="mh-hud ${cls}"><img src="${portrait(L)}" alt="" width="28" height="28"><div><b>${esc(x.name)}</b><span class="hp"><i style="width:${cl(x.hp/x.hpMax*100)}%"></i></span><span class="qi${x.qi>=60?' full':''}"><i style="width:${cl(x.qi)}%"></i></span></div></div>`;
  el.innerHTML=bar(D.me,'me',heroLook())+bar(D.foe,'foe',D.foe.look); }
function renderDuel(card,eye){ if(DUEL.war) return renderWar(card);
  const D=DUEL, me=D.me, f=D.foe, sp=D.spec, stn=sp.stn||STN, can=D.phase==='pick'&&!autoOn(D);
  const head=`<div class="mh-dhead"><p class="mh-qa">${D.lethal?'생사결':'비무'}${D.foes.length>1?` · ${D.idx+1}/${D.foes.length}번째 상대`:''}${sp.survive?` · ${sp.survive}합을 버텨라`:''}</p><b>${esc(f.name)}</b>${f.title?`<small>${esc(f.title)}</small>`:''}</div>`;
  let body;
  if(D.phase==='mercy') body=`<p class="mh-text">${esc(iga(f.name))} 무릎을 꿇었다. 칼끝이 목에 닿아 있다.</p><div class="mh-chs"><button class="mh-ch" type="button" data-mercy="spare"><span><span class="k" aria-hidden="true">1</span><span>살려 준다<small>언젠가 다시 만날지 모른다</small></span></span></button><button class="mh-ch" type="button" data-mercy="kill"><span><span class="k" aria-hidden="true">2</span><span>벤다<small>후환을 남기지 않는다. 그의 식구가 기억할 것이다</small></span></span></button></div>`;
  else if(D.phase==='end') body=`<p class="mh-res ${D.res.win?'good':'bad'}">${esc(duelSummary(D))}</p><button class="mh-go" type="button" id="mhDgo">${D.res.dead?'눈앞이 어두워진다':'계속'}</button>`;
  else { const t=D.tell;
    body=`<p class="mh-tell"><span class="mh-lab">낌새</span> <span>${esc(t.txt)}. <b class="mh-st ${t.s}">${esc(stn[t.s])}</b>의 기미</span> <small>읽을 확률 ${Math.round(t.acc*100)}%</small></p>
    <div class="mh-stances">${['A','G','F','U'].map((k,i)=>`<button class="mh-ch mh-stance ${k}" type="button" data-st="${k}" ${!can||(k==='U'&&me.qi<60)?'disabled':''}><span class="k" aria-hidden="true">${i+1}</span><b>${esc(k==='U'&&me.art&&!sp.stn?me.art:stn[k])}</b><small>${STH[k]}</small></button>`).join('')}</div>
    <div class="mh-row mh-dacts">${m.inv.bag.salve>0?`<button class="mh-btn" type="button" data-st="salve" ${can&&me.hp<me.hpMax?'':'disabled'}>${icImg(itIcon('salve'),'sm')} 금창약 ×${m.inv.bag.salve}</button>`:''}<button class="mh-btn" type="button" data-st="flee" ${can?'':'disabled'}>${D.lethal?'몸을 뺀다':'졌다고 한다'}</button>${m.auto?'':`<button class="mh-btn" type="button" id="mhDauto" ${D.autoRest?'aria-pressed="true"':''}>남은 합을 맡긴다</button>`}<span class="mh-hint">강공 › 변초 › 수비 › 강공</span></div>`; }
  const lines=D.lines.length?`<ol class="mh-dlog">${D.lines.slice().reverse().map((x,i)=>`<li class="${i?'old':''}">${esc(x)}</li>`).join('')}</ol>`:'';
  card.innerHTML=`${eye}<div class="mh-duel${D.lethal?' lethal':''}">${head}${body}${lines}</div>`;
  card.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>duelPick(b.dataset.st));
  card.querySelectorAll('[data-mercy]').forEach(b=>b.onclick=()=>duelMercy(b.dataset.mercy));
  const go=$m('mhDgo'); if(go) go.onclick=()=>duelClose();
  const au=$m('mhDauto'); if(au) au.onclick=()=>{ D.autoRest=!D.autoRest; render(); autoKick(D); };
}
