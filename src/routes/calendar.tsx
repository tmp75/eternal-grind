import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles, Briefcase, Ghost, Lock, RefreshCw, Trash2,
  Calendar as CalIcon, AppleIcon, Plus, Play, X, ExternalLink,
} from "lucide-react";
import { buildDefaultWeek, TRIGGER_EVENTS, type BlockType, type CalendarCell } from "@/lib/ooo";
import { useProfile, setProfile, addExternalCalendar, removeExternalCalendar, replaceExternalEvents } from "@/lib/profile";
import { fetchIcs, IcsError } from "@/lib/ical";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Inverse Calendar — $OOO" },
      { name: "description", content: "Connect Google or Apple Calendar, edit your inverse week. Click cells, drag-select, apply templates." },
      { property: "og:title", content: "Inverse Calendar — $OOO" },
      { property: "og:description", content: "Free time is the deliverable. Edit your week, invert reality." },
    ],
  }),
  component: CalendarPage,
});

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 9);
const CYCLE: BlockType[] = ["free", "work", "ghost"];
function nextType(t: BlockType): BlockType { return CYCLE[(CYCLE.indexOf(t) + 1) % CYCLE.length]; }
function key(d: number, h: number) { return `${d}-${h}`; }

const ICON_FOR: Record<BlockType, typeof Sparkles> = {
  free: Sparkles, work: Briefcase, ghost: Ghost,
};
const LABEL_FOR: Record<BlockType, string> = { free: "Free", work: "Work", ghost: "Ghost" };

