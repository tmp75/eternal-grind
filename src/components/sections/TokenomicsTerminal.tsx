import { motion } from "framer-motion";
import { INKCHAIN_URL } from "@/lib/ooo";
import inkoCoin from "@/assets/inko-coin.png";

const ROWS: { k: string; v: React.ReactNode; mono?: boolean }[] = [
  { k: "Ticker", v: "$INKO", mono: true },
  { k: "Supply", v: "1,000,000,000", mono: true },
  { k: "Network", v: "Inkchain" },
  { k: "Type", v: "Meme · Eternal Grind" },
  { k: "Tax", v: "0 / 0", mono: true },
  { k: "Utility", v: "Unlocks grind techniques" },
];

export function TokenomicsTerminal() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-charcoal py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 pinstripe-strong opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1300px] px-6 md:px-12">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Module 04 / Terminal</p>
            <h2 className="font-display text-5xl leading-[1.02] tracking-tight text-pearl md:text-6xl">
              Tokenomics Terminal.
            </h2>
            <p className="mt-6 max-w-xl font-display text-xl italic text-bone">
              "$INKO. The only asset that pumps when its holders do absolutely nothing."
            </p>
          </div>
          <img src={inkoCoin} alt="$INKO coin" className="hidden h-28 w-28 drop-shadow-[0_10px_40px_rgba(123,44,255,0.55)] md:block" draggable={false} />
        </div>

        <div className="grid gap-0 border border-border bg-obsidian/70 md:grid-cols-2">
          {ROWS.map((r) => (
            <div
              key={r.k}
              className="flex items-center justify-between border-b border-border px-6 py-6 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:border-r md:[&:nth-child(2n)]:border-r-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">{r.k}</span>
              <span className={r.mono ? "font-mono text-xl text-pearl" : "font-display text-2xl text-pearl"}>
                {r.v}
              </span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 flex flex-col items-start justify-between gap-6 border border-ink/50 bg-gradient-to-r from-ink/15 via-violet/10 to-ink/15 p-8 md:flex-row md:items-center md:p-10"
        >
          <div>
            <p className="font-display text-4xl text-pearl text-glow md:text-5xl">Grind Eternally.</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
              Live on Inkchain · 1B supply · zero deliverables
            </p>
          </div>
          <a
            href={INKCHAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink bg-ink/30 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl transition-all hover:bg-ink/50 hover:shadow-[0_0_40px_var(--ink)]"
          >
            Buy $INKO on Inkchain →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
