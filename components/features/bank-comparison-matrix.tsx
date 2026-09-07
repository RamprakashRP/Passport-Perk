"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  DollarSign,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Award,
  Clock,
  Filter,
} from "lucide-react";
import { BankComparisonOption } from "@/types";
import { CANADIAN_BANK_OPTIONS } from "@/lib/data/default-tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IrccGicTooltip } from "@/components/ui/ircc-gic-tooltip";
import { handleOutboundClick } from "@/lib/telemetry";
import { cn } from "@/lib/utils";

interface BankComparisonMatrixProps {
  onSelectBank?: (bank: BankComparisonOption) => void;
  className?: string;
}

export function BankComparisonMatrix({
  onSelectBank,
  className,
}: BankComparisonMatrixProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filterOptions = [
    { id: "all", label: "All 5 Major Banks" },
    { id: "bonus", label: "Highest Welcome Bonus" },
    { id: "proximity", label: "Closest to Campus Gates" },
    { id: "fees", label: "Lowest GIC Processing Fee" },
    { id: "digital", label: "100% Digital / No-Fee" },
  ];

  const filteredBanks = CANADIAN_BANK_OPTIONS.filter((bank) => {
    if (activeFilter === "bonus") return bank.welcomeBonus.includes("$150") || bank.welcomeBonus.includes("$400");
    if (activeFilter === "proximity") return bank.id === "scotiabank" || bank.id === "td";
    if (activeFilter === "fees") return bank.gicProcessingFee.includes("$0");
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
      {/* Matrix Header & Neutrality Guarantee */}
      <div className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-start gap-3 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                Objective Aggregator Neutrality
              </span>
              <Badge variant="zinc" className="text-[10px] font-mono font-semibold">
                5 Major Institutions
              </Badge>
              <IrccGicTooltip variant="pill" />
            </div>
            <h4 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white mt-0.5">
              Canadian Student Banking & $23,448 vs $20,635 GIC Comparison Engine
            </h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Objective side-by-side analysis of student chequing accounts, IRCC compliant GIC processing fees, welcome cash bonuses, and walking distance to campus gates.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs mr-1 font-semibold">
          <Filter className="w-3.5 h-3.5" />
          <span>Sort By:</span>
        </div>
        {filterOptions.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              "whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer",
              activeFilter === f.id
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-2xs"
                : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white hover:bg-white/[0.04]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredBanks.map((bank) => (
            <motion.div
              key={bank.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all group"
            >
              <div className="space-y-3">
                {/* Header: Bank Name + Recommended Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                      {bank.bankName}
                    </h5>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      {bank.accountPackage}
                    </p>
                  </div>
                </div>

                {bank.isRecommendedFor && (
                  <Badge variant="emerald" className="text-[11px] font-bold py-0.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{bank.isRecommendedFor}</span>
                  </Badge>
                )}

                {/* Key Metrics Comparison Table */}
                <div className="space-y-2 pt-2 border-t border-white/[0.08] text-xs">
                  {/* Bonus */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-zinc-400 font-medium">Welcome Bonus</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {bank.welcomeBonus}
                    </span>
                  </div>

                  {/* GIC Processing Fee */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-zinc-400 font-medium">GIC Processing Fee</span>
                    <span className="text-zinc-200 font-mono font-semibold">
                      {bank.gicProcessingFee}
                    </span>
                  </div>

                  {/* Monthly Fee */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-zinc-400 font-medium">Monthly Fee</span>
                    <span className="text-zinc-200 font-mono font-semibold">
                      {bank.monthlyFee}
                    </span>
                  </div>

                  {/* Campus Proximity */}
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-blue-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
                      <span>{bank.waterlooProximity}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 pl-5">
                      {bank.waterlooAddress}
                    </span>
                  </div>
                </div>

                {/* Key Perks List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider font-bold">
                    Student Features
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {bank.keyPerks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/[0.08]">
                <a
                  href={bank.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleBankCta(bank)}
                  className="block w-full"
                >
                  <Button
                    variant="affiliate"
                    size="sm"
                    className="w-full justify-between gap-2 shadow-2xs"
                  >
                    <span>{bank.ctaLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
