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
  Auth
} from 'firebase/auth';
import { getFirebaseInstances } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials } from '@/types';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { auth: authInstance } = getFirebaseInstances();
    setAuth(authInstance);

    if (authInstance) {
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message,
      });
    }
  };

  const signUpWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!auth) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-Up Failed",
        description: error.message,
      });
    }
  };

  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-In Failed",
        description: error.message,
      });
    }
  };

  const signOutUser = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-Out Failed",
        description: error.message,
      });
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
