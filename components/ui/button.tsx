"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "affiliate" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 font-semibold",
      md: "text-sm px-4 py-2 gap-2 font-semibold",
      lg: "text-base px-6 py-3 gap-2.5 font-bold",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:from-emerald-600 active:to-teal-600 text-zinc-950 font-bold shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] focus:ring-emerald-400",
      secondary:
        "bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.04] text-zinc-100 border border-white/[0.12] shadow-sm hover:border-white/[0.2] focus:ring-zinc-400",
      outline:
        "bg-transparent hover:bg-white/[0.06] text-zinc-300 border border-white/20 hover:border-white/40 focus:ring-zinc-400",
      ghost:
        "bg-transparent hover:bg-white/[0.08] text-zinc-400 hover:text-white focus:ring-zinc-500",
      affiliate:
        "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-zinc-950 font-bold shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.55)] focus:ring-emerald-400",
      danger:
        "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 focus:ring-rose-400",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? {} : { scale: 1.015 }}
        whileTap={disabled ? {} : { scale: 0.985 }}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
