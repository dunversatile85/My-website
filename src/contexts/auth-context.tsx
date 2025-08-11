
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
      setLoading(false);
    }
  }, [firebase]);

  const handleAuthError = (error: any) => {
    toast({
      variant: "destructive",
      title: "Authentication Failed",
      description: error.message,
    });
  };

  const signInWithGoogle = async () => {
    if (!firebase?.auth) {
      console.error("Firebase not initialized");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebase.auth, provider);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signUpWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!firebase?.auth) {
      console.error("Firebase not initialized");
      return;
    }
    try {
      await createUserWithEmailAndPassword(firebase.auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    if (!firebase?.auth) {
      console.error("Firebase not initialized");
      return;
    }
    try {
      await signInWithEmailAndPassword(firebase.auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const signOutUser = async () => {
    if (!firebase?.auth) {
      console.error("Firebase not initialized");
      return;
    }
    try {
      await signOut(firebase.auth);
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
