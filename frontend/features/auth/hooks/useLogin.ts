/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { auth } from "@/lib/firebase/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginWithGoogle } from "@/lib/firebase/authMethods";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Login
      const res = await signInWithEmailAndPassword(auth, email, password);

      // 2. Get Firebase ID Token
      const token = await res.user.getIdToken(true);

      console.log("🔥 ID TOKEN:", token);

      // 3. Store token (frontend → backend)
      localStorage.setItem("token", token);

      // 4. Redirect
      router.push("/");
    } catch (err: any) {
      let errorMessage = "Login failed";

      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many failed attempts. Try again later or reset your password.";
          break;
        default:
          errorMessage = err.message || "Login failed";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Use your own wrapper
      const result = await loginWithGoogle();

      // 2. Get token from user
      const token = await result.user.getIdToken(true);

      console.log("🔥 GOOGLE ID TOKEN:", token);

      // 3. Store token
      localStorage.setItem("token", token);

      // 4. Redirect
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return { login, googleLogin, loading, error };
};
