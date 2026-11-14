/* ==== 강호의 큰 적과 천하의 고수: 경지가 오른 뒤에 찾아오는 일 ====
   큰 적: 정파·무소속에게는 천마신교가, 마도에게는 무림맹이 서열대로 사람을 보낸다. 하나를 꺾으면 몇 해 뒤 그 윗사람이 오고, 끝에는 교주(맹주)가 직접 온다.
   상대의 힘은 내 무위에 비례한다(서열이 오를수록 0.85배 → 1.25배). 그래서 초절정이 되어도 두 대에 쓰러지는 대주만 오는 일은 없다.
   사람마다 이름이 있다. 꺾은 사람은 다시 쳐들어오지 않는다. 경지가 낮아 같은 서열이 다시 올 때도 다른 사람이 온다(살려 준 사람이 훗날 제자가 되어도 같은 얼굴이 산문을 넘지 않는다) */
const NEMLAD={
  마교:{org:'천마신교',r:[['마교 혈검대주','cultist',.85,'brute','혈영검'],['마교 흑풍대주','blackclad',.92,'assassin','흑풍장'],['마교 귀면호법','cultist',.98,'brute','귀면도'],['천마신교 좌호법','cultist',1.04,'assassin','혈영참'],['천마신교 대장로','cultist',1.1,'monk','혈하장'],['천마신교 부교주','cultist',1.16,'sword','흡성대법'],['천마신교 교주','cultist',1.25,'brute','천마신공']]},
  무림맹:{org:'무림맹',r:[['무림맹 선봉장','whitesword',.85,'sword','정의검'],['화산 검수대주','swordsman',.92,'sword','매화검'],['개방 장로','oldbeggar',.98,'brute','타구봉'],['무당 장로','whitesword',1.04,'sword','태극검'],['소림 나한당주','monk',1.1,'monk','나한권'],['무림맹 부맹주','whitesword',1.16,'sword','창궁검'],['무림맹주','master',1.25,'sword','천지검']]}};
const NEMFLOOR=[0,0,0,1,2,3,4,5,5];          // 경지마다 처음 오는 사람의 서열
const NEMCAP=[1,1,2,3,4,6,6,6,6];            // 경지마다 올 수 있는 가장 높은 서열. 교주(맹주)는 초절정부터
// 사문이 있으면 사문의 편을 따른다. 없으면 걸어온 길(마교 편에서 싸웠거나 악명이 높은 사파)을 본다
const nemSide=()=>m.sect&&SECTS[m.sect]?(SECTS[m.sect].side==='마'?'무림맹':'마교'):(m.f.demonHero||(side()==='사'&&m.ak>=60)?'무림맹':'마교');
function nem(){ return m.nem||(m.nem={t:0,nm:{},won:0}); }
const nemWant=()=>Math.max(nem().t,NEMFLOOR[m.lv]||0);          // 다음에 올 차례인 서열
function nemTier(){ return Math.min(6,NEMCAP[m.lv]||1,nemWant()); }
// 지금 서열의 상대. cap 을 주면 그 서열까지만(침공에는 교주가 직접 오지 않는다)
function nemFoe(cap){ const sd=nemSide(), L=NEMLAD[sd], t=Math.min(nemTier(),cap==null?6:cap), r=L.r[t], N=nem(), key=sd+t+':'+(N.won||0), name=N.nm[key]||(N.nm[key]=rname());
  const lk=(LOOK[r[1]]||LOOK.cultist)(t>=4?{beard:'long',hairC:'#bdb9b0'}:t>=2?{size:'big',beard:'short'}:{size:'big'});
  return {t,sd,title:r[0],name,foe:{name,title:r[0],look:lk,pow:Math.max(32+m.lv*8+ri(0,10),Math.round(power()*r[2])+ri(0,6)),style:r[3],mercy:t>=6?.3:.5,art:r[4]}}; }
function nemBeat(t){ const N=nem(); N.t=Math.max(N.t,t+1); N.won=(N.won||0)+1; N.last=m.age; }
function nemQueue(lo,hi){ if(m.f.nemDone||m.q.some(q=>q.id==='nemCome')) return; if(nemWant()>Math.min(5,NEMCAP[m.lv]||1)) return; m.q.push({id:'nemCome',age:m.age+ri(lo,hi)}); }
// 한 사건 동안 같은 상대를 쓴다
function nemCur(cap){ const c=m.nemC; if(c&&c.a===m.age&&c.cap===cap&&c.sd===nemSide()) return c; return m.nemC=Object.assign({a:m.age,cap},nemFoe(cap)); }
const nemPrize=t=>rndItem(pick(['w','a','h','f','c']),t>=6?5:t>=4?4:3);

