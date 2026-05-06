import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildDefaultWeek, TRIGGER_EVENTS, type BlockType, type CalendarCell } from "@/lib/ooo";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Inverse Calendar — $OOO" },
      { name: "description", content: "Edit your inverse week. Click cells, drag-select, apply templates: Strategic Free Afternoon, Ghost Friday, Sacred Lunch, Meeting I Cancelled in My Head." },
      { property: "og:title", content: "Inverse Calendar — $OOO" },
      { property: "og:description", content: "Free time is the deliverable. Edit your week, invert reality." },
    ],
  }),
  component: CalendarPage,
});

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 9);
const STORAGE_KEY = "ooo.calendar.v1";

const CYCLE: BlockType[] = ["free", "work", "ghost"];
function nextType(t: BlockType): BlockType { return CYCLE[(CYCLE.indexOf(t) + 1) % CYCLE.length]; }

function key(d: number, h: number) { return `${d}-${h}`; }

function CalendarPage() {
  const [cells, setCells] = useState<CalendarCell[]>(() => buildDefaultWeek());
  const [hydrated, setHydrated] = useState(false);
  const [drag, setDrag] = useState<{ start: string; type: BlockType } | null>(null);
  const [hover, setHover] = useState<Set<string>>(new Set());
  const [trigger, setTrigger] = useState<typeof TRIGGER_EVENTS[number] | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCells(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cells)); } catch {}
  }, [cells, hydrated]);

  const counts = useMemo(() => {
    let free = 0, work = 0, ghost = 0;
    for (const c of cells) {
      if (c.type === "free") free++;
      else if (c.type === "work") work++;
      else ghost++;
    }
    return { free, work, ghost };
  }, [cells]);
  const ratio = counts.work === 0 ? "∞ : 0" : `${(counts.free / counts.work).toFixed(1)} : 1`;

  function setCell(d: number, h: number, type: BlockType, label?: string) {
    setCells((prev) => prev.map((c) =>
      c.day === d && c.hour === h ? { ...c, type, label: label ?? c.label } : c,
    ));
  }
  function setBulk(predicate: (c: CalendarCell) => boolean, type: BlockType, label?: string) {
    setCells((prev) => prev.map((c) => predicate(c) ? { ...c, type, label: label ?? c.label } : c));
  }

  function handleDown(d: number, h: number) {
    const cell = cells.find((c) => c.day === d && c.hour === h)!;
    const next = nextType(cell.type);
    setDrag({ start: key(d, h), type: next });
    setHover(new Set([key(d, h)]));
    setCell(d, h, next, "");
  }
  function handleEnter(d: number, h: number) {
    if (!drag) return;
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
    { name: "Meeting I Cancelled in My Head", apply: () => setBulk((c) => c.type === "work", "ghost", "Meeting I Cancelled in My Head") },
    { name: "Reset week", apply: () => setCells(buildDefaultWeek()) },
  ];

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
            Click cells to invert reality. Drag to bulk-mark. Apply templates. The chart should look like a forest with one tiny rock.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
        {/* Stats */}
        <div className="mb-6 grid gap-3 md:grid-cols-4">
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
          <div className="border border-ink/40 bg-charcoal p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Inversion ratio</p>
            <p className="mt-1 font-display text-3xl text-ink">{ratio}</p>
          </div>
        </div>

        {/* Templates */}
        <div className="mb-6 flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.name}
              onClick={t.apply}
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
            {DAYS.map((d) => (
              <div key={d} className="border-r border-border p-4 last:border-r-0">{d}</div>
            ))}
          </div>

          {HOURS.map((h) => (
            <div key={h} className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border last:border-b-0">
              <div className="border-r border-border p-3 font-mono text-[10px] text-bone/60">{h}:00</div>
              {DAYS.map((_, di) => {
                const cell = cells.find((c) => c.day === di && c.hour === h)!;
                const free = cell.type === "free";
                const work = cell.type === "work";
                const ghost = cell.type === "ghost";
                return (
                  <button
                    key={di}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleDown(di, h); }}
                    onMouseEnter={() => handleEnter(di, h)}
                    className={`relative min-h-[64px] border-r border-border p-3 text-left transition-colors last:border-r-0 ${
                      free ? "bg-ink/15 hover:bg-ink/25" :
                      work ? "bg-bone/5 hover:bg-bone/10" :
                      "bg-violet/15 hover:bg-violet/25"
                    }`}
                  >
                    <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${free ? "text-necro" : ghost ? "text-violet" : "text-bone/70"}`}>
                      {free ? "🟢 Free" : ghost ? "👻 Ghost" : "⚫ Work"}
                    </p>
                    {cell.label && <p className="mt-1 font-display text-sm text-pearl leading-tight">{cell.label}</p>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
          Click to cycle: Free → Work → Ghost. Drag across cells to bulk-mark. Saved locally — your week is sacred.
        </p>

        {/* Trigger events */}
        <div className="mt-16">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Trigger Events · Daily</p>
          <div className="grid gap-4 md:grid-cols-3">
            {TRIGGER_EVENTS.map((e) => (
              <button
                key={e.label}
                onClick={() => setTrigger(e)}
                className="group border border-border bg-charcoal p-6 text-left transition-all hover:border-ink hover:shadow-[0_0_30px_color-mix(in_oklab,var(--ink)_30%,transparent)]"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink">{e.time}</p>
                <p className="mt-2 font-display text-2xl text-pearl">{e.label}</p>
                <p className="mt-2 text-sm text-bone">{e.note}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-necro">▶ Trigger now</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {trigger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-obsidian/95 p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, filter: "blur(16px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl border border-ink bg-charcoal p-10 text-center shadow-[0_30px_120px_-20px_var(--ink)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-violet">● {trigger.time}</p>
              <h3 className="mt-4 font-display text-5xl text-pearl text-glow">{trigger.label}</h3>
              <p className="mt-4 text-bone">{trigger.note}</p>
              <p className="mt-8 font-display text-3xl italic text-necro">EVACUATING…</p>
              <div className="mt-8 flex justify-center gap-3">
                <button
                  onClick={() => setTrigger(null)}
                  className="border border-border px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-pearl"
                >
                  Snooze
                </button>
                <button
                  onClick={() => setTrigger(null)}
                  className="border border-ink bg-ink/30 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:bg-ink/50"
                >
                  Acknowledge & Leave
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
