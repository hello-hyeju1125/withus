import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-withus-cream-dark bg-withus-cream/95 backdrop-blur supports-[backdrop-filter]:bg-withus-cream/80">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-center px-4 sm:h-[84px] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex cursor-pointer items-center"
          aria-label="위더스 학원 홈"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/asset/WITHUS_logo.svg"
            alt="위더스"
            className="h-[32px] w-auto sm:h-[36px]"
          />
        </Link>
      </div>
    </header>
  );
}
