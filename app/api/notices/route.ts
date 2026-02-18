import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

/** GET: 공지사항 목록 (중요 공지 우선, 그 후 createdAt 내림차순) */
export async function GET() {
  try {
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("notices")
      .orderBy("createdAt", "desc")
      .get();

    const items = snapshot.docs.map((d) => {
      const data = d.data();
      const imageUrls = data.imageUrls;
      const urls = Array.isArray(imageUrls)
        ? imageUrls.filter((u: unknown) => typeof u === "string")
        : [];
      return {
        id: d.id,
        title: typeof data.title === "string" ? data.title : "",
        isImportant: data.isImportant === true,
        author: typeof data.author === "string" ? data.author : "관리자",
        content: typeof data.content === "string" ? data.content : "",
        imageUrls: urls,
        createdAt: data.createdAt?.toMillis?.() ?? null,
      };
    });

    // 클라이언트 정렬: 중요 공지 우선, 그 후 최신순
    items.sort((a, b) => {
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      const aTime = a.createdAt ?? 0;
      const bTime = b.createdAt ?? 0;
      return bTime - aTime;
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/notices error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "조회 실패" },
      { status: 500 }
    );
  }
}

/** POST: 공지사항 등록 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, isImportant, author, content, imageUrls } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "제목은 필수입니다." },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    const urls = Array.isArray(imageUrls)
      ? imageUrls.filter((u: unknown) => typeof u === "string")
      : [];

    const docRef = await db.collection("notices").add({
      title: title.trim(),
      isImportant: isImportant === true,
      author: typeof author === "string" && author.trim() ? author.trim() : "관리자",
      content: typeof content === "string" ? content.trim() : "",
      imageUrls: urls,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (err) {
    console.error("POST /api/notices error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "등록 실패" },
      { status: 500 }
    );
  }
}
