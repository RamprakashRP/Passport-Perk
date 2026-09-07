---
description: # Workflow: Mobile-First UX Overhaul & Expanded Benefits Engine
---

**Objective:** Refactor the PassportPerk application to feel like a native iOS/Android mobile app rather than a compressed desktop site. Optimize touch targets, reduce scroll fatigue, update the IRCC financial logic, and build a massive new Student Perks database.

## Step 1: Mobile-First Component Refactoring (Anti-Scroll Fatigue)
- **Compact Task Cards (`TaskCardItem`):**
  - Reduce mobile padding from `p-6` to `p-3` (desktop remains `md:p-6`).
  - Reduce mobile heading sizes from `text-xl` to `text-base font-semibold`.
  - Hide long descriptive text by default on mobile. Implement a clean "chevron down" icon to expand/collapse the description so the user doesn't have to scroll endlessly.
- **Button & Touch Target Optimization:**
  - Ensure all primary buttons, checkboxes, and links have a minimum touch target of `min-h-[44px]` (Apple HIG standard).
  - Use `w-full` for all buttons on mobile, but restrict them to `w-auto` on desktop.

## Step 2: The Mobile App Shell
- **Bottom Navigation Bar:**
  - Ensure the mobile bottom tab bar (`md:hidden fixed bottom-0 w-full`) uses `pb-safe` (Safe Area Insets) so it doesn't clash with the iPhone home indicator.
  - Add highly legible SVG icons for "Checklist", "Perks", and "Vault".
- **Sticky Headers:**
  - Make the category headers (e.g., "Phase 1: Pre-Departure") sticky (`sticky top-0 z-40 bg-slate-50/90 backdrop-blur`) so the user always knows where they are while scrolling.

## Step 3: IRCC Financial Accuracy & Tooltips
- Update all references to the GIC / Proof of Funds requirement.
- The primary required amount must be explicitly stated as **$23,448 CAD** (Effective Sept 1, 2026).
- Add an interactive info icon (tooltip) next to this number that states: *"For context: The requirement was $20,635 in 2024, and $22,895 up until August 31, 2026. IRCC officially updated it to $23,448 on Sept 1, 2026."*

## Step 4: Massive Expansion of the "Perks Hub"
- Expand the `/dashboard/perks` page beyond just banking and eSIMs. 
- Create a grid of compact, mobile-friendly cards for "Essential Student & Newcomer Discounts", including:
  1. **Transit:** Presto Card Post-Secondary Discount (save 40% on GO Transit).
  2. **Retail:** SPC (Student Price Card) integration details.
  3. **Groceries:** PC Optimum points optimization (Superstore/No Frills).
  4. **Subscriptions:** Amazon Prime Student (6 months free) and Spotify Student.
- Format these not as ads, but as "Insider Leverage" – explicitly calculating the estimated CAD savings for each to drive high-trust conversion.

## Step 5: QA & Hydration Check
- Ensure that the responsive classes (`flex-col` vs `md:flex-row`) do not trigger React hydration mismatches on initial load.