/* ==== murim:world — 마을 밖에서 하는 일과 강호에서만 일어나는 사건 ==== */
const WAGE=15;
let WGO=false;
const joinable=s=>!!(s&&s.type==='sect'&&s.sect&&SECTS[s.sect]&&SECTS[s.sect].side!=='마');
const worldSect=()=>{ const s=inCathay()?curSite():null; return (s&&s.sect&&SECTS[s.sect]&&s.sect)||m.sect||regOf(m.b.reg).sect||'huashan'; };
const sectOpen=()=>{ const S=SECTS[worldSect()]; return !(S.male&&m.b.sex!=='m')&&!(S.female&&m.b.sex!=='f'); };
const canLeave=()=>m.age>=WAGE||!!(m.f.martial&&m.f.trainDone);
function leaveVillage(){ if(!canLeave()) return; const h=homeTile(); m.map={id:'cathay',x:h.x,y:h.y,dir:'d'}; m.ai=null; CT=null; CSEL=null; sfx('ok'); render(); save(); }
function enterVillage(){ m.map={id:'vil',x:21,y:28,dir:'u'}; m.ai=null; CT=null; CSEL=null; sfx('ok'); render(); save(); }
function placeAfterTrain(){ m.smap=null; const s=m.sect&&cath().spots.find(x=>x.sect===m.sect), h=s||homeTile(); m.map={id:'cathay',x:h.x,y:h.y,dir:'d'}; CT=null; CSEL=null; }
/* 사건이 일어나는 곳: 열다섯부터는 마을 밖 일은 마을 밖에서 생긴다 */
const WBG={tomb:'wild',cliff:'wild',cave:'wild',hermit:'wild',mountain:'wild',pond:'wild',peak:'wild',road:'wild',fort:'wild',battle:'wild',arena:'city',den:'city',stable:'city'};
const WPOOL={city:['arena','den','stable','innroom','inn','market','forge','shop','village'],deep:['hermit','mountain','pond','peak','forest'],pass:['road','fort','battle','forest'],tomb:['tomb','cliff','cave','field']};
function evBg(ev){ let bg='village'; try{ const s=ev.st&&ev.st(); if(s&&s.bg) bg=s.bg; }catch(e){} return bg; }
function markFor(ev){ const bg=evBg(ev); return {id:ev.id,spot:BGSPOT[bg]||'market',w:canLeave()&&WBG[bg]?markSite(WBG[bg]):null}; }
const markSpotId=M=>!m.mark?null:m.mark.w?'gate':m.mark.spot;
const markHere=(M,s)=>!!(m.mark&&s&&!M.indoor&&!M.sect&&!m.mark.w&&m.mark.spot===s.id);
const evFresh=e=>!(e.once&&m.used[e.id]!=null)&&!(e.rep&&m.used[e.id]!=null&&m.age-m.used[e.id]<e.rep)&&!(!e.once&&!e.rep&&m.used[e.id]!=null);
function startEv(ev){ if(!ev||m.dead||m.pending||m.train) return false; WGO=true; let ok=false; try{ ok=m.age>=ev.min&&m.age<=ev.max&&(!ev.when||ev.when()); } finally{ WGO=false; } if(!ok) return false;
  if(!ev.wld) m.used[ev.id]=m.age; m.lastRes=null; m.pending=ev; m.evCh=null; m.evSt=null; m.evDuel=null; m.evText=typeof ev.text==='function'?ev.text():ev.text; if(ev.gi||gradeOf(ev)) vfx(()=>evIntro(ev)); return true; }
