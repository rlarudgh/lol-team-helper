# lol-team-helper

## 개요

lol-team-helper는 리그오브레전드 5:5 내전 팀 구성을 위해 만들어진 웹 사이트입니다.

## 주요 기술 스택

- Next.js
- TypeScript
- Riot Games API

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래와 같이 환경변수를 설정하세요:

```
RIOT_API_KEY=your_riot_api_key
```

## 주요 폴더 구조

- `app/api/summoner/route.ts`: 소환사 정보 검색 API
- `shared/api/riot-client.ts`: Riot API 클라이언트
- `features/`, `entities/`, `widgets/`: 주요 기능 및 UI 컴포넌트

## 소환사 정보 검색 및 저장

1. `/app/api/summoner/route.ts`에서 Riot API를 통해 소환사 정보를 조회합니다.
2. 조회된 player 객체를 Supabase DB의 `players` 테이블에 저장합니다.

## Supabase DB 연동

- Supabase 클라이언트는 환경변수로 설정된 URL과 Key를 사용합니다.
- player가 추가될 때 자동으로 DB에 저장됩니다.

## 개발 및 실행

1. 의존성 설치
   ```sh
   yarn
   ```
2. 개발 서버 실행
   ```sh
   yarn dev
   ```
3. 빌드
   ```sh
   yarn build
   ```

## 기타 참고 사항

- Riot API Key는 반드시 발급받아야 하며, 유효기간이 있으니 주기적으로 갱신하세요.

## 문의

- 개발 관련 문의는 프로젝트 관리자에게 연락 바랍니다.
