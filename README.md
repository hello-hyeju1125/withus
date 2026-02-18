# 위더스 학원 홈페이지

대치동 프리미엄 학원 **위더스** 공식 홈페이지입니다.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**

## 디자인 톤앤매너

- 프리미엄 · 신뢰 · 깔끔함
- 모바일 퍼스트, 반응형 (xs ~ xl)

## 프로젝트 구조

```
withus/
├── app/
│   ├── layout.tsx    # 전역 레이아웃 (Header, Navbar, FloatingBar 포함)
│   ├── page.tsx      # 메인 페이지
│   └── globals.css   # 전역 스타일
├── components/
│   ├── Header.tsx        # 로고 (중앙 정렬)
│   ├── Navbar.tsx        # 전체보기 | 시간표 | 설명회 | 공지사항 | 오시는길
│   ├── SchoolSelector.tsx # 대원외고 | 한영외고 | 일반고 | 개인팀수업 (박스형 버튼)
│   ├── PromoBanners.tsx  # 배너 이미지 2개 영역
│   ├── InfoSection.tsx   # 강사진, 근무시간, 교육관, 상담문의 버튼
│   └── FloatingBar.tsx   # 우측 플로팅 (문자 신청, 상담 문의)
├── public/           # 정적 파일 (이미지 등)
└── ...
```

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 배너 이미지 연결

`app/page.tsx`에서 `PromoBanners`에 이미지 경로를 넘기면 됩니다.

```tsx
<PromoBanners
  banner1Src="/banner1.jpg"
  banner1Href="/promo1"
  banner2Src="/banner2.jpg"
  banner2Href="/promo2"
/>
```

이미지는 `public/` 폴더에 넣고 경로는 `/파일명` 형태로 지정하세요.
