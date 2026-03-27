"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/sax_logo.png";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State for fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for visibility toggles
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-sax-black overflow-hidden selection:bg-sax-gold selection:text-sax-black font-sans">
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#EAB308 1px, transparent 1px), linear-gradient(to right, #EAB308 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-sax-gold/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-sax-zinc/40 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 w-full max-w-105 p-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Image src={logo} alt="Logo" width={150} height={50} />
          <h1 className="font-display mt-4 text-2xl font-bold text-white tracking-tight text-center">
            Reset Password
          </h1>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-sax-zinc/30 border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-zinc-400 text-center mb-2">
                Create a new, strong password for your admin account.
              </p>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-sax-gold transition-colors" />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 h-12 bg-sax-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sax-gold/50 focus:border-sax-gold/50 transition-all font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-sax-gold transition-colors" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 h-12 bg-sax-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sax-gold/50 focus:border-sax-gold/50 transition-all font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full h-12 bg-sax-gold text-sax-black font-display font-bold rounded-lg overflow-hidden transition-all hover:bg-sax-gold-dim disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 transition-transform group-hover:translate-x-1">
                    <span>Reset Password</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </button>
            </form>
          ) : (
            /* --- SUCCESS STATE --- */
            <div className="text-center py-6 space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg font-display">
                  Password Reset!
                </h3>
                <p className="text-sm text-zinc-400 mt-2">
                  Your password has been successfully updated. You can now login
                  with your new credentials.
                </p>
              </div>

              <Link href="sign-in">
                <button className="w-full h-12 bg-white text-black font-display font-bold rounded-lg hover:bg-zinc-200 transition-colors mt-4">
                  Login Now
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
