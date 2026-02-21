# Vercel 배포 시 Environment Variables

Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables** 에서 아래 변수들을 추가하세요.

---

## 1. Firebase 클라이언트 (브라우저용) — 필수

| Name | 설명 | 예시 값 |
|------|------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API 키 | (Firebase Console → 프로젝트 설정 → 일반 → 웹 앱에서 확인) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth 도메인 | `withus-web-99dbf.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | 프로젝트 ID | `withus-web-99dbf` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage 버킷 | `withus-web-99dbf.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 메시징 Sender ID | `379695373121` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | 앱 ID | `1:379695373121:web:49693b34ec99f3c4301fc0` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Analytics (선택) | `G-XPQZ8V8NVV` |

---

## 2. Firebase Admin (서버 API용) — 필수

Vercel에는 **파일을 업로드할 수 없으므로** `GOOGLE_APPLICATION_CREDENTIALS` 대신 **`FIREBASE_SERVICE_ACCOUNT_JSON`** 만 사용하세요.

| Name | 설명 | 입력 방법 |
|------|------|-----------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | 서비스 계정 JSON **전체를 한 줄로** | Firebase Console → 프로젝트 설정 → 서비스 계정 → **새 비공개 키 생성** → 다운로드한 JSON 내용을 **줄바꿈 없이 한 줄**로 붙여넣기. 예: `{"type":"service_account","project_id":"withus-web-99dbf",...}` |

- Value에 따옴표가 포함된 JSON이 들어가므로, Vercel 입력란에 그대로 붙여넣으면 됩니다.
- **`GOOGLE_APPLICATION_CREDENTIALS`는 Vercel에서 설정하지 마세요.** (로컬용 파일 경로는 Vercel에 없음)

---

## 3. 선택 사항

| Name | 설명 | 언제 넣나요 |
|------|------|-------------|
| `FIREBASE_STORAGE_BUCKET` | Storage 버킷 (서버용) | 기본값이 `withus-web-99dbf.appspot.com`인데, 실제 버킷이 `withus-web-99dbf.firebasestorage.app` 이면 `withus-web-99dbf.firebasestorage.app` 로 설정 |
| `NEXT_PUBLIC_BASE_PATH` | 앱이 서브경로에 있을 때의 prefix | 예: `https://your-domain.com/withus` 로 배포할 때 `/withus` 로 설정. 루트에 배포하면 비워두거나 넣지 않음 |

---

## 체크리스트

- [ ] `NEXT_PUBLIC_FIREBASE_*` 7개 (또는 MEASUREMENT_ID 제외 6개)
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` (한 줄 JSON)
- [ ] 필요 시 `FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_BASE_PATH`

변수 추가/수정 후 **Redeploy** 해야 반영됩니다.
