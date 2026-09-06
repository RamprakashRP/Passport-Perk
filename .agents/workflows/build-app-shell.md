---
description: # Workflow: Implement Global Navigation & Perks Hub
---

/build-app-shell

**Objective:** The current navigation design (floating pills above the dashboard) is insufficient. We need to refactor the application to use a true, persistent FinTech Global App Shell, and implement persistent cloud saving.

## Step 1: Build the Global Navigation Shell
- Refactor `app/dashboard/layout.tsx` to include a persistent `GlobalNav` component.
- **Desktop View (`md:flex`):** A sleek, full-width top navigation bar with the brand logo on the left, and navigation links ("Checklist", "Perks & Offers", "Documents") in the center.
- **Mobile View (`md:hidden`):** A fixed bottom tab bar (like iOS apps) featuring icons for the three core routes. 
- **Styling:** Use a highly blurred glassmorphism effect (`bg-zinc-950/80 backdrop-blur-xl border-b border-white/10`).

## Step 2: Establish the 3 Core Routes
Ensure these three distinct pages are fully separated:
1. **`/dashboard` (The Checklist Engine):** Keep only Tier 1 (Mandatory) and Tier 2 (Essential) tasks here.
2. **`/dashboard/perks` (The Perks Hub):** Move the 5-Bank Comparison Matrix and all Tier 3 tasks (eSIM, SPC Card, PC Optimum) to this page. Style it as an "Exclusive Newcomer Marketplace".
3. **`/dashboard/documents` (The Vault):** Create a clean checklist for physical Port of Entry (POE) documents (LOA, Passport, GIC Certificate, Tuition Receipt).

## Step 3: Implement Persistent State (Cloud Sync)
- Currently, the app only exports data. We need it to save state.
- Update `TaskCardItem` to trigger a background save function when a checkbox is toggled.
- Implement a mock Supabase sync handler in `lib/supabase.ts` (e.g., `syncChecklistState(userId, state)`).
- Add a small UI indicator in the top navigation bar showing "Cloud Sync Active" (green dot) or "Saving..." to build trust.

Please execute this refactor, ensuring no hydration mismatches occur during the layout shift.