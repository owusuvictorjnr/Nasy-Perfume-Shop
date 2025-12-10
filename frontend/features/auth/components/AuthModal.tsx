"use client";

import Link from "next/link";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: AuthModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>

        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Welcome to Nancy's Shop
        </h3>
        <p className="text-gray-600 mb-6">
          Sign in to manage your orders, wishlist, and checkout faster.
        </p>

        <div className="space-y-3">
          <Link
            href="/home/auth/login"
            className="block w-full text-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            onClick={onClose}
          >
            Sign in
          </Link>
          <Link
            href="/home/auth/register"
            className="block w-full text-center px-4 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition"
            onClick={onClose}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
