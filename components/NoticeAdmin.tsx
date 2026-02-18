"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Trash2, ImagePlus } from "lucide-react";
import { uploadNoticeImage, ACCEPT_IMAGE } from "@/lib/storage";

export interface NoticeDoc {
  id: string;
  title: string;
  isImportant: boolean;
  author: string;
  content: string;
  imageUrls: string[];
  createdAt: number | null;
}

const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

async function fetchNotices(): Promise<NoticeDoc[]> {
  const res = await fetch(`${apiBase}/api/notices`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = typeof body?.error === "string" ? body.error : "목록을 불러올 수 없습니다.";
    throw new Error(msg);
  }
  return res.json();
}

export default function NoticeAdmin() {
  const [title, setTitle] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [author, setAuthor] = useState("관리자");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [items, setItems] = useState<NoticeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchNotices();
      setItems(list);
      setMessage(null);
    } catch (err) {
      console.error(err);
      const text = err instanceof Error ? err.message : "공지사항 목록을 불러올 수 없습니다.";
      setMessage({ type: "err", text });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleImageSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setMessage(null);
      setImageUploading(true);
      try {
        const url = await uploadNoticeImage(file);
        setImageUrls((prev) => [...prev, url]);
      } catch (err) {
        console.error(err);
        setMessage({
          type: "err",
          text: err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.",
        });
      } finally {
        setImageUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    []
  );

  const removeImage = useCallback((url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
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
        const res = await fetch(`${apiBase}/api/notices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            isImportant,
            author: author.trim() || "관리자",
            content: content.trim(),
            imageUrls,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "등록에 실패했습니다.");

        setMessage({ type: "ok", text: "공지사항이 등록되었습니다." });
        setTitle("");
        setContent("");
        setIsImportant(false);
        setImageUrls([]);
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
    [title, isImportant, author, content, imageUrls, loadItems]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("이 공지사항을 삭제하시겠습니까?")) return;
      setDeletingId(id);
      try {
        const res = await fetch(`${apiBase}/api/notices/${id}`, {
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
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-withus-navy">
          공지사항 등록 (관리자)
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          제목, 중요 공지 여부, 작성자, 본문, 이미지(선택)를 입력 후 등록하세요.
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
            placeholder="공지사항 제목"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="notice-important"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-withus-navy focus:ring-withus-navy"
          />
          <label
            htmlFor="notice-important"
            className="text-sm font-medium text-slate-700"
          >
            중요 공지 (리스트 최상단 고정·강조)
          </label>
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
            본문 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용을 입력하세요."
            rows={6}
            disabled={submitting}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            이미지 첨부 (선택 시 즉시 업로드)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_IMAGE}
            onChange={handleImageSelect}
            disabled={submitting || imageUploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting || imageUploading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            <ImagePlus className="h-4 w-4" aria-hidden />
            {imageUploading ? "업로드 중..." : "이미지 선택"}
          </button>
          {imageUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                <div
                  key={url}
                  className="relative inline-block overflow-hidden rounded-lg border border-slate-200"
                >
                  <Image
                    src={url}
                    alt="첨부 이미지"
                    width={120}
                    height={90}
                    className="h-20 w-auto object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    disabled={submitting}
                    className="absolute right-1 top-1 rounded bg-slate-800/70 px-1.5 py-0.5 text-xs text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    제거
                  </button>
                </div>
              ))}
            </div>
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
          disabled={submitting || !title.trim()}
          className="w-full rounded-xl bg-withus-navy py-4 text-base font-semibold text-white transition-colors hover:bg-withus-navy/90 disabled:opacity-60"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden
              />
              등록 중...
            </span>
          ) : (
            "등록"
          )}
        </button>
      </form>

      {/* 등록된 공지사항 리스트 */}
      <div>
        <h2 className="font-serif text-xl font-bold text-withus-navy">
          등록된 공지사항
        </h2>
        {loading ? (
          <div className="mt-4 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-withus-navy border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            등록된 공지사항이 없습니다.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-cool-gray-200 rounded-lg border border-cool-gray-200 bg-white">
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  item.isImportant ? "bg-amber-50/80" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">
                    {item.isImportant && (
                      <span className="mr-2 inline-flex rounded bg-amber-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                        중요
                      </span>
                    )}
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.author}
                    {item.createdAt &&
                      ` · ${new Date(item.createdAt).toLocaleDateString("ko-KR")}`}
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
