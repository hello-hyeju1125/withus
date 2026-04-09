import SchoolSelector from "@/components/SchoolSelector";
import PromoBanners from "@/components/PromoBanners";
import InfoSection from "@/components/InfoSection";

export default function HomePage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-withus-bg">
      {/* B. 학교 선택 섹션 - Premium Active Cards */}
      <SchoolSelector />

      {/* C. Promotional Banners */}
      <PromoBanners />

      {/* D. Bottom Info: 상담 배너 → 문자 수신 */}
      <InfoSection />
    </div>
  );
}
