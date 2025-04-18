# TEAM1 - 리플레이 ▶️

## 🔄 REPLAY(리플레이) (25.03.26~25.04.18) 🔗 [배포 주소](https://replay-deploy.netlify.app/)

- 이 서비스는 게이머들이 게임 관련 유튜브 영상을 효율적으로 관리하고 공유할 수 있는 플랫폼입니다. 사용자는 게임 카테고리별로 플레이리스트를 생성하고, 좋아하는 게임 영상을 저장하며, 다른 사용자들과 플레이리스트를 공유할 수 있습니다. 각 플레이리스트에는 댓글 시스템을 통해 게이머들 간의 소통이 가능하며, 구독 기능을 통해 관심 있는 플레이리스트의 업데이트를 받아볼 수 있습니다. 특히 게임 카테고리별 필터링과 무한 스크롤을 통해 사용자가 원하는 콘텐츠를 쉽게 찾을 수 있도록 하였으며, YouTube Data API를 활용하여 실시간으로 영상 정보를 제공합니다. 또한 Framer Motion을 활용한 부드러운 애니메이션과 스켈레톤 UI를 통해 사용자에게 쾌적한 브라우징 경험을 제공합니다.

![목업](https://github.com/user-attachments/assets/fa641f2b-4b32-4439-bb10-26a3536144f6)

## 📱 페이지별 구현 기능

### 🏠 홈페이지 (Home)
- **게임 카테고리 필터링**
  - 게임 리스트 기반 카테고리 선택
  - 선택된 카테고리별 플레이리스트 표시
- **무한 스크롤**
  - Intersection Observer를 활용한 무한 스크롤
  - 스켈레톤 UI로 로딩 상태 표시
- **애니메이션 효과**
  - Framer Motion을 활용한 부드러운 전환 효과
  - 카테고리 변경 시 애니메이션 처리

### 📋 플레이리스트 상세 (PlaylistDetail)
- **비디오 플레이어**
  - YouTube 비디오 재생 기능
  - 썸네일/플레이어 전환 처리
- **플레이리스트 정보**
  - 제목, 설명, 해시태그 표시
  - 공개/비공개 상태 관리
  - 생성일자, 비디오 수 표시
- **댓글 시스템**
  - 팝업 형태의 댓글 인터페이스
  - 댓글 수 실시간 표시
  - 작성자 정보 연동

### 🎵 플레이리스트 폼 (PlaylistForm)
- **플레이리스트 생성/수정**
  - 기본 정보 입력 (제목, 설명)
  - 해시태그 설정
  - 공개 여부 설정
- **비디오 관리**
  - YouTube URL 입력으로 비디오 추가
  - 썸네일 자동 생성
  - 비디오 순서 관리

### 👤 프로필 (Profile)
- **프로필 정보**
  - 사용자 기본 정보 표시
  - 프로필 이미지 관리
  - 닉네임 설정
- **플레이리스트 관리**
  - 생성한 플레이리스트 목록
  - 구독 중인 플레이리스트
  - 플레이리스트 상태 관리

### 🔐 로그인/회원가입 (Login/Signup)
- **인증 기능**
  - 이메일/비밀번호 로그인
  - 회원가입 폼
  - 로그인 상태 유지
- **보안**
  - 유효성 검사
  - 에러 처리
  - 인증 상태 관리


각 페이지는 React Query를 활용한 데이터 관리와 Framer Motion을 통한 애니메이션으로 최적화되어 있으며, 스켈레톤 UI를 통해 부드러운 로딩 경험을 제공합니다.


## 🔧 Tech

<div align="center">

|      Type       |                                                                                                                  Tool                                                                                                                   |
| :-------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     Library     |                   ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black) ![VITE](https://img.shields.io/badge/VITE-646CFF?style=for-the-badge&logo=Vite&logoColor=white)                    |
|    Language     |                                                          ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=black)                                                          |
|     Styling     |                                                          ![TailwindCSS](https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)                                                           |
|  State Management  |          ![TanStack Query](https://img.shields.io/badge/tanstack%20query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)           |
|   Backend    |           ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)            |
|   Animation    |           ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)            |
|   Testing    |           ![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)            |
|   Formatting    |           ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)            |
| Package Manager |                                                                      ![Npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)                                                                       |
| Version Control |            ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)             |

