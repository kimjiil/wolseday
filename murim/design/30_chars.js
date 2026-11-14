/* ==== murim:gfx-chars — 인물·동물 스프라이트 (절차적으로 그려 캐시한다) ==== */
const OX=28, OY=35, SW=60, SH=40;
const SPR=new Map();
function mkLook(o){ const L=Object.assign({sex:'m',size:'adult',hair:'top',hairC:'#231e24',skin:'#f0c9a0',robe:'#8f8a78'},o); if(!L.trim) L.trim=dk(L.robe,.35);
  L.key=Object.keys(L).filter(k=>k!=='key').sort().map(k=>k+':'+L[k]).join(','); return L; }
const lookH=L=>L.animal?({tiger:24,cub:14,crane:23,dog:14,crow:6,horse:30}[L.animal]||10):L.size==='kid'?19:L.hair==='hat'?28:(L.hair==='top'||L.hair==='crown'||L.hair==='cap')?27:24;
// 색을 조금 더 선명하게 (2등신 도트는 탁한 색이 잘 안 산다)
const _viv=new Map();
function vivid(c,k){ k=k==null?.5:k; const key=c+k; let v=_viv.get(key); if(v) return v; const a=hx(c), l=(Math.max(a[0],a[1],a[2])+Math.min(a[0],a[1],a[2]))/2;
  v='#'+a.map(x=>cl(rnd((l+(x-l)*(1+k))*1.04+6),0,255).toString(16).padStart(2,'0')).join(''); _viv.set(key,v); return v; }
function hairTones(hr){ const a=hx(hr), l=a[0]*.3+a[1]*.59+a[2]*.11, sat=Math.max(a[0],a[1],a[2])-Math.min(a[0],a[1],a[2]);
  if(l>150) return [hr,'#ffffff',mix(hr,'#7f86a8',.4)];
  if(l>80) return [hr,lt(hr,.5),mix(hr,'#3a3550',.4)];
  if(sat<16) return [mix(hr,'#565c9c',.52),mix(hr,'#a8b6f8',.74),mix(hr,'#34325a',.45)];
  const b=lt(vivid(hr,1.6),.12); return [b,mix(lt(b,.42),'#ffd9a8',.3),mix(dk(b,.34),'#4a2a4a',.22)]; }
/* 고해상도 덧그림: 눈, 광택. 좌표는 1칸=2픽셀, 0.5 단위. */
function hqEye(hp,x,y,eh,kind,n,closed,iris,sk,brow){ const ink='#2a2630', il=lt(iris,.45), W='#ffffff';
  if(closed===2){ const k=eh<4?-.5:0, a=n?[1,.5,0,.5,1]:[0,.5,1,.5,0]; a.forEach((o,i)=>hp(x+o,y+1+k+i*.5,1,.5,ink)); return; }
  if(closed){ const y0=y+eh-1.5; hp(x,y0+.5,2,.5,ink); hp(x-.5,y0,.5,.5,ink); hp(x+2,y0,.5,.5,ink); return; }
  if(kind==='f'){ hp(x-.5,y,3,.5,ink); hp(n?x+2.5:x-1,y-.5,.5,.5,ink); hp(x,y+.5,2,3,ink); hp(x,y+2,2,1.5,iris); hp(x+.5,y+1.5,1,1,ink); hp(x,y+1,1,1,W); hp(x+1.5,y+2.5,.5,.5,il); hp(x,y+3,.5,.5,sk); hp(x+1.5,y+3,.5,.5,sk); }
  else if(kind==='m'){ hp(x-.5+(n?.5:0),y-.5,2,.5,brow); hp(x,y+.5,2,3,ink); hp(x,y+2.5,2,1,iris); hp(x,y+1,1,1,W); hp(x+1.5,y+2.5,.5,.5,il); hp(x,y+3,.5,.5,sk); hp(x+1.5,y+3,.5,.5,sk); hp(x,y+.5,.5,.5,sk); hp(x+1.5,y+.5,.5,.5,sk); }
  else { hp(x,y,2,3,ink); hp(x,y+1.5,2,1.5,iris); hp(x+.5,y+1.5,1,.5,ink); hp(x,y+2.5,.5,.5,sk); hp(x+1.5,y+2.5,.5,.5,sk); hp(x,y+.5,1,1,W); hp(x+1.5,y+2,.5,.5,il); } }
function hqGloss(hp,hy0,kid,cL,bald,hood,sym){ if(hood){ hp(-2,hy0+1,3.5,.5,cL); return; } if(bald){ hp(-3,hy0+1,2.5,.5,cL); hp(-4.5,hy0+2,1,1,cL); return; }
  const c=sym?-.5:-1, y0=hy0+(kid?1:1.5), r=kid?3.5:4.5;
  for(let x=c-r;x<c+r;x+=.5){ const d=Math.abs(x+.25-c), yy=y0+(d>2?.5:0)+(d>3.5?.5:0), th=.5+((rnd(x*2)&1)?.5:0)+(d<1?.5:0); if(d>.5||!sym) hp(x,yy,.5,th,cL); }
  hp(c-2,y0-.5,1.5,.5,lt(cL,.45)); }
function hqMouth(hp,x,y,open,smile,sk){ const c=mix(sk,'#8a3a32',.65); if(open){ hp(x-.5,y,1.5,1,'#7a2a2e'); hp(x,y+.5,1,.5,'#e88a94'); } else { hp(x,y+.5,1,.5,c); if(smile){ hp(x-.5,y,.5,.5,c); hp(x+1,y,.5,.5,c); } } }
function hqBlush(hp,x,y,c){ hp(x,y,2,.5,c); hp(x+.5,y+.5,1,.5,c); }
// Scale2x: 계단 진 모서리를 다듬으며 2배로 키운다
function epxInto(s,w,h,d){ const W2=w*2;
  for(let y=0;y<h;y++){ const r=y*w, j0=y*2*W2; for(let x=0;x<w;x++){ const i=r+x, p=s[i], A=y>0?s[i-w]:p, D=y<h-1?s[i+w]:p, C=x>0?s[i-1]:p, B=x<w-1?s[i+1]:p, j=j0+x*2;
    if(A!==D&&C!==B){ d[j]=C===A?A:p; d[j+1]=A===B?B:p; d[j+W2]=C===D?C:p; d[j+W2+1]=D===B?B:p; } else { d[j]=p; d[j+1]=p; d[j+W2]=p; d[j+W2+1]=p; } } } }
