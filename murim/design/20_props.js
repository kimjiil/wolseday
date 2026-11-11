/* ==== murim:gfx-props — 건물·나무·소품 ==== */
function roofTile(x,y,w,h,st){ // 기와 지붕: 아래로 갈수록 넓어지고 처마 끝이 들린다
  for(let i=0;i<h;i++){ const l=x+(h-1-i), ww=w-2*(h-1-i); P(l,y+i,ww,1,i%2?PAL.tile:PAL.tileH); }
  P(x-2,y+h-1,w+4,1,PAL.tileD); P(x-3,y+h-2,2,1,PAL.tileD); P(x+w+1,y+h-2,2,1,PAL.tileD); P(x-4,y+h-3,1,1,PAL.tileD); P(x+w+3,y+h-3,1,1,PAL.tileD);
  P(x+h-2,y-1,w-2*h+4,1,PAL.tileD); P(x+h-3,y-2,2,2,PAL.tileD); P(x+w-h+1,y-2,2,2,PAL.tileD);
  for(let c=x+h+1;c<x+w-h;c+=3) P(c,y+1,1,h-2,PAL.tileD);
  if(st.season===3){ for(let i=0;i<h-1;i+=2){ const l=x+(h-1-i), ww=w-2*(h-1-i); for(let c=l+1;c<l+ww-1;c+=2) P(c,y+i,1,1,'#f3f6f5'); } P(x+h-2,y-2,w-2*h+4,1,'#f3f6f5'); }
}
function roofThatch(x,y,w,h,st){ for(let i=0;i<h;i++){ const l=x+(h-1-i), ww=w-2*(h-1-i); P(l,y+i,ww,1,i===0?lt(PAL.thatch,.15):i%2?PAL.thatchD:PAL.thatch); }
  P(x,y+h,w,1,dk(PAL.thatchD,.3)); for(let c=x+2;c<x+w-2;c+=4) P(c,y+h,1,1,PAL.thatch);
  if(st.season===3){ for(let i=0;i<Math.min(3,h);i++){ const l=x+(h-1-i), ww=w-2*(h-1-i); P(l+1,y+i,ww-2,1,'#f3f6f5'); } } }
