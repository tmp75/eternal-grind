import { motion } from "framer-motion";
import inkoCoin from "@/assets/inko-coin.png";

export function Liberation() {
  return (
    <section className="relative overflow-hidden py-40 md:py-56">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 ink-bleed" aria-hidden />
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">∞ // The Grind Never Ends</p>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl italic leading-snug text-pearl md:text-5xl"
        >
          INKO is already grinding.<br /> You will <em>never catch up.</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-16 max-w-xl border border-border bg-charcoal pinstripe text-left shadow-[0_30px_80px_-20px_rgba(123,44,255,0.4)]"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
            <span>● Auto-Reply</span>
            <span className="text-ink">∞</span>
          </div>
          <div className="px-6 py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">From: inko@inkchain</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">To: the peasants</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Subject: In Deep Grind (∞)</p>
            <hr className="my-4 border-border" />
            <p className="text-pearl">
              I am currently <span className="italic text-bone">in deep grind</span> and will respond when the
              market rewards me for doing nothing. For all matters, please consult my last 17 status updates.
              The deliverables are vibes.
              <span className="italic text-necro"> The grind is eternal.</span>
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">— Sent from my couch —</p>
          </div>
        </motion.div>

        <motion.img
          src={inkoCoin}
          alt="$INKO coin"
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-20 h-40 w-40 drop-shadow-[0_20px_60px_rgba(123,44,255,0.55)] md:h-56 md:w-56"
          draggable={false}
        />

        <motion.h3
          initial={{ opacity: 0, scale: 0.92, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 font-display text-[12vw] leading-[0.85] tracking-tight text-pearl text-glow md:text-[8vw]"
        >
          $INKO. Forever.
        </motion.h3>
      </div>
    </section>
  );
}
