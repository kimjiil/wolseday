/* ==== murim:map — 맵 위에서 사는 법: 걷기, 장소, 철마다 하는 일 ==== */
const MAPAGE=5, SEAN=['봄','여름','가을','겨울'];
let MAPON=false, VIL=null, HOMEM=null, SECTM=null, CUTQ=[], KEYS={}, MSPOT=null, MTALK=null, MSHOP=null;
const cutNow=()=>CUTQ[0]||null;
const resWait=()=>!!(m&&m.lastRes&&m.lastRes.age===m.age&&!m.lastRes.seen&&!m.tev&&!m.pending&&!m.dead);
const mapMode=()=>!!(m&&m.phase==='play'&&!m.dead&&m.age>=MAPAGE&&!(m.train&&m.tev)&&!DUEL&&!m.pending&&!m.milestone&&!CUTQ.length&&!resWait());
// 맡기기: 사건은 잠깐 보여 주고 알아서 고른다. 결과는 '계속'을 눌러야 넘어간다
const evMs=()=>2400/(1+(SPD[spd]-1)*.25);
const mpos=()=>m.train?(m.smap||(m.smap={x:14,y:13,dir:'d'})):m.map;
const MAPSPEC={map:1,key:'map'};
function curMap(){ if(m.train){ const id='sect:'+(m.sect||'none'); if(!SECTM||SECTM.id!==id||SECTM.name!==m.train.place) SECTM=buildSect(m.sect||'none',m.train.place,m.sect&&SECTS[m.sect]?dk(vivid(SECTS[m.sect].robe,.2),.3):null,!m.sect&&m.f.master); return SECTM; } const t=FAMTIER[m.b.o]||0; if(m.map.id==='home'){ if(!HOMEM||HOMEM.id!=='home:'+t) HOMEM=buildHome(t); return HOMEM; } const id='vil:'+m.b.o+t; if(!VIL||VIL.id!==id) VIL=buildVillage(m.b.o,t); return VIL; }
function mkMA(id,L,x,y,o){ return Object.assign({id,L,tx:x,ty:y,fx:x,fy:y,px:x*TL+8,py:y*TL+13,dir:'d',ph:rnd(hsh(seedOf(id))*60),wf:0,moving:false,mv:0,path:null},o||{}); }
const spotAt=(M,x,y)=>M.spots.find(s=>(s.x===x&&s.y===y)||(s.zone&&x>=s.zone[0]&&y>=s.zone[1]&&x<s.zone[0]+s.zone[2]&&y<s.zone[1]+s.zone[3]))||null;
/* ---- 맵에 사는 사람들 ---- */
const VSAY=['올해 농사는 어떨는지.','장터에 방물장수가 왔다더라.','뒷산 폭포 물이 불었어.','무관 사범이 새 제자를 받는다던데.','객잔에 낯선 칼잡이가 묵고 있대.','세금이 또 오른다는 소문이야.','밤길 조심하게.','사당에 절이라도 올리고 가게.'];
function mapNpcs(M){ const out=[], a=m.age, add=(id,L,x,y,o)=>{ out.push(mkMA(id,L,x,y,o)); };
  if(M.sect){ const mr=m.rels.find(x=>x.role==='사부'); add('master',M.herm?LOOK.master():masterLook(),15,9,{n:mr?mr.name:'사부',tag:'사부',say:()=>pick(['서두르지 마라. 초식은 몸이 외우는 것이다.','오늘 몫은 다 했느냐.','검을 쥐기 전에 마음부터 쥐어라.','게으름은 칼보다 빨리 사람을 벤다.'])});
    [0,1,2].forEach(i=>{ if(!alive(i)) return; const x=mt(i); add('mate'+i,mateLook(i),[12,17,18][i],[10,10,13][i],{wander:[11,9,8,5],n:x.name,tag:x.role,mate:i,say:()=>pick(x.rival?['비켜. 수련에 방해된다.','다음 비무 때 보자.','…뭘 봐.']:x.v>=65?['오늘 저녁에 뒷산 갈래?','네가 있어서 버틴다.','같이 수련할까?']:['사부님 기분이 안 좋으셔. 조심해.','주방 할멈이 찾으시더라.','요즘 초식이 늘었던데?'])}); });
    if(!M.herm) for(let i=0;i<2;i++) add('d'+i,npcLook({name:'제자'+i+m.sect,age:15+i*3,sect:m.sect,hair:m.sect==='shaolin'?'bald':null}),[7,24][i],[12,13][i],{wander:[[4,11,5,2],[21,11,5,2]][i],n:'동문 제자',say:()=>pick(['장작 패기 당번이 또 나야.','산 아래 장터에 당과 장수가 왔대.','대사형한테 걸리면 죽음이야.'])});
    return out; }
  if(M.indoor){ const I=M.inner, c=[[I[0]+1,I[1]+2],[I[0]+I[2]-2,I[1]+1],[I[0]+2,I[1]+I[3]-1],[I[0]+I[2]-2,I[1]+I[3]-1],[I[0]+3,I[1]+1]].filter(p=>walkable(M,p[0],p[1])); let i=0;
    const put=(id,L,o)=>{ const p=c[i++]; if(p) add(id,L,p[0],p[1],Object.assign({wander:I,kin:1},o)); };
    const mo=relOf('어머니'), fa=relOf('아버지');
    if(mo&&a<45) put('mo',relLook(mo),{n:'어머니',say:()=>pick(a<12?['밥은 먹었니?','멀리 가지 말고 놀아라.','옷 좀 여며라.']:['몸은 성하냐.','끼니 거르지 마라.','네 아버지를 꼭 닮았구나.'])});
    if(fa&&a<45) put('fa',relLook(fa),{n:'아버지',say:()=>pick(a<12?['어른 말씀 잘 들어라.','이리 와서 이것 좀 잡아라.']:['사내는 제 밥벌이는 해야지.','세상이 어수선하다. 조심해라.','요즘 일은 할 만하냐.'])});
    if(m.spouse&&!m.spouse.dead) put('sp',relLook(m.spouse),{n:m.spouse.name,say:()=>pick(['오셨어요.','오늘은 일찍 들어왔네요.','아이들이 당신을 찾았어요.','같이 저녁 들어요.'])});
    m.rels.filter(r=>r.role==='자식'&&!r.dead).slice(0,2).forEach((k,j)=>put('kd'+j,relLook(k),{n:k.name,say:()=>pick(relAge(k)<13?['놀아 줘요!','오늘 냇가에서 가재 잡았어요.','저도 칼 가르쳐 주세요.']:['다녀오셨습니까.','저도 이제 다 컸습니다.'])}));
    if(m.sib>0&&a<16) put('sb',a>9?LOOK.child():LOOK.girl(),{n:'동생',say:()=>pick(['같이 놀자!','나도 데려가.','엄마가 찾았어.'])});
    return out; }
  const W=M.wander;
  for(let i=0;i<5;i++){ const w=W[i%W.length]; let x=w[0]+rnd(hsh(i*3.7+2)*(w[2]-1)), y=w[1]+rnd(hsh(i*5.1+4)*(w[3]-1)); if(!walkable(M,x,y)){ x=21; y=17+i; } add('v'+i,npcLook({name:'마을'+i+m.b.reg,age:16+((i*17)%50)}),x,y,{wander:w,n:'마을 사람',say:()=>pick(VSAY)}); }
  add('k0',LOOK.child(),19,16,{wander:[17,14,10,5],n:'아이',say:()=>pick(['잡아 봐라!','나도 크면 무림인이 될 거야.','저기 폭포에 도사가 산대.'])});
  add('k1',LOOK.girl(),23,16,{wander:[17,14,10,5],n:'아이',say:()=>pick(['술래잡기 하자.','엿 사 먹고 싶다.'])});
  add('m0',LOOK.merchant({size:'adult'}),18,12,{n:'과일 장수',say:()=>'어서 오게. 싱싱한 것만 있네.'}); add('m1',LOOK.woman(),20,12,{n:'비단 장수',say:()=>'색이 곱지요?'}); add('m2',LOOK.peddler(),25,12,{n:'잡화 장수',say:()=>'없는 것 빼고 다 있소.'});
  add('sm',LOOK.smith({tool:'hammer'}),15,15,{dir:'r',pose:'tool',n:'대장장이',say:()=>pick(['쇠는 정직하지.','좋은 칼은 값을 하네.'])});
  add('ik',LOOK.merchant({robe:'#8a6f5a'}),31,15,{n:'객잔 주인',say:()=>pick(['한잔하고 가시게.','요즘 손님들 입이 무겁다네.'])});
  add('tc',LOOK.swordsman({hair:'band'}),23,10,{n:'무관 사범',say:()=>pick(m.f.martial?['자세가 좋아졌군.','검은 손이 아니라 허리로 쓰는 거다.']:['배우고 싶으면 열 냥을 가져오너라.','구경은 공짜다.'])});
  if(m.f.dog&&a-m.f.dog<14) add('dog',LOOK.dog(),8,23,{wander:[2,22,12,2],n:'누렁이',say:()=>'멍!'});
  const R1=[['친구',24,18],['지기',20,17],['맞수',19,10],['정인',34,16],['은사',32,5]];
  for(const [role,x,y] of R1){ const r=relOf(role); if(r&&walkable(M,x,y)) add('r_'+role,relLook(r),x,y,{n:r.name,tag:role,kin:1,say:()=>pick(role==='맞수'?['다음엔 내가 이긴다.','게을러진 건 아니겠지.']:role==='정인'?['기다렸어요.','오늘은 달이 밝겠네요.']:role==='은사'?['서두르지 마라. 물은 낮은 데로 흐른다.']:['오랜만이야.','한잔할까?','요즘 어떻게 지내?'])}); }
  return out; }
