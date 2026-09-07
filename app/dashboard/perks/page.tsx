"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Search,
  Flame,
  Bookmark,
  Coffee,
  CheckCheck,
} from "lucide-react";
import { BankComparisonMatrix } from "@/components/features/bank-comparison-matrix";
import { SubmitPerkCard } from "@/components/features/submit-perk-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IrccGicTooltip } from "@/components/ui/ircc-gic-tooltip";
import { handleOutboundClick } from "@/lib/telemetry";
import { syncTaskStatusToSupabase } from "@/lib/supabase";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface AtomicPerkItem {
  id: string;
  partnerId: string;
  category: "banking" | "telecom" | "lifestyle" | "transit" | "housing";
  title: string;
  partnerName: string;
  brandInitials: string;
  brandColor: string; // Tailwind background / border gradient
  brandEmoji: string;
  boldDiscount: string;
  discountBadgeVariant?: "emerald" | "amber" | "blue" | "purple" | "rose";
  valueNum: number;
  valueEst: string;
  description: string;
  promoCode?: string;
  keyChips: string[];
  ctaLabel: string;
  ctaLink: string;
  isHot?: boolean;
  regionSpecific?: "Waterloo" | "Toronto" | "Vancouver" | "All";
}

const ATOMIC_PERKS: AtomicPerkItem[] = [
  // --- TOP TRENDING TECH & LIFESTYLE ---
  {
    id: "perk-apple-education",
    partnerId: "apple_education_canada",
    category: "lifestyle",
    title: "Apple Education Store & Back-to-School",
    partnerName: "Apple Canada",
    brandInitials: "AAPL",
    brandColor: "from-zinc-700 to-zinc-900 border-zinc-500/40 text-white",
    brandEmoji: "🍎",
    boldDiscount: "SAVE UP TO $200 + GIFT CARD",
    discountBadgeVariant: "blue",
    valueNum: 200,
    valueEst: "$200+ CAD Saved",
    description:
      "Special university & college pricing on MacBook Air, MacBook Pro, and iPad, plus seasonal $150-$200 Apple Gift Cards and 20% off AppleCare+.",
    keyChips: ["Save up to $200 on Macs", "Seasonal $150 Gift Card", "Valid with .edu or student portal"],
    ctaLabel: "Open Apple Store",
    ctaLink: "https://www.apple.com/ca_edu_93120/shop",
    isHot: true,
    regionSpecific: "All",
  },
  {
    id: "perk-amazon-prime-student",
    partnerId: "amazon_prime_student_ca",
    category: "lifestyle",
    title: "Amazon Prime Student (6-Month Trial)",
    partnerName: "Amazon Canada",
    brandInitials: "AMZN",
    brandColor: "from-amber-600/30 to-amber-950/80 border-amber-500/40 text-amber-300",
    brandEmoji: "📦",
    boldDiscount: "6 MONTHS FREE • 50% OFF",
    discountBadgeVariant: "amber",
    valueNum: 60,
    valueEst: "$60 CAD Saved",
    description:
      "Get 6 months of fast, free 1-2 day delivery on campus textbooks, dorm essentials, and winter clothes, plus Prime Video and Amazon Music streaming.",
    keyChips: ["6-Month $0 Free Trial", "50% off regular membership", "Free Fast Campus Shipping"],
    ctaLabel: "Start 6-Mo Free Trial",
    ctaLink: "https://www.amazon.ca/joinstudent?ref=passportperk",
    isHot: true,
    regionSpecific: "All",
  },
  {
    id: "perk-spotify-student",
    partnerId: "spotify_student_canada",
    category: "lifestyle",
    title: "Spotify Premium Student (50% Off)",
    partnerName: "Spotify Canada",
    brandInitials: "SPOT",
    brandColor: "from-emerald-600/30 to-emerald-950/80 border-emerald-500/40 text-emerald-300",
    brandEmoji: "🎵",
    boldDiscount: "50% OFF ($5.99 / MO)",
    discountBadgeVariant: "emerald",
    valueNum: 72,
    valueEst: "$72 CAD / Year",
    description:
      "Ad-free music, offline listening downloads, and unlimited skips with SheerID instant student verification for all enrolled Canadian college & university students.",
    keyChips: ["$5.99 CAD/mo (vs $11.99)", "High-fidelity offline study downloads", "Instant SheerID verification"],
    ctaLabel: "Get 50% Off Spotify",
    ctaLink: "https://www.spotify.com/ca-en/student/",
    regionSpecific: "All",
  },
  {
    id: "perk-spc-discount-card",
    partnerId: "spc_student_discount",
    category: "lifestyle",
    title: "SPC+ (Student Price Card) Membership",
    partnerName: "SPC Canada / CIBC Partner",
    brandInitials: "SPC",
    brandColor: "from-rose-600/30 to-rose-950/80 border-rose-500/40 text-rose-300",
    brandEmoji: "🛍️",
    boldDiscount: "10% - 25% OFF 450+ BRANDS",
    discountBadgeVariant: "rose",
    valueNum: 250,
    valueEst: "$250+ CAD / Year",
    description:
      "Canada's #1 student discount pass. Unlock 10% to 25% instant discounts on Apple, Samsung, DoorDash, Adidas, H&M, Rexall, and Dominos Pizza.",
    promoCode: "STUDENT2026",
    keyChips: ["Free with CIBC or $11.99/yr", "450+ Canadian brands", "Instant barcode in Apple Wallet"],
    ctaLabel: "Unlock Free SPC+ Pass",
    ctaLink: "https://www.spccard.ca/?ref=passportperk",
    isHot: true,
    regionSpecific: "All",
  },

  // --- FOOD & GROCERY SAVINGS HACKS ---
  {
    id: "perk-too-good-to-go",
    partnerId: "too_good_to_go_ca",
    category: "lifestyle",
    title: "Too Good To Go (Surplus Gourmet Dining)",
    partnerName: "Too Good To Go Canada",
    brandInitials: "TGTG",
    brandColor: "from-teal-600/30 to-teal-950/80 border-teal-500/40 text-teal-300",
    brandEmoji: "🥐",
    boldDiscount: "70% OFF MEALS ($3.99 - $6.99)",
    discountBadgeVariant: "emerald",
    valueNum: 500,
    valueEst: "$500+ CAD / Year Saved",
    description:
      "Rescue fresh surplus meals, bakery boxes, and groceries from top Canadian spots (Tim Hortons, Metro, Whole Foods, 7-Eleven, local bakeries) for 1/3 of the retail price.",
    keyChips: ["$18-$25 worth of food for $3.99-$6.99", "Tim Hortons, Metro & local bakeries", "Daily 4 PM - 8 PM pickup windows"],
    ctaLabel: "Download App & Save 70%",
    ctaLink: "https://www.toogoodtogo.com/en-ca",
    isHot: true,
    regionSpecific: "All",
  },
  {
    id: "perk-pc-optimum-grocery",
    partnerId: "pc_optimum_rewards",
    category: "lifestyle",
    title: "PC Optimum Grocery Hacks & Student Tuesdays",
    partnerName: "Loblaws / Zehrs / Shoppers Drug Mart",
    brandInitials: "PCO",
    brandColor: "from-orange-600/30 to-orange-950/80 border-orange-500/40 text-orange-300",
    brandEmoji: "🛒",
    boldDiscount: "10-15% OFF TUESDAYS + 20X PTS",
    discountBadgeVariant: "amber",
    valueNum: 380,
    valueEst: "$380+ CAD / Year",
    description:
      "Stack student savings: 10%–15% off total grocery bills on Tuesdays at Zehrs, Real Canadian Superstore, and Bulk Barn with student ID, plus 20x Points events at Shoppers Drug Mart (30% back).",
    keyChips: ["10-15% off cart on Tuesdays", "20x Points at Shoppers (30% back)", "Free app in Apple/Google Wallet"],
    ctaLabel: "Get Free PC Optimum Card",
    ctaLink: "https://www.pcoptimum.ca/",
    regionSpecific: "All",
  },

  // --- 2026 BANKING PROMOS & WELCOME PACKAGES ---
  {
    id: "perk-td-student-promo",
    partnerId: "td_student_gic",
    category: "banking",
    title: "TD Canada Trust 2026 Student Advantage",
    partnerName: "TD Canada Trust",
    brandInitials: "TD",
    brandColor: "from-green-600/30 to-green-950/80 border-green-500/40 text-green-300",
    brandEmoji: "🟢",
    boldDiscount: "UP TO $350 CASH & POINTS",
    discountBadgeVariant: "emerald",
    valueNum: 350,
    valueEst: "$350 CAD Bonus Value",
    description:
      "Up to $150 cash bonus on student chequing + up to $200 in TD Rewards credit card points, guaranteed $1,000 credit limit with $0 Canadian credit history, and 7-day extended weekend branch hours.",
    keyChips: ["$150 Chequing + $200 Card Bonus", "Guaranteed $1,000 Credit Limit", "Open 7 Days a Week near Campus"],
    ctaLabel: "Compare TD Student Deal",
    ctaLink: "https://www.td.com/ca/en/personal-banking/products/bank-accounts/chequing-accounts/student-chequing-account?ref=passportperk",
    isHot: true,
    regionSpecific: "All",
  },
  {
    id: "perk-rbc-student-promo",
    partnerId: "rbc_student_advantage",
    category: "banking",
    title: "RBC Royal Bank 2026 Student Campaign",
    partnerName: "RBC Royal Bank",
    brandInitials: "RBC",
    brandColor: "from-blue-600/30 to-blue-950/80 border-blue-500/40 text-blue-300",
    brandEmoji: "🔵",
    boldDiscount: "FREE AIRPODS OR $100 CASH",
    discountBadgeVariant: "blue",
    valueNum: 250,
    valueEst: "$250 CAD Value",
    description:
      "Choose between a Free pair of Apple AirPods (or tech credit) OR $100 cash bonus, plus Avion Points rewards on everyday debit spending and NOMI AI automated financial budgeting.",
    keyChips: ["Free Apple AirPods or $100 Cash", "Avion Rewards on debit spending", "NOMI AI financial budgeting"],
    ctaLabel: "Compare RBC Student Deal",
    ctaLink: "https://www.rbcroyalbank.com/accounts/student-banking.html?ref=passportperk",
    isHot: true,
    regionSpecific: "All",
  },
  {
    id: "perk-scotiabank-startright",
    partnerId: "scotiabank_startright",
    category: "banking",
    title: "Scotiabank StartRight Student Advantage",
    partnerName: "Scotiabank",
    brandInitials: "BNS",
    brandColor: "from-red-600/30 to-red-950/80 border-red-500/40 text-red-300",
    brandEmoji: "🔴",
    boldDiscount: "$150 WELCOME CASH BONUS",
    discountBadgeVariant: "rose",
    valueNum: 150,
    valueEst: "$150 CAD Cash",
    description:
      "Earn $150 direct cash bonus + Scene+ points on everyday debit spending for free movies at Cineplex, groceries, and dining. Closest branches adjacent to UW, Laurier, UofT, and UBC gates.",
    keyChips: ["$150 Welcome Cash", "Scene+ Points on movies & food", "Adjacent to major campus gates"],
    ctaLabel: "Compare Scotiabank Deal",
    ctaLink: "https://www.scotiabank.com/ca/en/personal-banking/bank-accounts/student-banking.html?ref=passportperk",
    regionSpecific: "All",
  },
  {
    id: "perk-cibc-smart-student",
    partnerId: "cibc_smart_gic",
    category: "banking",
    title: "CIBC Smart Account + Free SPC+ Pass",
    partnerName: "CIBC Student Banking",
    brandInitials: "CIBC",
    brandColor: "from-rose-600/30 to-rose-950/80 border-rose-500/40 text-rose-300",
    brandEmoji: "💳",
    boldDiscount: "$100 CASH + FREE SPC+ MEMBERSHIP",
    discountBadgeVariant: "emerald",
    valueNum: 150,
    valueEst: "$150 CAD Value",
    description:
      "Get $100 direct cash bonus, a free 1-year SPC+ digital discount card ($250+ value), and send free international remittances home with $0 transfer fee.",
    keyChips: ["$100 Cash + Free SPC+", "$0 International Remittances", "Unlimited e-Transfers & Apple Pay"],
    ctaLabel: "Compare CIBC Student Deal",
    ctaLink: "https://www.cibc.com/en/personal-banking/bank-accounts/student-banking-offers.html?ref=passportperk",
    regionSpecific: "All",
  },
  {
    id: "perk-simplii-digital",
    partnerId: "simplii_student_banking",
    category: "banking",
    title: "Simplii Financial No-Fee Digital Chequing",
    partnerName: "Simplii Financial",
    brandInitials: "SIM",
    brandColor: "from-pink-600/30 to-pink-950/80 border-pink-500/40 text-pink-300",
    brandEmoji: "⚡",
    boldDiscount: "$400 BONUS POTENTIAL • $0 FEES",
    discountBadgeVariant: "purple",
    valueNum: 400,
    valueEst: "$400 CAD Value",
    description:
      "100% digital Canadian student banking with $0 monthly fees forever (even after graduation), high-interest savings boosters, and free cash withdrawals at all 4,000+ CIBC ATMs nationwide.",
    keyChips: ["$0 monthly fees forever", "$400 direct deposit bonus path", "Free cash at all 4,000+ CIBC ATMs"],
    ctaLabel: "Open Simplii Digital Account",
    ctaLink: "https://www.simplii.com/en/student-banking.html?ref=passportperk",
    regionSpecific: "All",
  },

  // --- TELECOM & CONNECTIVITY ---
  {
    id: "perk-esim-phonebox",
    partnerId: "phonebox_airalo_esim",
    category: "telecom",
    title: "Canadian 5G eSIM Instant Activation",
    partnerName: "Airalo / PhoneBox Canada",
    brandInitials: "AIR",
    brandColor: "from-cyan-600/30 to-cyan-950/80 border-cyan-500/40 text-cyan-300",
    brandEmoji: "📱",
    boldDiscount: "15% OFF CANADIAN 5G DATA",
    discountBadgeVariant: "blue",
    valueNum: 35,
    valueEst: "$35 CAD Saved",
    description:
      "Install an authentic Canadian eSIM profile before boarding your flight. Zero airport roaming charges, instant QR install, and 5G data the second your plane lands in Canada.",
    promoCode: "CANADA15",
    keyChips: ["15% Off 10GB-50GB plans", "Instant QR download to Wallet", "Local Canadian +1 number included"],
    ctaLabel: "Claim 15% Off eSIM",
    ctaLink: "https://www.airalo.com/canada-esim?ref=passportperk",
    isHot: true,
    regionSpecific: "All",
  },
  {
    id: "perk-fizz-mobile",
    partnerId: "fizz_mobile_student",
    category: "telecom",
    title: "Fizz Mobile Rollover Student Plans",
    partnerName: "Fizz Mobile Canada",
    brandInitials: "FIZZ",
    brandColor: "from-emerald-600/30 to-emerald-950/80 border-emerald-500/40 text-emerald-300",
    brandEmoji: "⚡",
    boldDiscount: "$25 WELCOME BILL CREDIT",
    discountBadgeVariant: "emerald",
    valueNum: 75,
    valueEst: "$75+ CAD Value",
    description:
      "Canada's most flexible prepaid student network with 100% rollover unused data, customizable plans, and zero binding contracts or Canadian credit checks.",
    promoCode: "FIZZ25",
    keyChips: ["$25 bill credit on 2nd month", "Unused data rolls over forever", "No credit check or SIN required"],
    ctaLabel: "Get $25 Fizz Credit",
    ctaLink: "https://fizz.ca/en?ref=passportperk",
    regionSpecific: "All",
  },

  // --- TRANSIT, AIRPORT & TRAVEL HACKS ---
  {
    id: "perk-airport-sin-hack",
    partnerId: "service_canada_airport",
    category: "transit",
    title: "Pearson & YVR Instant SIN Kiosk Shortcut",
    partnerName: "Service Canada Airport Desks",
    brandInitials: "SIN",
    brandColor: "from-indigo-600/30 to-indigo-950/80 border-indigo-500/40 text-indigo-300",
    brandEmoji: "⚡",
    boldDiscount: "SKIP 4-HR QUEUES (10 MINS)",
    discountBadgeVariant: "blue",
    valueNum: 100,
    valueEst: "Saves 4 Hours & $100 Value",
    description:
      "Get your official 9-digit Social Insurance Number (SIN) printed in under 10 minutes right after baggage claim at Pearson Airport (Terminal 1 & 3 Arrivals) or Vancouver (YVR). Skip 3-4 hour lines downtown!",
    keyChips: ["Service Canada desks in T1/T3 & YVR", "Printed SIN letter in 10 minutes", "Enables Day 1 payroll activation"],
    ctaLabel: "View Airport SIN Kiosks",
    ctaLink: "https://www.canada.ca/en/employment-social-development/services/sin/before-applying.html",
    isHot: true,
    regionSpecific: "All",
  },
  {
    id: "perk-grt-ion-waterloo",
    partnerId: "grt_ion_waterloo",
    category: "transit",
    title: "GRT ION Light Rail & Bus (WatCard U-Pass)",
    partnerName: "Grand River Transit (Waterloo Region)",
    brandInitials: "GRT",
    brandColor: "from-blue-600/30 to-blue-950/80 border-blue-500/40 text-blue-300",
    brandEmoji: "🚊",
    boldDiscount: "UNLIMITED RIDES INCLUDED",
    discountBadgeVariant: "blue",
    valueNum: 380,
    valueEst: "$380+ CAD / Term",
    description:
      "University of Waterloo and Wilfrid Laurier students receive unlimited access to the ION Light Rail and all GRT buses automatically loaded on their physical or digital student card.",
    keyChips: ["Unlimited transit across Waterloo Region", "No PRESTO needed — tap WatCard/OneCard", "Runs every 10-15 mins all day"],
    ctaLabel: "View GRT U-Pass Guide",
    ctaLink: "https://www.grt.ca/en/fares-passes/post-secondary-students.aspx",
    regionSpecific: "Waterloo",
  },
  {
    id: "perk-go-transit-waterloo",
    partnerId: "go_transit_ontario",
    category: "transit",
    title: "GO Transit 40% Student Discount",
    partnerName: "Metrolinx GO Transit",
    brandInitials: "GO",
    brandColor: "from-green-600/30 to-green-950/80 border-green-500/40 text-green-300",
    brandEmoji: "🚆",
    boldDiscount: "40% OFF ADULT FARES",
    discountBadgeVariant: "emerald",
    valueNum: 140,
    valueEst: "$140+ CAD Saved",
    description:
      "Travel from Toronto Pearson Airport / Square One directly to University of Waterloo Davis Centre & Laurier for under $15 CAD using post-secondary PRESTO discount fares.",
    keyChips: ["Direct coach from Pearson to UW campus", "40% discount on PRESTO card", "Free onboard Wi-Fi & power outlets"],
    ctaLabel: "Setup PRESTO 40% Pass",
    ctaLink: "https://www.gotransit.com/en/student-discount",
    regionSpecific: "Waterloo",
  },
  {
    id: "perk-up-express-toronto",
    partnerId: "up_express_toronto",
    category: "transit",
    title: "UP Express Airport Train Student Fare",
    partnerName: "Union Pearson Express (Toronto)",
    brandInitials: "UP",
    brandColor: "from-amber-600/30 to-amber-950/80 border-amber-500/40 text-amber-300",
    brandEmoji: "🚄",
    boldDiscount: "$9.25 STUDENT AIRPORT TRAIN",
    discountBadgeVariant: "amber",
    valueNum: 30,
    valueEst: "$30+ Saved vs Taxi",
    description:
      "Travel from Toronto Pearson Terminal 1 to Downtown Union Station in exactly 25 minutes with luggage racks and free high-speed Wi-Fi for just $9.25 CAD.",
    keyChips: ["25 mins from Pearson T1 to Union Station", "Departures every 15 mins all day", "Free transfer to TTC subway at Bloor"],
    ctaLabel: "View UP Express Fares",
    ctaLink: "https://www.upexpress.com/en/fares-and-tickets/fares",
    regionSpecific: "Toronto",
  },
  {
    id: "perk-ttc-toronto",
    partnerId: "ttc_toronto_transit",
    category: "transit",
    title: "TTC Post-Secondary Monthly Transit Pass",
    partnerName: "Toronto Transit Commission (TTC)",
    brandInitials: "TTC",
    brandColor: "from-red-600/30 to-red-950/80 border-red-500/40 text-red-300",
    brandEmoji: "🚇",
    boldDiscount: "SAVE $30+ / MONTH PASS",
    discountBadgeVariant: "rose",
    valueNum: 120,
    valueEst: "$120+ CAD Saved",
    description:
      "Unlimited monthly subway, streetcar, and bus transit across Toronto for enrolled college and university students loaded directly onto your PRESTO card.",
    keyChips: ["$128.15/mo student rate (vs $156 regular)", "Unlimited subway, streetcar & bus rides", "Digital PRESTO in Apple/Google Wallet"],
    ctaLabel: "Setup TTC Student Pass",
    ctaLink: "https://www.ttc.ca/fares-and-passes/Post-Secondary-Students",
    regionSpecific: "Toronto",
  },
  {
    id: "perk-skytrain-vancouver",
    partnerId: "translink_bc_yvr",
    category: "transit",
    title: "YVR Canada Line SkyTrain & U-Pass BC",
    partnerName: "TransLink British Columbia",
    brandInitials: "YVR",
    brandColor: "from-blue-600/30 to-blue-950/80 border-blue-500/40 text-blue-300",
    brandEmoji: "🌊",
    boldDiscount: "UNLIMITED 3-ZONE TRANSIT",
    discountBadgeVariant: "blue",
    valueNum: 180,
    valueEst: "$180+ CAD / Month",
    description:
      "Direct 25-minute rapid transit from Vancouver International Airport into Downtown Vancouver, plus unlimited SkyTrain, SeaBus, and bus transit across Metro Vancouver.",
    keyChips: ["Board directly at Level 4 YVR terminal", "Unlimited 3-zone travel on Compass Card", "Covering UBC, SFU, and Langara"],
    ctaLabel: "Link U-Pass to Compass Card",
    ctaLink: "https://upassbc.translink.ca/",
    regionSpecific: "Vancouver",
  },

  // --- HOUSING & LEASE PROTECTION ---
  {
    id: "perk-tenant-insurance",
    partnerId: "square_one_insurance",
    category: "housing",
    title: "Student Tenant Insurance & Laptop Protection",
    partnerName: "Square One / Apollo Insurance",
    brandInitials: "SQ1",
    brandColor: "from-teal-600/30 to-teal-950/80 border-teal-500/40 text-teal-300",
    brandEmoji: "🛡️",
    boldDiscount: "STARTING AT $12 / MONTH",
    discountBadgeVariant: "emerald",
    valueNum: 150,
    valueEst: "$150+ CAD Saved",
    description:
      "Meets all Ontario and BC landlord lease requirements. Covers laptop protection against accidental damage/theft, personal belongings, and $1M-$2M tenant liability.",
    promoCode: "STUDENTSAFE",
    keyChips: ["Instant PDF certificate for landlord in 5 mins", "$1M-$2M tenant liability protection", "Covers laptop & smartphone contents"],
    ctaLabel: "Get $12/mo Quote",
    ctaLink: "https://www.squareone.ca/tenant-insurance?ref=passportperk",
    regionSpecific: "All",
  },
];

