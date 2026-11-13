/* ==== murim:life — 한 해의 흐름: 중심, 세상일, 갈림길, 죽음, 저장 ==== */
const FOCUS=[
  {id:'train',n:'수련',h:'무공을 닦는다. 무공을 모르면 무관을 기웃거린다.'},
  {id:'work',n:'생업',h:'일해서 은자를 모은다.'},
  {id:'family',n:'가족',h:'곁의 사람들과 시간을 보낸다. 행복과 인연이 오른다.'},
  {id:'rest',n:'양생',h:'몸을 돌본다. 건강이 오른다.'}
];
function ageMul(){ return m.age<25?1.1:m.age<40?.9:m.age<55?.65:.4; }
function gain(){ return (ST('wit')*.55+ST('body')*.45)*.8*(hasT('bone')?1.35:1)*(m.sect?1.2:1)*(m.f.master?1.5:1)*ageMul()*(m.hp<40?.6:1)*(1+eq('xp')); }
function autoFocus(){ return m.f.martial?pick(['train','train','work','family','rest']):pick(['work','work','work','family','train','rest']); }
const WORK={tenant:['지주의 논에서 허리를 펴지 못했다.','추수의 절반을 지주에게 바쳤다.'],farmer:['밭을 갈고 씨를 뿌렸다.','제 땅에서 거둔 보리가 꽤 됐다.'],beggar:['동냥 그릇을 들고 장터를 돌았다.','부잣집 잔치 뒤에 남은 음식을 얻었다.'],artisan:['대장간에서 쇠를 두드렸다.','솥 수십 개를 고쳐 팔았다.'],merchant:['장부를 맞추느라 밤을 새웠다.','비단 값이 올라 재미를 봤다.'],hunter:['산에서 노루를 잡았다.','호랑이 발자국을 보고 사흘을 숨어 있었다.'],inn:['객잔에서 술상을 날랐다.','취객들의 무림 이야기를 들으며 그릇을 닦았다.'],bandit:['산채에서 길목을 지켰다.','지나가는 상단에게 통행세를 걷었다.'],escort:['표행을 따라 먼 길을 다녀왔다.','표국 마당에서 짐을 꾸렸다.'],doctor:['약방에서 환자를 돌봤다.','산에서 약초를 캤다.'],official:['관아에서 문서를 썼다.','세금 장부를 맞췄다.'],clan:['가문의 장원 일을 거들었다.','가문의 상단을 따라 다녀왔다.'],tangc:['독초밭을 돌봤다.','당가의 암기를 손질했다.'],blood:['밭을 갈고 씨를 뿌렸다.','제 땅에서 거둔 보리가 꽤 됐다.']};
function doFocus(){
  const a=m.age, o=OR(m.b.o), fc=a<6?'child':m.focus||'work'; m.focusRes={fid:fc}; const say=R()<.35;
  const work=a<10?0:a<16?.5:a<60?1:.6;
  const inc=o.inc*work*(fc==='work'?1.8:.6)+(m.f.shop?20:0)+(m.f.smith&&fc==='work'?10:0)+(m.f.martial&&fc==='work'&&m.lv>=2?m.lv*6:0)+(m.f.med&&fc==='work'?8:0);
  const cost=a<16?0:o.inc*.55+m.kids*2;
  gold(inc-cost);
  if(a>=16&&m.gold<=0&&inc<cost){ m.hp-=5; m.joy-=6; if(say) log('끼니를 거르는 날이 많았다.'); }
  switch(fc){
    case 'child': m.joy+=2; break;
    case 'train':
      if(m.f.martial){ addExp(gain()); m.ng+=.3+ST('wit')/30; m.hp-=1; if(say) log(pick(['새벽마다 같은 초식을 천 번씩 펼쳤다.','폭포 아래 서서 한 해를 보냈다.','달빛 아래서 검로를 다시 그려 보았다.','손이 기억할 때까지 같은 동작을 반복했다.'])); }
      else if(a>=8){ if(m.gold>=10&&R()<.35){ gold(-10); learn('삼재검법',6,'검'); addExp(2); if(!m.inv.w) give('wsword',{quiet:1}); log('마을 무관에 들어가 삼재검법을 배웠다.',true); } else { m.joy+=1; if(say) log('어깨너머로 무관 사범의 동작을 따라 했다.'); } }
      else { m.joy+=2; if(say) log('나뭇가지를 칼 삼아 휘두르며 놀았다.'); }
      break;
    case 'work': if(a<10){ if(say) log('집안일을 거들었다.'); } else if(say) log(pick(WORK[m.b.o]||WORK.farmer)); m.joy-=1; break;
    case 'family': m.bond+=7; m.joy+=4; if(say) log(pick(['가족과 둘러앉아 저녁을 먹는 날이 많았다.','부모님의 일손을 덜어 드렸다.','동생들을 업어 키웠다.','이웃 잔치에 빠짐없이 갔다.'])); break;
    case 'rest': m.hp+=9; m.joy+=2; if(say) log(pick(['약수터에 다니며 몸을 돌봤다.','일을 줄이고 잠을 늘렸다.','도관에서 호흡법을 배웠다.'])); break;
  }
}
/* ---------- 사건 틀 ---------- */
// 사건: min/max 나이, w 가중치, once/rep, when(), st() 장면, gi 기연, text(), ch:[{t, s?, p?()=>확률 | duel?()=>결투, when?, go(ok,res)=>결과문 or {t,tone,big,cut}}]
const EV={};
function E(id,o){ o.id=id; EV[id]=o; }
const Sg=(bg,o)=>Object.assign({bg},o||{});
const N=(id,look,x,o)=>Object.assign({id,look,x,face:-1},o||{});
function joinSect(k){ const S=SECTS[k]; m.sect=k; learn(S.art[0],S.art[1],S.art[2]); if(S.inner) learn(S.inner[0],0,'내공',S.inner[1]); if(k==='demon'){ m.f.magong=1; m.ak+=20; } addExp(3); if(!relOf('사부')) rel('사부',null,65);
  if(S.w0&&!m.inv.w) give(S.w0,{quiet:1}); log(`${S.n}에 입문했다`,true); }
