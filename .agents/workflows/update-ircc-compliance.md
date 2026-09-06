---
description: # Workflow: IRCC 2026 Regulatory Compliance Update  **Objective:** Update the entire Waterloo Pre-Arrival Engine codebase to reflect the latest IRCC regulations effective September 1, 2026, and eliminate all references to the defunct SDS stream.
---

## Step 1: Purge SDS References
- Locate all instances of "SDS", "Student Direct Stream", and "Fast-track" across the codebase (specifically in `types/index.ts`, `lib/data/default-tasks.ts`, and `components/features/intake-form.tsx`).
- Remove the SDS vs. Non-SDS selection from the intake form. All users now apply under the "Standard Study Permit" stream.
- Update the expected processing time text to state "8 to 12 weeks".

## Step 2: Update Financial Thresholds (Sept 2026)
- Update all references to the cost-of-living or GIC amount. 
- The new mandatory living expense threshold is **$23,448 CAD** (effective Sept 1, 2026).
- Clarify in the UI that this $23,448 is for *living expenses only* and is required on top of first-year tuition and travel costs.
- Update the Banking/GIC action cards to state: *"Purchase a $23,448 CAD Student GIC (Highly recommended for Proof of Funds)."*

## Step 3: Verify the Changes
- Run a self-audit on `lib/data/default-tasks.ts` to ensure no old `$20,635` or `$22,895` figures remain.
- Ensure the Next.js app compiles cleanly without type errors after altering the `UserIntake` and `TaskCard` interfaces.