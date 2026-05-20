import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { MISSIONS } from "@/lib/ooo";

export function MissionsPreview() {
  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">§03 — Grind Techniques</p>
        <h2 className="max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-pearl md:text-6xl">
          Six rituals INKO does daily.
        </h2>
        <p className="mt-6 max-w-2xl text-bone">
          Full-screen overlays. Sound. Vibration. Each technique is a sealed contract between you and INKO:
          a sanctified block of performative grinding, paid for by the corporation, executed with absolute smugness.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group relative border border-border bg-charcoal p-6 transition-all hover:border-ink hover:shadow-[0_0_40px_color-mix(in_oklab,var(--ink)_30%,transparent)]"
              >
                <div className="flex items-baseline justify-between">
                  <Icon className="h-8 w-8 text-ink" strokeWidth={1.5} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">{m.duration}</span>
                </div>
                <p className="mt-4 font-display text-2xl text-pearl">{m.title}</p>
                <p className="mt-2 text-sm text-bone">{m.description}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-necro">● Status: {m.status}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12">
          <Link to="/missions" className="inline-flex items-center gap-3 border border-ink/50 bg-ink/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl hover:border-ink hover:bg-ink/20 hover:shadow-[0_0_30px_var(--ink)]">
            Begin a grind →
          </Link>
        </div>
      </div>
    </section>
  );
}
