import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Flame, Briefcase, Ghost, Lock, RefreshCw, Trash2, PartyPopper,
  Calendar as CalIcon, AppleIcon, Plus, Play, X, Check, ArrowRight, ArrowLeft, Copy, Sparkles,
  ChevronDown, MousePointerSquareDashed, Eraser, RotateCcw,
} from "lucide-react";

import {
  buildSuggestedWeek, suggestRebookSlots, TRIGGER_EVENTS,
  type BlockType, type CalendarCell,
} from "@/lib/ooo";
import { useProfile, setProfile, addExternalCalendar, removeExternalCalendar, replaceExternalEvents } from "@/lib/profile";
import { fetchIcs, IcsError } from "@/lib/ical";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Grind Calendar — $INKO" },
      { name: "description", content: "Read your Google or Apple calendar, auto-suggest smug breaks, and reschedule what you couldn't do. Real meetings stay untouched." },
      { property: "og:title", content: "Grind Calendar — $INKO" },
      { property: "og:description", content: "Salary-driven default week. Celebrate OOO. Real bookings stay safe." },
    ],
  }),
  component: CalendarPage,
});

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 9);
const CYCLE: BlockType[] = ["work", "free", "ghost", "ooo"];
function nextType(t: BlockType): BlockType { return CYCLE[(CYCLE.indexOf(t) + 1) % CYCLE.length]; }
function key(d: number, h: number) { return `${d}-${h}`; }

const ICON_FOR: Record<BlockType, typeof Flame> = {
  free: Flame, work: Briefcase, ghost: Ghost, ooo: PartyPopper,
};
const LABEL_FOR: Record<BlockType, string> = { free: "Grind", work: "Work", ghost: "Ghost", ooo: "OOO" };