function mapEnter(force){ if(!m.map) m.map={id:'vil',x:7,y:22,dir:'d'}; if(m.sea==null) m.sea=0;
  if(!m.train&&m.smap) m.smap=null; if(m.train&&m.mark){ delete m.used[m.mark.id]; m.mark=null; }
  const M=curMap(), P0=mpos(), sea=m.train?TSEAS[m.train.turn%6]:m.sea; if(MAPV&&MAPV.M===M&&MAPV.b===m.b&&!force){ MAPV.season=sea; const L=heroLook(); if(L.key!==MAPV.hero.L.key) MAPV.hero.L=L; return; }
  if(!walkable(M,P0.x,P0.y)){ P0.x=M.start[0]; P0.y=M.start[1]; } if(!MAPV||!!MAPV.M.sect!==!!M.sect) m.ai=null;
  const hero=mkMA('hero',heroLook(),P0.x,P0.y,{dir:P0.dir||'d'});
  MAPV={M,b:m.b,season:sea,actors:[hero].concat(mapNpcs(M)),hero,cam:{x:0,y:0},marks:[],step:mapStep,after:mapAfter,tint:M.indoor?['#ffe6c0',.18]:null};
  fadeA=RED?0:1; MSPOT=spotAt(M,hero.tx,hero.ty); MTALK=null; MSHOP=null; mapTags(); mapMarks(); }
function mapTags(){ const el=$m('mhTags'); if(!el||!MAPV) return; el.textContent=''; MAPV.tags=[];
  for(const s of MAPV.M.spots){ if(!s.lab) continue; const d=document.createElement('span'); const mine=!MAPV.M.sect&&(s.id===WORKSPOT[m.b.o]||s.id==='home'); d.className='mh-tag pl'+(mine?' me':''); d.textContent=(MAPV.M.sect&&s.id==='craft'?craftName().replace(/[을를] .*$/,''):s.n)+(mine&&s.id!=='home'?' · 일터':''); el.appendChild(d); MAPV.tags.push({d,x:s.lab[0],y:s.lab[1]}); }
  for(const a of MAPV.actors){ if(!a.tag) continue; const d=document.createElement('span'); d.className='mh-tag'; d.textContent=a.tag; el.appendChild(d); MAPV.tags.push({d,a}); } }
