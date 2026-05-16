// Local profile + Academy XP + connected calendars. localStorage-backed.
import { useEffect, useState } from "react";
import type { CalendarCell } from "@/lib/ooo";

export interface ExternalCalendar {
  id: string;
  provider: "google" | "apple" | "ics";
  name: string;
  url: string;
  lastSync: number | null;
}
export interface ExternalEvent {
  id: string;
  calendarId: string;
  title: string;
  start: number; // epoch ms
  end: number;
}

export interface Profile {
  handle: string;
  joinedAt: number;
  salary: number;
  xp: number;
  completedLessons: number[];
  calendar: CalendarCell[] | null; // null = use default
  externalCalendars: ExternalCalendar[];
  externalEvents: ExternalEvent[];
}

export const RANKS = [
  { name: "Intern", xp: 0 },
  { name: "Office Drone", xp: 100 },
  { name: "Senior Slacker", xp: 300 },
  { name: "Apprentice", xp: 700 },
  { name: "Lich CEO", xp: 1500 },
] as const;

const KEY = "ooo.profile.v1";

const DEFAULT_PROFILE: Profile = {
  handle: "Anonymous Slacker",
  joinedAt: 0, // hydrated on first load
  salary: 60_000,
  xp: 0,
  completedLessons: [],
  calendar: null,
  externalCalendars: [],
  externalEvents: [],
};

function read(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function write(p: Profile) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

// pub-sub
type Listener = (p: Profile) => void;
const listeners = new Set<Listener>();
function emit(p: Profile) { listeners.forEach((l) => l(p)); }

export function getProfile(): Profile { return read(); }
export function setProfile(patch: Partial<Profile> | ((p: Profile) => Partial<Profile>)) {
  const curr = read();
  const next = { ...curr, ...(typeof patch === "function" ? patch(curr) : patch) };
  write(next);
  emit(next);
  return next;
}

export function rankFor(xp: number) {
  let current = RANKS[0];
  let next: typeof RANKS[number] | null = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].xp) current = RANKS[i];
    if (xp < RANKS[i].xp && !next) next = RANKS[i];
  }
  const progress = next ? (xp - current.xp) / (next.xp - current.xp) : 1;
  return { current, next, progress: Math.min(1, Math.max(0, progress)) };
}

export function useProfile(): [Profile, boolean] {
  const [profile, set] = useState<Profile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const p = read();
    if (!p.joinedAt) {
      const seeded = { ...p, joinedAt: Date.now() };
      write(seeded);
      set(seeded);
    } else {
      set(p);
    }
    setHydrated(true);
    const l: Listener = (np) => set(np);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return [profile, hydrated];
}

export function toggleLesson(n: number, xp: number) {
  setProfile((p) => {
    const has = p.completedLessons.includes(n);
    const completedLessons = has ? p.completedLessons.filter((x) => x !== n) : [...p.completedLessons, n];
    const newXp = Math.max(0, p.xp + (has ? -xp : xp));
    return { completedLessons, xp: newXp };
  });
}

export function addExternalCalendar(c: Omit<ExternalCalendar, "id" | "lastSync">) {
  const id = crypto.randomUUID();
  setProfile((p) => ({
    externalCalendars: [...p.externalCalendars, { ...c, id, lastSync: null }],
  }));
  return id;
}
export function removeExternalCalendar(id: string) {
  setProfile((p) => ({
    externalCalendars: p.externalCalendars.filter((c) => c.id !== id),
    externalEvents: p.externalEvents.filter((e) => e.calendarId !== id),
  }));
}
export function replaceExternalEvents(calendarId: string, events: Omit<ExternalEvent, "calendarId">[]) {
  setProfile((p) => ({
    externalEvents: [
      ...p.externalEvents.filter((e) => e.calendarId !== calendarId),
      ...events.map((e) => ({ ...e, calendarId })),
    ],
    externalCalendars: p.externalCalendars.map((c) =>
      c.id === calendarId ? { ...c, lastSync: Date.now() } : c,
    ),
  }));
}
