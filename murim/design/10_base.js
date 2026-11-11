/* ==== murim:gfx-base — 도트 장면 엔진: 색, 하늘, 산, 지형 ==== */
const RED=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const W=192,H=108,GY=86;
const cv=$m('mhScene'), g0=cv.getContext('2d'); g0.imageSmoothingEnabled=false; g0.scale(2,2);   // 화면은 384×216, 좌표는 192×108 그대로 쓴다
let cx=g0, tk=0, SC=null, FX=[], LIGHTS=[], shake=0, flashA=0, flashC='#ffffff', fadeA=0, bars=0;
const rnd=Math.round;
let SEQ=null, SEQN=0, SEQW=0, SEQH=0, HQ=null;
function P(x,y,w,h,c){ cx.fillStyle=c; x=rnd(x); y=rnd(y); cx.fillRect(x,y,w,h); if(SEQ){ const n=++SEQN, x1=Math.min(SEQW,x+w), y1=Math.min(SEQH,y+h); for(let j=Math.max(0,y);j<y1;j++) for(let i=Math.max(0,x);i<x1;i++) SEQ[j*SEQW+i]=n; } }
// 반 칸 단위로 적는 고해상도 덧그림. 스프라이트를 2배로 키운 뒤에 얹는다.
const hq=(x,y,w,h,c)=>{ if(HQ) HQ.push([x,y,w,h,c,SEQN]); };
function hx(c){ const n=parseInt(c.slice(1),16); return [n>>16&255,n>>8&255,n&255]; }
const _mx=new Map();
function mix(a,b,t){ t=rnd(t*20)/20; const k=a+b+t; let v=_mx.get(k); if(v) return v; const A=hx(a),B=hx(b); v='#'+[0,1,2].map(i=>rnd(A[i]+(B[i]-A[i])*t).toString(16).padStart(2,'0')).join(''); _mx.set(k,v); return v; }
const dk=(c,t=.22)=>mix(c,'#15161d',t), lt=(c,t=.22)=>mix(c,'#ffffff',t);
function rgba(c,a){ const v=hx(c); return `rgba(${v[0]},${v[1]},${v[2]},${a})`; }
const hsh=n=>{ const s=Math.sin(n*127.1+311.7)*43758.5453; return s-Math.floor(s); };
function disc(x,y,r,c){ for(let j=-r;j<=r;j++){ const w=rnd(Math.sqrt(r*r-j*j)); P(x-w,y+j,w*2+1,1,c); } }
function line(x0,y0,x1,y1,c){ x0=rnd(x0);y0=rnd(y0);x1=rnd(x1);y1=rnd(y1); const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1; let e=dx+dy; for(let i=0;i<400;i++){ P(x0,y0,1,1,c); if(x0===x1&&y0===y1) break; const e2=2*e; if(e2>=dy){ e+=dy; x0+=sx; } if(e2<=dx){ e+=dx; y0+=sy; } } }
function glow(x,y,r,c,a){ LIGHTS.push([x,y,r,c,a==null?.4:a]); }
const anim=()=>RED?0:tk;

const PAL={wood:'#7d5a3a',woodD:'#573c27',woodL:'#a8805a',wall:'#e6dec8',wallS:'#cbc0a2',tile:'#42505b',tileH:'#5f6f7a',tileD:'#2c363e',red:'#b23a2a',redD:'#7f281d',gold:'#d9a441',paperL:'#ffd98a',paperD:'#5a6664',stone:'#a3a59c',stoneD:'#7b7d75',stoneL:'#c4c6bb',thatch:'#bb9750',thatchD:'#97763b',cloth:'#c23b2b',water:'#78aab6',waterL:'#a9d0d6',dirt:'#c0a379',dirtD:'#a48a63',ink:'#22202a',pine:'#2f5a44',pineL:'#41785a'};
// 봄 · 여름 · 가을 · 겨울
const SEASON=[
  {grass:'#93b473',grass2:'#7d9f61',leaf:'#86b46e',leaf2:'#f4b9c8',far:'#a9c0c4',mid:'#88a69d',near:'#62856b'},
  {grass:'#72a05a',grass2:'#5d8a4a',leaf:'#4f8f4e',leaf2:'#3f7742',far:'#a2bcc6',mid:'#7da198',near:'#4f7d63'},
  {grass:'#b39d5b',grass2:'#98844b',leaf:'#cf772f',leaf2:'#e0a83c',far:'#b7b9b3',mid:'#a3927d',near:'#7c6c52'},
  {grass:'#e8ecea',grass2:'#cdd7da',leaf:'#dde5e6',leaf2:'#ffffff',far:'#ced8dc',mid:'#aab9be',near:'#8597a2'}
];
const TIMEG={day:null,dawn:['#ffcdb6',.62],dusk:['#ff9a66',.64],night:['#36457c',.78]};
const SKYC=['#9cc1d1','#a9cad5','#b6d2d8','#c3dadb','#d0e1dd','#dce7df','#e7ece1','#eff0e3','#f4f1e4'];

