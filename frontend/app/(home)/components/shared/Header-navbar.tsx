"use client";

import NavLinks from "@/app/(home)/components/shared/NavLinks";
import Search from "@/app/(home)/components/shared/Search";
import Sidebar from "@/app/(home)/components/shared/Sidebar";
import { useFirebaseAuth } from "@/features/auth/hooks/useFirebaseAuth";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const { user, loading, logout } = useFirebaseAuth();

  // Extract Initials
  const initials =
    user?.displayName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("") || "".toUpperCase();

  return (
    <div className="min-h-16 bg-[#faedcd] border-b border-[#eeeeee] relative ">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* left: hamburger on mobile */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded"
            aria-label="Open menu"
            onClick={() => setShowMobileNav(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="hidden md:block ">
            <span className="flex items-center w-64 justify-center">
              <Search />
            </span>
          </div>
        </div>

        {/* center: search on small screens as icon only */}
        <div className="md:hidden flex-1 flex justify-center px-4">
          <Search />
        </div>

        {/* right: auth (moved here so login is on the right side) */}
        <div className="flex items-center gap-4">
          {/* LOADING STATE */}
          {loading && <div className="text-sm text-gray-500">...</div>}

          {/* LOGGED OUT */}
          {!loading && !user && (
            <div className="relative">
              <button
                onClick={() => setShowAuthMenu((s) => !s)}
                className="text-sm hover:underline"
                aria-expanded={showAuthMenu}
              >
                Login
              </button>

              {/* Dropdown: contains Login + Register, shown only when user opens it */}
              {showAuthMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setShowAuthMenu(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setShowAuthMenu(false)}
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* LOGGED IN */}
          {!loading && user && (
            <div className="flex items-center gap-3">
              <div className="text-sm">
                Hi, <span className="font-semibold">{user.displayName}</span>
              </div>

              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
                {initials}
              </div>

              <button
                onClick={logout}
                className="text-red-500 text-sm hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop navbar */}
      <div className="hidden md:block">
        <NavLinks />
      </div>

      {/* Mobile slide-over nav */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 z-10"
            onClick={() => setShowMobileNav(false)}
          />
          <div className="ml-0 w-72 bg-white h-full p-4 overflow-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold">Menu</div>
              <button
                onClick={() => setShowMobileNav(false)}
                className="text-gray-600 rounded-full w-6  h-6 flex items-center justify-center"
              >
                x
              </button>
            </div>
            <div className="">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
