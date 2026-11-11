/* ==== murim:events — 강호의 갈림길 (장면 · 주사위 · 결투) ==== */
const spark=(id,c,n)=>{ const a=A(id); if(a) fxSpark(a.x,a.y-10,c||'#ffe9a0',n||10); };
const leave=(id,dir)=>{ const a=A(id); if(a){ a.lock=false; a.act=null; a.ay=0; a.pose0='walk'; a.goto=dir<0?-22:W+22; } };
const heroIdle=()=>{ const h=A('hero'); if(h){ h.L=heroLook(); h.pose=h.pose0='idle'; h.act=null; } };
const rname=()=>pick(SURN)+gname();
const mob=(pre,mk,xs,o)=>xs.map((x,i)=>N(pre+i,mk(i),x,typeof o==='function'?o(i):o));
const folk=(i,o)=>npcLook(Object.assign({name:'f'+i+(m?m.age:0),age:20+((i*13)%40)},o||{}));
function shadowLook(){ const L=heroLook(); return LOOK.shadow({sex:L.sex,hair:L.hair==='tuft'||L.hair==='buns'||L.hair==='bald'?'long':L.hair,weapon:L.weapon||'sword'}); }
BG.room={ter:'room',room:'inn',n:'방 안',props:[['bed',56,{dy:8}],['lantern',128,{dy:-76}]]};
BG.cliff={ter:'cave',n:'절벽 아래 동굴',props:[]};

E('heartDemon',{st:()=>Sg('cave',{tint:'red',wx:'blood',name:'심마',cast:[N('sh',shadowLook(),126,{pose:'guard',tag:'심마',tagc:'foe'})],hero:{pose:'sit',emote:'skull'}}),
  text:()=>'심마가 목까지 차올랐다. 눈을 감으면 지금껏 벤 얼굴들이 웃는다. 그 한가운데, 나와 똑같이 생긴 것이 칼을 들고 서 있다.',ch:[
  {t:'마공을 스스로 폐한다',s:'무공의 절반을 잃는다',go:()=>{ m.f.magong=0; m.arts=m.arts.filter(a=>a.k!=='마공'); m.exp*=.5; m.sim=0; m.ng*=.6; log('스스로 마공을 폐했다',true); return {t:'단전을 스스로 쳤다. 피를 한 사발 토했다. 무공의 절반이 사라졌지만, 머리가 맑아졌다.',tone:'good',cut:()=>{ const s=A('sh'), h=A('hero'); if(s) s.alpha=.25; if(h) blood(h.x,h.y-10,1); }}; }},
  {t:'심마와 맞선다',s:'또 하나의 나와 생사를 겨룬다',duel:()=>({foe:{name:'심마',look:shadowLook(),pow:Math.round(power()*1.1),style:'assassin',mercy:0,art:'혈영참'},lethal:1,noMercy:1,noReturn:1,cause:'심마에 먹혀 주화입마'}),go:(ok,res)=>{ if(ok){ m.sim=20; addExp(80); m.ak+=30; m.f.demonLord=1; log('심마를 베고 마도의 끝을 보았다',true); return {t:'또 하나의 내가 웃으며 흩어졌다. 광기 끝에서 이상하리만치 고요한 곳에 닿았다. 이제 아무것도 두렵지 않다.',tone:'bad'}; } if(res.fled){ hurt(15); m.sim=90; return {t:'눈을 떴다. 식은땀이 흥건하다. 그것은 아직 그 자리에 있다.',tone:'bad'}; } return {t:'웃음소리가 멈추지 않았다.',tone:'bad'}; }}]});
E('child6',{min:6,max:6,once:1,st:()=>Sg('market',{cast:[N('old',LOOK.oldbeggar(),112,{pose:'beg',tag:'노인',emote:'...'})],hero:{look:heroLook({item:'candy'}),pose:'carry',x:78}}),
  text:()=>'장터 귀퉁이에서 허름한 노인이 배가 고프다며 손을 내민다. 손에는 엿 한 가락이 있다.',ch:[
  {t:'엿을 나눠 준다',go:()=>{ m.f.oldman=1; bump('luck'); log('장터에서 굶주린 노인에게 엿을 나눠 주었다'); return {t:'노인은 껄껄 웃으며 이마를 톡 쳤다. "눈이 맑구나." 그러고는 사라졌다.',tone:'good',cut:()=>{ heroIdle(); setPose('old','point'); emo('old','note'); spark('hero','#ffe9a0',12); setTimeout(()=>leave('old',1),1100); }}; }},
  {t:'모른 척 지나간다',go:()=>({t:'뒤돌아보니 노인은 벌써 보이지 않았다.',cut:()=>{ const o=A('old'); if(o) o.hide=true; emo('hero','?'); }})},
  {t:'노인의 지팡이를 걷어찬다',go:()=>{ m.ak+=5; m.f.oldmanBad=1; return {t:'노인은 넘어지지 않았다. 지팡이도 꿈쩍하지 않았다. 발목만 시큰거렸다.',tone:'bad',cut:()=>{ emo('old','...'); }}; }}]});
E('child6b',{min:6,max:6,once:1,st:()=>Sg('village',{cast:[N('b1',LOOK.child({robe:'#6b5430',hair:'band'}),116,{tag:'덩치',emote:'anger'}),N('b2',LOOK.child({robe:'#5a5a64'}),142),N('vic',LOOK.girl(),128,{pose:'cry',emote:'tear'})]}),
  text:()=>'동네 덩치들이 작은 아이 하나를 둘러싸고 있다. 아이가 울면서 이쪽을 본다.',ch:[
  {t:'끼어들어 막는다',s:'주먹다짐',duel:()=>({foe:{name:'동네 덩치',look:LOOK.child({robe:'#6b5430',hair:'band'}),pow:6,style:'brute'},stn:{A:'주먹질',G:'버티기',F:'발 걸기',U:'박치기'},extras:[N('vic',LOOK.girl(),174,{pose:'cry'})]}),go:ok=>{ m.hy+=4; if(ok){ bump('body'); rel('친구',null,70); return {t:'코피를 쏟으면서도 끝까지 버텼다. 덩치들이 먼저 도망쳤다. 그 아이와 친구가 되었다.',tone:'good'}; } return {t:'셋을 당하지는 못했다. 그래도 그 아이는 내 이름을 기억했다.',tone:'bad'}; }},
  {t:'어른을 부르러 뛴다',go:()=>{ bump('wit'); return {t:'어른들이 오자 덩치들은 흩어졌다.',cut:()=>{ leave('b1',1); leave('b2',1); emo('vic',null); }}; }},
  {t:'못 본 척한다',go:()=>{ m.ak+=2; return '그날 밤 이상하게 잠이 오지 않았다.'; }}]});
E('exam',{min:9,max:9,once:1,st:()=>{ const ks=choicesOf(EV.exam).map(c=>c.k).filter(Boolean); return Sg('temple',{name:'입문 시험',cast:ks.slice(0,3).map((k,i)=>N('ex'+i,npcLook({name:'시험관'+k,sex:SECTS[k].female?'f':'m',age:60,sect:k,weapon:'sword',hair:k==='shaolin'?'bald':null}),104+i*22,{tag:SECTS[k].n})).concat([N('k1',LOOK.child(),34,{face:1}),N('k2',LOOK.girl(),22,{face:1})])}); },
  text:()=>'문파들이 제자를 뽑으러 고을에 내려왔다. 평생이 걸린 날이다.',ch:()=>{
  const o=OR(m.b.o), list=[];
  if(m.sect) return [{k:m.sect,t:`${SECTS[m.sect].n}에서 본격적으로 수련을 시작한다`,go:()=>{ addExp(4); log(`${SECTS[m.sect].n}의 정식 제자가 되었다`,true); if(!relOf('사부')) rel('사부',null,65); return {t:'가문의 어른이 직접 손을 잡아 주었다.',tone:'good'}; }}];
  if(o.hint&&sectOK(o.hint)) list.push(o.hint);
  const rs=regOf(m.b.reg).sect; if(rs&&!list.includes(rs)&&sectOK(rs)) list.push(rs);
  const pool=['shaolin','wudang','huashan','emei'].filter(sectOK);
  while(list.length<3){ const k=pick(pool); if(!list.includes(k)) list.push(k); }
  const out=list.map(k=>{ const S=SECTS[k], base=.15+(ST('body')+ST('wit'))/26+(k===o.hint?.35:0)+(hasT('bone')?.15:0);
    return {k,t:`${S.n} 입문 시험을 본다`,s:`${S.art[0]}의 문파`,p:()=>base,go:ok=>{ if(ok){ joinSect(k); return {t:`${S.n}의 제자가 되었다. 사부가 "이놈 물건이구나" 하고 웃었다.`,tone:'good'}; } log(`${S.n} 입문 시험에 떨어졌다`); return {t:`${S.n}의 시험관은 고개를 저었다. "근골이 아깝구나."`,tone:'bad'}; }}; });
  out.push({t:'집에 남는다',go:()=>'문파 사람들이 떠난 장터는 다시 조용해졌다.'});
  return out; }});
