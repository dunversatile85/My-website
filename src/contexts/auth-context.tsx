
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
  getAuth
} from 'firebase/auth';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials } from '@/types';
import { firebaseConfig } from '@/lib/firebase';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';
import { Spinner } from '@/components/spinner';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This check ensures Firebase is only initialized on the client side
    if (typeof window !== 'undefined') {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const authInstance = getAuth(app);
      setAuth(authInstance);

      try {
        const messagingInstance = getMessaging(app);
        setMessaging(messagingInstance);
      } catch (e) {
        console.error('Failed to initialize Messaging', e);
      }
      
      try {
        getAnalytics(app);
      } catch (e) {
        console.error('Failed to initialize Analytics', e);
      }

      // Listener for auth state changes
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        setUser(user);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
        setLoading(false);
    }
  }, []);

  const handleAuthError = (error: any) => {
    console.error("Authentication Error:", error);
    setLoading(false);
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
      await signOut(auth);
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
    messaging,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Spinner size="lg" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
