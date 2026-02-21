"use client";

import { useState, useCallback, useEffect } from "react";

/* ========== 상수 ========== */
/** 탭에 표시되는 학교 (대원, 한영, 일반). 개인팀 수업은 탭 없이 /schedule/private 로만 접근 */
const SCHOOLS = [
  { label: "대원", slug: "daewon" },
  { label: "한영", slug: "hanyoung" },
  { label: "일반", slug: "general" },
] as const;

const GRADES = [
  { id: "1", label: "고1" },
  { id: "2", label: "고2" },
  { id: "3", label: "고3" },
] as const;

export type SchoolSlug = (typeof SCHOOLS)[number]["slug"] | "private";

export interface TimetableNavProps {
  /** 초기 선택 학교 (slug). 미지정 시 'daewon' */
  initialSchool?: SchoolSlug;
  /** 초기 선택 학년. 미지정 시 '1' */
  initialGrade?: string;
  /** 학교 또는 학년 변경 시 호출. Cloudinary 필터링 등 연동용 */
  onChange?: (activeSchool: SchoolSlug, activeGrade: string) => void;
}

export default function TimetableNav({
  initialSchool = "daewon",
  initialGrade = "1",
  onChange,
}: TimetableNavProps) {
  const [activeSchool, setActiveSchool] = useState<SchoolSlug>(initialSchool);
  const [activeGrade, setActiveGrade] = useState<string>(initialGrade);

  useEffect(() => {
    setActiveSchool(initialSchool);
    setActiveGrade(initialGrade);
  }, [initialSchool, initialGrade]);

  const handleSchoolChange = useCallback(
    (slug: SchoolSlug) => {
      setActiveSchool(slug);
      onChange?.(slug, activeGrade);
    },
    [activeGrade, onChange]
  );

  const handleGradeChange = useCallback(
    (gradeId: string) => {
      setActiveGrade(gradeId);
      onChange?.(activeSchool, gradeId);
    },
    [activeSchool, onChange]
  );

  return (
    <div className="w-full" role="navigation" aria-label="시간표 선택">
      {/* Level 1: 학교 선택 (대원, 한영, 일반) - PC에서 크게 */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-2 md:gap-x-12 md:gap-y-3 lg:gap-x-16">
        {SCHOOLS.map(({ label, slug }) => {
          const isActive = activeSchool === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => handleSchoolChange(slug)}
              className={`relative pb-3 pt-2 text-xl font-bold transition-colors md:pb-4 md:pt-3 md:text-2xl lg:pb-5 lg:pt-4 lg:text-3xl ${
                isActive ? "text-[#002761]" : "text-slate-400"
              }`}
              aria-pressed={isActive}
              aria-current={isActive ? "true" : undefined}
            >
              {label}
              <span
                className={`absolute bottom-0 left-0 right-0 block border-b-4 md:border-b-[6px] ${
                  isActive ? "border-[#FEF600]" : "border-slate-200"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Level 2: 학년 선택 (클릭 가능한 버튼으로 인지되도록) */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {GRADES.map(({ id, label }) => {
          const isActive = activeGrade === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleGradeChange(id)}
              className={`cursor-pointer rounded-lg border-2 py-3 text-base font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#002761] focus-visible:ring-offset-2 ${
                isActive
                  ? "border-[#002761] bg-[#002761] text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 hover:shadow"
              }`}
              aria-pressed={isActive}
              aria-current={isActive ? "true" : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { SCHOOLS, GRADES };
