/* ==== murim:card — 인생 등급과, 보내기 좋은 인물 카드(그림) ====
   한 생이 끝나면 살아온 것을 점수로 매겨 C~SSR 등급을 준다. 카드는 캔버스에 그려 PNG 로 만든다.
   휴대폰에서는 공유 창(카카오톡 등)으로 보내고, PC 에서는 그림을 클립보드에 복사하거나 내려받는다. */
const LGRADE=[[0,'C','무명','이름 없이 살다 갔다'],[12,'B','범부','제 몫의 삶을 살았다'],[28,'A','명사','고을에 이름이 남았다'],[50,'S','고수','강호가 그 이름을 안다'],[80,'SS','종사','한 시대가 그를 따랐다'],[115,'SSR','전설','이야기꾼들이 대대로 전한다']];
const LGCOL={C:'#8a8a80',B:'#4f8a5a',A:'#3f6f9a',S:'#8a5ad0',SS:'#c9862a',SSR:'#d9a441'};
// 점수: 경지가 가장 크고, 이름·자리·싸움·기연·재산·수명·가족·행복·무공·물건·협행이 조금씩 보탠다
function lifeScore(){ const P=[], add=(l,v)=>{ v=Math.round(v*10)/10; if(v>0) P.push([l,v]); }, kids=m.rels.filter(r=>r.role==='자식').length;
  add('경지',m.f.martial?[0,4,8,14,22,30,40,52,65][m.lv]||0:0);
  add('이름',Math.min(12,(m.fame||0)*.1)+(m.alias?4:0));
  let seat=(m.f.leader?8:0)+(m.f.champ?6:0)+(m.f.nemDone?10:0)+(m.f.best?8:0)+Math.min(5,(m.f.top||0)); try{ if(m.sect&&srank()==='장로') seat+=3; if(m.f.ally&&!m.f.leader) seat+=({맹원:0,당주:1,장로:2,부맹주:4})[arank()]||0; }catch(e){} add('자리',seat);
  add('싸움',Math.min(8,(m.wins||0)*.4));
  add('기연',Math.min(8,(m.giN||0)*1.5));
  add('재산',cl((pctNow()-50)/50*8,0,8));
  add('수명',cl((m.age-40)/10*1.5,0,6));
  add('가족',(m.spouse?2:0)+Math.min(4,kids*1.5));
  add('행복',cl((m.joy-50)/50*6,0,6));
  add('무공',m.arts.reduce((v,a)=>Math.max(v,artG(a)),0)*1.5);
  add('물건',SLOTS.reduce((v,s)=>Math.max(v,m.inv&&m.inv[s]&&ITEMS[m.inv[s]]?ITEMS[m.inv[s]].t:0),0));
  add('협행',Math.min(5,Math.max(0,m.hy||0)*.1));
  const score=Math.round(P.reduce((a,x)=>a+x[1],0)); let L=LGRADE[0]; for(const x of LGRADE) if(score>=x[0]) L=x;
  return {score,g:L[1],title:L[2],line:L[3],parts:P}; }

