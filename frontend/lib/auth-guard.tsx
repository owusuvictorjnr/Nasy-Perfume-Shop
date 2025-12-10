"use client";

import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.push("/auth/login");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  return authenticated ? <>{children}</> : null;
}
