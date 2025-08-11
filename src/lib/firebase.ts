
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getMessaging, Messaging } from "firebase/messaging";
import type { FirebaseOptions } from "firebase/app";

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDt_RRKw9WipU4uOPKHuqZ5aZVuMbn_Mhw",
  authDomain: "dons-playworld.firebaseapp.com",
  projectId: "dons-playworld",
  storageBucket: "dons-playworld.appspot.com",
  messagingSenderId: "4636726751",
  appId: "1:4636726751:web:f503c77e281710f74c606a",
};

let app: FirebaseApp;
let auth: Auth;
let messaging: Messaging | null = null;

// This function ensures Firebase is initialized only on the client side.
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  try {
    messaging = getMessaging(app);
  } catch (e) {
    console.error("Failed to initialize Firebase Messaging", e);
  }
} else if (getApps().length) {
  app = getApp();
  auth = getAuth(app);
  if (messaging === null) {
      try {
        messaging = getMessaging(app);
      } catch (e) {
        console.error("Failed to initialize Firebase Messaging", e);
      }
  }
}

// We are intentionally not exporting 'app' to enforce usage of specific services.
export { auth, messaging };
