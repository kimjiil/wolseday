/* ==== murim:mapdata — 고향 마을과 집 안의 생김새 ==== */
function mkMap(id,w,h,fill,name){ const M={id,w,h,name,g:[],objs:[],spots:[],falls:[],solid:null}; for(let y=0;y<h;y++) M.g.push(new Array(w).fill(fill)); return M; }
const mrect=(M,x,y,w,h,c)=>{ for(let j=Math.max(0,y);j<Math.min(M.h,y+h);j++) for(let i=Math.max(0,x);i<Math.min(M.w,x+w);i++) M.g[j][i]=c; };
function mobj(M,k,x,y,o){ const d=OBJ[k], ob=Object.assign({k,x,y,w:d.w||1,h:d.h||1},o||{}); M.objs.push(ob); return ob; }
function mfin(M){ M.solid=new Uint8Array(M.w*M.h);
  for(let y=0;y<M.h;y++) for(let x=0;x<M.w;x++){ const k=M.g[y][x]; if(k==='~'||k==='^'||k==='#'||k===' ') M.solid[y*M.w+x]=1; }
  for(const o of M.objs){ const d=OBJ[o.k]; if(d.solid===0){ if(d.posts) for(const px of d.posts) M.solid[o.y*M.w+o.x+px]=1; continue; }
    for(let j=0;j<o.h;j++) for(let i=0;i<o.w;i++){ const x=o.x+i, y=o.y+j; if(x>=0&&y>=0&&x<M.w&&y<M.h) M.solid[y*M.w+x]=1; } }
  return M; }
