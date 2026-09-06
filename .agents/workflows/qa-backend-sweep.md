---
description: # Workflow: QA Backend, State & Telemetry Sweep
---

**Objective:** Audit the Next.js application to ensure Supabase client instantiation, PostHog event dispatching, and Guest Mode state retention are functioning without hydration or routing errors.

## Step 1: Telemetry Verification
- Boot the local dev server.
- Simulate a click on the "Scotiabank StartRight" or "PhoneBox eSIM" affiliate buttons.
- Open the terminal console. Verify that the `[TELEMETRY]` log fires successfully with the correct payload (`event_name`, `partner_id`, `category`).

## Step 2: Guest Mode (Local State) Audit
- Navigate to `/dashboard` without an active Supabase session (unauthenticated).
- Check 3 tasks (e.g., GIC, POE Letter, eSIM).
- Hard refresh the page.
- Verify that the tasks remain checked (confirming `localStorage` fallback is working for users who do not want to log in immediately).

## Step 3: Middleware & Route Security
- Verify that attempting to access a strictly protected route (if any exist beyond the public dashboard) correctly redirects unauthenticated users to `/login`.
- Verify 0 console errors regarding missing Supabase or PostHog environment variables.

## Step 4: Report Output
- Output a clear pass/fail report on Telemetry, Guest Mode, and Environment Variables.