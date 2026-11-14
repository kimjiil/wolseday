import numpy as np, pickle, sys
from PIL import Image
from px import load,bgmask,isline,warp,pixelize,make_pal,palettize
from split import crops8
SKULL=24; PADX,PADT,PADB=120,110,30
def green(a): r,g,b=a[...,0],a[...,1],a[...,2]; return (g>r+40)&(g>b+40)&(g>70)
def cyan(a): r,g,b=a[...,0],a[...,1],a[...,2]; return (g>100)&(b>100)&(r<100)&(np.abs(g-b)<60)
def dil(m,k):
    o=m.copy()
    for dy in range(-k,k+1):
        for dx in range(-k,k+1):
            if dx*dx+dy*dy<=k*k: o|=np.roll(np.roll(m,dy,0),dx,1)
    return o
def tight(a,box): x0,y0,x1,y1=box; return a[y0:y1,x0:x1].copy()
def place(sp,shape,ox,oy):
    c=np.zeros(shape+(3,),np.float32); c[...]=(255,0,255); h,w=sp.shape[:2]; c[oy:oy+h,ox:ox+w]=sp; return c
def anchor(fg,mode):
    ys=np.where(fg.any(axis=1))[0]; xs=np.where(fg.any(axis=0))[0]
    if mode=='feet': yb=ys.max(); band=fg[int(yb-(yb-ys.min())*.12):yb+1]; bx=np.where(band.any(axis=0))[0]; return float(yb),(bx.min()+bx.max())/2
    yt=ys.min(); band=fg[yt:int(yt+(ys.max()-yt)*.3)]; bx=np.where(band.any(axis=0))[0]; return float(yt),(bx.min()+bx.max())/2
def align(B,X,mode='feet',region=None,ign=None,srange=(.9,1.14)):
    """X(조각)를 B(조각) 좌표로 옮기는 크기·이동. 반 해상도로 훑고 원 해상도로 다듬는다"""
    P=30; Bp=place(B,(B.shape[0]+2*P,B.shape[1]+2*P),P,P); fb=~bgmask(Bp)
    reg=np.ones(fb.shape,bool) if region is None else region(Bp)
    igX=np.zeros(X.shape[:2],bool) if ign is None else ign(X)
    ya,xa=anchor(fb,mode); yx,xx=anchor(~bgmask(X)&~igX if mode=='feet' else ~bgmask(X),mode)
    def score(s,dx,dy,step):
        W=warp(X,s,dx,dy,Bp.shape[:2]); fw=~bgmask(W); gw=warp(np.dstack([igX*255.]*3),s,dx,dy,Bp.shape[:2])[...,1]>128
        m=reg&~gw; both=fw&fb&m; d=np.abs(W-Bp).sum(-1)
        return ((d<70)&both)[::step,::step].sum()-((d>=70)&both)[::step,::step].sum()-((fw^fb)&m)[::step,::step].sum()
    best=None
    for s in np.arange(srange[0],srange[1],.01):
        for ddy in range(-6,7,3):
            for ddx in range(-6,7,3):
                dx=xa-s*xx+ddx; dy=ya-s*yx+ddy; v=score(s,dx,dy,2)
                if best is None or v>best[0]: best=(v,s,dx,dy)
    v,s,dx,dy=best; best=None
    for s2 in (s-.005,s,s+.005):
        for ddy in (-2,-1,0,1,2):
            for ddx in (-2,-1,0,1,2):
                v=score(s2,dx+ddx,dy+ddy,1)
                if best is None or v>best[0]: best=(v,s2,dx+ddx,dy+ddy)
    return best[1],best[2]-P,best[3]-P
def skullw(sp):
    fg=~bgmask(sp); h=fg.shape[0]; w=fg.sum(axis=1); return float(w[int(h*.10):int(h*.30)].max())
