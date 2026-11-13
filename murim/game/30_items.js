/* ==== murim:items — 장비·행낭·무위 ==== */
const TIER=['범품','양품','명품','신병'];
// s: w 무기 · a 갑옷 · c 장신구 · u 소모품 · m 재료 / k: 무기 갈래 / t: 등급 / v: 값(냥)
const ITEMS={
  wsword:{n:'목검',s:'w',k:'검',atk:2,t:0,v:2},
  isword:{n:'철검',s:'w',k:'검',atk:5,t:0,v:14},
  gsword:{n:'청강검',s:'w',k:'검',atk:9,t:1,v:70},
  psword:{n:'송문고검',s:'w',k:'검',atk:14,t:2,v:260},
  hsword:{n:'한월검',s:'w',k:'검',atk:21,t:3,v:900},
  bsaber:{n:'박도',s:'w',k:'도',atk:5,t:0,v:12},
  asaber:{n:'안령도',s:'w',k:'도',atk:9,t:1,v:65},
  dsaber:{n:'귀두대도',s:'w',k:'도',atk:14,t:2,v:240},
  rsaber:{n:'용린도',s:'w',k:'도',atk:21,t:3,v:900},
  lglove:{n:'가죽 수투',s:'w',k:'권',atk:4,t:0,v:8},
  sglove:{n:'정강 수투',s:'w',k:'권',atk:8,t:1,v:60},
  cglove:{n:'천잠 수투',s:'w',k:'권',atk:13,t:2,v:230},
  tglove:{n:'벽력 수투',s:'w',k:'권',atk:20,t:3,v:900},
  ldart:{n:'비도',s:'w',k:'암기',atk:4,t:0,v:8},
  gdart:{n:'유엽비도',s:'w',k:'암기',atk:8,t:1,v:60},
  ndart:{n:'폭우침통',s:'w',k:'암기',atk:13,t:2,v:230},
  sdart:{n:'만천성우',s:'w',k:'암기',atk:20,t:3,v:900},
  lvest:{n:'가죽 조끼',s:'a',def:2,t:0,v:10},
  chain:{n:'쇄자갑',s:'a',def:5,t:1,v:80},
  gvest:{n:'금사갑',s:'a',def:9,t:2,v:300},
  silk:{n:'천잠보의',s:'a',def:13,t:3,v:900},
  mirror:{n:'호심경',s:'c',fx:'guard',t:1,v:90,d:'목숨이 끊길 일격을 한 번 대신 받고 깨진다'},
  jadep:{n:'평안옥패',s:'c',fx:'dice',t:1,v:80,d:'주사위에 +1'},
  beads:{n:'백팔염주',s:'c',fx:'calm',t:1,v:70,d:'심마가 절반만 쌓인다'},
  sachet:{n:'향낭',s:'c',fx:'charm',t:0,v:15,d:'매력 +1'},
  talis:{n:'벽사부',s:'c',fx:'plague',t:0,v:12,d:'역병이 비켜 간다'},
  pearl:{n:'피독주',s:'c',fx:'poison',t:2,v:280,d:'독이 통하지 않는다'},
  fan:{n:'학우선',s:'c',fx:'qi',t:2,v:260,d:'결투에서 기가 빨리 찬다'},
  eyebead:{n:'명안주',s:'c',fx:'read',rd:.08,t:1,v:110,d:'결투에서 낌새를 읽을 확률 +8%'},
  hawkeye:{n:'응안석',s:'c',fx:'read',rd:.15,t:2,v:320,d:'결투에서 낌새를 읽을 확률 +15%'},
  salve:{n:'금창약',s:'u',t:0,v:8,d:'결투 중 체력 +25'},
  pill:{n:'소환단',s:'u',t:2,v:120,d:'내공 +5년, 건강 +30'},
  antidote:{n:'해독단',s:'u',t:1,v:20,d:'웬만한 독은 푼다'},
  absinthe:{n:'압생투강주',s:'u',t:3,v:300,d:'마시면 내공 +10년. 열에 셋은 주화입마가 오고, 귀를 잃을 수도 있다',lore:'서역에서 온 초록빛 독주. 이 술을 마시고 칩 설계를 하다가 제 귀를 잘랐다는 도X구의 이야기가 전한다.'},
  ore:{n:'천외운철',s:'m',t:3,v:400,d:'별에서 떨어진 쇠. 솜씨 좋은 대장장이를 만나면 신병이 된다'}
};
for(const k in ITEMS) ITEMS[k].id=k;
// 등급 0(범품)~3(신병) 순서
const WKIND={검:['isword','gsword','psword','hsword'],도:['bsaber','asaber','dsaber','rsaber'],권:['lglove','sglove','cglove','tglove'],암기:['ldart','gdart','ndart','sdart']};
const ARMORS=['lvest','chain','gvest','silk'];
const WMATCH={검:['검'],도:['도'],권:['권'],장:['권'],암기:['암기'],마공:['권','도'],보법:[],안법:[]};
// 안법: 무기와 무관하고, 위력(p)이 곧 낌새를 읽을 확률에 더해지는 퍼센트다. 가장 높은 것 하나만 친다
const PASSIVE=k=>k==='내공'||k==='보법'||k==='안법';
const eyeArt=()=>m.arts.reduce((v,a)=>a.k==='안법'&&a.p>v?a.p:v,0);
const readBonus=()=>eyeArt()/100+(hasFx('read')?ITEMS[m.inv.c].rd||0:0)-(m.f.deaf?.1:0);
const itDesc=it=>it.s==='w'?`${it.k} · 공격 +${it.atk}`:it.s==='a'?`방어 +${it.def}`:(it.d||'');
function hasFx(fx){ return !!(m&&m.inv&&m.inv.c&&ITEMS[m.inv.c]&&ITEMS[m.inv.c].fx===fx); }
// 지금 든 무기로 가장 센 무공을 고른다. 갈래가 안 맞는 무기는 절반만 힘을 보탠다.
function artWith(a,w){ const match=w&&(WMATCH[a.k]||[]).includes(w.k); return a.p+(w?(match?w.atk:w.atk*.5):0); }
function combat(wid){ const id=wid===undefined?(m.inv&&m.inv.w):wid, w=id?ITEMS[id]:null; let art=null, pw=w?w.atk*.5:0;
  for(const a of m.arts){ if(PASSIVE(a.k)) continue; const v=artWith(a,w); if(!art||v>pw){ pw=v; art=a; } }
  return {art,w,pw}; }
