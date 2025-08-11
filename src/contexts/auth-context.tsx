"use client";

import { createContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
} from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials } from '@/types';
import { useFirebase } from '@/hooks/use-firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const firebase = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (firebase?.auth) {
      const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // if firebase.auth is not available, we are not loading a user
      setLoading(false);
    }
  }, [firebase]);

  const withAuth = <T,>(action: (auth: Auth, ...args: T[]) => Promise<any>) => {
    return async (...args: T[]) => {
      if (!firebase?.auth) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Firebase is not initialized. Please try again later.",
        });
        return;
      }
      try {
        await action(firebase.auth, ...args);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error.message,
        });
      }
    };
  };

  const signInWithGoogle = withAuth(async (auth: Auth) => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  });
  
  const signUpWithEmail = withAuth(async (auth: Auth, { email, password }: AuthCredentials) => {
    await createUserWithEmailAndPassword(auth, email, password);
  });
  
  const signInWithEmail = withAuth(async (auth: Auth, { email, password }: AuthCredentials) => {
    await signInWithEmailAndPassword(auth, email, password);
  });
  
  const signOutUser = withAuth(async (auth: Auth) => {
    await signOut(auth);
  });

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