const walkable=(M,x,y)=>x>=0&&y>=0&&x<M.w&&y<M.h&&!M.solid[y*M.w+x];
const spotOf=(M,id)=>M.spots.find(s=>s.id===id);
const HT=[{w:3,h:2,roof:'h',rc:'#cfae66'},{w:4,h:3,roof:'h'},{w:5,h:3,roof:'t'},{w:7,h:4,roof:'t',pillar:1,lamp:1,rc:'#3f5266'}];
const FAMTIER={beggar:0,tenant:0,farmer:1,hunter:1,artisan:1,bandit:1,blood:1,merchant:2,inn:2,doctor:2,escort:2,official:3,clan:3,tangc:3};
for(const f of FAM) if(f.tier!=null&&FAMTIER[f.id]==null) FAMTIER[f.id]=f.tier;
const WORKSPOT={tenant:'field',farmer:'field',blood:'field',beggar:'market',artisan:'smithy',merchant:'market',hunter:'forest',inn:'inn',bandit:'forest',escort:'office',doctor:'apoth',official:'office',clan:'home',tangc:'home'};
for(const f of FAM) if(f.ws&&!WORKSPOT[f.id]) WORKSPOT[f.id]=f.ws;
function buildVillage(fam,tier){ const M=mkMap('vil:'+fam+tier,46,32,'.','고향 마을');
  mrect(M,0,0,46,3,'^'); mrect(M,33,3,6,2,'~'); mrect(M,35,5,2,27,'~'); M.falls.push({x:35,y:0,w:2,h:3});
  mrect(M,0,15,46,2,'='); mrect(M,21,9,2,23,'='); mrect(M,2,22,31,1,'='); mrect(M,35,15,2,2,'B');
  mrect(M,17,12,10,7,'s'); mrect(M,17,9,10,2,'s'); mrect(M,27,9,5,1,'='); mrect(M,31,5,1,5,'='); mrect(M,28,7,1,2,'=');
  mrect(M,2,24,17,6,'F'); mrect(M,25,24,8,6,'F');
  const H=(x,y,w,h,o)=>mobj(M,'house',x,y,Object.assign({w,h},o));
  H(18,5,8,4,{roof:'t',door:3,dw:28,pillar:1,sign:'sword',sc:'#7a2a22',lamp:1,mid:'dojo'});
  H(27,5,3,2,{roof:'t',rc:'#7a3a32',door:1,wall:'#ecdcc4',pillar:1,nowin:[0,2],mid:'shrine'});
  H(2,12,4,3,{roof:'h',door:1,sign:'book',sc:'#3a4a6a',open:1,mid:'school'});
  H(7,12,4,3,{roof:'t',rc:'#4f7060',door:1,sign:'med',sc:'#2f5a44',mid:'apoth'});
  H(12,12,4,3,{roof:'h',rc:'#c9a45e',door:1,sign:'forge',sc:'#4a3a34',chim:1,open:1,mid:'smithy'});
  H(28,11,5,4,{roof:'t',rc:'#7a4a3e',door:2,two:1,sign:'inn',sc:'#7a2a22',lamp:1,flag:'#d8452c',mid:'inn'});
  H(27,18,5,4,{roof:'t',door:2,dw:24,pillar:1,sign:'seal',sc:'#3a3a5a',mid:'office'});
  const t=HT[tier], hx=4+((7-t.w)>>1), hy=22-t.h; H(hx,hy,t.w,t.h,{roof:t.roof,rc:t.rc,door:t.w>>1,pillar:t.pillar,lamp:t.lamp,mid:'home'});
  for(let x=2;x<=12;x++) mobj(M,'fence',x,17); mobj(M,'tree',12,19,{v:'plum'}); mobj(M,'vat',11,21); if(tier>0) mobj(M,'vat',12,21); mobj(M,'tree',2,19);
  mobj(M,'stall',17,12,{c:'#d8452c'}); mobj(M,'stall',19,12,{c:'#3f8f6a',goods:['#f4efe0','#c9a0ff','#6fb0e0','#f0c040']}); mobj(M,'stall',24,12,{c:'#3f6fae',goods:['#b8804a','#e9e2c8','#8a6a4a']});
  mobj(M,'well',25,17); mobj(M,'dummy',18,10); mobj(M,'dummy',25,10); mobj(M,'anvil',16,14); mobj(M,'flat',30,4); mobj(M,'gate',20,30); mobj(M,'sign',24,29); mobj(M,'scare',8,26); mobj(M,'scare',29,26); mobj(M,'fire',41,13);
  mobj(M,'lantern',26,8); mobj(M,'lantern',30,8); mobj(M,'rock',33,6); mobj(M,'rock',38,5); mobj(M,'bush',23,20); mobj(M,'bush',16,20); mobj(M,'tree',24,24,{v:'plum'}); mobj(M,'tree',19,23);
  const used=new Set(M.objs.flatMap(o=>{ const a=[]; for(let j=-1;j<=o.h;j++) for(let i=-1;i<=o.w;i++) a.push((o.x+i)+','+(o.y+j)); return a; }));
  const free=(x,y)=>M.g[y][x]==='.'&&!used.has(x+','+y);
  for(let y=3;y<32;y++) for(let x=0;x<46;x++){ if(!free(x,y)) continue; const h=hsh(x*5.3+y*9.1+1.7); let p=0, pine=0;
    if(x>=38){ p=(x>=38&&x<=44&&y>=11&&y<=20)?0:.6; pine=h*7%1<.4; } else if(y<=4&&x<30){ p=.45; pine=1; } else if(y<=10&&x<17){ p=.28; pine=h*7%1<.6; } else if(x<=1&&y>=17){ p=.55; } else if(y===31&&(x<20||x>23)){ p=.45; } else if(x>=23&&x<=33&&y>=3&&y<=4){ p=.2; pine=1; } else if(x>=37){ p=.5; }
    if(h<p){ mobj(M,pine?'pine':'tree',x,y,{v:h*13%1<.2?'plum':''}); used.add(x+','+y); for(const d of [[1,0],[-1,0]]) used.add((x+d[0])+','+y); }
    else if(hsh(x*3.1+y*7.7)<.12) M.g[y][x]=':'; }
  const sp=(id,n,x,y,o)=>M.spots.push(Object.assign({id,n,x,y},o||{}));
  sp('home','우리 집',7,22,{door:[7,21],lab:[7.5,hy-.7]}); sp('dojo','무관',21,9,{lab:[22,4.2]}); sp('shrine','사당',28,7,{lab:[28.5,4.2]}); sp('school','서당',3,15,{lab:[4,11.2]}); sp('apoth','약방',8,15,{lab:[9,11.2]}); sp('smithy','대장간',13,15,{lab:[14,11.2]});
  sp('inn','객잔',30,15,{lab:[30.5,9.2]}); sp('office',fam==='escort'?'표국':'관아',29,22,{lab:[29.5,17.2]}); sp('market','장터',20,13,{zone:[17,13,10,1],lab:[22,11.6]}); sp('well','우물',24,17,{lab:[25.5,16]});
  sp('fall','뒷산 폭포',31,5,{zone:[30,4,3,2],lab:[36,2.6]}); sp('field','밭',10,23,{zone:[2,23,17,7],lab:[10,24.6]}); sp('forest',fam==='bandit'?'산채':'숲',41,15,{zone:[39,12,5,8],lab:[41.5,11.2]});
  sp('gate','마을 어귀',21,29,{zone:[21,28,2,4],lab:[22,27.4]}); sp('bridge','다리',34,15,{zone:[34,15,4,2]});
  M.start=[7,22]; M.wander=[[17,13,10,6],[2,15,30,2],[21,9,2,13],[2,22,30,1]];
  return mfin(M); }
