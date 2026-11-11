/* ==== murim:gfx-stage — 말풍선, 이펙트, 날씨, 무대와 배우 ==== */
const EMO={
  '!':(x,y)=>{ P(x+2,y,1,4,'#d8452c'); P(x+2,y+5,1,1,'#d8452c'); },
  '?':(x,y)=>{ P(x+1,y,3,1,'#3f6fae'); P(x+3,y+1,1,2,'#3f6fae'); P(x+2,y+3,1,1,'#3f6fae'); P(x+2,y+5,1,1,'#3f6fae'); },
  '...':(x,y)=>{ const n=RED?3:1+((tk>>4)%3); for(let i=0;i<n;i++) P(x+i*2,y+4,1,1,'#4a4a52'); },
  heart:(x,y)=>{ P(x,y+1,2,2,'#e0406a'); P(x+3,y+1,2,2,'#e0406a'); P(x,y+2,5,2,'#e0406a'); P(x+1,y+4,3,1,'#e0406a'); P(x+2,y+5,1,1,'#e0406a'); },
  anger:(x,y)=>{ const c='#d8452c'; P(x,y+1,2,1,c); P(x+1,y,1,2,c); P(x+3,y+1,2,1,c); P(x+3,y,1,2,c); P(x,y+4,2,1,c); P(x+1,y+4,1,2,c); P(x+3,y+4,2,1,c); P(x+3,y+4,1,2,c); },
  sweat:(x,y)=>{ P(x+2,y,1,2,'#6fb0e0'); P(x+1,y+2,3,3,'#6fb0e0'); P(x+2,y+5,1,1,'#6fb0e0'); P(x+1,y+3,1,1,'#cfe8fa'); },
  note:(x,y)=>{ P(x+3,y,1,5,'#4a4a52'); P(x+1,y+4,3,2,'#4a4a52'); P(x+3,y,2,1,'#4a4a52'); },
  zzz:(x,y)=>{ const c='#6a6a9a'; P(x,y,3,1,c); P(x+1,y+1,1,1,c); P(x,y+2,3,1,c); P(x+3,y+3,2,1,c); P(x+3,y+5,2,1,c); P(x+4,y+4,1,1,c); },
  skull:(x,y)=>{ P(x,y,5,4,'#4a4a52'); P(x+1,y+1,1,2,'#f4f4ec'); P(x+3,y+1,1,2,'#f4f4ec'); P(x+1,y+4,3,2,'#4a4a52'); P(x+2,y+5,1,1,'#f4f4ec'); },
  star:(x,y)=>{ P(x+2,y,1,6,'#e0a83c'); P(x,y+2,5,2,'#e0a83c'); P(x+1,y+1,3,4,'#f4d070'); },
  tear:(x,y)=>{ P(x+1,y+1,1,3,'#6fb0e0'); P(x+3,y+2,1,3,'#6fb0e0'); },
  sword:(x,y)=>{ line(x,y+5,x+4,y+1,'#8a9aa4'); P(x+4,y,1,1,'#6a7a84'); P(x,y+3,2,1,'#c9a25a'); },
  coin:(x,y)=>{ P(x+1,y,3,6,'#e0a83c'); P(x,y+1,5,4,'#e0a83c'); P(x+2,y+2,1,2,'#8a5f0e'); }
};
function drawEmote(a){ const e=a.emote; if(!e||!EMO[e]||a.hide) return; const x=rnd(a.x+a.ax)+(a.face>0?1:-8), y=rnd(a.y+a.ay)-lookH(a.L)-11-(RED?0:((tk>>4)%2)), d='#22202a';
  P(x,y-1,7,1,d); P(x,y+8,7,1,d); P(x-1,y,1,8,d); P(x+7,y,1,8,d); P(x,y,7,8,'#f7f7ef'); P(x+(a.face>0?1:5),y+9,1,2,d); P(x+(a.face>0?1:5),y+8,1,1,'#f7f7ef');
  EMO[e](x+1,y+1); }
