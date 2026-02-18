import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { resolve } from "path";

const projectId = "withus-web-99dbf";
// Firebase에 따라 기본 버킷이 .appspot.com 또는 .firebasestorage.app 일 수 있음 (env로 덮어쓰기 가능)
export const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ||
  "withus-web-99dbf.appspot.com";

function getCredential() {
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (path) {
    const absolutePath = resolve(process.cwd(), path);
    return cert(absolutePath);
  }
  if (saJson) {
    const parsed = JSON.parse(saJson) as ServiceAccount;
    return cert(parsed);
  }
  throw new Error(
    "GOOGLE_APPLICATION_CREDENTIALS(JSON 파일 경로) 또는 FIREBASE_SERVICE_ACCOUNT_JSON(한 줄 JSON) 환경 변수가 필요합니다."
  );
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0] as ReturnType<typeof initializeApp>;
  }
  const credential = getCredential();
  return initializeApp({
    projectId,
    storageBucket,
    credential,
  });
}

export function getAdminBucket() {
  return getStorage(getAdminApp()).bucket();
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}
