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
  Laptop,
  Music,
  CreditCard,
  Train,
  Utensils,
  Zap,
} from "lucide-react";
import { BankComparisonMatrix } from "@/components/features/bank-comparison-matrix";
import { SubmitPerkCard } from "@/components/features/submit-perk-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IrccGicTooltip } from "@/components/ui/ircc-gic-tooltip";
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
  // --- 2026 BANKING PROMOS & WELCOME PACKAGES ---
  {
    id: "perk-td-student-promo",
    partnerId: "td_student_gic",
    category: "banking",
    title: "TD Canada Trust 2026 Student Advantage Package",
    partnerName: "TD Canada Trust",
    badge: "Up to $350 Bonus + Guaranteed Card",
    valueNum: 350,
    valueEst: "$350 CAD Bonus Value",
    description:
      "TD 2026 Student Offer: Earn up to $150 direct cash bonus on chequing, up to $200 in TD Rewards credit card points, guaranteed $1,000 credit limit with $0 Canadian credit history, and 7-day extended weekend branch hours.",
    keyPerks: [
      "Up to $150 cash bonus on chequing + up to $200 in TD Rewards credit card points",
      "Guaranteed $1,000 credit limit without Canadian credit history or domestic co-signer",
      "Extended 7-day branch network (open late evenings & Sundays near major campuses)",
    ],
    ctaLabel: "Compare TD Student Package",
    ctaLink: "https://www.td.com/ca/en/personal-banking/products/bank-accounts/chequing-accounts/student-chequing-account?ref=passportperk",
    regionSpecific: "All",
  },
  {
    id: "perk-rbc-student-promo",
    partnerId: "rbc_student_advantage",
    category: "banking",
    title: "RBC Royal Bank 2026 Student Advantage Package",
    partnerName: "RBC Royal Bank",
    badge: "Free Apple AirPods or $100 Cash",
    valueNum: 250,
    valueEst: "$250 CAD Value",
    description:
      "RBC 2026 Student Campaign: Choose between a Free pair of Apple AirPods (or tech credit) OR $100 cash bonus, plus Avion Points rewards on everyday debit card spending and NOMI AI automated financial budgeting.",
    keyPerks: [
      "Free Apple AirPods or $100 cash bonus upon qualifying student account opening",
      "Earn Avion Rewards points on everyday debit spending (redeemable for flights & Apple gear)",
      "Integrated NOMI AI automated budgeting tracker inside the RBC mobile app",
    ],
    ctaLabel: "Compare RBC Student Package",
    ctaLink: "https://www.rbcroyalbank.com/accounts/student-banking.html?ref=passportperk",
    regionSpecific: "All",
  },

  // --- INSIDER SETTLEMENT & AIRPORT HACKS ---
  {
    id: "perk-airport-sin-hack",
    partnerId: "service_canada_airport",
    category: "transit",
    title: "Pearson & YVR Airport Instant SIN Kiosk Shortcut",
    partnerName: "Service Canada Airport Desks",
    badge: "Skip 4-Hour Downtown Queues",
    valueNum: 100,
    valueEst: "Saves 4 Hours & $100 Time-Value",
    description:
      "Get your official 9-digit Social Insurance Number (SIN) printed in under 10 minutes right after baggage claim at Pearson Airport (Terminal 1 & 3 Arrivals) or Vancouver International (YVR). Skip the 3-4 hour lineups at downtown Service Canada centers and activate employer payroll immediately!",
    keyPerks: [
      "Seasonal Service Canada desks located inside Pearson T1/T3 & YVR Arrivals hall",
      "Printed physical SIN confirmation letter in under 10 minutes with Study Permit & Passport",
      "Enables immediate on-campus & off-campus payroll activation and bank verification on Day 1",
    ],
    ctaLabel: "View Airport SIN Desk Locations",
    ctaLink: "https://www.canada.ca/en/employment-social-development/services/sin/before-applying.html",
    regionSpecific: "All",
  },

  // --- DINING, FOOD & GROCERY HACKS ---
  {
    id: "perk-too-good-to-go",
    partnerId: "too_good_to_go_ca",
    category: "lifestyle",
    title: "Too Good To Go (Surplus Restaurant & Grocery Meals)",
    partnerName: "Too Good To Go Canada",
    badge: "70% Off Meals ($3.99 - $6.99)",
    valueNum: 500,
    valueEst: "$500+ CAD / Year Saved",
    description:
      "Rescue delicious surplus meals, bakery boxes, and fresh groceries from top Canadian chains and local bakeries (Tim Hortons, Metro, Whole Foods, 7-Eleven, local cafes) for 1/3 of the retail price ($3.99 to $6.99 for $18 to $25 worth of food).",
    keyPerks: [
      "$18 to $25 CAD worth of fresh gourmet food for just $3.99 to $6.99",
      "Hundreds of participating cafes, pizza joints, and supermarkets around UW, UofT, and UBC",
      "Set push notifications to grab surprise bags during popular 4 PM - 8 PM pickup windows",
    ],
    ctaLabel: "Download Too Good To Go App",
    ctaLink: "https://www.toogoodtogo.com/en-ca",
    regionSpecific: "All",
  },
  {
    id: "perk-pc-optimum-grocery",
    partnerId: "pc_optimum_rewards",
    category: "lifestyle",
    title: "PC Optimum Grocery Hacks & 10-15% Student Tuesdays",
    partnerName: "Loblaws / Zehrs / Shoppers Drug Mart",
    badge: "10-15% Off Tuesdays + 20x Points",
    valueNum: 380,
    valueEst: "$380+ CAD / Year",
    description:
      "Stack student savings: 10%–15% off total grocery bills on Tuesdays at Zehrs, Real Canadian Superstore, and Bulk Barn (show Student ID), plus 20x Points events at Shoppers Drug Mart (30% equivalent cash back).",
    keyPerks: [
      "10-15% student discount off entire grocery cart every Tuesday (show WatCard/OneCard/TCard)",
      "20x Points events at Shoppers Drug Mart (equivalent to 30% net cashback on essentials)",
      "Stack with weekly digital app coupons to save $80+/month on everyday student groceries",
    ],
    ctaLabel: "Get PC Optimum & View Tuesday Stores",
    ctaLink: "https://www.pcoptimum.ca/",
    regionSpecific: "All",
  },
  {
    id: "perk-spc-discount-card",
    partnerId: "spc_student_discount",
    category: "lifestyle",
    title: "SPC+ (Student Price Card) Membership",
    partnerName: "SPC Canada / CIBC Partner",
    badge: "Free with CIBC / $11.99 Value",
    valueNum: 250,
    valueEst: "$250+ CAD / Year",
    description:
      "Canada's #1 student discount membership. Unlock 10% to 25% instant discounts at 450+ top brands including Apple, Samsung, DoorDash, Adidas, H&M, and Rexall.",
    promoCode: "STUDENT2026",
    keyPerks: [
      "10-25% off food, fashion, technology, and travel across Canada",
      "Free 1-year digital membership when opening a CIBC Student Account",
      "Instant barcode scan via SPC Mobile iOS/Android App",
    ],
    ctaLabel: "Unlock Free SPC+ Pass",
    ctaLink: "https://www.spccard.ca/?ref=passportperk",
    regionSpecific: "All",
  },
  {
    id: "perk-apple-education",
    partnerId: "apple_education_canada",
    category: "lifestyle",
    title: "Apple Education Pricing & Back-to-School",
    partnerName: "Apple Canada",
    badge: "Save Up to $200 + Gift Card",
    valueNum: 200,
    valueEst: "$200+ CAD Saved",
    description:
      "Special higher education pricing on MacBook Air, MacBook Pro, and iPad for Canadian university & college students, plus 20% off AppleCare+ protection.",
    keyPerks: [
      "Save up to $200 CAD on Mac laptops and up to $100 on iPads",
      "Seasonal promotion includes bonus $150–$200 Apple Gift Card",
      "Available with valid student email (.edu, @uwaterloo.ca, @utoronto.ca)",
    ],
    ctaLabel: "View Apple Student Store",
    ctaLink: "https://www.apple.com/ca_edu_93120/shop",
    regionSpecific: "All",
  },
  {
    id: "perk-amazon-prime-student",
    partnerId: "amazon_prime_student_ca",
    category: "lifestyle",
    title: "Amazon Prime Student (6-Month Free Trial)",
    partnerName: "Amazon Canada",
    badge: "6 Months Free + 50% Off",
    valueNum: 60,
    valueEst: "$60 CAD Saved",
    description:
      "Enjoy 6 months of fast, free 1-2 day delivery for college textbooks, dorm essentials, and winter clothing, plus full Prime Video and Amazon Music streaming access.",
    keyPerks: [
      "Full 6-month trial with $0 charge for verified college/university students",
      "50% discounted membership ($4.99 CAD/mo) after trial ends",
      "Free Two-Day and One-Day Shipping to Canadian campuses and residences",
    ],
    ctaLabel: "Start 6-Month Free Trial",
    ctaLink: "https://www.amazon.ca/joinstudent?ref=passportperk",
    regionSpecific: "All",
  },
  {
    id: "perk-spotify-student",
    partnerId: "spotify_student_canada",
    category: "lifestyle",
    title: "Spotify Premium Student (50% Off)",
    partnerName: "Spotify Canada",
    badge: "$5.99 CAD / Month",
    valueNum: 72,
    valueEst: "$72 CAD / Year",
    description:
      "Ad-free music, offline listening downloads, and unlimited skips with SheerID verification for all enrolled post-secondary students in Canada.",
    keyPerks: [
      "50% discount off standard Individual Premium ($5.99 vs $11.99/mo)",
      "High-fidelity offline downloads for study sessions and transit commutes",
      "Verified easily with your Canadian student portal or admission letter",
    ],
    ctaLabel: "Get Spotify Student",
    ctaLink: "https://www.spotify.com/ca-en/student/",
    regionSpecific: "All",
  },

  // --- TELECOM & CONNECTIVITY ---
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
      "Activate an authentic Canadian mobile eSIM before boarding your flight. Zero airport roaming charges, instant QR code install, and 5G data the second you touch down in Canada.",
    promoCode: "CANADA15",
    keyPerks: [
      "15% off any 10GB - 50GB 30-day Canadian data package",
      "Instant eSIM profile download to Apple / Google Wallet",
      "Local Canadian +1 phone number included for landlord & banking calls",
    ],
    ctaLabel: "Claim 15% Off eSIM",
    ctaLink: "https://www.airalo.com/canada-esim?ref=passportperk",
    regionSpecific: "All",
  },
  {
    id: "perk-fizz-mobile",
    partnerId: "fizz_mobile_student",
    category: "telecom",
    title: "Fizz Mobile Rollover Student Plans",
    partnerName: "Fizz Mobile Canada",
    badge: "$25 Welcome Referral Bonus",
    valueNum: 75,
    valueEst: "$75+ CAD Value",
    description:
      "Canada's most flexible prepaid student network with 100% rollover unused data, customizable plans, and zero binding contracts or credit checks.",
    promoCode: "FIZZ25",
    keyPerks: [
      "$25 CAD bill credit applied automatically on your 2nd month",
      "Unused data automatically rolls over to your next month",
      "No Canadian credit history or SIN required to activate",
    ],
    ctaLabel: "Get $25 Fizz Credit",
    ctaLink: "https://fizz.ca/en?ref=passportperk",
    regionSpecific: "All",
  },

  // --- AIRPORT & REGIONAL TRANSIT ---
  {
    id: "perk-grt-ion-waterloo",
    partnerId: "grt_ion_waterloo",
    category: "transit",
    title: "GRT ION Light Rail & Bus (WatCard / OneCard U-Pass)",
    partnerName: "Grand River Transit (Waterloo Region)",
    badge: "Unlimited Transit Included",
    valueNum: 380,
    valueEst: "$380+ CAD / Term",
    description:
      "University of Waterloo and Wilfrid Laurier students receive unlimited access to the ION Light Rail and all Grand River Transit buses automatically loaded on their student ID card.",
    keyPerks: [
      "Direct ION Light Rail connection between UW, Laurier, Uptown Waterloo, and Kitchener",
      "No PRESTO card needed; simply tap your physical or digital WatCard / OneCard",
      "Runs every 10-15 minutes throughout the day across Kitchener-Waterloo",
    ],
    ctaLabel: "View GRT Student U-Pass Info",
    ctaLink: "https://www.grt.ca/en/fares-passes/post-secondary-students.aspx",
    regionSpecific: "Waterloo",
  },
  {
    id: "perk-go-transit-waterloo",
    partnerId: "go_transit_ontario",
    category: "transit",
    title: "GO Transit Student Discount (Route 25 & Ontario Rail)",
    partnerName: "Metrolinx GO Transit",
    badge: "40% Off Adult Fares",
    valueNum: 140,
    valueEst: "$140+ CAD Saved",
    description:
      "Travel from Toronto Pearson Airport / Square One directly to University of Waterloo Davis Centre & Laurier for under $15 CAD using post-secondary PRESTO discount fares.",
    keyPerks: [
      "Direct highway express coach with free Wi-Fi and power plugs",
      "Seamless bus drop-off directly on University of Waterloo campus",
      "40% fare discount linked automatically to your PRESTO card",
    ],
    ctaLabel: "Setup PRESTO 40% Student Pass",
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
    id: "perk-ttc-toronto",
    partnerId: "ttc_toronto_transit",
    category: "transit",
    title: "TTC Post-Secondary Monthly Transit Pass",
    partnerName: "Toronto Transit Commission (TTC)",
    badge: "Save $30+ CAD / Month",
    valueNum: 120,
    valueEst: "$120+ CAD Saved",
    description:
      "Unlimited monthly subway, streetcar, and bus transit across Toronto for enrolled post-secondary students loaded directly onto your PRESTO card.",
    keyPerks: [
      "Discounted $128.15 CAD monthly pass (vs $156 regular adult pass)",
      "Unlimited rides across all 4 subway lines and 140+ bus/streetcar routes",
      "One-tap digital PRESTO in Apple Wallet and Google Wallet",
    ],
    ctaLabel: "Setup TTC Post-Secondary Pass",
    ctaLink: "https://www.ttc.ca/fares-and-passes/Post-Secondary-Students",
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

  // --- HOUSING & SETTLEMENT ---
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
    ctaLink: "https://www.squareone.ca/tenant-insurance?ref=passportperk",
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

  const totalAvailableDollars = EXCLUSIVE_PERKS.reduce((acc, p) => acc + p.valueNum, 0);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      {/* Hero Banner: Perks Marketplace Header */}
      <div className="w-full bg-[#0d1322]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">
          <div className="max-w-2xl flex flex-col gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="emerald" className="px-2.5 sm:px-3 py-0.5 text-xs font-bold">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>Student Perks & Insider Hacks</span>
              </Badge>
              <Badge variant="zinc" className="text-xs font-mono font-semibold">
                {EXCLUSIVE_PERKS.length} Verified Partner Deals
              </Badge>
              <IrccGicTooltip variant="pill" />
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Student Discounts, 2026 Bank Promos & Insider Hacks
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Curated student discounts, retail memberships, airport SIN shortcuts, Too Good To Go food savings, and 5-bank comparison packages for newcomers arriving in{" "}
              <strong className="text-white">{activeRegion.split(",")[0]}</strong>.
            </p>
          </div>

          {/* Interactive Savings Calculator Box */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3 min-w-full sm:min-w-[260px] shadow-2xs">
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
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                ${totalClaimedDollars > 0 ? totalClaimedDollars.toLocaleString() : totalAvailableDollars.toLocaleString()}<span className="text-emerald-400 text-lg sm:text-xl font-sans">+ CAD</span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                {totalClaimedDollars > 0 ? "Saved so far in student welcome perks!" : "Estimated total student value across all verified perks"}
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
              <span>Avg. 1st Year Benefit:</span>
              <span className="font-bold text-zinc-200">~$175 CAD / month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: 5-Bank Comparison Engine */}
      <section className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3 sm:pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                5-Bank Canadian Student Comparison Matrix (2026 Promos)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1">
              Compare Scotiabank, CIBC, TD, RBC, and Simplii Financial side-by-side with complete aggregator neutrality.
            </p>
          </div>

          <Badge variant="emerald" className="self-start sm:self-auto font-mono text-[10px] sm:text-[11px] font-bold">
            2026 Student Banking Packages
          </Badge>
        </div>

        <BankComparisonMatrix />
      </section>

      {/* Community Perks Contribution Card */}
      <SubmitPerkCard />

      {/* Section 2: Perks & Life Hacks */}
      <section className="flex flex-col gap-5 sm:gap-6 pt-4 sm:pt-6 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Telecom, Transit, Dining & Retail Perks
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1">
              Verified promo codes, student discounts, grocery hacks, and airport shortcuts to maximize your settlement budget.
            </p>
          </div>

          {/* Category Filter Pills (Touch Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: `All Perks (${EXCLUSIVE_PERKS.length})` },
              { id: "banking", label: "2026 Bank Promos" },
              { id: "lifestyle", label: "Discounts & Food Hacks" },
              { id: "transit", label: "Transit & Airport SIN" },
              { id: "telecom", label: "eSIM & Mobile" },
              { id: "housing", label: "Tenant Insurance" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
                  className={`border rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between gap-4 sm:gap-5 transition-all ${
                    isClaimed
                      ? "border-emerald-500/25 bg-[#0d1322]/50 shadow-2xs"
                      : "bg-[#0d1322]/80 backdrop-blur-xl border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:gap-3.5">
                    {/* Card Top: Category + Value + Claim Toggle */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Badge
                          variant={
                            perk.category === "telecom"
                              ? "blue"
                              : perk.category === "transit"
                              ? "blue"
                              : perk.category === "housing"
                              ? "amber"
                              : perk.category === "banking"
                              ? "emerald"
                              : "emerald"
                          }
                          className="font-mono text-[9px] sm:text-[10px] uppercase font-bold"
                        >
                          {perk.category}
                        </Badge>
                        <Badge variant="emerald" className="font-bold text-[10px] sm:text-[11px] py-0 px-2">
                          {perk.badge}
                        </Badge>
                      </div>

                      {/* Claim toggle button */}
                      <button
                        type="button"
                        onClick={() => handleToggleClaim(perk.id)}
                        className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-zinc-400 hover:text-emerald-300 transition-colors focus:outline-none cursor-pointer flex-shrink-0"
                      >
                        {isClaimed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/20" />
                            <span>Claimed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
                            <Circle className="w-3.5 h-3.5 stroke-[1.8]" />
                            <span>Mark Claimed</span>
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Title + Partner Name */}
                    <div>
                      <h3
                        className={`text-base sm:text-lg font-bold tracking-tight transition-colors leading-snug ${
                          isClaimed ? "text-zinc-500 line-through" : "text-white"
                        }`}
                      >
                        {perk.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-mono text-zinc-400 mt-0.5">
                        Partner: <span className="text-zinc-200 font-semibold">{perk.partnerName}</span>
                      </p>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {perk.description}
                    </p>

                    {/* Promo Code Box */}
                    {perk.promoCode && (
                      <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-dashed border-emerald-500/40">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                          <Tag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">Promo:</span>
                          <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider truncate">
                            {perk.promoCode}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(perk.promoCode!)}
                          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-300 transition-colors cursor-pointer border border-emerald-500/30 flex-shrink-0"
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
                    <ul className="space-y-1.5 pt-1 text-[11px] sm:text-xs text-zinc-300 border-t border-white/[0.08]">
                      {perk.keyPerks.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold mt-0.5">•</span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono text-zinc-400 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{perk.valueEst}</span>
                    </div>

                    <a
                      href={perk.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handlePerkCta(perk)}
                    >
                      <Button variant="affiliate" size="sm" className="gap-1.5 text-xs py-1.5 sm:py-2 px-3 shadow-2xs">
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
      <div className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Ready to review your essential settlement steps?
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Check off your personalized roadmap in the core checklist.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/dashboard/documents">
            <Button variant="secondary" size="sm" className="shadow-2xs text-xs">
              POE Documents
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs text-xs">
              <span>Go to Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
