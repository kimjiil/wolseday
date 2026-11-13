/* ==== murim:events2 — 평범한 삶, 이어지는 에피소드, 기연, 장터, 남들의 싸움 ==== */
const parents=(xs)=>['어머니','아버지'].map(r=>relOf(r)).filter(Boolean).map((r,i)=>N('pa'+i,relLook(r),xs[i],{face:xs[i]<64?1:-1,tag:r.role}));
E('dog',{min:4,max:9,once:1,st:()=>Sg('village',{props:[['puppies',108,{dy:8}]],cast:[N('dg',LOOK.dog(),136,{})].concat(parents([36,22])),hero:{x:90,pose:'kneel',emote:'heart'}}),
  text:()=>'이웃집 개가 새끼를 낳았다. 한 마리만 키우게 해 달라고 조르고 싶다.',ch:[
  {t:'조른다',p:()=>pctNow()>40?.7:.35,go:ok=>{ if(ok){ m.joy+=12; m.f.dog=m.age; return {t:'어머니가 한숨을 쉬더니 허락했다. 누렁이라고 이름을 붙였다.',tone:'good',cut:()=>{ setPose('hero','cheer'); emo('hero','heart'); }}; } m.joy-=5; return {t:'"우리 먹을 것도 없다." 그날 밤 이불 속에서 울었다.',tone:'bad',cut:()=>{ setPose('hero','cry'); }}; }},
  {t:'말도 꺼내지 않는다',go:()=>{ m.bond+=3; return '강아지가 다른 집으로 가는 걸 담 너머로 보았다.'; }}]});
E('seodang',{min:7,max:10,once:1,when:()=>!m.f.school&&!m.f.lit,st:()=>Sg('school',{cast:[N('tc',LOOK.official({robe:'#5a6a5a',item:'book'}),118,{pose:'carry',tag:'훈장'}),N('s1',LOOK.child(),96,{pose:'sit',dy:-2}),N('s2',LOOK.girl(),134,{pose:'sit',dy:-2})],hero:{x:56}}),
  text:()=>'서당 훈장이 글을 배우러 오라고 한다. 수업료는 한 해 쌀 닷 말, 은자로 8냥이다.',ch:[
  {t:'서당에 다닌다',when:()=>m.gold>=8||pctNow()>30,go:()=>{ gold(-8); m.f.school=1; bump('wit'); m.joy+=3; log('서당에서 글을 배우기 시작했다',true); return {t:'천자문 첫 줄을 외웠다. 하늘은 검고 땅은 누렇다.',tone:'good',cut:()=>{ const h=A('hero'); if(h){ h.goto=84; h.pose0='sit'; } }}; }},
  {t:'집안일을 돕는다',go:()=>{ m.bond+=4; return '서당 앞을 지날 때마다 아이들 글 읽는 소리가 들렸다.'; }}]});
E('fever',{min:2,max:85,rep:7,w:1.1,st:()=>{ const mo=relOf('어머니'); return Sg('room',{time:'night',cast:m.age<3?[N('mo',mo?relLook(mo,{item:'baby'}):LOOK.woman({item:'baby'}),80,{pose:'carry',emote:'sweat',face:1})]:(m.age<12&&mo?[N('mo',relLook(mo),96,{pose:'kneel',emote:'sweat'})]:[]),hero:{x:58,dy:-7,pose:'lie',emote:'sweat'}}); },
  text:()=>m.age<12?'아이가 사흘째 불덩이처럼 뜨겁다. 읍내 의원에게 데려가려면 20냥이 든다.':'열이 사흘째 내리지 않는다. 의원에게 가면 20냥이다.',ch:[
  {t:'의원에게 간다',when:()=>m.gold>=20||m.age<12&&pctNow()>45,go:()=>{ gold(-20); m.hp=cl(m.hp+5); return {t:'의원이 침을 놓고 탕약을 지어 주었다. 열이 내렸다.',tone:'good'}; }},
  {t:'민간요법으로 버틴다',p:()=>.55+ST('body')*.03,go:ok=>{ if(ok){ hurt(8); return '찬 수건과 생강물로 버텼다. 겨우 열이 내렸다.'; } hurt(m.age<12?45:40,'열병'); return {t:'열이 쉽게 떨어지지 않았다.',tone:'bad'}; }},
  {t:'무당을 부른다',when:()=>m.gold>=5,go:()=>{ gold(-5); hurt(15,'열병'); return '굿을 했다. 열은 저 혼자 내렸다.'; }}]});
E('matchmaker',{min:16,max:30,rep:4,w:1.6,when:()=>!m.spouse&&!isMonk(),st:()=>Sg('home',{cast:[N('mm',LOOK.matchmaker(),96,{tag:'중매쟁이',emote:'heart',pose:'point'})].concat(parents([150,166]))}),
  text:()=>{ const f=pick(['자작농','상인','장인','소작농','객잔 주인']); m.f.mmName=rname(); m.f.mmFam=f; return `중매쟁이가 혼담을 들고 왔다. 상대는 이웃 고을 ${f} 집안의 ${m.f.mmName}.`; },ch:[
  {t:'혼담을 받아들인다',go:()=>{ const r=rel('배우자',m.f.mmName,60); m.spouse=r; m.joy+=6; m.bond+=10; gold(-Math.min(m.gold,15)); log(`${wa(r.name)} 혼인했다`,true); m.q.push({age:m.age+ri(1,3),id:'birth'}); return {t:'얼굴은 혼례날 처음 보았다. 생각보다 웃음이 많은 사람이었다.',tone:'good',st:Sg('wedding',{wx:'petal',cast:[N('sp',relLook(r,{robe:'#b8324a',blush:1}),90,{emote:'heart',tag:r.name})].concat(mob('g',i=>folk(i),[24,40,152,170],i=>({act:'cheer',face:i<2?1:-1}))),hero:{look:heroLook({robe:'#b8324a',weapon:null}),x:72}})}; }},
  {t:'아직 이르다며 거절한다',go:()=>{ m.joy+=1; return {t:'중매쟁이가 혀를 차며 돌아갔다.',cut:()=>{ emo('mm','anger'); leave('mm',1); }}; }}]});
E('flee',{min:14,max:55,once:1,w:1.4,when:()=>m.era!=='peace'&&!m.f.migrated,st:()=>Sg('road',{time:'dusk',wx:'ember',props:[['fire',176,{dy:-6,s:2}],['smoke',170,{dy:-34}]],cast:mob('rf',i=>folk(i,{extra:'pack'}),[104,124,146],i=>({enter:'right',spd:.5,emote:i===1?'sweat':null}))}),
  text:()=>m.era==='chaos'?'정사대전의 불길이 고을까지 번진다는 소문이 돈다. 이웃들이 짐을 싸기 시작했다.':'마교가 고을마다 장정을 끌어간다는 소문이 돈다.',ch:[
  {t:'남쪽으로 피난한다',go:()=>{ m.f.migrated=1; gold(-m.gold*.5); m.joy-=6; m.bond-=8; log('전란을 피해 고향을 떠났다',true); return {t:'가진 것의 절반을 버리고 길을 떠났다. 낯선 고을에서 다시 시작했다.',cut:()=>{ leave('hero',-1); ['rf0','rf1','rf2'].forEach(k=>leave(k,-1)); }}; }},
  {t:'고향에 남는다',p:()=>.65,go:ok=>{ if(ok) return {t:'불길은 고을 앞에서 방향을 틀었다.',tone:'good'}; hurt(30,'전란'); gold(-m.gold*.6); return {t:'군대가 지나갔다. 집이 불탔다.',tone:'bad'}; }}]});
