## Goal

Keep the hero's design + motion intact. Rewrite all copy in the punchier "$OOO / Out Of Office / Solana / Pump.fun / auto-reply" voice, ship a properly working calendar, and grow the Academy into a real searchable library of ~50 lessons (with room for 100).

## Scope

### 1. Hero — copy only (design untouched)
- Top-left badge → `● AUTO-REPLY ACTIVE · SOLANA · PUMP.FUN`
- Top-right → `Liberation in HH:MM:SS` + `MARKET OPEN @ 17:00`
- Eyebrow → `THE ONLY ASSET THAT APPRECIATES WHEN YOU'RE NOT WORKING`
- Subheadline → "A digital sanctuary for the burnt-out corporate soul."
- CTAs: `MINT $OOO →`, `ENTER THE ACADEMY (100 LESSONS)`, `OPEN THE CALENDAR`
- Add stat strip below CTAs: `TICKER $OOO · SUPPLY 1B · CHAIN SOLANA`
- Fix hydration bug on the countdown (initialize after mount so server/client match)

### 2. Ticker band — new copy
- Top: `OUT OF OFFICE • MINTING FREEDOM • CLOCKED OUT INDEFINITELY • THE ONLY ASSET THAT APPRECIATES WHEN YOU'RE NOT WORKING • $OOO • AUTO-REPLY ACTIVE`
- Bottom: `STRATEGIC FREE AFTERNOON • GHOST FRIDAY • COFFEE PILGRIMAGE • GREEN DOT THEATER • THE COSTANZA PROTOCOL`

### 3. Today / Peace Dashboard
Rename to **MODULE 02 — Quantify Your Liberation** with a real Bathroom ROI calculator:
- Annual salary input (default 60,000), live $/sec rate
- `▶ START POOP` / `■ FLUSH & RETURN` / `RESET`
- Live counter of seconds + dollars earned on the throne
- Receipts panel: "FOR HR (do not actually send)"
- Keep the existing live €→$ daily acquired card as the secondary tile

### 4. Corporate Survival Tactics (new section, replaces Half-Truths)
**MODULE 01 — Field-tested protocols.** Six cards from the supplied copy: STEALTH / HYDRATION / CALENDAR / EMAIL / SLACK / TACTICS, each with title + body + footer `// FILED UNDER: $OOO`. Hover ink-glow.

### 5. Inverse Calendar — make it actually work (`/calendar`)
Replace static grid with a real interactive week:
- 9–18h × Mon–Fri grid with seeded inverted week (mostly green free blocks, work as the corner)
- Click any cell → toggle between `🟢 Free` / `⚫ Work` / `👻 Ghost Meeting`
- Drag-select multiple cells (mousedown → mouseenter → mouseup) to bulk-mark blocks
- Live counters in header: `Free hours: X · Work hours: Y · Inversion ratio: Z:1`
- Template buttons that bulk-apply: `Strategic Free Afternoon`, `Ghost Friday`, `Sacred Lunch`, `Meeting I Cancelled in My Head`, `Reset week`
- "Trigger events" rail under the grid: `11:00 COFFEE CRITICAL`, `13:00 Caloric Intake`, `16:59 SYSTEM OVERRIDE` — clicking one fires a fullscreen `EVACUATING` / `Snooze` modal
- Persist edited week to `localStorage` (client-only, mounted in `useEffect` to avoid hydration mismatch)

### 6. Tokenomics Terminal (new section on `/`)
**MODULE 04** — terminal-style table: Ticker `$OOO` · Supply `1,000,000,000` · Network `Solana` · Launchpad `Pump.fun` · Tax `0/0` · Utility `Liberation`. CTA banner: `Mint Your Freedom.` → `BUY $OOO ON PUMP.FUN →`.

### 7. Academy (`/academy`) — real library
- Eyebrow `CURRICULUM 2026 · 100 LESSONS`, headline "The Academy of Doing Nothing."
- Search input (filters by title/body/tag, case-insensitive)
- Tag filter chips: `STEALTH`, `EMAIL`, `SLACK`, `CALENDAR`, `HYDRATION`, `TACTICS`, `NAP`, `BATHROOM`
- Category badges per card: `HALF TRUE` / `HALF LIE` / `BOTH`
- Expand to **~50 lessons** in `src/lib/academy.ts` (seeded library, room for 100). Mix of the existing rank-based lessons + new ones inspired by Costanza Protocol, 45-min coffee pilgrimage, Green Dot Theater, Reply-All Friday 4:58pm, etc.
- Empty state copy from spec
- Keep the Lich Points rank ladder as a visual sidebar

### 8. Liberation finale
Reword to `17:00 — SYSTEM OVERRIDE` with the auto-reply card (`Subject: Out Of Office (∞)` etc.). Final big text: `OUT OF OFFICE. FOREVER.`

### 9. Footer
- Email signature → `© $OOO · Auto-reply enabled indefinitely`
- Disclaimer → `Not financial advice. Definitely lifestyle advice.`
- Departments links unchanged.

### 10. SEO meta — per-route
Update `head()` for `/`, `/calendar`, `/missions`, `/academy`, `/ticker` with the titles/descriptions from the supplied copy block.

## Technical notes

- Hydration fix: countdown in Hero + dashboard read `Date.now()` on render. Move all time-derived state into `useState(() => initial)` + `useEffect` that sets state on mount. Render placeholder `--:--:--` on first SSR pass.
- Calendar state lives in a `useState<CalendarBlock[]>` hydrated from `localStorage` inside `useEffect` (never during render).
- Drag-select: mouse handlers on the grid container, track `dragStart` + `hoverCell`, commit on `mouseup`.
- New file: `src/lib/academy.ts` for the 50-lesson library.
- New section files: `SurvivalTactics.tsx`, `BathroomROI.tsx`, `TokenomicsTerminal.tsx` (replaces `HalfTruths.tsx` + `PeaceDashboard.tsx`; old files removed).
- All links/routes stay as-is — no new routes.
- Brand untouched: keep purple/pearl/obsidian/necro green tokens. Keep Hero's blob, ink cursor, marquee, scroll progress.

## Out of scope (for this pass)
- Real Solana wallet / Pump.fun integration (CTAs are external links to `https://pump.fun`).
- The full 100 Academy lessons (ship 50 well-written ones; system supports adding more).
- Mobile-only animations beyond what already works.