/* ---- 강호에서 철마다 하는 일 ---- */
const WFOUND={city:'저잣거리를 돌다 발이 멈췄다.',deep:'산을 헤매다 낯선 곳에 닿았다.',pass:'고갯길을 살피는데 인기척이 났다.',tomb:'무덤가를 살피다 이상한 것을 보았다.'};
const WNONE={city:['저잣거리를 한 바퀴 돌았다. 별일은 없었다.','찻집에 앉아 오가는 사람을 구경했다.','읍성 담벼락의 방을 읽었다. 현상금 붙은 얼굴이 낯설었다.'],deep:['산을 헤맸지만 산새 소리뿐이었다.','골짜기 끝까지 갔다가 해가 져서 돌아왔다.','이름 모를 봉우리에서 구름을 내려다보았다.'],pass:['고갯길은 조용했다. 까마귀만 울었다.','산채 쪽에서 연기가 올랐지만 아무도 내려오지 않았다.','길가에서 부러진 화살 하나를 주웠다.'],tomb:['무덤은 말이 없었다. 향 한 대를 피우고 돌아섰다.','비석의 글자는 닳아 읽을 수 없었다.','도굴꾼이 파다 만 구덩이만 보고 돌아왔다.']};
const WSEAS={
  wwork:()=>{ if(m.f.martial&&m.lv>=2){ gold(5+m.lv*2.2+ri(0,4)); addExp(gain()*.08); m.fame+=.3; m.joy-=.25; return pick(['표국 깃발 아래서 이웃 고을까지 짐수레를 지켰다.','표행을 따라 관도를 오갔다. 별일은 없었다.','밤길 표행에서 그림자 몇을 쫓아 보냈다.']); } gold(3+ST('body')*.3); m.joy-=.25; return pick(['읍성 나루에서 쌀섬을 날랐다.','장터에서 짐꾼 노릇을 했다.','객잔 마구간을 치우고 품삯을 받았다.']); },
  herb:()=>{ gold(3+ST('luck')*.5+ri(0,5)); if(R()<.18){ hurt(7,'벼랑에서 구름'); return '약초를 캐다 벼랑에서 미끄러졌다. 망태기는 건졌다.'; } if(m.f.med) m.hp+=2; return pick(['이슬 젖은 산비탈에서 약초를 캤다.','심마니 뒤를 밟아 좋은 자리를 알아냈다.','더덕과 하수오를 한 망태기 캤다.']); },
  wvisit:()=>{ m.bond+=2.5; m.joy+=1.5; addExp(gain()*.12); return pick(['사문에 들러 사부께 절을 올렸다.','후배들의 초식을 봐 주었다.','사문 장경각에서 한 철을 보냈다.']); },
  explore:o=>{ const bgs=WPOOL[o.pl]||[]; WGO=false; const pool=Object.values(EV).filter(e=>!e.wld&&e.min!==e.max&&evOK(e)&&evFresh(e)&&markable(e)&&!(m.mark&&m.mark.id===e.id)&&bgs.includes(evBg(e)));
    const e=pool.length&&R()<.6?pickGraded(pool):null; if(e){ m.wq=e.id; return WFOUND[o.pl]||'낯선 곳에 닿았다.'; }
    if(o.pl==='deep'){ m.hp+=1.5; if(m.f.martial) m.ng+=.05; } else if(o.pl==='city') m.joy+=1; else if(o.pl==='pass'){ if(R()<.3) gold(ri(1,4)); } else if(R()<.2) gold(ri(1,6));
    return pick(WNONE[o.pl]||['하릴없이 한 철이 갔다.']); },
  wev:o=>{ m.wq=o.ev; return {wBandit:'칼을 고쳐 메고 소굴로 올라갔다.',wSpar:'읍성 비무대 앞에 섰다.',wExam:'산문 앞 돌계단을 올랐다.'}[o.ev]||'길을 나섰다.'; }
};
const WSTAGE={
  wwork:()=>Sg('road',{hero:{x:70,act:'wander',xmin:40,xmax:120},cast:[N('pd',LOOK.peddler(),134,{})]}),
  herb:()=>Sg('mountain',{hero:{x:110,act:'wander',xmin:90,xmax:140}}),
  wvisit:()=>Sg('temple',{hero:{x:70,face:1},cast:[N('sa',masterLook(),124,{tag:'사부'})]}),
  explore:o=>Sg({city:'market',deep:'mountain',pass:'road',tomb:'tomb'}[o.pl]||'road',{hero:{x:70,act:'wander',xmin:40,xmax:120}}),
  wev:o=>Sg({wBandit:'road',wSpar:'arena',wExam:'temple'}[o.ev]||'road',{hero:{x:60,face:1}})
};
/* ---- 강호에서만 일어나는 일(되풀이된다) ---- */
function wJoin(ok,pre){ const k=worldSect(), S=SECTS[k]; if(!ok) return {t:pre+' 장로는 고개를 저었다. "인연이 아니구나. 내려가거라."',tone:'bad'}; joinSect(k); return {t:pre+' 장로가 문을 열었다. "들어오너라."',big:`${S.n}에 입문했다`,tone:'good'}; }
E('wBandit',{min:WAGE,max:95,wld:1,when:()=>WGO,st:()=>Sg('road',{cast:[N('chief',LOOK.chief(),122,{tag:'두목',emote:'anger',pose:'guard'})].concat(mob('bd',()=>LOOK.bandit(),[142,156],{pose:'guard'}))}),
  text:()=>'소굴 어귀에서 망을 보던 자가 휘파람을 불었다. 두목이 칼을 메고 나왔다. "제 발로 찾아온 놈은 오랜만이군."',ch:[
  {t:'칼을 뽑는다',when:()=>m.f.martial||!!m.inv.w,duel:()=>({foe:{name:'산채 두목',look:LOOK.chief(),pow:34+m.lv*5+ri(0,8),style:'bandit',mercy:.5,art:'녹림도법'},lethal:1,rob:.5,cause:'녹림도의 칼',loot:{g:[12,45],it:[['bsaber',.25],['salve',.5],['lvest',.2],['chain',.08]]},extras:mob('bd',()=>LOOK.bandit(),[170,184],{act:'cheer'})}),
    go:(ok,res)=>{ if(ok){ m.hy+=3; m.fame+=2; return {t:res.killed?'두목이 쓰러졌다. 소굴은 하룻밤 사이에 비었다. 다음 철이면 또 누군가 들어앉을 것이다.':'두목이 칼을 버리고 무릎을 꿇었다. 산채 곳간을 털어 내려왔다.',tone:'good'}; } if(res.dead) return {t:'산채의 칼은 생각보다 많았다.',tone:'bad'}; return {t:res.fled?'숲으로 뛰어들어 겨우 따돌렸다.':'흠씬 두들겨 맞고 길 아래로 굴러 내려왔다.',tone:'bad'}; }},
  {t:'통행세를 내고 물러난다',go:()=>{ gold(-Math.min(m.gold,8+m.gold*.2)); return {t:'두목은 은자를 세어 보더니 턱짓으로 길을 가리켰다.'}; }},
  {t:'말로 구슬려 본다',p:()=>.25+ST('charm')*.05,go:ok=>{ if(ok){ m.fame+=1; gold(6); return {t:'어느새 두목과 술잔을 나누고 있었다. 내려올 때는 노잣돈까지 받았다.',tone:'good'}; } hurt(10,'녹림도의 몽둥이'); return {t:'말이 끝나기도 전에 몽둥이가 날아왔다.',tone:'bad'}; }}]});
