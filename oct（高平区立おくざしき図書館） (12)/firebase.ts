
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // 環境変数から取得
  authDomain: "oct-hp.firebaseapp.com",
  projectId: "oct-hp",
  storageBucket: "oct-hp.appspot.com",
  messagingSenderId: "311607769750",
  appId: "1:311607769750:web:10860ce0a04e2c061060b7",
  measurementId: "G-DEXS3BBN5W"
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;
let storage: FirebaseStorage | undefined;

// APIキーが設定されていない場合は警告
if (!firebaseConfig.apiKey) {
  console.warn("Firebase API Key is not set. Please set the FIREBASE_API_KEY environment variable.");
}

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Analytics is optional
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.debug("Analytics not available");
  }
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db, app, analytics, storage };