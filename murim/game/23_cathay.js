/* ==== murim:cathay — 천하 지도: 스물여덟 지역과 그 안의 성·문파·소굴 ==== */
const KW=96, KH=72;
// 지역: [id, 이름, 이름표 x, y]
const CREG=[['henan','하남',56,29],['shaanxi','섬서',43,29],['shanxi','산서',51,19],['hebei','하북',68,19],['shandong','산동',72,22],
  ['hubei','호북',53,36],['hunan','호남',53,47],['anhui','안휘',67,35],['jiangsu','강소',75,34],['zhejiang','절강',79,45],['jiangxi','강서',64,45],
  ['sichuan','사천',32,39],['gansu','감숙',31,24],['qinghai','청해',17,28],['fujian','복건',74,50],['guangdong','광동',63,57],['hainan','해남',61,70],
  ['guangxi','광서',48,59],['yunnan','운남',27,53],['guizhou','귀주·묘강',39,51],['xinjiang','신강',11,13],['xizang','서장',9,42],['nanman','남만',30,63],
  ['mongol','몽골',45,5],['liaodong','요동',84,8],['beihai','북해',62,1]];
// 장소: [id, 이름, x, y, 종류, 지역, 문파]   종류: capital 도성 · city 성 · sect 문파 · clan 세가 · den 소굴 · demon 마도 · camp 천막
const CSITE=[
  ['luoyang','낙양',52,31,'city','henan'],['kaifeng','개봉',60,30,'city','henan'],['shaolin','소림사',56,33,'sect','henan','shaolin'],
  ['xian','서안',43,32,'city','shaanxi'],['huashan','화산파',47,30,'sect','shaanxi','huashan'],['zhongnan','종남파',41,35,'sect','shaanxi','zhongnan'],
  ['taiyuan','태원',51,21,'city','shanxi'],['hengshan_n','항산파',54,16,'sect','shanxi','hengshan_n'],['nokrim','녹림 총채',57,25,'den','shanxi','nokrim'],
  ['beijing','북경',64,15,'capital','hebei'],['paeng','하북팽가',62,20,'clan','hebei','paeng'],
  ['jinan','제남',70,24,'city','shandong'],['taishan','태산파',73,27,'sect','shandong','taishan'],
  ['wuhan','무한',58,40,'city','hubei'],['zhuge','제갈세가',52,38,'clan','hubei','zhuge'],['wudang','무당파',48,37,'sect','hubei','wudang'],
  ['changsha','장사',55,48,'city','hunan'],['hengshan_s','형산파',53,52,'sect','hunan','hengshan_s'],['suchae','동정호 수채',51,44,'den','hunan','suchae'],
  ['hefei','합비',67,37,'city','anhui'],['namgung','남궁세가',69,41,'clan','anhui','namgung'],
  ['nanjing','남경',73,36,'city','jiangsu'],['moyong','모용세가',77,40,'clan','jiangsu','moyong'],
  ['hangzhou','항주',77,44,'city','zhejiang'],['botao','보타문',80,47,'sect','zhejiang','botao'],
  ['nanchang','남창',63,47,'city','jiangxi'],['yongho','용호산',67,50,'sect','jiangxi','yongho'],
  ['chengdu','성도',31,43,'city','sichuan'],['tang','사천당가',34,46,'clan','sichuan','tang'],['emei','아미파',28,47,'sect','sichuan','emei'],['qingcheng','청성파',27,41,'sect','sichuan','qingcheng'],
  ['lanzhou','난주',30,27,'city','gansu'],['gongdong','공동파',36,29,'sect','gansu','gongdong'],
  ['kunlun','곤륜파',14,31,'sect','qinghai','kunlun'],
  ['fuzhou','복주',76,52,'city','fujian'],['namsorim','남소림',72,55,'sect','fujian','shaolin'],
  ['guangzhou','광주',62,60,'city','guangdong'],['hainanpa','해남파',57,68,'sect','hainan','hainan'],
  ['guilin','계림',50,57,'city','guangxi'],['cheonma','천마신교',44,62,'demon','guangxi','demon'],
  ['dali','대리',27,57,'city','yunnan'],['jeomchang','점창파',23,55,'sect','yunnan','jeomchang'],['odok','오독교',38,54,'sect','guizhou','odok'],
  ['oasis','돈황',16,18,'city','xinjiang'],['tianshan','천산파',9,9,'sect','xinjiang','tianshan'],
  ['potala','포달랍궁',7,46,'sect','xizang','potala'],['hyeol','혈교',14,40,'demon','xizang','hyeol'],
  ['yasu','남만야수궁',30,67,'sect','nanman','yasu'],['horde','초원 부족',44,8,'camp','mongol'],
  ['shenyang','심양',82,11,'city','liaodong'],['jangbaek','장백파',89,6,'sect','liaodong','jangbaek'],['binggung','북해빙궁',60,3,'sect','beihai','binggung']];
