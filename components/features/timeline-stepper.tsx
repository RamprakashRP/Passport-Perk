"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Compass, Building2, Check } from "lucide-react";
import { TimelineStage, TimelineStageInfo } from "@/types";
import { cn } from "@/lib/utils";

interface TimelineStepperProps {
  stages: TimelineStageInfo[];
  currentStage: TimelineStage;
  onSelectStage: (stage: TimelineStage) => void;
  stageProgress: Record<TimelineStage, { total: number; completed: number; percentage: number }>;
}

export function TimelineStepper({
  stages,
  currentStage,
  onSelectStage,
  stageProgress,
}: TimelineStepperProps) {
  const getStageIcon = (id: TimelineStage) => {
    switch (id) {
      case "t_minus_45":
        return Compass;
      case "transit_border":
        return Plane;
      case "post_arrival":
        return Building2;
      default:
        return Compass;
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      {stages.map((stage) => {
        const Icon = getStageIcon(stage.id);
        const isActive = currentStage === stage.id;
        const progress = stageProgress[stage.id] || { total: 0, completed: 0, percentage: 0 };
        const isAllDone = progress.total > 0 && progress.completed === progress.total;

        return (
          <motion.button
            key={stage.id}
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectStage(stage.id)}
            className={cn(
              "relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 overflow-hidden cursor-pointer",
              isActive
                ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                : "bg-[#0d1322]/70 backdrop-blur-xl border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.03]"
            )}
          >
            {/* Top row: Stage number badge + progress indicator */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-2xs",
                    isActive
                      ? "bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                      : isAllDone
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/[0.05] border border-white/[0.08] text-zinc-400"
                  )}
                >
                  {isAllDone ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-mono uppercase tracking-wider font-bold",
                    isActive ? "text-emerald-400" : "text-zinc-400"
                  )}
                >
                  {stage.badge}
                </span>
              </div>

              <span
                className={cn(
                  "text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border",
                  isAllDone
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : isActive
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-2xs"
                    : "bg-white/[0.04] text-zinc-400 border-white/[0.08]"
                )}
              >
                {progress.completed}/{progress.total} Done
              </span>
            </div>

            {/* Stage title & timeframe */}
            <div>
              <h4
                className={cn(
                  "text-sm sm:text-base font-bold tracking-tight transition-colors",
                  isActive ? "text-white" : "text-zinc-300"
                )}
              >
                {stage.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                {stage.timeframe}
              </p>
            </div>

            {/* Micro progress bar per stage */}
            <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  isAllDone
                    ? "bg-emerald-400 shadow-[0_0_8px_#10b981]"
                    : isActive
                    ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                    : "bg-zinc-600"
                )}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
