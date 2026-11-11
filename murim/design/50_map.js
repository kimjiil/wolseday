/* ==== murim:gfx-map — 위에서 내려다본 맵: 타일, 건물·나무, 그리기. 타일 한 칸은 32×32(좌표로는 16). ==== */
const TS=32, TL=16;
const MP=[
  {g:'#8fce6a',g2:'#78b957',g3:'#a8de84',fl:['#ffffff','#ffd84a','#ff9ab8'],lf:'#6dbb52',lfD:'#4e9a45',lfL:'#93d66e',bl:'#ffb3cc',dirt:'#e4c796',dirtD:'#cfae7b',dirtL:'#f0dab0',soil:'#b98f5e',soilD:'#9a7448',crop:'#6dbb52',wat:'#62bfe0',watL:'#b4e8f6',watD:'#3f9fca'},
  {g:'#7ac455',g2:'#62ad45',g3:'#93d66a',fl:['#ffffff','#ffd84a','#c9a0ff'],lf:'#4fa348',lfD:'#37823c',lfL:'#74c25c',bl:null,dirt:'#e0c08c',dirtD:'#c9a672',dirtL:'#ecd4a6',soil:'#b08656',soilD:'#916c42',crop:'#4fa348',wat:'#55b4dc',watL:'#a8e0f2',watD:'#3792c4'},
  {g:'#cdc76c',g2:'#b4ab54',g3:'#dfda88',fl:['#ffe6a0','#ff9a4a'],lf:'#e8923a',lfD:'#c46d28',lfL:'#f6b458',bl:null,dirt:'#dcc090',dirtD:'#c4a474',dirtL:'#e8d2a8',soil:'#b08656',soilD:'#916c42',crop:'#e6b83c',wat:'#5eb0d0',watL:'#acdcee',watD:'#3f90b8'},
  {g:'#f0f5f8',g2:'#d8e4eb',g3:'#ffffff',fl:[],lf:'#c8d5dc',lfD:'#9fb0ba',lfL:'#ffffff',bl:null,dirt:'#e8e3d6',dirtD:'#cfc8b6',dirtL:'#f6f3ea',soil:'#cfc3ae',soilD:'#b0a48e',crop:null,wat:'#8cc8e0',watL:'#d6f0f8',watD:'#6aa8c8'}
];
const MINK='#2a2630', WOODC='#8a5f3a', WOODD='#6a4528', WOODL='#a87848';
function mkSpr(w,h,fn,ol){ const c=document.createElement('canvas'); c.width=w; c.height=h; const keep=cx; cx=c.getContext('2d'); try{ fn(w,h); } finally{ cx=keep; } if(ol!==0) outline(c,ol||MINK); return c; }
const th=(tx,ty,i)=>hsh(tx*7.13+ty*13.37+i*3.71);
/* ---- 바닥 타일 ---- */
function tGrass(X,Y,S,tx,ty,fl){ P(X,Y,TS,TS,S.g);
  for(let i=0;i<6;i++){ const x=X+2+rnd(th(tx,ty,i)*26), y=Y+3+rnd(th(tx,ty,i+9)*24); if(i<3){ P(x,y+1,1,2,S.g2); P(x+1,y,1,3,S.g2); P(x+2,y+1,1,2,S.g2); } else if(i<5) P(x,y,2,1,S.g3); else P(x,y,3,1,S.g2); }
  if(fl) for(let i=0;i<3;i++){ const h=th(tx,ty,i+20), x=X+3+rnd(h*24), y=Y+4+rnd(th(tx,ty,i+30)*22), c=S.fl[rnd(h*97)%Math.max(1,S.fl.length)]; if(!c) continue; P(x,y+1,3,1,c); P(x+1,y,1,3,c); P(x+1,y+1,1,1,'#f0a030'); } }
function tPath(X,Y,S,tx,ty,nb,stone){ tGrass(X,Y,S,tx,ty,0);
  const m=stone?2:4, x0=X+(nb[3]?0:m), x1=X+TS-(nb[1]?0:m), y0=Y+(nb[0]?0:m), y1=Y+TS-(nb[2]?0:m), c=stone?'#d8d0be':S.dirt, cD=stone?'#b9b09c':S.dirtD, cL=stone?'#ebe5d6':S.dirtL;
  P(x0,y0,x1-x0,y1-y0,c);
  if(!nb[2]) P(x0,y1-2,x1-x0,2,cD); if(!nb[1]) P(x1-2,y0,2,y1-y0,cD); if(!nb[0]) P(x0,y0,x1-x0,1,cL); if(!nb[3]) P(x0,y0,1,y1-y0,cL);
  if(!nb[0]&&!nb[3]){ P(x0,y0,3,1,S.g); P(x0,y0,1,3,S.g); } if(!nb[0]&&!nb[1]){ P(x1-3,y0,3,1,S.g); P(x1-1,y0,1,3,S.g); } if(!nb[2]&&!nb[3]){ P(x0,y1-1,3,1,S.g); P(x0,y1-3,1,3,S.g); } if(!nb[2]&&!nb[1]){ P(x1-3,y1-1,3,1,S.g); P(x1-1,y1-3,1,3,S.g); }
  if(stone){ for(let j=0;j<2;j++){ const yy=Y+j*16; if(yy>=y0&&yy<y1) P(x0,yy+15,x1-x0,1,cD); const off=((ty*2+j)%2)*8; for(let i=0;i<2;i++){ const xx=X+off+i*16; if(xx>x0&&xx<x1) P(xx,Math.max(y0,yy),1,Math.min(15,y1-yy),cD); } } for(let i=0;i<2;i++) P(X+4+rnd(th(tx,ty,i)*22),Y+3+rnd(th(tx,ty,i+5)*24),3,1,cL); }
  else for(let i=0;i<7;i++){ const x=x0+2+rnd(th(tx,ty,i+40)*(x1-x0-6)), y=y0+2+rnd(th(tx,ty,i+50)*(y1-y0-5)); if(i<3) P(x,y,2,1,cD); else if(i<5) P(x,y,1,1,cL); else { P(x,y,3,2,cD); P(x,y,2,1,cL); } } }
