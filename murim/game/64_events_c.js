/* ==== murim:events-c — 무림맹 · 천하제일 비무대회 · 대전(지휘전) · 반로환동 ==== */
/* ---------- 무림맹 ----------
   m.f.ally 맹에 들었다 · m.f.allyPt 공적 · 직책은 공적으로 오른다 · 맹주는 예전부터 있던 'leader' 사건 */
const ARANK=[[0,'맹원'],[12,'당주'],[30,'장로'],[55,'부맹주']];
const arank=()=>{ if(m.f.leader) return '맹주'; const c=m.f.allyPt||0; let r=ARANK[0][1]; for(const x of ARANK) if(c>=x[0]) r=x[1]; return r; };
function addAlly(n){ if(!m.f.ally) return; const b=arank(); m.f.allyPt=Math.max(0,(m.f.allyPt||0)+n); const a=arank(); if(a!==b&&n>0){ m.fame+=a==='부맹주'?10:5; log(`무림맹의 ${a}${jo(a,'이','가')} 되었다`,true); vfx(()=>{ callout(a,'alias',1500); sfx('lv'); }); } }
const notDemon=()=>!(m.sect&&SECTS[m.sect]&&SECTS[m.sect].side==='마')&&!m.f.demonHero&&!m.f.magong;
const hallCast=()=>mob('el',i=>[LOOK.elder(),LOOK.monk(),LOOK.whitesword(),LOOK.swordsman()][i],[104,122,140,158],{pose:'idle'});
E('allyJoin',{min:18,max:150,rep:8,w:9,when:()=>m.f.martial&&!m.f.ally&&notDemon()&&m.fame>=6&&m.lv>=2,st:()=>Sg('hall',{cast:hallCast()}),
  text:()=>'무림맹이 사람을 모은다. 정파 문파들이 뜻을 모아 세운 맹이다. 명패에 이름을 올리면 강호의 큰일에 불려 다닌다.',ch:[
  {t:'명패에 이름을 올린다',go:()=>{ m.f.ally=1; m.f.allyPt=0; m.fame+=3; m.hy+=2; log('무림맹에 들었다',true); return {t:'맹의 깃발 아래 섰다. 이제 강호의 일이 내 일이다.',tone:'good',cut:()=>{ callout('武林盟','alias',1500); }}; }},
  {t:'매인 몸이 되기 싫다',go:()=>{ m.joy=cl(m.joy+2); return '홀가분한 쪽을 골랐다. 맹의 사람은 아쉬워하며 돌아갔다.'; }}]});
E('allyCouncil',{min:18,max:150,rep:4,w:1.3,when:()=>m.f.ally&&notDemon(),st:()=>Sg('hall',{cast:hallCast()}),
  text:()=>`무림맹이 회합을 연다. 각 문파의 대표가 대전에 모였다. ${arank()}인 내 자리도 있다.`,ch:[
  {t:'나서서 뜻을 밝힌다',p:()=>.3+ST('wit')*.04+ST('charm')*.03,go:ok=>{ if(ok){ addAlly(6); m.fame+=3; return {t:'대전이 조용해졌다가, 여기저기서 고개를 끄덕였다. 맹주가 내 이름을 물었다.',tone:'good'}; } addAlly(1); return {t:'말이 꼬였다. 누군가 헛기침을 했다.',tone:'bad'}; }},
  {t:'비무 시연에 나선다',duel:()=>({foe:{name:rname(),title:'타 문파의 대표',look:LOOK.whitesword(),pow:Math.round(power()*.95+ri(0,8)),style:'sword',mercy:1,art:'창궁검'}}),
    go:ok=>{ if(ok){ addAlly(5); m.fame+=5; addExp(gain()*.3); return {t:'세 합 만에 상대의 검을 눌렀다. 좌중이 술렁였다.',tone:'good'}; } addAlly(2); addExp(gain()*.25); return {t:'졌다. 그래도 맹의 사람들이 내 검을 눈여겨봤다.',tone:'bad'}; }},
  {t:'뒷자리에서 듣는다',go:()=>{ addAlly(2); addExp(gain()*.15); return '강호가 돌아가는 판이 눈에 들어왔다.'; }}]});