const CROAD=[['beijing','taiyuan'],['beijing','jinan'],['beijing','shenyang'],['beijing','horde'],['horde','binggung'],['beijing','paeng'],['taiyuan','hengshan_n'],['taiyuan','luoyang'],['taiyuan','nokrim'],
  ['luoyang','kaifeng'],['luoyang','shaolin'],['kaifeng','jinan'],['jinan','taishan'],['luoyang','xian'],['xian','huashan'],['xian','zhongnan'],['xian','lanzhou'],['lanzhou','gongdong'],['lanzhou','oasis'],['oasis','tianshan'],['lanzhou','kunlun'],
  ['xian','chengdu'],['chengdu','tang'],['chengdu','emei'],['chengdu','qingcheng'],['chengdu','dali'],['dali','jeomchang'],['dali','yasu'],['chengdu','hyeol'],['hyeol','potala'],
  ['luoyang','zhuge'],['zhuge','wudang'],['zhuge','wuhan'],['wuhan','changsha'],['changsha','suchae'],['changsha','hengshan_s'],['wuhan','hefei'],['kaifeng','hefei'],['hefei','namgung'],['hefei','nanjing'],['nanjing','moyong'],['moyong','hangzhou'],['hangzhou','botao'],
  ['changsha','nanchang'],['nanchang','yongho'],['nanchang','hangzhou'],['hangzhou','fuzhou'],['fuzhou','namsorim'],['fuzhou','guangzhou'],['guangzhou','guilin'],['guilin','changsha'],['guilin','cheonma'],['guilin','odok'],['odok','dali'],['shenyang','jangbaek']];
const CRIVER=[{w:1,p:[[20,31],[26,29],[31,26],[36,21],[40,17],[45,18],[46,24],[47,27],[53,27],[61,27],[67,25],[73,22]]},   // 황하
  {w:1,p:[[18,41],[25,44],[33,44],[40,45],[46,42],[52,41],[58,41],[63,43],[69,39],[74,37],[80,37]]}];   // 장강