/* ---- 카드 그리기 ---- */
const CARDW=720, CARDH=1000;
function cardWrap(k,txt,maxW){ const out=[]; let line=''; for(const ch of String(txt)){ if(k.measureText(line+ch).width>maxW&&line){ out.push(line); line=ch.trim()?ch:''; } else line+=ch; } if(line) out.push(line); return out; }
function drawLifeCard(){ const L=lifeScore(), c=document.createElement('canvas'); c.width=CARDW; c.height=CARDH; const k=c.getContext('2d'), col=LGCOL[L.g], ssr=L.g==='SSR';
  const DISP='"Song Myung","Nanum Myeongjo","Batang",serif', BODY='"Gowun Batang","Nanum Myeongjo","Batang",serif', NUM='"IBM Plex Mono",Consolas,monospace', INK='#1c201c', MUT='#556052', PAPER='#eef0e6', SEAL='#b8321f';
  const frame=()=>{ if(!ssr) return col; const g=k.createLinearGradient(0,0,CARDW,CARDH); g.addColorStop(0,'#c9432e'); g.addColorStop(.5,'#d9a441'); g.addColorStop(1,'#8a5ad0'); return g; };
  // 바탕과 테
  k.fillStyle=frame(); k.fillRect(0,0,CARDW,CARDH); k.fillStyle=PAPER; k.fillRect(14,14,CARDW-28,CARDH-28); k.strokeStyle=INK; k.lineWidth=2; k.strokeRect(22,22,CARDW-44,CARDH-44);
  // 높은 등급은 인물 뒤로 빛살
  const px=60, py=150, ps=248, gi=TIER.indexOf(L.g);
  if(gi>=3){ k.save(); k.beginPath(); k.rect(23,23,CARDW-46,430); k.clip(); k.translate(px+ps/2,py+ps/2); const n=gi>=5?36:gi>=4?28:20; for(let i=0;i<n;i++){ k.rotate(Math.PI*2/n); k.fillStyle=ssr?['rgba(201,67,46,.13)','rgba(217,164,65,.16)','rgba(138,90,208,.13)'][i%3]:col+'22'; k.beginPath(); k.moveTo(0,0); k.lineTo(-22,-760); k.lineTo(22,-760); k.closePath(); k.fill(); } k.restore(); }
  // 머리글
  k.fillStyle=SEAL; k.fillRect(48,48,40,56); k.fillStyle=PAPER; k.font=`22px ${DISP}`; k.textAlign='center'; k.textBaseline='middle'; k.fillText('武',68,64); k.fillText('林',68,89);
  k.textAlign='left'; k.fillStyle=INK; k.font=`34px ${DISP}`; k.fillText('무림초출',102,66); k.fillStyle=MUT; k.font=`17px ${BODY}`; k.fillText('강호의 어느 해, 누군가로 태어났다',102,96);
  // 등급 도장
  const gx=CARDW-128, gy=92; k.save(); k.translate(gx,gy); k.rotate(.06); k.fillStyle=frame(); k.fillRect(-66,-50,132,100); k.fillStyle=PAPER; k.fillRect(-60,-44,120,88); k.fillStyle=frame(); k.fillRect(-56,-40,112,80);
  k.fillStyle='#fff'; k.textAlign='center'; k.font=`700 ${L.g.length>=3?44:L.g.length===2?54:62}px ${DISP}`; k.fillText(L.g,0,-6); k.font=`17px ${BODY}`; k.fillText(L.title,0,26); k.restore();
  // 인물
  k.fillStyle='#17161c'; k.fillRect(px-6,py-6,ps+12,ps+12); k.fillStyle=frame(); k.fillRect(px-3,py-3,ps+6,ps+6); k.fillStyle='#dfe3d2'; k.fillRect(px,py,ps,ps);
  try{ const Lk=heroLook(), s=charSprite(Lk,'idle',0), top=Lk.size==='kid'?OY*2-41:OY*2-47; k.imageSmoothingEnabled=false; k.drawImage(s,OX*2-15,top,30,30,px+4,py+4,ps-8,ps-8); k.imageSmoothingEnabled=true; }catch(e){}
  // 이름
  const tx=px+ps+34, tw=CARDW-tx-46; k.textAlign='left'; k.textBaseline='alphabetic'; let y=py+34;
  if(m.alias){ k.fillStyle=SEAL; k.font=`34px ${DISP}`; let a=m.alias; while(k.measureText(a).width>tw&&a.length>2) a=a.slice(0,-1); k.fillText(a,tx,y); y+=62; } else y+=26;
  k.fillStyle=INK; k.font=`60px ${DISP}`; k.fillText(m.name,tx,y); y+=40;
  k.fillStyle=MUT; k.font=`20px ${BODY}`; for(const ln of cardWrap(k,`${ERAS[m.era].n} · ${regOf(m.b.reg).n} · ${OR(m.b.o).n}`,tw)){ k.fillText(ln,tx,y); y+=28; }
  k.fillText(`${oneIn(m.b.P)}명 중 1명`,tx,y); y+=40;
  k.fillStyle=INK; k.font=`24px ${BODY}`; for(const ln of cardWrap(k,`향년 ${m.age}세 · ${m.deathCause||'천수'}`,tw)){ k.fillText(ln,tx,y); y+=32; }
  if(m.sect&&SECTS[m.sect]){ k.fillStyle=MUT; k.font=`20px ${BODY}`; let sr=''; try{ sr=' '+srank(); }catch(e){} k.fillText(SECTS[m.sect].n+sr,tx,y+2); }
  // 가른 줄
  const hr=yy=>{ k.strokeStyle='#c1c8b3'; k.lineWidth=1.5; k.setLineDash([6,5]); k.beginPath(); k.moveTo(48,yy); k.lineTo(CARDW-48,yy); k.stroke(); k.setLineDash([]); };
  hr(446);
  // 숫자 여섯 칸
  const kids=m.rels.filter(r=>r.role==='자식').length, cells=[['경지',m.f.martial?LV[m.lv]:'모름'],['싸움',`${m.wins||0}승 ${m.losses||0}패`],['기연',`${m.giN||0}번`],['재산',topStr(pctNow())],['자식',`${kids}명`],['행복',String(Math.round(m.joy))]];
  const cw=(CARDW-96)/3; cells.forEach((cx,i)=>{ const x=48+(i%3)*cw, yy=476+Math.floor(i/3)*92; k.fillStyle='#e6e9dc'; k.fillRect(x+4,yy,cw-8,80); k.strokeStyle='#c1c8b3'; k.lineWidth=1; k.strokeRect(x+4.5,yy+.5,cw-9,79); k.fillStyle=MUT; k.font=`17px ${BODY}`; k.textAlign='left'; k.fillText(cx[0],x+18,yy+27); k.fillStyle=INK; k.font=`30px ${DISP}`; let v=cx[1]; while(k.measureText(v).width>cw-36&&v.length>2) v=v.slice(0,-1); k.fillText(v,x+18,yy+64); });
  // 무공과 무기
  const tag=(g,x,yy)=>{ const t=TIER[g], w=t.length>=3?52:t.length===2?40:30; k.fillStyle=g>=5?frame():LGCOL[t]; k.fillRect(x,yy-21,w,27); k.fillStyle='#fff'; k.font=`700 17px ${DISP}`; k.textAlign='center'; k.fillText(t,x+w/2,yy-1); k.textAlign='left'; return w+10; };
  let ry=702; const row=(lab,g,name,sub)=>{ k.fillStyle=MUT; k.font=`18px ${BODY}`; k.fillText(lab,52,ry); const w=tag(g,136,ry+2); k.fillStyle=INK; k.font=`27px ${DISP}`; let nm=name; while(k.measureText(nm).width>330&&nm.length>2) nm=nm.slice(0,-1); k.fillText(nm,136+w,ry+2); const nw=k.measureText(nm).width; k.fillStyle=MUT; k.font=`18px ${BODY}`; k.fillText(sub,136+w+nw+14,ry); ry+=46; };
  const ba=m.arts.slice().sort((a,b)=>artG(b)-artG(a)||artVal(b)-artVal(a))[0]; if(ba) row('무공',artG(ba),ba.n,`${artSub(ba)} · 모두 ${m.arts.length}가지`);
  const be=SLOTS.map(s=>m.inv&&m.inv[s]&&ITEMS[m.inv[s]]).filter(Boolean).sort((a,b)=>b.t-a.t)[0]; if(be) row('물건',be.t,be.n,SLOTN[be.s]||'');
  if(!ba&&!be){ k.fillStyle=MUT; k.font=`20px ${BODY}`; k.fillText('무공도 보물도 남기지 않았다.',52,ry); ry+=46; }
  hr(Math.max(ry-8,790));
  // 마지막 말
  k.fillStyle=INK; k.font=`25px ${DISP}`; k.textAlign='center'; const q=cardWrap(k,`"${epitaph()}"`,CARDW-150).slice(0,3); let qy=Math.max(ry+38,832)+(3-q.length)*16; for(const ln of q){ k.fillText(ln,CARDW/2,qy); qy+=36; }
  // 꼬리말
  k.fillStyle=MUT; k.font=`17px ${BODY}`; k.textAlign='left'; k.fillText(`인생 점수 ${L.score} · ${L.line}`,48,CARDH-44); k.textAlign='right'; k.font=`17px ${NUM}`; k.fillText('wolseday.com/#murim',CARDW-48,CARDH-44);
  return c; }

