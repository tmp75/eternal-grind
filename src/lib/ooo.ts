// Shared lore + data for OOO — Out Of Office.
import {
  Briefcase, Ghost, Sparkles, UtensilsCrossed, Armchair, Coffee, Target, Stethoscope,
  EyeOff, Droplet, CalendarX, Mail, MessageSquare, Swords,
  type LucideIcon,
} from "lucide-react";

export const PUMP_FUN_URL = "https://pump.fun";
export const SALARY_PER_HOUR = 28;
export const WORK_END_HOUR = 17;

// ---------- Missions ----------
export type MissionId =
  | "sacred-lunch" | "paid-toilet" | "extended-coffee"
  | "ghost-meeting" | "fake-focus" | "doctor-note";

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
  { id: "sacred-lunch", icon: UtensilsCrossed, title: "Sacred Lunch", duration: "60 min", minutes: 60,
    status: "In a meeting", truth: "Eating pasta. Slowly. With both hands.",
    description: "60 minutes of consecrated lunch. Phone face-down. Slack red. Fork up. Cannot be interrupted, rescheduled, or shortened.", rate: SALARY_PER_HOUR / 60 },
  { id: "paid-toilet", icon: Armchair, title: "Paid Toilet Break", duration: "12 min", minutes: 12,
    status: "Brb", truth: "Scrolling. Breathing. Existing.",
    description: "The throne is the only office that pays you back, per second. The receipt is for HR.", rate: SALARY_PER_HOUR / 60 },
  { id: "extended-coffee", icon: Coffee, title: "The 45-Minute Coffee Pilgrimage", duration: "45 min", minutes: 45,
    status: "Available", truth: "Bathroom → kitchen → quick chat with Dave from Finance → window stare → coffee.",
    description: "Technically available. Spiritually departed. The mug is a passport, the walk is the deliverable.", rate: SALARY_PER_HOUR / 60 },
  { id: "ghost-meeting", icon: Ghost, title: "Ghost Meeting", duration: "45 min", minutes: 45,
    status: "In a meeting", truth: "Calendar blocked. Camera off. Body elsewhere.",
    description: "A meeting that exists only on the calendar. Invitees: zero. Outcomes: rest. Nobody will ever ask what it was about.", rate: SALARY_PER_HOUR / 60 },
  { id: "fake-focus", icon: Target, title: "Fake Deep Focus", duration: "90 min", minutes: 90,
    status: "Focused — do not disturb",
    truth: "Memes. A long thread. A nap shaped like a thought.",
    description: "Status: focused. Activity: memes. The Do Not Disturb shield is sanctified by quarterly OKRs.", rate: SALARY_PER_HOUR / 60 },
  { id: "doctor-note", icon: Stethoscope, title: "Doctor's Note", duration: "1 day", minutes: 480,
    status: "Out sick", truth: "A printable, shareable parody sick-leave certificate.",
    description: "For entertainment purposes. We are not your physician. We are your liberator.", rate: SALARY_PER_HOUR / 60 },
];

// ---------- Calendar ----------
export type BlockType = "free" | "work" | "ghost";
export type BlockOrigin = "ooo" | "external";
export interface CalendarCell {
  day: number;   // 0..4
  hour: number;  // 9..17
  type: BlockType;
  label?: string;
  origin?: BlockOrigin;
  externalTitle?: string;
}

const FREE_BLOCKS: { day: number; start: number; end: number; label: string }[] = [
  { day: 0, start: 9, end: 11, label: "Slow Morning" },
  { day: 0, start: 12, end: 14, label: "Sacred Lunch" },
  { day: 0, start: 14, end: 18, label: "Strategic Free Afternoon" },
  { day: 1, start: 9, end: 13, label: "Deep Free Focus" },
  { day: 1, start: 13, end: 15, label: "Sacred Lunch (extended)" },
  { day: 1, start: 16, end: 18, label: "Coffee Pilgrimage" },
  { day: 2, start: 9, end: 12, label: "Meeting I Cancelled in My Head" },
  { day: 2, start: 12, end: 14, label: "Sacred Lunch" },
  { day: 2, start: 14, end: 18, label: "Ghost Meeting" },
  { day: 3, start: 9, end: 11, label: "Inbox Avoidance" },
  { day: 3, start: 12, end: 14, label: "Sacred Lunch" },
  { day: 3, start: 14, end: 18, label: "Strategic Free Afternoon" },
  { day: 4, start: 9, end: 18, label: "Ghost Friday" },
];
const WORK_BLOCKS: { day: number; start: number; end: number; label: string }[] = [
  { day: 0, start: 11, end: 12, label: "Standup" },
  { day: 1, start: 15, end: 16, label: "1:1" },
  { day: 3, start: 11, end: 12, label: "Email" },
];

