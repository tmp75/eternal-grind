## Goals

1. Hero mascot rendered larger, properly framed, no overflow / blur clipping.
2. Module 02 ROI calculator becomes a real "smug paycheck" tool: working hours/week + base salary defaulting to $100k + multi-activity earnings.
3. Default calendar uses the user's salary + hours to auto-suggest break windows that "earn free money", plus an OOO booking flow that reschedules missed tasks into the user's preferred time slots.
4. Google / Apple calendar connect flow is more user-friendly (step-by-step, abstracted), and the developer-only "two-way sync" disclaimer is removed from user view.
5. Verify Academy XP truly persists locally and progress is honored everywhere; add more lessons; upgrade card animations.

---

## 1. Hero mascot

`src/components/sections/Hero.tsx`
- Bump mascot to `h-56 md:h-72 lg:h-80 w-auto`, wrap in a fixed-aspect container so the glow doesn't clip on small viewports.
- Add a subtle floating animation (Framer Motion `y: [0, -8, 0]` loop), keep entry blur-in.
- Add a soft radial backdrop behind the mascot (separate absolute div) so it reads against the goo blobs.
- Add `loading="eager"` and `decoding="async"` for stability.

## 2. Module 02 — Toilet Grind ROI → Smug Paycheck

`src/lib/profile.ts`
- Extend `Profile` with `hoursPerWeek: number` (default 40), `weeksPerYear: number` (default 52, kept internal), and `activeActivity: ActivityId | null` for cross-section sync.
- Bump default `salary` to `100_000`.
- Add migration: existing stored profiles with `salary === 60000` stay as-is (user explicit), but new defaults use 100k.

`src/components/sections/BathroomROI.tsx` (rename section heading to "Smug Paycheck Calculator", keep file path):
- Inputs: annual salary, hours/week (slider 10–80), and an activity picker.
- Activities (icon + label + rate multiplier on idle/grind earnings):
  - Toilet Grind (Armchair)
  - Coffee Walk (Coffee)
  - Smoke Break (Cigarette / fallback `Wind` since Lucide lacks cigarette)
  - Eating Lunch (UtensilsCrossed)
  - Looking Busy (EyeOff)
  - Strategic Meeting Nod (Users)
- Live computed rate: `salary / (hoursPerWeek * 52 * 3600)` per second; show $/sec, $/min, projected $/day.
- Running totals per activity stored in `profile.activityTotals` (Record<ActivityId, seconds>) so the throne/coffee/smoke add up over time (localStorage).
- Reset button per session + global "Clear lifetime grind" in `/profile`.

## 3. Default calendar from salary + suggested breaks + OOO booking

`src/lib/ooo.ts`
- New `buildSuggestedWeek({ hoursPerWeek, startHour=9 })`: fills `work` blocks until the weekly target is met, then automatically inserts smug grind breaks ("Free Money Break — you earn $X doing nothing here") at high-ROI slots (mid-morning, post-lunch).
- New `BlockType` value `ooo` (Out-of-Office celebration) — visually distinct (pink). Old `ghost` stays.
- Helper `suggestRebookSlots(week, durationMin)` returns next free grind slots so a missed task can be re-booked.

`src/routes/calendar.tsx`
- On first load when `profile.calendar == null`, build via `buildSuggestedWeek` using profile salary/hours instead of the static default.
- New top banner: "You earn $X.XX per free-money break. INKO suggests N breaks this week." (computed live).
- Cycle becomes `work → free (grind) → ghost → ooo`. New legend entry "OOO — booked elsewhere".
- New "Celebrate OOO" modal: pick a task (from external events OR an existing grind block), choose a preferred time-of-day band (morning/afternoon/evening), and we move/clone it into the first matching grind slot. External events stay locked; we create an `inko`-origin `ooo` block alongside with the rebooked title.
- "Reset INKO steps" template now rebuilds from `buildSuggestedWeek` (still preserves `origin: external` blocks — unchanged contract).

## 4. Google + Apple calendar connect UX

`src/routes/calendar.tsx` `ConnectModal`:
- Replace single ICS-URL input with a 3-step stepper:
  1. Choose provider (Google / Apple / Other ICS).
  2. Guided instructions with platform-specific screenshots-style numbered cards and a "Copy template URL" helper for Google.
  3. Paste link + name → test fetch button shows a green "found N events" confirmation before saving.
- Add a "Try a demo calendar" button that loads a bundled sample ICS so users see the flow without their own URL.
- **Remove** the violet "Two-way sync … Lovable Cloud + OAuth — coming soon" disclaimer from the user-facing modal (keep as `{/* dev note */}` HTML comment only).
- Above the modal trigger row, add a short reassurance line: "Read-only. We never touch your real meetings."

## 5. Academy — verify persistence, more lessons, animations

`src/lib/profile.ts`
- Audit `toggleLesson` + `useProfile` rehydration: confirm `completedLessons` and `xp` round-trip through localStorage on reload (currently correct; add a unit-style smoke check inline by reading once on mount and logging a warning if mismatch — dev only `if (import.meta.env.DEV)`).

`src/lib/academy.ts`
- Add ~15 new lessons across existing tags (push total to ~65) covering: "Calendar Tetris", "The Pre-Read Bluff", "The 4:47 PM Shipped Post", "Vacation Auto-Reply Forever", "The Standup Mute Cough", etc. Distribute XP across rank tiers so progress feels earned.

`src/routes/academy.tsx`
- Card animations upgrade: add `whileHover={{ y: -4, rotateX: 2 }}` with `transformPerspective: 800`, a sliding gradient sheen via pseudo element, and a stamped "MASTERED" badge that scale-spins in when toggled (`AnimatePresence` + `motion.span`).
- Add a sticky mini-HUD ("Rank · XP · % mastered") that pins under filters on scroll for instant feedback.

---

## Out of scope

- Real OAuth for Google/Apple (still ICS-only, just better UX).
- Server persistence (everything stays in `localStorage`).
- Pushing INKO steps back to external calendars.

## Files touched

- `src/components/sections/Hero.tsx`
- `src/components/sections/BathroomROI.tsx`
- `src/lib/profile.ts`
- `src/lib/ooo.ts`
- `src/lib/academy.ts`
- `src/routes/calendar.tsx`
- `src/routes/academy.tsx`
- `src/routes/profile.tsx` (expose new fields: hours/week, lifetime activity totals, clear button)