export default function PerksHubPage() {
  const [claimedPerks, setClaimedPerks] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  const handlePerkCta = (perk: AtomicPerkItem) => {
    handleOutboundClick(perk.partnerId, perk.category, perk.ctaLink, {
      position_on_page: "perks_hub_atomic_card",
      perk_title: perk.title,
      value_estimate: perk.valueEst,
    });
  };

  const filteredPerks = useMemo(() => {
    return ATOMIC_PERKS.filter((perk) => {
      if (activeCategory !== "all" && perk.category !== activeCategory) return false;

      if (perk.regionSpecific && perk.regionSpecific !== "All") {
        if (activeRegion.includes("Waterloo") && perk.regionSpecific !== "Waterloo") return false;
        if (activeRegion.includes("Toronto") && perk.regionSpecific !== "Toronto") return false;
        if (activeRegion.includes("Vancouver") && perk.regionSpecific !== "Vancouver") return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = perk.title.toLowerCase().includes(q);
        const matchPartner = perk.partnerName.toLowerCase().includes(q);
        const matchDesc = perk.description.toLowerCase().includes(q);
        const matchDiscount = perk.boldDiscount.toLowerCase().includes(q);
        return matchTitle || matchPartner || matchDesc || matchDiscount;
      }

      return true;
    });
  }, [activeCategory, activeRegion, searchQuery]);

  const totalClaimedCount = Object.values(claimedPerks).filter(Boolean).length;
  const totalClaimedDollars = ATOMIC_PERKS.reduce((acc, p) => {
    return claimedPerks[p.id] ? acc + p.valueNum : acc;
  }, 0);

  const totalAvailableDollars = ATOMIC_PERKS.reduce((acc, p) => acc + p.valueNum, 0);

  const hotDeals = useMemo(() => ATOMIC_PERKS.filter((p) => p.isHot).slice(0, 4), []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      {/* Hero Banner: UNiDAYS-Style Student Perks Marketplace Header */}
      <div className="w-full bg-[#0d1322]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">
          <div className="max-w-2xl flex flex-col gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="emerald" className="px-2.5 sm:px-3 py-0.5 text-xs font-bold gap-1.5 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Student Perks & Discounts</span>
              </Badge>
              <Badge variant="zinc" className="text-xs font-mono font-semibold">
                {ATOMIC_PERKS.length} Verified Brand Deals
              </Badge>
              <IrccGicTooltip variant="pill" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Student Deals, Tech Rewards & Welcome Perks
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Instant access to Canadian student discounts, Free Apple AirPods promos, 70% off restaurant meals, 40% transit passes, and eSIM data packages for newcomers in{" "}
              <strong className="text-white">{activeRegion.split(",")[0]}</strong>.
            </p>

            {/* Quick Search Input */}
            <div className="relative max-w-md mt-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search brand deals (e.g. Apple, Spotify, TD, Tim Hortons)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080c14]/90 border border-white/[0.1] focus:border-emerald-500/60 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Interactive Savings Calculator Box */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 min-w-full sm:min-w-[270px] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Savings Vault</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {totalClaimedCount}/{ATOMIC_PERKS.length} Claimed
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                ${totalClaimedDollars > 0 ? totalClaimedDollars.toLocaleString() : totalAvailableDollars.toLocaleString()}<span className="text-emerald-400 text-lg sm:text-xl font-sans">+ CAD</span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                {totalClaimedDollars > 0 ? "Saved so far in verified student perks!" : "Total available rewards across all partner perks"}
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
              <span>Avg. 1st Year Benefit:</span>
              <span className="font-bold text-zinc-200">~$195 CAD / month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Trending Hot Deals Carousel (UNiDAYS Style Hero Strip) */}
      {!searchQuery && activeCategory === "all" && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-300 font-bold">
                Trending Hot Deals
              </h2>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">Top Student Picks</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {hotDeals.map((deal) => (
              <a
                key={deal.id}
                href={deal.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handlePerkCta(deal)}
                className="bg-[#0d1322]/90 hover:bg-[#121a2d] border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition-all hover:scale-[1.02] shadow-2xs group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center font-bold text-sm shadow-2xs",
                    deal.brandColor
                  )}>
                    <span>{deal.brandEmoji}</span>
                  </div>
                  <Badge variant="emerald" className="text-[9px] font-black tracking-tight uppercase py-0 px-1.5">
                    Hot Deal
                  </Badge>
                </div>

                <div>
                  <span className="text-[11px] font-black text-emerald-400 font-mono tracking-tight block">
                    {deal.boldDiscount}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mt-0.5">
                    {deal.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">{deal.partnerName}</p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-semibold text-zinc-400 group-hover:text-white">
                  <span>{deal.valueEst}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Main Deals Catalog */}
      <section className="flex flex-col gap-5 sm:gap-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                All Verified Student Deals & Perks
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Instant student discounts, promo codes, food lifehacks, and welcome rewards.
            </p>
          </div>

          {/* Category Filter Pills (Touch-Friendly UNiDAYS Bar) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: `🔥 All Deals (${ATOMIC_PERKS.length})` },
              { id: "banking", label: "💳 Banking & Cash" },
              { id: "lifestyle", label: "🛍️ Tech & Retail" },
              { id: "transit", label: "🚆 Transit & Airport" },
              { id: "telecom", label: "📱 eSIM & Mobile" },
              { id: "housing", label: "🏠 Tenant Insurance" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                  activeCategory === cat.id
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-2xs"
                    : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Atomic Deal Cards Grid (UNiDAYS Style) */}
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
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "border rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all relative overflow-hidden",
                    isClaimed
                      ? "border-emerald-500/25 bg-[#0d1322]/50 shadow-2xs"
                      : "bg-[#0d1322]/85 backdrop-blur-xl border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.14)]"
                  )}
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Top Row: Brand Monogram Tile + Bold Discount Tag + Claim Toggle */}
                    <div className="flex items-start justify-between gap-2.5">
                      {/* Brand Logo Placeholder & Identity */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "w-11 h-11 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-black text-base shadow-2xs flex-shrink-0",
                            perk.brandColor
                          )}
                        >
                          <span>{perk.brandEmoji}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate leading-tight">
                            {perk.partnerName}
                          </p>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                            {perk.category}
                          </span>
                        </div>
                      </div>

                      {/* Claim toggle button */}
                      <button
                        type="button"
                        onClick={() => handleToggleClaim(perk.id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-emerald-300 transition-colors focus:outline-none cursor-pointer flex-shrink-0"
                        title={isClaimed ? "Mark as unclaimed" : "Mark as claimed"}
                      >
                        {isClaimed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-500 hover:text-zinc-300 stroke-[1.8]" />
                        )}
                      </button>
                    </div>

                    {/* BIG BOLD DISCOUNT HERO TAG */}
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black font-mono tracking-tight text-emerald-300 uppercase">
                        {perk.boldDiscount}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-zinc-400">
                        {perk.valueEst}
                      </span>
                    </div>

                    {/* Title + Punchy Description */}
                    <div>
                      <h3
                        className={cn(
                          "text-base font-extrabold tracking-tight transition-colors leading-snug",
                          isClaimed ? "text-zinc-500 line-through" : "text-white"
                        )}
                      >
                        {perk.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mt-1">
                        {perk.description}
                      </p>
                    </div>

                    {/* Key Scannable Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {perk.keyChips.map((chip, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                        >
                          ✓ {chip}
                        </span>
                      ))}
                    </div>

                    {/* Promo Code Pill (1-Click Copy) */}
                    {perk.promoCode && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-dashed border-emerald-500/40">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Tag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="text-[11px] text-zinc-400 font-medium">Code:</span>
                          <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider truncate">
                            {perk.promoCode}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(perk.promoCode!)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300 transition-colors cursor-pointer border border-emerald-500/30 flex-shrink-0"
                        >
                          {copiedCode === perk.promoCode ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>COPIED!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* High Impact Action Button */}
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{perk.valueEst}</span>
                    </div>

                    <a
                      href={perk.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handlePerkCta(perk)}
                    >
                      <Button
                        variant="affiliate"
                        size="sm"
                        className="gap-1.5 text-xs py-2 px-3.5 shadow-2xs font-bold"
                      >
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

        {/* Empty Search Fallback */}
        {filteredPerks.length === 0 && (
          <div className="p-12 text-center bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex flex-col items-center gap-3 shadow-2xs">
            <Search className="w-8 h-8 text-zinc-500" />
            <h4 className="text-base font-bold text-white">No brand deals found</h4>
            <p className="text-xs text-zinc-400 max-w-sm">
              We couldn&apos;t find any perks matching &ldquo;{searchQuery}&rdquo;. Try clearing your search or category filter.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* 5-Bank Comparison Suite Section (Clean & Collapsible) */}
      <section className="flex flex-col gap-4 pt-4 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                5-Bank Canadian Student Comparison Matrix
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Objective side-by-side comparison of student welcome bonuses, rewards points, zero monthly fees, and campus branch proximity.
            </p>
          </div>

          <Badge variant="emerald" className="self-start sm:self-auto font-mono text-[10px] sm:text-[11px] font-bold">
            2026 Student Offers
          </Badge>
        </div>

        <BankComparisonMatrix />
      </section>

      {/* Community Perks Contribution Card */}
      <SubmitPerkCard />

      {/* Bottom Navigation to Checklist */}
      <div className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Ready to review your essential settlement roadmap?
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Check off your personalized pre-departure tasks in the core checklist.
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
