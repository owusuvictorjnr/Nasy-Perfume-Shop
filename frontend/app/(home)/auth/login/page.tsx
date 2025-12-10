/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { login, googleLogin, loading, error } = useLogin();

  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") {
      return { email: "", password: "" };
    }
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") ?? "";
    const password = params.get("password") ?? "";
    return { email, password };
  });

  const [showPassword, setShowPassword] = useState(false);

  // remove them from the URL so they do not remain visible in the browser address bar or history.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const password = params.get("password");
    if (email || password) {
      // Remove query params without reloading the page
      const cleanUrl =
        window.location.origin +
        window.location.pathname +
        window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    login(form.email, form.password);
  };
  const handleGoogle = async () => {
    await googleLogin();
  };
  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-600"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className="mt-2 border p-2 w-full rounded flex items-center justify-center"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <p className="mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
}