function epx(src){ const w=src.width, h=src.height, a=src.getContext('2d').getImageData(0,0,w,h), o=new ImageData(w*2,h*2); epxInto(new Uint32Array(a.data.buffer),w,h,new Uint32Array(o.data.buffer)); return o; }
/* 머리: 몸의 절반을 차지하는 큰 머리, 큰 눈, 머리카락 광택. 오른쪽을 보는 반측면. */
const HEADROWS={a:[[-3,2],[-5,4],[-6,5],[-7,6],[-7,6],[-7,6],[-7,6],[-7,6],[-7,6],[-6,6],[-5,5],[-3,4]],k:[[-3,2],[-5,4],[-6,5],[-6,5],[-6,5],[-6,5],[-6,5],[-6,5],[-5,4],[-3,3]]};
function drawHead(L,up,hy0,closed,kid,mouth){
  const sk=L.skin, skD=mix(sk,'#c8785a',.32), ink='#2a2630', hs=L.hair, fem=L.sex==='f';
  const ht=hairTones(L.hairC), hr=ht[0], hrL=ht[1], hrD=ht[2];
  const rows=kid?HEADROWS.k:HEADROWS.a, HH=rows.length, hw=kid?6:7, R=(r,a,b,c)=>{ if(b>=a) up(a,hy0+r,b-a+1,1,c); };
  const bald=hs==='bald', hood=hs==='hood', cap=hood?'#2b2b36':bald?sk:hr, capL=hood?'#474759':bald?lt(sk,.4):hrL, capD=hood?'#1a1a22':bald?skD:hrD;
  const f0=kid?3:4, fx=-3, ex0=kid?-2:-1, ex1=kid?2:3, ey=f0+2, eh=kid?3:4, my=ey+eh, fr=kid?5:6;
  const full=fem||hs==='long'||hood||hs==='granny'||hs==='messy';
  // 머리 뒤로 늘어진 것들
  if(hs==='long'){ up(-hw-1,hy0+3,3,3,hr); up(-hw-2,hy0+5,4,HH-1,hr); up(-hw-2,hy0+HH+4,3,2,hr); up(-hw-1,hy0+HH+6,2,2,hr); up(-hw-1,hy0+HH+8,1,1,hrD); up(-hw-2,hy0+7,1,HH-3,hrD); up(-hw,hy0+6,1,HH-2,hrL); up(-hw+1,hy0+HH,1,5,hrD); }
  if(hs==='pony'){ up(-hw-1,hy0+1,3,3,hr); up(-hw-3,hy0+2,3,7,hr); up(-hw-3,hy0+9,2,3,hr); up(-hw-2,hy0+12,1,1,hrD); up(-hw-3,hy0+4,1,6,hrD); up(-hw-2,hy0+3,1,4,hrL); }
  if(hs==='bun'){ up(-hw-1,hy0,4,4,hr); up(-hw-2,hy0+1,1,2,hr); up(-hw,hy0,2,1,hrL); up(-hw-1,hy0+3,3,1,hrD); }
  if(hs==='granny'){ up(-hw-2,hy0+3,4,4,hr); up(-hw-1,hy0+3,2,1,hrL); up(-hw-2,hy0+6,3,1,hrD); }
  if(hs==='band'){ up(-hw-3,hy0+4,4,1,PAL.cloth); up(-hw-4,hy0+5,2,4,PAL.cloth); up(-hw-3,hy0+6,1,2,PAL.redD); up(-hw-2,hy0+5,1,3,PAL.redD); }
  if(fem&&hs!=='long'&&!kid){ up(-hw,hy0+HH-1,3,2,hr); up(-hw,hy0+HH,2,1,hrD); }
  // 머리통
  rows.forEach((r,i)=>{ const cut=full?0:Math.max(0,i-(HH-4)); R(i,r[0]+(cut>0?cut+(HH-1-i===0?0:0):0),r[1],cap); });
  // 광택과 음영
  const hp=(x,y,w,h,c)=>up.h(x,y,w,h,c);
  hqGloss(hp,hy0,kid,capL,bald,hood,0);
  if(!bald){ for(let i=4;i<HH-4+(full?2:0);i++) up(rows[i][0],hy0+i,1,1,capD); R(HH-5+(full?2:0),-hw+1,fx-1,capD); if(!hood){ hp(-hw+1.5,hy0+4.5,.5,HH-8.5,capD); hp(-hw+3,hy0+5,.5,HH-9.5,capD); hp(-hw+2,hy0+4,.5,HH-9,capL); } }
  // 얼굴
  for(let i=f0+1;i<HH;i++){ if(hood&&(i<ey-1||i>=my)) continue; R(i,Math.max(fx,rows[i][0]),Math.min(rows[i][1],i>=my-1?99:fr),sk); }
  if(bald){ R(f0,fx,fr,sk); }
  else if(!hood){ const m=kid?0:1; up(fx,hy0+f0+1,2,1,hr); up(m,hy0+f0+1,2,1,hr); up(fr-1,hy0+f0+1,2,1,hr); up(fx,hy0+f0+2,1,fem?eh+1:1,hr); if(fem) up(fr,hy0+f0+2,1,eh-1,hr); R(f0+1,fx+2,m-1,mix(sk,skD,.55)); R(f0+1,m+2,fr-2,mix(sk,skD,.55)); }
  if(bald&&!kid){ const d=mix(sk,'#a0563c',.5); up(0,hy0+2,1,1,d); up(2,hy0+2,1,1,d); up(1,hy0+1,1,1,d); }
  if(!bald&&!hood){ const m=kid?0:1; hp(fx+.5,hy0+f0+2,1,.5,hr); hp(m+.5,hy0+f0+2,1,.5,hr); hp(fr-.5,hy0+f0+2,1,.5,hr); hp(m+1,hy0+f0+.5,.5,1.5,hrD); hp(fx+1,hy0+f0+.5,.5,1.5,hrD); }
  // 눈, 볼, 입 (고해상도)
  { const iris=L.eye||(L.ol&&L.ol!=='#22202a'?'#e8452e':mix(vivid(L.robe,.9),'#2c2a44',.42)), kind=kid?'k':fem?'f':'m', brow=mix(hr,ink,.45);
    [ex0,ex1].forEach((x,n)=>hqEye(hp,x,hy0+ey,eh,kind,n,closed,iris,sk,brow));
    if(!hood){ const bl=mix(sk,'#f2606e',fem||kid||L.blush?.55:.22), mx=kid?1:2; hqBlush(hp,ex0-1.5,hy0+my-.5,bl); hqBlush(hp,ex1+1,hy0+my-.5,bl); hqMouth(hp,mx,hy0+my,mouth,fem||kid,sk); } }
  // 머리 장식
  if(hs==='top'){ up(-2,hy0-3,4,3,hr); up(-1,hy0-4,2,1,hr); up(-1,hy0-3,2,1,hrL); up(-2,hy0-1,4,1,L.trim); up(1,hy0-1,1,1,lt(L.trim,.3)); }
  if(hs==='pony'){ up(-hw+1,hy0+1,2,2,L.trim); up(-hw+1,hy0+1,1,1,lt(L.trim,.35)); }
  if(hs==='bun'){ up(-hw-3,hy0+1,3,1,PAL.gold); up(-hw-4,hy0+1,1,1,'#e0503a'); up(-hw+2,hy0+1,2,1,PAL.gold); up(-hw+3,hy0,1,1,'#f4d070'); }
  if(hs==='buns'){ up(-hw,hy0-2,4,4,hr); up(hw-5,hy0-2,4,4,hr); up(-hw+1,hy0-2,2,1,hrL); up(hw-4,hy0-2,2,1,hrL); up(-hw+1,hy0+2,3,1,PAL.cloth); up(hw-5,hy0+2,3,1,PAL.cloth); }
  if(hs==='tuft'){ up(-1,hy0-2,3,2,hr); up(0,hy0-3,2,1,hr); up(-1,hy0-2,1,1,hrL); up(-1,hy0,3,1,PAL.cloth); }
  if(hs==='band'){ R(3,rows[3][0],rows[3][1],PAL.cloth); R(3,0,3,lt(PAL.cloth,.3)); R(4,rows[4][0],fx-1,PAL.redD); }
  if(hs==='hat'){ up(-2,hy0-4,5,1,'#b89a5a'); up(-5,hy0-3,11,1,'#dcc488'); up(-8,hy0-2,17,1,'#dcc488'); up(-10,hy0-1,21,1,'#d2b878'); up(-11,hy0,23,1,'#b89a5a'); up(-10,hy0+1,21,1,'#8f7640'); up(-4,hy0-3,4,1,'#f0e0aa'); up(-7,hy0-2,3,1,'#f0e0aa'); }
  if(hs==='cap'){ up(-hw+1,hy0-1,2*hw-2,4,ink); up(-hw+3,hy0-4,2*hw-6,3,ink); up(-hw-3,hy0+1,4,1,ink); up(hw-2,hy0+1,4,1,ink); up(-hw+4,hy0-3,3,1,'#55506a'); up(-hw+2,hy0,2,1,'#55506a'); up(-hw+1,hy0+2,2*hw-2,1,'#3a3648'); }
  if(hs==='crown'){ up(-2,hy0-3,4,3,hr); up(-3,hy0-1,6,1,PAL.gold); up(-1,hy0-5,2,2,PAL.gold); up(-3,hy0-2,1,1,PAL.gold); up(2,hy0-2,1,1,PAL.gold); up(0,hy0-4,1,1,'#e0503a'); }
  if(hs==='granny'){ R(2,rows[2][0],rows[2][1],'#9a86b0'); R(3,rows[3][0],rows[3][1],'#9a86b0'); R(4,rows[4][0],fx-1,'#7a6a90'); R(2,-3,0,'#b8a6cc'); }
  if(hs==='messy'){ up(-hw-1,hy0+3,1,2,hr); up(-hw-1,hy0+7,1,2,hr); up(-5,hy0,1,1,hr); up(-2,hy0-1,2,1,hr); up(2,hy0-1,1,1,hr); up(4,hy0,1,1,hr); up(hw,hy0+3,1,2,hr); up(-hw,hy0+HH-2,2,2,hr); }
  const mx=kid?1:2;
  if(L.extra==='scar'){ up(ex1+2,hy0+ey,1,2,'#c0392b'); up(ex1+1,hy0+ey+eh,1,1,'#c0392b'); up(ex1+2,hy0+ey+eh-1,1,1,'#c0392b'); }
  if(L.extra==='mask'){ for(let i=my-1;i<HH;i++) R(i,Math.max(fx,rows[i][0]),rows[i][1],'#2b2b36'); R(my-1,fx+1,fx+3,'#474759'); }
  const bt=hairTones(L.beardC||L.hairC), bc=bt[0], bd=bt[2];
  if(L.beard==='short'&&!kid){ up(mx-2,hy0+my,5,1,bc); up(mx-1,hy0+my+1,3,1,bc); up(mx,hy0+my,1,1,mix(sk,'#8a3a32',.6)); }
  if(L.beard==='long'&&!kid){ up(mx-3,hy0+my,7,1,bc); up(mx-2,hy0+my+1,5,1,bc); up(mx-1,hy0+my+2,4,3,bc); up(mx,hy0+my+5,2,2,bc); up(mx-1,hy0+my+2,1,3,bd); up(mx+2,hy0+my+4,1,1,bd); up(mx,hy0+my,1,1,mix(sk,'#8a3a32',.6)); }
}
function drawHeld(L,pose,f,up,hand){
  const hx0=hand[0], hy=hand[1], dir=hand[2], w=L.weapon, steelD='#b3c0c7', wc=L.wc||'#eef3f5';
  if(dir==='item'){ const it=L.item;
    if(it==='letter'){ up(hx0,hy,4,3,'#f4efdc'); up(hx0+1,hy+1,2,1,'#8a8a8a'); }
    else if(it==='baby'){ up(hx0-1,hy-1,5,4,'#e8c0c8'); up(hx0+2,hy-2,3,3,'#f0c9a0'); }
    else if(it==='box'){ up(hx0,hy-1,5,4,PAL.wood); up(hx0,hy-1,5,1,PAL.woodL); }
    else if(it==='book'){ up(hx0,hy-1,4,4,'#3f6fae'); up(hx0+1,hy,2,1,'#e9e2c8'); }
    else if(it==='bowl'){ up(hx0,hy+1,4,2,'#e9e2c8'); }
    else if(it==='lamp'){ up(hx0+1,hy-2,1,2,PAL.woodD); up(hx0,hy,3,4,PAL.cloth); }
    else if(it==='tray'){ up(hx0-1,hy,7,1,PAL.woodD); up(hx0+1,hy-2,2,2,'#e9e2c8'); up(hx0+4,hy-3,1,3,'#8a6a8a'); }
    else if(it==='herb'){ up(hx0+1,hy-3,1,4,'#4f8f4e'); up(hx0,hy-4,3,2,'#e0402a'); }
    else if(it==='candy'){ up(hx0+1,hy-3,1,4,PAL.woodL); up(hx0,hy-5,3,2,'#e0a83c'); }
    else if(it==='gold'){ up(hx0,hy,4,2,PAL.gold); up(hx0+1,hy-1,2,1,'#f4d070'); }
    else if(it==='jade'){ up(hx0,hy-1,3,3,'#3f9a7a'); up(hx0+1,hy,1,1,'#b8321f'); }
    else if(it==='sword'){ for(let i=0;i<10;i++) up(hx0-3+i,hy+1,1,1,i<2?'#3a3440':i===2?PAL.gold:(i%3?wc:steelD)); }
    else if(it==='buckets'){ up(hx0-17,hy,24,1,PAL.woodD); up(hx0-16,hy+1,1,4,'#d9d2bc'); up(hx0+5,hy+1,1,4,'#d9d2bc'); up(hx0-18,hy+5,5,4,PAL.wood); up(hx0+3,hy+5,5,4,PAL.wood); up(hx0-18,hy+5,5,1,'#9fd0dc'); up(hx0+3,hy+5,5,1,'#9fd0dc'); up(hx0-18,hy+8,5,1,PAL.woodD); up(hx0+3,hy+8,5,1,PAL.woodD); }
    else if(it==='gourd'){ up(hx0,hy-2,3,2,'#c9a25a'); up(hx0-1,hy,5,3,'#c9a25a'); up(hx0+1,hy-3,1,1,PAL.cloth); }
    return; }
  if(dir==='tool'){ const t=L.tool||'hoe';
    if(t==='hoe'){ if(f){ for(let i=0;i<9;i++) up(hx0+1+rnd(i*.7),hy+i,1,1,PAL.woodD); up(hx0+6,hy+8,3,2,'#6a6a74'); } else { for(let i=0;i<11;i++) up(hx0+1+rnd(i*.15),hy+1-i,1,1,PAL.woodD); up(hx0,hy-11,4,2,'#7a7a86'); up(hx0,hy-9,1,1,'#7a7a86'); } }
    else if(t==='hammer'){ if(f){ for(let i=0;i<5;i++) up(hx0+1+i,hy+rnd(i*.6),1,1,PAL.woodD); up(hx0+5,hy+1,3,4,'#4a4a54'); } else { for(let i=0;i<6;i++) up(hx0,hy-i,1,1,PAL.woodD); up(hx0-1,hy-9,4,3,'#4a4a54'); } }
    else if(t==='broom'){ for(let i=0;i<12;i++) up(hx0+1+rnd(i*.3),hy-4+i,1,1,PAL.woodD); up(hx0+3+(f?1:0),hy+7,4,3,PAL.thatch); }
    else if(t==='axe'){ if(f){ for(let i=0;i<7;i++) up(hx0+1+i,hy+rnd(i*.8),1,1,PAL.woodD); up(hx0+6,hy+4,3,3,'#8a8a94'); } else { for(let i=0;i<10;i++) up(hx0+1+rnd(i*.15),hy+1-i,1,1,PAL.woodD); up(hx0+3,hy-10,3,4,'#9a9aa6'); up(hx0+5,hy-9,1,2,'#d0d4dc'); } }
    else if(t==='stick'){ if(f){ for(let i=0;i<8;i++) up(hx0+1+i,hy-rnd(i*.3),1,1,PAL.wood); } else { for(let i=0;i<8;i++) up(hx0+rnd(i*.5),hy-i,1,1,PAL.wood); } }
    else if(t==='brush'){ up(hx0+1,hy-3,1,5,PAL.woodD); up(hx0+1,hy+2,1,1,'#22202a'); }
    return; }
  if(!w||w==='glove'||w==='darts') return;
  const pix=(x,y,c)=>up(x,y,1,1,c);
  if(w==='staff'||w==='stick'){ const c=PAL.wood, n=w==='staff'?17:9;
    if(dir==='up') for(let i=-4;i<n-4;i++) pix(hx0+1,hy-i,c); else if(dir==='fwd') for(let i=-3;i<n-3;i++) pix(hx0+i,hy,c); else if(dir==='dn') for(let i=0;i<n-5;i++) pix(hx0+i,hy+rnd(i*.7),c); else for(let i=0;i<n-5;i++) pix(hx0-rnd(i*.5),hy-i,c); return; }
  const saber=w==='saber', len=saber?9:10;
  if(dir==='up'){ up.h(hx0,hy-len+1,.5,len-1.5,'#ffffff'); }
  if(dir==='fwd'){ up.h(hx0+1,hy,len-2.5,.5,'#ffffff'); }
  if(dir==='up'){ pix(hx0,hy+2,'#3a3440'); up(hx0-1,hy,3,1,PAL.gold); for(let i=1;i<=len;i++){ const sx=i>6?1:0; pix(hx0+sx,hy-i,i%3?wc:steelD); if(saber&&i>2) pix(hx0+1+sx,hy-i,steelD); } }
  else if(dir==='fwd'){ pix(hx0-2,hy,'#3a3440'); up(hx0-1,hy-1,1,3,PAL.gold); for(let i=0;i<len;i++){ pix(hx0+i,hy,i%3?wc:steelD); if(saber&&i>1&&i<len-1) pix(hx0+i,hy+1,steelD); } }
  else if(dir==='dn'){ up(hx0-1,hy-1,2,1,PAL.gold); for(let i=0;i<len;i++){ const yy=hy+rnd(i*.75); pix(hx0+i,yy,i%3?wc:steelD); if(saber&&i>1) pix(hx0+i,yy+1,steelD); } }
  else if(dir==='bk'){ up(hx0-1,hy,2,1,PAL.gold); for(let i=1;i<=len;i++){ const xx=hx0-rnd(i*.55); pix(xx,hy-i,i%3?wc:steelD); if(saber&&i>2) pix(xx-1,hy-i,steelD); } }
}
function drawBody(L,pose,f){
  const q=(x,y,w,h,c)=>P(OX+x,OY+y,w,h,c);
  const kid=L.size==='kid', bw=L.size==='big'?1:0, fem=L.sex==='f', gown=fem&&!kid;
  const robe=vivid(L.robe), robeD=dk(robe,.24), robeL=lt(robe,.2), trim=L.trim, skin=L.skin, skinD=dk(skin,.14), ink='#2a2630';
  const shoe=L.shoe||'#3b2f33', pants=L.pants||mix(robe,'#f1ead8',.6);
  const HH=kid?10:12, tw=kid?3:4, torsoH=kid?3:5, legsH=kid?3:4, al=kid?2:4;
  let sink=0, dx=0, dy=0, closed=0, stance=0, hdx=0, hdy=0;
  const sit=pose==='sit', kneel=pose==='kneel'||pose==='cry'||pose==='beg';
  if(pose==='idle'&&f===1) dy=1;
  if(pose==='walk'&&(f===1||f===3)) dy=1;
  if(pose==='guard'){ stance=1; dy=1; }
  if(pose==='atk'){ stance=2; dx=2; dy=1; hdx=1; }
  if(pose==='atk2'){ stance=1; dx=f?1:0; dy=f?1:0; hdx=f?1:-1; }
  if(pose==='cast'){ stance=1; dx=1; }
  if(pose==='hit'){ dx=-1; closed=2; stance=1; hdx=-1; }
  if(pose==='tool'){ dx=f?1:0; dy=f?2:1; stance=1; hdx=f?1:0; }
  if(pose==='bow'){ dx=1; dy=1; closed=1; hdx=2; hdy=2; }
  if(sit){ sink=legsH-1; closed=L.eyes!=='open'?1:0; }
  if(kneel){ sink=legsH-2; }
  if(pose==='cry'||pose==='sleep'||pose==='down'||pose==='lie'||pose==='dead') closed=1;
  if(L.eyes==='closed') closed=1;
  const yB=-(3+legsH)+sink, yT=yB-torsoH, hy0=yT-HH;
  const up=(x,y,w,h,c)=>q(x+dx,y+dy,w,h,c), hu=(x,y,w,h,c)=>hq(OX+x+dx,OY+y+dy,w,h,c), hq0=(x,y,w,h,c)=>hq(OX+x,OY+y,w,h,c);
  const xb=-tw-bw, xf=tw-1+bw, XB=xb-2, XF=xf+1;
  const wpn=L.weapon, armed=pose==='guard'||pose==='atk'||pose==='atk2';
  const vest=L.extra==='vest', sl=vest?skin:robe, slD=vest?skinD:robeD, slL=vest?lt(skin,.2):robeL;
  // 허리에 찬 칼집, 등에 진 봇짐, 짚은 지팡이
  const lying=pose==='down'||pose==='lie'||pose==='dead'||pose==='sleep';
  const slung=wpn&&!armed&&!lying&&pose!=='tool'&&pose!=='cheer'&&pose!=='hit'&&!sit&&!kneel&&(wpn==='sword'||wpn==='saber');
  if(wpn==='staff'&&!armed&&pose!=='carry'&&!sit&&!kneel){ for(let y=hy0+2;y<0;y++) q(XF+3,y,1,1,y%5?PAL.wood:PAL.woodD); q(XF+3,hy0+1,1,1,PAL.woodL); }
  if(L.extra==='pack'){ up(XB-3,yT-1,4,6,'#8a6a4a'); up(XB-3,yT-1,4,1,'#b08a5e'); up(XB-3,yT+4,4,1,'#6a4e36'); up(XB-2,yT+1,2,1,'#e9d9b0'); }
  // 다리와 옷자락
  if(sit){ const w=tw+3; q(-w,-3,2*w,3,robe); q(-w,-1,2*w,1,robeD); q(-w,-3,3,1,robeL); q(w-3,-3,2,1,robeL); q(-1,-2,2,1,robeD); q(-w+1,-3,1,1,robeL); q(w-1,-3,1,2,robeD); }
  else if(kneel){ q(xb,-4,xf-xb+1,4,robe); q(xb-4,-2,4,2,robeD); q(xb,-1,xf-xb+1,1,robeD); q(xb-6,-2,2,2,shoe); q(xf,-4,1,3,robeD); }
  else {
    let fa=1, fb=-3, la=0, lb=0;
    if(stance===1){ fa=2; fb=-5; } if(stance===2){ fa=4; fb=-7; }
    if(pose==='walk'){ if(f===1){ fa=3; fb=-5; la=1; } if(f===3){ fa=0; fb=-2; lb=1; } }
    const top=yB+1+dy, hem=gown?-2:-4, lx=Math.min(xb,fb+(gown?0:1))-(gown?1:0), rx=Math.max(xf,fa+(gown?2:1))+(gown?1:0);
    if(!gown){ q(fb+1,-4,2,2,pants); q(fa,-4,2,2,pants); q(fa+1,-4,1,2,dk(pants,.14)); }
    q(fb,-2-lb,3,2-lb,shoe); q(fa,-2-la,3,2-la,shoe); q(fb,-2-lb,1,1,lt(shoe,.25)); q(fa,-2-la,1,1,lt(shoe,.25));
    for(let y=top;y<=hem;y++){ const t=hem>top?(y-top)/(hem-top):1, a=rnd(xb+(lx-xb)*t), b=rnd(xf+(rx-xf)*t); q(a,y,b-a+1,1,robe); q(b,y,1,1,robeD); if(y===hem) q(a,y,b-a+1,1,robeD); }
    if(gown){ q(lx+1,hem-1,1,1,robeL); q(-1,hem-2,1,2,robeD); q(2,hem-1,1,1,robeD); hq0(xb+1,top+1,.5,hem-top-1,robeD); hq0(xf-1.5,top+.5,.5,hem-top-.5,robeD); hq0(lx,hem+.5,rx-lx+1,.5,dk(robeD,.2)); }
    else { if(stance>0) q(-1,hem-1,1,2,robeD); hq0(xb+1.5,top+.5,.5,hem-top,robeD); hq0(xf-1.5,top+.5,.5,hem-top,robeD); }
    if(!lb){ hq0(fb,-.5,3,.5,dk(shoe,.4)); hq0(fb+.5,-2,1.5,.5,lt(shoe,.3)); } if(!la){ hq0(fa,-.5,3,.5,dk(shoe,.4)); hq0(fa+.5,-2,1.5,.5,lt(shoe,.3)); }
  }
  // 뒤쪽 팔
  switch(pose){
    case 'atk': up(XB-2,yT+1,4,2,slD); up(XB-4,yT+1,2,2,skinD); break;
    case 'hit': up(XB-1,yT,3,2,slD); up(XB-2,yT-2,2,2,skinD); break;
    case 'cheer': up(XB,yT-1,2,2,slD); up(XB-1,yT-3,2,2,slD); up(XB-2,yT-5,2,2,skinD); break;
    case 'guard': case 'atk2': case 'tool': up(XB,yT+1,2,al-1,slD); up(XB+1,yT+al,2,1,skinD); break;
    case 'cast': case 'bow': break;
    default: { const sw=pose==='walk'?(f===1?-1:f===3?1:0):0; up(XB+sw,yT,2,al,slD); up(XB+sw,yT+al,2,1,skinD); if(!vest) hu(XB+sw,yT+al-.5,2,.5,dk(slD,.25)); }
  }
  // 몸통
  up(xb,yT,xf-xb+1,torsoH,robe); up(xf,yT,1,torsoH,robeD); up(xb,yT,2,1,robeL); up(xb,yT+1,1,1,robeL);
  up(0,yT,2,1,skin); up(-1,yT,1,1,trim); up(2,yT,1,1,trim); up(0,yT+1,2,1,trim); up(0,yT+2,1,1,trim); if(!kid) up(-1,yT+3,1,1,trim);
  if(L.extra==='patch'){ up(xb+1,yT+2,2,2,dk(robe,.4)); up(xf-1,yB+2,2,2,dk(robe,.4)); }
  up(xb,yB,xf-xb+1,1,trim); up(xf,yB,1,1,dk(trim,.25)); up(1,yB,1,1,L.sash||lt(trim,.35)); if(!sit&&!kneel) up(1,yB+1,1,2,L.sash||trim);
  hu(xb,yB-.5,xf-xb+1,.5,robeD); hu(xb,yB,xf-xb,.5,lt(trim,.3)); hu(xb+.5,yT+1.5,.5,torsoH-2.5,robeL); hu(1,yB+2.5,.5,.5,L.sash?'#f4d070':lt(trim,.4));
  if(L.extra==='apron'){ up(xb+1,yT+2,xf-xb-1,torsoH-2,'#efe8d2'); if(!sit&&!kneel) up(xb+1,yB+1,xf-xb-1,2,'#efe8d2'); up(xb+1,yB,xf-xb-1,1,'#cfc6aa'); }
  // 머리
  { const uh=(x,y,w,h,c)=>up(x+hdx,y+hdy,w,h,c); uh.h=(x,y,w,h,c)=>hu(x+hdx,y+hdy,w,h,c); drawHead(L,uh,hy0,closed,kid,pose==='cheer'||pose==='hit'||pose==='cry'?1:0); }
if(slung){ const sw=pose==='walk'?(f===1?-1:f===3?1:0):0, c1=wpn==='sword'?'#41405a':'#7a5236', c2=dk(c1,.3), x0=XB+sw, y0=yT+al-3;
    up(x0,y0-1,1,2,'#2e2a36'); up(x0-1,y0+1,3,1,PAL.gold); for(let i=0;i<(kid?5:8);i++){ const xx=x0-rnd(i*.45); up(xx,y0+2+i,1,1,c1); up(xx-1,y0+2+i,1,1,wpn==='saber'?c1:c2); if(wpn==='saber'&&i>1&&i<6) up(xx-2,y0+2+i,1,1,c2); } up(x0-rnd((kid?5:8)*.45),y0+2+(kid?5:8),1,1,PAL.gold); }
  // 앞쪽 팔
  let hand=null; const steel='#c3ced4';
  switch(pose){
    case 'guard': up(XF,yT+1,3,2,sl); up(XF+3,yT,2,3,skin); hand=[XF+4,yT,'up']; break;
    case 'atk': up(XF,yT+1,5,2,sl); up(XF,yT+1,2,1,slL); up(XF+5,yT+1,2,2,skin); hand=[XF+8,yT+1,'fwd']; break;
    case 'atk2': if(f){ up(XF,yT+1,4,2,sl); up(XF+4,yT+2,2,2,skin); hand=[XF+6,yT+3,'dn']; } else { up(XF,yT-1,2,3,sl); up(XF+1,yT-3,2,2,sl); up(XF+2,yT-5,2,2,skin); hand=[XF+3,yT-5,'bk']; } break;
    case 'cast': up(xf-1,yT+2,4,2,slD); up(xf+3,yT+2,2,2,skinD); up(XF,yT,4,2,sl); up(XF+4,yT-1,2,3,skin); if(wpn==='glove'){ up(xf+3,yT+2,2,2,dk(steel,.15)); up(XF+4,yT-1,2,3,steel); } break;
    case 'hit': up(XF,yT,3,2,sl); up(XF+3,yT-2,2,2,skin); break;
    case 'cry': up(XF,yT-1,2,3,sl); up(XF-2,yT-3,3,2,skin); up(xb+1,yT-2,1,1,'#8fd0f0'); up(xb+1,yT-1,1,1,'#bfe6fa'); up(XF+1,yT-4,1,1,'#8fd0f0'); break;
    case 'beg': up(XF,yT+1,3,2,sl); up(XF+3,yT+2,2,1,skin); up(XF+2,yT,5,2,'#8a7a62'); up(XF+2,yT,5,1,'#b0a084'); break;
    case 'carry': up(XF,yT+1,3,2,sl); up(XF+3,yT+1,2,2,skin); hand=[XF+4,yT,'item']; break;
    case 'cheer': up(XF,yT-1,2,2,sl); up(XF+1,yT-3,2,2,sl); up(XF+2,yT-5,2,2,skin); break;
    case 'point': up(XF,yT+1,4,2,sl); up(XF+4,yT+1,3,1,skin); break;
    case 'tool': up(XF,yT+1,3,2,sl); up(XF+3,yT+1,2,2,skin); hand=[XF+3,yT,'tool']; break;
    case 'drink': up(XF,yT-1,2,3,sl); up(XF-1,yT-2,2,1,skin); up(XF-1,yT-5,3,3,'#c9a25a'); up(XF,yT-6,1,1,PAL.cloth); up(XF-1,yT-5,1,1,'#e2c078'); break;
    case 'bow': up(xf-1,yT+2,4,2,slD); up(XF,yT+1,3,2,sl); up(XF+3,yT+1,2,3,skin); break;
    default: { const sw=pose==='walk'?(f===1?1:f===3?-1:0):0; up(XF+sw,yT,2,al,sl); up(XF+sw,yT,1,1,slL); up(XF+sw,yT+al,2,1,skin); if(!vest){ hu(XF+sw,yT+al-.5,2,.5,robeD); hu(XF+sw+1.5,yT+1,.5,al-1.5,robeD); } hu(XF+sw,yT+al+.5,2,.5,skinD); }
  }
  if(wpn==='glove'&&pose==='guard'){ up(XF+3,yT,2,3,steel); }
  if(hand){ up.h=hu; drawHeld(L,pose,f,up,hand); }
  if(L.extra==='umbrella'){ up(XF+2,hy0-5,1,yT-hy0+9,PAL.woodD); for(let j=0;j<4;j++) up(-3-j*3,hy0-9+j,8+j*6,1,j%2?'#efe0b4':'#d8bc78'); up(XF+2,hy0-10,1,1,PAL.woodD); up(-12,hy0-5,26,1,'#b89a5a'); }
}
/* ---- 맵에서 쓰는 앞모습(d)·뒷모습(u). 옆모습은 위의 그림을 그대로 쓴다. ---- */
const HEADSYM={a:[[-3,2],[-5,4],[-6,5],[-7,6],[-7,6],[-7,6],[-7,6],[-7,6],[-7,6],[-6,5],[-5,4],[-3,2]],k:[[-3,2],[-5,4],[-6,5],[-6,5],[-6,5],[-6,5],[-6,5],[-6,5],[-5,4],[-3,2]]};
function drawHeadTop(L,up,hy0,kid,back){
  const sk=L.skin, skD=mix(sk,'#c8785a',.32), ink='#2a2630', hs=L.hair, fem=L.sex==='f';
  const ht=hairTones(L.hairC), hr=ht[0], hrL=ht[1], hrD=ht[2];
  const rows=kid?HEADSYM.k:HEADSYM.a, HH=rows.length, hw=kid?6:7, R=(r,a,b,c)=>{ if(b>=a) up(a,hy0+r,b-a+1,1,c); };
  const bald=hs==='bald', hood=hs==='hood', cap=hood?'#2b2b36':bald?sk:hr, capL=hood?'#474759':bald?lt(sk,.4):hrL, capD=hood?'#1a1a22':bald?skD:hrD;
  const f0=kid?3:4, ey=f0+2, eh=kid?3:4, my=ey+eh, fl=kid?-4:-5, fr=kid?3:4, long=hs==='long'||(fem&&hs!=='bun'&&hs!=='buns'&&hs!=='granny'&&!bald&&!hood);
  // 뒤로 늘어진 머리 (앞에서는 양옆으로 보인다)
  if(!back){
    if(hs==='long'){ up(-hw-1,hy0+4,3,HH+3,hr); up(hw-2,hy0+4,3,HH+3,hr); up(-hw-1,hy0+HH+6,2,1,hrD); up(hw-1,hy0+HH+6,2,1,hrD); up(-hw-1,hy0+6,1,HH,hrD); up(hw,hy0+6,1,HH,hrD); }
    if(hs==='pony'){ up(hw-2,hy0+1,3,3,hr); up(hw,hy0+3,2,7,hr); up(hw,hy0+10,1,2,hrD); up(hw+1,hy0+4,1,5,hrD); }
    if(hs==='band'){ up(hw-1,hy0+4,3,1,PAL.cloth); up(hw+1,hy0+5,1,4,PAL.cloth); up(hw,hy0+5,1,2,PAL.redD); }
    if(hs==='bun'||hs==='granny'){ up(-2,hy0-2,4,3,hr); up(-1,hy0-2,2,1,hrL); }
  }
  rows.forEach((r,i)=>R(i,r[0],r[1],cap));
  const hp=(x,y,w,h,c)=>up.h(x,y,w,h,c);
  hqGloss(hp,hy0,kid,capL,bald,hood,1);
  if(back){
    if(!bald){ for(let i=4;i<HH-2;i++){ up(rows[i][0],hy0+i,1,1,capD); up(rows[i][1],hy0+i,1,1,capD); } R(HH-2,rows[HH-2][0],rows[HH-2][1],capD); R(HH-1,rows[HH-1][0],rows[HH-1][1],capD); if(!long&&!hood) R(HH-1,-1,0,sk); }
    else { R(HH-1,-2,1,skD); }
    if(!bald&&!hood){ hp(-3,hy0+4.5,.5,HH-7,capD); hp(2.5,hy0+4.5,.5,HH-7,capD); hp(-.5,hy0+5,.5,HH-8,capL); }
    if(hs==='long'||long){ up(-hw+1,hy0+HH-1,2*hw-2,6,hr); up(-hw+2,hy0+HH+5,2*hw-4,2,hr); up(-hw+1,hy0+HH,1,5,hrD); up(hw-2,hy0+HH,1,5,hrD); up(-2,hy0+HH,1,6,hrL); up(2,hy0+HH+1,1,5,hrD); }
    if(hs==='pony'){ up(-2,hy0+2,4,HH+2,hr); up(-1,hy0+HH+4,2,2,hr); up(-2,hy0+4,1,HH-1,hrD); up(0,hy0+4,1,HH-2,hrL); up(-2,hy0+1,4,2,L.trim); up(-2,hy0+1,2,1,lt(L.trim,.35)); }
    if(hs==='bun'||hs==='granny'){ up(-3,hy0+2,6,5,hr); up(-2,hy0+2,3,1,hrL); up(-3,hy0+6,6,1,hrD); if(hs==='bun'){ up(-5,hy0+3,10,1,PAL.gold); up(5,hy0+3,1,1,'#e0503a'); } }
    if(hs==='band'){ R(3,rows[3][0],rows[3][1],PAL.cloth); up(-1,hy0+4,2,2,PAL.cloth); up(-2,hy0+6,1,4,PAL.cloth); up(1,hy0+6,1,5,PAL.redD); }
  } else {
    if(!bald){ for(let i=4;i<HH-3;i++){ up(rows[i][0],hy0+i,1,1,capD); up(rows[i][1],hy0+i,1,1,capD); } }
    // 얼굴
    for(let i=f0+1;i<HH;i++){ if(hood&&(i<ey-1||i>=my)) continue; R(i,Math.max(fl,rows[i][0]+(i>=HH-2?0:0)),Math.min(fr,rows[i][1]),sk); }
    if(bald) R(f0,fl,fr,sk);
    else if(!hood){ up(fl,hy0+f0+1,2,1,hr); up(-1,hy0+f0+1,2,1,hr); up(fr-1,hy0+f0+1,2,1,hr); R(f0+1,fl+2,-2,mix(sk,skD,.55)); R(f0+1,1,fr-2,mix(sk,skD,.55));
      up(fl,hy0+f0+2,1,fem?eh+1:1,hr); up(fr,hy0+f0+2,1,fem?eh+1:1,hr); if(!fem){ R(HH-2,rows[HH-2][0],fl,sk); R(HH-2,fr,rows[HH-2][1],sk); } }
    if(bald&&!kid){ const d=mix(sk,'#a0563c',.5); up(-2,hy0+2,1,1,d); up(1,hy0+2,1,1,d); up(-1,hy0+1,2,1,d); }
    const iris=L.eye||(L.ol&&L.ol!=='#22202a'?'#e8452e':mix(vivid(L.robe,.9),'#2c2a44',.42)), irisL=lt(iris,.45), closed=L.eyes==='closed';
    if(!bald&&!hood){ hp(fl+.5,hy0+f0+2,1,.5,hr); hp(-.5,hy0+f0+2,1,.5,hr); hp(fr-.5,hy0+f0+2,1,.5,hr); hp(-1.5,hy0+f0+.5,.5,1.5,hrD); hp(1,hy0+f0+.5,.5,1.5,hrD); }
    { const kind=kid?'k':fem?'f':'m', brow=mix(hr,ink,.45); [-3,1].forEach((x,n)=>hqEye(hp,x,hy0+ey,eh,kind,n,closed?1:0,iris,sk,brow));
      if(!hood){ const bl=mix(sk,'#f2606e',fem||kid||L.blush?.55:.22); hqBlush(hp,fl,hy0+my-.5,bl); hqBlush(hp,fr-1,hy0+my-.5,bl); hqMouth(hp,-1,hy0+my,0,fem||kid,sk); } }
    if(L.extra==='scar'){ up(3,hy0+ey,1,3,'#c0392b'); up(2,hy0+ey+eh,1,1,'#c0392b'); }
    if(L.extra==='mask'){ for(let i=my-1;i<HH;i++) R(i,Math.max(fl,rows[i][0]),Math.min(fr,rows[i][1]),'#2b2b36'); }
    const bt=hairTones(L.beardC||L.hairC), bc=bt[0], bd=bt[2];
    if(L.beard==='short'&&!kid){ up(-3,hy0+my,6,1,bc); up(-2,hy0+my+1,4,1,bc); up(-1,hy0+my,2,1,mix(sk,'#8a3a32',.5)); }
    if(L.beard==='long'&&!kid){ up(-3,hy0+my,6,1,bc); up(-3,hy0+my+1,6,1,bc); up(-2,hy0+my+2,4,3,bc); up(-1,hy0+my+5,2,2,bc); up(-2,hy0+my+2,1,3,bd); up(-1,hy0+my,2,1,mix(sk,'#8a3a32',.5)); }
  }
  // 머리 장식 (앞뒤 공통)
  if(hs==='top'){ up(-2,hy0-3,4,3,hr); up(-1,hy0-4,2,1,hr); up(-1,hy0-3,2,1,hrL); up(-2,hy0-1,4,1,L.trim); }
  if(hs==='bun'&&!back){ up(-4,hy0-1,8,1,PAL.gold); up(4,hy0-1,1,1,'#e0503a'); }
  if(hs==='buns'){ up(-hw,hy0-2,4,4,hr); up(hw-4,hy0-2,4,4,hr); up(-hw+1,hy0-2,2,1,hrL); up(hw-3,hy0-2,2,1,hrL); up(-hw+1,hy0+2,3,1,PAL.cloth); up(hw-4,hy0+2,3,1,PAL.cloth); }
  if(hs==='tuft'){ up(-2,hy0-2,3,2,hr); up(-1,hy0-3,2,1,hr); up(-2,hy0-2,1,1,hrL); up(-2,hy0,3,1,PAL.cloth); }
  if(hs==='band'&&!back){ R(3,rows[3][0],rows[3][1],PAL.cloth); R(3,-1,2,lt(PAL.cloth,.3)); }
  if(hs==='hat'){ up(-3,hy0-4,5,1,'#b89a5a'); up(-6,hy0-3,11,1,'#dcc488'); up(-9,hy0-2,17,1,'#dcc488'); up(-11,hy0-1,21,1,'#d2b878'); up(-12,hy0,23,1,'#b89a5a'); up(-11,hy0+1,21,1,'#8f7640'); up(-5,hy0-3,4,1,'#f0e0aa'); }
  if(hs==='cap'){ up(-hw+1,hy0-1,2*hw-2,4,ink); up(-hw+3,hy0-4,2*hw-6,3,ink); up(-hw-3,hy0+1,4,1,ink); up(hw-2,hy0+1,4,1,ink); up(-hw+4,hy0-3,3,1,'#55506a'); }
  if(hs==='crown'){ up(-2,hy0-3,4,3,hr); up(-3,hy0-1,6,1,PAL.gold); up(-1,hy0-5,2,2,PAL.gold); up(0,hy0-4,1,1,'#e0503a'); }
  if(hs==='granny'){ R(2,rows[2][0],rows[2][1],'#9a86b0'); R(3,rows[3][0],rows[3][1],'#9a86b0'); R(2,-3,0,'#b8a6cc'); }
  if(hs==='messy'){ up(-hw-1,hy0+3,1,2,hr); up(hw,hy0+3,1,2,hr); up(-5,hy0,1,1,hr); up(-2,hy0-1,2,1,hr); up(2,hy0-1,1,1,hr); up(4,hy0,1,1,hr); }
}
function drawBodyTop(L,dir,pose,f){
  const q=(x,y,w,h,c)=>P(OX+x,OY+y,w,h,c), back=dir==='u';
  const kid=L.size==='kid', bw=L.size==='big'?1:0, gown=L.sex==='f'&&!kid;
  const robe=vivid(L.robe), robeD=dk(robe,.24), robeL=lt(robe,.2), trim=L.trim, skin=L.skin, skinD=dk(skin,.14);
  const shoe=L.shoe||'#3b2f33', pants=L.pants||mix(robe,'#f1ead8',.6);
  const HH=kid?10:12, tw=kid?3:4, torsoH=kid?3:5, legsH=kid?3:4, al=kid?2:4, walk=pose==='walk';
  const dy=(pose==='idle'&&f===1)||(walk&&(f===1||f===3))?1:0, la=walk&&f===1?1:0, lb=walk&&f===3?1:0;
  const yB=-(3+legsH), yT=yB-torsoH, hy0=yT-HH, xb=-tw-bw, xf=tw-1+bw;
  const up=(x,y,w,h,c)=>q(x,y+dy,w,h,c), vest=L.extra==='vest', sl=vest?skin:robe, slD=vest?skinD:robeD, wpn=L.weapon;
  const hu=(x,y,w,h,c)=>hq(OX+x,OY+y+dy,w,h,c), hq0=(x,y,w,h,c)=>hq(OX+x,OY+y,w,h,c); up.h=hu;
  if(back&&L.extra==='pack'){ /* 뒤에서 그림 */ }
  if(!back&&(wpn==='sword'||wpn==='saber')){ for(let i=0;i<6;i++) up(xb-1-rnd(i*.5),yB-1+i,1,1,wpn==='sword'?'#41405a':'#7a5236'); }
  if(wpn==='staff') for(let y=hy0+3;y<0;y++) q(back?xb-3:xf+3,y,1,1,y%5?PAL.wood:PAL.woodD);
  // 다리
  const hem=gown?-2:-4;
  if(!gown){ q(-3,-4,2,2,pants); q(1,-4,2,2,pants); }
  q(-3,-2-la,2,2-la,shoe); q(1,-2-lb,2,2-lb,shoe);
  for(let y=yB+1+dy;y<=hem;y++){ const t=hem>yB+1?(y-yB-1)/(hem-yB-1):1, e=gown?rnd(t):0; q(xb-e,y,xf-xb+1+2*e,1,y===hem?robeD:robe); q(xf+e,y,1,1,robeD); }
  hq0(xb+1.5,yB+1.5+dy,.5,hem-yB-1-dy,robeD); hq0(xf-1.5,yB+1.5+dy,.5,hem-yB-1-dy,robeD); if(!la){ hq0(-3,-.5,2,.5,dk(shoe,.4)); hq0(-3,-2,1.5,.5,lt(shoe,.3)); } if(!lb){ hq0(1,-.5,2,.5,dk(shoe,.4)); hq0(1,-2,1.5,.5,lt(shoe,.3)); }
  // 팔
  const sa=walk?(f===1?1:f===3?-1:0):0;
  up(xb-2,yT,2,al+sa,slD); up(xb-2,yT+al+sa,2,1,skinD); up(xf+1,yT,2,al-sa,sl); up(xf+1,yT+al-sa,2,1,skin);
  if(!vest){ hu(xb-2,yT+al+sa-.5,2,.5,dk(slD,.25)); hu(xf+1,yT+al-sa-.5,2,.5,robeD); }
  // 몸통
  up(xb,yT,xf-xb+1,torsoH,robe); up(xf,yT,1,torsoH,robeD); up(xb,yT,2,1,robeL);
  if(back){ up(-1,yT,2,1,trim); }
  else { up(-1,yT,2,1,skin); up(-2,yT,1,1,trim); up(1,yT,1,1,trim); up(-1,yT+1,2,1,trim); up(0,yT+2,1,1,trim); if(!kid) up(1,yT+3,1,1,trim); }
  if(L.extra==='patch') up(xb+1,yT+2,2,2,dk(robe,.4));
  up(xb,yB,xf-xb+1,1,trim); up(xf,yB,1,1,dk(trim,.25)); if(!back){ up(-1,yB,1,1,L.sash||lt(trim,.35)); up(-1,yB+1,1,2,L.sash||trim); }
  hu(xb,yB-.5,xf-xb+1,.5,robeD); hu(xb,yB,xf-xb,.5,lt(trim,.3));
  if(L.extra==='apron'&&!back){ up(xb+1,yT+2,xf-xb-1,torsoH-2,'#efe8d2'); up(xb+1,yB+1,xf-xb-1,2,'#efe8d2'); up(xb+1,yB,xf-xb-1,1,'#cfc6aa'); }
  if(back&&(wpn==='sword'||wpn==='saber')){ const c1=wpn==='sword'?'#41405a':'#7a5236'; for(let i=0;i<9;i++){ up(xf-i,yT-1+i,1,1,c1); up(xf-i-1,yT-1+i,1,1,dk(c1,.3)); } }
  if(back&&L.extra==='pack'){ up(-4,yT,8,6,'#8a6a4a'); up(-4,yT,8,1,'#b08a5e'); up(-4,yT+5,8,1,'#6a4e36'); up(-1,yT+2,2,1,'#e9d9b0'); }
  drawHeadTop(L,up,hy0,kid,back);
  if(back&&(wpn==='sword'||wpn==='saber')){ up(xf+1,yT-3,2,2,wpn==='sword'?'#4a4654':'#7a5a3e'); up(xf,yT-2,1,2,PAL.gold); }
}
function drawAnimal(L,pose,f){ const q=(x,y,w,h,c)=>P(OX+x,OY+y,w,h,c), a=L.animal, ink='#2a2630';
  if(a==='tiger'||a==='cub'){ const o='#f09a34', od=dk(o,.22), ol=lt(o,.22), wh='#fff4e0', pk='#e0808e', lie=pose==='sit'||pose==='down', s=pose==='walk'&&f%2?1:0, t=f?1:0;
    if(a==='tiger'){ const by=lie?4:0, hy=-23+by;
      q(-15,-15+by-t,2,7,o); q(-16,-18+by-t,2,4,o); q(-16,-19+by-t,2,2,ink); q(-15,-13+by-t,2,1,ink);
      if(!lie){ q(-11+s,-6,3,6,od); q(-11+s,-1,3,1,wh); q(2-s,-6,3,6,od); q(2-s,-1,3,1,wh); }
      q(-12,-14+by,19,9,o); q(-12,-14+by,19,1,ol); q(-10,-7+by,15,2,wh); [-9,-5,-1].forEach(x=>{ q(x,-14+by,1,4,ink); q(x+1,-12+by,1,3,ink); });
      if(!lie){ q(-7-s,-6,3,6,o); q(-7-s,-1,3,1,wh); q(5+s,-6,3,6,o); q(5+s,-1,3,1,wh); } else { q(-10,-2,5,2,o); q(3,-2,7,2,o); q(8,-1,2,1,wh); }
      q(3,hy+2,12,11,o); q(4,hy+1,10,1,o); q(3,hy,3,2,o); q(12,hy,3,2,o); q(4,hy+1,1,1,pk); q(13,hy+1,1,1,pk); q(4,hy+2,9,1,ol);
      q(8,hy+8,7,5,wh); q(3,hy+10,3,3,wh); q(12,hy+8,2,1,pk); q(12,hy+10,1,1,ink); q(11,hy+11,3,1,ink);
      q(7,hy+5,2,3,ink); q(7,hy+5,1,1,'#ffffff'); q(12,hy+5,2,3,ink); q(12,hy+5,1,1,'#ffffff');
      q(9,hy+2,2,2,ink); q(6,hy+3,1,1,ink); q(13,hy+3,1,1,ink); q(3,hy+6,2,1,ink); q(3,hy+8,2,1,ink);
      if(L.item==='herb'){ q(15,hy+10,3,2,'#e0402a'); q(16,hy+12,1,2,'#4f8f4e'); }
    } else { const by=lie?2:0, hy=-14+by;
      q(-8,-8+by-t,1,4,o); q(-9,-10+by-t,1,3,o); q(-9,-11+by-t,1,1,ink);
      if(!lie){ q(-6+s,-3,2,3,od); q(0-s,-3,2,3,od); }
      q(-7,-8+by,10,5,o); q(-6,-4+by,8,1,wh); q(-5,-8+by,1,2,ink); q(-2,-8+by,1,2,ink);
      if(!lie){ q(-4-s,-3,2,3,o); q(2+s,-3,2,3,o); q(-4-s,-1,2,1,wh); q(2+s,-1,2,1,wh); } else { q(-6,-1,3,1,o); q(2,-1,4,1,o); }
      q(1,hy+1,8,8,o); q(1,hy,2,2,o); q(7,hy,2,2,o); q(2,hy+1,5,1,ol); q(4,hy+6,5,3,wh); q(7,hy+6,1,1,pk);
      q(3,hy+3,2,2,ink); q(3,hy+3,1,1,'#ffffff'); q(7,hy+3,2,2,ink); q(7,hy+3,1,1,'#ffffff'); q(5,hy+1,1,2,ink); q(1,hy+5,1,1,ink);
      if(L.item==='herb'){ q(9,hy+6,3,2,'#e0402a'); q(10,hy+8,1,2,'#4f8f4e'); }
    }
    return; }
  if(a==='crane'){ const wh='#f6f6f0'; q(-5,-12,9,5,wh); q(-7,-11,3,3,ink); q(-8,-10,2,2,ink); q(-4,-13,6,1,wh); q(3,-18,2,7,wh); q(3,-21,3,3,wh); q(4,-22,2,1,'#d8452c'); q(6,-20,3,1,'#c9a25a'); q(4,-20,1,1,ink); q(-1,-7,1,7,'#4a4a52'); if(pose!=='walk'||f%2===0) q(1,-7,1,7,'#4a4a52'); else { q(1,-7,1,3,'#4a4a52'); q(2,-5,2,1,'#4a4a52'); } q(-2,0,3,1,'#4a4a52'); if(L.item==='herb'){ q(8,-21,3,2,'#b8321f'); q(9,-19,1,2,'#7a4a2a'); } return; }
  if(a==='dog'){ const c=vivid(L.robe||'#d9aa5a',.3), d=dk(c,.22), l=lt(c,.4), w=f?1:0, s=pose==='walk'&&f%2?1:0;
    q(-8,-9-w,2,3,c); q(-8,-10-w,1,1,l); q(-5+s,-3,2,3,d); q(1-s,-3,2,3,d);
    q(-6,-8,10,5,c); q(-5,-4,8,1,l); q(-6,-8,10,1,lt(c,.15));
    q(-3-s,-3,2,3,c); q(3+s,-3,2,3,c); q(-3-s,-1,2,1,l); q(3+s,-1,2,1,l);
    q(2,-13,8,8,c); q(2,-14,2,3,d); q(8,-14,2,2,d); q(6,-8,5,3,l); q(9,-8,2,1,ink); q(8,-6,1,1,'#e0808e');
    q(4,-11,2,2,ink); q(4,-11,1,1,'#ffffff'); q(8,-11,2,2,ink); q(8,-11,1,1,'#ffffff'); return; }
  if(a==='crow'){ q(-2,-4,5,3,ink); q(3,-5,2,2,ink); q(5,-4,1,1,'#c9a25a'); q(-4,-4,2,1,ink); q(-1,-1,1,1,ink); q(1,-1,1,1,ink); return; }
  if(a==='horse'){ const c=vivid(L.robe||'#7a5a3e',.3), d=dk(c,.25), l=lt(c,.18), mn='#3a2a26', s2=pose==='walk'&&f%2?1:0;
    q(-13,-16,2,8,mn); q(-14,-10,2,4,mn);
    [[-10,d,s2],[1,d,-s2]].forEach(g=>{ q(g[0]+g[2],-9,3,8,g[1]); q(g[0]+g[2],-2,3,2,ink); });
    q(-11,-17,18,9,c); q(-11,-10,18,2,d); q(-9,-17,12,1,l); q(-11,-17,1,3,d);
    [[-6,c,-s2],[5,c,s2]].forEach(g=>{ q(g[0]+g[2],-9,3,8,g[1]); q(g[0]+g[2],-2,3,2,ink); q(g[0]+g[2]+2,-8,1,6,d); });
    q(-5,-18,7,5,'#b8321f'); q(-5,-14,7,1,PAL.gold); q(-5,-18,7,1,'#d8523a');
    q(4,-22,6,8,c); q(4,-22,1,7,d); q(3,-27,3,10,mn); q(4,-28,2,1,mn);
    q(6,-27,9,7,c); q(11,-24,5,5,l); q(6,-21,6,1,d); q(6,-29,2,2,c); q(9,-29,2,2,c); q(7,-28,1,1,d);
    q(9,-25,2,3,ink); q(9,-25,1,1,'#ffffff'); q(14,-22,1,1,ink); q(12,-20,3,1,d); return; }
}
function outline(c,col){ const k=c.getContext('2d'), w=c.width, h=c.height, im=k.getImageData(0,0,w,h), d=im.data, mk=[];
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const i=(y*w+x)*4; if(d[i+3]) continue; if((x>0&&d[i-1])||(x<w-1&&d[i+7])||(y>0&&d[i-w*4+3])||(y<h-1&&d[i+w*4+3])) mk.push(i); }
  const v=hx(col); for(const i of mk){ d[i]=v[0]; d[i+1]=v[1]; d[i+2]=v[2]; d[i+3]=255; } k.putImageData(im,0,0); }
