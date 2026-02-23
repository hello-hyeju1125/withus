"use client";

import { useState, useMemo } from "react";
import { Play } from "lucide-react";
import {
  DEFAULT_BRIEFING_VIDEO_URL,
  DETAIL_CATEGORY_FILTERS,
  SECOND_LANGUAGE_CATEGORIES,
  type DetailCategoryFilter,
  type DetailCategory,
  type ScheduleCourseItem,
} from "@/data/scheduleCourses";
import VideoModal from "@/components/VideoModal";

const GRADE_TABS = [
  { id: "all", label: "전체" },
  { id: "1", label: "고1" },
  { id: "2", label: "고2" },
  { id: "3", label: "고3" },
] as const;

type GradeFilter = (typeof GRADE_TABS)[number]["id"];

const CATEGORY_DISPLAY_LABELS: Partial<Record<DetailCategoryFilter, string>> = {
  통과: "과학",
  "통사/한국사": "사회",
};

const SUBJECT_COLORS: Record<string, string> = {
  국어: "bg-rose-100 text-rose-900 border-rose-300 ring-1 ring-rose-200/70",
  수학: "bg-sky-100 text-sky-900 border-sky-300 ring-1 ring-sky-200/70",
  영어: "bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-200/70",
  통과: "bg-violet-100 text-violet-900 border-violet-300 ring-1 ring-violet-200/70",
  "통사/한국사": "bg-emerald-100 text-emerald-900 border-emerald-300 ring-1 ring-emerald-200/70",
  독일어: "bg-indigo-100 text-indigo-900 border-indigo-300 ring-1 ring-indigo-200/70",
  스페인어: "bg-indigo-100 text-indigo-900 border-indigo-300 ring-1 ring-indigo-200/70",
  일본어: "bg-indigo-100 text-indigo-900 border-indigo-300 ring-1 ring-indigo-200/70",
  중국어: "bg-indigo-100 text-indigo-900 border-indigo-300 ring-1 ring-indigo-200/70",
  프랑스어: "bg-indigo-100 text-indigo-900 border-indigo-300 ring-1 ring-indigo-200/70",
};