// 출가 문파(소림사)는 혼인한 사람을 받지 않고, 문도는 혼인하지 못한다. 환속하면 풀린다
const isMonk=()=>!!(m&&m.sect&&SECTS[m.sect]&&SECTS[m.sect].monk);
const sectOK=k=>!(SECTS[k].male&&m.sex!=='m')&&!(SECTS[k].female&&m.sex!=='f')&&!(SECTS[k].monk&&m.spouse&&!m.spouse.dead);
function snap(){ return {gold:m.gold,hp:m.hp,ng:m.ng,fame:m.fame,hy:m.hy,ak:m.ak}; }
function diffFx(b){ if(m.headless||m.dead) return; const d=[]; const g=Math.round(m.gold-b.gold); if(g) d.push([`${g>0?'+':'−'}${fmt(Math.abs(g))}냥`,g>0?'gold':'bad']);
  const h=Math.round(m.hp-b.hp); if(Math.abs(h)>=3) d.push([`건강 ${h>0?'+':'−'}${Math.abs(h)}`,h>0?'good':'bad']);
  const n=Math.round(m.ng-b.ng); if(Math.abs(n)>=1) d.push([`내공 ${n>0?'+':'−'}${Math.abs(n)}년`,n>0?'jade':'bad']);
  const f=Math.round(m.fame-b.fame); if(Math.abs(f)>=2) d.push([`명성 ${f>0?'+':'−'}${Math.abs(f)}`,f>0?'good':'bad']);
  const y=Math.round(m.hy-b.hy); if(y>=3) d.push([`협 +${y}`,'good']); const k=Math.round(m.ak-b.ak); if(k>=3) d.push([`악 +${k}`,'bad']);
  d.slice(0,4).forEach((x,i)=>setTimeout(()=>heroFloat(x[0],x[1],i*7),i*260)); }
function lvCheck(){ if(!m.f.martial) return; let nl=0; for(let i=1;i<LVX.length;i++) if(m.exp+m.ng*.3>=LVX[i]) nl=i;
  if(m.lv<8&&nl>m.lv){ m.lv=Math.min(nl,7); if(m.lv>=2) log(`${LV[m.lv]}의 경지에 올랐다`,m.lv>=3); const lv=m.lv; vfx(()=>{ callout(LV[lv],'lv',1500); sfx('lv'); const h=A('hero'); if(h) for(let i=0;i<14;i++) FX.push({t:'aura',x:h.x-9+i*1.4,y:h.y-1,life:20+i*2,max:46,c:'#ffe9a0'}); }); } }

