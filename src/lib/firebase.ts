import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDt_RRKw9WipU4uOPKHuqZ5aZVuMbn_Mhw",
  authDomain: "dons-playworld.firebaseapp.com",
  projectId: "dons-playworld",
  storageBucket: "dons-playworld.firebasestorage.app",
  messagingSenderId: "4636726751",
  appId: "1:4636726751:web:f503c77e281710f74c606a",
  measurementId: ""
};

// Initialize Firebase for client-side
function getFirebaseInstances(): { app: FirebaseApp, auth: Auth } {
  if (typeof window !== 'undefined') {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    
    // Initialize other services if needed
    try {
      getAnalytics(app);
    } catch (e) {
      console.error('Failed to initialize Analytics', e);
    }
    try {
      getMessaging(app);
    } catch (e) {
      console.error('Failed to initialize Messaging', e);
    }
    
    return { app, auth };
  }
  // This is a fallback for server-side rendering, though client-side is preferred for auth
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  return { app, auth };
}

export const { app, auth } = getFirebaseInstances();
