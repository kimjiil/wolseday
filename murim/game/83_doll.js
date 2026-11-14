/* ==== murim:doll — 그림 부품(몸·옷·머리·눈·무기)을 맞춰 인물을 그린다 ====
   부품 그림은 83_doll_data.js 의 DOLLD(모음 그림 한 장 + 자리표). 머리통 폭 24픽셀로 맞춰 줄여 두었다.
   자세 8가지: 0 정면 · 1 정면 걷기 · 2 뒷모습 · 3 뒷모습 걷기 · 4·5 옆 걷기 · 6 겨누기 · 7 지르기
   바꿔 칠하는 자리는 열쇠 색으로 칠해 두었다: 옷 파랑(0,0,250/200/150) · 띠 빨강(250/200/150,0,0) · 머리 초록(0,250/200/150,0)
   부품이 없는 자세(앉기·무릎 꿇기)와 아이·짐승은 예전 코드 그림으로 그린다 */
var DOLL={ready:false,on:(()=>{ try{ return localStorage.getItem('murim_doll')!=='0'; }catch(e){ return true; } })(),atlas:null,parts:{},cache:new Map()};
(function(){ if(typeof DOLLD==='undefined'||typeof document==='undefined') return; const im=new Image();
  im.onload=()=>{ const c=document.createElement('canvas'); c.width=im.width; c.height=im.height; const k=c.getContext('2d'); k.drawImage(im,0,0); DOLL.atlas=k.getImageData(0,0,c.width,c.height); DOLL.ready=true; try{ SPR.clear(); _pt.clear(); }catch(e){} };
  im.src=DOLLD.src; })();
function dollToggle(on){ DOLL.on=on; try{ localStorage.setItem('murim_doll',on?'1':'0'); }catch(e){} DOLL.cache.clear(); try{ SPR.clear(); _pt.clear(); }catch(e){} }
function dollPart(key){ if(key in DOLL.parts) return DOLL.parts[key]; const r=DOLLD.R[key]; if(!r||!DOLL.atlas) return DOLL.parts[key]=null;
  const [x,y,w,h,ox,oy]=r, A=DOLL.atlas, d=new Uint8ClampedArray(w*h*4);
  for(let j=0;j<h;j++){ const s=((y+j)*A.width+x)*4; d.set(A.data.subarray(s,s+w*4),j*w*4); }
  return DOLL.parts[key]={d,w,h,ox,oy}; }
const DHAIR=['topknot','pony','messy','short','braid','longhalf','twin','lowbun','bob','scholar'];
// 눈 20가지: d 짙은 선 · i 눈동자 · w 눈빛 · . 그대로. mir 는 왼눈을 뒤집는다
const DEYES=[
  {r:['ddd','dwi','dii','ddd']},{r:['.d.','dwd','did','.d.']},{r:['ddd','dwi','dii','dwd']},{r:['...','...','ddd','...'],keep:1},
  {r:['...','.d.','d.d','...'],keep:1},{r:['..d','.dd','dwi','ddd'],mir:1},{r:['d..','dd.','iwd','ddd'],mir:1},{r:['...','ddd','dwi','...'],keep:1},
  {r:['...','.d.','.d.','...'],keep:1},{r:['.d.','dwd','did','did','.d.']},{r:['d.d','ddd','dwi','ddd']},{r:['ddd','wwd','wdd','ddd']},
  {r:['...','dd.','dw.','...'],keep:1},{r:['..d','ddi','dwi','dd.'],mir:1},{r:['dddd','dwii','dddd']},{r:['ddd','dww','dwi','ddd']},
  {r:['ddd','ddi','...','...'],keep:1},{r:['...','ddd','.di','...'],keep:1},{r:['.dd.','dwid','diid','.dd.']},{r:['...','ddd','...','d.d'],keep:1}];
