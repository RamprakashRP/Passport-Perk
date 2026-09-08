---
description: # Workflow: "Student Beans" Style Perks Hub Refactor
---

**Objective:** Completely redesign the `/dashboard/perks` page. Transition from a heavy, dense financial comparison table into a clean, modern, visual "Coupon / Deal Board" mimicking Student Beans or UNiDAYS. 

## Step 1: De-Clutter & Strip Data
- Remove all mentions of "GIC Processing Fees," "Monthly Fees," "Branch Locations," and dense feature checkmarks from the Perks cards.
- The user handles GIC logic elsewhere; this page is strictly for **Rewards and Savings**.

## Step 2: Atomic Deal Cards (The Voucher Aesthetic)
- Break down the offers into distinct, atomic "Deal Cards". 
- Each card must have:
  1. **Brand Logo / Identity:** A distinct header or avatar space for the brand logo (e.g., a red square for Scotiabank, a green shield for TD).
  2. **The Hook (Zoomed In & Bold):** The actual perk must be the largest text on the card (e.g., `<h3 className="text-2xl font-black">Free Apple AirPods 4</h3>`).
  3. **The Provider:** Smaller text indicating who provides it (e.g., "via RBC Student Banking").
  4. **The CTA:** A single, clear, high-contrast button to claim the offer (e.g., "Claim AirPods", "Get $150 Bonus").

## Step 3: Implement the Specific 2026 Perks
Create the following atomic cards based on current active offers:
1. **RBC Royal Bank:** 
   - Perk: **Free Apple AirPods 4**
   - Subtext: "Open your first RBC Advantage Student Account by Nov 2, 2026."
2. **TD Canada Trust:**
   - Perk: **$150 Cash Bonus**
   - Subtext: "Open a TD Student Chequing Account by Nov 2, 2026."
3. **Scotiabank:**
   - Perk: **$150 Welcome Cash**
   - Subtext: "Open a Student Banking Advantage Plan."
4. **Too Good To Go:**
   - Perk: **Cheap High-Quality Meals**
   - Subtext: "Save up to 70% on daily unsold food from local restaurants."
5. **Uber/Lyft Hacks:**
   - Perk: **50% Off First 5 Rides**
   - Subtext: "Create a fresh account upon landing to claim newcomer transit promos."
6. **PC Optimum:**
   - Perk: **10% Back on Groceries**
   - Subtext: "Show your Student ID on Tuesdays at Loblaws/Zehrs/NoFrills."

## Step 4: Layout & Mobile Polish
- Display the cards in a responsive CSS Grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
- Ensure cards use standard "coupon" styling: pure white backgrounds, subtle shadows, and perhaps a dashed border accent to mimic a voucher.
- Verify all touch targets for the buttons are mobile-friendly.