function win(x,y,w,h,st){ const lit=st.dark; P(x-1,y-1,w+2,h+2,PAL.woodD); P(x,y,w,h,lit?PAL.paperL:PAL.paperD); P(x+rnd(w/2),y,1,h,PAL.woodD); if(h>3) P(x,y+rnd(h/2),w,1,PAL.woodD); if(lit) glow(x+w/2,y+h/2,w+4,'#ffc870',.3); }
const PROP={
  house(x,gy,st,o){ o=o||{}; const w=o.w||30,h=13;
    P(x,gy-h,w,h,PAL.wall); P(x,gy-3,w,3,PAL.wallS); P(x,gy-h,1,h,PAL.woodD); P(x+w-1,gy-h,1,h,PAL.woodD); P(x+12,gy-h,1,h,PAL.wood);
    P(x+3,gy-10,7,10,PAL.woodD); P(x+4,gy-9,5,9,o.open?'#2a1f16':'#4a3524'); if(!o.open) P(x+8,gy-5,1,1,PAL.gold);
    win(x+w-11,gy-10,6,5,st);
    roofThatch(x-4,gy-h-7,w+8,7,st);
    if(o.chimney){ P(x+w-7,gy-h-10,3,6,PAL.stoneD); PROP.smoke(x+w-6,gy-h-11,st); }
  },
  hut(x,gy,st){ P(x,gy-9,18,9,PAL.wallS); P(x+2,gy-7,5,7,'#3a2a1d'); P(x,gy-9,1,9,PAL.woodD); P(x+17,gy-9,1,9,PAL.woodD); win(x+11,gy-7,4,3,st); roofThatch(x-3,gy-14,24,5,st); },
  hall(x,gy,st,o){ o=o||{}; const w=o.w||56, cxm=x+rnd(w/2);
    P(x-3,gy-3,w+6,3,PAL.stone); P(x-3,gy-3,w+6,1,PAL.stoneL); P(cxm-6,gy-1,12,1,PAL.stoneL);
    P(x,gy-19,w,16,PAL.wall); P(x,gy-6,w,3,PAL.wallS);
    for(let px=x;px<=x+w-2;px+=rnd((w-2)/4)){ P(px,gy-19,2,16,PAL.red); P(px,gy-19,1,16,lt(PAL.red,.18)); }
    P(cxm-6,gy-15,12,12,PAL.woodD); if(o.ajar){ P(cxm-5,gy-14,5,11,'#4a3524'); P(cxm,gy-14,5,11,'#1c1712'); P(cxm+1,gy-14,1,11,PAL.paperL); glow(cxm+2,gy-8,7,'#ffc870',.3); } else { P(cxm-5,gy-14,5,11,st.dark?'#c9a25a':'#6a4a30'); P(cxm+1,gy-14,4,11,st.dark?'#c9a25a':'#6a4a30'); for(let i=0;i<3;i++){ P(cxm-5,gy-11+i*3,10,1,PAL.woodD); } if(st.dark) glow(cxm,gy-9,10,'#ffc870',.22); }
    win(x+5,gy-14,6,6,st); win(x+w-11,gy-14,6,6,st);
    roofTile(x-5,gy-29,w+10,10,st);
    P(cxm-6,gy-23,12,5,'#243a5e'); P(cxm-6,gy-23,12,1,PAL.gold); P(cxm-4,gy-21,8,2,PAL.gold);
    if(o.floor2){ P(x+8,gy-40,w-16,11,PAL.wall); for(let px=x+8;px<=x+w-10;px+=rnd((w-18)/3)) P(px,gy-40,2,11,PAL.red); win(cxm-9,gy-37,5,5,st); win(cxm+4,gy-37,5,5,st); P(x+6,gy-30,w-12,1,PAL.woodD); roofTile(x+2,gy-48,w-4,8,st); }
  },
  gate(x,gy,st){ P(x-1,gy-3,5,3,PAL.stone); P(x+25,gy-3,5,3,PAL.stone);
    P(x,gy-26,3,23,PAL.red); P(x,gy-26,1,23,lt(PAL.red,.2)); P(x+26,gy-26,3,23,PAL.red); P(x+26,gy-26,1,23,lt(PAL.red,.2));
    P(x-3,gy-24,35,3,PAL.woodD); P(x-3,gy-24,35,1,PAL.wood);
    roofTile(x-7,gy-31,43,6,st);
    P(x+8,gy-21,13,6,'#243a5e'); P(x+8,gy-21,13,1,PAL.gold); P(x+8,gy-16,13,1,PAL.gold); P(x+10,gy-19,9,2,PAL.gold);
    P(x-6,gy-6,4,6,PAL.stoneD); P(x-6,gy-8,3,2,PAL.stone); P(x+31,gy-6,4,6,PAL.stoneD); P(x+32,gy-8,3,2,PAL.stone);
  },
  pagoda(x,gy,st,o){ const n=(o&&o.n)||4; P(x-14,gy-3,28,3,PAL.stone);
    for(let i=0;i<n;i++){ const w=24-i*4, y=gy-3-i*9; P(x-w/2+2,y-7,w-4,7,PAL.wall); P(x-w/2+2,y-2,w-4,2,PAL.wallS); P(x-1,y-5,3,5,i?(st.dark?PAL.paperL:PAL.paperD):'#3a2a1d'); P(x-w/2+2,y-7,1,7,PAL.red); P(x+w/2-3,y-7,1,7,PAL.red);
      P(x-w/2-2,y-9,w+4,2,PAL.tile); P(x-w/2,y-10,w,1,PAL.tileH); P(x-w/2-3,y-10,1,1,PAL.tileD); P(x+w/2+2,y-10,1,1,PAL.tileD); if(st.season===3) P(x-w/2,y-10,w,1,'#f3f6f5'); }
    P(x,gy-3-n*9-7,1,7,PAL.gold); P(x-1,gy-3-n*9-4,3,1,PAL.gold); },
  inn(x,gy,st){ const w=58;
    P(x,gy-16,w,16,PAL.wall); P(x,gy-3,w,3,PAL.wallS); for(let px=x;px<x+w;px+=14) P(px,gy-16,2,16,PAL.wood); P(x+w-2,gy-16,2,16,PAL.wood);
    P(x+22,gy-13,14,13,'#2c2018'); P(x+22,gy-13,14,5,'#3f5f8a'); for(let i=0;i<3;i++) P(x+24+i*4,gy-8,2,2,'#3f5f8a'); if(st.dark) glow(x+29,gy-6,9,'#ffc870',.3);
    win(x+5,gy-11,7,6,st); win(x+w-12,gy-11,7,6,st);
    P(x-3,gy-19,w+6,3,PAL.tile); P(x-3,gy-19,w+6,1,PAL.tileH); P(x-5,gy-20,2,1,PAL.tileD); P(x+w+3,gy-20,2,1,PAL.tileD);
    P(x+4,gy-31,w-8,12,PAL.wall); for(let px=x+4;px<x+w-6;px+=12) P(px,gy-31,2,12,PAL.wood); P(x+w-6,gy-31,2,12,PAL.wood);
    win(x+9,gy-28,7,6,st); win(x+25,gy-28,7,6,st); win(x+41,gy-28,7,6,st);
    P(x+2,gy-21,w-4,1,PAL.woodD); for(let px=x+3;px<x+w-3;px+=4) P(px,gy-23,1,2,PAL.woodD); P(x+2,gy-24,w-4,1,PAL.wood);
    roofTile(x-2,gy-40,w+4,9,st);
    PROP.lantern(x-1,gy-17,st); PROP.lantern(x+w,gy-17,st);
    P(x-8,gy-34,1,34,PAL.woodD); P(x-14,gy-33,6,13,'#f1e9d2'); P(x-14,gy-33,6,1,PAL.red); P(x-12,gy-29,2,6,PAL.red); P(x-13,gy-27,4,1,PAL.red); P(x-14,gy-21+((anim()>>4)%2),6,1,'#f1e9d2');
  },
  stall(x,gy,st,o){ const c=(o&&o.c)||'#c23b2b'; P(x,gy-14,1,14,PAL.woodD); P(x+19,gy-14,1,14,PAL.woodD); P(x-1,gy-6,22,2,PAL.wood); P(x,gy-4,20,4,PAL.woodD);
    for(let i=0;i<5;i++){ P(x-3+i*5,gy-18+rnd(i/3),5,4,i%2?'#f1e9d2':c); } P(x-3,gy-14,26,1,dk(c,.3));
    const goods=o&&o.empty?[]:['#d9482b','#e0a83c','#7fae6a','#d9482b','#f1e9d2','#8a5a8a']; goods.forEach((gc,i)=>{ P(x+1+i*3,gy-8,2,2,gc); }); },
  well(x,gy,st,o){ P(x-7,gy-5,14,5,PAL.stone); P(x-7,gy-5,14,1,PAL.stoneL); P(x-5,gy-4,10,1,o&&o.dry?'#3a352e':'#3f6f80'); for(let i=0;i<3;i++) P(x-6+i*5,gy-3,1,3,PAL.stoneD);
    P(x-7,gy-16,1,11,PAL.woodD); P(x+6,gy-16,1,11,PAL.woodD); P(x-9,gy-17,18,1,PAL.wood); P(x-8,gy-19,16,2,PAL.thatchD); P(x,gy-16,1,5,'#d9d2bc'); if(!(o&&o.dry)) P(x-1,gy-11,3,3,PAL.wood);
    if(o&&o.dry){ for(let i=0;i<5;i++) line(x-14+i*7,gy+2,x-11+i*7,gy+5,dk(PAL.dirtD,.25)); } },
  tree(x,gy,st,kind){ const S=SEASON[st.season], se=st.season, sway=RED?0:Math.sin(tk*.02+x)*1;
    if(kind==='pine'){ P(x,gy-17,2,17,'#5a3e2a'); for(let i=0;i<4;i++){ const w=15-i*3, y=gy-9-i*5; P(x+1-rnd(w/2),y,w,3,PAL.pine); P(x+2-rnd(w/2),y-1,w-2,1,PAL.pineL); P(x+1-rnd(w/2),y+2,w,1,dk(PAL.pine,.25)); if(se===3) P(x+2-rnd(w/2),y-1,w-3,1,'#f3f6f5'); } P(x,gy-29,2,3,PAL.pine); return; }
    if(kind==='bamboo'){ for(let i=0;i<6;i++){ const bx=x+i*4+rnd(hsh(i+x)*2), h=30+rnd(hsh(i*3+x)*16), c=i%2?'#5f9a5a':'#4c8650'; P(bx,gy-h,1,h,c); for(let j=6;j<h;j+=6) P(bx,gy-j,1,1,lt(c,.35)); for(let j=0;j<4;j++){ const ly=gy-h+2+j*4, sx=rnd(sway*(1+j*.2)); line(bx,ly,bx+(j%2?4:-4)+sx,ly-2,se===3?'#cfe0d2':'#6fae62'); } } return; }
    if(kind==='willow'){ P(x,gy-20,3,20,'#5a4630'); P(x+2,gy-24,2,6,'#5a4630'); P(x-2,gy-23,3,3,'#5a4630'); const lc=se===3?'#c9d4cf':se===2?'#c9b05a':'#8fbf72'; if(se!==3||1) for(let i=0;i<11;i++){ const x0=x-10+i*2+ (i%3), len=9+rnd(hsh(i+x)*9); for(let j=0;j<len;j+=1) if(se!==3||j%2) P(x0+rnd(sway*j/8),gy-25+j,1,1,j%3?lc:dk(lc,.15)); } return; }
    if(kind==='bare'){ P(x,gy-16,2,16,'#4a3a30'); line(x+1,gy-12,x+8,gy-19,'#4a3a30'); line(x,gy-10,x-7,gy-17,'#4a3a30'); line(x+1,gy-16,x+3,gy-24,'#4a3a30'); line(x-4,gy-14,x-8,gy-21,'#4a3a30'); line(x+5,gy-16,x+10,gy-24,'#4a3a30'); if(se===3){ P(x-7,gy-18,3,1,'#f3f6f5'); P(x+6,gy-20,3,1,'#f3f6f5'); } return; }
    if(kind==='plum'){ const tc='#4d382c'; P(x,gy-8,3,8,tc); P(x+2,gy-13,2,6,tc); P(x+3,gy-17,2,5,tc); line(x+4,gy-14,x+13,gy-20,tc); line(x+3,gy-12,x-7,gy-19,tc); line(x+4,gy-17,x+7,gy-26,tc); line(x+9,gy-17,x+15,gy-25,tc); line(x-3,gy-16,x-9,gy-24,tc);
      const pts=[[13,-20],[10,-18],[-7,-19],[-4,-17],[7,-26],[5,-22],[15,-25],[12,-22],[-9,-24],[-6,-21],[2,-19],[8,-21],[-2,-22],[11,-25],[4,-27],[-8,-17],[16,-21],[0,-25]];
      pts.forEach(([dx,dy],i)=>{ const px=x+dx+rnd(sway*.5), py=gy+dy; if(se===0){ P(px,py,2,2,i%3?'#f4b9c8':'#fbe3ea'); P(px+1,py,1,1,'#e88aa4'); } else if(se===1){ disc(px,py,2,i%2?S.leaf:S.leaf2); } else if(se===2){ if(i%2) P(px,py,2,2,i%4===1?'#cf772f':'#e0a83c'); } else { P(px,py-1,2,1,'#f3f6f5'); } });
      return; }
    if(kind==='palm'){ const tc='#7a6248'; for(let j=0;j<22;j++) P(x+rnd(Math.sin(j*.12)*3),gy-j,2,1,j%4?tc:dk(tc,.2)); const tx=x+rnd(Math.sin(2.6)*3), ty=gy-22; for(let i=0;i<7;i++){ const a=-2.8+i*.42, ex=tx+rnd(Math.cos(a)*11+sway), ey=ty+rnd(Math.sin(a)*6)+3; line(tx,ty,ex,ey,'#4f8f4e'); line(tx,ty-1,ex,ey-1,'#6fae62'); } return; }
    // 활엽수
    P(x,gy-13,3,13,'#5a4630'); P(x+1,gy-13,1,13,'#6f583e'); line(x+1,gy-11,x+6,gy-16,'#5a4630'); line(x+1,gy-12,x-4,gy-16,'#5a4630');
    if(se===3){ line(x+1,gy-13,x+2,gy-24,'#5a4630'); line(x+6,gy-16,x+10,gy-22,'#5a4630'); line(x-4,gy-16,x-8,gy-22,'#5a4630'); P(x-8,gy-23,3,1,'#f3f6f5'); P(x+8,gy-23,3,1,'#f3f6f5'); P(x,gy-25,4,1,'#f3f6f5'); return; }
    const sx=rnd(sway*.6); disc(x-5+sx,gy-19,6,dk(S.leaf,.18)); disc(x+7+sx,gy-18,6,dk(S.leaf,.12)); disc(x+1+sx,gy-24,8,S.leaf); disc(x-2+sx,gy-26,4,lt(S.leaf,.18));
    if(se===0) for(let i=0;i<9;i++) P(x-8+rnd(hsh(i+x)*18)+sx,gy-30+rnd(hsh(i*3+x)*14),1,1,S.leaf2);
    if(se===2) for(let i=0;i<9;i++) P(x-8+rnd(hsh(i+x)*18)+sx,gy-30+rnd(hsh(i*3+x)*14),2,1,S.leaf2);
  },
  bush(x,gy,st){ const S=SEASON[st.season]; disc(x,gy-3,4,dk(S.leaf,.15)); disc(x+5,gy-2,3,S.leaf); disc(x-4,gy-2,3,S.leaf); if(st.season===3){ P(x-3,gy-7,6,1,'#f3f6f5'); } },
  rock(x,gy,st,s){ s=s||1; P(x-4*s,gy-4*s,9*s,4*s,PAL.stoneD); P(x-3*s,gy-6*s,6*s,2*s,PAL.stoneD); P(x-3*s,gy-6*s,5*s,1*s,PAL.stone); P(x-4*s,gy-4*s,4*s,2*s,PAL.stone); P(x+2*s,gy-2*s,3*s,2*s,dk(PAL.stoneD,.2)); if(st.season===3) P(x-3*s,gy-6*s-1,5*s,1,'#f3f6f5'); else P(x-4*s,gy-1,3,1,'#6f8f5a'); },
  slantern(x,gy,st){ P(x-2,gy-2,5,2,PAL.stoneD); P(x,gy-8,1,6,PAL.stone); P(x-2,gy-12,5,4,PAL.stoneD); P(x-1,gy-11,3,2,st.dark?PAL.paperL:'#4d4f4a'); P(x-3,gy-13,7,1,PAL.stone); P(x-1,gy-14,3,1,PAL.stone); if(st.dark) glow(x,gy-10,8,'#ffc870',.4); },
  lantern(x,y,st){ P(x,y-3,1,3,PAL.woodD); P(x-2,y,5,5,PAL.cloth); P(x-1,y-1,3,1,PAL.gold); P(x-1,y+5,3,1,PAL.gold); P(x-2,y+1,1,3,dk(PAL.cloth,.2)); P(x,y+6,1,2,PAL.gold); P(x,y+1,1,3,st.dark?'#ffd98a':lt(PAL.cloth,.25)); if(st.dark) glow(x,y+2,9,'#ff9a50',.45); },
  dummy(x,gy){ P(x-2,gy-2,7,2,PAL.woodD); P(x,gy-17,3,15,PAL.wood); P(x,gy-17,1,15,PAL.woodL); P(x-5,gy-13,5,1,PAL.woodD); P(x+3,gy-10,5,1,PAL.woodD); P(x-4,gy-6,4,1,PAL.woodD); P(x-1,gy-19,5,2,PAL.wood); },
  rack(x,gy){ P(x,gy-10,14,1,PAL.woodD); P(x,gy-4,14,1,PAL.woodD); P(x,gy-11,1,11,PAL.woodD); P(x+13,gy-11,1,11,PAL.woodD); for(let i=0;i<4;i++){ P(x+2+i*3,gy-19,1,19,i%2?'#cfd6d9':PAL.woodL); if(i%2===0){ P(x+1+i*3,gy-20,3,2,'#cfd6d9'); P(x+2+i*3,gy-17,1,2,PAL.cloth); } } },
  fence(x,gy,st,o){ const w=(o&&o.w)||40; for(let i=0;i<=w;i+=6) P(x+i,gy-7,1,7,PAL.woodD); P(x,gy-6,w+1,1,PAL.wood); P(x,gy-3,w+1,1,PAL.wood); },
  waterfall(x,gy,st){ const rc='#6f786f', rd='#565f57';
    for(let j=0;j<56;j++){ const w=24+rnd(Math.sin(j*.21)*3); P(x-12-rnd(Math.sin(j*.13)*2),gy-56+j,w,1,j%7<2?rd:rc); }
    P(x-2,gy-54,7,54,'#e6f3f4'); for(let i=0;i<9;i++){ const y=(anim()*1.3+i*7)%54; P(x-2+(i*3)%7,gy-54+y,1,4,'#a9d0d6'); }
    P(x-14,gy-2,30,4,PAL.water); for(let i=0;i<6;i++) P(x-10+((anim()>>2)+i*5)%24,gy-2+(i%3),3,1,'#eef8f8');
    for(let i=0;i<5;i++) P(x-8+i*5,gy-5-((anim()>>3)+i)%3,3,2,rgba('#ffffff',.5));
    if(st.season===3){ P(x-12,gy-57,22,1,'#f3f6f5'); } },
  platform(x,gy,st,o){ const w=(o&&o.w)||110; P(x,gy-6,w,6,PAL.stoneD); P(x-1,gy-8,w+2,2,PAL.stoneL); for(let i=6;i<w;i+=12) P(x+i,gy-6,1,6,dk(PAL.stoneD,.2)); P(x+rnd(w/2)-7,gy-3,14,3,PAL.stone); P(x+rnd(w/2)-9,gy-1,18,1,PAL.stoneL); P(x+4,gy-8,w-8,1,PAL.redD); },
  crowd(x,gy,st,o){ const w=(o&&o.w)||120, cols=['#4f7590','#a8496a','#6f8a62','#8a7650','#5d5d64','#c98a2e','#7a5a8a']; for(let i=0;i<w/6;i++){ const hx0=x+i*6+rnd(hsh(i*2.1)*2), b=RED?0:(((tk>>4)+i)%5===0?1:0), y=gy-rnd(hsh(i*5.5)*3)-b; P(hx0-3,y-5,7,6,cols[i%cols.length]); P(hx0-2,y-9,5,4,'#e9c39b'); P(hx0-2,y-10,5,2,i%4?'#2a2228':'#4a3a30'); } },
  flag(x,gy,st,o){ const h=(o&&o.h)||30, c=(o&&o.c)||PAL.cloth; P(x,gy-h,1,h,PAL.woodD); P(x-1,gy-h-1,3,1,PAL.gold); for(let j=0;j<7;j++){ const wv=RED?0:(((tk>>3)+j)%4<2?1:0); P(x+1,gy-h+1+j,9+wv,1,j%6===0?dk(c,.2):c); } P(x+3,gy-h+3,4,3,lt(c,.35)); },
  drum(x,gy){ P(x-5,gy-3,1,3,PAL.woodD); P(x+5,gy-3,1,3,PAL.woodD); P(x-5,gy-11,11,8,PAL.red); P(x-5,gy-11,11,1,PAL.gold); P(x-5,gy-4,11,1,PAL.gold); P(x-3,gy-10,7,6,'#e9d9b0'); },
  grave(x,gy,st){ for(let j=0;j<8;j++){ const w=rnd(Math.sqrt(64-j*j)*1.6); P(x-w,gy-8+j,w*2,1,j<2?mix(SEASON[st.season].grass,'#6f6a55',.3):mix(SEASON[st.season].grass2,'#5f5a48',.4)); }
    P(x+14,gy-12,6,12,PAL.stone); P(x+14,gy-12,6,1,PAL.stoneL); P(x+13,gy-1,8,1,PAL.stoneD); P(x+16,gy-10,2,7,PAL.stoneD); P(x+22,gy-2,3,2,'#e9e2c8'); if(st.season===3){ P(x-6,gy-9,12,1,'#f3f6f5'); P(x+14,gy-13,6,1,'#f3f6f5'); } },
  chest(x,gy,st,o){ const stone=o&&o.stone, c=stone?PAL.stoneD:PAL.wood, c2=stone?PAL.stone:PAL.woodL; P(x-6,gy-7,13,7,c); P(x-6,gy-7,13,1,c2); P(x-6,gy-4,13,1,dk(c,.25)); P(x-1,gy-5,3,3,PAL.gold);
    if(o&&o.open){ P(x-6,gy-13,13,3,c2); P(x-6,gy-10,1,3,c); P(x+6,gy-10,1,3,c); P(x-4,gy-9,9,2,'#ffe9a0'); glow(x,gy-9,12,'#ffd870',.5); } else { P(x-7,gy-9,15,2,c2); P(x-7,gy-9,15,1,lt(c2,.2)); } },
  scroll(x,gy,st,o){ const c=(o&&o.c)||'#3f6fae'; P(x-4,gy-3,9,3,'#ece4c8'); P(x-4,gy-3,1,3,PAL.woodD); P(x+4,gy-3,1,3,PAL.woodD); P(x-1,gy-3,2,3,c); glow(x,gy-2,8,c,.35); },
  skeleton(x,gy){ const b='#e6e2d2', d='#2a2630'; P(x-2,gy-13,5,5,b); P(x-1,gy-11,1,2,d); P(x+1,gy-11,1,2,d); P(x-1,gy-8,3,1,b); P(x-3,gy-7,7,1,b); P(x-2,gy-5,5,1,b); P(x-3,gy-3,7,1,b); P(x,gy-8,1,6,b); P(x-6,gy-1,5,1,b); P(x+2,gy-1,5,1,b); P(x-5,gy-2,1,1,b); P(x+5,gy-2,1,1,b); },
  herb(x,gy,st,o){ const k=(o&&o.k)||'fruit', pu=RED?0:(Math.sin(tk*.08)*.5+.5);
    if(k==='lingzhi'){ P(x,gy-4,1,4,'#7a4a2a'); P(x-3,gy-6,7,2,'#b8321f'); P(x-2,gy-7,5,1,'#d9603a'); P(x-3,gy-5,7,1,'#f1d9a0'); glow(x,gy-5,8+pu*3,'#ff7a50',.5); }
    else if(k==='ginseng'){ P(x,gy-8,1,4,'#4f8f4e'); P(x-2,gy-9,2,1,'#6fae62'); P(x+1,gy-9,2,1,'#6fae62'); P(x,gy-10,1,1,'#d9482b'); P(x-1,gy-4,3,4,'#f1e6c8'); P(x-2,gy-2,1,2,'#f1e6c8'); P(x+2,gy-3,1,3,'#f1e6c8'); glow(x,gy-4,8+pu*3,'#fff0c0',.5); }
    else if(k==='ice'){ P(x,gy-6,1,6,'#9fd0e6'); P(x-2,gy-8,5,3,'#dff3fa'); P(x-1,gy-9,3,1,'#ffffff'); glow(x,gy-7,9+pu*3,'#9fd8ff',.55); }
    else { P(x,gy-7,1,7,'#4f7a3e'); P(x-2,gy-5,2,1,'#5f9a4e'); P(x+1,gy-4,2,1,'#5f9a4e'); P(x-1,gy-10,3,3,'#e0402a'); P(x-1,gy-10,1,1,'#ff9a80'); glow(x,gy-9,8+pu*3,'#ff6a40',.5); }
    if(!RED&&tk%9===0) FX.push({t:'spark',x:x-5+hsh(tk)*10,y:gy-6-hsh(tk*1.7)*8,life:16,c:'#fff3c0'}); },
  meteor(x,gy,st){ P(x-6,gy-2,13,3,'#3a352e'); P(x-4,gy-7,9,6,'#2f2a2e'); P(x-3,gy-8,6,1,'#3f3a40'); P(x-2,gy-5,1,2,'#ff8a3a'); P(x+1,gy-6,2,1,'#ffb060'); P(x+2,gy-3,1,2,'#ff8a3a'); glow(x,gy-4,12,'#ff8a3a',.45); PROP.smoke(x,gy-9,st); },
  table(x,gy,st,o){ P(x-9,gy-8,19,2,PAL.wood); P(x-9,gy-8,19,1,PAL.woodL); P(x-8,gy-6,2,6,PAL.woodD); P(x+7,gy-6,2,6,PAL.woodD); P(x-13,gy-4,4,4,PAL.woodD); P(x+10,gy-4,4,4,PAL.woodD);
    if(o&&o.dice){ P(x-4,gy-10,2,2,'#f1ead2'); P(x-1,gy-10,2,2,'#f1ead2'); P(x+3,gy-9,3,1,PAL.gold); P(x+4,gy-10,2,1,PAL.gold); } else { P(x-5,gy-12,3,4,'#8a6a8a'); P(x-4,gy-13,1,1,'#8a6a8a'); P(x,gy-10,3,2,'#e9e2c8'); P(x+4,gy-10,3,2,'#e9e2c8'); } },
  counter(x,gy,st,o){ const w=(o&&o.w)||60; P(x,gy-11,w,11,PAL.woodD); P(x,gy-12,w,2,PAL.woodL); for(let i=4;i<w;i+=8) P(x+i,gy-9,1,9,dk(PAL.woodD,.2));
    P(x,gy-30,w,1,PAL.woodD); P(x,gy-21,w,1,PAL.woodD); for(let i=0;i<w/7;i++){ const jc=['#8a6a8a','#5f8a7a','#c9a25a','#7a5a4a','#4f6f8f'][i%5]; P(x+2+i*7,gy-27+ (i%2),4,6-(i%2),jc); P(x+3+i*7,gy-18,3,6,['#c9a25a','#7a5a4a','#5f8a7a'][i%3]); }
    if(o&&o.jade){ P(x+rnd(w/2)-2,gy-15,5,3,'#3f9a7a'); P(x+rnd(w/2)-1,gy-14,2,1,'#b8321f'); glow(x+rnd(w/2),gy-14,9,'#ff5a40',.45); } },
  palisade(x,gy,st,o){ const w=(o&&o.w)||70; for(let i=0;i<w;i+=4){ const h=17+(i%8?0:2); if(o&&o.gap&&i>w/2-8&&i<w/2+8) continue; P(x+i,gy-h,3,h,PAL.wood); P(x+i,gy-h,1,h,PAL.woodL); P(x+i+1,gy-h-1,1,1,PAL.wood); } P(x,gy-9,w,1,PAL.woodD); P(x,gy-5,w,1,PAL.woodD); },
  tower(x,gy,st){ P(x-6,gy-26,1,26,PAL.woodD); P(x+6,gy-26,1,26,PAL.woodD); line(x-6,gy-2,x+6,gy-14,PAL.woodD); line(x+6,gy-2,x-6,gy-14,PAL.woodD); P(x-8,gy-28,17,2,PAL.wood); P(x-8,gy-33,1,5,PAL.woodD); P(x+8,gy-33,1,5,PAL.woodD); roofThatch(x-11,gy-38,23,5,st); PROP.flag(x+9,gy-28,st,{h:14,c:'#3a352e'}); },
  bridge(x,gy,st){ for(let i=0;i<44;i++){ const t=i/43, y=gy-rnd(Math.sin(t*Math.PI)*9); P(x+i,y,1,3,PAL.stone); P(x+i,y,1,1,PAL.stoneL); if(i%5===0) P(x+i,y-3,1,3,PAL.stoneD); if(i>8&&i<35){ const ay=gy-rnd(Math.sin((i-8)/26*Math.PI)*5); P(x+i,y+3,1,Math.max(0,ay-y-3),PAL.stoneD); } } P(x,gy-2,6,4,PAL.stoneD); P(x+38,gy-2,6,4,PAL.stoneD); },
  boat(x,y,st){ P(x-8,y,17,2,PAL.woodD); P(x-7,y+2,15,1,PAL.wood); P(x-10,y-1,3,1,PAL.woodD); P(x+8,y-1,3,1,PAL.woodD); P(x-3,y-5,8,5,PAL.thatchD); P(x-2,y-6,6,1,PAL.thatch); P(x+6,y-6,1,6,PAL.woodD); PROP.lantern(x+6,y-10,st); },
  fire(x,gy,st,o){ const s=(o&&o.s)||1, n=5*s; for(let i=0;i<n;i++){ const fx=x-n+i*2, h=rnd((3+hsh(i*7.7+((anim()>>2)%9))*7)*s); P(fx,gy-h,2,h,'#e0402a'); P(fx,gy-rnd(h*.7),2,rnd(h*.7),'#ff8a3a'); P(fx,gy-rnd(h*.35),2,rnd(h*.35),'#ffe08a'); } glow(x,gy-4*s,14*s,'#ff8a3a',.55); if(!RED&&tk%6===0) FX.push({t:'smoke',x:x-3+hsh(tk)*6,y:gy-8*s,life:50}); },
  smoke(x,y,st){ for(let i=0;i<4;i++){ const t=((anim()*.25+i*9)%36), px=x+rnd(Math.sin(t*.2+i)*2+t*.15), py=y-t; P(px,py,2+rnd(t/12),2+rnd(t/14),rgba('#f1f1ea',Math.max(0,.55-t/70))); } },
  drapes(x,gy,st){ for(let i=0;i<W;i+=24){ for(let j=0;j<9;j++){ const w=24-rnd(Math.abs(j-0)*1.6); P(i+rnd((24-w)/2),4+j,w,1,j<2?PAL.redD:PAL.cloth); } P(i+11,13,2,3,PAL.gold); }
    P(0,2,W,3,PAL.redD); PROP.lantern(40,10,st); PROP.lantern(150,10,st);
    P(x-7,gy-34,15,15,PAL.cloth); P(x-7,gy-34,15,1,PAL.gold); P(x-7,gy-20,15,1,PAL.gold); for(const dx of [-4,2]){ P(x+dx,gy-32,3,11,PAL.gold); P(x+dx-1,gy-30,5,1,PAL.gold); P(x+dx-1,gy-26,5,1,PAL.gold); P(x+dx+1,gy-31,1,9,PAL.cloth); } },
  woodpile(x,gy){ for(let r=0;r<3;r++) for(let i=0;i<5-r;i++){ const px=x+i*4+r*2, py=gy-3-r*3; P(px,py,3,3,PAL.wood); P(px+1,py+1,1,1,PAL.woodL); } },
  vat(x,gy){ P(x-3,gy-8,7,8,'#6a4a3a'); P(x-4,gy-6,9,4,'#6a4a3a'); P(x-3,gy-9,7,1,'#8a6a4a'); P(x-3,gy-6,1,3,'#8a6a4a'); },
  furnace(x,gy,st){ P(x-8,gy-12,16,12,'#8a5a48'); for(let j=0;j<4;j++) P(x-8,gy-12+j*3,16,1,'#6a4236'); P(x-4,gy-7,8,7,'#2a1c18'); P(x-3,gy-5,6,5,'#ff8a3a'); P(x-2,gy-3,4,3,'#ffe08a'); glow(x,gy-3,12,'#ff8a3a',.55); P(x-3,gy-18,6,6,'#6a4236'); PROP.smoke(x,gy-19,st);
    P(x+14,gy-5,9,2,'#3a3a44'); P(x+16,gy-3,5,3,'#2f2f38'); P(x+13,gy-6,3,1,'#3a3a44'); },
  scarecrow(x,gy){ P(x,gy-16,1,16,PAL.woodD); P(x-6,gy-12,13,1,PAL.woodD); P(x-4,gy-12,9,5,'#a89a78'); P(x-2,gy-17,5,4,'#d9c9a0'); P(x-4,gy-18,9,1,PAL.thatch); P(x-2,gy-19,5,1,PAL.thatch); },
  signpost(x,gy){ P(x,gy-16,2,16,PAL.woodD); P(x-6,gy-15,10,4,PAL.wood); P(x-7,gy-14,1,2,PAL.wood); P(x,gy-9,9,3,PAL.wood); P(x+9,gy-8,1,1,PAL.wood); P(x-4,gy-14,6,1,PAL.woodD); },
  banner(x,gy,st,o){ const c=(o&&o.c)||PAL.cloth, h=34; P(x,gy-h,1,h,PAL.woodD); for(let j=0;j<20;j++){ const wv=RED?0:(((tk>>3)+ (j>>1))%4<2?1:0); P(x+1+wv,gy-h+2+j,7,1,j%19===0?dk(c,.25):c); } P(x+3,gy-h+6,3,10,lt(c,.4)); if(o&&o.torn){ P(x+5,gy-h+16,3,6,'#00000000'); } },
  spears(x,gy){ line(x,gy,x+5,gy-18,PAL.woodD); P(x+5,gy-20,1,3,'#cfd6d9'); line(x+12,gy,x+8,gy-14,PAL.woodD); P(x+8,gy-16,1,3,'#cfd6d9'); P(x+16,gy-4,6,4,'#6a5a4a'); P(x+17,gy-3,4,2,'#8a7a62'); },
  bed(x,gy,st){ P(x-14,gy-5,29,5,PAL.woodD); P(x-14,gy-6,29,1,PAL.wood); P(x-13,gy-9,6,3,'#e9e2c8'); P(x-6,gy-9,19,3,'#7a8fa8'); P(x-6,gy-9,19,1,'#9ab0c8'); },
  trap(x,gy){ P(x-4,gy-1,9,1,'#4a4a52'); for(let i=0;i<4;i++){ P(x-4+i*2,gy-3,1,2,'#6a6a74'); } P(x+5,gy-1,6,1,'#3a3a42'); },
  altar(x,gy,st){ P(x-10,gy-9,21,2,PAL.wood); P(x-9,gy-7,2,7,PAL.woodD); P(x+8,gy-7,2,7,PAL.woodD); P(x-2,gy-12,5,3,'#9a8a5a'); P(x,gy-16,1,4,'#c23b2b'); PROP.smoke(x,gy-17,st); P(x-8,gy-13,1,4,'#e9e2c8'); P(x+8,gy-13,1,4,'#e9e2c8'); P(x-8,gy-14,1,1,'#ffd98a'); P(x+8,gy-14,1,1,'#ffd98a'); glow(x-8,gy-14,5,'#ffc870',.5); glow(x+8,gy-14,5,'#ffc870',.5); },
  stable(x,gy,st){ P(x,gy-14,1,14,PAL.woodD); P(x+29,gy-14,1,14,PAL.woodD); P(x+14,gy-14,1,14,PAL.woodD); roofThatch(x-3,gy-19,36,5,st); P(x+1,gy-5,13,1,PAL.wood); P(x+15,gy-5,14,1,PAL.wood); disc(x+8,gy-2,4,'#d9b860'); disc(x+22,gy-2,5,'#c9a850'); P(x+18,gy-4,8,1,'#e6cf7a'); },
  tomb(x,gy,st){ const S=SEASON[st.season]; for(let j=0;j<26;j++){ const w=rnd(Math.sqrt(26*26-j*j)*1.5); P(x-w,gy-26+j,w*2,1,j<3?S.grass:mix(S.grass2,'#6a5f4a',.5)); }
    P(x-9,gy-17,19,17,PAL.stoneD); P(x-9,gy-18,19,2,PAL.stone); P(x-6,gy-13,13,13,'#17151c'); P(x-9,gy-17,2,17,PAL.stone); P(x+8,gy-17,2,17,PAL.stone); P(x-12,gy-3,5,3,'#7a6a52'); P(x+9,gy-2,6,2,'#7a6a52'); P(x-3,gy-21,7,2,PAL.stoneL); },
  pond(x,gy,st,o){ const w=(o&&o.w)||50; for(let j=0;j<8;j++){ const ww=rnd(w*Math.sqrt(1-Math.pow((j-3.5)/4.2,2))); P(x-ww/2,gy+j,ww,1,j<1?'#5f95a6':'#4f8798'); } for(let i=0;i<5;i++){ const rx=x-w/3+((anim()*.06+i*11)%(w*.66)); P(rx,gy+2+(i%3)*2,4,1,'#9fd0dc'); } if(o&&o.glow){ glow(x,gy+4,12,'#9fd8ff',.5); P(x-1,gy+3,2,2,'#e6faff'); } },
  puppies(x,gy){ for(let i=0;i<3;i++){ const px=x+i*7, b=RED?0:(((tk>>3)+i)%4===0?1:0); P(px,gy-3-b,5,3,i%2?'#c9a25a':'#e6d0a0'); P(px+4,gy-5-b,3,3,i%2?'#c9a25a':'#e6d0a0'); P(px+6,gy-4-b,1,1,'#2a2630'); P(px,gy-1,1,1,'#8a6a3a'); P(px+3,gy-1,1,1,'#8a6a3a'); } },
  aqueduct(x,gy,st){ for(let i=0;i<5;i++){ const px=x+i*22; P(px,gy-12+i,1,12-i,PAL.woodD); P(px+3,gy-12+i,1,12-i,PAL.woodD); } line(x-4,gy-13,x+96,gy-8,'#6fae62'); line(x-4,gy-12,x+96,gy-7,'#4c8650'); for(let i=0;i<6;i++){ const t=((anim()*.5+i*17)%100); P(x-4+t,gy-14+rnd(t*.05),3,1,'#cfeef4'); } P(x+96,gy-7,1,7,'#9fd0dc'); P(x+92,gy-1,9,2,PAL.water); },
  umbrella(x,gy){ P(x,gy-27,1,14,PAL.woodD); for(let j=0;j<4;j++) P(x-3-j*2,gy-30+j,7+j*4,1,j%2?'#e9d9b0':'#d9c28a'); P(x,gy-31,1,1,PAL.woodD); },
  cliffwall(x,gy,st){ const rc='#6f786f', rd='#565f57'; for(let j=0;j<GY;j++){ const w=20+rnd(Math.sin(j*.17)*4+j*.1); P(x,j,w,1,j%6<2?rd:rc); } for(let i=0;i<5;i++) P(x+2+i*4,10+i*13,3,1,'#6f8f5a'); },
  anvil(x,gy){ P(x-5,gy-5,11,2,'#3a3a44'); P(x-3,gy-3,7,3,'#2f2f38'); P(x-7,gy-6,3,1,'#3a3a44'); }
};
