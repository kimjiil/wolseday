/* ==== murim:gfx-chib — 사람을 28×48 칸에서 바로 그린다: 둥근 큰 머리, 작은 몸, 색 있는 외곽선 ==== */
const CW=SW*2, CH=SH*2, COX=OX*2, COY=OY*2;
const CB={m:new Uint8Array(CW*CH),t:new Int8Array(CW*CH),p:new Uint8Array(CW*CH),c:new Uint32Array(CW*CH)};
let cPart=1;
const M_SKIN=1,M_HAIR=2,M_ROBE=3,M_TRIM=4,M_INNER=5,M_SHOE=6,M_PANTS=7,M_STRAW=9,M_BLACK=10,M_CLOTH=11,M_GOLD=12,M_SASH=13,M_BEARD=14,M_WOOD=15,M_PACK=16,M_KER=17,M_SHEATH=18,M_APRON=19;
const u32=c=>{ const v=hx(c); return (255<<24|v[2]<<16|v[1]<<8|v[0])>>>0; };
function ramp(c,o){ o=o||{}; const sh=o.sh||mix(dk(c,.3),'#4a3a7a',.18), l=mix(lt(c,.22),'#fff4d8',.15), h=mix(lt(c,.5),'#ffffff',.35); return [u32(sh),u32(c),u32(l),u32(h),u32('#231c2e')]; }
function cclear(){ CB.m.fill(0); CB.t.fill(0); CB.p.fill(0); CB.c.fill(0); cPart=1; }
function cset(x,y,mat,tone){ x+=COX; y+=COY; if(x<0||y<0||x>=CW||y>=CH) return; const i=y*CW+x; CB.m[i]=mat; CB.t[i]=tone||0; CB.p[i]=cPart; CB.c[i]=0; }
function cfix(x,y,col,force){ x=rnd(x)+COX; y=rnd(y)+COY; if(x<0||y<0||x>=CW||y>=CH) return; const i=y*CW+x; if(!CB.m[i]){ if(!force) return; CB.m[i]=M_INNER; CB.p[i]=cPart; } CB.c[i]=col; }
const cmat=(x,y)=>{ x+=COX; y+=COY; return x<0||y<0||x>=CW||y>=CH?0:CB.m[y*CW+x]; };
function ctone(x,y,mat,tone){ x+=COX; y+=COY; if(x<0||y<0||x>=CW||y>=CH) return; const i=y*CW+x; if(CB.m[i]===mat&&!CB.c[i]) CB.t[i]=tone; }
function cRect(x,y,w,h,mat,tone){ x=rnd(x); y=rnd(y); for(let j=0;j<h;j++) for(let i=0;i<w;i++) cset(x+i,y+j,mat,tone); }
function cEll(ex,ey,rx,ry,mat,tone,clip){ for(let y=Math.ceil(ey-ry);y<=Math.floor(ey+ry);y++){ const d=(y-ey)/ry, hw=rx*Math.sqrt(Math.max(0,1-d*d)); for(let x=Math.round(ex-hw);x<=Math.round(ex+hw);x++){ if(clip&&!clip(x,y)) continue; cset(x,y,mat,tone); } } }
function cPoly(pts,mat,tone){ let y0=1e9,y1=-1e9; for(const p of pts){ y0=Math.min(y0,p[1]); y1=Math.max(y1,p[1]); }
  for(let y=Math.ceil(y0);y<=Math.floor(y1);y++){ const xs=[]; for(let i=0;i<pts.length;i++){ const a=pts[i], b=pts[(i+1)%pts.length]; if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y)) xs.push(a[0]+(y-a[1])/(b[1]-a[1])*(b[0]-a[0])); } xs.sort((p,q)=>p-q); for(let k=0;k+1<xs.length;k+=2) for(let x=Math.round(xs[k]);x<=Math.round(xs[k+1]);x++) cset(x,y,mat,tone); } }
function cLine(x0,y0,x1,y1,w0,w1,mat,tone){ const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)*1.6)); for(let i=0;i<=n;i++){ const t=i/n, x=x0+(x1-x0)*t, y=y0+(y1-y0)*t, r=(w0+(w1-w0)*t)/2; if(r<=.7){ cset(Math.round(x),Math.round(y),mat,tone); continue; } for(let j=Math.ceil(y-r);j<=Math.floor(y+r);j++){ const hw=Math.sqrt(Math.max(0,r*r-(j-y)*(j-y))); for(let k=Math.round(x-hw);k<=Math.round(x+hw);k++) cset(k,j,mat,tone); } } }
const EYD=u32('#221c2c');
// 크루세이더 퀘스트풍: 눈은 세로 막대 둘
function cEye(x,y,kind,n,closed){ const px=(i,j)=>cfix(x+i,y+j,EYD);
  if(closed===2){ const a=n?[2,1,0,1,2]:[0,1,2,1,0]; a.forEach((o,j)=>{ px(o,j); px(o+(n?-1:1),j); }); return; }
  if(closed){ for(let i=-1;i<3;i++) px(i,3); px(-1,2); px(2,2); return; }
  const h=kind==='k'?4:5; for(let j=0;j<h;j++){ px(0,j); px(1,j); } }