E('shop',{min:20,max:55,once:1,when:()=>m.gold>=60&&!m.f.shop,st:()=>Sg('market',{cast:[N('ow',LOOK.merchant(),120,{tag:'점포 주인',pose:'point'})]}),
  text:()=>'장터에 빈 점포가 나왔다. 60냥이면 내 가게를 열 수 있다.',ch:[
  {t:'가게를 연다',p:()=>.4+ST('charm')*.04+ST('wit')*.02,go:ok=>{ gold(-60); if(ok){ m.f.shop=1; log('장터에 가게를 열었다',true); return {t:'단골이 생기기 시작했다. 해마다 은자가 남는다.',tone:'good'}; } m.joy-=8; return {t:'반년 만에 문을 닫았다. 60냥이 사라졌다.',tone:'bad'}; }},
  {t:'모험하지 않는다',go:()=>'장터의 그 자리는 곧 다른 사람의 국숫집이 되었다.'}]});
E('parentCare',{min:20,max:60,once:1,w:1.2,when:()=>!!(relOf('아버지')||relOf('어머니')),st:()=>{ const p=relOf('어머니')||relOf('아버지'); return Sg('room',{time:'dusk',cast:[N('pa',relLook(p),58,{dy:-7,pose:'lie',tag:p.role,emote:'...'})],hero:{x:92,pose:'kneel',face:-1}}); },
  text:()=>{ const p=relOf('어머니')||relOf('아버지'); return `${p.role}가 자리에 누웠다. 곁에서 돌보려면 한 해 벌이를 포기해야 한다.`; },ch:[
  {t:'곁에서 돌본다',go:()=>{ gold(-m.gold*.3); m.bond+=12; m.joy-=3; return {t:'밤마다 약을 달였다. 고맙다는 말을 처음 들었다.',tone:'good',cut:()=>{ emo('pa','heart'); }}; }},
  {t:'형제에게 맡기고 일한다',go:()=>{ gold(20); m.bond-=8; return {t:'돈은 모였다. 마음 한쪽이 계속 무거웠다.',cut:()=>{ leave('hero',1); }}; }}]});
E('mateLove',{when:()=>!m.spouse&&!isMonk(),st:()=>Sg('mountain',{time:'dusk',wx:'petal',cast:[N('lv',npcLook({name:m.f.loveName,sex:m.sex==='m'?'f':'m',age:m.age,sect:m.sect,blush:1}),96,{tag:m.f.loveName,emote:'heart'})],hero:{x:70}}),
  text:()=>`수련기를 같이 보낸 ${iga(m.f.loveName)} 찾아왔다. "하산하면 같이 강호를 걷자고 했잖아."`,ch:[
  {t:'손을 잡는다',go:()=>{ const r=rel('정인',m.f.loveName,85); m.q.push({age:m.age+ri(1,2),id:'wedding'}); log(`${wa(r.name)} 마음을 나눴다`,true); return {t:'산길을 나란히 내려갔다.',tone:'good',cut:()=>{ emo('hero','heart'); }}; }},
  {t:'갈 길이 다르다',go:()=>({t:'뒷모습이 오래 남았다.',cut:()=>{ emo('lv','tear'); leave('lv',1); }})}]});

/* ---------- 삶의 에피소드: 첫 장면만 무작위로 나오고, 뒷장면은 몇 해 뒤에 이어진다 ---------- */
function epNext(id,bi,lo=1,hi=3){ m.q.push({age:m.age+ri(lo,hi),id:id+bi}); }
const EPL=(id,n,i,o)=>E(id+i,Object.assign({epn:n,epi:`${i+1}/3`},o));
EPL('swd','떠돌이 검객',0,{min:18,max:50,once:1,st:()=>Sg('stable',{cast:[N('sw',LOOK.swordsman(),84,{pose:'kneel',emote:'sweat',tag:'검객',face:1}),N('hs',LOOK.horse(),72,{face:1,dy:-2})],hero:{x:120,face:-1,look:heroLook({item:'lamp'}),pose:'carry'}}),
  text:'객잔 마구간에 피투성이 검객이 숨어 있다. "하룻밤만… 아무에게도 말하지 마시오."',ch:[
  {t:'숨겨 주고 상처를 싸맨다',go:()=>{ epNext('swd',1); if(m.inv.bag.salve>0) m.inv.bag.salve--; return {t:'검객은 새벽에 은자 한 닢을 두고 사라졌다.',tone:'good',cut:()=>{ healFx(); emo('sw','...'); }}; }},
  {t:'객잔 주인에게 알린다',go:()=>({t:'관군이 와서 끌고 갔다. 등 뒤로 욕설이 들렸다.',cut:()=>{ emo('sw','anger'); }})}]});
EPL('swd','떠돌이 검객',1,{st:()=>Sg('inn',{time:'night',cast:mob('ch',()=>LOOK.blackclad(),[112,130,148],i=>({pose:'guard',emote:i?null:'anger'}))}),
  text:'검은 옷의 사내들이 찾아와 그 검객의 행방을 묻는다. 칼자루에 손이 가 있다.',ch:[
  {t:'모른다고 잡아뗀다',p:()=>.4+ST('charm')*.04,go:ok=>{ epNext('swd',2,2,5); if(ok) return {t:'사내들은 한참 노려보다 돌아갔다.',cut:()=>{ ['ch0','ch1','ch2'].forEach(k=>leave(k,1)); }}; hurt(25,'추격자의 칼'); return {t:'거짓말이 들통났다. 칼등으로 얻어맞았다.',tone:'bad'}; }},
  {t:'칼을 뽑아 쫓아낸다',when:()=>m.f.martial,duel:()=>({foe:{name:'추격자',look:LOOK.blackclad(),pow:50,style:'assassin',mercy:.4},lethal:1,cause:'추격자의 칼',loot:{g:[10,30],it:[['salve',.5],['ldart',.3]]},extras:mob('ch',()=>LOOK.blackclad(),[172,186],{pose:'guard'})}),go:(ok,res)=>{ epNext('swd',2,2,5); if(ok){ m.fame+=3; return {t:'우두머리가 쓰러지자 나머지는 어둠 속으로 흩어졌다.',tone:'good'}; } return {t:res.dead?'셋을 한꺼번에 상대하기에는 밤이 너무 어두웠다.':'얻어맞고 쓰러졌다. 그래도 입은 열지 않았다.',tone:'bad'}; }},
  {t:'방향을 알려 준다',go:()=>{ m.ak+=8; gold(30); return {t:'사내들이 은자 30냥을 던져 주었다. 그 검객의 소식은 다시 듣지 못했다.',tone:'bad'}; }}]});
EPL('swd','떠돌이 검객',2,{st:()=>Sg('road',{cast:[N('sw',LOOK.swordsman({hair:'crown',robe:'#e3ded0'}),110,{tag:'장문인',emote:'!'}),N('d1',LOOK.youth(),132,{}),N('d2',LOOK.youth({sex:'f',hair:'pony'}),148,{})]}),
  text:'관도에서 낯익은 얼굴과 마주쳤다. 그때 숨겨 준 검객이다. 이제는 한 문파의 장문인이라고 한다.',ch:[
  {t:'검을 한 수 청한다',go:()=>{ learn('추풍검',20,'검'); addExp(10); log('숨겨 줬던 검객에게 추풍검을 배웠다',true); return {t:'석 달을 따라다니며 검을 배웠다.',tone:'good'}; }},
  {t:'은혜는 됐다고 한다',go:()=>{ gold(150); m.hy+=6; give('psword'); log('숨겨 줬던 검객이 은혜를 갚았다',true); return {t:'검객은 웃으며 허리의 송문고검을 풀어 내밀었다. 은자 150냥과 함께. 거절해도 소용없었다.',tone:'good'}; }}]});
