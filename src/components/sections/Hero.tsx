import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WORK_END_HOUR } from "@/lib/ooo";

const WORDS = ["OUT", "OF", "OFFICE"];

function useCountdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = new Date(now);
  target.setHours(WORK_END_HOUR, 0, 0, 0);
  if (now > target) target.setDate(target.getDate() + 1);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000).toString().padStart(2, "0");
  const m = Math.floor((diff % 3_600_000) / 60_000).toString().padStart(2, "0");
  const s = Math.floor((diff % 60_000) / 1000).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function Hero() {
  const countdown = useCountdown();
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full" aria-hidden>
        <defs>
          <filter id="goo">
            <feGaussianBlur stdDeviation="40" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7B2CFF" stopOpacity="1" />
            <stop offset="60%" stopColor="#7B2CFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7B2CFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g filter="url(#goo)" className="animate-blob origin-center">
          <circle cx="50%" cy="50%" r="240" fill="url(#g1)" />
          <circle cx="42%" cy="55%" r="180" fill="url(#g1)" />
          <circle cx="58%" cy="48%" r="200" fill="url(#g1)" />
        </g>
      </svg>

      <div className="pointer-events-none absolute left-6 top-20 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/70 md:left-12">
        OOO // Inverted Calendar <br /> <span className="text-ink">EST. ∞</span>
      </div>
      <div className="pointer-events-none absolute right-6 top-20 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/70 md:right-12">
        Liberation in <span className="text-ink">{countdown}</span> <br />
        <span className="text-bone/50">17:00 — Market Open</span>
      </div>

      <div className="relative z-10 px-4 text-center">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">
          The Inverted Calendar
        </p>

        <h1 className="font-display text-[18vw] font-semibold leading-[0.85] tracking-tight md:text-[14vw]">
          {WORDS.map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.15 + i * 0.18, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block text-pearl text-glow"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-10 font-display text-2xl italic text-bone md:text-3xl"
        >
          "Free time is what counts. Work is the corner."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/calendar" className="border border-ink/60 bg-ink/15 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl transition-all hover:border-ink hover:bg-ink/25 hover:shadow-[0_0_30px_var(--ink)]">
            Open the calendar →
          </Link>
          <Link to="/missions" className="border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl transition-all hover:border-pearl">
            Sacred missions
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-14 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/70"
        >
          <span className="h-px w-10 bg-bone/40" />
          Scroll
          <span className="animate-bob inline-block">↓</span>
          <span className="h-px w-10 bg-bone/40" />
        </motion.div>
      </div>
    </section>
  );
}
