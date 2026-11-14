import numpy as np
from px import load,bgmask
def crops8(a,minw=20):
    """2줄 × 4칸 시트를 자세 8개로 자른다. 위 줄 왼쪽부터 0~3, 아래 줄 4~7"""
    fg=~bgmask(a); rows=fg.any(axis=1); H=a.shape[0]
    # 가운데쯤의 빈 띠로 위·아래 줄을 나눈다
    mid=None; best=0; y=int(H*.3)
    while y<int(H*.75):
        if not rows[y]:
            y2=y
            while y2<H and not rows[y2]: y2+=1
            if y2-y>best: best=y2-y; mid=(y+y2)//2
            y=y2
        y+=1
    out=[]
    for (r0,r1) in ((0,mid),(mid,H)):
        sub=fg[r0:r1]; cols=sub.any(axis=0); runs=[]; st=None
        for i,v in enumerate(cols):
            if v and st is None: st=i
            if not v and st is not None:
                if i-st>minw: runs.append([st,i])
                st=None
        if st is not None: runs.append([st,len(cols)])
        while len(runs)>4:
            g=[runs[i+1][0]-runs[i][1] for i in range(len(runs)-1)]; k=int(np.argmin(g)); runs[k][1]=runs[k+1][1]; del runs[k+1]
        for x0,x1 in runs:
            ys=np.where(sub[:,x0:x1].any(axis=1))[0]; out.append((x0,r0+int(ys.min()),x1,r0+int(ys.max())+1))
    return out
if __name__=='__main__':
    import glob
    for f in sorted(glob.glob('*.png')):
        if f.startswith('w_'): continue
        a=load(f[:-4]); C=crops8(a); print(f,len(C),[(c[2]-c[0],c[3]-c[1]) for c in C])