EPL('well','마른 우물',0,{min:20,max:60,once:1,st:()=>Sg('well',{biome:'dry',season:1,noProps:1,props:[['house',136],['well',100,{dy:8,dry:1}],['tree',18,'bare']],cast:mob('el',i=>folk(i,{age:64}),[120,136],{emote:'sweat'})}),
  text:'가뭄에 마을 우물이 말랐다. 노인들이 산 너머 옛 샘 이야기를 한다.',ch:[
  {t:'샘을 찾으러 나선다',go:()=>{ epNext('well',1,1,1); return '사흘 동안 산을 헤맨 끝에 물소리를 들었다.'; }},
  {t:'비를 기다린다',go:()=>{ m.hp-=6; m.joy-=6; return {t:'비는 가을이 되어서야 왔다.',tone:'bad'}; }}]});
EPL('well','마른 우물',1,{st:()=>Sg('fort',{cast:[N('cf',LOOK.chief(),118,{tag:'두목',pose:'point'}),N('b1',LOOK.bandit(),150,{})],hero:{x:34,look:heroLook({item:'buckets'}),pose:'carry'}}),
  text:'샘은 녹림 산채 바로 아래에 있었다. 물을 길으려면 산채를 지나야 한다.',ch:[
  {t:'두목과 담판을 짓는다',p:()=>.35+ST('charm')*.05+(m.f.martial?m.lv*.04:0),go:ok=>{ if(ok){ epNext('well',2,1,3); return {t:'두목이 물 한 동이에 쌀 한 되로 합의했다.',tone:'good'}; } hurt(20,'녹림도의 몽둥이'); return {t:'두들겨 맞고 쫓겨났다.',tone:'bad'}; }},
  {t:'두목과 한판 붙어 정한다',when:()=>m.f.martial,duel:()=>({foe:{name:'산채 두목',look:LOOK.chief(),pow:48,style:'bandit'}}),go:ok=>{ if(ok){ epNext('well',2,1,3); m.fame+=3; return {t:'두목은 흙을 털고 일어나 껄껄 웃었다. "물은 마음대로 퍼 가라."',tone:'good'}; } return {t:'졌다. 약속대로 빈 물동이를 지고 돌아섰다.',tone:'bad'}; }},
  {t:'관아에 알린다',p:()=>.4,go:ok=>{ if(ok){ epNext('well',2,1,3); return '관군이 산채를 쳤다.'; } return {t:'현령은 뇌물만 받고 움직이지 않았다.',tone:'bad'}; }}]});
EPL('well','마른 우물',2,{st:()=>Sg('village',{wx:'petal',props:[['aqueduct',60,{dy:6}]],cast:mob('vg',i=>folk(i),[100,118,140,158],{act:'cheer'})}),
  text:'샘에서 마을까지 대나무 물길이 놓였다. 마을 잔치가 열렸다.',ch:[
  {t:'잔치에 간다',go:()=>{ m.bond+=15; m.joy+=10; m.fame+=4; log('마을에 물길을 냈다',true); return {t:'노인들이 샘 옆에 내 이름을 새긴 비석을 세우자고 했다.',tone:'good',cut:()=>{ setPose('hero','drink'); }}; }}]});
EPL('jade','전당포의 옥패',0,{min:16,max:60,once:1,when:()=>m.gold>=15,st:()=>Sg('shop',{noProps:1,props:[['counter',96,{w:84,jade:1}],['lantern',60,{dy:-76}]],cast:[N('pw',LOOK.merchant(),140,{dy:-2,tag:'전당포 주인'})],hero:{x:60}}),
  text:'전당포 구석에 핏빛 무늬의 옥패가 굴러다닌다. 주인은 15냥이면 가져가란다.',ch:[
  {t:'산다',go:()=>{ gold(-15); epNext('jade',1,1,3); return {t:'손에 쥐자 이상하게 따뜻했다.',cut:()=>{ const h=A('hero'); if(h){ h.L=heroLook({item:'jade'}); h.pose='carry'; } }}; }},
  {t:'지나친다',go:()=>'옥패는 다음 날 팔렸다고 한다.'}]});
EPL('jade','전당포의 옥패',1,{st:()=>Sg('yard',{cast:[N('rd',LOOK.cultist(),112,{tag:'붉은 옷의 사내',emote:'!'})],hero:{look:heroLook({item:'jade'}),pose:'carry'}}),
  text:'붉은 옷의 사내가 찾아왔다. "그 옥패는 천마신교의 신물이오. 300냥에 넘기시오."',ch:[
  {t:'판다',go:()=>{ gold(300); m.ak+=5; log('천마신교의 신물을 300냥에 팔았다',true); return {t:'300냥이 든 주머니가 묵직했다.',tone:'good',cut:()=>{ heroIdle(); emo('rd','coin'); }}; }},
  {t:'무림맹에 넘긴다',go:()=>{ m.hy+=12; m.fame+=8; log('천마신교의 신물을 무림맹에 넘겼다',true); return {t:'맹에서 감사패가 왔다. 붉은 옷의 사내는 다시 오지 않았다.',tone:'good'}; }},
  {t:'버티며 비밀을 캔다',p:()=>.3+ST('wit')*.05,go:ok=>{ if(ok){ epNext('jade',2,1,2); return '옥패 뒷면에 지도가 새겨져 있다는 걸 알아냈다.'; } hurt(30,'마교도의 장력'); return {t:'사내의 손바닥이 가슴에 닿았다. 옥패를 빼앗겼다.',tone:'bad'}; }},
  {t:'칼로 답한다',when:()=>m.f.martial,duel:()=>({foe:{name:'마교 향주',look:LOOK.cultist(),pow:60,style:'brute',mercy:.3,art:'혈수공'},lethal:1,cause:'마교도의 장력',loot:{g:[30,80],it:[['asaber',.3],['antidote',.5]]}}),go:(ok,res)=>{ if(ok){ epNext('jade',2,1,2); return {t:'사내의 품에서 옥패의 지도를 읽는 법이 적힌 쪽지가 나왔다.',tone:'good'}; } return {t:res.dead?'핏빛 손바닥이 마지막으로 본 것이었다.':'옥패를 빼앗기고 겨우 목숨만 건졌다.',tone:'bad'}; }}]});
EPL('jade','전당포의 옥패',2,{gi:1,st:()=>Sg('cave',{props:[['chest',120,{dy:8,stone:1}]]}),
  text:'지도가 가리킨 동굴 깊은 곳에 석함 하나가 있다.',ch:[
  {t:'연다',go:()=>{ learn('혈옥수',22,'마공',10); m.ak+=8; log('옥패의 지도로 혈옥수를 얻었다',true); return {t:'핏빛 장법이 새겨진 옥판이었다. 손바닥이 붉게 물들었다.',tone:'bad',cut:()=>{ if(SC) SC.tint='red'; }}; }},
  {t:'봉인한 채 다시 묻는다',go:()=>{ m.hy+=10; bump('luck'); return {t:'석함을 다시 묻고 돌아섰다. 마음이 가벼웠다.',tone:'good'}; }}]});
EPL('sib','집 나간 동생',0,{min:20,max:55,once:1,when:()=>m.sib>0,st:()=>Sg('home',{time:'dusk',cast:parents([96,150]).map(c=>Object.assign(c,c.tag==='어머니'?{pose:'cry',emote:'tear'}:{}))}),
  text:'집을 나간 동생이 사파 흑룡방에 들어갔다는 소문이 들린다.',ch:[
  {t:'찾으러 간다',go:()=>{ epNext('sib',1,1,1); gold(-10); return '흑룡방이 있는 강가 마을까지 열흘을 걸었다.'; }},
  {t:'제 인생이다',go:()=>{ m.bond-=6; return '어머니가 밤마다 우셨다.'; }}]});
