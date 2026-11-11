/* ==== murim:train — 삼 년 수련기: 두 달마다 할 일, 동문, 일과 에피소드 ==== */
const SEASONS=['정월','삼월','오월','칠월','구월','동짓달'], TSEAS=[3,0,1,1,2,3];
const trainPlace=()=>m.sect?SECTS[m.sect].n:m.f.master?'은사의 초막':'마을 무관';
const craftName=()=>m.sect==='tang'?'독과 암기를 연구한다':m.sect==='shaolin'||m.f.med?'약을 짓는다':'대장간 일을 배운다';
const TACT=[
  {id:'form',n:'초식을 수련한다',s:'무공이 오르고 체력이 깎인다'},
  {id:'qi',n:'운기조식한다',s:'내공이 쌓인다'},
  {id:'chore',n:'잡일을 맡는다',s:'은자를 벌고 신망이 오른다'},
  {id:'craft',n:'',s:'기예가 붙는다. 넷 이상이면 평생 쓸 손재주가 된다'},
  {id:'rest',n:'쉰다',s:'체력을 회복한다'},
  {id:'sneak',n:'몰래 하산한다',s:'행복이 오른다. 들키면 신망이 깎인다'}
];
const mt=i=>m.mates[i];
const alive=i=>m.mates&&m.mates[i]&&!m.mates[i].dead;
function mateLook(i,o){ const x=m.mates[i]; return npcLook(Object.assign({name:x.name,sex:x.sx,age:m.age+(i===0?3:i===1?-1:0),sect:m.sect,weapon:i===1?null:'sword',blush:i===1&&x.love?1:0,hair:m.sect==='shaolin'?'bald':null},o||{})); }
function masterLook(o){ const r=m.rels.find(x=>x.role==='사부'); return npcLook(Object.assign({name:r?r.name:'사부',sex:m.sect&&SECTS[m.sect].female?'f':'m',age:58,sect:m.sect,robe:m.sect?null:'#5a5a64',weapon:m.sect==='shaolin'||m.sect==='beggar'?'staff':'sword',hair:m.sect==='shaolin'?'bald':null,beard:'long'},o||{})); }
const mateN=(i,x,o)=>N('m'+i,mateLook(i),x,Object.assign({tag:mt(i).name},o||{}));
function startTrain(){
  m.f.trainDone=1; const S=m.sect&&SECTS[m.sect], mo=S&&S.male, fo=S&&S.female, f=fo||(!mo&&m.sex==='f');
  m.mates=[{role:f?'사저':'사형',sx:f?'f':'m',name:rname(),v:55},
    mo?{role:'사제',sx:'m',name:rname(),v:45}:fo?{role:'사매',sx:'f',name:rname(),v:45}:{role:m.sex==='m'?'사매':'사제',sx:m.sex==='m'?'f':'m',name:rname(),v:45,love:1},
    {role:'맞수',sx:mo?'m':fo?'f':m.sex,name:rname(),v:30,rival:1}];
  m.train={turn:0,rep:30,craft:0,place:trainPlace(),act:'form'}; scheduleEpisodes(m.train); if(!(m.lastRes&&m.lastRes.age===m.age&&!m.lastRes.seen&&m.lastRes.pick)) m.lastRes=null;
  log(`${m.train.place}에서 삼 년 수련기를 시작했다`,true);
}
function checkTrain(){ if(m&&!m.dead&&!m.train&&m.f.martial&&!m.f.trainDone&&m.age>=8&&m.age<20&&!m.pending&&!DUEL) startTrain(); }
function setTev(e){ m.tev=e; m.tevText=e.text(); m.evSt=null; m.evDuel=null; m.evCh=null; if(e.gi) vfx(()=>{ callout('奇緣','gi',1500); sfx('giyeon'); }); }
function trainAct(id,mi){
  const T=m.train; if(!T||m.tev||DUEL||m.wait) return; let t='', d=null; const b=snap();
  if(id==='mate'&&!alive(mi||0)) return;
  switch(id){
    case 'form': addExp(gain()*.4); hurt(5,'수련 중 입은 상처'); t=pick(['목검이 부러질 때까지 같은 초식을 반복했다.','연무장 모래 위에 발자국이 깊게 패였다.','사부의 초식을 흉내 내다 손목을 삐었다.']); break;
    case 'qi': m.ng+=.5+ST('wit')/14; t=pick(['새벽 공기를 마시며 대주천을 돌렸다.','단전이 따뜻해지는 것을 처음 느꼈다.','좌선하다 다리가 저려 넘어졌다.']); break;
    case 'chore': gold(4); T.rep+=4; t=pick(['장작을 백 단 팼다.','물동이를 지고 산길을 열 번 오르내렸다.','연무장을 쓸고 병기를 닦았다.']); break;
    case 'craft': T.craft++; gold(2); T.rep+=1; t=m.sect==='tang'?'독초를 달이다 손끝이 퍼렇게 물들었다.':pick(['쇠를 달구고 두드리는 법을 배웠다.','약초 이름을 서른 개 외웠다.','망가진 병기를 고쳤다.']); break;
    case 'mate': { const x=mt(mi||0); x.v=cl(x.v+ri(6,12)); m.bond+=2; shiftPer('어울'); t=x.rival?`${wa(x.name)} 말을 섞었다. 생각보다 나쁜 놈은 아니었다.`:pick([`${wa(x.name)} 뒷산에서 산딸기를 땄다.`,`${wa(x.name)} 밤새 무림 이야기를 나눴다.`,`${x.name}의 수련을 거들었다.`]); break; }
    case 'rest': m.hp=cl(m.hp+18); t='하루 종일 볕 좋은 바위에 누워 있었다.'; break;
    case 'sneak': { d=rollDice({p:()=>.5+ST('luck')*.03,t:'몰래'}); m.joy+=8; shiftPer('몰래'); if(d.ok) t='장터에서 당과를 사 먹고 몰래 돌아왔다. 아무도 몰랐다.'; else { T.rep-=10; t='돌아오다 장로에게 걸렸다. 사흘 동안 무릎을 꿇었다.'; } break; }
  }
  T.act=id; T.mi=mi||0;
  m.lastRes={age:m.age,t,tone:d?(d.ok?'good':'bad'):'',dice:d,train:1};
  log(t); T.rep=cl(T.rep); lvCheck();
  if(!m.headless) vfx(()=>{ if(d){ showDice(d); sfx('dice'); } diffFx(b); });
  if(m.hp<=0) return die(m.deathCause||'수련 중 입은 상처');
  T.turn++;
  if(T.turn%6===0){ m.age++; ambient(); m.yst=null; m.joy=cl(m.joy+(55-m.joy)*.08); if(!m.headless&&MILES[m.age]) m.milestone=m.age; const dc=hazard(); if(dc) return die(dc); }
  if(T.turn>=18) return setTev(TEV_FINAL);
  const due=(T.epq||[]).find(x=>x.turn<=T.turn);
  if(due){ T.epq.splice(T.epq.indexOf(due),1); const bt=EPI_T[due.id]&&EPI_T[due.id].beats[due.bi]; if(bt&&(!bt.when||bt.when())) return setTev(bt); }
  if(R()<.28){ const pool=TEV.filter(e=>!e.when||e.when()); if(pool.length) setTev(pick(pool)); }
}
const yard=(o)=>Sg(m.sect?'dojo':m.f.master?'hermit':'dojo',Object.assign({name:m.train?m.train.place:''},o||{}));
const TEV=[
  {id:'push',when:()=>alive(0),st:()=>Sg('kitchen',{cast:[N('m0',mateLook(0,{item:'buckets'}),104,{pose:'carry',tag:mt(0).name,emote:'note'})]}),text:()=>`${iga(mt(0).name)} 자기 잡일을 슬쩍 떠넘긴다.`,ch:[
    {t:'웃으며 받아 준다',go:()=>{ mt(0).v+=8; hurt(3); return {t:`어깨가 빠질 것 같았지만 ${mt(0).role}은 고마워했다.`,cut:()=>{ const h=A('hero'), a=A('m0'); if(h){ h.L=heroLook({item:'buckets'}); h.pose='carry'; } if(a){ a.L=mateLook(0); a.pose='idle'; } }}; }},
    {t:'정중히 거절한다',p:()=>.55,go:ok=>{ if(ok) return `${mt(0).role}이 머쓱하게 웃었다.`; mt(0).v-=8; return {t:`${mt(0).role}이 한동안 말을 걸지 않았다.`,tone:'bad'}; }}]},
  {id:'lib',st:()=>Sg('library',{hero:{x:72,emote:'?'}}),text:()=>'밤중에 지나가다 보니 비급각 문이 반쯤 열려 있다.',ch:[
    {t:'몰래 들어간다',p:()=>.3+ST('luck')*.04,go:ok=>{ if(ok){ addExp(6); return {t:'촛불 아래서 상승 무공 한 장을 외우고 나왔다.',tone:'good',cut:()=>{ const h=A('hero'); if(h){ h.goto=124; } }}; } m.train.rep-=15; return {t:'경비 제자에게 들켰다. 석 달 동안 측간 청소를 했다.',tone:'bad'}; }},
    {t:'모른 척 지나친다',go:()=>{ m.train.rep+=2; return '다음 날 비급각 문은 굳게 잠겨 있었다.'; }}]},
  {id:'hurt',when:()=>alive(1),st:()=>yard({time:'dusk',cast:[mateN(1,100,{pose:'kneel',emote:'sweat'})]}),text:()=>`${iga(mt(1).name)} 수련 중에 다쳐 돌아왔다. 다리를 절고 있다.`,ch:[
    {t:'약을 발라 준다',go:()=>{ mt(1).v+=12; return {t:`${mt(1).name}의 귀가 빨개졌다.`,tone:'good',cut:()=>{ const h=A('hero'); if(h){ h.goto=86; h.pose0='kneel'; } emo('m1','heart'); }}; }},
    {t:'사부에게 데려간다',go:()=>{ m.train.rep+=3; mt(1).v+=4; return '사부가 침을 놓아 주었다.'; }}]},
  {id:'spar',st:()=>yard({cast:[N('el',LOOK.elder(),116,{tag:'장로',pose:'guard'})].concat([0,2].filter(alive).map((i,k)=>mateN(i,152+k*16)))}),text:()=>'장로가 시범 대련 상대를 찾는다. 아무도 나서지 않는다.',ch:[
    {t:'자원한다',s:'세 합만 버티면 된다',duel:()=>({foe:{name:'장로',look:LOOK.elder(),pow:Math.round(power()*1.6),style:'monk',art:'복호장'},survive:3,extras:watchers([0,1,2].filter(alive).map(i=>mateLook(i)))}),go:ok=>{ if(ok){ m.train.rep+=12; addExp(3); return {t:'세 초를 버텼다. 장로가 눈썹을 치켜올렸다.',tone:'good'}; } m.train.rep+=4; return {t:'나동그라졌다. 그래도 배짱은 인정받았다.',tone:'bad'}; }},
    {t:'고개를 숙인다',go:()=>'다른 제자가 끌려 나가 얻어맞았다.'}]},
  {id:'taunt',when:()=>alive(2)&&mt(2).rival,st:()=>yard({cast:[mateN(2,112,{pose:'point',emote:'anger'})].concat([0,1].filter(alive).map((i,k)=>mateN(i,152+k*16)))}),text:()=>`${iga(mt(2).name)} 모두 앞에서 도발한다. "근본 없는 놈이 어딜."`,ch:[
    {t:'비무를 받는다',duel:()=>({foe:{name:mt(2).name,title:'맞수',look:mateLook(2),pow:Math.round(power()*.95+2),style:'sword'},extras:watchers([0,1].filter(alive).map(i=>mateLook(i)))}),go:ok=>{ if(ok){ mt(2).v+=10; m.train.rep+=6; return {t:`${eul(mt(2).name)} 쓰러뜨렸다. 그 뒤로 눈빛이 조금 달라졌다.`,tone:'good'}; } mt(2).v-=10; return {t:'흙바닥에 얼굴을 박았다. 웃음소리가 오래 들렸다.',tone:'bad'}; }},
    {t:'참는다',go:()=>{ mt(2).v-=4; return '주먹을 쥐었다 폈다.'; }}]},
  {id:'fest',st:()=>Sg('market',{time:'night',props:[['lantern',60,{dy:-56}],['lantern',96,{dy:-60}],['lantern',150,{dy:-58}]],cast:alive(1)?[mateN(1,96,{emote:'note'})]:[]}),text:()=>'산 아래 마을에 등불 축제가 열린다. 수련기 동안은 하산 금지다.',ch:[
    {t:'몰래 내려간다',p:()=>.45+ST('luck')*.03,go:ok=>{ m.joy+=10; if(ok){ if(alive(1)) mt(1).v+=8; return {t:alive(1)?`${wa(mt(1).name)} 등불을 띄웠다.`:'혼자 등불을 띄웠다.',tone:'good',cut:()=>{ emo('hero','note'); }}; } m.train.rep-=12; return {t:'돌아오는 길에 사부와 마주쳤다.',tone:'bad'}; }},
    {t:'참는다',go:()=>{ m.train.rep+=3; return {t:'먼 산 아래 불빛만 바라보았다.',st:Sg('peak',{time:'night'})}; }}]},
  {id:'wine',st:()=>yard({cast:[N('sa',masterLook({item:'gourd'}),108,{pose:'drink',tag:'사부'})]}),text:()=>'사부가 술 심부름을 시킨다. 술값은 내 돈으로 하란다.',ch:[
    {t:'좋은 술을 사 온다',when:()=>m.gold>=6,go:()=>{ gold(-6); m.train.rep+=8; addExp(2); return {t:'사부가 한 모금 마시더니 초식 하나를 슬쩍 보여 주었다.',tone:'good',cut:()=>{ emo('sa','note'); }}; }},
    {t:'싼 술을 사 온다',go:()=>{ gold(-1); m.train.rep-=2; return {t:'사부가 한 모금 마시고 얼굴을 찡그렸다.',cut:()=>{ emo('sa','anger'); }}; }}]},
  {id:'dream',st:()=>yard({time:'night',cast:[N('dr',LOOK.shadow({ol:'#4a5a8a',robe:'#3a4a7a',skin:'#9ab0d0',trim:'#bfe8ff'}),108,{act:'train',alpha:.55,noShadow:1,auraC:'#bfe8ff'})],hero:{x:62,pose:'sit',emote:'zzz'}}),text:()=>'좌선하다 깜빡 잠들었다. 꿈속에서 누군가 검을 휘두른다.',ch:[
    {t:'꿈의 검로를 따라 해 본다',p:()=>.25+ST('wit')*.05,go:ok=>{ if(ok){ addExp(8); return {t:'깨어나서도 손이 기억했다. 무언가 트였다.',tone:'good',cut:()=>{ setPose('hero','guard',{act:'train',face:1}); }}; } return '아무리 해도 그 검로가 나오지 않았다.'; }},
    {t:'개꿈이다',go:()=>'세수를 하고 다시 앉았다.'}]},
  {id:'thief',st:()=>Sg('temple',{time:'night',cast:[N('th',LOOK.blackclad(),150,{pose:'walk',emote:'sweat'})]}),text:()=>'한밤중, 담장 위로 검은 그림자가 지나간다.',ch:[
    {t:'쫓아간다',duel:()=>({foe:{name:'밤도둑',look:LOOK.blackclad(),pow:Math.round(power()*.8+4),style:'assassin',mercy:.9},lethal:1,cause:'밤도둑의 칼',noReturn:1}),go:(ok,res)=>{ if(ok){ m.train.rep+=10; m.fame+=2; return {t:'도둑을 붙잡았다. 창고를 털러 온 녹림도였다.',tone:'good'}; } return {t:res.dead?'어둠 속에서 칼이 먼저 나왔다.':'담을 넘다 떨어져 다리를 다쳤다.',tone:'bad'}; }},
    {t:'종을 쳐서 사형제들을 깨운다',go:()=>{ if(alive(0)) mt(0).v+=4; m.train.rep+=3; return '횃불이 줄지어 나갔다.'; }}]},
  {id:'ask',when:()=>alive(1)&&mt(1).love,st:()=>Sg('mountain',{time:'dusk',cast:[mateN(1,96,{emote:'?'})],hero:{x:72}}),text:()=>`${iga(mt(1).name)} 하산하면 무엇을 할 거냐고 묻는다.`,ch:[
    {t:'"너랑 같이 강호를 걷고 싶다"',p:()=>.35+ST('charm')*.05,go:ok=>{ if(ok){ mt(1).v+=15; return {t:'대답 대신 웃었다.',tone:'good',cut:()=>{ emo('m1','heart'); emo('hero','heart'); }}; } mt(1).v-=5; return '"…무슨 소리야." 한동안 어색했다.'; }},
    {t:'"천하제일인이 될 거다"',go:()=>({t:`${iga(mt(1).name)} 깔깔 웃었다.`,cut:()=>{ emo('m1','note'); }})}]},
  {id:'wood',st:()=>Sg('kitchen',{cast:[N('gr',LOOK.granny(),120,{tag:'주방 할멈',emote:'sweat'})]}),text:()=>'주방 할멈이 허리를 다쳐 장작을 못 팬다.',ch:[
    {t:'대신 패 준다',go:()=>{ hurt(3); m.joy+=3; return {t:'그 뒤로 내 밥그릇에만 고기가 한 점 더 올라왔다.',tone:'good',cut:()=>{ const h=A('hero'); if(h){ h.L=heroLook({tool:'axe'}); h.goto=92; h.act='tool'; } emo('gr','heart'); }}; }},
    {t:'수련이 먼저다',go:()=>{ addExp(1); return '할멈은 아무 말도 하지 않았다.'; }}]}
];
const TEV_FINAL={final:1,st:()=>Sg('arena',{name:'비무 시험',cast:(alive(2)?[mateN(2,126,{pose:'guard'})]:[N('m2',LOOK.youth(),126,{pose:'guard'})])}),
  text:()=>`수련기의 끝. ${m.train.place}의 비무 시험 날이다. 상대는 ${alive(2)?`${mt(2).rival?'맞수':'지기'} ${mt(2).name}`:'이름난 사형'}.`,ch:[
  {t:'정면으로 승부한다',s:'신망이 높을수록 기가 차서 오른다',duel:()=>finalDuel(0),go:ok=>finishTrain(ok,true)},
  {t:'버티며 판정을 노린다',s:'다섯 합을 버티면 통과. 수석은 못 한다',duel:()=>finalDuel(5),go:ok=>finishTrain(ok,false)}]};