function tWater(X,Y,S,tx,ty,nb){ P(X,Y,TS,TS,S.wat);
  for(let i=0;i<3;i++){ const x=X+2+rnd(th(tx,ty,i+60)*22), y=Y+6+rnd(th(tx,ty,i+70)*22); P(x,y,6,1,S.watD); }
  if(!nb[0]){ P(X,Y,TS,7,S.watD); P(X,Y,TS,3,'#5a6a4a'); P(X,Y+7,TS,1,S.watL); } if(!nb[3]){ P(X,Y,3,TS,S.watD); P(X,Y,1,TS,'#5a6a4a'); } if(!nb[1]){ P(X+TS-3,Y,3,TS,S.watD); P(X+TS-1,Y,1,TS,'#5a6a4a'); } if(!nb[2]){ P(X,Y+TS-2,TS,2,S.watL); } }
function tBridge(X,Y,S,tx,ty,nb){ P(X,Y,TS,TS,'#c49a62'); for(let i=0;i<4;i++){ P(X+i*8,Y,1,TS,'#a47a48'); P(X+i*8+1,Y,1,TS,'#d8b27a'); }
  if(!nb[0]){ P(X,Y,TS,5,WOODC); P(X,Y,TS,1,WOODL); P(X,Y+5,TS,2,rgba('#3a2a20',.3)); P(X+2,Y-0,4,6,WOODD); P(X+18,Y,4,6,WOODD); } if(!nb[2]){ P(X,Y+TS-6,TS,6,WOODC); P(X,Y+TS-6,TS,1,WOODL); P(X+2,Y+TS-7,4,7,WOODD); P(X+18,Y+TS-7,4,7,WOODD); } }
function tField(X,Y,S,tx,ty,sea){ P(X,Y,TS,TS,S.soil);
  for(let j=0;j<4;j++){ const y=Y+j*8; P(X,y+6,TS,2,S.soilD); P(X,y,TS,1,lt(S.soil,.12));
    for(let i=0;i<4;i++){ const x=X+3+i*8+((j%2)*2);
      if(sea===0){ P(x,y+1,2,5,S.crop); P(x-2,y+1,2,2,lt(S.crop,.2)); P(x+2,y,2,2,lt(S.crop,.2)); }
      else if(sea===1){ P(x-2,y-1,6,6,S.crop); P(x-1,y-3,4,2,S.crop); P(x-2,y-1,2,2,lt(S.crop,.25)); P(x+1,y-3,2,2,lt(S.crop,.25)); P(x-2,y+4,6,1,dk(S.crop,.25)); P(x,y+5,2,1,dk(S.crop,.3)); }
      else if(sea===2){ P(x,y,1,6,'#c9962e'); P(x-1,y-2,3,3,S.crop); P(x,y-3,1,1,'#f6d870'); P(x+2,y+1,1,4,'#c9962e'); P(x+1,y-1,2,2,'#f0c850'); }
      else if(th(tx*4+i,ty*4+j,1)<.4){ P(x,y+3,3,2,'#ffffff'); } } } }
function tCliff(X,Y,S,tx,ty,nb,sea){ const c='#9c988e', d='#7b776f', l='#bdb9ae', dd='#5f5c56'; P(X,Y,TS,TS,c);
  for(let j=0;j<4;j++){ const y=Y+j*8+rnd(th(tx,ty,j)*3); P(X,y,TS,1,d); const x=X+rnd(th(tx,ty,j+8)*24); P(x,y+1,1,5,d); P(x+1,y+1,5,1,l); P(X+rnd(th(tx,ty,j+16)*26),y+4,4,1,l); }
  if(!nb[2]){ P(X,Y+TS-8,TS,8,d); P(X,Y+TS-3,TS,3,dd); for(let i=0;i<4;i++) P(X+2+i*8+rnd(th(tx,ty,i+30)*3),Y+TS-10,4,3,c); }
  if(!nb[0]){ P(X,Y,TS,4,sea===3?'#ffffff':S.g2); P(X,Y+4,TS,2,sea===3?'#d8e4eb':dk(S.g2,.2)); }
  if(sea===3) for(let i=0;i<3;i++) P(X+rnd(th(tx,ty,i+40)*26),Y+rnd(th(tx,ty,i+44)*26),5,2,'#ffffff'); }