E('wSpar',{min:WAGE,max:95,wld:1,when:()=>WGO,st:()=>Sg('arena',{cast:[N('c1',LOOK.swordsman(),124,{pose:'guard',tag:'도전자'}),N('c2',LOOK.merchant(),160,{tag:'물주'})]}),
  text:()=>'읍성 장터 한복판에 비무대가 섰다. 물주가 은자 주머니를 흔들었다. "이기면 판돈은 그대 것이오. 지면 구경꾼들 웃음거리고."',ch:[
  {t:'비무대에 오른다',when:()=>m.f.martial,duel:()=>({foe:{name:pick(['떠돌이 검객','표국 표사','객잔의 싸움꾼','이름 모를 낭인']),look:LOOK.swordsman(),pow:28+m.lv*6+ri(-4,10),style:'sword',mercy:1,art:'삼재검법'}}),
    go:(ok,res)=>{ if(ok){ const g=6+m.lv*3+ri(0,6); gold(g); m.fame+=2; return {t:`상대의 검이 비무대 밖으로 날아갔다. 판돈 ${g}냥을 챙겼다.`,tone:'good'}; } m.joy=cl(m.joy-3); return {t:'비무대 바닥이 차가웠다. 구경꾼들이 한참 웃었다.',tone:'bad'}; }},
  {t:'구경만 한다',go:()=>{ addExp(gain()*.1); m.joy=cl(m.joy+1); return {t:'남의 싸움을 보는 것도 공부였다.'}; }}]});
E('wExam',{min:WAGE,max:29,wld:1,when:()=>WGO&&!m.sect&&sectOpen(),st:()=>{ const k=worldSect(); return Sg('temple',{name:SECTS[k].n+' 산문',cast:[N('ex',npcLook({name:'시험관'+k,sex:SECTS[k].female?'f':'m',age:60,sect:k,weapon:'sword',hair:k==='shaolin'?'bald':null}),120,{tag:SECTS[k].n})]}); },
  text:()=>`${SECTS[worldSect()].n} 산문 앞에 무릎을 꿇었다. 한참 만에 나온 장로가 위아래로 훑어보았다. "${m.age<20?'나이가 차긴 했다만':'나이가 너무 찼다만'}, 문은 두드리는 자에게 열리는 법. 무엇으로 보이겠느냐."`,ch:[
  {t:'몸으로 보인다',p:()=>.12+ST('body')*.06-(m.age>=20?.15:0),go:ok=>wJoin(ok,'사흘 밤낮 산문 앞 돌계단을 오르내렸다.')},
  {t:'머리로 보인다',p:()=>.12+ST('wit')*.06-(m.age>=20?.15:0),go:ok=>wJoin(ok,'장로가 한 번 보여 준 초식을 그 자리에서 따라 했다.')},
  {t:'사흘을 꿇어앉아 버틴다',p:()=>.2+ST('luck')*.03,go:ok=>{ hurt(8,'산문 앞의 추위'); return wJoin(ok,'사흘째 새벽, 무릎이 돌바닥에 얼어붙었다.'); }}]});
