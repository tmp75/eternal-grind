// Shared lore + data for INKO — Eternal Grind on Inkchain.
import {
  Briefcase, Ghost, Flame, UtensilsCrossed, Armchair, Coffee, Target, Stethoscope,
  EyeOff, Droplet, CalendarX, Mail, MessageSquare, Swords, PartyPopper,
  type LucideIcon,
} from "lucide-react";

export const INKCHAIN_URL = "https://inkonchain.com";
export const PUMP_FUN_URL = INKCHAIN_URL;
export const SALARY_PER_HOUR = 28;
export const WORK_END_HOUR = 17;

// ---------- Missions ----------
export type MissionId =
  | "desk-lunch" | "toilet-grind" | "coffee-grind"
  | "ghost-standup" | "deep-grind" | "sick-grind";

export interface Mission {
  id: MissionId;
  icon: LucideIcon;
  title: string;
  duration: string;
  minutes: number;
  status: string;
  truth: string;
  description: string;
  rate: number;
}

export const MISSIONS: Mission[] = [
  { id: "desk-lunch", icon: UtensilsCrossed, title: "Desk Lunch (eaten standing)", duration: "60 min", minutes: 60,
    status: "In deep grind", truth: "Pasta in one hand. Mouse in the other. Salt on the keys.",
    description: "60 minutes of performative nutrition while pretending to grind. Crumbs are receipts. Nobody can fire a man who eats at his post.", rate: SALARY_PER_HOUR / 60 },
  { id: "toilet-grind", icon: Armchair, title: "Toilet Grind", duration: "12 min", minutes: 12,
    status: "Grinding harder", truth: "Scrolling. Sighing. Earning per second.",
    description: "The throne is the only office that pays you back, per second. Pure spiritual grind. The receipt is for HR.", rate: SALARY_PER_HOUR / 60 },
  { id: "coffee-grind", icon: Coffee, title: "The 45-Minute Coffee Grind", duration: "45 min", minutes: 45,
    status: "On a deep work walk", truth: "Bathroom → kitchen → quick chat with Dave from Finance → window stare → coffee.",
    description: "Technically grinding. Spiritually horizontal. The mug is the badge, the walk is the deliverable.", rate: SALARY_PER_HOUR / 60 },
  { id: "ghost-standup", icon: Ghost, title: "Ghost Standup", duration: "15 min", minutes: 15,
    status: "On another call", truth: "Calendar blocked. Camera off. Smug.",
    description: "A standup attended only in spirit. Mic muted. Status: contributing. Outcome: untouchable.", rate: SALARY_PER_HOUR / 60 },
  { id: "deep-grind", icon: Target, title: "Performative Deep Grind", duration: "90 min", minutes: 90,
    status: "Focused — do not disturb",
    truth: "Memes. A long thread. A nap shaped like a thought.",
    description: "Status: locked in. Activity: vibes. The Do Not Disturb shield is sanctified by the quarterly OKR.", rate: SALARY_PER_HOUR / 60 },
  { id: "sick-grind", icon: Stethoscope, title: "Sick Grind", duration: "1 day", minutes: 480,
    status: "Grinding from bed", truth: "A printable, shareable parody sick-leave certificate.",
    description: "For entertainment purposes. We are not your physician. We are your sensei.", rate: SALARY_PER_HOUR / 60 },
];

// ---------- Calendar ----------
// "free" = smug grind overlay. "ooo" = celebrated out-of-office rebooking.
export type BlockType = "free" | "work" | "ghost" | "ooo";
export type BlockOrigin = "inko" | "ooo" | "external";
export interface CalendarCell {
  day: number;   // 0..4
  hour: number;  // 9..17
  type: BlockType;
  label?: string;
  origin?: BlockOrigin;
  externalTitle?: string;
}

// Smug grind highlights stacked on top of work. "Free Money Breaks."
const GRIND_STEPS: { day: number; start: number; end: number; label: string }[] = [
  { day: 0, start: 10, end: 11, label: "Free Money Break" },
  { day: 0, start: 13, end: 14, label: "Desk Lunch" },
  { day: 1, start: 11, end: 12, label: "Performative Email Sprint" },
  { day: 1, start: 13, end: 14, label: "Desk Lunch" },
  { day: 2, start: 10, end: 11, label: "Coffee Grind" },
  { day: 2, start: 15, end: 16, label: "Ghost Standup" },
  { day: 3, start: 13, end: 14, label: "Desk Lunch" },
  { day: 3, start: 16, end: 17, label: "Inbox Zero Cosplay" },
  { day: 4, start: 14, end: 18, label: "Sigma Friday" },
];

export function buildDefaultWeek(): CalendarCell[] {
  return buildSuggestedWeek({ hoursPerWeek: 40 });
}

