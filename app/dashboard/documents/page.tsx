"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Clock,
  ArrowRight,
  FolderLock,
  Layers,
  FileCheck,
  Info,
  Luggage,
  Check,
  Plane,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { syncTaskStatusToSupabase } from "@/lib/supabase";
import { triggerConfetti } from "@/lib/confetti";

interface POEDocument {
  id: string;
  title: string;
  shortLabel: string;
  category: "immigration" | "medical" | "academic_housing" | "financial";
  isMandatoryCBSA: boolean;
  cbsaWarning?: string;
  copiesRequired: string;
  description: string;
  officialSourceUrl?: string;
  officialSourceLabel?: string;
}

const POE_DOCUMENTS: POEDocument[] = [
  {
    id: "doc-passport-trv",
    title: "Original Passport with Valid TRV / eTA Foil",
    shortLabel: "Passport & TRV",
    category: "immigration",
    isMandatoryCBSA: true,
    copiesRequired: "Original + 2 Photocopies",
    cbsaWarning: "Ensure passport has at least 6 months validity past your intended study/work period.",
    description:
      "Your physical passport containing the counterfoil Temporary Resident Visa (TRV) or electronic Travel Authorization (eTA) linked to your passport number.",
    officialSourceUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare-arrival.html",
    officialSourceLabel: "IRCC Entry Guidelines",
  },
  {
    id: "doc-poe-letter",
    title: "IRCC Port of Entry (POE) Letter of Introduction",
    shortLabel: "POE Approval Letter",
    category: "immigration",
    isMandatoryCBSA: true,
    copiesRequired: "2 Physical Printed Copies",
    cbsaWarning: "The CBSA border officer will scan this letter to print your physical Study Permit. Verify before leaving the counter that the conditions remark confirms authorization to work off-campus up to 24 hrs/week (IRCC rule in effect since November 2024).",
    description:
      "The official approval letter from IRCC confirming your permit. Present this to the Canada Border Services Agency (CBSA) officer upon landing at YYZ or YVR.",
    officialSourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare-arrival.html",
    officialSourceLabel: "IRCC POE Guidelines",
  },
  {
    id: "doc-loa-pal",
    title: "Official Letter of Acceptance (LOA) & Provincial Attestation Letter (PAL)",
    shortLabel: "Letter of Acceptance",
    category: "immigration",
    isMandatoryCBSA: true,
    copiesRequired: "2 Physical Printed Copies",
    cbsaWarning: "Must display your Designated Learning Institution (DLI) number and program start date.",
    description:
      "Your unconditional Letter of Acceptance from the University of Waterloo, Laurier, UofT, UBC, or college, together with the Provincial Attestation Letter (PAL).",
  },
  {
    id: "doc-gic-proof-funds",
    title: "Proof of Financial Support ($20,635 or $23,448 CAD GIC Certificate)",
    shortLabel: "Student GIC Certificate",
    category: "immigration",
    isMandatoryCBSA: true,
    copiesRequired: "1 Printed Certificate",
    cbsaWarning: "Both $20,635 CAD (prior rule) and $23,448 CAD (current rule) bank certificates are fully accepted by CBSA border officers.",
    description:
      "The official GIC Confirmation letter issued by Scotiabank, CIBC, TD, RBC, or Simplii Financial verifying living expense funds held in trust.",
  },
  {
    id: "doc-tuition-receipt",
    title: "First-Year Tuition Fee Official Payment Receipt",
    shortLabel: "Tuition Receipt",
    category: "immigration",
    isMandatoryCBSA: true,
    copiesRequired: "1 Printed Copy",
    cbsaWarning: "Official university registrar statement or CIBC/Flywire receipt confirming tuition payment.",
    description:
      "Receipt confirming your first term or first-year tuition has been paid to your institution.",
  },
  {
    id: "doc-ime-medical",
    title: "Immigration Medical Exam (IME) e-Medical Sheet",
    shortLabel: "IME Medical Sheet",
    category: "medical",
    isMandatoryCBSA: false,
    copiesRequired: "1 Printed Copy",
    cbsaWarning: "Required if you lived in a designated medical country for more than 6 months.",
    description:
      "The e-Medical information sheet provided by your panel physician with your photo and tracking number.",
  },
  {
    id: "doc-vaccination-records",
    title: "Immunization & Medical Prescription History (English)",
    shortLabel: "Vaccine & Med Records",
    category: "medical",
    isMandatoryCBSA: false,
    copiesRequired: "1 Physical Copy + Digital Backup",
    description:
      "Official vaccination records (MMR, Tetanus, Hepatitis B) and translated medical history for student health clinic registration.",
  },
  {
    id: "doc-academic-transcripts",
    title: "Official Transcripts & Degree Certificates (Originals)",
    shortLabel: "Original Transcripts",
    category: "academic_housing",
    isMandatoryCBSA: false,
    copiesRequired: "Original Sealed Copies",
    description:
      "Original physical transcripts and degree completion certificates for campus departmental verification during orientation.",
  },
  {
    id: "doc-housing-lease",
    title: "Signed Lease Agreement / Accommodation Confirmation",
    shortLabel: "Signed Lease Agreement",
    category: "academic_housing",
    isMandatoryCBSA: false,
    copiesRequired: "1 Printed Copy",
    cbsaWarning: "Border officers may inquire about the address where you will be staying in Canada.",
    description:
      "Signed Ontario Standard Lease Form 2229E, BC RTB-1 Tenancy Agreement, university residence confirmation, or temporary hotel reservation.",
  },
  {
    id: "doc-emergency-cash",
    title: "Emergency Cash in Canadian Currency ($500 - $1,000 CAD)",
    shortLabel: "Emergency Cash (CAD)",
    category: "financial",
    isMandatoryCBSA: false,
    copiesRequired: "Physical Banknotes",
    cbsaWarning: "Amounts over $10,000 CAD in cash must be declared on your CBSA Declaration form.",
    description:
      "Carrying $500 to $1,000 CAD in cash is recommended for immediate ground transit and arrival expenses before bank account activation.",
  },
];

