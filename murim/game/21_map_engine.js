/* ==== murim:map-engine — 맵 화면 그리기(카메라, 순서, 물결) ==== */
let MAPV=null;      // {M, season, actors:[], hero, cam:{x,y}, marks:[], step()}
function actorSpr(a){ const d=a.dir, pose=a.moving?'walk':(a.pose||'idle'), f=a.moving?(a.wf>>2)%4:pose==='tool'?(((tk+a.ph)%40)<13?1:0):(a.L.animal?((tk+a.ph)>>4)%2:((tk+a.ph)>>5)%2); return (d==='d'||d==='u')&&!a.L.animal&&pose!=='tool'&&pose!=='sit'?charSprite(a.L,pose,f,d):charSprite(a.L,pose,f); }
function drawMapFrame(){ const V=MAPV, M=V.M; cx=g0; if(V.step){ try{ V.step(); }catch(e){ if(!drawMapFrame.err){ drawMapFrame.err=1; console.error(e); } } }
  const sea=V.season, S=MP[sea], gc=drawGround(M,sea), h=V.hero, mw=M.w*TL, mh=M.h*TL;
  let camx=h?h.px-W/2:0, camy=h?h.py-12-H/2:0; camx=mw<=W?(mw-W)/2:cl(camx,0,mw-W); camy=mh<=H?(mh-H)/2:cl(camy,0,mh-H); camx=rnd(camx*2)/2; camy=rnd(camy*2)/2; V.cam.x=camx; V.cam.y=camy;
  g0.save(); if(shake>0){ if(!RED) g0.translate(rnd((hsh(tk)-.5)*shake*.9),rnd((hsh(tk*1.7)-.5)*shake*.9)); shake--; }
  P(0,0,W,H,'#1c1a22'); g0.drawImage(gc,camx*2,camy*2,W*2,H*2,0,0,W,H);
  // 물결
  const t=anim(), x0=Math.max(0,Math.floor(camx/TL)), y0=Math.max(0,Math.floor(camy/TL)), x1=Math.min(M.w-1,Math.floor((camx+W)/TL)), y1=Math.min(M.h-1,Math.floor((camy+H)/TL));
  for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++){ const k=M.g[y][x]; if(k!=='~') continue; for(let i=0;i<2;i++){ const ph=th(x,y,i+80), px=x*TL+((ph*40+t*(.06+i*.03))%14), py=y*TL+3+((ph*90+i*7)%11)+((t*.05+ph*9)%3); cx.fillStyle=S.watL; cx.fillRect(px-camx,rnd(py*2)/2-camy,2.5,.5); } }
  // 폭포
  for(const f of M.falls||[]){ const fx=f.x*TL-camx, fy=f.y*TL-camy, fw=f.w*TL, fh=f.h*TL; if(fx>W||fx+fw<0||fy>H) continue; cx.fillStyle='#8fd4ec'; cx.fillRect(fx+1,fy,fw-2,fh); cx.fillStyle='#62bfe0'; cx.fillRect(fx+1,fy,1.5,fh); cx.fillRect(fx+fw-2.5,fy,1.5,fh);
    for(let i=0;i<fw*1.4;i++){ const sx=fx+2+hsh(i*3.7)*(fw-5), sp=.5+hsh(i*5.1)*.7, sy=((hsh(i*9.3)*fh+t*sp)%fh); cx.fillStyle=i%3?'#ffffff':'#d6f2fa'; cx.fillRect(rnd(sx*2)/2,fy+rnd(sy*2)/2,.5+(i%2)*.5,2+(i%3)); }
    for(let i=0;i<10;i++){ const bx=fx-1+hsh(i*2.3+(t>>3))*(fw+1), by=fy+fh-2+hsh(i*4.1+(t>>3))*4; cx.fillStyle='#ffffff'; cx.fillRect(rnd(bx*2)/2,rnd(by*2)/2,1.5,1); } }
  // 물건과 사람을 발 높이 순서로
  const list=[]; for(const o of M.objs){ const d=OBJ[o.k], bx=(o.x+o.w/2)*TL, by=(o.y+o.h)*TL; if(bx<camx-70||bx>camx+W+70||by<camy-10||by>camy+H+60) continue; list.push({y:d.flat?by-TL*o.h-1:by-2,o}); }
  for(const a of V.actors){ if(a.hide) continue; if(a.px<camx-20||a.px>camx+W+20||a.py<camy-4||a.py>camy+H+30) continue; list.push({y:a.py,a}); }
  list.sort((p,q)=>p.y-q.y);
  for(const it of list){ if(it.o){ const o=it.o, d=OBJ[o.k], s=objSprite(o,sea,(t>>3)), bx=(o.x+o.w/2)*TL-camx, by=(o.y+o.h)*TL-camy; if(o.k==='house') g0.drawImage(s,bx-s.width/4,by-s.height/2,s.width/2,s.height/2); else g0.drawImage(s,bx-d.ax/2,by-d.ay/2-(TL-14),s.width/2,s.height/2); if(o.k==='fire') glow(bx,by-8,14,'#ffb060',.35); }
    else { const a=it.a, s=actorSpr(a), x=rnd((a.px-camx)*2)/2, y=rnd((a.py-camy+(a.ay||0))*2)/2; cx.fillStyle=rgba('#1c1a22',.25); cx.fillRect(x-5,a.py-camy-1,10,2); cx.fillRect(x-3.5,a.py-camy+1,7,.5);
      if(a.dir==='l'){ cx.save(); cx.translate(x,y); cx.scale(-1,1); cx.drawImage(s,-OX,-OY,SW,SH); cx.restore(); } else cx.drawImage(s,x-OX,y-OY,SW,SH); a.sx=x; a.sy=y; } }
  if(!M.indoor) drawWeather({wx:V.wx||null,season:sea,ter:'plain',time:'day'},0); drawFx(0);
  if(V.tint){ g0.save(); g0.globalCompositeOperation='multiply'; g0.globalAlpha=V.tint[1]; P(0,0,W,H,V.tint[0]); g0.restore(); }
  drawLights(); drawFx(1);
  for(const a of V.actors){ if(a.emote&&!a.hide&&a.sx!=null) drawEmote({emote:a.emote,x:a.sx,y:a.sy,ax:0,ay:0,face:1,L:a.L}); }
  for(const k of V.marks||[]){ const x=k.x*TL+8-camx, y=k.y*TL-camy-(k.up||0)-((t>>4)%2); if(x<-8||x>W+8||y<-4||y>H+20) continue; const d=MINK; P(x-4,y-13,9,1,d); P(x-4,y-3,9,1,d); P(x-5,y-12,1,9,d); P(x+5,y-12,1,9,d); P(x-4,y-12,9,9,k.c||'#ffe9a0'); P(x,y-2,1,2,d); P(x,y-11,1,5,'#d8452c'); P(x,y-5,1,1,'#d8452c'); }
  if(flashA>0){ P(0,0,W,H,rgba(flashC,Math.min(1,flashA))); flashA-=.07; }
  if(fadeA>0){ P(0,0,W,H,rgba('#17161c',Math.min(1,fadeA))); fadeA-=.1; }
  g0.restore();
  for(let i=FX.length-1;i>=0;i--) if(--FX[i].life<=0) FX.splice(i,1);
  if(V.after) V.after();
}
