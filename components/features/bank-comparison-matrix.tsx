"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  MapPin,
  Gift,
  Award,
  ArrowRight,
  CircleDollarSign,
  Tag,
} from "lucide-react";
import { BrandLogo, BrandKey } from "@/components/ui/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleOutboundClick } from "@/lib/telemetry";
import { cn } from "@/lib/utils";

export interface AtomicBankDeal {
  id: string;
  partnerId: string;
  brandKey: BrandKey;
  bankName: string;
  heroPerk: string;
  perkDetail: string;
  description: string;
  tag: string;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
  categoryType: "cash" | "rewards" | "digital" | "credit";
}

export const ATOMIC_BANK_DEALS: AtomicBankDeal[] = [
  {
    id: "scotia-package",
    partnerId: "scotiabank_startright",
    brandKey: "scotiabank",
    bankName: "Scotiabank",
    heroPerk: "$200 CASH",
    perkDetail: "Preferred Package for Students & Youth",
    description: "Open the Preferred Package for Students & Youth with $0 monthly fee and complete qualifying transactions to get $200 cash deposited directly. Offer ends November 1, 2026.",
    tag: "Ends Nov 1, 2026",
    features: [
      "$200 Cash Welcome Bonus (Ends Nov 1, 2026)",
      "Scene+ Points on debit (free Cineplex movies & food)",
      "$0 Monthly Account Fee + branches adjacent to campus gates",
    ],
    ctaLabel: "Claim $200 with Scotiabank",
    ctaLink: "https://www.scotiabank.com/ca/en/personal/bank-accounts/students/student-banking-advantage-plan.html?ref=passportperk",
    categoryType: "cash",
  },
  {
    id: "rbc-package",
    partnerId: "rbc_student_advantage",
    brandKey: "rbc",
    bankName: "RBC Royal Bank",
    heroPerk: "FREE AIRPODS 4",
    perkDetail: "RBC Student Advantage Banking (or $100 Cash)",
    description: "Open an RBC Student Advantage Banking account by November 2, 2026, and receive a brand new pair of Apple AirPods 4 (or choose $100 cash alternative) upon qualifying setup.",
    tag: "Ends Nov 2, 2026",
    features: [
      "Free Apple AirPods 4 promo (Ends Nov 2, 2026)",
      "Or choose $100 direct cash deposit alternative",
      "Avion Points rewards on debit + Canada's largest branch network",
    ],
    ctaLabel: "Claim Free AirPods 4 with RBC",
    ctaLink: "https://www.rbcroyalbank.com/accounts/student-banking.html?ref=passportperk",
    categoryType: "rewards",
  },
  {
    id: "cibc-package",
    partnerId: "cibc_student_banking",
    brandKey: "cibc",
    bankName: "CIBC",
    heroPerk: "$175 CASH + SPC+",
    perkDetail: "CIBC Smart Start / Smart for Students",
    description: "Earn a $175 cash reward on your student chequing account, plus a free annual SPC+ discount membership to save 10%–25% at 450+ Canadian brands, with $0 remittance fees.",
    tag: "Top Cash + Perks",
    features: [
      "$175 Cash Reward for opening student account",
      "Free annual SPC+ pass (save 10-25% at 450+ major brands)",
      "$0 Monthly fees + free international money transfers to send home",
    ],
    ctaLabel: "Claim $175 + Free SPC+ with CIBC",
    ctaLink: "https://www.cibc.com/en/student/bank-accounts.html?ref=passportperk",
    categoryType: "cash",
  },
  {
    id: "td-package",
    partnerId: "td_student_gic",
    brandKey: "td",
    bankName: "TD Canada Trust",
    heroPerk: "$150 CASH",
    perkDetail: "TD Student Chequing & Guaranteed Card",
    description: "Earn up to $150 cash on new student chequing, get guaranteed approval for a $1,000 student credit card ($0 Canadian credit history needed), and enjoy 7-day extended branch hours.",
    tag: "Ends Nov 2, 2026",
    features: [
      "Up to $150 Cash Offer (Valid until Nov 2, 2026)",
      "Guaranteed $1,000 student credit card (build credit score)",
      "Open 7 days a week (late evenings & Sundays near campus)",
    ],
    ctaLabel: "Claim $150 with TD Bank",
    ctaLink: "https://www.td.com/ca/en/personal-banking/products/bank-accounts/chequing-accounts/student-chequing-account?ref=passportperk",
    categoryType: "cash",
  },
  {
    id: "simplii-package",
    partnerId: "simplii_financial",
    brandKey: "simplii",
    bankName: "Simplii Financial",
    heroPerk: "$400 BONUS",
    perkDetail: "High-Yield Digital Chequing ($0 Fees Forever)",
    description: "100% digital bank with $0 monthly fees forever (even post-graduation). Earn up to $400 cash bonus when setting up qualifying payroll or student deposits with free CIBC ATM access.",
    tag: "$0 Fees Forever",
    features: [
      "Up to $400 cash bonus on direct deposit",
      "$0 fees forever (no student status re-verification)",
      "Free cash withdrawals at all 4,000+ CIBC ATMs across ON & BC",
    ],
    ctaLabel: "Claim $400 with Simplii",
    ctaLink: "https://www.simplii.com/en/special-offers/student-banking.html?ref=passportperk",
    categoryType: "digital",
  },
];

