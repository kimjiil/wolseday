/* ==== murim:core — 도구, 강호의 기본값, 태어나는 세상, 상태 ==== */
const $m=id=>document.getElementById(id);
const R=()=>Math.random(), ri=(a,b)=>a+Math.floor(R()*(b-a+1)), pick=a=>a[Math.floor(R()*a.length)], cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const jo=(w,a,b)=>{w=String(w||'');const c=w.charCodeAt(w.length-1)-0xAC00;return (c>=0&&c<11172&&c%28)?a:b;};
const eul=w=>w+jo(w,'을','를'), iga=w=>w+jo(w,'이','가'), eun=w=>w+jo(w,'은','는'), wa=w=>w+jo(w,'과','와'), ro=w=>w+jo(w,'으로','로');
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('ko-KR');
function lsGet(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
function lsSet(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

const LV=['범인','삼류','이류','일류','절정','초절정','화경','현경','생사경'];
const LVX=[0,6,22,60,135,240,400,640,1000];
const LVP=[0,10,20,32,46,62,80,100,125];
const SURN=['남궁','제갈','독고','모용','사마','황보','당','진','이','왕','장','유','백','한','연','설','위','소','공손','하후'];
const GIV=['무','진','천','운','호','명','성','백','청','소','혁','윤','결','도','준','하','린','설','연','화','영','월','현','강','휘','령','건','서'];
const gname=()=>{let a=pick(GIV),b=pick(GIV);while(b===a)b=pick(GIV);return a+b;};
const SECTS={
  shaolin:{n:'소림사',side:'정',art:['나한권',12,'권'],inner:['역근공',10],robe:'#c98a2e',male:1,w0:'lglove'},
  wudang:{n:'무당파',side:'정',art:['태극검',15,'검'],inner:['순양무극공',8],robe:'#4f7590',w0:'wsword'},
  huashan:{n:'화산파',side:'정',art:['매화검법',16,'검'],inner:['자하신공',7],robe:'#a8496a',w0:'wsword'},
  emei:{n:'아미파',side:'정',art:['아미검법',14,'검'],inner:['정심공',7],robe:'#6f8a62',female:1,w0:'wsword'},
  beggar:{n:'개방',side:'정',art:['용음장',15,'장'],inner:['취선공',5],robe:'#8a7650',w0:'lglove'},
  namgung:{n:'남궁세가',side:'정',art:['창궁무애검',17,'검'],inner:['제왕심법',6],robe:'#2f4a7a',w0:'isword'},
  tang:{n:'사천당가',side:'중',art:['만천화우',17,'암기'],inner:['독공',6],robe:'#3d5a3a',w0:'ldart'},
  haomun:{n:'하오문',side:'중',art:['은형보',9,'보법'],robe:'#5d5d64',w0:'ldart'},
  nokrim:{n:'녹림채',side:'사',art:['녹림도법',13,'도'],robe:'#6b5430',w0:'bsaber'},
  demon:{n:'천마신교',side:'마',art:['천마신공',24,'마공'],robe:'#7a1e1e',w0:'lglove'}
};
const ERAS={
  peace:{n:'태평성대',d:'무림맹이 강호를 다스리는 시대. 큰 싸움은 드물고, 사람들은 흉년과 역병을 더 무서워한다.',child:.16,war:0,plague:.006,famine:.012,births:'1,180만'},
  chaos:{n:'정사대전기',d:'정파와 천마신교가 중원을 두고 싸우는 시대. 관도마다 피난민이 넘친다.',child:.26,war:.012,plague:.012,famine:.025,births:'860만'},
  demon:{n:'마교 천하',d:'천마신교가 중원을 손에 넣은 시대. 정파는 숨어 지내고, 마교의 법이 곧 관의 법이다.',child:.2,war:.005,plague:.009,famine:.018,births:'940만'}
};
const REGIONS=[
  {id:'henan',n:'하남',w:15,d:'숭산 아래, 소림사의 종소리가 들리는 땅',sect:'shaolin'},
  {id:'hubei',n:'호북',w:10,d:'무당산이 보이는 강변 고을',sect:'wudang',biome:'water'},
  {id:'shaanxi',n:'섬서',w:7,d:'화산 연화봉 아래 메마른 고원',sect:'huashan',biome:'dry'},
  {id:'sichuan',n:'사천',w:11,d:'안개 낀 분지. 아미산과 당가타가 있다',sect:'emei'},
  {id:'anhui',n:'안휘',w:8,d:'남궁세가의 깃발이 걸린 고을',sect:'namgung'},
  {id:'jiangnan',n:'강남',w:17,d:'운하와 비단 장터가 끝없이 이어진 물의 고장',biome:'water'},
  {id:'shandong',n:'산동',w:11,d:'태산 아래 넓은 밀밭'},
  {id:'hebei',n:'하북',w:9,d:'북방 오랑캐와 맞닿은 거친 들판',biome:'dry'},
  {id:'guangdong',n:'광동',w:6,d:'남쪽 바다의 습한 항구',biome:'jungle'},
  {id:'yunnan',n:'운남',w:3,d:'독충과 산족의 땅, 남만',biome:'jungle'},
  {id:'xinjiang',n:'천산',w:1.5,d:'눈 덮인 천산 아래 새외의 오아시스',biome:'snow'},
  {id:'beihai',n:'북해',w:.5,d:'일 년 내내 얼음이 녹지 않는 북쪽 끝',biome:'snow'}
];
// w: [이 해에 태어나는 아이 기준, 지금 사는 사람 기준] · pct: 재산 백분위 · inc: 한 해 벌이(냥) · it: 집안에서 물려받는 물건
const FAM=[
  {id:'tenant',n:'소작농',d:'남의 땅을 부친다. 수확의 절반은 지주 몫이다.',w:[36,30],pct:[2,30],gold:2,inc:6},
  {id:'farmer',n:'자작농',d:'작지만 제 땅이 있다. 흉년만 피하면 굶지는 않는다.',w:[22,24],pct:[25,60],gold:12,inc:10},
  {id:'beggar',n:'유랑민',d:'고향을 잃고 떠돈다. 다리 밑이 집이다.',w:[8,5],pct:[0,4],gold:0,inc:3,hint:'beggar'},
  {id:'artisan',n:'장인',d:'대장간 망치 소리 속에서 자란다.',w:[8,9],pct:[35,70],gold:20,inc:14},
  {id:'merchant',n:'상인',d:'장터에 점포가 있다. 셈을 먼저 배운다.',w:[7,9],pct:[60,93],gold:70,inc:26,it:['sachet']},
  {id:'hunter',n:'사냥꾼',d:'산짐승을 쫓으며 자란다.',w:[4,4],pct:[12,40],gold:5,inc:8,st:{body:1},it:['bsaber']},
  {id:'inn',n:'객잔 일꾼',d:'객잔 부엌에서 강호의 소문을 듣고 자란다.',w:[3.5,3.5],pct:[15,45],gold:5,inc:9,hint:'haomun'},
  {id:'bandit',n:'녹림 산채',d:'산적 소굴에서 태어났다. 관의 장부에는 없는 아이다.',w:[1.6,1.2],pct:[10,40],gold:10,inc:10,hint:'nokrim',ak:8,it:['bsaber']},
  {id:'escort',n:'표국 표사',d:'아버지는 표물을 지키는 표사다. 집에 낡은 검이 있다.',w:[2,2.5],pct:[45,75],gold:40,inc:18,art:['삼재검법',6,'검'],it:['isword']},
  {id:'doctor',n:'의원',d:'약초 냄새 속에서 자란다. 혈도를 먼저 외운다.',w:[1.5,2],pct:[60,88],gold:50,inc:20,f:{med:1},bag:{salve:2,antidote:1}},
  {id:'official',n:'지방 관리',d:'아버지는 현의 관리다. 글을 먼저 배운다.',w:[1,1.8],pct:[85,98],gold:180,inc:40,st:{wit:1},it:['jadep']},
  {id:'clan',n:'무림세가',d:'태어날 때부터 가문의 검을 쥐었다.',w:[.5,.7],pct:[92,99.6],gold:300,inc:45,sect:'namgung',sur:'남궁',region:'anhui',it:['gsword','lvest']},
  {id:'tangc',n:'사천당가',d:'독 냄새를 맡으며 자란다. 당가 사람은 쉽게 믿지 않는다.',w:[.25,.35],pct:[85,99],gold:150,inc:35,sect:'tang',sur:'당',f:{poisonwise:1},region:'sichuan',it:['gdart'],bag:{antidote:2}},
  {id:'blood',n:'자작농',d:'작지만 제 땅이 있다. 어머니는 가끔 서쪽 하늘을 오래 본다.',w:[.15,.15],pct:[25,55],gold:10,inc:10,f:{blood:1},hidden:'사실은 천마신교 교주의 핏줄'}
];
const TRAITS=[
  {id:'cold',n:'천음절맥',d:'타고난 오성이 뛰어나지만, 스무 살을 넘기기 어려운 체질',st:{wit:3}},
  {id:'might',n:'천생신력',d:'어려서부터 장정 셋의 힘',st:{body:3}},
  {id:'immune',n:'만독불침',d:'어떤 독도 통하지 않는 몸'},
  {id:'bone',n:'무골',d:'무공이 남보다 빨리 몸에 붙는다'},
  {id:'blood',n:'혈마체',d:'마공과 이상하리만치 잘 맞는 몸'},
  {id:'weak',n:'병약',d:'잔병이 잦고 명이 짧다',st:{body:-2}},
  {id:'star',n:'천운',d:'하늘이 유난히 돌보는 아이',st:{luck:3}}
];

/* ---------- 상태 ---------- */
let m=null, roll=null, paused=false, spd=0, acc=0, DUEL=null;
const setup={era:'any',basis:'births',pace:'normal'};
const PACE={fast:1500,normal:3000,slow:6000}, SPD=[1,2,4];
function stat3(){return cl(ri(1,4)+ri(1,4)+ri(0,2),1,10);}
function wpick(arr,wf){ const t=arr.reduce((a,x)=>a+wf(x),0); let r=R()*t; for(const x of arr){ r-=wf(x); if(r<=0) return x; } return arr[arr.length-1]; }
const regOf=id=>REGIONS.find(r=>r.id===id);
function makeBirth(era,basis){
  const bi=basis==='births'?0:1;
  const fam=wpick(FAM,f=>f.w[bi]);
  const reg=fam.region?regOf(fam.region):wpick(REGIONS,r=>r.w);
  const sumF=FAM.reduce((a,f)=>a+f.w[bi],0), sumR=REGIONS.reduce((a,r)=>a+r.w,0);
  const P0=(fam.w[bi]/sumF)*(fam.region?1:reg.w/sumR);
  const sex=R()<.5?'m':'f', st={body:stat3(),wit:stat3(),luck:stat3(),charm:stat3()};
  for(const k in (fam.st||{})) st[k]=cl(st[k]+fam.st[k],1,10);
  let trait=null; if(R()<.15){ trait=pick(TRAITS); for(const k in (trait.st||{})) st[k]=cl(st[k]+trait.st[k],1,10); }
  const sur=fam.sur||pick(SURN), sib=ri(0,4);
  return {o:fam.id, reg:reg.id, era, sex, sur, given:gname(), st, trait:trait&&trait.id, P:P0,
    pct:+(fam.pct[0]+R()*(fam.pct[1]-fam.pct[0])).toFixed(1),
    father:{name:sur+gname(),age:ri(19,42),dead:R()<(era==='chaos'?.1:.04)}, mother:{name:pick(SURN)+gname(),age:ri(16,36),dead:R()<.02}, sib, order:ri(1,sib+1)};
}
const OR=id=>FAM.find(x=>x.id===id), TR=id=>TRAITS.find(x=>x.id===id);
function fresh(b){
  const o=OR(b.o);
  const s={b, era:b.era, name:b.sur+b.given, sex:b.sex, age:0, hp:cl(82+ri(-8,8)+(b.trait==='weak'?-20:0)+(b.trait==='might'?8:0)), joy:62, bond:55, exp:0, lv:0, ng:0, gold:o.gold, hy:0, ak:o.ak||0, fame:0, sect:null, arts:[], rels:[], f:{...(o.f||{})}, log:[], q:[], used:{}, phase:'play', sim:0, kids:0, disc:0, sib:b.sib, scene:'village', alias:null, focus:null, answers:{}, auto:false,
    inv:{w:null,a:null,c:null,stash:[],bag:{salve:0,pill:0,antidote:0,...(o.bag||{})},mat:0}, wins:0, losses:0, kills:0, spared:[], ep:{}};
  s.per={협:ri(-15,15)+(o.id==='bandit'?-12:0),담:ri(-15,15),정:ri(-15,15)};
  if(b.trait==='blood') s.f.bloodBody=1;
  if(o.art){ s.arts.push({n:o.art[0],p:o.art[1],k:o.art[2]}); s.f.martial=1; s.exp=3; }
  if(o.sect){ s.sect=o.sect; const S=SECTS[o.sect]; s.arts.push({n:S.art[0],p:S.art[1],k:S.art[2]}); if(S.inner) s.arts.push({n:S.inner[0],p:0,k:'내공',ng:S.inner[1]}); s.f.martial=1; s.exp=4; }
  (o.it||[]).forEach(id=>{ const it=ITEMS[id]; if(!s.inv[it.s]) s.inv[it.s]=id; else s.inv.stash.push(id); });
  s.rels.push({role:'아버지',name:b.father.name,v:70,dead:b.father.dead?1:0,age0:b.father.age,sx:'m'},{role:'어머니',name:b.mother.name,v:75,dead:b.mother.dead?1:0,age0:b.mother.age,sx:'f'});
  return s;
}
const ST=k=>m.b.st[k]+(k==='charm'&&hasFx('charm')?1:0);
const bump=(k,n)=>{ m.b.st[k]=cl(m.b.st[k]+(n||1),1,10); };
const hasT=t=>m.b.trait===t;
const bestArt=()=>m.arts.filter(a=>a.k!=='내공'&&a.k!=='보법').reduce((a,b)=>b.p>(a?a.p:-1)?b:a,null)||m.arts.filter(a=>a.k==='보법')[0]||null;
const ngStr=n=>{n=Math.round(n); if(n<60) return `${n}년`; const g=Math.floor(n/60), r=n%60; return `${g}갑자${r?` ${r}년`:''}`;};
function log(t,big){ m.log.push({a:m.age,t,big:!!big}); }
function addExp(n){ if(!m.f.martial) return; m.exp=Math.max(0,m.exp+n); }
function learn(n,p,k,ng){ if(m.arts.some(a=>a.n===n)) return false; m.arts.push({n,p,k,ng}); m.f.martial=1; if(ng) m.ng+=ng; if(k==='마공') m.f.magong=1; if(m.inv) equipBest(); vfx(()=>artToast(n,p,k,ng)); return true; }
const SEXROLE={사형:'m',사저:'f',사매:'f',사제:'m',아버지:'m',어머니:'f'};
function rel(role,name,v,o){ const r=Object.assign({role,name:name||(pick(SURN)+gname()),v:v==null?60:v,a0:m.age},o||{}); if(!r.sx) r.sx=SEXROLE[role]||(role==='배우자'||role==='정인'?(m.sex==='m'?'f':'m'):(seedOf(r.name)%2?'m':'f')); m.rels.push(r); return r; }
const relOf=role=>m.rels.find(r=>r.role===role&&!r.dead);
function gold(n){ m.gold=Math.max(0,Math.round(m.gold+n)); }
function hurt(n,cause){ m.hp=cl(m.hp-n); if(m.hp<=0) m.deathCause=cause||'깊은 상처'; }
function side(){ const d=m.hy-m.ak; return d>=15?'정':d<=-15?'사':'중'; }
function prob(p){ return R()<cl(p,.03,.97); }
const PCT=[[0,2],[3,8],[8,18],[15,30],[30,45],[60,60],[120,75],[250,88],[500,95],[1200,99]];
function pctOf(g){ for(let i=1;i<PCT.length;i++){ if(g<=PCT[i][0]){ const [a,pa]=PCT[i-1],[b,pb]=PCT[i]; return pa+(pb-pa)*(g-a)/(b-a); } } return 99.5; }
const pctNow=()=>m.age<16?m.b.pct:pctOf(m.gold);
const topStr=p=>{ const t=100-p; return t<1?`상위 ${t.toFixed(1)}%`:t>=50?`하위 ${Math.max(1,Math.round(p))}%`:`상위 ${Math.round(t)}%`; };
const oneIn=P0=>{ const n=Math.round(1/P0); return n.toLocaleString('ko-KR'); };
const pctStr=P0=>{ const v=P0*100; return v>=1?v.toFixed(1):v>=.1?v.toFixed(2):v.toFixed(3); };
function makeAlias(){
  const a=bestArt(), k=a?a.k:'권';
  const evil=m.ak>m.hy+10, hi=m.lv>=6;
  const Pf=evil?['혈영','흑풍','귀면','독안','적혈','음풍']:['청풍','일월','백운','태산','신룡','유성','설화','현천'];
  const S=({검:hi?'검성':'검협',도:hi?'도왕':'도객',권:hi?'권왕':'신권',장:hi?'장왕':'신장',암기:'비영',보법:'신투',마공:hi?'마존':'마두'})[k]||'협객';
  const pre=m.alias?m.alias.slice(0,2):pick(Pf);
  return pre+(evil&&!/마/.test(S)?'마'+S.slice(-1):S);
}
// 화면 연출은 장면이 정해진 뒤에 한꺼번에 내보낸다 (머릿속 시뮬레이션에서는 무시)
const VQ=[];
function vfx(fn){ if(m&&!m.headless) VQ.push(fn); }
function flushVfx(){ while(VQ.length){ try{ VQ.shift()(); }catch(e){} } }

/* ---------- 소리 (기본은 꺼짐) ---------- */
let SND=!!lsGet('murim_snd'), AC=null;
function sfx(k){ if(!SND||(m&&m.headless)) return; try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); const t=AC.currentTime;
  const tone=(f,d,type,v,f2,dl)=>{ const o=AC.createOscillator(), g=AC.createGain(), s=t+(dl||0); o.type=type||'square'; o.frequency.setValueAtTime(f,s); if(f2) o.frequency.exponentialRampToValueAtTime(f2,s+d); g.gain.setValueAtTime(v||.05,s); g.gain.exponentialRampToValueAtTime(.0001,s+d); o.connect(g); g.connect(AC.destination); o.start(s); o.stop(s+d+.02); };
  const noise=(d,v,hp)=>{ const n=Math.floor(AC.sampleRate*d), b=AC.createBuffer(1,n,AC.sampleRate), ch=b.getChannelData(0); for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n); const s=AC.createBufferSource(), g=AC.createGain(), f=AC.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp||1200; s.buffer=b; g.gain.value=v||.08; s.connect(f); f.connect(g); g.connect(AC.destination); s.start(t); };
  switch(k){
    case 'dice': for(let i=0;i<5;i++) tone(500+i*90,.03,'square',.03,null,i*.06); break;
    case 'ok': tone(660,.09,'square',.05); tone(990,.14,'square',.05,null,.09); break;
    case 'fail': tone(300,.12,'sawtooth',.05,180); tone(170,.2,'sawtooth',.05,110,.12); break;
    case 'slash': noise(.14,.09,2500); break;
    case 'hit': tone(150,.12,'square',.08,60); noise(.08,.06,600); break;
    case 'block': tone(1400,.06,'triangle',.07,900); tone(2100,.1,'triangle',.04,1600,.02); break;
    case 'clash': tone(1800,.08,'triangle',.07,1100); noise(.1,.07,3000); break;
    case 'ult': tone(220,.4,'sawtooth',.06,880); noise(.35,.06,1800); break;
    case 'get': [660,880,1320].forEach((f,i)=>tone(f,.12,'square',.045,null,i*.08)); break;
    case 'giyeon': [523,659,784,1047,1319].forEach((f,i)=>tone(f,.22,'triangle',.05,null,i*.09)); break;
    case 'lv': [392,523,659,784].forEach((f,i)=>tone(f,.16,'square',.045,null,i*.1)); break;
    case 'death': tone(110,1.2,'sine',.12,70); tone(165,1.2,'sine',.05,100,.02); break;
    case 'gong': tone(196,.9,'sine',.1,180); tone(392,.5,'triangle',.03,380); break;
  } }catch(e){} }