/* ---------- 성격 · 주사위 ---------- */
const PER={
  협:{pos:/막는다|막아선다|돕|나눠|곳간|되사|묻어|병자|말린다|귀띔|곁을 지킨다|끼어들|약을 발라|대신 패|지킨다|살려|구하러|업고|풀어|숨겨|갚아/,neg:/판다|팔아|받는다$|가진 돈을|모른 척|남의 일|훔|오를 때|수련이 먼저|넘긴다|챙긴다|빼앗/,hi:'의리를 중히 여긴다',lo:'셈이 빠르다'},
  담:{pos:/칼을 뽑|맞서|쳐들어|받아친|출전|따라간다|찾아간다|도전|건다|먼저 친다|오른다|쫓아간다|몰래|자원|정면|비무를 받는다|천하제일인|뛰어든다|들어간다|벤다|붙는다|파낸다/,neg:/피한다|숨는다|사양|구경|버틴다|남는다|그만|나중|참는다|알린다|지나친다|돌려보낸다|고개를 숙인다|이르다|지켜본다|물러/,hi:'겁이 없다',lo:'조심성이 많다'},
  정:{pos:/가족|곁|혼담을 받아|고백|용서|돌본다|조른다|어울|약을 발라|같이|나눠|손을 잡는다|웃으며|살려|절한다|듣는다|안아/,neg:/폐하고|내쫓|끊는다|떠난다|버린|맡기고|돌려보낸다|거절|갈 길이 다르다|개꿈|벤다/,hi:'정이 많다',lo:'속을 잘 안 보인다'}
};
function shiftPer(t){ m.per=m.per||{협:0,담:0,정:0}; for(const k in PER){ if(PER[k].pos.test(t)) m.per[k]=cl(m.per[k]+7,-100,100); if(PER[k].neg.test(t)) m.per[k]=cl(m.per[k]-7,-100,100); } }
function perBonus(t){ let b=0; const P=m.per||{}; for(const k in PER){ const v=P[k]||0; if(v>=25&&PER[k].pos.test(t)) b+=Math.floor(v/25); if(v<=-25&&PER[k].neg.test(t)) b+=Math.floor(-v/25); } return {b:Math.min(3,b)}; }
const diceNeed=p=>cl(Math.round(21-20*p),2,20);
function rollDice(c){ const p=cl(c.p(),.03,.97), need=diceNeed(p), b=perBonus(c.t).b, j=hasFx('dice')?1:0, roll=ri(1,20); return {roll,need,b,j,ok:roll===20||(roll!==1&&roll+b+j>=need)}; }
function perTags(){ const P=m.per||{}; return Object.keys(PER).filter(k=>Math.abs(P[k]||0)>=25).map(k=>P[k]>0?PER[k].hi:PER[k].lo); }