E('allyMission',{min:18,max:150,rep:3,w:1.3,when:()=>m.f.ally&&notDemon(),st:()=>Sg('hall',{cast:[N('ms',LOOK.elder(),110,{pose:'point'})]}),
  text:()=>pick(['무림맹에서 영패가 왔다. 흑도 분타 하나가 고을을 괴롭힌다고 한다.','무림맹에서 사람이 왔다. 두 문파가 광산을 두고 칼을 뽑기 직전이라고 한다.','무림맹의 급보다. 흉년 든 고을에 구휼미를 호송해야 한다.']),ch:[
  {t:'칼을 들고 간다',duel:()=>({foe:{name:pick(['흑도 분타주','녹림 채주','마교 향주']),look:pick([LOOK.chief,LOOK.blackclad,LOOK.cultist])(),pow:Math.round(power()*.9+ri(0,10)),style:'bandit',mercy:.5,art:'흑풍도'},lethal:1,cause:'맹의 임무'}),
    go:(ok,res)=>{ if(ok){ addAlly(8); m.fame+=4; m.hy+=3; gold(ri(20,45)); return {t:'일을 마치고 영패를 돌려주었다. 맹에서 사례가 나왔다.',tone:'good'}; } if(res&&res.dead) return {t:'맹의 깃발 아래 쓰러졌다.',tone:'bad'}; addAlly(2); return {t:'물러났다. 맹에서 다른 사람을 보냈다.',tone:'bad'}; }},
  {t:'말로 풀어 본다',p:()=>.3+ST('charm')*.05+ST('wit')*.02,go:ok=>{ if(ok){ addAlly(7); m.fame+=3; m.hy+=3; return {t:'사흘 밤낮 양쪽을 오갔다. 칼은 뽑히지 않았다.',tone:'good'}; } addAlly(1); return {t:'말이 통하지 않았다. 맹주가 직접 나서야 했다.',tone:'bad'}; }},
  {t:'은자를 보탠다',when:()=>m.gold>=30,go:()=>{ gold(-30); addAlly(4); m.hy+=2; return '맹의 장부에 내 이름이 올랐다.'; }},
  {t:'이번에는 빠진다',go:()=>{ addAlly(-2); return '영패를 돌려보냈다. 맹의 사람이 말없이 돌아섰다.'; }}]});

