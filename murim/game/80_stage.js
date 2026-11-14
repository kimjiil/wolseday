/* ==== murim:stage — 누가 어떤 모습으로, 지금 어떤 장면에 서 있는가 ==== */
function heroLook(o){ const a=bodyAge(), s=seedOf(m.name), kid=a<13, old=a>=58, S=m.sect&&SECTS[m.sect];
  let robe=S?S.robe:FAMROBE[m.b.o]||'#8f8a78'; if(m.f.leader) robe='#e3ded0'; if(m.f.tianmo) robe='#3a1418';
  const wi=m.inv&&m.inv.w?ITEMS[m.inv.w]:null, w=wi&&a>=10&&(m.f.martial||wi.atk>=5)?WVIS[wi.k]:null;
  const hair=kid?(m.sex==='f'?'buns':'tuft'):m.sect==='shaolin'?'bald':m.sex==='f'?(a>=30?'bun':'long'):(m.f.leader||m.f.head?'crown':a>=40?'top':'pony');
  const L={sex:m.sex,size:kid?'kid':(hasT('might')?'big':'adult'),hair,hairC:old?'#e2dfd6':a>=46?'#6e686c':HAIRC[s%5],skin:SKIN[s%4],robe,weapon:w,beard:m.sex==='m'&&a>=60?'long':m.sex==='m'&&a>=38?'short':null};
  L.body=dollBody(m.inv&&m.inv.a?ITEMS[m.inv.a]:null); L.dw=w?dollWeapon(wi):null; L.eye=m.f.magong?16:old&&m.sex==='m'?13:dollEye({hairC:'',sex:m.sex},s);      // 그림 부품: 입은 옷과 든 무기
  if(m.f.magong){ L.trim='#7a1e1e'; L.ol='#5a1414'; }
  if(wi&&wi.t>=5) L.wc='#ffd0f0'; else if(wi&&wi.t===4) L.wc='#fff1c0'; else if(wi&&wi.t===3) L.wc='#e0ccff';
  if(m.inv&&m.inv.a&&ITEMS[m.inv.a].t>=3) L.sash='#d9a441';
  return mkLook(Object.assign(L,o||{})); }
function relAge(r){ if(r.age0!=null) return r.age0+m.age; const d=m.age-(r.a0||0);
  switch(r.role){ case '자식': return d; case '제자': return 12+d; case '사부': case '은사': return 48+d; case '사형': case '사저': return m.age+3; case '사매': case '사제': return m.age-2; default: return Math.max(8,m.age+(seedOf(r.name)%7)-3); } }
function relLook(r,o){ if(!r) return LOOK.villager(o); if(r.role==='은사') return LOOK.master(o);
  const p={name:r.name,sex:r.sx,age:relAge(r)}, inSect=/사부|사형|사저|사매|사제|제자/.test(r.role);
  if(inSect&&m.sect){ p.sect=m.sect; if(m.sect==='shaolin') p.hair='bald'; }
  if(r.role==='아버지'||r.role==='어머니'||r.role==='자식') p.robe=FAMROBE[m.b.o];
  if(/맞수|원수|사부|사형|사저|제자/.test(r.role)&&m.f.martial) p.weapon='sword';
  if(r.role==='배우자'||r.role==='정인') p.blush=1;
  return npcLook(Object.assign(p,o||{})); }
const seasonNow=()=>(!m||m.age==null)?1:(m.sea!=null&&m.age>=MAPAGE&&m.phase==='play'?m.sea:((m.age%4)+4)%4);
function fixStage(s,key){ s=Object.assign({},s); if(key) s.key=key;
  if(s.hero!==null){ if(m.age<3&&!m.train) s.hero=null; else s.hero=Object.assign({look:heroLook(),x:64,face:1},s.hero||{}); }
  if(s.biome===undefined&&!(BG[s.bg]&&BG[s.bg].biome)&&!m.f.migrated){ const b=regOf(m.b.reg).biome; if(b) s.biome=b; }
  if(s.season==null) s.season=seasonNow();
  if(s.cast) s.cast=s.cast.filter(Boolean);
  return s; }