const DEYEC={d:[34,24,28],w:[255,255,255]};
function hexRgb(h){ const A=hx(h); return [A[0],A[1],A[2]]; }
function tones(h){ return [hexRgb(lt(h,.28)),hexRgb(h),hexRgb(dk(h,.3))]; }
/* L(모습)에서 부품을 고른다. L.doll 이 있으면 그대로 쓴다 */
function dollSpec(L){ if(L.doll) return L.doll; const s=seedOf(L.key), f=L.sex==='f';
  const HM={top:['topknot','short','messy'],crown:['topknot'],pony:['pony','braid'],long:f?['longhalf','bob','scholar']:['scholar','messy'],bun:['lowbun','twin'],buns:['twin'],messy:['messy'],band:['short','messy'],hat:['short','topknot'],cap:['short','topknot'],hood:['short'],granny:['lowbun'],tuft:['short'],bald:[null]};
  const hs=HM[L.hair]||(f?['longhalf','twin','lowbun','bob']:['topknot','pony','short','messy']);
  const body=L.body||(L.extra==='vest'||L.extra==='apron'?'vest':'plain');
  const weapon=L.dw!==undefined?L.dw:L.weapon==='sword'?['sword',[1,2,4,5][s%4]]:L.weapon==='saber'?['saber',[0,1,2,4][s%4]]:null;
  return {sex:f?'f':'m',body,hair:hs[s%hs.length],hairC:L.hairC||'#231e24',robe:L.robe||'#8f8a78',trim:L.trim||dk(L.robe||'#8f8a78',.35),eye:L.eye!=null?L.eye:dollEye(L,s),eyeC:L.eyeC||'#68402a',weapon,glow:L.wc||null};
}
/* 눈 20가지: 1 반짝 · 2 서늘 · 3 웃는 · 4 졸린 · 5 사나운 · 6 점 · 7 처진 · 8 고양이 · 9 흉터 · 10 놀란 · 11 고요한 · 12 능글 · 13 흰 눈썹 · 14 해맑은 · 15 차가운 · 16 붉은 마안 · 17 지친 · 18 굳센 · 19 먼 눈 · 20 순한
   0 은 몸 그림의 원래 눈. 흔한 눈에서 고르고, 흰 눈썹은 늙은이, 붉은 마안은 마공, 흉터·먼 눈은 드물게 */
const DEYE_COMMON=[0,0,0,1,2,3,4,5,6,7,8,10,11,12,14,15,17,18,20];
function dollEye(L,s){ if(L.ol==='#5a1414'||L.ol==='#7a1e1e') return 16; const old=/^#(e|d|c|b)/.test(L.hairC||'')&&L.sex!=='f'; if(old) return 13;
  const r=(s>>7)%97; if(r===0) return 19; if(r<3) return 9; return DEYE_COMMON[(s>>3)%DEYE_COMMON.length]; }
