"use client";

import React from "react";
import Link from "next/link";
import { Gift, PlusCircle, Sparkles, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitPerkCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#09101c] to-[#070b14] border border-emerald-500/20 p-6 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)] flex-shrink-0">
            <Gift className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Community Driven
              </span>
              <span className="text-xs text-zinc-400">Earn Contributor Credit</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Know a Student Deal or Perk We Missed?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              Found a secret telecom deal, transit pass discount, grocery promo, or banking bonus? Share it with thousands of incoming students. Our moderation team reviews and tests every code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/contribute?type=perk">
            <Button
              variant="primary"
              size="md"
              className="gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit a Perk / Deal</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
