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