E('envoy',{min:13,max:18,once:1,w:9,when:()=>m.f.blood,st:()=>Sg('yard',{time:'night',cast:mob('en',()=>LOOK.cultist(),[104,122,140],{pose:'kneel'})}),
  text:()=>'달 없는 밤, 검은 옷의 사내들이 집 앞에 무릎을 꿇었다. "소교주님. 교주께서 기다리십니다."',ch:[
  {t:'그들을 따라 서쪽으로 간다',s:'천마신교',go:()=>{ m.sect=null; joinSect('demon'); m.f.heir=1; m.b.hidden=1; return {t:'어머니가 오래 보던 서쪽 하늘 끝에 그들의 성이 있었다. 피가 끓었다.',tone:'bad'}; }},
  {t:'거절한다',go:()=>{ m.f.refusedDemon=1; m.hy+=8; m.b.hidden=1; log('천마신교의 핏줄임을 알았지만 거절했다',true); return {t:'사내들은 아무 말 없이 물러났다. 그날부터 누군가 늘 지켜보는 느낌이 든다.',cut:()=>{ ['en0','en1','en2'].forEach(k=>leave(k,1)); }}; }}]});
E('master',{min:12,max:30,once:1,w:1.5,gi:1,when:()=>(m.f.oldman||ST('luck')>=8)&&!m.f.master,st:()=>Sg('hermit',{props:[['rock',84,2]],cast:[N('ms',m.f.oldman?LOOK.oldbeggar():LOOK.master(),104,{tag:'노인',pose:m.f.oldman?'sit':'idle'})]}),
  text:()=>m.f.oldman?'어릴 적 장터에서 엿을 나눠 준 그 노인이 산길에 앉아 있다. "기다렸다. 내 무공을 이을 놈을."':'산길에서 장작을 패던 노인이 한 손으로 바위를 쪼갰다. 그리고 이쪽을 보았다.',ch:[
  {t:'무릎을 꿇고 제자가 되겠다고 한다',go:()=>{ m.f.master=1; learn('태허검결',26,'검'); learn('태허무량공',0,'내공',20); addExp(15); rel('은사',null,80); if(!m.inv.w||ITEMS[m.inv.w].t<1) give('gsword'); log('은거기인의 제자가 되어 태허검결을 이었다',true); return {t:'노인은 세 해 동안 아무것도 가르치지 않다가, 어느 날 밤 한 초식을 보여 주었다. 그 한 초식에 다 들어 있었다.',tone:'good',cut:()=>{ setPose('hero','kneel'); setPose('ms','cast'); const a=A('ms'); if(a) FX.push({t:'ring',x:a.x-12,y:a.y-13,life:14,max:14,c:'#ffe9a0'}); }}; }},
  {t:'사문이 있어 정중히 사양한다',when:()=>!!m.sect,go:()=>{ addExp(5); return {t:'노인은 "그것도 도리지"라며 손가락으로 혈도 하나를 짚어 주었다. 막혀 있던 기맥이 뚫렸다.',tone:'good',cut:()=>{ setPose('hero','bow'); spark('hero','#bfe8ff'); }}; }},
  {t:'수상하다, 피한다',go:()=>'다시 돌아보니 바위는 원래부터 갈라져 있었던 것처럼 보였다.'}]});
E('cliff',{min:13,max:50,once:1,w:1.2,gi:1,st:()=>Sg('cliff',{props:[['skeleton',122,{dy:8}],['scroll',106,{dy:9,c:'#3f6fae'}],['scroll',140,{dy:9,c:'#b8321f'}]],hero:{emote:'!'}}),
  text:()=>'쫓기다 발을 헛디뎌 절벽 아래로 떨어졌다. 정신을 차려보니 덩굴 뒤로 동굴이 있고, 백골 하나가 비급 두 권을 안고 있다.',ch:[
  {t:'푸른 비단으로 묶인 비급을 집는다',s:'정종 심법',go:()=>{ learn('청명심경',0,'내공',30); addExp(20); log('절벽 아래 동굴에서 청명심경을 얻었다',true); return {t:'백골에게 절을 하고 비급을 펼쳤다. 동굴에서 나오기까지 석 달이 걸렸다. 내공이 크게 늘었다.',tone:'good',cut:()=>{ setPose('hero','sit',{act:'meditate',auraC:'#9fd0ff'}); }}; }},
  {t:'핏자국이 번진 비급을 집는다',s:'마공 · 훨씬 강하다',go:()=>{ learn('혈하마공',28,'마공',15); addExp(35); m.ak+=10; log('동굴에서 혈하마공을 얻었다',true); return {t:'글자가 눈에 들어오자마자 손끝까지 뜨거워졌다. 이런 힘은 처음이었다.',tone:'bad',cut:()=>{ setPose('hero','sit',{act:'meditate',auraC:'#ff5a3a'}); if(SC) SC.tint='red'; }}; }},
  {t:'둘 다 백골과 함께 묻어 준다',go:()=>{ m.hy+=10; bump('luck',2); give('mirror'); log('동굴의 백골을 묻어 주었다'); return {t:'무덤을 만들어 주려 흙을 파는데, 백골의 품에서 낡은 호심경 하나가 굴러 나왔다. "가져가라"는 듯이.',tone:'good',cut:()=>{ setPose('hero','kneel'); }}; }}]});
E('herb',{min:12,max:70,once:1,w:1.2,gi:1,st:()=>Sg('mountain',{props:[['herb',112,{dy:8,k:m.f.herbK||'fruit'}]],hero:{x:70,emote:'!'}}),
  text:()=>{ const k=pick(['fruit','ginseng','lingzhi']); m.f.herbK=k; return `깊은 산 바위틈에서 기이한 향이 난다. ${({fruit:'붉게 빛나는 열매',ginseng:'사람 모양의 설삼',lingzhi:'달빛을 머금은 영지'})[k]}다. 영약이다.`; },ch:[
  {t:'그 자리에서 먹는다',go:()=>{ const n=ri(25,60); m.ng+=n; m.f.elixirLife=(m.f.elixirLife||0)+5; if(hasT('cold')) m.f.coldCured=1; log(`영약을 먹고 내공이 ${n}년 늘었다`,true); return {t:`온몸이 불타는 듯하다가 얼음처럼 식었다. 내공 ${n}년이 단전에 자리 잡았다.${hasT('cold')?' 몸속의 한기가 녹아 없어졌다.':''}`,tone:'good',cut:()=>{ setPose('hero','sit',{act:'meditate',auraC:'#ffb060'}); }}; }},
  {t:'캐서 팔아 은자로 바꾼다',go:()=>{ const g=ri(200,500); gold(g); return `저잣거리 약방 주인이 눈이 휘둥그레져서 ${g}냥을 내놓았다.`; }},
  {t:'병든 마을 사람에게 가져다준다',go:()=>{ m.hy+=15; m.fame+=6; log('영약을 병자에게 주었다'); return {t:'노파의 숨이 돌아왔다. 마을 사람들이 내 이름을 부르며 절을 했다.',tone:'good'}; }}]});
