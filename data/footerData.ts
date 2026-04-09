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
    consultationHours: "평일 14:00 ~ 22:00 / 주말 09:00 ~ 22:00",
  } as const,

  /**
   * 교육관 정보: 외고관(P·M·S) / 입시관으로 구분.
   */
  campusGroups: [
    {
      groupName: "외고관",
      locations: [
        { name: "P(프리미엄)관", address: "강남구 도곡로77길 14 양지빌딩, 2층", phone: "02-562-8787" },
        { name: "M관", address: "강남구 도곡로77길 5 유성빌딩, 2·3층", phone: "02-562-5757" },
        { name: "S관", address: "강남구 대치동 929-11", phone: "02-562-5759" },
      ],
    },
    {
      groupName: "입시관",
      locations: [
        { address: "강남구 도곡로77길 5 유성빌딩, 3층", phone: "02-562-5759" },
      ],
    },
  ] as const,

  /** 법적 정보 */
  legal: {
    businessNumber: "사업자등록번호: 592-87-01265",
    reportingAgency: "신고기관명: 서울시 강남서초교육지원청",
    copyright: "Copyright(c) 대치위더스학원 All right Reserved.",
  } as const,
} as const;
