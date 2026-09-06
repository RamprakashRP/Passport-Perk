"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  Layers,
  Info,
  Lightbulb,
} from "lucide-react";
import { TaskCard } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BankComparisonMatrix } from "@/components/features/bank-comparison-matrix";
import { handleOutboundClick } from "@/lib/telemetry";
import { cn } from "@/lib/utils";
import { triggerConfetti } from "@/lib/confetti";

interface TaskCardItemProps {
  task: TaskCard;
  onToggle: (taskId: string) => void;
}

export function TaskCardItem({ task, onToggle }: TaskCardItemProps) {
  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false);
  const [isBankMatrixExpanded, setIsBankMatrixExpanded] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeComplete = !task.isComplete;
    onToggle(task.id);

    if (willBeComplete) {
      triggerConfetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (task.bankComparisonOptions && task.bankComparisonOptions.length > 0) {
      setIsBankMatrixExpanded((prev) => !prev);
    }

    handleOutboundClick(
      task.partnerId || task.id,
      task.category,
      task.cta_link,
      {
        position_on_page: "task_card_main_cta",
        task_id: task.id,
        task_title: task.title,
        user_intake_stage: task.timelineStage,
      }
    );
  };

  const getPriorityTierBadge = (tier: string) => {
    switch (tier) {
      case "tier_1_mandatory":
        return { variant: "emerald" as const, label: "Priority 1: Essential" };
      case "tier_2_essential":
        return { variant: "blue" as const, label: "Priority 2: Helpful Setup" };
      case "tier_3_perks":
        return { variant: "amber" as const, label: "Priority 3: Perk / Savings" };
      default:
        return { variant: "zinc" as const, label: "General Step" };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "banking":
        return "emerald";
      case "telecom":
        return "blue";
      case "housing":
        return "amber";
      case "immigration":
        return "purple";
      case "transit":
        return "blue";
      case "health":
        return "rose";
      case "academic":
        return "zinc";
      case "lifestyle":
        return "amber";
      default:
        return "zinc";
    }
  };

  const tierBadge = getPriorityTierBadge(task.priorityTier || "tier_1_mandatory");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-2xl transition-all duration-200 border overflow-hidden",
        task.isComplete
          ? "bg-[#0d1322]/50 border-emerald-500/25 shadow-2xs"
          : task.isAffiliate
          ? "bg-[#0d1322]/80 backdrop-blur-xl border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
          : "bg-[#0d1322]/80 backdrop-blur-xl border-white/[0.08] hover:border-white/[0.18] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      )}
    >
      {/* Top Banner for Affiliate / Comparison Tasks */}
      {task.isAffiliate && (
        <div className="bg-emerald-500/10 px-5 py-2 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{task.affiliateBadge || "Neutral Aggregator Recommendation"}</span>
          </div>
          {task.affiliatePartner && (
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              {task.affiliatePartner}
            </span>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col gap-4">
        {/* Header row: Checkbox + Title + Meta */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <button
            type="button"
            onClick={handleToggle}
            className="mt-0.5 flex-shrink-0 text-zinc-500 hover:text-emerald-400 transition-colors focus:outline-none cursor-pointer"
            aria-label={task.isComplete ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.isComplete ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/20 transition-transform scale-105 shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
            ) : (
              <Circle className="w-6 h-6 hover:stroke-emerald-400 stroke-[1.8] hover:scale-105 transition-transform" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant={tierBadge.variant} className="font-bold shadow-2xs">
                {tierBadge.label}
              </Badge>
              <Badge variant={getCategoryColor(task.category)} className="font-mono text-[10px] uppercase font-bold">
                {task.category}
              </Badge>
              {task.estimatedTime && (
                <span className="inline-flex items-center gap-1 text-xs text-zinc-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  {task.estimatedTime}
                </span>
              )}
            </div>

            <h4
              className={cn(
                "text-base sm:text-lg font-bold tracking-tight transition-colors",
                task.isComplete ? "text-zinc-500 line-through" : "text-white"
              )}
            >
              {task.title}
            </h4>

            <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>

        {/* Affiliate Discount / Perks Callout */}
        {task.isAffiliate && task.affiliateDiscount && (
          <div className="ml-0 sm:ml-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 flex items-start gap-2.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-200 font-medium">
              <strong className="text-emerald-300">Featured Offer: </strong>
              {task.affiliateDiscount}
            </p>
          </div>
        )}

        {/* Local Regional Advice */}
        {task.localWaterlooTip && (
          <div className="ml-0 sm:ml-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3.5 flex items-start gap-2.5 shadow-2xs">
            <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-200 leading-relaxed">
              <strong className="text-blue-300">Regional Settlement Tip: </strong>
              {task.localWaterlooTip}
            </p>
          </div>
        )}

        {/* Key Requirements Expandable List */}
        {task.keyRequirements && task.keyRequirements.length > 0 && (
          <div className="ml-0 sm:ml-10">
            <button
              type="button"
              onClick={() => setIsRequirementsExpanded(!isRequirementsExpanded)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-bold transition-colors cursor-pointer"
            >
              <span>{isRequirementsExpanded ? "Hide checklist requirements" : `View ${task.keyRequirements.length} verification steps`}</span>
              {isRequirementsExpanded ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <AnimatePresence>
              {isRequirementsExpanded && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2.5 space-y-2 pl-3.5 border-l-2 border-emerald-500 text-xs text-zinc-300"
                >
                  {task.keyRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Bank Comparison Matrix Inline Dropdown */}
        {task.bankComparisonOptions && task.bankComparisonOptions.length > 0 && (
          <div className="ml-0 sm:ml-10 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBankMatrixExpanded(!isBankMatrixExpanded)}
              className="w-full sm:w-auto text-xs gap-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 font-bold shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBankMatrixExpanded ? "Hide 5-Bank Comparison Matrix" : "Compare All 5 Major Canadian Student Banks"}</span>
              {isBankMatrixExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>

            <AnimatePresence>
              {isBankMatrixExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <BankComparisonMatrix />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Button CTA Row */}
        <div className="ml-0 sm:ml-10 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            {task.isComplete ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Step Completed
              </span>
            ) : (
              <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" /> Ready to action
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.bankComparisonOptions && task.bankComparisonOptions.length > 0 ? (
              <Button
                variant="affiliate"
                size="sm"
                onClick={() => setIsBankMatrixExpanded(!isBankMatrixExpanded)}
                className="group/btn gap-1.5 shadow-2xs"
              >
                <span>{task.cta_label}</span>
                <Layers className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <a
                href={task.cta_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                className="inline-block"
              >
                <Button
                  variant={task.isAffiliate ? "affiliate" : "secondary"}
                  size="sm"
                  className="group/btn gap-1.5 shadow-2xs"
                >
                  <span>{task.cta_label}</span>
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
