# QUICK_START.md

## 빠른 시작 가이드

이 문서는 lol-team-helper 프로젝트를 빠르게 시작하는 방법을 안내합니다.

---

## 1. 프로젝트 클론

```sh
git clone https://github.com/rlarudgh/lol-team-helper.git
cd lol-team-helper
```

## 2. 의존성 설치

```sh
yarn
```

또는

```sh
npm install
```

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래와 같이 입력하세요:

```
RIOT_API_KEY=your_riot_api_key
```

## 4. 개발 서버 실행

```sh
yarn dev
```

또는

```sh
npm run dev
```

- 브라우저에서 `http://localhost:3000` 접속

## 5. 빌드 및 배포

```sh
yarn build
```

또는

```sh
npm run build
```

## 6. 주요 폴더 설명

- `app/api/summoner/route.ts`: 소환사 정보 API
- `src/features/`: 주요 기능별 코드
- `src/entities/`: 엔티티 및 UI
- `src/shared/`: 공통 타입, API, 유틸
- `public/`: 정적 파일
- `docs/`: 문서

## 7. 참고 사항

- Riot API Key는 반드시 발급받아야 하며, 유효기간이 있습니다.

---

## 문의

- 추가 문의는 프로젝트 관리자에게 연락 바랍니다.
