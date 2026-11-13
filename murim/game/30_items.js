/* ==== murim:items — 장비·행낭·무위 ==== */
// 등급은 사건과 같다. t: 0 C · 1 B · 2 A · 3 S · 4 SS · 5 SSR
const TIER=['C','B','A','S','SS','SSR'];
// s: w 무기 · a 갑옷 · h 머리 · f 신발 · c 장신구 · u 소모품 · m 재료 / k: 무기 갈래 / v: 값(냥)
// 덧붙는 힘: cr 회심 · ev 회피 · rd 낌새 읽기 · qi 기 · hp 기력 · xp 수련 · st:{능력:+n}. 찬 것을 모두 더한다
// 여기 있는 것은 예전부터 있던 물건이다. 나머지는 31_items_*.js 에 등급별로 적는다
const ITEMS={
  wsword:{n:'목검',s:'w',k:'검',atk:2,t:0,v:2},
  isword:{n:'철검',s:'w',k:'검',atk:5,t:1,v:14},
  gsword:{n:'청강검',s:'w',k:'검',atk:9,t:2,v:70},
  psword:{n:'송문고검',s:'w',k:'검',atk:14,t:3,v:260},
  hsword:{n:'한월검',s:'w',k:'검',atk:21,t:4,v:900},
  bsaber:{n:'박도',s:'w',k:'도',atk:5,t:1,v:12},
  asaber:{n:'안령도',s:'w',k:'도',atk:9,t:2,v:65},
  dsaber:{n:'귀두대도',s:'w',k:'도',atk:14,t:3,v:240},
  rsaber:{n:'용린도',s:'w',k:'도',atk:21,t:4,v:900},
  lglove:{n:'가죽 수투',s:'w',k:'권',atk:4,t:1,v:8},
  sglove:{n:'정강 수투',s:'w',k:'권',atk:8,t:2,v:60},
  cglove:{n:'천잠 수투',s:'w',k:'권',atk:13,t:3,v:230},
  tglove:{n:'벽력 수투',s:'w',k:'권',atk:20,t:4,v:900},
  ldart:{n:'비도',s:'w',k:'암기',atk:4,t:1,v:8},
  gdart:{n:'유엽비도',s:'w',k:'암기',atk:8,t:2,v:60},
  ndart:{n:'폭우침통',s:'w',k:'암기',atk:13,t:3,v:230},
  sdart:{n:'만천성우',s:'w',k:'암기',atk:20,t:4,v:900},
  lvest:{n:'가죽 조끼',s:'a',def:2,t:1,v:10},
  chain:{n:'쇄자갑',s:'a',def:5,t:2,v:80},
  gvest:{n:'금사갑',s:'a',def:9,t:3,v:300},
  silk:{n:'천잠보의',s:'a',def:13,t:4,v:900},
  mirror:{n:'호심경',s:'c',fx:'guard',t:2,v:90,d:'목숨이 끊길 일격을 한 번 대신 받고 깨진다'},
  jadep:{n:'평안옥패',s:'c',fx:'dice',t:2,v:80,d:'주사위에 +1'},
  beads:{n:'백팔염주',s:'c',fx:'calm',t:2,v:70,d:'심마와 주화입마가 덜 온다. 수련 +5%'},
  sachet:{n:'향낭',s:'c',fx:'charm',t:0,v:15,st:{charm:1}},
  talis:{n:'벽사부',s:'c',fx:'plague',t:0,v:12,d:'역병이 비켜 간다'},
  pearl:{n:'피독주',s:'c',fx:'poison',t:3,v:280,d:'독이 통하지 않는다'},
  fan:{n:'학우선',s:'c',fx:'qi',t:3,v:260,qi:6},
  eyebead:{n:'명안주',s:'c',fx:'read',rd:.08,t:2,v:110},
  hawkeye:{n:'응안석',s:'c',fx:'read',rd:.15,t:3,v:320},
  salve:{n:'금창약',s:'u',t:0,v:8,d:'결투 중 체력 +25'},
  pill:{n:'소환단',s:'u',t:3,v:120,d:'내공 +5년, 건강 +30'},
  antidote:{n:'해독단',s:'u',t:1,v:20,d:'웬만한 독은 푼다'},
  absinthe:{n:'압생투강주',s:'u',t:4,v:300,d:'마시면 내공 +10년. 열에 셋은 주화입마가 오고, 귀를 잃을 수도 있다',lore:'서역에서 온 초록빛 독주. 이 술을 마시고 칩 설계를 하다가 제 귀를 잘랐다는 도X구의 이야기가 전한다.'},
  ore:{n:'천외운철',s:'m',t:4,v:400,d:'별에서 떨어진 쇠. 솜씨 좋은 대장장이를 만나면 신병이 된다'}
};
for(const k in ITEMS) ITEMS[k].id=k;
/* ---- 물건을 한 줄로 적는 법 ----
   IT(자리, 갈래, 등급, '이름:주된 힘:덧붙는 힘:설명|이름:…')   자리 w 무기(주된 힘=공격) · a 갑옷 · h 머리 · f 신발(주된 힘=방어) · c 장신구
   덧붙는 힘  c3 회심 3% · e2 회피 2% · r4 읽기 4% · q2 기 +2 · h6 기력 +6 · x5 수련 5% · B1 근골 W1 오성 L1 기연 M1 매력 · @dice @guard @calm @plague @poison (장신구의 특수한 힘)
   IU(등급, '이름:쓰면 얻는 것:설명|…')   hp20 건강 · ng3 내공(년) · joy5 행복 · ex20 수련(0.2배) · B1 W1 L1 M1 능력
   이름이 곧 이름표라, 한 번 낸 이름은 바꾸지 않는다(저장된 판이 그 이름으로 물건을 찾는다) */