const sibLook=o=>npcLook(Object.assign({name:m.name+'동생',age:Math.max(16,m.age-4),robe:'#3a3a48'},o||{}));
EPL('sib','집 나간 동생',1,{st:()=>Sg('den',{cast:[N('sb',sibLook(),104,{tag:'동생',emote:'...'}),N('bs',LOOK.chief({robe:'#2a2a3a'}),146,{tag:'부두목'})],hero:{x:60}}),
  text:'도박장 뒷문에서 동생을 찾았다. 팔에 흑룡 문신이 있다.',ch:[
  {t:'집에 가자고 설득한다',p:()=>.3+ST('charm')*.05+m.bond/300,go:ok=>{ if(ok){ epNext('sib',2,1,3); return {t:'동생이 한참을 울더니 고개를 끄덕였다.',tone:'good',cut:()=>{ setPose('sb','cry'); }}; } m.bond-=5; return {t:'"네가 뭘 알아." 문이 닫혔다.',tone:'bad',cut:()=>{ emo('sb','anger'); }}; }},
  {t:'빚을 대신 갚아 준다',when:()=>m.gold>=60,go:()=>{ gold(-60); epNext('sib',2,1,3); return {t:'흑룡방 부두목이 장부에서 동생 이름을 지웠다.',cut:()=>{ emo('bs','coin'); }}; }},
  {t:'흑룡방을 친다',when:()=>m.f.martial,duel:()=>({foe:{name:'흑룡방 부두목',look:LOOK.chief({robe:'#2a2a3a'}),pow:56,style:'bandit',mercy:.5,art:'흑룡도'},lethal:1,cause:'흑룡방의 칼',loot:{g:[30,90],it:[['asaber',.3],['chain',.2]]},extras:[N('sb',sibLook(),174,{act:'shiver'})]}),go:(ok,res)=>{ if(ok){ m.fame+=8; epNext('sib',2,1,3); return {t:'부두목을 꺾고 동생을 데리고 나왔다.',tone:'good'}; } return {t:res.dead?'수가 너무 많았다.':'수가 너무 많았다. 강물에 던져졌다가 겨우 기어 나왔다.',tone:'bad'}; }}]});
EPL('sib','집 나간 동생',2,{st:()=>Sg('wedding',{wx:'petal',cast:[N('sb',sibLook({robe:'#b8324a'}),104,{tag:'동생',emote:'note'}),N('br',LOOK.woman({robe:'#b8324a',blush:1}),120,{})].concat(mob('g',i=>folk(i),[150,168],{act:'cheer'}))}),
  text:'고향에 돌아온 동생이 혼례를 올린다. 혼례상 앞에서 나를 보고 웃는다.',ch:[
  {t:'술잔을 받는다',go:()=>{ m.joy+=12; m.bond+=12; log('집 나간 동생을 데려와 혼례를 올려 주었다',true); return {t:'동생이 처음으로 "고마워"라고 했다.',tone:'good',cut:()=>{ setPose('hero','drink'); }}; }}]});

/* ---------- 기연 ---------- */
E('meteor',{min:10,max:60,once:1,w:.3,gi:1,st:()=>Sg('field',{time:'night',props:[['meteor',112,{dy:10}],['smoke',112,{dy:-4}]],hero:{x:74,emote:'!'}}),
  text:()=>'한밤중에 하늘이 찢어지는 소리가 났다. 뒷밭 한가운데 구덩이가 파였고, 그 안에서 검푸른 쇳덩이가 아직 김을 뿜는다.',ch:[
  {t:'식기를 기다렸다가 파낸다',go:()=>{ give('ore',{nolog:1}); m.q.push({age:m.age+ri(1,3),id:'forgeGod'}); log('하늘에서 떨어진 쇳덩이, 천외운철을 주웠다',true); return {t:'주먹만 한데 장정 둘이 들어야 할 만큼 무겁다. 두드리면 종소리가 난다.',tone:'good'}; }},
  {t:'관아에 알린다',go:()=>{ gold(40); m.hy+=2; return '현령이 상서로운 징조라며 40냥을 내리고 쇳덩이를 가져갔다.'; }},
  {t:'불길하다, 흙으로 덮는다',go:()=>{ bump('luck'); return '덮고 나니 그 자리에서만 풀이 유난히 푸르게 자랐다.'; }}]});
E('forgeGod',{gi:1,when:()=>m.inv.mat>0,st:()=>Sg('forge',{time:'night',props:[['anvil',84,{dy:8}]],cast:[N('sm',LOOK.smith({tool:'hammer'}),98,{act:'tool',tag:m.f.smith?'':'늙은 대장장이'})],hero:{x:56}}),
  text:()=>m.f.smith?'천외운철을 화로에 넣었다. 수련기에 배운 망치질이 손에 남아 있다. 이 쇠로 무엇을 벼릴까.':'천외운철 소문을 들은 늙은 대장장이가 찾아왔다. "평생 한 번 두드려 보고 싶던 쇠요. 삯은 받지 않겠소. 무엇으로 벼리겠소?"',ch:()=>
  [['검','hsword'],['도','rsaber'],['권','tglove'],['암기','sdart']].map(([k,id])=>({t:`${ITEMS[id].n}${jo(ITEMS[id].n,'으로','로')} 벼린다`,s:`${k} · SS · 공격 +${ITEMS[id].atk}`,go:()=>{ m.inv.mat--; give(id,{nolog:1}); log(`천외운철로 ${eul(ITEMS[id].n)} 벼렸다`,true); return {t:'이레 밤낮 망치 소리가 그치지 않았다. 마지막 담금질에 물이 한꺼번에 끓어올랐다.',tone:'good',cut:()=>{ flashA=.7; flashC='#bff4ff'; spark('hero','#bff4ff',20); }}; }}))
  .concat([{t:'쇳덩이째 판다',go:()=>{ m.inv.mat--; gold(400); return '상단 행수가 400냥을 내놓았다. 뒤도 안 돌아보고 가져갔다.'; }},{t:'아직은 묻어 둔다',go:()=>{ m.q.push({age:m.age+ri(5,8),id:'forgeGod'}); return '쇠는 기다릴 줄 안다.'; }}])});
E('oldTomb',{min:14,max:65,once:1,w:.8,gi:1,st:()=>Sg('tomb',{wx:'rain',hero:{x:70}}),
  text:()=>'폭우에 산비탈이 무너져 옛 무덤의 돌문이 드러났다. 문 위에 글이 새겨져 있다. "들어오는 자, 세 번 절하라."',ch:[
  {t:'세 번 절하고 들어간다',p:()=>.4+ST('luck')*.05,go:ok=>{ if(ok){ const it=R()<.5?'gvest':wOf(2), g=ri(100,300); gold(g); give(it,{nolog:1}); log(`옛 무덤에서 ${eul(ITEMS[it].n)} 얻었다`,true); return {t:`절을 마치자 석관 옆 벽이 스르르 열렸다. ${ITEMS[it].n}, 그리고 은자 ${g}냥. 무덤 주인은 예를 아는 후인을 기다린 모양이다.`,tone:'good',st:Sg('cave',{tint:'gold',props:[['chest',118,{dy:8,open:1}],['skeleton',146,{dy:8}]]})}; } hurt(25,'무덤의 함정'); return {t:'절은 했는데 발밑 돌판이 꺼졌다. 쇠뇌살이 허벅지를 뚫었다.',tone:'bad',st:Sg('cave',{props:[['trap',112,{dy:9}]]})}; }},
  {t:'절하지 않고 들어간다',p:()=>.12+ST('luck')*.03+ST('body')*.02,go:ok=>{ m.ak+=3; if(ok){ const it=wOf(2), g=ri(150,350); gold(g); give(it); return {t:`쇠뇌와 독연기를 뚫고 석관을 열었다. ${ITEMS[it].n}${jo(ITEMS[it].n,'과','와')} 은자 ${g}냥.`,tone:'good',st:Sg('cave',{props:[['chest',118,{dy:8,open:1}]]})}; } hurt(42,'무덤의 함정'); return {t:'문지방을 넘는 순간 천장이 내려앉았다.',tone:'bad',st:Sg('cave',{props:[['trap',112,{dy:9}]]})}; }},
  {t:'돌문을 다시 묻어 준다',go:()=>{ m.hy+=6; bump('luck'); return '비가 그치자 무지개가 무덤 위에 걸렸다.'; }}]});
