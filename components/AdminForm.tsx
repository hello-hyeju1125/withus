"use client";

import { useState, useCallback, useEffect } from "react";
import { Trash2 } from "lucide-react";
import {
  DETAIL_CATEGORY_FILTERS,
  SECOND_LANGUAGE_CATEGORIES,
  type DetailCategory,
} from "@/data/scheduleCourses";

const SCHOOL_OPTIONS = [
  { value: "daewon", label: "대원외고" },
  { value: "hanyoung", label: "한영외고" },
  { value: "general", label: "일반고" },
  { value: "private", label: "개인팀" },
] as const;

const GRADE_OPTIONS = [
  { value: "1", label: "고1" },
  { value: "2", label: "고2" },
  { value: "3", label: "고3" },
] as const;

const ACCEPT_FILES = "image/png,image/jpeg,image/jpg";
const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

function getFileType(mime: string): "image" | "pdf" {
  if (mime === "application/pdf") return "pdf";
  return "image";
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

function normalizeDetailCategory(category: string, subject: string): DetailCategory {
  const trimmedCategory = category.trim();
  const trimmedSubject = subject.trim();
  const categoryOptions = DETAIL_CATEGORY_FILTERS.filter((x) => x !== "전체") as DetailCategory[];

  if (trimmedCategory === "제2외국어") {
    if ((SECOND_LANGUAGE_CATEGORIES as readonly string[]).includes(trimmedSubject)) {
      return trimmedSubject as DetailCategory;
    }
    return "프랑스어";
  }
  if (categoryOptions.includes(trimmedCategory as DetailCategory)) {
    return trimmedCategory as DetailCategory;
  }
  return "수학";
}

type FlashMessage = {
  type: "ok" | "err";
  text: string;
};

export interface TimetableDoc {
  id: string;
  school: string;
  grade: string;
  schoolLabel: string;
  fileUrl: string;
  fileType: "image" | "pdf";
  fileName: string;
  createdAt: number | null;
}

export interface ScheduleDetailDoc {
  id: string;
  school: string;
  grade: string;
  schoolLabel: string;
  category: string;
  displayOrder?: number | null;
  instructorName: string;
  subject: string;
  courseTitle: string;
  teachingStyle: string;
  schedule: string;
  startDate: string;
  videoUrl?: string;
  createdAt: number | null;
}

async function fetchTimetables(): Promise<TimetableDoc[]> {
  const res = await fetch(`${apiBase}/api/timetables`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = typeof body?.error === "string" ? body.error : "목록을 불러올 수 없습니다.";
    throw new Error(msg);
  }
  return res.json();
}

async function fetchScheduleDetails(): Promise<ScheduleDetailDoc[]> {
  const res = await fetch(`${apiBase}/api/schedule-details`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = typeof body?.error === "string" ? body.error : "세부시간표 목록을 불러올 수 없습니다.";
    throw new Error(msg);
  }
  return res.json();
}

export default function AdminForm() {
  // ===== 요약시간표(이미지) 업로드 =====
  const [school, setSchool] = useState<string>(SCHOOL_OPTIONS[0].value);
  const [grade, setGrade] = useState<string>(GRADE_OPTIONS[0].value);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [summaryMessage, setSummaryMessage] = useState<FlashMessage | null>(null);
  const [timetableItems, setTimetableItems] = useState<TimetableDoc[]>([]);
  const [loadingTimetables, setLoadingTimetables] = useState(true);
  const [deletingTimetableId, setDeletingTimetableId] = useState<string | null>(null);

  // ===== 세부시간표 등록 =====
  const [detailSchool, setDetailSchool] = useState<string>(SCHOOL_OPTIONS[0].value);
  const [detailGrade, setDetailGrade] = useState<string>(GRADE_OPTIONS[0].value);
  const [detailCategory, setDetailCategory] = useState<DetailCategory>("수학");
  const [detailDisplayOrder, setDetailDisplayOrder] = useState<string>("1");
  const [instructorName, setInstructorName] = useState("");
  const [subject, setSubject] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("");
  const [schedule, setSchedule] = useState("");
  const [startDate, setStartDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [savingDetail, setSavingDetail] = useState(false);
  const [detailMessage, setDetailMessage] = useState<FlashMessage | null>(null);
  const [detailItems, setDetailItems] = useState<ScheduleDetailDoc[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [deletingDetailId, setDeletingDetailId] = useState<string | null>(null);
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null);

  const loadTimetableItems = useCallback(async () => {
    setLoadingTimetables(true);
    try {
      const list = await fetchTimetables();
      setTimetableItems(list);
    } catch (err) {
      console.error(err);
      setSummaryMessage({
        type: "err",
        text: err instanceof Error ? err.message : "시간표 목록을 불러올 수 없습니다.",
      });
    } finally {
      setLoadingTimetables(false);
    }
  }, []);

  const loadDetailItems = useCallback(async () => {
    setLoadingDetails(true);
    try {
      const list = await fetchScheduleDetails();
      setDetailItems(list);
    } catch (err) {
      console.error(err);
      setDetailMessage({
        type: "err",
        text: err instanceof Error ? err.message : "세부시간표 목록을 불러올 수 없습니다.",
      });
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    loadTimetableItems();
    loadDetailItems();
  }, [loadTimetableItems, loadDetailItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    setFiles(selected ? Array.from(selected) : []);
    setSummaryMessage(null);
  };

  const handleSummaryUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (files.length === 0) {
        setSummaryMessage({ type: "err", text: "파일을 선택해 주세요." });
        return;
      }

      setUploading(true);
      setSummaryMessage(null);
      const total = files.length;
      setUploadProgress({ current: 0, total });

      try {
        const formData = new FormData();
        formData.set("school", school);
        formData.set("grade", grade);
        files.forEach((f) => formData.append("files", f));

        const res = await fetch(`${apiBase}/api/timetables/upload`, {
          method: "POST",
          body: formData,
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          count?: number;
          message?: string;
          error?: string;
        };

        if (res.ok && data.ok) {
          setSummaryMessage({
            type: "ok",
            text: data.message ?? `${data.count ?? files.length}개가 등록되었습니다.`,
          });
          setFiles([]);
          const input = document.getElementById("admin-summary-file") as HTMLInputElement | null;
          if (input) input.value = "";
          await loadTimetableItems();
        } else {
          setSummaryMessage({
            type: "err",
            text: data.error ?? "업로드에 실패했습니다.",
          });
        }
      } catch (err) {
        console.error(err);
        setSummaryMessage({
          type: "err",
          text: err instanceof Error ? err.message : "업로드에 실패했습니다.",
        });
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    },
    [files, school, grade, loadTimetableItems]
  );

  const handleTimetableDelete = useCallback(
    async (id: string) => {
      if (!confirm("이 요약시간표를 삭제하시겠습니까?")) return;
      setDeletingTimetableId(id);
      try {
        const res = await fetch(`${apiBase}/api/timetables/${id}`, {
          method: "DELETE",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "삭제에 실패했습니다.");
        await loadTimetableItems();
      } catch (err) {
        console.error(err);
        setSummaryMessage({
          type: "err",
          text: err instanceof Error ? err.message : "삭제에 실패했습니다.",
        });
      } finally {
        setDeletingTimetableId(null);
      }
    },
    [loadTimetableItems]
  );

  const resetDetailForm = useCallback(() => {
    setDetailSchool(SCHOOL_OPTIONS[0].value);
    setDetailGrade(GRADE_OPTIONS[0].value);
    setDetailCategory("수학");
    setDetailDisplayOrder("1");
    setInstructorName("");
    setSubject("");
    setCourseTitle("");
    setTeachingStyle("");
    setSchedule("");
    setStartDate("");
    setVideoUrl("");
    setEditingDetailId(null);
  }, []);

  const handleStartDetailEdit = useCallback((item: ScheduleDetailDoc) => {
    setDetailSchool(item.school);
    setDetailGrade(item.grade);
    setDetailCategory(normalizeDetailCategory(item.category || "", item.subject || ""));
    setDetailDisplayOrder(String(item.displayOrder ?? 1));
    setInstructorName(item.instructorName);
    setSubject(item.subject);
    setCourseTitle(item.courseTitle);
    setTeachingStyle(item.teachingStyle);
    setSchedule(item.schedule);
    setStartDate(item.startDate);
    setVideoUrl(item.videoUrl ?? "");
    setDetailMessage(null);
    setEditingDetailId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDetailCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !detailDisplayOrder.trim() ||
        Number.isNaN(Number.parseInt(detailDisplayOrder, 10)) ||
        Number.parseInt(detailDisplayOrder, 10) < 1 ||
        !instructorName.trim() ||
        !subject.trim() ||
        !courseTitle.trim() ||
        !teachingStyle.trim() ||
        !schedule.trim() ||
        !startDate.trim()
      ) {
        setDetailMessage({
          type: "err",
          text: "카드 순서, 선생님 이름, 과목명, 카드 제목, 강의 스타일, 요일/시간, 개강은 필수 입력입니다.",
        });
        return;
      }

      setSavingDetail(true);
      setDetailMessage(null);
      try {
        const isEdit = editingDetailId !== null;
        const endpoint = isEdit
          ? `${apiBase}/api/schedule-details/${editingDetailId}`
          : `${apiBase}/api/schedule-details`;
        const method = isEdit ? "PATCH" : "POST";

        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            school: detailSchool,
            grade: detailGrade,
            category: detailCategory,
            displayOrder: Number.parseInt(detailDisplayOrder, 10),
            instructorName: instructorName.trim(),
            subject: subject.trim(),
            courseTitle: courseTitle.trim(),
            teachingStyle: teachingStyle.trim(),
            schedule: schedule.trim(),
            startDate: startDate.trim(),
            videoUrl: videoUrl.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            data.error || (isEdit ? "세부시간표 수정에 실패했습니다." : "세부시간표 등록에 실패했습니다.")
          );
        }

        setDetailMessage({
          type: "ok",
          text: isEdit ? "세부시간표가 수정되었습니다." : "세부시간표가 등록되었습니다.",
        });
        resetDetailForm();
        await loadDetailItems();
      } catch (err) {
        console.error(err);
        setDetailMessage({
          type: "err",
          text:
            err instanceof Error
              ? err.message
              : editingDetailId
                ? "세부시간표 수정에 실패했습니다."
                : "세부시간표 등록에 실패했습니다.",
        });
      } finally {
        setSavingDetail(false);
      }
    },
    [
      detailSchool,
      detailGrade,
      detailCategory,
      detailDisplayOrder,
      instructorName,
      subject,
      courseTitle,
      teachingStyle,
      schedule,
      startDate,
      videoUrl,
      editingDetailId,
      resetDetailForm,
      loadDetailItems,
    ]
  );

  const handleDetailDelete = useCallback(
    async (id: string) => {
      if (!confirm("이 세부시간표를 삭제하시겠습니까?")) return;
      setDeletingDetailId(id);
      try {
        const res = await fetch(`${apiBase}/api/schedule-details/${id}`, {
          method: "DELETE",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "삭제에 실패했습니다.");
        if (editingDetailId === id) {
          resetDetailForm();
        }
        await loadDetailItems();
      } catch (err) {
        console.error(err);
        setDetailMessage({
          type: "err",
          text: err instanceof Error ? err.message : "삭제에 실패했습니다.",
        });
      } finally {
        setDeletingDetailId(null);
      }
    },
    [editingDetailId, loadDetailItems, resetDetailForm]
  );

  return (
    <div className="space-y-10 py-4">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-2xl font-bold text-withus-navy">
          시간표 등록 (관리자)
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          요약시간표(이미지)와 세부시간표(텍스트)를 각각 등록/삭제할 수 있습니다.
        </p>
      </div>

      {/* 요약시간표 등록 */}
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-withus-navy">요약시간표 등록</h2>
        <p className="mt-1 text-sm text-slate-500">
          이미지 시간표를 학교/학년별로 여러 장 업로드할 수 있습니다.
        </p>

        <form onSubmit={handleSummaryUpload} className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">학교 선택</label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              >
                {SCHOOL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">학년 선택</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              >
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              파일 업로드 (png/jpg, 복수 선택 가능)
            </label>
            <input
              id="admin-summary-file"
              type="file"
              accept={ACCEPT_FILES}
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-withus-navy file:px-4 file:py-2 file:text-white file:transition-colors disabled:opacity-60"
            />
            {files.length > 0 && (
              <>
                <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto rounded border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs text-slate-600">
                  {files.map((f, i) => (
                    <li key={i} className="truncate">
                      {f.name} ({(f.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-xs text-slate-500">총 {files.length}개 파일 선택됨</p>
              </>
            )}
          </div>

          {summaryMessage && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                summaryMessage.type === "ok"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {summaryMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="w-full rounded-xl bg-withus-navy py-3.5 text-base font-semibold text-white transition-colors hover:bg-withus-navy/90 disabled:opacity-60"
          >
            {uploading ? (
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden
                />
                {uploadProgress
                  ? `업로드 중 (${uploadProgress.current}/${uploadProgress.total})...`
                  : "업로드 중..."}
              </span>
            ) : files.length === 0 ? (
              "파일을 선택하세요"
            ) : (
              `요약시간표 ${files.length}개 등록하기`
            )}
          </button>
        </form>
      </section>

      {/* 세부시간표 등록 */}
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-withus-navy">세부시간표 등록</h2>
        <p className="mt-1 text-sm text-slate-500">
          카드 순서(1,2,3...), 선생님 이름, 과목명(라벨), 카드 제목(큰 볼드), 강의 스타일, 요일/시간, 개강을 입력해 고1/고2/고3 탭에 노출합니다.
        </p>
        {editingDetailId && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <span className="font-medium">수정 모드입니다. 수정 후 저장하거나 취소할 수 있습니다.</span>
            <button
              type="button"
              onClick={resetDetailForm}
              className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
            >
              수정 취소
            </button>
          </div>
        )}

        <form onSubmit={handleDetailCreate} className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">학교 선택</label>
              <select
                value={detailSchool}
                onChange={(e) => setDetailSchool(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              >
                {SCHOOL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">학년 선택</label>
              <select
                value={detailGrade}
                onChange={(e) => setDetailGrade(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              >
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">카테고리 필터</label>
              <select
                value={detailCategory}
                onChange={(e) => setDetailCategory(e.target.value as DetailCategory)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              >
                {DETAIL_CATEGORY_FILTERS.filter((x) => x !== "전체").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">카드 순서</label>
              <input
                type="number"
                min={1}
                step={1}
                value={detailDisplayOrder}
                onChange={(e) => setDetailDisplayOrder(e.target.value)}
                placeholder="예: 1"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">선생님 이름</label>
              <input
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                placeholder="예: 김승리"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">과목명 (라벨/버튼용)</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="예: 국어"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">카드 제목 (큰 볼드 텍스트)</label>
            <input
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="예: 국어 정규반 시즌2 개념 완성"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">강의 스타일</label>
            <textarea
              value={teachingStyle}
              onChange={(e) => setTeachingStyle(e.target.value)}
              placeholder="예: 직관적이고 체계적인 내신/수능 통합 풀이"
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">요일/시간</label>
              <textarea
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder={"예:\n토 AM 8:40~12:10\n일 PM 6:00~9:00"}
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm leading-relaxed focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">개강</label>
              <textarea
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder={"예:\n3/4(수)\n3/7(토)"}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm leading-relaxed focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              설명회 영상 URL (선택)
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="예: https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
            />
          </div>

          {detailMessage && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                detailMessage.type === "ok"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {detailMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={savingDetail}
            className="w-full rounded-xl bg-[#002761] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#002761]/90 disabled:opacity-60"
          >
            {savingDetail
              ? editingDetailId
                ? "수정 중..."
                : "등록 중..."
              : editingDetailId
                ? "세부시간표 수정 저장"
                : "세부시간표 등록하기"}
          </button>
        </form>
      </section>

      {/* 등록된 요약시간표 */}
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-withus-navy">등록된 요약시간표</h2>
        {loadingTimetables ? (
          <div className="mt-4 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-withus-navy border-t-transparent" />
          </div>
        ) : timetableItems.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">등록된 요약시간표가 없습니다.</p>
        ) : (
          <ul className="mt-4 divide-y divide-cool-gray-200 rounded-lg border border-cool-gray-200 bg-white">
            {timetableItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">
                    {item.schoolLabel} 고{item.grade} · {item.fileName || "이미지"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.fileType === "pdf" ? "PDF" : "이미지"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded px-3 py-2 text-sm font-medium text-withus-navy hover:bg-slate-100"
                    >
                      보기
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleTimetableDelete(item.id)}
                    disabled={deletingTimetableId === item.id}
                    className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 등록된 세부시간표 */}
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-withus-navy">등록된 세부시간표</h2>
        {loadingDetails ? (
          <div className="mt-4 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-withus-navy border-t-transparent" />
          </div>
        ) : detailItems.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">등록된 세부시간표가 없습니다.</p>
        ) : (
          <ul className="mt-4 divide-y divide-cool-gray-200 rounded-lg border border-cool-gray-200 bg-white">
            {detailItems.map((item) => (
              <li key={item.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800">
                      {item.schoolLabel} 고{item.grade} · #{item.displayOrder ?? "-"} · {item.courseTitle}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.instructorName} · 라벨: {item.subject} · 카테고리: {normalizeDetailCategory(
                        item.category || "",
                        item.subject || ""
                      )}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-xs text-slate-500">
                      요일/시간: {item.schedule}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">개강: {item.startDate}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.teachingStyle}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartDetailEdit(item)}
                      className="rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDetailDelete(item.id)}
                      disabled={deletingDetailId === item.id}
                      className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