const strHash=s=>{ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; };
const GV=[6,25,90,300,900,3000], GVU=[3,10,35,110,380,1500], OST={B:'body',W:'wit',L:'luck',M:'charm'}, OKEY={c:['cr',.01],e:['ev',.01],r:['rd',.01],q:['qi',1],h:['hp',1],x:['xp',.01]};
const FXD={guard:'목숨이 끊길 일격을 한 번 대신 받고 깨진다',dice:'주사위에 +1',calm:'심마와 주화입마가 덜 온다. 수련 +5%',plague:'역병이 비켜 간다',poison:'독이 통하지 않는다'};
let ITDUP=[]; const ITNAMES=new Set(Object.values(ITEMS).map(x=>x.n));
function IT(s,k,g,list){ const t=TIER.indexOf(g); list.split('|').forEach(row=>{ const p=row.trim().split(':'), n=p[0]; if(!n) return; if(ITEMS[n]||ITNAMES.has(n)){ ITDUP.push(n); return; } ITNAMES.add(n);
  const it={id:n,n,s,t,v:Math.round(GV[t]*(.8+.4*(strHash(n)%100)/100))}, main=+p[1]||0; if(s==='w'){ it.k=k; it.atk=main; } else if(main) it.def=main;
  (p[2]||'').replace(/@([a-z]+)|([ceqrhxBWLM])(\d+)/g,(_,fx,c,num)=>{ if(fx){ it.fx=fx; if(FXD[fx]&&!p[3]) it.d=FXD[fx]; } else if(OST[c]){ (it.st=it.st||{})[OST[c]]=+num; } else { const o=OKEY[c]; it[o[0]]=Math.round(o[1]*num*100)/100; } return ''; });
  if(p[3]) it.note=p[3]; if(s!=='w'&&s!=='a'&&!it.def&&!it.fx&&!it.cr&&!it.ev&&!it.rd&&!it.qi&&!it.hp&&!it.xp&&!it.st) it.hp=1; ITEMS[n]=it; }); }
function IU(g,list){ const t=TIER.indexOf(g); list.split('|').forEach(row=>{ const p=row.trim().split(':'), n=p[0]; if(!n) return; if(ITEMS[n]||ITNAMES.has(n)){ ITDUP.push(n); return; } ITNAMES.add(n);
  const it={id:n,n,s:'u',t,v:Math.round(GVU[t]*(.8+.4*(strHash(n)%100)/100)),use:{}};
  (p[1]||'').replace(/(hp|ng|joy|ex)(\d+)|([BWLM])(\d+)/g,(_,k,num,c,n2)=>{ if(k) it.use[k]=+num; else (it.use.st=it.use.st||{})[OST[c]]=+n2; return ''; });
  if(p[2]) it.d=p[2]; ITEMS[n]=it; }); }
