# MiloDev Blog

백엔드 개발자 김민제의 기술 블로그입니다. Java, Spring, 데이터베이스, CS 학습 기록과 프로젝트 경험을 공유합니다.

**URL:** https://alswp006.github.io

## 기술 스택

| 구분 | 기술 |
|------|------|
| 정적 사이트 생성 | Jekyll 4.3 |
| 테마 | Hydejack v9 (커스터마이징) |
| 호스팅 | GitHub Pages |
| 댓글 | Utterances (GitHub Issues 기반) |
| 검색 | Tipue Search (클라이언트 사이드) |
| 수식 렌더링 | KaTeX |
| 다이어그램 | Mermaid |
| SEO | jekyll-seo-tag (JSON-LD, OG/Twitter Card 자동 생성) |

## 프로젝트 구조

```
├── _config.yml              # Jekyll 설정 (테마, 플러그인, 사이드바 메뉴)
├── _posts/                  # 블로그 포스트
│   ├── study/               # 학습 (Java, Database, CS)
│   ├── project/             # 프로젝트 (OpenSource, Devita, TradeHam, Bami)
│   ├── blog/                # 블로그 (Daily, Retrospect)
│   └── Book/                # 도서 리뷰
├── _featured_categories/    # 카테고리 페이지 정의 (17개)
├── _layouts/                # 레이아웃 템플릿
│   └── post.html            # 포스트 레이아웃 (TOC, 조회수, 댓글)
├── _includes/               # 재사용 컴포넌트
│   ├── head/meta.html       # 메타 태그, 검색 CSS/JS 조건부 로드
│   ├── body/nav.html        # 사이드바 네비게이션 (접이식 서브메뉴)
│   ├── body/menu.html       # 상단 메뉴바
│   ├── my-head.html         # Material Icons, AdSense, TOC 스크립트
│   └── toc.html             # 목차 생성
├── _sass/
│   ├── my-style.scss        # 커스텀 스타일 (아래 상세)
│   └── my-inline.scss       # 인라인 스타일
├── _data/
│   └── authors.yml          # 저자 정보 및 소셜 링크
├── assets/
│   ├── js/
│   │   ├── collapsible.js   # 펼치기/접기 토글
│   │   ├── sidebar-folder.js# 사이드바 서브메뉴 토글
│   │   └── swiper-control.js# 이미지 캐러셀
│   ├── tipuesearch/         # 검색 라이브러리
│   ├── img/                 # 이미지 (프로필, 사이드바 배경, 포스트 이미지)
│   └── icons/               # 파비콘, PWA 아이콘
├── _plugins/
│   └── fix_last_modified_at.rb  # 마지막 수정 일시 자동 계산
├── search.html              # 검색 페이지
├── index.md                 # 홈페이지
└── Gemfile                  # Ruby 의존성
```

## 주요 기능

### 계층적 사이드바 메뉴
- 2단계 접이식 서브메뉴 (Project, Study, Blog 등)
- 호버/포커스 시 서브메뉴 자동 표시
- 키보드 접근성 지원

### 목차 (Table of Contents)
- **데스크톱** (100em 이상): 오른쪽 사이드에 고정 표시
- **모바일**: 하단 우측 FAB(Floating Action Button)으로 토글
- 스크롤 추적으로 현재 섹션 하이라이트

### 포스트 타임라인
- 포스트 목록을 수직 타임라인 UI로 표시
- 호버 시 인터랙티브 포인트 효과

### 접근성
- 스킵 링크 (Skip to main content)
- `focus-visible` 포커스 인디케이터
- WCAG AA+ 색상 대비 충족
- ARIA 라벨 및 시맨틱 마크업

### 성능 최적화
- 이미지 리사이즈 및 압축 (프로필 100KB, 배경 182KB)
- Tipue Search CSS/JS 검색 페이지에서만 조건부 로드
- CSS 인라인화, HTML 압축
- 스크롤바 CSS 선택자 최적화 (`body` 스코프)

### 기타
- Utterances 댓글
- KaTeX 수식 렌더링
- Mermaid 다이어그램
- 펼치기/접기 콘텐츠 블록
- Swiper 이미지 캐러셀
- Hits Badge 조회수 표시
- RSS 피드, 사이트맵 자동 생성

## 로컬 실행

```bash
# 의존성 설치
bundle install

# 개발 서버 실행
bundle exec jekyll serve

# http://localhost:4000 에서 확인
```

## 카테고리 구조

```
├── Project
│   ├── OpenSource
│   ├── Devita
│   ├── TradeHam
│   └── Bami
├── Study
│   ├── Java
│   ├── Spring
│   ├── Database
│   ├── CS
│   └── Study-etc
├── Blog
│   ├── Daily
│   ├── Book-Review
│   ├── Retrospect
│   └── Blog-etc
└── Book
```
