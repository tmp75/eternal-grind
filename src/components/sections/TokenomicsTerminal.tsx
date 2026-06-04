import { motion } from "framer-motion";
import { Copy, Lock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  INKO_BUY_URL,
  INKO_CA,
  INKO_COMMUNITY_URL,
  INKO_BRIDGE_URL,
  INKO_DEBANK_URL,
  INKO_DEV_LOCK_TX_URL,
  INKO_DEXSCREENER_URL,
  INKO_GECKOTERMINAL_URL,
} from "@/lib/ooo";
import inkoCoin from "@/assets/inko-coin.png";

const SHORT_CA = `${INKO_CA.slice(0, 6)}…${INKO_CA.slice(-4)}`;

const ROWS: { k: string; v: React.ReactNode; mono?: boolean }[] = [
  { k: "Ticker", v: "$INKO", mono: true },
  { k: "Supply", v: "1,000,000,000", mono: true },
  { k: "Network", v: "Inkchain" },
  { k: "Type", v: "Meme · Eternal Grind" },
  { k: "Tax", v: "0 / 0", mono: true },
  { k: "Utility", v: "Unlocks grind techniques" },
];

function copyCA() {
  navigator.clipboard.writeText(INKO_CA).then(
    () => toast.success("Contract address copied", { description: SHORT_CA }),
    () => toast.error("Copy failed"),
  );
}

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
              className="flex items-center justify-between border-b border-border px-6 py-6 md:border-r md:[&:nth-child(2n)]:border-r-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">{r.k}</span>
              <span className={r.mono ? "font-mono text-xl text-pearl" : "font-display text-2xl text-pearl"}>
                {r.v}
              </span>
            </div>
          ))}

          {/* Contract */}
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-6 md:border-r">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Contract</span>
            <button
              onClick={copyCA}
              title={INKO_CA}
              className="group inline-flex items-center gap-2 border border-border bg-charcoal/60 px-3 py-2 font-mono text-sm text-pearl transition-all hover:border-ink hover:text-ink"
            >
              <span>{SHORT_CA}</span>
              <Copy className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
            </button>
          </div>

          {/* Dev supply lock */}
          <div className="flex items-center justify-between border-b border-border px-6 py-6 md:[&:nth-child(2n)]:border-r-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Dev supply</span>
            <span className="inline-flex items-center gap-2 font-mono text-lg text-pearl">
              <Lock className="h-4 w-4 text-ink" /> 25% · locked 12 months
            </span>
          </div>

          {/* Community */}
          <div className="flex items-center justify-between px-6 py-6 md:border-r md:[&:nth-child(2n)]:border-r-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Community</span>
            <a
              href={INKO_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm text-pearl underline decoration-ink/50 underline-offset-4 hover:text-ink"
            >
              inkypump.com/join/INKO <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
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