E('coldAttack',{min:16,max:19,when:()=>hasT('cold')&&!m.f.coldCured,w:9,st:()=>Sg('room',{time:'night',tint:'cold',wx:'frost',hero:{x:58,dy:-7,pose:'lie',act:'shiver'}}),
  text:()=>'한밤중에 뼛속에서 얼음이 자라는 것 같다. 천음절맥이 발작했다. 이번 겨울을 넘기기 어렵다.',ch:[
  {t:'북해 빙궁의 한빙과를 찾아 떠난다',p:()=>.25+ST('luck')*.05,go:ok=>{ if(ok){ m.f.coldCured=1; m.ng+=20; log('북해에서 한빙과를 구해 천음절맥을 고쳤다',true); return {t:'눈보라 속에서 열매 하나를 찾았다. 한기가 한기를 먹었다. 살았다.',tone:'good',st:Sg('snow',{props:[['herb',116,{dy:8,k:'ice'}]]})}; } hurt(45,'천음절맥'); return {t:'빈손으로 돌아왔다. 손끝이 검게 변했다.',tone:'bad',st:Sg('snow')}; }},
  {t:'고수에게 내공으로 맥을 뚫어 달라고 청한다',when:()=>!!(m.sect||m.f.master),p:()=>.6,go:ok=>{ if(ok){ m.f.coldCured=1; log('사부가 내공을 쏟아 천음절맥을 뚫었다',true); return {t:'사부가 사흘 밤낮 내공을 불어넣었다. 사부의 머리가 하얗게 셌다.',tone:'good'}; } hurt(40,'천음절맥'); return {t:'맥은 끝내 뚫리지 않았다.',tone:'bad'}; }},
  {t:'남은 날을 받아들인다',go:()=>{ m.f.coldAccept=1; hurt(30,'천음절맥'); return '창밖의 눈을 오래 보았다.'; }}]});
E('rival',{min:13,max:30,once:1,when:()=>!!m.sect,st:()=>{ const r=relOf('사형'); return Sg('dojo',{cast:[N('riv',r?relLook(r):LOOK.youth(),116,{pose:'guard',tag:r?r.name:'사형',emote:'anger'}),N('sa',masterLook(),164,{tag:'사부'})]}); },
  text:()=>{ const r=rel('사형'); r.v=30; return `사형 ${iga(r.name)} 대련을 핑계로 일부러 급소를 노린다. 사부가 나를 더 아끼는 게 못마땅한 모양이다.`; },ch:[
  {t:'정면으로 받아친다',duel:()=>{ const r=relOf('사형'); return {foe:{name:r.name,title:'사형',look:relLook(r),pow:Math.round(power()*1.05+3),style:'brute'},extras:[N('sa',masterLook(),176,{tag:'사부'})]}; },go:ok=>{ const r=relOf('사형'); if(ok){ r.v=20; m.fame+=3; addExp(4); return {t:`${eul(r.name)} 단상 아래로 날려 보냈다. 사형제들의 눈빛이 바뀌었다.`,tone:'good'}; } r.v=10; return {t:'갈비뼈가 나갔다. 사형은 "실수였다"고 했다.',tone:'bad'}; }},
  {t:'일부러 져 준다',go:()=>{ const r=relOf('사형'); r.v=55; bump('wit'); return {t:'사형은 의기양양했다. 사부는 아무 말 없이 내 어깨를 두드렸다.',cut:()=>{ setPose('hero','down'); emo('riv','note'); }}; }},
  {t:'사부에게 알린다',go:()=>{ const r=relOf('사형'); r.v=5; r.role='원수'; return {t:'사형은 벌을 받았다. 산문을 떠나며 나를 오래 노려보았다.',cut:()=>{ leave('riv',-1); }}; }}]});
E('contest',{min:16,max:28,w:1.6,when:()=>m.f.martial&&!m.used.contest,st:()=>Sg('arena',{cast:[N('c1',npcLook({name:'기재',sex:'m',age:20,sect:'huashan',weapon:'sword'}),120,{pose:'guard'}),N('c2',npcLook({name:'호걸',sex:'m',age:22,sect:'beggar'}),146,{})]}),
  text:()=>'무림맹이 여는 후기지수 비무대회가 열렸다. 강호의 젊은 고수들이 다 모였다. 여기서 이름을 얻으면 평생 따라다닌다.',ch:[
  {t:'출전한다',s:'세 판을 내리 이겨야 우승',duel:()=>({chain:[
      {name:rname(),title:'화산파의 기재',look:npcLook({name:'기재',sex:'m',age:20,sect:'huashan',weapon:'sword'}),pow:42,style:'sword',art:'매화검법'},
      {name:rname(),title:'개방의 젊은 호걸',look:npcLook({name:'호걸',sex:'m',age:22,sect:'beggar'}),pow:52,style:'brute',art:'용음장'},
      {name:'남궁'+gname(),title:'남궁세가 소가주',look:npcLook({name:'소가주',sex:'m',age:21,sect:'namgung',weapon:'sword',hair:'crown'}),pow:64,style:'sword',art:'창궁무애검'}]}),
    go:(ok,res)=>{ const won=res.won||0;
      if(won>=3){ const w=wOf(2); m.fame+=30; m.hy+=6; m.alias=makeAlias(); give(w); log(`후기지수 비무대회에서 우승했다. 강호가 '${m.alias}'라 불렀다`,true); return {t:`결승에서 상대의 검을 쳐냈다. 관중석이 뒤집혔다. 그날부터 강호는 나를 '${m.alias}'라 불렀다. 우승 상으로 ${eul(ITEMS[w].n)} 받았다.`,tone:'good'}; }
      if(won===2){ m.fame+=12; give('salve',{n:2}); gold(40); log('후기지수 비무대회 결승에서 졌다',true); return {t:'결승까지 갔다. 마지막 한 수가 모자랐다. 그래도 이름은 알려졌다.',tone:'good'}; }
      if(won===1){ m.fame+=4; return '두 번째 판에서 졌다. 세상에 고수가 많다는 것을 알았다.'; }
      return {t:'첫 판에서 떨어졌다. 상대는 나보다 두 살 어렸다.',tone:'bad'}; }},
  {t:'구경만 한다',go:()=>{ addExp(3); return {t:'남궁세가의 소가주가 우승했다. 초식 하나하나를 머리에 새겼다.',cut:()=>{ npcFight('c1','c2',{winner:'b'}); }}; }}]});
E('bandit',{min:14,max:60,w:1.3,rep:6,st:()=>Sg('road',{cast:[N('chief',LOOK.chief(),122,{tag:'두목',emote:'anger',pose:'guard'})].concat(mob('bd',()=>LOOK.bandit(),[142,156,172],{pose:'guard'}))}),
  text:()=>'고갯길에서 녹림도 열댓이 길을 막았다. "목숨이 아까우면 가진 걸 다 내놔라."',ch:[
  {t:'칼을 뽑는다',when:()=>m.f.martial||!!m.inv.w,duel:()=>({foe:{name:'녹림 두목',look:LOOK.chief(),pow:36+m.lv*4,style:'bandit',mercy:.6,art:'녹림도법'},lethal:1,rob:.6,cause:'녹림도의 칼',loot:{g:[10,40],it:[['bsaber',.3],['salve',.5],['lvest',.2]]},extras:mob('bd',()=>LOOK.bandit(),[170,184],{act:'cheer'})}),
    go:(ok,res)=>{ if(ok){ m.hy+=4; m.fame+=3; return {t:res.killed?'두목이 쓰러지자 나머지는 산으로 흩어졌다.':'두목의 칼을 부러뜨리자 나머지는 산으로 흩어졌다.',tone:'good'}; } if(res.dead) return {t:'수가 너무 많았다.',tone:'bad'}; return {t:res.fled?'칼을 거두고 숲으로 뛰어들었다. 등 뒤로 웃음소리가 따라왔다.':'다 털리고 피투성이로 기어 내려왔다.',tone:'bad'}; }},
  {t:'가진 돈을 내놓는다',go:()=>{ gold(-m.gold*.7); return {t:'산적들은 낄낄거리며 길을 터 주었다.',cut:()=>{ emo('chief','coin'); }}; }},
  {t:'뒤돌아 달아난다',p:()=>.35+ST('body')*.04,go:ok=>{ if(ok) return {t:'숨이 턱에 닿도록 뛰었다. 따돌렸다.',tone:'good'}; hurt(18,'녹림도의 몽둥이'); gold(-m.gold*.5); return {t:'등에 몽둥이를 맞고 굴렀다. 가진 것의 절반을 빼앗겼다.',tone:'bad'}; }},
  {t:'산채에 들어가겠다고 한다',when:()=>side()!=='정',go:()=>{ m.ak+=10; gold(30); if(!m.sect){ joinSect('nokrim'); } return {t:'두목이 껄껄 웃으며 술잔을 내밀었다. 녹림의 형제가 되었다.',tone:'bad',cut:()=>{ emo('chief','note'); }}; }}]});
