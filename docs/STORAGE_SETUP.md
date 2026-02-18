# 시간표 업로드 (Storage · Firestore) 설정

시간표 업로드는 **Firebase Storage**(파일 저장) + **Firestore**(메타정보 저장) 둘 다 필요합니다. 아래를 **순서대로** 진행하세요.

---

## 0. 환경 변수 (.env) 설정 — "목록을 불러올 수 없습니다" 시

**시간표/공지/설명회 목록이 안 뜨고** "목록을 불러올 수 없습니다" 또는 **"GOOGLE_APPLICATION_CREDENTIALS... 환경 변수가 필요합니다"** 가 나오면:

1. 프로젝트 루트에 **`.env`** 파일이 있는지 확인 (없으면 `.env.example` 내용을 복사해 `.env` 생성)
2. **Firebase Admin**용 인증 중 하나를 반드시 설정:
   - **방법 1**: Firebase Console → 프로젝트 설정 → 서비스 계정 → **새 비공개 키 생성** → 다운로드한 JSON을 프로젝트 루트에 `firebase-service-account.json` 으로 저장 후, `.env` 에  
     `GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json`
   - **방법 2**: 위 JSON 내용을 한 줄로 붙여넣어 `.env` 에  
     `FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}`  
     (실제 JSON 전체를 한 줄로)
3. **브라우저용 Firebase** (업로드/Storage 연동)를 쓰려면 `.env` 에 **NEXT_PUBLIC_FIREBASE_API_KEY** 등 Firebase 클라이언트 설정도 채워야 합니다. (Firebase Console → 프로젝트 설정 → 일반 → 앱에서 확인)
4. 수정 후 **개발 서버 재시작** (`npm run dev` 다시 실행)

---

## 1. Cloud Firestore API 사용 설정 (PERMISSION_DENIED 시)

**"Cloud Firestore API has not been used... or it is disabled"** 오류가 나오면:

1. [Cloud Firestore API 사용 설정](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=withus-web-99dbf) 페이지로 이동
2. **사용 설정** 버튼 클릭
3. 1~2분 기다린 뒤 다시 시도

---

## 2. Firestore 데이터베이스 생성 (NOT_FOUND / code 5 시)

**"5 NOT_FOUND"** 또는 **"NOT_FOUND"** 오류가 나오면, API는 켜져 있지만 **데이터베이스가 아직 없음**입니다. Firebase Console에서 DB를 한 번 생성해야 합니다.

1. [Firebase Console](https://console.firebase.google.com) → 프로젝트 **withus-web-99dbf** 선택
2. 왼쪽 메뉴에서 **Firestore Database** 클릭
3. **"데이터베이스 만들기" / "Create database"** 클릭
4. **위치** 선택 (예: `nam5` 또는 가까운 리전) → **다음**
5. **보안 규칙**: 우선 **테스트 모드로 시작** 선택 후 **사용 설정** (나중에 규칙 수정 가능)
6. **만들기** 완료 후 1~2분 기다린 뒤, 관리자에서 다시 업로드 시도

> API만 켜고 Firestore DB를 만들지 않으면 NOT_FOUND(5) 가 납니다. 반드시 Firebase Console > Firestore Database 에서 **데이터베이스를 생성**하세요.

---

## 3. Storage 버킷이 없을 때 (404)

관리자에서 이미지 업로드 시 **"The specified bucket does not exist" (404)** 가 나오면 아래를 순서대로 확인하세요.

### 3-1. Firebase Storage 버킷 생성

1. [Firebase Console](https://console.firebase.google.com) → 프로젝트 **withus-web-99dbf** 선택
2. 왼쪽 메뉴에서 **Storage** 클릭
3. **"시작하기" / "Get started"** 가 보이면 클릭해 **기본 버킷을 생성**합니다.
4. 생성 후 상단에 버킷 주소가 표시됩니다. 예:
   - `gs://withus-web-99dbf.firebasestorage.app` 또는
   - `gs://withus-web-99dbf.appspot.com`

### 3-2. .env.local 버킷 이름 설정

**gs://** 를 제외한 **버킷 이름만** 사용합니다.

- 콘솔에 `gs://withus-web-99dbf.firebasestorage.app` 이면:
  ```bash
  FIREBASE_STORAGE_BUCKET=withus-web-99dbf.firebasestorage.app
  ```
- 콘솔에 `gs://withus-web-99dbf.appspot.com` 이면:
  ```bash
  FIREBASE_STORAGE_BUCKET=withus-web-99dbf.appspot.com
  ```

`.env.local`에 위 한 줄이 있는지 확인한 뒤, 개발 서버를 다시 실행하세요.

### 3-3. Google Cloud에서 확인 (여전히 404일 때)

1. [Google Cloud Console](https://console.cloud.google.com) → 프로젝트 **withus-web-99dbf** 선택
2. **API 및 서비스** → **사용 설정된 API** → **Cloud Storage API** 가 사용 설정되어 있는지 확인
3. **IAM 및 관리자** → **IAM** → 서비스 계정 `firebase-adminsdk-...` 에 **Storage 관리자** 또는 **Storage 객체 관리자** 역할이 있는지 확인

이후에도 404가 나오면, Firebase Console > Storage 화면에 표시된 **버킷 주소 전체(gs:// 제외)** 를 그대로 `FIREBASE_STORAGE_BUCKET`에 넣어 사용하세요.

---

## 4. 업로드는 됐는데 시간표 페이지에 안 보일 때

관리자에서 업로드 완료 메시지를 봤는데, **/schedule/daewon** 등 시간표 페이지에는 아무것도 안 나오면 **Firestore 보안 규칙**이 원인인 경우가 많습니다.

- 업로드는 **서버(Admin SDK)** 로 하므로 규칙을 거치지 않고 성공합니다.
- 시간표 페이지는 **브라우저(클라이언트)** 에서 Firestore를 **읽기** 때문에, 규칙에서 읽기를 허용해 줘야 합니다.

### 해결: Firestore 규칙에서 `timetables` 읽기 허용

1. [Firebase Console](https://console.firebase.google.com) → 프로젝트 **withus-web-99dbf** 선택
2. 왼쪽 **Firestore Database** → 상단 **규칙** 탭 클릭
3. 아래 **`timetables` 블록**을 기존 규칙 안에 추가하거나, 규칙 전체를 아래처럼 바꾼 뒤 **게시** 클릭

**방법 A – 기존 규칙에 추가**  
`match /databases/{database}/documents {` 바로 아래에 아래 블록만 넣으면 됩니다.

```text
    match /timetables/{docId} {
      allow read: if true;
      allow write: if false;
    }
```

**방법 B – 규칙 전체 교체**

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /timetables/{docId} {
      allow read: if true;
      allow write: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

- `timetables`: **읽기 허용** → 시간표 페이지에서 목록/이미지 표시 가능  
- `timetables` **쓰기 거부** → 업로드는 서버(Admin) API만 사용 가능  
4. **게시** 후 시간표 페이지를 새로고침하면 업로드한 시간표가 보여야 합니다.

### 그래도 안 보일 때

- **브라우저 개발자 도구(F12) → Console** 탭을 열고 시간표 페이지를 연 뒤, 빨간색 에러가 있는지 확인하세요. `Firestore timetables query error:` 로 시작하면 메시지 내용을 확인할 수 있습니다.
- 시간표 쿼리는 **복합 인덱스 없이** 동작하도록 되어 있습니다. (정렬은 페이지에서 처리) 이전에 인덱스 관련 오류가 났다면, 코드 수정으로 해결된 상태입니다.
