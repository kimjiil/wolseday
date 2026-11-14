import numpy as np, pickle
from PIL import Image
from px import load,bgmask,pixelize
from parts import align, place, tight, PADX, PADT, warp
from split import crops8
H=pickle.load(open('hi.pkl','rb')); f=H['f']['m']
LOW=pickle.load(open('lo.pkl','rb'))
m8=load('m8'); C8=crops8(m8)
def heads(a):
    fg=~bgmask(a); rows=fg.any(axis=1); H_=a.shape[0]; ys=np.where(rows)[0]
    # 두 줄로 나눈다
    gaps=[(y,y2) for y,y2 in zip(ys[:-1],ys[1:]) if y2-y>20]; cut=(gaps[0][0]+gaps[0][1])//2
    out=[]
    for r0,r1 in ((0,cut),(cut,H_)):
        sub=fg[r0:r1]; cols=sub.any(axis=0); runs=[]; st=None
        for i,v in enumerate(cols):
            if v and st is None: st=i
            if not v and st is not None:
                if i-st>30: runs.append((st,i))
                st=None
        for x0,x1 in runs:
            yy=np.where(sub[:,x0:x1].any(axis=1))[0]; out.append((x0,r0+int(yy.min()),x1,r0+int(yy.max())+1))
    return out
def base_head(p):
    B=tight(m8,C8[p]); h=B.shape[0]; return B[:int(h*.62)]
def is_line(c): L=c[...,0]*.3+c[...,1]*.55+c[...,2]*.15; return L<90
PAL=None
def pal():
    global PAL
    if PAL is None:
        fr=[H['body'][('m','plain',p)] for p in range(8)]; px=np.concatenate([q[~bgmask(q)] for q in fr]).astype(np.uint8)
        q=Image.fromarray(px.reshape(1,-1,3),'RGB').quantize(40,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE); PAL=np.array(q.getpalette()[:120]).reshape(-1,3).astype(float)
    return PAL
def snap(lo,extra):
    P=np.vstack([pal(),extra]); a=lo[...,:3].astype(float); d=((a[:,:,None,:]-P[None,None])**2).sum(-1); o=lo.copy(); o[...,:3]=P[d.argmin(-1)]; return o
OUT={}
EX=np.array([[255,255,255],[214,40,40],[150,20,20],[250,120,100],[120,60,50],[200,200,206],[160,90,140],[90,60,70]],float)   # 눈빛·붉은 눈·흉터·눈 밑 그늘·흰 눈썹
for si in range(1,5):
    a=load(f'e{si}'); Hd=heads(a); assert len(Hd)==10,(si,len(Hd))
    for col in range(5):
        v=(si-1)*5+col+1
        for row,p in ((0,0),(1,4)):
            X=a[Hd[row*5+col][1]:Hd[row*5+col][3],Hd[row*5+col][0]:Hd[row*5+col][2]].copy()
            B=base_head(p); s,dx,dy=align(B,X,'head',srange=(.85,1.2))
            fr=H['frame'][('m',p)]; W=warp(X,s,dx+PADX,dy+PADT,fr)
            lo,_=pixelize(W,f); lo=snap(lo,EX); OUT[(v,p)]=lo
        print('눈',v,'맞춤',round(s,3),round(dx,1),round(dy,1))
pickle.dump(OUT,open('eyes_lo.pkl','wb'))
