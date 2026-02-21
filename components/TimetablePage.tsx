"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import TimetableNav, { SCHOOLS, type SchoolSlug } from "@/components/TimetableNav";
import {
  collection,
  query,
  where,
  onSnapshot,
  type DocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface TimetableItem {
  id: string;
  fileUrl: string;
  fileType: "image" | "pdf";
  fileName?: string;
  createdAt: Timestamp | null;
}

/* ========== 로딩 스피너 ========== */
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-withus-navy border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-slate-500">시간표를 불러오는 중...</p>
    </div>
  );
}

/* ========== 메인 컴포넌트 ========== */
function parseTimetableDoc(doc: DocumentSnapshot): TimetableItem | null {
  const d = doc.data();
  if (!d || typeof d.fileUrl !== "string") return null;
  return {
    id: doc.id,
    fileUrl: d.fileUrl,
    fileType: d.fileType === "pdf" ? "pdf" : "image",
    fileName: typeof d.fileName === "string" ? d.fileName : undefined,
    createdAt: d.createdAt ?? null,
  };
}

/** Firebase Storage 메타데이터 API URL(/o?name=...)이 저장된 경우 실제 다운로드 URL로 변환 */
function isStorageMetadataUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (u.hostname === "firebasestorage.googleapis.com" || u.hostname.endsWith(".firebasestorage.app")) &&
      u.pathname.endsWith("/o") &&
      u.searchParams.has("name")
    );
  } catch {
    return false;
  }
}

function getStoragePathFromMetadataUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const name = u.searchParams.get("name");
    return name ? decodeURIComponent(name) : null;
  } catch {
    return null;
  }
}

function TimetableImage({
  fileUrl,
  resolvedUrl,
  alt,
  priority = false,
}: {
  fileUrl: string;
  resolvedUrl?: string;
  alt: string;
  priority?: boolean;
}) {
  const displayUrl = resolvedUrl ?? fileUrl;
  const isResolving = isStorageMetadataUrl(fileUrl) && !resolvedUrl;

  if (isResolving) {
    return (
      <div className="flex aspect-[3/4] max-h-[70vh] items-center justify-center bg-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-withus-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <Image
      src={displayUrl}
      alt={alt}
      width={1200}
      height={1600}
      sizes="(max-width: 1280px) 100vw, 1280px"
      className="w-full object-contain"
      unoptimized
      priority={priority}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}

export default function TimetablePage({
  currentSchool,
}: {
  currentSchool: SchoolSlug;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gradeFromUrl = searchParams.get("grade");
  const initialGrade =
    gradeFromUrl === "1" || gradeFromUrl === "2" || gradeFromUrl === "3"
      ? gradeFromUrl
      : "1";
  const [grade, setGrade] = useState<string>(initialGrade);

  useEffect(() => {
    setGrade(initialGrade);
  }, [initialGrade]);

  const [items, setItems] = useState<TimetableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    // orderBy 없이 조회 후 클라이언트에서 정렬 (복합 인덱스 불필요)
    const q = query(
      collection(db, "timetables"),
      where("school", "==", currentSchool),
      where("grade", "==", grade)
    );
    setQueryError(null);
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map(parseTimetableDoc)
          .filter((x): x is TimetableItem => x !== null)
          .sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() ?? 0;
            const tb = b.createdAt?.toMillis?.() ?? 0;
            return ta - tb;
          });
        setItems(list);
        setQueryError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore timetables query error:", err);
        setQueryError(err instanceof Error ? err.message : "시간표를 불러올 수 없습니다.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, [currentSchool, grade]);

  // 메타데이터 형식 URL을 서버 API로 실제 다운로드 URL 변환 (기존 잘못 저장된 데이터 대응, CORS 회피)
  useEffect(() => {
    const toResolve = items.filter(
      (item) => item.fileType === "image" && isStorageMetadataUrl(item.fileUrl)
    );
    if (toResolve.length === 0) return;

    const resolve = async (item: TimetableItem) => {
      const path = getStoragePathFromMetadataUrl(item.fileUrl);
      if (!path) return;
      try {
        const res = await fetch(
          `/api/timetable-download-url?path=${encodeURIComponent(path)}`
        );
        const data = await res.json().catch(() => ({}));
        if (res.ok && typeof data.fileUrl === "string") {
          setResolvedUrls((prev) => ({ ...prev, [item.id]: data.fileUrl }));
        }
      } catch (e) {
        console.warn("Failed to resolve storage URL for", item.id, e);
      }
    };

    toResolve.forEach(resolve);
  }, [items]);

  // 첫 번째 시간표 이미지 URL이 준비되면 preload로 즉시 다운로드 시작
  const firstImageItem = items.find((i) => i.fileType === "image");
  const firstImageUrl =
    firstImageItem &&
    (isStorageMetadataUrl(firstImageItem.fileUrl)
      ? resolvedUrls[firstImageItem.id]
      : firstImageItem.fileUrl);

  useEffect(() => {
    if (!firstImageUrl) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = firstImageUrl;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [firstImageUrl]);

  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        {/* TimetableNav: 학교·학년 선택 (이미지와 동일한 스타일) */}
        <div>
          <TimetableNav
            initialSchool={currentSchool}
            initialGrade={grade}
            onChange={(activeSchool, activeGrade) => {
              if (activeSchool !== currentSchool) {
                router.push(`/schedule/${activeSchool}`);
              }
              setGrade(activeGrade);
            }}
          />
        </div>

        {/* 시간표: Firestore 실시간 데이터 - 이미지 */}
        <div className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : queryError ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 py-8 text-center text-sm text-amber-800">
              <p className="font-medium">시간표를 불러오지 못했습니다.</p>
              <p className="mt-1 text-xs">{queryError}</p>
              <p className="mt-2 text-xs">Firestore 규칙과 인덱스를 확인하세요. (docs/STORAGE_SETUP.md)</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
              해당 학년 시간표가 없습니다. 이미지 업로드 후 제공됩니다.
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  {item.fileType === "pdf" ? (
                    <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-4">
                      <span className="text-sm font-medium text-slate-700 md:min-w-0 md:truncate">
                        {item.fileName ?? "문서"}
                      </span>
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-lg bg-withus-navy px-4 py-2 text-sm font-medium text-white hover:bg-withus-navy/90"
                      >
                        파일 보기
                      </a>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <TimetableImage
                        fileUrl={item.fileUrl}
                        resolvedUrl={resolvedUrls[item.id]}
                        alt={
                          item.fileName ??
                          `${SCHOOLS.find((s) => s.slug === currentSchool)?.label ?? ""} 고${grade} 시간표 ${i + 1}`
                        }
                        priority={i === 0}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
