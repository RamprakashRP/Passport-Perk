"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Sparkles,
  ArrowRight,
  Gift,
  FileText,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { IntakeForm } from "@/components/features/intake-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#080c14] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* High-Trust Sticky Top Header */}
      <header className="sticky top-0 z-50 w-full bg-[#080c14]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-zinc-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                NorthStar <span className="text-emerald-400 font-mono text-xs">/ Guide</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
                Canadian Newcomer Settlement Guide
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-zinc-300 font-medium backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Waterloo Region • Toronto (GTA) • Vancouver (BC)</span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/perks"
              className="text-xs font-semibold text-zinc-300 hover:text-emerald-300 px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>Perks & Offers</span>
            </Link>

            <Link
              href="/dashboard/documents"
              className="text-xs font-semibold text-zinc-300 hover:text-emerald-300 px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors hidden sm:flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Document Vault</span>
            </Link>

            <Link
              href="/dashboard"
              className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5"
            >
              <span>View Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="sm:hidden p-2 rounded-xl text-zinc-300 hover:bg-white/[0.08] focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileNavOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileNavOpen && (
          <div className="sm:hidden bg-[#090d16]/98 border-t border-white/[0.08] px-4 py-4 flex flex-col gap-2 shadow-2xl backdrop-blur-2xl">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold text-sm"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Checklist Roadmap</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </Link>

            <Link
              href="/dashboard/perks"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold text-sm"
            >
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Perks & 5-Bank Comparison</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </Link>

            <Link
              href="/dashboard/documents"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold text-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>POE Document Checklist</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </Link>
          </div>
        )}
      </header>

      {/* Main Landing Content */}
      <main className="relative py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-16 w-full flex-1">
        {/* Glowing Aurora Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-emerald-500/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-60 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Hero Header Section */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-5">
          <Badge variant="emerald" className="px-4 py-1.5 text-xs shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Objective Comparison • Free Newcomer Resource</span>
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-[1.1]">
            Your Step-by-Step Pre-Arrival Guide to Canada
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl font-normal">
            A calm, dependable settlement engine for international students and tech professionals arriving in <strong className="text-white font-semibold">Waterloo Region</strong>, <strong className="text-white font-semibold">Toronto (GTA)</strong>, or <strong className="text-white font-semibold">Vancouver (BC)</strong> — featuring multi-city transit guides, 5-bank comparison, and instant eSIM setup.
          </p>

          {/* Quick Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-3 w-full max-w-2xl">
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] transition-all rounded-2xl p-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-[11px] font-mono text-zinc-400 block uppercase font-semibold tracking-wider">City Routing</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Waterloo • Toronto • Vancouver</span>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] transition-all rounded-2xl p-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-[11px] font-mono text-zinc-400 block uppercase font-semibold tracking-wider">Transit Gateways</span>
              <span className="text-sm font-bold text-white mt-0.5 block">YYZ Pearson & YVR Airport</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/30 transition-all rounded-2xl p-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="text-[11px] font-mono text-zinc-400 block uppercase font-semibold tracking-wider">Student Perks</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">5-Bank Comparison Suite</span>
            </div>
          </div>
        </div>

        {/* Interactive Multi-Step Intake Wizard */}
        <section className="w-full">
          <div className="text-center mb-7 max-w-xl mx-auto">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Personalized Settlement Wizard
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Build Your Step-by-Step Arrival Checklist
            </p>
            <p className="text-xs text-zinc-400 mt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Your answers are only used to tailor your personalized settlement roadmap and GIC living budget.
              </span>
            </p>
          </div>

          <IntakeForm />
        </section>

        {/* Trust & Architecture Showcase */}
        <section className="w-full pt-12 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="blue" className="mb-2.5">
              Why NorthStar
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Clear Guidance, Complete Neutrality
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              Engineered with full bank neutrality, Canadian provincial tenant compliance, and localized transit integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111726]/80 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/30 transition-all rounded-3xl p-6 flex flex-col gap-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">
                5-Bank Canadian Student Comparison
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Objective side-by-side breakdown of Scotiabank, CIBC, TD, RBC, and Simplii Financial — comparing GIC turnaround times, welcome cash bonuses, and campus branch proximity.
              </p>
            </div>

            <div className="bg-[#111726]/80 backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/30 transition-all rounded-3xl p-6 flex flex-col gap-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">
                Instant Canadian eSIM Setup
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Zero roaming surcharges. Activate an authentic Canadian mobile eSIM before boarding so you have immediate data the second your aircraft lands.
              </p>
            </div>

            <div className="bg-[#111726]/80 backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/30 transition-all rounded-3xl p-6 flex flex-col gap-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">
                Local Transit & Identity Setup
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Step-by-step instructions for ION LRT / TTC Subway / SkyTrain, university student card pickup, provincial health coverage (UHIP/MSP), and Service Canada SIN issuance.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
