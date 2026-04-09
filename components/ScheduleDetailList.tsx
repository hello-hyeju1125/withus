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

/** 선생님 이미지가 없거나 로드 실패 시 사용하는 기본 프로필 이미지 */
const DEFAULT_PROFILE_IMAGE = "/profile/profile.jpg";

function resolveTeacherImageSrc(instructorName: string, profileImg?: string): string {
  if (profileImg && profileImg.trim()) return profileImg.trim();
  const direct = teacherImageMap[instructorName];
  if (direct) return direct;
  const alias = teacherNameAliasMap[instructorName];
  const resolved = alias ? teacherImageMap[alias] : undefined;
  return resolved ?? DEFAULT_PROFILE_IMAGE;
}

function isSecondLanguageCategory(value: string): value is (typeof SECOND_LANGUAGE_CATEGORIES)[number] {
  return (SECOND_LANGUAGE_CATEGORIES as readonly string[]).includes(value);
}

function resolveCourseCategory(item: ScheduleCourseItem): string {
  const category = item.category?.trim();
  const subject = item.subject?.trim();

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

    const categoryFiltered = categoryFilter === "전체"
      ? gradeFiltered
      : gradeFiltered.filter((c) => {
          const resolvedCategory = resolveCourseCategory(c);
          if (resolvedCategory === categoryFilter) return true;
          const legacyCategory = c.category as unknown as string | undefined;
          return legacyCategory === "제2외국어" && c.subject === categoryFilter;
        });

    return categoryFiltered.sort((a, b) => a.instructorName.localeCompare(b.instructorName, "ko"));
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
      <div className="mt-4 flex flex-wrap gap-2 border-b border-withus-bg-hover pb-4">
        {GRADE_TABS.map(({ id, label }) => {
          const isActive = gradeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setGradeFilter(id)}
              className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-withus-navy bg-withus-navy text-white shadow-md"
                  : "border-withus-bg-hover bg-white text-withus-navy-300 hover:border-slate-300 hover:bg-withus-bg"
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
                  ? "border-withus-navy bg-withus-navy text-white shadow-sm"
                  : "border-withus-bg-hover bg-white text-withus-navy-300 hover:border-slate-300 hover:bg-withus-bg"
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
          <div className="rounded-xl border border-withus-bg-hover bg-white py-12 text-center text-withus-navy-300">
            해당 학년 강의가 없습니다.
          </div>
        ) : (
          filteredCourses.map((item) => (
            <article
              key={item.id}
              className="relative grid gap-5 overflow-hidden rounded border border-black/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:grid-cols-[200px_minmax(0,1fr)_340px] md:items-start md:gap-6 md:p-6"
            >
              {/* Column 1: 과목 태그 + 강사 프로필 + 이름 */}
              <div className="flex flex-shrink-0 flex-col items-center gap-3">
                {(() => {
                  const displayCategory = resolveCourseCategory(item);
                  const normalizedCategory = isSecondLanguageCategory(displayCategory)
                    ? (displayCategory as DetailCategory)
                    : displayCategory;
                  const displayLabel =
                    CATEGORY_DISPLAY_LABELS[normalizedCategory as DetailCategoryFilter] ??
                    normalizedCategory;
                  return (
                    <span className="inline-flex items-center rounded bg-withus-navy px-4 py-1.5 text-base font-bold text-white shadow-sm md:text-lg">
                      {displayLabel}
                    </span>
                  );
                })()}
                {(() => {
                  const profileImgSrc = resolveTeacherImageSrc(item.instructorName, item.profileImg);
                  return (
                <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-200 ring-2 ring-withus-bg-hover sm:h-36 sm:w-36 md:h-40 md:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileImgSrc}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.src.endsWith(DEFAULT_PROFILE_IMAGE) || el.dataset.fallback === "1") {
                        el.style.display = "none";
                        const fallback = el.nextElementSibling;
                        if (fallback instanceof HTMLElement) fallback.classList.remove("hidden");
                      } else {
                        el.dataset.fallback = "1";
                        el.src = DEFAULT_PROFILE_IMAGE;
                      }
                    }}
                  />
                  <div
                    className="absolute inset-0 hidden items-center justify-center rounded-lg bg-withus-navy text-base font-bold text-white"
                    aria-hidden
                  >
                    {getInitials(item.instructorName)}
                  </div>
                </div>
                  );
                })()}
                <span className="font-gmarket text-2xl font-extrabold tracking-tight text-withus-navy md:text-center md:text-3xl">
                  {item.instructorName}
                </span>
              </div>

              {/* Column 2: 강의 정보 + 설명회 버튼 */}
              <div className="min-w-0">
                <h3 className="mt-0 font-gmarket text-xl font-bold text-withus-navy md:mt-1 md:text-2xl">
                  {item.courseTitle ?? item.subject}
                </h3>
                <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-withus-navy-500 md:text-lg">
                  {item.teachingStyle}
                </p>

                <button
                  type="button"
                  onClick={() => openVideo(item.videoUrl, item.courseTitle ?? item.subject)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded border border-withus-navy-200 px-3 py-1.5 text-sm font-medium text-withus-navy-300 transition-colors hover:border-withus-navy hover:text-withus-navy md:text-base"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden />
                  설명회 영상
                </button>
              </div>

              {/* Column 3: 요일/시간 + 개강 */}
              <div className="min-w-0 self-center">
                <div className="overflow-hidden rounded border border-gray-200 bg-white">
                  <section className="px-4 py-4">
                    <p className="text-sm font-semibold tracking-wide text-withus-navy-300">요일/시간</p>
                    <p className="mt-1.5 whitespace-pre-line text-base font-semibold leading-relaxed text-withus-navy md:text-lg">
                      {item.schedule}
                    </p>
                  </section>
                  <section className="border-t border-gray-100 px-4 py-4">
                    <p className="text-sm font-semibold tracking-wide text-withus-navy-300">개강</p>
                    <p className="mt-1.5 whitespace-pre-line text-base font-semibold leading-relaxed text-withus-navy md:text-lg">
                      {item.startDate ?? "-"}
                    </p>
                    {item.status && (
                      <p className="mt-2 text-base font-semibold text-rose-600">{item.status}</p>
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
