/**
 * Footer에 표시되는 텍스트 데이터.
 * 전화번호, 주소 등은 여기서 수정하면 됩니다.
 */
export const footerData = {
  /** 상단 링크 바 링크 (표시 텍스트, href) */
  topLinks: [
    { label: "개인정보처리방침", href: "/privacy", bold: true },
    { label: "이용약관", href: "/terms", bold: false },
    { label: "교습비", href: "/tuition", bold: false },
  ] as const,

  /** 브랜드 영역 */
  brand: {
    name: "대치위더스학원",
    mainPhone: "02-562-8787",
    academyRegistration: "학원설립·운영 등록번호: 제10388호",
    mainAddress: "서울시 강남구 도곡로77길 14 양지빌딩 2층(대치동 932-3)",
    consultationHours: "상담시간: 평일 10:00 ~ 21:00 / 주말 10:00 ~ 18:00",
  } as const,

  /** 캠퍼스 정보 (프리미엄관, M관, 입시관) */
  campuses: [
    {
      name: "프리미엄(외고/특목)관",
      fullName: "대치위더스프리미엄관 학원",
      phone: "02-562-8787",
      address: "강남구 도곡로77길 14\n(대치동, 양지빌딩, 2층)",
      registrationNumber: "제12945호",
    },
    {
      name: "M(외고/특목)관",
      fullName: "대치위더스M관학원",
      phone: "02-562-5757",
      address: "강남구 도곡로77길 5\n(대치동, 유성빌딩, 2·3층)",
      registrationNumber: "제13258호",
    },
    {
      name: "입시(수학/과학)관",
      fullName: "대치위더스 입시관 학원",
      phone: "02-562-5759",
      address: "강남구 도곡로77길 5\n(대치동, 유성빌딩, 3층)",
      registrationNumber: "제10388호",
    },
  ] as const,

  /** 법적 정보 (우측 하단) */
  legal: {
    businessNumber: "사업자등록번호: 592-87-01265",
    reportingAgency: "신고기관명: 서울시 강남서초교육지원청",
    copyright: "Copyright(c) 대치위더스학원 All right Reserved.",
  } as const,
} as const;
