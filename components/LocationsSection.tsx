"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  campusLocations,
  type CampusLocation,
  type CampusLocationId,
} from "@/data/campusLocations";

const VALID_TAB_IDS: CampusLocationId[] = ["premium", "m", "entrance"];

const SELECTED_CARD_BG = "bg-[#0a1e40]";

function LocationCard({
  location,
  isSelected,
  onSelect,
}: {
  location: CampusLocation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-withus-gold focus-visible:ring-offset-2 ${
        isSelected
          ? `${SELECTED_CARD_BG} border-[#0a1e40] text-white shadow-md`
          : "border-cool-gray-200 bg-white text-withus-navy hover:border-cool-gray-300 hover:shadow-sm"
      }`}
      aria-pressed={isSelected}
      aria-label={`${location.name} 선택`}
    >
      <h3 className="font-semibold">{location.name}</h3>
      <p className={`mt-1 text-sm ${isSelected ? "text-white/90" : "text-cool-gray-600"}`}>
        {location.address}
      </p>
      <p className={`mt-0.5 text-sm ${isSelected ? "text-white/80" : "text-cool-gray-500"}`}>
        {location.phone}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={location.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-withus-gold focus-visible:ring-offset-2 ${
            isSelected
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-cool-gray-100 text-withus-navy hover:bg-cool-gray-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          네이버 지도에서 보기
        </a>
        <a
          href={`tel:${location.phone.replace(/-/g, "")}`}
          className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-withus-gold focus-visible:ring-offset-2 ${
            isSelected
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-cool-gray-100 text-withus-navy hover:bg-cool-gray-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          전화 걸기
        </a>
      </div>
    </button>
  );
}

function MapFrame({
  src,
  onLoad,
  isLoading,
}: {
  src: string;
  onLoad: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cool-gray-100 shadow-md md:aspect-video">
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-cool-gray-100"
          aria-hidden="true"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-withus-navy border-t-transparent"
            role="status"
            aria-label="로딩 중"
          />
          <span className="text-sm text-cool-gray-500">로딩 중...</span>
        </div>
      )}
      <iframe
        src={src}
        title="네이버 지도"
        className="absolute inset-0 h-full w-full rounded-2xl"
        onLoad={onLoad}
        sandbox="allow-scripts allow-same-origin"
        allow="geolocation"
      />
    </div>
  );
}

export default function LocationsSection() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const initialId: CampusLocationId =
    tabFromUrl && VALID_TAB_IDS.includes(tabFromUrl as CampusLocationId)
      ? (tabFromUrl as CampusLocationId)
      : "premium";

  const [selectedId, setSelectedId] = useState<CampusLocationId>(initialId);
  const [mapLoading, setMapLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const selected = campusLocations.find((loc) => loc.id === selectedId) ?? campusLocations[0];

  // URL 쿼리 tab 변경 시 선택 관 동기화 (메뉴에서 진입 시)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && VALID_TAB_IDS.includes(tab as CampusLocationId)) {
      setSelectedId(tab as CampusLocationId);
      setMapLoading(true);
    }
  }, [searchParams]);

  // 데스크톱(1024px 이상)에서만 지도 렌더링
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncDesktopState = () => setIsDesktop(mediaQuery.matches);
    syncDesktopState();
    mediaQuery.addEventListener("change", syncDesktopState);
    return () => mediaQuery.removeEventListener("change", syncDesktopState);
  }, []);

  const handleMapLoad = useCallback(() => {
    setMapLoading(false);
  }, []);

  const handleSelect = useCallback((id: CampusLocationId) => {
    setSelectedId(id);
    setMapLoading(true);
  }, []);

  // iframe이 embed를 막으면 onLoad가 오지 않을 수 있음 → 일정 시간 후 로딩 해제
  useEffect(() => {
    if (!mapLoading) return;
    const t = setTimeout(() => setMapLoading(false), 5000);
    return () => clearTimeout(t);
  }, [selectedId, mapLoading]);

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12 md:py-16"
      aria-labelledby="locations-heading"
    >
      <header className="mb-8 text-center">
        <p
          id="locations-heading"
          className="font-sans text-2xl font-bold tracking-tight text-[#0a1e40] md:text-3xl lg:text-4xl"
        >
          위더스의 교육관을 안내합니다.
        </p>
      </header>

      {/* Mobile: 카드만 노출 / Desktop: 지도+카드 노출 */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* 지도 영역 - PC에서만 노출 */}
        {isDesktop && (
          <div className="flex-1 lg:min-w-0 lg:order-2">
            <MapFrame
              src={selected.naverMapUrl}
              onLoad={handleMapLoad}
              isLoading={mapLoading}
            />
          </div>
        )}

        {/* 교육관 선택 - 카드 리스트 (PC 좌측, 모바일 하단) */}
        <div className="flex w-full flex-col gap-3 lg:order-1 lg:max-w-sm lg:flex-shrink-0">
          {campusLocations.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              isSelected={selectedId === loc.id}
              onSelect={() => handleSelect(loc.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
