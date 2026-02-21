"use client";

import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import {
  instructors,
  SUBJECTS,
  SCHOOLS,
  type Instructor,
  type SubjectKey,
  type SchoolKey,
} from "@/data/instructors";

const SCHOOL_OPTIONS: readonly (SchoolKey | "전체")[] = ["전체", ...SCHOOLS];

function InstructorCard({ instructor }: { instructor: Instructor }) {
  const listId = useId();

  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,49,183,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,49,183,0.08)] sm:p-6"
      aria-labelledby={`${listId}-name`}
    >
      {/* 좌측 악센트 라인 */}
      <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-gradient-to-b from-withus-gold to-withus-navy opacity-80" aria-hidden />

      {/* 우측 상단: 과목 박스 (PC에서만 절대 위치, 모바일은 이름 옆에 표시) */}
      <div className="absolute right-4 top-4 hidden sm:block sm:right-5 sm:top-5">
        <span className="inline-block rounded-lg border border-withus-navy/20 bg-withus-navy/5 px-3 py-1.5 font-sans text-sm font-medium text-withus-navy">
          {instructor.subject}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 sm:pr-28 sm:pl-1">
        {/* 아바타 */}
        <div className="flex shrink-0">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-100 sm:h-16 sm:w-16">
            <span className="text-[10px] font-medium text-slate-400" aria-hidden>
              Photo
            </span>
          </div>
        </div>

        {/* 이름 + 과목(모바일) + 이력: 모바일에서 이력이 카드 전체 폭으로 읽기 편하게 */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3">
            <h3
              id={`${listId}-name`}
              className="font-serif text-base font-bold tracking-tight text-[#0a1e40] sm:text-lg"
            >
              {instructor.name} 선생님
              {instructor.language && (
                <span className="ml-1.5 font-sans text-sm font-medium text-slate-500">
                  ({instructor.language})
                </span>
              )}
            </h3>
            <span className="rounded-lg border border-withus-navy/20 bg-withus-navy/5 px-3 py-1 font-sans text-xs font-medium text-withus-navy sm:hidden">
              {instructor.subject}
            </span>
          </div>
          <ul className="space-y-1.5 font-sans text-sm leading-relaxed text-slate-600" aria-label="이력">
            {instructor.info.map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" aria-hidden />
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
  const [activeSchool, setActiveSchool] = useState<SchoolKey | "전체">("전체");
  const [activeSubject, setActiveSubject] = useState<SubjectKey | "전체">("전체");

  const filteredInstructors = instructors.filter((i) => {
    const matchSchool = activeSchool === "전체" || i.school === activeSchool;
    const matchSubject = activeSubject === "전체" || i.subject === activeSubject;
    return matchSchool && matchSubject;
  });

  const subjectsInSchool = Array.from(
    new Set(
      activeSchool === "전체"
        ? instructors.map((i) => i.subject)
        : instructors.filter((i) => i.school === activeSchool).map((i) => i.subject)
    )
  ).sort((a, b) => {
    const ia = SUBJECTS.indexOf(a as SubjectKey);
    const ib = SUBJECTS.indexOf(b as SubjectKey);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return (
    <section className="min-h-screen bg-withus-cream/40 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* 헤더 */}
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="font-sans text-2xl font-bold tracking-tight text-[#0a1e40] md:text-3xl lg:text-4xl">
            학교별 전문 강사님을 소개합니다.
          </h1>
        </header>

        {/* 필터 패널 */}
        <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-6">
          {/* 학교 선택 */}
          <div className="mb-5">
            <p className="mb-2.5 font-sans text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-sm">
              학교 선택
            </p>
            <div
              className="inline-flex rounded-xl bg-slate-50 p-1 ring-1 ring-slate-100"
              role="tablist"
              aria-label="학교 선택"
            >
              {SCHOOL_OPTIONS.map((school) => (
                <button
                  key={school}
                  type="button"
                  role="tab"
                  aria-selected={activeSchool === school}
                  onClick={() => setActiveSchool(school)}
                  className={`rounded-lg px-4 py-2.5 font-sans text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-withus-navy/30 focus:ring-offset-2 focus:ring-offset-white sm:px-5 ${
                    activeSchool === school
                      ? "bg-withus-navy text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {school}
                </button>
              ))}
            </div>
          </div>

          {/* 과목 필터 */}
          <div>
            <label htmlFor="instructor-subject" className="mb-2.5 block font-sans text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-sm">
              과목
            </label>
            <div className="relative w-full max-w-xs">
              <select
                id="instructor-subject"
                value={activeSubject}
                onChange={(e) => setActiveSubject((e.target.value || "전체") as SubjectKey | "전체")}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 py-3 pl-4 pr-11 font-sans text-sm font-medium text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:border-withus-navy focus:outline-none focus:ring-2 focus:ring-withus-navy/20 focus:ring-offset-0"
              >
                <option value="전체">전체 과목</option>
                {subjectsInSchool.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <ChevronDown className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
            </div>
          </div>
        </div>

        {/* 카드 리스트: 1열로 읽기 편하게 */}
        <ul className="space-y-4 sm:space-y-5">
          {filteredInstructors.map((instructor, index) => (
            <li key={`${instructor.school}-${instructor.subject}-${instructor.name}-${index}`}>
              <InstructorCard instructor={instructor} />
            </li>
          ))}
        </ul>

        {filteredInstructors.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="font-sans text-slate-500">해당 조건의 강사가 없습니다.</p>
            <button
              type="button"
              onClick={() => setActiveSubject("전체")}
              className="mt-4 rounded-lg border border-withus-navy/30 bg-white px-4 py-2 font-sans text-sm font-medium text-withus-navy transition-colors hover:bg-withus-navy/5"
            >
              전체 과목 보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
