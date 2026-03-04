"use client";

import Link from "next/link";
import { Landmark, School, BookOpen, Users, ArrowRight } from "lucide-react";

const SCHOOLS = [
  {
    label: "대원 외고",
    subLabel: "Daewon F.L.H.S.",
    href: "/schedule/daewon",
    Icon: Landmark,
    theme: {
      bg: "bg-[#c0e6f8]",
      hoverBg: "hover:bg-[#aadcf2]",
      text: "text-[#0a1628]",
      iconColor: "text-[#c0e6f8]",
    },
  },
  {
    label: "한영 외고",
    subLabel: "Hanyoung F.L.H.S.",
    href: "/schedule/hanyoung",
    Icon: School,
    theme: {
      bg: "bg-[#b2e9c1]",
      hoverBg: "hover:bg-[#9de0b0]",
      text: "text-[#0a1628]",
      iconColor: "text-[#b2e9c1]",
    },
  },
  {
    label: "일반고",
    subLabel: "General High School",
    href: "/schedule/general",
    Icon: BookOpen,
    theme: {
      bg: "bg-[#ffe269]",
      hoverBg: "hover:bg-[#ffd94d]",
      text: "text-[#0a1628]",
      iconColor: "text-[#ffe269]",
    },
  },
  {
    label: "개인팀 수업",
    subLabel: "Private Tutoring",
    href: "/schedule/private",
    Icon: Users,
    theme: {
      bg: "bg-[#e3cdf5]",
      hoverBg: "hover:bg-[#d4b8ed]",
      text: "text-[#0a1628]",
      iconColor: "text-[#e3cdf5]",
    },
  },
] as const;

export default function SchoolSelector() {
  return (
    <section className="min-w-0 px-4 pt-2 pb-3 sm:px-6 sm:pt-3 sm:pb-4 lg:px-8">
      <div className="mx-auto max-w-7xl min-w-0">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SCHOOLS.map(({ label, subLabel, href, Icon, theme }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] pl-6 pr-4 pt-6 pb-3 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold sm:pl-8 sm:pr-4 sm:pt-8 sm:pb-3 ${theme.bg} ${theme.hoverBg}`}
            >
              {/* Top area: title group (left) + icon (right), horizontal align */}
              <div className="relative z-10 flex flex-row items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span
                    className={`text-2xl font-extrabold tracking-tight drop-shadow-sm sm:text-3xl ${theme.text}`}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 text-sm font-semibold text-white drop-shadow-sm">
                    {subLabel}
                  </span>
                </div>
                <span className="flex shrink-0 text-white opacity-95 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.8} aria-hidden />
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
