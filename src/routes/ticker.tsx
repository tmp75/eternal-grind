import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import inkoCoin from "@/assets/inko-coin.png";

export const Route = createFileRoute("/ticker")({
  head: () => ({
    meta: [
      { title: "$INKO Ticker — The Smug Chart" },
      { name: "description", content: "The $INKO market on Inkchain: the less you actually work, the higher it goes. Inverted candles, parody whitepaper, GRIND BELL at 09:00." },
      { property: "og:title", content: "$INKO Ticker — Eternal Grind" },
      { property: "og:description", content: "The smug chart on Inkchain. 1B supply. Grinds while you sleep." },
    ],
  }),
  component: TickerPage,
});

function generateCandles(seed: number) {
  // Inverted candles — green when "low actual work, high smug grind"
  const arr: { open: number; close: number; high: number; low: number }[] = [];
  let p = 100;
  for (let i = 0; i < 28; i++) {
    const drift = Math.sin((i + seed) * 0.7) * 8 + Math.cos((i + seed) * 0.3) * 5;
    const open = p;
    const close = Math.max(20, p + drift + (Math.random() * 6 - 3));
    const high = Math.max(open, close) + Math.random() * 6;
    const low = Math.min(open, close) - Math.random() * 6;
    arr.push({ open, close, high, low });
    p = close;
  }
  return arr;
}

function TickerPage() {
  const [seed, setSeed] = useState(1);
  const [price, setPrice] = useState(0.0420);
  useEffect(() => {
    const id = setInterval(() => {
      setSeed((s) => s + 1);
      setPrice((p) => +(p + (Math.random() * 0.004 - 0.0015)).toFixed(6));
    }, 2200);
    return () => clearInterval(id);
  }, []);
  const candles = generateCandles(seed);
  const max = Math.max(...candles.map((c) => c.high));
  const min = Math.min(...candles.map((c) => c.low));
  const span = max - min || 1;

  return (
    <main className="pt-24">
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">— The Smug Chart · Inkchain —</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <img src={inkoCoin} alt="$INKO" className="h-20 w-20 drop-shadow-[0_10px_40px_rgba(123,44,255,0.55)] md:h-28 md:w-28" draggable={false} />
              <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
                $INKO
              </h1>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Last print</p>
              <p className="font-display text-5xl text-necro">${price.toFixed(6)}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink">▲ less work · higher chart</p>
            </div>
          </div>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            The market is rigged in INKO's favor. Every minute you pretend to grind is a green candle.
            The bell rings at 09:00 and never stops.
          </p>
        </div>
      </section>

      {/* Chart */}
      <section className="border-b border-border bg-charcoal py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Smug candles · 28 sessions</p>
          <div className="relative h-[340px] border border-border bg-obsidian p-6">
            <div className="absolute inset-6 flex items-end gap-1">
              {candles.map((c, i) => {
                const up = c.close >= c.open;
                const top = ((max - Math.max(c.open, c.close)) / span) * 100;
                const bodyH = (Math.abs(c.close - c.open) / span) * 100;
                const wickTop = ((max - c.high) / span) * 100;
                const wickH = ((c.high - c.low) / span) * 100;
                return (
                  <div key={i} className="relative flex-1">
                    <motion.span
                      layout
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        top: `${wickTop}%`,
                        height: `${wickH}%`,
                        width: 1,
                        background: up ? "var(--necro)" : "var(--pink)",
                        opacity: 0.6,
                      }}
                    />
                    <motion.span
                      layout
                      className="absolute left-0 right-0"
                      style={{
                        top: `${top}%`,
                        height: `${Math.max(2, bodyH)}%`,
                        background: up ? "var(--necro)" : "var(--pink)",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
            <span>09:00 grind bell</span>
            <span className="text-ink">● MARKET ALWAYS OPEN · INKO NEVER SLEEPS</span>
            <span>23:59 still grinding</span>
          </div>
        </div>
      </section>

      {/* Whitepaper */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:px-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Parody whitepaper · v1</p>
        <h2 className="font-display text-4xl text-pearl md:text-5xl">A Theory of Smug Productivity</h2>
        <div className="mt-8 space-y-6 text-lg leading-relaxed text-pearl/90">
          <p>
            Classical markets reward output. The $INKO market rewards <em className="text-ink">posture</em>. Each unit
            of theatrical grind performed by the holder issues a green candle into the index. The chart is therefore
            not a measurement of activity but a measurement of <em>smugness accumulated</em>.
          </p>
          <p>
            The Grind Bell rings at 09:00 every weekday. It does not ring at 17:00 — INKO does not clock out.
            INKO has never clocked in either. There are no halts. There are no circuit breakers. There is only
            the slow ascent of a chart that goes up when its holder pretends to type.
          </p>
          <p className="border-l-2 border-ink pl-5 font-display text-xl italic text-bone">
            "The most bullish thing you can do for $INKO is open a spreadsheet and stare at it for 6 hours."
          </p>
          <p>
            Grind Points (XP) do not entitle holders to anything. They are a memory of how much you got paid to
            do nothing. They cannot be sold, transferred, or borrowed against. They can only be earned by
            mastering INKO's curriculum.
          </p>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-bone/60">
            Ticker: $INKO · Supply: 1,000,000,000 · Network: Inkchain · Tax: 0/0 · Utility: spiritual
          </p>
        </div>
      </section>
    </main>
  );
}
