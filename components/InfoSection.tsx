"use client";

import Link from "next/link";
import { useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";
import SMSBanner from "@/components/SMSBanner";

const iconSize = 28;

const INFO_LINK_BUTTONS = [
  { label: "강사진 소개", href: "/instructors", iconSrc: "/asset/icon_teacher.svg" },
  { label: "근무시간", href: "/hours", iconSrc: "/asset/icont_time.svg" },
  { label: "교육관 안내", href: "/campus", iconSrc: "/asset/icon_location.svg" },
] as const;

export default function InfoSection() {
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <div className="w-full min-w-0">
      <section className="min-w-0 px-4 py-3 sm:px-6 sm:py-4 lg:px-8" aria-label="안내 메뉴">
        <div className="mx-auto max-w-7xl min-w-0 space-y-6 sm:space-y-8">
          {/* 공통 배너 형태: 동일 레이아웃·패딩·버튼 크기, 색만 구분 */}

          {/* 입학·상담 문의 배너 */}
          <div className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-r from-[#002761] via-[#003380] to-[#002761] px-5 py-4 shadow-[0_10px_40px_rgba(0,39,97,0.2)] sm:px-6 sm:py-5">
            <div className="relative flex min-w-0 flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
              <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
                {/* 상담 문의 아이콘: 헤드셋(고객상담), 흰색·간결 */}
                <span className="flex h-12 w-12 shrink-0 items-center justify-center text-white sm:h-14 sm:w-14" aria-hidden>
                  <svg className="h-7 w-7 sm:h-9 sm:w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-white sm:text-xl">입학·상담 문의</p>
                  <p className="mt-0.5 text-sm text-white/85 sm:text-base">전화·문자 상담 신청을 남겨주시면 안내해 드립니다.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConsultationOpen(true)}
                className="w-full shrink-0 rounded-xl px-6 py-3.5 text-lg font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto sm:min-w-[180px] sm:px-8 sm:py-4 bg-[#FEF600] text-[#002761] hover:bg-[#FEF600]/95 hover:shadow-[0_12px_28px_rgba(254,246,0,0.35)] focus-visible:outline-withus-gold"
              >
                상담 문의하기
              </button>
            </div>
          </div>

          {/* 학습에 필요한 정보를 문자로 알려드립니다! */}
          <SMSBanner nested />

          {/* 강사진 소개 · 근무시간 · 교육관 안내 */}
          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3 sm:gap-4 sm:pt-4">
            {INFO_LINK_BUTTONS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-[#f2f6fb] py-4 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#002761] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold sm:py-5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.iconSrc}
                  alt=""
                  className="mb-2 h-7 w-7 shrink-0 object-contain transition-transform duration-300 group-hover:scale-110"
                  width={iconSize}
                  height={iconSize}
                  aria-hidden
                />
                <span className="text-sm font-semibold text-withus-navy sm:text-base">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </div>
  );
}
