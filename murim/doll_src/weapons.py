import numpy as np, pickle, math
from PIL import Image
from px import load, bgmask, pixelize
LINE=(52,34,34)
ANG={'back':120,'backv':60,'guard':-50,'atk':-8}
def rows(a):
    fg=~bgmask(a); r=fg.any(axis=1); out=[]; st=None
    for i,v in enumerate(r):
        if v and st is None: st=i
        if not v and st is not None:
            if i-st>6: out.append((st,i))
            st=None
    boxes=[]
    for y0,y1 in out:
        xs=np.where(fg[y0:y1].any(axis=0))[0]; boxes.append((int(xs.min()),y0,int(xs.max())+1,y1))
    return boxes
def edge(a):
    P=np.pad(a,1); return a&~(P[:-2,1:-1]&P[2:,1:-1]&P[1:-1,:-2]&P[1:-1,2:])
W={}
sw=load('w_swords'); sb=load('w_sabers'); RS=rows(sw); RB=rows(sb)
print('검',len(RS),'도',len(RB))
iron=RS[1]; fw=19/(iron[2]-iron[0])
names=[('sword',i) for i in range(len(RS))]+[('saber',i) for i in range(len(RB))]
for kind,i in names:
    a=sw if kind=='sword' else sb; x0,y0,x1,y1=(RS if kind=='sword' else RB)[i]
    pad=40; crop=np.zeros((y1-y0+2*pad,x1-x0+2*pad,3),np.float32); crop[...]=(255,0,255); crop[pad:pad+y1-y0,pad:pad+x1-x0]=a[y0:y1,x0:x1]
    L=x1-x0; gx=pad+L*.12; gy=pad+(y1-y0)/2      # 손잡이를 쥐는 자리
    for nm,th in ANG.items():
        im=Image.fromarray(crop.astype(np.uint8),'RGB'); cxp,cyp=crop.shape[1]/2,crop.shape[0]/2
        r=im.rotate(-th,resample=Image.BICUBIC,expand=True,fillcolor=(255,0,255)); R=np.asarray(r).astype(np.float32)
        t=math.radians(th); dx,dy=gx-cxp,gy-cyp; rx=dx*math.cos(t)-dy*math.sin(t); ry=dx*math.sin(t)+dy*math.cos(t)
        g2=(R.shape[1]/2+rx,R.shape[0]/2+ry)
        lo,_=pixelize(R,fw,linecut=.6); al=lo[...,3]>0
        ys,xs=np.where(al)
        if not len(ys): continue
        oy,ox=ys.min(),xs.min(); lo=lo[oy:ys.max()+1,ox:xs.max()+1]
        W[(kind,i,nm)]=(lo,[g2[0]*fw-ox,g2[1]*fw-oy])
    print(kind,i,'길이',round(L*fw,1))
pickle.dump(W,open('weap.pkl','wb'))
