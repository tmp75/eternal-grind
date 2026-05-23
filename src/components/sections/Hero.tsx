import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { INKCHAIN_URL } from "@/lib/ooo";
import { useProfile } from "@/lib/profile";
import { LESSONS } from "@/lib/academy";
import inkoMascot from "@/assets/inko-mascot.png";

const WORDS = ["ETERNAL", "GRIND."];

function formatGrindBell(now: Date) {
  // Counts up since 09:00 — the grind never stops.
  const target = new Date(now);
  target.setHours(9, 0, 0, 0);
  if (now < target) target.setDate(target.getDate() - 1);
  const diff = Math.max(0, now.getTime() - target.getTime());
  const h = Math.floor(diff / 3_600_000).toString().padStart(2, "0");
  const m = Math.floor((diff % 3_600_000) / 60_000).toString().padStart(2, "0");
  const s = Math.floor((diff % 60_000) / 1000).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function Hero() {
  const [grinding, setGrinding] = useState<string | null>(null);
  const [profile, hydrated] = useProfile();
  useEffect(() => {
    setGrinding(formatGrindBell(new Date()));
    const id = setInterval(() => setGrinding(formatGrindBell(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  const masteredLabel = hydrated
    ? `Enter the Academy (${profile.completedLessons.length} / ${LESSONS.length} grind techniques)`
    : "Enter the Academy (grind techniques)";

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
        <span className="text-necro">●</span> AUTO-REPLY: IN DEEP GRIND <br />
        <span className="text-ink">INKCHAIN · $INKO</span>
      </div>
      <div className="pointer-events-none absolute right-6 top-20 text-right font-mono text-[10px] uppercase tracking-[0.4em] text-bone/70 md:right-12">
        Grinding for <span className="text-ink">{grinding ?? "--:--:--"}</span> <br />
        <span className="text-bone/50">GRIND BELL @ 09:00</span>
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <div className="relative mx-auto mb-6 flex h-72 w-72 items-center justify-center md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]">
          {/* Outer glow halo */}
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(123,44,255,0.35),transparent_70%)] blur-3xl" aria-hidden />
          {/* Inner bright glow */}
          <div className="pointer-events-none absolute -inset-4 rounded-full bg-[radial-gradient(circle_at_center,rgba(181,123,255,0.25),transparent_60%)] blur-2xl" aria-hidden />
          <motion.img
            src={inkoMascot}
            alt="INKO — the smug grinder"
            loading="eager"
            decoding="async"
            initial={{ opacity: 0, y: 30, scale: 0.92, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: [0, -12, 0], scale: 1, filter: "blur(0px)" }}
            transition={{
              opacity: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "loop" },
            }}
            className="relative h-full w-full max-w-full select-none object-contain drop-shadow-[0_24px_80px_rgba(123,44,255,0.55)]"
            draggable={false}
          />
        </div>
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.45em] text-violet md:text-[11px]">
          The smug meme that does nothing — and somehow stays on top
        </p>

        <h1 className="font-display text-[16vw] font-semibold leading-[0.85] tracking-tight md:text-[12vw]">
          {WORDS.map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.4 + i * 0.18, duration: 1, ease: [0.16, 1, 0.3, 1] }}
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
          className="mx-auto mt-10 max-w-2xl font-display text-2xl italic text-bone md:text-3xl"
        >
          INKO grinds eternally. INKO does nothing. <br className="hidden md:block" />
          The peasants are taking notes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={INKCHAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink/60 bg-ink/15 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl transition-all hover:border-ink hover:bg-ink/25 hover:shadow-[0_0_30px_var(--ink)]"
          >
            Buy $INKO on Inkchain →
          </a>
          <Link to="/academy" className="border border-border bg-charcoal/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl transition-all hover:border-pearl">
            {masteredLabel}
          </Link>
          <Link to="/calendar" className="border border-border bg-charcoal/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl transition-all hover:border-pearl">
            Open the grind calendar
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-[0.3em]"
        >
          <div className="border border-border bg-charcoal/40 px-3 py-3">
            <p className="text-bone/60">Ticker</p>
            <p className="mt-1 text-pearl">$INKO</p>
          </div>
          <div className="border border-border bg-charcoal/40 px-3 py-3">
            <p className="text-bone/60">Supply</p>
            <p className="mt-1 text-pearl">1B</p>
          </div>
          <div className="border border-border bg-charcoal/40 px-3 py-3">
            <p className="text-bone/60">Chain</p>
            <p className="mt-1 text-pearl">Inkchain</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/70"
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