function evStage(ev){ if(m.evSt) return m.evSt; const s=ev.st?ev.st():Sg('village'); if(ev.gi) giTint(s); return m.evSt=fixStage(s,'ev:'+ev.id+':'+m.age); }
function giTint(s){ if(!s.wx) s.wx='gold'; const t=s.time||(BG[s.bg]&&BG[s.bg].time)||'day'; if(!s.tint&&t!=='night') s.tint='gold'; }
let LASTSPEC=null;
function applyStage(spec){ if(spec&&spec.cathay){ MAPON=false; SC=null; LASTSPEC=spec; FX.length=0; DICE=null; cathayShow(); const c0=$m('mhCapR'); if(c0) c0.textContent='천하'; return null; } cathayHide(); if(spec&&spec.map){ const was=MAPON; MAPON=true; SC=null; LASTSPEC=spec; mapEnter(); if(!was){ mapTags(); FX.length=0; DICE=null; } const c0=$m('mhCapR'); if(c0) c0.textContent=MAPV.M.name; return null; } MAPON=false; const prev=SC; LASTSPEC=spec; const st=setStage(spec); if(st!==prev&&spec.show){ try{ spec.show(); }catch(e){} } const cr=$m('mhCapR'); if(cr) cr.textContent=st.name||''; return st; }

/* ---- 아무 일 없는 해의 풍경 ---- */
const HOMEBG={tenant:'home',farmer:'home',beggar:'village',artisan:'forge',merchant:'market',hunter:'hermit',inn:'inn',bandit:'fort',escort:'home',doctor:'home',official:'manor',clan:'manor',tangc:'manor',blood:'home'};
const homeOf=()=>m.f.doom||m.f.migrated?'home':HOMEBG[m.b.o]||'home';
const dogN=(x)=>m.f.dog&&m.age-m.f.dog<14?N('dog',LOOK.dog(),x,{act:'wander',xmin:30,xmax:150}):null;
function kin(xs){ const out=[]; let i=0; const add=(id,L,o)=>{ if(i<xs.length) out.push(N(id,L,xs[i++],o)); };
  if(m.spouse&&!m.spouse.dead) add('sp',relLook(m.spouse),{act:'wander',xmin:84,xmax:150});
  m.rels.filter(r=>r.role==='자식'&&!r.dead).slice(0,2).forEach((k,j)=>add('kd'+j,relLook(k),relAge(k)<13?{act:'play',xmin:34,xmax:160}:{act:'wander',xmin:40,xmax:160}));
  if(m.age<34) ['어머니','아버지'].forEach((role,j)=>{ const p=relOf(role); if(p) add('pa'+j,relLook(p),{act:'wander',xmin:96,xmax:170}); });
  return out; }
