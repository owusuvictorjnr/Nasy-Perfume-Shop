"use client";

import { useState } from "react";
import { useAuthContext } from "@/lib/firebase/AuthProvider";
import { logout } from "@/lib/firebase/authMethods";
import AuthModal from "./AuthModal";

export default function AuthDropdown() {
  const { user } = useAuthContext();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="relative group">
      {/* TEXT SHOWN ON HEADER */}
      {!user ? (
        <button className="text-sm hover:text-black">Sign in / Register</button>
      ) : (
        <button className="text-sm hover:text-black">
          Hello, {user.displayName?.split(" ")[0] || "User"}
        </button>
      )}

      {/* HOVER DROPDOWN */}
      <div className="absolute right-0 hidden group-hover:block bg-white shadow-xl border rounded-lg w-60 mt-2 z-50">
        {!user ? (
          <>
            <button
              onClick={() => setOpenModal(true)}
              className="block w-full text-left px-4 py-3 hover:bg-gray-50"
            >
              Sign in
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="block w-full text-left px-4 py-3 hover:bg-gray-50"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <p className="px-4 py-3 text-gray-500">Welcome back</p>

            <button
              onClick={logout}
              className="block w-full text-left px-4 py-3 hover:bg-gray-50"
            >
              Logout
            </button>
          </>
        )}
      </div>

      <AuthModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
