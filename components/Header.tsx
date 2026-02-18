import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-withus-cream-dark bg-withus-cream/95 backdrop-blur supports-[backdrop-filter]:bg-withus-cream/80">
      <div className="mx-auto flex h-[92px] max-w-7xl items-center justify-center px-4 sm:h-[106px] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex cursor-pointer items-center transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
          aria-label="위더스 학원 홈"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/asset/WITHUS_logo.svg"
            alt="위더스"
            className="h-[38.4px] w-auto drop-shadow-sm transition-all duration-200 ease-out group-hover:drop-shadow-lg group-hover:brightness-110 sm:h-[43.2px]"
          />
        </Link>
      </div>
    </header>
  );
}
