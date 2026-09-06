---
trigger: always_on
---

# Rule: Next.js App Router Architecture & Navigation Map

**Objective:** Maintain a strict, predictable routing structure and layout system for the Pre-Arrival Engine. Never deviate from this folder structure without explicit permission.

## 1. The Global App Shell (Navigation)
- **Layout File:** `app/dashboard/layout.tsx`
- **Implementation:** Create a persistent sidebar or top navigation bar (for mobile) that wraps all `/dashboard` routes.
- **Navigation Links:**
  - `Checklist` (Route: `/dashboard`) - The core timeline and tasks.
  - `Perks & Offers` (Route: `/dashboard/perks`) - The dedicated hub for student discounts and banking.
  - `Documents` (Route: `/dashboard/documents`) - Requirements list and POE upload checklist.

## 2. Inbuilt Saving (Supabase Integration)
- Do not rely solely on `localStorage` for returning users.
- **Database Schema:** Ensure the Supabase `tasks` table tracks `user_id`, `task_id`, and `is_complete`.
- **State Management:** When a user checks a task, it must trigger a Next.js Server Action or Supabase client mutation to silently save the state to the cloud.

## 3. Component Hierarchy
- `components/layout/global-nav.tsx`: The main navigation bar.
- `components/features/`: Complex, stateful client components.
- `components/ui/`: Reusable FinTech styled primitives (cards, badges, buttons).