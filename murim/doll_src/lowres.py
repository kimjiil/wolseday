import numpy as np, pickle, json, base64, io
from PIL import Image
from parts import *
from px import pixelize, bgmask, isline
H=pickle.load(open('hi.pkl','rb'))
HAIRS=['topknot','pony','messy','short','braid','longhalf','twin','lowbun','bob','scholar']
def lum(c): return c[...,0]*.3+c[...,1]*.55+c[...,2]*.15
LINE=(52,34,34)
KEEP_EYES=True      # AI 가 그린 원래 눈을 남긴다(손으로 찍은 눈은 따로 고를 때만)
def despeckle(sp):
    o=sp.copy(); a=sp[...,3]>0; Hh,W=a.shape
    for y in range(1,Hh-1):
        for x in range(1,W-1):
            if not a[y,x]: continue
            nb=[tuple(sp[y+dy,x+dx]) for dy,dx in ((1,0),(-1,0),(0,1),(0,-1))]
            if all(n[3]>0 for n in nb) and len(set(nb))==1 and nb[0]!=tuple(sp[y,x]): o[y,x]=nb[0]
    return o
def edge(a):
    P=np.pad(a,1); return a&~(P[:-2,1:-1]&P[2:,1:-1]&P[1:-1,:-2]&P[1:-1,2:])
