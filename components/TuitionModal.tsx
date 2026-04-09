"use client";

import { useEffect } from "react";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TUITION_IMAGES = ["/tuition/tuition-1.png", "/tuition/tuition-2.png", "/tuition/tuition-3.png"] as const;

export default function TuitionModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tuition-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="모달 닫기"
      />
      {/* Modal panel */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-withus-bg-hover px-5 py-4">
          <h2 id="tuition-modal-title" className="text-lg font-bold text-withus-navy">
            교습비
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-withus-navy-300 transition-colors hover:bg-withus-bg-hover hover:text-withus-navy"
            aria-label="닫기"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-6">
            {TUITION_IMAGES.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={`교습비등 게시표 ${index + 1}`}
                width={1200}
                height={1600}
                className="h-auto w-full rounded-lg border border-withus-bg-hover object-contain"
                sizes="(max-width: 896px) 100vw, 896px"
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