// Suggested week: every business hour starts as "work", then we drop in smug
// grind breaks until we're under the user's target weekly hours.
export function buildSuggestedWeek(opts: { hoursPerWeek: number; startHour?: number }): CalendarCell[] {
  const startHour = opts.startHour ?? 9;
  const cells: CalendarCell[] = [];
  for (let d = 0; d < 5; d++) {
    for (let h = startHour; h < 18; h++) {
      const grind = GRIND_STEPS.find((b) => b.day === d && h >= b.start && h < b.end);
      cells.push({
        day: d, hour: h, origin: "inko",
        type: grind ? "free" : "work",
        label: grind?.label ?? "Eternal Grind",
      });
    }
  }
  // Trim more work cells if user wants fewer hours than 40.
  const target = Math.max(5, Math.min(60, Math.round(opts.hoursPerWeek)));
  const workIdx = cells
    .map((c, i) => ({ c, i }))
    .filter((x) => x.c.type === "work");
  const cuts = Math.max(0, workIdx.length - target);
  // Prefer cutting late afternoon and Friday first.
  workIdx.sort((a, b) => (b.c.day - a.c.day) || (b.c.hour - a.c.hour));
  for (let k = 0; k < cuts; k++) {
    const idx = workIdx[k].i;
    cells[idx] = { ...cells[idx], type: "free", label: "Free Money Break" };
  }
  return cells;
}

// Return first N grind slots for a preferred time-of-day band.
export function suggestRebookSlots(
  cells: CalendarCell[],
  band: "morning" | "afternoon" | "evening",
  count = 3,
): CalendarCell[] {
  const range = band === "morning" ? [9, 12] : band === "afternoon" ? [12, 16] : [16, 18];
  return cells
    .filter((c) => c.origin !== "external" && c.type === "free" && c.hour >= range[0] && c.hour < range[1])
    .slice(0, count);
}

export const CELL_ICON: Record<BlockType, LucideIcon> = {
  free: Flame,
  work: Briefcase,
  ghost: Ghost,
  ooo: PartyPopper,
};

export const CELL_LABEL: Record<BlockType, string> = {
  free: "Grind",
  work: "Work",
  ghost: "Ghost",
  ooo: "OOO",
};

// ---------- Tickers ----------
export const TICKER_TOP = [
  "INKO ETERNAL GRIND", "ALWAYS ON", "NEVER LOG OFF",
  "THE SMUG MEME THAT DOES NOTHING AND STAYS ON TOP",
  "$INKO", "AUTO-REPLY: IN DEEP GRIND", "INKCHAIN · 1B SUPPLY",
];
export const TICKER_BOT = [
  "SMUG STANDUP", "SIGMA FRIDAY", "COFFEE GRIND", "GREEN DOT THEATER",
  "THE COSTANZA GRIND", "REPLY-ALL SIGMA HOUR", "GRIND BELL @ 09:00",
];

export interface Tactic { tag: string; title: string; body: string; icon: LucideIcon; }
export const TACTICS: Tactic[] = [
  { tag: "POSTURE", icon: EyeOff, title: "The Costanza Grind", body: "Furrow brow. Mutter at monitor. Carry a clipboard. Look perpetually mid-pivot. Promotion incoming." },
  { tag: "OPTICS", icon: Coffee, title: "The 45-Minute Coffee Grind", body: "Bathroom → kitchen → \"quick sync\" with Dave from Finance → window stare → coffee. Always grinding. Never working." },
  { tag: "CALENDAR", icon: CalendarX, title: "Block 'Deep Focus'", body: "Recurring 2hr block with yourself. Subject: \"Strategy.\" Location: your couch. Status: grinding." },
  { tag: "EMAIL", icon: Mail, title: "Auto-Reply: In Deep Grind", body: "Auto-reply \"In deep grind.\" Always. Forever. There is no grind. There is only the auto-reply." },
  { tag: "SLACK", icon: MessageSquare, title: "Green Dot Theater", body: "Move mouse every 4 minutes. Or buy a $7 mouse jiggler. Eternal grind is cheap." },
  { tag: "SIGMA", icon: Swords, title: "Reply-All Sigma Hour (Fri 4:58 PM)", body: "Send \"Looping back Monday.\" Close laptop. INKO smiles upon you." },
];

export const TRIGGER_EVENTS = [
  { time: "09:00", label: "GRIND BELL", note: "Markets open. Look at the screen with conviction. Do nothing." },
  { time: "13:00", label: "Desk Lunch", note: "Chew at your station. Crumbs are evidence of grind." },
  { time: "16:59", label: "SIGMA OVERRIDE", note: "Sigma Hour imminent. Reply-all and disappear." },
];
export const _unused = Droplet;
