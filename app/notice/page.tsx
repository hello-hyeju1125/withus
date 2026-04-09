import { Suspense } from "react";
import NoticePageContent from "@/components/NoticePageContent";

export const metadata = {
  title: "대치 위더스 학원",
  description: "위더스 학원 공지 및 안내",
};

export default function NoticePage() {
  return (
    <div className="min-h-screen bg-withus-bg">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="mb-8 text-center">
          <p className="font-sans text-2xl font-bold tracking-tight text-withus-navy md:text-3xl lg:text-4xl">
            공지사항 및 안내를 확인하세요.
          </p>
        </header>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-withus-bg-hover bg-white py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-withus-cta border-t-transparent" />
              <p className="text-sm text-withus-navy-300">공지사항을 불러오는 중...</p>
            </div>
          }
        >
          <NoticePageContent />
        </Suspense>
      </div>
    </div>
  );
}
