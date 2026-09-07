"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  GraduationCap,
  FileCheck2,
  Calendar,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  DollarSign,
  PieChart,
  ChevronDown,
  ChevronUp,
  CloudSun,
  ShieldCheck,
  CreditCard,
  Luggage,
} from "lucide-react";
import { UserIntake, ChecklistStats } from "@/types";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { IrccGicTooltip } from "@/components/ui/ircc-gic-tooltip";
import { formatDaysRemaining, cn } from "@/lib/utils";

interface DashboardHeaderProps {
  intake: UserIntake | null;
  stats: ChecklistStats;
  onResetTasks: () => void;
  onExportSummary: () => void;
}

export function DashboardHeader({
  intake,
  stats,
  onResetTasks,
  onExportSummary,
}: DashboardHeaderProps) {
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(true);
  const [selectedGicTier, setSelectedGicTier] = useState<"20635" | "23448">(() => {
    if (intake?.gicAmountTier === "23448" || intake?.hasGIC === "yes_23448") {
      return "23448";
    }
    return "20635";
  });

  const arrivalInfo = formatDaysRemaining(intake?.arrival_date || "");

  const getCityWeather = (city?: string) => {
    if (city?.includes("Vancouver")) {
      return { temp: "19°C / 66°F", condition: "Mild & Coastal", tip: "Bring a light waterproof shell jacket" };
    }
    if (city?.includes("Toronto")) {
      return { temp: "21°C / 70°F", condition: "Pleasant & Sunny", tip: "Comfortable walking shoes for TTC transit" };
    }
    return { temp: "18°C / 64°F", condition: "Crisp Early Fall", tip: "Light layer & umbrella for UW campus walks" };
  };

  const weather = getCityWeather(intake?.targetCity);

  // Budget calculations based on selected GIC tier
  const budgetData =
    selectedGicTier === "20635"
      ? {
          total: "$20,635 CAD",
          monthlyBudget: "~$1,720 CAD",
          initialRelease: "~$4,000 CAD",
          monthlyPayout: "~$1,386 CAD",
          rent: "~$950",
          groceries: "~$350",
          transit: "~$90",
          phone: "~$45",
          buffer: "~$285",
          badgeText: "Previous IRCC Rate • 100% Approved for Visa Applicants",
        }
      : {
          total: "$23,448 CAD",
          monthlyBudget: "~$1,954 CAD",
          initialRelease: "~$4,688 CAD",
          monthlyPayout: "~$1,563 CAD",
          rent: "~$1,050",
          groceries: "~$380",
          transit: "~$90",
          phone: "~$45",
          buffer: "~$389",
          badgeText: "Current IRCC Guideline • Updated Cost of Living",
        };

  return (
    <div className="w-full bg-[#0d1322]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Background soft ambient tint */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
        {/* Top bar: Brand + User Intake Badge + Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-white/[0.08] pb-5 sm:pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-wide text-emerald-400 uppercase">
                Newcomer Settlement Roadmap • Canada
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Your Personalized Settlement Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Clear, step-by-step guidance for arriving at{" "}
              <span className="text-white font-bold">{intake?.targetCity || "Waterloo Region"}</span>
              {intake?.institution ? ` (${intake.institution})` : ""}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            <Link href="/">
              <Button variant="secondary" size="sm" className="gap-1.5 shadow-2xs">
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Edit Intake</span>
              </Button>
            </Link>

            <Button variant="primary" size="sm" onClick={onExportSummary} className="gap-1.5 shadow-xs">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Export Guide</span>
            </Button>
          </div>
        </div>

        {/* Middle row: User Profile Chips */}
        {intake && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-colors">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-mono font-bold">Destination</p>
                <p className="text-xs font-bold text-white truncate">{intake.targetCity}</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-colors">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-mono font-bold">Institution</p>
                <p className="text-xs font-bold text-white truncate">{intake.institution}</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-colors">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-mono font-bold">Target Intake</p>
                <p className="text-xs font-bold text-white truncate">{intake.intakeMonth}</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-colors">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-mono font-bold">Visa Stream</p>
                <p className="text-xs font-bold text-white truncate">{intake.visa_type}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress & Countdown Bar */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Settlement Readiness:</span>
              <span className="font-mono text-emerald-400 font-bold">{stats.percentage}%</span>
              <span className="text-zinc-400">
                ({stats.completed}/{stats.total} total steps completed)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-400 font-mono">
                {stats.criticalPending > 0 ? (
                  <strong className="text-amber-400">{stats.criticalPending} priority steps pending</strong>
                ) : (
                  <strong className="text-emerald-400">All mandatory steps completed!</strong>
                )}
              </span>

              {arrivalInfo && (
                <Badge variant={arrivalInfo.days <= 14 && !arrivalInfo.isPast ? "amber" : "emerald"} className="text-[10px] font-mono">
                  {arrivalInfo.text}
                </Badge>
              )}
            </div>
          </div>

          <ProgressBar percentage={stats.percentage} size="md" />
        </div>

        {/* Interactive Living Expense Budget Breakdown Widget with GIC Switcher */}
        <div className="rounded-2xl border border-emerald-500/20 bg-[#091e19]/60 backdrop-blur-xl p-3.5 sm:p-5 flex flex-col gap-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono text-sm flex-shrink-0">
                $
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Student Living Expense Budget Breakdown ({budgetData.total})
                  </h4>
                  <Badge variant="emerald" className="text-[10px] py-0 px-2">
                    {selectedGicTier === "20635" ? "$20,635 Previous Rate" : "$23,448 Current Rate"}
                  </Badge>
                  <IrccGicTooltip variant="pill" currentTier={selectedGicTier} />
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                  Estimated monthly living budget ({budgetData.monthlyBudget}/mo) released throughout your 1st year
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Interactive GIC Tier Switcher */}
              <div className="flex items-center bg-[#0d1322] p-0.5 rounded-xl border border-white/[0.1] text-xs font-semibold shadow-2xs">
                <button
                  type="button"
                  onClick={() => setSelectedGicTier("20635")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all cursor-pointer text-xs",
                    selectedGicTier === "20635"
                      ? "bg-emerald-500 text-zinc-950 font-bold shadow-2xs"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  $20,635 GIC
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGicTier("23448")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all cursor-pointer text-xs",
                    selectedGicTier === "23448"
                      ? "bg-emerald-500 text-zinc-950 font-bold shadow-2xs"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  $23,448 GIC
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-2xs"
              >
                <span>{isBudgetExpanded ? "Hide Details" : "View Breakdown"}</span>
                {isBudgetExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isBudgetExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-2 border-t border-emerald-500/20 overflow-hidden flex flex-col gap-3"
              >
                {/* Reassuring Settlement Note for Existing GIC Holders */}
                <div className="p-3 rounded-xl bg-[#0d1322]/80 border border-emerald-500/25 text-xs text-zinc-300 flex items-start gap-2.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-semibold text-emerald-300">
                      Already paid your GIC under the $20,635 CAD rate?
                    </p>
                    <p className="text-zinc-400 mt-0.5">
                      If you submitted your study permit application before the recent IRCC update, your existing <strong className="text-zinc-200">$20,635 CAD</strong> bank certificate is <strong className="text-emerald-300">100% valid</strong> for Port of Entry into Canada. You do not need to top it up or pay extra fees.
                    </p>
                  </div>
                </div>

                {/* 5 Monthly Expense Buckets */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col shadow-2xs">
                    <span className="text-zinc-400 text-[10px] font-mono">🏠 Rent & Utilities</span>
                    <span className="font-bold text-white text-sm font-mono mt-0.5">{budgetData.rent}</span>
                    <span className="text-[10px] text-zinc-400">per month</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col shadow-2xs">
                    <span className="text-zinc-400 text-[10px] font-mono">🛒 Groceries & Food</span>
                    <span className="font-bold text-white text-sm font-mono mt-0.5">{budgetData.groceries}</span>
                    <span className="text-[10px] text-zinc-400">per month</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col shadow-2xs">
                    <span className="text-zinc-400 text-[10px] font-mono">🚌 Transit Pass</span>
                    <span className="font-bold text-white text-sm font-mono mt-0.5">{budgetData.transit}</span>
                    <span className="text-[10px] text-zinc-400">or student concession</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col shadow-2xs">
                    <span className="text-zinc-400 text-[10px] font-mono">📱 Mobile 5G Plan</span>
                    <span className="font-bold text-white text-sm font-mono mt-0.5">{budgetData.phone}</span>
                    <span className="text-[10px] text-zinc-400">w/ student discount</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col shadow-2xs">
                    <span className="text-zinc-400 text-[10px] font-mono">🛡️ Savings Buffer</span>
                    <span className="font-bold text-emerald-400 text-sm font-mono mt-0.5">{budgetData.buffer}</span>
                    <span className="text-[10px] text-zinc-400">monthly reserve</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/25 text-[11px] text-zinc-300 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">Initial Landing Release:</span>
                    <span className="font-mono font-semibold text-emerald-300">{budgetData.initialRelease}</span>
                    <span className="text-zinc-400">(available upon arrival)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">Monthly Bank Payout:</span>
                    <span className="font-mono font-semibold text-emerald-400">{budgetData.monthlyPayout} / mo</span>
                    <span className="text-zinc-400">(for 12 months)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
