"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { label: "외고", value: "외고" },
  { label: "일반고", value: "일반고" },
] as const;

export type BriefingTab = (typeof TABS)[number]["value"];

export default function BriefingNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") === "일반고" ? "일반고" : "외고") as BriefingTab;

  const handleTabChange = (value: BriefingTab) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", value);
    router.push(`/info-session?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full" role="navigation" aria-label="설명회 유형 선택">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-2">
        {TABS.map(({ label, value }) => {
          const isActive = currentTab === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleTabChange(value)}
              className={`relative pb-3 pt-2 text-xl font-bold transition-colors ${
                isActive ? "text-[#002761]" : "text-slate-400"
              }`}
              aria-pressed={isActive}
              aria-current={isActive ? "true" : undefined}
            >
              {label}
              <span
                className={`absolute bottom-0 left-0 right-0 block border-b-4 ${
                  isActive ? "border-[#FEF600]" : "border-slate-200"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { TABS };
