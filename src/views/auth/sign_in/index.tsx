/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/sax_logo.png";
import { signIn, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginView({
  callbackUrl = "/admin",
}: {
  callbackUrl?: string;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res?.ok) {
        setError("Invalid email or password.");
        return;
      }

      const session = await getSession();
      const role = (session as any)?.role;

      if (role !== "Admin") {
        await signOut({ redirect: false });
        setError("You are not authorized to access the admin portal.");
        router.replace("/not-authorized");
        return;
      }

      router.replace(callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-sax-gold selection:text-sax-black font-sans">
      {/* ...the rest of your JSX stays the same... */}
      <div className="relative z-10 w-full max-w-105 p-6">
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Image src={logo} alt="Logo" width={150} height={50} />
          <h1 className="font-display mt-4 text-3xl font-bold text-white tracking-tight text-center">
            Admin Portal
          </h1>
        </div>

        <div className="backdrop-blur-xl bg-sax-zinc/30 border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">
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

            {/* Password */}
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