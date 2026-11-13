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
         par:'m' 어머니/'f' 아버지가 살아 있을 때, 1 고아가 아닐 때 · tier:[집안 형편 낮게, 높게] · org:[출신] · reg:[고향] · wed:1 혼인한 사람/0 안 한 사람 · kid:1 자식이 있을 때 · gold·fame·lv:그 이상일 때
         sc:[문파] 그 문파 사람만 · side:'정사마중' 가운데 그쪽 문파 사람만 · free:1 문파가 없는 사람만 · need:함수
   선택지 [글, 결과, 얻는 것]  또는  [글, {p:[기본 확률, 능력, 능력 1당], ok:[결과, 얻는 것], no:[결과, 얻는 것]}]  또는  [글, {duel:{n,pow,look,lethal}, ok:[..], no:[..]}]
   얻는 것  g 은자(수 또는 [최소,최대]) · hp · joy · bond · fame · hy 협 · ak 악 · exp 수련(배수) · ng 내공(해) · st:{능력:+n} · it:[물건] · wt:무기 등급 · ar:방어구 등급 · art:[이름,위력,종류,내공] */
const ARMS=['lvest','chain','gvest','silk'];
function applyFx(f){ if(!f) return; if(f.g!=null) gold(Array.isArray(f.g)?ri(f.g[0],f.g[1]):f.g); if(f.hp) m.hp=f.hp<0?Math.max(1,m.hp+f.hp):cl(m.hp+f.hp); if(f.joy) m.joy=cl(m.joy+f.joy); if(f.bond) m.bond+=f.bond; if(f.fame) m.fame=Math.max(0,m.fame+f.fame); if(f.hy) m.hy+=f.hy; if(f.ak) m.ak+=f.ak;
  if(f.exp) addExp(gain()*f.exp); if(f.ng&&m.f.martial) m.ng+=f.ng; if(f.st) for(const k in f.st) m.b.st[k]=Math.min(12,(m.b.st[k]||0)+f.st[k]); if(f.it) for(const id of f.it) give(id,{}); if(f.wt!=null) give(wOf(f.wt,myKind()),{}); if(f.ar!=null) give(ARMS[f.ar],{}); if(f.art) learn(f.art[0],f.art[1],f.art[2],f.art[3]); }
const fxTone=f=>{ if(!f) return ''; const neg=(f.hp<0)||(typeof f.g==='number'&&f.g<0)||(f.joy<0)||(f.fame<0), pos=Object.keys(f).some(k=>k!=='ak'&&(Array.isArray(f[k])||typeof f[k]==='object'||f[k]>0)); return pos&&!neg?'good':neg&&!pos?'bad':''; };
function mkCh(x){ const t=x[0]; if(typeof x[1]==='string') return {t,go:()=>{ applyFx(x[2]); return {t:x[1],tone:fxTone(x[2])}; }};
  const o=x[1]; if(o.duel) return {t,duel:()=>Object.assign({foe:{name:o.duel.n,look:(LOOK[o.duel.look]||LOOK.bandit)(),pow:o.duel.pow+m.lv*(o.duel.lv==null?5:o.duel.lv)+ri(0,6),style:o.duel.style||'sword',mercy:o.duel.lethal?.4:1,art:o.duel.art||'삼재검법'}},o.duel.lethal?{lethal:1,cause:o.duel.cause||o.duel.n+'의 칼'}:{}),
    go:(ok,res)=>{ if(ok){ applyFx(o.ok[1]); return {t:o.ok[0],tone:'good'}; } if(res&&res.dead) return {t:'거기까지였다.',tone:'bad'}; applyFx(o.no[1]); return {t:o.no[0],tone:'bad'}; }};
  return {t,p:()=>Math.max(.05,Math.min(.95,o.p[0]+(o.p[1]?ST(o.p[1])*(o.p[2]||.05):0))),go:ok=>{ const r=ok?o.ok:o.no; applyFx(r[1]); return {t:r[0],tone:ok?'good':'bad'}; }}; }
let QN=0;
function Q(g,id,c,bg,text,chs){ c=c||{}; QN++; const rep=c.rep!=null?c.rep:GREP[g];
  E(id,Object.assign({min:c.a?c.a[0]:13,max:c.a?c.a[1]:70,grade:g,minor:1,w:c.w||1,when:()=>(c.mar==null||!!m.f.martial===!!c.mar)&&(!c.sect||!!m.sect)&&(!c.sea||c.sea.includes(m.sea||0))&&(!c.par||(c.par==='m'?!m.b.mother.dead:c.par==='f'?!m.b.father.dead:!OR(m.b.o).orphan))&&(!c.tier||((FAMTIER[m.b.o]||0)>=c.tier[0]&&(FAMTIER[m.b.o]||0)<=c.tier[1]))&&(!c.org||c.org.includes(m.b.o))&&(c.wed==null||!!m.spouse===!!c.wed)&&(!c.kid||m.kids>0)&&(!c.gold||m.gold>=c.gold)&&(!c.fame||m.fame>=c.fame)&&(!c.lv||m.lv>=c.lv)&&(!c.reg||c.reg.includes(m.b.reg))&&(!c.sc||c.sc.includes(m.sect))&&(!c.side||(m.sect&&SECTS[m.sect]&&c.side.includes(SECTS[m.sect].side)))&&(!c.free||!m.sect)&&(!c.need||c.need()),
    st:()=>Sg(bg,{}),text:()=>typeof text==='function'?text():text,ch:chs.map(mkCh)},rep?{rep}:{once:1},g==='SS'||g==='SSR'?{gi:1}:{})); }