function finalDuel(sv){ const x=alive(2)?mt(2):null, T=m.train; const sp={foe:{name:x?x.name:'사형',title:'비무 시험',look:x?mateLook(2):LOOK.youth(),pow:m.sect?50:38,style:'sword'},qi:Math.round(cl(T.rep)*.4),extras:watchers([0,1].filter(alive).map(i=>mateLook(i)))}; if(sv) sp.survive=sv; return sp; }
function finishTrain(ok,front){
  const T=m.train, top=ok&&front&&T.rep>=60; let extra='';
  m.f.standing=(m.f.standing||0)+(top?4:ok?2:0);
  if(top){ const w=wOf(1); m.fame+=12; addExp(6); give(w); extra=` 수석 상으로 ${eul(ITEMS[w].n)} 받았다.`; log(`${T.place}의 수련기를 수석으로 마쳤다`,true); }
  else if(ok){ addExp(3); log(`${T.place}의 수련기를 마쳤다`,true); }
  else { m.joy-=8; log(`${T.place}의 비무 시험에서 떨어졌다`,true); }
  if(T.craft>=4){ if(m.sect==='tang') m.f.poisonwise=1; else if(m.sect==='shaolin'||m.f.med) m.f.med=1; else m.f.smith=1; log('평생 쓸 손재주가 붙었다',true); }
  m.mates.forEach(x=>{ if(x.dead) return; rel(x.rival?(x.v<=25?'원수':'맞수'):x.role,x.name,x.v,{sx:x.sx}); if(x.love&&x.v>=70&&!m.spouse){ m.f.loveName=x.name; m.q.push({age:m.age+ri(1,4),id:'mateLove'}); } });
  m.train=null; m.mates=null; placeAfterTrain();
  return {t:(top?'시험관들이 일어서서 박수를 쳤다. 수석이다.':ok?'통과했다. 내문 제자로 올라갔다.':'졌다. 한동안 외문에 남게 되었다.')+extra,tone:ok?'good':'bad'};
}
function tevChoices(e){ const c=typeof e.ch==='function'?(m.evCh||(m.evCh=e.ch())):e.ch; return c.filter(x=>!x.when||x.when()); }
function resolveT(i,auto){
  const e=m.tev; if(!e||DUEL||m.wait) return; const cs=tevChoices(e), c=cs[i]; if(!c) return; shiftPer(c.t);
  if(c.duel){ startDuel(duelSpecOf(c),(res,stage)=>{ finishT(e,c,res.win,null,res,auto,stage); if(!m.headless) afterTrain(); }); return; }
  const d=c.p?rollDice(c):null; finishT(e,c,d?d.ok:null,d,null,auto,null);
}
function finishT(e,c,ok,d,res,auto,dstage){
  const b=snap(), turn=m.train?m.train.turn:0; let r=c.go(ok,res); if(typeof r==='string') r={t:r};
  if(m.mates) m.mates.forEach(x=>x.v=cl(x.v));
  m.lastRes={age:m.age,q:m.tevText,pick:c.t,t:r.t,tone:r.tone||(res?(res.win?'good':'bad'):''),dice:d,auto:!!auto,train:1,stage:(r.st&&!m.headless?fixStage(r.st,'tres:'+turn):null)||dstage||m.evSt||null};
  log(`${auto?'(맡김) ':''}${c.t}. ${r.t}`); if(r.big) log(r.big,true);
  if(e.ep&&m.train&&(r.end||e.bi===EPI_T[e.ep].beats.length-1)) m.train.epq=(m.train.epq||[]).filter(x=>x.id!==e.ep);
  m.tev=null; m.tevText=null; m.evSt=null; m.evDuel=null; m.evCh=null; if(e.gi&&m.lastRes.tone!=='bad') m.giN=(m.giN||0)+1; lvCheck();
  if(m.deathCause||m.hp<=0) die(m.deathCause||'수련 중 입은 상처');
  if(!m.headless) react(r,d,b,!!res);
}
function autoTrainStep(){
  if(m.tev){ const cs=tevChoices(m.tev); const c=wpick(cs,x=>(x.p?cl(x.p(),.05,.95):x.duel?cl(duelOdds(duelSpecOf(x)),.06,.95):.6)*(1+perBonus(x.t).b*.5)); return resolveT(cs.indexOf(c),true); }
  if(m.hp<35||(m.train.turn>=15&&m.hp<72)) return trainAct('rest');
  const a=wpick(TACT.concat([{id:'mate'}]),x=>({form:3,qi:2,chore:1.5,craft:1,mate:1.6,rest:.5,sneak:.4}[x.id]));
  const live=[0,1,2].filter(alive); trainAct(a.id==='mate'&&!live.length?'form':a.id,live.length?pick(live):0);
}
function afterTrain(){ acc=0; render(); save(); }

