/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth/web-extension";
import { useEffect, useState } from "react";

export function useFirebaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? firebaseUser : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Implement Google login logic here
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };
  return { user, loading, loginWithGoogle, logout };
}
