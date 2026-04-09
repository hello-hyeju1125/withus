"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  instructors,
  SUBJECTS,
  SCHOOLS,
  type Instructor,
  type SubjectKey,
  type SchoolKey,
} from "@/data/instructors";

const DEFAULT_SCHOOL: SchoolKey = "대원외고";

const TAB_TO_SCHOOL: Record<string, SchoolKey> = {
  daewon: "대원외고",
  hanyoung: "한영외고",
  general: "일반고",
};

function schoolToTabParam(school: SchoolKey): string {
  if (school === "대원외고") return "daewon";
  if (school === "한영외고") return "hanyoung";
  return "general";
}

const SCHOOL_ACCENT: Record<SchoolKey, string> = {
  대원외고: "bg-withus-accent-blue",
  한영외고: "bg-withus-accent-green",
  일반고: "bg-withus-accent-gold",
};

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

const imagePathFallbackMap: Record<string, string[]> = {
  "/profile/lee_ys_english.png": ["/profile/lee_ys_english..png"],
};

const DEFAULT_PROFILE_IMAGE = "/profile/profile.jpg";

function koreanSort(a: string, b: string): number {
  return a.localeCompare(b, "ko");
}

function InstructorCard({ instructor }: { instructor: Instructor }) {
  const listId = useId();
  const [isImageError, setIsImageError] = useState(false);
  const [defaultImageFailed, setDefaultImageFailed] = useState(false);
  const [imageCandidateIndex, setImageCandidateIndex] = useState(0);
  const imageCandidates = useMemo(() => {
    const direct = teacherImageMap[instructor.name];
    const aliasKey = teacherNameAliasMap[instructor.name];
    const mapped = direct ?? (aliasKey ? teacherImageMap[aliasKey] : undefined);
    const list = mapped
      ? [mapped, ...(imagePathFallbackMap[mapped] ?? []), DEFAULT_PROFILE_IMAGE]
      : [DEFAULT_PROFILE_IMAGE];
    return list;
  }, [instructor.name]);

  const imageSrc = imageCandidates[imageCandidateIndex];
  const shouldShowImage = Boolean(imageSrc) && !isImageError;

  useEffect(() => {
    setIsImageError(false);
    setDefaultImageFailed(false);
    setImageCandidateIndex(0);
  }, [instructor.name, imageCandidates.length]);

  const accentClass = SCHOOL_ACCENT[instructor.school] ?? "bg-withus-accent-blue";

  return (
    <article
      className="relative overflow-hidden rounded border border-black/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
      aria-labelledby={`${listId}-name`}
    >
      <div className={`absolute -left-px -top-px -bottom-px w-[5px] ${accentClass}`} aria-hidden />

      {/* 모바일: 세로(이미지 → 이름 → 과목 → 소개) / sm+: 가로 */}
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-8">
        {/* 프로필 사진 */}
        <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-start">
          <div className="relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-xl bg-withus-bg ring-1 ring-withus-bg-hover sm:h-40 sm:w-40 sm:rounded-lg md:h-48 md:w-48">
            {shouldShowImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={imageSrc}
                src={imageSrc!}
                alt={`${instructor.name} 선생님 프로필`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={() => {
                  if (imageCandidateIndex + 1 < imageCandidates.length) {
                    setImageCandidateIndex((prev) => prev + 1);
                    return;
                  }
                  setIsImageError(true);
                }}
              />
            ) : defaultImageFailed ? (
              <span className="text-xs font-medium text-withus-navy-200" aria-hidden>
                Photo
              </span>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={DEFAULT_PROFILE_IMAGE}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setDefaultImageFailed(true)}
              />
            )}
          </div>
        </div>

        {/* 정보 */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3 text-center sm:text-left">
          <div className="flex flex-col items-center gap-2.5 sm:mb-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-3">
            <h3
              id={`${listId}-name`}
              className="font-gmarket text-2xl font-bold tracking-tight text-withus-navy md:text-3xl"
            >
              {instructor.name} 선생님
            </h3>
            <span className="inline-flex rounded border border-withus-bg-hover bg-withus-bg px-3.5 py-1.5 font-sans text-lg font-semibold text-withus-navy-500 md:text-xl">
              {instructor.subject}
            </span>
          </div>
          <ul
            className="space-y-2 text-left font-sans text-base leading-relaxed text-withus-navy-500 sm:space-y-1.5 md:text-lg"
            aria-label="이력"
          >
            {instructor.info.map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-withus-navy-200" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function InstructorList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");
  const activeSchool: SchoolKey =
    tab && tab in TAB_TO_SCHOOL ? TAB_TO_SCHOOL[tab as keyof typeof TAB_TO_SCHOOL] : DEFAULT_SCHOOL;

  const setSchoolFromUi = (school: SchoolKey) => {
    router.replace(`${pathname}?tab=${schoolToTabParam(school)}`, { scroll: false });
  };

  const [activeSubject, setActiveSubject] = useState<SubjectKey | "전체">("전체");

  useEffect(() => {
    setActiveSubject("전체");
  }, [activeSchool]);

  const filteredInstructors = instructors
    .filter((i) => {
      const matchSchool = i.school === activeSchool;
      const matchSubject = activeSubject === "전체" || i.subject === activeSubject;
      return matchSchool && matchSubject;
    })
    .sort((a, b) => koreanSort(a.name, b.name));

  const subjectsInSchool = Array.from(
    new Set(instructors.filter((i) => i.school === activeSchool).map((i) => i.subject))
  ).sort((a, b) => {
    const ia = SUBJECTS.indexOf(a as SubjectKey);
    const ib = SUBJECTS.indexOf(b as SubjectKey);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return (
    <section className="min-h-screen bg-withus-bg px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center sm:mb-8">
          <h1 className="font-gmarket text-2xl font-bold tracking-tight text-withus-navy md:text-3xl lg:text-4xl">
            학교별 전문 강사님을 소개합니다.
          </h1>
        </header>

        {/* 필터 영역 */}
        <div className="mb-6 rounded border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          {/* 학교 선택 */}
          <div className="mb-5">
            <p className="mb-2.5 font-sans text-sm font-semibold text-withus-navy-300 md:text-base">
              학교 선택
            </p>
            <div
              className="inline-flex flex-wrap gap-1.5 rounded bg-withus-bg p-1 ring-1 ring-withus-bg-hover"
              role="tablist"
              aria-label="학교 선택"
            >
              {SCHOOLS.map((school) => (
                <button
                  key={school}
                  type="button"
                  role="tab"
                  aria-selected={activeSchool === school}
                  onClick={() => setSchoolFromUi(school)}
                  className={`rounded px-5 py-2.5 font-gmarket text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-withus-cta/30 focus:ring-offset-2 focus:ring-offset-white sm:px-6 md:text-lg ${
                    activeSchool === school
                      ? "bg-withus-navy text-white shadow-sm"
                      : "text-withus-navy-500 hover:bg-withus-bg-hover hover:text-withus-navy"
                  }`}
                >
                  {school}
                </button>
              ))}
            </div>
          </div>

          {/* 과목 선택 (버튼 나열) */}
          <div>
            <p className="mb-2.5 font-sans text-sm font-semibold text-withus-navy-300 md:text-base">
              과목
            </p>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="과목 선택">
              <button
                type="button"
                role="tab"
                aria-selected={activeSubject === "전체"}
                onClick={() => setActiveSubject("전체")}
                className={`rounded px-4 py-2 font-sans text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-withus-cta/30 focus:ring-offset-2 focus:ring-offset-white md:text-base ${
                  activeSubject === "전체"
                    ? "bg-withus-navy text-white shadow-sm"
                    : "border border-withus-bg-hover bg-white text-withus-navy-500 hover:bg-withus-bg-hover hover:text-withus-navy"
                }`}
              >
                전체
              </button>
              {subjectsInSchool.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  role="tab"
                  aria-selected={activeSubject === sub}
                  onClick={() => setActiveSubject(sub as SubjectKey)}
                  className={`rounded px-4 py-2 font-sans text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-withus-cta/30 focus:ring-offset-2 focus:ring-offset-white md:text-base ${
                    activeSubject === sub
                      ? "bg-withus-navy text-white shadow-sm"
                      : "border border-withus-bg-hover bg-white text-withus-navy-500 hover:bg-withus-bg-hover hover:text-withus-navy"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 강사 목록 */}
        <div className="space-y-6 sm:space-y-5">
          {filteredInstructors.map((instructor, index) => (
            <InstructorCard
              key={`${instructor.school}-${instructor.subject}-${instructor.name}-${index}`}
              instructor={instructor}
            />
          ))}
        </div>

        {filteredInstructors.length === 0 && (
          <div className="rounded border border-black/10 bg-white py-16 text-center shadow-sm">
            <p className="font-sans text-lg text-withus-navy-300">해당 조건의 강사가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
