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
  Search,
  X,
  SlidersHorizontal,
  Users,
  ArrowUpDown,
  Filter,
  GraduationCap,
  Plane,
  Briefcase,
  Layers,
  HelpCircle,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { BrandLogo, BrandKey } from "@/components/ui/brand-logo";
import { SubmitPerkCard } from "@/components/features/submit-perk-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleOutboundClick } from "@/lib/telemetry";
import { syncTaskStatusToSupabase } from "@/lib/supabase";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

export type AudienceCategory =
  | "students"
  | "newcomers"
  | "pre_arrival"
  | "enrolled"
  | "all_residents";

interface AtomicPerk {
  id: string;
  partnerId: string;
  brandKey: BrandKey;
  brandName: string;
  category: "banking" | "tech" | "food" | "telecom" | "transit" | "housing";
  heroPerk: string;
  perkDetail: string;
  description: string;
  promoCode?: string;
  keyPoints: string[];
  ctaLabel: string;
  ctaLink: string;
  valueDollars: number;
  badgeTag: string;
  regionSpecific?: "Waterloo" | "Toronto" | "Vancouver" | "All";
  eligibleAudiences: AudienceCategory[];
  audienceTags: string[];
}

const ALL_ATOMIC_PERKS: AtomicPerk[] = [
  // --- 5 MAJOR CANADIAN STUDENT BANKS (1 CARD PER BANK) ---
  {
    id: "scotia-package",
    partnerId: "scotiabank_startright",
    brandKey: "scotiabank",
    brandName: "Scotiabank",
    category: "banking",
    heroPerk: "$200 CASH",
    perkDetail: "Preferred Package for Students & Youth",
    description: "Open the Preferred Package for Students & Youth with $0 monthly fee and complete qualifying transactions to get $200 cash deposited directly. Offer ends November 1, 2026.",
    keyPoints: [
      "$200 Cash Welcome Bonus (Ends Nov 1, 2026)",
      "Scene+ Points on everyday debit (free Cineplex movies & food)",
      "$0 Monthly Account Fee + branches adjacent to campus gates",
    ],
    ctaLabel: "Claim $200 with Scotiabank",
    ctaLink: "https://www.scotiabank.com/ca/en/personal/bank-accounts/students/student-banking-advantage-plan.html?ref=passportperk",
    valueDollars: 200,
    badgeTag: "Ends Nov 1, 2026",
    regionSpecific: "All",
    eligibleAudiences: ["students", "enrolled", "pre_arrival"],
    audienceTags: ["🎓 Int'l Students", "📚 Enrolled Students", "✈️ Pre-Arrival"],
  },
  {
    id: "rbc-package",
    partnerId: "rbc_student_advantage",
    brandKey: "rbc",
    brandName: "RBC Royal Bank",
    category: "banking",
    heroPerk: "FREE AIRPODS 4",
    perkDetail: "RBC Student Advantage Banking (or $100 Cash)",
    description: "Open an RBC Student Advantage Banking account by November 2, 2026, and receive a brand new pair of Apple AirPods 4 (or choose $100 cash alternative) upon qualifying setup.",
    keyPoints: [
      "Free Apple AirPods 4 promo (Ends Nov 2, 2026)",
      "Or choose $100 direct cash deposit alternative",
      "Avion Points rewards on debit + Canada's largest branch network",
    ],
    ctaLabel: "Claim Free AirPods 4 with RBC",
    ctaLink: "https://www.rbcroyalbank.com/accounts/student-banking.html?ref=passportperk",
    valueDollars: 240,
    badgeTag: "Ends Nov 2, 2026",
    regionSpecific: "All",
    eligibleAudiences: ["students", "enrolled"],
    audienceTags: ["🎓 Int'l Students", "📚 Post-Secondary"],
  },
  {
    id: "cibc-package",
    partnerId: "cibc_student_banking",
    brandKey: "cibc",
    brandName: "CIBC",
    category: "banking",
    heroPerk: "$175 CASH + SPC+",
    perkDetail: "CIBC Smart Start / Smart for Students",
    description: "Earn a $175 cash reward on your student chequing account, plus a free annual SPC+ discount membership to save 10%–25% at 450+ Canadian brands, with $0 remittance fees.",
    keyPoints: [
      "$175 Cash Reward for opening student account",
      "Free annual SPC+ pass (save 10-25% at 450+ major brands)",
      "$0 Monthly fees + free international money transfers to send home",
    ],
    ctaLabel: "Claim $175 + Free SPC+ with CIBC",
    ctaLink: "https://www.cibc.com/en/student/bank-accounts.html?ref=passportperk",
    valueDollars: 295,
    badgeTag: "Top Cash + Perks",
    regionSpecific: "All",
    eligibleAudiences: ["students", "newcomers", "pre_arrival"],
    audienceTags: ["🎓 Int'l Students", "🧳 Newcomers (PR/Work)", "✈️ Pre-Arrival"],
  },
  {
    id: "td-package",
    partnerId: "td_student_gic",
    brandKey: "td",
    brandName: "TD Canada Trust",
    category: "banking",
    heroPerk: "$150 CASH",
    perkDetail: "TD Student Chequing & Guaranteed Card",
    description: "Earn up to $150 cash on new student chequing, get guaranteed approval for a $1,000 student credit card ($0 Canadian credit history needed), and enjoy 7-day extended branch hours.",
    keyPoints: [
      "Up to $150 Cash Offer (Valid until Nov 2, 2026)",
      "Guaranteed $1,000 student credit card (build credit score)",
      "Open 7 days a week (late evenings & Sundays near campus)",
    ],
    ctaLabel: "Claim $150 with TD Bank",
    ctaLink: "https://www.td.com/ca/en/personal-banking/products/bank-accounts/chequing-accounts/student-chequing-account?ref=passportperk",
    valueDollars: 150,
    badgeTag: "Ends Nov 2, 2026",
    regionSpecific: "All",
    eligibleAudiences: ["students", "newcomers", "enrolled"],
    audienceTags: ["🎓 Int'l Students", "🧳 All Newcomers", "📚 University Enrolled"],
  },
  {
    id: "simplii-package",
    partnerId: "simplii_financial",
    brandKey: "simplii",
    brandName: "Simplii Financial",
    category: "banking",
    heroPerk: "$400 BONUS",
    perkDetail: "High-Yield Digital Chequing ($0 Fees Forever)",
    description: "100% digital bank with $0 monthly fees forever (even post-graduation). Earn up to $400 cash bonus when setting up qualifying payroll or student deposits with free CIBC ATM access.",
    keyPoints: [
      "Up to $400 cash bonus on direct deposit",
      "$0 fees forever (no student status re-verification)",
      "Free cash withdrawals at all 4,000+ CIBC ATMs across ON & BC",
    ],
    ctaLabel: "Claim $400 with Simplii",
    ctaLink: "https://www.simplii.com/en/special-offers/student-banking.html?ref=passportperk",
    valueDollars: 400,
    badgeTag: "$0 Fees Forever",
    regionSpecific: "All",
    eligibleAudiences: ["students", "newcomers", "all_residents"],
    audienceTags: ["🎓 Int'l Students", "🧳 PR / Work Permits", "🍁 All Residents"],
  },

  // --- TECH & ENTERTAINMENT ---
  {
    id: "perk-apple-education",
    partnerId: "apple_education_store",
    brandKey: "apple",
    brandName: "Apple Canada",
    category: "tech",
    heroPerk: "$150 GIFT CARD",
    perkDetail: "+ 10% Off Mac & iPad",
    description: "Verified university/college students get up to $150 Apple Gift Card with Back-to-School promo, plus year-round 10% education pricing on MacBooks & iPads.",
    keyPoints: ["Up to $150 Apple Gift Card with purchase", "10% education discount on Mac & iPad", "20% off AppleCare+ warranty"],
    ctaLabel: "Unlock Apple Education Store",
    ctaLink: "https://www.apple.com/ca_edu_93120/shop?ref=passportperk",
    valueDollars: 150,
    badgeTag: "Hardware Discount",
    regionSpecific: "All",
    eligibleAudiences: ["students", "enrolled"],
    audienceTags: ["🎓 Int'l Students", "📚 College & University"],
  },
  {
    id: "perk-amazon-prime-student",
    partnerId: "amazon_prime_student_ca",
    brandKey: "amazon-prime",
    brandName: "Amazon Prime",
    category: "tech",
    heroPerk: "6 MOS FREE",
    perkDetail: "Prime Delivery + Prime Video",
    description: "Get 6 months of 100% free Amazon Prime Student trial using your Canadian .edu / university email. Enjoy free fast delivery, Prime Video, and Amazon Music.",
    keyPoints: ["6 months 100% free trial", "Free 1-day delivery on essentials", "50% off regular Prime price after trial"],
    ctaLabel: "Claim 6 Months Free Prime",
    ctaLink: "https://www.amazon.ca/joinstudent?ref=passportperk",
    valueDollars: 60,
    badgeTag: "Free Trial",
    regionSpecific: "All",
    eligibleAudiences: ["students", "enrolled"],
    audienceTags: ["🎓 Int'l Students", "📚 Post-Secondary (.edu)"],
  },
  {
    id: "perk-spotify-student",
    partnerId: "spotify_student_ca",
    brandKey: "spotify",
    brandName: "Spotify",
    category: "tech",
    heroPerk: "$5.99 / MO",
    perkDetail: "Spotify Premium + Free Apple TV+ promo",
    description: "Enjoy Spotify Premium for just $5.99/month (regular $10.99). Includes 1 month free trial, ad-free listening, offline downloads, and streaming perks.",
    keyPoints: ["50% off monthly subscription", "1 month free trial included", "High-fidelity offline music downloads"],
    ctaLabel: "Get Spotify Student ($5.99)",
    ctaLink: "https://www.spotify.com/ca-en/student/?ref=passportperk",
    valueDollars: 60,
    badgeTag: "50% Off Subscription",
    regionSpecific: "All",
    eligibleAudiences: ["students", "enrolled"],
    audienceTags: ["🎓 Int'l Students", "📚 SheerID Verified"],
  },

  // --- FOOD & GROCERY SAVINGS ---
  {
    id: "perk-too-good-to-go",
    partnerId: "too_good_to_go_ca",
    brandKey: "too-good-to-go",
    brandName: "Too Good To Go",
    category: "food",
    heroPerk: "70% OFF FOOD",
    perkDetail: "Rescue $15-$25 Meals for $4.99",
    description: "Get fresh surplus meals, bakery goods, and groceries from top local restaurants and supermarkets at 1/3 of the regular price. Huge savings for students.",
    keyPoints: ["Meals for $4.99 - $6.99 (valued at $18+)", "Active across Waterloo, Toronto & Vancouver", "Save $150+ monthly on meals"],
    ctaLabel: "Download Too Good To Go",
    ctaLink: "https://www.toogoodtogo.com/en-ca?ref=passportperk",
    valueDollars: 150,
    badgeTag: "Surplus Food App",
    regionSpecific: "All",
    eligibleAudiences: ["students", "newcomers", "all_residents"],
    audienceTags: ["🎓 Int'l Students", "🧳 All Newcomers", "🍁 Open to All"],
  },
  {
    id: "perk-pc-optimum-grocery",
    partnerId: "pc_optimum_loblaws",
    brandKey: "pc-optimum",
    brandName: "PC Optimum / Zehrs",
    category: "food",
    heroPerk: "10% TUESDAYS",
    perkDetail: "+ 10,000 Bonus PC Points",
    description: "Show your student ID every Tuesday at Zehrs, Real Canadian Superstore, and Shoppers Drug Mart for an instant 10% off your entire grocery bill.",
    keyPoints: ["10% off student Tuesdays", "Points redeemable for free groceries", "Free PC Optimum mobile card"],
    ctaLabel: "Join PC Optimum for Free",
    ctaLink: "https://www.pcoptimum.ca/?ref=passportperk",
    valueDollars: 80,
    badgeTag: "10% Grocery Hack",
    regionSpecific: "All",
    eligibleAudiences: ["students", "enrolled"],
    audienceTags: ["🎓 Int'l Students", "📚 Student ID Cardholders"],
  },

  // --- MOBILE & ESIM ---
  {
    id: "perk-esim-phonebox",
    partnerId: "phonebox_esim_ca",
    brandKey: "phonebox",
    brandName: "PhoneBox 5G",
    category: "telecom",
    heroPerk: "$34 / 50GB",
    perkDetail: "Pre-Arrival 5G eSIM + $0 Activation",
    description: "Set up your Canadian phone number before your flight lands. No credit checks, operates on the Rogers 5G network with free international calling to 20+ countries.",
    promoCode: "PASSPORT5G",
    keyPoints: ["$34/mo for 50GB 5G data", "Free 1000 mins international calling", "Instant QR eSIM activation before flying"],
    ctaLabel: "Order eSIM ($34 Promo)",
    ctaLink: "https://gophonebox.com/plans?ref=passportperk",
    valueDollars: 50,
    badgeTag: "Pre-Arrival 5G eSIM",
    regionSpecific: "All",
    eligibleAudiences: ["pre_arrival", "students", "newcomers"],
    audienceTags: ["✈️ Pre-Arrival (Before Flying)", "🎓 Int'l Students", "🧳 Newcomers"],
  },
  {
    id: "perk-fizz-mobile",
    partnerId: "fizz_mobile_ca",
    brandKey: "fizz",
    brandName: "Fizz Mobile",
    category: "telecom",
    heroPerk: "ROLLOVER DATA",
    perkDetail: "+ $25 Referral Cash Credit",
    description: "Customizable 5G plans where unused monthly data automatically rolls over to the next month. Fully digital with no contracts or hidden fees.",
    promoCode: "PERK25",
    keyPoints: ["Unused data rolls over automatically", "$25 referral bonus on 2nd month", "Change plan limits anytime in app"],
    ctaLabel: "Activate Fizz ($25 Credit)",
    ctaLink: "https://fizz.ca/en?ref=passportperk",
    valueDollars: 25,
    badgeTag: "Rollover Data",
    regionSpecific: "All",
    eligibleAudiences: ["students", "newcomers", "all_residents"],
    audienceTags: ["🎓 Int'l Students", "🧳 All Newcomers", "🍁 All Residents"],
  },

  // --- TRANSIT & RIDESHARE ---
  {
    id: "perk-uber-lyft-rideshare",
    partnerId: "uber_lyft_rideshare",
    brandKey: "uber",
    brandName: "Uber & Lyft Canada",
    category: "transit",
    heroPerk: "50% OFF RIDES",
    perkDetail: "New Account Airport / Campus Rides",
    description: "Sign up for Uber and Lyft using your new Canadian phone number upon landing to unlock 50% off your first 2 rides (up to $15 off each) for airport to student housing transit.",
    promoCode: "WELCOME50",
    keyPoints: [
      "50% off first 2 rides with Canadian phone number",
      "Save up to $30 CAD on airport to campus transit",
      "Compare Uber vs Lyft live prices to get the lowest rate",
    ],
    ctaLabel: "Claim Rideshare 50% Off",
    ctaLink: "https://www.uber.com/ca/en/ride/?ref=passportperk",
    valueDollars: 30,
    badgeTag: "Arrival Rideshare Hack",
    regionSpecific: "All",
    eligibleAudiences: ["pre_arrival", "students", "newcomers"],
    audienceTags: ["✈️ New Landings (Airport)", "🎓 Int'l Students", "🧳 All Newcomers"],
  },
  {
    id: "perk-grt-ion-waterloo",
    partnerId: "grt_waterloo_transit",
    brandKey: "ion-waterloo",
    brandName: "GRT & ION Light Rail",
    category: "transit",
    heroPerk: "FREE TRANSIT",
    perkDetail: "Unlimited ION Light Rail & Buses",
    description: "Included in your university tuition! Tap your WatCard (UW) or Laurier OneCard for 100% free unlimited rides on all Grand River Transit buses and ION light rail.",
    keyPoints: ["100% Free unlimited rides with student card", "Direct connection between UW, Laurier & Conestoga", "No monthly transit pass needed"],
    ctaLabel: "View GRT Route Schedules",
    ctaLink: "https://www.grt.ca/en/fares/universal-transit-pass-u-pass.aspx?ref=passportperk",
    valueDollars: 360,
    badgeTag: "Unlimited U-Pass",
    regionSpecific: "Waterloo",
    eligibleAudiences: ["students", "enrolled"],
    audienceTags: ["🎓 Int'l Students", "📚 UW / Laurier / Conestoga"],
  },
  {
    id: "perk-up-express-toronto",
    partnerId: "up_express_toronto",
    brandKey: "ttc-toronto",
    brandName: "TTC & UP Express",
    category: "transit",
    heroPerk: "FREE TRANSFERS",
    perkDetail: "Ontario One Fare Program",
    description: "Under Ontario's One Fare program, transfers between TTC, GO Transit, MiWay, and Brampton Transit are 100% free with your PRESTO card or credit card tap.",
    keyPoints: ["Free transfers across TTC, GO & YRT", "Airport to Union Station in 25 mins", "$3.00 flat student cap"],
    ctaLabel: "Learn One Fare Program",
    ctaLink: "https://www.upexpress.com/en/fares-and-passes/student-discount?ref=passportperk",
    valueDollars: 120,
    badgeTag: "One Fare Program",
    regionSpecific: "Toronto",
    eligibleAudiences: ["students", "newcomers", "all_residents"],
    audienceTags: ["🎓 Int'l Students", "🧳 All Commuters", "🍁 PRESTO Users"],
  },
  {
    id: "perk-skytrain-vancouver",
    partnerId: "translink_vancouver",
    brandKey: "skytrain-vancouver",
    brandName: "TransLink SkyTrain",
    category: "transit",
    heroPerk: "3-ZONE U-PASS",
    perkDetail: "Unlimited SkyTrain, SeaBus & Buses",
    description: "Included with UBC & SFU tuition: Unlimited all-zone access to Expo Line, Millennium Line, Canada Line, SeaBus, and all TransLink buses with Compass Card.",
    keyPoints: ["All 3 zones included at 70% off regular fare", "Covers airport to downtown Canada Line", "Loaded digitally onto Compass Card"],
    ctaLabel: "Link U-Pass to Compass",
    ctaLink: "https://www.translink.ca/transit-fares/u-pass-bc?ref=passportperk",
    valueDollars: 450,
    badgeTag: "All-Zone U-Pass",
    regionSpecific: "Vancouver",
    eligibleAudiences: ["students", "enrolled"],
    audienceTags: ["🎓 Int'l Students", "📚 UBC / SFU Students"],
  },

  // --- TENANT INSURANCE ---
  {
    id: "perk-tenant-insurance",
    partnerId: "square_one_insurance",
    brandKey: "square-one",
    brandName: "Square One Insurance",
    category: "housing",
    heroPerk: "$12 / MO",
    perkDetail: "Instant Student Tenant Insurance",
    description: "Most Canadian student leases require proof of tenant insurance. Get instant online coverage starting at just $12/month with $1M liability protection and $0 deductible options.",
    keyPoints: ["Instant PDF certificate for landlord", "Plans start at only $12/month", "$1,000,000 liability protection"],
    ctaLabel: "Get Instant Quote ($12/mo)",
    ctaLink: "https://www.squareone.ca/tenant-insurance?ref=passportperk",
    valueDollars: 50,
    badgeTag: "Landlord Required",
    regionSpecific: "All",
    eligibleAudiences: ["students", "newcomers", "all_residents"],
    audienceTags: ["🎓 Int'l Students", "🧳 All Renters / PR", "🏠 Apartment Leases"],
  },
];

