"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/sax_logo.png";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    alert("Login logic goes here");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-105 w-175 -translate-x-1/2 rounded-full bg-sax-gold/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-75 w-75 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-65 w-65 rounded-full bg-zinc-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_35%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo + heading */}
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
              Secure Admin Portal
            </div> */}

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Sign in to access the admin dashboard.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition-all focus:border-sax-gold focus:ring-4 focus:ring-sax-gold/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-sax-gold hover:text-sax-gold/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-11 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition-all focus:border-sax-gold focus:ring-4 focus:ring-sax-gold/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-zinc-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / helper */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-zinc-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300 text-sax-gold focus:ring-sax-gold/30"
                  />
                  Remember me
                </label>
                <span className="text-xs text-zinc-400">Protected session</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Footer note */}
            <div className="mt-6 border-t border-zinc-100 pt-4 text-center">
              <p className="text-xs text-zinc-400">
                Authorized personnel only. All access is monitored and logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
