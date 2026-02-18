import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const SCHOOL_LABELS: Record<string, string> = {
  daewon: "대원외고",
  hanyoung: "한영외고",
  general: "일반고",
  private: "개인팀",
};

/** GET: 시간표 목록 (school, grade 쿼리 선택) */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const school = searchParams.get("school");
    const grade = searchParams.get("grade");

    const db = getAdminFirestore();
    const snapshot = await db
      .collection("timetables")
      .orderBy("createdAt", "desc")
      .get();

    let docs = snapshot.docs;
    if (school || grade) {
      docs = docs.filter((d) => {
        const data = d.data();
        if (school && data.school !== school) return false;
        if (grade && data.grade !== grade) return false;
        return true;
      });
    }

    const items = docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        school: typeof data.school === "string" ? data.school : "",
        grade: typeof data.grade === "string" ? data.grade : "",
        schoolLabel: SCHOOL_LABELS[data.school] || data.school,
        fileUrl: typeof data.fileUrl === "string" ? data.fileUrl : "",
        fileType: data.fileType === "pdf" ? "pdf" : "image",
        fileName: typeof data.fileName === "string" ? data.fileName : "",
        createdAt: data.createdAt?.toMillis?.() ?? null,
      };
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/timetables error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "조회 실패" },
      { status: 500 }
    );
  }
}