function buildHome(tier){ const iw=[4,6,8,11][tier], ih=[3,4,5,6][tier], w=iw+2, h=ih+3, M=mkMap('home:'+tier,w,h,'#','우리 집');
  mrect(M,1,2,iw,ih,'o'); const dx=1+(iw>>1); M.g[h-1][dx]='D';
  const O=(k,x,y,o)=>mobj(M,k,x,y,o);
  if(tier===0){ O('mat',1,2); O('stove',iw,2); }
  else if(tier===1){ O('bed',1,2); O('stove',iw,2); O('table',3,3); O('chest',iw,ih+1); }
  else if(tier===2){ O('bed',1,2); O('bed',2,2,{c:'#4f7590'}); O('stove',iw,2); O('shelf',4,2); O('table',4,4); O('chest',iw,ih+1); O('chest',iw-1,ih+1); O('rug',2,5,{c:'#7a5a8a'}); }
  else { O('bed',1,2); O('bed',2,2,{c:'#4f7590'}); O('bed',3,2,{c:'#6f9a62'}); O('screen',5,2); O('shelf',8,2); O('shelf',9,2,{cs:['#3f6fae','#e9e2c8','#7a5a8a']}); O('stove',iw,2); O('table',5,5); O('chest',iw,ih+1); O('chest',iw-1,ih+1); O('chest',1,ih+1); O('rug',8,5); O('rug',2,5,{c:'#3f5a7a'}); }
  const sp=(id,n,x,y,o)=>M.spots.push(Object.assign({id,n,x,y},o||{}));
  sp('exit','문',dx,h-1,{}); sp('rest','잠자리',tier===0?2:tier===1?2:tier===2?3:4,3,{}); sp('hearth','부뚜막',iw,3,{});
  M.start=[dx,h-2]; M.inner=[1,2,iw,ih]; M.indoor=1;
  return mfin(M); }
/* 사문: 수련기 삼 년을 보내는 산중 문파 */
const SECTACT={yard:'form',rock:'qi',craft:'craft',chore:'chore',rest:'rest',gate:'sneak'};
function buildSect(sk,place,rc,herm){ const M=mkMap('sect:'+sk,30,24,'.',place);
  mrect(M,0,0,30,3,'^'); mrect(M,23,3,5,2,'~'); M.falls.push({x:25,y:0,w:2,h:3});
  mrect(M,9,8,12,7,'s'); mrect(M,14,15,2,9,'='); mrect(M,3,11,6,1,'='); mrect(M,21,11,5,1,'='); mrect(M,5,12,1,7,'='); mrect(M,4,18,10,1,'='); mrect(M,21,5,1,6,'=');
  const H=(x,y,w,h,o)=>mobj(M,'house',x,y,Object.assign({w,h},o));
  if(herm) H(12,5,6,3,{roof:'h',door:2,chim:1,mid:'hall'}); else H(11,4,8,4,{roof:'t',rc,door:3,dw:28,pillar:1,lamp:1,sign:'sword',sc:'#7a2a22',mid:'hall'});
  H(2,8,4,3,{roof:'h',door:1,chim:1,open:1,sign:'forge',sc:'#4a3a34',mid:'craft'});
  H(23,8,4,3,{roof:'t',rc:'#6a5a4a',door:1,open:1,chim:1,mid:'chore'});
  H(2,15,5,3,{roof:herm?'h':'t',rc,door:2,mid:'rest'});
  mobj(M,'gate',13,22); mobj(M,'flat',21,4); for(const p of herm?[[10,9],[19,13]]:[[10,9],[19,9],[10,13],[19,13]]) mobj(M,'dummy',p[0],p[1]); if(!herm){ mobj(M,'lantern',9,7); mobj(M,'lantern',20,7); } mobj(M,'anvil',6,10); mobj(M,'vat',22,10); mobj(M,'vat',27,10); mobj(M,'rock',28,6); mobj(M,'rock',8,20); mobj(M,'tree',22,16,{v:'plum'}); mobj(M,'tree',9,16,{v:'plum'});
  const used=new Set(M.objs.flatMap(o=>{ const a=[]; for(let j=-1;j<=o.h;j++) for(let i=-1;i<=o.w;i++) a.push((o.x+i)+','+(o.y+j)); return a; }));
  for(let y=3;y<24;y++) for(let x=0;x<30;x++){ if(M.g[y][x]!=='.'||used.has(x+','+y)) continue; const h=hsh(x*5.3+y*9.1+4.2), edge=x<=1||x>=28||y>=22||y<=3, p=edge?.7:(x<9||x>21)&&y>12?.3:.06;
    if(h<p){ mobj(M,'pine',x,y); used.add(x+','+y); used.add((x+1)+','+y); used.add((x-1)+','+y); } else if(hsh(x*3.1+y*7.7)<.1) M.g[y][x]=':'; }
  const sp=(id,n,x,y,o)=>M.spots.push(Object.assign({id,n,x,y},o||{}));
  sp('yard','연무장',14,12,{zone:[11,10,8,3],lab:[15,14.7]}); sp('rock','운기 바위',21,5,{zone:[21,4,2,2],lab:[22,3.2]}); sp('craft','공방',3,11,{lab:[4,7.2]}); sp('chore','주방',24,11,{lab:[25,7.2]}); sp('rest','숙소',4,18,{lab:[4.5,14.2]}); sp('gate','산문',14,21,{zone:[14,20,2,3],lab:[15,19.6]}); sp('hall',herm?'사부의 초옥':'대전',14,8,{lab:[15,herm?4.2:3.2]});
  M.start=[14,13]; M.sect=1; M.herm=herm?1:0; return mfin(M); }
