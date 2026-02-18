import { NextResponse } from "next/server";
import { getAdminFirestore, getAdminBucket } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/** fileUrl에서 Storage 경로 추출 (Firebase 다운로드 URL 형식) */
function extractStoragePath(fileUrl: string): string | null {
  try {
    const u = new URL(fileUrl);
    if (
      !(
        u.hostname === "firebasestorage.googleapis.com" ||
        u.hostname.endsWith(".firebasestorage.app")
      )
    ) {
      return null;
    }
    const match = u.pathname.match(/\/o\/(.+?)(?:\?|$)/);
    if (!match) return null;
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/** DELETE: 시간표 삭제 (Firestore + Storage 파일) */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "id 필요" }, { status: 400 });
    }

    const db = getAdminFirestore();
    const docRef = db.collection("timetables").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "시간표를 찾을 수 없습니다." }, { status: 404 });
    }

    const data = doc.data();
    const fileUrl = data?.fileUrl;

    await docRef.delete();

    if (typeof fileUrl === "string") {
      const path = extractStoragePath(fileUrl);
      if (path) {
        try {
          const bucket = getAdminBucket();
          await bucket.file(path).delete();
        } catch (storageErr) {
          console.warn("Storage 파일 삭제 실패 (Firestore 문서는 삭제됨):", storageErr);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/timetables/[id] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "삭제 실패" },
      { status: 500 }
    );
  }
}
