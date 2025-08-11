import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

// Initialize Firebase services only on the client side
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
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

export { app, auth };
