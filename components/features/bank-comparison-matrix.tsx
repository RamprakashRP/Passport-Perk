"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  MapPin,
  Filter,
  Gift,
  Award,
  ArrowRight,
} from "lucide-react";
import { BankComparisonOption } from "@/types";
import { CANADIAN_BANK_OPTIONS } from "@/lib/data/default-tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleOutboundClick } from "@/lib/telemetry";
import { cn } from "@/lib/utils";

interface BankComparisonMatrixProps {
  onSelectBank?: (bank: BankComparisonOption) => void;
  className?: string;
}

const BANK_BRAND_THEMES: Record<
  string,
  { logoText: string; bgGradient: string; textGradient: string; accentColor: string; pillBg: string; borderAccent: string }
> = {
  scotiabank: {
    logoText: "BNS",
    bgGradient: "from-red-500/20 via-red-950/30 to-[#0d1322]",
    textGradient: "from-red-400 to-rose-200",
    accentColor: "text-red-400",
    pillBg: "bg-red-500/15 border-red-500/30 text-red-300",
    borderAccent: "group-hover:border-red-500/50",
  },
  cibc: {
    logoText: "CIBC",
    bgGradient: "from-rose-600/20 via-red-950/30 to-[#0d1322]",
    textGradient: "from-rose-400 to-amber-200",
    accentColor: "text-rose-400",
    pillBg: "bg-rose-500/15 border-rose-500/30 text-rose-300",
    borderAccent: "group-hover:border-rose-500/50",
  },
  td: {
    logoText: "TD",
    bgGradient: "from-emerald-500/20 via-green-950/30 to-[#0d1322]",
    textGradient: "from-emerald-400 to-teal-200",
    accentColor: "text-emerald-400",
    pillBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    borderAccent: "group-hover:border-emerald-500/50",
  },
  rbc: {
    logoText: "RBC",
    bgGradient: "from-blue-500/20 via-indigo-950/30 to-[#0d1322]",
    textGradient: "from-blue-400 to-sky-200",
    accentColor: "text-blue-400",
    pillBg: "bg-blue-500/15 border-blue-500/30 text-blue-300",
    borderAccent: "group-hover:border-blue-500/50",
  },
  simplii: {
    logoText: "SIMPLII",
    bgGradient: "from-fuchsia-500/20 via-pink-950/30 to-[#0d1322]",
    textGradient: "from-fuchsia-400 to-pink-200",
    accentColor: "text-fuchsia-400",
    pillBg: "bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300",
    borderAccent: "group-hover:border-fuchsia-500/50",
  },
};

export function BankComparisonMatrix({
  onSelectBank,
  className,
}: BankComparisonMatrixProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filterOptions = [
    { id: "all", label: "All 5 Banks" },
    { id: "bonus", label: "Top Cash Bonuses" },
    { id: "rewards", label: "AirPods & Scene+ Rewards" },
    { id: "proximity", label: "Near Campus Gates" },
    { id: "digital", label: "100% No-Fee Digital" },
  ];

  const filteredBanks = CANADIAN_BANK_OPTIONS.filter((bank) => {
    if (activeFilter === "bonus") {
      return (
        bank.welcomeBonus.includes("$150") ||
        bank.welcomeBonus.includes("$350") ||
        bank.welcomeBonus.includes("$400") ||
        bank.welcomeBonus.includes("AirPods")
      );
    }
    if (activeFilter === "rewards") {
      return (
        bank.studentRewards?.includes("Scene+") ||
        bank.studentRewards?.includes("SPC+") ||
        bank.studentRewards?.includes("Avion") ||
        bank.studentRewards?.includes("TD Rewards")
      );
    }
    if (activeFilter === "proximity") return bank.id === "scotiabank" || bank.id === "td";
    if (activeFilter === "digital") return bank.isDigitalOnly;
    return true;
  });

  const handleBankCta = (bank: BankComparisonOption) => {
    handleOutboundClick(
      bank.partnerId,
      "banking",
      bank.ctaLink,
      {
        position_on_page: "bank_comparison_matrix",
        bank_name: bank.bankName,
        account_package: bank.accountPackage,
        welcome_bonus: bank.welcomeBonus,
        user_intake_stage: "t_minus_45",
      }
    );

    if (onSelectBank) {
      onSelectBank(bank);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-4 sm:gap-5", className)}>
      {/* Matrix Header & Aggregator Neutrality */}
      <div className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                Student Banking Hub
              </span>
              <Badge variant="emerald" className="text-[10px] font-bold py-0.2">
                2026 Verified Promos
              </Badge>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold tracking-tight text-white mt-0.5">
              Compare 5 Major Canadian Student Packages
            </h4>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none self-start sm:self-auto">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                activeFilter === f.id
                  ? "bg-emerald-500 text-zinc-950 border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* UNiDAYS-Style Atomic Deal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <AnimatePresence mode="popLayout">
          {filteredBanks.map((bank) => {
            const theme = BANK_BRAND_THEMES[bank.id] || BANK_BRAND_THEMES.scotiabank;

            return (
              <motion.div
                key={bank.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative bg-[#0d1322]/90 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all group overflow-hidden shadow-lg",
                  theme.borderAccent,
                  "hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                )}
              >
                {/* Subtle Ambient Radial Glow */}
                <div
                  className={cn(
                    "absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-gradient-to-br blur-3xl pointer-events-none opacity-40 transition-opacity group-hover:opacity-70",
                    theme.bgGradient
                  )}
                />

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Top Bar: Brand Logo Tile + Tag Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* Brand Logo Placeholder Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center font-black font-mono tracking-tighter text-sm text-white shadow-inner group-hover:scale-105 transition-transform">
                        <span className={theme.accentColor}>{theme.logoText}</span>
                      </div>

                      <div>
                        <h5 className="text-sm font-bold text-white tracking-tight leading-tight">
                          {bank.bankName}
                        </h5>
                        <p className="text-[11px] font-medium text-zinc-400 mt-0.5">
                          {bank.accountPackage}
                        </p>
                      </div>
                    </div>

                    {bank.isRecommendedFor && (
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap shadow-2xs",
                          theme.pillBg
                        )}
                      >
                        {bank.isRecommendedFor}
                      </span>
                    )}
                  </div>

                  {/* Hero Reward Headline (UNiDAYS Big Bold Style) */}
                  <div className="py-1">
                    <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-zinc-400 block mb-0.5">
                      Student Welcome Offer
                    </span>
                    <div
                      className={cn(
                        "text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent leading-tight",
                        theme.textGradient
                      )}
                    >
                      {bank.welcomeBonus}
                    </div>
                    {bank.studentRewards && (
                      <p className="text-xs font-semibold text-zinc-300 mt-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{bank.studentRewards}</span>
                      </p>
                    )}
                  </div>

                  {/* Quick Feature Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                      <span>$0 Monthly Fees</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                      <span>Free e-Transfers</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      <span>{bank.waterlooProximity.split(",")[0]}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Unlock Button */}
                <div className="relative z-10 pt-3 border-t border-white/[0.08]">
                  <a
                    href={bank.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleBankCta(bank)}
                    className="block w-full"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-between items-center py-2.5 px-4 rounded-2xl font-bold text-xs shadow-md group-hover:scale-[1.02] transition-transform"
                    >
                      <span>{bank.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
