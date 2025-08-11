
"use client";

import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getMessaging, Messaging } from 'firebase/messaging';
import { initializeFirebase } from '@/lib/firebase';
import { Spinner } from '@/components/spinner';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  messaging: Messaging | null;
}

export const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [firebase, setFirebase] = useState<FirebaseContextType>({
    app: null,
    auth: null,
    messaging: null,
  });

  useEffect(() => {
    const app = initializeFirebase();
    const auth = getAuth(app);
    let messaging: Messaging | null = null;
    try {
      messaging = getMessaging(app);
    } catch (e) {
      console.error("Failed to initialize Firebase Messaging", e);
    }
    setFirebase({ app, auth, messaging });
  }, []);

  if (!firebase.app) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};
