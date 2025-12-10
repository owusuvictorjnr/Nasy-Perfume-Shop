/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/firebase/firebase";
import apiClient from "@/lib/api/api-client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    middleName?: string
  ) => {
    try {
      setLoading(true);
      setError("");

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with name
      const displayName = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;

      await updateProfile(userCredential.user, {
        displayName,
      });

      // Sync with backend - the auth guard will handle this automatically
      const token = await userCredential.user.getIdToken();

      // Make a request to sync user with backend
      await apiClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError("");

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Sync with backend
      const token = await userCredential.user.getIdToken();
      await apiClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Sync with backend
      const token = await userCredential.user.getIdToken();
      await apiClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return userCredential.user;
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading, error };
}

export function useLogout() {
  return () => signOut(auth);
}