E('nemCome',{min:18,max:95,rep:3,w:3,when:()=>m.f.martial&&m.lv>=4&&!m.f.nemDone&&nemWant()<=Math.min(5,NEMCAP[m.lv]||1)&&!m.train,
  st:()=>{ const c=nemCur(5); return Sg('road',{time:'dusk',cast:[N('nm',c.foe.look,128,{face:-1,pose:'guard',tag:c.title})].concat(mob('nf',()=>c.sd==='마교'?LOOK.cultist():LOOK.swordsman(),[156,172],{pose:'guard'})),hero:{x:74}}); },
  text:()=>{ const c=nemCur(5), N=nem(), first=!N.won;
    return c.sd==='마교'
      ?`${c.title} ${iga(c.name)} 직접 길을 막았다. ${first?'"요즘 강호에 네 이름이 시끄럽더구나. 교에서는 시끄러운 이름을 오래 두지 않는다."':'"아랫것들을 꺾었다는 자가 너냐. 교주께서 네 목을 궁금해하신다."'}`
      :`${c.title} ${iga(c.name)} 직접 찾아왔다. ${first?'"마도의 이름이 너무 높아졌다. 맹에서 더는 두고 볼 수 없다 하신다."':'"앞서 온 이들을 꺾었다 들었다. 이번에는 내가 왔다."'}`; },
  ch:()=>{ const c=nemCur(5); return [
    {t:'받아친다',s:`${c.title} · 지금까지 온 자들보다 세다`,duel:()=>({foe:c.foe,lethal:1,cause:`${c.title}의 손`}),
      go:(ok,res)=>{ if(ok){ nemBeat(c.t); m.fame+=6+c.t*2; if(c.sd==='마교') m.hy+=4; else m.ak+=4; addExp(gain()*.5); const it=nemPrize(c.t); if(it) give(it); nemQueue(2,4);
          const nx=nem().t>=6?(c.sd==='마교'?'다음에는 교주가 직접 온다는 소문이 돌았다.':'다음에는 맹주가 직접 온다는 소문이 돌았다.'):'윗사람이 가만있지 않을 것이다.';
          return {t:`${res.rounds}합 끝에 ${eul(c.name)} 꺾었다.${res.killed?' 칼을 거두지 않았다.':' 목숨은 살려 보냈다.'}${it?` 그가 지니고 있던 ${eul(ITEMS[it].n)} 얻었다.`:''} ${nx}`,big:`${c.title} ${eul(c.name)} 꺾었다`,tone:'good'}; }
        if(res.dead) return {t:`${c.name}의 일 초가 먼저 닿았다.`,tone:'bad'};
        m.fame-=3; nemQueue(3,5); return {t:res.fled?'틈을 보아 몸을 뺐다. 그는 쫓지 않았다. 다시 온다는 뜻이다.':`쓰러진 나를 내려다보고 ${c.name}${jo(c.name,'은','는')} 돌아섰다. "몇 해 더 익혀 두어라."`,tone:'bad'}; }},
    {t:'자리를 피한다',go:()=>{ m.fame-=4; nemQueue(2,3); return {t:'뒷길로 빠져나갔다. 그는 객잔 기둥에 칼자국 하나를 남기고 갔다. 다시 온다는 뜻이다.'}; }}]; }});