export default function PerksPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeAudience, setActiveAudience] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"highest_value" | "expiring_soon" | "alphabetical" | "popular">("highest_value");
  const [activeRegion, setActiveRegion] = useState<string>("All Canada");
  const [claimedPerks, setClaimedPerks] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("northstar_claimed_perks");
      if (saved) {
        try {
          setClaimedPerks(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved perks", e);
        }
      }

      const intakeData = localStorage.getItem("northstar_user_profile");
      if (intakeData) {
        try {
          const parsed = JSON.parse(intakeData);
          if (parsed.destinationCity) {
            setActiveRegion(parsed.destinationCity);
          }
        } catch (e) {
          console.error("Failed to parse intake profile", e);
        }
      }

      const handleRegionEvent = (e: any) => {
        if (e.detail?.region) {
          setActiveRegion(e.detail.region);
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

  const handlePerkCta = (perk: AtomicPerk) => {
    handleOutboundClick(perk.partnerId, perk.category, perk.ctaLink, {
      position_on_page: "perks_marketplace_card",
      brand_name: perk.brandName,
      hero_perk: perk.heroPerk,
      value_estimate: perk.valueDollars,
    });
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveAudience("all");
    setSortBy("highest_value");
  };

  // Filter & Search Logic
  const filteredAndSortedPerks = ALL_ATOMIC_PERKS.filter((perk) => {
    // 1. Category Filter
    if (activeCategory !== "all" && perk.category !== activeCategory) return false;

    // 2. Audience Filter
    if (activeAudience !== "all" && !perk.eligibleAudiences.includes(activeAudience as AudienceCategory)) {
      return false;
    }

    // 3. Region Filter
    if (perk.regionSpecific && perk.regionSpecific !== "All") {
      if (activeRegion.includes("Waterloo") && perk.regionSpecific !== "Waterloo") return false;
      if (activeRegion.includes("Toronto") && perk.regionSpecific !== "Toronto") return false;
      if (activeRegion.includes("Vancouver") && perk.regionSpecific !== "Vancouver") return false;
    }

    // 4. Keyword Search across Brand, Hero, Title, Description, Audience Tags & Key points
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesBrand = perk.brandName.toLowerCase().includes(q);
      const matchesHero = perk.heroPerk.toLowerCase().includes(q);
      const matchesDetail = perk.perkDetail.toLowerCase().includes(q);
      const matchesDesc = perk.description.toLowerCase().includes(q);
      const matchesBadge = perk.badgeTag.toLowerCase().includes(q);
      const matchesAudience = perk.audienceTags.some((t) => t.toLowerCase().includes(q));
      const matchesKeyPoints = perk.keyPoints.some((k) => k.toLowerCase().includes(q));
      const matchesCode = perk.promoCode?.toLowerCase().includes(q);

      if (
        !matchesBrand &&
        !matchesHero &&
        !matchesDetail &&
        !matchesDesc &&
        !matchesBadge &&
        !matchesAudience &&
        !matchesKeyPoints &&
        !matchesCode
      ) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "highest_value") {
      return b.valueDollars - a.valueDollars;
    }
    if (sortBy === "expiring_soon") {
      const aExp = a.badgeTag.includes("Ends") ? 1 : 0;
      const bExp = b.badgeTag.includes("Ends") ? 1 : 0;
      if (aExp !== bExp) return bExp - aExp;
      return b.valueDollars - a.valueDollars;
    }
    if (sortBy === "alphabetical") {
      return a.brandName.localeCompare(b.brandName);
    }
    // "popular"
    return 0;
  });

  const totalClaimedCount = Object.values(claimedPerks).filter(Boolean).length;
  const totalClaimedDollars = ALL_ATOMIC_PERKS.reduce((acc, p) => {
    return claimedPerks[p.id] ? acc + p.valueDollars : acc;
  }, 0);

  const totalAvailableDollars = ALL_ATOMIC_PERKS.reduce((acc, p) => acc + p.valueDollars, 0);

  const isAnyFilterActive = searchQuery.trim() !== "" || activeCategory !== "all" || activeAudience !== "all" || sortBy !== "highest_value";

  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      {/* Hero Banner: Student Marketplace Header (UNiDAYS / Student Beans Vibe) */}
      <div className="w-full bg-[#0d1322]/90 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-5 sm:p-6 lg:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">
          <div className="max-w-2xl flex flex-col gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="emerald" className="px-2.5 sm:px-3 py-0.5 text-xs font-bold">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>Student & Newcomer Deals</span>
              </Badge>
              <Badge variant="zinc" className="text-xs font-mono font-semibold">
                {ALL_ATOMIC_PERKS.length} Verified Offers
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Exclusive Canadian Student Perks & Promos
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every current student offer, banking cash bonus, tech discount, and grocery hack in one clean hub. Search by brand, bank, or visa type for newcomers in{" "}
              <strong className="text-white">{activeRegion.split(",")[0]}</strong>.
            </p>
          </div>

          {/* Interactive Savings Calculator Box */}
          <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 min-w-full sm:min-w-[260px] shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Savings Tracker</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {totalClaimedCount}/{ALL_ATOMIC_PERKS.length} Saved
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                ${totalClaimedDollars > 0 ? totalClaimedDollars.toLocaleString() : totalAvailableDollars.toLocaleString()}<span className="text-emerald-400 text-lg sm:text-xl font-sans">+ CAD</span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                {totalClaimedDollars > 0 ? "Saved so far in student welcome perks!" : "Estimated total value available across all student perks"}
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
              <span>Avg. 1st Year Benefit:</span>
              <span className="font-bold text-zinc-200">~$175 CAD / month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Search Bar, Audience Persona Filters, Category Filters & Sort Controls */}
      <section className="flex flex-col gap-4 bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-4 sm:p-6 shadow-xl">
        {/* Row 1: Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Interactive Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, bank, perk, keyword (e.g. Scotiabank, AirPods, eSIM, Cash, Food)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0d1322] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-400 cursor-pointer shadow-sm"
            >
              <option value="highest_value">💰 Highest Value ($ CAD)</option>
              <option value="expiring_soon">⏳ Expiring Soon (2026 Promos)</option>
              <option value="popular">🔥 Most Popular</option>
              <option value="alphabetical">🔤 Brand Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Audience / Persona Quick Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-zinc-300">Who Can Claim:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap">
            {[
              { id: "all", label: "👥 All Audiences", count: ALL_ATOMIC_PERKS.length },
              { id: "students", label: "🎓 Int'l Students" },
              { id: "newcomers", label: "🧳 All Newcomers (PR & Work)" },
              { id: "pre_arrival", label: "✈️ Pre-Arrival (Before Flying)" },
              { id: "enrolled", label: "📚 College & University" },
            ].map((aud) => (
              <button
                key={aud.id}
                type="button"
                onClick={() => setActiveAudience(aud.id)}
                className={cn(
                  "whitespace-nowrap px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                  activeAudience === aud.id
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                    : "bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:border-white/[0.15] hover:text-white"
                )}
              >
                {aud.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Category Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-300">Category:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: `🔥 All Deals (${ALL_ATOMIC_PERKS.length})` },
              { id: "banking", label: "💰 Banking & Cash" },
              { id: "tech", label: "🎧 Tech & Gear" },
              { id: "food", label: "🍕 Food & Groceries" },
              { id: "telecom", label: "📱 Mobile & 5G" },
              { id: "transit", label: "🚆 Transit & Rides" },
              { id: "housing", label: "🏠 Tenant Insurance" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                  activeCategory === cat.id
                    ? "bg-emerald-500 text-zinc-950 border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-[#0d1322]/70 text-zinc-400 border-white/[0.08] hover:border-white/[0.18] hover:text-white"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Summary & Active Indicator */}
        <div className="flex items-center justify-between gap-2 pt-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-white font-mono">{filteredAndSortedPerks.length}</strong> of {ALL_ATOMIC_PERKS.length} verified deals
            </span>
            {searchQuery && (
              <span className="bg-white/[0.06] px-2 py-0.5 rounded-md text-zinc-300 text-[11px] font-mono">
                Keyword: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-emerald-400 hover:text-emerald-300 underline text-xs font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </section>

      {/* Main Deals Marketplace Section */}
      <section className="flex flex-col gap-5 sm:gap-6">
        {/* Deal Cards Grid */}
        {filteredAndSortedPerks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedPerks.map((perk) => {
                const isClaimed = Boolean(claimedPerks[perk.id]);

                return (
                  <motion.div
                    key={perk.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "relative border rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all group overflow-hidden shadow-lg",
                      isClaimed
                        ? "border-emerald-500/30 bg-[#0d1322]/60 shadow-2xs"
                        : "bg-[#0d1322]/90 backdrop-blur-2xl border-white/[0.1] hover:border-emerald-500/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                    )}
                  >
                    {/* Subtle Ambient Radial Glow */}
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity" />

                    <div className="relative z-10 flex flex-col gap-3.5">
                      {/* Top Row: Authentic Brand Logo + Partner Info + Save Button */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Authentic Brand SVG Vector Logo */}
                          <BrandLogo brand={perk.brandKey} size="md" />

                          <div className="min-w-0">
                            <h3
                              className={cn(
                                "text-sm font-bold tracking-tight transition-colors truncate",
                                isClaimed ? "text-zinc-500 line-through" : "text-white"
                              )}
                            >
                              {perk.brandName}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono text-zinc-400 capitalize truncate">
                                {perk.category} • {perk.regionSpecific === "All" ? "All Canada" : perk.regionSpecific}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Save / Claim Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleClaim(perk.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-emerald-300 transition-colors focus:outline-none cursor-pointer flex-shrink-0"
                        >
                          {isClaimed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                              <span>Saved</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
                              <Circle className="w-4 h-4 stroke-[1.8]" />
                              <span>Save</span>
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Who Can Claim - Eligibility Badges */}
                      <div className="flex flex-wrap gap-1 items-center pt-0.5">
                        {perk.audienceTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-semibold text-cyan-300 flex items-center gap-1"
                          >
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>

                      {/* ZOOMED-IN HIGHLIGHTED PERK BADGE */}
                      <div className="py-0.5">
                        <div className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent leading-none">
                          {perk.heroPerk}
                        </div>
                        <p className="text-xs font-bold text-zinc-200 mt-1.5 leading-snug">
                          {perk.perkDetail}
                        </p>
                      </div>

                      {/* Clear 1-2 Sentence Description */}
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {perk.description}
                      </p>

                      {/* Promo Code Box (if applicable) */}
                      {perk.promoCode && (
                        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.04] border border-dashed border-emerald-500/40">
                          <div className="flex items-center gap-2 min-w-0">
                            <Tag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="text-[11px] text-zinc-400 font-medium">Code:</span>
                            <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider truncate">
                              {perk.promoCode}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyCode(perk.promoCode!)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300 transition-colors cursor-pointer border border-emerald-500/30 flex-shrink-0"
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

                      {/* Key Benefits Chips */}
                      <div className="flex flex-col gap-1.5 pt-0.5">
                        {perk.keyPoints.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] font-medium text-zinc-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 stroke-[2.5]" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action CTA Button */}
                    <div className="relative z-10 pt-3 border-t border-white/[0.08]">
                      <a
                        href={perk.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handlePerkCta(perk)}
                        className="block w-full"
                      >
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full justify-between items-center py-2.5 px-4 rounded-2xl font-bold text-xs shadow-md group-hover:scale-[1.02] transition-transform"
                        >
                          <span>{perk.ctaLabel}</span>
                          <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State when Search or Filters yield 0 results */
          <div className="bg-[#0d1322]/80 border border-white/[0.08] rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
              <Search className="w-7 h-7 text-zinc-500" />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-white">No Offers Found</h3>
              <p className="text-xs text-zinc-400 mt-1">
                No verified perks match your current search &quot;{searchQuery}&quot; or filter combination.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetAllFilters}
              className="mt-2 text-xs rounded-xl"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </section>

      {/* JSON-LD Schema for Google & AI Search Answer Engines (GEO: ChatGPT, Gemini, Perplexity, Claude) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "FAQPage",
                "@id": "https://passportperk.com/dashboard/perks#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What are the best student offers and banking welcome bonuses in Canada for 2026?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The top 2026 Canadian student banking offers include: (1) RBC Royal Bank: Free Apple AirPods 4 promo (or $100 cash alternative) with Student Advantage Banking; (2) Scotiabank: $200 cash welcome bonus on the Preferred Package for Students & Youth; (3) CIBC: $175 cash reward plus a free 1-year SPC+ discount card (save 10-25% at 450+ Canadian brands); (4) TD Canada Trust: Up to $150 cash offer plus a guaranteed $1,000 credit card without Canadian credit history; (5) Simplii Financial: Up to $400 cash bonus with 100% no-fee digital chequing forever."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do international students and newcomers save money in Canada?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "International students save over $1,400 CAD per year through verified newcomer hacks: (1) Use Too Good To Go for 70% off gourmet surplus meals ($4.99); (2) Shop at Zehrs/Loblaws on Student Tuesdays for 10% off grocery bills with PC Optimum points; (3) Claim 50% off your first 2 Uber and Lyft rides from the airport with a new Canadian SIM; (4) Activate 6 months of free Amazon Prime Student and $5.99/month Spotify Premium; (5) Tap student cards for unlimited free transit on Waterloo ION LRT or Vancouver SkyTrain U-Pass."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How can international students earn money legally in Canada while studying?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Under official IRCC regulations updated in November 2024, eligible international students with an off-campus work condition on their Study Permit can work legally up to 24 hours per week during regular academic terms (increased from the previous 20-hour limit), and full-time (unlimited hours) during scheduled academic breaks. Students must obtain a 9-digit Social Insurance Number (SIN) from Service Canada to receive employer payroll."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What are the three biggest financial benefits for students moving to Canada?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "(1) $0 Fee Banking & Big Welcome Bonuses: Free student chequing accounts offering up to $400 cash or free Apple AirPods 4; (2) Universal Tuition-Included Transit (U-Pass): Unlimited public transit on trains, buses, and subways in major student cities; (3) First Credit Card without Credit History: Guaranteed approval for $1,000 student credit cards from TD, RBC, and Scotiabank allowing international students to establish an Equifax/TransUnion Canadian credit score from Day 1."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Which Canadian banks offer student accounts with no Canadian credit history?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "TD Canada Trust, Scotiabank, CIBC, RBC Royal Bank, and Simplii Financial all provide dedicated international student and newcomer banking packages that require no Canadian credit history, no domestic co-signer, and charge $0 monthly account maintenance fees while enrolled in post-secondary education."
                    }
                  }
                ]
              },
              {
                "@type": "ItemList",
                "@id": "https://passportperk.com/dashboard/perks#deals",
                "name": "Verified Canadian Student Offers & Newcomer Discounts",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Scotiabank $200 Cash Welcome Bonus",
                    "url": "https://passportperk.com/dashboard/perks"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "RBC Royal Bank Free Apple AirPods 4 Promo",
                    "url": "https://passportperk.com/dashboard/perks"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "CIBC $175 Cash Reward + Free SPC+ Pass",
                    "url": "https://passportperk.com/dashboard/perks"
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "TD Canada Trust $150 Cash Offer + Guaranteed First Credit Card",
                    "url": "https://passportperk.com/dashboard/perks"
                  },
                  {
                    "@type": "ListItem",
                    "position": 5,
                    "name": "Simplii Financial $400 Direct Deposit Bonus",
                    "url": "https://passportperk.com/dashboard/perks"
                  }
                ]
              }
            ]
          }),
        }}
      />

      {/* Semantic SEO & GEO Guide: Student & Newcomer Offers FAQ */}
      <section className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Guide to Canadian Student Offers & Newcomer Discounts
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Frequently asked questions on 2026 banking promos, food hacks, off-campus work rules, and savings.
              </p>
            </div>
          </div>
          <Badge variant="emerald" className="self-start sm:self-auto text-[11px] font-mono font-bold">
            2026 Verified Guide
          </Badge>
        </div>

        {/* Semantic Accordion Q&A Items */}
        <div className="flex flex-col gap-3">
          <details className="group border border-white/[0.08] rounded-2xl bg-white/[0.02] p-4 transition-all open:bg-white/[0.04] open:border-emerald-500/30 cursor-pointer">
            <summary className="text-sm font-bold text-white flex items-center justify-between gap-3 list-none">
              <span className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>What are the best student offers in Canada for 2026?</span>
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0" />
            </summary>
            <div className="text-xs text-zinc-300 leading-relaxed mt-3 pt-3 border-t border-white/[0.06] space-y-2">
              <p>
                Canadian Big 5 banks and major retailers offer high-value student incentives active for the 2026 academic year:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300 font-medium">
                <li><strong className="text-white">RBC Royal Bank:</strong> Free pair of Apple AirPods 4 (or $100 direct cash deposit) with RBC Student Advantage Banking (valid until Nov 2, 2026).</li>
                <li><strong className="text-white">Scotiabank:</strong> $200 Cash Welcome Bonus on the Preferred Package for Students &amp; Youth (valid until Nov 1, 2026) + Scene+ points for free movies.</li>
                <li><strong className="text-white">CIBC:</strong> $175 Cash Reward on CIBC Smart Start / Smart for Students + Free annual SPC+ student discount membership ($250+ value at 450+ stores).</li>
                <li><strong className="text-white">TD Canada Trust:</strong> Up to $150 Cash Offer + Guaranteed $1,000 first credit card approval with $0 Canadian credit history.</li>
                <li><strong className="text-white">Simplii Financial:</strong> Up to $400 welcome deposit bonus with $0 monthly fees forever.</li>
                <li><strong className="text-white">Amazon Prime &amp; Apple:</strong> 6 months 100% free Prime Student trial and up to $150 Apple Gift Card with 10% hardware discounts.</li>
              </ul>
            </div>
          </details>

          <details className="group border border-white/[0.08] rounded-2xl bg-white/[0.02] p-4 transition-all open:bg-white/[0.04] open:border-emerald-500/30 cursor-pointer">
            <summary className="text-sm font-bold text-white flex items-center justify-between gap-3 list-none">
              <span className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>How do international students and newcomers save money on food, transit, and mobile?</span>
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0" />
            </summary>
            <div className="text-xs text-zinc-300 leading-relaxed mt-3 pt-3 border-t border-white/[0.06] space-y-2">
              <p>
                Students can reduce living expenses by over $1,400 CAD per year with these insider survival hacks:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300 font-medium">
                <li><strong className="text-white">Food &amp; Groceries:</strong> Rescue surplus gourmet meals and bakery boxes for $4.99 on <strong className="text-emerald-300">Too Good To Go</strong> (regularly $18–$25). Shop at Zehrs and Loblaws on <strong className="text-emerald-300">Student Tuesdays</strong> for an instant 10% discount using PC Optimum.</li>
                <li><strong className="text-white">Transit &amp; Airport Rides:</strong> Use promo code <code className="text-emerald-300 bg-white/10 px-1 py-0.5 rounded">WELCOME50</code> on Uber &amp; Lyft with a fresh Canadian SIM for 50% off airport rides. Take advantage of tuition-included U-Pass (Waterloo ION LRT / Vancouver SkyTrain) and Ontario&apos;s One Fare program for free transfers between TTC and GO Transit.</li>
                <li><strong className="text-white">Mobile Plans:</strong> Activate a pre-arrival 5G eSIM from PhoneBox ($34 for 50GB + free international calling) or Fizz Mobile for rollover data.</li>
              </ul>
            </div>
          </details>

          <details className="group border border-white/[0.08] rounded-2xl bg-white/[0.02] p-4 transition-all open:bg-white/[0.04] open:border-emerald-500/30 cursor-pointer">
            <summary className="text-sm font-bold text-white flex items-center justify-between gap-3 list-none">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>How can international students earn money legally in Canada?</span>
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0" />
            </summary>
            <div className="text-xs text-zinc-300 leading-relaxed mt-3 pt-3 border-t border-white/[0.06] space-y-2">
              <p>
                Under IRCC regulations updated in <strong className="text-white">November 2024</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300 font-medium">
                <li><strong className="text-white">24 Hours / Week Off-Campus:</strong> Full-time post-secondary international students with a valid Study Permit authorizing work can work legally up to 24 hours per week during academic semesters (up from 20 hours).</li>
                <li><strong className="text-white">Unlimited Full-Time on Scheduled Breaks:</strong> During scheduled winter, summer, and reading week breaks, international students may work full-time with no hourly restriction.</li>
                <li><strong className="text-white">Social Insurance Number (SIN):</strong> You must obtain your 9-digit SIN from Service Canada (arrive at 8:00 AM before 8:30 AM opening to finish in 15 mins) before starting payroll.</li>
              </ul>
            </div>
          </details>

          <details className="group border border-white/[0.08] rounded-2xl bg-white/[0.02] p-4 transition-all open:bg-white/[0.04] open:border-emerald-500/30 cursor-pointer">
            <summary className="text-sm font-bold text-white flex items-center justify-between gap-3 list-none">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>What are the 3 biggest financial benefits for students moving to Canada?</span>
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0" />
            </summary>
            <div className="text-xs text-zinc-300 leading-relaxed mt-3 pt-3 border-t border-white/[0.06] space-y-2">
              <ol className="list-decimal pl-5 space-y-1.5 text-zinc-300 font-medium">
                <li><strong className="text-white">$0 Fee Banking &amp; Welcome Bonuses:</strong> Up to $400 in direct cash or free Apple AirPods 4 with $0 monthly maintenance fees.</li>
                <li><strong className="text-white">Universal Tuition-Included Transit:</strong> Unlimited rides across buses, LRT, subways, and SkyTrains saving ~$1,200/year compared to standard adult transit passes.</li>
                <li><strong className="text-white">First Canadian Credit Card with $0 Credit History:</strong> Guaranteed $1,000 credit limit approval from TD, RBC, and Scotiabank to establish an Equifax and TransUnion credit score immediately upon arrival.</li>
              </ol>
            </div>
          </details>
        </div>
      </section>

      {/* Community Contribution Section */}
      <SubmitPerkCard />

      {/* Bottom CTA to Core Checklist */}
      <div className="bg-[#0d1322]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Ready to check off your pre-arrival roadmap?
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review your personalized settlement timeline and mandatory documents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/dashboard/documents">
            <Button variant="secondary" size="sm" className="shadow-2xs text-xs rounded-xl">
              POE Documents
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs text-xs rounded-xl">
              <span>Go to Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