function mapMarks(){ if(!MAPV) return; MAPV.marks=[]; if(m.mark&&!MAPV.M.indoor&&!MAPV.M.sect){ const s=spotOf(MAPV.M,markSpotId(MAPV.M)); if(s){ const z=s.zone; MAPV.marks.push({x:z?z[0]+(z[2]-1)/2:s.x,y:z?z[1]+(z[3]-1)/2:s.y,up:14,c:EV[m.mark.id]&&EV[m.mark.id].gi?'#ffe9a0':'#ffffff'}); } } }
function mapAfter(){ const V=MAPV; if(!V.tags) return; const c=V.cam; for(const t of V.tags){ const x=t.a?t.a.px:t.x*TL, y=t.a?t.a.py-lookH(t.a.L)-3:t.y*TL, sx=x-c.x, sy=y-c.y, vis=sx>4&&sx<W-4&&sy>4&&sy<H-2; if(t.v!==vis){ t.v=vis; t.d.style.display=vis?'':'none'; } if(vis&&(t.sx!==sx||t.sy!==sy)){ t.sx=sx; t.sy=sy; t.d.style.left=(sx/W*100)+'%'; t.d.style.top=(sy/H*100)+'%'; } } }
/* ---- 걷기 ---- */
function stepTo(a,dx,dy){ a.dir=dx>0?'r':dx<0?'l':dy>0?'d':'u'; a.fx=a.tx; a.fy=a.ty; a.tx+=dx; a.ty+=dy; a.mv=0; a.moving=true; }
function bfs(M,sx,sy,tx,ty){ if(sx===tx&&sy===ty) return []; if(!walkable(M,tx,ty)) return null; const w=M.w, prev=new Int32Array(w*M.h).fill(-1), q=[sy*w+sx]; prev[sy*w+sx]=sy*w+sx;
  for(let qi=0;qi<q.length;qi++){ const c=q[qi], x=c%w, y=(c-x)/w; if(x===tx&&y===ty){ const out=[]; let k=c; while(k!==sy*w+sx){ out.push([k%w,(k-k%w)/w]); k=prev[k]; } return out.reverse(); }
    for(const d of [[0,1],[1,0],[0,-1],[-1,0]]){ const nx=x+d[0], ny=y+d[1], n=ny*w+nx; if(walkable(M,nx,ny)&&prev[n]<0){ prev[n]=c; q.push(n); } } }
  return null; }
function goTile(x,y,then){ const V=MAPV, h=V.hero; const p=bfs(V.M,h.tx,h.ty,x,y); if(!p) return false; h.path=p; h.then=then||null; if(!p.length&&then){ h.then=null; then(); } return true; }
function goSpot(id){ if(!MAPV) return; if(MAPV.M.indoor){ if(id==='home'||id==='rest'){ const s=spotOf(MAPV.M,'rest'); if(s) goTile(s.x,s.y); return; } leaveHome(); }
  const s=spotOf(MAPV.M,id); if(!s) return false; return goTile(s.x,s.y); }
function heroStep(dx,dy){ const V=MAPV, M=V.M, h=V.hero, nx=h.tx+dx, ny=h.ty+dy; h.path=null; h.then=null; h.dir=dx>0?'r':dx<0?'l':dy>0?'d':'u';
  if(!walkable(M,nx,ny)){ const s=M.spots.find(s=>s.door&&s.door[0]===nx&&s.door[1]===ny); if(s&&s.id==='home') enterHome(); return; }
  stepTo(h,dx,dy); }
function enterHome(){ m.map={id:'home',x:-1,y:-1,dir:'u'}; mapEnter(true); sfx('ok'); render(); save(); }
function leaveHome(){ m.map={id:'vil',x:7,y:22,dir:'d'}; mapEnter(true); render(); save(); }
function heroArrive(){ const V=MAPV, M=V.M, h=V.hero, P0=mpos(); P0.x=h.tx; P0.y=h.ty; P0.dir=h.dir;
  if(M.g[h.ty][h.tx]==='D'){ leaveHome(); return; }
  const s=spotAt(M,h.tx,h.ty);
  if(markHere(M,s)&&!m.train){ h.path=null; h.then=null; MSPOT=s; triggerMark(); return; }
  if(s!==MSPOT||MTALK||MSHOP){ MSPOT=s; MTALK=null; MSHOP=null; render(); }
  if(h.then&&!(h.path&&h.path.length)){ const f=h.then; h.then=null; f(); } }
function mapStep(){ const V=MAPV, M=V.M, h=V.hero; if(!m||!MAPON) return; const fast=m.auto&&!paused?SPD[spd]:1;
  for(const a of V.actors){
    if(a.moving){ a.wf++; a.mv+=a===h?fast/8:1/20; if(a.mv>=1){ a.mv=1; a.moving=false; } a.px=(a.fx+(a.tx-a.fx)*a.mv)*TL+8; a.py=(a.fy+(a.ty-a.fy)*a.mv)*TL+13; if(!a.moving&&a===h) heroArrive(); if(MAPV!==V) return; }
    else if(a!==h&&a.wander&&!RED&&(tk+a.ph*13)%130===0&&R()<.7&&!(MTALK&&MTALK.a===a)){ const d=pick([[1,0],[-1,0],[0,1],[0,-1]]), nx=a.tx+d[0], ny=a.ty+d[1], w=a.wander; if(nx>=w[0]&&ny>=w[1]&&nx<w[0]+w[2]&&ny<w[1]+w[3]&&walkable(M,nx,ny)&&!(nx===h.tx&&ny===h.ty)) stepTo(a,d[0],d[1]); }
    if(a.emoT&&--a.emoT<=0) a.emote=null; }
  if(!h.moving&&mapMode()){ if(h.path&&h.path.length){ const p=h.path.shift(), dx=p[0]-h.tx, dy=p[1]-h.ty; if(Math.abs(dx)+Math.abs(dy)===1&&walkable(M,p[0],p[1])) stepTo(h,dx,dy); else h.path=null; }
    else if(!m.auto||paused){ const d=KEYS.u?[0,-1]:KEYS.d?[0,1]:KEYS.l?[-1,0]:KEYS.r?[1,0]:null; if(d) heroStep(d[0],d[1]); } } }
