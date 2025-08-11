import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: "app-prototyper-2.firebaseapp.com",
  projectId: "app-prototyper-2",
  storageBucket: "app-prototyper-2.appspot.com",
  messagingSenderId: "957013876341",
  appId: "1:957013876341:web:3547161556021571173988",
  measurementId: "G-5G97QGB8P2"
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
if (typeof window !== 'undefined') {
  getAnalytics(app);
  getMessaging(app);
}

export { app, auth };
