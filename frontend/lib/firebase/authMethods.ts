import { auth } from "@/lib/firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signOut,
} from "firebase/auth";

// GOOGLE LOGIN
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

// EMAIL LOGIN (magic link style - same as AliExpress)
export const loginWithEmail = async (email: string) => {
  const actionCodeSettings = {
    url: `${window.location.origin}`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
  alert("A login link has been sent to your email.");
};

// COMPLETE EMAIL SIGN-IN
export const completeEmailLogin = async () => {
  if (typeof window === "undefined") return;

  const email = window.localStorage.getItem("emailForSignIn");
  if (!email) return;

  if (isSignInWithEmailLink(auth, window.location.href)) {
    await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem("emailForSignIn");
  }
};

// LOGOUT
export const logout = async () => {
  await signOut(auth);
};
