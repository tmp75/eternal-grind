import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { WEEK } from "@/lib/ooo";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Inverted Calendar — OOO" },
      { name: "description", content: "The weekly inverted calendar. Celebrated free blocks dominate. Wasted work shrinks. Templates: Strategic Free Afternoon, Ghost Friday, Meeting I Cancelled in My Head." },
      { property: "og:title", content: "Inverted Calendar — OOO" },
      { property: "og:description", content: "A week where free time is the deliverable." },
    ],
  }),
  component: CalendarPage,
});

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9..17

const TEMPLATES = [
  { name: "Strategic Free Afternoon", emoji: "🟢", note: "12:00 → 18:00 sealed in green velvet" },
  { name: "Ghost Friday", emoji: "👻", note: "Calendar deleted. You were never here." },
  { name: "Meeting I Cancelled in My Head", emoji: "🧠", note: "Officially declined in spirit" },
  { name: "Sacred Lunch (extended)", emoji: "🍝", note: "13:00 → 15:00, fork in hand" },
];

function CalendarPage() {
  return (
    <main className="pt-24">
      <section className="relative overflow-hidden border-b border-border py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 ink-bleed" aria-hidden />
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">— Week of forever —</p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
            The Inverted<br /><em>Calendar.</em>
          </h1>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            🟢 free blocks take more visual space than ⚫ work. The chart should look like a forest with one tiny rock.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
        <div className="border border-border bg-obsidian">
          <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border bg-charcoal/60 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
            <div className="border-r border-border p-4">Hour</div>
            {DAYS.map((d) => (
              <div key={d} className="border-r border-border p-4 last:border-r-0">{d}</div>
            ))}
          </div>

          {HOURS.map((h) => (
            <div key={h} className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border last:border-b-0">
              <div className="border-r border-border p-4 font-mono text-[10px] text-bone/60">{h}:00</div>
              {DAYS.map((_, di) => {
                const block = WEEK.find((b) => b.day === di && h >= b.start && h < b.end);
                const free = block?.type === "free";
                const work = block?.type === "work";
                const isStart = block && h === block.start;
                return (
                  <motion.div
                    key={di}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (h - 9) * 0.03 + di * 0.02 }}
                    className={`relative min-h-[68px] border-r border-border p-3 last:border-r-0 ${
                      free ? "bg-ink/15" : work ? "bg-bone/5" : ""
                    }`}
                  >
                    {isStart && (
                      <div>
                        <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${free ? "text-necro" : "text-bone/70"}`}>
                          {free ? "🟢 Celebrated" : "⚫ Wasted"}
                        </p>
                        <p className="mt-1 font-display text-base text-pearl leading-tight">{block.label}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Templates</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((t) => (
              <div key={t.name} className="group border border-border bg-charcoal p-6 transition-all hover:border-ink hover:shadow-[0_0_30px_color-mix(in_oklab,var(--ink)_30%,transparent)]">
                <span className="text-3xl">{t.emoji}</span>
                <p className="mt-3 font-display text-xl text-pearl">{t.name}</p>
                <p className="mt-2 text-sm text-bone">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