const CLAKE=[[53,45,2.4,1.6],[63,44,1.8,1.5],[75,39,1.5,1.2],[19,25,2.2,1.4]];
const CMOUNT=[[54,19],[55,22],[54,26],[38,34],[45,35],[49,34],[8,33],[12,34],[18,33],[5,7],[13,6],[18,10],[4,52],[9,53],[14,54],[55,31],[46,28],[72,25],[48,35],[27,49],[70,42],[52,53],[55,14],[42,64],[46,65],[88,4],[92,8],[22,53],[35,27],[25,40],[24,36],[22,45],[60,5],[66,2],[10,39],[34,57],[42,52]];
function buildCathay(){ const M=mkMap('cathay',KW,KH,'.','천하'), S=k=>CSITE.find(s=>s[0]===k);
  const lerp=(T,v)=>{ for(let i=1;i<T.length;i++) if(v<=T[i][0]){ const a=T[i-1], b=T[i]; return a[1]+(b[1]-a[1])*(v-a[0])/(b[0]-a[0]); } return T[T.length-1][1]; };
  const COAST=[[0,97],[8,95],[13,87],[17,76],[22,75],[25,84],[28,82],[31,78],[36,80],[42,82],[48,80],[54,77],[58,72],[62,66],[63,60],[64,50],[65,44],[67,40],[72,38]];
  for(let y=0;y<KH;y++) for(let x=0;x<KW;x++){ const c=lerp(COAST,y)+(hsh(y*1.7+3)-.5)*1.6+(hsh(x*.9+y*2.3)-.5)*.8; let k='.';
      if(x>=c) k='~'; else if(y<6) k='n'; else if(x<19&&y>35&&y<57) k='n'; else if(x<25+(hsh(y*2.1)-.5)*2&&y>=12&&y<31) k='d'; else if(y<14&&x<74) k='p'; else if(x<24&&y<12) k='p'; else if(y>59&&x<41) k='j'; else if(y>53&&x<33+(hsh(y*1.3)-.5)*3) k='j';
      M.g[y][x]=k; }
  for(let y=65;y<71;y++) for(let x=52;x<63;x++) if(Math.pow((x-57)/4,2)+Math.pow((y-68)/2.4,2)<1) M.g[y][x]='.';
  for(const L of CLAKE) for(let y=0;y<KH;y++) for(let x=0;x<KW;x++) if(Math.pow((x-L[0])/L[2],2)+Math.pow((y-L[1])/L[3],2)<1) M.g[y][x]='~';
  const line=(a,b,fn)=>{ let x=a[0], y=a[1]; fn(x,y); while(x!==b[0]||y!==b[1]){ const dx=b[0]-x, dy=b[1]-y; if(Math.abs(dx)>=Math.abs(dy)&&dx) x+=Math.sign(dx); else y+=Math.sign(dy); fn(x,y); } };
  for(const r of CRIVER) for(let i=1;i<r.p.length;i++) line(r.p[i-1],r.p[i],(x,y)=>{ if(M.g[y]&&M.g[y][x]!=null) M.g[y][x]='~'; });
  const road=new Set(); for(const e of CROAD){ const a=S(e[0]), b=S(e[1]); line([a[2],a[3]],[b[2],b[3]],(x,y)=>{ road.add(x+','+y); M.g[y][x]=M.g[y][x]==='~'||M.g[y][x]==='B'?'B':'='; }); }
  for(const sg of [[[62,60],[55,63]],[[55,63],[55,68]],[[55,68],[57,68]]]) line(sg[0],sg[1],(x,y)=>{ road.add(x+','+y); M.g[y][x]=M.g[y][x]==='~'||M.g[y][x]==='B'?'B':'='; });   // 해남으로 건너가는 뱃길
  const used=new Set(road), take=(x,y,w,h)=>{ for(let j=-1;j<=h;j++) for(let i=-1;i<=w;i++) used.add((x+i)+','+(y+j)); }, free=(x,y,w,h)=>{ for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const k=M.g[y+j]&&M.g[y+j][x+i]; if(k==null||k==='~'||k==='B'||k==='='||used.has((x+i)+','+(y+j))) return false; } return true; };
  for(const s of CSITE){ const x=s[2], y=s[3], t=s[4], sc=s[6]&&SECTS[s[6]]?dk(vivid(SECTS[s[6]].robe,.2),.3):null; let o, w=3, h=2;
    if(t==='capital'){ w=5; h=3; o=mobj(M,'house',x-2,y-3,{w,h,roof:'t',rc:'#a8402e',door:2,dw:28,pillar:1,lamp:1,sign:'seal',mid:s[0]}); }
    else if(t==='den'||t==='camp'){ w=2; h=2; o=mobj(M,'tent',x-1,y-2,{c:t==='camp'?'#c8b48a':'#7a6a5a',fc:t==='camp'?'#3f6f9a':'#2a2a2a',mid:s[0]}); if(free(x+1,y-2,2,2)) mobj(M,'tent',x+1,y-2,{c:'#9a7a52'}); }
    else o=mobj(M,'house',x-1,y-2,{w,h,roof:'t',rc:t==='city'?'#3f5266':t==='clan'?'#2f4a7a':t==='demon'?'#5a1414':sc||'#6a5a4a',door:1,sign:t==='city'?'inn':t==='clan'?'seal':'sword',sc:t==='demon'?'#3a0c0c':'#7a2a22',lamp:t!=='city',mid:s[0]});
    take(o.x,o.y,w+(t==='den'||t==='camp'?2:0),h); M.g[y][x]='='; used.add(x+','+y);
    M.spots.push({id:s[0],n:s[1],x,y,type:t,reg:s[5],sect:s[6]||null,lab:[x+.5,y-h-.9]}); }
  for(const p of CMOUNT) for(const d of [[0,0],[3,1],[-3,1],[1,-2],[5,-1]]){ const x=p[0]+d[0], y=p[1]+d[1]; if(x>0&&y>0&&x+3<KW&&y+2<KH&&free(x,y,3,2)){ mobj(M,'mount',x,y); take(x,y,3,2); } }
  for(let y=1;y<KH-1;y++) for(let x=1;x<KW-1;x++){ const k=M.g[y][x]; if(used.has(x+','+y)||!free(x,y,1,1)) continue; const h=hsh(x*4.7+y*8.3+1.9), p=k==='j'?.3:k==='n'?.04:k==='d'?.012:k==='p'?.006:y<18||x>76&&y<20?.11:.07;
    if(h<p){ mobj(M,k==='d'?'rock':k==='n'||y<22?'pine':k==='j'?'tree':hsh(x*2.3+y*5.9)<.45?'pine':'tree',x,y); take(x,y,1,1); } else if(k==='.'&&hsh(x*3.1+y*7.7)<.05) M.g[y][x]=':'; }
  M.start=[52,31]; M.cathay=1; M.regs=CREG; return mfin(M); }