function charSprite(L,pose,f,dir){
  if(typeof DOLL!=='undefined'&&DOLL&&DOLL.on&&DOLL.ready&&!L.animal&&L.size!=='kid'){ const d=dollSprite(L,pose,f,dir); if(d) return d; }   // 그림 부품이 있으면 그것으로
  f=f|0; if(dir&&(L.animal||(dir!=='d'&&dir!=='u'))) dir=''; if(dir&&pose!=='walk') pose='idle';
  const key=L.key+'/'+pose+'/'+f+(dir?'/'+dir:''); let c=SPR.get(key); if(c) return c;
  const W2=SW*2, H2=SH*2; c=document.createElement('canvas'); c.width=W2; c.height=H2; const k=c.getContext('2d'); k.imageSmoothingEnabled=false;
  if(L.animal){ const c1=document.createElement('canvas'); c1.width=SW; c1.height=SH; const keep=cx; cx=c1.getContext('2d'); try{ drawAnimal(L,pose,f); } finally{ cx=keep; } k.putImageData(epx(c1),0,0); outline(c,L.ol||'#22202a'); }
  else { const r=chibiImage(L,pose,f,dir); if(r.lying){ const t=document.createElement('canvas'); t.width=W2; t.height=H2; t.getContext('2d').putImageData(r.im,0,0); k.translate((OX+12)*2,(OY-8)*2); k.rotate(-Math.PI/2); k.translate(-OX*2,-OY*2); k.drawImage(t,0,0); k.setTransform(1,0,0,1,0,0); } else k.putImageData(r.im,0,0); }
  if(SPR.size>1600) SPR.clear();
  SPR.set(key,c); return c;
}
function whiteSprite(s){ let w=s._w; if(w) return w; w=document.createElement('canvas'); w.width=s.width; w.height=s.height; const k=w.getContext('2d'); k.drawImage(s,0,0); k.globalCompositeOperation='source-in'; k.fillStyle='#ffffff'; k.fillRect(0,0,w.width,w.height); return s._w=w; }
const _pt=new Map();
function portrait(L){ let u=_pt.get(L.key); if(u) return u; const s=charSprite(L,'idle',0), c=document.createElement('canvas'); c.width=56; c.height=56; const k=c.getContext('2d'); k.imageSmoothingEnabled=false;
  if(L.animal) k.drawImage(s,(OX-12)*2,(OY-24)*2,56,56,0,0,56,56); else if(typeof DOLL!=='undefined'&&DOLL&&DOLL.on&&DOLL.ready&&L.size!=='kid') k.drawImage(s,OX*2-17,OY*2-53,34,34,0,0,56,56); else { const top=L.size==='kid'?OY*2-41:OY*2-47; k.drawImage(s,OX*2-15,top,30,30,0,0,56,56); }
  u=c.toDataURL(); _pt.set(L.key,u); return u; }

