/** 세부 시간표(강의 리스트) 도메인 타입 */
export const DETAIL_CATEGORY_FILTERS = [
  "전체",
  "수학",
  "국어",
  "영어",
  "통과",
  "통사/한국사",
  "독일어",
  "스페인어",
  "일본어",
  "중국어",
  "프랑스어",
] as const;

export type DetailCategoryFilter = (typeof DETAIL_CATEGORY_FILTERS)[number];
export type DetailCategory = Exclude<DetailCategoryFilter, "전체">;

export const SECOND_LANGUAGE_CATEGORIES = [
  "독일어",
  "스페인어",
  "일본어",
  "중국어",
  "프랑스어",
] as const;

export interface ScheduleCourseItem {
  id: string;
  school: string;
  grade: 1 | 2 | 3;
  category?: DetailCategory;
  displayOrder?: number;
  instructorName: string;
  subject: string;
  teachingStyle: string;
  schedule: string;
  videoUrl?: string;
  profileImg?: string;
  courseTitle?: string;
  startDate?: string;
  status?: string;
}

export const DEFAULT_BRIEFING_VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";
