import dynamic from "next/dynamic";

const AdminLayout = dynamic(() => import("@/components/AdminLayout"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-withus-bg-hover">
      <p className="text-sm text-withus-navy-300">로딩 중...</p>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminLayout />;
}
