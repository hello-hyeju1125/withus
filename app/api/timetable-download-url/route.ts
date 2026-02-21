import { NextResponse } from "next/server";
import { getAdminBucket, storageBucket } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/** 서버에서 Storage 파일 메타데이터로부터 다운로드 URL 생성 (기존 잘못 저장된 메타데이터 URL 대응) */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    if (!path) {
      return NextResponse.json({ error: "path 필요" }, { status: 400 });
    }

    const bucket = getAdminBucket();
    const file = bucket.file(path);
    const [metadata] = await file.getMetadata();
    const raw =
      metadata?.metadata?.firebaseStorageDownloadTokens;
    const token = Array.isArray(raw) ? raw[0] : typeof raw === "string" ? raw : null;

    if (!token) {
      return NextResponse.json(
        { error: "다운로드 토큰을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const encoded = encodeURIComponent(path);
    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encoded}?alt=media&token=${token}`;

    return NextResponse.json(
      { fileUrl },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (err) {
    console.error("timetable-download-url error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "URL 조회 실패" },
      { status: 500 }
    );
  }
}
