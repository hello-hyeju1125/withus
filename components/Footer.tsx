"use client";

import { useState } from "react";
import Link from "next/link";
import { footerData } from "@/data/footerData";
import { campusLocations } from "@/data/campusLocations";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import TermsModal from "@/components/TermsModal";
import TuitionModal from "@/components/TuitionModal";

const CAMPUS_MAP_URLS: Record<string, string> = {
  "P(프리미엄)관": campusLocations.find((c) => c.id === "premium")?.naverMapUrl ?? "#",
  "M관": campusLocations.find((c) => c.id === "m")?.naverMapUrl ?? "#",
  "S관": campusLocations.find((c) => c.id === "s")?.naverMapUrl ?? "#",
  "입시관": campusLocations.find((c) => c.id === "entrance")?.naverMapUrl ?? "#",
};

export default function Footer() {
  const { topLinks, brand, campusGroups, legal } = footerData;
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [tuitionModalOpen, setTuitionModalOpen] = useState(false);

  return (
    <footer className="mt-0">
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
      <TuitionModal isOpen={tuitionModalOpen} onClose={() => setTuitionModalOpen(false)} />

      {/* 상단 링크 바 */}
      <div className="bg-withus-bg-hover py-3">
        <div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-start gap-x-8 gap-y-2 px-6">
          {topLinks.map(({ label, href, bold }) =>
            href === "/privacy" ? (
              <button
                key={href}
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className={`text-sm text-withus-navy-300 transition-colors hover:text-withus-navy ${bold ? "font-bold" : ""}`}
              >
                {label}
              </button>
            ) : href === "/terms" ? (
              <button
                key={href}
                type="button"
                onClick={() => setTermsModalOpen(true)}
                className={`text-sm text-withus-navy-300 transition-colors hover:text-withus-navy ${bold ? "font-bold" : ""}`}
              >
                {label}
              </button>
            ) : href === "/tuition" ? (
              <button
                key={href}
                type="button"
                onClick={() => setTuitionModalOpen(true)}
                className={`text-sm text-withus-navy-300 transition-colors hover:text-withus-navy ${bold ? "font-bold" : ""}`}
              >
                {label}
              </button>
            ) : (
              <Link
                key={href}
                href={href}
                className={`text-sm text-withus-navy-300 transition-colors hover:text-withus-navy ${bold ? "font-bold" : ""}`}
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>

      {/* 브랜드 시그니처 스트라이프 */}
      <div className="h-1.5 w-full bg-withus-navy" aria-hidden />

      {/* 메인 푸터 */}
      <div className="bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-7xl px-6 py-7 md:py-8">

          {/* 상단: 2단 압축 레이아웃 (브랜드+전화번호 / 상담시간) */}
          <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-10">
            {/* 좌측: 브랜드명 + 전화번호 인라인 */}
            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-[1.625rem] font-bold leading-tight text-white md:text-[1.95rem]">{brand.name}</p>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-1.5">
                <a href="tel:025628787" className="flex items-center gap-2 text-xl font-extrabold tracking-wide text-withus-gold transition-opacity hover:opacity-80 md:text-2xl">
                  <svg className="h-4 w-4 shrink-0 text-withus-gold/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  02-562-8787
                </a>
                <a href="tel:025625757" className="flex items-center gap-2 text-xl font-extrabold tracking-wide text-withus-gold transition-opacity hover:opacity-80 md:text-2xl">
                  <svg className="h-4 w-4 shrink-0 text-withus-gold/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  02-562-5757
                </a>
                <a href="tel:025625759" className="flex items-center gap-2 text-xl font-extrabold tracking-wide text-withus-gold transition-opacity hover:opacity-80 md:text-2xl">
                  <svg className="h-4 w-4 shrink-0 text-withus-gold/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  02-562-5759
                </a>
              </div>
            </div>
            {/* 우측: 상담시간 (compact) */}
            <div className="flex shrink-0 flex-col gap-1 md:items-end md:text-right">
              <p className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-white/75 md:text-base">
                <svg className="h-4 w-4 shrink-0 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                상담시간
              </p>
              <p className="text-lg font-bold leading-snug text-white md:text-xl">평일 14:00 ~ 22:00</p>
              <p className="text-lg font-bold leading-snug text-white md:text-xl">주말 09:00 ~ 22:00</p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="mb-5 h-px bg-white/12" />

          {/* 교육관 정보 */}
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:gap-5">
            {/* 외고관 그룹 */}
            <div className="flex-1">
              <p className="mb-2 text-lg font-bold tracking-wider text-withus-gold md:text-xl">외고관</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {campusGroups[0].locations.map((loc, idx) => {
                  const locName = "name" in loc && loc.name ? loc.name : `외고관 ${idx + 1}`;
                  const mapUrl = CAMPUS_MAP_URLS[locName] ?? "#";
                  return (
                    <a
                      key={idx}
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded border border-white/12 bg-white/[0.06] px-4 py-3 shadow-sm shadow-black/40 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-withus-gold hover:shadow-lg hover:shadow-black/50"
                    >
                      <p className="text-base font-bold text-white transition-colors duration-300 group-hover:text-withus-navy">{locName}</p>
                      <p className="mt-1 text-sm leading-snug text-white/55 transition-colors duration-300 group-hover:text-withus-navy/70">{loc.address}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-base font-bold text-white transition-colors duration-300 group-hover:text-withus-navy">{loc.phone}</span>
                        <svg className="h-4 w-4 text-white/35 transition-colors duration-300 group-hover:text-withus-navy/70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
            {/* 입시관 그룹 */}
            <div className="lg:w-1/4">
              <p className="mb-2 text-lg font-bold tracking-wider text-withus-gold md:text-xl">입시관</p>
              <a
                href={CAMPUS_MAP_URLS["입시관"]}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded border border-white/12 bg-white/[0.06] px-4 py-3 shadow-sm shadow-black/40 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-withus-gold hover:shadow-lg hover:shadow-black/50"
              >
                <p className="text-base font-bold text-white transition-colors duration-300 group-hover:text-withus-navy">입시관</p>
                <p className="mt-1 text-sm leading-snug text-white/55 transition-colors duration-300 group-hover:text-withus-navy/70">강남구 도곡로77길 5 유성빌딩, 3층</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-base font-bold text-white transition-colors duration-300 group-hover:text-withus-navy">02-562-5759</span>
                  <svg className="h-4 w-4 text-white/35 transition-colors duration-300 group-hover:text-withus-navy/70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
                </div>
              </a>
            </div>
          </div>

          {/* 구분선 */}
          <div className="mb-3 h-px bg-white/12" />

          {/* 하단: 법적 정보 */}
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
            <p className="text-xs text-white/55 md:text-sm">{legal.businessNumber}</p>
            <p className="text-xs text-white/55 md:text-sm">{brand.academyRegistration}</p>
            <p className="text-xs text-white/55 md:text-sm">{legal.reportingAgency}</p>
            <p className="mt-1 text-xs text-white/40 sm:ml-auto sm:mt-0 md:text-sm">{legal.copyright}</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
