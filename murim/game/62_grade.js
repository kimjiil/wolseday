/* ==== murim:grade — 사건 등급(C·B·A·S·SS·SSR)과 한 줄로 적는 사건 ==== */
const GRADES=['C','B','A','S','SS','SSR'];
const GODDS=[50,28,14,6,1.7,.3];                 // 등급 사건이 일어났을 때 어느 등급이 나오는지(%)
const GREP={C:3,B:4,A:6};                        // 되풀이 간격(해). S 이상은 평생 한 번
const GNAME={C:'일상',B:'작은 일',A:'쓸 만한 일',S:'큰일',SS:'기연',SSR:'천운'};
// 예전부터 있던 사건의 등급
const GOLD={treasure:'SS',oldTomb:'SS',meteor:'SS',fairy:'SS',dyingMonk:'SS',coldPond:'S',cliff:'S',master:'S',herb:'S',enlight:'S',drunkBeggar:'S',contest:'A',rival:'A',love:'A',beast:'A',envoy:'A',bandit:'B',innFight:'B',gamble:'B',injustice:'B',hire:'B',matchmaker:'B',smithy:'B',escortJob:'B',peddler:'C'};
const gradeOf=e=>e.grade||GOLD[e.id]||(e.gi?'S':'');
// 등급을 먼저 굴리고(운이 좋으면 S 이상이 조금 더 나온다) 그 등급 안에서 고른다. 맞는 사건이 없으면 한 단계씩 내린다
function pickGraded(pool,minG){ if(!pool.length) return null; const lo=minG||0, lk=.7+ST('luck')*.06, od=GODDS.map((v,i)=>i<lo?0:i>=3?v*lk:v); let r=R()*od.reduce((a,b)=>a+b,0), gi=lo; for(let i=0;i<od.length;i++){ r-=od[i]; if(r<=0){ gi=i; break; } }
  for(let i=gi;i>=lo;i--){ const sub=pool.filter(e=>(gradeOf(e)||'B')===GRADES[i]); if(sub.length) return wpick(sub,x=>x.w||1); } return null; }
// 등급이 높은 사건이 열릴 때의 연출
function evIntro(ev){ const g=gradeOf(ev); if(g==='SSR'){ callout('SSR · 天運','gi gssr',2800); sfx('giyeon'); flashA=.95; flashC='#fff6c8'; }
  else if(g==='SS'){ callout('SS · 奇緣','gi gss',2200); sfx('giyeon'); flashA=.7; flashC='#ffe9a0'; }
  else if(g==='S'||ev.gi){ callout(g==='S'?'S · 奇緣':'奇緣','gi',1600); sfx('giyeon'); flashA=.5; flashC='#ffe9a0'; } }
const gradeBadge=ev=>{ const g=ev&&gradeOf(ev); return g?`<span class="mh-gr g-${g}" title="${GNAME[g]}">${g}</span>`:''; };
/* ---- 한 줄 사건: Q(등급, 이름표, 조건, 배경, 글, 선택지) ----
   조건  a:[몇 살부터, 몇 살까지] · mar:1 무림인만/0 아닌 사람만 · sect:1 문파에 든 사람만 · sea:[철] · rep:되풀이 간격 · w:비중
         par:'m' 어머니/'f' 아버지가 살아 있을 때, 1 고아가 아닐 때 · tier:[집안 형편 낮게, 높게] · org:[출신] · reg:[고향] · wed:1 혼인한 사람/0 안 한 사람 · sex:'m'/'f' · kid:1 자식이 있을 때 · gold·fame·lv:그 이상일 때
         sc:[문파] 그 문파 사람만 · side:'정사마중' 가운데 그쪽 문파 사람만 · free:1 문파가 없는 사람만 · need:함수
   선택지 [글, 결과, 얻는 것]  또는  [글, {p:[기본 확률, 능력, 능력 1당], ok:[결과, 얻는 것], no:[결과, 얻는 것]}]  또는  [글, {duel:{n,pow,look,lethal}, ok:[..], no:[..]}]
   얻는 것  g 은자(수 또는 [최소,최대]) · hp · joy · bond · fame · hy 협 · ak 악 · exp 수련(배수) · ng 내공(해) · st:{능력:+n} · it:[물건] · wt:무기(0 C·B, 1 A, 2 S, 3 SS) · ar:갑옷(같은 식) · eq:[자리,'등급'] 그 자리·등급의 물건 하나 · art:[이름,위력,종류,내공] · wed:1 혼인한다 · kid:n 자식이 태어난다 · unsect:1 문파를 떠난다(환속) */