const power=()=>LVP[m.lv]+combat().pw+m.ng*.35+ST('body')*1.2+(m.f.magong?6:0);
const fightP=e=>1/(1+Math.exp(-(power()-e)/9));
// 내 무공 갈래에 맞는 무기 종류
function myKind(){ const a=combat(null).art; const k=a?(WMATCH[a.k]||[])[0]:null; return k||'검'; }
const wOf=(tier,kind)=>WKIND[kind||myKind()][cl(tier,0,3)];
function better(id,cur){ if(!cur) return true; const a=ITEMS[id], b=ITEMS[cur]; if(a.s==='w') return combat(id).pw>combat(cur).pw+.01; if(a.s==='a') return a.def>b.def; return false; }
function stashPut(id){ const st=m.inv.stash; st.push(id); while(st.length>6){ let ci=0; st.forEach((x,i)=>{ if(ITEMS[x].v<ITEMS[st[ci]].v) ci=i; }); const x=st.splice(ci,1)[0]; gold(ITEMS[x].v*.5); } }
function give(id,o){ o=o||{}; const it=ITEMS[id]; if(!it||!m.inv) return false; const inv=m.inv;
  if(it.s==='u') inv.bag[id]=(inv.bag[id]||0)+(o.n||1);
  else if(it.s==='m') inv.mat=(inv.mat||0)+1;
  else if(better(id,inv[it.s])){ if(inv[it.s]) stashPut(inv[it.s]); inv[it.s]=id; }
  else stashPut(id);
  if(!o.quiet){ if(!o.nolog) log(`${eul(it.n)} 얻었다`,it.t>=2); vfx(()=>itemToast(id,o.n)); }
  return true; }
