import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MISSIONS, type Mission } from "@/lib/ooo";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Sacred Missions — OOO" },
      { name: "description", content: "Six full-screen rituals against the desk: Sacred Lunch, Paid Toilet Break, Extended Coffee, Ghost Meeting, Fake Deep Focus, Doctor's Note. €€ tracked live." },
      { property: "og:title", content: "Sacred Missions — OOO" },
      { property: "og:description", content: "Full-screen overlays. Live € tracker. Cannot be interrupted." },
    ],
  }),
  component: MissionsPage,
});

function MissionOverlay({ mission, onClose }: { mission: Mission; onClose: () => void }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const eur = (seconds / 60) * mission.rate;
  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] grid place-items-center bg-obsidian/95 p-6 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 ink-bleed" />
      <motion.div
        initial={{ scale: 0.92, filter: "blur(20px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl border border-ink bg-charcoal p-10 text-center shadow-[0_30px_120px_-20px_var(--ink)]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-violet">● Mission active · cannot be interrupted</p>
        <div className="mt-6 text-7xl">{mission.emoji}</div>
        <h2 className="mt-4 font-display text-5xl text-pearl text-glow md:text-6xl">{mission.title}</h2>
        <p className="mt-3 font-display text-xl italic text-bone">{mission.truth}</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="border border-border bg-obsidian p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Elapsed</p>
            <p className="mt-2 font-mono text-5xl text-pearl">{min}:{sec}</p>
          </div>
          <div className="border border-ink/40 bg-obsidian p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">€€ Acquired</p>
            <p className="mt-2 font-display text-5xl text-necro">€{eur.toFixed(2)}</p>
          </div>
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
          Status broadcast: <span className="text-pearl">{mission.status}</span>
        </p>

        <button
          onClick={onClose}
          className="mt-10 border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl hover:border-ink hover:text-ink"
        >
          End mission ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

function MissionsPage() {
  const [active, setActive] = useState<Mission | null>(null);

  return (
    <main className="pt-24">
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">— Six rituals —</p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
            Sacred<br /><em>Missions.</em>
          </h1>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            Full-screen overlays. Live € tracker. Each ritual is a sealed contract between you and the void.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-6 py-16 md:px-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((m, i) => (
            <motion.button
              key={m.id}
              type="button"
              onClick={() => setActive(m)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="group block border border-border bg-charcoal p-6 text-left transition-all hover:border-ink hover:shadow-[0_0_40px_color-mix(in_oklab,var(--ink)_35%,transparent)]"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-5xl">{m.emoji}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">{m.duration}</span>
              </div>
              <p className="mt-4 font-display text-2xl text-pearl">{m.title}</p>
              <p className="mt-2 text-sm text-bone">{m.description}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-necro">▶ Begin ritual</p>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && <MissionOverlay mission={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </main>
  );
}
