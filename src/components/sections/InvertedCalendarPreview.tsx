import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Flame, Briefcase } from "lucide-react";
import { buildDefaultWeek } from "@/lib/ooo";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

export function InvertedCalendarPreview() {
  const cells = buildDefaultWeek();
  const grind = cells.filter((c) => c.type === "free").length;
  const work = cells.filter((c) => c.type === "work").length;

  return (
    <section className="relative overflow-hidden border-y border-border bg-charcoal py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 pinstripe opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-[1300px] px-6 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Module 03 / The Grind Calendar</p>
            <h2 className="max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-pearl md:text-6xl">
              Default state: <em className="text-ink">grinding.</em><br /> Always. Forever.
            </h2>
          </div>
          <Link to="/calendar" className="border border-ink/50 bg-ink/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl hover:border-ink hover:bg-ink/20">
            Edit your grind →
          </Link>
        </div>

        <div className="border border-border bg-obsidian">
          <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-border bg-charcoal/60 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
            <div className="border-r border-border p-3">Hr</div>
            {DAYS.map((d) => (
              <div key={d} className="border-r border-border p-3 last:border-r-0">{d}</div>
            ))}
          </div>

          {HOURS.map((h) => (
            <div key={h} className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-border last:border-b-0">
              <div className="border-r border-border p-3 font-mono text-[10px] text-bone/60">{h}:00</div>
              {DAYS.map((_, di) => {
                const cell = cells.find((c) => c.day === di && c.hour === h);
                const isGrind = cell?.type === "free";
                const Icon = isGrind ? Flame : Briefcase;
                return (
                  <motion.div
                    key={di}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (h - 9) * 0.04 + di * 0.02 }}
                    className={`relative min-h-[44px] border-r border-border p-2 last:border-r-0 ${
                      isGrind ? "bg-ink/20" : "bg-bone/5"
                    }`}
                  >
                    {cell?.label && (
                      <span className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] ${isGrind ? "text-ink" : "text-bone/50"}`}>
                        <Icon className="h-2.5 w-2.5" /> {isGrind ? cell.label : ""}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
          <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 bg-ink/40" /> Smug grind overlay</span>
          <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 bg-bone/10" /> Pure work</span>
          <span className="ml-auto text-necro">● Grind highlights : Work base = {grind} : {work}</span>
        </div>
      </div>
    </section>
  );
}
