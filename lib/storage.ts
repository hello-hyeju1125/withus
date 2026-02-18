/**
 * 공용 Firebase Storage 업로드 유틸리티
 * - 코드 중복 최소화를 위해 AdminForm, BriefingAdmin, NoticeAdmin 등에서 사용
 */
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

export const ACCEPT_IMAGE = "image/png,image/jpeg,image/jpg";

/**
 * 공지사항 이미지 업로드 - images/notices/ 경로에 저장
 * @returns 다운로드 URL
 */
export async function uploadNoticeImage(file: File): Promise<string> {
  const path = `images/notices/${Date.now()}_${sanitizeFileName(file.name)}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });
  return getDownloadURL(storageRef);
}