interface BankComparisonMatrixProps {
  className?: string;
  onSelectDeal?: (deal: AtomicBankDeal) => void;
}

export function BankComparisonMatrix({
  className,
  onSelectDeal,
}: BankComparisonMatrixProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filterOptions = [
    { id: "all", label: `All 5 Banks (${ATOMIC_BANK_DEALS.length})` },
    { id: "cash", label: "Cash Bonuses ($150 - $400)" },
    { id: "rewards", label: "AirPods 4 & Scene+ Perks" },
    { id: "digital", label: "100% No-Fee Digital" },
  ];

  const filteredDeals = ATOMIC_BANK_DEALS.filter((deal) => {
    if (activeFilter === "all") return true;
    return deal.categoryType === activeFilter;
  });

  const handleDealCta = (deal: AtomicBankDeal) => {
    handleOutboundClick(
      deal.partnerId,
      "banking",
      deal.ctaLink,
      {
        position_on_page: "bank_deal_card",
        bank_name: deal.bankName,
        hero_perk: deal.heroPerk,
        deal_id: deal.id,
      }
    );

    if (onSelectDeal) {
      onSelectDeal(deal);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-4 sm:gap-5", className)}>
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              "whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
              activeFilter === f.id
                ? "bg-emerald-500 text-zinc-950 border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Atomic UNiDAYS-Style Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <AnimatePresence mode="popLayout">
          {filteredDeals.map((deal) => {
            return (
              <motion.div
                key={deal.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="relative bg-[#0d1322]/90 backdrop-blur-2xl border border-white/[0.1] hover:border-emerald-500/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all group overflow-hidden shadow-lg hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              >
                {/* Subtle Ambient Radial Glow */}
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" />

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Top Bar: Company Logo + Bank Name + Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* Authentic Brand Vector Logo */}
                      <BrandLogo brand={deal.brandKey} size="md" />

                      <div>
                        <h5 className="text-sm font-bold text-white tracking-tight leading-tight">
                          {deal.bankName}
                        </h5>
                        <p className="text-[11px] font-medium text-emerald-400 font-mono">
                          Verified 2026 Offer
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/10 bg-white/[0.04] text-zinc-300 whitespace-nowrap">
                      {deal.tag}
                    </span>
                  </div>

                  {/* Zoomed-in Hero Reward Highlight */}
                  <div className="py-1">
                    <div className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent leading-none">
                      {deal.heroPerk}
                    </div>
                    <p className="text-xs font-bold text-zinc-200 mt-1.5">
                      {deal.perkDetail}
                    </p>
                  </div>

                  {/* Simple 1-Sentence Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {deal.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    {deal.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-medium text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 stroke-[2.5]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Unlock Button */}
                <div className="relative z-10 pt-3 border-t border-white/[0.08]">
                  <a
                    href={deal.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDealCta(deal)}
                    className="block w-full"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-between items-center py-2.5 px-4 rounded-2xl font-bold text-xs shadow-md group-hover:scale-[1.02] transition-transform"
                    >
                      <span>{deal.ctaLabel}</span>
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
