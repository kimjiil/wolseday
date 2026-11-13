/* ==== murim:sectlife — 문파 생활: 임무, 공헌과 서열, 침공 ==== */
const SRANK=[[0,'삼대제자'],[12,'이대제자'],[30,'일대제자'],[60,'장로']];
const srank=()=>{ const c=m.sc||0; let r=SRANK[0][1]; for(const x of SRANK) if(c>=x[0]) r=x[1]; return r; };
const mySite=()=>m.sect?cath().spots.find(s=>s.sect===m.sect)||null:null;
const foeSide=()=>m.sect&&SECTS[m.sect]&&SECTS[m.sect].side==='마'?'무림맹':'마교';
// 공헌이 쌓이면 서열이 오르고, 오를 때마다 사문의 무공이 깊어진다
function addSc(n){ if(!m.sect||!SECTS[m.sect]) return; const b=srank(); m.sc=Math.max(0,(m.sc||0)+n); const a=srank(); if(n<=0||a===b) return;
  const S=SECTS[m.sect], art=m.arts.find(x=>x.n===S.art[0]); if(art) art.p+=a==='장로'?3:2; addExp(gain()*.6); m.fame+=a==='장로'?8:3; log(`${S.n}의 ${a}가 되었다`,true);
  if(!m.headless) vfx(()=>toast(`<b>${a}</b> ${esc(S.n)}에서 서열이 올랐다${art?` · ${esc(S.art[0])}의 깊은 뜻을 전수받았다`:''}`,'t1',3400)); }
/* ---- 사문 임무: 받아서, 천하 지도의 그곳에 가서 하고, 돌아와 보고한다 ---- */
const QT={
  letter:{w:3,to:['sect','clan','city','capital'],n:q=>`${siteName(q.to)}에 서신을 전한다`,act:'서신을 전한다',sc:4,g:[4,10],risk:.2,bg:'temple',done:q=>pick([`${siteName(q.to)}의 문지기에게 사문의 서신을 건넸다. 답신을 품에 넣었다.`,'서신을 받아 든 이의 낯빛이 굳었다. 무슨 내용인지는 묻지 않았다.'])},
  escort:{w:2,to:['city','capital'],n:q=>`${siteName(q.to)}까지 사문의 물자를 나른다`,act:'물자를 넘긴다',sc:5,g:[8,16],risk:.45,bg:'road',done:q=>`짐수레를 ${siteName(q.to)}의 상단에 넘기고 인수증을 받았다.`},
  herb:{w:2,to:['sect','camp','den','demon'],n:q=>`${siteName(q.to)} 근처 산에서 영초를 구해 온다`,act:'영초를 찾는다',sc:4,g:[2,6],risk:.15,bg:'mountain',done:()=>pick(['벼랑 틈에서 사부가 말한 영초를 찾아냈다.','사흘을 헤맨 끝에 영초 한 뿌리를 캤다.'])},
  bandit:{w:2,to:['den'],n:q=>`${siteName(q.to)}의 도적을 토벌한다`,act:'소굴을 친다',sc:8,g:[10,24],duel:1,min:2,bg:'road',go:'칼을 고쳐 메고 소굴로 올라갔다.'},
  spar:{w:2,to:['city','capital'],n:q=>`${siteName(q.to)} 비무대에서 사문의 이름을 걸고 겨룬다`,act:'비무대에 오른다',sc:7,g:[6,14],duel:1,min:1,bg:'arena',go:'비무대 앞에서 사문의 이름을 댔다.'},
  spy:{w:1.5,to:['city','capital'],n:q=>`${siteName(q.to)}에 숨어든 ${foeSide()} 첩자를 벤다`,act:'첩자를 찾아낸다',sc:10,g:[8,18],duel:1,min:3,bg:'inn',go:'객잔과 뒷골목을 뒤져 첩자의 꼬리를 잡았다.'}
};
function questTake(){ if(!m.sect||m.quest||!mapMode()) return; const me=mySite(); if(!me) return; const dist=s=>Math.abs(s.x-me.x)+Math.abs(s.y-me.y), near=cath().spots.filter(s=>s.id!==me.id&&dist(s)<46&&s.sect!==m.sect);
  const opts=Object.keys(QT).filter(k=>(QT[k].min||0)<=m.lv&&near.some(s=>QT[k].to.includes(s.type))); if(!opts.length) return;
  const k=wpick(opts,x=>QT[x].w), c=near.filter(s=>QT[k].to.includes(s.type)).sort((a,b)=>dist(a)-dist(b)).slice(0,4);
  m.quest={k,to:pick(c).id,step:0,due:m.age+2}; log(`사문의 임무를 받았다: ${QT[k].n(m.quest)}`); sfx('ok'); if(!m.headless) toast(`<b>임무</b> ${esc(QT[k].n(m.quest))}`,'t1',3000); render(); save(); }
