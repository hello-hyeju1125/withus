"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  title?: string;
};

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  title = "설명회 영상",
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!mounted || !isOpen) return null;

  // YouTube URL을 embed 형식으로 변환 (watch?v=xxx, youtu.be/xxx -> https://www.youtube.com/embed/xxx)
  const embedUrl = (() => {
    if (!videoUrl) return "";
    const m = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
    if (videoUrl.includes("youtube.com/embed/")) return videoUrl;
    return videoUrl;
  })();

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      {/* Backdrop - 클릭 시 닫기 */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-label="모달 닫기"
      />
      {/* Modal panel */}
      <div className="relative flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
          <h2
            id="video-modal-title"
            className="text-base font-bold text-slate-800 sm:text-lg"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="닫기"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="relative w-full pb-[56.25%]">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="absolute left-0 top-0 h-full w-full rounded-b-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-b-2xl bg-slate-100 text-slate-500">
              영상 URL이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
