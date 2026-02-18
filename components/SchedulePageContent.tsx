"use client";

import Link from "next/link";
import { useRef } from "react";

const SCHOOLS = [
  { label: "대원외고", slug: "daewon" },
  { label: "한영외고", slug: "hanyoung" },
  { label: "일반고", slug: "general" },
] as const;

const GRADES = [
  { id: "grade-1", label: "고1" },
  { id: "grade-2", label: "고2" },
  { id: "grade-3", label: "고3" },
] as const;

type SchoolSlug = (typeof SCHOOLS)[number]["slug"];

export default function SchedulePageContent({
  currentSchool,
}: {
  currentSchool: SchoolSlug;
}) {
  const grade1Ref = useRef<HTMLDivElement>(null);
  const grade2Ref = useRef<HTMLDivElement>(null);
  const grade3Ref = useRef<HTMLDivElement>(null);

  const scrollToGrade = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-serif text-2xl font-bold text-withus-navy md:text-3xl">
          시간표
        </h1>
        <p className="mt-2 text-cool-gray-500">
          대원외고, 한영외고, 일반고 시간표를 확인하실 수 있습니다.
        </p>

        {/* 학교 유형 버튼 (상단) */}
        <div className="mt-6 flex flex-wrap gap-3">
          {SCHOOLS.map(({ label, slug }) => (
            <Link
              key={slug}
              href={`/schedule/${slug}`}
              className={`rounded-lg border-2 px-5 py-2.5 text-sm font-medium transition-colors ${
                currentSchool === slug
                  ? "border-withus-navy bg-withus-navy text-white"
                  : "border-cool-gray-200 bg-white text-cool-gray-700 hover:border-withus-navy/50 hover:bg-cool-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 고1, 고2, 고3 스크롤 이동 링크 */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-cool-gray-200 pb-4">
          {GRADES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToGrade(id)}
              className="rounded-md bg-cool-gray-100 px-4 py-2 text-sm font-medium text-cool-gray-700 transition-colors hover:bg-withus-navy hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>

        {/* 고1, 고2, 고3 섹션 (스크롤로 이동) */}
        <div className="space-y-12 pb-16">
          <section
            id="grade-1"
            ref={grade1Ref}
            className="scroll-mt-8 rounded-lg border border-cool-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-serif text-xl font-bold text-withus-navy">
              고1
            </h2>
            <p className="mt-3 text-sm text-cool-gray-500">
              고1 시간표 내용이 여기에 표시됩니다.
            </p>
          </section>

          <section
            id="grade-2"
            ref={grade2Ref}
            className="scroll-mt-8 rounded-lg border border-cool-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-serif text-xl font-bold text-withus-navy">
              고2
            </h2>
            <p className="mt-3 text-sm text-cool-gray-500">
              고2 시간표 내용이 여기에 표시됩니다.
            </p>
          </section>

          <section
            id="grade-3"
            ref={grade3Ref}
            className="scroll-mt-8 rounded-lg border border-cool-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-serif text-xl font-bold text-withus-navy">
              고3
            </h2>
            <p className="mt-3 text-sm text-cool-gray-500">
              고3 시간표 내용이 여기에 표시됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
