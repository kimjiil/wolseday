import numpy as np
from PIL import Image
def load(n): return np.asarray(Image.open(n+'.png').convert('RGB')).astype(np.float32)
def bgmask(a,tol=1.0):
    r,g,b=a[...,0],a[...,1],a[...,2]; return (r>170)&(b>170)&(g<120)&(np.abs(r-b)<70)
def edgy(a):   # 자홍과 섞인 가장자리(분홍 물): 색 평균에서 뺀다
    r,g,b=a[...,0],a[...,1],a[...,2]; return (r>g+60)&(b>g+60)&(np.abs(r-b)<90)
def lum(a): return a[...,0]*.3+a[...,1]*.55+a[...,2]*.15
def isline(a): return lum(a)<80
def crops(a):
    fg=~bgmask(a); cols=fg.any(axis=0); runs=[]; st=None
    for i,v in enumerate(cols):
        if v and st is None: st=i
        if not v and st is not None:
            if i-st>20: runs.append((st,i))
            st=None
    out=[]
    for x0,x1 in runs:
        ys=np.where(fg[:,x0:x1].any(axis=1))[0]; out.append((x0,int(ys.min()),x1,int(ys.max())+1))
    return out
def headw(a,box):   # 민머리 서 있는 그림의 머리 폭(귀 포함): 위쪽 55% 안에서 가장 넓은 줄
    x0,y0,x1,y1=box; fg=~bgmask(a[y0:y1,x0:x1]); h=y1-y0; top=fg[:int(h*.55)]
    return int(top.sum(axis=1).max())
def warp(a,s,dx,dy,out_shape):   # 크기 s 로 키우고 (dx,dy) 만큼 옮긴다(가까운 픽셀)
    H,W=out_shape; ys,xs=np.mgrid[0:H,0:W]; sx=((xs-dx)/s).round().astype(int); sy=((ys-dy)/s).round().astype(int)
    ok=(sx>=0)&(sx<a.shape[1])&(sy>=0)&(sy<a.shape[0]); out=np.zeros((H,W,3),np.float32); out[...]=(255,0,255); out[ok]=a[sy[ok],sx[ok]]; return out
def pixelize(a,f,pal=None,linecut=.34):
    """깨끗한 그림 a(자홍 바탕)를 f 배로 줄여 도트로 만든다. 선은 따로 세어 또렷하게, 면은 선을 뺀 평균색."""
    fg=~bgmask(a); ed=edgy(a)&fg; ln=isline(a)&fg&~ed; flat=fg&~ln&~ed
    H,W=a.shape[:2]; h,w=max(1,round(H*f)),max(1,round(W*f))
    def box(x): return np.asarray(Image.fromarray(x.astype(np.float32),'F').resize((w,h),Image.BOX))
    cov=box(fg*1.); lc=box(ln*1.); fc=box(flat*1.)
    col=np.stack([box(a[...,i]*flat) for i in range(3)],-1)/np.maximum(fc,1e-6)[...,None]
    lcol=np.stack([box(a[...,i]*ln) for i in range(3)],-1)/np.maximum(lc,1e-6)[...,None]
    out=np.zeros((h,w,4),np.uint8); op=cov>=.5
    useline=op&((lc>=linecut*np.maximum(cov,1e-6))|(fc<.08))
    out[...,:3]=np.where(useline[...,None],lcol,col).clip(0,255); out[...,3]=op*255
    return out,useline
def palettize(sp,pal):
    a=sp[...,:3].astype(float); d=((a[:,:,None,:]-pal[None,None])**2).sum(-1); out=sp.copy(); out[...,:3]=pal[d.argmin(-1)]; return out
def make_pal(a,n=20):
    fg=~bgmask(a)&~edgy(a); px=a[fg].astype(np.uint8)
    q=Image.fromarray(px.reshape(1,-1,3),'RGB').quantize(n,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
    return np.array(q.getpalette()[:n*3]).reshape(-1,3).astype(float)
