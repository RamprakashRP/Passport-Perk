---
description: # Workflow: Implement Supabase Auth, Cloud Sync & PostHog
---

**Objective:** Transition the application from local state to a fully authenticated cloud application using Supabase and PostHog.

## Step 1: Authentication Shell
- Create a clean Login/Signup page at `app/login/page.tsx` using your existing FinTech UI components.
- Implement Supabase Auth utilizing Google OAuth and Magic Links to minimize newcomer onboarding friction.
- Protect the `/dashboard` route with a Next.js middleware checking for an active Supabase session.

## Step 2: Database Synchronization
- Define a Supabase database schema for a `user_profiles` table and a `user_tasks` table.
- Refactor the checklist component to trigger an asynchronous Supabase `upsert` when a task is checked.
- Implement an optimistic UI update so the checklist feels instantly responsive, handling any backend failures gracefully.

## Step 3: PostHog Telemetry Integration
- Install the `posthog-js` library.
- Create a global PostHog provider wrapper inside `app/layout.tsx`.
- Bind standard user identification to the PostHog instance upon a successful Supabase login.