E('dyingMonk',{min:16,max:55,once:1,w:.7,gi:1,st:()=>Sg('forest',{time:'dusk',cast:[N('mk',LOOK.monk({weapon:null,hairC:'#e6e4dc',beard:'long'}),108,{pose:'lie',tag:'노승',emote:'...'})],hero:{x:76,pose:'kneel'}}),
  text:()=>'숲길에 노승이 쓰러져 있다. 가슴에 검은 손자국이 찍혀 있다. "젊은이… 이 늙은 중의 칠십 년 공력, 헛되이 흩어지게 두고 싶지 않소."',ch:[
  {t:'공력을 받는다',go:()=>{ const n=ri(35,60); m.ng+=n; if(!m.f.martial){ learn('금강부동공',0,'내공',0); } give('beads'); log(`이름 모를 노승에게 내공 ${n}년을 전해 받았다`,true); return {t:`노승의 손바닥이 등에 닿자 뜨거운 강물이 밀려 들어왔다. 내공 ${n}년. 노승은 염주를 쥐여 주고 앉은 채로 눈을 감았다.`,tone:'good',cut:()=>{ const a=A('mk'), h=A('hero'); if(a&&h){ for(let i=0;i<16;i++) FX.push({t:'aura',x:a.x-(a.x-h.x)*i/16,y:h.y-4,life:16+i*2,max:48,c:'#ffe9a0'}); a.pose='sit'; a.emote=null; } setPose('hero','sit',{act:'meditate'}); }}; }},
  {t:'업고 의원에게 뛴다',p:()=>.3+ST('body')*.05,go:ok=>{ m.hy+=10; if(ok){ learn('금강권',18,'권'); rel('지기','혜공 대사',80,{sx:'m'}); return {t:'삼십 리를 쉬지 않고 뛰었다. 노승은 살았다. 석 달 뒤 찾아와 주먹 쥐는 법부터 다시 가르쳐 주었다.',tone:'good'}; } give('beads'); return {t:'등에서 숨이 멎었다. 노승의 손에서 염주가 흘러내렸다.',tone:'bad'}; }},
  {t:'못 본 척 지나간다',go:()=>{ m.ak+=3; return '등 뒤에서 염불 소리가 끊겼다.'; }}]});
E('coldPond',{min:15,max:50,once:1,w:.35,gi:1,st:()=>Sg('pond',{time:'night',noProps:1,props:[['waterfall',160],['pond',104,{w:66,dy:6,glow:1}],['tree',12,'pine']],hero:{x:54,emote:'?'}}),
  text:()=>'달밤, 산속 한담(寒潭) 바닥에서 푸른 빛이 올라온다. 물은 뼈가 시릴 만큼 차다.',ch:[
  {t:'물속으로 뛰어든다',p:()=>.12+ST('body')*.04+(hasT('cold')?.2:0),go:ok=>{ if(ok){ const it=wOf(3); give(it,{nolog:1}); if(hasT('cold')) m.f.coldCured=1; log(`한담 바닥에서 ${eul(ITEMS[it].n)} 건졌다`,true); return {t:`숨이 끊어지기 직전, 물 밑 석대에 꽂힌 ${eul(ITEMS[it].n)} 뽑았다. 푸른 빛은 거기서 나오고 있었다.${hasT('cold')?' 몸속의 한기가 못의 한기에 빨려 나갔다.':''}`,tone:'good',cut:()=>{ flashA=.6; flashC='#bff4ff'; }}; } hurt(30,'한담의 냉기'); return {t:'바닥에 닿기도 전에 팔다리가 굳었다. 겨우 기어 나왔다.',tone:'bad'}; }},
  {t:'손만 담가 본다',go:()=>{ m.ng+=5; return '손끝으로 찬 기운이 스며들어 단전까지 내려갔다.'; }},
  {t:'돌아선다',go:()=>'다음 날 다시 찾았을 때 못은 그냥 못이었다.'}]});
E('drunkBeggar',{min:15,max:60,once:1,w:.8,gi:1,st:()=>Sg('inn',{cast:[N('bg',LOOK.oldbeggar({item:'gourd'}),96,{pose:'drink',tag:'늙은 거지'}),N('wt',npcLook({name:'점소이',sex:'m',age:17,extra:'apron',}),118,{emote:'anger'})],hero:{x:62}}),
  text:()=>'객잔 문턱에 늙은 거지가 드러누워 술을 달라고 떼를 쓴다. 점소이가 빗자루를 든다.',ch:[
  {t:'술 한 독을 사 준다',when:()=>m.gold>=15,go:()=>{ gold(-15); learn('취선보',14,'보법'); log('취한 거지에게 취선보를 배웠다',true); return {t:'거지는 비틀거리며 일어나 내 주위를 세 바퀴 돌았다. 한 번도 옷깃을 잡지 못했다. "술값이다. 잘 봐 둬라."',tone:'good',cut:()=>{ const b=A('bg'); if(b){ b.act='play'; b.xmin=40; b.xmax=110; } }}; }},
  {t:'같이 마신다',when:()=>m.gold>=30,p:()=>.3+ST('charm')*.05,go:ok=>{ gold(-30); learn('취선보',14,'보법'); if(ok){ learn('파옥권',19,'권'); rel('지기','취개',75,{sx:'m'}); log('취개와 술친구가 되어 파옥권을 배웠다',true); return {t:'사흘을 마셨다. 깨어 보니 거지는 없고, 객잔 기둥에 주먹 자국 열여덟 개가 순서대로 찍혀 있었다.',tone:'good'}; } m.hp-=5; return {t:'먼저 곯아떨어졌다. 꿈결에 누가 내 주위를 빙빙 도는 것을 보았다.'}; }},
  {t:'점소이를 거든다',go:()=>{ m.ak+=3; return {t:'거지는 웃으며 일어났다. 빗자루는 허공만 쓸었다.',cut:()=>{ leave('bg',-1); }}; }}]});

/* ---------- 장터: 장비를 산다 ---------- */
const buy=(id,price,n)=>({t:`${eul(ITEMS[id].n)}${n>1?` ${n}개`:''} 산다`,s:`${price}냥 · ${itDesc(ITEMS[id])}`,when:()=>m.gold>=price,go:()=>{ gold(-price); give(id,{n:n||1}); return {t:`${fmt(price)}냥을 치렀다.`,tone:'good'}; }});
E('smithy',{min:14,max:70,rep:6,w:1.1,when:()=>m.gold>=14&&(m.f.martial||m.b.o==='hunter'||m.b.o==='escort')&&(!m.inv.w||ITEMS[m.inv.w].t<3||!m.inv.a),st:()=>Sg('forge',{props:[['anvil',84,{dy:8}],['rack',150,{dy:6}]],cast:[N('sm',LOOK.smith({tool:'hammer'}),98,{act:'tool',tag:'대장장이'})],hero:{x:54}}),
  text:()=>'장터 대장간에 새로 벼린 물건이 걸렸다. 쇠 냄새가 좋다.',ch:()=>{ const d=m.f.smith?.8:1, k=myKind(), out=[];
    [wOf(0,k),wOf(1,k)].concat(m.gold>=200?[wOf(2,k)]:[]).forEach(id=>{ if(better(id,m.inv.w)) out.push(buy(id,Math.round(ITEMS[id].v*d))); });
    const ar=ARMORS[m.gold>=120?1:0]; if(better(ar,m.inv.a)) out.push(buy(ar,Math.round(ITEMS[ar].v*d)));
    if(m.f.smith) out.push({t:'화로를 빌려 내 손으로 벼린다',s:'10냥 · 수련기에 익힌 솜씨',when:()=>m.gold>=10&&better(wOf(1,k),m.inv.w),go:()=>{ gold(-10); give(wOf(1,k)); return {t:'사흘 밤을 두드렸다. 대장장이가 날을 만져 보고 고개를 끄덕였다.',tone:'good'}; }});
    out.push({t:'구경만 한다',go:()=>'날 선 것들을 한참 구경하다 나왔다.'}); return out.slice(-5); }});
