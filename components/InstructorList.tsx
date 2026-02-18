"use client";

import { useState } from "react";
import { instructors, SUBJECTS, type Instructor, type SubjectKey } from "@/data/instructors";

function InstructorCard({ instructor }: { instructor: Instructor }) {
  return (
    <article className="flex overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* 원형 프레임 (프로필 사진 Placeholder) */}
      <div className="flex shrink-0 items-center justify-center p-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-50 sm:h-24 sm:w-24">
          {/* TODO: 프로필 사진 추가 시 img 태그로 교체 */}
          <span className="text-xs font-medium text-slate-400" aria-hidden>
            Photo
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-4 pr-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold tracking-tight text-[#0a1e40]">
            {instructor.name} 선생님
            {instructor.language && (
              <span className="ml-1.5 text-sm font-medium text-slate-500">
                ({instructor.language})
              </span>
            )}
          </h3>
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {instructor.subject}
          </span>
        </div>

        {instructor.info.length > 0 && (
          <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
            {instructor.info.map((item, i) => (
              <li key={i} className="flex gap-2 break-keep">
                <span className="mt-1.5 shrink-0 text-slate-400">•</span>
                <span className="break-words">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function InstructorList() {
  const [activeSubject, setActiveSubject] = useState<SubjectKey | "전체">("전체");

  const filteredInstructors =
    activeSubject === "전체"
      ? instructors
      : instructors.filter((i) => i.subject === activeSubject);

  return (
    <section className="min-h-screen bg-cool-gray-50/50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <p className="font-sans text-2xl font-bold tracking-tight text-[#0a1e40] md:text-3xl lg:text-4xl">
            위더스의 전문 강사 선생님을 소개합니다.
          </p>
        </header>

        {/* 과목별 탭 필터 */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubject("전체")}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeSubject === "전체"
                ? "bg-[#002761] text-white shadow-sm"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
            }`}
          >
            전체
          </button>
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setActiveSubject(subject)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeSubject === subject
                  ? "bg-[#002761] text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* 그리드 */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {filteredInstructors.map((instructor, index) => (
            <InstructorCard key={`${instructor.subject}-${instructor.name}-${index}`} instructor={instructor} />
          ))}
        </div>

        {filteredInstructors.length === 0 && (
          <p className="py-12 text-center text-slate-500">해당 과목의 강사가 없습니다.</p>
        )}
      </div>
    </section>
  );
}
