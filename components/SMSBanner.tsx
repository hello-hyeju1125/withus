export default function SMSBanner() {
  return (
    <section className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <a
          href="https://docs.google.com/forms/d/1Avu-t9dSlfYuGvpNOul_p6mBiqVnz2zJvp2zZhkXZ_k/viewform?edit_requested=true"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-[#1e3a8a] px-6 py-6 transition-opacity hover:opacity-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-8 sm:py-8"
        >
          <div className="relative flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:items-center md:gap-8 md:text-left">
            {/* 좌측: 텍스트 그룹 */}
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                학습에 필요한 정보를 문자로 알려드립니다!
              </h2>
              <p className="text-sm text-gray-300 sm:text-base">
                설명회 일정과 입시 뉴스를 가장 먼저 받아보세요.
              </p>
            </div>

            {/* 우측: 버튼 */}
            <span className="shrink-0 rounded-full bg-white/90 px-6 py-2 text-sm font-bold text-blue-900 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] sm:px-7 sm:text-base">
              문자 수신 등록 &gt;
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
