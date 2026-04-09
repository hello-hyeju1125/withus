"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SCHOOLS = [
  {
    label: "대원외고",
    subLabel: "Daewon F.L.H.S.",
    href: "/schedule/daewon",
    accent: "#3466AE",
    tintBg: "bg-[#EBF1F9]",
    hoverTintBg: "hover:bg-[#DDE8F4]",
    textAccent: "text-withus-accent-blue",
    ringAccent: "ring-withus-accent-blue/20",
    hoverBorder: "hover:border-withus-accent-blue/40",
    btnBg: "bg-withus-accent-blue",
  },
  {
    label: "한영외고",
    subLabel: "Hanyoung F.L.H.S.",
    href: "/schedule/hanyoung",
    accent: "#2E8B6A",
    tintBg: "bg-[#E8F5EF]",
    hoverTintBg: "hover:bg-[#D6EDDF]",
    textAccent: "text-withus-accent-green",
    ringAccent: "ring-withus-accent-green/20",
    hoverBorder: "hover:border-withus-accent-green/40",
    btnBg: "bg-withus-accent-green",
  },
  {
    label: "일반고",
    subLabel: "General High School",
    href: "/schedule/general",
    accent: "#B8860B",
    tintBg: "bg-[#FBF4E4]",
    hoverTintBg: "hover:bg-[#F5EBD0]",
    textAccent: "text-withus-accent-gold",
    ringAccent: "ring-withus-accent-gold/20",
    hoverBorder: "hover:border-withus-accent-gold/40",
    btnBg: "bg-withus-accent-gold",
  },
  {
    label: "개인팀 수업",
    subLabel: "Private Tutoring",
    href: "/schedule/private",
    accent: "#7B5EA7",
    tintBg: "bg-[#F3EEF8]",
    hoverTintBg: "hover:bg-[#E8DFF2]",
    textAccent: "text-withus-accent-purple",
    ringAccent: "ring-withus-accent-purple/20",
    hoverBorder: "hover:border-withus-accent-purple/40",
    btnBg: "bg-withus-accent-purple",
  },
] as const;

export default function SchoolSelector() {
  return (
    <section className="min-w-0 px-4 pt-2 pb-3 sm:px-6 sm:pt-3 sm:pb-4 lg:px-8">
      <div className="mx-auto max-w-7xl min-w-0">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SCHOOLS.map(({ label, subLabel, href, accent, tintBg, hoverTintBg, textAccent, ringAccent, hoverBorder, btnBg }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded border-2 border-black/20 p-5 shadow-sm ring-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:ring-4 ${tintBg} ${hoverTintBg} ${hoverBorder} ${ringAccent} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-cta sm:p-6`}
            >
              <div
                className="absolute -left-[2px] -top-[2px] -bottom-[2px] w-[7px]"
                style={{ backgroundColor: accent }}
              />

              <div
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-[2.5]"
                style={{ backgroundColor: accent }}
              />

              <div className="relative z-10 flex min-w-0 flex-col">
                <span className="font-gmarket text-2xl font-medium tracking-tight text-withus-navy sm:text-3xl lg:text-[2rem]">
                  {label}
                </span>
                <span className={`mt-1 text-sm font-semibold sm:text-base ${textAccent}`}>
                  {subLabel}
                </span>
              </div>

              <div className="relative z-10 mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-withus-navy-300 transition-colors duration-300 group-hover:text-withus-navy-500">
                  시간표 보기
                </span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${btnBg} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg sm:h-9 sm:w-9`}>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
