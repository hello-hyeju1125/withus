"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Trash2 } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "외고", label: "외고" },
  { value: "일반고", label: "일반고" },
] as const;

export interface BriefingDoc {
  id: string;
  title: string;
  author: string;
  content: string;
  imageUrl: string;
  category: "외고" | "일반고";
  createdAt: number | null;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

async function fetchBriefings(): Promise<BriefingDoc[]> {
  const res = await fetch(`${apiBase}/api/briefings`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = typeof body?.error === "string" ? body.error : "목록을 불러올 수 없습니다.";
    throw new Error(msg);
  }
  return res.json();
}

export default function BriefingAdmin() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("관리자");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [category, setCategory] = useState<"외고" | "일반고">("외고");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [items, setItems] = useState<BriefingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchBriefings();
      setItems(list);
      setMessage(null);
    } catch (err) {
      console.error(err);
      const text = err instanceof Error ? err.message : "설명회 목록을 불러올 수 없습니다.";
      setMessage({ type: "err", text });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setMessage(null);
      setImagePreviewUrl((prevUrl) => {
        if (prevUrl && prevUrl.startsWith("blob:")) {
          URL.revokeObjectURL(prevUrl);
        }
        return file ? URL.createObjectURL(file) : "";
      });
      setImageFile(file ?? null);
    },
    []
  );

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return "";
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) {
        setMessage({ type: "err", text: "제목을 입력해 주세요." });
        return;
      }
      setSubmitting(true);
      setMessage(null);
      try {
        let imageUrl = "";

        if (imageFile) {
          const path = `images/briefings/${Date.now()}_${sanitizeFileName(imageFile.name)}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, imageFile, {
            contentType: imageFile.type || "image/jpeg",
          });
          imageUrl = await getDownloadURL(storageRef);
        }

        const res = await fetch(`${apiBase}/api/briefings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            author: author.trim() || "관리자",
            content: content.trim(),
            imageUrl,
            category,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "등록에 실패했습니다.");

        setMessage({ type: "ok", text: "설명회가 등록되었습니다." });
        setTitle("");
        setContent("");
        handleRemoveImage();
        await loadItems();
      } catch (err) {
        console.error(err);
        setMessage({
          type: "err",
          text: err instanceof Error ? err.message : "등록에 실패했습니다.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [title, author, content, imageFile, category, handleRemoveImage, loadItems]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("이 설명회를 삭제하시겠습니까?")) return;
      setDeletingId(id);
      try {
        const res = await fetch(`${apiBase}/api/briefings/${id}`, { method: "DELETE" });
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
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-withus-navy">
          설명회 등록 (관리자)
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          제목, 작성자, 이미지(선택), 상세 내용을 입력 후 등록하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="설명회 제목"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            작성자
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="관리자"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            구분 (외고 / 일반고)
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "외고" | "일반고")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            이미지 업로드 (설명회 포스터/캡처, 선택)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleImageChange}
            disabled={submitting}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-withus-navy file:px-4 file:py-2 file:text-white file:transition-colors disabled:opacity-60"
          />
          {imagePreviewUrl && (
            <div className="relative mt-2">
              <Image
                src={imagePreviewUrl}
                alt="업로드 미리보기"
                width={400}
                height={300}
                className="max-h-48 w-auto rounded-lg border border-slate-200 object-contain"
                unoptimized
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={submitting}
                className="absolute right-2 top-2 rounded bg-slate-800/70 px-2 py-1 text-xs text-white hover:bg-slate-800 disabled:opacity-60"
              >
                제거
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            상세 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이미지 외에 추가 설명이 필요한 경우 입력"
            rows={5}
            disabled={submitting}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy disabled:opacity-60"
          />
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
          disabled={submitting || !title.trim()}
          className="w-full rounded-xl bg-withus-navy py-4 text-base font-semibold text-white transition-colors hover:bg-withus-navy/90 disabled:opacity-60"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden
              />
              {imageFile ? "업로드 중..." : "등록 중..."}
            </span>
          ) : (
            "등록"
          )}
        </button>
      </form>

      {/* 등록된 설명회 리스트 */}
      <div>
        <h2 className="font-serif text-xl font-bold text-withus-navy">
          등록된 설명회
        </h2>
        {loading ? (
          <div className="mt-4 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-withus-navy border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            등록된 설명회가 없습니다.
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
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.author} · {item.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="flex shrink-0 items-center gap-1 rounded px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