export default function DocumentVaultPage() {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, { hardCopy: boolean; cloudBackup: boolean }>>({});
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [activeRegion, setActiveRegion] = useState<string>("Waterloo Region, ON");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const storedIntake = localStorage.getItem("waterloo_newcomer_intake");
        if (storedIntake) {
          const parsed = JSON.parse(storedIntake);
          if (parsed?.targetCity) {
            setActiveRegion(parsed.targetCity);
          }
        }

        const storedDocs = localStorage.getItem("northstar_document_vault");
        if (storedDocs) {
          setCheckedDocs(JSON.parse(storedDocs));
        }
      } catch (e) {
        // Fallback
      }

      const handleRegionEvent = (event: Event) => {
        const customEvent = event as CustomEvent<{ targetCity: string }>;
        if (customEvent.detail?.targetCity) {
          setActiveRegion(customEvent.detail.targetCity);
        }
      };

      window.addEventListener("region-changed", handleRegionEvent);
      return () => {
        window.removeEventListener("region-changed", handleRegionEvent);
      };
    }
  }, []);

  const handleToggleDoc = (docId: string, type: "hardCopy" | "cloudBackup") => {
    const current = checkedDocs[docId] || { hardCopy: false, cloudBackup: false };
    const nextVal = !current[type];
    const updated = {
      ...checkedDocs,
      [docId]: {
        ...current,
        [type]: nextVal,
      },
    };

    setCheckedDocs(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("northstar_document_vault", JSON.stringify(updated));
    }

    syncTaskStatusToSupabase("guest-user-1", `${docId}_${type}`, nextVal);

    if (nextVal && (type === "hardCopy" ? current.cloudBackup : current.hardCopy)) {
      triggerConfetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
  };

  const stats = useMemo(() => {
    const total = POE_DOCUMENTS.length;
    const mandatoryTotal = POE_DOCUMENTS.filter((d) => d.isMandatoryCBSA).length;

    let hardCopyCount = 0;
    let cloudBackupCount = 0;
    let fullyReadyCount = 0;
    let mandatoryReadyCount = 0;

    POE_DOCUMENTS.forEach((doc) => {
      const state = checkedDocs[doc.id];
      if (state?.hardCopy) hardCopyCount++;
      if (state?.cloudBackup) cloudBackupCount++;
      if (state?.hardCopy && state?.cloudBackup) fullyReadyCount++;
      if (doc.isMandatoryCBSA && state?.hardCopy) mandatoryReadyCount++;
    });

    const readinessPct = total > 0 ? Math.round((hardCopyCount / total) * 100) : 0;
    const isMandatoryComplete = mandatoryReadyCount === mandatoryTotal;

    return {
      total,
      mandatoryTotal,
      hardCopyCount,
      cloudBackupCount,
      fullyReadyCount,
      mandatoryReadyCount,
      readinessPct,
      isMandatoryComplete,
    };
  }, [checkedDocs]);

  const handlePrintPackingSlip = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const filteredDocs = POE_DOCUMENTS.filter((doc) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "mandatory") return doc.isMandatoryCBSA;
    return doc.category === filterCategory;
  });

  const mandatoryDocs = POE_DOCUMENTS.filter((d) => d.isMandatoryCBSA);

  return (
    <div className="flex flex-col gap-10">
      {/* Top Banner: Document Vault & POE Inspection Header */}
      <div className="w-full bg-[#0d1322]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" className="px-3 py-0.5 text-xs font-bold">
                <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
                <span>The Document Vault</span>
              </Badge>
              <Badge variant="zinc" className="text-xs font-mono font-semibold">
                Port of Entry (POE) Verification
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Port of Entry Document Checklist
            </h1>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Verify all physical hard copies and digital backups for smooth customs clearance at{" "}
              <strong className="text-white">Toronto Pearson (YYZ)</strong> or <strong className="text-white">Vancouver (YVR)</strong>.
            </p>
          </div>

          {/* Quick Print Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrintPackingSlip}
              className="gap-2 shadow-2xs"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Packing Slip</span>
            </Button>
          </div>
        </div>

        {/* Interactive Carry-On Bag Simulation Widget */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Luggage className="w-4 h-4 text-emerald-400" />
              <span>Visual Carry-On Bag Packing Check</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {stats.mandatoryReadyCount}/5 Essential Documents Packed
            </span>
          </div>

          {/* 5-Slot Visual Bag Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {mandatoryDocs.map((doc) => {
              const isPacked = Boolean(checkedDocs[doc.id]?.hardCopy);
              return (
                <div
                  key={doc.id}
                  className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 text-xs ${
                    isPacked
                      ? "bg-emerald-500/10 border-emerald-500/30 shadow-2xs"
                      : "bg-white/[0.03] border-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">
                      Slot {mandatoryDocs.indexOf(doc) + 1}
                    </span>
                    {isPacked ? (
                      <Check className="w-4 h-4 text-emerald-400 font-bold" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zinc-700" />
                    )}
                  </div>

                  <div>
                    <h5 className={`font-bold text-xs ${isPacked ? "text-emerald-300" : "text-zinc-200"}`}>
                      {doc.shortLabel}
                    </h5>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {isPacked ? "✓ Hard copy packed" : "Needs physical print"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Readiness Meter Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
          <div className="md:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">
                  POE Document Readiness
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {stats.hardCopyCount} of {stats.total} Hard Copies Ready
              </span>
            </div>

            <ProgressBar percentage={stats.readinessPct} size="md" showPercentage={true} />

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>
                {stats.isMandatoryComplete
                  ? "✅ All 5 primary immigration documents verified! You are well prepared for customs clearance."
                  : "💡 Keep printed hard copies of your primary immigration documents in your carry-on."}
              </span>
              <span className={stats.isMandatoryComplete ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                Primary: {stats.mandatoryReadyCount}/{stats.mandatoryTotal}
              </span>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
              Carry-On Travel Tip
            </span>
            <div className="my-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Keep in Personal Bag</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Border inspection occurs before baggage claim at Canadian airport gates.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold">
              ✓ Keep in a clear zip travel folder
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Travel Notice */}
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 flex items-start gap-3.5 shadow-2xs">
        <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-emerald-300 text-sm">
            Helpful Port of Entry Tip (2026)
          </h4>
          <p className="text-zinc-300 leading-relaxed">
            Having physical printed copies of your Passport, Port of Entry (POE) Letter of Introduction, and Letter of Acceptance (LOA) in your personal bag makes clearing border customs fast and effortless, even if your phone battery is low or roaming data is unavailable.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: `All Documents (${POE_DOCUMENTS.length})` },
          { id: "mandatory", label: `Essential POE (${stats.mandatoryTotal})` },
          { id: "immigration", label: "Immigration & Identity" },
          { id: "medical", label: "Medical & Health" },
          { id: "academic_housing", label: "Academic & Housing" },
          { id: "financial", label: "Financial & Emergency" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilterCategory(f.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filterCategory === f.id
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-2xs"
                : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Document Checklist Items */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => {
          const state = checkedDocs[doc.id] || { hardCopy: false, cloudBackup: false };

          return (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className={`border rounded-2xl p-5 sm:p-6 transition-all flex flex-col gap-4 ${
                state.hardCopy
                  ? "border-emerald-500/25 bg-[#0d1322]/50 shadow-2xs"
                  : "bg-[#0d1322]/80 backdrop-blur-xl border-white/[0.08] hover:border-white/[0.18] hover:shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {doc.isMandatoryCBSA ? (
                      <Badge variant="emerald" className="font-bold text-[11px]">
                        ★ Essential POE Document
                      </Badge>
                    ) : (
                      <Badge variant="zinc" className="text-[11px] font-medium">
                        Helpful Supporting
                      </Badge>
                    )}
                    <Badge variant="zinc" className="text-[10px] font-mono uppercase font-semibold">
                      {doc.category.replace("_", " & ")}
                    </Badge>
                    <span className="text-xs font-mono text-zinc-400">
                      Recommendation: <strong className="text-zinc-200">{doc.copiesRequired}</strong>
                    </span>
                  </div>

                  <h3
                    className={`text-base sm:text-lg font-bold tracking-tight ${
                      state.hardCopy ? "text-zinc-300" : "text-white"
                    }`}
                  >
                    {doc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {doc.description}
                  </p>

                  {doc.cbsaWarning && (
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-xs text-zinc-300">
                      <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{doc.cbsaWarning}</span>
                    </div>
                  )}
                </div>

                {/* Verification Checkbox Controls */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.08]">
                  {/* Physical Hard Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleDoc(doc.id, "hardCopy")}
                    className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                      state.hardCopy
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-2xs font-bold"
                        : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white"
                    }`}
                  >
                    {state.hardCopy ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-500 stroke-[1.8]" />
                    )}
                    <span>Physical Copy Packed</span>
                  </button>

                  {/* Digital Cloud Backup Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleDoc(doc.id, "cloudBackup")}
                    className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                      state.cloudBackup
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold"
                        : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white"
                    }`}
                  >
                    {state.cloudBackup ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-500 stroke-[1.8]" />
                    )}
                    <span>Digital Backup Saved</span>
                  </button>
                </div>
              </div>

              {/* Official Source Link */}
              {doc.officialSourceUrl && (
                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono text-[11px]">Official Resource:</span>
                  <a
                    href={doc.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <span>{doc.officialSourceLabel || "Official IRCC Source"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Navigation CTA */}
      <div className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div>
          <h4 className="text-base font-bold text-white">
            Finished packing your POE Document Carry-On?
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Continue to the interactive checklist or explore student banking and perks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/perks">
            <Button variant="secondary" size="sm" className="shadow-2xs">
              Perks & Offers
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
              <span>Back to Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