E('nemLord',{min:20,max:110,rep:6,w:9,grade:'SS',when:()=>m.f.martial&&m.lv>=5&&!m.f.nemDone&&nem().t>=6&&!m.train,
  st:()=>{ const c=nemCur(); return Sg('peak',{time:'dusk',wx:'ember',tint:c.sd==='마교'?'red':null,cast:[N('lord',c.foe.look,134,{face:-1,pose:'guard',tag:c.title})],hero:{x:78}}); },
  text:()=>{ const c=nemCur(); return c.sd==='마교'
    ?`하늘이 붉게 물든 저녁, 검은 가마 하나가 산을 올라왔다. 가마에서 내린 사람은 ${c.title} ${c.name}이었다. "내 호법과 장로들을 꺾은 자가 너구나. 천마가 직접 왔다. 영광으로 알아라."`
    :`해 질 녘, 흰 옷의 노인 하나가 홀로 산을 올라왔다. ${c.title} ${c.name}이었다. "맹의 기둥들이 그대 손에 꺾였다. 내가 마지막이다. 뽑아라."`; },
  ch:()=>{ const c=nemCur(); return [
    {t:c.sd==='마교'?'천마와 겨룬다':'맹주와 겨룬다',s:'여기서 이기면 강호가 한 세대 조용해진다',duel:()=>({foe:c.foe,lethal:1,cause:c.sd==='마교'?'천마의 장력':'맹주의 검',noReturn:1}),
      go:(ok,res)=>{ if(ok){ nemBeat(c.t); m.f.nemDone=m.age; m.f.nemSide=c.sd; m.fame+=50; if(c.sd==='마교') m.hy+=20; else m.ak+=20; addExp(gain()*2); const it=nemPrize(6); if(it) give(it);
          return {t:(c.sd==='마교'?`사흘 낮밤을 싸웠다. 마지막 일 초에 천마의 장력이 먼저 흩어졌다. ${res.killed?'천마는 선 채로 숨을 거두었다.':'천마는 무릎을 꿇지 않았다. 다만 등을 보이고 걸어 내려갔다.'} 검은 깃발들이 십만대산 쪽으로 물러갔다.`:`해가 지고 달이 질 때까지 싸웠다. 마지막 일 초에 맹주의 검이 부러졌다. ${res.killed?'맹주는 검 자루를 쥔 채 눈을 감았다.':'맹주는 부러진 검을 내려놓고 산을 내려갔다.'} 정파의 깃발이 강 건너로 물러갔다.`)+(it?` ${eul(ITEMS[it].n)} 얻었다.`:''),
            big:c.sd==='마교'?`천마신교 교주 ${eul(c.name)} 꺾었다. 강호가 한 세대 조용해졌다`:`무림맹주 ${eul(c.name)} 꺾었다. 정파가 한 세대 숨을 죽였다`,tone:'good'}; }
        if(res.dead) return {t:c.sd==='마교'?'천마의 장력이 하늘을 덮었다. 그 아래에 내가 있었다.':'맹주의 검이 한 번 울었다. 그것이 마지막으로 들은 소리였다.',tone:'bad'};
        m.fame-=5; return {t:c.sd==='마교'?'천마는 쓰러진 나를 내려다보았다. "몇 해를 주마. 그때도 이 정도면 죽이겠다."':'맹주는 검을 거두었다. "몇 해 뒤에 다시 오겠다. 그때는 거두지 않는다."',tone:'bad'}; }},
    {t:'몸을 숨긴다',go:()=>{ m.fame-=10; return {t:'산 뒤로 내려가 석 달을 숨었다. 강호가 수군거렸다. 그는 몇 해 뒤 다시 올 것이다.'}; }}]; }});

/* ---- 천하의 고수: 초절정부터, 이름난 고수들이 차례로 비무첩을 보낸다. 지지 않는 한 한 사람씩 넘어간다. 다 넘으면 천하제일 ---- */
const TOPS=[['검성','whitesword','sword','무극검',1.02],['도제','chief','brute','패왕도',1.07],['권왕','monk','monk','백보신권',1.12],['독왕','blackclad','assassin','만독수',1.16],['창신','soldier','brute','양가창',1.2],['천하제일인','master','sword','무상검',1.27]];
function topCur(){ const i=m.f.top||0, T=TOPS[i]; const c=m.topC; if(c&&c.i===i) return c; return m.topC={i,al:T[0],name:rname(),lk:(LOOK[T[1]]||LOOK.swordsman)(i>=3?{hairC:'#bdb9b0',beard:'long'}:{})}; }
E('topDuel',{min:22,max:110,rep:3,w:4,when:()=>m.f.martial&&m.lv>=5&&(m.f.top||0)<TOPS.length&&!m.train,
  st:()=>{ const c=topCur(); return Sg('peak',{time:'dawn',cast:[N('tp',c.lk,130,{face:-1,pose:'guard',tag:c.al+' '+c.name})],hero:{x:78}}); },
  text:()=>{ const c=topCur(), last=c.i===TOPS.length-1; return last
    ?`강호가 천하제일인이라 부르는 ${iga(c.name)} 비무첩을 보냈다. "검성도 도제도 그대에게 졌다 들었다. 이제 내 차례다. 산정에서 기다리겠다."`
    :`천하에 이름난 고수, ${c.al} ${iga(c.name)} 비무첩을 보냈다. "요즘 ${m.alias||m.name}의 이름이 내 귀에까지 온다. 한 수 겨뤄 보자."`; },
  ch:()=>{ const c=topCur(), T=TOPS[c.i], last=c.i===TOPS.length-1; return [
    {t:'비무를 받는다',s:'목숨을 걸지 않는 비무다',duel:()=>({foe:{name:c.name,title:c.al,look:c.lk,pow:Math.round(power()*T[4])+ri(0,6),style:T[2],mercy:1,art:T[3]}}),
      go:ok=>{ if(ok){ m.f.top=(m.f.top||0)+1; m.topC=null; m.fame+=8+c.i*2; addExp(gain()*(.6+c.i*.1)); if(last){ m.f.best=m.age; m.fame+=20; } else if(!m.q.some(q=>q.id==='topDuel')) m.q.push({id:'topDuel',age:m.age+ri(2,3)});      // 이기면 두세 해 뒤 다음 고수가 소문을 듣고 온다
          return {t:last?'천 합을 넘겼다. 마지막에 그가 먼저 검을 내렸다. "이제 그 이름은 그대 것이다." 강호가 나를 천하제일이라 부르기 시작했다.':`${c.al}의 ${eul(T[3])} 받아 냈다. 그는 웃으며 포권했다. "소문이 헛되지 않았군."`,big:last?'천하제일인을 꺾고 천하제일이 되었다':`${c.al} ${eul(c.name)} 비무에서 꺾었다`,tone:'good'}; }
        addExp(gain()*.3); return {t:`${c.al}의 벽은 높았다. 졌지만 그의 일 초 일 초가 눈에 남았다.`,tone:'bad'}; }},
    {t:'정중히 사양한다',go:()=>({t:'답장을 써 보냈다. 그는 "기다리겠다"고만 적어 보냈다.'})}]; }});

