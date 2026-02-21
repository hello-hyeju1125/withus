# Firebase 인증 오류 해결 (UNAUTHENTICATED)

공지사항, 설명회, 시간표 등이 "데이터가 뜨지 않는다"거나 API에서 **UNAUTHENTICATED** / **invalid authentication credentials** 오류가 나는 경우, 서버용 Firebase 서비스 계정 인증에 문제가 있는 것입니다.

## 원인

- 서비스 계정 **비공개 키가 만료·삭제**되었거나
- **잘못된 JSON**을 쓰고 있거나 (웹 API 키가 아닌 **서비스 계정 JSON**이어야 함)
- 서비스 계정 **권한**이 부족한 경우

## 해결 방법

### 1. 서비스 계정 새 비공개 키 발급

1. [Firebase Console](https://console.firebase.google.com/) → 프로젝트 **withus-web-99dbf** 선택
2. **프로젝트 설정**(휴지통 옆 톱니바퀴) → **서비스 계정** 탭
3. **Firebase Admin SDK** 섹션에서 **새 비공개 키 생성** 클릭 → JSON 파일 다운로드
4. 다운로드한 JSON 파일을 프로젝트 루트에 **`firebase-service-account.json`** 이름으로 저장 (기존 파일 덮어쓰기)
5. `.env` / `.env.local`에 아래가 있으면 경로 확인 (없으면 루트의 `firebase-service-account.json`을 자동으로 사용함)
   - `GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json`
6. 개발 서버 재시작 후 공지/설명회 API 다시 호출

### 2. 서비스 계정 권한 확인

- Firebase Console → 프로젝트 설정 → 서비스 계정
- 해당 서비스 계정(예: `firebase-adminsdk-xxxxx@withus-web-99dbf.iam.gserviceaccount.com`)에  
  **편집자** 또는 **Firebase Admin SDK 관리자** 역할이 있어야 Firestore/Storage 접근이 가능합니다.
- [Google Cloud Console](https://console.cloud.google.com/) → IAM에서 해당 계정에 **Cloud Datastore User** 또는 **Firebase Admin** 권한이 있는지 확인할 수 있습니다.

### 3. Vercel 등 배포 환경

- 배포 환경에서는 파일을 올리지 않으므로 **`FIREBASE_SERVICE_ACCOUNT_JSON`** 환경 변수에  
  위에서 받은 JSON **전체를 한 줄로** 넣어야 합니다.  
  자세한 내용은 [VERCEL_ENV.md](./VERCEL_ENV.md)를 참고하세요.

### 4. 로컬에서 동작 확인

터미널에서 같은 키로 Firestore 접근이 되는지 확인:

```bash
cd /Users/hello_hyeju/Downloads/withus
node -e "
const admin = require('firebase-admin');
const sa = require('./firebase-service-account.json');
admin.initializeApp({ credential: admin.credential.cert(sa), projectId: sa.project_id });
admin.firestore().collection('notices').limit(1).get()
  .then(s => console.log('OK', s.size))
  .catch(e => console.error('FAIL', e.message));
"
```

- **OK** 가 나오면 키와 권한은 정상입니다.  
- **UNAUTHENTICATED** 가 나오면 위 1·2단계(키 재발급, 권한 확인)를 다시 진행하세요.
