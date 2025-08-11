
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
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials } from '@/types';
import { firebaseConfig } from '@/lib/firebase';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { Spinner } from '@/components/spinner';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  messaging: Messaging | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initializedApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const authInstance = getAuth(initializedApp);
      
      setApp(initializedApp);
      setAuth(authInstance);

      try {
        const messagingInstance = getMessaging(initializedApp);
        setMessaging(messagingInstance);
      } catch (e) {
        console.error('Failed to initialize Messaging', e);
      }
      
      try {
        getAnalytics(initializedApp);
      } catch (e) {
        console.error('Failed to initialize Analytics', e);
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={{ app, auth, messaging }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

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
  const { auth, messaging } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (auth) {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
          });
          return () => unsubscribe();
        })
        .catch((error) => {
          console.error("Error setting persistence:", error);
          setLoading(false);
        });
    } else {
        setLoading(false);
    }
  }, [auth]);

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
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signUpWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!auth) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signOutUser = async () => {
    if (!auth) return;
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