/* ---- 마도 입교: 천마신교와 혈교는 산문에서 피로 값을 치르고 들어간다(협행으로 이름난 사람에게는 문이 열리지 않는다) ---- */
function cultJoin(pre){ const k=worldSect(), S=SECTS[k]; joinSect(k); return {t:pre,big:`${S.n}에 입교했다`,tone:'good'}; }
E('wCult',{min:15,max:44,wld:1,when:()=>WGO&&!m.sect&&!!SECTS[worldSect()]&&SECTS[worldSect()].side==='마',
  st:()=>{ const S=SECTS[worldSect()]; return Sg('hall',{time:'night',tint:'red',name:S.n,cast:[N('gd',LOOK.cultist({size:'big',beard:'short'}),126,{face:-1,pose:'guard',tag:'수문 호법'})],hero:{x:70}}); },
  text:()=>{ const S=SECTS[worldSect()]; return `${S.n}의 문 앞에 섰다. 귀면을 쓴 호법이 내려다보았다. "제 발로 온 자는 둘 중 하나다. 미쳤거나, 갈 곳이 없거나. 교는 둘 다 받는다. 다만 값은 피로 치른다."`; },
  ch:()=>[
    {t:'소매를 걷어 핏줄을 보인다',s:'혈마체 · 시험 없이 받아 준다',when:()=>!!m.f.bloodBody,go:()=>cultJoin('호법의 눈이 커졌다. "혈마체… 백 년에 하나 나는 몸이다." 시험은 없었다. 그날로 교주 앞에 불려 갔다.')},
    {t:'피로 값을 치른다',s:'함께 온 지원자와 생사를 겨룬다',duel:()=>({foe:{name:rname(),title:'입교 지원자',look:LOOK.blackclad(),pow:Math.round(power()*.9)+ri(2,8),style:'assassin',mercy:.3,art:'무영자'},lethal:1,cause:'입교 시험',noReturn:1}),
      go:(ok,res)=>{ if(ok) return cultJoin(res.killed?'쓰러진 자의 피가 돌바닥에 번졌다. 호법이 문을 열었다. "들어오너라. 오늘부터 네 이름은 교의 것이다."':'칼끝을 거두자 호법이 웃었다. "무르구나. 그래도 이긴 것은 이긴 것이다." 문이 열렸다.');
        if(res.dead) return {t:'교의 문턱은 생각보다 높았다.',tone:'bad'}; return {t:'쓰러진 나를 호법이 문밖으로 끌어냈다. "살아 있거든 다음에 다시 오너라."',tone:'bad'}; }},
    {t:'은자 100냥을 바친다',when:()=>m.gold>=100,p:()=>.45+ST('charm')*.04,go:ok=>{ gold(-100); if(ok) return cultJoin('호법은 은자 주머니의 무게를 달아 보고 문을 열었다. "교는 쓸모 있는 자를 내치지 않는다."'); return {t:'은자는 받고 문은 열지 않았다. "값이 모자라다."',tone:'bad'}; }},
    {t:'돌아선다',go:()=>'등 뒤에서 낮은 웃음소리가 났다.'}]});

