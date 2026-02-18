"use client";

import { useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";

const FLOATING_ITEMS = [
  {
    label: "문자 수신 신청",
    href: "https://docs.google.com/forms/d/1Avu-t9dSlfYuGvpNOul_p6mBiqVnz2zJvp2zZhkXZ_k/viewform?edit_requested=true",
    external: true,
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
] as const;

export default function FloatingBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const consultationIcon = (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );

  return (
    <>
      <aside
        className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 sm:right-6 md:bottom-8 md:right-8"
        aria-label="퀵 메뉴"
      >
        {!collapsed && (
          <div className="flex flex-col gap-3">
            {FLOATING_ITEMS.map(({ label, href, external, icon }) => (
              <a
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 rounded-full bg-[#002761] px-4 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#002761]/90 hover:text-withus-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold sm:px-5"
              >
                {icon}
                <span className="whitespace-nowrap">{label}</span>
              </a>
            ))}
            <button
              type="button"
              onClick={() => setConsultationOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#002761] px-4 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#002761]/90 hover:text-withus-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold sm:px-5"
            >
              {consultationIcon}
              <span className="whitespace-nowrap">상담 문의</span>
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002761] text-white shadow-md transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold sm:h-14 sm:w-14"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "퀵 메뉴 열기" : "퀵 메뉴 닫기"}
        >
          {collapsed ? (
            <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ) : (
            <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </aside>
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </>
  );
}
