
"use client";

import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import type { User, Auth, GoogleAuthProvider } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Messaging } from 'firebase/messaging';
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials } from '@/types';
import { firebaseConfig } from '@/lib/firebase';
import { Spinner } from '@/components/spinner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signOutUser: () => Promise<void>;
  app: FirebaseApp | null;
  auth: Auth | null;
  messaging: Messaging | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        
        const { getAuth, onAuthStateChanged } = await import('firebase/auth');
        const authInstance = getAuth(firebaseApp);
        
        let messagingInstance: Messaging | null = null;
        if (typeof window !== 'undefined') {
          try {
            const { getMessaging } = await import('firebase/messaging');
            messagingInstance = getMessaging(firebaseApp);
          } catch(e) {
             console.error("Failed to initialize Firebase Messaging", e);
          }
        }

        setApp(firebaseApp);
        setAuth(authInstance);
        setMessaging(messagingInstance);

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
          setUser(user);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase initialization error", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not connect to services.'
        });
        setLoading(false);
      }
    };

    initializeFirebase();
  }, [toast]);

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
      setLoading(false);
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
    } finally {
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
    } finally {
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
    } finally {
      setLoading(false);
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
    app,
    auth,
    messaging,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