E('peddler',{min:12,max:75,rep:7,w:1,when:()=>m.gold>=12,st:()=>Sg('village',{cast:[N('pd',LOOK.peddler(),112,{tag:'방물장수',pose:'point'})]}),
  text:()=>'등짐 진 방물장수가 마을에 들어왔다. 보따리에서 별것이 다 나온다.',ch:()=>{ const out=[], cs=['sachet','talis','jadep','beads','mirror','eyebead'].filter(id=>m.inv.c!==id&&!m.inv.stash.includes(id)).sort(()=>R()-.5).slice(0,2);
    cs.forEach(id=>out.push(buy(id,ITEMS[id].v))); out.push(buy('salve',16,2)); if(R()<.5) out.push(buy('antidote',20)); else if(R()<.4) out.push(buy('pill',120));
    out.push({t:'구경만 한다',go:()=>'방물장수는 다음 고을로 떠났다.'}); return out; }});

/* ---------- 남들의 싸움, 그리고 죽음 ---------- */
const feudPair=()=>{ const a=m.rels.find(r=>(r.role==='사형'||r.role==='사저')&&!r.dead), b=m.rels.find(r=>r.role==='맞수'&&!r.dead); return a&&b?[a,b]:null; };
function feudEnd(aWins){ const [a,b]=feudPair(), los=aWins?b:a, win=aWins?a:b; los.dead=1; m.joy-=8; log(`${los.role} ${iga(los.name)} ${win.role} ${win.name}의 칼에 죽었다`,true); return {los,win}; }
E('feud',{min:16,max:55,once:1,w:1.3,when:()=>!!feudPair(),st:()=>{ const [a,b]=feudPair(); return Sg('dojo',{time:'dusk',noProps:1,props:[['hall',122,{w:56}],['tree',186,'pine']],cast:[N('fa',relLook(a,{weapon:'sword'}),96,{face:1,pose:'guard',tag:a.name}),N('fb',relLook(b,{weapon:'sword'}),134,{pose:'guard',tag:b.name,emote:'anger'})],hero:{x:34}}); },
  text:()=>{ const [a,b]=feudPair(); return `${a.role} ${wa(a.name)} 맞수 ${iga(b.name)} 연무장 한가운데서 진검을 뽑았다. 묵은 원한이라고 한다. 아무도 말리지 못한다.`; },ch:[
  {t:'둘 사이에 뛰어든다',s:'맞수의 검을 대신 받는다',duel:()=>{ const [a,b]=feudPair(); return {foe:{name:b.name,title:'맞수',look:relLook(b,{weapon:'sword'}),pow:Math.round(power()*1.02),style:'sword'},extras:[N('fa',relLook(a,{weapon:'sword'}),176,{pose:'guard',tag:a.name})]}; },
    go:ok=>{ const [a,b]=feudPair(); if(ok){ a.v=cl(a.v+10); b.v=cl(b.v+10); m.fame+=4; m.hy+=5; return {t:'맞수의 검을 쳐냈다. 둘은 한참 씩씩거리다 칼을 거두었다. 그날 밤 셋이서 말없이 술을 마셨다.',tone:'good'}; } const r=feudEnd(R()<.5); return {t:`내가 나가떨어지자 둘은 다시 맞붙었다. 일어났을 때 ${eun(r.los.name)} 더는 숨을 쉬지 않았다.`,tone:'bad',cut:()=>npcFight('fa','foe',{winner:r.win===a?'a':'b',kill:true,rounds:2})}; }},
  {t:'지켜본다',go:()=>{ const [a]=feudPair(), r=feudEnd(R()<.5); return {t:`서른 합쯤에서 ${r.win.name}의 검이 먼저 닿았다. ${eun(r.los.name)} 흙바닥에 누워 하늘을 보다가 눈을 감았다.`,tone:'bad',cut:()=>npcFight('fa','fb',{winner:r.win===a?'a':'b',kill:true,rounds:3})}; }},
  {t:'사부를 부르러 뛴다',p:()=>.5,go:ok=>{ const [a]=feudPair(); if(ok) return {t:'사부의 호통 한마디에 둘 다 칼을 떨어뜨렸다.',tone:'good',cut:()=>{ setPose('fa','kneel'); setPose('fb','kneel'); }}; const r=feudEnd(R()<.5); return {t:`사부와 달려왔을 때는 이미 늦었다. ${eun(r.los.name)} 쓰러져 있었다.`,tone:'bad',cut:()=>npcFight('fa','fb',{winner:r.win===a?'a':'b',kill:true,rounds:1})}; }}]});
const vilLook=()=>LOOK.blackclad({hair:'long',robe:'#3a2a3a'});
E('friendDeath',{min:18,max:60,once:1,w:1,when:()=>m.rels.some(r=>(r.role==='친구'||r.role==='지기')&&!r.dead),
  st:()=>{ const f=m.f.fd; return Sg('road',{time:'dusk',cast:[N('fr',f.lk,98,{face:1,pose:'guard',tag:f.n}),N('vil',vilLook(),130,{pose:'guard',tag:f.v,tagc:'foe'})],hero:{x:28},show:()=>npcFight('vil','fr',{winner:'a',kill:true,rounds:2})}); },
  text:()=>{ const r=m.rels.find(x=>(x.role==='친구'||x.role==='지기')&&!x.dead), v=pick(['혈수','독랑','귀도','철면'])+' '+rname(); m.f.fd={n:r.name,v,lk:relLook(r,{weapon:'sword'})}; r.dead=1; m.joy-=12; log(`${r.role} ${iga(r.name)} ${v}의 칼에 죽었다`,true); return `관도 저편에서 칼 부딪는 소리가 난다. ${r.name}${jo(r.name,'이다','다')}. 달려갔지만 한 발 늦었다. ${v}의 칼이 먼저였다.`; },ch:[
  {t:'그 자리에서 칼을 뽑는다',when:()=>m.f.martial,duel:()=>({foe:{name:m.f.fd.v,look:vilLook(),pow:62,style:'assassin',mercy:.25,art:'혈영도'},lethal:1,cause:`${m.f.fd.v}의 칼`,noReturn:1,loot:{g:[20,80],it:[[wOf(1),.5],['mirror',.15]]},extras:[N('fr',m.f.fd.lk,22,{pose:'dead'})]}),
    go:(ok,res)=>{ if(ok){ m.hy+=5; m.fame+=6; log(`${m.f.fd.n}의 원수를 그 자리에서 갚았다`,true); return {t:res.spared?'칼끝을 목에 대고 한참 서 있었다. 죽은 벗이 바랐을 일이 아니었다.':'벗의 눈을 감겨 주었다. 원수의 피가 아직 칼에서 떨어지고 있었다.',tone:'good'}; } if(res.dead) return {t:'벗의 곁에 나란히 누웠다.',tone:'bad'}; m.f.avenge={n:m.f.fd.v}; m.q.push({age:m.age+ri(3,6),id:'avenge'}); return {t:'쓰러진 채로 그자의 뒷모습을 보았다. 그 등을 잊지 않을 것이다.',tone:'bad'}; }},
  {t:'이름을 새겨 두고 훗날을 기약한다',go:()=>{ m.f.avenge={n:m.f.fd.v}; m.q.push({age:m.age+ri(3,7),id:'avenge'}); return {t:'벗을 묻고, 묘비 뒤에 그자의 이름을 새겼다.',cut:()=>{ leave('vil',1); setPose('hero','kneel'); }}; }},
  {t:'묻어 주고 돌아선다',go:()=>{ m.joy-=6; bump('wit'); return {t:'강호의 일은 강호에 두기로 했다. 술 한 병을 무덤에 부었다.',cut:()=>{ leave('vil',1); }}; }}]});