</div>

## 🔩 프로젝트 설정 및 실행 방법

### 1. 프로젝트 클론하기

```bash
git clone https://github.com/your-username/playlist-app.git
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 필요한 환경 변수를 설정합니다:

```bash
# Supabase 설정
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# YouTube API 설정
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

### 3. 의존성 설치

```bash
npm install
```

### 4. 개발 서버 실행

```bash
npm run dev
```

## 📂 프로젝트 구조

```bash
📁 src/
├─📁 assets/          # 이미지, 아이콘 등의 정적 자원
├─📁 pages/          
│  ├─📁 (페이지명)/     # 페이지별
│    ├── 📁 components/    # UI 컴포넌트
│    ├── 📁 hooks/         # hook로직
│    ├── 📁 stores/        # Zustand 스토어
│    ├── 📁 queries/       # React Query
│    ├── 📁 services/      # API 관련 함수
│    └── 📁 model/         # 타입, 상수, 유틸 등
├─📁 shared/         # 공통
│ ├── 📁 components/    # 공통 UI
│ └── 📁 ui/            # shadcn 컴포넌트
│ ├── 📁 hooks/         # hook로직
│ ├── 📁 stores/        # Zustand 스토어
│ ├── 📁 queries/       # React Query
│ ├── 📁 services/      # API 관련 함수
│ └── 📁 model/         # 타입, 상수, 유틸 등
├── 📁 router/      # 라우터
└── 📄 App.tsx
```

## ⭐️ About Team

> 패스트캠퍼스 데브캠프 : 김민태의 프론트엔드 개발 3기 3팀

- 팀명: 리플레이 (REPLAY)
- 팀소개: Replay는 한 번의 번뜩임에 머물지 않습니다. 시행착오를 겪으며 ‘(Replay)’하여 개선해 나갑니다.
- 팀목표: 사용자가 불편함을 느끼지 않게 만들자!

<div align="center">

| [<img src="https://avatars.githubusercontent.com/u/148299246?v=4/u/150745130?v=4" width="200" height="200"/>](https://github.com/j0n0m2) | [<img src="https://avatars.githubusercontent.com/u/67031524?v=4" width="200" height="200"/>](https://github.com/gkfla668) | [<img src="https://avatars.githubusercontent.com/u/103265086?v=4/u/173143133?v=4" width="200" height="200"/>](https://github.com/jungHyeonS) |
| :-----------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: |
| **🐔 [조유나](https://github.com/j0n0m2)** | **🐤 [양정규](https://github.com/jungkyuYang)** | **🐤 [유정훈](https://github.com/jungHyeonS)** |

</div>

## ✉️ Conventions

### 커밋 컨벤션

- `Feat`: 기능 (새로운 기능)
- `Fix`: 버그 (버그 수정)
- `Refactor`: 리팩토링
- `Design`: CSS 등 사용자 UI 디자인 변경
- `Comment`: 필요한 주석 추가 및 변경
- `Style`: 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)
- `Docs`: 문서 수정 (문서 추가, 수정, 삭제, README)
- `Test`: 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)
- `Chore`: 기타 변경사항 (빌드 스크립트 수정, assets, 패키지 매니저 등)
- `Init`: 초기 생성
- `Rename`: 파일 혹은 폴더명을 수정하거나 옮기는 작업만 한 경우
- `Remove`: 파일을 삭제하는 작업만 수행한 경우

### 파일 컨벤션

- 컴포넌트: PascalCase (예: `PlaylistCard.tsx`)
- 훅스/유틸리티: camelCase (예: `usePlaylist.ts`)
- 상수: UPPER_SNAKE_CASE (예: `API_ENDPOINTS.ts`)

### 코드 컨벤션

- 함수형 컴포넌트: `const Component = () => {}`
- 타입: `interface` 사용 (예: `interface PlaylistProps`)
- 상수: `const CONSTANT_NAME`
- 변수/함수: camelCase
- CSS: Tailwind CSS 클래스 사용
