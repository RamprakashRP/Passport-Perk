import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "emerald" | "blue" | "zinc" | "amber" | "rose" | "affiliate" | "purple";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight border transition-colors select-none";

  const variantStyles = {
    default: "bg-white/[0.08] text-zinc-300 border-white/[0.12]",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/25 font-semibold shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    zinc: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/25 font-semibold shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/25 font-semibold shadow-[0_0_15px_rgba(244,63,94,0.15)]",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/25 font-semibold shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    affiliate:
      "bg-emerald-500/15 text-emerald-300 border-emerald-400/30 font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}