/* ---------- 한 해 ---------- */
const MILES={5:'지금 가장 좋아하는 것은 무엇인가요?',15:'어떤 사람이 되고 싶나요?',30:'지금 가장 지키고 싶은 것은 무엇인가요?',50:'열다섯 살로 돌아간다면 무엇을 다르게 하겠어요?',70:'남은 사람들에게 무엇을 남기고 싶나요?'};
function ambient(){
  const E0=ERAS[m.era], poor=pctNow()<35, a=m.age; m.yst=null;
  for(const role of ['아버지','어머니']){ const p=m.rels.find(r=>r.role===role); if(!p||p.dead) continue; const pa=p.age0+a;
    if(R()<.006+.0025*Math.pow(2,(pa-30)/8.5)){ p.dead=1; m.joy-=a<18?25:15; log(`${role}가 세상을 떠났다. ${pa}세, ${pick(['열병','폐병','중풍','이질','노환'])}.`,true); m.yst={k:'funeral',who:role}; } }
  if(a<15&&!m.f.orphan&&m.rels.filter(r=>(r.role==='아버지'||r.role==='어머니')&&r.dead).length===2){ m.f.orphan=1; m.joy-=10; log('고아가 되었다',true); }
  if(m.kids>0&&R()<E0.child*.12){ const k=m.rels.find(r=>r.role==='자식'&&!r.dead); m.kids--; if(k) k.dead=1; m.joy-=25; log(`자식 ${iga(k?k.name:'하나')} 열병으로 먼저 떠났다`,true); m.yst={k:'funeral',who:'자식'}; return; }
  const AMB=[
    ['famine',()=>R()<E0.famine*5,()=>{ if(poor){ m.hp-=10; m.joy-=8; gold(-5); return '흉년이 들었다. 나무껍질로 죽을 쑤어 먹었다.'; } return '흉년이 들었다. 쌀값이 세 배로 뛰었다.'; }],
    ['plague',()=>R()<E0.plague*6,()=>{ if(hasFx('plague')) return '역병이 고을을 휩쓸었다. 벽사부를 붙인 우리 집은 비켜 갔다.'; m.hp-=8; m.joy-=6; return '역병이 고을을 휩쓸었다. 마을 어귀에 무덤이 늘었다.'; }],
    ['war',()=>m.era==='chaos'&&R()<.12,()=>{ m.joy-=6; gold(-m.gold*.2); return pick(['정파와 마교의 싸움에 마을 곡식이 징발당했다.','피난민이 마을을 지나갔다. 다들 말이 없었다.','이웃 고을이 불탔다는 소식이 왔다.']); }],
    ['levy',()=>m.era==='demon'&&R()<.12,()=>{ gold(-m.gold*.15); m.joy-=4; return pick(['마교 집사가 내려와 공출을 걷어 갔다.','붉은 깃발을 단 마교도들이 관아를 차지했다.','정파 사람을 숨겨 줬다는 이웃이 끌려갔다.']); }],
    ['sibling',()=>a<14&&R()<.12,()=>{ m.sib++; return '동생이 태어났다.'; }],
    ['play',()=>a>=4&&a<15&&R()<.22,()=>{ m.joy+=4; return pick(['장터에서 무림인이 칼 쓰는 것을 보았다. 며칠 동안 나뭇가지를 휘둘렀다.','동네 아이들과 냇가에서 가재를 잡았다.','설날에 처음으로 새 옷을 얻어 입었다.','이야기꾼에게 천하제일인의 이야기를 들었다.','사당 처마 밑에서 비를 피하며 하루를 보냈다.']); }],
    ['friend',()=>a>=15&&R()<.18,()=>{ m.bond+=6; m.joy+=3; return pick(['오래 갈 벗을 사귀었다.','이웃과 술잔을 나눴다.','등불 축제에서 밤새 걸었다.','장터에서 옛 동무를 만났다.']); }],
    ['corvee',()=>a>=15&&R()<.12,()=>{ m.joy-=4; return pick(['관아 부역에 끌려가 석 달 동안 성벽 돌을 날랐다.','세금이 또 올랐다.','이웃과 땅 경계로 다퉜다.','장마에 지붕이 샜다.']); }],
    ['spouse',()=>m.spouse&&!m.spouse.dead&&R()<.15,()=>{ m.bond+=4; m.joy+=4; return pick([`${wa(m.spouse.name)} 처마 밑에서 빗소리를 들었다.`,`${iga(m.spouse.name)} 새 옷을 지어 주었다.`]); }],
    ['kid',()=>m.kids>0&&R()<.15,()=>{ m.joy+=5; return pick(['아이가 처음으로 걸었다.','아이가 천자문을 다 외웠다.','아이가 나무칼을 들고 마당을 뛰어다녔다.']); }],
    ['old',()=>a>=55&&R()<.18,()=>{ m.hp-=4; return pick(['무릎이 시려 장날에도 나가지 못했다.','눈이 침침해졌다.','젊을 때 다친 곳이 비 오는 날마다 쑤신다.']); }]
  ];
  for(const [k,c,f] of AMB.sort(()=>R()-.5)){ if(c()){ log(f()); if(!m.yst) m.yst={k}; break; } }
}
// 내공이 수명을 늘려 주는 것은 열 갑자까지다
const NGLIFE=600;
function hazard(){
  const E0=ERAS[m.era], a=m.age, p=pctNow(), poor=p<30?1.4:p>80?.6:1;
  if(m.hp<=0) return m.deathCause||'병';
  if(a>=15&&E0.war&&!m.f.migrated&&R()<E0.war*(m.f.martial?1.2:.5)) return m.f.martial?(m.era==='chaos'?'정사대전에서 전사':'마교와의 싸움에서 전사'):'전란';
  if(R()<E0.plague*.3*(a<10||a>60?1.6:1)*poor*(hasFx('plague')?.25:1)) return '역병';
  if(p<25&&R()<E0.famine*.15) return '기근';
  let h;
  if(a<10) h=E0.child*(a<=1?.3:a<=5?.06:.02)*poor*(hasT('weak')?1.5:1);
  else { h=.004+.0025*Math.pow(2,(a-30)/8.5); h*=m.hp<35?2.2:m.hp<60?1.3:1; h*=Math.max(.35,1-m.lv*.08)/(1+Math.min(m.ng,NGLIFE)/80); }
  if(R()<h) return a<15?pick(['열병','홍역','천연두','이질','경기']):a>=70?'천수를 누림':a>=60?pick(['노환','중풍','해소병']):pick(['폐병','열병','이질','종기','학질','중풍']);
  return null;
}
const evOK=e=>e.min!=null&&m.age>=e.min&&m.age<=e.max&&(!e.when||e.when());
function pickBig(){
  const due=m.q.findIndex(q=>q.age<=m.age);
  if(due>=0){ const q=m.q.splice(due,1)[0]; const e=EV[q.id]; if(e&&(!e.when||e.when())) return e; }
  if(m.age===6&&!m.used.c6&&R()<.6){ m.used.c6=1; const id=pick(['child6','child6b']); m.used[id]=6; return EV[id]; }
  if(m.age===9&&!m.used.exam){ const o=OR(m.b.o); const p=m.sect?1:o.hint?.55:['escort','hunter'].includes(o.id)?.4:regOf(m.b.reg).sect?.25:.12; if(R()<p){ m.used.exam=9; return EV.exam; } }
  if(m.f.magong&&m.sim>=100) return EV.heartDemon;
  const forced=Object.values(EV).find(e=>e.w>=9&&evOK(e)&&!m.used[e.id]);
  if(forced&&R()<.7){ m.used[forced.id]=m.age; return forced; }
  const chance=m.age<10?.14:m.age<15?.25:(m.f.martial?.44:.32);
  if(R()>chance) return pickMinor();
  const pool=Object.values(EV).filter(e=>!e.minor&&e.min!==e.max&&evOK(e)&&!(e.once&&m.used[e.id]!=null)&&!(e.rep&&m.used[e.id]!=null&&m.age-m.used[e.id]<e.rep)&&!(!e.once&&!e.rep&&m.used[e.id]!=null));
  if(!pool.length) return null;
  const lk=.3+ST('luck')*.07;
  const e=wpick(pool,x=>(x.w||1)*(x.once?1.2:1)*(x.gi?lk:1)); m.used[e.id]=m.age; return e;
}
// 등급 사건: 큰 사건이 없는 해에 따로 굴린다. 등급부터 정하고 그 안에서 고른다
function pickMinor(){ if(R()>(m.age<10?.32:m.age<15?.42:.5)) return null; const pool=Object.values(EV).filter(e=>e.minor&&evOK(e)&&!(e.once&&m.used[e.id]!=null)&&!(e.rep&&m.used[e.id]!=null&&m.age-m.used[e.id]<e.rep)); const e=pickGraded(pool); if(e) m.used[e.id]=m.age; return e; }
function choicesOf(ev){ const c=typeof ev.ch==='function'?(m.evCh||(m.evCh=ev.ch())):ev.ch; return c.filter(x=>!x.when||x.when()); }
function duelSpecOf(c){ m.evDuel=m.evDuel||{}; return m.evDuel[c.t]||(m.evDuel[c.t]=c.duel()); }
const foePow=sp=>Math.max.apply(null,(sp.chain||[sp.foe]).map(f=>f.pow));
// 맡겨 두었을 때의 승률을 재서 맞춘 어림식: 힘의 비, 지금 건강, 버티기·조력·연전을 본다
function duelOdds(sp){ let r=foePow(sp)/Math.max(1,power())*(1.62-.0072*cl(m.hp)); if(sp.ally) r*=.82; if(sp.survive) r*=sp.survive<=3?.62:.86; if(sp.qi) r*=1-sp.qi/400; let p=1/(1+Math.exp(7.5*(r-1.13))); if(sp.chain) p*=.8; return p; }
function duelHint(c){ const sp=duelSpecOf(c), p=duelOdds(sp); return {lethal:!!sp.lethal,lab:(sp.survive?'버티기 · ':'')+(p>=.8?'우세':p>=.55?'호각':p>=.3?'열세':'위험'),cls:p>=.8?'hi':p>=.55?'':p>=.3?'lo':'no'}; }
// 맵에서는 철마다 한 일이 이미 반영돼 있으니 해가 바뀔 때는 기본 살림만 셈한다
function baseEcon(){ const a=m.age, o=OR(m.b.o), work=a<10?0:a<16?.5:a<60?1:.6, inc=o.inc*work*.6+(m.f.shop?20:0), cost=a<16?0:o.inc*.55+m.kids*2; gold(inc-cost); m.focusRes={fid:'map'};
  if(a>=16&&m.gold<=0&&inc<cost){ m.hp-=5; m.joy-=6; if(R()<.35) log('끼니를 거르는 날이 많았다.'); } }
