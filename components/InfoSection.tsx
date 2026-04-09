"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ConsultationModal from "@/components/ConsultationModal";

const SMS_FORM_URL =
  "https://docs.google.com/forms/d/1Avu-t9dSlfYuGvpNOul_p6mBiqVnz2zJvp2zZhkXZ_k/viewform?edit_requested=true";

export default function InfoSection() {
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <div className="w-full min-w-0">
      <section className="min-w-0 px-4 py-3 sm:px-6 sm:py-4 lg:px-8" aria-label="안내 메뉴">
        <div className="mx-auto max-w-7xl min-w-0">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

            <button
              type="button"
              onClick={() => setConsultationOpen(true)}
              className="group relative flex items-center gap-5 overflow-hidden rounded border-2 border-withus-navy bg-[#E8EBF0] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-withus-navy hover:shadow-md sm:p-6"
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-withus-navy shadow-sm transition-colors duration-300 group-hover:bg-white sm:h-14 sm:w-14">
                <svg className="h-6 w-6 text-white transition-colors duration-300 group-hover:text-withus-navy sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>

              <div className="relative min-w-0 flex-1">
                <p className="text-lg font-bold text-withus-navy transition-colors duration-300 group-hover:text-white sm:text-xl md:text-2xl"><span className="font-gmarket font-medium">입학 상담</span><span className="ml-4 text-sm font-normal text-withus-navy-300 transition-colors duration-300 group-hover:text-white/70 sm:text-base">전화·문자로 빠르게 안내해 드려요</span></p>
              </div>

              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-withus-navy shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md sm:h-11 sm:w-11">
                <ArrowRight className="h-5 w-5 text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-withus-navy" strokeWidth={2.5} aria-hidden />
              </span>
            </button>

            <a
              href={SMS_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-5 overflow-hidden rounded border-2 border-withus-navy bg-[#E8EBF0] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-withus-navy hover:shadow-md sm:p-6"
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-withus-navy shadow-sm transition-colors duration-300 group-hover:bg-white sm:h-14 sm:w-14">
                <svg className="h-6 w-6 text-white transition-colors duration-300 group-hover:text-withus-navy sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>

              <div className="relative min-w-0 flex-1">
                <p className="text-lg font-bold text-withus-navy transition-colors duration-300 group-hover:text-white sm:text-xl md:text-2xl"><span className="font-gmarket font-medium">문자 수신 등록</span><span className="ml-4 text-sm font-normal text-withus-navy-300 transition-colors duration-300 group-hover:text-white/70 sm:text-base">설명회·입시 소식을 먼저 받아보세요</span></p>
              </div>

              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-withus-navy shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md sm:h-11 sm:w-11">
                <ArrowRight className="h-5 w-5 text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-withus-navy" strokeWidth={2.5} aria-hidden />
              </span>
            </a>

          </div>
        </div>
      </section>
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </div>
  );
}
