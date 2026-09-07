"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, HelpCircle, ShieldCheck, Check, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IrccGicTooltipProps {
  currentTier?: "20635" | "23448";
  className?: string;
  variant?: "pill" | "icon" | "inline";
}

export function IrccGicTooltip({
  currentTier = "20635",
  className,
  variant = "pill",
}: IrccGicTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      {variant === "pill" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-[11px] font-semibold text-emerald-300 transition-all cursor-pointer shadow-2xs group"
          title="Click to learn about IRCC GIC requirements"
        >
          <Info className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>IRCC $23,448 vs $20,635 Rules</span>
        </button>
      ) : variant === "inline" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-300 transition-colors cursor-pointer group"
          title="Click for IRCC GIC explanation"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="underline decoration-dotted underline-offset-2">Which GIC rate applies to me?</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-full text-zinc-400 hover:text-emerald-300 hover:bg-white/[0.08] transition-colors cursor-pointer"
          aria-label="IRCC GIC Information"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
        </button>
      )}

      {/* Tooltip Dialog Overlay / Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 sm:left-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 top-full mt-2 w-[88vw] max-w-sm sm:w-96 bg-[#0c1322] border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-5 z-50 backdrop-blur-2xl text-left"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">
                    IRCC GIC Policy Guidelines
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Official Student Direct Stream (SDS) Updates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-[11px]">
                <strong className="text-white block mb-0.5">✅ Already paid the $20,635 GIC?</strong>
                You are 100% covered. If your study permit application was submitted or your GIC issued under the prior threshold, CBSA border officers and IRCC accept it with zero issues.
              </div>

              <div className="space-y-1 text-[11px]">
                <strong className="text-zinc-100 block">Why the $23,448 indexing?</strong>
                <p className="text-zinc-400">
                  IRCC indexes the cost-of-living requirement to Statistics Canada&apos;s Low-Income Cut-Off (LICO) annually to ensure students have adequate living funds in Canadian cities.
                </p>
              </div>

              {/* Tier Comparison Mini-Table */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold block uppercase">$20,635 Tier</span>
                  <span className="text-xs font-bold text-white block mt-0.5">~$1,720 / mo</span>
                  <span className="text-[10px] text-zinc-400 block">$4,000 unlock + $1,386/mo</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-emerald-500/30 bg-emerald-500/[0.04]">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">$23,448 Tier</span>
                  <span className="text-xs font-bold text-emerald-300 block mt-0.5">~$1,954 / mo</span>
                  <span className="text-[10px] text-zinc-400 block">$4,689 unlock + $1,563/mo</span>
                </div>
              </div>
            </div>

            {/* Link footer */}
            <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">All 5 major Canadian banks support both rates</span>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>IRCC Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
