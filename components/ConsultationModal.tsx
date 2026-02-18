"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FormState = {
  studentName: string;
  parentPhone: string;
  schoolGrade: string;
  subject: string;
  content: string;
};

const INITIAL_FORM: FormState = {
  studentName: "",
  parentPhone: "",
  schoolGrade: "",
  subject: "",
  content: "",
};

const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function ConsultationModal({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [readyForInput, setReadyForInput] = useState(false);
  const [result, setResult] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const isValid = useMemo(() => {
    return Boolean(
      form.studentName.trim() &&
        form.parentPhone.trim() &&
        form.schoolGrade.trim() &&
        form.subject.trim() &&
        form.content.trim()
    );
  }, [form]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setReadyForInput(false);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      setReadyForInput(true);
      const firstInput = document.getElementById(
        "consultation-student-name"
      ) as HTMLInputElement | null;
      firstInput?.focus();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      setSubmitting(false);
      setReadyForInput(false);
      setResult(null);
      setForm(INITIAL_FORM);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setResult(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`${apiBase}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: form.studentName.trim(),
          parentPhone: form.parentPhone.trim(),
          schoolGrade: form.schoolGrade.trim(),
          subject: form.subject.trim(),
          content: form.content.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "전송에 실패했습니다.");
      }
      setResult({ type: "ok", text: "상담 문의가 접수되었습니다. 확인 후 연락드릴게요." });
      window.setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error(error);
      setResult({ type: "err", text: "전송에 실패했습니다. 잠시 후 다시 시도해주세요." });
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
    >
      <div
        onClick={() => {
          if (!submitting) onClose();
        }}
        className="absolute inset-0 bg-black/55"
        aria-hidden
      />
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="consultation-modal-title" className="text-lg font-bold text-[#0a1e40]">
            상담 문의
          </h2>
          <button
            type="button"
            onClick={() => {
              if (!submitting) onClose();
            }}
            disabled={submitting}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="닫기"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-5 py-5">
          <label className="block text-sm font-medium text-slate-700">
            학생 성함
            <input
              id="consultation-student-name"
              value={form.studentName}
              onChange={onChange("studentName")}
              placeholder="예: 홍길동"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0a1e40] focus:outline-none focus:ring-1 focus:ring-[#0a1e40]"
              disabled={submitting || !readyForInput}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            학부모 연락처
            <input
              value={form.parentPhone}
              onChange={onChange("parentPhone")}
              placeholder="예: 010-1234-5678"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0a1e40] focus:outline-none focus:ring-1 focus:ring-[#0a1e40]"
              disabled={submitting || !readyForInput}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            학교/학년
            <input
              value={form.schoolGrade}
              onChange={onChange("schoolGrade")}
              placeholder="예: 대원외고 1학년"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0a1e40] focus:outline-none focus:ring-1 focus:ring-[#0a1e40]"
              disabled={submitting || !readyForInput}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            상담 희망 과목
            <input
              value={form.subject}
              onChange={onChange("subject")}
              placeholder="예: 영어 / 수학"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0a1e40] focus:outline-none focus:ring-1 focus:ring-[#0a1e40]"
              disabled={submitting || !readyForInput}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            문의 내용
            <textarea
              value={form.content}
              onChange={onChange("content")}
              placeholder="문의하실 내용을 자세히 작성해주세요."
              rows={5}
              className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0a1e40] focus:outline-none focus:ring-1 focus:ring-[#0a1e40]"
              disabled={submitting || !readyForInput}
            />
          </label>

          {result && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                result.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {result.text}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full rounded-xl bg-[#0a1e40] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0a1e40]/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "전송 중..." : "상담 문의 전송"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