function tick(mp){
  m.age++; m.lastRes=null;
  if(mp) baseEcon(); else { if(m.age===6&&!m.focus) m.focus=m.f.martial?'train':'work'; if(m.auto&&m.age>=6&&m.age%5===0) m.focus=autoFocus(); doFocus(); }
  ambient();
  m.joy=cl(m.joy+(55-m.joy)*.08); m.bond=cl(m.bond+(40-m.bond)*.04);
  m.hp=cl(m.age<45?m.hp+3:m.hp-(m.age-45)*.12,0,100);
  if(m.hp<30&&m.hp>0&&m.inv.bag.salve>0){ m.inv.bag.salve--; m.hp=cl(m.hp+25); log('금창약을 발랐다.'); }
  else if(m.hp<30&&m.hp>0) autoHeal();
  if(m.hp<22&&m.hp>0&&m.inv.bag.pill>0){ m.inv.bag.pill--; m.hp=cl(m.hp+30); m.ng+=ngMed(5); log('아껴 둔 소환단을 삼켰다.'); }
  if(m.f.magong) m.sim+=hasFx('calm')?2:4;
  if(m.sect&&m.ak>m.hy+25&&SECTS[m.sect].side==='정'){ log(`${SECTS[m.sect].n}에서 파문당했다`,true); m.sect=null; }
  lvCheck();
  if(!m.alias&&m.fame>=30){ m.alias=makeAlias(); log(`강호가 '${m.alias}'라 부르기 시작했다`,true); const al=m.alias; vfx(()=>{ callout(al,'alias',1800); sfx('gong'); }); }
  else if(m.alias&&m.lv>=6&&!m.f.aliasUp){ m.f.aliasUp=1; const a=makeAlias(); if(a!==m.alias){ m.alias=a; log(`별호가 '${a}'로 바뀌었다`,true); } }
  if(hasT('cold')&&!m.f.coldCured&&m.age>=20) return die('천음절맥');
  const dc=hazard(); if(dc) return die(dc);
  const ev=pickBig();
  if(ev){ m.pending=ev; m.evCh=null; m.evSt=null; m.evDuel=null; m.evText=typeof ev.text==='function'?ev.text():ev.text; if(ev.gi||gradeOf(ev)) vfx(()=>evIntro(ev)); }
  if(!m.headless&&MILES[m.age]) m.milestone=m.age;
}
function resolve(i,auto){
  const ev=m.pending; if(!ev||DUEL||m.wait) return; const c=choicesOf(ev)[i]; if(!c) return;
  shiftPer(c.t);
  if(c.duel){ const sp=duelSpecOf(c); startDuel(sp,(res,stage)=>{ finishResolve(ev,c,res.win,null,res,auto,stage); if(!m.headless){ if(!m.dead) checkTrain(); acc=0; render(); save(); } }); return; }
  const d=c.p?rollDice(c):null; finishResolve(ev,c,d?d.ok:null,d,null,auto,null);
}
function finishResolve(ev,c,ok,d,res,auto,dstage){
  const b=snap(); let r=c.go(ok,res); if(typeof r==='string') r={t:r};
  const tone=r.tone||(res?(res.win?'good':'bad'):'');
  m.lastRes={age:m.age,q:m.evText,pick:c.t,t:r.t,tone,ok,dice:d,auto:!!auto,stage:(r.st&&!m.headless?fixStage(r.st,'res:'+ev.id+':'+m.age):null)||dstage||m.evSt||null,epn:ev.epn||null,gi:ev.gi?1:0};
  log(`${auto?'(맡김) ':''}${c.t}. ${r.t}`); if(r.big) log(r.big,true);
  m.pending=null; m.evCh=null; m.evText=null; m.evSt=null; m.evDuel=null; if(ev.gi&&tone!=='bad') m.giN=(m.giN||0)+1;
  if(m.deathCause||m.hp<=0) die(m.deathCause||'깊은 상처');
  if(!m.headless) react(r,d,b,!!res);
}
function react(r,d,b,duel){ const me=m, tone=m.lastRes?m.lastRes.tone:'';
  const now=()=>{ if(m!==me) return; const h=A('hero'); if(!duel&&h&&!m.dead){ h.emote=tone==='good'?'note':tone==='bad'?'sweat':h.emote; if(tone==='bad') h.flash=6; if(tone) sfx(tone==='good'?'ok':'fail'); } if(r.cut){ try{ r.cut(); }catch(e){ if(window.__mhDebug) console.error('cut',e); } } diffFx(b); };
  if(d&&!INSTANT){ m.wait=true; vfx(()=>{ showDice(d); sfx('dice'); }); setTimeout(()=>{ if(m!==me) return; m.wait=false; now(); render(); },RED?60:620); }
  else vfx(now); }
