import { Suspense } from "react";
import BriefingNav from "@/components/BriefingNav";
import BriefingTabContent from "@/components/BriefingTabContent";

export const metadata = {
  title: "대치 위더스 학원",
  description: "위더스 학원 설명회 - 외고, 일반고",
};

export default function InfoSessionPage() {
  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="mb-8 text-center">
          <p className="font-sans text-2xl font-bold tracking-tight text-[#0a1e40] md:text-3xl lg:text-4xl">
            위더스 설명회를 안내합니다.
          </p>
        </header>
        <Suspense fallback={<div className="h-12" />}>
          <BriefingNav />
        </Suspense>
        <div className="mt-6">
          <Suspense fallback={null}>
            <BriefingTabContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
