import { motion } from "framer-motion";
import { TACTICS } from "@/lib/ooo";

export function SurvivalTactics() {
  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Module 01 / Content Matrix</p>
        <h2 className="max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-pearl md:text-6xl">
          Corporate Survival Tactics.
        </h2>
        <p className="mt-6 max-w-2xl text-bone">
          Field-tested protocols for reclaiming your time, your sanity, and your coffee breaks.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TACTICS.map((t, i) => (
            <motion.article
              key={t.title}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex h-full flex-col border border-border bg-charcoal p-6 transition-all hover:border-ink hover:shadow-[0_0_40px_color-mix(in_oklab,var(--ink)_35%,transparent)]"
            >
              <span className="self-start rounded-sm border border-ink/40 bg-ink/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-ink">
                {t.tag}
              </span>
              <h3 className="mt-4 font-display text-2xl leading-tight text-pearl">{t.title}</h3>
              <p className="mt-3 flex-1 text-bone">{t.body}</p>
              <p className="mt-6 border-t border-border/60 pt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-bone/50">
                // FILED UNDER: $OOO
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
