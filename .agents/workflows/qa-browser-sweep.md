---
description: # Workflow: Pre-Flight Browser & Technical QA Audit  **Objective:** Use local browser tools to navigate the Next.js application at `http://localhost:3000` to identify technical friction, broken links, and responsive design failures.
---

## Step 1: Console & Hydration Audit
- Start the Next.js dev server if it is not already running.
- Navigate to the root page and the `/dashboard` route.
- Check the terminal and browser console for ANY hydration mismatches, missing React keys, or unresolved promises. Fix any discovered errors.

## Step 2: Link & Affiliate CTA Audit
- Identify all outbound `<a>` tags and CTA buttons (especially the 5-bank comparison cards).
- Verify that every link has a valid `href`.
- Verify that external links include `target="_blank"` and `rel="noopener noreferrer"`.

## Step 3: Mobile Viewport Check
- Emulate a mobile viewport (e.g., width 390px).
- Audit the `timeline-stepper` and `task-card-item` components. Ensure no horizontal scrolling or overlapping text occurs. Add `flex-col` or `w-full` Tailwind adjustments if mobile layouts are broken.

## Step 4: Final Report
- Output a summary of all fixes applied.
- If zero errors are found, output the command to initiate Vercel deployment.