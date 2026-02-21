import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";

const projectId = "withus-web-99dbf";
// Firebase에 따라 기본 버킷이 .appspot.com 또는 .firebasestorage.app 일 수 있음 (env로 덮어쓰기 가능)
export const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ||
  "withus-web-99dbf.appspot.com";

function isServiceAccount(obj: unknown): obj is ServiceAccount {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj as ServiceAccount).type === "service_account" &&
    typeof (obj as ServiceAccount).client_email === "string" &&
    typeof (obj as ServiceAccount).private_key === "string"
  );
}

function loadServiceAccountJson(filePath: string): ServiceAccount {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!existsSync(absolutePath)) {
    throw new Error(
      `Firebase 서비스 계정 파일을 찾을 수 없습니다: ${absolutePath}. ` +
        "프로젝트 루트에 firebase-service-account.json을 두거나 GOOGLE_APPLICATION_CREDENTIALS 경로를 확인하세요."
    );
  }
  const raw = readFileSync(absolutePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (!isServiceAccount(parsed)) {
    throw new Error(
      "서비스 계정 JSON 형식이 올바르지 않습니다. Firebase 콘솔 > 프로젝트 설정 > 서비스 계정에서 '새 비공개 키 생성'으로 받은 JSON 파일을 사용하세요."
    );
  }
  return parsed;
}

function getCredential(): { credential: ReturnType<typeof cert>; projectId: string } {
  const pathEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  // 1) 환경 변수에 JSON 문자열이 있으면 사용
  if (saJson && saJson.trim()) {
    try {
      const parsed = JSON.parse(saJson) as unknown;
      if (isServiceAccount(parsed)) {
        return {
          credential: cert(parsed),
          projectId: parsed.project_id || projectId,
        };
      }
    } catch {
      // fallback to file
    }
  }

  // 2) 환경 변수에 파일 경로가 있으면 해당 파일 로드
  if (pathEnv && pathEnv.trim()) {
    const sa = loadServiceAccountJson(pathEnv);
    return { credential: cert(sa), projectId: sa.project_id || projectId };
  }

  // 3) 기본 경로 시도 (프로젝트 루트의 firebase-service-account.json)
  const defaultPath = "firebase-service-account.json";
  if (existsSync(resolve(process.cwd(), defaultPath))) {
    const sa = loadServiceAccountJson(defaultPath);
    return { credential: cert(sa), projectId: sa.project_id || projectId };
  }

  throw new Error(
    "Firebase Admin 인증 정보가 없습니다. 다음 중 하나를 설정하세요: " +
      "1) 프로젝트 루트에 firebase-service-account.json 저장, " +
      "2) .env에 GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json, " +
      "3) .env에 FIREBASE_SERVICE_ACCOUNT_JSON={\"type\":\"service_account\",...}"
  );
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0] as ReturnType<typeof initializeApp>;
  }
  const { credential, projectId: resolvedProjectId } = getCredential();
  const bucket = storageBucket.replace(projectId, resolvedProjectId);
  return initializeApp({
    projectId: resolvedProjectId,
    storageBucket: bucket,
    credential,
  });
}

export function getAdminBucket() {
  return getStorage(getAdminApp()).bucket();
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}
