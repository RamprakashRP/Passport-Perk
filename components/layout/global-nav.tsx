"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ListChecks,
  Gift,
  FileText,
  Sparkles,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  PlusCircle,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Check,
  Globe,
  Sun,
  Snowflake,
  User as UserIcon,
  LogIn,
  LogOut,
  MessageSquarePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TargetCity } from "@/types";
import { supabase, getCurrentUser, signOutUser, isSupabaseConfigured } from "@/lib/supabase";
import { openFeedbackModal } from "@/lib/feedback";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Checklist",
    href: "/dashboard",
    icon: ListChecks,
    description: "Personalized settlement timeline and regional tasks",
    exact: true,
  },
  {
    name: "Perks & Offers",
    href: "/dashboard/perks",
    icon: Gift,
    description: "Student banking comparison, eSIM discounts, and savings calculator",
  },
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    description: "Border compliance verification and luggage packing simulator",
  },
];

const AVAILABLE_CITIES: { id: TargetCity; name: string; tag: string; icon: string }[] = [
  {
    id: "Waterloo Region, ON",
    name: "Waterloo Region",
    tag: "UW • Laurier • Conestoga",
    icon: "🍁",
  },
  {
    id: "Toronto / Greater Toronto Area, ON",
    name: "Toronto / GTA",
    tag: "UofT • TMU • York",
    icon: "🏙️",
  },
  {
    id: "Vancouver / British Columbia, BC",
    name: "Vancouver / BC",
    tag: "UBC • SFU • BCIT",
    icon: "🌊",
  },
];

