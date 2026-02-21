/**
 * Firebase Admin API 오류 시 클라이언트 응답 및 로그 메시지 정리
 */
const UNAUTHENTICATED_MESSAGE =
  "Firebase 서비스 계정 인증에 실패했습니다. 서비스 계정 키를 재발급해 주세요. (docs/FIREBASE_CREDENTIAL_TROUBLESHOOTING.md 참고)";

export function isFirebaseUnauthenticated(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("UNAUTHENTICATED") ||
    msg.includes("invalid authentication credentials")
  );
}

export function handleFirebaseApiError(err: unknown, apiLabel: string): {
  status: number;
  body: { error: string };
} {
  if (isFirebaseUnauthenticated(err)) {
    console.error(
      `[Firebase Admin] ${apiLabel} UNAUTHENTICATED: 서비스 계정 키가 만료되었거나 권한이 없을 수 있습니다. ` +
        "Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > '새 비공개 키 생성'으로 JSON을 다시 받아 firebase-service-account.json을 교체하세요."
    );
    return {
      status: 503,
      body: { error: UNAUTHENTICATED_MESSAGE },
    };
  }
  console.error(`${apiLabel} error:`, err);
  return {
    status: 500,
    body: {
      error: err instanceof Error ? err.message : "조회 실패",
    },
  };
}