/* ---- 수련장 장면: 고른 일에 따라 주인공이 움직인다 ---- */
function trainStage(){ const T=m.train, cast=[];
  if(alive(0)) cast.push(mateN(0,86,{face:1,act:'train'}));
  if(alive(2)) cast.push(mateN(2,112,{act:alive(0)?'train':'wander',xmin:100,xmax:126}));
  if(alive(1)) cast.push(mateN(1,138,{act:'wander',xmin:128,xmax:152}));
  cast.push(N('sa',m.f.master&&!m.sect?LOOK.master():masterLook(),168,{tag:'사부'}));
  return {key:'train:'+T.place+':'+m.mates.map(x=>x.dead?1:0).join(''),bg:m.sect?'dojo':m.f.master?'hermit':'dojo',name:T.place,season:TSEAS[T.turn%6],cast,hero:{look:heroLook(),x:46,face:-1,tag:m.name,tagc:'me'}}; }
let TRSHOWN='';
function tuneTrain(){ const T=m.train, h=A('hero'); if(!T||!h||!SC||String(SC.key).indexOf('train:')!==0) return;
  const k=T.turn+':'+T.act+':'+T.mi; if(TRSHOWN===k+SC.key) return; TRSHOWN=k+SC.key;
  const act=T.act||'form'; h.emote=null; h.ay=0; h.alpha=null; h.hide=false; [0,1,2].forEach(i=>{ const a=A('m'+i); if(a) a.emote=null; });
  SC.time=act==='qi'?'dawn':act==='rest'?'dusk':'day'; SC.dark=SC.time==='dusk';
  const set=(L,x,pose,ac,face)=>{ h.L=L; h.goto=x; h.pose0=pose; h.face0=face||-1; h.act=ac; h.f=0; };
  if(act==='form') set(heroLook(),46,'guard','train',-1);
  else if(act==='qi') set(heroLook(),64,'sit','meditate',1);
  else if(act==='chore') set(heroLook({tool:T.turn%2?'broom':'axe'}),62,'tool','tool',1);
  else if(act==='craft') set(heroLook({tool:'hammer'}),66,'tool','tool',1);
  else if(act==='rest'){ set(heroLook(),60,'lie',null,1); h.emote='zzz'; }
  else if(act==='sneak'){ set(heroLook(),-24,'walk',null,-1); }
  else if(act==='mate'){ const a=A('m'+T.mi); set(heroLook(),a?Math.max(30,a.x-14):70,'idle',null,1); if(a){ a.emote=mt(T.mi)&&mt(T.mi).love?'heart':'note'; } h.emote='note'; }
}
function tevStage(){ if(m.evSt) return m.evSt; const e=m.tev; let s=e.st?e.st():trainStage(); if(e.gi) giTint(s); return m.evSt=fixStage(s,'tev:'+(e.id||e.ep||'f')+':'+(e.bi||0)+':'+m.train.turn); }