const SLOTS=['w','a','h','f','c'], SLOTN={w:'무기',a:'갑옷',h:'머리',f:'신발',c:'장신구'}, STATN={body:'근골',wit:'오성',luck:'기연',charm:'매력'}, STASHMAX=12;
// 찬 것들의 덧붙는 힘을 모두 더한다
const eq=k=>{ let v=0; if(m&&m.inv) for(const s of SLOTS){ const it=m.inv[s]&&ITEMS[m.inv[s]]; if(it&&it[k]) v+=it[k]; } return v; };
const eqSt=k=>{ let v=0; if(m&&m.inv) for(const s of SLOTS){ const it=m.inv[s]&&ITEMS[m.inv[s]]; if(it&&it.st&&it.st[k]) v+=it.st[k]; } return v; };
// 자리·등급·갈래로 물건을 뽑는다. 그 등급에 없으면 한 단계씩 내린다
const POOL={};
function pool(s,t,k){ const key=s+'|'+(k||'')+'|'+t; return POOL[key]||(POOL[key]=Object.values(ITEMS).filter(it=>it.s===s&&it.t===t&&(!k||it.k===k)&&!it.lore&&it.id!=='wsword').map(it=>it.id)); }
function rndItem(s,t,k,rf){ rf=rf||R; for(let g=Math.min(5,t);g>=0;g--){ const p=pool(s,g,k); if(p.length) return p[Math.floor(rf()*p.length)]; } return null; }
function seeded(seed){ let x=(seed>>>0)||1; return ()=>{ x^=x<<13; x>>>=0; x^=x>>>17; x^=x<<5; x>>>=0; return x/4294967296; }; }
const TG=[0,2,3,4];   // 사건에서 쓰던 옛 등급(0~3)이 가리키는 새 등급. 0은 C나 B
const tgOf=(tier,rf)=>tier<=0?((rf||R)()<.6?0:1):TG[Math.min(3,tier)];
// 싸움에서 이기거나 사건이 잘 풀렸을 때 덤으로 떨어지는 물건
function dropItem(t,o){ o=o||{}; const s=o.s||(m.age<13?pick(['u','c']):pick(['w','w','a','h','f','c','u'])), id=rndItem(s,t,s==='w'?myKind():null); if(id) give(id,{}); return id; }
// 예전부터 있던 물건의 등급 순서(옛 0~3)
const WKIND={검:['isword','gsword','psword','hsword'],도:['bsaber','asaber','dsaber','rsaber'],권:['lglove','sglove','cglove','tglove'],암기:['ldart','gdart','ndart','sdart']};
const ARMORS=['lvest','chain','gvest','silk'];
const WMATCH={검:['검'],도:['도'],권:['권'],장:['권'],암기:['암기'],마공:['권','도'],보법:[],안법:[]};
// 안법: 무기와 무관하고, 위력(p)이 곧 낌새를 읽을 확률에 더해지는 퍼센트다. 가장 높은 것 하나만 친다
const PASSIVE=k=>k==='내공'||k==='보법'||k==='안법';
const eyeArt=()=>m.arts.reduce((v,a)=>a.k==='안법'&&a.p>v?a.p:v,0);
const readBonus=()=>eyeArt()/100+eq('rd')-(m.f.deaf?.1:0)+(hasT('star')?.1:0);
// 보법은 위력이 높을수록 잘 피한다(가장 높은 것 하나)
const stepEv=p=>.06+p*.005;
const stepArt=()=>m.arts.reduce((v,a)=>a.k==='보법'&&stepEv(a.p)>v?stepEv(a.p):v,0);
const pc=v=>Math.round(v*100);
function useText(u){ const p=[]; if(u.hp) p.push(`건강 +${u.hp}`); if(u.ng) p.push(`내공 +${u.ng}년`); if(u.joy) p.push(`행복 +${u.joy}`); if(u.ex) p.push(`수련 +${u.ex}%`); if(u.st) for(const k in u.st) p.push(`${STATN[k]} +${u.st[k]}`); return p.join(' · '); }
function itDesc(it){ if(it.s==='u') return it.use&&!it.d?useText(it.use):(it.d||''); const p=[]; if(it.s==='w') p.push(`${it.k} · 공격 +${it.atk}`); if(it.def) p.push(`방어 +${it.def}`); if(it.d) p.push(it.d);
  if(it.cr) p.push(`회심 +${pc(it.cr)}%`); if(it.ev) p.push(`회피 +${pc(it.ev)}%`); if(it.rd) p.push(`읽기 +${pc(it.rd)}%`); if(it.qi) p.push(`기 +${it.qi}`); if(it.hp) p.push(`기력 +${it.hp}`); if(it.xp) p.push(`수련 +${pc(it.xp)}%`); if(it.st) for(const k in it.st) p.push(`${STATN[k]} +${it.st[k]}`); if(it.note) p.push(it.note);
  return p.join(' · ')||'별다른 힘은 없다'; }
