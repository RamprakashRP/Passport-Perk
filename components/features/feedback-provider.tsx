"use client";

import React, { useState } from "react";
import { MessageSquarePlus, Gift, Bug, Sparkles } from "lucide-react";
import { FeedbackModal } from "./feedback-modal";
import { openFeedbackModal } from "@/lib/feedback";
import { motion } from "framer-motion";

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {children}

      {/* Global Feedback Modal */}
      <FeedbackModal />

      {/* Floating Global Trigger Button (Desktop & Tablet) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <motion.button
          type="button"
          onClick={() => openFeedbackModal("perk_suggestion")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0e1626]/90 hover:bg-[#121c30] text-zinc-200 hover:text-white border border-white/10 hover:border-emerald-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all cursor-pointer group"
          title="Submit a Perk or Report a Bug"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors flex-shrink-0">
            <MessageSquarePlus className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap">
            Feedback & Perks
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.button>
      </div>
    </>
  );
}
