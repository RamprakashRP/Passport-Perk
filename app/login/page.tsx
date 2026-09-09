"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock,
  Smartphone,
  Gift,
  Check,
} from "lucide-react";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  signInWithGoogle,
  signInWithMagicLink,
  getCurrentUser,
  signOutUser,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { trackEvent } from "@/lib/telemetry";
import { Users } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (e) {
        // Fallback
      } finally {
        setIsCheckingSession(false);
      }
    })();
  }, []);

  const handleSwitchAccount = async () => {
    setIsGoogleLoading(true);
    await signOutUser();
    setCurrentUser(null);
    setIsGoogleLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage(null);
      trackEvent("page_view", { action: "attempt_google_oauth" });

      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMessage(error.message || "Failed to initiate Google sign in.");
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsGoogleLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setIsMagicLinkLoading(true);
      setErrorMessage(null);
      trackEvent("page_view", { action: "attempt_magic_link", email_domain: email.split("@")[1] });

      const { error } = await signInWithMagicLink(email.trim());
      setIsMagicLinkLoading(false);

      if (error) {
        setErrorMessage(error.message || "Failed to send magic link. Please check your email.");
      } else {
        setMagicLinkSent(true);
      }
    } catch (err: any) {
      setIsMagicLinkLoading(false);
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-hidden">
      {/* Background Aurora Mesh Gradients */}
      <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full bg-[#080c14]/85 backdrop-blur-2xl border-b border-white/[0.08] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative z-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center text-zinc-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white flex items-center leading-none">
              Passport<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-black">Perk</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mt-0.5">
              Settlement & Perks Hub
            </span>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.06] transition-colors flex items-center gap-1.5"
        >
          <span>Continue as Guest</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16 relative z-10">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Card Wrapper */}
          <div className="bg-[#0d1322]/85 backdrop-blur-2xl border border-white/[0.1] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden p-6 sm:p-8">
            <div className="text-center space-y-2 mb-6">
              <Badge variant="emerald" className="inline-flex gap-1.5 font-mono text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Cloud Sync</span>
              </Badge>
              <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Welcome to PassportPerk
              </h2>
              <p className="text-xs text-zinc-400">
                Sign in to seamlessly sync your settlement checklist, POE documents, and perks across all your devices.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">{errorMessage}</p>
              </div>
            )}

            {/* When already authenticated: show active session profile card */}
            {currentUser && !isCheckingSession ? (
              <div className="space-y-5 text-center">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center gap-3.5 shadow-inner">
                  {currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture ? (
                    <img
                      src={currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-emerald-500/40 shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-zinc-950 font-black text-base flex items-center justify-center uppercase shadow-md flex-shrink-0">
                      {(currentUser.user_metadata?.full_name?.[0] || currentUser.email?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-sm font-bold text-white truncate">
                      {currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0]}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono truncate">{currentUser.email}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold mt-0.5">Cloud Sync Active</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => router.push("/dashboard")}
                    className="w-full justify-center gap-2"
                  >
                    <span>Continue to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <button
                    type="button"
                    onClick={handleSwitchAccount}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Sign In with a Different Account</span>
                  </button>
                </div>
              </div>
            ) : magicLinkSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-white">Magic Link Sent!</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  We sent a temporary sign-in link to <strong className="text-white">{email}</strong>. Click the link in your email to instantly access your roadmap.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMagicLinkSent(false)}
                  className="mt-2 text-xs border-emerald-500/30 text-emerald-300"
                >
                  Use a different email
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] text-xs sm:text-sm font-bold text-white shadow-2xs transition-all hover:border-white/[0.25] disabled:opacity-50 cursor-pointer"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-white/[0.08]"></div>
                  <span className="px-3 text-[11px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
                    or passwordless email
                  </span>
                  <div className="flex-1 border-t border-white/[0.08]"></div>
                </div>

                {/* Passwordless Magic Link Form */}
                <form onSubmit={handleMagicLinkSignIn} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@university.ca or gmail.com"
                        required
                        className="w-full bg-[#080c14] border border-white/[0.15] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 font-medium"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isMagicLinkLoading}
                    className="w-full justify-center gap-2"
                  >
                    {isMagicLinkLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Magic Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Magic Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Feature Perks of Signing In */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-2">
              <span className="text-[11px] font-mono uppercase font-bold text-zinc-400 block tracking-wider">
                Why create an account?
              </span>
              <ul className="text-xs text-zinc-400 space-y-1.5">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Access your checklist across phone, laptop, and airport tablets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Save your Port of Entry (POE) document verification slips</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Unlock exclusive 5-bank comparison codes and student eSIM perks</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Guest fallback & Privacy reassurance */}
          <div className="text-center space-y-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <span>Prefer not to sign in right now? Continue as Guest</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <p className="text-[11px] text-zinc-500">
              🔒 Privacy Guaranteed • We never sell data or send spam.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
