"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  RotateCcw,
  Compass,
  ArrowRight,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Gift,
  FileText,
  ExternalLink,
  MessageSquarePlus,
  Bug,
} from "lucide-react";
import { UserIntake, TaskCard, TimelineStage, PriorityTier, ChecklistStats } from "@/types";
import { getTasksForRegion, TIMELINE_STAGES } from "@/lib/data/default-tasks";
import { DashboardHeader } from "@/components/features/dashboard-header";
import { TimelineStepper } from "@/components/features/timeline-stepper";
import { TaskFilter } from "@/components/features/task-filter";
import { TaskCardItem } from "@/components/features/task-card-item";
import { Button } from "@/components/ui/button";
import { openFeedbackModal } from "@/lib/feedback";
import {
  supabase,
  getCurrentUser,
  fetchUserProfileFromSupabase,
  fetchUserTasksFromSupabase,
  syncTaskStatusToSupabase,
} from "@/lib/supabase";

const DEFAULT_INTAKE: UserIntake = {
  targetCity: "Waterloo Region, ON",
  institution: "University of Waterloo (UW)",
  visa_type: "Standard Study Permit",
  intakeMonth: "September 2026 (Fall Term)",
  arrival_date: "2026-09-01",
  hasGIC: "no",
  gicAmountTier: "20635",
  hasHousing: "searching",
  hasSim: "no",
};

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [intake, setIntake] = useState<UserIntake>(DEFAULT_INTAKE);
  const [tasks, setTasks] = useState<TaskCard[]>(() => getTasksForRegion("Waterloo Region, ON"));
  const [currentStage, setCurrentStage] = useState<TimelineStage>("t_minus_45");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "affiliates">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from LocalStorage & Supabase on mount
  useEffect(() => {
    setMounted(true);
    let activeCity = DEFAULT_INTAKE.targetCity;

    if (typeof window !== "undefined") {
      const storedIntake = localStorage.getItem("waterloo_newcomer_intake");
      if (storedIntake) {
        try {
          const parsed = JSON.parse(storedIntake);
          if (parsed && typeof parsed === "object") {
            setIntake(parsed);
            if (parsed.targetCity) {
              activeCity = parsed.targetCity;
            }
          }
        } catch (e) {
          console.error("Failed to parse stored intake", e);
        }
      }

      // Generate tasks for active region
      const regionalDefaultTasks = getTasksForRegion(activeCity);

      const storedTasks = localStorage.getItem("waterloo_newcomer_tasks");
      if (storedTasks) {
        try {
          const parsed = JSON.parse(storedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const merged = regionalDefaultTasks.map((defTask) => {
              const matched = parsed.find((p: any) => p.id === defTask.id);
              return matched ? { ...defTask, isComplete: matched.isComplete } : defTask;
            });
            setTasks(merged);
          } else {
            setTasks(regionalDefaultTasks);
          }
        } catch (e) {
          console.error("Failed to parse stored tasks", e);
          setTasks(regionalDefaultTasks);
        }
      } else {
        setTasks(regionalDefaultTasks);
      }
    }

    // Check Supabase Auth & Cloud Sync
    const loadCloudData = async (userId: string) => {
      try {
        const { data: cloudProfile } = await fetchUserProfileFromSupabase(userId);
        if (cloudProfile) {
          const mappedIntake: UserIntake = {
            targetCity: cloudProfile.target_city || DEFAULT_INTAKE.targetCity,
            institution: cloudProfile.institution || DEFAULT_INTAKE.institution,
            visa_type: cloudProfile.visa_type || DEFAULT_INTAKE.visa_type,
            intakeMonth: cloudProfile.intake_month || DEFAULT_INTAKE.intakeMonth,
            arrival_date: cloudProfile.arrival_date || DEFAULT_INTAKE.arrival_date,
            hasGIC: cloudProfile.has_gic || DEFAULT_INTAKE.hasGIC,
            gicAmountTier: cloudProfile.gic_tier || DEFAULT_INTAKE.gicAmountTier,
            hasHousing: cloudProfile.has_housing || DEFAULT_INTAKE.hasHousing,
            hasSim: cloudProfile.has_sim || DEFAULT_INTAKE.hasSim,
          };
          setIntake(mappedIntake);
          if (typeof window !== "undefined") {
            localStorage.setItem("waterloo_newcomer_intake", JSON.stringify(mappedIntake));
          }
        }

        const { data: cloudTasks } = await fetchUserTasksFromSupabase(userId);
        if (cloudTasks && Array.isArray(cloudTasks) && cloudTasks.length > 0) {
          setTasks((prev) => {
            const merged = prev.map((task) => {
              const ct = cloudTasks.find((c: any) => c.task_id === task.id);
              return ct ? { ...task, isComplete: Boolean(ct.status) } : task;
            });
            if (typeof window !== "undefined") {
              localStorage.setItem("waterloo_newcomer_tasks", JSON.stringify(merged));
            }
            return merged;
          });
        }
      } catch (err) {
        console.warn("[DASHBOARD] Cloud sync hydration warning:", err);
      }
    };

    getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
        loadCloudData(user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user) {
        loadCloudData(user.id);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Save tasks to LocalStorage and trigger Cloud Sync
  const handleTaskToggle = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.isComplete;
          syncTaskStatusToSupabase(currentUser?.id || "guest-user-1", taskId, nextState);
          return { ...t, isComplete: nextState };
        }
        return t;
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("waterloo_newcomer_tasks", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleResetTasks = () => {
    if (typeof window !== "undefined") {
      if (window.confirm("Reset all task completions back to initial state?")) {
        const freshTasks = getTasksForRegion(intake.targetCity);
        setTasks(freshTasks);
        localStorage.setItem("waterloo_newcomer_tasks", JSON.stringify(freshTasks));
      }
    }
  };

  // Compute stats for settlement checklist (Focus on Priority 1 & 2)
  const stats: ChecklistStats = useMemo(() => {
    const checklistTasks = tasks.filter((t) => t.priorityTier !== "tier_3_perks");
    const total = checklistTasks.length;
    const completed = checklistTasks.filter((t) => t.isComplete).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const criticalPending = checklistTasks.filter((t) => t.priorityTier === "tier_1_mandatory" && !t.isComplete).length;

    const stageProgress: Record<TimelineStage, { total: number; completed: number; percentage: number }> = {
      t_minus_45: { total: 0, completed: 0, percentage: 0 },
      transit_border: { total: 0, completed: 0, percentage: 0 },
      post_arrival: { total: 0, completed: 0, percentage: 0 },
    };

    TIMELINE_STAGES.forEach((st) => {
      const stageTasks = checklistTasks.filter((t) => t.timelineStage === st.id);
      const stageDone = stageTasks.filter((t) => t.isComplete).length;
      stageProgress[st.id] = {
        total: stageTasks.length,
        completed: stageDone,
        percentage: stageTasks.length > 0 ? Math.round((stageDone / stageTasks.length) * 100) : 0,
      };
    });

    const tierProgress: Record<PriorityTier, { total: number; completed: number; percentage: number }> = {
      tier_1_mandatory: { total: 0, completed: 0, percentage: 0 },
      tier_2_essential: { total: 0, completed: 0, percentage: 0 },
      tier_3_perks: { total: 0, completed: 0, percentage: 0 },
    };

    (["tier_1_mandatory", "tier_2_essential", "tier_3_perks"] as PriorityTier[]).forEach((tier) => {
      const tierTasks = tasks.filter((t) => t.priorityTier === tier);
      const tierDone = tierTasks.filter((t) => t.isComplete).length;
      tierProgress[tier] = {
        total: tierTasks.length,
        completed: tierDone,
        percentage: tierTasks.length > 0 ? Math.round((tierDone / tierTasks.length) * 100) : 0,
      };
    });

    return {
      total,
      completed,
      percentage,
      criticalPending,
      stageProgress,
      tierProgress,
    };
  }, [tasks]);

  // Counts for active view
  const taskCounts = useMemo(() => {
    const stageTasks = tasks.filter(
      (t) => t.timelineStage === currentStage && t.priorityTier !== "tier_3_perks"
    );
    return {
      all: stageTasks.length,
      pending: stageTasks.filter((t) => !t.isComplete).length,
      completed: stageTasks.filter((t) => t.isComplete).length,
      affiliates: stageTasks.filter((t) => t.isAffiliate).length,
      tier1: stageTasks.filter((t) => t.priorityTier === "tier_1_mandatory").length,
      tier2: stageTasks.filter((t) => t.priorityTier === "tier_2_essential").length,
      tier3: stageTasks.filter((t) => t.priorityTier === "tier_3_perks").length,
    };
  }, [tasks, currentStage]);

  // Filtered tasks for current stage & active criteria
  const displayedTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.priorityTier === "tier_3_perks") return false;
      if (task.timelineStage !== currentStage) return false;
      if (selectedTier !== "all" && task.priorityTier !== selectedTier) return false;
      if (selectedCategory !== "all" && task.category !== selectedCategory) return false;
      if (statusFilter === "pending" && task.isComplete) return false;
      if (statusFilter === "completed" && !task.isComplete) return false;
      if (statusFilter === "affiliates" && !task.isAffiliate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description.toLowerCase().includes(q);
        const matchTip = task.localWaterlooTip?.toLowerCase().includes(q) || false;
        const matchPartner = task.affiliatePartner?.toLowerCase().includes(q) || false;
        return matchTitle || matchDesc || matchTip || matchPartner;
      }

      return true;
    });
  }, [tasks, currentStage, selectedTier, selectedCategory, statusFilter, searchQuery]);

  const currentStageInfo = TIMELINE_STAGES.find((s) => s.id === currentStage);

  const exportSummaryText = useMemo(() => {
    const lines = [
      `=====================================================`,
      `PASSPORTPERK // CANADIAN PRE-ARRIVAL SETTLEMENT GUIDE`,
      `=====================================================`,
      `Destination: ${intake?.targetCity || "Waterloo Region, ON"}`,
      `Institution: ${intake?.institution || "Post-Secondary / Tech"}`,
      `Visa Stream: ${intake?.visa_type || "Standard Study Permit"}`,
      `Target Intake: ${intake?.intakeMonth || "Fall 2026"}`,
      `Expected Arrival: ${intake?.arrival_date || "2026-09-01"}`,
      `Progress: ${stats.completed}/${stats.total} tasks completed (${stats.percentage}%)`,
      `Essential Steps Completed: ${stats.tierProgress.tier_1_mandatory.completed}/${stats.tierProgress.tier_1_mandatory.total}`,
      `-----------------------------------------------------`,
      `CHECKLIST TASKS:`,
      `-----------------------------------------------------`,
    ];

    const tierLabels: Record<PriorityTier, string> = {
      tier_1_mandatory: "PRIORITY 1: ESSENTIAL FIRST STEPS",
      tier_2_essential: "PRIORITY 2: HELPFUL SETUP",
      tier_3_perks: "PRIORITY 3: STUDENT PERKS & SAVINGS",
    };

    (["tier_1_mandatory", "tier_2_essential"] as PriorityTier[]).forEach((tier) => {
      lines.push(`\n>>> ${tierLabels[tier]} <<<`);
      const tierTasks = tasks.filter((t) => t.priorityTier === tier);
      tierTasks.forEach((t) => {
        lines.push(`  [${t.isComplete ? "X" : " "}] ${t.title} (${t.category.toUpperCase()})`);
        if (t.isAffiliate && t.affiliatePartner) {
          lines.push(`      Featured Offer: ${t.affiliateBadge || t.affiliatePartner}`);
        }
        if (t.localWaterlooTip) {
          lines.push(`      Regional Tip: ${t.localWaterlooTip}`);
        }
      });
    });

    lines.push(`\nGenerated via PassportPerk Canadian Settlement Hub (https://passportperk.com) on ${new Date().toLocaleDateString()}`);
    return lines.join("\n");
  }, [intake, stats, tasks]);

  const handleCopySummary = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(exportSummaryText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Dynamic Header & Progress stats */}
      <DashboardHeader
        intake={intake}
        stats={stats}
        onResetTasks={handleResetTasks}
        onExportSummary={() => setIsExportModalOpen(true)}
      />

      {/* Featured Banner: Link to Dedicated Perks Hub & Marketplace */}
      <div className="bg-[#0d1322]/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                Student Perks & Banking Hub
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                $1,250+ Savings
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
              5-Bank Comparison Suite & Exclusive Discounts
            </h4>
            <p className="text-xs text-zinc-400">
              Compare Scotiabank, CIBC, TD, RBC, and Simplii + claim 15% off eSIM, SPC discounts & grocery points.
            </p>
          </div>
        </div>

        <Link href="/dashboard/perks" className="self-start sm:self-auto">
          <Button variant="affiliate" size="sm" className="gap-1.5 whitespace-nowrap shadow-2xs">
            <span>Explore Perks Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Timeline Stage Stepper (Phase 01, 02, 03) */}
      <section className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
            Settlement Timeline
          </h2>
          <span className="text-xs text-zinc-400 font-medium">
            Click any phase to view action cards
          </span>
        </div>
        <TimelineStepper
          stages={TIMELINE_STAGES}
          currentStage={currentStage}
          onSelectStage={setCurrentStage}
          stageProgress={stats.stageProgress}
        />
      </section>

      {/* Task Filters (Tiers, Search, Status & Categories) */}
      <section className="w-full">
        <TaskFilter
          selectedTier={selectedTier}
          onSelectTier={setSelectedTier}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          statusFilter={statusFilter}
          onSelectStatus={setStatusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          taskCounts={taskCounts}
        />
      </section>

      {/* Active Stage Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
            {currentStageInfo?.badge} • {currentStageInfo?.timeframe}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
            {currentStageInfo?.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {currentStageInfo?.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-medium">
          <span>Showing {displayedTasks.length} tasks</span>
        </div>
      </div>

      {/* Task Cards List */}
      <section className="w-full space-y-4">
        <AnimatePresence mode="popLayout">
          {displayedTasks.length > 0 ? (
            displayedTasks.map((task) => (
              <TaskCardItem
                key={task.id}
                task={task}
                onToggle={handleTaskToggle}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex flex-col items-center gap-3 shadow-2xs"
            >
              <AlertCircle className="w-8 h-8 text-zinc-500" />
              <h4 className="text-base font-bold text-white">No tasks match your filters</h4>
              <p className="text-xs text-zinc-400 max-w-sm">
                Try resetting your search query or switching to &apos;All Priorities&apos; / &apos;All Categories&apos;.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedTier("all");
                  setSelectedCategory("all");
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Bottom Stage Navigation CTA */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
        {currentStage === "t_minus_45" ? (
          <div />
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (currentStage === "post_arrival") setCurrentStage("transit_border");
              else if (currentStage === "transit_border") setCurrentStage("t_minus_45");
            }}
          >
            ← Previous Phase
          </Button>
        )}

        {currentStage === "post_arrival" ? (
          <div className="flex items-center gap-2">
            <Link href="/dashboard/documents">
              <Button variant="secondary" size="sm">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Verify Documents</span>
              </Button>
            </Link>
            <Button
              variant="affiliate"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Guide</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (currentStage === "t_minus_45") setCurrentStage("transit_border");
              else if (currentStage === "transit_border") setCurrentStage("post_arrival");
            }}
          >
            <span>Next Phase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Community Contribution & Bug Report Footer Link Bar */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Notice an outdated requirement, broken link, or know a student discount?</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openFeedbackModal("bug_report")}
            className="text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-500/10 cursor-pointer"
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span>Report Bug</span>
          </button>
          <button
            type="button"
            onClick={() => openFeedbackModal("perk_suggestion")}
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-500/10 cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Submit a Perk / Deal</span>
          </button>
        </div>
      </div>

      {/* Export Summary Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d1322] border border-white/[0.12] rounded-3xl max-w-2xl w-full p-6 sm:p-8 flex flex-col gap-4 shadow-2xl relative text-zinc-100"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    Canadian Pre-Arrival Settlement Guide
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Print or copy your personalized settlement checklist for {intake.targetCity}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-zinc-400 hover:text-white text-sm font-semibold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Pre-formatted text */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 font-mono text-xs text-zinc-300 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {exportSummaryText}
              </div>

              {/* Modal footer controls */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant={copiedText ? "secondary" : "primary"}
                    size="sm"
                    onClick={handleCopySummary}
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
