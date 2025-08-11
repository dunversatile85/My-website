
'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials } from '@/types';
import { Spinner } from '@/components/spinner';
import { firebaseConfig } from '@/lib/firebase';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import type { Auth, Unsubscribe } from 'firebase/auth';
import type { Messaging } from 'firebase/messaging';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signOutUser: () => Promise<void>;
  auth: Auth | null;
  messaging: Messaging | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    Promise.all([
      import('firebase/auth'),
      import('firebase/messaging')
    ]).then(([{ getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut }, { getMessaging }]) => {
      
      const authInstance = getAuth(app);
      setAuth(authInstance);

      if (typeof window !== 'undefined') {
        try {
          const messagingInstance = getMessaging(app);
          setMessaging(messagingInstance);
        } catch (e) {
          console.error("Failed to initialize Firebase Messaging", e);
        }
      }

      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    });
  }, []);


  const handleAuthError = (error: any) => {
    console.error("Authentication Error:", error);
    toast({
      variant: "destructive",
      title: "Authentication Failed",
      description: error.message || "An unknown authentication error occurred.",
    });
  };

  const signInWithGoogle = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
    } finally {
      // setLoading(false) is handled by onAuthStateChanged
    }
  };
  
  const signUpWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!auth) return;
    setLoading(true);
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
      setLoading(false); 
    }
  };
  
  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!auth) return;
    setLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
      setLoading(false);
    }
  };
  
  const signOutUser = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (error) {
      handleAuthError(error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOutUser,
    auth,
    messaging,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