function autoResolve(){ const cs=choicesOf(m.pending); if(!cs.length){ m.pending=null; return; }
  const c=wpick(cs,x=>(x.p?cl(x.p(),.05,.95):x.duel?cl(duelOdds(duelSpecOf(x)),.04,.95):.6)*(1+perBonus(x.t).b*.5)); resolve(cs.indexOf(c),true); }
function die(cause){
  if(m.dead) return; m.dead=1; m.deathCause=cause; m.pending=null; m.milestone=null; m.yst=null;
  log(cause==='천수를 누림'?`${m.age}세, 천수를 누리고 눈을 감았다`:cause==='우화등선'?`${m.age}세, 구름을 타고 떠났다`:`${m.age}세에 세상을 떠났다. 사인: ${cause}`,true);
  if(!m.headless){ m.phase='farewell'; if(cause!=='우화등선') vfx(()=>sfx('death')); }
}
function simulate(b){
  const keep=m; m=fresh(b); m.headless=1; m.auto=true; let g=0;
  while(!m.dead&&g++<140){ tick(); if(m.dead) break; if(m.pending) autoResolve(); if(m.dead) break; checkTrain(); let k=0; while(m.train&&!m.dead&&k++<90) autoTrainStep(); }
  const big=m.log.filter(x=>x.big&&!/태어났다|세상을 떠났다|눈을 감았다|구름을 타고/.test(x.t));
  const w=m.inv.w?ITEMS[m.inv.w]:null;
  const out={name:m.name,sex:m.sex,reg:b.reg,o:b.o,P:b.P,age:m.age,cause:m.deathCause,lv:m.lv,martial:!!m.f.martial,alias:m.alias,sect:m.sect,kids:m.kids,spouse:!!m.spouse,wins:m.wins||0,kills:m.kills||0,wn:w&&w.t>=2?w.n:null,hi:big.length?big[big.length-1].t:null,log:m.log.map(x=>({a:x.a,t:x.t,big:x.big}))};
  m=keep; return out;
}
function finalize(){
  m.phase='end';
  try{ const past=lsGet('murim_past')||[]; past.unshift({n:m.name,al:m.alias,age:m.age,lv:m.lv,c:m.deathCause,era:ERAS[m.era].n,reg:regOf(m.b.reg).n,o:OR(m.b.o).n}); lsSet('murim_past',past.slice(0,30)); }catch(e){}
  lsSet('murim_run',null); render();
}
function epitaph(){
  const c=m.deathCause;
  if(m.bye) return m.bye;
  if(c==='우화등선') return '그가 앉았던 바위에는 지금도 눈이 쌓이지 않는다.';
  if(m.age<10) return '이름을 불러 줄 사람이 아직 많지 않았다.';
  if(/주화입마|심마/.test(c)) return '너무 빨리 높이 오르려 했다.';
  if(c==='천수를 누림') return m.kids?'자식들 곁에서, 창밖의 매화를 보며 눈을 감았다.':'마지막 날까지 아침마다 마당을 쓸었다.';
  return m.f.martial?'칼끝에 살고 칼끝에 갔다.':'강호의 이야기는 늘 남의 이야기였다.';
}

