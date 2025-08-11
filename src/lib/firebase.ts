
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDt_RRKw9WipU4uOPKHuqZ5aZVuMbn_Mhw",
  authDomain: "dons-playworld.firebaseapp.com",
  projectId: "dons-playworld",
  storageBucket: "dons-playworld.appspot.com",
  messagingSenderId: "4636726751",
  appId: "1:4636726751:web:f503c77e281710f74c606a",
};

// Helper function to initialize Firebase
export function initializeFirebase(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    } else {
        return getApp();
    }
}
