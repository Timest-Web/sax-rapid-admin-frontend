"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowRight } from "lucide-react";
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    alert("Login logic goes here");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden selection:bg-sax-gold selection:text-sax-black font-sans">
      {/* ── ANIMATED BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#EAB308 1px, transparent 1px), linear-gradient(to right, #EAB308 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-sax-black/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-sax-black/40 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "7s" }}
        />
      </div>

      {/* ── CONTENT CARD ── */}
      <div className="relative z-10 w-full max-w-105 p-6">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Image src={logo} alt="Sax Logo" className="w-36 h-14" />
        </div>

        {/* Glassmorphism Form Card */}
        <div className="backdrop-blur-xl bg-sax-black border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label
                  htmlFor="password"
                  className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-[10px] text-sax-gold hover:text-sax-gold-dim transition-colors font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-sax-gold transition-colors duration-300" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 h-12 bg-sax-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sax-gold/50 focus:border-sax-gold/50 transition-all font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-12 bg-sax-gold text-sax-black font-display font-bold rounded-lg overflow-hidden transition-all hover:bg-sax-gold-dim disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 transition-transform group-hover:translate-x-1">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
