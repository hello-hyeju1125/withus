"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const DEEP_NAVY = "#0a1e40";

export interface NoticeItem {
  id: string;
  title: string;
  isImportant: boolean;
  author: string;
  content: string;
  imageUrls?: string[];
  createdAt: number | null;
}

function formatContent(text: string) {
  if (!text.trim()) return null;
  const lines = text.split("\n");
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return lines.map((line, i) => (
    <span key={i} className="block">
      {line.split(urlRegex).map((part, j) =>
        /^https?:\/\//.test(part) ? (
          /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(part) ? (
            <a
              key={j}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={part}
                alt="첨부 이미지"
                className="max-h-64 max-w-full rounded-lg border border-cool-gray-200 object-contain"
              />
            </a>
          ) : (
            <a
              key={j}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-withus-navy underline hover:opacity-80"
            >
              {part}
            </a>
          )
        ) : (
          part
        )
      )}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export default function NoticeList({
  items,
  loading = false,
}: {
  items: NoticeItem[];
  loading?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleTitleClick = (id: string, target: HTMLElement) => {
    const willOpen = openId !== id;
    const previousOpenId = openId;
    setOpenId((prev) => (prev === id ? null : id));
    if (!willOpen) return;

    const doScroll = () =>
      target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (previousOpenId != null) {
      const closingEl = document.getElementById(
        `notice-content-${previousOpenId}`
      );
      if (closingEl) {
        let done = false;
        const runOnce = () => {
          if (done) return;
          done = true;
          closingEl.removeEventListener("transitionend", onEnd);
          doScroll();
        };
        const onEnd = () => runOnce();
        closingEl.addEventListener("transitionend", onEnd);
        setTimeout(runOnce, 500);
      } else {
        doScroll();
      }
    } else {
      doScroll();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-cool-gray-200 bg-white py-16">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-withus-navy border-t-transparent"
          aria-hidden
        />
        <p className="text-sm text-slate-500">공지사항을 불러오는 중...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-cool-gray-200 bg-white shadow-sm">
        <div className="py-16 text-center text-sm text-slate-500">
          등록된 공지사항이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-cool-gray-200 bg-white shadow-sm">
      {/* 헤더 */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-cool-gray-200 bg-cool-gray-50/60 px-4 py-3 text-sm font-semibold text-cool-gray-600 md:grid-cols-[60px_1fr_100px]">
        <span className="w-8 shrink-0 md:w-[60px]">번호</span>
        <span className="min-w-0">제목</span>
        <span className="hidden shrink-0 md:block">작성자</span>
      </div>

      <ul className="divide-y divide-cool-gray-100">
        {items.map((item, index) => {
          const isOpen = openId === item.id;
          const displayNumber = index + 1;
          return (
            <li key={item.id} className="list-none">
              <button
                type="button"
                onClick={(e) => handleTitleClick(item.id, e.currentTarget)}
                className={`scroll-mt-[170px] grid w-full grid-cols-[auto_1fr_auto] gap-2 border-b border-cool-gray-100 px-4 py-3 text-left transition-all duration-200 hover:bg-cool-gray-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-withus-gold md:grid-cols-[60px_1fr_100px] md:gap-3 ${
                  item.isImportant ? "bg-amber-50/60" : "bg-white"
                }`}
                aria-expanded={isOpen}
                aria-controls={`notice-content-${item.id}`}
                id={`notice-trigger-${item.id}`}
              >
                <span className="w-8 shrink-0 text-sm text-cool-gray-500 md:w-[60px] md:text-base">
                  {displayNumber}
                </span>
                <span
                  className="min-w-0 truncate text-left text-sm font-medium md:text-base"
                  style={{ color: DEEP_NAVY }}
                >
                  {item.isImportant && (
                    <span className="mr-2 inline-flex rounded bg-amber-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                      중요
                    </span>
                  )}
                  {item.title}
                </span>
                <span className="flex shrink-0 items-center justify-end gap-2">
                  <span className="hidden text-sm text-cool-gray-500 md:inline">
                    {item.author}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-cool-gray-400 transition-transform duration-300"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    aria-hidden
                  />
                </span>
              </button>

              <div className="px-4 pb-2 md:hidden">
                <span className="text-xs text-cool-gray-500">
                  작성자: {item.author}
                </span>
              </div>

              <div
                id={`notice-content-${item.id}`}
                role="region"
                aria-labelledby={`notice-trigger-${item.id}`}
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-b border-cool-gray-100 bg-cool-gray-50/40 px-4 py-5">
                    <div className="space-y-4">
                      {item.imageUrls && item.imageUrls.length > 0 && (
                        <div className="flex flex-col gap-4">
                          {item.imageUrls.map((url) => (
                            <div
                              key={url}
                              className="relative w-full overflow-hidden rounded-lg border border-cool-gray-200 bg-white"
                            >
                              <Image
                                src={url}
                                alt={item.title}
                                width={800}
                                height={600}
                                className="max-h-[70vh] w-full object-contain"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {item.content ? (
                        <div className="rounded-lg border border-cool-gray-200 bg-white p-6 text-sm leading-relaxed text-cool-gray-800">
                          {formatContent(item.content)}
                        </div>
                      ) : !item.imageUrls?.length ? (
                        <div className="rounded-lg border border-dashed border-cool-gray-200 bg-white p-6 text-center text-sm text-cool-gray-500">
                          상세 내용이 없습니다.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
