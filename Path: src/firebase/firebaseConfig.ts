import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDt_RRKw9WipU4uOPKHuqZ5aZVuMbn_Mhw",
  authDomain: "dons-playworld.firebaseapp.com",
  projectId: "dons-playworld",
  storageBucket: "dons-playworld.firebasestorage.app",
  messagingSenderId: "4636726751",
  appId: "1:4636726751:web:f503c77e281710f74c606a",
  measurementId: "G-KT6DZMYBK4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;
