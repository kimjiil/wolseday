import numpy as np, pickle, json, base64, io
from PIL import Image
LO=pickle.load(open('lo.pkl','rb')); W=pickle.load(open('weap.pkl','rb'))
items=[]   # (key, rgba, ox, oy)
def add(key,im,ox=0,oy=0):
    a=im[...,3]>0
    if not a.any(): return
    ys,xs=np.where(a); y0,x0=ys.min(),xs.min(); items.append((key,im[y0:ys.max()+1,x0:xs.max()+1],int(x0+ox),int(y0+oy)))
for (sex,cl,p),im in LO['bodies'].items(): add(f'b{sex}{cl}{p}',im)
for (sex,hn,p,fb),im in LO['hair'].items():
    if im is not None: add(f'h{sex}{hn}{p}{fb}',im)
G={}
# 눈 20가지: 옆 그림 눈 둘레를 통째로(살 포함) 잘라 둔다. 정면은 오른쪽 눈 하나를 잘라 왼쪽에는 뒤집어 쓴다(흉터 눈은 양쪽 따로)
import math
EYES=pickle.load(open('eyes_lo.pkl','rb'))
def skin_of(lo):
    r,g,b=[lo[...,i].astype(int) for i in range(3)]; m=(lo[...,3]>0)&(r>190)&(g>140)&(b>95)&(r>b+30)&(g<r); return np.median(lo[m][:,:3],axis=0)
SKIN=skin_of(LO['bodies'][('m','plain',0)])
def rect(lo,cx,bot,w):
    x0=int(math.floor(cx-w/2+.5)); y0=bot-9; r=lo[y0:bot+2,x0:x0+w].copy()
    d=np.abs(r[...,:3].astype(int)-SKIN.astype(int)).sum(-1); r[(d<45)&(r[...,3]>0),:3]=SKIN; r[...,3]=255; return r
for v in range(1,21):
    items.append((f'e{v}f',rect(EYES[(v,0)],39.5,38,10),0,0))
    items.append((f'e{v}s',rect(EYES[(v,4)],39.0,37,9),0,0))
    if v==9: items.append((f'e{v}fl',rect(EYES[(v,0)],28.5,38,10),0,0))
for (kind,i,nm),(im,g) in W.items(): add(f'w{kind}{i}{nm}',im); G[f'w{kind}{i}{nm}']=[round(g[0],1),round(g[1],1)]
items.sort(key=lambda t:-t[1].shape[0])
AW=640; x=y=rowh=0; R={}
for key,im,ox,oy in items:
    h,w=im.shape[:2]
    if x+w>AW: x=0; y+=rowh+1; rowh=0
    R[key]=[x,y,w,h,ox,oy]; x+=w+1; rowh=max(rowh,h)
AH=y+rowh; atlas=np.zeros((AH,AW,4),np.uint8)
for key,im,ox,oy in items:
    x0,y0,w,h,_,_=R[key]; atlas[y0:y0+h,x0:x0+w]=im
buf=io.BytesIO(); Image.fromarray(atlas,'RGBA').save(buf,'PNG',optimize=True); b64=base64.b64encode(buf.getvalue()).decode()
M={'foot':{},'fist':{},'top':{},'eyes':{},'grip':G}
for k,v in LO['meta'].items():
    if len(k)==2: sex,p=k; M['foot'][f'{sex}{p}']=v['foot']; M['fist'][f'{sex}{p}']=v['fist']; M['top'][f'{sex}{p}']=v['top']
    else: sex,cl,p,_=k; M['eyes'][f'{sex}{cl}{p}']=v
js='/* ==== murim:doll-data — 그림 부품 모음(빌드가 만든다: scratchpad 의 p1/export.py) ==== */\n'
js+='const DOLLD={src:"data:image/png;base64,'+b64+'",\nR:'+json.dumps(R,separators=(',',':'))+',\nM:'+json.dumps(M,separators=(',',':'))+'};\n'
open('/home/claude/wolseday/murim/game/83_doll_data.js','w').write(js)
Image.fromarray(atlas,'RGBA').save('atlas.png'); print('부품',len(items),'모음',AW,'x',AH,'PNG',len(buf.getvalue())//1024,'KB')
