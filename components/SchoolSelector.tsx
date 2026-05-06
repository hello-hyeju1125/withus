"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Globe, BookOpen, Target, type LucideIcon } from "lucide-react";

type SchoolCard = {
  label: string;
  subLabel: string;
  href: string;
  Icon: LucideIcon;
  accent: string;
  tintBg: string;
  subText: string;
};

const SCHOOLS: readonly SchoolCard[] = [
  {
    label: "대원외고",
    subLabel: "Daewon F.L.H.S.",
    href: "/schedule/daewon",
    Icon: GraduationCap,
    accent: "#3F5DA5",
    tintBg: "bg-[#E8EFFB]",
    subText: "text-[#3F5DA5]",
  },
  {
    label: "한영외고",
    subLabel: "Hanyoung F.L.H.S.",
    href: "/schedule/hanyoung",
    Icon: Globe,
    accent: "#2E8B73",
    tintBg: "bg-[#E0F4EC]",
    subText: "text-[#2E8B73]",
  },
  {
    label: "일반고",
    subLabel: "General High School",
    href: "/schedule/general",
    Icon: BookOpen,
    accent: "#C49415",
    tintBg: "bg-[#FFF7DC]",
    subText: "text-[#A67E0F]",
  },
  {
    label: "개인팀 수업",
    subLabel: "Private Tutoring",
    href: "/schedule/private",
    Icon: Target,
    accent: "#7B5EA7",
    tintBg: "bg-[#F2EBFA]",
    subText: "text-[#7B5EA7]",
  },
];

export default function SchoolSelector() {
  return (
    <section className="min-w-0 px-4 pt-2 pb-3 sm:px-6 sm:pt-3 sm:pb-4 lg:px-8">
      <div className="mx-auto max-w-7xl min-w-0">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SCHOOLS.map(({ label, subLabel, href, Icon, accent, tintBg, subText }) => (
            <Link
              key={href}
              href={href}
              style={{ "--accent": accent } as React.CSSProperties}
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-withus-navy/20 p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-withus-navy/30 hover:shadow-lg ${tintBg} hover:bg-withus-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-cta sm:p-6`}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--accent)] transition-colors duration-300 group-hover:bg-withus-navy"
                aria-hidden
              />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="min-w-0 flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-withus-navy sm:text-3xl lg:text-[2rem]">
                    {label}
                  </span>
                  <span className={`mt-1 text-sm font-semibold transition-colors duration-300 sm:text-base ${subText} group-hover:text-withus-navy/75`}>
                    {subLabel}
                  </span>
                </div>
                <Icon
                  className="h-9 w-9 shrink-0 text-[var(--accent)] transition-all duration-300 group-hover:scale-110 group-hover:text-withus-navy sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>

              <div className="relative z-10 mt-auto flex items-center justify-end pt-6">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-withus-navy group-hover:shadow-md sm:h-9 sm:w-9"
                  aria-hidden
                >
                  <ArrowRight
                    className="h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                    strokeWidth={2.5}
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