function mapTap(lx,ly){ if(!MAPON||!MAPV||!mapMode()||(m.auto&&!paused)) return; const V=MAPV, M=V.M, wx=V.cam.x+lx, wy=V.cam.y+ly, tx=Math.floor(wx/TL), ty=Math.floor(wy/TL);
  const n=V.actors.find(a=>a!==V.hero&&Math.abs(a.px-wx)<8&&wy<a.py+3&&wy>a.py-26); if(n){ goTalk(n); return; }
  if(walkable(M,tx,ty)){ goTile(tx,ty); return; }
  const o=M.objs.find(o=>o.mid&&tx>=o.x&&tx<o.x+o.w&&ty>=o.y-1&&ty<o.y+o.h); if(o){ const s=spotOf(M,o.mid); if(s){ goTile(s.x,s.y,o.mid==='home'?()=>{ MAPV.hero.dir='u'; }:null); return; } }
  let best=null, bd=9; for(let j=-2;j<=2;j++) for(let i=-2;i<=2;i++){ const d=Math.abs(i)+Math.abs(j); if(d<bd&&walkable(M,tx+i,ty+j)){ bd=d; best=[tx+i,ty+j]; } } if(best) goTile(best[0],best[1]); }
function goTalk(a){ const V=MAPV, h=V.hero; let best=null, bd=1e9; for(const d of [[0,1],[1,0],[-1,0],[0,-1],[0,0]]){ const x=a.tx+d[0], y=a.ty+d[1]; if(!walkable(V.M,x,y)) continue; const p=bfs(V.M,h.tx,h.ty,x,y); if(p&&p.length<bd){ bd=p.length; best=[x,y]; } }
  if(!best) return; goTile(best[0],best[1],()=>{ const dx=a.tx-h.tx, dy=a.ty-h.ty; if(dx||dy) h.dir=Math.abs(dx)>=Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u'); talk(a); }); }
function talk(a){ const k=m.age*4+m.sea; MTALK={a,t:a.say?a.say():'…'}; MSHOP=null; if(a.kin&&a.tk!==k){ a.tk=k; m.bond=cl(m.bond+1); m.joy=cl(m.joy+.5); a.emote='heart'; a.emoT=70; } else { a.emote=a.L.animal?'note':'...'; a.emoT=50; } sfx('ok'); render(); }
/* ---- 철마다 하는 일 ---- */
const WORKN={tenant:'지주의 논에서 일한다',farmer:'밭일을 한다',blood:'밭일을 한다',beggar:'동냥을 한다',artisan:'쇠를 두드린다',merchant:'가게를 본다',hunter:'사냥을 나간다',inn:'객잔 일을 돕는다',bandit:'길목을 지킨다',escort:'표행을 나선다',doctor:'약방 일을 돕는다',official:'관아에서 문서를 쓴다',clan:'가문의 일을 거든다',tangc:'가문의 일을 거든다'};
for(const f of FAM) if(f.wn&&!WORKN[f.id]) WORKN[f.id]=f.wn;
function seasonAct(fid,o){ const a=m.age, O=OR(m.b.o), work=a<10?0:a<16?.5:a<60?1:.6, q=.25; let t='';
  switch(fid){
    case 'train': if(m.f.martial){ addExp(gain()*q*(o.fall?.85:1.05)); m.ng+=(.3+ST('wit')/30)*q*(o.fall?1.6:1); m.hp-=q; t=pick(o.fall?['폭포 아래 서서 한 철을 보냈다.','물소리에 맞춰 숨을 골랐다.']:['같은 초식을 천 번씩 펼쳤다.','달빛 아래서 검로를 다시 그려 보았다.','손이 기억할 때까지 같은 동작을 되풀이했다.']); }
      else if(a>=8){ m.joy+=.5; t='어깨너머로 무관 사범의 동작을 따라 했다.'; } else { m.joy+=1; t='나뭇가지를 칼 삼아 휘두르며 놀았다.'; } break;
    case 'enroll': gold(-10); learn('삼재검법',6,'검'); addExp(2); if(!m.inv.w) give('wsword',{quiet:1}); log('마을 무관에 들어가 삼재검법을 배웠다.',true); return '무관에 들어가 삼재검법을 배웠다.';
    case 'work': gold(O.inc*work*.3*((m.f.lit||0)>=4?1.1:1)+(a>=10?(m.f.smith?2.5:0)+(m.f.martial&&m.lv>=2?m.lv*1.5:0)+(m.f.med?2:0):0)); m.joy-=q; t=a<10?'집안일을 거들었다.':pick(WORK[m.b.o]||WORK.farmer); break;
    case 'family': m.bond+=7*q; m.joy+=4*q; t=pick(['가족과 둘러앉아 저녁을 먹는 날이 많았다.','부모님의 일손을 덜어 드렸다.','이웃 잔치에 빠짐없이 갔다.','식구들과 마루에 앉아 한 철을 보냈다.']); break;
    case 'rest': m.hp+=9*q*(o.fall?1.15:1); m.joy+=2*q; t=pick(o.fall?['폭포 소리를 들으며 몸을 쉬었다.']:['일을 줄이고 잠을 늘렸다.','약수터에 다니며 몸을 돌봤다.','아랫목에서 한 철을 났다.']); break;
    case 'study': m.f.lit=(m.f.lit||0)+1; m.joy+=.5; t=m.f.lit>=4?'천자문을 뗐다.':'서당에서 글을 배웠다.'; if(m.f.lit===4){ log('글을 깨쳤다',true); return t; } break;
    case 'rumor': { gold(-3); m.joy+=1; let got=null; if(!m.mark&&R()<.65){ const pool=Object.values(EV).filter(e=>e.min!==e.max&&evOK(e)&&m.used[e.id]==null&&markable(e)); if(pool.length){ got=wpick(pool,x=>x.w||1); m.mark=markFor(got); mapMarks(); } }
      t=got?'객잔에서 귀가 솔깃한 이야기를 들었다.':'술잔만 비우고 나왔다. 별 이야기가 없었다.'; break; }
    default: if(WSEAS[fid]){ t=WSEAS[fid](o); break; } m.joy+=.3; t=pick(['하릴없이 한 철이 갔다.','별일 없이 한 철을 보냈다.']);
  }
  m.hp=cl(m.hp); m.joy=cl(m.joy); m.bond=cl(m.bond); if(R()<.3) log(t); return t; }
function actStage(fid,o){ const keep=m.focus; let s;
  try{ m.focus=fid==='enroll'?'train':fid==='rumor'||fid==='idle'||fid==='study'?'rest':fid;
    if(fid==='study') s=fixStage(Sg('school',{hero:{x:124,pose:'sit',face:-1},cast:[N('tc',LOOK.official(),86,{face:1,pose:'point',tag:'훈장'})]}));
    else if(fid==='rumor') s=fixStage(Sg('innroom',{time:'night',hero:{x:60,pose:'drink',face:1},cast:[N('g1',LOOK.swordsman(),30,{pose:'drink',face:1}),N('kp',LOOK.merchant(),150,{dy:-2})]}));
    else if(o.fall&&fid==='train'&&m.f.martial) s=fixStage(Sg('mountain',{time:'dawn',hero:{x:136,pose:'sit',act:'meditate',auraC:m.f.magong?'#ff5a3a':'#ffe9a0'}}));
    else if(o.fall) s=fixStage(Sg('mountain',{hero:{x:124,pose:'sit'}}));
    else if(WSTAGE[fid]) s=fixStage(WSTAGE[fid](o));
    else if(fid==='idle') s=fixStage(Sg('village',{hero:{x:70,act:'wander',xmin:40,xmax:110}}));
    else s=lifeStage();
  } finally{ m.focus=keep; }
  s=Object.assign({},s); s.key='act:'+fid+':'+m.age+':'+m.sea; s.season=m.sea; return s; }
function doSeason(fid,o){ if(!mapMode()) return; o=o||{}; const b=snap(), sea=m.sea, txt=seasonAct(fid,o); MSHOP=null; MTALK=null; if(MAPV){ MAPV.hero.path=null; MAPV.hero.then=null; }
  CUTQ.push({spec:actStage(fid,o),ms:fid==='idle'?600:1150,txt,sea,t:0});
  if(m.repOn&&!m.rep&&fid!=='enroll') m.rep={fid,o};
  diffFx(b); m.sea++; if(m.sea>3){ m.sea=0; yearTurn(); }
  if(inCathay()) m.wldN=(m.wldN||0)+1; if(m.wq){ const id=m.wq; m.wq=null; if(startEv(EV[id])) m.wevN=(m.wevN||0)+1; }
  acc=0; render(); save(); }
const AUTOEV=new Set(['heartDemon','coldAttack','wedding','birth','doom','revenge','poison','demonWar','leader','demonLord','betray','lastDuel','ascend','famine','assassin','sectHead','masterDeath','spouseSick','kidRun','fever','flee','parentCare','friendDeath','avenge','succession','kinRevenge','sparedReturn','rivalReturn','envoy','exam','child6','child6b','disciple','enlight']);
const markable=ev=>!(AUTOEV.has(ev.id)||ev.epn||(ev.w||0)>=9||ev.min===ev.max);
const BGSPOT={market:'market',shop:'market',village:'market',inn:'inn',innroom:'inn',stable:'inn',den:'inn',forge:'smithy',mountain:'fall',hermit:'fall',pond:'fall',peak:'fall',cave:'fall',tomb:'fall',cliff:'fall',forest:'forest',bamboo:'forest',fort:'forest',road:'gate',snow:'gate',battle:'gate',river:'bridge',well:'well',school:'school',dojo:'dojo',arena:'dojo',temple:'dojo',library:'dojo',kitchen:'dojo',manor:'office',hall:'office',home:'home',yard:'home',room:'home',wedding:'home',field:'field',grave:'shrine'};
function spotForEv(ev){ let bg='village'; try{ const s=ev.st&&ev.st(); if(s&&s.bg) bg=s.bg; }catch(e){} return BGSPOT[bg]||'market'; }
function yearTurn(){ const g0=m.gold, qn=m.q.length; m.rep=null; m.ai=null; m.wq=m.wq||null; if(m.mark){ delete m.used[m.mark.id]; m.mark=null; }
  tick(true); if(m.dead){ CUTQ.length=0; return; }
  const fromQ=m.q.length<qn; checkTrain();
  if(m.pending&&!m.train&&!fromQ&&markable(m.pending)){ const ev=m.pending; m.pending=null; m.mark=markFor(ev); }
  mapMarks(); const d=Math.round(m.gold-g0), age=m.age; vfx(()=>toast(`<b>${age}세</b> 새해가 밝았다${d?` · 한 해 살림 ${d>0?'+':'−'}${fmt(Math.abs(d))}냥`:''}`,'t1',2600));
  if(m.yst){ const s=yearStage(), last=m.log[m.log.length-1]; if(s) CUTQ.push({spec:s,ms:1700,txt:last?last.t:'',sea:0,t:0}); } }
function triggerMark(){ const ev=EV[m.mark.id]; m.mark=null; m.ai=null; mapMarks();
  if(ev&&m.age>=ev.min&&m.age<=ev.max&&(!ev.when||ev.when())){ m.used[ev.id]=m.age; m.lastRes=null; m.pending=ev; m.evCh=null; m.evSt=null; m.evDuel=null; m.evText=typeof ev.text==='function'?ev.text():ev.text; if(ev.gi) vfx(()=>{ callout('奇緣','gi',1500); sfx('giyeon'); flashA=.5; flashC='#ffe9a0'; }); }
  acc=0; render(); save(); }
/* ---- 맡기기: 알아서 걸어가서 한다 ---- */
function autoMap(){ const V=MAPV; if(!V) return; const h=V.hero; if(h.moving||(h.path&&h.path.length)) return;
  if(!m.ai){ if(m.mark&&!m.mark.skip){ if(R()<.8) m.ai={mid:m.mark.w?'world':'vil',sid:m.mark.w||m.mark.spot,mark:1,n:0}; else m.mark.skip=1; }
    if(!m.ai&&canLeave()&&R()<(m.f.martial?.25:.03)) m.ai={mid:'world',sid:'gate',n:0};
    if(!m.ai){ let fid=m.age<10?pick(['family','family','rest','train']):autoFocus(), sid='home', o={}; if(fid==='work'&&m.age<10) fid='family';
      if(fid==='train'){ if(!m.f.martial&&m.age>=8&&m.gold>=10&&R()<.1) fid='enroll'; sid='dojo'; if(m.f.martial&&R()<.35){ sid='fall'; o.fall=1; } } else if(fid==='work') sid=WORKSPOT[m.b.o]||'home';
      m.ai={mid:'vil',fid,sid,o,n:0}; } }
  const ai=m.ai, cur=V.M.world?'world':'vil', at=V.M.indoor?'home':(MSPOT?MSPOT.id:null);
  if(ai.n>7){ m.ai=null; if(ai.mark){ if(m.mark) m.mark.skip=1; } else doSeason(ai.fid||'idle',ai.o); return; }
  if(cur!==(ai.mid||'vil')){ ai.n++; if(cur==='vil'){ if(V.M.indoor){ leaveHome(); m.ai=ai; return; } if(at==='gate'){ if(!canLeave()){ ai.n=9; return; } leaveVillage(); return; } if(goSpot('gate')===false) ai.n=9; return; } if(at==='home'){ enterVillage(); return; } if(goSpot('home')===false) ai.n=9; return; }
  if(at===ai.sid){ m.ai=null; if(ai.mark) return; if(ai.fn) ai.fn(); else doSeason(ai.fid,ai.o); return; }
  ai.n++; if(V.M.indoor){ leaveHome(); m.ai=ai; } if(goSpot(ai.sid)===false) ai.n=9; }
function mapLoop(dt){
  if(resWait()) return;
  if(CT&&!inCathay()) CT=null;
  if(!mapMode()) return;
  if(inCathay()){ cathayLoop(dt); return; }
  if(m.train){ if(m.auto&&!paused&&MAPV&&MAPON) autoSect(); return; }
  if(MAPV&&MAPON&&markHere(MAPV.M,MSPOT)&&!MAPV.hero.moving){ triggerMark(); return; }
  if(m.rep){ const r=m.rep; doSeason(r.fid,r.o); return; }
  if(m.auto&&!paused) autoMap(); }
function cutTick(dt){ const c=CUTQ[0]; if(!c) return; if(!m||m.phase!=='play'){ CUTQ.length=0; return; } c.t+=dt*(m.auto&&!paused?[1,1.4,2][spd]:m.rep?2:1); if(c.t>=c.ms){ CUTQ.shift(); acc=0; render(); save(); } }
/* ---- 카드 ---- */
function mapActs(){ const s=MSPOT, a=m.age, o=m.b.o, M=MAPV.M, id=M.indoor?'home':(s?s.id:null), acts=[], add=(t,sub,fn,free)=>acts.push({t,s:sub,fn,free}), S=(fid,opt)=>()=>doSeason(fid,opt);
  if(id==='home'){ add(a<10?'식구들 곁에서 논다':'가족과 지낸다','행복과 인연이 오른다',S('family')); add('푹 쉰다','건강이 오른다',S('rest')); if(WORKSPOT[o]==='home'&&a>=10) add(WORKN[o],'은자를 번다',S('work')); if(!M.indoor) add('안으로 들어간다','',enterHome,1); }
  if(!M.indoor&&id&&id===WORKSPOT[o]&&id!=='home') add(a<10?'일을 거든다':WORKN[o]||'일한다',a<10?'아직 어려서 벌이는 없다':'은자를 번다',S('work'));
  if(id==='dojo'){ if(m.f.martial) add('수련한다','무공이 는다',S('train')); else if(a>=8){ if(m.gold>=10) add('입문한다','10냥 · 삼재검법을 배운다',S('enroll')); add('어깨너머로 본다','',S('train')); } else add('나뭇가지로 칼싸움을 한다','',S('train')); }
  if(id==='fall'){ if(m.f.martial) add('폭포 아래서 수련한다','내공이 더 붙는다',S('train',{fall:1})); add('물소리를 들으며 쉰다','건강이 오른다',S('rest',{fall:1})); }
  if(id==='school'&&a>=6&&a<16&&(m.f.lit||0)<4) add('글을 배운다',`${m.f.lit||0}/4 · 깨치면 벌이가 는다`,S('study'));
  if(id==='shrine') add('절을 올린다','한 해에 한 번, 마음이 가라앉는다',()=>{ if(m.f.pray===m.age){ toast('올해는 이미 절을 올렸다.','',1800); return; } m.f.pray=m.age; m.joy=cl(m.joy+3); sfx('ok'); vfx(()=>heroFloat('행복 +3','good')); render(); save(); },1);
  if(id==='inn'&&a>=15&&m.gold>=3) add('소문을 듣는다','3냥 · 일이 생길 수 있다',S('rumor'));
  if(id==='gate'&&canLeave()) add('마을을 나선다','천하 지도로 나간다',leaveVillage,1);
  if(id==='market'||id==='apoth'||id==='smithy') add('물건을 본다','',()=>{ MSHOP=MSHOP?null:id; render(); },1);
  if(id==='apoth'&&m.hp<80&&m.gold>=12) add('진맥을 받는다','12냥 · 건강 +18',()=>{ gold(-12); m.hp=cl(m.hp+18); sfx('ok'); vfx(()=>heroFloat('건강 +18','good')); render(); save(); },1);
  return acts; }
const SHOPS={market:['salve','antidote','sachet','talis','lvest'],apoth:['salve','antidote','pill'],smithy:null};
function shopList(id){ let ids=SHOPS[id]; if(id==='city'){ const k=myKind(); ids=['salve','antidote','pill','talis',wOf(1,k),wOf(2,k),'chain'].filter((x,i,a)=>x&&a.indexOf(x)===i); } if(!ids){ const k=myKind(); ids=[wOf(0,k),wOf(1,k),'lvest','chain'].filter((x,i,a)=>x&&a.indexOf(x)===i); } return ids.filter(x=>ITEMS[x]).map(x=>({id:x,pr:Math.max(2,Math.round(ITEMS[x].v*1.25))})); }
const PLACEHINT={home:'식구들이 있는 곳. 쉬거나 가족과 지낼 수 있다.',dojo:'기합 소리가 담을 넘는다.',fall:'물소리가 크다. 수련하기 좋은 자리다.',market:'사람과 물건이 모인다.',smithy:'쇠 두드리는 소리가 난다.',apoth:'약 달이는 냄새가 난다.',inn:'나그네와 소문이 드나든다.',school:'글 읽는 소리가 들린다.',shrine:'향 냄새가 은은하다.',office:'문 앞이 조용하다.',field:'흙냄새가 난다.',forest:'나무 사이로 볕이 든다.',gate:'여기서부터 관도다. 아직은 마을을 떠날 수 없다.',well:'아낙들의 이야기가 오간다.',bridge:'개울 물소리가 맑다.'};
function renderMapCard(card,eye){ if(m.train) return renderSectCard(card,eye); const M=MAPV.M, s=MSPOT, acts=mapActs(), id=M.indoor?'home':(s?s.id:null), busy=m.auto&&!paused;
  const seas=`<div class="mh-seas" aria-label="올해의 철">${SEAN.map((n,i)=>`<span class="${i===m.sea?'on':i<m.sea?'done':''}">${n}</span>`).join('')}<label class="mh-rep"><input type="checkbox" id="mhRep" ${m.repOn?'checked':''}> 고른 일을 연말까지 되풀이</label></div>`;
  const talk=MTALK?`<p class="mh-talk"><b>${esc(MTALK.a.n||'')}</b>${esc(MTALK.t)}</p>`:'';
  const mk=m.mark&&!M.indoor?spotOf(M,markSpotId(M)):null, mkT=mk?(m.mark.w?'마을 밖 '+siteName(m.mark.w)+'에 무슨 일이 있다':mk.n+'에 무슨 일이 있다'):'';
  const place=`<p class="mh-qa">${esc(M.indoor?'집 안':homeName())}${mk?` · <span class="mh-mk">${esc(mkT)}</span>`:''}</p><h3 class="mh-pl">${esc(M.indoor?'우리 집':s?s.n:'마을 길')}</h3><p class="mh-hint">${esc(id==='gate'?(canLeave()?'여기서부터 관도다. 마을을 나서면 천하가 펼쳐진다.':'여기서부터 관도다. 열다섯은 되어야 혼자 나설 수 있다.'):id?PLACEHINT[id]||'':'방향키·WASD로 걷거나, 가고 싶은 곳을 누른다. 장소에 서면 할 일이 나온다.')}</p>`;
  const ah=acts.length?`<div class="mh-chs">${acts.map((c,i)=>`<button class="mh-ch" type="button" data-ma="${i}" ${busy?'disabled':''}><span><span class="k" aria-hidden="true">${i+1}</span><span>${esc(c.t)}${c.s?`<small>${esc(c.s)}</small>`:''}</span></span><span class="odds">${c.free?'':'한 철'}</span></button>`).join('')}</div>`:'';
  const shop=MSHOP?`<div class="mh-shop"><p class="mh-qa">파는 물건 · 가진 돈 ${fmt(m.gold)}냥</p>${shopList(MSHOP).map((x,i)=>`<button class="mh-ch" type="button" data-buy="${i}" ${m.gold<x.pr?'disabled':''}><span><span>${icImg(itIcon(x.id),'sm')} ${esc(ITEMS[x.id].n)}<small>${esc(itDesc(ITEMS[x.id]))}</small></span></span><span class="odds">${x.pr}냥</span></button>`).join('')}</div>`:'';
  const ids=(['home',WORKSPOT[m.b.o],'dojo','fall','market','smithy','apoth','inn',m.age<16?'school':null,'shrine',canLeave()?'gate':null]).filter((x,i,a)=>x&&a.indexOf(x)===i), V=VIL||M, mkId=m.mark?markSpotId(VIL||M):null;
  const go=`<div class="mh-places"><span class="mh-lab">바로 가기</span>${ids.map(k=>{ const sp=spotOf(M.indoor?(VIL||buildVillage(m.b.o,FAMTIER[m.b.o]||0)):M,k); if(!sp) return ''; return `<button type="button" class="mh-btn${id===k?' on':''}" data-go="${k}" ${busy?'disabled':''}>${esc(sp.n)}${mkId===k?' <b class="mh-mk">!</b>':''}</button>`; }).join('')}<button type="button" class="mh-btn" data-idle="1" ${busy?'disabled':''}>한 철 그냥 보내기</button></div>`;
  const feed=m.log.slice(-4).reverse().map(x=>`<li class="${x.big?'big':''}${x.a===m.age?'':' old'}"><span class="a">${x.a}세</span><span>${esc(x.t)}</span></li>`).join('');
  card.innerHTML=`${eye}${seas}${talk}<div class="mh-dec">${place}${ah}${shop}</div>${go}<ol class="mh-feed">${feed}</ol>`;
  card.querySelectorAll('[data-ma]').forEach(b=>b.onclick=()=>{ const c=acts[+b.dataset.ma]; if(c) c.fn(); });
  card.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{ const x=shopList(MSHOP)[+b.dataset.buy]; if(!x||m.gold<x.pr) return; gold(-x.pr); give(x.id,{}); sfx('get'); render(); save(); });
  card.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ goSpot(b.dataset.go); });
  const idle=card.querySelector('[data-idle]'); if(idle) idle.onclick=()=>doSeason('idle');
  const rp=$m('mhRep'); if(rp) rp.onchange=()=>{ m.repOn=rp.checked; if(!m.repOn) m.rep=null; save(); }; }
