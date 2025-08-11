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

function getFirebaseInstances() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  
  if (typeof window !== 'undefined') {
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
  }
  
  return { app, auth };
}

// We are exporting the function so that we can initialize Firebase on the client-side
// and avoid server-side rendering issues.
export { getFirebaseInstances };