const FNT={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001001010010','8':'111101111101111','9':'111101111001111','-':'000000111000000','+':'000010111010000'};
function num(x,y,s,c){ for(const ch of String(s)){ const b=FNT[ch]; if(b){ for(let i=0;i<15;i++) if(b[i]==='1') P(x+i%3,y+((i/3)|0),1,1,c); } x+=4; } }
function numO(x,y,s,c){ const d='#22202a'; num(x-1,y,s,d); num(x+1,y,s,d); num(x,y-1,s,d); num(x,y+1,s,d); num(x,y,s,c); }
function fxSlash(x,y,dir,col,big){ FX.push({t:'slash',x,y,dir,c:col||'#ffffff',life:big?15:10,max:big?15:10,r:big?19:12}); }
function fxNum(x,y,s,c){ FX.push({t:'num',x,y,s:String(s),c:c||'#ffffff',life:40,max:40}); }
function fxBurst(x,y,c,n){ FX.push({t:'burst',x,y,c:c||'#ffffff',life:9,max:9,n:n||8}); }
function fxDust(x,y){ for(let i=0;i<4;i++) FX.push({t:'dust',x:x-3+i*2,y,vx:(i-1.5)*.3,life:14+i*2,max:16}); }
function fxSpark(x,y,c,n){ for(let i=0;i<(n||10);i++) FX.push({t:'spark',x:x-8+hsh(i*3.3+tk)*16,y:y-hsh(i*7.1+tk)*14,life:14+rnd(hsh(i+tk)*14),c:c||'#fff3c0'}); }
function drawFx(layer){
  for(const f of FX){ const em=f.t!=='dust'&&f.t!=='smoke'&&f.t!=='blood'; if((em?1:0)!==layer) continue; const p=1-f.life/(f.max||f.life||1);
    if(f.t==='slash'){ const ah=-1.4+p*3.0; for(let a=Math.max(-1.25,ah-1.3);a<Math.min(1.25,ah);a+=.06){ const r=f.r, px=f.x+f.dir*(Math.cos(a)*r*.75-r*.35), py=f.y+Math.sin(a)*r, hd=ah-a<.35; P(px,py,hd?2:1,hd?2:1,hd?'#ffffff':f.c); if(hd) P(px-f.dir,py,1,1,f.c); } }
    else if(f.t==='thrust'){ const l=rnd(22*Math.min(1,p*2)); for(let i=0;i<3;i++) P(f.dir>0?f.x:f.x-l,f.y-2+i*2,l,1,i===1?'#ffffff':f.c); }
    else if(f.t==='num'){ numO(rnd(f.x-String(f.s).length*2),rnd(f.y-p*14),f.s,f.c); }
    else if(f.t==='burst'){ for(let i=0;i<f.n;i++){ const a=i/f.n*6.283, r=2+p*9; P(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r*.8,p<.5?2:1,p<.5?2:1,i%2?f.c:'#ffffff'); } }
    else if(f.t==='ring'){ const r=3+p*13; for(let a=0;a<6.283;a+=.2) P(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r*.7,1,1,f.c); }
    else if(f.t==='ball'){ const x=f.x0+(f.x1-f.x0)*p; disc(rnd(x),f.y,3,f.c); disc(rnd(x),f.y,1,'#ffffff'); for(let i=1;i<5;i++) P(x-f.dir*i*3,f.y-1+(i%2)*2,2,1,f.c); glow(x,f.y,8,f.c,.5); }
    else if(f.t==='dart'){ const x=f.x0+(f.x1-f.x0)*p; for(let i=0;i<3;i++){ P(x-f.dir*i*5,f.y-3+i*3,3,1,'#dfe6ea'); P(x-f.dir*i*5+f.dir*3,f.y-3+i*3,1,1,'#ffffff'); } }
    else if(f.t==='aura'){ P(f.x,f.y-p*22,1,2,f.c); if(f.life%2) P(f.x+1,f.y-p*22-1,1,1,'#ffffff'); }
    else if(f.t==='spark'){ if((f.life>>1)%2){ P(f.x,f.y,1,1,f.c); if(f.life>8){ P(f.x-1,f.y,3,1,f.c); P(f.x,f.y-1,1,3,f.c); } } }
    else if(f.t==='dust'){ P(f.x+f.vx*(f.max-f.life),f.y-p*4,2,2,rgba('#d9cdb0',.7*(1-p))); }
    else if(f.t==='smoke'){ P(f.x+Math.sin(f.life*.2)*2,f.y-(50-f.life)*.5,3,3,rgba('#55504a',.4*f.life/50)); }
    else if(f.t==='blood'){ const t=f.max-f.life; P(f.x+f.vx*t,f.y+f.vy*t+.12*t*t,1,1,'#a8281c'); }
    else if(f.t==='heal'){ const y=f.y-p*14; P(f.x-1,y,3,1,'#7fe0a0'); P(f.x,y-1,1,3,'#7fe0a0'); }
    else if(f.t==='beam'){ const l=rnd(Math.abs(f.x1-f.x0)*Math.min(1,p*2.2)); const x=f.dir>0?f.x0:f.x0-l; P(x,f.y-3,l,6,rgba(f.c,.5)); P(x,f.y-1,l,2,'#ffffff'); glow(f.dir>0?x+l:x,f.y,10,f.c,.6); }
  }
}
function drawWeather(st,layer){ let wx=st.wx; const out=SKYTER[st.ter];
  if(!wx&&out){ wx=st.season===0?'petal1':st.season===2?'leaf1':st.season===3?'snow1':(st.time==='night'?'firefly':null); }
  if(!wx) return; const t=anim();
  if(layer===0){
    if(wx==='rain'){ for(let i=0;i<70;i++){ const x=(hsh(i*1.7)*W*1.3+t*1.4*(1+i%3*.2))%(W+20)-10, y=(hsh(i*5.3)*H+t*3.2*(1+i%3*.2))%H; P(W-x,y,1,3,rgba('#cfe0ea',.55)); } P(0,0,W,H,rgba('#5a6a80',.14)); }
    else if(wx==='snow'||wx==='snow1'){ const n=wx==='snow'?70:26; for(let i=0;i<n;i++){ const x=(hsh(i*1.7)*W+Math.sin(t*.02+i)*4+t*.08*(i%3-1)+W)%W, y=(hsh(i*5.3)*H+t*(.25+hsh(i*3.1)*.3))%H; P(x,y,i%4?1:2,i%4?1:2,'#ffffff'); } }
    else if(wx==='petal'||wx==='petal1'){ const n=wx==='petal'?44:12; for(let i=0;i<n;i++){ const x=(hsh(i*1.7)*W+Math.sin(t*.03+i)*8+t*.2+W)%W, y=(hsh(i*5.3)*H+t*(.18+hsh(i*3.1)*.2))%H; P(x,y,2,1,i%3?'#f4b9c8':'#fbe3ea'); } }
    else if(wx==='leaf'||wx==='leaf1'){ const n=wx==='leaf'?36:9; for(let i=0;i<n;i++){ const x=(hsh(i*1.7)*W+Math.sin(t*.04+i)*10+t*.25+W)%W, y=(hsh(i*5.3)*H+t*(.22+hsh(i*3.1)*.2))%H; P(x,y,2,1,i%2?'#cf772f':'#e0a83c'); } }
    else if(wx==='fog'){ for(let i=0;i<6;i++){ const x=((i*53+t*.07*(1+i%2))%(W+120))-120; P(x,58+i*7,120,5,rgba('#ffffff',.3)); } }
    else if(wx==='frost'){ for(let i=0;i<40;i++){ const x=hsh(i*1.7)*W, y=(hsh(i*5.3)*H+t*.1)%H; P(x,y,1,1,'#dff3fa'); } }
  } else {
    if(wx==='firefly'){ for(let i=0;i<9;i++){ const x=30+hsh(i*2.3)*130+Math.sin(t*.01+i*2)*10, y=58+hsh(i*4.1)*30+Math.cos(t*.013+i)*5; if(((t>>3)+i)%5){ P(x,y,1,1,'#e9ff9a'); glow(x,y,3,'#d0ff70',.5); } } }
    else if(wx==='ember'){ for(let i=0;i<30;i++){ const x=(hsh(i*1.7)*W+Math.sin(t*.03+i)*6)%W, y=H-((hsh(i*5.3)*H+t*(.3+hsh(i*3.1)*.4))%H); P(x,y,1,1,i%2?'#ffb060':'#ff6a3a'); } }
    else if(wx==='gold'){ for(let i=0;i<34;i++){ const x=(hsh(i*1.7)*W+Math.sin(t*.02+i)*5)%W, y=H-((hsh(i*5.3)*H+t*(.15+hsh(i*3.1)*.2))%H); if(((t>>2)+i)%4) P(x,y,1,1,i%3?'#ffe9a0':'#ffffff'); } }
    else if(wx==='blood'){ for(let i=0;i<24;i++){ const x=(hsh(i*1.7)*W+Math.sin(t*.02+i)*5)%W, y=H-((hsh(i*5.3)*H+t*(.2+hsh(i*3.1)*.2))%H); if(((t>>2)+i)%3) P(x,y,1,1,'#e0402a'); } }
  }
}
const SKYTER={plain:1,hills:1,court:1,road:1,peak:1,waste:1};
let DICE=null;
function showDice(d,x){ if(!d) return; DICE={val:1,final:d.roll,ok:d.ok,t:0,roll:RED?0:26,x:x||0,need:d.need,b:d.b}; }
function drawDice(){ const D=DICE; if(!D) return; D.t++; const rolling=D.t<D.roll; const h=SC&&SC.actors.find(a=>a.id==='hero'); const bx=rnd((h?h.x:70)+16+D.x), by0=rnd((h?h.y:GY+8)-40);
  if(rolling&&D.t%2===0) D.val=1+Math.floor(hsh(D.t*7.3)*20); if(!rolling) D.val=D.final;
  const by=by0-(rolling?rnd(Math.abs(Math.sin(D.t*.45))*7):0), st=rolling?0:D.ok?1:2;
  const c=st===1?'#3f9a7a':st===2?'#c0392b':'#ece5cf', d=dk(c,.35), l=lt(c,.4);
  P(bx+3,by,7,1,d); P(bx+1,by+1,11,1,d); P(bx,by+2,13,9,d); P(bx+1,by+11,11,1,d); P(bx+3,by+12,7,1,d);
  P(bx+3,by+1,7,1,l); P(bx+1,by+2,11,9,c); P(bx+3,by+11,7,1,c); P(bx+1,by+2,11,1,l); P(bx+1,by+2,1,9,l);
  const s=String(D.val); num(bx+7-rnd((s.length*4-1)/2),by+4,s,st?'#ffffff':'#2a2630');
  if(!rolling){ if(D.t===D.roll){ fxBurst(bx+6,by+6,D.ok?'#7fe0a0':'#ff8a70',10); } if(D.t>D.roll+110) DICE=null; }
}

/* ---- 무대 ---- */
const FY=GY+9;
const BG={
  village:{ter:'plain',n:'마을',props:[['house',112],['house',150,{w:26}],['tree',20,'broad'],['fence',58,{w:36}]]},
  home:{ter:'plain',n:'집',props:[['house',104,{w:40,chimney:1}],['tree',22,'plum'],['fence',150,{w:42}],['vat',96,{dy:2}]]},
  field:{ter:'plain',n:'밭',crops:1,props:[['hut',152],['scarecrow',122,{dy:9}],['tree',14,'broad']]},
  market:{ter:'plain',n:'장터',path:1,props:[['house',-6,{w:26}],['stall',100],['stall',130,{c:'#3f6fae'}],['stall',160,{c:'#6f8a62'}],['tree',44,'willow']]},
  mountain:{ter:'hills',n:'산중',props:[['waterfall',162],['tree',14,'pine'],['tree',34,'pine'],['rock',118,1]]},
  hermit:{ter:'hills',n:'암자',props:[['hut',124],['slantern',110],['tree',164,'pine'],['tree',16,'pine'],['rock',60,1]]},
  temple:{ter:'court',n:'산문',props:[['gate',8],['hall',112,{w:60}],['slantern',96],['tree',184,'plum']]},
  dojo:{ter:'court',n:'연무장',props:[['hall',122,{w:56}],['dummy',14],['dummy',30],['rack',98],['tree',186,'pine']]},
  library:{ter:'court',n:'비급각',time:'night',props:[['hall',108,{w:50,floor2:1,ajar:1}],['slantern',94],['tree',8,'bamboo']]},
  kitchen:{ter:'court',n:'주방',props:[['house',114,{w:36,chimney:1}],['woodpile',86],['vat',160],['vat',170],['tree',10,'broad']]},
  inn:{ter:'plain',n:'객잔',path:1,props:[['inn',116],['tree',12,'willow']]},
  stable:{ter:'plain',n:'객잔 마구간',path:1,time:'night',props:[['inn',140],['stable',66]]},
  innroom:{ter:'room',room:'inn',n:'객잔 안',props:[['table',30,{dy:8}],['counter',132,{w:54}],['lantern',70,{dy:-76}],['lantern',124,{dy:-76}]]},
  shop:{ter:'room',room:'shop',n:'전당포',props:[['counter',96,{w:84}],['lantern',60,{dy:-76}]]},
  den:{ter:'room',room:'den',n:'도박장',time:'night',props:[['table',104,{dy:8,dice:1}],['lantern',104,{dy:-72}]]},
  hall:{ter:'room',room:'hall',n:'대전',props:[['altar',160,{dy:2}],['lantern',40,{dy:-76}],['lantern',150,{dy:-76}]]},
  cave:{ter:'cave',n:'동굴',props:[]},
  arena:{ter:'court',n:'비무대',props:[['crowd',18,{w:156}],['platform',26,{w:140,dy:15}],['flag',22,{h:36,dy:15}],['flag',168,{h:36,c:'#3f6fae',dy:15}],['drum',12,{dy:15}]]},
  road:{ter:'road',n:'관도',props:[['signpost',160,{dy:3}]]},
  forest:{ter:'forest',n:'숲',props:[['tree',18,'broad'],['bush',50,{dy:16,front:1}],['bush',170,{dy:18,front:1}]]},
  bamboo:{ter:'forest',n:'대숲',props:[['tree',4,'bamboo'],['tree',150,'bamboo'],['rock',120,1]]},
  battle:{ter:'waste',n:'싸움터',tint:'red',wx:'ember',props:[['banner',28,{c:'#3f6fae'}],['banner',164],['spears',56,{dy:14}],['fire',100,{dy:-4}],['fire',14,{dy:10}]]},
  grave:{ter:'hills',n:'무덤',path:0,props:[['grave',126,{dy:6}],['tree',172,'bare'],['grave',34,{dy:2}]]},
  peak:{ter:'peak',n:'산꼭대기',props:[['tree',150,'pine']]},
  river:{ter:'plain',n:'강가',biome:'water',props:[['tree',22,'willow'],['bridge',122,{dy:6}],['boat',64,{dy:14,front:1}]]},
  yard:{ter:'plain',n:'집 마당',time:'night',props:[['house',104,{w:40}],['tree',20,'broad'],['fence',150,{w:40}]]},
  fort:{ter:'hills',n:'산채',props:[['palisade',92,{w:92,gap:1}],['tower',178],['fire',64,{dy:12}]]},
  snow:{ter:'plain',n:'설원',biome:'snow',wx:'snow',props:[['tree',26,'bare'],['rock',146,2]]},
  wedding:{ter:'plain',n:'혼례',props:[['house',96,{w:46,open:1}],['drapes',120],['table',160,{dy:8}]]},
  school:{ter:'plain',n:'서당',props:[['house',100,{w:46,open:1}],['tree',18,'plum']]},
  forge:{ter:'plain',n:'대장간',path:1,props:[['house',126,{w:32,chimney:1}],['furnace',96,{dy:2}],['tree',12,'broad']]},
  tomb:{ter:'hills',n:'옛 무덤',props:[['tomb',134,{dy:2}],['tree',16,'bare']]},
  pond:{ter:'hills',n:'한담',path:0,props:[['waterfall',160],['pond',104,{w:66,dy:6}],['tree',12,'pine']]},
  well:{ter:'plain',n:'마을 우물',props:[['house',136],['well',100,{dy:8}],['tree',18,'broad']]},
  manor:{ter:'court',n:'장원',props:[['hall',108,{w:66}],['slantern',94],['tree',10,'pine'],['tree',186,'plum']]}
};
function mkActor(id,L,o){ o=o||{}; const a={id,L,x:o.x==null?70:o.x,y:FY+(o.dy||0),face:o.face||1,pose:o.pose||'idle',f:o.f||0,ax:0,ay:0,flash:0,emote:o.emote||null,act:o.act||null,tag:o.tag||'',tagc:o.tagc||'',t:0,ph:rnd(hsh(seedOf(id)+ (o.x||0))*60),tx:null,xmin:o.xmin==null?24:o.xmin,xmax:o.xmax==null?168:o.xmax,hide:!!o.hide,auraC:o.auraC,spd:o.spd,alpha:o.alpha,noShadow:o.noShadow};
  a.pose0=a.pose; a.face0=a.face;
  if(o.enter&&!RED){ a.goto=a.x; a.x=o.enter==='right'?W+16:-16; }
  return a; }
function setStage(spec){
  const key=spec.key||JSON.stringify(spec,(k,v)=>k==='key'||k==='season'?undefined:v);
  if(SC&&SC.key===key){ if(spec.season!=null&&SC.biome!=='snow') SC.season=spec.season; return SC; }
  const B=BG[spec.bg]||BG.village;
  const st={key,bg:spec.bg,ter:B.ter,time:spec.time||B.time||'day',season:spec.season==null?1:spec.season,biome:spec.biome||B.biome||null,path:B.path,crops:B.crops,room:B.room,tint:spec.tint||B.tint||null,wx:spec.wx||B.wx||null,scroll:spec.scroll||0,scrollX:0,props:(spec.noProps?[]:B.props||[]).concat(spec.props||[]),actors:[],name:spec.name||B.n};
  st.dark=st.time==='night'||st.time==='dusk';
  if(st.biome==='snow') st.season=3;
  if(st.biome==='jungle') st.props=st.props.map(p=>p[0]==='tree'&&(p[2]==='broad'||p[2]==='willow')?[p[0],p[1],'palm']:p);
  if(st.biome==='water'&&spec.bg==='village') st.props=st.props.concat([['bridge',60,{dy:8}]]);
  if(spec.hero!==null){ const h=spec.hero||{}; if(h.look||spec.heroLook) st.actors.push(mkActor('hero',h.look||spec.heroLook,h)); }
  (spec.cast||[]).forEach((c,i)=>{ if(!c||!c.look) return; st.actors.push(mkActor(c.id||('c'+i),c.look,c)); });
  SC=st; fadeA=RED?0:1; FX.length=0; DICE=null; renderTags(); return st;
}
const actorOf=id=>SC&&SC.actors.find(a=>a.id===id);
function stepActor(a){ a.t++; if(a.flash>0) a.flash--; if(RED) return;
  if(a.goto!=null){ const d=a.goto-a.x; if(Math.abs(d)<1){ a.x=a.goto; a.goto=null; a.pose=a.pose0; a.f=0; a.face=a.face0; } else { a.x+=Math.sign(d)*(a.spd||.7); a.face=Math.sign(d); a.pose='walk'; a.f=(a.t>>3)%4; } return; }
  if(a.lock) return;
  switch(a.act){
    case 'wander': if(a.tx==null){ if(a.t%80===0&&hsh(a.t+a.x)>.35) a.tx=a.xmin+hsh(a.t*1.3)*(a.xmax-a.xmin); a.pose='idle'; a.f=((a.t+a.ph)>>5)%2; } else { const d=a.tx-a.x; if(Math.abs(d)<1) a.tx=null; else { a.x+=Math.sign(d)*.35; a.face=Math.sign(d); a.pose='walk'; a.f=(a.t>>3)%4; } } break;
    case 'play': { if(a.tx==null) a.tx=a.xmin+hsh(a.t*1.7+a.ph)*(a.xmax-a.xmin); const d=a.tx-a.x; if(Math.abs(d)<1.5) a.tx=null; else { a.x+=Math.sign(d)*.8; a.face=Math.sign(d); } a.pose='walk'; a.f=(a.t>>2)%4; a.ay=-Math.abs(Math.sin(a.t*.25))*2; break; }
    case 'train': { const c=(a.t+a.ph)%72; if(c<40){ a.pose='guard'; a.f=0; a.ax=0; } else if(c<52){ const palm=a.L.weapon==='glove'||!a.L.weapon||a.L.weapon==='darts'; a.pose=palm?'cast':'atk'; a.ax=a.face*Math.min(5,(c-40)*1.5); if(c===41){ const hx0=a.x+a.face*17, hy=a.y-12; if(palm) FX.push({t:'ring',x:hx0,y:hy,life:12,max:12,c:a.auraC||'#ffd870'}); else fxSlash(hx0,hy,a.face,a.auraC||'#ffffff'); } } else { a.pose='guard'; a.ax=a.face*Math.max(0,5-(c-52)); } break; }
    case 'meditate': a.pose='sit'; if(a.t%6===0) FX.push({t:'aura',x:a.x-7+hsh(a.t)*14,y:a.y-3,life:28,max:28,c:a.auraC||'#ffe9a0'}); break;
    case 'tool': a.pose='tool'; a.f=((a.t+a.ph)%40)<13?1:0; if(a.L.tool==='hammer'&&(a.t+a.ph)%40===1) fxBurst(a.x+a.face*9,a.y-5,'#ffb060',6); break;
    case 'walk': a.pose='walk'; a.f=(a.t>>3)%4; break;
    case 'shiver': a.ax=(a.t>>2)%2?1:0; break;
    case 'cheer': a.pose='cheer'; a.ay=-Math.abs(Math.sin((a.t+a.ph)*.2))*2; break;
    case 'hop': a.ay=-Math.abs(Math.sin((a.t+a.ph)*.15))*3; break;
    case 'float': a.ay=-6+Math.sin(a.t*.05)*2; if(a.t%5===0) FX.push({t:'aura',x:a.x-7+hsh(a.t)*14,y:a.y-2,life:26,max:26,c:a.auraC||'#ffe9a0'}); break;
    case 'fly': a.x+=.5*a.face; a.ay=-10-a.t*.25; break;
    default: if(a.pose==='idle') a.f=((a.t+a.ph)>>5)%2; else if(a.pose==='walk') a.f=(a.t>>3)%4; if(a.L.animal) a.f=((a.t+a.ph)>>4)%2;
  }
}
function drawActor(a){ const s=charSprite(a.L,a.pose,a.f), x=rnd(a.x+a.ax), y=rnd(a.y+a.ay), lying=a.pose==='down'||a.pose==='lie'||a.pose==='dead';
  if(!a.noShadow&&SC.ter!=='cave'){ const sw=lying?11:a.L.animal==='tiger'?12:6; P(x-sw,a.y,sw*2,1,rgba('#1c1a22',.28)); P(x-sw+2,a.y+1,sw*2-4,1,rgba('#1c1a22',.18)); }
  cx.save(); if(a.alpha!=null) cx.globalAlpha=a.alpha;
  if(a.face<0){ cx.translate(x,y); cx.scale(-1,1); cx.drawImage(a.flash>0&&a.flash%2?whiteSprite(s):s,-OX,-OY,SW,SH); } else cx.drawImage(a.flash>0&&a.flash%2?whiteSprite(s):s,x-OX,y-OY,SW,SH);
  cx.restore(); }
function drawFrame(){
  if(onFrame){ try{ onFrame(); }catch(e){ if(!drawFrame.err){ drawFrame.err=1; console.error(e); } } }
  if(MAPON&&MAPV){ drawMapFrame(); return; }
  const st=SC; if(!st) return; cx=g0;
  if(st.scroll&&!RED) st.scrollX+=st.scroll;
  g0.save();
  if(shake>0){ if(!RED) g0.translate(rnd((hsh(tk)-.5)*shake*.9),rnd((hsh(tk*1.7)-.5)*shake*.9)); shake--; }
  // 배경은 1배로 그린 뒤 모서리를 다듬어 2배로 올린다
  cx=BGX; try{ TER[st.ter](st); for(const p of st.props){ const o=p[2]; if(o&&o.front) continue; PROP[p[0]](p[1],GY+2+((o&&o.dy)||0),st,o); } } finally{ cx=g0; }
  epxInto(new Uint32Array(BGX.getImageData(0,0,W,H).data.buffer),W,H,BG2D); BG2X.putImageData(BG2I,0,0); g0.drawImage(BG2,0,0,W,H);
  const as=st.actors.slice().sort((a,b)=>a.y-b.y);
  for(const a of as){ stepActor(a); if(!a.hide) drawActor(a); }
  for(const p of st.props){ const o=p[2]; if(o&&o.front) PROP[p[0]](p[1],GY+2+(o.dy||0),st,o); }
  drawWeather(st,0); drawFx(0);
  gradeScene(st);
  if(SKYTER[st.ter]) drawSkyLights(st);
  drawLights(); drawWeather(st,1); drawFx(1);
  for(const a of as) drawEmote(a);
  drawDice();
  if(bars<barsT) bars++; else if(bars>barsT) bars--;
  if(bars>0){ P(0,0,W,bars,'#15141a'); P(0,H-bars,W,bars,'#15141a'); }
  if(flashA>0){ P(0,0,W,H,rgba(flashC,Math.min(1,flashA))); flashA-=.07; }
  if(fadeA>0){ P(0,0,W,H,rgba('#17161c',Math.min(1,fadeA))); fadeA-=.12; }
  g0.restore();
  for(let i=FX.length-1;i>=0;i--) if(--FX[i].life<=0) FX.splice(i,1);
  syncTags();
}
let barsT=0, onFrame=null;
const BGC=document.createElement('canvas'); BGC.width=W; BGC.height=H; const BGX=BGC.getContext('2d',{willReadFrequently:true});
const BG2=document.createElement('canvas'); BG2.width=W*2; BG2.height=H*2; const BG2X=BG2.getContext('2d'), BG2I=new ImageData(W*2,H*2), BG2D=new Uint32Array(BG2I.data.buffer);
function frame(){ tk++; if(!$m('murimApp').hidden){ try{ drawFrame(); }catch(e){ if(!frame.err){ frame.err=1; console.error(e); } } } requestAnimationFrame(frame); }

/* ---- 장면 위 DOM: 이름표, 떠오르는 글자, 획득 알림, 외침 ---- */
function renderTags(){ const el=$m('mhTags'); if(!el) return; el.textContent=''; if(!SC) return;
  for(const a of SC.actors){ a._tag=null; if(!a.tag) continue; const s=document.createElement('span'); s.className='mh-tag'+(a.tagc?' '+a.tagc:''); s.textContent=a.tag; el.appendChild(s); a._tag=s; a._tx=null; } }
function syncTags(){ if(!SC) return; for(const a of SC.actors){ if(!a._tag) continue; const x=rnd(a.x+a.ax), y=rnd(a.y+a.ay)-lookH(a.L)-(a.emote?13:3); if(a._tx!==x||a._ty!==y){ a._tx=x; a._ty=y; a._tag.style.left=(x/W*100)+'%'; a._tag.style.top=(y/H*100)+'%'; } } }
function floatText(x,y,txt,cls){ const el=$m('mhFl'); if(!el) return; const s=document.createElement('span'); s.className='mh-float '+(cls||''); s.textContent=txt; s.style.left=(x/W*100)+'%'; s.style.top=(y/H*100)+'%'; el.appendChild(s); setTimeout(()=>s.remove(),1500); }
function heroFloat(txt,cls,dy){ if(MAPON&&MAPV&&MAPV.hero.sx!=null) return floatText(MAPV.hero.sx,MAPV.hero.sy-30-(dy||0),txt,cls); if(!SC) return floatText(96,62-(dy||0),txt,cls); const h=actorOf('hero'); floatText(h?h.x:70,(h?h.y:FY)-30-(dy||0),txt,cls); }
function toast(html,cls,ms){ const el=$m('mhToast'); if(!el) return; const d=document.createElement('div'); d.className='mh-toastc '+(cls||''); d.innerHTML=html; el.appendChild(d); while(el.children.length>3) el.firstChild.remove(); setTimeout(()=>{ d.classList.add('out'); setTimeout(()=>d.remove(),400); },ms||3200); }
function callout(txt,cls,ms){ const el=$m('mhCall'); if(!el) return; el.className='mh-call '+(cls||''); el.textContent=txt; el.hidden=false; el.style.animation='none'; void el.offsetWidth; el.style.animation=''; clearTimeout(callout.t); callout.t=setTimeout(()=>{ el.hidden=true; },ms||1300); }
