// Thin ICS fetch + parse using ical.js. Browser-only.
import ICAL from "ical.js";
import type { ExternalEvent } from "@/lib/profile";

export type IcsErrorKind = "cors" | "network" | "parse" | "empty";
export class IcsError extends Error {
  kind: IcsErrorKind;
  constructor(kind: IcsErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

function normalizeUrl(url: string) {
  let u = url.trim();
  if (u.startsWith("webcal://")) u = "https://" + u.slice("webcal://".length);
  return u;
}

const cache = new Map<string, { at: number; events: Omit<ExternalEvent, "calendarId">[] }>();
const TTL = 10 * 60 * 1000;

export async function fetchIcs(rawUrl: string): Promise<Omit<ExternalEvent, "calendarId">[]> {
  const url = normalizeUrl(rawUrl);
  const cached = cache.get(url);
  if (cached && Date.now() - cached.at < TTL) return cached.events;

  let res: Response;
  try {
    res = await fetch(url, { mode: "cors" });
  } catch (e) {
    throw new IcsError("cors", "Cannot reach calendar (likely blocked by CORS). Use a public ICS link from Google/iCloud.");
  }
  if (!res.ok) throw new IcsError("network", `Calendar fetch failed: ${res.status}`);
  const text = await res.text();

  let events: Omit<ExternalEvent, "calendarId">[];
  try {
    const jcal = ICAL.parse(text);
    const comp = new ICAL.Component(jcal);
    const vevents = comp.getAllSubcomponents("vevent");
    const now = Date.now();
    const horizonStart = now - 7 * 86400_000;
    const horizonEnd = now + 60 * 86400_000;
    events = vevents.flatMap((ve) => {
      const ev = new ICAL.Event(ve);
      const startMs = ev.startDate?.toJSDate().getTime();
      const endMs = ev.endDate?.toJSDate().getTime();
      if (!startMs || !endMs) return [];
      if (endMs < horizonStart || startMs > horizonEnd) return [];
      return [{
        id: `${ev.uid || crypto.randomUUID()}-${startMs}`,
        title: ev.summary || "Busy",
        start: startMs,
        end: endMs,
      }];
    });
  } catch (e) {
    throw new IcsError("parse", "Could not parse this calendar file.");
  }

  cache.set(url, { at: Date.now(), events });
  return events;
}
