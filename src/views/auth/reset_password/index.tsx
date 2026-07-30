"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LockKeyhole,
  CheckCircle2,
  Mail,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import logo from "@/public/images/sax_logo.png";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordView() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) return setError("Email is required.");
    if (!otp) return setError("OTP is required.");
    if (newPassword.length < 8)
      return setError("Password must be at least 8 characters.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/Auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(
          data?.message ?? "Reset failed. Please check your OTP and try again."
        );
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-sax-gold selection:text-sax-black font-sans">
      <div className="relative z-10 w-full max-w-105 p-6">
        {/* Header (match sign-in) */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Image src={logo} alt="Logo" width={150} height={50} />
          <h1 className="font-display mt-4 text-3xl font-bold text-white tracking-tight text-center">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-zinc-400 text-center">
            Enter the OTP sent to your email and choose a new password.
          </p>
        </div>

        {/* Card (match sign-in) */}
        <div className="backdrop-blur-xl bg-sax-zinc/30 border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">
          {isSuccess ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              </div>

              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Password updated
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Your password has been reset successfully. You can now sign
                  in.
                </p>
              </div>

              <Link
                href="/sign-in"
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-sax-gold text-sax-black font-display font-bold transition-all hover:bg-sax-gold-dim"
              >
                Go to admin login
              </Link>

              <div className="pt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  Need a new OTP?
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono ml-1"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-500 group-focus-within:text-sax-gold transition-colors duration-300" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@platform.com"
                    required
                    className="w-full pl-10 pr-4 h-12 bg-sax-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sax-gold/50 focus:border-sax-gold/50 transition-all font-sans text-sm"
                  />
                </div>
              </div>

              {/* OTP */}
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono ml-1"
                >
                  OTP Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-zinc-500 group-focus-within:text-sax-gold transition-colors duration-300" />
                  </div>
                  <input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    required
                    className="w-full pl-10 pr-4 h-12 bg-sax-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sax-gold/50 focus:border-sax-gold/50 transition-all font-sans text-sm"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono ml-1"
                >
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKeyhole className="h-4 w-4 text-zinc-500 group-focus-within:text-sax-gold transition-colors duration-300" />
                  </div>

                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 h-12 bg-sax-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sax-gold/50 focus:border-sax-gold/50 transition-all font-sans text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono ml-1"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-sax-gold transition-colors duration-300" />
                  </div>

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 h-12 bg-sax-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sax-gold/50 focus:border-sax-gold/50 transition-all font-sans text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
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
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full h-12 bg-sax-gold text-sax-black font-display font-bold rounded-lg overflow-hidden transition-all hover:bg-sax-gold-dim disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 transition-transform group-hover:translate-x-1">
                    <span>Reset Password</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </button>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <Link
                  href="/sign-in"
                  className="text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  Back to login
                </Link>

                <Link
                  href={`/forgot-password${
                    email ? `?email=${encodeURIComponent(email)}` : ""
                  }`}
                  className="text-xs text-sax-gold hover:text-sax-gold-dim transition-colors"
                >
                  Resend OTP
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}