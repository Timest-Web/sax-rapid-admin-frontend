"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import logo from "@/public/images/sax_logo.png";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    // Replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-105 w-175 -translate-x-1/2 rounded-full bg-sax-gold/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-75 w-75 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-65 w-65 rounded-full bg-zinc-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg shadow-black/5 backdrop-blur-xl">
                <Image
                  src={logo}
                  alt="Sax Logo"
                  className="h-10 w-auto"
                  priority
                />
              </div>
            </div>

            {/* <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Password Reset
            </div> */}

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Enter and confirm your new password below.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-7">
            {isSuccess ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Password updated
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    Your password has been reset successfully. You can now sign
                    in with your new password.
                  </p>
                </div>

                <Link
                  href="/sign-in"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800"
                >
                  Go to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-700"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      autoComplete="new-password"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-11 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition-all focus:border-sax-gold focus:ring-4 focus:ring-sax-gold/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-zinc-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-zinc-700"
                  >
                    Confirm new password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      autoComplete="new-password"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-11 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition-all focus:border-sax-gold focus:ring-4 focus:ring-sax-gold/15"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-zinc-600"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating password...
                    </span>
                  ) : (
                    "Reset password"
                  )}
                </button>

                {!token && (
                  <p className="text-sm text-amber-600">
                    No reset token found in the URL.
                  </p>
                )}

                <div className="border-t border-zinc-100 pt-4">
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                  >
                    Back to sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}