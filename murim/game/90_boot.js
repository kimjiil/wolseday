/* ==== murim:boot — 시간의 흐름, 키보드, 시작 ==== */
function step(){ tick(); if(!m.dead) checkTrain(); render(); save(); }
let lastT=performance.now(), titleT=0;
function loop(t){
  const dt=Math.min(250,t-lastT); lastT=t;
  if(!$m('murimApp').hidden){
    if(m&&m.phase==='play'){
      const busy=!!DUEL||!!m.wait, Y=PACE[m.pace]||3000;
      if(CUTQ.length) cutTick(dt);
      else if(m.train){ if(m.tev){ if(m.auto&&!paused&&!m.milestone&&!m.dead&&!busy){ acc+=dt; if(acc>=evMs()){ acc=0; autoTrainStep(); if(!DUEL) afterTrain(); } } } else if(!busy&&!m.dead) mapLoop(dt); }
      else if(m.pending){ if(m.auto&&!paused&&!m.milestone&&!busy){ acc+=dt; if(acc>=evMs()){ acc=0; autoResolve(); if(!DUEL){ checkTrain(); render(); save(); } } } }
      else if(m.age>=MAPAGE){ if(!busy&&!m.dead) mapLoop(dt); }
      else if(!paused&&!m.milestone&&!m.dead&&!busy&&!resWait()){ acc+=dt*SPD[spd]; if(acc>=Y){ acc=0; step(); } }
      const pb=$m('mhProg'); if(pb) pb.style.width=(resWait()?100:m.auto&&!paused&&!busy&&(m.pending||m.tev)?Math.min(100,acc/evMs()*100):m.train&&!CUTQ.length?m.train.turn/18*100:CUTQ.length?Math.min(100,CUTQ[0].t/CUTQ[0].ms*100):m.age>=MAPAGE&&!m.pending&&!m.milestone&&!busy?m.sea/4*100:m.pending||m.milestone||busy?100:Math.min(100,acc/Y*100))+'%';
    } else if(!m||!m.phase||m.phase==='title'){ titleT+=dt; if(titleT>9000){ titleT=0; titleIx++; applyStage(stageFor()); } }
  }
  requestAnimationFrame(loop);
}
document.addEventListener('keydown',e=>{
  if($m('murimApp').hidden||e.ctrlKey||e.metaKey||e.altKey) return;
  if(e.target&&e.target.closest&&e.target.closest('textarea,input')) return;
  if(/^[1-9]$/.test(e.key)){ const b=$m('mhCard').querySelectorAll('.mh-ch')[+e.key-1]; if(b&&!b.disabled){ b.click(); e.preventDefault(); } }
  else if(e.key==='Enter'&&$m('mhNext')&&!$m('mhNext').disabled&&!(e.target&&e.target.closest&&e.target.closest('button,a,select'))){ $m('mhNext').click(); e.preventDefault(); }
  else if(e.key===' '&&m&&m.phase==='play'&&(!document.activeElement||document.activeElement===document.body)){ paused=!paused; render(); e.preventDefault(); }
});
$m('mhHub').onclick=()=>{ paused=true; if(m&&m.phase==='play') renderCtl(); location.hash=''; window.__route&&window.__route(); };
$m('mhVer').textContent='v'+MVER;
$m('mhNotes').innerHTML=`<b>바뀐 점</b>`+NOTES.map(n=>`<div class="mh-note"><span>v${n[0]} · ${n[1]}</span><ul>${n[2].map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`).join('');
$m('mhVer').onclick=()=>{ const n=$m('mhNotes'); n.hidden=!n.hidden; $m('mhVer').setAttribute('aria-expanded',String(!n.hidden)); };
window.__murimRender=()=>{ render(); };
render(); requestAnimationFrame(frame); requestAnimationFrame(loop);
