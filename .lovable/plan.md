# Calendar selection UX + Tokenomics CA

## 1. Calendar — multi-select & edit submenu (`src/routes/calendar.tsx`)

Replace the current "click cycles, drag bulk-marks" model with an explicit selection model that's easier to discover and reversible.

### Selection model
- New state: `selected: Set<string>` (keys are `"day-hour"`).
- Click a cell → toggles selection (add/remove). Shift-click extends range within the same day.
- External (locked) cells are never selectable.
- Drag still works, but now to **select** (not to mutate) — mousedown + drag highlights a rectangular range.

### Selection toolbar (sticky bar above grid)
Appears only when `selected.size > 0`. Shows count + actions:
- **Counter**: `N blocks selected · Mx free $ / hour`
- **Quick-set buttons** (with icons): Grind · Work · Ghost · OOO
- **Label input** (optional): apply a label to all selected
- **Clear selection** (X)

Below toolbar, secondary "Select…" dropdown menu (the submenu the user asked for):
- Select all editable
- Select none
- Select all in row (hour) → for each currently-selected cell's hour, add the whole row
- Select all in column (day)
- Invert selection
- Select all of type → Grind / Work / Ghost / OOO

### Row & column handles
- Add a small `▾` chevron button on each hour label (left column) and each day header.
- Clicking opens a tiny popover: **Select row / Set whole row to Grind / Work / Ghost / OOO / Clear row**.
- Same for columns (per day).
- This is the "blocks in the same hour" quick action — one click selects/sets the entire 9:00 row across MON–FRI.

### Per-cell edit submenu
- Right-click (or long-press) a cell → opens a small floating menu anchored to the cell:
  - Set to Grind / Work / Ghost / OOO
  - Edit label…
  - Add to selection
  - Clear cell (reset to suggested)
- Replaces the old "click cycles" behavior, which is undiscoverable.

### Help line
Update the helper text below the grid:
> Click to select · Shift-click for range · Right-click for options · Use the toolbar to change selected blocks.

## 2. Tokenomics Terminal — add CA + dev-lock + community link (`src/components/sections/TokenomicsTerminal.tsx`)

Add three rows to the `ROWS` array (kept on-brand, mono where address-like):
- `Contract` → `0x767F…530Ba` (full address shown on hover/title, copy-to-clipboard button)
- `Dev supply` → `25% · locked 12 months 🔒`
- `Community` → link `inkypump.com/join/INKO`

Add a small "Copy CA" button next to the contract row (uses `navigator.clipboard.writeText` + `toast`). Constants exported from `src/lib/ooo.ts` as `INKO_CA` and `INKO_COMMUNITY_URL` so they're reusable.

## Out of scope
- No backend / sync changes.
- Calendar templates and OOO modal stay as-is.
- No new dependencies (uses existing lucide icons, framer-motion, sonner).
