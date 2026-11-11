/* ==== murim:gfx-icons — 장비·물건 아이콘 그림 ==== */
const TIERCOL=[['#aab3b8','#7a8388','#8a6a4a'],['#dfe9ee','#93a9b6','#3f6fae'],['#fff1c0','#d1ab5c','#b8321f'],['#d6fbff','#67cfe8','#8a4fe0']];
const ICON={
  sword(c){ P(7,1,1,1,c[0]); for(let y=2;y<9;y++){ P(6,y,1,1,c[0]); P(7,y,1,1,c[1]); } P(4,9,6,1,c[2]); P(6,10,2,2,'#3a3440'); P(6,12,2,1,c[2]); },
  saber(c){ for(let y=1;y<9;y++){ const x=y<3?8:y<6?7:6; P(x,y,2,1,c[0]); P(x+2,y,1,1,c[1]); } P(4,9,7,1,c[2]); P(6,10,2,3,'#5a4636'); },
  glove(c){ P(3,4,8,6,c[1]); P(3,4,8,1,c[0]); P(3,5,1,4,c[0]); for(let i=0;i<4;i++) P(4+i*2,3,1,1,c[0]); P(5,10,5,2,c[2]); P(10,6,2,3,c[1]); },
  dart(c){ for(let k=0;k<3;k++){ const x=2+k*4; P(x+1,1+k,1,5,c[0]); P(x,5+k,3,1,c[2]); P(x+1,6+k,1,3,'#3a3440'); } },
  armor(c){ P(2,2,3,3,c[1]); P(9,2,3,3,c[1]); P(3,3,8,9,c[0]); P(6,3,2,2,'#22202a'); P(3,11,8,1,c[2]); for(let y=5;y<11;y+=2) P(4,y,6,1,c[1]); },
  mirror(c){ disc(7,7,4,c[1]); disc(7,7,3,c[0]); P(5,5,2,1,'#ffffff'); P(7,1,1,2,c[2]); },
  jade(){ disc(7,6,4,'#3f9a7a'); disc(7,6,1,'#1c201c'); P(5,4,1,1,'#bff0d8'); P(7,10,1,3,'#b8321f'); P(6,12,3,1,'#b8321f'); },
  beads(){ for(let i=0;i<10;i++){ const a=i/10*6.283; P(6+Math.cos(a)*4.4,6+Math.sin(a)*4.4,2,2,i%3?'#7d5a3a':'#a8805a'); } },
  sachet(){ P(5,2,4,1,'#b8321f'); P(4,3,6,2,'#c0788a'); P(3,5,8,6,'#c0788a'); P(4,11,6,1,'#9a5a6a'); P(6,6,2,2,'#f4d070'); },
  talis(){ P(4,1,6,12,'#f0d878'); P(5,3,4,1,'#b8321f'); P(6,4,2,5,'#b8321f'); P(5,9,4,1,'#b8321f'); },
  pearl(){ disc(7,7,4,'#6a4fae'); disc(7,7,3,'#8f74d8'); P(5,5,2,2,'#e8dcff'); },
  fan(){ for(let i=0;i<7;i++){ const a=-2.75+i*.39; line(7,11,7+Math.cos(a)*7,11+Math.sin(a)*7,i%2?'#f6f6f0':'#cfd6d9'); } P(6,11,3,2,'#b8321f'); },
  jar(){ P(5,2,4,1,'#7d5a3a'); P(4,3,6,2,'#e9e2c8'); P(3,5,8,7,'#e9e2c8'); P(4,7,6,3,'#b8321f'); P(3,11,8,1,'#cbc0a2'); },
  pill(){ disc(7,7,4,'#c9a25a'); disc(6,6,2,'#f4d070'); P(5,5,1,1,'#ffffff'); },
  vial(){ P(6,1,2,2,'#7d5a3a'); P(5,3,4,2,'#9fd0c0'); P(4,5,6,7,'#4f9a7a'); P(5,6,1,3,'#bff0d8'); },
  ore(){ P(3,6,8,6,'#3a3a4a'); P(5,3,5,4,'#4a4a5e'); P(2,9,10,3,'#2c2c3a'); P(6,5,1,1,'#8fd0ff'); P(9,8,1,1,'#8fd0ff'); P(4,10,1,1,'#bfe8ff'); },
  scroll(c){ P(2,3,10,8,'#e9e2c8'); P(1,2,2,10,'#7d5a3a'); P(11,2,2,10,'#7d5a3a'); for(let y=5;y<10;y+=2) P(4,y,6,1,'#5a5a64'); P(6,3,2,8,c[2]); },
  coin(){ disc(7,7,5,'#c9a25a'); disc(7,7,4,'#e0b84c'); P(6,6,2,2,'#8a5f0e'); },
  dice(){ P(2,2,10,10,'#ece5cf'); P(2,2,10,1,'#ffffff'); P(2,11,10,1,'#b8b09a'); P(4,4,2,2,'#2a2630'); P(8,4,2,2,'#2a2630'); P(6,6,2,2,'#b8321f'); P(4,8,2,2,'#2a2630'); P(8,8,2,2,'#2a2630'); },
  empty(){ for(let i=2;i<12;i+=2){ P(i,2,1,1,'#8a8a8a'); P(i,11,1,1,'#8a8a8a'); P(2,i,1,1,'#8a8a8a'); P(11,i,1,1,'#8a8a8a'); } }
};
const _ic=new Map();
function iconUrl(kind,t){ t=t||0; const key=kind+t; let u=_ic.get(key); if(u) return u; const c=document.createElement('canvas'); c.width=14; c.height=14; const keep=cx; cx=c.getContext('2d');
  try{ (ICON[kind]||ICON.coin)(TIERCOL[t]); }finally{ cx=keep; } if(kind!=='empty') outline(c,'#22202a'); u=c.toDataURL(); _ic.set(key,u); return u; }