function tFloor(X,Y,tx,ty){ P(X,Y,TS,TS,'#c99b62'); for(let j=0;j<4;j++){ P(X,Y+j*8+7,TS,1,'#a67a46'); P(X,Y+j*8,TS,1,'#d8ae76'); const x=X+((tx*5+j*11+ty*3)%4)*8; P(x,Y+j*8,1,8,'#a67a46'); } if(th(tx,ty,1)<.3) P(X+8+rnd(th(tx,ty,2)*14),Y+10+rnd(th(tx,ty,3)*12),2,2,'#a67a46'); }
function tWall(X,Y,tx,ty,face){ if(!face){ P(X,Y,TS,TS,'#2b2630'); return; } P(X,Y,TS,TS,'#efe6d0'); P(X,Y,TS,6,WOODD); P(X,Y+6,TS,2,WOODC); P(X,Y+TS-5,TS,5,WOODC); P(X,Y+TS-5,TS,1,WOODL); if(tx%2===0){ P(X,Y+8,4,TS-13,WOODC); P(X,Y+8,1,TS-13,WOODL); } P(X,Y+8,TS,3,rgba('#3a2a20',.18)); }
// 큰 지도의 땅: d 모래, n 눈밭, j 밀림, p 초원
const BIOMEP={d:{g:'#e8d29a',g2:'#d4ba7c',g3:'#f4e4b8',fl:[]},n:{g:'#eef3f6',g2:'#d6e2ea',g3:'#ffffff',fl:[]},j:{g:'#58a54e',g2:'#3f8a44',g3:'#74bd62',fl:[]},p:{g:'#bccb7c',g2:'#a4b566',g3:'#d0dc94',fl:[]}};
const PATHISH={'=':1,'s':1,'B':1}, WATERISH={'~':1,'B':1};
function drawGround(M,sea){ const key=M.id+'/'+sea; if(M._gc&&M._gk===key) return M._gc; const S=MP[sea], c=M._gc||document.createElement('canvas'); c.width=M.w*TS; c.height=M.h*TS; const keep=cx; cx=c.getContext('2d');
  const at=(x,y)=>x<0||y<0||x>=M.w||y>=M.h?null:M.g[y][x];
  try{ for(let y=0;y<M.h;y++) for(let x=0;x<M.w;x++){ const k=M.g[y][x], X=x*TS, Y=y*TS, nbf=(f)=>[f(at(x,y-1),0),f(at(x+1,y),1),f(at(x,y+1),2),f(at(x-1,y),3)];
      if(k==='.'||k===':') tGrass(X,Y,S,x,y,k===':');
      else if(BIOMEP[k]) tGrass(X,Y,sea===3&&k!=='d'?S:BIOMEP[k],x,y,0);
      else if(k==='='||k==='s') tPath(X,Y,S,x,y,nbf(n=>n==null||!!PATHISH[n]||n==='D'),k==='s');
      else if(k==='~') tWater(X,Y,S,x,y,nbf(n=>n==null||!!WATERISH[n]||n==='^'));
      else if(k==='B'){ tWater(X,Y,S,x,y,[1,1,1,1]); tBridge(X,Y,S,x,y,nbf(n=>n==='B')); }
      else if(k==='F') tField(X,Y,S,x,y,sea);
      else if(k==='^') tCliff(X,Y,S,x,y,nbf(n=>n==null||n==='^'),sea);
      else if(k==='o'||k==='D') tFloor(X,Y,x,y);
      else if(k==='#') tWall(X,Y,x,y,at(x,y+1)==='o'||at(x,y+1)==='D');
      else P(X,Y,TS,TS,'#1c1a22');
      if(k==='D'){ P(X+4,Y+TS-10,TS-8,10,'#8a3a2a'); P(X+6,Y+TS-8,TS-12,6,'#c0503a'); } }
  } finally{ cx=keep; }
  M._gc=c; M._gk=key; return c; }
/* ---- 물건: 나무, 바위, 건물 ---- */
function canopy(cxm,by,lf,D,L,r,seed){ disc(cxm,by-r,r+2,D); disc(cxm-rnd(r*.55),by-rnd(r*.5),rnd(r*.7),D); disc(cxm+rnd(r*.58),by-rnd(r*.55),rnd(r*.66),D);
  disc(cxm,by-r-3,r,lf); disc(cxm-rnd(r*.55),by-rnd(r*.5)-4,rnd(r*.6),lf); disc(cxm+rnd(r*.55),by-rnd(r*.55)-4,rnd(r*.56),lf);
  disc(cxm-rnd(r*.3),by-r-rnd(r*.45),rnd(r*.42),L); disc(cxm+rnd(r*.38),by-r-rnd(r*.2),rnd(r*.25),L); disc(cxm-rnd(r*.62),by-rnd(r*.62),rnd(r*.22),L);
  for(let i=0;i<16;i++){ const a=hsh(seed+i*1.7)*6.28, rr=hsh(seed+i*2.9)*r*.85, x=cxm+Math.cos(a)*rr, y=by-r-3+Math.sin(a)*rr*.85; P(x,y,2,1,i%3?D:L); P(x+1,y+1,1,1,i%3?D:L); } }