function lifeStage(){
  const a=m.age, o=m.b.o, fc=a<6?'child':(m.focus||'work'), mo=relOf('어머니'), fa=relOf('아버지'), home=homeOf(), mar=m.f.martial;
  const red=m.f.magong?{tint:'red'}:{}, aura=m.f.magong?'#ff5a3a':'#ffe9a0';
  let s;
  if(a<3) s=Sg(home,{time:a===0?'dawn':'day',hero:null,cast:[N('mo',mo?relLook(mo,{item:'baby'}):LOOK.granny({item:'baby'}),84,{pose:'carry',face:1,emote:a===0?'heart':null}),fa?N('fa',relLook(fa),130,{act:'wander',xmin:112,xmax:164}):null]});
  else if(a<6) s=Sg(home,{hero:{x:70,act:'play',xmin:30,xmax:124},cast:[mo?N('mo',relLook(mo),134,{act:'wander',xmin:124,xmax:166}):null,m.sib>0?N('sb',LOOK.girl(),100,{act:'play',xmin:50,xmax:150}):null,dogN(60)]});
  else if(fc==='train'){
    if(!mar) s=a<16?Sg('village',{hero:{look:heroLook({tool:'stick'}),x:74,act:'tool'},cast:[N('k1',LOOK.child({tool:'stick'}),100,{act:'tool'}),dogN(40)]})
      :Sg('dojo',{name:'마을 무관',hero:{look:heroLook({tool:'stick'}),x:160,act:'tool',face:-1},cast:[N('tc',LOOK.swordsman({hair:'band'}),46,{act:'train'}),N('st',LOOK.youth(),84,{face:1,act:'train'}),N('s2',LOOK.youth({sex:'f'}),110,{act:'train'})]});
    else if(a%3===0) s=Sg('mountain',Object.assign({time:'dawn',hero:{x:136,pose:'sit',act:'meditate',auraC:aura}},red));
    else if(m.sect) s=Sg('dojo',Object.assign({name:SECTS[m.sect].n,hero:{x:46,face:-1,pose:'guard',act:'train',auraC:m.f.magong?aura:null},cast:[N('b1',npcLook({name:'동문1',sex:m.sex,age:a,sect:m.sect,weapon:'sword',hair:m.sect==='shaolin'?'bald':null}),88,{face:1,act:'train'}),N('b2',npcLook({name:'동문2',sex:'m',age:a+2,sect:m.sect,weapon:'sword',hair:m.sect==='shaolin'?'bald':null}),114,{act:'train'}),relOf('사부')?N('sa',masterLook(),166,{}):null]},red));
    else if(m.f.master&&relOf('은사')) s=Sg('hermit',{hero:{x:62,pose:'guard',act:'train'},cast:[N('ms',LOOK.master(),100,{pose:'sit'})]});
    else s=Sg('mountain',Object.assign({hero:{x:112,pose:'guard',act:'train',auraC:m.f.magong?aura:null}},red));
  }
  else if(fc==='work'){
    if(a<10) s=Sg(home,{hero:{look:heroLook({tool:'broom'}),x:76,act:'tool'},cast:[mo?N('mo',relLook(mo),132,{act:'wander',xmin:120,xmax:164}):null,dogN(50)]});
    else if(m.f.shop||o==='merchant') s=Sg('market',{hero:{x:110,face:-1},cast:[N('c1',folk(1),84,{face:1,act:'wander',xmin:56,xmax:96}),N('c2',folk(2,{sex:'f'}),150,{act:'wander',xmin:136,xmax:176})]});
    else if(mar&&m.lv>=2&&a>=16) s=Sg('road',{name:'표행 길',scroll:.5,hero:{x:76,act:'walk'},cast:[N('hs',LOOK.horse(),108,{face:1,act:'walk',pose:'walk'}),N('bx',folk(4,{item:'box'}),136,{face:1,pose:'carry'})]});
    else if(o==='beggar') s=Sg('market',{hero:{x:78,pose:'beg'},cast:[N('c1',folk(1),118,{act:'wander',xmin:100,xmax:170}),N('c2',LOOK.merchant(),150,{act:'wander',xmin:120,xmax:176})]});
    else if(o==='artisan') s=Sg('forge',{props:[['anvil',92,{dy:8}]],hero:{look:heroLook({tool:'hammer'}),x:80,act:'tool'},cast:[fa&&a<30?N('fa',relLook(fa,{tool:'hammer',extra:'apron'}),112,{act:'tool',face:-1}):null]});
    else if(o==='hunter') s=Sg('forest',{hero:{x:70,act:'wander',xmin:40,xmax:120},cast:[N('dg',LOOK.dog(),96,{act:'wander',xmin:60,xmax:150})]});
    else if(o==='inn') s=Sg('innroom',{hero:{look:heroLook({item:'tray'}),x:88,pose:'carry'},cast:[N('g1',LOOK.swordsman(),46,{pose:'drink',face:-1}),N('g2',folk(2),18,{pose:'drink',face:1}),N('kp',LOOK.merchant(),158,{dy:-2})]});
    else if(o==='bandit') s=Sg('fort',{hero:{x:38,pose:'guard'},cast:[N('b1',LOOK.bandit(),84,{pose:'drink'}),N('b2',LOOK.chief(),160,{act:'wander',xmin:140,xmax:176})]});
    else if(o==='escort') s=Sg('road',{name:'표행 길',scroll:.5,hero:{x:76,act:'walk'},cast:[N('hs',LOOK.horse(),108,{face:1,act:'walk',pose:'walk'}),fa&&a<30?N('fa',relLook(fa,{weapon:'sword'}),40,{face:1,act:'walk'}):null]});
    else if(o==='doctor') s=Sg('shop',{name:'약방',hero:{x:128,face:-1,dy:-2},cast:[N('pt',folk(3,{age:60}),62,{face:1,pose:'kneel',emote:'sweat'})]});
    else if(o==='official'||o==='clan'||o==='tangc') s=Sg('manor',{hero:{look:heroLook({tool:'brush'}),x:70,act:'tool'},cast:[N('sv',folk(2),150,{act:'wander',xmin:130,xmax:176})]});
    else s=Sg('field',{hero:{look:heroLook({tool:'hoe'}),x:70,act:'tool'},cast:[fa&&a<28?N('fa',relLook(fa,{tool:'hoe'}),104,{act:'tool',face:-1}):null,dogN(40)]});
  }
  else if(fc==='family'){ const k=kin([104,84,128,150]); s=Sg(home,{time:'dusk',hero:{x:62,act:k.length?'wander':null,pose:k.length?'idle':'sit',xmin:40,xmax:90,emote:k.length?null:'...'},cast:k.concat([dogN(46)])}); }
  else { s=mar?Sg('hermit',{hero:{x:66,pose:'sit',act:'meditate',auraC:'#bff0d8'}}):a>=55?Sg(home,{hero:{x:64,pose:'sit'},cast:kin([110,134])}):Sg('river',{hero:{x:62,pose:'sit'}}); }
  if(s.bg==='home'&&s.time===undefined&&a>=3) s.time='day';
  return fixStage(s); }
