# Plan — Profile, Calendar Sync, Icons, Academy Points

## 1. Local user profile (foundation for everything else)

New `src/lib/profile.ts` — a `localStorage`-backed profile (`ooo.profile.v1`) holding:
- `handle` (default "Anonymous Slacker"), `joinedAt`, `salary` (for ROI), `rank`, `xp`
- `completedLessons: number[]` (Academy progress)
- `calendar` edits (moved here from `ooo.calendar.v1`)
- `externalCalendars: { id, provider: "google"|"apple"|"ics", name, url, lastSync }[]`
- `externalEvents: ExternalEvent[]` (read-only, fetched from ICS)

New `useProfile()` hook + tiny event emitter so Hero / Academy / Calendar / Footer all react to changes. SSR-safe (hydrate in `useEffect`, render placeholders first).

New `/profile` route — minimal page: handle, salary, rank ladder progress bar, XP total, completed lessons count, connected calendars list, "Export / Reset profile" buttons.

> *Why local, not Cloud auth*: user said "profile **or local memory**". Local keeps zero-friction. The data shape is designed so we can later swap the storage layer for Lovable Cloud + auth without touching components.

## 2. Calendar — connect Google & Apple

**Honest reality** (worth knowing before approving):
- **Apple Calendar** has no public OAuth API. The only universal way to read it is via an **ICS subscription URL** (iCloud → Calendar → Share → Public Calendar → copy `webcal://…` link). Same for Outlook/Google "secret address" links.
- **Google Calendar two-way edit** needs per-user OAuth, which requires Lovable Cloud + your own Google Cloud OAuth app (workspace connector only reads *your* calendar, not each visitor's).

**This pass ships the universal path that works today:**
1. New `Connect Calendar` panel above the grid with two buttons: `Google Calendar` and `Apple Calendar`, each opening a modal with paste-friendly instructions + an ICS URL input.
2. Pasted URL is saved to profile. We fetch it client-side, parse with `ical.js` (added via `bun add ical.js`), and overlay events onto the week grid as a fourth cell type: `booked` (read-only, neutral gray with a small lock icon, shows event title on hover).
3. "Refresh" button + auto-refresh on mount (cached 10 min). CORS-safe ICS hosts (Google/iCloud public links) work directly from the browser; if a URL fails CORS we surface a clear error and a "we'll add server-side fetch when Cloud is enabled" note.
4. UI also exposes a disabled `Connect with Google (full two-way sync)` button with a tooltip: "Requires Lovable Cloud + Google OAuth setup — coming soon." This makes the upgrade path obvious without faking it.

**Edit-back** (writing OOO blocks to the real calendar) is **out of scope** this pass — requires Cloud + OAuth. Documented as the next step.

## 3. Reset week — preserve real bookings

`Reset week` button currently calls `setCells(buildDefaultWeek())` which nukes everything. New behavior:
- Only resets cells whose origin is `"ooo"` (user-created or template-applied OOO blocks).
- Cells whose origin is `"external"` (from imported ICS) are untouched.
- Add `origin: "ooo" | "external"` field to `CalendarCell`. External events are merged on top of the user week, never persisted into the editable layer.
- Button label tightened to `Reset OOO blocks` with a small confirmation toast: "Your real bookings stay put."

## 4. Remove emojis → Lucide icons

Audit + swap across the app. Each emoji gets a semantic Lucide icon styled with our tokens (text-necro / text-ink / text-violet):

| Emoji | Replacement |
|---|---|
| 🟢 Free | `Sparkles` (necro) |
| ⚫ Work | `Briefcase` (bone/60) |
| 👻 Ghost | `Ghost` (violet) |
| 🍝 Sacred Lunch | `UtensilsCrossed` |
| 🚽 Paid Toilet | `Armchair` |
| ☕ Coffee Pilgrimage | `Coffee` |
| 🎯 Fake Focus | `Target` |
| 🤧 Doctor's Note | `Stethoscope` |
| ▶ / ■ in ROI | `Play` / `Square` |
| ● status dots | `Circle` filled |

Files touched: `InvertedCalendarPreview.tsx`, `calendar.tsx`, `MissionsPreview.tsx`, `missions.tsx`, `BathroomROI.tsx`, `Hero.tsx` badges, `Liberation.tsx`, `SurvivalTactics.tsx`, `TickerBand.tsx` (if any), `ooo.ts` data (drop emoji fields, add `icon: LucideIconName`).

Ticker marquees keep their text-only punch (no emojis there today anyway).

## 5. Academy — actually count points

- Each lesson card gets a `Mark as learned` toggle (Lucide `CircleCheck` / `Circle`).
- Clicking adds `lesson.xp` to `profile.xp` and pushes `lesson.n` into `completedLessons`. Unclick reverses it.
- Top of `/academy` gains a sticky **XP HUD**: current XP, current rank, progress bar to next rank, "Lessons mastered: X / 50".
- Rank ladder sidebar highlights the current rank (glow + `●`) and dims locked ones.
- Filter chip `Learned` / `Unlearned` so users can find what's left.
- Confetti-free, but a subtle violet flash + rank-up modal when crossing a threshold (e.g. 100 XP → Office Drone).
- Hero CTA pill changes from `ENTER THE ACADEMY (100 LESSONS)` → `ENTER THE ACADEMY (X / 100 MASTERED)` reading from profile.
- Footer/SiteNav can show current rank as a tiny chip next to the logo (optional, low-key).

## 6. Out of scope (intentionally, this pass)

- Real Google/Apple OAuth + writing events back to provider calendars (needs Cloud + your own Google Cloud project).
- Multi-device sync of profile (needs Cloud auth).
- Notifications/push for trigger events.

## Technical notes

- New deps: `ical.js` for ICS parsing, `lucide-react` (already present).
- `src/lib/profile.ts` exposes `getProfile()`, `setProfile(patch)`, `useProfile()`, `addXp(n)`, `toggleLesson(n)`, `addExternalCalendar(...)`. All `localStorage`-backed with a versioned key + safe JSON parse.
- `src/lib/ical.ts` thin wrapper: `fetchIcs(url) → ExternalEvent[]` with 10-min in-memory cache and clear error types (`cors`, `parse`, `network`).
- `CalendarCell` gains `origin: "ooo" | "external"` and optional `externalId`. External events render in a new `bg-bone/10` style with `Lock` icon, non-clickable, non-draggable.
- Hydration discipline preserved (all profile/external reads happen inside `useEffect`).
- No new routes besides `/profile`. No backend.
