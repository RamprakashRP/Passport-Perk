---
description: # Workflow: Multi-City Dynamic Routing Engine (Toronto, Vancouver, Waterloo)
---

**Objective:** Refactor the Pre-Arrival Engine to capture national traffic by asking for the user's destination region, then dynamically rendering hyper-local tasks for Waterloo, Toronto (GTA), or Vancouver (BC) while maintaining the 3-Tier priority system.

## Step 1: Upgrade the Intake Form (Client State)
- Update `components/features/intake-form.tsx` and the `UserIntake` schema in `types/index.ts`.
- Add a new "Destination Region" selector to Step 1 with three options:
  1. `Waterloo Region, ON`
  2. `Toronto / Greater Toronto Area, ON`
  3. `Vancouver / British Columbia, BC`

## Step 2: Refactor the Task Database Engine
- Update `lib/data/default-tasks.ts`. Instead of a single static array, create a dynamic function or object mapping that merges **Global Tasks** with **Regional Overrides** based on the user's selected region.

**A. Global Tasks (Applies to ALL users):**
- Tier 1: Print POE Letter & LOA.
- Tier 1: Fund $23,448 CAD Student GIC (Keep the 5-bank comparison matrix).
- Tier 1: Activate Canadian eSIM before boarding.
- Tier 2: Apply for Beginner Canadian Credit Card.

**B. Regional Overrides (Inject dynamically):**

*If Region === Waterloo Region, ON:*
- Tier 1 (Identity): SIN at Kitchener Service Canada (25 Frederick St).
- Tier 1 (Health): UHIP Registration.
- Tier 2 (Transit): WatCard for Grand River Transit (GRT) & ION LRT.
- Tier 3 (Travel): GO Transit from Pearson (YYZ) to Waterloo.

*If Region === Toronto / GTA, ON:*
- Tier 1 (Identity): SIN at Toronto City Hall Service Canada (100 Queen St W).
- Tier 1 (Health): UHIP Registration.
- Tier 2 (Transit): Set up PRESTO Card for TTC (Subway/Bus/Streetcar) & GO Transit.
- Tier 3 (Travel): UP Express student fare from Pearson (YYZ) to Union Station.

*If Region === Vancouver / BC:*
- Tier 1 (Identity): SIN at Sinclair Centre Service Canada (757 Hastings St W).
- Tier 1 (Health): Apply for BC MSP (Medical Services Plan) - Mandatory upon arrival.
- Tier 2 (Transit): Set up Compass Card for TransLink (SkyTrain & Bus).
- Tier 3 (Travel): YVR SkyTrain (Canada Line) to Downtown Vancouver.

## Step 3: Implement Dashboard State Routing
- Update `app/dashboard/page.tsx` to read the destination region from local storage/state.
- Render the correct array of tasks into the timeline stepper.
- Ensure the progress bar and tier filtering logic still work flawlessly with the dynamically injected tasks.
- Verify no TypeScript or hydration errors occur during region switching.