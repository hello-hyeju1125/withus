"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  {
    src: "/asset/banner_01.svg",
    alt: "예비 고3 대원외고 시간표",
    caption: "예비 고3 대원외고 시간표",
    href: "/schedule/daewon?grade=3",
  },
  {
    src: "/asset/banner_02.svg",
    alt: "예비 고2 대원외고 시간표",
    caption: "예비 고2 대원외고 시간표",
    href: "/schedule/daewon?grade=2",
  },
  {
    src: "/asset/banner_03.svg",
    alt: "예비 고1 대원외고 시간표",
    caption: "예비 고1 대원외고 시간표",
    href: "/schedule/daewon?grade=1",
  },
  {
    src: "/asset/banner_04.svg",
    alt: "예비 고3 한영외고 시간표",
    caption: "예비 고3 한영외고 시간표",
    href: "/schedule/hanyoung?grade=3",
  },
  {
    src: "/asset/banner_05.svg",
    alt: "예비 고1 한영외고 시간표",
    caption: "예비 고1 한영외고 시간표",
    href: "/schedule/hanyoung?grade=1",
  },
  {
    src: "/asset/banner_06.svg",
    alt: "예비 고2 한영외고 시간표",
    caption: "예비 고2 한영외고 시간표",
    href: "/schedule/hanyoung?grade=2",
  },
] as const;

const BANNERS_PER_PAGE = 2;
const TOTAL_PAGES = Math.ceil(BANNERS.length / BANNERS_PER_PAGE);

function BannerSlot({
  src,
  alt,
  href,
  caption,
}: {
  src: string;
  alt: string;
  href: string;
  caption: string;
}) {
  const content = (
    <div className="group/banner relative aspect-[3/1] w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/banner:scale-105"
      />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20 px-4 transition-colors duration-300 group-hover/banner:bg-black/30"
        style={{ fontFamily: "var(--font-gmarket)" }}
      >
        <span className="text-center text-[1.35rem] font-medium text-white drop-shadow-md transition-transform duration-300 group-hover/banner:scale-105 sm:text-[1.5rem] md:text-[1.8rem]">
          {caption}
        </span>
        <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#002761] shadow-md transition-all duration-300 group-hover/banner:scale-105 group-hover/banner:bg-white sm:px-5 sm:py-2.5 sm:text-base">
          시간표 바로 가기
        </span>
      </div>
    </div>
  );

  return (
    <Link
      href={href}
      className="block cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold focus-visible:rounded-2xl"
    >
      {content}
    </Link>
  );
}

export default function PromoBanners() {
  const [currentPage, setCurrentPage] = useState(0);

  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(TOTAL_PAGES - 1, p + 1));

  return (
    <section className="px-4 pt-6 pb-3 sm:px-6 sm:pt-8 sm:pb-4 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Slider: 2 banners per page, 3 pages total (6 banners), slide on arrow */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex w-[300%] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentPage * (100 / 3)}%)` }}
          >
            {Array.from({ length: TOTAL_PAGES }, (_, pageIndex) => {
              const start = pageIndex * BANNERS_PER_PAGE;
              const pageBanners = BANNERS.slice(start, start + BANNERS_PER_PAGE);
              return (
                <div
                  key={pageIndex}
                  className="grid w-1/3 flex-shrink-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
                >
                  {pageBanners.map((banner) => (
                    <BannerSlot
                      key={banner.src}
                      src={banner.src}
                      alt={banner.alt}
                      href={banner.href}
                      caption={banner.caption}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation controls - below slider, centered */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentPage === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#002761] transition-colors hover:bg-[#002761]/10 disabled:opacity-40 disabled:hover:bg-transparent"
            aria-label="이전 배너"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <span className="min-w-[4rem] text-center text-sm font-medium text-[#002761] tabular-nums">
            {currentPage + 1} / {TOTAL_PAGES}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={currentPage === TOTAL_PAGES - 1}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#002761] transition-colors hover:bg-[#002761]/10 disabled:opacity-40 disabled:hover:bg-transparent"
            aria-label="다음 배너"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
