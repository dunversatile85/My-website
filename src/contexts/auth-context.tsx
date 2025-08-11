
"use client";

import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  getAuth,
} from 'firebase/auth';
import { getMessaging, Messaging } from "firebase/messaging";
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials } from '@/types';
import { Spinner } from '@/components/spinner';
import { FirebaseApp } from 'firebase/app';
import { initializeFirebase } from '@/lib/firebase';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  messaging: Messaging | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signOutUser: () => Promise<void>;
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
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // This check ensures Firebase is initialized only on the client side.
    if (typeof window !== 'undefined') {
      const app = initializeFirebase();
      const auth = getAuth(app);
      let messaging: Messaging | null = null;
      try {
        messaging = getMessaging(app);
      } catch (e) {
        console.error("Failed to initialize Firebase Messaging", e);
      }
      
      setFirebase({ app, auth, messaging });

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
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
    if (!firebase) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebase.auth, provider);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const signUpWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!firebase) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(firebase.auth, email, password);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!firebase) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebase.auth, email, password);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const signOutUser = async () => {
    if (!firebase) return;
    setLoading(true);
    try {
      await signOut(firebase.auth);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOutUser,
    messaging: firebase?.messaging || null,
  };

  // Render a spinner while Firebase is initializing or auth state is loading
  if (loading || !firebase) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
