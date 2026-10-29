# 월세날까지

서울에서 월세날까지 30일을 버티는 도트 생존 웹게임입니다. https://wolseday.com

취준생 윤서, 한부모 정민, 폐업한 사장님 상철 중 한 명을 골라 한 달을 삽니다. 돈만이 아니라 시간, 몸, 사람 사이의 관계까지 함께 바닥나는 구조를 게임으로 옮겼습니다.

## 파일

| 파일 | 내용 |
|---|---|
| `index.html` | 게임 전체 (HTML, CSS, JS 한 파일) |
| `og.png` | 링크 공유 미리보기 이미지 (1200×630) |
| `favicon.ico`, `favicon-16.png`, `favicon-32.png` | 브라우저 탭 아이콘 |
| `apple-touch-icon.png`, `icon-512.png` | 홈 화면 아이콘 |

## 배포

빌드 과정이 없는 정적 사이트입니다. Cloudflare Pages에 이 저장소를 연결하고 빌드 설정은 비워둡니다.

- 프레임워크 프리셋: 없음
- 빌드 명령: 없음
- 빌드 출력 디렉터리: `/`

`main` 브랜치에 push하면 자동으로 배포됩니다.

## 실시간 접속자 수 (`live/`)

`live/`는 접속자 수를 세는 Cloudflare Worker입니다. Durable Object 하나가 모든 접속을 WebSocket으로 받아 `{"online": N}`만 돌려줍니다.

- 주소: `wss://live.wolseday.com/ws`
- 허용 출처: wolseday.com, www.wolseday.com, *.wolseday.pages.dev, localhost
- 배포: Cloudflare Workers Builds가 `live/` 폴더를 `npx wrangler deploy`로 배포합니다.
- 비용: 무료 플랜 안에서 동작합니다. 대기 중인 접속은 하이버네이션으로 비용이 거의 들지 않고, 30초 ping은 자동 응답으로 처리합니다.

## 로컬에서 실행

`index.html`을 브라우저로 열면 게임이 됩니다. 접속자 수까지 시험하려면:

```
cd live && npm install && npx wrangler dev
python3 -m http.server 8790   # 저장소 루트에서
# http://localhost:8790/?live=ws://127.0.0.1:8787/ws 로 접속
```
