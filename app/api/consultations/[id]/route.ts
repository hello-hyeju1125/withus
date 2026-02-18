import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/** PATCH: 상담 문의 상태 변경 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "id 필요" }, { status: 400 });
    }

    const body = await request.json();
    const status = body?.status === "completed" ? "completed" : "pending";

    const db = getAdminFirestore();
    await db.collection("consultations").doc(id).update({ status });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/consultations/[id] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "상태 변경 실패" },
      { status: 500 }
    );
  }
}

/** DELETE: 상담 문의 삭제 */
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
    await db.collection("consultations").doc(id).delete();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/consultations/[id] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "삭제 실패" },
      { status: 500 }
    );
  }
}
