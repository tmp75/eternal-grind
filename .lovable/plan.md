
# Rebrand: OOO → INKO — Eternal Grind

Keep all current UI, components, animations, layout, routes, profile/XP, ICS calendar sync, drag-select, rank ladder. Only swap brand, copy, lore, and invert the default calendar/academy state.

## 1. Brand swap (global)

- Name: `OOO` → `INKO`, `Out of Office` → `Eternal Grind`
- Ticker: `$OOO` → `$INKO`
- Chain: `Solana · Pump.fun` → `Inkchain`
- Supply: 1,000,000,000 (1B) $INKO
- Tagline: "The smug meme that does nothing — and somehow stays on top."
- Mascot: purple smug coin / character (`user-uploads://inkocoin2.png`, `user-uploads://26A0329B-…png`) — copy both into `src/assets/` and use in Hero + Ticker + 404 (replace any Bartholomew leftovers).
- Remove every mention of: `OOO`, `Out of Office`, `Solana`, `Pump.fun`, `$OOO`, `Bartholomew`, `Eternity Corp`, `Ink Chain` (two words) → unify as `Inkchain`.
- Update `<title>` / OG / meta in `src/routes/__root.tsx` and every leaf route.
- New CTA link: replace `PUMP_FUN_URL` constant with `INKCHAIN_URL` (placeholder `https://inkonchain.com` until user gives final).

## 2. Invert the lore (smug grinder, not liberator)

INKO is *always* grinding (memetically). The joke: he does nothing but appears to grind harder than everyone. He teaches "peasants" his sacred grind techniques.

Tone shift in copy:
- Old: "Rest is resistance / clocked out / liberation hour"
- New: "Eternal grind / never log off / always-on / sigma posture / smug stillness"
- Status strings flip: "Out sick" → "Grinding", "In a meeting" → "In deep grind", "Brb" → "Grinding harder".

## 3. Calendar — default to WORK, overlay grind steps

In `src/lib/ooo.ts` (rename file to `src/lib/inko.ts`, update imports):
- `buildDefaultWeek()` returns every 9–17 cell as `type: "work"`, `origin: "ooo"` → `origin: "inko"`.
- Replace `FREE_BLOCKS` with `GRIND_STEPS`: small overlays that turn specific cells into `type: "grind"` (new BlockType replacing `free`) with labels like "Smug Standup", "Sigma Lunch (eaten at desk)", "Performative Email Sprint", "Calendar Theater", "Ghost Productivity", "Inbox Zero Cosplay".
- BlockType becomes: `"work" | "grind" | "ghost"`. Colors: work = neutral bone/gray (dominant), grind = violet/ink accent (the "tiny corner" inverted — grind is now the highlight on top of work), ghost = dimmed.
- Legend updates: "Pure grind", "Smug grind overlay", "Ghost step".
- Drag-select, templates, reset-OOO-blocks (rename → "Reset INKO steps"), ICS sync, locked external events: **unchanged**.
- Template buttons renamed: "Ghost Friday" → "Sigma Friday", "Sacred Lunch" → "Desk Lunch", "Full Free Week" → "Maximum Grind Week".

## 4. Academy — always grinding, count points unchanged

- Rename lessons collection theme: every lesson reframed as a "grind technique" INKO teaches.
- Keep XP, ranks, completion logic intact. Rank ladder rename:
  `Intern → Apprentice Grinder → Senior Grinder → Smug Sigma → INKO Disciple → INKO Himself`
- Lesson categories: "Posture", "Optics", "Calendar Theater", "Slack Sigma", "Email Aikido", "Smug Stillness".
- XP HUD label: "Grind Points" instead of "Lich Points".
- Filter labels stay (Learned / Unlearned).

## 5. Routes / Nav

- Keep all routes; rename labels only:
  - `/ticker` label `$OOO` → `$INKO`
  - Nav subtitle `// Inverted Calendar` → `// Eternal Grind`
- `/ticker` page: rewrite parody whitepaper for $INKO on Inkchain, 1B supply, "candles invert when you pretend to work harder", MARKET OPEN bell → "GRIND BELL @ 09:00".

## 6. Sections to rewrite copy (no structural changes)

`Hero.tsx`, `TickerBand.tsx`, `Liberation.tsx` (rename component+route copy to `EternalGrind` section — file rename optional), `MissionsPreview.tsx`, `SurvivalTactics.tsx` (TACTICS reframed as grind tactics: Costanza Protocol → "The Costanza Grind", Green Dot Theater stays, Reply-All Friday → "Reply-All Sigma Hour"), `BathroomROI.tsx` ("paid toilet" → "Toilet Grind ROI — earn while grinding spiritually"), `TokenomicsTerminal.tsx` (1B supply, Inkchain, $INKO utility = unlocks grind techniques), `InvertedCalendarPreview.tsx` (label flip: work dominates, grind is the bright overlay).

## 7. Assets

- Copy `user-uploads://inkocoin2.png` → `src/assets/inko-coin.png`
- Copy `user-uploads://26A0329B-8687-4345-9EF2-8ACA2C0DBDF3.png` → `src/assets/inko-mascot.png`
- Use coin in Ticker/Tokenomics, mascot in Hero + 404.

## 8. Technical notes

- `src/lib/profile.ts`: storage key bumped `ooo.profile.v1` → `inko.profile.v1` (one-time reset acceptable since local-only). Same for calendar key.
- BlockOrigin renamed `"ooo"` → `"inko"` everywhere; type alias kept.
- No backend changes. No new deps.
- Lucide icons stay (no emojis).

## Out of scope

- Real Inkchain contract address (placeholder until provided)
- Real OAuth Google/Apple sync (still ICS-only)
- New routes
