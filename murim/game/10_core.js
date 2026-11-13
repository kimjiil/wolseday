/* ==== murim:core — 도구, 강호의 기본값, 태어나는 세상, 상태 ==== */
const $m=id=>document.getElementById(id);
// 버전과 바뀐 점. 새 버전을 낼 때 맨 위에 한 묶음을 더하고 MVER 를 올린다(murim/CHANGELOG.md 도 함께)
const MVER='1.3';
const NOTES=[
  ['1.3','2026-11-13',['무공 823가지: 무협에 두루 나오는 무공을 모아 C~SSR 등급을 매겼다(검 183 · 장 163 · 권 116 · 내공 115 · 도 82 · 보법 80 · 암기 38 · 외공 21 · 안법 13 · 마공 12)','문파 장경각: 사문에 가면 서열과 경지에 맞는 사문의 무공을 한 계절에 하나씩 익힌다(삼대제자 B, 이대제자 A, 일대제자 S, 장로 SS)','비급: 읽으면 그 갈래·등급의 무공 하나를 익힌다. 가게에서 팔고, 싸움과 사건에서 떨어진다','외공: 방어를 올려 주는 새 갈래','이름난 무공을 얻는 기연 17가지(독고구검, 능파미보, 구양진경 등)','신상 칸의 무공에 등급과 위력이 보이고, 지금 쓰이는 무공에 테가 둘린다','S 이상 무공을 얻으면 획득 연출이 뜬다(S 絶技, SS 神功, SSR 絶世神功)','걸리는 시간을 "철" 대신 석 달·반년·1년 반처럼 적는다','인생 등급: 한 생이 끝나면 살아온 것을 점수로 매겨 C~SSR 등급을 준다','인물 카드: 끝 화면에서 등급이 찍힌 카드 그림을 카카오톡 등으로 보내거나 저장한다','낱말 설명: 신상 칸에서 건강·행복·인연·무공·내공·사문·타고난 것·무위를 누르면 어디에 쓰이는지 나온다','행복과 인연에 쓰임새가 생겼다(행복은 수련과 병, 인연은 가게 값과 공헌)','마을의 맞수·친구도 나이를 먹는다. 여인 문파의 사부는 여인이다(보타문 사부도)']],
  ['1.2','2026-11-13',['지휘전: 나이가 들거나 자리가 오르면 대전에서 칼 대신 깃발을 든다. 세 갈래에 사람을 배치하고 영을 내린다','무림맹(가입·회합·임무·직책)과 십 년에 한 번 열리는 천하제일 비무대회','반로환동: 화경에 네 갑자를 쌓은 예순 이후, 몸이 서른 해 젊어진다','등급 사건이 1040개가 됐다(C 470, B 312, A 157, S 71, SS 25, SSR 5)','늙어도 한 해에 생기는 일과 기연의 수가 젊을 때와 같다. 노년 사건을 따로 넣었다','내공이 수명을 늘려 주는 것은 열 갑자까지. 내공 약은 먹을수록 덜 듣는다','소림 제자는 혼인하지 못한다. 환속하면 풀린다','새 무공 갈래 안법: 결투에서 낌새를 읽을 확률이 오른다','새 장신구 명안주(읽기 +8%)와 응안석(읽기 +15%)','물건이 1000가지가 됐다. 등급은 사건과 같은 C~SSR','머리와 신발 자리가 생겼다. 물건마다 회심·회피·읽기·기력 같은 힘이 붙는다','싸움에서 이기거나 사건이 잘 풀리면 물건이 떨어진다. 가게 물건은 철마다 바뀐다','새 물건 압생투강주: 내공 +10년, 열에 셋은 주화입마','이름값을 못 하던 것을 고쳤다: 천운(주사위 8~20), 만독불침·피독주·해독단(독), 혈마체(마공), 염주(주화입마), 보법(위력만큼 회피)','문파·출신·고향·혼인·나이에 따라 나오는 사건이 더 갈린다','휴대폰 화면 정리: 장면 밑에 건강·행복·돈·내공 한 줄, 작은 글씨와 단추 키움, 알림은 위쪽에 작게, 천하 지도에서 떠나는 단추가 화면 아래에 붙음, 가로로 눕히면 장면 왼쪽·카드 오른쪽']],
  ['1.1','2026-11-13',['사건에 등급이 붙었다: C · B · A · S · SS · SSR','등급 사건 299개 추가(일상 133, 작은 일 90, 쓸 만한 일 45, 큰일 21, 기연 8, 천운 2)','큰 사건이 없는 해에도 소소한 사건이 자주 나온다','출신, 고향, 혼인과 자식, 나이에 따라 다른 사건이 나온다','S 이상의 사건은 열릴 때 화면이 번쩍인다']],
  ['1.0','2026-11-13',['천하 지도: 스물여섯 지역, 쉰두 곳을 오간다','출신 55가지, 출신마다 다른 고향 마을','풀숲에서 우연히 만나는 일과 기연','문파 임무와 마교 침공','맡기기(자동 진행), 결과는 단추를 눌러 넘긴다']]
];
const R=()=>Math.random(), ri=(a,b)=>a+Math.floor(R()*(b-a+1)), pick=a=>a[Math.floor(R()*a.length)], cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const jo=(w,a,b)=>{w=String(w||'');const c=w.charCodeAt(w.length-1)-0xAC00;return (c>=0&&c<11172&&c%28)?a:b;};
const eul=w=>w+jo(w,'을','를'), iga=w=>w+jo(w,'이','가'), eun=w=>w+jo(w,'은','는'), wa=w=>w+jo(w,'과','와'), ro=w=>w+jo(w,'으로','로');
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('ko-KR');
// 손가락으로 누르는 화면인가(자판 안내를 빼고, 좁은 화면용 배치를 쓴다)
const mq=q=>{ try{ return matchMedia(q).matches; }catch(e){ return false; } };
const isTouch=()=>mq('(pointer:coarse),(max-width:560px)'), isNarrow=()=>mq('(max-width:880px) and (orientation:portrait)');
function lsGet(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
function lsSet(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

const LV=['범인','삼류','이류','일류','절정','초절정','화경','현경','생사경'];
const LVX=[0,6,22,60,135,240,400,640,1000];
const LVP=[0,10,20,32,46,62,80,100,125];
// 흔한 성이 대부분이고 복성은 드물다. 세가의 성(남궁·제갈·모용·당·팽)은 그 집안에서 태어날 때만 붙는다
const SURN=['이','왕','장','유','진','양','조','황','주','오','서','손','마','호','곽','임','하','고','나','정','한','백','연','설','위','소','허','심','여','노','방','석','육','강','독고','사마','황보','공손','하후'];
const GIV=['무','진','천','운','호','명','성','백','청','소','혁','윤','결','도','준','하','린','설','연','화','영','월','현','강','휘','령','건','서'];
const gname=()=>{let a=pick(GIV),b=pick(GIV);while(b===a)b=pick(GIV);return a+b;};
const SECTS={
  shaolin:{n:'소림사',side:'정',art:['나한권',12,'권'],inner:['역근공',10],robe:'#c98a2e',male:1,monk:1,w0:'lglove'},
  wudang:{n:'무당파',side:'정',art:['태극검',15,'검'],inner:['순양무극공',8],robe:'#4f7590',w0:'wsword'},
  huashan:{n:'화산파',side:'정',art:['매화검법',16,'검'],inner:['자하신공',7],robe:'#a8496a',w0:'wsword'},
  emei:{n:'아미파',side:'정',art:['아미검법',14,'검'],inner:['정심공',7],robe:'#6f8a62',female:1,w0:'wsword'},
  beggar:{n:'개방',side:'정',art:['용음장',15,'장'],inner:['취선공',5],robe:'#8a7650',w0:'lglove'},
  namgung:{n:'남궁세가',side:'정',art:['창궁무애검',17,'검'],inner:['제왕심법',6],robe:'#2f4a7a',w0:'isword'},
  tang:{n:'사천당가',side:'중',art:['만천화우',17,'암기'],inner:['독공',6],robe:'#3d5a3a',w0:'ldart'},
  haomun:{n:'하오문',side:'중',art:['은형보',9,'보법'],robe:'#5d5d64',w0:'ldart'},
  nokrim:{n:'녹림채',side:'사',art:['녹림도법',13,'도'],robe:'#6b5430',w0:'bsaber'},
  zhongnan:{n:'종남파',side:'정',art:['천하삼십육검',15,'검'],inner:['종남현공',7],robe:'#5a6f8a',w0:'wsword'},
  kunlun:{n:'곤륜파',side:'정',art:['운룡대팔식',15,'검'],inner:['태청강기',7],robe:'#8fa3b8',w0:'wsword'},
  jeomchang:{n:'점창파',side:'정',art:['사일검법',16,'검'],inner:['분광심법',6],robe:'#3f7a7a',w0:'wsword'},
  gongdong:{n:'공동파',side:'정',art:['복마검법',14,'검'],inner:['현공심법',6],robe:'#7a6a4a',w0:'wsword'},
  qingcheng:{n:'청성파',side:'정',art:['송풍검법',14,'검'],inner:['청성심법',6],robe:'#4a7a5a',w0:'wsword'},
  taishan:{n:'태산파',side:'정',art:['태산십팔반',14,'검'],inner:['동악심법',6],robe:'#6a5a7a',w0:'wsword'},
  hengshan_s:{n:'형산파',side:'정',art:['회풍낙안검',14,'검'],inner:['축융심법',6],robe:'#8a5a4a',w0:'wsword'},
  hengshan_n:{n:'항산파',side:'정',art:['만화검법',13,'검'],inner:['북악심법',6],robe:'#6a7a8a',w0:'wsword'},
  botao:{n:'보타문',side:'정',art:['자죽검법',13,'검'],inner:['관음심법',7],robe:'#7a9aa0',fmaster:1,w0:'wsword'},
  yongho:{n:'용호산',side:'정',art:['오뢰장',15,'장'],inner:['정일심법',8],robe:'#3a4a6a',w0:'lglove'},
  hainan:{n:'해남파',side:'중',art:['남해삼십육검',15,'검'],inner:['조음공',6],robe:'#2f7a8a',w0:'wsword'},
  jangbaek:{n:'장백파',side:'중',art:['설령검법',14,'검'],inner:['한빙결',6],robe:'#aab4c0',w0:'wsword'},
  tianshan:{n:'천산파',side:'중',art:['천산검법',15,'검'],inner:['빙심결',7],robe:'#9ab0c8',w0:'wsword'},
  potala:{n:'포달랍궁',side:'중',art:['대수인',16,'장'],inner:['밀종심법',8],robe:'#a0402a',w0:'lglove'},
  yasu:{n:'남만야수궁',side:'중',art:['맹수권',15,'권'],inner:['야수공',5],robe:'#7a5a2a',w0:'lglove'},
  binggung:{n:'북해빙궁',side:'중',art:['빙백신장',17,'장'],inner:['빙백신공',8],robe:'#b8d0e0',w0:'lglove'},
  odok:{n:'오독교',side:'사',art:['오독장',15,'장'],inner:['만독공',6],robe:'#4a3a5a',w0:'lglove'},
  zhuge:{n:'제갈세가',side:'정',art:['팔진검',14,'검'],inner:['와룡심법',7],robe:'#4a5a8a',w0:'isword'},
  paeng:{n:'하북팽가',side:'정',art:['오호단문도',17,'도'],inner:['혼원공',5],robe:'#7a3a2a',w0:'bsaber'},
  moyong:{n:'모용세가',side:'중',art:['고소검법',16,'검'],inner:['연가심법',6],robe:'#5a4a8a',w0:'isword'},
  suchae:{n:'장강수로채',side:'사',art:['분수도법',13,'도'],robe:'#3a5a6a',w0:'bsaber'},
  hyeol:{n:'혈교',side:'마',art:['혈영신공',22,'마공'],robe:'#5a0f1e',w0:'lglove'},
  demon:{n:'천마신교',side:'마',art:['천마신공',24,'마공'],robe:'#7a1e1e',w0:'lglove'}
};
const ERAS={
  peace:{n:'태평성대',d:'무림맹이 강호를 다스리는 시대. 큰 싸움은 드물고, 사람들은 흉년과 역병을 더 무서워한다.',child:.16,war:0,plague:.006,famine:.012,births:'1,180만'},
  chaos:{n:'정사대전기',d:'정파와 천마신교가 중원을 두고 싸우는 시대. 관도마다 피난민이 넘친다.',child:.26,war:.012,plague:.012,famine:.025,births:'860만'},
  demon:{n:'마교 천하',d:'천마신교가 중원을 손에 넣은 시대. 정파는 숨어 지내고, 마교의 법이 곧 관의 법이다.',child:.2,war:.005,plague:.009,famine:.018,births:'940만'}
};
const REGIONS=[
  {id:'henan',n:'하남',w:15,d:'숭산 아래, 소림사의 종소리가 들리는 땅',sect:'shaolin'},
  {id:'hubei',n:'호북',w:10,d:'무당산이 보이는 강변 고을',sect:'wudang',biome:'water'},
  {id:'shaanxi',n:'섬서',w:7,d:'화산 연화봉 아래 메마른 고원',sect:'huashan',biome:'dry'},
  {id:'sichuan',n:'사천',w:11,d:'안개 낀 분지. 아미산과 당가타가 있다',sect:'emei'},
  {id:'anhui',n:'안휘',w:8,d:'남궁세가의 깃발이 걸린 고을',sect:'namgung'},
  {id:'jiangnan',n:'강소',w:10,d:'운하와 비단 장터가 끝없이 이어진 물의 고장',biome:'water'},
  {id:'zhejiang',n:'절강',w:8,d:'서호의 버들과 바닷바람이 만나는 항구',biome:'water',sect:'botao'},
  {id:'shandong',n:'산동',w:11,d:'태산 아래 넓은 밀밭',sect:'taishan'},
  {id:'hebei',n:'하북',w:9,d:'북방 오랑캐와 맞닿은 거친 들판',biome:'dry'},
  {id:'guangdong',n:'광동',w:6,d:'남쪽 바다의 습한 항구',biome:'jungle'},
  {id:'yunnan',n:'운남',w:3,d:'독충과 산족의 땅, 남만',biome:'jungle',sect:'jeomchang'},
  {id:'xinjiang',n:'천산',w:1.5,d:'눈 덮인 천산 아래 새외의 오아시스',biome:'snow',sect:'tianshan'},
  {id:'beihai',n:'북해',w:.5,d:'일 년 내내 얼음이 녹지 않는 북쪽 끝',biome:'snow',sect:'binggung'},
  {id:'shanxi',n:'산서',w:6,d:'태행산 그늘 아래 상인과 산적이 함께 사는 땅',biome:'dry',sect:'hengshan_n'},
  {id:'hunan',n:'호남',w:8,d:'동정호 물안개와 형산 자락의 고을',biome:'water',sect:'hengshan_s'},
  {id:'jiangxi',n:'강서',w:7,d:'파양호 뱃노래가 들리는 도자기의 고장',biome:'water',sect:'yongho'},
  {id:'gansu',n:'감숙',w:2.5,d:'서역으로 가는 낙타가 지나는 황톳길',biome:'dry',sect:'gongdong'},
  {id:'qinghai',n:'청해',w:.6,d:'곤륜산 눈이 녹아 흐르는 푸른 호숫가',biome:'snow',sect:'kunlun'},
  {id:'fujian',n:'복건',w:5,d:'산이 바다로 떨어지는 해적과 차의 땅',biome:'jungle',sect:'shaolin'},
  {id:'hainan',n:'해남',w:.6,d:'뱃길 끝의 더운 섬',biome:'jungle',sect:'hainan'},
  {id:'guangxi',n:'광서',w:3,d:'십만대산의 그림자가 드리운 남쪽 변방',biome:'jungle'},
  {id:'guizhou',n:'귀주',w:2,d:'독충과 안개의 묘강',biome:'jungle',sect:'odok'},
  {id:'xizang',n:'서장',w:.5,d:'하늘과 맞닿은 설산의 고원',biome:'snow',sect:'potala'},
  {id:'nanman',n:'남만',w:.8,d:'맹수와 밀림의 땅',biome:'jungle',sect:'yasu'},
  {id:'mongol',n:'몽골',w:1,d:'끝없는 초원과 말발굽 소리',biome:'dry'},
  {id:'liaodong',n:'요동',w:1.5,d:'장백산 아래 눈보라 치는 변경',biome:'snow',sect:'jangbaek'}
];
// w: [이 해에 태어나는 아이 기준, 지금 사는 사람 기준] · pct: 재산 백분위 · inc: 한 해 벌이(냥) · it: 집안에서 물려받는 물건
const FAM=[
  {id:'tenant',n:'소작농',d:'남의 땅을 부친다. 수확의 절반은 지주 몫이다.',w:[36,30],pct:[2,30],gold:2,inc:6},
  {id:'farmer',n:'자작농',d:'작지만 제 땅이 있다. 흉년만 피하면 굶지는 않는다.',w:[22,24],pct:[25,60],gold:12,inc:10},
  {id:'beggar',n:'유랑민',d:'고향을 잃고 떠돈다. 다리 밑이 집이다.',w:[8,5],pct:[0,4],gold:0,inc:3,hint:'beggar'},
  {id:'artisan',n:'장인',d:'대장간 망치 소리 속에서 자란다.',w:[8,9],pct:[35,70],gold:20,inc:14},
  {id:'merchant',n:'상인',d:'장터에 점포가 있다. 셈을 먼저 배운다.',w:[7,9],pct:[60,93],gold:70,inc:26,it:['sachet']},
  {id:'hunter',n:'사냥꾼',d:'산짐승을 쫓으며 자란다.',w:[4,4],pct:[12,40],gold:5,inc:8,st:{body:1},it:['bsaber']},
  {id:'inn',n:'객잔 일꾼',d:'객잔 부엌에서 강호의 소문을 듣고 자란다.',w:[3.5,3.5],pct:[15,45],gold:5,inc:9,hint:'haomun'},
  {id:'bandit',n:'녹림 산채',d:'산적 소굴에서 태어났다. 관의 장부에는 없는 아이다.',w:[1.6,1.2],pct:[10,40],gold:10,inc:10,hint:'nokrim',ak:8,it:['bsaber']},
  {id:'escort',n:'표국 표사',d:'아버지는 표물을 지키는 표사다. 집에 낡은 검이 있다.',w:[2,2.5],pct:[45,75],gold:40,inc:18,art:['삼재검법',6,'검'],it:['isword']},
  {id:'doctor',n:'의원',d:'약초 냄새 속에서 자란다. 혈도를 먼저 외운다.',w:[1.5,2],pct:[60,88],gold:50,inc:20,f:{med:1},bag:{salve:2,antidote:1}},
  {id:'official',n:'지방 관리',d:'아버지는 현의 관리다. 글을 먼저 배운다.',w:[1,1.8],pct:[85,98],gold:180,inc:40,st:{wit:1},it:['jadep']},
  {id:'clan',n:'무림세가',d:'태어날 때부터 가문의 검을 쥐었다.',w:[.5,.7],pct:[92,99.6],gold:300,inc:45,sect:'namgung',sur:'남궁',region:'anhui',it:['gsword','lvest']},
  {id:'tangc',n:'사천당가',d:'독 냄새를 맡으며 자란다. 당가 사람은 쉽게 믿지 않는다.',w:[.25,.35],pct:[85,99],gold:150,inc:35,sect:'tang',sur:'당',f:{poisonwise:1},region:'sichuan',it:['gdart'],bag:{antidote:2}},
  {id:'fisher',n:'어부',d:'그물과 배가 전 재산이다. 물때를 먼저 배운다.',w:[5,5],pct:[6,38],gold:4,inc:8,regions:['jiangnan','zhejiang','hunan','hubei','jiangxi','fujian','guangdong','hainan','shandong'],tier:0,ws:'field',wn:'그물을 던진다'},
  {id:'slave',n:'노비',d:'남의 집 종으로 태어났다. 이름도 주인이 지었다.',w:[4,3.5],pct:[0,5],gold:0,inc:2,tier:0,ws:'field',wn:'주인집 일을 한다'},
  {id:'soldier',n:'군졸 집안',d:'아버지는 변방을 지키는 군졸이다. 창 자루를 장난감 삼아 자랐다.',w:[2.5,2.5],pct:[18,50],gold:8,inc:10,st:{body:1},it:['bsaber'],tier:1,ws:'office',wn:'병영 일을 거든다'},
  {id:'hill',n:'산족',d:'화전을 일구고 독초를 가려 먹으며 자란다.',w:[2,2],pct:[3,30],gold:2,inc:6,regions:['guizhou','nanman','yunnan','guangxi'],tier:0,ws:'forest',wn:'화전을 일군다',hn:'산족 마을'},
  {id:'gaebang',n:'개방 거지',d:'개방 분타의 거적 위에서 태어났다. 동냥 그릇이 첫 장난감이다.',w:[1.5,1.2],pct:[0,6],gold:0,inc:4,hint:'beggar',tier:0,ws:'market',wn:'동냥을 한다',hn:'개방 분타 골목'},
  {id:'nomad',n:'유목민',d:'천막에서 태어나 말 위에서 자란다.',w:[1.2,1.2],pct:[10,45],gold:6,inc:8,st:{body:1},regions:['mongol','xinjiang'],tier:1,ws:'field',wn:'양 떼를 몬다',hn:'초원 천막촌'},
  {id:'gisaeng',n:'기루',d:'기루 뒷방에서 태어났다. 아버지가 누구인지는 아무도 모른다.',w:[1,1],pct:[5,35],gold:3,inc:8,st:{charm:1},nofather:1,as:'기루',tier:1,ws:'inn',wn:'기루의 잔심부름을 한다'},
  {id:'retainer',n:'세가의 가솔',d:'세가의 담장 안에서 태어났지만 성은 다르다. 주인집 아이들의 목검을 닦으며 자랐다.',w:[1,1.2],pct:[20,50],gold:8,inc:10,regions:['anhui','sichuan','hubei','hebei','jiangnan'],tier:1,ws:'office',wn:'장원의 일을 거든다'},
  {id:'suchae',n:'수로채',d:'동정호 갈대밭의 수적 소굴에서 태어났다. 걸음마보다 헤엄을 먼저 배웠다.',w:[.8,.7],pct:[10,40],gold:10,inc:10,hint:'suchae',as:'수로채',ak:8,it:['bsaber'],region:'hunan',site:'suchae',tier:1,ws:'field',wn:'뱃길을 지킨다',hn:'수채 아랫마을'},
  {id:'thief',n:'하오문',d:'소매치기와 야바위꾼의 골목에서 자랐다. 눈치가 밥이다.',w:[.8,.8],pct:[5,30],gold:4,inc:9,hint:'haomun',ak:3,tier:0,ws:'market',wn:'골목 일을 돕는다'},
  {id:'demonc',n:'천마신교 교도',d:'십만대산 깊은 곳, 교의 마을에서 태어났다. 바깥세상은 모두 적이라고 배운다.',w:[.5,.5],pct:[15,55],gold:10,inc:10,sect:'demon',sart:['혈수공',9,'장'],ak:5,region:'guangxi',site:'cheonma',tier:1,ws:'dojo',wn:'교의 잔일을 거든다',hn:'천마신교 교도촌'},
  {id:'zhugec',n:'제갈세가',d:'병서와 진법 그림이 그림책이었다. 가문은 머리로 강호를 건넌다.',w:[.3,.4],pct:[90,99.5],gold:260,inc:42,sect:'zhuge',sur:'제갈',st:{wit:1},region:'hubei',site:'zhuge',it:['isword'],tier:3,ws:'home',wn:'가문의 일을 거든다',hn:'제갈세가 장원'},
  {id:'paengc',n:'하북팽가',d:'돌잡이로 도를 잡았다. 팽가의 아이는 우는 소리도 크다.',w:[.3,.4],pct:[90,99.5],gold:260,inc:42,sect:'paeng',sur:'팽',st:{body:1},region:'hebei',site:'paeng',it:['bsaber','lvest'],tier:3,ws:'home',wn:'가문의 일을 거든다',hn:'하북팽가 장원'},
  {id:'moyongc',n:'모용세가',d:'호숫가 장원에서 태어났다. 가문은 옛 영화를 잊지 않는다.',w:[.3,.4],pct:[90,99.5],gold:280,inc:44,sect:'moyong',sur:'모용',region:'jiangnan',site:'moyong',it:['isword','lvest'],tier:3,ws:'home',wn:'가문의 일을 거든다',hn:'모용세가 장원'},
  {id:'jinyi',n:'금의위',d:'아버지는 황제의 눈과 귀다. 집에 오는 손님은 모두 목소리를 낮춘다.',w:[.15,.2],pct:[80,97],gold:150,inc:38,art:['금의도법',8,'도'],it:['isword'],region:'hebei',site:'beijing',tier:3,ws:'office',wn:'관아의 심부름을 한다',hn:'북경 성 안'},
  {id:'hyeolc',n:'혈교 교도',d:'설산 아래 혈교의 사원에서 태어났다. 피 냄새가 향 냄새보다 익숙하다.',w:[.15,.15],pct:[15,60],gold:10,inc:10,sect:'hyeol',sart:['혈조공',9,'장'],ak:6,region:'xizang',site:'hyeol',tier:1,ws:'dojo',wn:'교의 잔일을 거든다',hn:'혈교 사원촌'},
  {id:'assassin',n:'살수문',d:'아버지의 직업을 물으면 안 된다는 것부터 배웠다.',w:[.1,.1],pct:[30,70],gold:40,inc:20,art:['무영살',10,'암기'],ak:10,it:['ldart'],tier:2,ws:'forest',wn:'아버지의 일을 돕는다'},
  {id:'demonhi',as:'천마신교 호법 집안',n:'천마신교 호법의 자식',d:'아버지는 교의 호법이다. 또래들은 눈을 마주치지 못한다.',w:[.06,.06],pct:[85,99],gold:200,inc:40,sect:'demon',ak:8,region:'guangxi',site:'cheonma',it:['lvest'],tier:3,ws:'dojo',wn:'교의 일을 거든다',hn:'천마신교 본산'},
  {id:'royal',as:'황실',n:'황족',d:'황실의 먼 종친으로 태어났다. 담장 밖을 본 적이 없다.',w:[.04,.04],pct:[99.6,99.99],gold:2000,inc:200,st:{wit:1},it:['jadep'],region:'hebei',site:'beijing',tier:3,ws:'office',wn:'궁의 예법을 익힌다',hn:'북경 성 안'},
  {id:'demonheir',as:'천마신교 교주의 집안',n:'천마신교 소교주',d:'천마신교 교주의 핏줄로 태어났다. 요람 옆에 호법이 선다.',w:[.04,.04],pct:[99.9,99.99],gold:3000,inc:300,sect:'demon',ak:10,region:'guangxi',site:'cheonma',it:['lvest'],tier:3,ws:'dojo',wn:'교의 일을 거든다',hn:'천마신교 본산'},
  {id:'blood',n:'자작농',d:'작지만 제 땅이 있다. 어머니는 가끔 서쪽 하늘을 오래 본다.',w:[.15,.15],pct:[25,55],gold:10,inc:10,f:{blood:1},hidden:'사실은 천마신교 교주의 핏줄'}
];
// 문파·새외 세력 안에서 태어나는 출신: [문파, 지역, 천하 지도의 장소, 비중, 이름, 설명, 더할 것]
const SECTBORN=[
  ['huashan','shaanxi','huashan',.12,'화산파 문도의 자식','화산 연화봉 아래, 매화 향 속에서 걸음마를 뗐다.'],
  ['wudang','hubei','wudang',.12,'무당파 속가의 자식','무당산 아래 속가 제자의 집에서 태어났다. 새벽마다 도관의 종소리를 들었다.'],
  ['zhongnan','shaanxi','zhongnan',.1,'종남파 문도의 자식','종남산 자락에서 태어났다. 어른들은 화산파 이야기만 나오면 입을 다문다.'],
  ['kunlun','qinghai','kunlun',.08,'곤륜파 문도의 자식','구름 위 곤륜산에서 태어났다. 중원은 이야기로만 들었다.'],
  ['jeomchang','yunnan','jeomchang',.08,'점창파 문도의 자식','점창산 아래 대리의 바람 속에서 자랐다.'],
  ['gongdong','gansu','gongdong',.08,'공동파 문도의 자식','공동산 아래, 서역 가는 낙타 방울 소리를 들으며 자랐다.'],
  ['qingcheng','sichuan','qingcheng',.1,'청성파 문도의 자식','청성산 솔바람 속에서 태어났다.'],
  ['taishan','shandong','taishan',.1,'태산파 문도의 자식','태산 돌계단을 놀이터 삼아 자랐다.'],
  ['hengshan_s','hunan','hengshan_s',.08,'형산파 문도의 자식','형산 자락에서 태어났다. 기러기 떼가 돌아오는 것을 보며 자랐다.'],
  ['hengshan_n','shanxi','hengshan_n',.08,'항산파 문도의 자식','북악 항산의 절벽 아래에서 태어났다.'],
  ['botao','zhejiang','botao',.06,'보타문 문도의 자식','바닷바람 부는 보타산에서 태어났다.'],
  ['yongho','jiangxi','yongho',.08,'용호산 도사의 자식','용호산 도관에서 부적 그리는 것을 보며 자랐다.'],
  ['hainan','hainan','hainanpa',.05,'해남파 문도의 자식','뱃길 끝 더운 섬에서 태어났다. 중원 사람은 본 적이 없다.'],
  ['jangbaek','liaodong','jangbaek',.06,'장백파 문도의 자식','장백산 눈보라 속에서 태어났다.'],
  ['tianshan','xinjiang','tianshan',.06,'천산파 문도의 자식','눈 덮인 천산에서 태어났다.'],
  ['odok','guizhou','odok',.08,'오독교 교도의 자식','독충 항아리 옆에서 자랐다. 물리지 않는 법을 먼저 배웠다.',{f:{poisonwise:1},ak:4,bag:{antidote:2}}],
  ['potala','xizang','potala',.06,'포달랍궁에 맡겨진 아이','설산의 사원에 맡겨졌다. 경전 읽는 소리가 자장가였다.',{orphan:1,pct:[5,40],gold:0,inc:4,as:'포달랍궁 사원'}],
  ['yasu','nanman','yasu',.08,'남만야수궁의 아이','밀림의 궁에서 태어났다. 첫 친구는 호랑이 새끼였다.',{st:{body:1},as:'남만야수궁'}],
  ['binggung','beihai','binggung',.06,'북해빙궁의 아이','얼음 궁전에서 태어났다. 봄이 무엇인지 모른다.',{pct:[70,97],gold:120,inc:30,as:'북해빙궁'}],
  ['shaolin','henan','shaolin',.12,'소림사에 버려진 아이','소림사 산문 앞에 강보에 싸여 버려졌다. 스님들이 번갈아 업어 키웠다.',{sex:'m',orphan:1,pct:[2,20],gold:0,inc:3,as:'소림사 산문 앞'}],
  ['emei','sichuan','emei',.1,'아미파 속가의 딸','아미산 아래 속가 제자의 집에서 태어났다. 어머니의 검이 벽에 걸려 있다.',{sex:'f'}]
];
for(const x of SECTBORN) FAM.push(Object.assign({id:'s_'+x[0],n:x[4],d:x[5],w:[x[3],x[3]*1.2],pct:[40,82],gold:30,inc:14,sect:x[0],region:x[1],site:x[2],tier:2,ws:'dojo',wn:'문파의 잔일을 거든다',hn:SECTS[x[0]].n+' 아랫마을',as:x[4].replace(/의 (자식|딸)$/,'')+' 집안'},x[6]||{}));
Object.assign(FAM.find(f=>f.id==='clan'),{site:'namgung',hn:'남궁세가 장원'}); Object.assign(FAM.find(f=>f.id==='tangc'),{site:'tang',hn:'사천당가 장원'}); Object.assign(FAM.find(f=>f.id==='bandit'),{hn:'산채 아랫마을'});
const famAs=o=>o.as||o.n+' 집안';
const homeName=()=>{ const o=m&&m.b&&FAM.find(f=>f.id===m.b.o); return (o&&o.hn)||'고향 마을'; };
const TRAITS=[
  {id:'cold',n:'천음절맥',d:'타고난 오성이 뛰어나지만, 스무 살을 넘기기 어려운 체질',st:{wit:3}},
  {id:'might',n:'천생신력',d:'어려서부터 장정 셋의 힘. 근골 +3, 무위 +6',st:{body:3}},
  {id:'immune',n:'만독불침',d:'어떤 독도 통하지 않는 몸. 독으로 건강이 깎이지 않는다'},
  {id:'bone',n:'무골',d:'무공이 남보다 빨리 몸에 붙는다'},
  {id:'blood',n:'혈마체',d:'마공과 이상하리만치 잘 맞는 몸. 마공을 익히면 수련이 빠르고 심마가 덜 쌓인다'},
  {id:'weak',n:'병약',d:'잔병이 잦고 명이 짧다. 근골 −2, 건강이 더디게 돌아온다',st:{body:-2}},
  {id:'star',n:'천운',d:'하늘이 유난히 돌보는 아이. 주사위가 8~20에서 나온다. 기연 +3, 낌새 읽기 +10%',st:{luck:3}}
];

/* ---------- 상태 ---------- */
let m=null, roll=null, paused=false, spd=0, acc=0, DUEL=null;
const setup={era:'any',basis:'births',pace:'normal'};
const PACE={fast:1500,normal:3000,slow:6000}, SPD=[1,2,4];
function stat3(){return cl(ri(1,4)+ri(1,4)+ri(0,2),1,10);}
function wpick(arr,wf){ const t=arr.reduce((a,x)=>a+wf(x),0); let r=R()*t; for(const x of arr){ r-=wf(x); if(r<=0) return x; } return arr[arr.length-1]; }
const regOf=id=>REGIONS.find(r=>r.id===id);
function makeBirth(era,basis,fid){
  const bi=basis==='births'?0:1;
  const fam=(fid&&FAM.find(f=>f.id===fid))||wpick(FAM,f=>f.w[bi]);
  const pool=fam.region?[regOf(fam.region)]:fam.regions?fam.regions.map(regOf):REGIONS, reg=wpick(pool,r=>r.w);
  const sumF=FAM.reduce((a,f)=>a+f.w[bi],0), sumR=pool.reduce((a,r)=>a+r.w,0);
  const P0=(fam.w[bi]/sumF)*(reg.w/sumR), S0=fam.sect&&SECTS[fam.sect];
  const sex=fam.sex||(S0&&S0.male?'m':S0&&S0.female?'f':R()<.5?'m':'f'), st={body:stat3(),wit:stat3(),luck:stat3(),charm:stat3()};
  for(const k in (fam.st||{})) st[k]=cl(st[k]+fam.st[k],1,10);
  let trait=null; if(R()<.15){ trait=pick(TRAITS); for(const k in (trait.st||{})) st[k]=cl(st[k]+trait.st[k],1,10); }
  const sur=fam.sur||pick(SURN), sib=ri(0,4);
  return {o:fam.id, reg:reg.id, era, sex, sur, given:gname(), st, trait:trait&&trait.id, P:P0,
    pct:+(fam.pct[0]+R()*(fam.pct[1]-fam.pct[0])).toFixed(1),
    father:{name:sur+gname(),age:ri(19,42),dead:!!(fam.orphan||fam.nofather)||R()<(era==='chaos'?.1:.04)}, mother:{name:pick(SURN)+gname(),age:ri(16,36),dead:!!fam.orphan||R()<.02}, sib, order:ri(1,sib+1)};
}
const OR=id=>FAM.find(x=>x.id===id), TR=id=>TRAITS.find(x=>x.id===id);
function fresh(b){
  const o=OR(b.o);
  const s={b, era:b.era, name:b.sur+b.given, sex:b.sex, age:0, hp:cl(82+ri(-8,8)+(b.trait==='weak'?-20:0)+(b.trait==='might'?8:0)), joy:62, bond:55, exp:0, lv:0, ng:0, gold:o.gold, hy:0, ak:o.ak||0, fame:0, sect:null, arts:[], rels:[], f:{...(o.f||{})}, log:[], q:[], used:{}, phase:'play', sim:0, kids:0, disc:0, sib:b.sib, scene:'village', alias:null, focus:null, answers:{}, auto:false,
    inv:{w:null,a:null,h:null,f:null,c:null,stash:[],bag:{salve:0,pill:0,antidote:0,...(o.bag||{})},mat:0}, wins:0, losses:0, kills:0, spared:[], ep:{}};
  s.per={협:ri(-15,15)+(o.id==='bandit'?-12:0),담:ri(-15,15),정:ri(-15,15)};
  if(b.trait==='blood') s.f.bloodBody=1;
  if(o.art){ s.arts.push({n:o.art[0],p:o.art[1],k:o.art[2]}); s.f.martial=1; s.exp=3; }
  if(o.sect){ s.sect=o.sect; const S=SECTS[o.sect], A=o.sart||S.art; s.arts.push({n:A[0],p:A[1],k:A[2]}); if(S.inner) s.arts.push({n:S.inner[0],p:0,k:'내공',ng:S.inner[1]}); s.f.martial=1; s.exp=4; }
  (o.it||[]).forEach(id=>{ const it=ITEMS[id]; if(!s.inv[it.s]) s.inv[it.s]=id; else s.inv.stash.push(id); });
  s.rels.push({role:'아버지',name:b.father.name,v:70,dead:b.father.dead?1:0,age0:b.father.age,sx:'m'},{role:'어머니',name:b.mother.name,v:75,dead:b.mother.dead?1:0,age0:b.mother.age,sx:'f'});
  return s;
}
const ST=k=>m.b.st[k]+eqSt(k);
const bump=(k,n)=>{ m.b.st[k]=cl(m.b.st[k]+(n||1),1,10); };
const hasT=t=>m.b.trait===t;
const bestArt=()=>m.arts.filter(a=>a.k!=='내공'&&a.k!=='보법'&&a.k!=='안법'&&a.k!=='외공').reduce((a,b)=>b.p>(a?a.p:-1)?b:a,null)||m.arts.filter(a=>a.k==='보법')[0]||m.arts.filter(a=>a.k==='안법')[0]||null;
// 철 수를 사람이 쓰는 말로: 1 석 달, 2 반년, 3 아홉 달, 4 1년, 5 1년 3개월, 6 1년 반 …
const seaStr=n=>{ n=Math.max(1,Math.round(n)); const y=Math.floor(n/4), r=n%4; return y?(r===0?`${y}년`:r===2?`${y}년 반`:`${y}년 ${r*3}개월`):['','석 달','반년','아홉 달'][r]; };
const ngStr=n=>{n=Math.round(n); if(n<60) return `${n}년`; const g=Math.floor(n/60), r=n%60; return `${g}갑자${r?` ${r}년`:''}`;};
function log(t,big){ m.log.push({a:m.age,t,big:!!big}); }
function addExp(n){ if(!m.f.martial) return; m.exp=Math.max(0,m.exp+n); }
function learn(n,p,k,ng){ if(m.arts.some(a=>a.n===n)) return false; m.arts.push({n,p,k,ng}); m.f.martial=1; if(ng) m.ng+=ng; if(k==='마공') m.f.magong=1; if(m.inv) equipBest(); vfx(()=>artToast(n,p,k,ng)); return true; }
const SEXROLE={사형:'m',사저:'f',사매:'f',사제:'m',아버지:'m',어머니:'f'};
function rel(role,name,v,o){ const r=Object.assign({role,name:name||(pick(SURN)+gname()),v:v==null?60:v,a0:m.age},o||{}); if(!r.sx) r.sx=SEXROLE[role]||(role==='배우자'||role==='정인'?(m.sex==='m'?'f':'m'):(seedOf(r.name)%2?'m':'f')); m.rels.push(r); return r; }
const relOf=role=>m.rels.find(r=>r.role===role&&!r.dead);
function gold(n){ m.gold=Math.max(0,Math.round(m.gold+n)); }
function hurt(n,cause){ m.hp=cl(m.hp-n); if(m.hp<=0) m.deathCause=cause||'깊은 상처'; }
function side(){ const d=m.hy-m.ak; return d>=15?'정':d<=-15?'사':'중'; }
function prob(p){ return R()<cl(p,.03,.97); }
const PCT=[[0,2],[3,8],[8,18],[15,30],[30,45],[60,60],[120,75],[250,88],[500,95],[1200,99]];
function pctOf(g){ for(let i=1;i<PCT.length;i++){ if(g<=PCT[i][0]){ const [a,pa]=PCT[i-1],[b,pb]=PCT[i]; return pa+(pb-pa)*(g-a)/(b-a); } } return 99.5; }
const pctNow=()=>m.age<16?m.b.pct:pctOf(m.gold);
const topStr=p=>{ const t=100-p; return t<1?`상위 ${t.toFixed(1)}%`:t>=50?`하위 ${Math.max(1,Math.round(p))}%`:`상위 ${Math.round(t)}%`; };
const oneIn=P0=>{ const n=Math.round(1/P0); return n.toLocaleString('ko-KR'); };
const pctStr=P0=>{ const v=P0*100; return v>=1?v.toFixed(1):v>=.1?v.toFixed(2):v.toFixed(3); };
function makeAlias(){
  const a=bestArt(), k=a?a.k:'권';
  const evil=m.ak>m.hy+10, hi=m.lv>=6;
  const Pf=evil?['혈영','흑풍','귀면','독안','적혈','음풍']:['청풍','일월','백운','태산','신룡','유성','설화','현천'];
  const S=({검:hi?'검성':'검협',도:hi?'도왕':'도객',권:hi?'권왕':'신권',장:hi?'장왕':'신장',암기:'비영',보법:'신투',안법:'신안',마공:hi?'마존':'마두'})[k]||'협객';
  const pre=m.alias?m.alias.slice(0,2):pick(Pf);
  return pre+(evil&&!/마/.test(S)?'마'+S.slice(-1):S);
}
// 화면 연출은 장면이 정해진 뒤에 한꺼번에 내보낸다 (머릿속 시뮬레이션에서는 무시)
const VQ=[];
function vfx(fn){ if(m&&!m.headless) VQ.push(fn); }
function flushVfx(){ while(VQ.length){ try{ VQ.shift()(); }catch(e){} } }

/* ---------- 소리 (기본은 꺼짐) ---------- */
let SND=!!lsGet('murim_snd'), AC=null;
function sfx(k){ if(!SND||(m&&m.headless)) return; try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); const t=AC.currentTime;
  const tone=(f,d,type,v,f2,dl)=>{ const o=AC.createOscillator(), g=AC.createGain(), s=t+(dl||0); o.type=type||'square'; o.frequency.setValueAtTime(f,s); if(f2) o.frequency.exponentialRampToValueAtTime(f2,s+d); g.gain.setValueAtTime(v||.05,s); g.gain.exponentialRampToValueAtTime(.0001,s+d); o.connect(g); g.connect(AC.destination); o.start(s); o.stop(s+d+.02); };
  const noise=(d,v,hp)=>{ const n=Math.floor(AC.sampleRate*d), b=AC.createBuffer(1,n,AC.sampleRate), ch=b.getChannelData(0); for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n); const s=AC.createBufferSource(), g=AC.createGain(), f=AC.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp||1200; s.buffer=b; g.gain.value=v||.08; s.connect(f); f.connect(g); g.connect(AC.destination); s.start(t); };
  switch(k){
    case 'dice': for(let i=0;i<5;i++) tone(500+i*90,.03,'square',.03,null,i*.06); break;
    case 'ok': tone(660,.09,'square',.05); tone(990,.14,'square',.05,null,.09); break;
    case 'fail': tone(300,.12,'sawtooth',.05,180); tone(170,.2,'sawtooth',.05,110,.12); break;
    case 'slash': noise(.14,.09,2500); break;
    case 'hit': tone(150,.12,'square',.08,60); noise(.08,.06,600); break;
    case 'block': tone(1400,.06,'triangle',.07,900); tone(2100,.1,'triangle',.04,1600,.02); break;
    case 'clash': tone(1800,.08,'triangle',.07,1100); noise(.1,.07,3000); break;
    case 'ult': tone(220,.4,'sawtooth',.06,880); noise(.35,.06,1800); break;
    case 'get': [660,880,1320].forEach((f,i)=>tone(f,.12,'square',.045,null,i*.08)); break;
    case 'giyeon': [523,659,784,1047,1319].forEach((f,i)=>tone(f,.22,'triangle',.05,null,i*.09)); break;
    case 'art3': [523,659,784,1047,1319].forEach((f,i)=>tone(f,.24,'triangle',.05,null,i*.08)); tone(1568,.5,'sine',.035,null,.42); break;
    case 'art4': [392,523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.26,'triangle',.055,null,i*.075)); tone(196,.9,'sine',.08,180); [2093,1568,2093].forEach((f,i)=>tone(f,.3,'sine',.03,null,.6+i*.12)); break;
    case 'art5': tone(98,1.6,'sine',.12,92); tone(196,1.2,'sine',.07,190); noise(.5,.05,2400); [392,523,659,784,1047,1319,1568,2093].forEach((f,i)=>tone(f,.3,'triangle',.06,null,.35+i*.07)); [2093,2637,3136,2637,3136].forEach((f,i)=>tone(f,.4,'sine',.03,null,1.05+i*.13)); tone(1047,1.2,'triangle',.04,null,1.7); break;
    case 'lv': [392,523,659,784].forEach((f,i)=>tone(f,.16,'square',.045,null,i*.1)); break;
    case 'death': tone(110,1.2,'sine',.12,70); tone(165,1.2,'sine',.05,100,.02); break;
    case 'gong': tone(196,.9,'sine',.1,180); tone(392,.5,'triangle',.03,380); break;
  } }catch(e){} }