function getSubjectStyle(subject: string) {
  return SUBJECT_COLORS[subject] ?? "bg-slate-100 text-slate-900 border-slate-300 ring-1 ring-slate-200/70";
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

const teacherImageMap: Record<string, string> = {
  강성현: "/profile/kang_sh_science.png",
  김경숙: "/profile/kim_ks_japanese.png",
  김일영: "/profile/kim_iy_society.png",
  남유리: "/profile/nam_yr_korean.png",
  엠마: "/profile/emma_french.png",
  이예슬: "/profile/lee_ys_english.png",
  이재령2: "/profile/lee_jr2_history.png",
  이치옥: "/profile/lee_co_math.png",
  인철우: "/profile/in_cw_spanish.png",
  채송희: "/profile/chae_sh_chinese.png",
  함형선: "/profile/ham_hs_math_en.png",
  홍영아: "/profile/hong_ya_spanish.png",
};

const teacherNameAliasMap: Record<string, string> = {
  이예솔: "이예슬",
  이재령: "이재령2",
};

function resolveTeacherImageSrc(instructorName: string, profileImg?: string) {
  if (profileImg && profileImg.trim()) return profileImg.trim();
  const direct = teacherImageMap[instructorName];
  if (direct) return direct;
  const alias = teacherNameAliasMap[instructorName];
  return alias ? teacherImageMap[alias] : undefined;
}

function isSecondLanguageCategory(value: string): value is (typeof SECOND_LANGUAGE_CATEGORIES)[number] {
  return (SECOND_LANGUAGE_CATEGORIES as readonly string[]).includes(value);
}

function resolveCourseCategory(item: ScheduleCourseItem): string {
  const category = item.category?.trim();
  const subject = item.subject?.trim();

  // Backward compatibility: old data saved as "제2외국어"
  if (category === "제2외국어") {
    if (subject) return subject;
    return category;
  }

  return category || subject || "";
}

type Props = {
  courses: ScheduleCourseItem[];
  /** 상위에서 고1/고2/고3 탭을 쓸 때 해당 학년만 고정 표시 (내부 필터 탭 숨김) */
  fixedGrade?: "1" | "2" | "3";
};

export default function ScheduleDetailList({ courses, fixedGrade }: Props) {
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<DetailCategoryFilter>("전체");
  const [videoModal, setVideoModal] = useState<{ open: boolean; url: string | null; title: string }>({
    open: false,
    url: null,
    title: "설명회 영상",
  });

  const filteredCourses = useMemo(() => {
    const toUse = fixedGrade ?? (gradeFilter === "all" ? null : gradeFilter);
    const gradeFiltered = (() => {
      if (!toUse) return courses;
      const g = (typeof toUse === "string" ? parseInt(toUse, 10) : toUse) as 1 | 2 | 3;
      return courses.filter((c) => c.grade === g);
    })();

    if (categoryFilter === "전체") return gradeFiltered;
    return gradeFiltered.filter((c) => {
      const resolvedCategory = resolveCourseCategory(c);
      if (resolvedCategory === categoryFilter) return true;
      // Keep compatibility if old rows still use category="제2외국어".
      return c.category === "제2외국어" && c.subject === categoryFilter;
    });
  }, [courses, gradeFilter, fixedGrade, categoryFilter]);

  const openVideo = (url: string | undefined, title?: string) => {
    setVideoModal({
      open: true,
      url: url && url.trim() ? url : DEFAULT_BRIEFING_VIDEO_URL,
      title: title ?? "설명회 영상",
    });
  };

  const closeVideo = () => {
    setVideoModal((prev) => ({ ...prev, open: false, url: null }));
  };

  return (
    <>
      {/* 과목(학년) 탭: fixedGrade 없을 때만 전체/고1/고2/고3 표시 */}
      {!fixedGrade && (
      <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {GRADE_TABS.map(({ id, label }) => {
          const isActive = gradeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setGradeFilter(id)}
              className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-[#002761] bg-[#002761] text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
              aria-pressed={isActive}
            >
                {label}
            </button>
          );
        })}
      </div>
      )}

      {/* 세부 시간표 리스트 */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {DETAIL_CATEGORY_FILTERS.map((cat) => {
          const isActive = categoryFilter === cat;
          const label = CATEGORY_DISPLAY_LABELS[cat] ?? cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl border px-3.5 py-1.5 text-sm font-semibold transition-all ${
                isActive
                  ? "border-[#002761] bg-[#002761] text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 세부 시간표 리스트 */}
      <div className="mt-6 space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-500">
            해당 학년 강의가 없습니다.
          </div>
        ) : (
          filteredCourses.map((item) => (
            <article
              key={item.id}
              className="relative grid gap-5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:grid-cols-[170px_minmax(0,1fr)_240px_140px] md:items-start md:gap-5 md:p-6"
            >
              {/* 과목 뱃지: 카드 우측 상단 */}
              {(() => {
                const displayCategory = resolveCourseCategory(item);
                const normalizedCategory = isSecondLanguageCategory(displayCategory)
                  ? (displayCategory as DetailCategory)
                  : displayCategory;
                const displayLabel =
                  CATEGORY_DISPLAY_LABELS[normalizedCategory as DetailCategoryFilter] ??
                  normalizedCategory;
                return (
                  <div className="absolute right-4 top-4 md:right-6 md:top-6">
                    <span
                      className={`inline-flex items-center rounded-xl border px-3 py-1 text-sm font-extrabold tracking-[-0.01em] shadow-sm ${getSubjectStyle(
                        normalizedCategory
                      )}`}
                    >
                      {displayLabel}
                    </span>
                  </div>
                );
              })()}

              {/* Column 1: 강사 프로필 + 이름 */}
              <div className="flex flex-shrink-0 items-center gap-4 pr-28 md:flex-col md:items-center md:justify-center md:gap-3 md:pr-0">
                {(() => {
                  const profileImgSrc = resolveTeacherImageSrc(item.instructorName, item.profileImg);
                  return (
                <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 ring-2 ring-slate-100 md:h-24 md:w-24">
                  {profileImgSrc ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element -- 프로필 이미지 404 시 fallback 초기 이니셜 표시용 */}
                      <img
                        src={profileImgSrc}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback instanceof HTMLElement) fallback.classList.remove("hidden");
                        }}
                      />
                    </>
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded-full bg-[#002761] text-sm font-bold text-white ${
                      profileImgSrc ? "hidden" : ""
                    }`}
                    aria-hidden
                  >
                    {getInitials(item.instructorName)}
                  </div>
                </div>
                  );
                })()}
                <span className="text-lg font-extrabold tracking-[-0.01em] text-slate-900 md:text-center md:text-xl">
                  {item.instructorName}
                </span>
              </div>

              {/* Column 2: 강의 정보 + 버튼 */}
              <div className="min-w-0">
                <h3 className="mt-0 text-lg font-bold text-slate-900 md:mt-2 md:text-xl">
                  {item.courseTitle ?? item.subject}
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700 md:text-base">
                  {item.teachingStyle}
                </p>

                {/* 설명회 버튼: 우측이 아닌 강의 스타일 바로 아래 배치 */}
                <button
                  type="button"
                  onClick={() => openVideo(item.videoUrl, item.courseTitle ?? item.subject)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEF600] px-5 py-3 text-sm font-bold text-[#002761] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#FEF600]/90 hover:shadow-[0_10px_20px_rgba(0,39,97,0.2)] md:w-auto"
                >
                  <Play className="h-4 w-4" aria-hidden />
                  설명회 영상 보기
                </button>
              </div>

              {/* Column 3+4: 요일/시간 + 개강 (카드 위젯형) */}
              <div className="min-w-0 self-center md:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <section className="px-4 py-4">
                    <p className="text-xs font-semibold tracking-[0.08em] text-slate-500">요일/시간</p>
                    <p className="mt-2 whitespace-pre-line text-[15px] font-semibold leading-6 text-slate-800">
                      {item.schedule}
                    </p>
                  </section>
                  <section className="border-t border-gray-100 px-4 py-4">
                    <p className="text-xs font-semibold tracking-[0.08em] text-slate-500">개강</p>
                    <p className="mt-2 whitespace-pre-line text-[15px] font-semibold leading-6 text-slate-800">
                      {item.startDate ?? "-"}
                    </p>
                    {item.status && (
                      <p className="mt-2 text-sm font-semibold text-rose-600">{item.status}</p>
                    )}
                  </section>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <VideoModal
        isOpen={videoModal.open}
        onClose={closeVideo}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </>
  );
}