E('avenge',{when:()=>!!m.f.avenge,st:()=>Sg('innroom',{time:'night',cast:[N('vil',vilLook(),116,{pose:'drink',tag:m.f.avenge.n,tagc:'foe'})]}),
  text:()=>`${m.f.avenge.n}의 행방을 찾았다. 객잔 구석에서 혼자 술을 마시고 있다. 죽은 벗의 이름을 기억이나 할까.`,ch:[
  {t:'칼을 뽑는다',duel:()=>({foe:{name:m.f.avenge.n,look:vilLook(),pow:68,style:'assassin',mercy:.1,art:'혈영도'},lethal:1,cause:`${m.f.avenge.n}의 칼`,noReturn:1,loot:{g:[40,120],it:[[wOf(2),.35],['mirror',.2]]}}),
    go:(ok,res)=>{ if(ok){ m.hy+=5; m.fame+=8; log('벗의 원수를 갚았다',true); m.f.avenge=null; return {t:res.spared?'그자는 벗의 이름을 기억하고 있었다. 그걸로 됐다. 칼을 거두었다.':'술상이 엎어지고, 등잔이 꺼지고, 다시 켜졌을 때는 끝나 있었다.',tone:'good'}; } if(!res.dead) m.q.push({age:m.age+ri(4,7),id:'avenge'}); return {t:res.dead?'그자의 칼은 그때보다 더 빨라져 있었다.':'창밖으로 내던져졌다. 아직 모자랐다.',tone:'bad'}; }},
  {t:'술잔을 엎고 돌아선다',go:()=>{ m.f.avenge=null; m.hy+=4; bump('wit'); return '벗은 내가 살기를 바랐을 것이다.'; }}]});
const discPair=()=>{ const d=m.rels.filter(r=>r.role==='제자'&&!r.dead); return d.length>=2?[d[0],d[1]]:null; };
E('succession',{min:50,max:88,once:1,w:1.6,when:()=>!!discPair(),st:()=>{ const [a,b]=discPair(); return Sg('dojo',{noProps:1,props:[['hall',122,{w:56}],['tree',186,'pine']],cast:[N('da',relLook(a,{weapon:'sword',age:30}),98,{face:1,pose:'guard',tag:a.name}),N('db',relLook(b,{weapon:'sword',age:26}),136,{pose:'guard',tag:b.name})],hero:{x:36}}); },
  text:()=>{ const [a,b]=discPair(); return `제자 ${wa(a.name)} ${iga(b.name)} 의발을 두고 다툰다. 오늘 연무장에서 결판을 내겠다고 한다.`; },ch:[
  {t:'비무로 정하게 한다',go:()=>{ const [a,b]=discPair(), aw=R()<.55, win=aw?a:b, los=aw?b:a; m.f.heirDisc=win.name; m.fame+=4; if(R()<.25){ los.role='원수'; los.v=5; } log(`${eul(win.name)} 후계로 정했다`,true); return {t:`${win.name}의 검이 한 치 빨랐다. ${eun(los.name)} 검을 내려놓고 ${los.role==='원수'?'말없이 산을 내려갔다.':'사형제에게 절했다.'}`,cut:()=>npcFight('da','db',{winner:aw?'a':'b',rounds:3})}; }},
  {t:'맏제자에게 물려준다',go:()=>{ const [a,b]=discPair(); m.f.heirDisc=a.name; if(R()<.3){ b.role='원수'; b.v=5; } log(`${eul(a.name)} 후계로 정했다`,true); return {t:`${a.name}에게 검을 건넸다. ${eun(b.name)} ${b.role==='원수'?'그날 밤 짐을 쌌다.':'고개를 숙였다.'}`,cut:()=>{ setPose('da','bow'); }}; }},
  {t:'둘 다 꾸짖는다',go:()=>{ bump('wit'); m.bond+=6; return {t:'"의발은 물건이 아니다." 둘은 사흘 동안 마당을 쓸었다.',cut:()=>{ setPose('da','kneel'); setPose('db','kneel'); }}; }}]});
const oldRival=()=>m.rels.find(r=>r.role==='맞수'&&!r.dead)||m.rels.find(r=>r.role==='원수'&&!r.dead);
E('rivalReturn',{min:24,max:62,once:1,w:1.3,when:()=>m.f.martial&&!!oldRival(),st:()=>{ const r=oldRival(); return Sg('bamboo',{wx:'leaf',cast:[N('rv',relLook(r,{weapon:'sword'}),122,{pose:'guard',tag:r.name,emote:r.role==='원수'?'anger':'!'})]}); },
  text:()=>{ const r=oldRival(); return r.role==='원수'?`${iga(r.name)} 대숲 길을 막아섰다. "그날 일, 오늘 갚는다."`:`맞수 ${iga(r.name)} 십 년 만에 찾아왔다. "그날의 승부, 아직 끝나지 않았다."`; },ch:[
  {t:'검을 뽑는다',duel:()=>{ const r=oldRival(), foe=r.role==='원수'; return {foe:{name:r.name,title:r.role,look:relLook(r,{weapon:'sword'}),pow:Math.round(power()*1.04+ri(-3,5)),style:'sword',mercy:.3},lethal:foe,cause:`${r.name}의 검`,noReturn:1}; },
    go:(ok,res)=>{ const r=oldRival(), foe=r.role==='원수'; if(ok){ m.fame+=6; if(foe){ if(res.killed){ r.dead=1; return {t:'오랜 원한이 대숲에서 끝났다. 댓잎이 그 위로 떨어졌다.',tone:'good'}; } r.role='지기'; r.v=60; return {t:'칼을 거두자 그는 한참 울었다. 원한은 거기 두고 갔다.',tone:'good'}; } r.role='지기'; r.v=80; return {t:'백 합 끝에 내 검이 반 치 앞섰다. 맞수는 크게 웃더니 술병을 꺼냈다.',tone:'good'}; } if(res.dead) return {t:'댓잎이 눈 위로 떨어졌다.',tone:'bad'}; m.fame-=3; return {t:foe?'쓰러진 나를 내려다보다가, 침을 뱉고 돌아섰다.':'반 치가 모자랐다. 맞수는 "십 년 뒤에 또 보자"고 했다.',tone:'bad'}; }},
  {t:'술로 대신하자고 한다',p:()=>.35+ST('charm')*.05,go:ok=>{ const r=oldRival(); if(ok){ r.role='지기'; r.v=70; return {t:'한참 노려보더니 검을 거두었다. 그날 밤 술이 모자랐다.',tone:'good',cut:()=>{ setPose('rv','drink'); setPose('hero','drink'); }}; } hurt(15); return {t:'대답 대신 검이 날아왔다. 소매가 잘렸다.',tone:'bad'}; }}]});