function hasFx(fx){ return !!(m&&m.inv&&m.inv.c&&ITEMS[m.inv.c]&&ITEMS[m.inv.c].fx===fx); }
// 지금 든 무기로 가장 센 무공을 고른다. 갈래가 안 맞는 무기는 절반만 힘을 보탠다.
function artWith(a,w){ const match=w&&(WMATCH[a.k]||[]).includes(w.k); return a.p+(w?(match?w.atk:w.atk*.5):0); }
function combat(wid){ const id=wid===undefined?(m.inv&&m.inv.w):wid, w=id?ITEMS[id]:null; let art=null, pw=w?w.atk*.5:0;
  for(const a of m.arts){ if(PASSIVE(a.k)) continue; const v=artWith(a,w); if(!art||v>pw){ pw=v; art=a; } }
  return {art,w,pw}; }
const power=()=>LVP[m.lv]+combat().pw+m.ng*.35+ST('body')*1.2+(m.f.magong?(m.f.bloodBody?12:6):0)+(hasT('might')?6:0);
const fightP=e=>1/(1+Math.exp(-(power()-e)/9));
// 내 무공 갈래에 맞는 무기 종류
function myKind(){ const a=combat(null).art; const k=a?(WMATCH[a.k]||[])[0]:null; return k||'검'; }
// 옛 등급(0~3)에 맞는 무기 하나. 같은 해에는 같은 것이 나온다(가게와 선택지가 그릴 때마다 바뀌지 않게)
const wOf=(tier,kind)=>{ const rf=seeded(strHash((m&&m.name)||'x')+(m?m.age:0)*131+tier*17+7); return rndItem('w',tgOf(tier,rf),kind||myKind(),rf)||WKIND[kind||myKind()][cl(tier,0,3)]; };
const aOf=tier=>{ const rf=seeded(strHash((m&&m.name)||'x')+(m?m.age:0)*137+tier*19+3); return rndItem('a',tgOf(tier,rf),null,rf)||ARMORS[cl(tier,0,3)]; };
// 저절로 바꿔 차는 기준: 무기는 지금 무공으로 더 센 것, 갑옷은 방어가 높은 것, 머리·신발은 등급이 높은 것. 장신구는 빈 자리일 때만
function better(id,cur){ if(!cur) return true; const a=ITEMS[id], b=ITEMS[cur]; if(a.s==='w'){ const d=combat(id).pw-combat(cur).pw; return d>.01||(Math.abs(d)<=.01&&a.t>b.t); } if(a.s==='a') return (a.def||0)>(b.def||0)||((a.def||0)===(b.def||0)&&a.t>b.t); if(a.s==='h'||a.s==='f') return a.t>b.t; return false; }
function stashPut(id){ const st=m.inv.stash; st.push(id); while(st.length>STASHMAX){ let ci=0; st.forEach((x,i)=>{ if(ITEMS[x].v<ITEMS[st[ci]].v) ci=i; }); const x=st.splice(ci,1)[0]; gold(ITEMS[x].v*.5); } }
function give(id,o){ o=o||{}; const it=ITEMS[id]; if(!it||!m.inv) return false; const inv=m.inv;
  if(it.s==='u') inv.bag[id]=(inv.bag[id]||0)+(o.n||1);
  else if(it.s==='m') inv.mat=(inv.mat||0)+1;
  else if(better(id,inv[it.s])){ if(inv[it.s]) stashPut(inv[it.s]); inv[it.s]=id; }
  else stashPut(id);
  if(!o.quiet){ if(!o.nolog&&it.t>=1) log(`${eul(it.n)} 얻었다`,it.t>=3); vfx(()=>itemToast(id,o.n)); }
  return true; }