/* ---- 남의 산문에 비무를 청한다: 문파와 세가의 고수들과 겨룬다. 한 곳에서 세 번(제자 → 장로 → 장문인·가주) ---- */
const WSRANK={sect:['일대제자','장로','장문인'],clan:['방계 검수','장로','가주'],den:['부채주','채주의 오른팔','채주'],demon:['향주','호법','장로']};
function wsCur(){ const k=worldSect(), s=inCathay()?curSite():null, ty=(s&&WSRANK[s.type])?s.type:'sect', n=Math.min(2,(m.f.sd||{})[k]||0), c=m.wsC; if(c&&c.a===m.age&&c.k===k&&c.n===n) return c;
  const S=SECTS[k]; return m.wsC={a:m.age,k,n,ty,rank:WSRANK[ty][n],name:rname(),lk:npcLook({name:'ws'+k+n,sex:S.female?'f':'m',age:[32,55,62][n],sect:k,weapon:S.art[2]==='검'||S.art[2]==='도'?'sword':null,hair:k==='shaolin'?'bald':null})}; }
const wsOpen=k=>!!(m.f.martial&&m.lv>=2&&SECTS[k]&&((m.f.sd||{})[k]||0)<3&&((m.f.sdA||{})[k]==null||m.age-(m.f.sdA||{})[k]>=2));
E('wSect',{min:15,max:95,wld:1,when:()=>WGO&&wsOpen(worldSect())&&worldSect()!==m.sect,
  st:()=>{ const c=wsCur(), S=SECTS[c.k]; return Sg('arena',{name:S.n,cast:[N('ws',c.lk,126,{face:-1,pose:'guard',tag:c.rank+' '+c.name})],hero:{x:70}}); },
  text:()=>{ const c=wsCur(), S=SECTS[c.k]; const say=c.ty==='clan'?(c.n?'"또 그대인가. 가문의 이름이 걸렸으니 이번에는 내가 받겠소."':'"가전의 무공은 보여 줄 수는 있어도 가르쳐 줄 수는 없소. 보고 가시오."'):(c.n?'"또 그대인가. 이번에는 내가 상대하겠다."':'"멀리서 온 손님을 빈손으로 보낼 수는 없지. 한 수 받겠다."');
    return `${S.n}의 문 앞에서 이름을 대고 비무를 청했다. 한참 뒤 ${c.rank} ${iga(c.name)} 나왔다. ${say}`; },
  ch:()=>{ const c=wsCur(), S=SECTS[c.k]; return [
    {t:'겨룬다',s:`${S.art[0]} · 목숨을 걸지 않는 비무다`,duel:()=>({foe:{name:c.name,title:`${S.n} ${c.rank}`,look:c.lk,pow:Math.round(power()*[.92,1.02,1.12][c.n])+ri(0,6),style:S.art[2]==='검'?'sword':S.art[2]==='도'?'brute':'monk',mercy:1,art:S.art[0]}}),
      go:ok=>{ m.f.sdA=m.f.sdA||{}; m.f.sdA[c.k]=m.age; m.wsC=null; if(!ok){ addExp(gain()*.2); return {t:`${S.art[0]}의 벽은 높았다. ${c.name}${jo(c.name,'은','는')} 포권하고 돌아섰다. "두어 해 뒤에 다시 오시오."`,tone:'bad'}; }
        m.f.sd=m.f.sd||{}; m.f.sd[c.k]=c.n+1; m.fame+=4+c.n*4; addExp(gain()*(.4+c.n*.2)); let ex='';
        if(c.ty==='clan'){ const g=30+c.n*40; gold(g); ex=` 가문은 무공 대신 노자 ${g}냥을 내놓았다.`; }
        else if(R()<(c.n?.35:.5)){ const A=Object.values(ARTS).filter(a=>a.sect===c.k&&a.k!=='내공'&&a.g<=Math.min(2,c.n+1)&&!knows(a.n)).sort((a,b)=>a.g-b.g)[0]; if(A){ learnArt(A.n,A.k==='내공'?innerMul():1); ex=` 돌아오는 길에 그 초식을 되짚다가 ${A.n}의 이치를 깨쳤다.`; } }
        if(c.n>=2){ m.fame+=8; m.f.sdTop=(m.f.sdTop||0)+1; }
        return {t:`${c.rank} ${c.name}의 ${eul(S.art[0])} 받아 냈다. 그는 한참 말이 없다가 포권했다.${ex}`,big:c.n>=2?`${S.n}의 ${c.rank} ${eul(c.name)} 비무에서 꺾었다. 강호가 술렁였다`:`${S.n}의 ${c.rank} ${eul(c.name)} 비무에서 꺾었다`,tone:'good'}; }},
    {t:'인사만 하고 물러난다',go:()=>({t:'차 한 잔을 얻어 마시고 내려왔다.'})}]; }});