// psn:1 독으로 입는 해 — 만독불침·피독주면 안 입고, 해독단이 있으면 한 알 써서 절반. zh:1 주화입마 — 염주류(정심)를 찼으면 절반. 무슨 일이 있었는지는 FXNOTE 로 결과 글에 덧붙는다
let FXNOTE='', FXFULL=false;
const fxText=t=>FXNOTE?(FXFULL?FXNOTE:t+' '+FXNOTE):t;
function applyFx(f){ FXNOTE=''; FXFULL=false; if(!f) return;
  if(f.psn&&f.hp<0){ if(hasT('immune')){ f=Object.assign({},f,{hp:0}); FXFULL=true; FXNOTE='독이 몸에 들어왔다. 그러나 만독불침의 몸에는 듣지 않았다. 아무 일도 없었다.'; } else if(hasFx('poison')){ f=Object.assign({},f,{hp:0}); FXFULL=true; FXNOTE=`독이 몸에 들어왔다. 그러나 품에 지닌 ${ITEMS[m.inv.c].n}${jo(ITEMS[m.inv.c].n,'이','가')} 독을 빨아들였다. 아무 일도 없었다.`; } else if(m.inv.bag.antidote>0){ m.inv.bag.antidote--; f=Object.assign({},f,{hp:Math.ceil(f.hp/2)}); FXNOTE='그나마 품의 해독단을 씹어 덜 앓았다.'; } }
  if(f.zh&&f.hp<0&&hasFx('calm')){ f=Object.assign({},f,{hp:Math.ceil(f.hp/2)}); FXNOTE=`그나마 ${ITEMS[m.inv.c].n}${jo(ITEMS[m.inv.c].n,'을','를')} 쥐고 숨을 골라 덜 다쳤다.`; } if(f.g!=null) gold(Array.isArray(f.g)?ri(f.g[0],f.g[1]):f.g); if(f.hp) m.hp=f.hp<0?Math.max(1,m.hp+f.hp):cl(m.hp+f.hp); if(f.joy) m.joy=cl(m.joy+f.joy); if(f.bond) m.bond+=f.bond; if(f.fame) m.fame=Math.max(0,m.fame+f.fame); if(f.hy) m.hy+=f.hy; if(f.ak) m.ak+=f.ak;
  if(f.exp) addExp(gain()*f.exp); if(f.ng&&m.f.martial) m.ng+=f.ng; if(f.st) for(const k in f.st) m.b.st[k]=Math.min(12,(m.b.st[k]||0)+f.st[k]); if(f.it) for(const id of f.it) give(id,{}); if(f.wt!=null){ const id=rndItem('w',tgOf(f.wt),myKind()); if(id) give(id,{}); } if(f.ar!=null){ const id=rndItem('a',tgOf(f.ar)); if(id) give(id,{}); } if(f.eq){ const id=rndItem(f.eq[0],TIER.indexOf(f.eq[1])); if(id) give(id,{}); } if(f.unsect&&m.sect){ log(`${SECTS[m.sect].n}${jo(SECTS[m.sect].n,'을','를')} 떠나 환속했다`,true); m.sect=null; m.f.exmonk=1; }
  if(f.wed&&!isMonk()&&!(m.spouse&&!m.spouse.dead)){ const r=relOf('정인')||rel('배우자'); r.role='배우자'; m.spouse=r; log(`${wa(r.name)} 혼인했다`,true); if(!m.q.some(q=>q.id==='birth')) m.q.push({age:m.age+ri(1,3),id:'birth'}); }
  if(f.kid) for(let i=0;i<f.kid;i++){ m.kids++; const n=m.b.sur+gname(); rel('자식',n,80,{sx:R()<.5?'m':'f'}); log(`자식 ${iga(n)} 태어났다`,true); }
  if(f.art) learn(f.art[0],f.art[1],f.art[2],f.art[3]); }