E('innFight',{min:15,max:60,w:1.2,rep:5,st:()=>Sg('innroom',{cast:[N('dr',LOOK.swordsman(),112,{tag:'취한 무인',emote:'anger',pose:'point'}),N('wt',npcLook({name:'점소이',sex:'m',age:17,extra:'apron'}),132,{pose:'kneel',emote:'tear',tag:'점소이'})]}),
  text:()=>'객잔에서 술 취한 무인이 점소이를 때리고 있다. 허리에 찬 패를 보니 제법 이름 있는 문파다.',ch:[
  {t:'말린다',when:()=>m.f.martial,duel:()=>({foe:{name:'취한 무인',look:LOOK.swordsman(),pow:44+m.lv*3,style:'brute'},extras:[N('wt',npcLook({name:'점소이',sex:'m',age:17,extra:'apron'}),176,{pose:'kneel'})]}),go:ok=>{ m.hy+=5; if(ok){ m.fame+=3; return {t:'젓가락 하나로 그의 손목을 눌렀다. 객잔이 조용해졌다.',tone:'good'}; } rel('원수',null,10); return {t:'얻어맞고 쫓겨났다. 그 무인이 내 얼굴을 기억하겠다고 했다.',tone:'bad'}; }},
  {t:'술값을 대신 내주고 달랜다',when:()=>m.gold>=20,go:()=>{ gold(-20); bump('charm'); rel('지기',null,60); return {t:'무인은 머쓱해하더니 형님 아우 하자고 했다.',tone:'good',cut:()=>{ setPose('dr','drink'); emo('dr','note'); emo('wt',null); }}; }},
  {t:'구석에서 국수나 먹는다',go:()=>{ m.ak+=1; return '국수는 맛있었다.'; }}]});
E('love',{min:16,max:32,once:1,w:1.4,when:()=>!m.spouse,st:()=>Sg('river',{wx:'rain',cast:[N('lv',npcLook({name:m.f.loveName,sex:m.sex==='m'?'f':'m',age:m.age,extra:'umbrella',blush:1}),90,{tag:m.f.loveName})],hero:{x:72}}),
  text:()=>{ const n=rname(); m.f.loveName=n; return `빗속에서 우산을 같이 쓴 ${n}. 눈이 마주친 순간 숨이 멎는 줄 알았다.${R()<.35?' 그런데 그쪽은 원수 집안 사람이라고 한다.':''}`; },ch:[
  {t:'마음을 고백한다',p:()=>.25+ST('charm')*.06,go:ok=>{ if(ok){ const r=rel('정인',m.f.loveName,75); m.q.push({age:m.age+ri(1,3),id:'wedding'}); log(`${wa(r.name)} 마음을 나눴다`,true); return {t:'대답 대신 손을 잡아 주었다.',tone:'good',cut:()=>{ emo('hero','heart'); emo('lv','heart'); }}; } return {t:'정중한 거절이었다. 그래서 더 아팠다.',tone:'bad',cut:()=>{ leave('lv',1); emo('hero','tear'); }}; }},
  {t:'무공이 먼저다',go:()=>{ addExp(3); return {t:'그 얼굴을 떠올리지 않으려고 검을 더 휘둘렀다.',cut:()=>{ leave('lv',1); }}; }}]});
E('wedding',{st:()=>{ const r=relOf('정인'); return Sg('wedding',{wx:'petal',cast:[N('sp',r?relLook(r,{robe:'#b8324a',blush:1}):LOOK.woman({robe:'#b8324a'}),90,{tag:r?r.name:'',emote:'heart'})].concat(mob('g',i=>folk(i),[22,36,150,168],i=>({act:'cheer',face:i<2?1:-1}))),hero:{look:heroLook({robe:'#b8324a',weapon:null}),x:72}}); },
  text:()=>`${wa(relOf('정인')?relOf('정인').name:'그 사람')} 혼례를 올리기로 했다. 붉은 비단이 걸렸다.`,ch:[
  {t:'혼례를 올린다',go:()=>{ const r=relOf('정인')||rel('정인'); r.role='배우자'; m.spouse=r; gold(-Math.min(m.gold,40)); log(`${wa(r.name)} 혼인했다`,true); m.q.push({age:m.age+ri(1,3),id:'birth'}); return {t:'술에 취한 사형제들이 밤새 노래를 불렀다.',tone:'good',cut:()=>{ setPose('hero','bow'); setPose('sp','bow'); spark('hero','#ffd0d8',14); }}; }},
  {t:'강호의 원한이 무서워 떠난다',go:()=>{ const r=relOf('정인'); if(r) r.dead=1; m.f.lostLove=1; log('혼례를 앞두고 정인을 떠났다',true); return {t:'편지 한 장만 남겼다. 평생 그 편지를 후회했다.',tone:'bad',cut:()=>{ leave('hero',-1); emo('sp','tear'); }}; }}]});
E('birth',{when:()=>!!m.spouse,st:()=>Sg('home',{time:'dawn',cast:[N('sp',relLook(m.spouse,{item:'baby'}),92,{pose:'carry',emote:'heart'})],hero:{x:72,emote:'!'}}),
  text:()=>'아이가 태어났다. 손가락이 이렇게 작을 수가 있나.',ch:[
  {t:'이름을 지어 준다',go:()=>{ m.kids++; const n=m.b.sur+gname(); rel('자식',n,80,{sx:R()<.5?'m':'f'}); log(`자식 ${iga(n)} 태어났다`,true); if(R()<.4) m.q.push({age:m.age+ri(2,4),id:'birth'}); return {t:`${ro(n)} 이름을 지었다.`,tone:'good',cut:()=>{ emo('hero','heart'); }}; }}]});
E('doom',{min:16,max:32,once:1,w:1.1,when:()=>['clan','tangc','escort','doctor','farmer','hunter'].includes(m.b.o)&&!m.f.doom,st:()=>Sg(['clan','tangc'].includes(m.b.o)?'manor':'home',{time:'night',tint:'red',wx:'ember',props:[['fire',112,{s:2}],['fire',150,{dy:4}],['smoke',128,{dy:-30}]],cast:[N('d1',folk(1),98,{pose:'dead'}),N('d2',folk(2,{sex:'f'}),146,{pose:'dead',face:1})],hero:{x:50,pose:'kneel',emote:'tear'}}),
  text:()=>'집에 돌아오니 불길이 치솟고 있었다. 가솔들이 쓰러져 있다. 담장에 피로 그린 문양이 남았다. 혈겁이다.',ch:[
  {t:'복수를 맹세한다',go:()=>{ m.f.doom=1; m.f.revenge=pick(['혈영문','흑룡방','귀면대','적사회']); gold(-m.gold*.8); hurt(20); m.q.push({age:m.age+ri(6,14),id:'revenge'}); log(`가문이 ${m.f.revenge}에게 멸문당했다`,true); return {t:`잿더미에서 문양의 이름을 찾아냈다. ${m.f.revenge}. 그 이름을 가슴에 새겼다.`,tone:'bad',cut:()=>{ emo('hero','anger'); }}; }},
  {t:'살아남은 가솔을 데리고 숨는다',go:()=>{ m.f.doom=1; gold(-m.gold*.5); m.hy+=6; log('가문이 멸문당했고, 남은 이들을 데리고 숨었다',true); return {t:'복수보다 산 사람이 먼저였다. 먼 남쪽 고을에 이름을 바꾸고 숨었다.',tone:'bad'}; }}]});
