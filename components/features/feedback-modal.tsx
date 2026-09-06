"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Bug,
  Lightbulb,
  X,
  Send,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Tag,
  DollarSign,
  AlertTriangle,
  Download,
  Eye,
  Inbox,
  Clock,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FeedbackType,
  FeedbackCategory,
  FeedbackSubmission,
} from "@/types";
import {
  submitCommunityFeedback,
  getLocalFeedbackSubmissions,
  fetchAllFeedbackSubmissions,
  exportSubmissionsToJson,
} from "@/lib/feedback";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialTab?: FeedbackType;
}

export function FeedbackModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  initialTab = "perk_suggestion",
}: FeedbackModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FeedbackType>(initialTab);
  const [viewMode, setViewMode] = useState<"form" | "review">("form");
  const [submissionsList, setSubmissionsList] = useState<FeedbackSubmission[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("lifestyle");
  const [partnerName, setPartnerName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [dealUrl, setDealUrl] = useState("");
  const [estimatedSavings, setEstimatedSavings] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [severity, setSeverity] = useState<"low" | "medium" | "critical">("medium");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Global event listener to trigger modal from any component
  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<{ tab?: FeedbackType }>;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
      setViewMode("form");
      setIsSubmitted(false);
      setInternalIsOpen(true);
    };

    window.addEventListener("open-feedback-modal", handleOpenModal);
    return () => window.removeEventListener("open-feedback-modal", handleOpenModal);
  }, []);

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setInternalIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  useEffect(() => {
    if (viewMode === "review") {
      fetchAllFeedbackSubmissions().then((data) => {
        setSubmissionsList(data);
      });
    }
  }, [viewMode]);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    setTimeout(() => {
      setIsSubmitted(false);
      setViewMode("form");
    }, 200);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPartnerName("");
    setPromoCode("");
    setDealUrl("");
    setEstimatedSavings("");
    setUserEmail("");
    setUserName("");
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    try {
      await submitCommunityFeedback({
        type: activeTab,
        category,
        title: title.trim(),
        description: description.trim(),
        partnerName: partnerName.trim() || undefined,
        promoCode: promoCode.trim() || undefined,
        dealUrl: dealUrl.trim() || undefined,
        estimatedSavings: estimatedSavings.trim() || undefined,
        region: region || "All Regions",
        severity: activeTab === "bug_report" ? severity : undefined,
        userEmail: userEmail.trim() || undefined,
        userName: userName.trim() || undefined,
        pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
      });

      triggerConfetti();
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-2xl bg-[#090e18] border border-white/10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                    Community & Feedback Engine
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Submit new perks, report glitches, or request platform upgrades.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "form" ? "review" : "form")}
                  className={cn(
                    "text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5",
                    viewMode === "review"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-white hover:bg-white/[0.08]"
                  )}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {viewMode === "form" ? "Review Submissions" : "Back to Form"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Submissions Review Mode */}
            {viewMode === "review" ? (
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] p-3.5 rounded-2xl">
                  <div>
                    <h4 className="text-sm font-bold text-white">Submitted Community Feedback</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {submissionsList.length} total submissions queued for review
                    </p>
                  </div>
                  {submissionsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => exportSubmissionsToJson(submissionsList)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON</span>
                    </button>
                  )}
                </div>

                {submissionsList.length === 0 ? (
                  <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                    <Inbox className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                    <h5 className="text-sm font-bold text-zinc-300">No Submissions Recorded Yet</h5>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      Submissions from this device or synced from Supabase will automatically appear here for review.
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewMode("form")}
                      className="mt-4 px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-all shadow-xs"
                    >
                      Submit First Entry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissionsList.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/15 transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-lg border",
                                item.type === "perk_suggestion"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : item.type === "bug_report"
                                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              )}
                            >
                              {item.type.replace("_", " ")}
                            </span>
                            <span className="text-xs font-mono text-zinc-500">
                              {new Date(item.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                            {item.status || "Pending Review"}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-sm font-bold text-white">{item.title}</h5>
                          <p className="text-xs text-zinc-300 mt-1 leading-relaxed whitespace-pre-wrap">
                            {item.description}
                          </p>
                        </div>

                        {/* Extra metadata */}
                        {(item.partnerName || item.promoCode || item.estimatedSavings || item.dealUrl) && (
                          <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-xs">
                            {item.partnerName && (
                              <span className="bg-white/[0.06] text-zinc-300 px-2 py-0.5 rounded-lg border border-white/[0.08]">
                                Partner: <strong className="text-white">{item.partnerName}</strong>
                              </span>
                            )}
                            {item.promoCode && (
                              <span className="bg-emerald-500/10 text-emerald-300 font-mono px-2 py-0.5 rounded-lg border border-emerald-500/20">
                                Code: <strong>{item.promoCode}</strong>
                              </span>
                            )}
                            {item.estimatedSavings && (
                              <span className="bg-white/[0.06] text-zinc-300 px-2 py-0.5 rounded-lg border border-white/[0.08]">
                                Est. Savings: <strong className="text-emerald-400">{item.estimatedSavings}</strong>
                              </span>
                            )}
                            {item.dealUrl && (
                              <a
                                href={item.dealUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:underline flex items-center gap-1"
                              >
                                <span>Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}

                        {item.userEmail && (
                          <div className="text-[11px] text-zinc-400 font-mono">
                            Submitted by: <span className="text-zinc-200">{item.userEmail}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : isSubmitted ? (
              /* Success Confirmation */
              <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold text-white tracking-tight">
                  Contribution Received!
                </h4>
                <p className="text-sm text-zinc-300 max-w-md leading-relaxed">
                  Thank you for helping other Canadian newcomers. Your submission has been securely stored and queued for review by our moderation team.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetForm}
                  >
                    Submit Another Entry
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleClose}
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              /* Form Mode */
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5">
                {/* Tab Switcher */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/[0.04] rounded-2xl border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("perk_suggestion");
                      setCategory("lifestyle");
                    }}
                    className={cn(
                      "py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      activeTab === "perk_suggestion"
                        ? "bg-emerald-500 text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Suggest Perk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("bug_report");
                      setCategory("ui_glitch");
                    }}
                    className={cn(
                      "py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      activeTab === "bug_report"
                        ? "bg-rose-500 text-white shadow-xs"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <Bug className="w-3.5 h-3.5" />
                    <span>Report Bug</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("general_feedback");
                      setCategory("feature_request");
                    }}
                    className={cn(
                      "py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      activeTab === "general_feedback"
                        ? "bg-blue-500 text-white shadow-xs"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Feedback</span>
                  </button>
                </div>

                {/* Main fields */}
                <div className="space-y-4">
                  {/* Title / Summary */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                      {activeTab === "perk_suggestion"
                        ? "Perk / Deal Title *"
                        : activeTab === "bug_report"
                        ? "Bug Summary *"
                        : "Suggestion Topic *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        activeTab === "perk_suggestion"
                          ? "e.g. Free Presto Transit Card with Student Pass"
                          : activeTab === "bug_report"
                          ? "e.g. GIC tier calculator is showing old values"
                          : "e.g. Add support for Montreal / Quebec universities"
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Perk-specific Fields */}
                  {activeTab === "perk_suggestion" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                          Partner / Brand Name
                        </label>
                        <input
                          type="text"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          placeholder="e.g. CIBC, SPC, Fizz Mobile"
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                          Promo Code (If applicable)
                        </label>
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="e.g. STUDENT2026 or SAVE15"
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 font-mono transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                          Deal Link / Website
                        </label>
                        <input
                          type="url"
                          value={dealUrl}
                          onChange={(e) => setDealUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                          Estimated Value / Savings
                        </label>
                        <input
                          type="text"
                          value={estimatedSavings}
                          onChange={(e) => setEstimatedSavings(e.target.value)}
                          placeholder="e.g. $50 CAD or 20% Off"
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bug-specific Fields */}
                  {activeTab === "bug_report" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                          Issue Severity
                        </label>
                        <select
                          value={severity}
                          onChange={(e) => setSeverity(e.target.value as any)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0e1424] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
                        >
                          <option value="low">Low - Minor Visual / Typo</option>
                          <option value="medium">Medium - Functional Glitch</option>
                          <option value="critical">Critical - Blocking Feature</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0e1424] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
                        >
                          <option value="ui_glitch">UI / Layout Glitch</option>
                          <option value="calculation_error">Calculation / GIC Error</option>
                          <option value="telecom">eSIM / Telecom Issue</option>
                          <option value="banking">Banking / Link Issue</option>
                          <option value="general">Other / General Issue</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Description / Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                      {activeTab === "perk_suggestion"
                        ? "Deal Details & How to Claim *"
                        : activeTab === "bug_report"
                        ? "Steps to Reproduce & Expected Behavior *"
                        : "Detailed Feedback / Idea *"}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        activeTab === "perk_suggestion"
                          ? "Explain what students get, eligibility requirements, or any special instructions..."
                          : activeTab === "bug_report"
                          ? "1. Click on X button\n2. Expected Y but got Z\nDevice: iPhone / Chrome on Windows"
                          : "Describe your ideas for improving the platform..."
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                    />
                  </div>

                  {/* Optional Contact info for credits */}
                  <div className="pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">
                        Your Email (Optional, for reward/credit)
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="you@uwaterloo.ca"
                        className="w-full px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">
                        Your Name / Discord Handle (Optional)
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Alex (UW Class of '28)"
                        className="w-full px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Submission Button */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Every submission is reviewed by moderators</span>
                  </div>

                  <Button
                    type="submit"
                    variant={activeTab === "bug_report" ? "danger" : "primary"}
                    size="sm"
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                    className="gap-2 px-5 shadow-xs"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit {activeTab === "perk_suggestion" ? "Perk" : activeTab === "bug_report" ? "Bug Report" : "Feedback"}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
