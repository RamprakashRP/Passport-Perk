---
trigger: always_on
---

# UI/UX Engineering Standards (Premium FinTech Aesthetic)

## The Core Vibe
The application must look and feel like a high-end, venture-backed Canadian FinTech startup (e.g., Wealthsimple, Neo Financial). It must immediately evoke trust, speed, and premium quality. 

## 1. Color System (Strict Hex Codes)
- **Backgrounds:** Use rich dark themes. Base: `bg-zinc-950`. Cards: `bg-zinc-900`. 
- **Borders:** Ultra-subtle. Use `border-white/5` or `border-zinc-800`.
- **Primary Accents (Action Elements):** 
  - Emerald Success: `#10b981` (Use for completed tasks and primary calls to action).
  - Accent Blue: `#3b82f6` (Use for information and navigation).
- **Text:** Primary text `text-zinc-100`. Secondary text `text-zinc-400`. 

## 2. Typography Constraints
- **Sans-Serif Only:** Use `Inter` or `Geist` for all functional text.
- **Headers:** Must use tight tracking (e.g., `tracking-tight`). 
- NEVER use standard Tailwind blue/purple gradients on text. If a gradient is needed, make it subtle (e.g., `bg-gradient-to-br from-zinc-100 to-zinc-400 bg-clip-text text-transparent`).

## 3. UI Components & Layouts
- **Cards:** No heavy drop shadows. Use glassmorphism: `bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl`.
- **Buttons:** Must have clear hover states. Use Framer Motion for a subtle scale effect (`whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}`).
- **Spacing:** Use generous padding. Never crowd text. Rely heavily on `flex` and `gap-4` or `gap-6`.

## 4. Banned Practices
- Do NOT use standard centered white boxes with `shadow-lg` on gray backgrounds.
- Do NOT use standard Bootstrap-style alert boxes.
- Do NOT use default system fonts.