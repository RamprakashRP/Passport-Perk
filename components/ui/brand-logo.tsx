import React from "react";
import { cn } from "@/lib/utils";

export type BrandKey =
  | "apple"
  | "spotify"
  | "amazon-prime"
  | "too-good-to-go"
  | "pc-optimum"
  | "phonebox"
  | "fizz"
  | "scotiabank"
  | "cibc"
  | "td"
  | "rbc"
  | "bmo"
  | "simplii"
  | "ion-waterloo"
  | "ttc-toronto"
  | "skytrain-vancouver"
  | "square-one"
  | "service-canada"
  | "spc"
  | "uber"
  | "lyft";

interface BrandLogoProps {
  brand: BrandKey | string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ brand, className, size = "md" }: BrandLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-xl text-xs",
    md: "w-12 h-12 rounded-2xl text-sm",
    lg: "w-14 h-14 rounded-2xl text-base",
  };

  switch (brand) {
    case "apple":
      return (
        <div
          className={cn(
            "bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/20 flex items-center justify-center text-white shadow-inner flex-shrink-0",
            sizeClasses[size],
            className
          )}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.83-7.9-12.43-14.59-6.3-9.13-11.24-19.64-14.81-31.54-3.57-11.9-5.36-23.08-5.36-33.54 0-14.45 3.73-26.4 11.19-35.84 7.46-9.44 16.92-14.28 28.37-14.53 4.8 0 10.23 1.25 16.3 3.75 6.07 2.5 10.13 3.82 12.18 3.96 1.77-.2 5.86-1.54 12.27-4.04 6.41-2.5 11.83-3.68 16.27-3.54 12.18.66 22.14 5.37 29.88 14.13-10.68 6.46-15.9 15.39-15.67 26.79.23 9.4 3.85 17.18 10.86 23.34 7.01 6.16 15.35 9.68 25.02 10.56-2.17 6.4-4.8 12.87-7.88 19.41zM119.22 33.56c0-6.84 2.45-13.34 7.36-19.5 4.91-6.16 11.08-10.29 18.52-12.4 1.05 7.07-.98 13.68-6.1 19.82-5.12 6.14-11.71 9.94-19.78 11.4-.04.22-.04.45 0 .68z" />
          </svg>
        </div>
      );

    case "spotify":
      return (
        <div
          className={cn(
            "bg-[#121212] border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954] shadow-inner flex-shrink-0",
            sizeClasses[size],
            className
          )}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.216.353-.675.467-1.028.25-2.825-1.727-6.381-2.118-10.57-1.16-.402.093-.805-.157-.898-.56-.093-.402.157-.805.56-.898 4.587-1.049 8.525-.606 11.688 1.34.353.216.467.675.248 1.028zm1.47-3.262c-.272.441-.85.578-1.291.306-3.235-1.989-8.167-2.564-11.993-1.402-.497.151-1.028-.135-1.179-.633-.151-.497.135-1.028.633-1.179 4.381-1.33 9.805-.688 13.524 1.602.441.272.578.85.306 1.306zm.126-3.41c-3.879-2.303-10.288-2.516-14.004-1.388-.596.181-1.229-.16-1.41-.756-.181-.596.16-1.229.756-1.41 4.269-1.296 11.341-1.049 15.811 1.605.536.318.712 1.017.394 1.553-.318.536-1.017.712-1.547.396z" />
          </svg>
        </div>
      );

    case "amazon-prime":
      return (
        <div
          className={cn(
            "bg-[#002F49] border border-[#00A8E1]/40 flex flex-col items-center justify-center text-white shadow-inner flex-shrink-0 p-1",
            sizeClasses[size],
            className
          )}
        >
          <div className="font-black text-xs tracking-tighter text-[#00A8E1] italic">prime</div>
          <svg className="w-5 h-2 fill-[#FF9900]" viewBox="0 0 50 15">
            <path d="M4 4c8 7 24 9 40 0 2-1 4 1 2 3-18 10-38 8-44-1-1-2 0-3 2-2z" />
          </svg>
        </div>
      );

    case "too-good-to-go":
      return (
        <div
          className={cn(
            "bg-[#003E39] border border-[#00A389]/40 flex items-center justify-center text-[#E8F8F5] shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] text-[#00E5C0] font-black">2G2G</span>
            <span className="text-[8px] font-bold text-amber-300">★</span>
          </div>
        </div>
      );

    case "pc-optimum":
      return (
        <div
          className={cn(
            "bg-[#1e293b] border border-red-500/40 flex items-center justify-center shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex items-center gap-0.5">
            <span className="text-red-500 font-extrabold text-xs">PC</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          </div>
        </div>
      );

    case "spc":
      return (
        <div
          className={cn(
            "bg-[#2E1065] border border-purple-400/40 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-tight text-purple-300">SPC+</span>
        </div>
      );

    case "phonebox":
      return (
        <div
          className={cn(
            "bg-[#0A2540] border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-[11px] font-black tracking-tight">5G</span>
            <span className="text-[7px] text-cyan-400 font-mono">TEL</span>
          </div>
        </div>
      );

    case "fizz":
      return (
        <div
          className={cn(
            "bg-[#00473E] border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-tight text-emerald-300 lowercase">fizz</span>
        </div>
      );

    case "scotiabank":
      return (
        <div
          className={cn(
            "bg-[#EE0000] border border-red-400/50 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-[11px] font-black tracking-tighter text-white">SCOTIA</span>
          </div>
        </div>
      );

    case "cibc":
      return (
        <div
          className={cn(
            "bg-[#75002B] border border-rose-400/50 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-wider text-white">CIBC</span>
        </div>
      );

    case "td":
      return (
        <div
          className={cn(
            "bg-[#008A00] border border-green-400/50 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-wider text-white">TD</span>
        </div>
      );

    case "rbc":
      return (
        <div
          className={cn(
            "bg-[#0051A5] border border-blue-400/50 flex items-center justify-center text-yellow-400 shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-[11px] font-black text-white">RBC</span>
            <span className="text-[8px] text-yellow-400 font-bold">★</span>
          </div>
        </div>
      );

    case "bmo":
      return (
        <div
          className={cn(
            "bg-[#0079C1] border border-sky-400/50 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex items-center gap-0.5">
            <span className="text-xs font-black tracking-tight text-white">BMO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
          </div>
        </div>
      );

    case "simplii":
      return (
        <div
          className={cn(
            "bg-[#D5006D] border border-pink-400/50 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-[10px] font-black tracking-tighter text-white lowercase">simplii</span>
        </div>
      );

    case "ion-waterloo":
      return (
        <div
          className={cn(
            "bg-[#003865] border border-blue-400/40 flex items-center justify-center text-cyan-300 shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-tight text-white">ION</span>
        </div>
      );

    case "ttc-toronto":
      return (
        <div
          className={cn(
            "bg-[#D11A2A] border border-red-400/50 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-wider text-white">TTC</span>
        </div>
      );

    case "skytrain-vancouver":
      return (
        <div
          className={cn(
            "bg-[#005780] border border-sky-400/40 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-tight text-white">YVR</span>
        </div>
      );

    case "square-one":
      return (
        <div
          className={cn(
            "bg-[#0D7C8A] border border-teal-400/40 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-tighter text-white">SQ1</span>
        </div>
      );

    case "service-canada":
      return (
        <div
          className={cn(
            "bg-[#1e293b] border border-red-500/40 flex items-center justify-center text-red-500 shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-xs">🍁</span>
            <span className="text-[7px] text-zinc-300 font-bold uppercase">SIN</span>
          </div>
        </div>
      );

    case "uber":
      return (
        <div
          className={cn(
            "bg-black border border-white/30 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-tight text-white">Uber</span>
        </div>
      );

    case "lyft":
      return (
        <div
          className={cn(
            "bg-[#FF00BF] border border-pink-300/40 flex items-center justify-center text-white shadow-inner flex-shrink-0 font-black",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-xs font-black tracking-tight text-white">lyft</span>
        </div>
      );

    default:
      return (
        <div
          className={cn(
            "bg-white/[0.08] border border-white/15 flex items-center justify-center text-emerald-400 shadow-inner flex-shrink-0 font-black font-mono",
            sizeClasses[size],
            className
          )}
        >
          PERK
        </div>
      );
  }
}
