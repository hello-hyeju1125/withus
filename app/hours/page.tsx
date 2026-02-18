import BusinessHours from "@/components/BusinessHours";

export const metadata = {
  title: "대치 위더스 학원",
  description: "위더스 학원의 평일/주말 상담 가능 시간과 교육관별 빠른 전화 연결을 확인하세요.",
};

export default function HoursPage() {
  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <BusinessHours />
    </div>
  );
}