function renderTrain(card,eye){
  const T=m.train, yr=Math.min(3,Math.floor(T.turn/6)+1), se=SEASONS[T.turn%6];
  const head=`<div class="mh-tr"><span class="mh-qa">${esc(T.place)} 수련기</span><b>${T.turn>=18?'비무 시험':`${yr}년차 ${se}`}</b><span class="mh-trbar" aria-label="수련기 진행 ${T.turn}/18"><i style="width:${T.turn/18*100}%"></i></span></div>`;
  const stats=`<div class="mh-meters">${meter('체력',m.hp,'hp')}${meter('신망',T.rep,'')}${meter('기예',Math.min(100,T.craft*25),'joy')}</div>`;
  const mates=`<div class="mh-mates"><span class="mh-lab">동문</span>${m.mates.map((x,i)=>`<div class="mh-mate${x.dead?' dead':''}"><span class="mh-who"><img class="mh-pt" src="${portrait(mateLook(i))}" alt="" width="28" height="28"><span><b>${esc(x.name)}</b><small>${esc(x.dead?'고인':x.role)}</small></span></span><span class="mh-bar bond"><i style="width:${x.dead?0:cl(x.v)}%"></i></span><button type="button" class="mh-btn" data-mate="${i}" ${m.tev||x.dead||m.auto?'disabled':''}>어울리기</button></div>`).join('')}</div>`;
  const last=m.lastRes&&(m.lastRes.train||resWait())?resHtml(m.lastRes):'';
  const e=m.tev;
  const body=e?`<div class="mh-dec${e.gi?' gi':''}"><p class="mh-qa">${e.final?'시험':e.ep?`${esc(EPI_T[e.ep].n)} · ${e.bi+1}/${EPI_T[e.ep].beats.length}`:'일'}</p><p class="mh-text">${esc(m.tevText)}</p><div class="mh-chs">${tevChoices(e).map(chBtn).join('')}</div></div>`
    :resWait()?`<button class="mh-go" type="button" id="mhNext" ${m.wait?'disabled':''}>계속</button>`
    :`<div class="mh-acts">${TACT.map((a,i)=>`<button class="mh-ch" type="button" data-t="${a.id}" ${m.auto?'disabled':''}><span><span class="k" aria-hidden="true">${i+1}</span><span>${esc(a.id==='craft'?craftName():a.n)}<small>${esc(a.s)}</small></span></span></button>`).join('')}</div>`;
  card.innerHTML=`${eye}${head}${last}${body}${stats}${mates}`;
  card.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ resolveT(+b.dataset.i); afterTrain(); });
  const nx=$m('mhNext'); if(nx) nx.onclick=()=>{ if(m.wait) return; if(m.lastRes) m.lastRes.seen=1; afterTrain(); };
  card.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ trainAct(b.dataset.t); afterTrain(); });
  card.querySelectorAll('[data-mate]').forEach(b=>b.onclick=()=>{ trainAct('mate',+b.dataset.mate); afterTrain(); });
}
