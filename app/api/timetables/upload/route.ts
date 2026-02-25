import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDownloadURL } from "firebase-admin/storage";
import { getAdminBucket, getAdminFirestore } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const SCHOOL_VALUES = ["daewon", "hanyoung", "general", "private"] as const;
const ACCEPT_TYPES = ["image/jpeg", "image/jpg", "image/png"];

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

function getFileType(mime: string): "image" | "pdf" {
  if (mime === "application/pdf") return "pdf";
  return "image";
}

/** POST: 서버에서 이미지 업로드 → Storage + Firestore (클라이언트 Storage 권한 불필요) */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const school = formData.get("school");
    const grade = formData.get("grade");

    if (typeof school !== "string" || !SCHOOL_VALUES.includes(school as (typeof SCHOOL_VALUES)[number])) {
      return NextResponse.json({ error: "school 필요 (daewon, hanyoung, general, private)" }, { status: 400 });
    }
    const gradeStr = typeof grade === "string" && (grade === "1" || grade === "2" || grade === "3") ? grade : "1";

    const files: File[] = [];
    const fileList = formData.getAll("files");
    if (Array.isArray(fileList)) {
      for (const f of fileList) {
        if (f instanceof File && f.size > 0) files.push(f);
      }
    }
    // 단일 file 필드도 허용
    const single = formData.get("file");
    if (single instanceof File && single.size > 0) files.push(single);

    if (files.length === 0) {
      return NextResponse.json({ error: "업로드할 이미지 파일을 선택하세요." }, { status: 400 });
    }

    const bucket = getAdminBucket();
    const db = getAdminFirestore();
    const uploaded: { fileName: string; fileUrl: string }[] = [];

    for (const file of files) {
      const mime = file.type || "";
      if (!ACCEPT_TYPES.includes(mime) && mime !== "application/pdf") {
        continue; // 지원 형식만 처리
      }
      const path = `images/timetables/${Date.now()}_${sanitizeFileName(file.name)}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const token = randomUUID();

      const gcsFile = bucket.file(path);
      await gcsFile.save(buffer, {
        metadata: {
          contentType: mime || "image/jpeg",
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
      });

      let fileUrl: string;
      try {
        fileUrl = await getDownloadURL(gcsFile);
      } catch {
        fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
      }
      const fileType = getFileType(mime);

      await db.collection("timetables").add({
        school,
        grade: gradeStr,
        fileUrl,
        fileType,
        fileName: file.name,
        createdAt: FieldValue.serverTimestamp(),
      });

      uploaded.push({ fileName: file.name, fileUrl });
    }

    return NextResponse.json({
      ok: true,
      count: uploaded.length,
      message: uploaded.length === 1 ? "요약 시간표 1장이 등록되었습니다." : `요약 시간표 ${uploaded.length}장이 등록되었습니다.`,
    });
  } catch (err) {
    console.error("POST /api/timetables/upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "업로드 실패" },
      { status: 500 }
    );
  }
}
