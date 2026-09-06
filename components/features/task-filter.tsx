"use client";

import React from "react";
import { Search, Filter, Sparkles, ShieldCheck, Zap, Gift, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFilterProps {
  selectedTier: string;
  onSelectTier: (tier: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  statusFilter: "all" | "pending" | "completed" | "affiliates";
  onSelectStatus: (status: "all" | "pending" | "completed" | "affiliates") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  taskCounts: {
    all: number;
    pending: number;
    completed: number;
    affiliates: number;
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

export function TaskFilter({
  selectedTier,
  onSelectTier,
  selectedCategory,
  onSelectCategory,
  statusFilter,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  taskCounts,
}: TaskFilterProps) {
  const tiers = [
    { id: "all", label: "All Priorities", count: taskCounts.all, icon: null },
    {
      id: "tier_1_mandatory",
      label: "Priority 1: Essential First Steps",
      count: taskCounts.tier1,
      icon: ShieldCheck,
    },
    {
      id: "tier_2_essential",
      label: "Priority 2: Helpful Setup",
      count: taskCounts.tier2,
      icon: Zap,
    },
    {
      id: "tier_3_perks",
      label: "Priority 3: Perks & Savings",
      count: taskCounts.tier3,
      icon: Gift,
    },
  ];

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "All Categories" },
    { id: "banking", label: "Banking & GIC" },
    { id: "telecom", label: "eSIM & Mobile" },
    { id: "housing", label: "Housing & Leases" },
    { id: "immigration", label: "Immigration & SIN" },
    { id: "transit", label: "Transit & Travel" },
    { id: "health", label: "Health & UHIP" },
    { id: "academic", label: "Campus & ID" },
    { id: "lifestyle", label: "Perks & Grocery" },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top row: Search input & Status pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, documents, regional tips..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0d1322] border border-white/[0.1] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 shadow-2xs transition-all"
          />
        </div>

        {/* Status switcher pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0d1322] border border-white/[0.08] rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => onSelectStatus("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "all"
                ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            All ({taskCounts.all})
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus("pending")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "pending"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-2xs font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            To Do ({taskCounts.pending})
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus("completed")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "completed"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-2xs font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            Done ({taskCounts.completed})
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus("affiliates")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer",
              statusFilter === "affiliates"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-2xs font-bold"
                : "text-zinc-400 hover:text-emerald-400"
            )}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Perks ({taskCounts.affiliates})
          </button>
        </div>
      </div>

      {/* Priority Tier Selector Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs mr-1 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Priority:</span>
        </div>
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelectTier(tier.id)}
              className={cn(
                "whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer",
                isSelected
                  ? tier.id === "tier_1_mandatory"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs font-bold"
                    : tier.id === "tier_2_essential"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-xs font-bold"
                    : tier.id === "tier_3_perks"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs font-bold"
                    : "bg-white/[0.15] text-white border-white/[0.25] shadow-xs font-bold"
                  : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tier.label}</span>
              <span className="text-[10px] font-mono opacity-80 font-bold">({tier.count})</span>
            </button>
          );
        })}
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs mr-1 font-semibold">
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Category:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              "whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer",
              selectedCategory === cat.id
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-2xs"
                : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white hover:bg-white/[0.04]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