function equipBest(){ if(!m.inv) return; const st=m.inv.stash; let bi=-1; st.forEach((id,i)=>{ if(ITEMS[id].s==='w'&&better(id,m.inv.w)&&(bi<0||combat(id).pw>combat(st[bi]).pw)) bi=i; }); if(bi>=0) equipAt(bi); }
function equipAt(i){ const inv=m.inv, id=inv.stash[i]; if(!id) return; const s=ITEMS[id].s; inv.stash.splice(i,1); if(inv[s]) inv.stash.push(inv[s]); inv[s]=id; }
function unequip(s){ const inv=m.inv; if(!inv[s]||inv.stash.length>=STASHMAX) return; inv.stash.push(inv[s]); inv[s]=null; }
function sellAt(i){ const inv=m.inv, id=inv.stash[i]; if(!id) return; inv.stash.splice(i,1); const g=Math.round(ITEMS[id].v*.5); gold(g); vfx(()=>heroFloat(`+${fmt(g)}냥`,'gold')); }
// 내공 약은 먹을수록 덜 듣는다. 소환단 한 알(5년)을 한 번으로 쳐서, n번 먹은 뒤의 약효는 1/(1+n×0.25)배. 기연으로 얻는 내공에는 해당 없다
const medTol=()=>1/(1+((m.f&&m.f.medN)||0)*.25);
function ngMed(n){ const g=Math.round(n*medTol()*10)/10; m.f.medN=(m.f.medN||0)+n/5; return g; }
function useBag(k){ const b=m.inv.bag; if(!(b[k]>0)) return false;
  if(k==='salve'){ if(m.hp>=100) return false; b.salve--; m.hp=cl(m.hp+25); vfx(()=>{ healFx(); heroFloat('건강 +25','good'); }); return true; }
  if(k==='pill'){ b.pill--; const g=ngMed(5); m.ng+=g; m.hp=cl(m.hp+30); vfx(()=>{ healFx(); heroFloat(`내공 +${g}년`,'jade'); }); lvCheck(); return true; }
  // 압생투강주: 내공 +10년. 30%로 주화입마(건강 −25), 그 가운데 절반은 귀를 잃는다(낌새 읽기 −10%)
  if(k==='absinthe'){ b.absinthe--; const g=ngMed(10); if(!m.f.martial) learn('취몽심법',0,'내공',g); else m.ng+=g; m.f.absN=(m.f.absN||0)+1; vfx(()=>{ healFx(); heroFloat(`내공 +${g}년`,'jade'); });
    if(R()<(hasFx('calm')?.15:.3)){ m.hp=Math.max(1,m.hp-25); m.joy=cl(m.joy-8); const ear=!m.f.deaf&&R()<.5; if(ear) m.f.deaf=1;
      log(ear?'압생투강주를 마시고 주화입마에 들었다. 정신을 차려 보니 한쪽 귀가 없었다':'압생투강주를 마시고 주화입마에 들었다',true);
      vfx(()=>{ callout('走火入魔','gi',1800); flashA=.6; flashC='#8fe07a'; toast(ear?'<span><small>주화입마</small><b>귀를 잃었다</b><em>건강 −25 · 낌새 읽기 −10%</em></span>':'<span><small>주화입마</small><b>기가 거꾸로 돌았다</b><em>건강 −25</em></span>','tm',4600); }); }
    else log('압생투강주를 마셨다. 초록빛 불이 단전에 내려앉았다',true);
    lvCheck(); return true; }
  const it=ITEMS[k], u=it&&it.use; if(!u) return false; if(u.hp&&!u.ng&&!u.joy&&!u.ex&&!u.st&&m.hp>=100) return false;
  b[k]--; let got=0; if(u.hp) m.hp=cl(m.hp+u.hp); if(u.ng){ got=ngMed(u.ng); if(!m.f.martial) learn('토납법',0,'내공',got); else m.ng+=got; } if(u.joy) m.joy=cl(m.joy+u.joy); if(u.ex) addExp(gain()*u.ex/100); if(u.st) for(const s in u.st) m.b.st[s]=Math.min(12,(m.b.st[s]||0)+u.st[s]);
  if(it.t>=3) log(`${eul(it.n)} 썼다`,true); vfx(()=>{ healFx(); heroFloat(u.ng?`내공 +${got}년`:useText(u).split(' · ')[0],u.ng?'jade':'good'); }); lvCheck(); return true; }
