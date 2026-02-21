"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BriefingList, { type BriefingItem } from "@/components/BriefingList";

export default function BriefingTabContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "일반고" ? "일반고" : "외고";

  const [items, setItems] = useState<BriefingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${base}/api/briefings?category=${encodeURIComponent(tab)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = typeof data?.error === "string" ? data.error : "설명회를 불러올 수 없습니다.";
          throw new Error(msg);
        }
        return data as BriefingItem[];
      })
      .then((list: BriefingItem[]) => {
        if (!cancelled) {
          setItems(list);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "설명회를 불러올 수 없습니다.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 py-8 text-center text-sm text-amber-800">
        <p className="font-medium">설명회를 불러오지 못했습니다.</p>
        <p className="mt-1 text-xs">{error}</p>
      </div>
    );
  }

  return <BriefingList items={items} loading={loading} />;
}
