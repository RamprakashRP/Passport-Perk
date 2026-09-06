"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Smartphone,
  Tag,
  ShieldCheck,
  ShoppingBag,
  Bus,
  Home,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Circle,
  ArrowRight,
  MapPin,
  Clock,
  Calculator,
} from "lucide-react";
import { BankComparisonMatrix } from "@/components/features/bank-comparison-matrix";
import { SubmitPerkCard } from "@/components/features/submit-perk-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleOutboundClick } from "@/lib/telemetry";
import { syncTaskStatusToSupabase } from "@/lib/supabase";
import { triggerConfetti } from "@/lib/confetti";

interface PerkItem {
  id: string;
  partnerId: string;
  category: "banking" | "telecom" | "lifestyle" | "transit" | "housing";
  title: string;
  partnerName: string;
  badge: string;
  valueNum: number;
  valueEst: string;
  description: string;
  promoCode?: string;
  keyPerks: string[];
  ctaLabel: string;
  ctaLink: string;
  regionSpecific?: "Waterloo" | "Toronto" | "Vancouver" | "All";
}

const EXCLUSIVE_PERKS: PerkItem[] = [
  {
    id: "perk-esim-phonebox",
    partnerId: "phonebox_airalo_esim",
    category: "telecom",
    title: "Canadian 5G eSIM Instant Activation",
    partnerName: "Airalo / PhoneBox Canada",
    badge: "15% Exclusive Student Discount",
    valueNum: 35,
    valueEst: "$35 CAD Saved",
    description:
      "Activate an authentic Canadian mobile eSIM before boarding your flight. Zero airport roaming charges, instant QR code install, and 5G data the second you land in Canada.",
    promoCode: "CANADA15",
    keyPerks: [
      "15% off any 10GB - 50GB 30-day Canadian data package",
      "Instant eSIM profile download to Apple/Google Wallet",
      "Local Canadian +1 phone number included for landlord & banking calls",
    ],
    ctaLabel: "Claim 15% Off eSIM",
    ctaLink: "https://www.airalo.com/canada-esim?ref=newcomerengine",
    regionSpecific: "All",
  },
  {
    id: "perk-spc-discount-card",
    partnerId: "spc_student_discount",
    category: "lifestyle",
    title: "SPC+ (Student Price Card) Membership",
    partnerName: "SPC Canada / CIBC Student Partner",
    badge: "Free with CIBC / $11.99 Value",
    valueNum: 250,
    valueEst: "$250+ CAD / Year",
    description:
      "Canada's #1 student discount membership. Unlock 10% to 25% instant discounts on 450+ top Canadian brands including Apple, Samsung, DoorDash, Adidas, H&M, and Rexall.",
    promoCode: "STUDENT2026",
    keyPerks: [
      "10-25% off food, fashion, technology, and travel across Canada",
      "Free 1-year digital membership when opening a CIBC Student Account",
      "Instant barcode scan via SPC Mobile iOS/Android App",
    ],
    ctaLabel: "Unlock Free SPC+ Membership",
    ctaLink: "https://www.spccard.ca/?ref=newcomerengine",
    regionSpecific: "All",
  },
  {
    id: "perk-pc-optimum-grocery",
    partnerId: "pc_optimum_rewards",
    category: "lifestyle",
    title: "PC Optimum Grocery & Pharmacy Rewards",
    partnerName: "Loblaws / Shoppers Drug Mart",
    badge: "Up to 30% Back in Free Groceries",
    valueNum: 300,
    valueEst: "$300+ CAD / Year",
    description:
      "Earn points on everyday student grocery shopping at Zehrs, No Frills, Loblaws, and Shoppers Drug Mart. Redeem 10,000 points for $10 CAD off at the checkout register.",
    keyPerks: [
      "Targeted weekly student coupons on milk, eggs, pantry staples, and produce",
      "20x Points events at Shoppers Drug Mart (30% equivalent cash back)",
      "Zero annual fees; digital card stored in Apple/Google Wallet",
    ],
    ctaLabel: "Join Free PC Optimum Program",
    ctaLink: "https://www.pcoptimum.ca/",
    regionSpecific: "All",
  },
  {
    id: "perk-go-transit-waterloo",
    partnerId: "go_transit_ontario",
    category: "transit",
    title: "GO Transit Student Discount (Route 25 to UW/Laurier)",
    partnerName: "Metrolinx GO Transit",
    badge: "40% Off Adult Fares",
    valueNum: 120,
    valueEst: "$120+ CAD Saved",
    description:
      "Travel from Toronto Pearson Airport / Square One directly to University of Waterloo Davis Centre & Laurier for under $15 CAD using post-secondary PRESTO discount fares.",
    keyPerks: [
      "Direct highway express coach with free Wi-Fi and power plugs",
      "Seamless bus drop-off directly on University of Waterloo campus",
      "40% fare discount linked automatically to your PRESTO card",
    ],
    ctaLabel: "Setup PRESTO Student Transit Discount",
    ctaLink: "https://www.gotransit.com/en/student-discount",
    regionSpecific: "Waterloo",
  },
  {
    id: "perk-up-express-toronto",
    partnerId: "up_express_toronto",
    category: "transit",
    title: "UP Express Airport Train Student Fare",
    partnerName: "Union Pearson Express (Toronto)",
    badge: "$9.25 CAD Airport Express Fare",
    valueNum: 30,
    valueEst: "$30+ Saved vs Taxi",
    description:
      "Travel from Toronto Pearson Terminal 1 to Downtown Union Station in exactly 25 minutes with luggage racks and free high-speed Wi-Fi.",
    keyPerks: [
      "Departures every 15 minutes directly from Pearson Airport Terminal 1",
      "Tap PRESTO card or contactless card for $9.25 CAD youth/student fare",
      "Free transfers to TTC Subway at Dundas West and Bloor stations",
    ],
    ctaLabel: "View UP Express Schedule & Fares",
    ctaLink: "https://www.upexpress.com/en/fares-and-tickets/fares",
    regionSpecific: "Toronto",
  },
  {
    id: "perk-skytrain-vancouver",
    partnerId: "translink_bc_yvr",
    category: "transit",
    title: "YVR Canada Line SkyTrain & U-Pass BC",
    partnerName: "TransLink British Columbia",
    badge: "Unlimited Transit with U-Pass",
    valueNum: 180,
    valueEst: "$180+ CAD / Month",
    description:
      "Direct 25-minute rapid transit from Vancouver International Airport into Downtown Vancouver, plus unlimited SkyTrain, SeaBus, and bus transit across Metro Vancouver.",
    keyPerks: [
      "Board directly on Level 4 of YVR Airport Terminal",
      "Unlimited 3-zone travel with student U-Pass BC loaded on Compass Card",
      "Contactless credit/debit card tap support at all fare gates",
    ],
    ctaLabel: "Link U-Pass to Compass Card",
    ctaLink: "https://upassbc.translink.ca/",
    regionSpecific: "Vancouver",
  },
  {
    id: "perk-tenant-insurance",
    partnerId: "square_one_insurance",
    category: "housing",
    title: "Student Tenant Insurance & Lease Protection",
    partnerName: "Square One / Apollo Insurance",
    badge: "Starting at $12 / month",
    valueNum: 150,
    valueEst: "$150+ CAD Saved",
    description:
      "Meets all Ontario and BC landlord lease requirements. Covers personal belongings, laptop protection, accidental damage, and tenant legal liability.",
    promoCode: "STUDENTSAFE",
    keyPerks: [
      "Instant policy PDF certificate to send to your landlord in under 5 minutes",
      "Covers laptop, smartphone, and personal contents against theft or water damage",
      "$1,000,000 to $2,000,000 CAD comprehensive tenant liability protection",
    ],
    ctaLabel: "Get $12/mo Tenant Insurance Quote",
    ctaLink: "https://www.squareone.ca/tenant-insurance?ref=newcomerengine",
    regionSpecific: "All",
  },
];