function CalendarPage() {
  const [profile, hydrated] = useProfile();
  const [cells, setCells] = useState<CalendarCell[]>(() => buildSuggestedWeek({ hoursPerWeek: 40 }));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ mode: "add" | "remove" } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ day: number; hour: number; x: number; y: number } | null>(null);
  const [rowMenuHour, setRowMenuHour] = useState<number | null>(null);
  const [colMenuDay, setColMenuDay] = useState<number | null>(null);
  const [trigger, setTrigger] = useState<typeof TRIGGER_EVENTS[number] | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [oooOpen, setOooOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Hydrate from profile, or build suggested from salary + hours.
  useEffect(() => {
    if (!hydrated) return;
    if (profile.calendar && profile.calendar.length) {
      setCells(profile.calendar);
    } else {
      setCells(buildSuggestedWeek({ hoursPerWeek: profile.hoursPerWeek || 40 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const inkoCells = cells.filter((c) => c.origin !== "external");
    setProfile({ calendar: inkoCells });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, hydrated]);

  // Overlay external events.
  useEffect(() => {
    if (!hydrated) return;
    setCells((prev) => {
      const baseInko = prev.filter((c) => c.origin !== "external");
      const today = new Date();
      const dow = (today.getDay() + 6) % 7;
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
      const map = new Map<string, CalendarCell>();
      for (const c of baseInko) map.set(key(c.day, c.hour), c);
      for (const c of overlays) map.set(key(c.day, c.hour), c);
      return Array.from(map.values()).sort((a, b) => a.day - b.day || a.hour - b.hour);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.externalEvents, hydrated]);

  const counts = useMemo(() => {
    let grind = 0, work = 0, ghost = 0, booked = 0, ooo = 0;
    for (const c of cells) {
      if (c.origin === "external") booked++;
      else if (c.type === "free") grind++;
      else if (c.type === "work") work++;
      else if (c.type === "ghost") ghost++;
      else ooo++;
    }
    return { grind, work, ghost, booked, ooo };
  }, [cells]);

  const ratePerSec = profile.salary / ((profile.hoursPerWeek || 40) * 52 * 3600);
  const freeMoneyPerHour = ratePerSec * 3600;

  // Editable cell predicate
  const isEditable = (d: number, h: number) => {
    const c = cells.find((x) => x.day === d && x.hour === h);
    return !!c && c.origin !== "external";
  };

  // ---- Selection helpers ----
  function toggleOne(d: number, h: number, shift: boolean) {
    if (!isEditable(d, h)) return;
    const k = key(d, h);
    setSelected((prev) => {
      const next = new Set(prev);
      if (shift && lastClicked) {
        const [ld, lh] = lastClicked.split("-").map(Number);
        if (ld === d) {
          const [lo, hi] = [Math.min(lh, h), Math.max(lh, h)];
          for (let hh = lo; hh <= hi; hh++) if (isEditable(d, hh)) next.add(key(d, hh));
        } else {
          if (next.has(k)) next.delete(k); else next.add(k);
        }
      } else {
        if (next.has(k)) next.delete(k); else next.add(k);
      }
      return next;
    });
    setLastClicked(k);
  }
  const clearSelection = () => setSelected(new Set());
  const selectAllEditable = () => {
    const s = new Set<string>();
    for (const c of cells) if (c.origin !== "external") s.add(key(c.day, c.hour));
    setSelected(s);
  };
  const invertSelection = () => {
    setSelected((prev) => {
      const next = new Set<string>();
      for (const c of cells) {
        if (c.origin === "external") continue;
        const k = key(c.day, c.hour);
        if (!prev.has(k)) next.add(k);
      }
      return next;
    });
  };
  const selectByType = (t: BlockType) => {
    const s = new Set<string>();
    for (const c of cells) if (c.origin !== "external" && c.type === t) s.add(key(c.day, c.hour));
    setSelected(s);
  };
  const selectRow = (h: number, additive = false) => {
    setSelected((prev) => {
      const next = additive ? new Set(prev) : new Set<string>();
      for (let d = 0; d < 5; d++) if (isEditable(d, h)) next.add(key(d, h));
      return next;
    });
  };
  const selectCol = (d: number, additive = false) => {
    setSelected((prev) => {
      const next = additive ? new Set(prev) : new Set<string>();
      for (const h of HOURS) if (isEditable(d, h)) next.add(key(d, h));
      return next;
    });
  };

  // ---- Mutation helpers ----
  function setCell(d: number, h: number, type: BlockType, label?: string) {
    setCells((prev) => prev.map((c) =>
      c.day === d && c.hour === h && c.origin !== "external"
        ? { ...c, type, label: label ?? c.label, origin: "inko" } : c,
    ));
  }
  function setBulk(predicate: (c: CalendarCell) => boolean, type: BlockType, label?: string) {
    setCells((prev) => prev.map((c) =>
      c.origin !== "external" && predicate(c) ? { ...c, type, label: label ?? c.label, origin: "inko" } : c,
    ));
  }
  function applyToSelection(type: BlockType, label?: string) {
    if (selected.size === 0) {
      toast("Nothing selected", { description: "Click cells to select first." });
      return;
    }
    setBulk((c) => selected.has(key(c.day, c.hour)), type, label);
    toast.success(`Set ${selected.size} block(s) → ${LABEL_FOR[type]}`);
  }
  function resetSelection() {
    if (selected.size === 0) return;
    const fresh = buildSuggestedWeek({ hoursPerWeek: profile.hoursPerWeek || 40 });
    const freshMap = new Map(fresh.map((c) => [key(c.day, c.hour), c]));
    setCells((prev) => prev.map((c) => {
      if (c.origin === "external") return c;
      if (!selected.has(key(c.day, c.hour))) return c;
      const f = freshMap.get(key(c.day, c.hour));
      return f ? { ...f } : c;
    }));
    toast("Selection reset to suggested");
  }

  // ---- Drag-to-select ----
  function handleDown(d: number, h: number, e: React.MouseEvent) {
    if (e.button !== 0) return;
    if (!isEditable(d, h)) return;
    const k = key(d, h);
    const isShift = e.shiftKey;
    if (isShift) {
      toggleOne(d, h, true);
      return;
    }
    // toggle and start drag in matching mode
    const wasSelected = selected.has(k);
    const mode: "add" | "remove" = wasSelected ? "remove" : "add";
    setDrag({ mode });
    setSelected((prev) => {
      const next = new Set(prev);
      if (mode === "add") next.add(k); else next.delete(k);
      return next;
    });
    setLastClicked(k);
  }
  function handleEnter(d: number, h: number) {
    if (!drag) return;
    if (!isEditable(d, h)) return;
    const k = key(d, h);
    setSelected((prev) => {
      const next = new Set(prev);
      if (drag.mode === "add") next.add(k); else next.delete(k);
      return next;
    });
  }
  useEffect(() => {
    if (!drag) return;
    const up = () => setDrag(null);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, [drag]);

  // Close popovers on outside click / escape
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-popover]")) {
        setContextMenu(null); setRowMenuHour(null); setColMenuDay(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setContextMenu(null); setRowMenuHour(null); setColMenuDay(null); clearSelection();
      }
    }
    window.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("mousedown", onDoc); window.removeEventListener("keydown", onKey); };
  }, []);

  function handleContext(d: number, h: number, e: React.MouseEvent) {
    e.preventDefault();
    if (!isEditable(d, h)) return;
    setContextMenu({ day: d, hour: h, x: e.clientX, y: e.clientY });
  }

  const templates = [
    { name: "Maximum Grind Afternoon", apply: () => setBulk((c) => c.hour >= 14, "free", "Smug Grind") },
    { name: "Sigma Friday", apply: () => setBulk((c) => c.day === 4, "ghost", "Sigma Friday") },
    { name: "Desk Lunch (12–14)", apply: () => setBulk((c) => c.hour === 12 || c.hour === 13, "free", "Desk Lunch") },
    { name: "Cancel in My Head", apply: () => setBulk((c) => c.type === "work" && c.origin !== "external", "ghost", "Cancelled (mentally)") },
    {
      name: "Reset to suggested week",
      apply: () => {
        const fresh = buildSuggestedWeek({ hoursPerWeek: profile.hoursPerWeek || 40 });
        setCells((prev) => {
          const externals = prev.filter((c) => c.origin === "external");
          const map = new Map<string, CalendarCell>();
          for (const c of fresh) map.set(key(c.day, c.hour), c);
          for (const c of externals) map.set(key(c.day, c.hour), c);
          return Array.from(map.values()).sort((a, b) => a.day - b.day || a.hour - b.hour);
        });
        toast("Week reset", { description: "Your real bookings stay put." });
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
  async function handleConnect(provider: "google" | "apple" | "ics", name: string, url: string) {
    const id = addExternalCalendar({ provider, name, url });
    setConnectOpen(false);
    await refreshExternal(id, url);
  }

  function rebookTask(title: string, durationHours: number) {
    const slots = suggestRebookSlots(cells, profile.preferredBand, durationHours);
    if (slots.length === 0) {
      toast.error("No matching free slots — try a different time-of-day band in your profile.");
      return;
    }
    for (const s of slots) setCell(s.day, s.hour, "ooo", `OOO · ${title}`);
    setOooOpen(false);
    toast.success(`Rebooked '${title}' into ${slots.length} ${profile.preferredBand} slot(s)`);
  }


  return (
    <main className="pt-24 select-none">
      <section className="relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 ink-bleed" aria-hidden />
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Module 03 — Week of grind</p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
            The Grind<br /><em>Calendar.</em>
          </h1>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            Built from your salary and hours. INKO suggests breaks that earn you free money,
            and celebrates every OOO by rebooking it on your terms.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
        {/* Free money banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-ink/40 bg-ink/5 px-5 py-4">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl">
            <Sparkles className="h-4 w-4 text-ink" />
            Free money rate: <span className="text-necro">${freeMoneyPerHour.toFixed(2)} / break hour</span>
            <span className="text-bone/50">· {counts.grind} grind breaks scheduled this week</span>
          </p>
          <button
            onClick={() => setOooOpen(true)}
            className="inline-flex items-center gap-2 border border-ink bg-ink/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:bg-ink/30"
          >
            <PartyPopper className="h-3.5 w-3.5" /> Celebrate OOO
          </button>
        </div>

        {/* Calendar connections */}
        <div className="mb-8 border border-border bg-charcoal">
          <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
            <span className="flex items-center gap-2"><CalIcon className="h-3.5 w-3.5 text-ink" /> Connected calendars</span>
            <Link to="/profile" className="text-ink hover:underline">manage profile →</Link>
          </div>
          <div className="p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
              Read-only. We never touch your real meetings.
            </p>
            <button onClick={() => setConnectOpen(true)} className="flex w-full items-center justify-between border border-border bg-obsidian px-4 py-4 text-left transition-all hover:border-ink">
              <span className="flex items-center gap-3">
                <CalIcon className="h-5 w-5 text-ink" /><AppleIcon className="h-5 w-5 text-ink" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-pearl">Connect Google or Apple Calendar</span>
              </span>
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

        <div className="mb-6 grid gap-3 md:grid-cols-5">
          <Stat label="Grind hours" v={counts.grind} tone="ink" />
          <Stat label="Pure work" v={counts.work} tone="pearl" />
          <Stat label="Ghost meetings" v={counts.ghost} tone="violet" />
          <Stat label="OOO rebooked" v={counts.ooo} tone="necro" />
          <Stat label="Real bookings" v={counts.booked} tone="bone" />
        </div>

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
                  : cell.type === "free" ? "bg-ink/25 hover:bg-ink/35"
                  : cell.type === "work" ? "bg-bone/5 hover:bg-bone/10"
                  : cell.type === "ooo" ? "bg-necro/20 hover:bg-necro/30"
                  : "bg-violet/15 hover:bg-violet/25";
                const labelTone = external ? "text-bone/70"
                  : cell.type === "free" ? "text-ink"
                  : cell.type === "ooo" ? "text-necro"
                  : cell.type === "ghost" ? "text-violet" : "text-bone/60";
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
          Click to cycle: Work → Grind → Ghost → OOO. Drag to bulk-mark. Locked cells are real bookings (read-only).
        </p>

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

      <AnimatePresence>
        {connectOpen && (
          <ConnectStepper onClose={() => setConnectOpen(false)} onSubmit={handleConnect} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {oooOpen && (
          <OOOModal
            externalTitles={Array.from(new Set(profile.externalEvents.map((e) => e.title))).slice(0, 8)}
            band={profile.preferredBand}
            onBand={(b) => setProfile({ preferredBand: b })}
            onClose={() => setOooOpen(false)}
            onRebook={rebookTask}
          />
        )}
      </AnimatePresence>

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
              <p className="mt-8 font-display text-3xl italic text-necro">INKO APPROVES…</p>
              <div className="mt-8 flex justify-center gap-3">
                <button onClick={() => setTrigger(null)} className="border border-border px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-pearl">Snooze</button>
                <button onClick={() => setTrigger(null)} className="border border-ink bg-ink/30 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:bg-ink/50">Acknowledge & Grind</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Stat({ label, v, tone }: { label: string; v: number; tone: "ink" | "pearl" | "violet" | "necro" | "bone" }) {
  const t = { ink: "text-ink", pearl: "text-pearl", violet: "text-violet", necro: "text-necro", bone: "text-bone" }[tone];
  const border = tone === "ink" || tone === "necro" ? "border-ink/40" : "border-border";
  return (
    <div className={`border ${border} bg-charcoal p-4`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">{label}</p>
      <p className={`mt-1 font-display text-3xl ${t}`}>{v}</p>
    </div>
  );
}

// ---------------- Stepper modal ----------------
function ConnectStepper({
  onClose, onSubmit,
}: { onClose: () => void; onSubmit: (provider: "google" | "apple" | "ics", name: string, url: string) => Promise<void> }) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<"google" | "apple" | "ics">("google");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("Google Calendar");
  const [testing, setTesting] = useState(false);
  const [tested, setTested] = useState<{ ok: boolean; count?: number; msg?: string } | null>(null);

  function choose(p: "google" | "apple" | "ics") {
    setProvider(p);
    setName(p === "apple" ? "Apple Calendar" : p === "google" ? "Google Calendar" : "My Calendar");
    setStep(2);
    setTested(null);
  }
  async function testConnection() {
    setTesting(true); setTested(null);
    try {
      const events = await fetchIcs(url);
      setTested({ ok: true, count: events.length });
    } catch (e) {
      const err = e as IcsError;
      setTested({ ok: false, msg: err.message || "Failed" });
    } finally { setTesting(false); }
  }
  async function loadDemo() {
    const demo = "https://calendar.google.com/calendar/ical/en.usa%23holiday%40group.v.calendar.google.com/public/basic.ics";
    setUrl(demo); setName("US Holidays (demo)"); setProvider("ics");
    setTested(null);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] grid place-items-center bg-obsidian/95 p-6 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl border border-ink bg-charcoal shadow-[0_30px_120px_-20px_var(--ink)]"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
          <span>Connect a calendar · step {step} of 3</span>
          <button onClick={onClose}><X className="h-4 w-4 text-bone/70 hover:text-pearl" /></button>
        </div>

        <div className="flex gap-1 px-5 pt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 ${s <= step ? "bg-ink" : "bg-border"}`} />
          ))}
        </div>

        <div className="space-y-5 p-6">
          {step === 1 && (
            <>
              <p className="font-display text-2xl text-pearl">Which calendar?</p>
              <div className="grid gap-3 md:grid-cols-3">
                <ProviderCard label="Google" icon={CalIcon} onClick={() => choose("google")} />
                <ProviderCard label="Apple iCloud" icon={AppleIcon} onClick={() => choose("apple")} />
                <ProviderCard label="Other (ICS)" icon={CalIcon} onClick={() => choose("ics")} />
              </div>
              <button onClick={loadDemo} className="mt-2 inline-flex items-center gap-2 border border-border bg-obsidian px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-ink">
                <Sparkles className="h-3 w-3" /> Try with a demo calendar
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="font-display text-2xl text-pearl">Grab your calendar link</p>
              <ol className="list-decimal space-y-3 pl-5 text-sm text-bone">
                {provider === "google" && <>
                  <li>Open <a className="text-ink underline" href="https://calendar.google.com/calendar/u/0/r/settings" target="_blank" rel="noreferrer">Google Calendar Settings</a>.</li>
                  <li>Click the calendar you want under "Settings for my calendars".</li>
                  <li>Scroll to <em>Integrate calendar</em> → copy the <em>Secret address in iCal format</em>.</li>
                  <li className="text-bone/60">(Public address works too if your calendar is shared publicly.)</li>
                </>}
                {provider === "apple" && <>
                  <li>Open Calendar on Mac. Right-click the calendar → <em>Share Calendar</em>.</li>
                  <li>Check <em>Public Calendar</em>, then click <em>Share Link</em> and copy the <code className="text-ink">webcal://</code> URL.</li>
                  <li>Paste below — we'll convert it to <code className="text-ink">https://</code> automatically.</li>
                </>}
                {provider === "ics" && <>
                  <li>Locate any public ICS/iCal feed from your calendar provider.</li>
                  <li>Copy the full URL (it usually ends with <code className="text-ink">.ics</code>).</li>
                </>}
              </ol>
              <div className="flex justify-between gap-3">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-pearl">
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>
                <button onClick={() => setStep(3)} className="inline-flex items-center gap-2 border border-ink bg-ink/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:bg-ink/50">
                  I have the link <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="font-display text-2xl text-pearl">Paste & test</p>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Display name</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full border border-border bg-obsidian px-3 py-3 font-mono text-sm text-pearl outline-none focus:border-ink" />
              </div>
              <div>
                <label className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
                  <span>Calendar URL</span>
                  {url && <button onClick={() => navigator.clipboard?.writeText(url)} className="text-ink hover:underline inline-flex items-center gap-1"><Copy className="h-3 w-3" /> copy</button>}
                </label>
                <input value={url} onChange={(e) => { setUrl(e.target.value); setTested(null); }}
                  placeholder={provider === "apple" ? "webcal://p01-caldav.icloud.com/..." : "https://calendar.google.com/calendar/ical/.../basic.ics"}
                  className="w-full border border-border bg-obsidian px-3 py-3 font-mono text-sm text-pearl outline-none focus:border-ink" />
              </div>

              {tested && (
                <div className={`border p-3 font-mono text-[10px] uppercase tracking-[0.3em] ${
                  tested.ok ? "border-necro/50 bg-necro/10 text-necro" : "border-pink/50 bg-pink/10 text-pink"
                }`}>
                  {tested.ok
                    ? <span className="inline-flex items-center gap-2"><Check className="h-3 w-3" /> Found {tested.count} events — ready to connect</span>
                    : <span>Test failed: {tested.msg}</span>}
                </div>
              )}

              <div className="flex justify-between gap-3">
                <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-pearl">
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>
                <div className="flex gap-2">
                  <button onClick={testConnection} disabled={!url.trim() || testing}
                    className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-ink disabled:opacity-40">
                    {testing ? "Testing…" : "Test connection"}
                  </button>
                  <button onClick={() => onSubmit(provider, name, url)} disabled={!url.trim()}
                    className="inline-flex items-center gap-2 border border-ink bg-ink/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:bg-ink/50 disabled:opacity-40">
                    <Check className="h-3 w-3" /> Connect
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProviderCard({ label, icon: Icon, onClick }: { label: string; icon: typeof CalIcon; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="group flex flex-col items-center gap-3 border border-border bg-obsidian p-6 text-center transition-all hover:border-ink hover:bg-ink/5">
      <Icon className="h-8 w-8 text-ink" />
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pearl">{label}</span>
    </button>
  );
}

// ---------------- OOO modal ----------------
function OOOModal({
  externalTitles, band, onBand, onClose, onRebook,
}: {
  externalTitles: string[];
  band: "morning" | "afternoon" | "evening";
  onBand: (b: "morning" | "afternoon" | "evening") => void;
  onClose: () => void;
  onRebook: (title: string, hours: number) => void;
}) {
  const [title, setTitle] = useState(externalTitles[0] ?? "");
  const [hours, setHours] = useState(1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] grid place-items-center bg-obsidian/95 p-6 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl border border-necro bg-charcoal shadow-[0_30px_120px_-20px_var(--necro)]"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
          <span className="flex items-center gap-2"><PartyPopper className="h-4 w-4 text-necro" /> Celebrate OOO · Rebook</span>
          <button onClick={onClose}><X className="h-4 w-4 text-bone/70 hover:text-pearl" /></button>
        </div>
        <div className="space-y-5 p-6">
          <p className="text-sm text-bone">
            Out of office today? Pick the task you couldn't get to and INKO will reschedule it
            inside your preferred grind band.
          </p>
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Task / meeting</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quarterly review prep"
              className="w-full border border-border bg-obsidian px-3 py-3 font-mono text-sm text-pearl outline-none focus:border-ink" />
            {externalTitles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {externalTitles.map((t) => (
                  <button key={t} onClick={() => setTitle(t)} className="border border-border bg-obsidian px-2 py-1 font-mono text-[10px] text-bone hover:border-ink hover:text-pearl">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Duration</label>
              <select value={hours} onChange={(e) => setHours(Number(e.target.value))}
                className="w-full border border-border bg-obsidian px-3 py-3 font-mono text-sm text-pearl outline-none focus:border-ink">
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={3}>3 hours</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Preferred band</label>
              <div className="flex gap-1">
                {(["morning", "afternoon", "evening"] as const).map((b) => (
                  <button key={b} onClick={() => onBand(b)}
                    className={`flex-1 border px-2 py-3 font-mono text-[10px] uppercase tracking-[0.2em] ${
                      band === b ? "border-ink bg-ink/20 text-pearl" : "border-border bg-obsidian text-bone hover:border-pearl"
                    }`}>{b}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-pearl">Cancel</button>
            <button onClick={() => onRebook(title.trim() || "OOO Task", hours)} disabled={!title.trim()}
              className="inline-flex items-center gap-2 border border-necro bg-necro/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:bg-necro/50 disabled:opacity-40">
              <Check className="h-3 w-3" /> Rebook to {band}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
