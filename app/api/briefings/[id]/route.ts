import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/** DELETE: 설명회 삭제 */
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
    await db.collection("briefings").doc(id).delete();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/briefings/[id] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "삭제 실패" },
      { status: 500 }
    );
  }
}
