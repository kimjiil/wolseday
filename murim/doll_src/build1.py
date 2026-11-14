import numpy as np, pickle, time
from parts import *
t0=time.time()
SH={k:load(k) for k in ['m8','f8','c_m_vest','c_m_armor','c_f_vest','c_f_armor','h_topknot','h_pony','h_messy','h_short','h_braid','h_longhalf','h_twin','h_lowbun','h_bob','h_scholar']}
C={k:crops8(v) for k,v in SH.items()}
HAIRS=['topknot','pony','messy','short','braid','longhalf','twin','lowbun','bob','scholar']
OUT={'f':{},'frame':{},'body':{},'hairhi':{},'tf':{}}
for sex in 'mf':
    base=SH[sex+'8']; OUT['f'][sex]=SKULL/skullw(tight(base,C[sex+'8'][0]))
    for p in range(8):
        B=tight(base,C[sex+'8'][p]); h,w=B.shape[:2]; shape=(h+PADT+PADB,w+2*PADX)
        OUT['frame'][(sex,p)]=shape; OUT['body'][(sex,'plain',p)]=place(B,shape,PADX,PADT)
        for cl in ('vest','armor'):
            X=tight(SH[f'c_{sex}_{cl}'],C[f'c_{sex}_{cl}'][p]); s,dx,dy=align(B,X,'feet',region=lambda a:np.arange(a.shape[0])[:,None]<a.shape[0]*.5+np.zeros((1,a.shape[1]),bool))
            OUT['body'][(sex,cl,p)]=warp(X,s,dx+PADX,dy+PADT,shape); OUT['tf'][(sex,cl,p)]=(round(s,3),round(dx,1),round(dy,1))
    print(sex,'몸·옷',round(time.time()-t0),'s',[OUT['tf'][(sex,'armor',p)] for p in range(8)])
# 머리: 남자 몸 위에 그린 것을 남자 틀로 맞추고, 여자 틀로는 민머리끼리 머리를 맞춰 옮긴다
for p in range(8):
    Bm=tight(SH['m8'],C['m8'][p]); Bf=tight(SH['f8'],C['f8'][p])
    s2,dx2,dy2=align(Bf,Bm,'head',region=lambda a:np.arange(a.shape[0])[:,None]<a.shape[0]*.55+np.zeros((1,a.shape[1]),bool),srange=(.94,1.08))
    OUT['tf'][('m2f',p)]=(round(s2,3),round(dx2,1),round(dy2,1))
    for hn in HAIRS:
        X=tight(SH['h_'+hn],C['h_'+hn][p]); s,dx,dy=align(Bm,X,'feet',ign=lambda a:dil(green(a)|cyan(a),6))
        OUT['tf'][(hn,p)]=(round(s,3),round(dx,1),round(dy,1))
        OUT['hairhi'][('m',hn,p)]=warp(X,s,dx+PADX,dy+PADT,OUT['frame'][('m',p)])
        # 여자 틀: 머리 그림 → 남자 조각 좌표 → 여자 조각 좌표
        S=s*s2; DX=dx*s2+dx2; DY=dy*s2+dy2
        OUT['hairhi'][('f',hn,p)]=warp(X,S,DX+PADX,DY+PADT,OUT['frame'][('f',p)])
    print('자세',p,'머리 맞춤',round(time.time()-t0),'s m2f',OUT['tf'][('m2f',p)],[OUT['tf'][(h,p)] for h in HAIRS[:3]])
pickle.dump(OUT,open('hi.pkl','wb'))
