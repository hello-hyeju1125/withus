"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  {
    src: "/asset/banner_01.svg",
    alt: "고3 대원외고 시간표",
    caption: "고3 대원외고 시간표",
    href: "/schedule/daewon?grade=3",
  },
  {
    src: "/asset/banner_02.svg",
    alt: "고2 대원외고 시간표",
    caption: "고2 대원외고 시간표",
    href: "/schedule/daewon?grade=2",
  },
  {
    src: "/asset/banner_03.svg",
    alt: "고1 대원외고 시간표",
    caption: "고1 대원외고 시간표",
    href: "/schedule/daewon?grade=1",
  },
  {
    src: "/asset/banner_04.svg",
    alt: "고3 한영외고 시간표",
    caption: "고3 한영외고 시간표",
    href: "/schedule/hanyoung?grade=3",
  },
  {
    src: "/asset/banner_05.svg",
    alt: "고1 한영외고 시간표",
    caption: "고1 한영외고 시간표",
    href: "/schedule/hanyoung?grade=1",
  },
  {
    src: "/asset/banner_06.svg",
    alt: "고2 한영외고 시간표",
    caption: "고2 한영외고 시간표",
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
    <div className="group/banner relative aspect-[3/1] w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-withus-navy/15 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:ring-withus-navy/25">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-withus-navy/30 px-4 pt-5 transition-colors duration-300 group-hover/banner:bg-withus-gold/90"
      >
        <span className="text-center text-[1.6rem] font-bold text-white drop-shadow-md transition-all duration-300 group-hover/banner:text-withus-navy group-hover/banner:drop-shadow-none sm:text-[1.8rem] md:text-[2.2rem]">
          {caption}
        </span>
        <span className="rounded-full bg-white/90 px-4 py-2 text-base font-semibold text-withus-navy shadow-md transition-colors duration-300 group-hover/banner:bg-withus-navy group-hover/banner:text-white sm:px-6 sm:py-3 sm:text-lg">
          시간표 바로 가기
        </span>
      </div>
    </div>
  );

  return (
    <Link
      href={href}
      className="block min-w-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-cta focus-visible:rounded-2xl"
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
    <section className="min-w-0 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="mx-auto max-w-7xl min-w-0 overflow-hidden">
        <div className="min-w-0 overflow-hidden rounded-2xl">
          <div
            className="flex min-w-0 w-[300%] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentPage * (100 / TOTAL_PAGES)}%)` }}
          >
            {Array.from({ length: TOTAL_PAGES }, (_, pageIndex) => {
              const start = pageIndex * BANNERS_PER_PAGE;
              const pageBanners = BANNERS.slice(start, start + BANNERS_PER_PAGE);
              return (
                <div
                  key={pageIndex}
                  className="grid min-w-0 w-1/3 shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
                >
                  {pageBanners.map((banner) => (
                    <div key={banner.src} className="min-w-0 lg:col-span-2">
                      <BannerSlot
                        src={banner.src}
                        alt={banner.alt}
                        href={banner.href}
                        caption={banner.caption}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 sm:mt-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentPage === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full text-withus-navy transition-colors hover:bg-withus-bg-hover disabled:opacity-40 disabled:hover:bg-transparent"
            aria-label="이전 배너"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <span className="min-w-[4rem] text-center text-sm font-medium text-withus-navy tabular-nums">
            {currentPage + 1} / {TOTAL_PAGES}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={currentPage === TOTAL_PAGES - 1}
            className="flex h-9 w-9 items-center justify-center rounded-full text-withus-navy transition-colors hover:bg-withus-bg-hover disabled:opacity-40 disabled:hover:bg-transparent"
            aria-label="다음 배너"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
