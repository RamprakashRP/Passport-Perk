"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  GraduationCap,
  Calendar,
  CreditCard,
  Smartphone,
  Home,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { UserIntake, TargetCity, TargetInstitution, VisaType } from "@/types";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/telemetry";
import { saveUserProfileToSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const CITIES: { id: TargetCity; label: string; desc: string; badge: string }[] = [
  {
    id: "Waterloo Region, ON",
    label: "Waterloo Region, ON",
    desc: "Home to UW, Laurier, Conestoga, and Canada's Silicon Valley Tech Corridor",
    badge: "ION LRT • University District",
  },
  {
    id: "Toronto / Greater Toronto Area, ON",
    label: "Toronto / GTA, ON",
    desc: "Downtown Toronto, UofT, TMU, York, and Canada's premier financial hub",
    badge: "TTC Subway • Union Pearson Express",
  },
  {
    id: "Vancouver / British Columbia, BC",
    label: "Vancouver / BC",
    desc: "UBC Point Grey, Simon Fraser, BCIT, and the Pacific Tech Hub",
    badge: "TransLink SkyTrain • YVR Gateway",
  },
];

const INSTITUTIONS_BY_CITY: Record<TargetCity, { id: TargetInstitution; label: string; badge: string }[]> = {
  "Waterloo Region, ON": [
    {
      id: "University of Waterloo (UW)",
      label: "University of Waterloo",
      badge: "UW Main Campus & WatCard",
    },
    {
      id: "Wilfrid Laurier University (WLU)",
      label: "Wilfrid Laurier University",
      badge: "Laurier Golden Hawks & OneCard",
    },
    {
      id: "Conestoga College",
      label: "Conestoga College",
      badge: "Doon & Waterloo Campuses",
    },
    {
      id: "Tech Professional / Relocating Specialist",
      label: "Tech & Relocating Professional",
      badge: "Waterloo Tech Ecosystem",
    },
  ],
  "Toronto / Greater Toronto Area, ON": [
    {
      id: "University of Toronto (UofT)",
      label: "University of Toronto (UofT)",
      badge: "St. George, Mississauga & Scarborough",
    },
    {
      id: "Toronto Metropolitan University (TMU)",
      label: "Toronto Metropolitan University",
      badge: "Downtown Toronto & Yonge-Dundas",
    },
    {
      id: "York University",
      label: "York University",
      badge: "Keele & Glendon Campuses",
    },
    {
      id: "Humber / Seneca College",
      label: "Humber / Seneca College",
      badge: "GTA Post-Secondary Campuses",
    },
    {
      id: "Tech Professional / Relocating Specialist",
      label: "Tech & Corporate Professional",
      badge: "Toronto Financial & Tech District",
    },
  ],
  "Vancouver / British Columbia, BC": [
    {
      id: "University of British Columbia (UBC)",
      label: "University of British Columbia (UBC)",
      badge: "Point Grey Vancouver Campus",
    },
    {
      id: "Simon Fraser University (SFU)",
      label: "Simon Fraser University (SFU)",
      badge: "Burnaby Mountain & Surrey",
    },
    {
      id: "BCIT / Langara College",
      label: "BCIT / Langara College",
      badge: "Burnaby & Vancouver Campuses",
    },
    {
      id: "Tech Professional / Relocating Specialist",
      label: "Tech & Relocating Professional",
      badge: "Vancouver Pacific Tech Corridor",
    },
  ],
};

const VISA_TYPES: { id: VisaType; label: string; desc: string }[] = [
  {
    id: "Standard Study Permit",
    label: "Standard Study Permit",
    desc: "Official international post-secondary study authorization",
  },
  {
    id: "Post-Graduation Work Permit (PGWP)",
    label: "Post-Graduation Work Permit (PGWP)",
    desc: "Transitioning to Canadian full-time professional employment",
  },
  {
    id: "Work Permit (LMIA / C10)",
    label: "Work Permit (LMIA / C10)",
    desc: "Employer-sponsored or intra-company transfer authorization",
  },
  {
    id: "Permanent Resident (Express Entry / PNP)",
    label: "Permanent Resident (PR Landing)",
    desc: "Ontario OINP / BC PNP / Express Entry Federal landing",
  },
];

const INTAKE_MONTHS = [
  "September 2026 (Fall Term)",
  "January 2027 (Winter Term)",
  "May 2027 (Spring Term)",
  "September 2027 (Fall Term)",
];

export function IntakeForm() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Preload saved intake if user already configured one
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("waterloo_newcomer_intake");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.targetCity) {
            setFormData((prev) => ({
              ...prev,
              ...parsed,
            }));
          }
        }
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  // Form State
  const [formData, setFormData] = useState<UserIntake>({
    targetCity: "Waterloo Region, ON",
    institution: "University of Waterloo (UW)",
    visa_type: "Standard Study Permit",
    intakeMonth: "September 2026 (Fall Term)",
    arrival_date: "2026-09-01",
    hasGIC: "no",
    gicAmountTier: "20635",
    hasHousing: "searching",
    hasSim: "no",
  });

  const handleCitySelect = (cityId: TargetCity) => {
    const defaultInst = INSTITUTIONS_BY_CITY[cityId][0].id;
    setFormData((prev) => ({
      ...prev,
      targetCity: cityId,
      institution: defaultInst,
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const intakePayload = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("waterloo_newcomer_intake", JSON.stringify(intakePayload));
      localStorage.removeItem("waterloo_newcomer_tasks");
    }

    // Silently save profile to Supabase if logged in or anonymous
    saveUserProfileToSupabase(intakePayload).catch((err) => {
      console.warn("[INTAKE] Cloud profile save skipped or errored:", err);
    });

    trackEvent("intake_completed", {
      target_city: formData.targetCity,
      institution: formData.institution,
      visa_type: formData.visa_type,
      intake_month: formData.intakeMonth,
      has_gic: formData.hasGIC,
      gic_tier: formData.gicAmountTier,
      has_housing: formData.hasHousing,
      has_sim: formData.hasSim,
      position_on_page: "onboarding_wizard_step_3",
      user_intake_stage: "t_minus_45",
    });

    router.push("/dashboard");
  };

  const currentInstitutions = INSTITUTIONS_BY_CITY[formData.targetCity] || INSTITUTIONS_BY_CITY["Waterloo Region, ON"];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card variant="glass" className="border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden bg-[#0d1322]/85 backdrop-blur-2xl rounded-3xl">
        {/* Top Progress bar for the 3 steps */}
        <div className="w-full bg-white/[0.02] border-b border-white/[0.08] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200",
                    step === s
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      : step > s
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/[0.08] text-zinc-400 border border-white/[0.08]"
                  )}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : s}
                </div>
                <span
                  className={cn(
                    "text-xs hidden sm:inline font-semibold",
                    step === s ? "text-white font-bold" : "text-zinc-400"
                  )}
                >
                  {s === 1 ? "Destination Region" : s === 2 ? "Status & Date" : "Readiness Audit"}
                </span>
                {s < 3 && <div className="w-4 sm:w-8 h-[1px] bg-white/[0.08]" />}
              </div>
            ))}
          </div>

          <Badge variant="emerald" className="font-mono text-[11px] font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            Step {step} of 3
          </Badge>
        </div>

        {/* Reassuring Data Usage Notice */}
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 sm:px-6 py-2.5 flex items-center gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <p className="leading-snug">
            <strong className="font-semibold text-emerald-200">Privacy Note:</strong> This information is strictly used to create your personalized settlement checklist. Your answers remain private to you.
          </p>
        </div>

        {/* Step Contents */}
        <CardContent className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <Badge variant="blue" className="mb-2">
                    Step 01: Destination
                  </Badge>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                    Where will you be landing in Canada?
                  </CardTitle>
                  <CardDescription className="mt-1 text-zinc-400">
                    Select your destination city to load localized public transit (ION LRT, TTC, SkyTrain), Service Canada locations, and regional housing guidance.
                  </CardDescription>
                </div>

                {/* Target City Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
                    Destination Region (Dynamic City Router)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CITIES.map((city) => {
                      const isSelected = formData.targetCity === city.id;
                      return (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => handleCitySelect(city.id)}
                          className={cn(
                            "p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-2.5 cursor-pointer",
                            isSelected
                              ? "bg-emerald-500/15 border-emerald-500/60 ring-2 ring-emerald-500/30 text-white shadow-[0_0_25px_rgba(16,185,129,0.18)]"
                              : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.06] text-zinc-300"
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-white">{city.label}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                            </div>
                            <span className="text-[11px] font-mono text-emerald-400 font-semibold block mt-1">
                              {city.badge}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400 leading-snug">{city.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Institution Selection */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
                    Academic Institution or Affiliation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentInstitutions.map((inst) => {
                      const isSelected = formData.institution === inst.id;
                      return (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, institution: inst.id })}
                          className={cn(
                            "p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-1 cursor-pointer",
                            isSelected
                              ? "bg-emerald-500/15 border-emerald-500/60 ring-2 ring-emerald-500/30 text-white shadow-[0_0_25px_rgba(16,185,129,0.18)]"
                              : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.06] text-zinc-300"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white">{inst.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <span className="text-xs text-emerald-400 font-mono font-medium">{inst.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <Badge variant="blue" className="mb-2">
                    Step 02: Visa & Timeline
                  </Badge>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                    What is your immigration status & arrival date?
                  </CardTitle>
                  <CardDescription className="mt-1 text-zinc-400">
                    We tailor your checklist according to official 2026 IRCC timelines and proof of funds guidelines.
                  </CardDescription>
                </div>

                {/* Visa Stream */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
                    Immigration & Visa Category (IRCC 2026)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {VISA_TYPES.map((visa) => {
                      const isSelected = formData.visa_type === visa.id;
                      return (
                        <button
                          key={visa.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, visa_type: visa.id })}
                          className={cn(
                            "p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-1 cursor-pointer",
                            isSelected
                              ? "bg-emerald-500/15 border-emerald-500/60 ring-2 ring-emerald-500/30 text-white shadow-[0_0_25px_rgba(16,185,129,0.18)]"
                              : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.06] text-zinc-300"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white">{visa.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <span className="text-xs text-zinc-400 leading-snug">{visa.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Intake Term & Estimated Arrival Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
                      Target Academic Intake
                    </label>
                    <select
                      value={formData.intakeMonth}
                      onChange={(e) => setFormData({ ...formData, intakeMonth: e.target.value })}
                      className="w-full bg-[#111726] border border-white/[0.12] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-medium"
                    >
                      {INTAKE_MONTHS.map((term) => (
                        <option key={term} value={term} className="bg-[#111726] text-white">
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
                      Expected Arrival Date in Canada
                    </label>
                    <input
                      type="date"
                      value={formData.arrival_date}
                      onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                      className="w-full bg-[#111726] border border-white/[0.12] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <Badge variant="emerald" className="mb-2">
                    Step 03: Settlement Audit
                  </Badge>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                    Let&apos;s check your initial preparations
                  </CardTitle>
                  <CardDescription className="mt-1 text-zinc-400">
                    We&apos;ll configure your personalized roadmap with 5-bank comparison data and regional settlement resources.
                  </CardDescription>
                </div>

                {/* Audit Item 1: Banking GIC */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Canadian Student GIC (Living Expenses)
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Have you funded your GIC certificate with a Canadian bank?
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>
                      <strong className="text-emerald-200">Already paid?</strong> If you applied for your study permit under the previous <strong>$20,635 CAD</strong> rule, your GIC certificate is 100% valid at the Canadian border. No top-up needed.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {[
                      {
                        id: "yes_20635",
                        tier: "20635" as const,
                        label: "Paid $20,635 CAD",
                        sub: "Previous rate • Fully approved",
                      },
                      {
                        id: "yes_23448",
                        tier: "23448" as const,
                        label: "Paid $23,448 CAD",
                        sub: "Current rate • 2026/2027 guideline",
                      },
                      {
                        id: "in_progress",
                        tier: "20635" as const,
                        label: "In Progress / Processing",
                        sub: "Transferring funds to bank",
                      },
                      {
                        id: "no",
                        tier: "23448" as const,
                        label: "Not Yet Started",
                        sub: "Need 5-bank comparison guide",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            hasGIC: opt.id as any,
                            gicAmountTier: opt.tier,
                          })
                        }
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-0.5",
                          formData.hasGIC === opt.id
                            ? "bg-emerald-500/20 text-white border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            : "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:bg-white/[0.06]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{opt.label}</span>
                          {formData.hasGIC === opt.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px]",
                            formData.hasGIC === opt.id ? "text-emerald-300" : "text-zinc-400"
                          )}
                        >
                          {opt.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audit Item 2: Housing */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {formData.targetCity.split(",")[0]} Accommodation / Lease
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {formData.targetCity === "Vancouver / British Columbia, BC"
                          ? "Have you arranged housing or temporary accommodations in Metro Vancouver?"
                          : "Have you arranged student housing or a verified lease agreement?"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { id: "yes", label: "Signed Lease" },
                      { id: "searching", label: "Actively Searching" },
                      { id: "no", label: "Need Housing Guide" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, hasHousing: opt.id as any })}
                        className={cn(
                          "py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer",
                          formData.hasHousing === opt.id
                            ? "bg-amber-500/20 text-white border-amber-500/60 ring-1 ring-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                            : "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:bg-white/[0.06]"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audit Item 3: eSIM */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Canadian Mobile eSIM Setup
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Do you have a Canadian mobile plan ready for airport touchdown?
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { id: "yes", label: "Yes, eSIM Ready" },
                      { id: "no", label: "No, Need eSIM (15% Off)" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, hasSim: opt.id as any })}
                        className={cn(
                          "py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer",
                          formData.hasSim === opt.id
                            ? "bg-blue-500/20 text-white border-blue-500/60 ring-1 ring-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            : "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:bg-white/[0.06]"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between">
            {step > 1 ? (
              <Button variant="secondary" onClick={handleBack} size="md">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant={step === 3 ? "affiliate" : "primary"}
              onClick={handleNext}
              size="md"
              className="gap-2"
            >
              <span>{step === 3 ? `Generate My ${formData.targetCity.split(",")[0]} Roadmap` : "Continue"}</span>
              {step === 3 ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
