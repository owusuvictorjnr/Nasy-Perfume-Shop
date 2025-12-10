/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRegister } from "@/features/auth/hooks/useRegister";
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const { register, googleSignIn } = useRegister();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConform, setShowConform] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If credentials are present in the query string (e.g. ?email=...&password=...),
  // populate the form and immediately remove them from the URL so they do not
  // remain visible in the browser address bar or history.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const password = params.get("password");
    if (email || password) {
      setForm((f) => ({
        ...f,
        ...(email ? { email } : {}),
        ...(password ? { password } : {}),
      }));
      const cleanUrl =
        window.location.origin +
        window.location.pathname +
        window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      // Optionally redirect or show success message
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogle = async () => {
    try {
      await googleSignIn();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border p-2 w-full"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="middleName"
          placeholder="Middle Name (Optional)"
          className="border p-2 w-full"
          value={form.middleName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border p-2 w-full"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password Field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="border p-2 w-full"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <input
            type={showConform ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border p-2 w-full"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShowConform(!showConform)}
          >
            {showConform ? "🙈" : "👁️"}
          </span>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 w-full rounded"
          disabled={loading}
        >
          {loading ? "Registering..." : "Create Account"}
        </button>
        <button
          type="button"
          onClick={handleGoogle}
          className="mt-2 border p-2 w-full rounded flex items-center justify-center"
        >
           <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
}
