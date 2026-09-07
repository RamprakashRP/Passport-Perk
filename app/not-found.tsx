"use client";

import React from "react";
import Link from "next/link";
import { Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Aurora glow accents */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md w-full bg-[#0d1322]/85 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-5 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
          <Compass className="w-7 h-7 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            The settlement route or perk you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <Link href="/dashboard" className="w-full">
            <Button variant="primary" size="md" className="w-full gap-2 shadow-xs">
              <span>Go to Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="secondary" size="md" className="w-full">
              Landing Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
