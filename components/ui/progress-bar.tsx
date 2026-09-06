"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  percentage,
  label,
  sublabel,
  showPercentage = true,
  className,
  barClassName,
  size = "md",
}: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium tracking-tight">
          <div className="flex items-center gap-2">
            {label && <span className="text-zinc-200 font-semibold">{label}</span>}
            {sublabel && <span className="text-zinc-400">{sublabel}</span>}
          </div>
          {showPercentage && (
            <span className="text-emerald-400 font-bold font-mono text-sm">
              {clampedPercentage}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full bg-white/[0.08] rounded-full overflow-hidden p-[1px] border border-white/[0.06]",
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
            barClassName
          )}
        />
      </div>
    </div>
  );
}