function cSup(ex,ey,rx,ry,mat,tone,clip){ const n=2.7; for(let y=Math.ceil(ey-ry);y<=Math.floor(ey+ry);y++){ const d=Math.abs(y-ey)/ry, hw=rx*Math.pow(Math.max(0,1-Math.pow(d,n)),1/n); for(let x=Math.round(ex-hw);x<=Math.round(ex+hw);x++){ if(clip&&!clip(x,y)) continue; cset(x,y,mat,tone); } } }
/* 그린 뒤: 가장자리 그늘, 부위 사이 그늘, 색 있는 외곽선 */
function cFinish(R,layer){ const m=CB.m, t=CB.t, p=CB.p, im=new ImageData(CW,CH), d=new Uint32Array(im.data.buffer), SH={1:1,2:1,3:1,7:1,9:1,10:1,11:1,13:1,14:1,16:1,17:1,19:1,6:1};
  for(let y=0;y<CH-1;y++) for(let x=1;x<CW-1;x++){ const i=y*CW+x, M=m[i]; if(!M||CB.c[i]||!SH[M]||t[i]!==0) continue;
    const r=m[i+1], b=m[i+CW], br=m[i+CW+1];
    if(!b||!r||(!br&&M!==M_SKIN)){ t[i]=-1; continue; }
    if(M===M_SKIN&&m[i-CW]===M_HAIR&&p[i-CW]!==p[i]){ t[i]=-1; continue; }
    const q=p[i]; if((p[i+1]>q&&m[i+1]===M)||(p[i-1]>q&&m[i-1]===M)||(p[i+CW]>q&&m[i+CW]===M)||(y>0&&p[i-CW]>q&&m[i-CW]===M)) t[i]=-1; }
  for(let i=0;i<CW*CH;i++){ const M=m[i]; if(M) d[i]=CB.c[i]||R[M][cl(t[i]+1,0,3)]; }
  if(layer){ const s=new Uint32Array(layer.data.buffer); for(let i=0;i<CW*CH;i++) if(s[i]>>>24) d[i]=s[i]; }
  const ink=u32('#2a2434'), out=[]; for(let y=0;y<CH;y++) for(let x=0;x<CW;x++){ const i=y*CW+x; if(d[i]>>>24) continue; let k=-1; if(y<CH-1&&d[i+CW]>>>24) k=i+CW; else if(x<CW-1&&d[i+1]>>>24) k=i+1; else if(x>0&&d[i-1]>>>24) k=i-1; else if(y>0&&d[i-CW]>>>24) k=i-CW; if(k>=0) out.push(i,m[k]&&R[m[k]]?R[m[k]][4]:ink); }
  for(let j=0;j<out.length;j+=2) d[out[j]]=out[j+1];
  return im; }