// 건강이 바닥일 때 저절로 쓰는 약: 건강만 올리는 것 가운데 등급이 낮은 것부터
function autoHeal(){ const b=m.inv.bag, ks=Object.keys(b).filter(k=>b[k]>0&&k!=='salve'&&ITEMS[k]&&ITEMS[k].use&&ITEMS[k].use.hp&&!ITEMS[k].use.st).sort((x,y)=>ITEMS[x].t-ITEMS[y].t); if(!ks.length) return false; const it=ITEMS[ks[0]]; b[ks[0]]--; m.hp=cl(m.hp+it.use.hp); if(it.use.ng) m.ng+=ngMed(it.use.ng); log(`${eul(it.n)} 썼다.`); return true; }
function healFx(){ const h=actorOf('hero'); if(!h) return; for(let i=0;i<5;i++) FX.push({t:'heal',x:h.x-6+i*3,y:h.y-8-(i%2)*6,life:22+i*3,max:30}); }
function bagTotal(){ const b=m.inv.bag; let n=0; for(const k in b) n+=b[k]||0; return n; }

const ICK={검:'sword',도:'saber',권:'glove',암기:'dart',guard:'mirror',dice:'jade',calm:'beads',charm:'sachet',plague:'talis',poison:'pearl',qi:'fan',read:'eye',salve:'jar',pill:'pill',antidote:'vial',absinthe:'bottle',ore:'ore'};
// 장신구와 소모품은 이름에서 모양을 짐작한다
const CIC=[[/반지|가락지|지환|환$/,'ring'],[/염주|구슬|주$|단주/,'beads'],[/향낭|주머니|낭$/,'sachet'],[/부적|부$|符/,'talis'],[/거울|경$/,'mirror'],[/부채|선$/,'fan'],[/눈|안$|안주|안석/,'eye']];
function itIcon(id){ const it=ITEMS[id]; if(!it) return iconUrl('empty',0); let kind;
  if(it.s==='w') kind=ICK[it.k]; else if(it.s==='a') kind='armor'; else if(it.s==='h') kind='hat'; else if(it.s==='f') kind='boot';
  else if(it.s==='c'){ kind=ICK[it.fx]; if(!kind){ const c=CIC.find(x=>x[0].test(it.n)); kind=c?c[1]:'jade'; } }
  else if(it.s==='u'){ kind=ICK[id]; if(!kind){ const u=it.use||{}; kind=u.st?'pill':u.ng?'pill':u.ex?'scroll':u.joy&&!u.hp?'gourd':/술|주$|차$|탕$/.test(it.n)?'gourd':/단$|환$/.test(it.n)?'pill':'jar'; } }
  else kind=ICK[id];
  // 이미지 스킨: icon/<물건 이름> → icon/<모양>_<등급> → icon/<모양>
  return skinUrl('icon/'+it.n,'icon/'+id,'icon/'+kind+'_'+TIER[it.t],'icon/'+kind)||iconUrl(kind,it.t); }
const icImg=(url,cls)=>`<img class="mh-ic ${cls||''}" src="${url}" alt="" width="28" height="28">`;
const grTag=t=>`<span class="mh-gr g-${TIER[t]}">${TIER[t]}</span>`;
function itemToast(id,n){ const it=ITEMS[id]; sfx(it.t>=3?'giyeon':'get'); toast(`${icImg(itIcon(id))}<span><small>획득 · ${it.s==='u'?'소모품':it.s==='m'?'재료':SLOTN[it.s]} ${grTag(it.t)}</small><b>${esc(it.n)}${n>1?` ×${n}`:''}</b><em>${esc(itDesc(it))}</em></span>`,'gr'+it.t,it.t>=3?4600:3400);
  const h=actorOf('hero'); if(h) fxSpark(h.x,h.y-10,it.t>=3?'#ffe9a0':'#ffffff',it.t>=3?16:8); }
function artToast(n,p,k,ng){ sfx('get'); toast(`${icImg(iconUrl('scroll',k==='마공'?2:k==='내공'?1:0))}<span><small>새 무공 · ${esc(k)}</small><b>${esc(n)}</b><em>${k==='내공'?`내공 +${ng||0}년`:k==='안법'?`낌새 읽기 +${p}%`:k==='보법'?`회피 +${Math.round(stepEv(p)*100)}%`:`위력 ${p}`}${ng&&k!=='내공'?` · 내공 +${ng}년`:''}</em></span>`,k==='마공'?'tm':'t1',4200);
  const h=actorOf('hero'); if(h) fxSpark(h.x,h.y-10,k==='마공'?'#ff8a70':'#bfe8ff',12); }
