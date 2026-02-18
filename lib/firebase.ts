import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (typeof window !== "undefined" && !firebaseConfig.apiKey) {
  console.error(
    "[Firebase] NEXT_PUBLIC_FIREBASE_API_KEY가 설정되지 않았습니다. .env 파일에 Firebase 클라이언트 설정을 추가하세요."
  );
}

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : (getApps()[0] as FirebaseApp);

export const db = getFirestore(app);
export const storage = getStorage(app);

export function getAnalyticsSafe(): Analytics | null {
  if (typeof window === "undefined") return null;
  try {
    return getAnalytics(app);
  } catch {
    return null;
  }
}
