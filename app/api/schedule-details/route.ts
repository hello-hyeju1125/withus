import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const SCHOOL_LABELS: Record<string, string> = {
  daewon: "대원외고",
  hanyoung: "한영외고",
  general: "일반고",
  private: "개인팀",
};

type CreateScheduleDetailBody = {
  school?: string;
  grade?: string;
  category?: string;
  displayOrder?: number;
  instructorName?: string;
  subject?: string;
  courseTitle?: string;
  teachingStyle?: string;
  schedule?: string;
  startDate?: string;
  videoUrl?: string;
};

/** GET: 세부 시간표 목록 (school, grade 필터 가능) */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const school = searchParams.get("school");
    const grade = searchParams.get("grade");

    const db = getAdminFirestore();
    const snapshot = await db
      .collection("scheduleDetails")
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
        category: typeof data.category === "string" ? data.category : "",
        displayOrder:
          typeof data.displayOrder === "number" && Number.isFinite(data.displayOrder)
            ? data.displayOrder
            : null,
        instructorName:
          typeof data.instructorName === "string" ? data.instructorName : "",
        subject: typeof data.subject === "string" ? data.subject : "",
        courseTitle: typeof data.courseTitle === "string" ? data.courseTitle : "",
        teachingStyle:
          typeof data.teachingStyle === "string" ? data.teachingStyle : "",
        schedule: typeof data.schedule === "string" ? data.schedule : "",
        startDate: typeof data.startDate === "string" ? data.startDate : "",
        videoUrl: typeof data.videoUrl === "string" ? data.videoUrl : "",
        createdAt: data.createdAt?.toMillis?.() ?? null,
      };
    });

    const sorted = items.sort((a, b) => {
      const ao = typeof a.displayOrder === "number" ? a.displayOrder : Number.MAX_SAFE_INTEGER;
      const bo = typeof b.displayOrder === "number" ? b.displayOrder : Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      const at = typeof a.createdAt === "number" ? a.createdAt : 0;
      const bt = typeof b.createdAt === "number" ? b.createdAt : 0;
      return bt - at;
    });

    return NextResponse.json(sorted);
  } catch (err) {
    console.error("GET /api/schedule-details error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "조회 실패" },
      { status: 500 }
    );
  }
}

/** POST: 세부 시간표 등록 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateScheduleDetailBody;
    const school = typeof body.school === "string" ? body.school : "";
    const grade = typeof body.grade === "string" ? body.grade : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const displayOrder =
      typeof body.displayOrder === "number" && Number.isFinite(body.displayOrder)
        ? Math.floor(body.displayOrder)
        : NaN;
    const instructorName =
      typeof body.instructorName === "string" ? body.instructorName.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const courseTitle =
      typeof body.courseTitle === "string" ? body.courseTitle.trim() : "";
    const teachingStyle =
      typeof body.teachingStyle === "string" ? body.teachingStyle.trim() : "";
    const schedule =
      typeof body.schedule === "string" ? body.schedule.trim() : "";
    const startDate =
      typeof body.startDate === "string" ? body.startDate.trim() : "";
    const videoUrl =
      typeof body.videoUrl === "string" ? body.videoUrl.trim() : "";

    if (
      !school ||
      !grade ||
      !category ||
      !Number.isFinite(displayOrder) ||
      displayOrder < 1 ||
      !instructorName ||
      !subject ||
      !courseTitle ||
      !teachingStyle ||
      !schedule ||
      !startDate
    ) {
      return NextResponse.json(
        {
          error:
            "필수 항목(학교, 학년, 카테고리, 카드 순서, 선생님 이름, 과목명, 카드 제목, 강의 스타일, 요일/시간, 개강)을 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    const ref = await db.collection("scheduleDetails").add({
      school,
      grade,
      category,
      displayOrder,
      instructorName,
      subject,
      courseTitle,
      teachingStyle,
      schedule,
      startDate,
      videoUrl,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, id: ref.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/schedule-details error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "등록 실패" },
      { status: 500 }
    );
  }
}
