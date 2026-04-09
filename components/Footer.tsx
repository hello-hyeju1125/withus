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

      {/* 메인 푸터 */}
      <div className="bg-withus-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">

          {/* 상단: 브랜드 + 대표번호 + 상담시간 */}
          <div className="mb-6">
            <p className="font-gmarket text-xl font-bold text-white md:text-2xl">{brand.name}</p>
            <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
              {/* 전화번호 */}
              <div className="flex shrink-0 flex-col gap-0.5">
                <a href="tel:025628787" className="flex items-center gap-2 text-xl font-extrabold tracking-wide text-withus-cta transition-opacity hover:opacity-80 md:text-2xl">
                  <svg className="h-4 w-4 shrink-0 text-withus-cta/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  02-562-8787
                </a>
                <a href="tel:025625757" className="flex items-center gap-2 text-xl font-extrabold tracking-wide text-withus-cta transition-opacity hover:opacity-80 md:text-2xl">
                  <svg className="h-4 w-4 shrink-0 text-withus-cta/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  02-562-5757
                </a>
                <a href="tel:025625759" className="flex items-center gap-2 text-xl font-extrabold tracking-wide text-withus-cta transition-opacity hover:opacity-80 md:text-2xl">
                  <svg className="h-4 w-4 shrink-0 text-withus-cta/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  02-562-5759
                </a>
              </div>
              {/* 구분선 (세로) */}
              <div className="hidden h-auto w-px self-stretch bg-white/15 sm:block" />
              {/* 상담시간 */}
              <div>
                <p className="text-base font-bold tracking-wider text-white md:text-lg">상담시간</p>
                <p className="mt-1 text-xl font-bold leading-relaxed text-white md:text-2xl">평일 14:00 ~ 22:00</p>
                <p className="text-xl font-bold leading-relaxed text-white md:text-2xl">주말 09:00 ~ 22:00</p>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="mb-6 h-px bg-white/15" />

          {/* 교육관 정보 */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:gap-5">
            {/* 외고관 그룹 */}
            <div className="flex-1">
              <p className="mb-2 text-sm font-bold tracking-wider text-withus-cta">외고관</p>
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
                      className="group block rounded border border-white/20 bg-white/10 px-4 py-3 shadow-sm shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:shadow-md hover:shadow-black/30"
                    >
                      <p className="text-base font-bold text-white">{locName}</p>
                      <p className="mt-1 text-sm leading-snug text-white/60">{loc.address}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-base font-bold text-white">{loc.phone}</span>
                        <svg className="h-4 w-4 text-white/30 transition-colors group-hover:text-white/70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
            {/* 입시관 그룹 */}
            <div className="lg:w-1/4">
              <p className="mb-2 text-sm font-bold tracking-wider text-withus-cta">입시관</p>
              <a
                href={CAMPUS_MAP_URLS["입시관"]}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded border border-white/20 bg-white/10 px-4 py-3 shadow-sm shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:shadow-md hover:shadow-black/30"
              >
                <p className="text-base font-bold text-white">입시관</p>
                <p className="mt-1 text-sm leading-snug text-white/60">강남구 도곡로77길 5 유성빌딩, 3층</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-base font-bold text-white">02-562-5759</span>
                  <svg className="h-4 w-4 text-white/30 transition-colors group-hover:text-white/70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
                </div>
              </a>
            </div>
          </div>

          {/* 구분선 */}
          <div className="mb-4 h-px bg-white/15" />

          {/* 하단: 법적 정보 */}
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
            <p className="text-xs text-white/45 md:text-sm">{legal.businessNumber}</p>
            <p className="text-xs text-white/45 md:text-sm">{brand.academyRegistration}</p>
            <p className="text-xs text-white/45 md:text-sm">{legal.reportingAgency}</p>
            <p className="mt-1 text-xs text-white/30 sm:ml-auto sm:mt-0 md:text-sm">{legal.copyright}</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
