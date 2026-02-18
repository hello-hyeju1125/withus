import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/** GET: 상담 문의 목록 */
export async function GET() {
  try {
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("consultations")
      .orderBy("createdAt", "desc")
      .get();

    const items = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        studentName: typeof data.studentName === "string" ? data.studentName : "",
        parentPhone: typeof data.parentPhone === "string" ? data.parentPhone : "",
        schoolGrade: typeof data.schoolGrade === "string" ? data.schoolGrade : "",
        subject: typeof data.subject === "string" ? data.subject : "",
        content: typeof data.content === "string" ? data.content : "",
        status: data.status === "completed" ? "completed" : "pending",
        createdAt: data.createdAt?.toMillis?.() ?? null,
      };
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/consultations error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "조회 실패" },
      { status: 500 }
    );
  }
}

/** POST: 상담 문의 등록 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const studentName =
      typeof body?.studentName === "string" ? body.studentName.trim() : "";
    const parentPhone =
      typeof body?.parentPhone === "string" ? body.parentPhone.trim() : "";
    const schoolGrade =
      typeof body?.schoolGrade === "string" ? body.schoolGrade.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const content = typeof body?.content === "string" ? body.content.trim() : "";

    if (!studentName || !parentPhone || !schoolGrade || !subject || !content) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    const docRef = await db.collection("consultations").add({
      studentName,
      parentPhone,
      schoolGrade,
      subject,
      content,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (err) {
    console.error("POST /api/consultations error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "등록 실패" },
      { status: 500 }
    );
  }
}