function yearStage(){ const y=m.yst, a=m.age, home=homeOf(); if(!y) return null; let s=null;
  const mourn=()=>kin([150,166,136]).map(c=>Object.assign(c,{act:null,pose:'kneel',face:-1}));
  switch(y.k){
    case 'funeral': s=Sg('grave',{name:y.who==='자식'?'아이의 무덤':`${y.who}의 장례`,wx:'rain',hero:{x:104,pose:a<10?'cry':'kneel',emote:'tear'},cast:mourn()}); break;
    case 'famine': if(a>=3) s=Sg('village',{biome:'dry',season:2,name:'흉년',hero:{x:60,emote:'sweat'},cast:mob('hg',i=>folk(i,{robe:'#7b7466'}),[112,134],{pose:'beg'})}); break;
    case 'plague': if(a>=3) s=Sg('grave',{name:'역병이 돈 고을',tint:'green',props:[['grave',70,{dy:6}],['grave',98,{dy:10}]],hero:{x:50,emote:'sweat'}}); break;
    case 'war': if(a>=3) s=Sg('road',{time:'dusk',wx:'ember',name:'피난 행렬',hero:{x:40,emote:'sweat'},cast:mob('rf',i=>folk(i,{extra:'pack'}),[104,126,150],{enter:'right',spd:.4})}); break;
    case 'levy': if(a>=3) s=Sg('village',{name:'공출',props:[['banner',150]],hero:{x:50},cast:[N('q1',LOOK.cultist(),118,{pose:'point'}),N('q2',LOOK.cultist(),138,{})]}); break;
    case 'sibling': if(a>=3) s=Sg(home,{hero:{x:64,emote:'!'},cast:[N('mo',relOf('어머니')?relLook(relOf('어머니'),{item:'baby'}):LOOK.woman({item:'baby'}),92,{pose:'carry',emote:'heart'})]}); break;
    case 'play': s=Sg('river',{hero:{x:70,act:'play',xmin:30,xmax:110},cast:[N('k1',LOOK.child(),96,{act:'play',xmin:40,xmax:120}),N('k2',LOOK.girl(),50,{act:'play',xmin:24,xmax:100})]}); break;
    case 'friend': s=Sg('innroom',{time:'night',hero:{x:46,pose:'drink',face:-1},cast:[N('fr',folk(5,{sex:m.sex}),18,{face:1,pose:'drink',emote:'note'})]}); break;
    case 'corvee': s=Sg('road',{name:'부역',hero:{look:heroLook({item:'box'}),x:70,pose:'carry',emote:'sweat'},cast:[N('sd',LOOK.soldier(),118,{pose:'point'})]}); break;
    case 'spouse': if(m.spouse) s=Sg(home,{time:'dusk',wx:'rain',hero:{x:76},cast:[N('sp',relLook(m.spouse),92,{emote:'heart'})]}); break;
    case 'kid': { const k=relOf('자식'); if(k) s=Sg(home,{hero:{x:60,pose:'cheer'},cast:[N('kd',relLook(k),100,{act:'play',xmin:70,xmax:150})]}); break; }
    case 'old': s=Sg(home,{time:'dusk',hero:{x:64,pose:'sit',emote:'...'}}); break;
  }
  return s?fixStage(s):null; }
