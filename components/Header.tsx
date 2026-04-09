import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-withus-bg-hover bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-center px-4 sm:h-[84px] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex cursor-pointer items-center"
          aria-label="위더스 학원 홈"
        >
          <span className="font-gmarket text-2xl font-extrabold tracking-tight text-withus-navy sm:text-3xl md:text-4xl">
            <span className="text-[1.25em] text-[#FFD600]">W</span> 대치위더스학원
          </span>
        </Link>
      </div>
    </header>
  );
}
