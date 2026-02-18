import dynamic from "next/dynamic";

const AdminLayout = dynamic(() => import("@/components/AdminLayout"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-cool-gray-100">
      <p className="text-sm text-slate-500">로딩 중...</p>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminLayout />;
}
