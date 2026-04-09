type SMSBannerProps = {
  /** true면 바깥 section/패딩 없이 내용만 렌더 (InfoSection 내부 삽입용) */
  nested?: boolean;
};

/** 상단 배너와 동일한 형태: 아이콘 + 텍스트(제목/설명) + 버튼, 동일 패딩·버튼 크기 */
const MESSAGE_ICON = (
  <svg className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function SMSBanner({ nested = false }: SMSBannerProps) {
  const linkBlock = (
    <a
      href="https://docs.google.com/forms/d/1Avu-t9dSlfYuGvpNOul_p6mBiqVnz2zJvp2zZhkXZ_k/viewform?edit_requested=true"
      target="_blank"
      rel="noopener noreferrer"
      className="relative block min-w-0 overflow-hidden rounded-2xl bg-gradient-to-r from-withus-navy via-withus-navy-700 to-withus-navy-500 px-5 py-4 shadow-[0_10px_40px_rgba(15,26,46,0.15)] transition-opacity hover:opacity-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-cta sm:px-6 sm:py-5"
    >
      <div className="relative flex min-w-0 flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
          <span className="text-white/95">{MESSAGE_ICON}</span>
          <div className="min-w-0">
            <p className="text-lg font-bold text-white sm:text-xl">학습에 필요한 정보를 문자로 알려드립니다!</p>
            <p className="mt-0.5 text-sm text-white/85 sm:text-base">설명회 일정과 입시 뉴스를 가장 먼저 받아보세요.</p>
          </div>
        </div>
        <span className="w-full shrink-0 rounded-xl bg-white px-6 py-3.5 text-center text-lg font-bold text-gray-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto sm:min-w-[180px] sm:px-8 sm:py-4">
          문자 수신 등록
        </span>
      </div>
    </a>
  );

  if (nested) {
    return <div className="min-w-0 w-full">{linkBlock}</div>;
  }

  return (
    <section className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {linkBlock}
      </div>
    </section>
  );
}
