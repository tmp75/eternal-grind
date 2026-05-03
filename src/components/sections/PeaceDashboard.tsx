import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SALARY_PER_HOUR, WORK_END_HOUR } from "@/lib/ooo";

function workdayProgressEuros() {
  const now = new Date();
  const start = new Date(now); start.setHours(9, 0, 0, 0);
  const end = new Date(now); end.setHours(WORK_END_HOUR, 0, 0, 0);
  if (now < start) return 0;
  if (now > end) return SALARY_PER_HOUR * 8;
  const hours = (now.getTime() - start.getTime()) / 3_600_000;
  return hours * SALARY_PER_HOUR;
}

export function PeaceDashboard() {
  const [eur, setEur] = useState(workdayProgressEuros());
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { setEur(workdayProgressEuros()); setTick((t) => t + 1); }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden py-32 md:py-40">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">§01 — Today / Live Dashboard</p>
        <h2 className="max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-pearl md:text-6xl">
          Peace acquired from your boss, in real time.
        </h2>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <motion.div
            key={tick}
            initial={{ filter: "blur(0px)" }}
            className="md:col-span-2 border border-ink/40 bg-charcoal p-8 shadow-[0_0_60px_-20px_var(--ink)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">€€ Acquired today</p>
            <p className="mt-3 font-display text-7xl text-pearl text-glow md:text-8xl">
              €{eur.toFixed(2)}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-necro">
              ● Compounding · Tax-free · Spiritually yours
            </p>
            <div className="mt-8 h-2 w-full overflow-hidden border border-border bg-obsidian">
              <div
                className="h-full bg-gradient-to-r from-ink via-violet to-necro transition-[width] duration-700"
                style={{ width: `${Math.min(100, (eur / (SALARY_PER_HOUR * 8)) * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
              <span>09:00 — Surrender</span>
              <span>17:00 — Liberation</span>
            </div>
          </motion.div>

          <div className="grid gap-5">
            <div className="border border-border bg-charcoal p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Status</p>
              <p className="mt-3 font-display text-3xl text-pearl">Available <span className="text-bone/50">(in spirit)</span></p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-necro">● Online — barely</p>
            </div>
            <div className="border border-border bg-charcoal p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Upcoming sacred mission</p>
              <p className="mt-3 font-display text-2xl text-pearl">🍝 Sacred Lunch</p>
              <p className="mt-1 text-sm text-bone">12:00 · 60 min · cannot be interrupted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
