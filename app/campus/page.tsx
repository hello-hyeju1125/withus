import LocationsSection from "@/components/LocationsSection";
import { Suspense } from "react";

export const metadata = {
  title: "대치 위더스 학원",
  description: "위더스 학원 교육관 안내 - 프리미엄 관, M관, 입시관 위치 및 지도",
};

export default function CampusPage() {
  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <Suspense fallback={null}>
        <LocationsSection />
      </Suspense>
    </div>
  );
}