export function GlobalNav() {
  const pathname = usePathname();
  const [activeRegion, setActiveRegion] = useState<TargetCity>("Waterloo Region, ON");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const storedIntake = localStorage.getItem("waterloo_newcomer_intake");
        if (storedIntake && storedIntake.trim()) {
          const parsed = JSON.parse(storedIntake);
          if (parsed?.targetCity) {
            setActiveRegion(parsed.targetCity);
          }
        }
      } catch (e) {
        // Fallback
      }

      const handleRegionEvent = (event: Event) => {
        const customEvent = event as CustomEvent<{ targetCity: string }>;
        if (customEvent.detail?.targetCity) {
          setActiveRegion(customEvent.detail.targetCity as TargetCity);
        }
      };

      window.addEventListener("region-changed", handleRegionEvent);

      if (isSupabaseConfigured()) {
        getCurrentUser().then((user) => {
          if (user) setCurrentUser(user);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          setCurrentUser(session?.user || null);
        });

        return () => {
          authListener?.subscription?.unsubscribe();
          window.removeEventListener("region-changed", handleRegionEvent);
        };
      }
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCityDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    setIsUserDropdownOpen(false);
  };

  const handleSwitchCity = (cityId: TargetCity) => {
    setActiveRegion(cityId);
    setIsCityDropdownOpen(false);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("waterloo_newcomer_intake");
        let existing = {};
        if (stored && stored.trim()) {
          try {
            existing = JSON.parse(stored);
          } catch {
            existing = {};
          }
        }
        const updated = { ...existing, targetCity: cityId };
        localStorage.setItem("waterloo_newcomer_intake", JSON.stringify(updated));

        window.dispatchEvent(
          new CustomEvent("region-changed", {
            detail: { targetCity: cityId },
          })
        );
      } catch (e) {
        // Fallback
      }
    }
  };

  const isRouteActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#080c14]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] text-zinc-950 font-bold group-hover:scale-105 transition-transform flex-shrink-0">
                <Compass className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1">
                  NorthStar <span className="text-emerald-400 font-mono text-xs font-bold">/ Guide</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold tracking-wide hidden sm:inline">
                  Canadian Settlement Engine
                </span>
              </div>
            </Link>

            {mounted && (
              <div className="relative hidden md:block flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs text-zinc-200 font-bold transition-all shadow-xs cursor-pointer group"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="whitespace-nowrap">{activeRegion.split(",")[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                </button>

                <AnimatePresence>
                  {isCityDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 w-64 bg-[#0e1424] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-2 z-50 flex flex-col gap-1 backdrop-blur-2xl"
                    >
                      <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        Switch Arrival City
                      </div>
                      {AVAILABLE_CITIES.map((c) => {
                        const isSelected = activeRegion.includes(c.name.split(" ")[0]);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSwitchCity(c.id)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer whitespace-nowrap",
                              isSelected
                                ? "bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30"
                                : "hover:bg-white/[0.05] text-zinc-300"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span>{c.icon}</span>
                              <div className="flex flex-col">
                                <span className="font-semibold text-zinc-100">{c.name}</span>
                                <span className="text-[10px] text-zinc-400 font-normal">{c.tag}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex-shrink-0">
            {NAV_ITEMS.map((item) => {
              const active = isRouteActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-2",
                    active
                      ? "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] font-bold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] border border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-emerald-400" : "text-zinc-400")} />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {mounted && (
              <div className="relative flex-shrink-0">
                {currentUser ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="whitespace-nowrap flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-zinc-200 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-[11px] uppercase shadow-xs flex-shrink-0">
                        {currentUser.email ? currentUser.email[0] : "U"}
                      </div>
                      <span className="hidden lg:inline text-xs font-semibold max-w-[130px] truncate">
                        {currentUser.email}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline flex-shrink-0" />
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-[#0e1424] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-2 z-50 flex flex-col gap-1 backdrop-blur-2xl"
                        >
                          <div className="px-3 py-2 border-b border-white/[0.08]">
                            <p className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Signed in as</p>
                            <p className="text-xs font-bold text-white truncate">{currentUser.email}</p>
                          </div>

                          <div className="px-3 py-1.5 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 rounded-xl my-1 border border-emerald-500/20 whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                            <span>Cloud Sync Active</span>
                          </div>

                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="whitespace-nowrap hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] px-3.5 py-2 rounded-xl shadow-xs transition-all flex-shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="whitespace-nowrap">Sign In</span>
                  </Link>
                )}
              </div>
            )}

            <Link
              href="/contribute"
              className="whitespace-nowrap hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-2 rounded-xl shadow-xs transition-all flex-shrink-0 cursor-pointer"
              title="Contribute a Perk or Report a Bug (/contribute)"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Contribute</span>
            </Link>

            <Link
              href="/"
              className="whitespace-nowrap hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 px-3.5 py-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all flex-shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">New Intake</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none cursor-pointer flex-shrink-0"
              aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden border-t border-white/[0.08] bg-[#090d16]/98 backdrop-blur-2xl px-4 py-5 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {/* Mobile User Profile Section */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                  {currentUser ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-xs uppercase">
                          {currentUser.email ? currentUser.email[0] : "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white truncate max-w-[170px]">{currentUser.email}</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-semibold">Cloud Sync Active</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1.5 rounded-xl border border-rose-500/20"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs font-bold text-zinc-200 shadow-xs"
                    >
                      <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sign In to Sync Progress</span>
                    </Link>
                  )}
                </div>

                {/* Mobile City Switcher */}
                <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Current Destination
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {AVAILABLE_CITIES.map((c) => {
                      const isSelected = activeRegion.includes(c.name.split(" ")[0]);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSwitchCity(c.id)}
                          className={cn(
                            "py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-0.5",
                            isSelected
                              ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-xs font-bold"
                              : "bg-white/[0.04] text-zinc-300 border-white/[0.08] hover:bg-white/[0.08]"
                          )}
                        >
                          <span className="text-sm">{c.icon}</span>
                          <span className="truncate max-w-full text-[11px]">{c.name.split(" ")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-1.5">
                  {NAV_ITEMS.map((item) => {
                    const active = isRouteActive(item);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-3.5 rounded-2xl transition-all",
                          active
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                            : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center shadow-xs",
                              active ? "bg-emerald-500/25 text-emerald-300" : "bg-white/[0.06] text-zinc-400"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{item.name}</span>
                              {item.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-zinc-400 font-normal">
                              {item.description}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className={cn("w-4 h-4", active ? "text-emerald-400" : "text-zinc-500")} />
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile New Intake & Contribute CTAs */}
                <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2">
                  <Link
                    href="/contribute"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-200 py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
                    <span>Submit Perks & Report Bugs</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 py-3 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Configure New Intake</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Fixed Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080c14]/90 backdrop-blur-2xl border-t border-white/[0.08] px-3 py-2 shadow-2xl">
        <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
            const active = isRouteActive(item);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all text-[11px] font-medium relative",
                  active
                    ? "text-emerald-400 bg-emerald-500/10 font-bold border border-emerald-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5 mb-0.5", active ? "text-emerald-400" : "text-zinc-400")} />
                  {item.badge && !active && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
