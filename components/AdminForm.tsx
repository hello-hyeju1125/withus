"use client";

import { useState, useCallback, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { Trash2 } from "lucide-react";

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

function getFileType(mime: string): "image" | "pdf" {
  if (mime === "application/pdf") return "pdf";
  return "image";
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

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

async function fetchTimetables(): Promise<TimetableDoc[]> {
  const res = await fetch(`${apiBase}/api/timetables`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = typeof body?.error === "string" ? body.error : "목록을 불러올 수 없습니다.";
    throw new Error(msg);
  }
  return res.json();
}

export default function AdminForm() {
  const [school, setSchool] = useState<string>(SCHOOL_OPTIONS[0].value);
  const [grade, setGrade] = useState<string>(GRADE_OPTIONS[0].value);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [items, setItems] = useState<TimetableDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchTimetables();
      setItems(list);
      setMessage(null);
    } catch (err) {
      console.error(err);
      const text = err instanceof Error ? err.message : "시간표 목록을 불러올 수 없습니다.";
      setMessage({ type: "err", text });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    setFiles(selected ? Array.from(selected) : []);
    setMessage(null);
  };

  const handleUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (files.length === 0) {
        setMessage({ type: "err", text: "파일을 선택해 주세요." });
        return;
      }
      setUploading(true);
      setMessage(null);
      const total = files.length;
      let successCount = 0;
      try {
        for (let i = 0; i < files.length; i++) {
          setUploadProgress({ current: i + 1, total });
          const file = files[i];
          const path = `images/timetables/${Date.now()}_${sanitizeFileName(file.name)}`;
          const storageRef = ref(storage, path);

          await uploadBytes(storageRef, file, {
            contentType: file.type || "application/octet-stream",
          });
          const fileUrl = await getDownloadURL(storageRef);
          const fileType = getFileType(file.type || "");

          await addDoc(collection(db, "timetables"), {
            school,
            grade,
            fileUrl,
            fileType,
            fileName: file.name,
            createdAt: serverTimestamp(),
          });
          successCount++;
        }

        setMessage({
          type: "ok",
          text:
            successCount === 1
              ? "시간표가 등록되었습니다."
              : `${successCount}개 시간표가 등록되었습니다.`,
        });
        setFiles([]);
        const input = document.getElementById("admin-file") as HTMLInputElement;
        if (input) input.value = "";
        await loadItems();
      } catch (err) {
        console.error(err);
        setMessage({
          type: "err",
          text:
            successCount > 0
              ? `${successCount}개 등록 후 오류: ${err instanceof Error ? err.message : "업로드에 실패했습니다."}`
              : err instanceof Error
                ? err.message
                : "업로드에 실패했습니다.",
        });
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    },
    [files, school, grade, loadItems]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("이 시간표를 삭제하시겠습니까?")) return;
      setDeletingId(id);
      try {
        const res = await fetch(`${apiBase}/api/timetables/${id}`, {
          method: "DELETE",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "삭제에 실패했습니다.");
        await loadItems();
      } catch (err) {
        console.error(err);
        setMessage({
          type: "err",
          text: err instanceof Error ? err.message : "삭제에 실패했습니다.",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [loadItems]
  );

  return (
    <div className="space-y-8 py-4">
      <div className="mx-auto max-w-lg px-4">
        <h1 className="font-serif text-2xl font-bold text-withus-navy">
          시간표 등록 (관리자)
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          학교·학년을 선택한 뒤 이미지를 한 장 이상 업로드하세요.
        </p>

        <form onSubmit={handleUpload} className="mt-6 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              학교 선택
            </label>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">
              학년 선택
            </label>
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

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              파일 업로드 (이미지: png, jpg, 여러 장 선택 가능)
            </label>
            <input
              id="admin-file"
              type="file"
              accept={ACCEPT_FILES}
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-withus-navy file:px-4 file:py-2 file:text-white file:transition-colors disabled:opacity-60"
            />
            {files.length > 0 && (
              <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto rounded border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs text-slate-600">
                {files.map((f, i) => (
                  <li key={i} className="truncate">
                    {f.name} ({(f.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            )}
            {files.length > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                총 {files.length}개 파일 선택됨
              </p>
            )}
          </div>

          {message && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                message.type === "ok"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="w-full rounded-xl bg-withus-navy py-4 text-base font-semibold text-white transition-colors hover:bg-withus-navy/90 disabled:opacity-60"
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
              `시간표 ${files.length}개 등록하기`
            )}
          </button>
        </form>
      </div>

      {/* 등록된 시간표 리스트 */}
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="font-serif text-xl font-bold text-withus-navy">
          등록된 시간표
        </h2>
        {loading ? (
          <div className="mt-4 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-withus-navy border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            등록된 시간표가 없습니다.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-cool-gray-200 rounded-lg border border-cool-gray-200 bg-white">
            {items.map((item) => (
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
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
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
      </div>
    </div>
  );
}