def pal_of(frames,n=40):
    px=np.concatenate([f[~bgmask(f)] for f in frames]).astype(np.uint8)      # 선과 눈동자 같은 어두운 색도 색표에 넣는다
    q=Image.fromarray(px.reshape(1,-1,3),'RGB').quantize(n,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
    return np.array(q.getpalette()[:n*3]).reshape(-1,3).astype(float)
def snap(lo,pal):
    a=lo[...,:3].astype(float); d=((a[:,:,None,:]-pal[None,None])**2).sum(-1); o=lo.copy(); o[...,:3]=pal[d.argmin(-1)]; return o
# 바꿔 칠할 자리: 옷 파랑 3단, 띠 빨강 3단을 정해진 열쇠 색으로
KEY_ROBE=[(0,0,250),(0,0,200),(0,0,150)]; KEY_SASH=[(250,0,0),(200,0,0),(150,0,0)]; KEY_HAIR=[(0,250,0),(0,200,0),(0,150,0)]
def keyed_body(lo):
    """옷 파랑·띠 빨강을 열쇠 색 세 단계로. 처음 시안처럼 색표의 색마다 밝기 순서로 단계를 정한다(점이 튀지 않게)"""
    o=lo.copy(); r,g,b=[lo[...,i].astype(int) for i in range(3)]; a=lo[...,3]>0
    ys=np.where(a.any(axis=1))[0]; neck=ys.min()+int((ys.max()-ys.min())*.5); a=a.copy(); a[:neck]=False      # 입·볼은 옷이 아니다
    for m,keys in ((a&(b>r+40)&(b>g+10),KEY_ROBE),(a&(r>g+70)&(r>b+50),KEY_SASH)):
        if m.sum()<2: continue
        cols=np.unique(lo[m][:,:3],axis=0); L=lum(cols.astype(float)); order=np.argsort(-L); n=len(cols)
        for rank,i in enumerate(order):
            k=min(2,int(rank*3/max(1,n))) if n>=3 else (0 if rank==0 else 2) if n==2 else 1
            mm=m&(lo[...,:3]==cols[i]).all(-1); o[mm,:3]=keys[k]
    return despeckle(o)
def is_skin(c): r,g,b=[c[...,i].astype(int) for i in range(3)]; return (c[...,3]>0)&(r>190)&(g>140)&(b>95)&(r>b+30)&(g<r)
# 원래 그림 눈 모양을 본뜬 도장: d 눈동자 · W 눈빛 · b 아래쪽 밝은 눈동자 · . 살
EYE_FRONT=['ddd','Wdd','ddd','ddd','dbd','bbb']
EYE_SIDE=['dd','Wd','dd','dd','bd','bb']
def clean_eyes(lo,p,comps):
    """줄이면서 좌우가 달라진 눈을 같은 모양으로 다시 찍는다(정면·옆). 싸우는 자세의 성난 눈은 그대로"""
    if p not in (0,1,4,5) or not comps: return lo
    if p in (0,1) and len(comps)!=2: return lo
    o=lo.copy(); sk=lo[is_skin(lo)]; skin=np.median(sk[:,:3],axis=0).astype(np.uint8) if len(sk) else np.array([240,200,160],np.uint8)
    allp=np.concatenate(comps); px=lo[allp[:,0],allp[:,1],:3].astype(int); L=px[:,0]*.3+px[:,1]*.55+px[:,2]*.15
    d=px[L<=np.percentile(L,25)].mean(0).astype(np.uint8); mid=px[(L>np.percentile(L,40))&(L<170)]
    b=mid.mean(0).astype(np.uint8) if len(mid) else np.array([120,80,56],np.uint8)
    if b.astype(int)[0]*.3+b.astype(int)[1]*.55+b.astype(int)[2]*.15<75: b=((d.astype(int)+np.array([150,96,62]))//2).astype(np.uint8)      # 아래쪽 눈동자는 조금 밝게
    C={'d':d,'W':np.array([255,255,255],np.uint8),'b':b}
    boxes=[]
    for c in comps:
        y0,x0=c.min(0); y1,x1=c.max(0)
        for yy in range(y0-1,y1+2):
            for xx in range(x0-1,x1+2):
                if 0<=yy<o.shape[0] and 0<=xx<o.shape[1] and o[yy,xx,3]>0:
                    v=o[yy,xx,:3].astype(int); lv=v[0]*.3+v[1]*.55+v[2]*.15
                    if lv<175 or v.min()>225: o[yy,xx,:3]=skin
        boxes.append((y0,y1,x0,x1))
    st=EYE_FRONT if p in (0,1) else EYE_SIDE; w=len(st[0]); h=len(st)
    if p in (0,1):
        (a0,a1,ax0,ax1),(b0,b1,bx0,bx1)=sorted(boxes,key=lambda t:t[2]); cl=(ax0+ax1)/2; cr=(bx0+bx1)/2; mid_=(cl+cr)/2; half=round((cr-cl)/2)
        bot=max(a1,b1); xs=[int(round(mid_-half-(w-1)/2)),int(round(mid_+half-(w-1)/2))]
    else:
        (a0,a1,ax0,ax1)=boxes[0]; bot=a1; xs=[int(round((ax0+ax1)/2-(w-1)/2))]
    for x0 in xs:
        for j in range(h):
            for i in range(w):
                ch=st[j][i]
                if ch=='.': continue
                yy=bot-h+1+j; xx=x0+i
                if 0<=yy<o.shape[0] and 0<=xx<o.shape[1] and o[yy,xx,3]>0: o[yy,xx,:3]=C[ch]
    return o
def eyes_of(lo,p):
    """얼굴 안쪽의 어두운 덩어리(높이 2 이상)를 눈으로 본다. 지우고 자리만 남긴다"""
    if p in (2,3): return lo,[]
    a=lo[...,3]>0; h=a.shape[0]; ys=np.where(a.any(axis=1))[0]; top=ys.min(); head=top+int((ys.max()-top)*.52)
    dark=a&(lum(lo[...,:3].astype(float))<150)&~is_skin(lo); dark[head:]=False; dark[:top+3]=False
    # 바깥 테두리와 닿은 것은 뺀다
    P=np.pad(~a,1); near=(P[:-2,1:-1]|P[2:,1:-1]|P[1:-1,:-2]|P[1:-1,2:])
    from collections import deque
    seen=np.zeros_like(dark); comps=[]
    for y in range(lo.shape[0]):
        for x in range(lo.shape[1]):
            if dark[y,x] and not seen[y,x]:
                q=deque([(y,x)]); seen[y,x]=1; pts=[]
                while q:
                    cy,cx=q.popleft(); pts.append((cy,cx))
                    for ny,nx in ((cy+1,cx),(cy-1,cx),(cy,cx+1),(cy,cx-1)):
                        if 0<=ny<lo.shape[0] and 0<=nx<lo.shape[1] and dark[ny,nx] and not seen[ny,nx]: seen[ny,nx]=1; q.append((ny,nx))
                P2=np.array(pts); hh=P2[:,0].max()-P2[:,0].min()+1; ww=P2[:,1].max()-P2[:,1].min()+1
                if hh>=3 and not any(near[y2,x2] for y2,x2 in pts) and 5<=len(pts)<=30: comps.append(P2)
    fixed=[]
    for c in comps:                       # 눈썹과 붙은 눈은 아래 6줄만 눈으로 본다
        y1=c[:,0].max()
        if c[:,0].max()-c[:,0].min()+1>6: c=c[c[:,0]>=y1-5]
        fixed.append(c)
    comps=sorted(fixed,key=lambda c:-len(c))[:2 if p in (0,1,6,7) else 1]
    if KEEP_EYES: return clean_eyes(lo,p,comps),[[float((c[:,1].min()+c[:,1].max())/2),int(c[:,0].min()),int(c[:,0].max()-c[:,0].min()+1)] for c in comps]
    o=lo.copy(); sk=lo[is_skin(lo)]; skin=tuple(np.median(sk[:,:3],axis=0).astype(int)) if len(sk) else (240,200,160)
    boxes=[]
    for c in comps:
        y0,x0=c.min(0); y1,x1=c.max(0)
        for yy in range(y0-1,y1+2):            # 눈과 그 둘레 흰 점(눈빛)까지 지운다
            for xx in range(x0-1,x1+2):
                if 0<=yy<o.shape[0] and 0<=xx<o.shape[1] and o[yy,xx,3]>0:
                    v=o[yy,xx,:3].astype(int)
                    if (yy,xx) in set(map(tuple,c.tolist())) or (y0<=yy<=y1 and x0<=xx<=x1) or (v.min()>200 and abs(int(v[0])-int(v[2]))<40): o[yy,xx,:3]=skin
        boxes.append([int((x0+x1)/2*2)/2,int(y0),int(y1-y0+1)])
    boxes.sort(); return o,boxes
def feet_anchor(a):
    ys=np.where(a.any(axis=1))[0]; yb=ys.max(); band=a[max(0,yb-5):yb+1]; xs=np.where(band.any(axis=0))[0]; return int(yb),(xs.min()+xs.max())/2
def fist(lo,p):
    s=is_skin(lo); a=lo[...,3]>0; ys=np.where(a.any(axis=1))[0]; top,bot=ys.min(),ys.max(); h=bot-top
    band=s.copy(); band[:top+int(h*.42)]=False; band[top+int(h*.8):]=False
    xs=np.where(band.any(axis=0))[0]
    if not len(xs): return None
    xm=xs.max(); pts=np.argwhere(band&(np.arange(lo.shape[1])[None,:]>=xm-2)); return [float(pts[:,1].mean()),float(pts[:,0].mean())]
OUT={'bodies':{},'hair':{},'meta':{}}
for sex in 'mf':
    f=H['f'][sex]
    for cl in ('plain','vest','armor'):
        frames=[H['body'][(sex,cl,p)] for p in range(8)]; pal=pal_of(frames)
        for p in range(8):
            lo,_=pixelize(frames[p],f); lo=snap(lo,pal); lo=despeckle(lo); a=lo[...,3]>0; lo[edge(a),:3]=LINE
            lo,eyes=eyes_of(lo,p); lo=keyed_body(lo)
            OUT['bodies'][(sex,cl,p)]=lo
            if cl=='plain':
                yb,xc=feet_anchor(a); OUT['meta'][(sex,p)]={'foot':[xc,yb],'fist':fist(lo,p),'top':int(np.where(a.any(axis=1))[0].min())}
            OUT['meta'][(sex,cl,p,'eyes')]=eyes
    print(sex,'몸 끝', [OUT['meta'][(sex,p)] for p in (0,6,7)])
for sex in 'mf':
    f=H['f'][sex]
    for hn in HAIRS:
        for p in range(8):
            W=H['hairhi'][(sex,hn,p)]; base=H['body'][(sex,'plain',p)]; g=green(W); c=cyan(W)
            fr=(g|c) if p in (2,3) else g; bk=np.zeros_like(g) if p in (2,3) else c
            ln=isline(W)&~bgmask(W)&dil(g|c,6)&~(isline(base)&~bgmask(base)); lnf=ln&(dil(fr,6)); lnb=ln&~lnf&dil(bk,6)
            for nm,m in (('f',fr|lnf),('b',bk|lnb)):
                if m.sum()<40: OUT['hair'][(sex,hn,p,nm)]=None; continue
                hi=np.zeros_like(W); hi[...]=(255,0,255); hi[m]=W[m]; lo,_=pixelize(hi,f); a=lo[...,3]>0
                r,gg,b=[lo[...,i].astype(int) for i in range(3)]; key=a&(gg>r+25)
                o=np.zeros_like(lo); L=gg.astype(float)
                o[key&(L>=205),:3]=KEY_HAIR[0]; o[key&(L<205)&(L>=140),:3]=KEY_HAIR[1]; o[key&(L<140),:3]=KEY_HAIR[2]
                o[a&~key,:3]=LINE; o[a,3]=255
                ed=edge(a); o[ed,:3]=LINE
                OUT['hair'][(sex,hn,p,nm)]=o
    print(sex,'머리 끝')
pickle.dump(OUT,open('lo.pkl','wb'))