export default function PerksHubPage() {
  const [claimedPerks, setClaimedPerks] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
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

        const storedClaims = localStorage.getItem("northstar_claimed_perks");
        if (storedClaims) {
          setClaimedPerks(JSON.parse(storedClaims));
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

  const handleToggleClaim = (perkId: string) => {
    const nextState = !claimedPerks[perkId];
    const updated = { ...claimedPerks, [perkId]: nextState };
    setClaimedPerks(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("northstar_claimed_perks", JSON.stringify(updated));
    }

    syncTaskStatusToSupabase("guest-user-1", perkId, nextState);

    if (nextState) {
      triggerConfetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handlePerkCta = (perk: PerkItem) => {
    handleOutboundClick(perk.partnerId, perk.category, perk.ctaLink, {
      position_on_page: "perks_hub_card",
      perk_title: perk.title,
      value_estimate: perk.valueEst,
    });
  };

  const filteredPerks = EXCLUSIVE_PERKS.filter((perk) => {
    if (activeCategory !== "all" && perk.category !== activeCategory) return false;

    if (perk.regionSpecific && perk.regionSpecific !== "All") {
      if (activeRegion.includes("Waterloo") && perk.regionSpecific !== "Waterloo") return false;
      if (activeRegion.includes("Toronto") && perk.regionSpecific !== "Toronto") return false;
      if (activeRegion.includes("Vancouver") && perk.regionSpecific !== "Vancouver") return false;
    }

    return true;
  });

  const totalClaimedCount = Object.values(claimedPerks).filter(Boolean).length;
  const totalClaimedDollars = EXCLUSIVE_PERKS.reduce((acc, p) => {
    return claimedPerks[p.id] ? acc + p.valueNum : acc;
  }, 0);

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Banner: Perks Marketplace Header */}
      <div className="w-full bg-[#0d1322]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" className="px-3 py-0.5 text-xs font-bold">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>Student Perks & Discounts</span>
              </Badge>
              <Badge variant="zinc" className="text-xs font-mono font-semibold">
                5 Major Banks + Verified Partners
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Student Discounts, Banking & Welcome Offers
            </h1>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Curated welcome bonuses, student banking packages, and verified promo codes for newcomers arriving in{" "}
              <strong className="text-white">{activeRegion.split(",")[0]}</strong>. All bank comparisons remain 100% objective and transparent.
            </p>
          </div>

          {/* Interactive Savings Calculator Box */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-3 min-w-[260px] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Savings Calculator</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {totalClaimedCount}/{EXCLUSIVE_PERKS.length} Claimed
              </span>
            </div>

            <div>
              <div className="text-3xl font-black font-mono text-white">
                ${totalClaimedDollars > 0 ? totalClaimedDollars : "1,250"}<span className="text-emerald-400 text-xl font-sans">+ CAD</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {totalClaimedDollars > 0 ? "Saved so far in student welcome perks!" : "Estimated total value available across all partner perks"}
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
              <span>Avg. 1st Year Benefit:</span>
              <span className="font-bold text-zinc-200">~$104 CAD / month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: 5-Bank Comparison Engine */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                5-Bank Canadian Student Comparison Matrix
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Compare Scotiabank, CIBC, TD, RBC, and Simplii Financial side-by-side with complete aggregator neutrality.
            </p>
          </div>

          <Badge variant="emerald" className="self-start sm:self-auto font-mono text-[11px] font-bold">
            IRCC $23,448 GIC Compliant
          </Badge>
        </div>

        <BankComparisonMatrix />
      </section>

      {/* Community Perks Contribution Card */}
      <SubmitPerkCard />

      {/* Section 2: Perks & Life Hacks */}
      <section className="flex flex-col gap-6 pt-6 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                Telecom, Discounts & Transit Offers
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Exclusive student discount codes and essential partner resources for a smooth landing.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Perks" },
              { id: "telecom", label: "eSIM & Mobile" },
              { id: "lifestyle", label: "Discounts & Grocery" },
              { id: "transit", label: "Airport Transit" },
              { id: "housing", label: "Tenant Insurance" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-2xs"
                    : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredPerks.map((perk) => {
              const isClaimed = Boolean(claimedPerks[perk.id]);

              return (
                <motion.div
                  key={perk.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className={`border rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all ${
                    isClaimed
                      ? "border-emerald-500/25 bg-[#0d1322]/50 shadow-2xs"
                      : "bg-[#0d1322]/80 backdrop-blur-xl border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]"
                  }`}
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Card Top: Category + Value + Claim Toggle */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            perk.category === "telecom"
                              ? "blue"
                              : perk.category === "transit"
                              ? "blue"
                              : perk.category === "housing"
                              ? "amber"
                              : "emerald"
                          }
                          className="font-mono text-[10px] uppercase font-bold"
                        >
                          {perk.category}
                        </Badge>
                        <Badge variant="emerald" className="font-bold text-[11px]">
                          {perk.badge}
                        </Badge>
                      </div>

                      {/* Claim toggle button */}
                      <button
                        type="button"
                        onClick={() => handleToggleClaim(perk.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-emerald-300 transition-colors focus:outline-none cursor-pointer"
                      >
                        {isClaimed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                            <span>Claimed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
                            <Circle className="w-4 h-4 stroke-[1.8]" />
                            <span>Mark Claimed</span>
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Title + Partner Name */}
                    <div>
                      <h3
                        className={`text-lg font-bold tracking-tight transition-colors ${
                          isClaimed ? "text-zinc-500 line-through" : "text-white"
                        }`}
                      >
                        {perk.title}
                      </h3>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">
                        Partner: <span className="text-zinc-200 font-semibold">{perk.partnerName}</span>
                      </p>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {perk.description}
                    </p>

                    {/* Promo Code Box */}
                    {perk.promoCode && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-dashed border-emerald-500/40">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs text-zinc-400 font-medium">Promo Code:</span>
                          <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider">
                            {perk.promoCode}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(perk.promoCode!)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300 transition-colors cursor-pointer border border-emerald-500/30"
                        >
                          {copiedCode === perk.promoCode ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Key Perks Bullet List */}
                    <ul className="space-y-1.5 pt-1 text-xs text-zinc-300 border-t border-white/[0.08]">
                      {perk.keyPerks.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{perk.valueEst}</span>
                    </div>

                    <a
                      href={perk.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handlePerkCta(perk)}
                    >
                      <Button variant="affiliate" size="sm" className="gap-2 shadow-2xs">
                        <span>{perk.ctaLabel}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Bottom CTA to Checklist */}
      <div className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              Ready to review your essential settlement steps?
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Check off your personalized roadmap in the core checklist.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/documents">
            <Button variant="secondary" size="sm" className="shadow-2xs">
              POE Documents
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
              <span>Go to Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