function dollPose(pose,f,dir){
  f=f|0;
  if(pose==='walk'){ const k=f&3; if(dir==='d') return [k&1?1:0,k===3]; if(dir==='u') return [k&1?3:2,k===3]; return [k&1?5:4,false]; }
  if(pose==='idle') return [dir==='u'?2:0,false];
  if(pose==='guard'||pose==='hit') return [6,false];
  if(pose==='atk'||pose==='cast') return [7,false];
  if(pose==='sit'||pose==='kneel'||pose==='meditate') return null;
  return [0,false];
}
function dollSprite(L,pose,f,dir){
  const lying=pose==='down'||pose==='lie'||pose==='dead'||pose==='sleep', pp=lying?[0,false]:dollPose(pose,f,dir); if(!pp) return null;
  const key=L.key+'|'+pp[0]+'|'+(pp[1]?1:0)+'|'+(lying?1:0); let c=DOLL.cache.get(key); if(c) return c;
  const S=dollSpec(L), p=pp[0], sx=S.sex, foot=DOLLD.M.foot[sx+p]; if(!foot) return null;
  const W=SW*2, H=SH*2, buf=new ImageData(W,H), D=buf.data, bx=OX*2-Math.round(foot[0]), by=OY*2-foot[1];
  const robe=tones(vivid(S.robe,.3)), sash=tones(vivid(S.trim,.3)), hair=tones(S.hairC);
  const put=(part,x0,y0,flip)=>{ if(!part) return; const {d,w,h}=part;
    for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const s=(j*w+(flip?w-1-i:i))*4; if(d[s+3]<128) continue; const X=x0+i, Y=y0+j; if(X<0||Y<0||X>=W||Y>=H) continue;
      let r=d[s],g=d[s+1],b=d[s+2];
      if(r===0&&g===0&&(b===250||b===200||b===150)){ [r,g,b]=robe[b===250?0:b===200?1:2]; }
      else if(g===0&&b===0&&(r===250||r===200||r===150)){ [r,g,b]=sash[r===250?0:r===200?1:2]; }
      else if(r===0&&b===0&&(g===250||g===200||g===150)){ [r,g,b]=hair[g===250?0:g===200?1:2]; }
      const o=(Y*W+X)*4; D[o]=r; D[o+1]=g; D[o+2]=b; D[o+3]=255; } };
  const at=k=>{ const q=dollPart(k); return q?[q,bx+q.ox,by+q.oy]:null; };
  const L2=(k)=>{ const a=at(k); if(a) put(a[0],a[1],a[2]); };
  // 무기: 등에 메거나(뒤) 손에 쥔다(앞)
  let wFront=null, wBack=null;
  if(S.weapon){ const [kind,i]=S.weapon, top=DOLLD.M.top[sx+p], sh=Math.round(top+(foot[1]-top)*.55);
    const nm=p===2||p===3?'backv':p===6?'guard':p===7?'atk':'back', wk='w'+kind+i+nm, q=dollPart(wk), g=DOLLD.M.grip[wk];
    let ax, ay; if(p===6||p===7){ const fi=DOLLD.M.fist[sx+p]; if(fi){ ax=fi[0]; ay=fi[1]; } } if(ax==null){ ax=foot[0]+(p===2||p===3?-4:p>=4?-3:4); ay=sh; }
    if(q&&g){ const w={q,x:bx+Math.round(ax-g[0]),y:by+Math.round(ay-g[1])}; if(p===2||p===3||p===6||p===7) wFront=w; else wBack=w; } }
  if(wBack) put(wBack.q,wBack.x,wBack.y);
  L2('h'+sx+S.hair+p+'b');
  const body=dollPart('b'+sx+S.body+p)?S.body:'plain'; L2('b'+sx+body+p);
  // 눈
  const eyes=S.stamp?(DOLLD.M.eyes[sx+body+p]||DOLLD.M.eyes[sx+'plain'+p]||[]):[], E=DEYES[Math.max(0,S.eye)%DEYES.length], ic=hexRgb(S.eyeC||'#68402a');      // 기본은 원래 그림의 눈. 찍은 눈은 stamp 일 때만
  eyes.forEach((e,n)=>{ const th=Math.max(3,Math.min(6,e[2])), rows=E.keep?E.r:Array.from({length:th},(_,j)=>E.r[Math.min(E.r.length-1,Math.floor(j*E.r.length/th))]), h=rows.length, w=rows[0].length, mir=E.mir&&p<=1&&n===0&&eyes.length>1;      // 눈 높이에 맞춰 늘인다(가는 눈은 그대로)
    const x0=bx+Math.round(e[0]-(w-1)/2), y0=by+Math.round(e[1]+e[2]/2-h/2);
    for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const ch=rows[j][mir?w-1-i:i]; if(ch==='.') continue; const c3=ch==='i'?ic:DEYEC[ch], o=((y0+j)*W+x0+i)*4; if(o<0||o>=D.length) continue; D[o]=c3[0]; D[o+1]=c3[1]; D[o+2]=c3[2]; D[o+3]=255; } });
  // 눈 20가지(정면·옆만. 싸우는 자세는 원래 성난 눈)
  if(S.eye>0&&(p<=1||p===4||p===5)){ const ebox=DOLLD.M.eyes[sx+body+p]||DOLLD.M.eyes[sx+'plain'+p]||[], side=p>=4;
    ebox.slice().sort((a,b)=>a[0]-b[0]).forEach((e,n,arr)=>{ const left=!side&&arr.length>1&&n===0, q=dollPart('e'+S.eye+(side?'s':left&&DOLLD.R['e'+S.eye+'fl']?'fl':'f')); if(!q) return;
      const bot=e[1]+e[2]-1; put(q,bx+Math.floor(e[0]-q.w/2+.5),by+bot-9,left&&!DOLLD.R['e'+S.eye+'fl']); }); }
  L2('h'+sx+S.hair+p+'f');
  if(wFront) put(wFront.q,wFront.x,wFront.y);
  if(S.glow&&wFront){ /* 높은 등급 무기는 테두리에 빛을 두른다 */ }
  let out=document.createElement('canvas'); out.width=W; out.height=H; const k=out.getContext('2d'); k.putImageData(buf,0,0);
  if(pp[1]){ const t=document.createElement('canvas'); t.width=W; t.height=H; const k2=t.getContext('2d'); k2.translate(OX*4,0); k2.scale(-1,1); k2.drawImage(out,0,0); out=t; }
  if(lying){ const t=document.createElement('canvas'); t.width=W; t.height=H; const k2=t.getContext('2d'); k2.imageSmoothingEnabled=false; k2.translate((OX+12)*2,(OY-8)*2); k2.rotate(-Math.PI/2); k2.translate(-OX*2,-OY*2); k2.drawImage(out,0,0); out=t; }
  if(DOLL.cache.size>1200) DOLL.cache.clear(); DOLL.cache.set(key,out); return out; }
// 아이템에 맞는 무기 모양: 이름에 든 말로 고른다
function dollWeapon(it){ if(!it||(it.k!=='검'&&it.k!=='도')) return null; const n=it.n;
  if(it.k==='검') return ['sword',/목검|대나무|나무|목/.test(n)?0:/단검|비수|단도|요검/.test(n)?3:/연검|유검|연/.test(n)?5:/장검|중검|대검|쌍수/.test(n)?2:it.t>=3?4:1];
  return ['saber',/언월|월도|관도|극/.test(n)?5:/대도|귀두|중도|참마|파산/.test(n)?2:/유엽|곡도|버들|환도/.test(n)?1:/식칼|짧은|단도|부엌/.test(n)?3:it.t>=3?4:0]; }
// 갑옷 이름으로 옷 꼴을 고른다
function dollBody(it){ if(!it) return 'plain'; const n=it.n; return /갑|개|린|흉|투구|철/.test(n)?'armor':/조끼|앞치마|가죽|털|모전|등거리|도롱이|누비|누더기/.test(n)?'vest':'plain'; }
