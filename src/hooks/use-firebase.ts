import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getMessaging, Messaging } from 'firebase/messaging';
import { firebaseConfig } from '@/lib/firebase';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  analytics: Analytics | null;
  messaging: Messaging | null;
}

// This hook ensures Firebase is initialized only on the client side.
export function useFirebase() {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      
      let analytics = null;
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.error('Failed to initialize Analytics', e);
      }
      
      let messaging = null;
      try {
        messaging = getMessaging(app);
      } catch (e) {
        console.error('Failed to initialize Messaging', e);
      }

      setInstances({ app, auth, analytics, messaging });
    }
  }, []);

  return instances;
}
