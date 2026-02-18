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
      {/* 1. 상단 링크 바 (Top Bar) */}
      <div className="bg-[#F0F4F8] py-3">
        <div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 sm:gap-x-8">
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

      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
      <TuitionModal isOpen={tuitionModalOpen} onClose={() => setTuitionModalOpen(false)} />

      {/* 2. 하단 메인 정보 (Main Footer) */}
      <div className="bg-[#002761] text-white">
        <div className="mx-auto max-w-7xl px-4 py-5 md:py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            {/* Left: 브랜드 + 캠퍼스 박스 (좌측에 묶음) */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              <div className="flex-shrink-0 space-y-2 lg:min-w-[200px]">
                <p className="text-lg font-bold text-white">{brand.name}</p>
                <p className="text-2xl font-bold tracking-wide text-withus-gold md:text-3xl">
                  {brand.mainPhone}
                </p>
                <p className="text-sm text-white">{brand.consultationHours}</p>
              </div>

              {/* 캠퍼스 정보 카드 3개 (가로 나열) - 캠퍼스명·전화·주소1·주소2 각 1줄 */}
              <div className="flex flex-row flex-wrap gap-3">
                {campuses.map((campus) => {
                  const [addressLine1, addressLine2] = campus.address.split("\n");
                  return (
                    <div
                      key={campus.name}
                      className="min-w-[180px] flex-1 rounded-lg bg-white/20 px-3 py-2 backdrop-blur"
                    >
                      <p className="text-[11px] font-bold text-white leading-tight md:text-xs">{campus.name}</p>
                      <p className="mt-0.5 text-[11px] font-bold text-white leading-tight md:text-xs">{campus.phone}</p>
                      <p className="mt-1 text-[11px] text-white leading-tight md:text-xs">{addressLine1}</p>
                      <p className="mt-0.5 text-[11px] text-white leading-tight md:text-xs">{addressLine2}</p>
                    </div>
                  );
                })}
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
