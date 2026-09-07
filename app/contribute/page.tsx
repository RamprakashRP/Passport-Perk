"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Bug,
  Lightbulb,
  Share2,
  Copy,
  Check,
  Sparkles,
  Send,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Download,
  Inbox,
  ArrowRight,
  ChevronRight,
  MessageSquarePlus,
  Compass,
  HeartHandshake,
} from "lucide-react";
import { GlobalNav } from "@/components/layout/global-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FeedbackType,
  FeedbackCategory,
  FeedbackSubmission,
} from "@/types";
import {
  submitCommunityFeedback,
  fetchAllFeedbackSubmissions,
  exportSubmissionsToJson,
} from "@/lib/feedback";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

function ContributeContent() {
  const searchParams = useSearchParams();
  const initialTypeParam = searchParams.get("type");

  const [activeTab, setActiveTab] = useState<FeedbackType>(
    initialTypeParam === "bug"
      ? "bug_report"
      : initialTypeParam === "feedback"
      ? "general_feedback"
      : "perk_suggestion"
  );

  const [viewMode, setViewMode] = useState<"form" | "review">("form");
  const [submissionsList, setSubmissionsList] = useState<FeedbackSubmission[]>([]);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

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

  useEffect(() => {
    if (viewMode === "review") {
      fetchAllFeedbackSubmissions().then((data) => {
        setSubmissionsList(data);
      });
    }
  }, [viewMode]);

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/contribute?type=${
        activeTab === "perk_suggestion"
          ? "perk"
          : activeTab === "bug_report"
          ? "bug"
          : "feedback"
      }`;
      navigator.clipboard.writeText(url);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
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
        pageUrl: "/contribute",
      });

      triggerConfetti();
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#09101c] to-[#070b14] border border-white/[0.1] p-6 sm:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald" className="px-3 py-0.5 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Community Hub</span>
              </Badge>
              <Badge variant="zinc" className="text-xs font-mono font-semibold">
                Shareable Link: /contribute
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Contribute Perks, Report Bugs & Share Suggestions
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Help build PassportPerk — Canada&apos;s most trusted settlement and student perks hub. Share secret student discounts, report technical glitches, or propose feature additions. Every contribution is reviewed and tested by our team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyShareLink}
              className="gap-2 shadow-xs cursor-pointer"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Share This Link</span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setViewMode(viewMode === "form" ? "review" : "form")}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                viewMode === "review"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-white hover:bg-white/[0.08]"
              )}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>{viewMode === "form" ? "Review Submissions" : "Back to Submission Form"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Review Submissions Log */}
      {viewMode === "review" ? (
        <div className="rounded-3xl bg-[#090e18] border border-white/[0.08] p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Queued Community Submissions
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {submissionsList.length} submissions recorded (synced with Supabase cloud database + local storage)
              </p>
            </div>

            {submissionsList.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => exportSubmissionsToJson(submissionsList)}
                className="gap-2 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Submissions JSON</span>
              </Button>
            )}
          </div>

          {submissionsList.length === 0 ? (
            <div className="text-center py-16 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <Inbox className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-200">No Submissions Recorded Yet</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                Submissions made from this page will automatically sync to your Supabase <code className="text-emerald-400 font-mono">community_feedback</code> table and appear here.
              </p>
              <button
                type="button"
                onClick={() => setViewMode("form")}
                className="mt-5 px-5 py-2.5 bg-emerald-500 text-zinc-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-all shadow-xs"
              >
                Submit First Contribution
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissionsList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/15 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-lg border",
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
                        {new Date(item.submittedAt).toLocaleDateString()} at {new Date(item.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                      {item.status || "Pending Review"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  {(item.partnerName || item.promoCode || item.estimatedSavings || item.dealUrl || item.region) && (
                    <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-xs">
                      {item.partnerName && (
                        <span className="bg-white/[0.06] text-zinc-300 px-2.5 py-1 rounded-lg border border-white/[0.08]">
                          Partner: <strong className="text-white">{item.partnerName}</strong>
                        </span>
                      )}
                      {item.promoCode && (
                        <span className="bg-emerald-500/10 text-emerald-300 font-mono px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          Promo Code: <strong>{item.promoCode}</strong>
                        </span>
                      )}
                      {item.estimatedSavings && (
                        <span className="bg-white/[0.06] text-zinc-300 px-2.5 py-1 rounded-lg border border-white/[0.08]">
                          Est. Value: <strong className="text-emerald-400">{item.estimatedSavings}</strong>
                        </span>
                      )}
                      {item.region && (
                        <span className="bg-white/[0.06] text-zinc-400 px-2.5 py-1 rounded-lg border border-white/[0.08]">
                          Region: <strong className="text-zinc-200">{item.region}</strong>
                        </span>
                      )}
                      {item.dealUrl && (
                        <a
                          href={item.dealUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Website Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {item.userEmail && (
                    <div className="text-xs text-zinc-400 font-mono pt-1">
                      Submitted by: <span className="text-zinc-200 font-semibold">{item.userName || "User"} ({item.userEmail})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : isSubmitted ? (
        /* Success Screen */
        <div className="rounded-3xl bg-[#090e18] border border-white/[0.08] p-10 sm:p-16 text-center flex flex-col items-center justify-center gap-5 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.35)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Contribution Successfully Received!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Thank you for supporting incoming Canadian students. Your contribution has been queued in our review pipeline. Once verified, it will be published to the live platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Button
              variant="outline"
              size="md"
              onClick={resetForm}
            >
              Submit Another Contribution
            </Button>
            <Link href="/dashboard/perks">
              <Button
                variant="primary"
                size="md"
                className="gap-2"
              >
                <span>Explore Perks Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Form Card */
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-[#090e18] border border-white/[0.08] p-6 sm:p-8 flex flex-col gap-6 shadow-2xl"
        >
          {/* Channel Tabs */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase font-mono tracking-wider">
              Select Contribution Category
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("perk_suggestion");
                  setCategory("lifestyle");
                }}
                className={cn(
                  "py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === "perk_suggestion"
                    ? "bg-emerald-500 text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Gift className="w-4 h-4" />
                <span>Suggest a Perk</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("bug_report");
                  setCategory("ui_glitch");
                }}
                className={cn(
                  "py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === "bug_report"
                    ? "bg-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.3)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Bug className="w-4 h-4" />
                <span>Report a Bug</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("general_feedback");
                  setCategory("feature_request");
                }}
                className={cn(
                  "py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === "general_feedback"
                    ? "bg-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.3)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Lightbulb className="w-4 h-4" />
                <span>General Feedback</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                {activeTab === "perk_suggestion"
                  ? "Perk / Offer Title *"
                  : activeTab === "bug_report"
                  ? "Issue Summary *"
                  : "Topic / Suggestion Title *"}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  activeTab === "perk_suggestion"
                    ? "e.g. 50% Off Spotify Student + Free Hulu"
                    : activeTab === "bug_report"
                    ? "e.g. Banking matrix dropdown overlaps on Safari mobile"
                    : "e.g. Add specialized housing guide for Laurier students"
                }
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Perk Details */}
            {activeTab === "perk_suggestion" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                    Partner / Brand Name
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Scotiabank, Presto, Fizz, SPC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
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
                    placeholder="e.g. STUDENT2026 or SAVE20"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                    Deal URL / Link
                  </label>
                  <input
                    type="url"
                    value={dealUrl}
                    onChange={(e) => setDealUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                    Estimated Student Value
                  </label>
                  <input
                    type="text"
                    value={estimatedSavings}
                    onChange={(e) => setEstimatedSavings(e.target.value)}
                    placeholder="e.g. $120 CAD / year or 15% discount"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Bug Specifics */}
            {activeTab === "bug_report" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                    Issue Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1424] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
                  >
                    <option value="low">Low - Minor Typo / Cosmetic</option>
                    <option value="medium">Medium - Incorrect Data / Formatting</option>
                    <option value="critical">Critical - Broken Feature / Button Not Working</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1424] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
                  >
                    <option value="ui_glitch">UI / Layout Issue</option>
                    <option value="calculation_error">GIC / Currency Calculator</option>
                    <option value="telecom">eSIM / Phone Resource</option>
                    <option value="banking">Bank Comparison Info</option>
                    <option value="immigration">IRCC Checklist Item</option>
                    <option value="general">Other / General</option>
                  </select>
                </div>
              </div>
            )}

            {/* Description Area */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase font-mono tracking-wider">
                {activeTab === "perk_suggestion"
                  ? "Deal Description & Redemption Instructions *"
                  : activeTab === "bug_report"
                  ? "Steps to Reproduce & Expected Behavior *"
                  : "Detailed Suggestion / Feature Concept *"}
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  activeTab === "perk_suggestion"
                    ? "Describe who is eligible (all students vs. specific university), where to redeem, and any restrictions..."
                    : activeTab === "bug_report"
                    ? "1. Go to page X\n2. Clicked on button Y\n3. What happened vs. what should happen\nDevice / Browser info..."
                    : "Describe the feature, why students need it, and how it helps Canadian newcomers..."
                }
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
              />
            </div>

            {/* User Attribution */}
            <div className="pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Your Email (Optional, for reward credit)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="you@uwaterloo.ca"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-all"
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
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submission Buttons */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>All submissions are reviewed before publishing</span>
            </div>

            <Button
              type="submit"
              variant={activeTab === "bug_report" ? "danger" : "primary"}
              size="md"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="gap-2 px-6 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
            >
              {isSubmitting ? (
                <span>Submitting to Database...</span>
              ) : (
                <>
                  <span>
                    Submit {activeTab === "perk_suggestion" ? "Student Perk" : activeTab === "bug_report" ? "Bug Report" : "Suggestion"}
                  </span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Background Aurora Mesh Gradients */}
      <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-[30%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none -z-10" />

      {/* Persistent Global Nav */}
      <GlobalNav />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-16 relative z-10">
        <Suspense fallback={<div className="text-center py-20 text-zinc-400">Loading contribution hub...</div>}>
          <ContributeContent />
        </Suspense>
      </main>
    </div>
  );
}
