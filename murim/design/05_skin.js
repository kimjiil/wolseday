/* ==== murim:skin — 이미지 파일로 그림을 갈아끼우는 연결 ====
   murim/skin/ 아래에 정해진 이름으로 이미지를 넣고 build.py 를 돌리면, 그 자리의 그림이 코드로 그린 것 대신 이미지로 나온다.
   이미지가 없거나 읽지 못하면 지금까지처럼 코드로 그린다. 이름과 크기는 murim/skin/README.md 에 있다.
   SKF 는 build.py 가 skin/ 폴더를 훑어서 넣어 주는 목록이다(이름 → 주소). */
const SKI={};            // 다 읽힌 이미지
let SKINVER=0, _skt=0;   // 이미지가 하나 읽힐 때마다 올라간다(미리 그려 둔 배경을 다시 그리게)
const SEAK=['spring','summer','autumn','winter'];
for(const k in SKF){ const im=new Image(); im.decoding='async';
  im.onload=()=>{ SKI[k]=im; SKINVER++; clearTimeout(_skt); _skt=setTimeout(()=>{ try{ if(typeof skinLoaded==='function') skinLoaded(); }catch(e){} },150); };
  im.onerror=()=>{ delete SKF[k]; }; im.src=SKF[k]; }
// 앞에 적은 이름부터 찾아서 처음 있는 것을 준다
const skinImg=(...ks)=>{ for(const k of ks) if(SKI[k]) return SKI[k]; return null; };
const skinUrl=(...ks)=>{ for(const k of ks) if(SKF[k]) return SKF[k]; return null; };
// 큰 그림은 부드럽게, 도트 크기 그대로인 그림은 또렷하게 줄여 그린다
function skinDraw(g,im,x,y,w,h){ const sm=g.imageSmoothingEnabled; g.imageSmoothingEnabled=im.width>w*2.5; g.drawImage(im,x,y,w,h); g.imageSmoothingEnabled=sm; }