function drawChibi(L,pose,f,dir){ cclear();
  const kid=L.size==='kid', big=L.size==='big', fem=L.sex==='f', gown=fem&&!kid, back=dir==='u', front=dir==='d', side=!back&&!front, hs=L.hair, bald=hs==='bald', hood=hs==='hood', vest=L.extra==='vest';
  const hrx=kid?12:14, hry=kid?11:13, sh=kid?-17:-21, wa0=kid?-10:-12, hem0=gown?-3:kid?-6:-7, tw=(kid?4.5:fem?5:5.5)+(big?1.5:0), sk0=(gown?8:kid?6:7)+(big?1.5:0), al=kid?6:8;
  let lean=0, sink=0, hdx=0, hdy=0, bob=0, closed=L.eyes==='closed'?1:0, mouth=0, fa=side?2.5:3, fb=side?-2.5:-3, la=0, lb=0, legs='stand', fover=0;
  let hf=[tw+1.5,al+2], hb=[-tw-1.5,al+2];      // 손 위치: 어깨 높이에서 잰 값
  const w=pose==='walk';
  if(!side){ if(pose==='idle'&&f===1) bob=1; if(w){ if(f===1){ la=2; bob=1; hf[1]-=1.5; hb[1]+=1; } if(f===3){ lb=2; bob=1; hb[1]-=1.5; hf[1]+=1; } } }
  else switch(pose){
    case 'idle': if(f===1) bob=1; break;
    case 'walk': if(f===1){ fa=5.5; fb=-5; la=1; bob=1; hf=[tw+.5,al]; hb=[-tw-5,al-1]; } else if(f===3){ fa=0; fb=1; lb=2; bob=1; hf=[tw+5,al-1]; hb=[-tw,al]; } break;
    case 'guard': fa=5; fb=-6; sink=1; hf=[tw+6,3]; hb=[-tw-1,al-1]; break;
    case 'atk': lean=2; fa=8; fb=-9; sink=2; hf=[tw+9,3]; hb=[-tw-7,4]; hdx=1; break;
    case 'atk2': if(f){ lean=1; fa=6; fb=-6; sink=1; hf=[tw+8,8]; hb=[-tw-4,5]; hdx=1; } else { fa=4; fb=-5; hf=[tw+5,-8]; hb=[-tw-1,al-1]; hdx=-1; } break;
    case 'cast': fa=5; fb=-6; lean=1; hf=[tw+8,2]; hb=[tw+5,7]; fover=1; break;
    case 'hit': lean=-2; hdx=-2; fa=3; fb=-6; hf=[tw+5,-2]; hb=[-tw-6,-1]; closed=2; mouth=1; break;
    case 'tool': fa=4; fb=-5; hb=[-tw-1,al-1]; if(f){ hf=[tw+6,8]; lean=2; sink=2; hdx=2; hdy=1; } else { hf=[tw+5,1]; lean=1; sink=1; } break;
    case 'bow': lean=2; hdx=4; hdy=4; hf=[tw+5,6]; hb=[tw+3,8]; fover=1; closed=1; break;
    case 'sit': legs='sit'; sink=-5-wa0; hf=[tw+3,al-1]; hb=[-tw-3,al-1]; if(L.eyes!=='open') closed=1; break;
    case 'kneel': legs='kneel'; sink=kid?3:4; hf=[tw+1,al]; hb=[-tw-1,al]; break;
    case 'cry': legs='kneel'; sink=kid?3:4; hf=[tw+1,-7]; hb=[2,-6]; fover=1; closed=1; mouth=1; break;
    case 'beg': legs='kneel'; sink=kid?3:4; hf=[tw+7,5]; break;
    case 'carry': hf=[tw+6,6]; break;
    case 'cheer': hf=[tw+5,-9]; hb=[-tw-5,-9]; mouth=1; break;
    case 'point': hf=[tw+10,3]; break;
    case 'drink': hf=[tw+3,-4]; break;
    default: closed=1;
  }
  if(pose==='sleep'||pose==='down'||pose==='lie'||pose==='dead') closed=1;
  const S=sh+sink+bob, W=wa0+sink+bob, hem=legs==='stand'?hem0:-2, hx=rnd(lean+hdx), hy=sh-hry+1+sink+bob+hdy, mid=(fa+fb)/2, sk=Math.max(sk0,(fa-fb)/2+3);
  const robe=vivid(L.robe,.75), skin=mix(L.skin,'#ffd2a8',.5), ht=hairTones(L.hairC), hair=ht[0];
  const R=[]; R[M_SKIN]=ramp(skin,{sh:mix(skin,'#e88a7a',.42),ol:mix(dk(skin,.55),'#5a2a3a',.4)}); R[M_HAIR]=ramp(hair,{sh:ht[2]}); R[M_HAIR][2]=u32(ht[1]); R[M_HAIR][3]=u32(lt(ht[1],.45));
  R[M_ROBE]=ramp(robe); R[M_TRIM]=ramp(L.trim); R[M_INNER]=ramp('#fff8ea'); R[M_SHOE]=ramp(L.shoe||'#4a3840'); R[M_PANTS]=ramp(L.pants||mix(robe,'#fff4e0',.62)); R[M_STRAW]=ramp('#e2c884'); R[M_BLACK]=ramp('#3a3848'); R[M_CLOTH]=ramp('#e0483a'); R[M_GOLD]=ramp('#f0c048'); R[M_SASH]=ramp(L.sash||lt(L.trim,.2)); R[M_BEARD]=ramp(hairTones(L.beardC||L.hairC)[0]); R[M_WOOD]=ramp('#9a6a40'); R[M_PACK]=ramp('#a87a50'); R[M_KER]=ramp('#a890c8'); R[M_SHEATH]=ramp(L.weapon==='saber'?'#8a5a38':'#4a4a6a'); R[M_APRON]=ramp('#f4eedc');
  if(L.ol&&L.ol!=='#22202a'){ const o=u32(L.ol); for(const r of R) if(r) r[4]=o; }
  const wpn=L.weapon, armed=pose==='guard'||pose==='atk'||pose==='atk2', slung=(wpn==='sword'||wpn==='saber')&&!armed&&pose!=='tool'&&pose!=='cheer'&&pose!=='hit'&&legs==='stand'&&closed!==1;
  const sm=vest?M_SKIN:M_ROBE, inHead=(x,y)=>{ const a=Math.abs(x-hx)/(hrx+.3), b=Math.abs(y-hy)/(hry+.3); return Math.pow(a,2.7)+Math.pow(b,2.7)<=1; };
  const arm=(sx,sy,h,bk)=>{ cPart++; const ex=sx+h[0]-Math.sign(h[0])*0, ey=S+h[1], x0=sx, y0=sy, dx=ex-x0, dy=ey-y0, n=Math.hypot(dx,dy)||1, ux=dx/n, uy=dy/n; cLine(x0,y0,ex-ux*1.5,ey-uy*1.5,3.6,gown&&!vest?5:4.2,sm,bk?-1:0); if(!vest) cLine(ex-ux*2,ey-uy*2,ex-ux*1.5,ey-uy*1.5,gown?5:4.2,gown?5:4.2,M_TRIM,bk?-1:0); cPart++; cEll(ex,ey,1.5,1.5,M_SKIN,bk?-1:0); };
  const armB=()=>arm(side?-tw+1.5+lean:-tw+.5,S+2.5,side?[hb[0]-(-tw+1.5+lean)+0,hb[1]]:[-2,hb[1]],side),
        armF=()=>arm(side?tw-1.5+lean:tw-.5,S+2.5,side?[hf[0]-(tw-1.5+lean),hf[1]]:[2,hf[1]],0);
  /* ---- 뒤에 깔리는 것: 뒷머리, 봇짐, 지팡이, 칼집 ---- */
  cPart++;
  if(!back){
    if(hs==='long'){ if(side){ cPoly([[hx-12,hy-2],[hx-16,hy+10],[hx-15,hy+22],[hx-10,hy+27],[hx-6,hy+22],[hx-5,hy+6]],M_HAIR); cLine(hx-12,hy+8,hx-11,hy+21,1,1,M_HAIR,1); cLine(hx-8,hy+10,hx-8,hy+22,1,1,M_HAIR,-1); } else { for(const s of [-1,1]) cPoly([[hx+s*13,hy],[hx+s*16,hy+18],[hx+s*12,hy+24],[hx+s*8,hy+18],[hx+s*9,hy+2]],M_HAIR); } }
    if(hs==='pony'){ if(side){ cLine(hx-10,hy-8,hx-17,hy-1,7,7,M_HAIR); cLine(hx-17,hy-1,hx-18,hy+9,7,5,M_HAIR); cLine(hx-18,hy+9,hx-15,hy+17,5,1.5,M_HAIR); cLine(hx-18,hy,hx-18,hy+10,1,1,M_HAIR,1); } else { cLine(hx+10,hy-8,hx+17,hy,6,6,M_HAIR); cLine(hx+17,hy,hx+16,hy+12,6,1.5,M_HAIR); } }
    if(hs==='bun'){ if(side) cEll(hx-12,hy-8,6,5.5,M_HAIR); else cEll(hx,hy-hry,6,4.5,M_HAIR); }
    if(hs==='granny'&&side) cEll(hx-13,hy+3,5,5,M_HAIR);
    if(hs==='band'){ if(side){ cLine(hx-12,hy-5,hx-19,hy-2,2.6,2,M_CLOTH); cLine(hx-13,hy-4,hx-18,hy+6,2.6,1.5,M_CLOTH); } else { cLine(hx+13,hy-5,hx+18,hy+3,2.6,1.5,M_CLOTH); } }
    if(fem&&!kid&&hs!=='long'&&hs!=='bald'&&hs!=='hood'&&side) cPoly([[hx-13,hy+2],[hx-14,hy+12],[hx-10,hy+15],[hx-6,hy+12],[hx-7,hy+4]],M_HAIR);
  }
  if(L.extra==='pack'&&!back){ cPart++; cRect(side?-tw-6+lean:-tw-3,S+1,side?6:4,10,M_PACK); }
  if(wpn==='staff'&&!armed&&pose!=='carry'&&legs==='stand'){ cPart++; const x=side?S*0+hf[0]+lean+tw-1.5+2-(tw-1.5):(back?-tw-5:tw+5); cLine(side?tw+5+lean:x,hy-hry+3,side?tw+5+lean:x,-1,1.8,1.8,M_WOOD); }
  if(slung&&!back){ cPart++; const bx=side?hb[0]:-tw-3, by=S+hb[1]; cLine(bx,by-4,bx-3,by+10,2.4,2,M_SHEATH); cLine(bx+1,by-7,bx,by-4,1.6,1.6,M_BLACK); cRect(bx-2,by-4,4,1,M_GOLD); cset(rnd(bx-3),rnd(by+11),M_GOLD,0); }
  if(!fover) armB();
  if(!side&&!fover){ /* 앞·뒤에서는 두 팔이 몸 뒤에서 시작 */ armF(); }
  /* ---- 다리 ---- */
  cPart++;
  if(legs==='sit'){ cEll(0,-4,sk0+5,4,M_ROBE); cEll(-sk0-1,-4,3,2.5,M_ROBE,1); cEll(sk0+1,-4,3,2.5,M_ROBE,1); cRect(-1,-3,3,2,M_ROBE,-1); }
  else if(legs==='kneel'){ cPoly([[-tw-8,-1],[-tw-8,-4],[-tw,-7],[tw+2,-7],[tw+3,-1]],M_ROBE); cRect(-tw-10,-4,3,3,M_SHOE); }
  else { for(const [fx,lift] of side?[[fb,lb],[fa,la]]:[[fb,lb],[fa,la]]){ if(!gown) cRect(fx-2,hem-1,4,-2-hem,M_PANTS,fx===fb&&side?-1:0); cPart++; cRect(fx-2+(side?0:0),-3-lift,side?5:4,3,M_SHOE); if(side){ cset(rnd(fx+3),-3-lift,0,0); } ctone(rnd(fx-1),-3-lift,M_SHOE,1); ctone(rnd(fx),-3-lift,M_SHOE,1); } }
  /* ---- 몸통과 옷자락 ---- */
  cPart++;
  cPoly([[-tw+lean,S],[tw+lean,S],[tw-.5+lean*.5,W],[mid+sk,hem],[mid-sk,hem],[-tw+.5+lean*.5,W]],M_ROBE);
  if(legs==='stand'){ for(let x=rnd(mid-sk);x<=rnd(mid+sk);x++) ctone(x,hem,M_ROBE,-1); for(const fxx of [mid-sk*.45,mid+sk*.5]) for(let y=W+3;y<hem;y++) ctone(rnd(fxx+(y-W)*.12*(fxx<mid?-1:1)),y,M_ROBE,-1); }
  for(let y=S+1;y<W-1;y++) ctone(rnd(tw-1.5+lean*.7),y,M_ROBE,-1);
  for(let y=S;y<S+3;y++) for(let x=rnd(-tw+lean);x<=rnd(tw+lean);x++) if(y-S<2-Math.abs(x-lean-hdx)*.0) ctone(x,y,M_ROBE,-1);
  for(let y=S+3;y<W-1;y++){ ctone(rnd(-tw+1.5+lean*.8),y,M_ROBE,1); if(y<S+6) ctone(rnd(-tw+2.5+lean*.8),y,M_ROBE,1); } if(legs==='stand') for(let y=W+2;y<hem-1;y++) ctone(rnd(mid-sk*.75-(y-W)*.1),y,M_ROBE,1);
  if(back){ cLine(-3,S+1,3,S+1,1.4,1.4,M_TRIM); }
  else { const c=lean+(side?1:0); cPoly([[c-3,S],[c+3,S],[c,S+5]],M_INNER); cLine(c-4,S,c+1.5,S+6,1.5,1.5,M_TRIM); cLine(c+4,S,c+.5,S+4,1.5,1.5,M_TRIM); }
  if(L.extra==='patch'){ cRect(-tw+1+lean,S+5,3,3,M_ROBE,-1); cRect(mid+1,hem-4,3,3,M_ROBE,-1); }
  if(L.extra==='apron'&&!back){ cPoly([[-tw+1.5+lean,S+5],[tw-1.5+lean,S+5],[mid+sk-2,hem-1],[mid-sk+2,hem-1]],M_APRON); }
  cRect(-tw+.5+lean*.5,W-1,rnd(2*tw),2,M_SASH); for(let x=rnd(-tw+.5+lean*.5);x<rnd(tw+lean*.5);x++) ctone(x,W-1,M_SASH,1);
  if(!back&&legs==='stand'){ const kx=rnd(lean*.5+(side?2:-1)); cRect(kx,W-1,2,3,M_SASH,1); cLine(kx+.5,W+2,kx+1.5,W+6,1.5,1.2,M_SASH); cset(kx+2,W+7,M_SASH,L.sash?2:0); }
  if(slung&&back){ cPart++; cLine(tw+1,S-2,-tw-1,W+5,2.6,2.2,M_SHEATH); }
  if(back&&L.extra==='pack'){ cPart++; cRect(-5,S+1,11,10,M_PACK); for(let x=-5;x<6;x++) ctone(x,S+1,M_PACK,1); }
  if(fover) armB();
  /* ---- 머리 ---- */
  cPart++; const hp=cPart;
  cSup(hx,hy,hrx,hry,bald?M_SKIN:hood?M_BLACK:M_HAIR);
  const fcx=hx+(side?3.5:0), fcy=hy+(kid?3:3.5), frx=side?hrx-3.5:hrx-3.5, fry=hry-4, ey=hy+2, exL=side?hx+1:hx-5, exR=side?hx+(kid?6:7):hx+4, inFace=(x,y)=>{ const a=Math.abs(x-fcx)/frx, b=Math.abs(y-fcy)/fry; return Math.pow(a,2.4)+Math.pow(b,2.4)<=1&&inHead(x,y); };
  if(!back){
    cPart++; for(let y=rnd(fcy-fry);y<=rnd(fcy+fry);y++) for(let x=rnd(fcx-frx);x<=rnd(fcx+frx);x++) if(inFace(x,y)&&(!hood||(y>=ey-2&&y<=ey+6))) cset(x,y,M_SKIN,0);
    if(!bald&&!hood){ cPart++; const d=kid?3:4, T=side?[[fcx-9.5,fem?10:7],[hx-1.5,d],[hx+4.5,d],[hx+11.5,fem?8:d+1]]:[[hx-9.5,fem?9:7],[hx-2.5,d],[hx+2.5,d],[hx+9.5,fem?9:7]];
      for(let x=rnd(fcx-frx);x<=rnd(fcx+frx);x++){ let yb=hy-2; for(const [c,dp] of T) yb=Math.max(yb,hy-2+dp-Math.abs(x-c)*(dp>5?2.4:1.4)); for(let y=hy-hry;y<=yb;y++) if(inFace(x,y)) cset(x,y,M_HAIR,0); }
      cLine(side?fcx-7:hx-6.5,hy-9,side?fcx-7:hx-6.5,hy-3,1,1,M_HAIR,-1); cLine(side?fcx-.5:hx,hy-9,side?fcx-.5:hx,hy-3,1,1,M_HAIR,-1); cLine(side?fcx+6:hx+6.5,hy-8,side?fcx+6:hx+6.5,hy-3,1,1,M_HAIR,-1); }
    const kind=kid?'k':fem?'f':'m';
    cEye(exL,ey,kind,0,closed); cEye(exR,ey,kind,1,closed);
    if(L.ol&&L.ol!=='#22202a'&&!closed){ const c=u32('#ff5a3a'); cfix(exL,ey+1,c); cfix(exR,ey+1,c); cfix(exL+1,ey+2,c); cfix(exR+1,ey+2,c); }
    if(!hood){ const mx=side?hx+4:hx-1; if(mouth){ const c=u32('#7a2634'); cfix(mx,ey+7,c); cfix(mx+1,ey+7,c); cfix(mx,ey+8,c); cfix(mx+1,ey+8,u32('#e88a94')); }
      if(L.blush||kid){ const bl=u32(mix(skin,'#ff7088',.5)); cfix(exL-3,ey+5,bl); cfix(exL-2,ey+5,bl); cfix(exR+3,ey+5,bl); cfix(exR+4,ey+5,bl); } }
    if(L.extra==='scar'){ const c=u32('#d8483a'); for(let i=0;i<7;i++) cfix(exR+4-(i>>1),ey-1+i,c); }
    if(L.extra==='mask'){ for(let y=ey+5;y<=hy+hry;y++) for(let x=hx-hrx;x<=hx+hrx;x++) if(inFace(x,y)) cset(x,y,M_BLACK,0); }
    const mxb=side?rnd(fcx+1):hx;
    if(L.beard==='short'&&!kid){ cPart++; cEll(mxb+2,ey+8.5,5,2.6,M_BEARD,0,inHead); }
    if(L.beard==='long'&&!kid){ cPart++; cPoly([[mxb-4,ey+7],[mxb+7,ey+7],[mxb+6,ey+14],[mxb+3,ey+21],[mxb+1,ey+21],[mxb-2,ey+14]],M_BEARD); cLine(mxb+1,ey+10,mxb+2,ey+19,1,1,M_BEARD,-1); }
    if(bald&&!kid){ const c=u32(mix(skin,'#b0604a',.6)); cfix(hx+(side?2:-2),hy-8,c); cfix(hx+(side?5:2),hy-8,c); cfix(hx+(side?3.5:0),hy-10,c); cEll(hx-5,hy-7,2.5,1.5,M_SKIN,1,inHead); }
  } else if(bald){ for(let x=-2;x<=2;x++) ctone(hx+x,hy+hry-1,M_SKIN,-1); }
  cPart++;
  // 머리카락 광택과 그늘
  if(!bald&&!hood){ const t0=hy-hry+3, o=side?-1:0;
    for(let x=hx-9+o;x<=hx-2+o;x++){ ctone(x,t0+1,M_HAIR,1); ctone(x,t0+2,M_HAIR,1); if(x>hx-8+o&&x<hx-3+o) ctone(x,t0,M_HAIR,1); if(x<hx-5+o) ctone(x,t0+3,M_HAIR,1); }
    for(let x=hx+2+o;x<=hx+6+o;x++){ ctone(x,t0+1,M_HAIR,1); if(x<hx+5+o) ctone(x,t0+2,M_HAIR,1); }
    ctone(hx-7+o,t0+1,M_HAIR,2); ctone(hx-6+o,t0+1,M_HAIR,2); ctone(hx-7+o,t0+2,M_HAIR,2); ctone(hx+3+o,t0+1,M_HAIR,2);
    if(side) for(let y=hy+2;y<=hy+hry;y++) for(let x=hx-hrx;x<hx-7;x++) if(inHead(x,y)&&(x-hx+hrx)<(y-hy)*.9+3) ctone(x,y,M_HAIR,-1);
    if(back){ for(let y=hy+5;y<=hy+hry;y++) for(let x=hx-hrx;x<=hx+hrx;x++) ctone(x,y,M_HAIR,-1); cLine(hx-5,hy-4,hx-6,hy+8,1,1,M_HAIR,-1); cLine(hx+5,hy-4,hx+6,hy+8,1,1,M_HAIR,-1); } }
  // 머리 장식
  const top=hy-hry;
  if(hs==='top'||hs==='crown'){ cEll(hx,top-1,4,4.5,M_HAIR); ctone(hx-2,top-3,M_HAIR,1); ctone(hx-1,top-4,M_HAIR,1); cRect(hx-4,top+2,9,2,hs==='crown'?M_GOLD:M_TRIM); }
  if(hs==='crown'){ cPoly([[hx-5,top+2],[hx-5,top-3],[hx-2,top-1],[hx,top-7],[hx+2,top-1],[hx+5,top-3],[hx+5,top+2]],M_GOLD); cfix(hx,top-2,u32('#e0483a')); cfix(hx,top-3,u32('#e0483a')); }
  if(hs==='tuft'){ cPoly([[hx-3,top+2],[hx,top-6],[hx+3,top+2]],M_HAIR); cRect(hx-3,top+1,7,2,M_CLOTH); }
  if(hs==='buns'){ for(const s of [-1,1]){ cEll(hx+s*9,top+1,5,5,M_HAIR); ctone(hx+s*9-2,top-2,M_HAIR,1); ctone(hx+s*9-1,top-3,M_HAIR,1); cRect(hx+s*9-3,top+5,6,2,M_CLOTH); } }
  if(hs==='pony'){ if(side) cEll(hx-10,hy-9,2.6,2.6,M_TRIM); else if(front) cEll(hx+10,hy-9,2.2,2.2,M_TRIM); else { cLine(hx,hy-8,hx,hy+8,8,7,M_HAIR); cLine(hx,hy+8,hx+1,hy+19,7,1.5,M_HAIR); cLine(hx-1,hy-4,hx-1,hy+12,1,1,M_HAIR,1); cRect(hx-4,hy-10,9,3,M_TRIM); } }
  if(hs==='bun'||hs==='granny'){ if(side&&hs==='bun'){ cLine(hx-20,hy-10,hx-5,hy-8,1.3,1.3,M_GOLD); cfix(hx-20,hy-10,u32('#e0483a')); cfix(hx-21,hy-10,u32('#e0483a'),1); } else if(front&&hs==='bun'){ cLine(hx-10,top,hx+10,top,1.3,1.3,M_GOLD); cfix(hx+10,top,u32('#e0483a')); } else if(back){ cEll(hx,hy+(hs==='bun'?-5:4),7,6,M_HAIR); ctone(hx-3,hy+(hs==='bun'?-9:0),M_HAIR,1); if(hs==='bun') cLine(hx-10,hy-5,hx+10,hy-5,1.3,1.3,M_GOLD); } }
  if(hs==='long'&&back){ cPoly([[hx-13,hy],[hx-15,hy+20],[hx-9,hy+27],[hx+9,hy+27],[hx+15,hy+20],[hx+13,hy]],M_HAIR); cLine(hx-4,hy+6,hx-5,hy+24,1,1,M_HAIR,1); cLine(hx+5,hy+6,hx+6,hy+24,1,1,M_HAIR,-1); }
  if(fem&&!kid&&back&&hs!=='long'&&!bald&&!hood) cPoly([[hx-13,hy+2],[hx-13,hy+13],[hx-6,hy+16],[hx+6,hy+16],[hx+13,hy+13],[hx+13,hy+2]],M_HAIR);
  if(hs==='band'){ for(let y=hy-7;y<=hy-5;y++) for(let x=hx-hrx;x<=hx+hrx;x++) if(inHead(x,y)) cset(x,y,M_CLOTH,y===hy-7?1:0); if(back){ cRect(hx-2,hy-5,4,3,M_CLOTH); cLine(hx-1,hy-2,hx-3,hy+8,2,1.4,M_CLOTH); cLine(hx+1,hy-2,hx+3,hy+9,2,1.4,M_CLOTH,-1); } }
  if(hs==='granny'){ for(let y=top;y<=hy-4;y++) for(let x=hx-hrx;x<=hx+hrx;x++) if(inHead(x,y)&&cmat(x,y)===M_HAIR) cset(x,y,M_KER,y<top+3?1:0); }
  if(hs==='messy'){ for(const [a,b,c,d] of [[-12,-7,-15,-10],[-7,-11,-9,-15],[0,-12,1,-16],[7,-11,9,-15],[12,-6,15,-8],[-13,2,-16,4]]) cPoly([[hx+a-2,hy+b+2],[hx+c,hy+d],[hx+a+2,hy+b+2]],M_HAIR); }
  if(hs==='cap'){ for(let y=top;y<=hy-5;y++) for(let x=hx-hrx;x<=hx+hrx;x++) if(inHead(x,y)) cset(x,y,M_BLACK,y<top+2?1:0); cRect(hx-6,top-5,13,7,M_BLACK); for(let x=hx-5;x<hx+6;x++) ctone(x,top-5,M_BLACK,1); cset(hx-6,top-5,0,0); cset(hx+6,top-5,0,0); cRect(hx-22,hy-7,9,2,M_BLACK); cRect(hx+14,hy-7,9,2,M_BLACK); }
  if(hs==='hat'){ cPoly([[hx-3,top-5],[hx+3,top-5],[hx+21,hy-7],[hx+23,hy-5],[hx-23,hy-5],[hx-21,hy-7]],M_STRAW); for(let x=hx-22;x<=hx+22;x++) ctone(x,hy-5,M_STRAW,-1); cLine(hx-2,top-3,hx-12,hy-9,1.2,1.2,M_STRAW,1); cLine(hx+4,top-2,hx+14,hy-8,1,1,M_STRAW,-1); }
  if(fem&&!kid&&!bald&&!hood&&!back){ if(side) cLine(fcx-frx+1.5,hy,fcx-frx+.5,hy+10,3,1.4,M_HAIR); else for(const s of [-1,1]) cLine(hx+s*(frx-.5),hy,hx+s*(frx+.5),hy+10,3,1.4,M_HAIR); }
  if(hood){ for(let x=hx-4;x<=hx+3;x++) ctone(x,top+3,M_BLACK,1); }
  if(L.extra==='umbrella'){ cPart++; cLine(tw+6,top-8,tw+6,S+8,1.6,1.6,M_WOOD); cPoly([[hx-2,top-13],[hx+6,top-13],[hx+26,top-4],[hx-22,top-4]],M_STRAW); for(let x=hx-22;x<=hx+26;x++) ctone(x,top-4,M_STRAW,-1); }
  /* ---- 앞쪽 팔 ---- */
  if(side) armF();
  if(side&&slung){ /* 뒷손에 든 칼집의 손잡이는 위에서 이미 그렸다 */ }
  return {R,hf:[tw-1.5+lean+ (hf[0]-(tw-1.5+lean)) ,S+hf[1]],S,closed}; }
