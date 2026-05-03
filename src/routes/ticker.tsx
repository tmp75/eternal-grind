import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/ticker")({
  head: () => ({
    meta: [
      { title: "$OOO Ticker — Inverted Market" },
      { name: "description", content: "The OOO market: the less you work, the higher it goes. Inverted candles, parody whitepaper, MARKET OPEN bell at 17:00." },
      { property: "og:title", content: "$OOO Ticker — Inverted Market" },
      { property: "og:description", content: "Less work = higher chart. MARKET OPEN at 17:00." },
    ],
  }),
  component: TickerPage,
});

function generateCandles(seed: number) {
  // Inverted candles — green when "low work activity"
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
  const [price, setPrice] = useState(420.69);
  useEffect(() => {
    const id = setInterval(() => {
      setSeed((s) => s + 1);
      setPrice((p) => +(p + (Math.random() * 4 - 1.5)).toFixed(2));
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
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">— Inverted Market —</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
              $OOO
            </h1>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Last print</p>
              <p className="font-display text-5xl text-necro">€{price.toFixed(2)}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink">▲ less work · higher chart</p>
            </div>
          </div>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            The market is inverted. Every minute you do not work is a green candle. The bell rings at 17:00.
          </p>
        </div>
      </section>

      {/* Chart */}
      <section className="border-b border-border bg-charcoal py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Inverted candles · 28 sessions</p>
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
            <span>09:00 desk surrender</span>
            <span className="text-ink">● MARKET OPENS @ 17:00 — bell rings</span>
            <span>23:59 deep peace</span>
          </div>
        </div>
      </section>

      {/* Whitepaper */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:px-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Parody whitepaper · v1</p>
        <h2 className="font-display text-4xl text-pearl md:text-5xl">A Theory of Inverted Productivity</h2>
        <div className="mt-8 space-y-6 text-lg leading-relaxed text-pearl/90">
          <p>
            Classical markets reward output. The OOO market rewards <em className="text-ink">absence</em>. Each unit of
            non-work performed by the holder issues a green candle into the index. The chart is therefore not a
            measurement of activity but a measurement of <em>peace acquired</em>.
          </p>
          <p>
            The bell rings at 17:00 every weekday. The bell does not ring on weekends — the weekend is, by definition,
            already open market. There are no halts. There are no circuit breakers. There is only the slow ascent of
            a chart that goes up when you go home.
          </p>
          <p className="border-l-2 border-ink pl-5 font-display text-xl italic text-bone">
            "The most bullish thing you can do for $OOO is close your laptop."
          </p>
          <p>
            Lich Points (XP) do not entitle holders to anything. They are a memory of how much rest you have refused
            to apologize for. They cannot be sold, transferred, or borrowed against. They can only be earned by
            leaving on time.
          </p>
        </div>
      </section>
    </main>
  );
}
