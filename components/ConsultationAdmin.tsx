"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

type ConsultationStatus = "pending" | "completed";

type ConsultationDoc = {
  id: string;
  studentName: string;
  parentPhone: string;
  schoolGrade: string;
  subject: string;
  content: string;
  status: ConsultationStatus;
  createdAt: number | null;
};

const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

function formatCreatedAt(createdAt: number | null): string {
  if (!createdAt) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(createdAt));
}

export default function ConsultationAdmin() {
  const [items, setItems] = useState<ConsultationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ConsultationDoc | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/consultations`);
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data.error || "상담 문의 목록을 불러오지 못했습니다.");
      setItems(Array.isArray(data) ? (data as ConsultationDoc[]) : []);
      setError(null);
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : "상담 문의 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const totalCount = items.length;
  const pendingCount = useMemo(
    () => items.filter((item) => item.status === "pending").length,
    [items]
  );

  const handleToggleStatus = async (item: ConsultationDoc) => {
    const nextStatus: ConsultationStatus =
      item.status === "pending" ? "completed" : "pending";
    setUpdatingId(item.id);
    try {
      const res = await fetch(`${apiBase}/api/consultations/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "처리 상태를 변경하지 못했습니다.");
      setItems((prev) =>
        prev.map((target) =>
          target.id === item.id ? { ...target, status: nextStatus } : target
        )
      );
      if (selected?.id === item.id) {
        setSelected((prev) => (prev ? { ...prev, status: nextStatus } : prev));
      }
    } catch (toggleError) {
      console.error(toggleError);
      alert(toggleError instanceof Error ? toggleError.message : "처리 상태를 변경하지 못했습니다.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 상담 문의를 삭제하시겠습니까?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${apiBase}/api/consultations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "삭제하지 못했습니다.");
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (deleteError) {
      console.error(deleteError);
      alert(deleteError instanceof Error ? deleteError.message : "삭제하지 못했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 px-2 py-4 sm:px-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h1 className="font-serif text-2xl font-bold text-[#0a1e40]">상담 문의 내역</h1>
        <p className="mt-1 text-sm text-slate-500">
          접수된 상담 문의를 확인하고 처리 상태를 관리할 수 있습니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-[#0a1e40]/10 px-3 py-1 font-medium text-[#0a1e40]">
            전체 {totalCount}건
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800">
            대기 {pendingCount}건
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
            완료 {totalCount - pendingCount}건
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0a1e40] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">
            접수된 상담 문의가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full text-sm">
              <thead className="bg-[#0a1e40] text-white">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">접수일</th>
                  <th className="px-3 py-3 text-left font-semibold">학생 성함</th>
                  <th className="px-3 py-3 text-left font-semibold">학부모 연락처</th>
                  <th className="px-3 py-3 text-left font-semibold">학교/학년</th>
                  <th className="px-3 py-3 text-left font-semibold">희망 과목</th>
                  <th className="px-3 py-3 text-left font-semibold">처리 상태</th>
                  <th className="px-3 py-3 text-left font-semibold">상세</th>
                  <th className="px-3 py-3 text-left font-semibold">삭제</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                      {formatCreatedAt(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-900">
                      {item.studentName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                      {item.parentPhone}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                      {item.schoolGrade}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                      {item.subject}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        disabled={updatingId === item.id}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                          item.status === "completed"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        } disabled:opacity-50`}
                      >
                        {item.status === "completed" ? "완료" : "대기"}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#0a1e40] hover:bg-[#0a1e40]/10"
                      >
                        보기
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consultation-detail-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelected(null)}
            aria-label="상세 모달 닫기"
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 id="consultation-detail-title" className="text-lg font-bold text-[#0a1e40]">
                상담 문의 상세
              </h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
                aria-label="닫기"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 px-5 py-5 text-sm">
              <p>
                <span className="font-semibold text-slate-800">접수일:</span>{" "}
                <span className="text-slate-700">{formatCreatedAt(selected.createdAt)}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">학생 성함:</span>{" "}
                <span className="text-slate-700">{selected.studentName}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">학부모 연락처:</span>{" "}
                <span className="text-slate-700">{selected.parentPhone}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">학교/학년:</span>{" "}
                <span className="text-slate-700">{selected.schoolGrade}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">상담 희망 과목:</span>{" "}
                <span className="text-slate-700">{selected.subject}</span>
              </p>
              <div>
                <p className="font-semibold text-slate-800">문의 내용</p>
                <p className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                  {selected.content || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