const TITLES=[
  ()=>({key:'title0',bg:'arena',season:1,hero:null,cast:[N('a',LOOK.youth(),84,{face:1,act:'train'}),N('b',LOOK.swordsman(),110,{act:'train'})]}),
  ()=>({key:'title1',bg:'mountain',time:'dawn',season:0,hero:null,cast:[N('a',LOOK.master(),134,{face:1,pose:'sit',act:'meditate'}),N('c',LOOK.crane(),64,{face:1})]}),
  ()=>({key:'title2',bg:'market',season:2,hero:null,cast:[N('a',LOOK.child(),70,{act:'play',xmin:30,xmax:150}),N('b',LOOK.girl(),96,{act:'play',xmin:40,xmax:160}),N('c',LOOK.dog(),50,{act:'wander',xmin:20,xmax:120}),N('d',LOOK.peddler(),150,{act:'wander',xmin:130,xmax:176})]}),
  ()=>({key:'title3',bg:'temple',season:3,wx:'snow',hero:null,cast:[N('a',LOOK.monk({tool:'broom',weapon:null}),70,{face:1,act:'tool'}),N('b',LOOK.child({robe:'#7b7466'}),100,{pose:'kneel'})]}),
  ()=>({key:'title4',bg:'peak',time:'night',season:1,hero:null,cast:[N('a',LOOK.whitesword(),90,{face:1}),N('b',LOOK.shadow(),128,{pose:'guard'})]}),
  ()=>({key:'title5',bg:'bamboo',season:1,wx:'leaf',hero:null,cast:[N('a',LOOK.swordsman(),70,{face:1,act:'train'}),N('b',LOOK.blackclad(),96,{act:'train'})]})
];
let titleIx=Math.floor(Math.random()*TITLES.length);
function birthStage(){ const b=roll, o=OR(b.o), reg=regOf(b.reg);
  const fa=!b.father.dead?npcLook({name:b.father.name,sex:'m',age:b.father.age,robe:FAMROBE[b.o]}):null, mo=!b.mother.dead?npcLook({name:b.mother.name,sex:'f',age:b.mother.age,robe:FAMROBE[b.o],item:'baby'}):null;
  return {key:'birth:'+b.sur+b.given,bg:HOMEBG[b.o]||'home',time:'night',biome:reg.biome||null,season:1,name:`${reg.n} · ${o.n}`,hero:null,
    cast:[mo?N('mo',mo,92,{pose:'carry',face:1,emote:'heart',tag:'어머니'}):N('mw',LOOK.granny({item:'baby'}),92,{pose:'carry',face:1,tag:'산파'}),fa?N('fa',fa,116,{act:'cheer',tag:'아버지'}):null].filter(Boolean)}; }