function renderCut(card,eye){ const c=cutNow(); card.innerHTML=`${eye}<div class="mh-dec"><p class="mh-qa">${c.tr?'두 달이 간다':(SEAN[c.sea]||'')+'이 간다'}</p><p class="mh-text">${esc(c.txt||'')}</p></div>`; }
/* ---- 사문: 수련기 ---- */
function sectAct(id,mi){ if(!mapMode()||!m.train) return; const T=m.train, sea=TSEAS[T.turn%6]; MTALK=null; if(MAPV){ MAPV.hero.path=null; MAPV.hero.then=null; }
  trainAct(id,mi); if(!m.dead&&m.lastRes&&m.lastRes.train&&m.train){ m.lastRes.seen=1; let s=null; try{ s=Object.assign({},trainStage(),{key:'tact:'+T.turn+id}); }catch(e){} if(s) CUTQ.push({spec:s,ms:1150,txt:m.lastRes.t,sea,t:0,tr:1}); }
  afterTrain(); }
function autoSect(){ const V=MAPV, h=V.hero; if(h.moving||(h.path&&h.path.length)) return;
  if(!m.ai){ let id; if(m.hp<35||(m.train.turn>=15&&m.hp<72)) id='rest'; else id=wpick(TACT.concat([{id:'mate'}]),x=>({form:3,qi:2,chore:1.5,craft:1,mate:1.6,rest:.5,sneak:.4}[x.id])).id; const live=[0,1,2].filter(alive); if(id==='mate'&&!live.length) id='form'; m.ai={id,mi:id==='mate'?pick(live):0,n:0,sid:Object.keys(SECTACT).find(k=>SECTACT[k]===id)}; }
  const ai=m.ai; if(ai.id==='mate'){ const a=V.actors.find(x=>x.mate===ai.mi); if(!a||ai.n>1||(MTALK&&MTALK.a===a)){ m.ai=null; sectAct('mate',ai.mi); return; } ai.n++; goTalk(a); return; }
  if((MSPOT&&MSPOT.id===ai.sid)||ai.n>2){ m.ai=null; sectAct(ai.id); return; } ai.n++; if(goSpot(ai.sid)===false) ai.n=9; }