const OBJ={
  tree:{w:1,h:1,ax:36,ay:86,spr:(S,o,sea)=>mkSpr(72,90,()=>{ const x=36, by=88, plum=o.v==='plum';
    P(x-5,by-28,10,28,WOODC); P(x-5,by-28,3,28,WOODL); P(x+2,by-28,3,28,WOODD); P(x-8,by-3,5,3,WOODD); P(x+4,by-3,5,3,WOODD); P(x-2,by-14,2,4,WOODD);
    if(sea===3){ const b=(x0,y0,x1,y1)=>{ line(x0,y0,x1,y1,WOODC); line(x0+1,y0,x1+1,y1,WOODD); P(x1-3,y1-2,7,2,'#ffffff'); };
      b(x,by-28,x-16,by-52); b(x,by-28,x+15,by-50); b(x,by-30,x-2,by-66); b(x-8,by-40,x-22,by-44); b(x+8,by-40,x+22,by-46); b(x-2,by-48,x+8,by-62); P(x-6,by-30,12,3,'#ffffff'); }
    else canopy(x,by-22,plum&&S.bl?S.bl:S.lf,plum&&S.bl?dk(S.bl,.2):S.lfD,plum&&S.bl?lt(S.bl,.4):S.lfL,24,o.x*3.1+o.y*7.7); }) },
  pine:{w:1,h:1,ax:28,ay:88,spr:(S,o,sea)=>mkSpr(56,92,()=>{ const x=28, by=90, c='#3f8a5c', d='#2c6a48', l='#5aa874'; P(x-4,by-14,8,14,WOODC); P(x-4,by-14,2,14,WOODL); P(x+2,by-14,2,14,WOODD);
    for(let t=0;t<3;t++){ const w=24-t*5, y1=by-12-t*18, hh=26; for(let r=0;r<hh;r++){ const hw=rnd(2+(w-2)*(r/hh)); P(x-hw,y1-hh+r,hw*2,1,r>hh-4?d:c); P(x-hw+1,y1-hh+r,Math.max(1,rnd(hw*.45)),1,l); if(sea===3&&r<8) P(x-hw,y1-hh+r,hw*2,1,'#ffffff'); else if(sea===3&&r<11&&(r+t)%2) P(x-hw+2,y1-hh+r,hw,1,'#ffffff'); } P(x-w+2,y1-1,3,2,d); P(x+w-5,y1-1,3,2,d); } }) },
  bush:{w:1,h:1,ax:16,ay:28,spr:(S,o,sea)=>mkSpr(32,30,()=>{ const c=sea===3?'#e4edf2':S.lf, d=sea===3?'#b8c8d2':S.lfD, l=sea===3?'#ffffff':S.lfL; disc(16,19,9,d); disc(9,21,6,d); disc(23,21,6,d); disc(16,17,8,c); disc(9,19,5,c); disc(23,19,5,c); disc(13,14,4,l); disc(22,17,2,l); if(sea===0||sea===1){ P(8,18,2,2,'#ff7a8a'); P(19,13,2,2,'#ff7a8a'); P(24,20,2,2,'#ff7a8a'); } }) },
  rock:{w:1,h:1,ax:16,ay:28,spr:(S,o,sea)=>mkSpr(32,30,()=>{ const c='#a9a59b', d='#827e76', l='#cdc9bf'; for(let r=0;r<18;r++){ const hw=rnd(13*Math.sqrt(1-Math.pow((r-10)/11,2))); P(16-hw,9+r,hw*2,1,r>12?d:c); } P(8,12,8,2,l); P(7,14,4,2,l); P(18,17,6,1,d); P(20,13,1,5,d); if(sea===3){ P(8,9,14,3,'#ffffff'); P(6,12,5,2,'#ffffff'); } }) },
  flat:{w:2,h:1,solid:0,ax:32,ay:26,flat:1,spr:(S,o,sea)=>mkSpr(64,30,()=>{ const c='#b5b1a6', d='#8a867d', l='#d6d2c7'; for(let r=0;r<16;r++){ const hw=rnd(28*Math.sqrt(1-Math.pow((r-7)/8.5,2))); P(32-hw,7+r,hw*2,1,r>11?d:c); } P(12,9,34,2,l); P(40,15,10,1,d); P(20,17,8,1,d); }) },
  fence:{w:1,h:1,ax:16,ay:28,spr:(S,o,sea)=>mkSpr(32,30,()=>{ P(0,10,32,3,WOODC); P(0,10,32,1,WOODL); P(0,18,32,3,WOODC); P(0,18,32,1,WOODL); for(const x of [3,19]){ P(x,4,5,24,WOODC); P(x,4,2,24,WOODL); P(x+4,4,1,24,WOODD); P(x,3,5,2,sea===3?'#ffffff':WOODL); } }) },
  well:{w:1,h:1,ax:18,ay:36,spr:(S,o,sea)=>mkSpr(36,40,()=>{ const c='#b3afa4', d='#8a867d', l='#d4d0c5'; P(4,2,3,26,WOODC); P(29,2,3,26,WOODC); P(2,0,32,4,WOODD); P(2,0,32,1,WOODL); P(17,4,1,10,'#d9d2bc'); P(14,13,7,6,WOODC); P(14,13,7,1,WOODL);
    for(let r=0;r<16;r++){ const hw=rnd(15*Math.sqrt(1-Math.pow((r-6)/9,2))); P(18-hw,20+r,hw*2,1,r>7?d:c); } for(let r=0;r<8;r++){ const hw=rnd(11*Math.sqrt(1-Math.pow((r-3.5)/4,2))); P(18-hw,21+r,hw*2,1,r<2?'#2c4a5a':'#3f7a94'); } P(6,22,4,1,l); P(24,30,6,1,d); P(10,33,4,1,l); }) },
  sign:{w:1,h:1,ax:16,ay:30,spr:()=>mkSpr(32,32,()=>{ P(14,10,4,20,WOODC); P(14,10,1,20,WOODL); P(4,4,24,12,WOODL); P(4,4,24,1,'#c89a66'); P(4,15,24,1,WOODD); P(8,8,10,1,WOODD); P(8,11,14,1,WOODD); }) },
  lantern:{w:1,h:1,ax:16,ay:30,spr:(S,o,sea)=>mkSpr(32,34,()=>{ const c='#b3afa4', d='#8a867d', l='#d4d0c5'; P(11,28,10,4,d); P(13,18,6,10,c); P(13,18,2,10,l); P(9,8,14,10,c); P(9,8,14,2,l); P(12,11,8,5,'#ffd870'); P(7,5,18,4,d); P(10,2,12,3,c); P(14,0,4,2,d); if(sea===3) P(8,3,16,2,'#ffffff'); }) },
  dummy:{w:1,h:1,ax:16,ay:38,spr:()=>mkSpr(32,40,()=>{ P(13,10,6,28,WOODC); P(13,10,2,28,WOODL); P(4,14,24,5,WOODC); P(4,14,24,1,WOODL); P(10,2,12,10,'#d8b86a'); P(10,2,12,2,'#ecd088'); P(10,6,12,1,'#b89448'); P(10,9,12,1,'#b89448'); P(9,20,14,10,'#d8b86a'); P(9,23,14,1,'#b89448'); P(9,27,14,1,'#b89448'); P(10,36,12,3,WOODD); }) },
  vat:{w:1,h:1,ax:16,ay:28,spr:(S,o,sea)=>mkSpr(32,30,()=>{ const c='#8a5a3e', d='#6a4028', l='#a8744e'; for(let r=0;r<20;r++){ const hw=rnd(4+7*Math.sin(Math.min(1,(r+2)/20)*3.1)); P(16-hw,8+r,hw*2,1,r>14?d:c); } P(11,6,10,3,d); P(12,6,8,1,l); P(10,12,2,8,l); if(sea===3) P(11,4,10,3,'#ffffff'); }) },
  anvil:{w:1,h:1,ax:18,ay:30,spr:()=>mkSpr(40,34,()=>{ P(4,6,14,22,'#8a5a48'); P(4,6,14,2,'#a8705a'); P(7,12,8,10,'#2a2228'); P(8,16,6,6,'#ff9a3a'); P(9,18,4,4,'#ffe07a'); P(6,2,4,5,'#6a4a40'); P(22,18,14,5,'#4a4a56'); P(22,18,14,1,'#7a7a8a'); P(26,23,6,5,'#3a3a44'); P(23,28,12,3,'#4a4a56'); P(20,19,3,2,'#4a4a56'); }) },
  stall:{w:2,h:1,ax:32,ay:44,spr:(S,o,sea)=>mkSpr(64,48,()=>{ const c=o.c||'#d8452c', c2='#fff4e0'; P(3,14,3,32,WOODC); P(58,14,3,32,WOODC); P(3,14,1,32,WOODL);
    P(2,30,60,12,WOODC); P(2,30,60,2,WOODL); P(2,40,60,2,WOODD); P(4,34,56,1,WOODD);
    for(let i=0;i<8;i++){ const col=i%2?c2:c; P(i*8,2,8,12,col); P(i*8,12,8,3,dk(col,.18)); P(i*8+1,15,6,2,col); } P(0,2,64,1,lt(c,.3)); if(sea===3) P(0,0,64,3,'#ffffff');
    const gs=o.goods||['#e0503a','#f0c040','#6fbf5a','#e08a3a']; for(let i=0;i<6;i++){ const x=7+i*9; P(x,24,7,6,gs[i%gs.length]); P(x,24,7,2,lt(gs[i%gs.length],.3)); P(x+1,22,5,2,gs[i%gs.length]); } }) },
  fire:{w:1,h:1,ax:16,ay:28,anim:1,spr:(S,o,sea,f)=>mkSpr(32,32,()=>{ P(6,24,20,4,WOODD); P(8,22,6,3,WOODC); P(18,22,6,3,WOODC); const k=f%2; P(11,12+k,10,12-k,'#ff8a2a'); P(13,8+k*2,6,10,'#ff8a2a'); P(13,15,6,8,'#ffd84a'); P(15,11+k,2,6,'#ffd84a'); P(15,18,2,4,'#ffffff'); },0) },
  scare:{w:1,h:1,ax:16,ay:42,spr:()=>mkSpr(32,44,()=>{ P(15,8,3,34,WOODC); P(4,16,24,3,WOODC); P(8,14,16,12,'#c9a25a'); P(8,24,16,2,'#a8823e'); P(11,3,10,10,'#e8d2a0'); P(8,1,16,3,'#d2b878'); P(13,7,2,2,MINK); P(18,7,2,2,MINK); P(4,19,3,6,'#d8c070'); P(25,19,3,6,'#d8c070'); }) },
  mount:{w:3,h:2,ax:48,ay:92,spr:(S,o,sea)=>mkSpr(96,96,()=>{ const c='#8b9486', d='#687266', l='#a8b0a2', sn='#f4f6f2', mx=44+((o.x*7)%5);
    for(let r=0;r<86;r++){ const y=8+r, hw=rnd(4+r*.5); P(mx-hw,y,hw*2,1,c); P(mx+rnd(hw*.15),y,hw-rnd(hw*.15),1,d); P(mx-hw,y,Math.max(1,rnd(hw*.3)),1,l); }
    const cap=sea===3?44:24; for(let r=0;r<cap;r++){ const y=8+r, hw=rnd(4+r*.5), k=r>cap-8?((r+o.x)%2?.45:.8):1; P(mx-rnd(hw*k),y,rnd(hw*k)*2,1,sn); P(mx+rnd(hw*.3),y,rnd(hw*k*.6),1,'#d5dbe2'); }
    for(let i=0;i<5;i++){ const yy=52+i*8, hw=rnd(4+(yy-8)*.5); P(mx-hw+8+i*6,yy,6,2,d); P(mx+6+i*3,yy+3,5,2,'#59625a'); } }) },
  stele:{w:1,h:1,ax:16,ay:30,spr:(S,o,sea)=>mkSpr(32,32,()=>{ const c='#9a968c', d='#75716a', l='#bdb9af'; P(10,6,12,24,c); P(11,4,10,2,c); P(10,6,3,24,l); P(19,6,3,24,d); P(8,28,16,3,d); for(const y of [10,14,18,22]) P(14,y,4,1,d); if(sea===3) P(11,3,10,3,'#ffffff'); }) },
  mound:{w:2,h:1,ax:32,ay:30,spr:(S,o,sea)=>mkSpr(64,32,()=>{ const c=sea===3?'#e8ecee':sea===2?'#a89a5a':'#6f9a56', d=sea===3?'#c5ccd2':sea===2?'#8a7c46':'#527a42'; for(let r=0;r<24;r++){ const hw=rnd(28*Math.sqrt(1-Math.pow((23-r)/24,2))); P(32-hw,6+r,hw*2,1,r>16?d:c); } P(20,12,10,2,lt(c,.25)); }) },
  tent:{w:2,h:2,ax:32,ay:60,spr:(S,o,sea)=>mkSpr(64,64,()=>{ const c=o.c||'#9a7a52', d=dk(c,.28), l=lt(c,.2), fc=o.fc||'#b8321f'; for(let r=0;r<44;r++){ const hw=rnd(3+r*.62); P(32-hw,16+r,hw*2,1,c); P(32,16+r,hw,1,d); P(32-hw,16+r,Math.max(1,rnd(hw*.25)),1,l); } for(let r=0;r<22;r++){ const hw=rnd(1+r*.3); P(32-hw,38+r,hw*2,1,'#2a2420'); } P(31,4,2,14,WOODD); P(33,4,10,6,fc); P(33,10,6,2,fc); if(sea===3) for(let r=0;r<8;r++){ const hw=rnd(3+r*.62); P(32-hw,16+r,hw*2,1,'#ffffff'); } }) },
  gate:{w:4,h:1,solid:0,ax:64,ay:74,posts:[0,3],spr:(S,o,sea)=>mkSpr(128,78,()=>{ for(const x of [10,106]){ P(x,14,12,62,'#a8402e'); P(x,14,4,62,'#c8553e'); P(x+9,14,3,62,'#7f281d'); P(x-2,72,16,5,'#8a867d'); }
    P(4,18,120,8,'#a8402e'); P(4,18,120,2,'#c8553e'); P(0,4,128,10,'#4d6072'); P(0,4,128,2,'#7f95a8'); P(0,12,128,3,'#2f3c4a'); for(let i=0;i<16;i++) P(i*8+3,6,1,6,'#3a4a5a'); P(-0,2,6,3,'#4d6072'); P(122,2,6,3,'#4d6072'); P(48,28,32,12,'#2a2630'); P(50,30,28,8,'#d9a441'); P(54,32,20,1,'#2a2630'); P(54,35,20,1,'#2a2630'); if(sea===3) P(0,2,128,3,'#ffffff'); }) },
  bed:{w:1,h:2,ax:16,ay:60,spr:(S,o)=>mkSpr(32,62,()=>{ P(2,4,28,56,WOODC); P(2,4,28,3,WOODL); P(4,8,24,50,'#f2ead8'); P(4,22,24,36,o.c||'#b8504a'); P(4,22,24,3,lt(o.c||'#b8504a',.25)); P(7,10,18,9,'#ffffff'); P(7,17,18,2,'#d8d0c0'); P(4,56,24,2,dk(o.c||'#b8504a',.25)); }) },
  mat:{w:1,h:2,ax:16,ay:58,spr:()=>mkSpr(32,60,()=>{ P(3,6,26,52,'#d8c07a'); for(let i=0;i<13;i++) P(3,8+i*4,26,1,'#b89a52'); P(3,6,26,2,'#ecd898'); P(6,10,16,8,'#c9b8a0'); P(5,26,22,30,'#8a7a62'); P(5,26,22,2,'#a8987c'); }) },
  table:{w:2,h:1,ax:32,ay:30,spr:()=>mkSpr(64,34,()=>{ P(6,8,52,16,WOODL); P(6,8,52,2,'#c89a66'); P(6,22,52,4,WOODC); P(9,26,4,7,WOODD); P(51,26,4,7,WOODD); P(18,11,8,6,'#f4efe0'); P(19,12,6,3,'#8fb0c0'); P(34,10,10,7,'#f4efe0'); P(36,12,6,3,'#d8a060'); P(48,13,5,4,'#c9a25a'); }) },
  stove:{w:1,h:1,ax:16,ay:30,spr:()=>mkSpr(32,34,()=>{ P(2,8,28,24,'#b8a890'); P(2,8,28,3,'#d2c4ac'); P(2,28,28,4,'#8a7e6a'); P(10,18,12,12,'#2a2228'); P(12,22,8,8,'#ff8a2a'); P(14,25,4,5,'#ffe07a'); P(6,2,20,8,'#3a3a44'); P(6,2,20,2,'#6a6a78'); P(4,5,24,2,'#2a2a32'); }) },
  chest:{w:1,h:1,ax:16,ay:28,spr:()=>mkSpr(32,30,()=>{ P(3,8,26,20,WOODC); P(3,8,26,3,WOODL); P(3,14,26,2,WOODD); P(3,25,26,3,WOODD); P(13,13,6,6,'#d9a441'); P(15,15,2,2,MINK); P(3,8,2,20,'#d9a441'); P(27,8,2,20,'#d9a441'); }) },
  shelf:{w:1,h:1,ax:16,ay:30,spr:(S,o)=>mkSpr(32,46,()=>{ P(2,2,28,42,WOODC); P(2,2,28,2,WOODL); P(4,6,24,10,'#4a3524'); P(4,19,24,10,'#4a3524'); P(4,32,24,10,'#4a3524'); const cs=o.cs||['#c0503a','#3f6fae','#e0a83c','#6f9a62','#e9e2c8']; for(let j=0;j<3;j++) for(let i=0;i<4;i++){ const c=cs[(i+j*2)%cs.length]; P(6+i*5,8+j*13+(i%2),4,8-(i%2),c); P(6+i*5,8+j*13+(i%2),1,8-(i%2),lt(c,.3)); } }) },
  screen:{w:2,h:1,ax:32,ay:30,spr:()=>mkSpr(64,50,()=>{ for(let i=0;i<4;i++){ const x=2+i*15; P(x,4+(i%2)*2,14,42,'#3a2a20'); P(x+1,6+(i%2)*2,12,38,'#f2ead2'); P(x+3,12+(i%2)*2,8,1,'#7a8a6a'); line(x+4,36+(i%2)*2,x+9,18+(i%2)*2,'#5a6a5a'); P(x+8,16+(i%2)*2,3,3,'#e07a8a'); P(x+4,24+(i%2)*2,2,2,'#e07a8a'); } }) },
  rug:{w:2,h:2,solid:0,flat:1,ax:32,ay:60,spr:(S,o)=>mkSpr(64,64,()=>{ const c=o.c||'#a8402e'; P(4,6,56,52,c); P(4,6,56,2,lt(c,.25)); P(8,10,48,44,dk(c,.15)); P(10,12,44,40,c); P(28,28,8,8,'#d9a441'); P(14,16,4,4,'#d9a441'); P(46,16,4,4,'#d9a441'); P(14,44,4,4,'#d9a441'); P(46,44,4,4,'#d9a441'); },0) }
};
/* 건물: 지붕(기와·초가)과 앞벽. o: w,h(칸), roof 't'|'h', rc 지붕색, door 문이 있는 칸, sign, pillar, lamp, chim, two */
function sprHouse(o,sea){ const wt=o.w, ht=o.h, w=wt*TS+8, wallH=30, top=o.two?30:0, h=ht*TS+14+top, wy=h-wallH, thatch=o.roof==='h';
  return mkSpr(w,h,()=>{ const X=4, ww=wt*TS, wall=o.wall||'#f3ead4', post=o.pillar?'#b8402e':WOODC, postL=o.pillar?'#d85a44':WOODL, dx=X+o.door*TS+16, dw=o.dw||20;
    const wallAt=(y0)=>{ P(X+2,y0,ww-4,wallH,wall); P(X+2,y0+wallH-5,ww-4,5,'#a9a59b'); P(X+2,y0+wallH-5,ww-4,1,'#cdc9bf');
      for(let i=0;i<=wt;i++){ const px=Math.min(X+ww-6,Math.max(X+2,X+i*TS-2)); if(i>0&&i<wt&&!o.pillar&&wt<4) continue; P(px,y0,4,wallH-5,post); P(px,y0,1,wallH-5,postL); } };
    if(o.two){ wallAt(wy-30); for(let i=0;i<wt;i++){ const x=X+i*TS+8; P(x,wy-24,16,13,WOODD); P(x+1,wy-23,14,11,'#fff3d0'); P(x+8,wy-23,1,11,WOODD); P(x+1,wy-18,14,1,WOODD); } P(X-2,wy-6,ww+4,8,dk(o.rc||'#4d6072',.1)); P(X-2,wy-6,ww+4,2,lt(o.rc||'#4d6072',.3)); P(X+2,wy-30,ww-4,4,rgba('#3a2a20',.3)); }
    wallAt(wy);
    for(let i=0;i<wt;i++){ if(i===o.door||(o.dw>24&&Math.abs(i-o.door)<1)) continue; if(o.nowin&&o.nowin.includes(i)) continue; const x=X+i*TS+8; P(x,wy+8,16,13,WOODD); P(x+1,wy+9,14,11,'#fff3d0'); P(x+5,wy+9,1,11,WOODD); P(x+10,wy+9,1,11,WOODD); P(x+1,wy+14,14,1,WOODD); }
    P(dx-dw/2-2,wy+3,dw+4,wallH-3,WOODD); if(o.open){ P(dx-dw/2,wy+5,dw,wallH-5,'#2a2228'); P(dx-dw/2,wy+5,dw,5,'#8a2e22'); P(dx-dw/2+2,wy+10,2,3,'#8a2e22'); P(dx+dw/2-4,wy+10,2,3,'#8a2e22'); } else { P(dx-dw/2,wy+5,dw,wallH-5,o.dc||'#9a6a40'); P(dx-dw/2,wy+5,dw,1,lt(o.dc||'#9a6a40',.25)); P(dx-1,wy+5,2,wallH-5,WOODD); P(dx-5,wy+17,2,3,'#d9a441'); P(dx+3,wy+17,2,3,'#d9a441'); for(let i=0;i<3;i++) P(dx-dw/2+2+i*4,wy+8,1,wallH-10,dk(o.dc||'#9a6a40',.12)); }
    P(X+2,wy,ww-4,5,rgba('#3a2a20',.3));
    // 지붕
    const rh=wy-top+5, ry=top?0:0, rc=o.rc||(thatch?'#e0bd6e':'#4d6072'), rD=dk(rc,.25), rL=lt(rc,.3), yb=top?wy-30+5:wy+5, y0=yb-rh;
    for(let r=0;r<rh;r++){ const t=r/rh, ins=rnd((1-t)*(thatch?9:6)+(thatch&&r<5?(5-r)*2.5:0)), y=y0+r, c=thatch?mix(lt(rc,.18),dk(rc,.12),t):rc; P(X-4+ins,y,ww+8-ins*2,1,c); }
    if(thatch){ for(let i=0;i<wt*ht*14;i++){ const x=X+rnd(hsh(i*1.9+o.x)*(ww-6)), y=y0+6+rnd(hsh(i*3.3+o.y)*(rh-12)); P(x,y,1,4,i%3?rD:rL); } for(let i=0;i<ww+8;i+=4){ P(X-4+i,yb-3,2,3+((i>>2)%2)*2,rD); } P(X-2,yb-5,ww+4,2,rD); for(let i=0;i<3;i++) P(X+10,y0+rnd(rh*(.3+i*.22)),ww-20,1,dk(rc,.1)); if(sea===3){ for(let r=0;r<rh*.5;r++){ const ins=rnd((1-r/rh)*9+(r<5?(5-r)*2.5:0)); P(X-4+ins+((r>rh*.4)?6:0),y0+r,ww+8-ins*2-((r>rh*.4)?12:0),1,'#ffffff'); } } }
    else { for(let r=7;r<rh-3;r+=6){ const t=r/rh, ins=rnd((1-t)*6); P(X-4+ins,y0+r,ww+8-ins*2,1,rD); for(let x=X-2+ins+((r/6|0)%2)*3;x<X+ww+2-ins;x+=6){ P(x,y0+r-5,1,5,rD); P(x+1,y0+r-5,1,4,rL); } }
      P(X+2,y0,ww-4,6,lt(rc,.18)); P(X+2,y0,ww-4,2,rL); P(X,y0-1,6,8,rD); P(X+ww-6,y0-1,6,8,rD); P(X+1,y0-3,3,3,rD); P(X+ww-4,y0-3,3,3,rD);
      P(X-4,yb-3,ww+8,3,rD); P(X-4,yb-5,ww+8,2,rL); P(X-6,yb-6,4,4,rD); P(X+ww+2,yb-6,4,4,rD); P(X-7,yb-8,3,3,rD); P(X+ww+4,yb-8,3,3,rD);
      if(sea===3){ P(X+2,y0-1,ww-4,3,'#ffffff'); for(let r=3;r<rh*.45;r++){ const ins=rnd((1-r/rh)*6); if(r%6<4) P(X-2+ins,y0+r,ww+4-ins*2,1,'#ffffff'); } } }
    if(o.chim){ const x=X+ww-22; P(x,y0-6,10,14,'#8a7e6a'); P(x,y0-6,10,2,'#a89c86'); P(x-1,y0-8,12,3,'#6a6052'); }
    if(o.sign){ const sx=dx-9, sy=wy-8; P(sx,sy,18,12,WOODD); P(sx+1,sy+1,16,10,o.sc||'#2f4a3a'); const g='#f4e9c8', k=o.sign;
      if(k==='inn'){ P(sx+6,sy+3,6,6,g); P(sx+7,sy+2,4,1,g); P(sx+8,sy+5,2,2,o.sc||'#2f4a3a'); } else if(k==='med'){ P(sx+8,sy+2,2,8,g); P(sx+5,sy+5,8,2,g); } else if(k==='forge'){ P(sx+4,sy+4,10,2,g); P(sx+7,sy+6,4,2,g); P(sx+5,sy+8,8,1,g); } else if(k==='book'){ P(sx+4,sy+3,10,6,g); P(sx+8,sy+3,1,6,o.sc||'#2f4a3a'); } else if(k==='sword'){ line(sx+4,sy+9,sx+13,sy+2,g); P(sx+5,sy+6,4,1,g); } else if(k==='seal'){ P(sx+5,sy+3,8,6,g); P(sx+7,sy+5,4,2,o.sc||'#2f4a3a'); } }
    if(o.lamp){ for(const lx of [dx-dw/2-9,dx+dw/2+4]){ P(lx+2,wy+1,1,4,MINK); P(lx,wy+5,5,7,'#d8452c'); P(lx,wy+5,5,1,'#f0705a'); P(lx+1,wy+12,3,1,'#d9a441'); } }
    if(o.flag){ const fx=X+ww-8; P(fx,y0-18,2,22,WOODD); P(fx+2,y0-17,10,14,o.flag); P(fx+2,y0-17,10,2,lt(o.flag,.3)); P(fx+5,y0-12,4,4,'#fff4e0'); }
  }); }
OBJ.house={solid:1,custom:1};
const _os=new Map();
function objSprite(o,sea,f){ const d=OBJ[o.k], key=o.k==='house'?'h'+o.x+','+o.y+','+o.w+','+o.h+','+(o.roof||'')+(o.rc||'')+(o.sign||'')+sea+(o.mid||''):o.k+'|'+(o.v||'')+(o.c||'')+'|'+(d.seeded?o.x+','+o.y:(o.k==='tree'?(o.x*3+o.y*7)%5:''))+'|'+sea+'|'+(d.anim?f%2:0);
  let s=_os.get(key); if(!s){ s=o.k==='house'?sprHouse(o,sea):d.spr(MP[sea],o,sea,f||0); if(_os.size>700) _os.clear(); _os.set(key,s); } return s; }
