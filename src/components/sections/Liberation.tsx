import { motion } from "framer-motion";

export function Liberation() {
  return (
    <section className="relative overflow-hidden py-40 md:py-56">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 ink-bleed" aria-hidden />
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">§05 — 17:00 // Liberation Hour</p>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl italic leading-snug text-pearl md:text-5xl"
        >
          The time has come.<br /> Leave work and <em>do not look back.</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-16 max-w-xl border border-border bg-charcoal pinstripe text-left shadow-[0_30px_80px_-20px_rgba(123,44,255,0.4)]"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
            <span>● Universal Alarm</span>
            <span className="text-ink">17:00:00</span>
          </div>
          <div className="px-6 py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">From: ooo.system</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">To: you</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Subject: It is finished.</p>
            <hr className="my-4 border-border" />
            <p className="text-pearl">
              The market has opened. Close the laptop. Leave the chair warm. The deliverables can wait —
              they were never yours to begin with. <span className="italic text-necro">Rest is resistance.</span>
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">— Sent from the void —</p>
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, scale: 0.92, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 font-display text-[12vw] leading-[0.85] tracking-tight text-pearl text-glow md:text-[8vw]"
        >
          Out of office. Forever.
        </motion.h3>
      </div>
    </section>
  );
}