function cloud(x,y,s){ const c='#f7f7ef',u='#dfe7e4'; P(x+3*s,y-2,5*s,2,c); P(x+s,y,9*s,2,c); P(x,y+2,12*s,2,c); P(x+2,y+4,8*s,1,u); }
function drawSky(st){
  for(let i=0;i<SKYC.length;i++){ P(0,i*7,W,7,SKYC[i]); if(i<SKYC.length-1) for(let x=i%2;x<W;x+=2) P(x,i*7+6,1,1,SKYC[i+1]); }
  P(0,63,W,H-63,SKYC[SKYC.length-1]);
  if(st.time==='day'){ disc(152,17,6,'#d8452c'); }
  else if(st.time==='dawn'){ disc(36,40,8,'#fff3c8'); glow(36,40,16,'#ffd9a0',.25); }
  else if(st.time==='dusk'){ disc(156,42,8,'#fff0b8'); glow(156,42,18,'#ffb070',.3); }
  const n=st.time==='night'?2:4;
  for(let i=0;i<n;i++){ const sp=.012+.006*i, x=((i*67+anim()*sp)%(W+50))-30, y=6+i*9+(i%2)*4; cloud(x,y,i%2?2:1); }
  if(st.time==='dusk'&&!RED){ for(let i=0;i<5;i++){ const x=((tk*.12+i*9)%(W+30))-15+i*4, y=18+i*2+(i%2)*3, f=(tk>>3)%2; P(x,y,1,1,'#3a3540'); P(x-1,y-1+f,1,1,'#3a3540'); P(x+1,y-1+f,1,1,'#3a3540'); } }
}
function drawSkyLights(st){
  if(st.time!=='night') return;
  for(let i=0;i<46;i++){ const x=rnd(hsh(i*3.71)*W), y=rnd(hsh(i*9.13)*25); if(((i*5+(anim()>>4))%9)>1) P(x,y,1,1,i%7?'#dfe6ff':'#fff6c8'); }
  const mx=150,my=15; disc(mx,my,6,'#f4f0d6'); P(mx-3,my-2,2,2,'#d8d2b2'); P(mx+1,my+1,2,1,'#d8d2b2'); P(mx-1,my+3,1,1,'#d8d2b2');
  glow(mx,my,15,'#cfd8ff',.22);
}
function ridgeY(x,seed,base,amp,steep){ const a=Math.sin(x*.043+seed)*.5+.5, b=Math.sin(x*.11+seed*2.3)*.5+.5, c=Math.sin(x*.021+seed*.7)*.5+.5; let v=a*.5+c*.35+b*.15; if(steep) v=Math.pow(v,1.7); return base-amp*v; }
function ridge(seed,base,amp,col,par,o){ o=o||{};
  for(let x=0;x<W;x++){ const wx=x+par, y=rnd(ridgeY(wx,seed,base,amp,o.steep));
    P(x,y,1,H-y,col); if(o.hi) P(x,y,1,1,o.hi);
    if(o.snow){ const lim=base-amp*.45; if(y<lim) P(x,y,1,Math.max(1,rnd((lim-y)*.4)),'#f3f6f5'); }
    if(o.ink){ const r=hsh(rnd(wx)*1.31+seed); if(r>.7) P(x,y+2+rnd(hsh(rnd(wx)+seed)*9),1,1,o.ink); if(r>.93) P(x,y+1,1,3,o.ink); }
    if(o.trees&&hsh(rnd(wx)*2.17+seed)>.8){ P(x,y-3,1,1,o.trees); P(x-1,y-2,3,2,o.trees); }
  }
}
function mist(y,a){ for(let i=0;i<3;i++){ const x=((i*83+anim()*.05*(i+1))%(W+90))-90, c=rgba('#ffffff',a||.42); P(x+6,y+i*3,78,1,c); P(x,y+i*3+1,90,1,c); P(x+10,y+i*3+2,70,1,c); } }
function tufts(st,col,n){ for(let i=0;i<(n||56);i++){ const x=rnd(hsh(i*3.17)*W), y=GY+2+rnd(hsh(i*7.71)*(H-GY-4)); P(x,y,2,1,col); if(st.season===0&&i%6===0) P(x,y-1,1,1,['#f6c1cf','#fff6d8','#f4e07a'][i%3]); if(st.season===2&&i%5===0) P(x+2,y,1,1,'#c9702c'); } }
function outdoor(st,o){ o=o||{}; const S=SEASON[st.season], sn=st.season===3, p=st.scrollX||0;
  drawSky(st);
  ridge(1.7,54,26,S.far,p*.12,{steep:1,snow:sn,hi:lt(S.far,.3)});
  mist(45,.4);
  ridge(4.3,68,22,S.mid,p*.3,{snow:sn,ink:dk(S.mid,.22),hi:lt(S.mid,.18)});
  mist(62,.3);
  if(!o.noNear) ridge(8.1,GY+3,o.nearAmp||15,S.near,p*.6,{ink:dk(S.near,.28),trees:dk(S.near,.38),snow:sn&&o.nearAmp>20});
}
function pathBand(st,y,h){ const sn=st.season===3, c=sn?'#dcd8cc':PAL.dirt, d=sn?'#c4c0b6':PAL.dirtD, p=st.scrollX||0;
  P(0,y,W,h,c); for(let x=0;x<W;x++){ const wx=rnd(x+p); if(hsh(wx*1.9)>.55) P(x,y-1,1,1,c); if(hsh(wx*2.7)>.6) P(x,y+h,1,1,c); }
  for(let i=0;i<26;i++){ const wx=i*17.3+hsh(i)*9, x=((wx-p)%(W+20)+W+20)%(W+20)-10; P(x,y+1+rnd(hsh(i*4.4)*(h-2)),2,1,d); }
}
const TER={
  plain(st){ const S=SEASON[st.season]; outdoor(st);
    const dry=st.biome==='dry', gcol=dry&&st.season<3?mix(S.grass,'#c9b06a',.45):S.grass;
    P(0,GY,W,H-GY,gcol); for(let x=0;x<W;x++) if(hsh(x*1.37)>.62) P(x,GY-1,1,1,gcol);
    tufts(st,dry?mix(S.grass2,'#a8904e',.5):S.grass2);
    if(st.crops){ const cc=st.season===2?'#d9b24a':st.season===3?'#c9cfcc':st.season===0?'#a8c878':'#5f9a4e'; for(let r=0;r<4;r++){ const y=GY+3+r*5; P(0,y+2,W,1,dk(gcol,.18)); for(let x=(r%2)*3;x<W;x+=6){ P(x,y,1,2,cc); P(x-1,y-1,3,1,cc); if(st.season===2) P(x,y-2,1,1,'#f0d070'); } } }
    if(st.path) pathBand(st,GY+9,7);
    if(st.biome==='water'){ P(0,H-9,W,9,PAL.water); for(let i=0;i<14;i++){ const x=((i*29+anim()*.1)%(W+16))-8; P(x,H-8+(i%4)*2,5,1,PAL.waterL); } P(0,H-10,W,1,dk(gcol,.25)); }
  },
  hills(st){ const S=SEASON[st.season]; outdoor(st,{nearAmp:30});
    const gcol=mix(S.grass,S.near,.35); P(0,GY,W,H-GY,gcol); for(let x=0;x<W;x++) if(hsh(x*1.37)>.55) P(x,GY-1,1,1,gcol);
    tufts(st,dk(gcol,.16),40); for(let i=0;i<10;i++){ const x=rnd(hsh(i*5.3)*W), y=GY+3+rnd(hsh(i*2.9)*16); P(x,y,3,2,PAL.stoneD); P(x,y,2,1,PAL.stone); }
    if(st.path!==0) pathBand(st,GY+10,6);
  },
  court(st){ const S=SEASON[st.season], sn=st.season===3; outdoor(st,{noNear:1});
    // 담장
    P(0,GY-15,W,15,PAL.wall); P(0,GY-4,W,4,PAL.wallS); P(0,GY-18,W,3,PAL.tile); P(0,GY-19,W,1,PAL.tileH); for(let x=2;x<W;x+=5) P(x,GY-17,1,2,PAL.tileD);
    if(sn) for(let x=0;x<W;x+=3) P(x,GY-19,2,1,'#f3f6f5');
    // 돌바닥
    P(0,GY,W,H-GY,PAL.stone); P(0,GY,W,1,PAL.stoneL);
    for(let r=0;r<5;r++){ const y=GY+4+r*5; P(0,y,W,1,PAL.stoneD); for(let x=(r%2)*8;x<W;x+=16) P(x,y-4,1,4,PAL.stoneD); }
    if(sn) for(let i=0;i<30;i++) P(rnd(hsh(i*2.3)*W),GY+1+rnd(hsh(i*6.7)*20),3+rnd(hsh(i)*4),1,'#eef2f0');
    else if(st.season===2) for(let i=0;i<16;i++) P(rnd(hsh(i*2.3)*W),GY+2+rnd(hsh(i*6.7)*18),1,1,i%2?'#c9702c':'#d9a03a');
    else if(st.season===0) for(let i=0;i<14;i++) P(rnd(hsh(i*2.3)*W),GY+2+rnd(hsh(i*6.7)*18),1,1,'#f6c1cf');
  },
  road(st){ const S=SEASON[st.season]; outdoor(st,{nearAmp:20});
    const gcol=S.grass; P(0,GY,W,H-GY,gcol); for(let x=0;x<W;x++) if(hsh((x+(st.scrollX||0))*1.37)>.6) P(x,GY-1,1,1,gcol);
    pathBand(st,GY+4,13); tufts(st,S.grass2,24);
    // 스크롤되는 길가 나무와 바위
    const p=st.scrollX||0; for(let k=Math.floor(p/46)-1;k<Math.floor(p/46)+6;k++){ const wx=k*46+hsh(k*3.3)*20, x=rnd(wx-p); if(x<-12||x>W+12) continue; const kind=hsh(k*7.7); if(kind>.55) PROP.tree(x,GY+1,st,kind>.8?'pine':'broad'); else if(kind>.3) PROP.rock(x,GY+2,st,1); }
  },
  forest(st){ const S=SEASON[st.season], bg=mix(S.near,'#1d3528',.5); P(0,0,W,H,bg);
    for(let i=0;i<5;i++){ const x=14+i*38+hsh(i)*12; for(let j=0;j<GY;j+=2) P(x+j*.25,j,7,2,rgba('#f6f2c4',.07)); }
    for(let i=0;i<16;i++){ const x=rnd(hsh(i*2.7)*W), w=2+rnd(hsh(i*5.1)*3); P(x,0,w,GY-rnd(hsh(i)*5),dk(bg,.32)); }
    for(let i=0;i<26;i++){ const x=rnd(hsh(i*9.1)*(W+16))-8, y=rnd(hsh(i*4.3)*24)-8; disc(x,y+4,7+rnd(hsh(i)*4),i%3?mix(S.leaf,bg,.55):mix(S.leaf,bg,.3)); }
    const gc=mix(S.grass2,'#22382a',.45); P(0,GY,W,H-GY,gc); for(let x=0;x<W;x++) if(hsh(x*1.7)>.5) P(x,GY-1-rnd(hsh(x)*1.4),1,2,gc);
    tufts(st,mix(S.grass,'#2f4a34',.25),40); pathBand(st,GY+11,5);
  },
  cave(st){ for(let i=0;i<11;i++) P(0,i*10,W,10,mix('#1b1a23','#383541',i/10));
    for(let i=0;i<22;i++){ P(rnd(hsh(i*4.1)*W),6+rnd(hsh(i*2.7)*70),8+rnd(hsh(i)*18),1,'#2d2b36'); }
    for(let i=0;i<27;i++) P(10+i*1.5,i*3.2,26-i*.3,4,rgba('#d6e8ee',.085));
    for(let j=0;j<7;j++){ const w=rnd(34*Math.sqrt(1-Math.pow((j-3)/3.6,2))); P(52-w/2,GY+3+j,w,1,rgba('#d6e8ee',.1)); }
    for(let i=0;i<18;i++){ const x=rnd(hsh(i*3.3)*W), h=4+rnd(hsh(i*8.8)*13); for(let j=0;j<h;j++) P(x-rnd((h-j)/5),j,1+rnd((h-j)/2.5),1,j<2?'#4d4a58':'#413e4b'); }
    for(let i=0;i<7;i++){ const x=rnd(8+hsh(i*7.3)*176), h=5+rnd(hsh(i*2.2)*10); for(let j=0;j<h;j++) P(x-rnd(j/3),GY-h+j,1+rnd(j/1.5),1,'#37343f'); }
    P(0,GY,W,H-GY,'#423f4c'); P(0,GY,W,1,'#54515f'); for(let i=0;i<34;i++){ const x=hsh(i*1.7)*W, y=GY+2+hsh(i*6.1)*(H-GY-3); P(x,y,2+rnd(hsh(i)*3),1,i%2?'#4f4c5a':'#35323d'); }
    for(const [x,y,c] of [[8,52,'#6fe0d0'],[176,40,'#6fe0d0'],[150,66,'#9fb0ff'],[30,70,'#9fb0ff'],[96,30,'#6fe0d0']]){ P(x,y,2,4,c); P(x+2,y+1,1,3,dk(c,.3)); P(x-1,y+2,1,2,lt(c,.4)); glow(x+1,y+2,6+(RED?0:Math.sin(tk*.05+x)*1.5),c,.4); }
    for(const x of [0,172]){ for(let j=0;j<16;j++) P(x-2+rnd(j*.4)*(x?-1:0)+(x?16-j:0)*0,H-16+j,(x?20:6+j),1,'#24222b'); }
  },
  room(st){ const k=st.room||'inn', hall=k==='hall', den=k==='den', wall=den?'#75634e':hall?'#ded4b8':'#d9cba8', night=st.time==='night'||st.time==='dusk';
    P(0,0,W,GY,wall); P(0,GY-30,W,30,dk(wall,.06)); P(0,0,W,5,PAL.woodD); P(0,5,W,1,PAL.wood);
    for(let x=14;x<W-20;x+=50){ P(x,16,24,28,PAL.woodD); P(x+1,17,22,26,night?'#27344a':'#eef1e2'); for(let i=1;i<4;i++) P(x+1+i*5+rnd(i/2),17,1,26,PAL.wood); for(let i=1;i<4;i++) P(x+1,17+i*6+rnd(i/2),22,1,PAL.wood); }
    if(!den&&k!=='shop') for(let x=43;x<W-20;x+=100){ P(x,12,9,30,'#f1ead6'); P(x-1,11,11,1,PAL.woodD); P(x-1,42,11,1,PAL.woodD); line(x+4,38,x+3,18,'#4a5a4a'); line(x+3,24,x+7,20,'#4a5a4a'); line(x+4,30,x+1,26,'#4a5a4a'); P(x+6,36,2,2,PAL.red); }
    for(let x=6;x<W;x+=50){ P(x,5,5,GY-5,hall?PAL.red:PAL.wood); P(x,5,1,GY-5,hall?lt(PAL.red,.2):PAL.woodL); P(x-1,GY-3,7,3,PAL.stoneD); }
    P(0,GY-5,W,1,PAL.woodD);
    const fl=den?'#6f563c':'#96724b', fd=dk(fl,.14); P(0,GY,W,H-GY,fl); for(let y=GY+3;y<H;y+=4) P(0,y,W,1,fd); for(let i=0;i<14;i++) P(rnd(hsh(i*3.9)*W),GY+rnd(hsh(i*1.3)*5)*4,1,3,fd);
  },
  peak(st){ const S=SEASON[st.season]; drawSky(st);
    ridge(2.2,74,34,S.far,0,{steep:1,snow:st.season===3,hi:lt(S.far,.3)});
    for(let i=0;i<16;i++){ const x=((i*27+anim()*.02*(1+i%3))%(W+50))-25, y=60+(i%4)*5; cloud(x,y,2); }
    P(0,82,W,H-82,'#f4f4ec');
    const top='#8b9587', topD='#717b6e', face='#5a635b', faceD='#465047';
    for(let x=16;x<176;x++){ const e=Math.min(x-16,175-x), lift=e<9?rnd((9-e)*.8):0, y=GY+lift-rnd(hsh(x*.71)*1.3), th=Math.max(2,12-lift), fy=y+th;
      P(x,y,1,th,top); P(x,fy,1,H-fy,face); if(hsh(x*2.3)>.7) P(x,fy+1+rnd(hsh(x)*6),1,4,faceD); if(x%11===3) P(x,fy,1,H-fy,faceD);
      P(x,y,1,1,st.season===3?'#f3f6f5':mix(S.grass,top,.3)); if(hsh(x*3.7)>.8) P(x,y+3+rnd(hsh(x*1.1)*6),2,1,topD); }
    for(let i=0;i<9;i++){ const x=((i*37+anim()*.03)%(W+50))-25; cloud(x,97+(i%3)*3,2); }
  },
  waste(st){ drawSky(st); ridge(3.1,62,18,'#9a8f83',0,{ink:'#7a7068'}); mist(56,.3);
    P(0,GY,W,H-GY,'#857461'); for(let x=0;x<W;x++) if(hsh(x*1.37)>.6) P(x,GY-1,1,1,'#857461');
    for(let i=0;i<50;i++){ const x=rnd(hsh(i*3.17)*W), y=GY+2+rnd(hsh(i*7.71)*(H-GY-4)); P(x,y,2+rnd(hsh(i)*2),1,i%3?'#6f604f':'#9a8973'); }
  }
};
function gradeScene(st){ let gde=TIMEG[st.time]; if(st.ter==='room'&&gde) gde=['#d69a66',.5]; if(st.ter==='cave') gde=null;
  if(gde){ cx.save(); cx.globalCompositeOperation='multiply'; cx.globalAlpha=gde[1]; cx.fillStyle=gde[0]; cx.fillRect(0,0,W,H); cx.restore(); }
  if(st.tint==='red'){ P(0,0,W,H,rgba('#c0281c',.2)); }
  else if(st.tint==='gold'){ P(0,0,W,H,rgba('#ffd870',.14)); }
  else if(st.tint==='cold'){ P(0,0,W,H,rgba('#9fd0ff',.2)); }
  else if(st.tint==='green'){ P(0,0,W,H,rgba('#5fbf5f',.16)); }
}
function drawLights(){ cx.save(); cx.globalCompositeOperation='lighter';
  for(const [x,y,r,c,a] of LIGHTS){ for(let k=3;k>=1;k--){ const rr=rnd(r*k/3); cx.globalAlpha=a/k*.55; cx.fillStyle=c; for(let j=-rr;j<=rr;j++){ const w=rnd(Math.sqrt(rr*rr-j*j)); cx.fillRect(rnd(x-w),rnd(y+j),w*2+1,1); } } }
  cx.restore(); LIGHTS.length=0; }
