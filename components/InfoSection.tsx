"use client";

import Link from "next/link";
import { useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";

const iconSize = 28;

const INFO_BUTTONS = [
  { label: "강사진 소개", href: "/instructors", iconSrc: "/asset/icon_teacher.svg", type: "link" },
  { label: "근무시간", href: "/hours", iconSrc: "/asset/icont_time.svg", type: "link" },
  { label: "교육관 안내", href: "/campus", iconSrc: "/asset/icon_location.svg", type: "link" },
  { label: "상담 문의", iconSrc: "/asset/icon_cs.svg", type: "consultation" },
] as const;

export default function InfoSection() {
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <>
      <section className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {INFO_BUTTONS.map((item) => {
              const { label, iconSrc, type } = item;
              const commonClassName =
                "group flex flex-col items-center justify-center rounded-2xl border border-cool-gray-200/80 py-4 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#002761] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold sm:py-5";

              const content = (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={iconSrc}
                    alt=""
                    className="mb-2 h-7 w-7 shrink-0 object-contain transition-transform duration-300 group-hover:scale-110"
                    width={iconSize}
                    height={iconSize}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-withus-navy sm:text-base">
                    {label}
                  </span>
                </>
              );

              if (type === "consultation") {
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setConsultationOpen(true)}
                    className={commonClassName}
                    style={{ backgroundColor: "#f2f6fb" }}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={commonClassName}
                  style={{ backgroundColor: "#f2f6fb" }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </>
  );
}