/* ---------- 천하제일 비무대회: 열 해에 한 번, 네 판 ---------- */
const tourFoe=(title,look,k,style,art)=>({name:rname(),title,look,pow:Math.round(power()*k+ri(0,6)),style,mercy:1,art});
E('worldTourney',{min:18,max:150,rep:10,w:2,when:()=>m.f.martial&&m.lv>=2,st:()=>Sg('arena',{cast:[N('t1',LOOK.whitesword(),120,{pose:'guard'}),N('t2',LOOK.swordsman(),146,{}),N('t3',LOOK.monk(),166,{})]}),
  text:()=>'십 년에 한 번, 천하제일 비무대회가 열린다. 정사를 가리지 않고 천하의 고수가 숭산 아래로 모였다. 여기서 끝까지 서 있는 사람을 강호는 천하제일이라 부른다.',ch:[
  {t:'출전한다',s:'네 판을 내리 이겨야 천하제일',when:()=>bodyAge()<75,duel:()=>({chain:[tourFoe('예선의 강자',LOOK.swordsman(),.68,'sword','쾌검'),tourFoe('팔강 · 명문의 수석 제자',LOOK.whitesword(),.8,'sword','태청검'),tourFoe('사강 · 흑도의 패자',LOOK.chief(),.92,'brute','패왕도'),tourFoe('결승 · 지난 대회 우승자',LOOK.master(),1.04,'sword','무극검')],bg:'arena'}),
    go:(ok,res)=>{ const won=(res&&res.won)||(ok?4:0);
      if(won>=4){ m.f.champ=(m.f.champ||0)+1; m.fame+=50; m.hy+=5; gold(500); const id=rndItem('w',4,myKind()); if(id) give(id,{}); m.alias='천하제일 '+m.name.slice(0,1)+'대협'; log(`천하제일 비무대회에서 우승했다`,true); return {t:'마지막 상대가 무릎을 꿇었다. 숭산이 함성으로 흔들렸다. 그날부터 강호는 나를 천하제일이라 불렀다.',tone:'good',big:'천하제일에 올랐다',cut:()=>{ callout('天下第一','gi gssr',2600); flashA=.9; flashC='#fff6c8'; spark('hero','#ffe9a0',24); }}; }
      if(won===3){ m.fame+=22; gold(150); dropItem(3); return {t:'결승에서 졌다. 한 수 차이였다. 강호는 준우승자의 이름도 기억했다.',tone:'good',big:'천하제일 비무대회 준우승'}; }
      if(won===2){ m.fame+=10; gold(50); return {t:'사강에서 멈췄다. 천하의 넓이를 몸으로 쟀다.',tone:'good'}; }
      if(won===1){ m.fame+=3; addExp(gain()*.3); return '팔강에서 떨어졌다. 배운 것은 많았다.';}
      addExp(gain()*.2); return {t:'예선에서 떨어졌다. 천하는 넓었다.',tone:'bad'}; }},
  {t:'제자를 내보낸다',when:()=>!!relOf('제자'),p:()=>.2+m.lv*.06,go:ok=>{ const d=relOf('제자'); if(ok){ m.fame+=15; d.v=Math.min(100,d.v+10); log(`제자 ${iga(d.name)} 천하제일 비무대회 사강에 올랐다`,true); return {t:`${iga(d.name)} 사강까지 올랐다. 사람들이 스승이 누구냐고 물었다.`,tone:'good'}; } m.fame+=2; return {t:`${iga(d.name)} 첫 판에서 떨어졌다. 돌아오는 길에 한마디도 하지 않았다. 그날 밤부터 더 독하게 수련했다.`}; }},
  {t:'심사석에 앉는다',when:()=>m.age>=50&&m.lv>=4,go:()=>{ m.fame+=6; gold(60); addExp(gain()*.3); return {t:'천하의 검이 눈앞에서 부딪쳤다. 심사석에서 보니 젊을 적 내 허점까지 보였다.',tone:'good'}; }},
  {t:'구경한다',go:()=>{ addExp(gain()*.25); m.joy=cl(m.joy+4); return '나흘을 목이 쉬도록 봤다. 눈에 담은 것만으로 한 해 수련이었다.'; }}]});

/* ---------- 대전: 나이가 들거나 자리가 오르면 칼 대신 깃발을 든다 ---------- */
const WARS=[['천마대전','천마신교',[['혈검대','cultist'],['교주 친위대','cultist'],['흑풍대','blackclad']]],['혈교의 난','혈교',[['혈귀대','cultist'],['혈교 본대','chief'],['암살대','blackclad']]],['흑도 연합 토벌','흑도 연합',[['녹림 연합','bandit'],['흑도 총채','chief'],['장강 수로채','bandit']]]];
const isDemonSide=()=>!!(m.sect&&SECTS[m.sect]&&SECTS[m.sect].side==='마')||!!m.f.demonHero;
function warSpecFor(k,o){ const dm=isDemonSide(); if(dm) return Object.assign({name:'무림맹 토벌대 요격',foeName:'무림맹',mySide:'마',foes:[['화산 검수대','swordsman'],['무림맹 본대','whitesword'],['개방 타구진','oldbeggar']],size:6,diff:1.22,deadly:.12,risk:[6,16],cause:'토벌대와의 싸움'},o||{});
  const w=WARS[k%WARS.length]; return Object.assign({name:w[0],foeName:w[1],mySide:'정',foes:w[2],size:6,diff:1.22,deadly:.12,risk:[6,16],cause:w[0]},o||{}); }
const canCommand=()=>m.f.martial&&m.lv>=3&&(m.age>=45||m.f.leader||(m.f.allyPt||0)>=30||(m.sect&&srank()==='장로'));
function warWin(res,name){ const r=res||{fallen:[],broke:3}, dm=isDemonSide(); m.fame+=30; if(dm) m.ak+=10; else m.hy+=15; addAlly(20); addSc(15); addExp(gain()*.8); gold(ri(150,300)); dropItem(R()<.35?4:3); m.f.warHero=1; log(`${name}에서 총수로 이겼다`,true);
  return {t:`적의 중군 깃발이 쓰러졌다. ${r.fallen&&r.fallen.length?`${r.fallen.join(', ')}${jo(r.fallen[r.fallen.length-1],'은','는')} 돌아오지 못했다. `:''}강호는 그날의 진법을 오래 이야기했다.`,tone:'good',big:`${name}을 이겼다`,cut:()=>{ callout('大勝','gi gss',2000); spark('hero','#ffe9a0',18); }}; }