const SKIN=['#f6cfa6','#f0c298','#fbdcba','#e6b086'];
const HAIRC=['#231e24','#3b2a24','#1e2233','#4a3226','#2a2030'];
const FAMROBE={tenant:'#9a917a',farmer:'#8f9a7a',beggar:'#7b7466',artisan:'#6f6a5e',merchant:'#4f6f8f',hunter:'#7a6040',inn:'#8a6f5a',bandit:'#5e4a3a',escort:'#3f5a6f',doctor:'#7f9a8a',official:'#5a3f6f',clan:'#2f4a7a',tangc:'#3d5a3a',blood:'#8f9a7a'};
const WVIS={검:'sword',도:'saber',권:'glove',장:'glove',암기:'darts'};
function seedOf(s){ let h=7; s=String(s||''); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }
const LK=(base)=>(o)=>mkLook(Object.assign({},base,o||{}));
const LOOK={
  master:LK({hair:'long',hairC:'#e6e4dc',beard:'long',robe:'#e3ded0',trim:'#6a7a8a',weapon:'sword'}),
  elder:LK({hair:'top',hairC:'#bdb9b0',beard:'long',robe:'#7a6a58',weapon:'staff'}),
  oldbeggar:LK({hair:'messy',hairC:'#cfcac0',beard:'short',robe:'#7b7466',extra:'patch',weapon:'staff'}),
  granny:LK({sex:'f',hair:'granny',hairC:'#cfcac0',robe:'#7a6a7a',extra:'apron'}),
  bandit:LK({hair:'band',robe:'#6b5430',extra:'vest',weapon:'saber'}),
  chief:LK({size:'big',hair:'band',beard:'short',robe:'#5a3a2a',extra:'vest',weapon:'saber'}),
  swordsman:LK({hair:'hat',robe:'#5f6f80',weapon:'sword'}),
  whitesword:LK({hair:'long',hairC:'#e6e4dc',robe:'#d8d8d0',trim:'#5a5a64',weapon:'sword'}),
  blackclad:LK({hair:'hood',robe:'#2a2a33',trim:'#15151c',weapon:'saber'}),
  cultist:LK({hair:'long',robe:'#7a1e1e',trim:'#1c1418',weapon:'saber'}),
  monk:LK({hair:'bald',robe:'#c98a2e',trim:'#8a5a1e',weapon:'staff'}),
  official:LK({hair:'cap',robe:'#5a3f6f',beard:'short'}),
  merchant:LK({hair:'cap',robe:'#4f6f8f',size:'big'}),
  doctor:LK({hair:'cap',robe:'#7f9a8a',beard:'short',beardC:'#8a8a8a'}),
  matchmaker:LK({sex:'f',hair:'bun',robe:'#b8324a',trim:'#e0a83c'}),
  soldier:LK({hair:'cap',robe:'#6a3a3a',trim:'#3a3a44',weapon:'staff',body:'armor'}),
  villager:LK({hair:'top',robe:'#9a917a'}),
  woman:LK({sex:'f',hair:'bun',robe:'#9a7a8a'}),
  child:LK({size:'kid',hair:'tuft',robe:'#a88a5a'}),
  girl:LK({size:'kid',sex:'f',hair:'buns',robe:'#c0788a'}),
  youth:LK({hair:'pony',robe:'#e6e2d6',trim:'#4f7590',weapon:'sword'}),
  smith:LK({hair:'band',robe:'#6f6a5e',extra:'apron',beard:'short',size:'big'}),
  peddler:LK({hair:'hat',robe:'#8a6f5a',extra:'pack'}),
  shadow:LK({hair:'long',hairC:'#15131a',skin:'#4a4452',robe:'#1c1a24',trim:'#b8321f',weapon:'sword',ol:'#7a1e1e'}),
  cub:LK({animal:'cub'}), tiger:LK({animal:'tiger'}), crane:LK({animal:'crane'}), dog:LK({animal:'dog',robe:'#c9a25a'}), crow:LK({animal:'crow'}), horse:LK({animal:'horse',robe:'#7a5a3e'})
};
function npcLook(p){ p=p||{}; const s=seedOf(p.name||p.role||'x'), sex=p.sex||(s%2?'m':'f'), age=p.age==null?28:p.age, old=age>=58, kid=age<13;
  const base=p.robe||(p.sect&&SECTS[p.sect]?SECTS[p.sect].robe:['#8f8a78','#7a8a9a','#9a7a6a','#6f8a72','#8a7a9a'][s%5]);
  const hair=p.hair||(kid?(sex==='f'?'buns':'tuft'):sex==='f'?(s%3?'bun':'long'):(['top','pony','top','pony'][s%4]));
  return mkLook({sex,size:kid?'kid':(p.size||'adult'),hair,hairC:old?'#e2dfd6':age>=46?'#6e686c':HAIRC[s%5],skin:SKIN[s%4],robe:p.tint?mix(base,p.tint,.3):base,weapon:p.weapon||null,beard:old&&sex==='m'?'long':(p.beard||(sex==='m'&&age>=38&&!p.hair?'short':null)),blush:p.blush?1:0,extra:p.extra||null,item:p.item||null}); }