/* ---------- 저장 ---------- */
const tevKey=t=>!t?null:t.final?'FINAL':t.ep?`E|${t.ep}|${t.bi}`:t.id;
function tevOf(k){ if(!k) return null; if(k==='FINAL') return TEV_FINAL; if(k.startsWith('E|')){ const p=k.split('|'); return EPI_T[p[1]]?EPI_T[p[1]].beats[+p[2]]:null; } return TEV.find(t=>t.id===k)||null; }
function save(){ if(!m||!m.b||m.phase==='end'||m.headless) return;
  const keep={ev:m.pending,ch:m.evCh,tev:m.tev,st:m.evSt,du:m.evDuel,ls:m.lastRes&&m.lastRes.stage,w:m.wait};
  m.v=2; m.pendingId=m.pending&&m.pending.id; m.tevId=tevKey(m.tev); m.pending=null; m.evCh=null; m.tev=null; m.evSt=null; m.evDuel=null; m.wait=false; if(m.lastRes) m.lastRes.stage=null;
  lsSet('murim_run',m);
  m.pending=keep.ev; m.evCh=keep.ch; m.tev=keep.tev; m.evSt=keep.st; m.evDuel=keep.du; m.wait=keep.w; if(m.lastRes) m.lastRes.stage=keep.ls; }
