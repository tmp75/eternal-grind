import { motion } from "framer-motion";
import { HALF_TRUTHS } from "@/lib/ooo";

export function HalfTruths() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-charcoal py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 pinstripe-strong opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1300px] px-6 md:px-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">§04 — Corporate Half-Truths</p>
        <h2 className="max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-pearl md:text-6xl">
          Delivered with absolute seriousness.
        </h2>
        <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {HALF_TRUTHS.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: (i % 4) * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border-l-2 border-ink pl-5 font-display text-xl italic text-pearl md:text-2xl"
            >
              <span className="float-left mr-2 font-display text-5xl leading-[0.7] text-ink">"</span>
              {t}
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
