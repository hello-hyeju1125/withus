export const metadata = {
  title: "대치 위더스 학원",
  description: "위더스 학원 오시는 길 - P관, M관, S관, 입시관",
};

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="font-serif text-2xl font-bold text-withus-navy md:text-3xl">
          오시는 길
        </h1>
        <p className="mt-2 text-cool-gray-500">
          P관, M관, S관, 입시관 위치 안내입니다.
        </p>
        <div className="mt-8 rounded-lg border border-cool-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-cool-gray-500">
            지도 및 상세 주소가 여기에 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