function warLose(res,name){ const r=res||{fallen:[]}; m.fame=Math.max(0,m.fame-4); addAlly(4); log(`${name}에서 졌다`,true); return {t:`진이 무너졌다. 남은 사람을 수습해 물러났다.${r.fallen&&r.fallen.length?` ${r.fallen.join(', ')}${jo(r.fallen[r.fallen.length-1],'을','를')} 잃었다.`:''} 싸움은 다른 이들이 이었다.`,tone:'bad'}; }
E('greatWar',{min:40,max:150,rep:12,w:2.2,when:()=>canCommand(),st:()=>Sg('battle',{cast:warCast(),hero:{x:60,pose:'point'}}),
  text:()=>{ m.f.warK=ri(0,WARS.length-1); const s=warSpecFor(m.f.warK); return isDemonSide()?'무림맹이 토벌대를 일으켰다. 깃발이 골짜기를 메웠다. 교의 사람들이 내 얼굴을 본다. 이번 싸움의 총수는 나다.':`${s.foeName}${jo(s.foeName,'이','가')} 중원으로 밀려온다. ${s.name}이다. 무림맹이 격문을 돌렸고, 장문인들이 내게 총수의 깃발을 내밀었다. 이제는 칼이 아니라 사람을 써야 하는 자리다.`; },ch:[
  {t:'총수의 깃발을 받는다',s:'세 갈래에 사람을 배치하고 영을 내린다',war:()=>warSpecFor(m.f.warK||0),go:(ok,res)=>{ const n=warSpecFor(m.f.warK||0).name; return ok?warWin(res,n):warLose(res,n); }},
  {t:'군량과 약재를 댄다',when:()=>m.gold>=60,go:()=>{ gold(-60); m.hy+=6; addAlly(6); m.fame+=3; return {t:'수레 스무 대가 전선으로 갔다. 싸움은 석 달 만에 끝났다. 내 이름은 장부에 남았다.',tone:'good'}; }},
  {t:'늙은 몸이라 사양한다',go:()=>{ m.joy=cl(m.joy-3); addAlly(-3); return '깃발은 다른 이에게 갔다. 승전보가 올 때까지 잠을 설쳤다.'; }}]});

/* ---------- 반로환동: 화경에 이르고 내공이 네 갑자를 넘긴 예순 이후 ---------- */
E('rejuv',{min:60,max:150,once:1,w:9,gi:1,when:()=>m.f.martial&&m.lv>=6&&m.ng>=240&&!m.f.rejuv,st:()=>Sg('pond',{time:'dawn',wx:'petal',hero:{x:80,pose:'sit',act:'meditate',auraC:'#bff4ff'}}),
  text:()=>'운기를 마치고 눈을 뜨니 손등의 검버섯이 없다. 물에 비친 얼굴에서 주름이 걷히고 있다. 늙음이 극에 이르면 되돌아간다고 했다. 반로환동(返老還童)이다.',ch:[
  {t:'흐름에 몸을 맡긴다',go:()=>{ m.f.rejuv=m.age; m.hp=100; m.ng+=20; m.b.st.body=Math.min(12,m.b.st.body+2); m.fame+=20; log('반로환동을 이루었다. 몸이 서른 해 젊어졌다',true); return {t:'흰 머리가 검어지고 이가 새로 났다. 사흘 뒤 거울 속에는 서른 해 전의 얼굴이 있었다. 사람들은 한동안 나를 알아보지 못했다.',tone:'good',big:'반로환동',cut:()=>{ callout('返老還童','gi gssr',2800); flashA=.95; flashC='#e8fbff'; spark('hero','#bff4ff',26); }}; }},
  {t:'"늙은 대로가 좋다" 한다',go:()=>{ m.hp=100; m.ng+=30; m.hy+=5; m.joy=cl(m.joy+10); log('반로환동의 기회를 내려놓았다',true); return {t:'기운은 돌려 단전에 쌓고, 얼굴은 그대로 두었다. 주름은 내가 산 날들이다.',tone:'good'}; }}]});