function questReport(){ const q=m.quest; if(!q||!q.step||!mapMode()) return; const T=QT[q.k]; m.quest=null; m.qn=(m.qn||0)+1;
  if(q.fail){ m.joy=cl(m.joy-2); log(`임무에 실패했다고 고했다: ${T.n(q)}`); if(!m.headless) toast('<b>임무 실패</b> 사부는 말없이 고개만 끄덕였다','t1',2800); addSc(-1); }
  else { const g=ri(T.g[0],T.g[1]); gold(g); addExp(gain()*.25); m.bond+=1.5; log(`임무를 마치고 돌아왔다: ${T.n(q)}`); if(!m.headless) toast(`<b>임무 완수</b> 공헌 +${T.sc} · 은자 +${g}냥`,'t1',3000); addSc(T.sc); }
  sfx('ok'); render(); save(); }
function questTick(){ const q=m.quest; if(!q) return; if(!m.sect){ m.quest=null; return; } if(m.age>q.due){ m.quest=null; addSc(-3); log('임무 기한을 넘겼다. 사문의 눈초리가 차갑다.'); } }
WSEAS.quest=()=>{ const q=m.quest; if(!q) return '하릴없이 한 철이 갔다.'; const T=QT[q.k]; if(T.duel){ m.wq='wQuest'; return T.go; } q.step=1; if(R()<T.risk) m.wq='wAmbush'; return T.done(q); };
WSTAGE.quest=()=>Sg((m.quest&&QT[m.quest.k].bg)||'road',{hero:{x:70,act:'wander',xmin:40,xmax:120}});
E('wQuest',{min:8,max:95,wld:1,when:()=>WGO&&!!m.quest,
  st:()=>{ const k=(m.quest||{}).k; return k==='spar'?Sg('arena',{cast:[N('c1',LOOK.swordsman(),124,{pose:'guard',tag:'상대'})]}):k==='spy'?Sg('inn',{time:'night',cast:[N('sp',LOOK.blackclad(),124,{pose:'guard',tag:'첩자'})]}):Sg('road',{cast:[N('chief',LOOK.chief(),122,{tag:'두목',pose:'guard'})].concat(mob('bd',()=>LOOK.bandit(),[142,156],{pose:'guard'}))}); },
  text:()=>({spar:'비무대 맞은편에 다른 문파의 대표가 올라섰다. 구경꾼들이 두 문파의 이름을 번갈아 외쳤다. "사문의 이름을 걸었으니 물러설 곳은 없소."',spy:`객잔 뒷방 문을 걷어차자 복면 쓴 자가 창으로 몸을 날리려다 멈췄다. "${foeSide()==='마교'?'정파의 개가 냄새는 잘 맡는군':'마졸 따위가 여기까지 오다니'}."`})[(m.quest||{}).k]||'소굴 어귀에서 망을 보던 자가 휘파람을 불었다. 두목이 칼을 메고 나왔다. "문파에서 보낸 놈이냐. 혼자 왔다고?"',
  ch:[{t:'맞선다',duel:()=>{ const k=(m.quest||{}).k||'bandit', pw=(k==='spy'?34:k==='bandit'?30:26)+m.lv*6+ri(-3,8); return Object.assign({foe:{name:k==='bandit'?'소굴의 두목':k==='spar'?'다른 문파의 대표':foeSide()+' 첩자',look:k==='bandit'?LOOK.chief():k==='spar'?LOOK.swordsman():LOOK.blackclad(),pow:pw,style:k==='bandit'?'bandit':'sword',mercy:k==='spar'?1:.4,art:k==='bandit'?'녹림도법':k==='spar'?'삼재검법':'암영검'}},k==='spar'?{}:{lethal:1,cause:k==='bandit'?'도적의 칼':'첩자의 칼'}); },
      go:(ok,res)=>{ const q=m.quest; if(q){ q.step=1; q.fail=!ok; } if(ok){ m.fame+=1; return {t:'일을 끝냈다. 이제 사문으로 돌아가 고하면 된다.',tone:'good'}; } if(res&&res.dead) return {t:'사문의 이름을 지키지 못했다.',tone:'bad'}; return {t:'졌다. 사문에 돌아가 있는 그대로 고해야 한다.',tone:'bad'}; }},
    {t:'물러난다',go:()=>{ const q=m.quest; if(q){ q.step=1; q.fail=true; } return {t:'발길을 돌렸다. 사문에 뭐라고 고할지가 걱정이다.',tone:'bad'}; }}]});