function load(){ const r=lsGet('murim_run'); return r&&r.b&&r.others&&(r.phase==='play'||r.phase==='farewell')?r:null; }
function rehydrate(r){ m=r;
  // 예전 판에서 이어 온 삶에는 행낭이 없다
  if(!m.inv) m.inv={w:null,a:null,h:null,f:null,c:null,stash:[],bag:{salve:0,pill:0,antidote:0},mat:0};
  SLOTS.forEach(s=>{ if(m.inv[s]&&!ITEMS[m.inv[s]]) m.inv[s]=null; if(m.inv[s]===undefined) m.inv[s]=null; }); if(m.inv.stash) m.inv.stash=m.inv.stash.filter(id=>ITEMS[id]); if(m.inv.bag) for(const k in m.inv.bag) if(!ITEMS[k]) delete m.inv.bag[k];
  m.inv.bag=Object.assign({salve:0,pill:0,antidote:0},m.inv.bag||{}); m.inv.stash=m.inv.stash||[]; m.ep=m.ep||{}; m.spared=m.spared||[]; m.per=m.per||{협:0,담:0,정:0};
  m.rels.forEach(x=>{ if(!x.sx) x.sx=SEXROLE[x.role]||(x.role==='배우자'||x.role==='정인'?(m.sex==='m'?'f':'m'):(seedOf(x.name)%2?'m':'f')); if(x.a0==null&&x.age0==null) x.a0=Math.max(0,m.age-5); });
  if(m.mates) m.mates.forEach((x,i)=>{ if(!x.sx) x.sx=SEXROLE[x.role]||(i===2?m.sex:'m'); });
  m.evCh=null; m.evSt=null; m.evDuel=null; m.wait=false; m.yst=null;
  m.pending=m.pendingId?EV[m.pendingId]||null:null; if(m.pending&&!m.evText) m.evText=typeof m.pending.text==='function'?m.pending.text():m.pending.text;
  m.tev=tevOf(m.tevId||(typeof m.tevIdx==='string'?m.tevIdx:m.tevIdx===-2?'FINAL':null)); if(m.tev&&!m.tevText) m.tevText=m.tev.text();
  if(m.spouse) m.spouse=m.rels.find(x=>x.role==='배우자'&&x.name===m.spouse.name)||m.spouse;
  paused=true; }