E('revenge',{when:()=>!!m.f.revenge,st:()=>Sg('manor',{time:'night',name:`${m.f.revenge} 총단`,cast:mob('gd',()=>LOOK.blackclad(),[120,150],{pose:'guard'}),hero:{x:40}}),
  text:()=>`${m.f.revenge}의 총단 위치를 알아냈다. 오늘 밤 담을 넘는다.`,ch:[
  {t:'홀로 쳐들어간다',s:'문지기를 넘고 방주까지',duel:()=>({chain:[{name:'총단 문지기',look:LOOK.blackclad(),pow:56,style:'bandit',mercy:0},{name:`${m.f.revenge} 방주`,look:LOOK.chief({robe:'#3a1c1c',hair:'long'}),pow:78,style:'brute',mercy:0,art:'혈영도'}],lethal:1,cause:'복수의 밤',noReturn:1,loot:{g:[80,200],it:[[wOf(2),.5],['gvest',.3]]}}),
    go:(ok,res)=>{ if(ok){ m.fame+=25; m.hy+=res.spared?12:6; if(res.killed) m.ak+=4; addExp(12); log(`${m.f.revenge}의 총단을 홀로 무너뜨려 복수를 끝냈다`,true); m.f.revenge=null; return {t:res.spared?'칼끝을 거두었다. 원수는 무너진 총단 앞에서 통곡했다. 새벽이 왔다.':'새벽이 되기 전에 끝났다. 원수의 목 앞에서 오래 울었다.',tone:'good'}; } if(res.fled){ m.q.push({age:m.age+ri(4,8),id:'revenge'}); return {t:'담을 다시 넘어 달아났다. 아직은 아니다.',tone:'bad'}; } return {t:'담을 넘자마자 그물이 내려왔다.',tone:'bad'}; }},
  {t:'무림맹에 고발해 함께 친다',when:()=>side()!=='사',p:()=>.55+m.fame/200,go:ok=>{ if(ok){ m.hy+=10; m.fame+=10; log(`무림맹과 함께 ${eul(m.f.revenge)} 멸했다`,true); m.f.revenge=null; return {t:'정파 고수들과 함께 총단을 쳤다. 원수의 목은 내가 베었다.',tone:'good'}; } m.q.push({age:m.age+ri(4,8),id:'revenge'}); return {t:'맹 안에 첩자가 있었다. 원수는 미리 달아났다.',tone:'bad'}; }},
  {t:'더 강해진 다음에 한다',go:()=>{ m.q.push({age:m.age+ri(4,8),id:'revenge'}); return '이를 악물고 돌아섰다.'; }},
  {t:'원한을 내려놓는다',go:()=>{ m.f.revenge=null; m.hy+=8; bump('wit'); log('평생의 원한을 내려놓았다',true); return {t:'칼을 강물에 던졌다. 이상하게 가벼웠다.',tone:'good'}; }}]});
E('poison',{min:15,max:65,w:1,rep:12,st:()=>Sg('innroom',{tint:'green',hero:{x:46,emote:'skull'},cast:[N('p1',folk(3),150,{pose:'drink'})]}),
  text:()=>'찻잔을 내려놓는 순간 혀끝이 마비됐다. 독이다. 누가 넣었는지 모른다.',ch:[
  {t:'해독단을 삼킨다',when:()=>m.inv.bag.antidote>0,go:()=>{ m.inv.bag.antidote--; return {t:'품에서 해독단을 꺼내 씹었다. 쓴맛이 독을 밀어냈다.',tone:'good'}; }},
  {t:'내공으로 독을 밀어낸다',p:()=>hasT('immune')||hasFx('poison')?1:.2+m.ng/150,go:ok=>{ if(ok) return {t:hasT('immune')?'독은 몸속에서 그냥 녹아 없어졌다. 만독불침이다.':hasFx('poison')?'품속의 피독주가 뜨거워지더니 독기가 가셨다.':'손끝으로 검은 피가 빠져나왔다.',tone:'good'}; hurt(55,'독'); return {t:'독이 심맥까지 번졌다.',tone:'bad'}; }},
  {t:'의술로 해독한다',when:()=>m.f.med||m.f.poisonwise,p:()=>.85,go:ok=>{ if(ok) return {t:'혈도 세 곳을 찌르고 해독초를 씹었다.',tone:'good'}; hurt(50,'독'); return {t:'처음 보는 독이었다.',tone:'bad'}; }},
  {t:'의원에게 달려간다',when:()=>m.gold>=50,go:()=>{ gold(-50); hurt(20); return '의원이 50냥을 받고 겨우 살려 주었다.'; }},
  {t:'버틴다',go:()=>{ hurt(ri(35,70),'독'); return {t:'사흘을 앓았다.',tone:'bad'}; }}]});
E('treasure',{min:15,max:60,once:1,gi:1,st:()=>Sg('road',{time:'dusk',cast:[N('dy',LOOK.swordsman({item:'letter'}),104,{pose:'lie',emote:'...'})],hero:{x:74,pose:'kneel'}}),
  text:()=>'죽어가던 사내가 가죽 지도를 쥐여 주었다. "전대 고수의 보고(寶庫)다…."',ch:[
  {t:'지도를 따라간다',p:()=>.25+ST('luck')*.055,go:ok=>{ if(ok){ const g=ri(300,900), it=R()<.5?'gvest':'chain'; gold(g); give(it); const st=Sg('cave',{props:[['chest',118,{dy:8,open:1}]],tint:'gold'});
      if(R()<.5){ learn('천뢰신장',23,'장'); log('보고에서 천뢰신장과 금은을 얻었다',true); return {t:`금은 ${g}냥, ${ITEMS[it].n}, 그리고 벼락이 새겨진 비급 한 권.`,tone:'good',st}; } log(`보고를 찾아 ${g}냥을 얻었다`,true); return {t:`이끼 낀 상자 안에 금괴가 가득했다. ${g}냥어치다. 바닥에는 ${ITEMS[it].n}도 한 벌 깔려 있었다.`,tone:'good',st}; } hurt(25,'보고의 함정'); return {t:'함정이었다. 독침이 등에 박혔다.',tone:'bad',st:Sg('cave',{props:[['trap',110,{dy:9}]]})}; }},
  {t:'관아에 넘긴다',go:()=>{ m.hy+=4; gold(20); return '현령이 상으로 20냥을 주었다.'; }}]});
const warCast=()=>[N('s1',LOOK.soldier(),30,{face:1,act:'train'}),N('q1',LOOK.cultist(),52,{act:'train'}),N('s2',npcLook({name:'무당',sex:'m',age:30,sect:'wudang',weapon:'sword'}),150,{face:1,act:'train'}),N('q2',LOOK.cultist(),174,{act:'train'}),N('dd',LOOK.soldier(),112,{pose:'dead',dy:4})];
E('demonWar',{min:24,max:55,once:1,w:2,when:()=>m.f.martial&&m.lv>=2,st:()=>Sg('battle',{cast:warCast(),hero:{x:82}}),
  text:()=>'천마신교가 중원으로 쳐들어왔다. 정사대전이다. 무림맹이 격문을 돌렸다.',ch:()=>{ const c=[];
  if(m.sect!=='demon') c.push({t:'무림맹의 깃발 아래 싸운다',duel:()=>({foe:{name:'마교 장로',look:LOOK.cultist({size:'big',beard:'short'}),pow:70,style:'brute',mercy:.6,art:'혈하장'},lethal:1,cause:'정사대전에서 전사',noReturn:1,extras:[N('s1',LOOK.soldier(),14,{face:1,act:'train'}),N('q1',LOOK.cultist(),34,{act:'train'}),N('q2',LOOK.cultist(),176,{act:'cheer'})]}),
    go:(ok,res)=>{ if(ok){ const it=R()<.5?'gvest':'chain'; m.hy+=20; m.fame+=25; addExp(20); m.f.warHero=1; give(it); log('정사대전에서 큰 공을 세웠다',true); return {t:`열흘 밤낮 싸웠다. 마교의 장로 하나를 꺾었다. 이름이 강호 끝까지 퍼졌다. 무림맹이 전공으로 ${eul(ITEMS[it].n)} 내렸다.`,tone:'good'}; } if(res.dead) return {t:'핏빛 장력이 가슴을 꿰뚫었다.',tone:'bad'}; return {t:res.fled?'전열에서 물러났다. 등 뒤로 깃발이 쓰러지는 소리가 들렸다.':'한쪽 팔을 쓰지 못하게 되었다. 그래도 살아남았다.',tone:'bad'}; }});
  if(side()!=='정'||m.sect==='demon') c.push({t:'마교 편에 선다',duel:()=>({foe:{name:'무당 장로',look:LOOK.whitesword(),pow:68,style:'sword',mercy:.9,art:'태극검'},lethal:1,good:1,cause:'정사대전에서 전사',noReturn:1,extras:[N('q1',LOOK.cultist(),14,{face:1,act:'cheer'}),N('s2',LOOK.soldier(),176,{act:'cheer'})]}),
    go:(ok,res)=>{ m.ak+=25; if(ok){ m.fame+=25; addExp(20); m.f.demonHero=1; log('정사대전에서 마교 편에 서 정파 고수들을 꺾었다',true); return {t:'정파의 깃발이 하나씩 쓰러졌다. 교주가 직접 술을 따라 주었다.',tone:'bad'}; } if(res.dead) return {t:'태극의 검이 원을 그렸다. 그 원 안에 내가 있었다.',tone:'bad'}; return {t:'무당의 태극검에 막혔다. 피를 흘리며 물러났다.',tone:'bad'}; }});
  c.push({t:'가족을 데리고 피난한다',go:()=>{ m.f.fled=1; m.fame-=5; return {t:'산골로 들어가 전쟁이 끝나기를 기다렸다. 몇몇은 겁쟁이라 했다.',cut:()=>{ leave('hero',-1); }}; }});
  return c; }});
