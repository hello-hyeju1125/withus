"use client";

import { useEffect, useState } from "react";
import NoticeList, { type NoticeItem } from "@/components/NoticeList";

export default function NoticePageContent() {
  const [items, setItems] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${base}/api/notices`)
      .then((res) => {
        if (!res.ok) throw new Error("공지사항을 불러올 수 없습니다.");
        return res.json();
      })
      .then((list: NoticeItem[]) => {
        if (!cancelled) {
          setItems(list);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "공지사항을 불러올 수 없습니다.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 py-8 text-center text-sm text-amber-800">
        <p className="font-medium">공지사항을 불러오지 못했습니다.</p>
        <p className="mt-1 text-xs">{error}</p>
      </div>
    );
  }

  return <NoticeList items={items} loading={loading} />;
}