E('sparedReturn',{min:16,max:88,rep:4,w:1.5,when:()=>(m.spared||[]).some(s=>m.age-s.a>=3),
  st:()=>{ const s=m.f.sp; return Sg('road',{cast:[N('sp',s.lk||LOOK.bandit(),112,{tag:s.n,pose:s.foe?'guard':'kneel',emote:s.foe?'anger':'tear'})]}); },
  text:()=>{ const i=m.spared.findIndex(s=>m.age-s.a>=3), s=m.spared.splice(i,1)[0]; s.foe=R()<.4; m.f.sp=s; return s.foe?`${iga(s.n)} 길을 막았다. 그날 살려 준 목숨이다. "그 수모를 하루도 잊은 적 없다."`:`${iga(s.n)} 찾아와 무릎을 꿇었다. 그날 살려 준 목숨이다. "덕분에 사람 노릇 하며 삽니다."`; },
  ch:()=>{ const s=m.f.sp; if(s.foe) return [
    {t:'칼을 받는다',duel:()=>({foe:{name:s.n,look:s.lk||LOOK.bandit(),pow:Math.max(s.pow+14,Math.round(power()*.9)),style:'bandit',mercy:.2},lethal:1,cause:`${s.n}의 칼`,noReturn:1,loot:{g:[10,50]}}),go:(ok,res)=>{ if(ok) return {t:res.killed?'두 번 살려 주지는 않았다.':'또 살려 주었다. 이번에는 그가 먼저 눈을 피했다.',tone:'good'}; return {t:res.dead?'은혜를 원수로 받았다.':'쓰러진 내 얼굴에 침을 뱉고 떠났다.',tone:'bad'}; }},
    {t:'말로 달랜다',p:()=>.3+ST('charm')*.05,go:ok=>{ if(ok){ m.hy+=4; return {t:'한참 노려보다 칼을 떨어뜨렸다.',tone:'good',cut:()=>{ setPose('sp','cry'); }}; } hurt(20,`${s.n}의 칼`); return {t:'말이 끝나기 전에 칼이 먼저 왔다.',tone:'bad'}; }}];
    return [
    {t:'일으켜 세운다',go:()=>{ const it=pick([wOf(1),'chain','mirror','pill']); give(it); rel('지기',s.n,70); m.hy+=4; return {t:`그는 보따리를 풀어 ${eul(ITEMS[it].n)} 내밀었다. "빚을 갚으러 왔습니다."`,tone:'good',cut:()=>{ setPose('sp','bow'); }}; }},
    {t:'제자로 삼는다',when:()=>m.lv>=3,go:()=>{ m.disc++; rel('제자',s.n,75); m.fame+=3; return {t:'칼을 겨눴던 자가 제자가 되었다. 강호는 그런 곳이다.',tone:'good',cut:()=>{ setPose('sp','bow'); emo('sp','star'); }}; }}]; }});
E('kinRevenge',{when:()=>!!m.f.kinOf,st:()=>Sg('road',{time:'dawn',cast:[N('kn',LOOK.youth({hair:'band',robe:'#e9e6dc'}),118,{pose:'guard',emote:'anger',tag:'원수의 자식'})]}),
  text:()=>`${m.f.kinOf}의 자식이라는 젊은이가 길을 막았다. 흰 띠를 두르고 있다. "아버지의 원수."`,ch:[
  {t:'칼을 받는다',duel:()=>({foe:{name:rname(),title:`${m.f.kinOf}의 자식`,look:LOOK.youth({hair:'band',robe:'#e9e6dc'}),pow:Math.round(power()*.8),style:'brute',mercy:.1},lethal:1,cause:'원수의 자식이 휘두른 칼',noReturn:1}),go:(ok,res)=>{ m.f.kinOf=null; if(ok){ if(res.killed){ m.ak+=6; return {t:'아비와 자식을 다 베었다. 손이 떨리지 않는 것이 더 무서웠다.',tone:'bad'}; } m.hy+=6; return {t:'칼을 쳐내고 돌아섰다. 등 뒤에서 울음소리가 들렸다.',tone:'good'}; } return {t:res.dead?'갚을 것을 갚았다.':'칼이 어깨에 박혔다. 젊은이는 끝을 내지 못하고 달아났다.',tone:'bad'}; }},
  {t:'칼을 맞아 준다',go:()=>{ m.f.kinOf=null; hurt(30,'원수의 자식이 휘두른 칼'); m.hy+=8; return {t:'칼이 어깨에 박혔다. 젊은이는 울면서 달아났다.',cut:()=>{ const k=A('kn'), h=A('hero'); if(k&&h){ fxSlash(h.x+4,h.y-13,-1,'#ffffff'); blood(h.x,h.y-12,-1); h.flash=8; } setTimeout(()=>leave('kn',1),700); }}; }},
  {t:'사정을 말한다',p:()=>.3+ST('charm')*.05,go:ok=>{ m.f.kinOf=null; if(ok) return {t:'끝까지 듣더니 칼을 떨어뜨렸다.',tone:'good',cut:()=>{ setPose('kn','cry'); }}; hurt(20,'원수의 자식이 휘두른 칼'); return {t:'"변명은 저승에서 해라."',tone:'bad'}; }}]});
E('escortJob',{min:16,max:60,rep:6,w:1.1,when:()=>m.f.martial&&m.lv>=1,st:()=>Sg('road',{cast:[N('es',npcLook({name:'표두',sex:'m',age:45,robe:'#3f5a6f',beard:'short'}),104,{tag:'표두',pose:'bow'}),N('hs',LOOK.horse(),136,{}),N('bx',folk(4,{item:'box'}),156,{pose:'carry'})]}),
  text:()=>'표국에서 급한 표물을 맡아 달라고 한다. 길은 험하고 삯은 후하다.',ch:[
  {t:'맡는다',s:'고갯길에서 산적을 만난다',duel:()=>({foe:{name:'고갯길 산적',look:LOOK.chief({robe:'#4a3a2a'}),pow:Math.round(42+m.lv*5),style:'bandit',mercy:.6,art:'녹림도법'},lethal:1,rob:.3,cause:'표행 길의 산적',bg:'forest',loot:{g:[10,30],it:[['salve',.5],['asaber',.15]]},extras:[N('hs',LOOK.horse(),22,{face:1})]}),
    go:(ok,res)=>{ if(ok){ const g=ri(50,90)+m.lv*12; gold(g); m.fame+=2; return {t:`표물은 무사히 닿았다. 삯으로 ${g}냥을 받았다.`,tone:'good'}; } return {t:res.dead?'표물도 목숨도 고갯길에 두고 왔다.':'표물을 빼앗겼다. 표국에 얼굴을 들 수 없게 되었다.',tone:'bad'}; }},
  {t:'거절한다',go:()=>'표두는 다른 사람을 찾아갔다.'}]});
E('beast',{min:14,max:62,rep:10,w:.8,st:()=>Sg('forest',{cast:[N('tg',LOOK.tiger(),128,{tag:'범',emote:'anger'}),N('wc',folk(2,{sex:'m'}),170,{act:'shiver',emote:'sweat'})]}),
  text:()=>'산길에 범이 내려왔다. 나무꾼 하나가 바위 뒤에서 떨고 있다.',ch:[
  {t:'범과 맞선다',duel:()=>({foe:{name:'산군(山君)',look:LOOK.tiger(),pow:58,style:'beast',mercy:0},lethal:1,cause:'호환',extras:[N('wc',folk(2,{sex:'m'}),178,{act:'shiver'})]}),go:(ok,res)=>{ if(ok){ gold(60); m.fame+=8; m.hy+=4; bump('body'); log('맨몸으로 범을 잡았다',true); return {t:'범이 쓰러졌다. 가죽 값으로 60냥을 받았고, 고을에서는 그날부터 내 이름을 범 잡은 이로 불렀다.',tone:'good'}; } return {t:res.dead?'범의 앞발은 생각보다 빨랐다.':'나무 위로 기어올라 날이 샐 때까지 버텼다.',tone:'bad'}; }},
  {t:'소리를 질러 쫓는다',p:()=>.3+ST('body')*.04,go:ok=>{ if(ok){ m.hy+=4; return {t:'솥뚜껑을 두드리며 악을 썼다. 범은 귀찮다는 듯 숲으로 들어갔다.',tone:'good',cut:()=>{ leave('tg',1); }}; } hurt(28,'호환'); return {t:'범이 이쪽으로 방향을 틀었다. 앞발에 등이 찢겼다.',tone:'bad'}; }},
  {t:'뒷걸음질로 물러난다',go:()=>{ m.ak+=2; return '나무꾼의 비명을 뒤로하고 산을 내려왔다.'; }}]});
