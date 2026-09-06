---
description: # Workflow: Build the Waterloo Pre-Arrival Engine MVP  **Objective:** Scaffold and build the core functionality of the B2B2C Newcomer SaaS, focusing on the dynamic intake form and task dashboard.
---

## Step 1: Initialization & Scaffold
- Initialize a Next.js 15 App Router project with TypeScript and Tailwind CSS (if not already done).
- Install required dependencies: `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`, and `@supabase/supabase-js`.
- Create the core folder structure (`components/`, `lib/`, `types/`).

## Step 2: Define Data Schemas
- Create a `types/index.ts` file.
- Define the TypeScript interfaces for:
  - `UserIntake` (city, visa_type, arrival_date)
  - `TaskCard` (id, title, description, isComplete, cta_link, cta_label)

## Step 3: Build the Intake Form (Client Component)
- Build a multi-step form at the root page (`app/page.tsx`) asking the user for their Intake Month, Target City (Waterloo/Toronto), and Visa Status.
- Store this state temporarily in LocalStorage or Zustand.
- Apply the premium FinTech UI rules (glassmorphism cards, bold typography).

## Step 4: Build the Dynamic Dashboard
- Create `app/dashboard/page.tsx`.
- Based on the Intake state, render a progress timeline (T-45 days, Transit, Post-Arrival).
- Render 3 specific Action Cards using the `TaskCard` schema (e.g., "Set up GIC", "Order e-SIM").
- Ensure all external affiliate links are clearly marked with premium button styling.

## Step 5: Self-Audit
- Open the dev server.
- Run a self-audit against the `.agents/rules/ui-standards.md` file. 
- Refactor any generic Tailwind classes to meet the strict FinTech aesthetic.