"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "glass" | "solid" | "interactive" | "glow";
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", children, ...props }, ref) => {
    const baseStyles = "rounded-2xl transition-all duration-200";

    const variantStyles = {
      glass: "bg-[#111726]/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
      solid: "bg-[#0d131f] border border-white/[0.08] shadow-md",
      interactive:
        "bg-[#111726]/75 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)] cursor-pointer transition-all duration-200",
      glow: "bg-[#111726]/90 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.15)]",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-3 flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-bold tracking-tight text-white",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-zinc-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-6 pt-0 flex items-center gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