E('wAmbush',{min:8,max:95,wld:1,when:()=>WGO,st:()=>Sg('forest',{cast:mob('ab',()=>LOOK.bandit(),[120,136,152],{pose:'guard'})}),
  text:()=>'일을 마치고 돌아서는데, 숲에서 복면 쓴 자들이 길을 막았다. "문파 놈이군. 가진 것을 두고 가라."',ch:[
  {t:'칼을 뽑는다',when:()=>m.f.martial||!!m.inv.w,duel:()=>({foe:{name:'매복한 도적',look:LOOK.bandit(),pow:24+m.lv*5+ri(0,8),style:'bandit',mercy:.5,art:'녹림도법'},lethal:1,rob:.5,cause:'매복한 도적의 칼'}),
    go:(ok,res)=>{ if(ok){ m.fame+=1; return {t:'도적들이 숲으로 흩어졌다. 품 안의 물건은 무사했다.',tone:'good'}; } if(res&&res.dead) return {t:'숲은 조용해졌다.',tone:'bad'}; return {t:'흠씬 두들겨 맞고 주머니를 털렸다. 그래도 맡은 일은 끝낸 뒤였다.',tone:'bad'}; }},
  {t:'은자를 던져 주고 달아난다',go:()=>{ gold(-Math.min(m.gold,6+m.gold*.3)); return {t:'주머니를 던지고 뛰었다. 뒤에서 웃음소리가 났다.'}; }}]});
/* ---- 침공: 정파 문도에게는 마교가, 마도 문도에게는 무림맹 토벌대가 쳐들어온다 ---- */
const raidOK=()=>!!(m.sect&&SECTS[m.sect]&&m.f.martial&&!m.train&&m.age>=13&&m.age<=75&&(m.f.trainDone||m.age>=20));
// 해가 바뀔 때 따로 굴린다: 문도로 사는 동안 열다섯 해에 한 번꼴(난세에는 아홉 해에 한 번꼴), 한 번 겪으면 다섯 해는 조용하다
function sectYear(){ if(m.dead||m.pending||!raidOK()) return; const last=m.used.sectRaid; if(last!=null&&m.age-last<5) return; if(R()<(m.era==='peace'?.08:.13)&&startEv(EV.sectRaid)) m.used.sectRaid=m.age; }
E('sectRaid',{min:13,max:75,wld:1,when:()=>WGO&&raidOK(),
  st:()=>{ const S=SECTS[m.sect]||{}; return Sg('temple',{time:'night',name:(S.n||'사문')+' 산문',cast:mob('rd',()=>S.side==='마'?LOOK.whitesword():LOOK.cultist(),[118,134,150],{pose:'guard',emote:'anger'})}); },
  text:()=>{ const S=SECTS[m.sect]||{n:'사문'}; return S.side==='마'?`한밤중에 본산의 북이 울렸다. 무림맹 토벌대가 ${S.n}의 산문을 넘었다. 횃불이 골짜기를 메웠다.`:`한밤중에 급종이 울렸다. 천마신교의 검은 깃발이 ${S.n}의 산문을 넘었다. 사형제들이 칼을 들고 뛰쳐나왔다.`; },
  ch:[
  {t:'앞장서서 적의 우두머리를 막는다',duel:()=>{ const dm=(SECTS[m.sect]||{}).side==='마'; return {foe:{name:dm?'무림맹 선봉장':pick(['마교 혈검대주','마교 흑풍대주','마교 귀면호법']),look:dm?LOOK.whitesword():LOOK.cultist({size:'big'}),pow:32+m.lv*8+ri(0,10),style:'brute',mercy:.2,art:dm?'정의검':'천마검'},lethal:1,cause:dm?'토벌대의 칼':'마교의 칼'}; },
    go:(ok,res)=>{ const S=SECTS[m.sect]||{n:'사문'}; if(ok){ m.fame+=5; m.hy+=4; addSc(10); return {t:'적의 우두머리가 쓰러지자 검은 물결이 빠져나갔다. 날이 밝았을 때 산문은 아직 서 있었다.',big:`${S.n} 침공을 막아 냈다`,tone:'good'}; } if(res&&res.dead) return {t:'산문 앞 돌계단에서 쓰러졌다. 마지막으로 본 것은 불타는 전각이었다.',tone:'bad'}; addSc(3); return {t:'칼을 놓쳤지만, 버틴 사이 사형제들이 진을 다시 짰다. 사문은 가까스로 살아남았다.',tone:'bad'}; }},
  {t:'사형제들과 진을 짜 버틴다',p:()=>.3+m.lv*.09,go:ok=>{ if(ok){ hurt(8,'침공의 밤'); m.fame+=2; addSc(6); return {t:'어깨를 맞대고 새벽까지 버텼다. 적은 시체만 남기고 물러갔다.',tone:'good'}; } hurt(26,'침공의 밤'); addSc(2); return {t:'진이 무너졌다. 피투성이가 되어 뒷산으로 밀려났다. 전각 절반이 탔다.',tone:'bad'}; }},
  {t:'어린 제자들을 데리고 뒷산으로 피한다',go:()=>{ m.joy=cl(m.joy-4); addSc(1); return {t:'아이들 손을 잡고 어둠 속을 뛰었다. 등 뒤에서 칼 부딪는 소리가 밤새 이어졌다.'}; }}]});
