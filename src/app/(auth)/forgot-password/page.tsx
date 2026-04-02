"use client";

import { useState } from "react";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/sax_logo.png";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to send email
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-sax-gold selection:text-sax-black font-sans">
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#EAB308 1px, transparent 1px), linear-gradient(to right, #EAB308 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-sax-gold/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-sax-zinc/40 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "7s" }}
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 w-full max-w-105 p-6">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Image src={logo} alt="Logo" width={150} height={50} />
          <h1 className="font-display mt-4 text-2xl font-bold text-white tracking-tight text-center">
            Recover Your Account
          </h1>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-sax-zinc/30 border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">
          {!isSubmitted ? (
            /* --- FORM STATE --- */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center mb-2">
                <p className="text-sm text-zinc-400">
                  Enter your admin email address and we&apos;ll send you a link to
                  reset your password.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-500 group-focus-within:text-sax-gold transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@platform.com"
                    required
                    className="w-full pl-10 pr-4 h-12 bg-sax-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sax-gold/50 focus:border-sax-gold/50 transition-all font-sans text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full h-12 bg-sax-gold text-sax-black font-display font-bold rounded-lg overflow-hidden transition-all hover:bg-sax-gold-dim disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          ) : (
            /* --- SUCCESS STATE --- */
            <div className="text-center py-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg font-display">
                  Check your email
                </h3>
                <p className="text-sm text-zinc-400 mt-2">
                  We have sent a password reset link to{" "}
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>
            </div>
          )}

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-white transition-colors gap-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