export function buildDefaultWeek(): CalendarCell[] {
  const cells: CalendarCell[] = [];
  for (let d = 0; d < 5; d++) {
    for (let h = 9; h < 18; h++) {
      const free = FREE_BLOCKS.find((b) => b.day === d && h >= b.start && h < b.end);
      const work = WORK_BLOCKS.find((b) => b.day === d && h >= b.start && h < b.end);
      cells.push({
        day: d, hour: h, origin: "ooo",
        type: work ? "work" : free ? "free" : "free",
        label: work?.label ?? free?.label,
      });
    }
  }
  return cells;
}

// Icon for cell type
export const CELL_ICON: Record<BlockType, LucideIcon> = {
  free: Sparkles,
  work: Briefcase,
  ghost: Ghost,
};

// ---------- Tickers ----------
export const TICKER_TOP = [
  "OUT OF OFFICE",
  "MINTING FREEDOM",
  "CLOCKED OUT INDEFINITELY",
  "THE ONLY ASSET THAT APPRECIATES WHEN YOU'RE NOT WORKING",
  "$OOO",
  "AUTO-REPLY ACTIVE",
  "SOLANA · PUMP.FUN",
];
export const TICKER_BOT = [
  "STRATEGIC FREE AFTERNOON",
  "GHOST FRIDAY",
  "COFFEE PILGRIMAGE",
  "GREEN DOT THEATER",
  "THE COSTANZA PROTOCOL",
  "REPLY-ALL FRIDAY 4:58 PM",
  "MARKET OPENS @ 17:00",
];

// ---------- Tactics ----------
export interface Tactic { tag: string; title: string; body: string; icon: LucideIcon; }
export const TACTICS: Tactic[] = [
  { tag: "STEALTH", icon: EyeOff, title: "The Costanza Protocol", body: "Furrow brow. Mutter at monitor. Carry a clipboard. Look perpetually inconvenienced. Promotion incoming." },
  { tag: "HYDRATION", icon: Coffee, title: "The 45-Minute Coffee Pilgrimage", body: "Bathroom → kitchen → \"quick chat\" with Dave from Finance → window stare → coffee. Repeat hourly." },
  { tag: "CALENDAR", icon: CalendarX, title: "Block 'Focus Time'", body: "Recurring 2hr meeting with yourself. Subject: \"Strategy.\" Location: your couch." },
  { tag: "EMAIL", icon: Mail, title: "The Pre-Scheduled OOO", body: "Auto-reply \"In a meeting.\" Always. Forever. There is no meeting. There is only freedom." },
  { tag: "SLACK", icon: MessageSquare, title: "Green Dot Theater", body: "Move mouse every 4 minutes. Or buy a $7 mouse jiggler. Liberation is cheap." },
  { tag: "TACTICS", icon: Swords, title: "Reply-All on Friday 4:58 PM", body: "Send \"Looping back Monday.\" Close laptop. The ancestors smile upon you." },
];

// ---------- Trigger events ----------
export const TRIGGER_EVENTS = [
  { time: "11:00", label: "COFFEE CRITICAL", note: "Caffeine reserves below board-mandated minimum." },
  { time: "13:00", label: "Caloric Intake", note: "Sacred Lunch protocol initiated. Do not interrupt." },
  { time: "16:59", label: "SYSTEM OVERRIDE", note: "Liberation Hour imminent. Begin evacuation sequence." },
];
// Droplet kept exported for potential future use
export const _unused = Droplet;
