import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

type UpdateScheduleDetailBody = {
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

/** PATCH: 세부 시간표 수정 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "id 필요" }, { status: 400 });
    }

    const body = (await request.json()) as UpdateScheduleDetailBody;
    const school = typeof body.school === "string" ? body.school.trim() : "";
    const grade = typeof body.grade === "string" ? body.grade.trim() : "";
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
    const docRef = db.collection("scheduleDetails").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "세부 시간표를 찾을 수 없습니다." }, { status: 404 });
    }

    await docRef.update({
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
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/schedule-details/[id] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "수정 실패" },
      { status: 500 }
    );
  }
}

/** DELETE: 세부 시간표 삭제 */
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
    const docRef = db.collection("scheduleDetails").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "세부 시간표를 찾을 수 없습니다." }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/schedule-details/[id] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "삭제 실패" },
      { status: 500 }
    );
  }
}
