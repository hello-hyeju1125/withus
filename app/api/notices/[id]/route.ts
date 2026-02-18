import { NextResponse } from "next/server";
import { getAdminFirestore, getAdminBucket } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

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

/** DELETE: 공지사항 삭제 (Firestore + Storage 이미지들) */
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
    const docRef = db.collection("notices").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const data = doc.data();
    const imageUrls = Array.isArray(data?.imageUrls)
      ? (data.imageUrls as string[])
      : [];

    await docRef.delete();

    const bucket = getAdminBucket();
    for (const url of imageUrls) {
      const path = extractStoragePath(url);
      if (path) {
        try {
          await bucket.file(path).delete();
        } catch (storageErr) {
          console.warn("Storage 이미지 삭제 실패:", path, storageErr);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/notices/[id] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "삭제 실패" },
      { status: 500 }
    );
  }
}
