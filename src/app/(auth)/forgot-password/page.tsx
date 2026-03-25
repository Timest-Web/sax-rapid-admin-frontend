"use client";

import { useState } from "react";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/sax_logo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
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
              Password Recovery
            </div> */}

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900">
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Enter your email and we’ll send you a password reset link.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-7">
            {isSubmitted ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Check your email
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    If an account exists for{" "}
                    <span className="font-medium text-zinc-700">{email}</span>,
                    a reset link has been sent.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sign-in"
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800"
                  >
                    Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        autoComplete="email"
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition-all focus:border-sax-gold focus:ring-4 focus:ring-sax-gold/15"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending reset link...
                      </span>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>

                <div className="mt-6 border-t border-zinc-100 pt-4">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
