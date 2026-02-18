import SchoolSelector from "@/components/SchoolSelector";
import PromoBanners from "@/components/PromoBanners";
import InfoSection from "@/components/InfoSection";
import SMSBanner from "@/components/SMSBanner";

export default function HomePage() {
  return (
    <div className="bg-cool-gray-50/50">
      {/* B. 학교 선택 섹션 - Premium Active Cards */}
      <SchoolSelector />

      {/* C. Promotional Banners */}
      <PromoBanners />

      {/* D. Bottom Info */}
      <InfoSection />

      {/* E. CTA - 문자 수신 등록 배너 */}
      <SMSBanner />
    </div>
  );
}
