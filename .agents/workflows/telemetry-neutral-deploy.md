---
description: # Workflow: Telemetry Instrumentation, Bank Neutralization & Vercel Prep  **Objective:** Refactor the Waterloo Pre-Arrival Engine to eliminate single-bank bias, implement outbound click tracking, and make the application 100% production-ready for dep
---

## Step 1: Banking Engine Neutralization
- Inspect `lib/data/default-tasks.ts`.
- Refactor the banking task cards from a Scotiabank-exclusive card into a dynamic **Canadian Student Banking Comparison Suite**.
- Include accurate student profiles for:
  1. **Scotiabank StartRight:** Highlight $150 bonus + King & University branch location.
  2. **CIBC Student Banking:** Highlight fast GIC processing + no monthly fee while enrolled.
  3. **TD Student Chequing:** Highlight extended branch hours + student credit card.
  4. **Simplii Financial:** Highlight high-yield savings + zero daily transaction fees.
- Update `TaskCard` interfaces in `types/index.ts` if additional comparison metadata is required.

## Step 2: Implement Telemetry Client & Event Hook
- Create `lib/telemetry.ts`:
  - Export a lightweight utility function `trackEvent(eventName: string, properties: Record<string, any>)`.
  - Include automatic fallback to `localStorage` queue if Supabase credentials are not yet wired to a live project.
- Update `components/features/task-card-item.tsx` and `components/ui/button.tsx`:
  - Wrap all affiliate CTA clicks with `trackEvent('affiliate_click', { partner, category, url })`.
  - Ensure links open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`).

## Step 3: Deployment Audit & Vercel Hardening
- Audit `package.json` to verify build scripts: `"build": "next build"`.
- Run a typecheck and production build dry-run (`npm run build`).
- Verify there are no hardcoded secrets or broken environment variable fallbacks in `lib/supabase.ts`.
- Ensure all dynamic routes and components are hydration-safe.

## Step 4: Verification Report
- Print out the list of all instrumented buttons.
- Confirm local dev server builds cleanly with zero errors.
- Output exact step-by-step terminal instructions for deploying the project to Vercel via the Vercel CLI (`npx vercel`) or GitHub integration.