E('leader',{min:40,max:75,once:1,w:3,when:()=>m.lv>=5&&m.hy>=35&&m.fame>=55,st:()=>Sg('hall',{cast:mob('el',i=>[LOOK.elder(),LOOK.monk(),LOOK.whitesword(),npcLook({name:'아미',sex:'f',age:55,sect:'emei',weapon:'sword'})][i],[100,118,136,154],{pose:'bow'})}),
  text:()=>'무림맹주 자리가 비었다. 각 문파 장문인들이 내 이름을 올렸다.',ch:[
  {t:'맹주의 자리를 받는다',go:()=>{ m.f.leader=1; m.fame+=40; log('무림맹주에 올랐다',true); return {t:'맹주의 인장을 받았다. 무겁다.',tone:'good',cut:()=>{ callout('武林盟主','alias',1800); spark('hero','#ffe9a0',18); }}; }},
  {t:'사양하고 산으로 돌아간다',go:()=>{ m.hy+=10; bump('wit'); return '사람들은 더 존경했다.'; }}]});
E('demonLord',{min:35,max:75,once:1,w:3,when:()=>m.sect==='demon'&&m.lv>=6&&(m.f.heir||m.ak>=60),st:()=>Sg('hall',{time:'night',tint:'red',cast:mob('jl',()=>LOOK.cultist({beard:'long',hairC:'#bdb9b0'}),[112,134,156],{pose:'guard'})}),
  text:()=>'교주가 쓰러졌다. 장로들이 칼을 품고 서로를 본다. 천마의 자리가 비었다.',ch:[
  {t:'천마의 자리에 오른다',s:'장로 둘을 넘어야 한다',duel:()=>({chain:[{name:'좌호법',look:LOOK.cultist({beard:'long',hairC:'#bdb9b0'}),pow:m.f.heir?108:120,style:'assassin',mercy:0,art:'혈영참'},{name:'대장로',look:LOOK.cultist({size:'big',beard:'long',hairC:'#e6e4dc'}),pow:m.f.heir?130:145,style:'brute',mercy:0,art:'천마신공'}],lethal:1,noMercy:1,noReturn:1,cause:'교주 자리를 다투다 암살당함'}),
    go:(ok,res)=>{ if(ok){ m.f.tianmo=1; m.fame+=40; m.ak+=20; m.kills=(m.kills||0)+2; log('천마의 자리에 올랐다',true); return {t:'장로들의 목이 계단 아래로 굴렀다. 만마앙복(萬魔仰伏). 모두가 엎드렸다.',tone:'bad',cut:()=>{ callout('天魔','alias',1800); }}; } if(res.fled){ m.fame-=10; return {t:'대전을 빠져나왔다. 새 교주는 나를 잊지 않을 것이다.',tone:'bad'}; } return {t:'등 뒤의 장로가 먼저 움직였다.',tone:'bad'}; }},
  {t:'다른 장로를 밀어준다',go:()=>{ gold(300); return '새 교주는 은혜를 잊지 않겠다고 했다. 300냥이 왔다.'; }}]});
E('disciple',{min:30,max:75,w:1,rep:8,when:()=>m.lv>=4,st:()=>Sg('temple',{season:3,wx:'snow',cast:[N('kid',LOOK.child({robe:'#7b7466'}),96,{pose:'kneel',emote:'...'})],hero:{x:60}}),
  text:()=>`눈발 속에 아이 하나가 사흘째 문 앞에 무릎 꿇고 있다. ${pick(['근골이 좋아 보인다.','삐쩍 말랐지만 눈빛이 매섭다.','어릴 적 나를 닮았다.'])}`,ch:[
  {t:'제자로 받는다',go:()=>{ m.disc++; const r=rel('제자',null,70); m.fame+=3; log(`${eul(r.name)} 제자로 받았다`); if(R()<.25) m.q.push({age:m.age+ri(5,10),id:'betray'}); return {t:`${r.name}. 내 무공을 이을 아이다.`,tone:'good',cut:()=>{ setPose('kid','bow'); emo('kid','star'); }}; }},
  {t:'돌려보낸다',go:()=>({t:'아이는 나흘째 되는 날 떠났다.',cut:()=>{ leave('kid',1); }})}]});
E('betray',{when:()=>!!relOf('제자'),st:()=>Sg('library',{cast:[N('ds',relLook(relOf('제자'),{item:'book'}),104,{pose:'carry',emote:'!',tag:relOf('제자').name})],hero:{x:60}}),
  text:()=>`제자 ${iga(relOf('제자').name)} 비급을 훔쳐 달아나려다 걸렸다. 눈빛이 차갑다.`,ch:[
  {t:'무공을 폐하고 내쫓는다',go:()=>{ const r=relOf('제자'); r.role='원수'; r.v=0; return {t:'아이는 문을 나서며 언젠가 돌아오겠다고 했다.',cut:()=>{ leave('ds',1); }}; }},
  {t:'용서한다',p:()=>.5,go:ok=>{ if(ok) return {t:'제자는 사흘을 울더니 다시는 그러지 않았다.',tone:'good',cut:()=>{ setPose('ds','cry'); }}; hurt(35,'제자의 배신'); return {t:'그날 밤 제자의 검이 내 등을 노렸다.',tone:'bad'}; }}]});
E('lastDuel',{min:55,max:95,w:1.5,rep:6,when:()=>m.fame>=25,st:()=>Sg('manor',{cast:[N('yg',LOOK.youth(),116,{pose:'bow',tag:'젊은 검객'})]}),
  text:()=>'젊은 검객 하나가 찾아와 도전장을 던졌다. "천하에 이름난 분의 검을 보러 왔습니다."',ch:[
  {t:'받아 준다',duel:()=>({foe:{name:rname(),title:'젊은 검객',look:LOOK.youth(),pow:Math.round(power()*(.72+m.age*.0045)),style:'sword',art:'쾌검'}}),go:ok=>{ if(ok){ m.fame+=5; return {t:'세 초 만에 그의 검을 떨어뜨렸다. 아직은 아니다.',tone:'good'}; } m.fame-=6; return {t:'졌다. 젊은이는 깊이 절하고 떠났다. 강호가 바뀌고 있었다.',tone:'bad'}; }},
  {t:'차를 따라 주고 돌려보낸다',go:()=>{ bump('wit'); return {t:'검 대신 이야기를 나눴다. 젊은이는 그것도 배움이라 했다.',cut:()=>{ setPose('hero','sit'); setPose('yg','sit'); }}; }}]});
E('enlight',{min:50,max:99,once:1,w:2.5,gi:1,when:()=>m.lv>=6&&!m.f.magong,st:()=>Sg('peak',{time:'dawn',hero:{x:96,pose:'sit',act:'meditate'}}),
  text:()=>'새벽, 산꼭대기에 앉아 해가 뜨는 것을 보는데 갑자기 모든 초식이 하나로 보였다. 검도 손도 필요 없는 곳이 저 앞에 있다.',ch:[
  {t:'그 앞으로 한 걸음 나아간다',p:()=>.04+ST('wit')*.03+(m.f.master?.1:0)+(m.lv>=7?.15:0),go:ok=>{ if(ok){ m.exp=Math.max(m.exp,LVX[8]); m.lv=8; log('깨달음을 얻어 생사경에 들었다',true); return {t:'바람이 멎었다. 아니, 내가 바람이 되었다. 생사경이다.',tone:'good',cut:()=>{ callout('生死境','lv',2000); sfx('lv'); const h=A('hero'); if(h) h.act='float'; flashA=.8; flashC='#ffffff'; }}; } addExp(40); return '닿을 듯 말 듯하다가 해가 다 떴다. 그래도 많은 것이 보였다.'; }},
  {t:'내려가 제자들에게 들려준다',go:()=>{ m.disc+=2; m.fame+=8; return '제자들 중 하나가 눈을 반짝였다. 언젠가 저 아이가 닿을 것이다.'; }}]});
