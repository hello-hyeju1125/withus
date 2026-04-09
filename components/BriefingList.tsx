"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export interface BriefingItem {
  id: string;
  title: string;
  author: string;
  content?: string;
  imageUrl?: string;
}

function formatContent(text: string) {
  const lines = text.split("\n");
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return lines.map((line, i) => (
    <span key={i} className="block">
      {line.split(urlRegex).map((part, j) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={j}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-withus-navy underline hover:opacity-80"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export default function BriefingList({
  items,
  loading = false,
}: {
  items: BriefingItem[];
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
        `briefing-content-${previousOpenId}`
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
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-withus-bg-hover bg-white py-16">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-withus-navy border-t-transparent"
          aria-hidden
        />
        <p className="text-sm text-withus-navy-300">설명회를 불러오는 중...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-withus-bg-hover bg-white shadow-sm">
        <div className="py-16 text-center text-sm text-withus-navy-300">
          등록된 설명회가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-withus-bg-hover bg-white shadow-sm">
      {/* 헤더 */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-withus-bg-hover bg-withus-bg px-4 py-3 text-sm font-semibold text-withus-navy-300 md:grid-cols-[60px_1fr_100px]">
        <span className="w-8 shrink-0 md:w-[60px]">번호</span>
        <span className="min-w-0">제목</span>
        <span className="hidden shrink-0 md:block">작성자</span>
      </div>

      <ul className="divide-y divide-withus-bg-hover">
        {items.map((item, index) => {
          const isOpen = openId === item.id;
          const displayNumber = index + 1;
          return (
            <li key={item.id} className="list-none">
              <button
                type="button"
                onClick={(e) => handleTitleClick(item.id, e.currentTarget)}
                className="scroll-mt-[170px] grid w-full grid-cols-[auto_1fr_auto] gap-2 border-b border-withus-bg-hover bg-white px-4 py-3 text-left transition-all duration-200 hover:bg-withus-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-withus-cta md:grid-cols-[60px_1fr_100px] md:gap-3"
                aria-expanded={isOpen}
                aria-controls={`briefing-content-${item.id}`}
                id={`briefing-trigger-${item.id}`}
              >
                <span className="w-8 shrink-0 text-sm text-withus-navy-300 md:w-[60px] md:text-base">
                  {displayNumber}
                </span>
                <span
                  className="min-w-0 truncate text-left text-sm font-medium text-withus-navy md:text-base"
                >
                  {item.title}
                </span>
                <span className="flex shrink-0 items-center justify-end gap-2">
                  <span className="hidden text-sm text-withus-navy-300 md:inline">
                    {item.author}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-withus-navy-300 transition-transform duration-300"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    aria-hidden
                  />
                </span>
              </button>

              <div className="px-4 pb-2 md:hidden">
                <span className="text-xs text-withus-navy-300">
                  작성자: {item.author}
                </span>
              </div>

              <div
                id={`briefing-content-${item.id}`}
                role="region"
                aria-labelledby={`briefing-trigger-${item.id}`}
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-b border-withus-bg-hover bg-withus-bg px-4 py-5">
                    <div className="space-y-4">
                      {item.imageUrl && (
                        <div className="relative w-full overflow-hidden rounded-lg border border-withus-bg-hover bg-white">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={800}
                            height={600}
                            className="max-h-[70vh] w-full object-contain"
                            unoptimized
                          />
                        </div>
                      )}
                      {item.content ? (
                        <div className="rounded-lg border border-withus-bg-hover bg-white p-6 text-sm leading-relaxed text-withus-navy-500">
                          {formatContent(item.content)}
                        </div>
                      ) : !item.imageUrl ? (
                        <div className="rounded-lg border border-dashed border-withus-bg-hover bg-white p-6 text-center text-sm text-withus-navy-300">
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
