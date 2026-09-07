---
description: # Workflow: PassportPerk Brand Integration & Copy Overhaul
---

**Objective:** Execute a comprehensive find-and-replace across the codebase to establish "PassportPerk" as the official brand identity, updating metadata, navigation, and user-facing copy.

## Step 1: Global Metadata & SEO SEO Update
- Open `app/layout.tsx`.
- Update the `metadata` object:
  - `title`: "PassportPerk | The Ultimate Canadian Student Settlement Guide"
  - `description`: "Your unfair advantage for moving to Canada. Compare GIC options, unlock exclusive student discounts, and track your mandatory IRCC compliance tasks."
- Ensure the `<title>` tag correctly reflects the new brand.

## Step 2: App Shell & Navigation Overhaul
- Open `components/layout/global-nav.tsx`.
- Replace any existing placeholder logo text (e.g., "NorthStar") with the text "PassportPerk". 
- Style the text logo using standard Tailwind utility classes to make it look premium (e.g., `<span className="font-bold text-slate-900 tracking-tight">Passport</span><span className="text-emerald-600 font-semibold">Perk</span>`).

## Step 3: Copywriting & Tone Adjustment
- Search across `app/dashboard/page.tsx`, `app/page.tsx` (Intake Form), and `app/dashboard/perks/page.tsx`.
- Replace clinical terms like "Pre-Arrival Engine" or "Readiness Matrix" with consumer-friendly brand copy:
  - "Welcome to PassportPerk"
  - "Your Canadian Settlement Roadmap"
  - "Unlock Your Student Perks"
- Ensure the tone remains highly empathetic, clear, and reassuring, perfectly matching the High-Trust Light Theme.

## Step 4: Verification
- Run a build check to ensure no hardcoded placeholder names remain in the user-facing UI.