function farewellStage(){
  if(m.f.ascended) return fixStage(Sg('peak',{wx:'gold',tint:'gold',name:'우화등선',hero:{x:96,act:'fly'},cast:[N('cr',LOOK.crane(),120,{act:'fly',face:1})]}),'asc');
  if(m.lastRes&&m.lastRes.age===m.age&&m.lastRes.stage) return m.lastRes.stage;
  const k=m.age<16?['어머니','아버지'].map(r=>relOf(r)).filter(Boolean).map((r,i)=>N('pa'+i,relLook(r),94+i*16,{pose:'kneel',emote:i?null:'tear'})):kin([94,110,126,142]).map((c,i)=>Object.assign(c,{act:null,pose:'kneel',face:-1,emote:i?null:'tear'}));
  return fixStage(Sg('room',{time:'dusk',name:'임종',hero:{x:58,dy:-7,pose:'lie'},cast:k}),'bye:'+m.age); }
function endStage(){
  if(m.f.ascended) return {key:'end:asc',bg:'peak',wx:'gold',tint:'gold',time:'dawn',name:'그가 앉았던 바위',hero:null,season:1,cast:[N('cr',LOOK.crane(),110,{})]};
  const mour=m.rels.filter(r=>!r.dead&&/배우자|자식|제자|지기|친구|사매|사제|사형|사저|어머니|아버지/.test(r.role)).slice(0,4).map((r,i)=>N('mo'+i,relLook(r),[100,150,166,84][i],{pose:'kneel',face:i===0||i===3?1:-1}));
  return fixStage(Sg('grave',{name:`${m.name}의 무덤`,time:'dusk',hero:null,cast:mour.concat([N('cw',LOOK.crow(),128,{dy:-13,noShadow:1})])}),'end:'+m.name); }
function stageFor(){
  if(DUEL) return DUEL.stage;
  if(!m||!m.phase||m.phase==='title') return TITLES[titleIx%TITLES.length]();
  if(m.phase==='birth') return birthStage();
  if(m.phase==='end') return endStage();
  if(m.phase==='farewell') return farewellStage();
  if(cutNow()) return cutNow().spec;
  if(m.train){ if(m.tev) return tevStage(); if(m.lastRes&&m.lastRes.train&&m.lastRes.stage&&!m.lastRes.seen) return m.lastRes.stage; if(mapMode()) return MAPSPEC; return fixStage(trainStage()); }
  if(m.pending) return evStage(m.pending);
  if(m.lastRes&&m.lastRes.age===m.age&&m.lastRes.stage&&!(m.age>=MAPAGE&&m.lastRes.seen)) return m.lastRes.stage;
  if(mapMode()) return inCathay()?CATHSPEC:MAPSPEC;
  if(m.yst){ const s=yearStage(); if(s) return s; }
  return lifeStage(); }
function postStage(){ if(!m||!SC) return; const h=A('hero');
  if(m.train&&!m.tev&&!DUEL&&!(m.lastRes&&m.lastRes.train&&m.lastRes.stage)) tuneTrain();
  if(m.phase==='farewell'&&h&&!m.f.ascended&&!m.wait&&h.pose!=='dead'&&h.pose!=='lie'){ h.pose=h.pose0='dead'; h.act=null; h.goto=null; h.ay=0; h.ax=0; h.emote=null; h.lock=true; } }