const fxTone=f=>{ if(!f) return ''; const neg=(f.hp<0)||(typeof f.g==='number'&&f.g<0)||(f.joy<0)||(f.fame<0), pos=Object.keys(f).some(k=>k!=='ak'&&(Array.isArray(f[k])||typeof f[k]==='object'||f[k]>0)); return pos&&!neg?'good':neg&&!pos?'bad':''; };
// 등급 사건이 잘 풀리면 그 등급(가끔 한 단계 아래)의 물건이 덤으로 떨어진다. 이미 물건을 주는 결과에는 붙지 않는다
const QDROP=[.05,.08,.12,.2,.3,.5];
function qDrop(g,f){ const t=GRADES.indexOf(g); if(t<0||(f&&(f.it||f.wt!=null||f.ar!=null||f.eq))) return; if(R()<QDROP[t]) dropItem(Math.max(0,R()<.7?t:t-1)); }
// 결과 글이나 사건 글에 독·주화입마가 나오고 건강이 깎이는 결과면 psn/zh 를 붙인다(사건을 적을 때 따로 표시하지 않아도 되게)
const RXPSN=/독|뱀|물렸|버섯|벌에|퉁퉁 부었|지네|배를 움켜|배탈|설사|해독약/, RXPSNH=/독이 있는|독물이|독물 우리|해독 시험|독이 있다|독버섯|술에서 이상한 냄새/, RXZH=/주화입마|기가 뒤틀|피를 한 모금 토|피를 쏟/, RXZHH=/주화입마|운기 중에 기가/, RXNOT=/독한 술|감독|독하게|독촉|단독|고독|중독/g;
function tagFx(f,txt,head){ if(!f||!(f.hp<0)||f.psn||f.zh) return f; if(RXZH.test(txt)||RXZHH.test(head)) return Object.assign({},f,{zh:1}); if(RXPSN.test(String(txt).replace(RXNOT,''))||RXPSNH.test(head)) return Object.assign({},f,{psn:1}); return f; }
function mkCh(x,g,head){ const t=x[0]; head=head||''; if(typeof x[1]==='string'){ x=[x[0],x[1],tagFx(x[2],x[1],head)]; return {t,go:()=>{ const tn=fxTone(x[2]); applyFx(x[2]); const tx=fxText(x[1]); if(tn==='good') qDrop(g,x[2]); return {t:tx,tone:FXFULL?'':tn}; }}; }
  const o=x[1]; if(o.ok) o.ok=[o.ok[0],tagFx(o.ok[1],o.ok[0],head)]; if(o.no) o.no=[o.no[0],tagFx(o.no[1],o.no[0],head)]; if(o.duel) return {t,duel:()=>Object.assign({foe:{name:o.duel.n,look:(LOOK[o.duel.look]||LOOK.bandit)(),pow:o.duel.pow+m.lv*(o.duel.lv==null?5:o.duel.lv)+ri(0,6),style:o.duel.style||'sword',mercy:o.duel.lethal?.4:1,art:o.duel.art||'삼재검법'}},o.duel.lethal?{lethal:1,cause:o.duel.cause||o.duel.n+'의 칼'}:{}),
    go:(ok,res)=>{ if(ok){ applyFx(o.ok[1]); qDrop(g,o.ok[1]); return {t:o.ok[0],tone:'good'}; } if(res&&res.dead) return {t:'거기까지였다.',tone:'bad'}; applyFx(o.no[1]); return {t:fxText(o.no[0]),tone:'bad'}; }};
  return {t,p:()=>Math.max(.05,Math.min(.95,o.p[0]+(o.p[1]?ST(o.p[1])*(o.p[2]||.05):0))),go:ok=>{ const r=ok?o.ok:o.no; applyFx(r[1]); const tx=fxText(r[0]), full=FXFULL; if(ok) qDrop(g,r[1]); return {t:tx,tone:ok?'good':full?'':'bad'}; }}; }
let QN=0;
function Q(g,id,c,bg,text,chs){ c=c||{}; QN++; const rep=c.rep!=null?c.rep:GREP[g];
  const hi=c.a?c.a[1]:70, top=g==='S'||g==='SS'||g==='SSR'?50:70;   // 위쪽 나이가 70 이상이면(S 이상은 50 이상이면) 나이 제한이 없는 것으로 친다. 오래 사는 사람에게도 일과 기연이 생기게
  E(id,Object.assign({min:c.a?c.a[0]:13,max:hi>=top?150:hi,grade:g,minor:1,w:c.w||1,when:()=>(c.mar==null||!!m.f.martial===!!c.mar)&&(!c.sect||!!m.sect)&&(!c.sea||c.sea.includes(m.sea||0))&&(!c.par||(c.par==='m'?!m.b.mother.dead:c.par==='f'?!m.b.father.dead:!OR(m.b.o).orphan))&&(!c.tier||((FAMTIER[m.b.o]||0)>=c.tier[0]&&(FAMTIER[m.b.o]||0)<=c.tier[1]))&&(!c.org||c.org.includes(m.b.o))&&(c.wed==null||!!(m.spouse&&!m.spouse.dead)===!!c.wed)&&(c.wed!==0||!isMonk())&&(!c.sex||m.sex===c.sex)&&(!c.kid||m.kids>0)&&(!c.gold||m.gold>=c.gold)&&(!c.fame||m.fame>=c.fame)&&(!c.lv||m.lv>=c.lv)&&(!c.reg||c.reg.includes(m.b.reg))&&(!c.sc||c.sc.includes(m.sect))&&(!c.side||(m.sect&&SECTS[m.sect]&&c.side.includes(SECTS[m.sect].side)))&&(!c.free||!m.sect)&&(!c.need||c.need()),
    st:()=>Sg(bg,{}),text:()=>typeof text==='function'?text():text,ch:chs.map(x=>mkCh(x,g,typeof text==='string'?text:''))},rep?{rep}:{once:1},g==='SS'||g==='SSR'?{gi:1}:{})); }
