import { Suspense } from "react";
import NoticePageContent from "@/components/NoticePageContent";

export const metadata = {
  title: "대치 위더스 학원",
  description: "위더스 학원 공지 및 안내",
};

export default function NoticePage() {
  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="mb-8 text-center">
          <p className="font-sans text-2xl font-bold tracking-tight text-[#0a1e40] md:text-3xl lg:text-4xl">
            공지사항 및 안내를 확인하세요.
          </p>
        </header>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-cool-gray-200 bg-white py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-withus-navy border-t-transparent" />
              <p className="text-sm text-slate-500">공지사항을 불러오는 중...</p>
            </div>
          }
        >
          <NoticePageContent />
        </Suspense>
      </div>
    </div>
  );
}