function equipBest(){ if(!m.inv) return; const st=m.inv.stash; let bi=-1; st.forEach((id,i)=>{ if(ITEMS[id].s==='w'&&better(id,m.inv.w)&&(bi<0||combat(id).pw>combat(st[bi]).pw)) bi=i; }); if(bi>=0) equipAt(bi); }
function equipAt(i){ const inv=m.inv, id=inv.stash[i]; if(!id) return; const s=ITEMS[id].s; inv.stash.splice(i,1); if(inv[s]) inv.stash.push(inv[s]); inv[s]=id; }
function unequip(s){ const inv=m.inv; if(!inv[s]||inv.stash.length>=6) return; inv.stash.push(inv[s]); inv[s]=null; }
function sellAt(i){ const inv=m.inv, id=inv.stash[i]; if(!id) return; inv.stash.splice(i,1); const g=Math.round(ITEMS[id].v*.5); gold(g); vfx(()=>heroFloat(`+${fmt(g)}냥`,'gold')); }
function useBag(k){ const b=m.inv.bag; if(!(b[k]>0)) return false;
  if(k==='salve'){ if(m.hp>=100) return false; b.salve--; m.hp=cl(m.hp+25); vfx(()=>{ healFx(); heroFloat('건강 +25','good'); }); return true; }
  if(k==='pill'){ b.pill--; m.ng+=5; m.hp=cl(m.hp+30); vfx(()=>{ healFx(); heroFloat('내공 +5년','jade'); }); return true; }
  // 압생투강주: 내공 +10년. 30%로 주화입마(건강 −25), 그 가운데 절반은 귀를 잃는다(낌새 읽기 −10%)
  if(k==='absinthe'){ b.absinthe--; if(!m.f.martial) learn('취몽심법',0,'내공',10); else m.ng+=10; m.f.absN=(m.f.absN||0)+1; vfx(()=>{ healFx(); heroFloat('내공 +10년','jade'); });
    if(R()<.3){ m.hp=Math.max(1,m.hp-25); m.joy=cl(m.joy-8); const ear=!m.f.deaf&&R()<.5; if(ear) m.f.deaf=1;
      log(ear?'압생투강주를 마시고 주화입마에 들었다. 정신을 차려 보니 한쪽 귀가 없었다':'압생투강주를 마시고 주화입마에 들었다',true);
      vfx(()=>{ callout('走火入魔','gi',1800); flashA=.6; flashC='#8fe07a'; toast(ear?'<span><small>주화입마</small><b>귀를 잃었다</b><em>건강 −25 · 낌새 읽기 −10%</em></span>':'<span><small>주화입마</small><b>기가 거꾸로 돌았다</b><em>건강 −25</em></span>','tm',4600); }); }
    else log('압생투강주를 마셨다. 초록빛 불이 단전에 내려앉았다',true);
    lvCheck(); return true; }
  return false; }
function healFx(){ const h=actorOf('hero'); if(!h) return; for(let i=0;i<5;i++) FX.push({t:'heal',x:h.x-6+i*3,y:h.y-8-(i%2)*6,life:22+i*3,max:30}); }
function bagTotal(){ const b=m.inv.bag; return (b.salve||0)+(b.pill||0)+(b.antidote||0)+(b.absinthe||0); }

const ICK={검:'sword',도:'saber',권:'glove',암기:'dart',guard:'mirror',dice:'jade',calm:'beads',charm:'sachet',plague:'talis',poison:'pearl',qi:'fan',read:'eye',salve:'jar',pill:'pill',antidote:'vial',absinthe:'bottle',ore:'ore'};
function itIcon(id){ const it=ITEMS[id]; if(!it) return iconUrl('empty',0); const kind=it.s==='w'?ICK[it.k]:it.s==='a'?'armor':it.s==='c'?ICK[it.fx]:ICK[id]; return iconUrl(kind,it.t); }
const icImg=(url,cls)=>`<img class="mh-ic ${cls||''}" src="${url}" alt="" width="28" height="28">`;
function itemToast(id,n){ const it=ITEMS[id]; sfx(it.t>=2?'giyeon':'get'); toast(`${icImg(itIcon(id))}<span><small>획득 · ${TIER[it.t]}</small><b>${esc(it.n)}${n>1?` ×${n}`:''}</b><em>${esc(itDesc(it))}</em></span>`,'t'+it.t,it.t>=2?4600:3400);
  const h=actorOf('hero'); if(h) fxSpark(h.x,h.y-10,it.t>=2?'#ffe9a0':'#ffffff',it.t>=2?16:8); }
function artToast(n,p,k,ng){ sfx('get'); toast(`${icImg(iconUrl('scroll',k==='마공'?2:k==='내공'?1:0))}<span><small>새 무공 · ${esc(k)}</small><b>${esc(n)}</b><em>${k==='내공'?`내공 +${ng||0}년`:k==='안법'?`낌새 읽기 +${p}%`:`위력 ${p}`}${ng&&k!=='내공'?` · 내공 +${ng}년`:''}</em></span>`,k==='마공'?'tm':'t1',4200);
  const h=actorOf('hero'); if(h) fxSpark(h.x,h.y-10,k==='마공'?'#ff8a70':'#bfe8ff',12); }
