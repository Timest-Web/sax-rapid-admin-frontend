"use client";

import { useState } from "react";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/images/sax_logo.png";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ForgotPasswordView() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/Auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.message ?? "Failed to send OTP. Please try again.");
        return;
      }

      setMessage(data.message ?? "OTP sent. Check your email.");

      // Send them to reset page (pre-fill email)
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-sax-gold selection:text-sax-black font-sans">
      <div className="relative z-10 w-full max-w-105 p-6">
        <div className="flex flex-col items-center mb-8">
          <Image src={logo} alt="Logo" width={150} height={50} />
          <h1 className="font-display mt-4 text-3xl font-bold text-white tracking-tight text-center">
            Request OTP
          </h1>
          <p className="mt-2 text-sm text-zinc-400 text-center">
            Enter your admin email to receive a reset OTP.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-sax-zinc/30 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono ml-1">
                Email Address
              </label>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-500" />
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

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            {message && (
              <div className="text-sm text-green-300 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                {message}
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
                  <span>Sending OTP...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Send OTP</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </button>

            <div className="pt-2">
              <Link href="/sign-in" className="text-sm text-zinc-300 hover:text-white">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}