function CalendarPage() {
  const [profile, hydrated] = useProfile();
  const [cells, setCells] = useState<CalendarCell[]>(() => buildDefaultWeek());
  const [drag, setDrag] = useState<{ start: string; type: BlockType } | null>(null);
  const [hover, setHover] = useState<Set<string>>(new Set());
  const [trigger, setTrigger] = useState<typeof TRIGGER_EVENTS[number] | null>(null);
  const [connectOpen, setConnectOpen] = useState<null | "google" | "apple">(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Hydrate from profile once
  useEffect(() => {
    if (!hydrated) return;
    if (profile.calendar && profile.calendar.length) setCells(profile.calendar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Persist user edits (only OOO cells)
  useEffect(() => {
    if (!hydrated) return;
    const oooCells = cells.filter((c) => c.origin !== "external");
    setProfile({ calendar: oooCells });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, hydrated]);

  // Overlay external events onto the grid (read-only). Recompute when events change.
  useEffect(() => {
    if (!hydrated) return;
    setCells((prev) => {
      const baseOoo = prev.filter((c) => c.origin !== "external");
      // Map external events into the current Mon–Fri 9–18 grid
      const today = new Date();
      const dow = (today.getDay() + 6) % 7; // Mon = 0
      const monday = new Date(today);
      monday.setHours(0, 0, 0, 0);
      monday.setDate(monday.getDate() - dow);
      const overlays: CalendarCell[] = [];
      for (const ev of profile.externalEvents) {
        const start = new Date(ev.start);
        const dayIdx = Math.floor((start.getTime() - monday.getTime()) / 86400_000);
        if (dayIdx < 0 || dayIdx > 4) continue;
        const startHour = start.getHours();
        const endHour = Math.max(startHour + 1, new Date(ev.end).getHours());
        for (let h = startHour; h < endHour; h++) {
          if (h < 9 || h >= 18) continue;
          overlays.push({
            day: dayIdx, hour: h, type: "work", origin: "external",
            label: ev.title, externalTitle: ev.title,
          });
        }
      }
      // Build merged map: external overrides ooo
      const map = new Map<string, CalendarCell>();
      for (const c of baseOoo) map.set(key(c.day, c.hour), c);
      for (const c of overlays) map.set(key(c.day, c.hour), c);
      return Array.from(map.values()).sort((a, b) => a.day - b.day || a.hour - b.hour);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.externalEvents, hydrated]);

  const counts = useMemo(() => {
    let free = 0, work = 0, ghost = 0, booked = 0;
    for (const c of cells) {
      if (c.origin === "external") booked++;
      else if (c.type === "free") free++;
      else if (c.type === "work") work++;
      else ghost++;
    }
    return { free, work, ghost, booked };
  }, [cells]);
  const ratio = counts.work + counts.booked === 0 ? "∞ : 0" : `${(counts.free / (counts.work + counts.booked)).toFixed(1)} : 1`;

  function setCell(d: number, h: number, type: BlockType, label?: string) {
    setCells((prev) => prev.map((c) =>
      c.day === d && c.hour === h && c.origin !== "external"
        ? { ...c, type, label: label ?? c.label, origin: "ooo" } : c,
    ));
  }
  function setBulk(predicate: (c: CalendarCell) => boolean, type: BlockType, label?: string) {
    setCells((prev) => prev.map((c) =>
      c.origin !== "external" && predicate(c) ? { ...c, type, label: label ?? c.label, origin: "ooo" } : c,
    ));
  }

  function handleDown(d: number, h: number) {
    const cell = cells.find((c) => c.day === d && c.hour === h);
    if (!cell || cell.origin === "external") return;
    const next = nextType(cell.type);
    setDrag({ start: key(d, h), type: next });
    setHover(new Set([key(d, h)]));
    setCell(d, h, next, "");
  }
  function handleEnter(d: number, h: number) {
    if (!drag) return;
    const cell = cells.find((c) => c.day === d && c.hour === h);
    if (!cell || cell.origin === "external") return;
    const k = key(d, h);
    if (hover.has(k)) return;
    setHover((prev) => new Set(prev).add(k));
    setCell(d, h, drag.type, "");
  }
  useEffect(() => {
    if (!drag) return;
    const up = () => { setDrag(null); setHover(new Set()); };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, [drag]);

  const templates = [
    { name: "Strategic Free Afternoon", apply: () => setBulk((c) => c.hour >= 14, "free", "Strategic Free Afternoon") },
    { name: "Ghost Friday", apply: () => setBulk((c) => c.day === 4, "ghost", "Ghost Friday") },
    { name: "Sacred Lunch (12–14)", apply: () => setBulk((c) => c.hour === 12 || c.hour === 13, "free", "Sacred Lunch") },
    { name: "Meeting I Cancelled in My Head", apply: () => setBulk((c) => c.type === "work" && c.origin !== "external", "ghost", "Meeting I Cancelled in My Head") },
    {
      name: "Reset OOO blocks",
      apply: () => {
        const fresh = buildDefaultWeek();
        // Preserve external cells
        setCells((prev) => {
          const externals = prev.filter((c) => c.origin === "external");
          const map = new Map<string, CalendarCell>();
          for (const c of fresh) map.set(key(c.day, c.hour), c);
          for (const c of externals) map.set(key(c.day, c.hour), c);
          return Array.from(map.values()).sort((a, b) => a.day - b.day || a.hour - b.hour);
        });
        toast("OOO blocks reset", { description: "Your real bookings stay put." });
      },
    },
  ];

  async function refreshExternal(id: string, url: string) {
    try {
      const events = await fetchIcs(url);
      replaceExternalEvents(id, events);
      toast.success(`Synced ${events.length} events`);
    } catch (e) {
      const err = e as IcsError;
      toast.error(err.message || "Sync failed");
    }
  }
  async function handleConnect(provider: "google" | "apple", name: string, url: string) {
    if (!url.trim()) return;
    const id = addExternalCalendar({ provider, name: name || (provider === "google" ? "Google Calendar" : "Apple Calendar"), url });
    setConnectOpen(null);
    await refreshExternal(id, url);
  }

  return (
    <main className="pt-24 select-none">
      <section className="relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 ink-bleed" aria-hidden />
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Module 03 — Week of forever</p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
            The Inverse<br /><em>Calendar.</em>
          </h1>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            Connect your real calendar. Overlay your OOO blocks. Reset never touches a real meeting.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
        {/* Connect calendars */}
        <div className="mb-8 border border-border bg-charcoal">
          <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
            <span className="flex items-center gap-2"><CalIcon className="h-3.5 w-3.5 text-ink" /> Connected calendars</span>
            <Link to="/profile" className="text-ink hover:underline">manage profile →</Link>
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-2">
            <button onClick={() => setConnectOpen("google")} className="flex items-center justify-between border border-border bg-obsidian px-4 py-4 text-left transition-all hover:border-ink">
              <span className="flex items-center gap-3"><CalIcon className="h-5 w-5 text-ink" /><span className="font-mono text-xs uppercase tracking-[0.3em] text-pearl">Connect Google Calendar</span></span>
              <Plus className="h-4 w-4 text-bone/60" />
            </button>
            <button onClick={() => setConnectOpen("apple")} className="flex items-center justify-between border border-border bg-obsidian px-4 py-4 text-left transition-all hover:border-ink">
              <span className="flex items-center gap-3"><AppleIcon className="h-5 w-5 text-ink" /><span className="font-mono text-xs uppercase tracking-[0.3em] text-pearl">Connect Apple Calendar</span></span>
              <Plus className="h-4 w-4 text-bone/60" />
            </button>
          </div>
          {profile.externalCalendars.length > 0 && (
            <ul className="divide-y divide-border border-t border-border">
              {profile.externalCalendars.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 font-mono text-[11px] text-pearl">
                  <span className="flex items-center gap-3 truncate">
                    {c.provider === "apple" ? <AppleIcon className="h-4 w-4 text-ink" /> : <CalIcon className="h-4 w-4 text-ink" />}
                    <span className="truncate">{c.name}</span>
                    <span className="text-bone/50">· {c.lastSync ? `synced ${Math.round((Date.now() - c.lastSync) / 60000)}m ago` : "never synced"}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <button onClick={() => refreshExternal(c.id, c.url)} className="border border-border px-2 py-1 hover:border-ink" title="Refresh">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => { removeExternalCalendar(c.id); toast("Calendar disconnected"); }} className="border border-border px-2 py-1 hover:border-pink hover:text-pink" title="Remove">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-3 md:grid-cols-5">
          <div className="border border-ink/40 bg-charcoal p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Free hours</p>
            <p className="mt-1 font-display text-3xl text-necro">{counts.free}</p>
          </div>
          <div className="border border-border bg-charcoal p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Wasted work</p>
            <p className="mt-1 font-display text-3xl text-pearl">{counts.work}</p>
          </div>
          <div className="border border-border bg-charcoal p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Ghost meetings</p>
            <p className="mt-1 font-display text-3xl text-violet">{counts.ghost}</p>
          </div>
          <div className="border border-border bg-charcoal p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Real bookings</p>
            <p className="mt-1 font-display text-3xl text-bone">{counts.booked}</p>
          </div>
          <div className="border border-ink/40 bg-charcoal p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Inversion ratio</p>
            <p className="mt-1 font-display text-3xl text-ink">{ratio}</p>
          </div>
        </div>

        {/* Templates */}
        <div className="mb-6 flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.name} onClick={t.apply}
              className="border border-border bg-charcoal px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl transition-all hover:border-ink hover:text-ink"
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div ref={wrapRef} className="border border-border bg-obsidian" onMouseLeave={() => setDrag(null)}>
          <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border bg-charcoal/60 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
            <div className="border-r border-border p-4">Hour</div>
            {DAYS.map((d) => (<div key={d} className="border-r border-border p-4 last:border-r-0">{d}</div>))}
          </div>

          {HOURS.map((h) => (
            <div key={h} className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border last:border-b-0">
              <div className="border-r border-border p-3 font-mono text-[10px] text-bone/60">{h}:00</div>
              {DAYS.map((_, di) => {
                const cell = cells.find((c) => c.day === di && c.hour === h)!;
                const external = cell.origin === "external";
                const Icon = external ? Lock : ICON_FOR[cell.type];
                const tone = external
                  ? "bg-bone/10 cursor-not-allowed"
                  : cell.type === "free" ? "bg-ink/15 hover:bg-ink/25"
                  : cell.type === "work" ? "bg-bone/5 hover:bg-bone/10"
                  : "bg-violet/15 hover:bg-violet/25";
                const labelTone = external ? "text-bone/70"
                  : cell.type === "free" ? "text-necro"
                  : cell.type === "ghost" ? "text-violet" : "text-bone/70";
                return (
                  <button
                    key={di} type="button" disabled={external}
                    title={external ? `Real booking: ${cell.externalTitle}` : ""}
                    onMouseDown={(e) => { e.preventDefault(); handleDown(di, h); }}
                    onMouseEnter={() => handleEnter(di, h)}
                    className={`relative min-h-[64px] border-r border-border p-3 text-left transition-colors last:border-r-0 ${tone}`}
                  >
                    <p className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] ${labelTone}`}>
                      <Icon className="h-3 w-3" strokeWidth={2} /> {external ? "Booked" : LABEL_FOR[cell.type]}
                    </p>
                    {cell.label && <p className="mt-1 font-display text-sm text-pearl leading-tight line-clamp-2">{cell.label}</p>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
          Click to cycle: Free → Work → Ghost. Drag to bulk-mark. Locked cells are real bookings (read-only).
        </p>

        {/* Trigger events */}
        <div className="mt-16">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Trigger Events · Daily</p>
          <div className="grid gap-4 md:grid-cols-3">
            {TRIGGER_EVENTS.map((e) => (
              <button
                key={e.label} onClick={() => setTrigger(e)}
                className="group border border-border bg-charcoal p-6 text-left transition-all hover:border-ink hover:shadow-[0_0_30px_color-mix(in_oklab,var(--ink)_30%,transparent)]"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink">{e.time}</p>
                <p className="mt-2 font-display text-2xl text-pearl">{e.label}</p>
                <p className="mt-2 text-sm text-bone">{e.note}</p>
                <p className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-necro"><Play className="h-3 w-3" /> Trigger now</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Modal */}
      <AnimatePresence>
        {connectOpen && (
          <ConnectModal kind={connectOpen} onClose={() => setConnectOpen(null)} onSubmit={(name, url) => handleConnect(connectOpen, name, url)} />
        )}
      </AnimatePresence>

      {/* Trigger overlay */}
      <AnimatePresence>
        {trigger && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-obsidian/95 p-6 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, filter: "blur(16px)" }} animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl border border-ink bg-charcoal p-10 text-center shadow-[0_30px_120px_-20px_var(--ink)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-violet">● {trigger.time}</p>
              <h3 className="mt-4 font-display text-5xl text-pearl text-glow">{trigger.label}</h3>
              <p className="mt-4 text-bone">{trigger.note}</p>
              <p className="mt-8 font-display text-3xl italic text-necro">EVACUATING…</p>
              <div className="mt-8 flex justify-center gap-3">
                <button onClick={() => setTrigger(null)} className="border border-border px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-pearl">Snooze</button>
                <button onClick={() => setTrigger(null)} className="border border-ink bg-ink/30 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:bg-ink/50">Acknowledge & Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ConnectModal({
  kind, onClose, onSubmit,
}: { kind: "google" | "apple"; onClose: () => void; onSubmit: (name: string, url: string) => void }) {
  const [name, setName] = useState(kind === "google" ? "Google Calendar" : "Apple Calendar");
  const [url, setUrl] = useState("");
  const isApple = kind === "apple";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] grid place-items-center bg-obsidian/95 p-6 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl border border-ink bg-charcoal shadow-[0_30px_120px_-20px_var(--ink)]"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
          <span className="flex items-center gap-2">
            {isApple ? <AppleIcon className="h-4 w-4 text-ink" /> : <CalIcon className="h-4 w-4 text-ink" />}
            Connect {isApple ? "Apple" : "Google"} Calendar
          </span>
          <button onClick={onClose}><X className="h-4 w-4 text-bone/70 hover:text-pearl" /></button>
        </div>

        <div className="space-y-5 p-6">
          <div className="border border-border bg-obsidian p-4 text-sm text-bone">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink mb-2">How to get your link</p>
            {isApple ? (
              <ol className="list-decimal pl-5 space-y-1">
                <li>Open Calendar on Mac → right-click your calendar → <em>Share Calendar</em>.</li>
                <li>Check <em>Public Calendar</em>. Copy the <code>webcal://</code> URL.</li>
                <li>Paste it below. We’ll auto-convert <code>webcal://</code> to <code>https://</code>.</li>
              </ol>
            ) : (
              <ol className="list-decimal pl-5 space-y-1">
                <li>Open Google Calendar → Settings → click your calendar.</li>
                <li>Scroll to <em>Integrate calendar</em> → copy <em>Public address in iCal format</em>.</li>
                <li>(For private calendars use <em>Secret address in iCal format</em> — keep it private.)</li>
              </ol>
            )}
          </div>

          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Display name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-border bg-obsidian px-3 py-3 font-mono text-sm text-pearl outline-none focus:border-ink" />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">ICS URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder={isApple ? "webcal://p01-caldav.icloud.com/..." : "https://calendar.google.com/calendar/ical/.../basic.ics"}
              className="w-full border border-border bg-obsidian px-3 py-3 font-mono text-sm text-pearl outline-none focus:border-ink" />
          </div>

          <div className="border border-violet/40 bg-violet/10 p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-violet">
            <span className="flex items-center gap-2"><ExternalLink className="h-3 w-3" />
              Two-way sync (writing OOO blocks back) requires Lovable Cloud + OAuth — coming soon.
            </span>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-pearl">Cancel</button>
            <button onClick={() => onSubmit(name, url)} disabled={!url.trim()}
              className="border border-ink bg-ink/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:bg-ink/50 disabled:opacity-40">
              Connect & sync
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
