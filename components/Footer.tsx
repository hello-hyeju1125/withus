"use client";

import { useState } from "react";
import Link from "next/link";
import { footerData } from "@/data/footerData";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import TermsModal from "@/components/TermsModal";
import TuitionModal from "@/components/TuitionModal";

export default function Footer() {
  const { topLinks, brand, campuses, legal } = footerData;
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [tuitionModalOpen, setTuitionModalOpen] = useState(false);

  return (
    <footer className="mt-0">
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
      <TuitionModal isOpen={tuitionModalOpen} onClose={() => setTuitionModalOpen(false)} />

      {/* 푸터 바로 위 띠: 개인정보처리방침 · 이용약관 · 교습비 */}
      <div className="bg-[#F0F4F8] py-3">
        <div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-start gap-x-6 gap-y-1 px-4 sm:gap-x-8">
          {topLinks.map(({ label, href, bold }) =>
            href === "/privacy" ? (
              <button
                key={href}
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className={`text-sm text-slate-600 transition-colors hover:text-slate-800 ${bold ? "font-bold" : ""}`}
              >
                {label}
              </button>
            ) : href === "/terms" ? (
              <button
                key={href}
                type="button"
                onClick={() => setTermsModalOpen(true)}
                className={`text-sm text-slate-600 transition-colors hover:text-slate-800 ${bold ? "font-bold" : ""}`}
              >
                {label}
              </button>
            ) : href === "/tuition" ? (
              <button
                key={href}
                type="button"
                onClick={() => setTuitionModalOpen(true)}
                className={`text-sm text-slate-600 transition-colors hover:text-slate-800 ${bold ? "font-bold" : ""}`}
              >
                {label}
              </button>
            ) : (
              <Link
                key={href}
                href={href}
                className={`text-sm text-slate-600 transition-colors hover:text-slate-800 ${bold ? "font-bold" : ""}`}
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>

      {/* 하단 메인 정보 (Main Footer) */}
      <div className="bg-[#002761] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            {/* Left: 브랜드 + 캠퍼스 박스 */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              <div className="flex-shrink-0 space-y-3 lg:min-w-[200px]">
                <p className="text-lg font-bold text-white">{brand.name}</p>
                <p className="text-2xl font-bold tracking-wide text-withus-gold md:text-3xl">
                  {brand.mainPhone}
                </p>
                <p className="text-sm text-white">{brand.consultationHours}</p>
              </div>

              {/* 캠퍼스 정보 카드 3개: 관 이름·전화 한 줄, 주소 한 줄 (줄바꿈 없음) */}
              <div className="flex flex-row flex-wrap gap-3">
                {campuses.map((campus) => (
                  <div
                    key={campus.name}
                    className="min-w-[180px] flex-1 rounded-lg bg-white/20 px-3 py-2 backdrop-blur"
                  >
                    <p className="whitespace-nowrap text-[11px] font-bold text-white leading-tight md:text-xs">
                      {campus.name} {campus.phone}
                    </p>
                    <p className="mt-1 text-[11px] text-white leading-tight md:text-xs">
                      {campus.address.replace(/\n/g, " ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 법적 정보 */}
            <div className="flex-shrink-0 text-right lg:min-w-[200px]">
              <p className="text-xs text-white">{legal.businessNumber}</p>
              <p className="mt-1 text-xs text-white">{brand.academyRegistration}</p>
              <p className="mt-1 text-xs text-white">{legal.reportingAgency}</p>
              <p className="mt-2 text-xs text-white">{legal.copyright}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
