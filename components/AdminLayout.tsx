"use client";

import { useState } from "react";
import { LayoutDashboard, Megaphone, Bell, MessagesSquare } from "lucide-react";
import dynamic from "next/dynamic";

const AdminForm = dynamic(() => import("@/components/AdminForm"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center">
      <p className="text-sm text-slate-500">로딩 중...</p>
    </div>
  ),
});

const BriefingAdmin = dynamic(() => import("@/components/BriefingAdmin"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center">
      <p className="text-sm text-slate-500">로딩 중...</p>
    </div>
  ),
});

const NoticeAdmin = dynamic(() => import("@/components/NoticeAdmin"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center">
      <p className="text-sm text-slate-500">로딩 중...</p>
    </div>
  ),
});

const ConsultationAdmin = dynamic(() => import("@/components/ConsultationAdmin"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center">
      <p className="text-sm text-slate-500">로딩 중...</p>
    </div>
  ),
});

const ADMIN_PASSWORD = "5757";

type AdminTab = "schedule" | "briefing" | "notice" | "consultation";

export default function AdminLayout() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("schedule");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setPasswordError(false);
      setPassword("");
    } else {
      setPasswordError(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cool-gray-100 p-4">
        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <h1 className="text-center font-serif text-xl font-bold text-withus-navy">
            관리자 로그인
          </h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            비밀번호를 입력하세요.
          </p>
          <form onSubmit={handlePasswordSubmit} className="mt-6">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              placeholder="비밀번호"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-withus-navy focus:outline-none focus:ring-1 focus:ring-withus-navy"
              autoFocus
            />
            {passwordError && (
              <p className="mt-2 text-sm text-red-600">
                비밀번호가 올바르지 않습니다.
              </p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-withus-navy py-3 text-sm font-medium text-white hover:bg-withus-navy/90"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cool-gray-100">
      {/* 사이드바 */}
      <aside className="flex w-52 shrink-0 flex-col border-r border-cool-gray-200 bg-white">
        <div className="border-b border-cool-gray-200 px-4 py-6">
          <h2 className="font-serif text-lg font-bold text-withus-navy">
            관리자
          </h2>
        </div>
        <nav className="flex flex-col gap-1 p-3" aria-label="관리 메뉴">
          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "schedule"
                ? "bg-withus-navy text-white"
                : "text-slate-600 hover:bg-cool-gray-100"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" aria-hidden />
            시간표 관리
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("briefing")}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "briefing"
                ? "bg-withus-navy text-white"
                : "text-slate-600 hover:bg-cool-gray-100"
            }`}
          >
            <Megaphone className="h-5 w-5 shrink-0" aria-hidden />
            설명회 관리
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notice")}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "notice"
                ? "bg-withus-navy text-white"
                : "text-slate-600 hover:bg-cool-gray-100"
            }`}
          >
            <Bell className="h-5 w-5 shrink-0" aria-hidden />
            공지사항 관리
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("consultation")}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "consultation"
                ? "bg-[#0a1e40] text-white"
                : "text-slate-600 hover:bg-cool-gray-100"
            }`}
          >
            <MessagesSquare className="h-5 w-5 shrink-0" aria-hidden />
            상담 문의 내역
          </button>
        </nav>
      </aside>

      {/* 컨텐츠 영역 */}
      <main className="min-w-0 flex-1 overflow-auto py-8">
        <div
          className={`mx-auto px-4 ${
            activeTab === "consultation" ? "max-w-6xl" : "max-w-2xl lg:max-w-3xl"
          }`}
        >
          {activeTab === "schedule" && <AdminForm />}
          {activeTab === "briefing" && <BriefingAdmin />}
          {activeTab === "notice" && <NoticeAdmin />}
          {activeTab === "consultation" && <ConsultationAdmin />}
        </div>
      </main>
    </div>
  );
}