E('ascend',{min:60,max:120,once:1,w:20,when:()=>m.lv>=8,st:()=>Sg('peak',{wx:'gold',tint:'gold',cast:[N('cr',LOOK.crane(),140,{})],hero:{x:96,act:'float'}}),
  text:()=>'몸이 가볍다. 너무 가벼워서, 발이 땅에 닿지 않는다. 구름이 내려와 발밑에 깔린다.',ch:[
  {t:'구름에 오른다',go:()=>{ m.f.ascended=1; m.deathCause='우화등선'; return {t:'뒤돌아보니 제자들이 엎드려 울고 있었다. 손을 한 번 흔들었다.',tone:'good'}; }},
  {t:'아직 할 일이 남았다',go:()=>{ m.f.elixirLife=(m.f.elixirLife||0)+8; return {t:'구름이 아쉬운 듯 흩어졌다.',cut:()=>{ const h=A('hero'); if(h){ h.act=null; h.ay=0; } const c=A('cr'); if(c) c.act='fly'; }}; }}]});
E('famine',{min:15,max:80,rep:10,w:.9,st:()=>Sg('village',{season:2,biome:'dry',cast:mob('hg',i=>folk(i,{robe:'#7b7466'}),[108,122,136,152],{pose:'beg'})}),
  text:()=>'흉년이다. 성문 밖에 굶주린 사람들이 줄을 섰다.',ch:[
  {t:'곳간을 연다',when:()=>m.gold>=50,go:()=>{ const g=Math.min(m.gold,ri(60,200)); gold(-g); m.hy+=12; m.fame+=6; return {t:`${g}냥어치 쌀을 풀었다. 사람들이 '대협'이라 불렀다.`,tone:'good',cut:()=>{ ['hg0','hg1','hg2','hg3'].forEach(k=>{ setPose(k,'bow'); emo(k,'heart',2500); }); }}; }},
  {t:'쌀값이 오를 때 판다',go:()=>{ gold(ri(80,180)); m.ak+=10; return {t:'은자가 쌓였다. 등 뒤의 시선도 쌓였다.',cut:()=>{ ['hg0','hg2'].forEach(k=>emo(k,'anger',2500)); }}; }},
  {t:'모른 척한다',go:()=>'굶주린 아이와 눈이 마주쳤다.'}]});
E('gamble',{min:16,max:70,rep:8,w:.8,st:()=>Sg('den',{cast:[N('g1',LOOK.merchant(),126,{tag:'판주'}),N('g2',folk(2),84,{face:1}),N('g3',LOOK.bandit({weapon:null}),146,{})],hero:{x:62}}),
  text:()=>'객잔 뒷방에서 골패 판이 벌어졌다. 판돈이 크다.',ch:[
  {t:'가진 돈의 절반을 건다',when:()=>m.gold>=20,p:()=>.35+ST('luck')*.03,go:ok=>{ const g=Math.round(m.gold/2); if(ok){ gold(g); return {t:`따냈다. +${g}냥`,tone:'good'}; } gold(-g); return {t:`다 잃었다. -${g}냥`,tone:'bad'}; }},
  {t:'속임수를 쓰는 놈을 찾아낸다',when:()=>m.lv>=2,go:()=>{ m.hy+=3; gold(30); return {t:'소매 속 골패를 꺼내 보였다. 판주가 30냥을 쥐여 주며 조용히 해 달라 했다.',cut:()=>{ emo('g3','sweat'); emo('g1','!'); }}; }},
  {t:'나간다',go:()=>'밖은 별이 많았다.'}]});
E('assassin',{min:18,max:80,w:1,rep:9,when:()=>m.fame>=20||m.rels.some(r=>r.role==='원수'&&!r.dead),st:()=>Sg('room',{time:'night',cast:[N('as',LOOK.blackclad(),136,{pose:'guard'})],hero:{x:58,dy:-7,pose:'lie',emote:'zzz'}}),
  text:()=>'잠결에 지붕 기와가 아주 작게 울었다. 누군가 있다.',ch:[
  {t:'먼저 친다',duel:()=>({foe:{name:'자객',look:LOOK.blackclad(),pow:Math.round(24+power()*.45),style:'assassin',mercy:.35,art:'무영자'},lethal:1,cause:'자객의 비수',noReturn:1,loot:{g:[5,30],it:[['gdart',.3],['salve',.4],['pearl',.06]]}}),
    go:(ok,res)=>{ if(ok){ const r=m.rels.find(x=>x.role==='원수'&&!x.dead); if(r){ r.dead=1; return {t:`복면을 벗기니 ${r.name}${jo(r.name,'이었다','였다')}. 오랜 원한이 오늘 끝났다.`,tone:'good'}; } return {t:res.killed?'복면 아래는 처음 보는 얼굴이었다. 누가 보냈는지는 끝내 알 수 없었다.':'자객은 피를 흘리며 달아났다.',tone:'good'}; } if(res.dead) return {t:'비수는 소리가 없었다.',tone:'bad'}; return {t:'창을 깨고 뛰어내렸다. 비수가 어깨를 스쳤다.',tone:'bad'}; }},
  {t:'모른 척 숨을 고른다',p:()=>.5,go:ok=>{ if(ok) return {t:'자객은 기척을 감추다 결국 물러났다.',cut:()=>{ leave('as',1); }}; hurt(30,'자객의 비수'); return {t:'자고 있는 줄 알고 내려온 칼이 옆구리를 스쳤다.',tone:'bad'}; }}]});
E('sectHead',{min:35,max:75,once:1,w:2,when:()=>m.sect&&m.sect!=='demon'&&m.lv>=5&&(m.f.standing||0)>=4,st:()=>Sg('hall',{noProps:1,props:[['bed',120,{dy:8}],['lantern',60,{dy:-76}]],cast:[N('jm',masterLook({hairC:'#e6e4dc'}),122,{dy:-7,pose:'lie',tag:'장문인'})].concat(mob('br',i=>npcLook({name:'사형제'+i,sex:'m',age:40,sect:m.sect}),[160,174],{pose:'kneel'})),hero:{x:86,pose:'kneel'}}),
  text:()=>`${SECTS[m.sect].n}의 장문인이 임종을 앞두고 나를 불렀다. "네가 맡아라."`,ch:[
  {t:'장문인의 자리를 잇는다',go:()=>{ m.f.head=1; m.fame+=20; log(`${SECTS[m.sect].n}의 장문인이 되었다`,true); return {t:'장문인의 옥패를 받았다. 산문 아래 사형제들이 일제히 고개를 숙였다.',tone:'good',cut:()=>{ callout('掌門','alias',1600); }}; }},
  {t:'사형에게 양보한다',go:()=>{ m.hy+=6; return '사형은 눈물을 흘리며 고맙다고 했다.'; }}]});
E('masterDeath',{min:25,max:60,once:1,w:1.4,when:()=>!!(relOf('사부')||relOf('은사')),st:()=>Sg('room',{time:'dusk',cast:[N('ms',relOf('은사')?LOOK.master():masterLook({hairC:'#e6e4dc'}),58,{dy:-7,pose:'lie',tag:'사부'})],hero:{x:92,pose:'kneel',face:-1}}),
  text:()=>{ const r=relOf('은사')||relOf('사부'); return `사부 ${r.name}의 숨이 가늘다. 마지막으로 나를 불러 손을 잡았다.`; },ch:[
  {t:'곁을 지킨다',go:()=>{ const r=relOf('은사')||relOf('사부'), w=wOf(2); r.dead=1; addExp(10); m.ng+=10; give(w); log(`사부 ${iga(r.name)} 세상을 떠났다`,true); return {t:`사부는 마지막 내공을 내 손바닥에 흘려 넣고 눈을 감았다. 머리맡에는 평생 쓰던 ${ITEMS[w].n}${jo(ITEMS[w].n,'이','가')} 놓여 있었다.`,cut:()=>{ setPose('hero','cry'); const a=A('ms'); if(a){ a.pose='dead'; a.emote=null; } }}; }}]});
