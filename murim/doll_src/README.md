# 그림 부품 만드는 스크립트

`game/83_doll_data.js` 를 만든다. 원본 그림(Higgsfield 1K 캡처, 935×935)은 저장소에 넣지 않았다.

1. `build1.py` — 원본 시트를 자세 8개로 자르고(`split.py`), 머리통 폭으로 배율을 정하고, 옷·머리 그림을 기준 몸에 맞춘다(`parts.py` 의 `align`). → `hi.pkl`
2. `lowres.py` — 도트로 줄이고(`px.py` 의 `pixelize`), 바꿔 칠할 자리를 열쇠 색으로 바꾸고, 눈 자리를 찾는다. → `lo.pkl`
3. `weapons.py` — 무기 시트를 잘라 쥐는 각도 4가지로 줄인다. → `weap.pkl`
4. `export.py` — 부품을 한 장에 모아 `game/83_doll_data.js` 로 쓴다

원본 파일 이름: `m8.png` `f8.png`(기준 몸), `c_{m,f}_{vest,armor}.png`(옷), `h_<머리>.png`(머리, 남자 몸 위에 그림), `w_swords.png` `w_sabers.png`