function chibiImage(L,pose,f,dir){ const lying=pose==='down'||pose==='lie'||pose==='dead', info=drawChibi(L,lying?'sleep':pose,lying?0:f,dir);
  // 손에 든 물건·연장·무기는 1배로 그려 다듬어 올린다
  let layer=null; const side=dir!=='d'&&dir!=='u', hx1=rnd(info.hf[0]/2), hy1=rnd(info.hf[1]/2), w=L.weapon;
  const hand=!side?null:pose==='guard'?[hx1,hy1-1,'up']:pose==='atk'?[hx1+3,hy1,'fwd']:pose==='atk2'?(f?[hx1+2,hy1+1,'dn']:[hx1+1,hy1-1,'bk']):pose==='carry'?[hx1+1,hy1-1,'item']:pose==='tool'?[hx1,hy1-1,'tool']:null;
  if(hand||(side&&(pose==='beg'||pose==='drink'))||(side&&w==='glove'&&(pose==='guard'||pose==='cast'))){ const c1=document.createElement('canvas'); c1.width=SW; c1.height=SH; const keep=cx; cx=c1.getContext('2d');
    try{ const up=(x,y,ww,hh,c)=>P(OX+x,OY+y,ww,hh,c); up.h=()=>{}; if(hand) drawHeld(L,pose,f,up,hand); if(pose==='beg'){ up(hx1,hy1-1,5,2,'#8a7a62'); up(hx1,hy1-1,5,1,'#b0a084'); } if(pose==='drink'){ up(hx1-1,hy1-2,3,3,'#c9a25a'); up(hx1,hy1-3,1,1,PAL.cloth); } if(w==='glove'&&(pose==='guard'||pose==='cast')) up(hx1-1,hy1-1,2,2,'#c3ced4'); } finally{ cx=keep; }
    layer=epx(c1); }
  return {im:cFinish(info.R,layer),lying}; }