E('spouseSick',{min:35,max:85,once:1,w:1,when:()=>!!m.spouse&&!m.spouse.dead,st:()=>Sg('room',{time:'night',cast:[N('sp',relLook(m.spouse),58,{dy:-7,pose:'lie',emote:'sweat',tag:m.spouse.name}),N('dc',LOOK.doctor(),118,{tag:'의원',emote:'...'})],hero:{x:90,pose:'kneel',face:-1}}),
  text:()=>`${iga(m.spouse.name)} 몸져누웠다. 의원은 고개를 젓는다.`,ch:[
  {t:'천하의 명의를 찾아 나선다',when:()=>m.gold>=100,p:()=>.55,go:ok=>{ gold(-100); if(ok) return {t:'남쪽 끝 섬의 신의가 침 세 대로 살려냈다.',tone:'good'}; m.spouse.dead=1; log(`배우자 ${iga(m.spouse.name)} 세상을 떠났다`,true); m.spouse=null; return {t:'돌아왔을 때는 이미 늦었다.',tone:'bad'}; }},
  {t:'내공을 불어넣는다',p:()=>.2+m.ng/200,go:ok=>{ m.ng*=.7; if(ok) return {t:'내공 삼 할을 잃었다. 대신 그 사람이 눈을 떴다.',tone:'good',cut:()=>{ emo('sp','heart'); }}; m.spouse.dead=1; log(`배우자 ${iga(m.spouse.name)} 세상을 떠났다`,true); m.spouse=null; return {t:'손이 식어 가는 것을 막지 못했다.',tone:'bad',cut:()=>{ const a=A('sp'); if(a){ a.pose='dead'; a.emote=null; } setPose('hero','cry'); }}; }}]});
E('kidRun',{min:38,max:80,once:1,when:()=>m.kids>0&&!!relOf('자식'),st:()=>{ const k=relOf('자식'); return Sg('road',{time:'dawn',cast:[N('kd',relLook(k,{extra:'pack',weapon:'sword',age:18}),110,{tag:k.name})]}); },
  text:()=>{ const k=relOf('자식'); return `${iga(k?k.name:'자식')} 강호에 나가 이름을 떨치겠다고 한다. 내가 그 나이 때 하던 말이다.`; },ch:[
  {t:'내 무공을 전부 물려주고 보낸다',go:()=>{ m.f.heirKid=1; m.fame+=4; log('자식에게 무공을 물려주었다',true); return {t:'떠나는 등을 오래 보았다.',cut:()=>{ setPose('kd','bow'); setTimeout(()=>leave('kd',1),900); }}; }},
  {t:'말린다',go:()=>{ const k=relOf('자식'); if(k) k.v-=20; return {t:'자식은 문을 쾅 닫고 들어갔다.',cut:()=>{ emo('kd','anger'); leave('kd',-1); }}; }}]});
E('fakeAlias',{min:20,max:70,once:1,when:()=>!!m.alias,st:()=>Sg('innroom',{cast:[N('fk',heroLook({robe:'#8a7650'}),118,{tag:`가짜 ${m.alias}`,pose:'drink'}),N('f1',folk(1),146,{pose:'bow'})]}),
  text:()=>`객잔에서 누군가 '${m.alias}'를 사칭하며 행패를 부린다는 소문을 들었다.`,ch:[
  {t:'찾아가 혼내 준다',duel:()=>({foe:{name:`가짜 ${m.alias}`,look:heroLook({robe:'#8a7650'}),pow:44,style:'bandit'}}),go:ok=>{ if(ok){ m.fame+=4; return {t:'가짜는 무릎을 꿇었다. 진짜를 처음 보는 눈치였다.',tone:'good'}; } m.fame-=5; return {t:'가짜가 생각보다 셌다. 소문이 더 우습게 퍼졌다.',tone:'bad'}; }},
  {t:'웃어넘긴다',go:()=>{ bump('wit'); return '이름이란 원래 내 것이 아니다.'; }}]});
E('fairy',{min:15,max:50,once:1,w:.6,gi:1,when:()=>ST('luck')>=6,st:()=>Sg('mountain',{wx:'fog',cast:[N('cr',LOOK.crane({item:'herb'}),118,{})]}),
  text:()=>'안개 낀 계곡에서 피리 소리가 들린다. 따라가 보니 백학 한 마리가 영지를 물고 서 있다.',ch:[
  {t:'백학에게 절한다',go:()=>{ m.f.elixirLife=(m.f.elixirLife||0)+10; m.ng+=15; m.hp=100; return {t:'학은 영지를 내려놓고 날아갔다. 먹고 나니 십 년은 젊어진 것 같다.',tone:'good',cut:()=>{ setPose('hero','bow'); const c=A('cr'); if(c){ c.L=LOOK.crane(); c.act='fly'; c.face=1; } spark('hero','#ffe9a0',14); }}; }},
  {t:'백학을 잡으려 한다',go:()=>{ m.ak+=5; return {t:'학은 웃듯이 울더니 구름 속으로 사라졌다.',cut:()=>{ const c=A('cr'); if(c){ c.act='fly'; c.face=1; } }}; }}]});
E('injustice',{min:16,max:70,rep:7,w:1,st:()=>Sg('village',{cast:[N('wd',LOOK.woman(),98,{pose:'cry',emote:'tear',tag:'과부'}),N('th',LOOK.merchant({robe:'#6a3a5a'}),134,{tag:'토호',pose:'point'}),N('gd',LOOK.soldier(),152,{})]}),
  text:()=>'고을의 토호가 관아와 짜고 과부의 논을 빼앗았다. 과부가 길바닥에서 울고 있다.',ch:[
  {t:'밤에 토호의 집을 찾아간다',when:()=>m.f.martial,duel:()=>({foe:{name:'토호의 호위 무사',look:LOOK.swordsman({robe:'#4a3a4a'}),pow:42+m.lv*3,style:'sword',mercy:.7},lethal:1,bg:'manor',time:'night',cause:'토호가 부린 무사의 칼',extras:[N('th',LOOK.merchant({robe:'#6a3a5a'}),176,{act:'shiver'})]}),go:ok=>{ m.hy+=10; if(ok){ m.fame+=5; return {t:'토호는 새벽에 논 문서를 과부 집 문 앞에 두고 갔다.',tone:'good'}; } return {t:'토호가 고용한 무사들이 셌다. 관아에 쫓기는 몸이 되었다.',tone:'bad'}; }},
  {t:'은자로 논을 되사 준다',when:()=>m.gold>=80,go:()=>{ gold(-80); m.hy+=8; return {t:'과부가 몇 번이고 절을 했다.',tone:'good',cut:()=>{ setPose('wd','bow'); emo('wd','heart'); }}; }},
  {t:'남의 일이다',go:()=>{ m.ak+=2; return '그날 저녁 밥이 잘 넘어가지 않았다.'; }}]});
E('hire',{min:18,max:70,rep:8,w:.9,when:()=>m.f.martial&&m.lv>=2,st:()=>Sg('stable',{cast:[N('mk',LOOK.blackclad({item:'gold',weapon:null}),100,{pose:'carry',tag:'복면인'})]}),
  text:()=>'복면을 쓴 사내가 금괴를 내밀었다. "한 사람만 없애 주시오. 정파의 장로요."',ch:[
  {t:'받는다',duel:()=>({foe:{name:'정파 장로',look:LOOK.elder(),pow:66,style:'monk',mercy:.7,art:'복호장'},lethal:1,good:1,noMercy:1,noReturn:1,bg:'manor',time:'night',cause:'암살 실패'}),go:(ok,res)=>{ m.ak+=18; if(ok){ m.kills=(m.kills||0)+1; gold(ri(250,450)); log('돈을 받고 정파 장로를 암살했다',true); return {t:'일은 깔끔하게 끝났다. 손을 오래 씻었다.',tone:'bad'}; } if(res.dead) return {t:'장로가 기다리고 있었다.',tone:'bad'}; return {t:'장로가 기다리고 있었다. 지팡이 한 대에 담장 밖으로 날아갔다.',tone:'bad'}; }},
  {t:'거절하고 장로에게 귀띔한다',go:()=>{ m.hy+=8; m.fame+=3; rel('지기',null,65); return {t:'장로는 은혜를 잊지 않겠다고 했다.',tone:'good'}; }},
  {t:'거절한다',go:()=>({t:'사내는 혀를 차고 사라졌다.',cut:()=>{ leave('mk',1); }})}]});
