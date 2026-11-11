/* ==== murim:episodes — 수련기 사이사이에 끼어드는 세 장면짜리 이야기 ==== */
const EP=id=>{ m.ep=m.ep||{}; return m.ep[id]=m.ep[id]||{}; };
const kidL=()=>LOOK.child({tool:'stick',robe:'#8f9a7a'});
function raidFate(saved){ const e=EP('raid'); if(saved||e.warn||(e.scout&&R()<.7)||R()<.35) return null; const live=[0,1].filter(alive); if(!live.length) return null; const i=pick(live), x=mt(i); x.dead=1; e.dead=i; m.joy-=12; log(`${x.role} ${iga(x.name)} 습격의 밤에 죽었다`,true); return x; }
const raidCut=x=>()=>{ if(!x) return; const i=m.mates?m.mates.indexOf(x):-1; if(A('rb')&&A('m'+i)) npcFight('rb','m'+i,{winner:'a',kill:true,rounds:1}); };
const EPI_T={
  kid:{n:'산문 밖의 아이',beats:[
    {st:()=>Sg('temple',{props:[['rock',150,2]],cast:[N('kd',kidL(),166,{act:'tool',tag:'마을 아이'})]}),text:()=>'산문 밖 바위 뒤에서 마을 아이 하나가 연무장을 훔쳐보며 나뭇가지를 휘두른다.',ch:[
      {t:'몰래 기본기를 가르쳐 준다',go:()=>{ m.joy+=4; return {t:'아이 이름은 소두라고 했다. 해 질 녘마다 오겠다고 했다.',tone:'good',cut:()=>{ const h=A('hero'); if(h){ h.goto=144; h.pose0='point'; } emo('kd','star'); }}; }},
      {t:'규칙대로 쫓아낸다',go:()=>({t:'아이는 울면서 산을 내려갔다.',end:1,cut:()=>{ emo('kd','tear'); leave('kd',1); }})}]},
    {st:()=>Sg('temple',{time:'dusk',props:[['rock',150,2],['bush',170,{dy:14,front:1}]],cast:[N('kd',kidL(),166,{act:'tool',tag:'소두'})].concat(alive(0)?[mateN(0,24,{face:1,emote:'?',enter:'left',spd:.3})]:[]),hero:{x:140}}),text:()=>'소두가 오늘도 바위 뒤에 와 있다. 그런데 순찰 도는 사형이 이쪽으로 온다.',ch:[
      {t:'아이를 덤불에 숨긴다',p:()=>.45+ST('luck')*.04,go:ok=>{ if(ok) return {t:'숨을 죽였다. 사형은 그냥 지나갔다.',tone:'good',cut:()=>{ const k=A('kd'); if(k) k.hide=true; }}; m.train.rep-=10; EP('kid').caught=1; return {t:'들켰다. 사부 앞에 불려 갔다.',tone:'bad',cut:()=>{ emo('m0','!'); }}; }},
      {t:'사부에게 먼저 털어놓는다',go:()=>{ m.train.rep+=2; return '사부는 한참 말이 없다가 "기본기까지만이다"라고 했다.'; }}]},
    {st:()=>Sg('village',{wx:'petal',cast:[N('kd',kidL(),104,{act:'cheer',tag:'소두'})].concat(mob('vg',i=>folk(i),[126,146,164],{act:'cheer'}))}),text:()=>EP('kid').caught?'벌 받은 일도 잊혀 갈 무렵, 산 아래 마을에서 소식이 왔다.':'산 아래 마을에서 소식이 왔다.',ch:[
      {t:'소식을 듣는다',go:()=>{ m.fame+=4; m.joy+=8; return {t:'산적이 마을에 들이닥쳤을 때 소두가 배운 걸음으로 아이들을 데리고 산으로 피했다고 한다. 마을 사람들이 쌀 한 가마를 산문에 두고 갔다.',tone:'good',big:'몰래 가르친 마을 아이가 아이들을 구했다'}; }}]}]},
  book:{n:'사라진 비급',beats:[
    {st:()=>Sg('library',{cast:[N('el',LOOK.elder(),96,{tag:'장로',emote:'anger',pose:'point'})],hero:{x:62}}),text:()=>'비급각에서 비급 한 권이 사라졌다. 그날 밤 근처에 있었던 사람은 나뿐이다.',ch:[
      {t:'결백을 주장한다',p:()=>.35+cl(m.train.rep)/200,go:ok=>{ if(ok) return '장로가 일단은 믿어 주었다. 대신 사흘 안에 범인을 찾으라 했다.'; m.train.rep-=12; return {t:'아무도 믿어 주지 않았다. 등 뒤에서 수군거렸다.',tone:'bad'}; }},
      {t:'직접 찾아내겠다고 나선다',go:()=>'장로가 사흘을 주었다.'}]},
    {when:()=>alive(2),st:()=>Sg('library',{cast:[mateN(2,150,{emote:'...'}),N('sv',LOOK.blackclad({weapon:null}),170,{alpha:.7})],hero:{x:40}}),text:()=>`밤중에 ${iga(mt(2).name)} 비급각 뒤에서 누군가와 속삭이는 것을 보았다.`,ch:[
      {t:'그 자리에서 추궁한다',duel:()=>({foe:{name:mt(2).name,title:'맞수',look:mateLook(2),pow:Math.round(power()*.95),style:'sword'}}),go:ok=>{ if(ok){ EP('book').clue=1; return {t:'검을 쳐내고 보니 맞수는 결백했다. 그도 낯선 잡역부를 쫓고 있었다.',tone:'good'}; } mt(2).v-=12; return {t:'오해였다. 맞수와 주먹다짐만 했다.',tone:'bad'}; }},
      {t:'조용히 미행한다',p:()=>.4+ST('wit')*.04,go:ok=>{ if(ok){ EP('book').clue=1; mt(2).v+=8; return {t:'맞수도 범인을 쫓고 있었다. 새로 들어온 잡역부였다.',tone:'good'}; } return '놓쳤다.'; }}]},
    {st:()=>Sg('temple',{time:'night',cast:[N('spy',LOOK.blackclad({item:'book',weapon:null}),146,{pose:'carry',emote:'!',tag:'잡역부'})]}),text:()=>EP('book').clue?'잡역부가 비급을 품고 담을 넘으려 한다. 녹림의 첩자였다.':'사흘째 밤, 담을 넘으려는 그림자가 보인다.',ch:[
      {t:'막아선다',duel:()=>({foe:{name:'녹림의 첩자',look:LOOK.blackclad(),pow:Math.round(power()*(EP('book').clue?.85:1.05)),style:'assassin',mercy:.85},lethal:1,cause:'첩자의 칼',noReturn:1,loot:{it:[['ldart',.5],['salve',.5]]}}),go:(ok,res)=>{ if(ok){ m.train.rep+=18; m.fame+=4; addExp(4); return {t:'첩자를 쓰러뜨리고 비급을 되찾았다. 장로가 처음으로 내 이름을 불렀다.',tone:'good',big:'사라진 비급을 되찾아 누명을 벗었다'}; } m.train.rep-=6; return {t:res.dead?'칼이 생각보다 깊었다.':'칼에 베였다. 첩자는 달아났고 누명은 그대로 남았다.',tone:'bad'}; }},
      {t:'종을 쳐서 사람을 부른다',go:()=>{ m.train.rep+=6; return '사형들이 몰려와 첩자를 잡았다. 공은 나눠 가졌다.'; }}]}]},
  beast:{n:'다친 새끼 범',beats:[
    {st:()=>Sg('forest',{props:[['trap',112,{dy:9}]],cast:[N('cb',LOOK.cub(),116,{emote:'tear'})]}),text:()=>'뒷산 덫에 새끼 범 한 마리가 걸려 울고 있다.',ch:[
      {t:'덫을 풀고 돌봐 준다',p:()=>.6,go:ok=>{ if(ok) return {t:'할퀴고 물었지만 결국 품에서 잠들었다.',tone:'good',cut:()=>{ emo('cb','zzz'); const h=A('hero'); if(h){ h.goto=98; h.pose0='kneel'; } }}; hurt(12); return {t:'손등을 깊게 물렸다. 새끼는 숲으로 달아났다.',tone:'bad',end:1,cut:()=>{ leave('cb',1); }}; }},
      {t:'못 본 척한다',go:()=>({t:'울음소리가 밤새 들렸다.',end:1})}]},
    {st:()=>Sg('forest',{time:'dusk',cast:[N('cb',LOOK.tiger(),116,{pose:'sit',emote:'heart'})],hero:{x:74,look:heroLook({item:'bowl'}),pose:'carry'}}),text:()=>'몰래 먹이를 주던 새끼 범이 훌쩍 자랐다. 사부가 냄새를 맡은 눈치다.',ch:[
      {t:'산 깊은 곳에 놓아준다',go:()=>{ m.joy-=3; return {t:'몇 번이나 돌아보다 사라졌다.',cut:()=>{ const c=A('cb'); if(c){ c.pose='walk'; c.pose0='walk'; c.goto=W+30; c.emote=null; } }}; }},
      {t:'계속 몰래 키운다',p:()=>.4,go:ok=>{ if(ok) return '들키지 않았다. 범이 내 발소리를 알아듣는다.'; m.train.rep-=8; return {t:'들켰다. 범은 산으로 쫓겨났다.',tone:'bad'}; }}]},
    {gi:1,st:()=>Sg('temple',{time:'dawn',wx:'fog',cast:[N('tg',LOOK.tiger({item:'herb'}),124,{})],hero:{x:56}}),text:()=>'안개 낀 새벽, 큰 범 한 마리가 산문 앞에 무언가를 내려놓고 사라졌다.',ch:[
      {t:'다가가 본다',go:()=>{ const n=ri(10,25); m.ng+=n; return {t:`붉은 영지 한 뿌리였다. 먹고 나니 내공이 ${n}년 늘었다.`,tone:'good',big:'키워 준 범이 영지를 물어다 주었다',cut:()=>{ const c=A('tg'); if(c){ c.L=LOOK.tiger(); c.pose='walk'; c.pose0='walk'; c.face=1; c.goto=W+30; } }}; }}]}]},
  master:{n:'사부의 밤',beats:[
    {st:()=>Sg('mountain',{time:'night',cast:[N('sa',masterLook(),130,{pose:'kneel',emote:'sweat',tag:'사부'})],hero:{x:40}}),text:()=>'사부가 밤마다 혼자 뒷산으로 사라진다.',ch:[
      {t:'몰래 따라간다',p:()=>.35+ST('luck')*.04,go:ok=>{ if(ok){ EP('master').saw=1; return {t:'사부가 바위 앞에서 피를 토하고 있었다. 옛 상처가 도진 모양이다.',cut:()=>{ const a=A('sa'); if(a) blood(a.x+4,a.y-10,1); }}; } m.train.rep-=6; return {t:'금세 들켰다. 사부가 말없이 꿀밤을 먹였다.',tone:'bad'}; }},
      {t:'모른 척한다',go:()=>'사부의 기침 소리가 점점 잦아졌다.'}]},
    {st:()=>Sg('temple',{cast:[N('sa',masterLook(),92,{tag:'사부',face:1})].concat(EP('master').saw?[]:[N('ws',LOOK.whitesword(),150,{tag:'백발 검객',pose:'point'})]),hero:{x:64}}),text:()=>EP('master').saw?'사부가 나를 불렀다. "봤으면 됐다. 내 사형이 이십 년 전에 남긴 상처다. 보름 뒤 그자가 온다."':'낯선 검객이 산문 앞에 와서 사부의 이름을 부른다. 보름 뒤에 다시 오겠단다.',ch:[
      {t:'사부 곁에서 함께 막겠다고 한다',go:()=>{ m.train.rep+=6; return {t:'사부가 처음으로 웃었다.',tone:'good',cut:()=>{ emo('sa','note'); }}; }},
      {t:'약을 구해 온다',when:()=>m.gold>=10,go:()=>{ gold(-10); EP('master').med=1; return '읍내 의원에게서 귀한 약재를 구해 왔다.'; }}]},
    {st:()=>Sg('temple',{time:'dusk',wx:'leaf',cast:[N('ws',LOOK.whitesword(),140,{pose:'guard',tag:'백발 검객',tagc:'foe'}),N('sa',masterLook(),38,{face:1,pose:'guard',tag:'사부'})]}),text:()=>'보름 뒤, 백발의 검객이 산문을 넘었다.',ch:[
      {t:'사부와 나란히 선다',s:'사부가 곁에서 거든다',duel:()=>({foe:{name:'백발 검객',look:LOOK.whitesword(),pow:Math.round(power()*1.4),style:'sword',mercy:.93,art:'낙영검'},lethal:1,cause:'사부의 원수',noMercy:1,noReturn:1,ally:{name:'사부',look:masterLook(),pow:EP('master').med?70:48}}),go:(ok,res)=>{ if(ok){ learn(`${m.sect?SECTS[m.sect].n.slice(0,2):'사부의'} 비전검`,18,'검'); m.train.rep+=12; return {t:'검객은 검을 거두고 사부에게 한 번 절한 뒤 떠났다. 그날 밤 사부는 아무에게도 보여 주지 않던 초식을 가르쳐 주었다.',tone:'good',big:'사부의 원수를 함께 막고 비전 초식을 받았다'}; } return {t:res.dead?'사부의 외침이 멀어졌다.':'검풍에 날아가 기절했다. 깨어 보니 검객은 떠났고 사부는 부쩍 늙어 있었다.',tone:'bad'}; }}]}]},
  granny:{n:'주방 할멈',beats:[
    {st:()=>Sg('kitchen',{cast:[N('gr',LOOK.granny({item:'buckets',extra:null}),112,{pose:'carry',tag:'주방 할멈',face:1})]}),text:()=>'주방 할멈이 물동이 둘을 지고 산길을 오른다. 발이 땅에 닿지 않는 것 같다.',ch:[
      {t:'짐을 대신 들어 준다',go:()=>{ EP('granny').kind=1; hurt(3); return {t:'할멈이 "기특하네" 하고 웃었다. 물동이가 생각보다 훨씬 무거웠다.',cut:()=>{ const h=A('hero'), g=A('gr'); if(h){ h.L=heroLook({item:'buckets'}); h.pose='carry'; } if(g){ g.L=LOOK.granny(); g.pose='idle'; g.emote='note'; } }}; }},
      {t:'걸음걸이를 유심히 본다',p:()=>.3+ST('wit')*.05,go:ok=>{ if(ok){ EP('granny').saw=1; return {t:'발끝이 아니라 바람을 밟고 있었다.',cut:()=>{ const g=A('gr'); if(g){ g.act='float'; g.auraC='#cfe8fa'; } emo('hero','!'); }}; } return '그냥 잘 걷는 할멈이었다.'; }}]},
    {st:()=>Sg('kitchen',{time:'night',cast:[N('gr',LOOK.granny(),118,{tag:'주방 할멈',emote:'...'})]}),text:()=>'밤에 부엌 앞을 지나는데 할멈이 혼잣말을 한다. "요즘 애들은 걸음이 무거워."',ch:[
      {t:'걸음을 가르쳐 달라고 조른다',p:()=>.25+(EP('granny').kind?.3:0)+(EP('granny').saw?.2:0),go:ok=>{ if(ok) return {t:'할멈이 국자로 내 정강이를 때렸다. "내일 새벽 장작더미 앞으로 와."',tone:'good'}; return {t:'"설거지나 해."',end:1}; }},
      {t:'인사만 하고 지나간다',go:()=>({t:'할멈이 등 뒤에서 혀를 찼다.',end:1})}]},
    {gi:1,st:()=>Sg('kitchen',{time:'dawn',props:[['woodpile',52,{dy:8}]],cast:[N('gr',LOOK.granny(),118,{tag:'주방 할멈'})],hero:{x:62,dy:-9}}),text:()=>'석 달 동안 새벽마다 장작더미 위를 걸었다. 마지막 날 할멈이 장작 하나를 걷어찼다.',ch:[
      {t:'떨어지는 장작을 밟고 선다',p:()=>.45+ST('body')*.04,go:ok=>{ if(ok){ learn('유운보',12,'보법'); addExp(5); return {t:'장작이 땅에 닿기 전에 세 번을 밟았다. 할멈은 "이제 됐다"며 부엌으로 들어갔고, 그 뒤로 아무것도 모르는 척했다.',tone:'good',big:'주방 할멈에게 유운보를 배웠다',cut:()=>{ const h=A('hero'); if(h){ h.act='float'; h.auraC='#cfe8fa'; } }}; } addExp(2); return {t:'굴러떨어졌다. 할멈은 "그래도 반은 했다"고 했다.',cut:()=>{ setPose('hero','down'); const h=A('hero'); if(h) h.y=FY; }}; }}]}]},
  letter:{n:'집에서 온 편지',beats:[
    {when:()=>alive(1),st:()=>Sg('mountain',{time:'dusk',cast:[mateN(1,104,{pose:'cry',emote:'tear'})]}),text:()=>`${iga(mt(1).name)} 편지를 쥐고 뒷산에서 울고 있다.`,ch:[
      {t:'곁에 앉아 묻는다',go:()=>{ mt(1).v+=6; return {t:'집안 빚 때문에 부잣집 노인에게 혼인시키겠다는 편지였다.',cut:()=>{ const h=A('hero'); if(h){ h.goto=88; h.pose0='sit'; } }}; }},
      {t:'자리를 피해 준다',go:()=>({t:'다음 날 눈이 퉁퉁 부어 있었다.',end:1})}]},
    {when:()=>alive(1),st:()=>yard({time:'night',cast:[N('m1',mateLook(1,{extra:'pack'}),110,{tag:mt(1).name,emote:'...'})]}),text:()=>`빚은 은자 40냥이다. ${iga(mt(1).name)} 몰래 하산할 생각을 한다.`,ch:[
      {t:'내 은자를 보탠다',when:()=>m.gold>=15,go:()=>{ const g=Math.min(m.gold,40); gold(-g); mt(1).v+=g>=40?20:10; return {t:`${g}냥을 쥐여 주었다. 한참을 말없이 쳐다봤다.`,tone:'good',cut:()=>{ emo('m1','heart'); }}; }},
      {t:'같이 하산해 담판을 짓는다',p:()=>.35+ST('charm')*.04,go:ok=>{ m.train.rep-=8; if(ok){ mt(1).v+=18; return {t:'중매쟁이 앞에서 문파 이름을 댔다. 혼담이 깨졌다.',tone:'good'}; } return {t:'쫓겨났다. 산문에서도 벌을 받았다.',tone:'bad'}; }},
      {t:'사부에게 도움을 청한다',go:()=>{ m.train.rep+=2; mt(1).v+=6; return '사부가 편지 한 장을 써 주었다.'; }}]},
    {when:()=>alive(1),st:()=>yard({wx:'petal',cast:[N('m1',mateLook(1,{item:'letter'}),150,{tag:mt(1).name,pose:'carry',emote:'note',enter:'right',spd:1.2})]}),text:()=>`${iga(mt(1).name)} 집에서 온 두 번째 편지를 들고 뛰어왔다.`,ch:[
      {t:'편지를 같이 읽는다',go:()=>{ m.joy+=8; mt(1).v+=8; return {t:'혼담이 없던 일이 되었다고 한다. 그날 처음으로 손을 잡았다.',tone:'good',big:`${mt(1).name}의 혼담을 막아 주었다`,cut:()=>{ emo('m1','heart'); emo('hero','heart'); }}; }}]}]},
  rival:{n:'맞수의 밤',beats:[
    {when:()=>alive(2),st:()=>yard({time:'dawn',cast:[mateN(2,104,{pose:'kneel',emote:'sweat'})]}),text:()=>`새벽, ${iga(mt(2).name)} 아무도 없는 연무장에서 혼자 검을 휘두르다 피를 토한다.`,ch:[
      {t:'다가가 부축한다',go:()=>{ mt(2).v+=10; return {t:'"보지 마." 그래도 손을 뿌리치지는 않았다.',cut:()=>{ const h=A('hero'); if(h){ h.goto=90; } }}; }},
      {t:'못 본 척 돌아선다',go:()=>'다음 날 맞수는 아무렇지 않은 얼굴이었다.'}]},
    {when:()=>alive(2),st:()=>yard({time:'night',cast:[mateN(2,110,{pose:'sit',act:'meditate',auraC:'#ff5a3a'})]}),text:()=>`${mt(2).name}의 가문은 삼 년 전 멸문당했다고 한다. 원수를 갚으려 금지된 심법을 익히고 있다.`,ch:[
      {t:'비밀을 지켜 준다',go:()=>{ mt(2).v+=10; return {t:'맞수가 처음으로 고맙다는 말을 했다.',tone:'good'}; }},
      {t:'사부에게 알린다',go:()=>{ mt(2).v-=25; m.train.rep+=6; return {t:'맞수는 근신 처분을 받았다. 나를 보는 눈빛이 얼음 같았다.',tone:'bad'}; }}]},
    {when:()=>alive(2),st:()=>yard({time:'night',tint:'red',cast:[mateN(2,104,{pose:'kneel',act:'shiver',emote:'skull',auraC:'#ff5a3a'})]}),text:()=>`${mt(2).name}의 기혈이 거꾸로 돌기 시작했다. 주화입마 직전이다.`,ch:[
      {t:'내공을 불어넣어 막는다',p:()=>.3+m.ng/80,go:ok=>{ if(ok){ const x=mt(2); x.v=Math.max(x.v,80); x.rival=0; x.role='지기'; m.ng*=.85; return {t:'밤새 손바닥을 맞댔다. 새벽에 맞수가 눈을 떴다. 그날부터 맞수가 아니라 지기가 되었다.',tone:'good',big:`맞수 ${eul(x.name)} 주화입마에서 구했다`,cut:()=>{ if(SC) SC.tint=null; const a=A('m2'); if(a){ a.act=null; a.ax=0; a.emote='heart'; } }}; } hurt(25,'역류한 내공'); return {t:'둘 다 피를 토하고 쓰러졌다. 맞수는 살았지만 무공을 잃었다.',tone:'bad'}; }},
      {t:'사람을 부르러 뛴다',go:()=>{ mt(2).v+=5; return '장로들이 달려와 겨우 살렸다.'; }}]}]},
  raid:{n:'습격의 밤',beats:[
    {st:()=>Sg('temple',{time:'dawn',wx:'fog',hero:{x:120,emote:'?',pose:'kneel'}}),text:()=>'새벽에 담장 밖에서 낯선 발자국을 봤다. 여럿이고, 말발굽도 섞여 있다.',ch:[
      {t:'사부에게 알린다',go:()=>{ EP('raid').warn=1; m.train.rep+=4; return '사부는 그날부터 밤 순찰을 두 배로 늘렸다.'; }},
      {t:'혼자 뒤를 밟는다',p:()=>.4+ST('luck')*.04,go:ok=>{ if(ok){ EP('raid').scout=1; m.fame+=1; return {t:'산 아래 폐가에 녹림도 스물이 모여 있었다. 칼을 갈고 있었다.',tone:'good'}; } hurt(8); return {t:'비탈에서 굴러 발목을 삐었다. 아무것도 보지 못했다.',tone:'bad'}; }},
      {t:'대수롭지 않게 넘긴다',go:()=>'나무꾼들이겠거니 했다.'}]},
    {st:()=>yard({time:'night',tint:'red',wx:'ember',props:[['fire',150,{s:2}],['fire',20,{dy:6}]],cast:[N('rb',LOOK.bandit(),128,{pose:'guard',tag:'녹림도'}),N('rc',LOOK.chief(),170,{pose:'guard',tag:'두목'})].concat(alive(1)?[mateN(1,108,{act:'shiver',emote:'sweat',face:1})]:[]).concat(alive(0)?[mateN(0,90,{face:1,pose:'guard'})]:[]),hero:{x:40}}),
      text:()=>`한밤중에 종이 울렸다. 녹림도가 담을 넘었다. 불화살이 비급각 지붕에 꽂힌다.${alive(1)?` 연무장 쪽에서 ${mt(1).name}의 비명이 들린다.`:''}`,ch:[
      {t:'동문을 구하러 뛰어든다',duel:()=>({foe:{name:'녹림도',look:LOOK.bandit(),pow:Math.round(power()*.85),style:'bandit',mercy:.8},lethal:1,cause:'습격의 밤',noReturn:1,loot:{g:[3,12],it:[['bsaber',.3],['salve',.4]]},extras:alive(1)?[N('m1',mateLook(1),20,{face:1,act:'shiver'})]:[]}),go:(ok,res)=>{ if(ok){ [0,1].filter(alive).forEach(i=>mt(i).v+=15); m.train.rep+=10; EP('raid').won=1; raidFate(true); return {t:'녹림도를 쓰러뜨리고 동문들을 등 뒤에 세웠다. 날이 밝을 때까지 그 자리를 지켰다.',tone:'good'}; } const x=res.dead?null:raidFate(false); return {t:res.dead?'불빛 속에서 칼이 내려왔다.':x?`쓰러진 내 앞에서 ${iga(x.name)} 칼을 맞았다.`:'쓰러졌지만 사형들이 달려와 겨우 막았다.',tone:'bad'}; }},
      {t:'두목을 막아선다',s:'가장 센 놈이다',duel:()=>({foe:{name:'녹림 두목',look:LOOK.chief(),pow:Math.round(power()*1.15),style:'bandit',mercy:.75,art:'녹림도법'},lethal:1,cause:'습격의 밤',noReturn:1,loot:{g:[10,30],it:[[wOf(1),.4],['lvest',.4]]}}),go:(ok,res)=>{ const x=res.dead?null:raidFate(false); if(ok){ m.fame+=6; m.train.rep+=18; EP('raid').won=1; return {t:`두목이 쓰러지자 녹림도들은 담을 넘어 달아났다.${x?` 하지만 그사이 ${iga(x.name)} 쓰러져 있었다.`:''}`,tone:x?'bad':'good',big:'수련기에 산채 두목을 꺾었다'}; } return {t:res.dead?'두목의 칼은 무거웠다.':x?`두목에게 밀려 쓰러졌다. 눈을 떴을 때 ${eun(x.name)} 숨을 쉬지 않았다.`:'두목에게 밀려 쓰러졌다. 사부가 뒤늦게 달려와 놈들을 쫓았다.',tone:'bad'}; }},
      {t:'비급각의 불을 끈다',p:()=>.5+ST('body')*.04,go:ok=>{ const x=raidFate(false); if(ok){ m.train.rep+=15; return {t:`물동이를 지고 지붕에 올랐다. 비급각은 지켰다.${x?` 하지만 그사이 ${iga(x.name)} 칼을 맞았다.`:''}`,tone:x?'bad':'good',cut:raidCut(x)}; } hurt(12,'습격의 밤'); return {t:`불길에 손을 데었다. 비급각 절반이 탔다.${x?` ${eun(x.name)} 그 밤을 넘기지 못했다.`:''}`,tone:'bad',cut:raidCut(x)}; }}]},
    {st:()=>{ const d=EP('raid').dead; return d!=null?Sg('grave',{wx:'rain',cast:[0,1,2].filter(alive).map((i,k)=>mateN(i,150+k*14,{pose:'kneel'})).concat([N('sa',masterLook(),98,{tag:'사부',face:1})]),hero:{x:112,pose:'kneel'}}):yard({time:'night',props:[['table',100,{dy:8}],['fire',60,{dy:10}]],cast:[N('sa',masterLook({item:'gourd'}),118,{pose:'drink',tag:'사부'})].concat([0,1,2].filter(alive).map((i,k)=>mateN(i,140+k*14,{act:'cheer'})))}); },
      text:()=>{ const d=EP('raid').dead; return d!=null?`${mt(d).name}의 무덤 앞에 사형제들이 모였다. 비가 온다.`:'습격을 막아낸 날 밤, 사부가 아껴 둔 술독을 열었다.'; },ch:()=>EP('raid').dead!=null?[
      {t:'무덤 앞에서 검을 뽑아 맹세한다',go:()=>{ addExp(6); m.per.담=cl((m.per.담||0)+6,-100,100); return {t:'다시는 내 앞에서 누구도 잃지 않겠다고 했다. 그날부터 새벽 수련을 하루도 거르지 않았다.',big:'동문의 무덤 앞에서 맹세했다',cut:()=>{ setPose('hero','guard'); }}; }},
      {t:'말없이 술을 따른다',go:()=>{ m.bond+=6; return '술이 흙에 스며드는 것을 오래 보았다.'; }}]:[
      {t:'술잔을 받는다',go:()=>{ m.joy+=10; [0,1,2].filter(alive).forEach(i=>mt(i).v+=5); give('salve',{n:2}); return {t:'사부가 금창약 두 통을 던져 주었다. "다음에는 덜 다쳐라."',tone:'good',cut:()=>{ setPose('hero','drink'); }}; }}]}]},
  oldsword:{n:'녹슨 검',beats:[
    {st:()=>Sg('hall',{name:'병기고',noProps:1,props:[['rack',40,{dy:6}],['rack',150,{dy:6}],['chest',110,{dy:8}],['lantern',100,{dy:-76}]],hero:{x:84,emote:'?'}}),text:()=>'병기고 구석, 먼지 쌓인 궤짝 밑에서 녹슨 검 한 자루를 찾았다. 아무도 주인을 모른다.',ch:[
      {t:'몰래 가져와 닦는다',go:()=>{ EP('oldsword').kept=1; return {t:'이불 속에 숨겨 두었다. 녹 냄새가 났다.',cut:()=>{ const h=A('hero'); if(h){ h.L=heroLook({item:'sword'}); h.pose='carry'; } }}; }},
      {t:'사부에게 가져간다',go:()=>{ EP('oldsword').told=1; m.train.rep+=3; return '사부는 검을 받아 들고 한참 말이 없었다.'; }},
      {t:'그 자리에 둔다',go:()=>({t:'궤짝을 도로 덮었다.',end:1})}]},
    {st:()=>yard({time:'night',cast:[N('sa',masterLook(),104,{tag:'사부',emote:'...'})],hero:{x:66,look:heroLook({item:'sword'}),pose:'carry'}}),text:()=>EP('oldsword').told?'사부가 검을 내게 돌려주었다. "녹을 벗겨 봐라. 석 달은 걸릴 거다."':'밤마다 숫돌에 갈았더니 녹 아래에서 글자가 드러난다. 돌아보니 사부가 등 뒤에 서 있다.',ch:[
      {t:'석 달을 꼬박 닦는다',p:()=>.5+ST('wit')*.03,go:ok=>{ hurt(3); if(ok){ EP('oldsword').shine=1; return {t:'손이 다 헐었다. 검신에서 처음으로 달빛이 튕겼다.',tone:'good',cut:()=>{ spark('hero','#cfe8fa'); }}; } return '손만 베였다. 녹은 고집이 셌다.'; }},
      {t:'대장간에 맡긴다',when:()=>m.gold>=8,go:()=>{ gold(-8); EP('oldsword').shine=1; return '대장장이가 날을 보더니 삯을 깎아 주었다. "이런 쇠는 처음 보오."'; }}]},
    {gi:1,st:()=>yard({cast:[N('sa',masterLook(),108,{tag:'사부'})],hero:{x:66,look:heroLook({item:'sword'}),pose:'carry'}}),text:()=>EP('oldsword').shine?'마지막 녹이 벗겨지자 검신에 푸른 물결무늬가 드러났다. 사부가 숨을 삼켰다. 창립 조사가 쓰던 검이라고 한다.':'끝내 녹은 다 벗겨지지 않았다. 그래도 날은 섰다.',ch:()=>EP('oldsword').shine?[
      {t:'사문에 바친다',go:()=>{ m.train.rep+=20; m.fame+=4; addExp(6); m.f.standing=(m.f.standing||0)+1; return {t:'검은 조사전에 모셔졌다. 사부는 그날 밤 조사의 검결 한 대목을 일러 주었다.',tone:'good',big:'창립 조사의 검을 찾아 사문에 바쳤다'}; }},
      {t:'내가 쓰게 해 달라고 청한다',p:()=>.3+cl(m.train.rep)/200,go:ok=>{ if(ok){ give('psword'); return {t:'사부는 오래 생각하더니 고개를 끄덕였다. "검이 너를 골랐다."',tone:'good',big:'창립 조사의 검을 물려받았다'}; } m.train.rep-=5; give('gsword'); return {t:'"아직 네 것이 아니다." 사부는 대신 청강검 한 자루를 내주었다.'}; }}]:[
      {t:'허리에 찬다',go:()=>{ give('isword'); return '이름 없는 철검이지만, 내 손으로 살려 낸 검이다.'; }}]}]}
};
for(const id in EPI_T) EPI_T[id].beats.forEach((b,i)=>{ b.ep=id; b.bi=i; });
function scheduleEpisodes(T){
  const ids=Object.keys(EPI_T).sort(()=>R()-.5).slice(0,ST('luck')>=7?3:2);
  T.eps=ids; T.epq=[];
  ids.forEach((id,k)=>{ let t=ri(1,4)+k*2; EPI_T[id].beats.forEach((b,bi)=>{ T.epq.push({id,bi,turn:Math.min(17,t)}); t+=ri(2,4); }); });
  T.epq.sort((a,b)=>a.turn-b.turn||a.bi-b.bi);
}
