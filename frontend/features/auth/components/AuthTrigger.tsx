"use client";

import { useAuthContext } from "@/lib/firebase/AuthProvider";
import { logout } from "@/lib/firebase/authMethods";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function AuthTrigger() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);

  // User initials function
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.map((p) => p[0].toUpperCase()).join("");
  };

  // If logged OUT
  if (!user)
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Login
        </button>

        <AuthModal open={open} onClose={() => setOpen(false)} />
      </>
    );

  // If logged IN
  return (
    <div className="relative group">
      <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center cursor-pointer">
        {getInitials(user.displayName || user.email || "User")}
      </div>

      {/* DROPDOWN */}
      <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg p-2 hidden group-hover:block w-48">
        <p className="px-3 py-2 text-sm">Welcome back</p>

        <button
          onClick={() => logout()}
          className="px-3 py-2 text-left w-full hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
