"use client";

import Link from "next/link";
import { Landmark, School, BookOpen, Users, ArrowRight } from "lucide-react";

const SCHOOLS = [
  {
    label: "대원외고",
    subLabel: "Daewon F.L.H.S.",
    href: "/schedule/daewon",
    Icon: Landmark,
    theme: {
      bg: "bg-[#EFF6FF]",
      hoverBg: "hover:bg-[#E0EFFF]",
      text: "text-[#1E3A5F]",
      iconColor: "text-[#5B9BD5]",
    },
  },
  {
    label: "한영외고",
    subLabel: "Hanyoung F.L.H.S.",
    href: "/schedule/hanyoung",
    Icon: School,
    theme: {
      bg: "bg-[#E8F5E9]",
      hoverBg: "hover:bg-[#D8EDD9]",
      text: "text-[#1B3D1E]",
      iconColor: "text-[#5DAF7A]",
    },
  },
  {
    label: "일반고",
    subLabel: "General High School",
    href: "/schedule/general",
    Icon: BookOpen,
    theme: {
      bg: "bg-[#FFF3E0]",
      hoverBg: "hover:bg-[#FFE8C5]",
      text: "text-[#5D3A1A]",
      iconColor: "text-[#E09B5C]",
    },
  },
  {
    label: "개인팀수업",
    subLabel: "Private Tutoring",
    href: "/schedule/private",
    Icon: Users,
    theme: {
      bg: "bg-[#F3E5F5]",
      hoverBg: "hover:bg-[#E8D5EB]",
      text: "text-[#4A2C5A]",
      iconColor: "text-[#9B7BB8]",
    },
  },
] as const;

export default function SchoolSelector() {
  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SCHOOLS.map(({ label, subLabel, href, Icon, theme }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-col overflow-hidden rounded-2xl pl-6 pr-4 pt-6 pb-3 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold sm:pl-8 sm:pr-4 sm:pt-8 sm:pb-3 ${theme.bg} ${theme.hoverBg}`}
            >
              {/* Top area: title group (left) + icon (right), horizontal align */}
              <div className="relative z-10 flex flex-row items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span
                    className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${theme.text}`}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 text-sm font-medium text-gray-400">
                    {subLabel}
                  </span>
                </div>
                <span
                  className={`flex shrink-0 opacity-80 transition-transform duration-300 group-hover:scale-105 ${theme.iconColor}`}
                >
                  <Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden />
                </span>
              </div>

              {/* Bottom area: arrow button (right) */}
              <div className="relative z-10 mt-3 flex justify-end">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow sm:h-9 sm:w-9">
                  <ArrowRight
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${theme.iconColor}`}
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
