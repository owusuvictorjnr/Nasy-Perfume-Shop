"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/features/cart/hooks/use-cart";
import { auth } from "@/lib/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLogout } from "@/features/auth/hooks/useAuth";

export default function Navigation() {
  const pathname = usePathname();
  const { data: cart } = useCart();
  const [user] = useAuthState(auth);
  const logout = useLogout();

  const cartItemCount = cart?.itemCount || 0;

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Nasy Scents
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium ${
                pathname === "/"
                  ? "text-purple-600"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              Home
            </Link>

            {/* Search */}
            <form className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-100 outline-none text-sm w-32"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const query = (e.target as HTMLInputElement).value;
                    window.location.href = `/search?q=${encodeURIComponent(
                      query
                    )}`;
                  }
                }}
              />
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className={`font-medium relative ${
                pathname === "/cart"
                  ? "text-purple-600"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className={`font-medium ${
                pathname === "/wishlist"
                  ? "text-purple-600"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/account/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders/history"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Order History
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg border-t"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
