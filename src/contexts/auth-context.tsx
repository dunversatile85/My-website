
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
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials } from '@/types';
import { firebaseConfig } from '@/lib/firebase';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase context
interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  messaging: Messaging | null;
  analytics: Analytics | null;
}
const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

// Auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signOutUser: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
const AuthProviderContent = ({ children }: { children: ReactNode }) => {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthError = (error: any) => {
    setLoading(false);
    toast({
      variant: "destructive",
      title: "Authentication Failed",
      description: error.message,
    });
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signUpWithEmail = async ({ email, password }: AuthCredentials) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// Main Provider that ensures Firebase is initialized before Auth
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [firebaseInstances, setFirebaseInstances] = useState<FirebaseContextType | null>(null);

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
            
            setFirebaseInstances({ app, auth, analytics, messaging });
        }
    }, []);

    if (!firebaseInstances) {
        return null; // or a loading spinner
    }

    return (
        <FirebaseContext.Provider value={firebaseInstances}>
            <AuthProviderContent>{children}</AuthProviderContent>
        </FirebaseContext.Provider>
    );
};