let CARDC=null;
function lifeCard(){ const key=m.name+'|'+m.age+'|'+m.deathCause+'|'+(m.bye||''); if(CARDC&&CARDC.key===key) return CARDC; const c=drawLifeCard(), C=CARDC={key,c,url:c.toDataURL('image/png'),blob:null}; try{ c.toBlob(b=>{ C.blob=b; },'image/png'); }catch(e){} return C; }
const cardBlob=()=>new Promise(res=>{ try{ lifeCard().c.toBlob(b=>res(b),'image/png'); }catch(e){ res(null); } });
// 보내기: 공유 창 → 클립보드에 그림 복사 → 둘 다 안 되면 그림을 길게 눌러 저장하라고 알린다
function sendCard(btn){ const say=t=>{ btn.textContent=t; setTimeout(()=>{ btn.textContent=btn.dataset.label; },2800); }, hint='그림을 길게 눌러(PC는 오른쪽 눌러) 저장하세요';
  // 누른 그 순간에 바로 공유·복사를 불러야 브라우저가 막지 않는다. 그래서 그림은 미리 만들어 둔다
  const go=async blob=>{ if(!blob){ say(hint); return; } const file=new File([blob],`murim-card-${lifeScore().g}-${m.age}.png`,{type:'image/png'});
    try{ if(navigator.canShare&&navigator.canShare({files:[file]})){ await navigator.share({files:[file],title:'무림초출',text:shareText()}); return; } }catch(e){ if(e&&e.name==='AbortError') return; }
    try{ await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]); say('그림을 복사했어요. 대화창에 붙여 넣으세요'); return; }catch(e){}
    say(hint); };
  const C=lifeCard(); if(C.blob) go(C.blob); else cardBlob().then(go); }
// 글꼴이 늦게 오면 카드를 다시 그린다
function cardFonts(done){ try{ Promise.all([document.fonts.load('60px "Song Myung"',m.name+'무림초출'),document.fonts.load('20px "Gowun Batang"','가')]).then(()=>{ CARDC=null; done(); },()=>{}); }catch(e){} }
// 그림 파일로 내려받기
function saveCard(fn){ const go=blob=>{ try{ const a=document.createElement('a'), u=blob?URL.createObjectURL(blob):lifeCard().url; a.href=u; a.download=fn; document.body.appendChild(a); a.click(); a.remove(); if(blob) setTimeout(()=>URL.revokeObjectURL(u),4000); }catch(e){} }; const C=lifeCard(); if(C.blob) go(C.blob); else cardBlob().then(go); }
