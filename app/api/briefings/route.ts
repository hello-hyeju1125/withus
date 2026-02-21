import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { handleFirebaseApiError } from "@/lib/firebase-admin-errors";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

/** GET: 설명회 목록 (category 쿼리 선택) */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const db = getAdminFirestore();
    let snapshot;

    try {
      if (category === "외고" || category === "일반고") {
        snapshot = await db
          .collection("briefings")
          .where("category", "==", category)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        snapshot = await db
          .collection("briefings")
          .orderBy("createdAt", "desc")
          .get();
      }
    } catch (indexErr) {
      // 복합 인덱스 미생성 시 전체 조회 후 클라이언트 필터
      const all = await db.collection("briefings").orderBy("createdAt", "desc").get();
      if (category === "외고" || category === "일반고") {
        snapshot = {
          docs: all.docs.filter((d) => d.data().category === category),
        } as typeof all;
      } else {
        snapshot = all;
      }
    }

    const items = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: typeof data.title === "string" ? data.title : "",
        author: typeof data.author === "string" ? data.author : "",
        content: typeof data.content === "string" ? data.content : "",
        imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
        category: data.category === "일반고" ? "일반고" : "외고",
        createdAt: data.createdAt?.toMillis?.() ?? null,
      };
    });

    return NextResponse.json(items);
  } catch (err) {
    const { status, body } = handleFirebaseApiError(err, "GET /api/briefings");
    return NextResponse.json(body, { status });
  }
}

/** POST: 설명회 등록 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, content, imageUrl, category } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "제목은 필수입니다." },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    const docRef = await db.collection("briefings").add({
      title: title.trim(),
      author: typeof author === "string" && author.trim() ? author.trim() : "관리자",
      content: typeof content === "string" ? content.trim() : "",
      imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",
      category: category === "일반고" ? "일반고" : "외고",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (err) {
    const { status, body } = handleFirebaseApiError(err, "POST /api/briefings");
    return NextResponse.json(body, { status });
  }
}
