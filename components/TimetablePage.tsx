"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import TimetableNav, { SCHOOLS, type SchoolSlug } from "@/components/TimetableNav";
import ScheduleDetailList from "@/components/ScheduleDetailList";
import {
  collection,
  query,
  where,
  onSnapshot,
  type DocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ScheduleCourseItem } from "@/data/scheduleCourses";

export interface TimetableItem {
  id: string;
  fileUrl: string;
  fileType: "image" | "pdf";
  fileName?: string;
  createdAt: Timestamp | null;
}

type ScheduleDetailApiItem = {
  id: string;
  school: string;
  grade: string;
  category?: string;
  displayOrder?: number | null;
  instructorName: string;
  subject: string;
  courseTitle?: string;
  teachingStyle: string;
  schedule: string;
  startDate?: string;
  videoUrl?: string;
};

const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

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

const CONTENT_TABS = [
  { id: "summary" as const, label: "요약시간표" },
  { id: "1" as const, label: "고1" },
  { id: "2" as const, label: "고2" },
  { id: "3" as const, label: "고3" },
];

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

  const isForeignHighSchool = currentSchool === "daewon" || currentSchool === "hanyoung";
  const useTabLayout = currentSchool === "daewon" || currentSchool === "hanyoung" || currentSchool === "general";

  // 탭 레이아웃: 요약시간표(이미지) | 고1 | 고2 | 고3(세부시간표) 탭 사용
  const [activeTab, setActiveTab] = useState<"summary" | "1" | "2" | "3">("summary");
  const summaryGrade = "1";
  // 일반/private용 기존 학년 상태 (showGradeRow 사용 시)
  const [grade, setGrade] = useState<string>(initialGrade);

  useEffect(() => {
    setGrade(initialGrade);
  }, [initialGrade]);

  // 요약 탭일 때는 summaryGrade, 그 외에는 선택한 탭(고1/고2/고3)으로 이미지용 학년 결정
  const imageGrade = activeTab === "summary" ? summaryGrade : activeTab;

  const [items, setItems] = useState<TimetableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const q = query(
      collection(db, "timetables"),
      where("school", "==", currentSchool),
      where("grade", "==", useTabLayout ? imageGrade : grade)
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
  }, [currentSchool, useTabLayout, imageGrade, grade]);

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

  const showImageArea =
    !useTabLayout ||
    (useTabLayout && activeTab === "summary") ||
    (useTabLayout && !isForeignHighSchool);

  const showDetailList = useTabLayout && isForeignHighSchool && activeTab !== "summary";
  const [detailCourses, setDetailCourses] = useState<ScheduleCourseItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    if (!showDetailList) return;

    const fetchDetailCourses = async () => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const res = await fetch(
          `${apiBase}/api/schedule-details?school=${encodeURIComponent(currentSchool)}&grade=${encodeURIComponent(activeTab)}`
        );
        const data = (await res.json().catch(() => [])) as ScheduleDetailApiItem[] | { error?: string };
        if (!res.ok) {
          const msg = "error" in (data as object) ? (data as { error?: string }).error : undefined;
          throw new Error(msg || "세부 시간표를 불러오지 못했습니다.");
        }

        const list = (data as ScheduleDetailApiItem[])
          .map((item) => {
            const g = Number.parseInt(item.grade, 10);
            if (!item.id || !item.subject || !item.instructorName || !item.schedule || !item.teachingStyle) {
              return null;
            }
            if (g !== 1 && g !== 2 && g !== 3) return null;
            const mapped: ScheduleCourseItem = {
              id: item.id,
              school: item.school,
              grade: g,
              category: item.category as ScheduleCourseItem["category"],
              displayOrder:
                typeof item.displayOrder === "number" ? item.displayOrder : undefined,
              instructorName: item.instructorName,
              subject: item.subject,
              courseTitle: item.courseTitle,
              teachingStyle: item.teachingStyle,
              schedule: item.schedule,
              startDate: item.startDate,
              videoUrl: item.videoUrl,
            };
            return mapped;
          })
          .filter((x): x is ScheduleCourseItem => x !== null)
          .sort((a, b) => {
            const ao = typeof a.displayOrder === "number" ? a.displayOrder : Number.MAX_SAFE_INTEGER;
            const bo = typeof b.displayOrder === "number" ? b.displayOrder : Number.MAX_SAFE_INTEGER;
            return ao - bo;
          });

        setDetailCourses(list);
      } catch (err) {
        console.error(err);
        setDetailError(
          err instanceof Error ? err.message : "세부 시간표를 불러오지 못했습니다."
        );
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetailCourses();
  }, [showDetailList, currentSchool, activeTab]);

  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        {/* 1) 학교 선택: 대원 / 한영 / 일반 (탭 레이아웃일 때는 학년 행 없음) */}
        <div>
          <TimetableNav
            initialSchool={currentSchool}
            initialGrade={grade}
            showGradeRow={!useTabLayout}
            onChange={(activeSchool, activeGrade) => {
              if (activeSchool !== currentSchool) {
                router.push(`/schedule/${activeSchool}`);
              }
              setGrade(activeGrade);
            }}
          />
        </div>

        {/* 2) 요약시간표 | 고1 | 고2 | 고3 탭 (대원/한영/일반일 때만) */}
        {useTabLayout && (
          <div className="mt-7 flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
              {CONTENT_TABS.map(({ id, label }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-all duration-200 md:min-w-[96px] ${
                      isActive
                        ? "bg-gradient-to-r from-[#002761] to-[#003bb3] text-white shadow-[0_8px_20px_rgba(0,39,97,0.35)]"
                        : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-[#002761] hover:shadow-md"
                    }`}
                    aria-pressed={isActive}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3) 요약시간표 탭: 이미지 시간표 (업로드된 이미지) */}
        {showImageArea && (
          <div className="mt-6">
            {loading ? (
              <LoadingSpinner />
            ) : queryError ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 py-8 text-center text-sm text-amber-800">
                <p className="font-medium">시간표를 불러오지 못했습니다.</p>
                <p className="mt-1 text-xs">{queryError}</p>
                <p className="mt-2 text-xs">Firestore 규칙과 인덱스를 확인하세요. (docs/STORAGE_SETUP.md)</p>
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
                해당 학년 시간표가 없습니다. 이미지 업로드 후 제공됩니다.
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
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
                            `${SCHOOLS.find((s) => s.slug === currentSchool)?.label ?? ""} 고${imageGrade} 시간표 ${i + 1}`
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
        )}

        {/* 4) 고1/고2/고3 탭: 세부 시간표 리스트 (대원/한영만) */}
        {showDetailList && (
          <div className="mt-6">
            {detailLoading ? (
              <div className="rounded-xl border border-slate-200 bg-white py-10">
                <LoadingSpinner />
              </div>
            ) : detailError ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 py-8 text-center text-sm text-amber-800">
                <p className="font-medium">세부 시간표를 불러오지 못했습니다.</p>
                <p className="mt-1 text-xs">{detailError}</p>
              </div>
            ) : (
              <ScheduleDetailList
                courses={detailCourses}
                fixedGrade={activeTab}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