const SECTHINT={yard:'기합 소리와 목검 부딪는 소리가 난다.',rock:'물소리뿐이다. 숨을 고르기 좋은 자리다.',craft:'쇠와 약초 냄새가 섞여 난다.',chore:'장작과 물동이가 기다린다.',rest:'볕이 잘 드는 마루가 있다.',gate:'이 문을 나서면 산 아래 장터다. 들키면 혼난다.',hall:'사부가 계신 곳이다.'};
function renderSectCard(card,eye){ const T=m.train, M=MAPV.M, s=MSPOT, busy=m.auto&&!paused, yr=Math.min(3,Math.floor(T.turn/6)+1), acts=[];
  const aid=s?SECTACT[s.id]:null, a=aid&&TACT.find(x=>x.id===aid); if(a) acts.push({t:a.id==='craft'?craftName():a.n,s:a.s,fn:()=>sectAct(a.id)});
  if(MTALK&&MTALK.a.mate!=null&&alive(MTALK.a.mate)){ const i=MTALK.a.mate; acts.push({t:`${wa(mt(i).name)} 어울린다`,s:'호감이 오른다',fn:()=>sectAct('mate',i)}); }
  const head=`<div class="mh-tr"><span class="mh-qa">${esc(T.place)} 수련기</span><b>${yr}년차 ${SEASONS[T.turn%6]}</b><span class="mh-trbar" aria-label="수련기 진행 ${T.turn}/18"><i style="width:${T.turn/18*100}%"></i></span></div>`;
  const talk=MTALK?`<p class="mh-talk"><b>${esc(MTALK.a.n||'')}</b>${esc(MTALK.t)}</p>`:'';
  const place=`<p class="mh-qa">${esc(T.place)}</p><h3 class="mh-pl">${esc(s?(s.id==='craft'?'공방':s.n):'경내')}</h3><p class="mh-hint">${esc(s?SECTHINT[s.id]||'':'걸어서 수련할 곳을 고른다. 무엇을 하든 두 달이 간다. 동문에게 다가가면 어울릴 수 있다.')}</p>`;
  const ah=acts.length?`<div class="mh-chs">${acts.map((c,i)=>`<button class="mh-ch" type="button" data-ma="${i}" ${busy?'disabled':''}><span><span class="k" aria-hidden="true">${i+1}</span><span>${esc(c.t)}${c.s?`<small>${esc(c.s)}</small>`:''}</span></span><span class="odds">두 달</span></button>`).join('')}</div>`:'';
  const stats=`<div class="mh-meters">${meter('체력',m.hp,'hp')}${meter('신망',T.rep,'')}${meter('기예',Math.min(100,T.craft*25),'joy')}</div>`;
  const mates=`<div class="mh-mates"><span class="mh-lab">동문</span>${m.mates.map((x,i)=>`<div class="mh-mate${x.dead?' dead':''}"><span class="mh-who"><img class="mh-pt" src="${portrait(mateLook(i))}" alt="" width="28" height="28"><span><b>${esc(x.name)}</b><small>${esc(x.dead?'고인':x.role)}</small></span></span><span class="mh-bar bond"><i style="width:${x.dead?0:cl(x.v)}%"></i></span><button type="button" class="mh-btn" data-mate="${i}" ${x.dead||busy?'disabled':''}>찾아간다</button></div>`).join('')}</div>`;
  const go=`<div class="mh-places"><span class="mh-lab">바로 가기</span>${['yard','rock','craft','chore','rest','gate'].map(k=>{ const sp=spotOf(M,k); return `<button type="button" class="mh-btn${s&&s.id===k?' on':''}" data-go="${k}" ${busy?'disabled':''}>${esc(k==='craft'?'공방':sp.n)}</button>`; }).join('')}</div>`;
  const feed=m.log.slice(-3).reverse().map(x=>`<li class="${x.big?'big':''}"><span class="a">${x.a}세</span><span>${esc(x.t)}</span></li>`).join('');
  card.innerHTML=`${eye}${head}${talk}<div class="mh-dec">${place}${ah}</div>${go}${stats}${mates}<ol class="mh-feed">${feed}</ol>`;
  card.querySelectorAll('[data-ma]').forEach(b=>b.onclick=()=>{ const c=acts[+b.dataset.ma]; if(c) c.fn(); });
  card.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ goSpot(b.dataset.go); });
  card.querySelectorAll('[data-mate]').forEach(b=>b.onclick=()=>{ const n=MAPV.actors.find(x=>x.mate===+b.dataset.mate); if(n) goTalk(n); }); }
/* ---- 입력 ---- */
const KEYMAP={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',w:'u',s:'d',a:'l',d:'r',W:'u',S:'d',A:'l',D:'r','ㅈ':'u','ㄴ':'d','ㅁ':'l','ㅇ':'r'};
document.addEventListener('keydown',e=>{ const k=KEYMAP[e.key]; if(!k||$m('murimApp').hidden||e.ctrlKey||e.metaKey||e.altKey) return; if(e.target&&e.target.closest&&e.target.closest('textarea,input')) return; if(!MAPON||!mapMode()) return; KEYS[k]=1; e.preventDefault(); });
document.addEventListener('keyup',e=>{ const k=KEYMAP[e.key]; if(k) KEYS[k]=0; });
window.addEventListener('blur',()=>{ KEYS={}; });
cv.parentNode.addEventListener('pointerdown',e=>{ if(!MAPON) return; const r=cv.getBoundingClientRect(); if(!r.width) return; mapTap((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H); });
