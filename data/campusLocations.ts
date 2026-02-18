/**
 * 교육관 안내(Locations) 섹션용 데이터
 * 주소, 전화번호, 네이버 지도 공유(바로가기) URL
 */
export type CampusLocationId = "premium" | "m" | "entrance";

export interface CampusLocation {
  id: CampusLocationId;
  name: string;
  address: string;
  phone: string;
  /** 네이버 지도에서 보기 / iframe src 로 사용 */
  naverMapUrl: string;
}

export const campusLocations: CampusLocation[] = [
  {
    id: "premium",
    name: "프리미엄 관",
    address: "도곡로 77길 14 (양지빌딩 2층)",
    phone: "02-562-8787",
    naverMapUrl: "https://naver.me/GypQ6lbW",
  },
  {
    id: "m",
    name: "M 관",
    address: "도곡로 77길 5 (유성빌딩 2층)",
    phone: "02-562-5757",
    naverMapUrl: "https://naver.me/FgEeU654",
  },
  {
    id: "entrance",
    name: "입시관",
    address: "도곡로 77길 5 (유성빌딩 3층)",
    phone: "02-562-5759",
    naverMapUrl: "https://naver.me/Gqf6Pgns",
  },
];
