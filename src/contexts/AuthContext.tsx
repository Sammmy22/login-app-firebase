"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as firebaseSignOut,
  signInWithGooglePopup,
} from "@/lib/auth";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

// Create the Auth context
const AuthContext = createContext<any>(null);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      }
      // if (!user) router.push("/"); // Redirect if no user
    });

    return () => unsubscribe();
  }, [user]);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmail(email, password);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    }
  };

  const signUpWithEmailPassword = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setError(null);
      await signUpWithEmail(email, password, displayName);
      // router.push("/home"); // Optional: Redirect after sign-up
    } catch (err: any) {
      setError(err.message || "An error occurred during sign-up");
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithGooglePopup();
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "An error occurred during Google sign-in");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
      router.push("/"); // Redirect to home or login page
    } catch (err: any) {
      setError(err.message || "An error occurred during sign-out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        loginWithEmail,
        signUpWithEmailPassword,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
