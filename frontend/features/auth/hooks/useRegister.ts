"use client";

import { auth } from "@/lib/firebase/firebase";
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { loginWithGoogle } from "@/lib/firebase/authMethods";

export function useRegister() {
  const register = async (form: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    // Registration logic here
    if (form.password !== form.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Proceed with registration (e.g., call Firebase or your backend)
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    await updateProfile(userCredentials.user, {
      displayName: `${form.firstName} ${form.middleName || ""} ${
        form.lastName
      }`.trim(),
    });
    return userCredentials.user;
  };
  const googleSignIn = async () => {
    // Use the same Google sign-in path for register/login
    const result = await loginWithGoogle();
    return result.user;
  };

  return { register, googleSignIn };
}
