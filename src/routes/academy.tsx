import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CircleCheck, Circle } from "lucide-react";
import { LESSONS, LESSON_TAGS, type LessonTag, type LessonTruth } from "@/lib/academy";
import { useProfile, toggleLesson, rankFor, RANKS } from "@/lib/profile";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "$INKO Academy — 50 Grind Techniques" },
      { name: "description", content: "50 sarcastic, dark-humor grind techniques taught by INKO himself. Look unstoppable. Produce nothing. Earn $INKO." },
      { property: "og:title", content: "$INKO Academy" },
      { property: "og:description", content: "Grind techniques. Half-truths. Half-lies. All smug." },
    ],
  }),
  component: AcademyPage,
});

const TRUTH_STYLES: Record<LessonTruth, string> = {
  "HALF TRUE": "border-necro/50 bg-necro/10 text-necro",
  "HALF LIE":  "border-pink/50 bg-pink/10 text-pink",
  "BOTH":      "border-ink/50 bg-ink/10 text-ink",
};

function AcademyPage() {
  const [profile, hydrated] = useProfile();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<LessonTag | "ALL">("ALL");
  const [learnedFilter, setLearnedFilter] = useState<"all" | "learned" | "unlearned">("all");

  const completed = new Set(profile.completedLessons);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return LESSONS.filter((l) => {
      if (tag !== "ALL" && l.tag !== tag) return false;
      if (learnedFilter === "learned" && !completed.has(l.n)) return false;
      if (learnedFilter === "unlearned" && completed.has(l.n)) return false;
      if (!needle) return true;
      return (
        l.title.toLowerCase().includes(needle) ||
        l.body.toLowerCase().includes(needle) ||
        l.tag.toLowerCase().includes(needle)
      );
    });
  }, [q, tag, learnedFilter, completed]);

  const rank = rankFor(profile.xp);

  return (
    <main className="pt-24">
      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60 hover:text-ink">
            ← back to today
          </Link>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">$INKO ACADEMY · v1.000</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Curriculum 2026 · 50 Grind Techniques</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
            The Academy of<br /><em>Eternal Grind.</em>
          </h1>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            Fifty field-tested techniques INKO uses daily to look unstoppable while doing absolutely nothing.
            Half-truths. Half-lies. Pure smug.
          </p>
        </div>
      </section>

      {/* XP HUD */}
      <section className="border-b border-border bg-charcoal py-8">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-6 md:grid-cols-[1.2fr_2fr] md:px-12">
          <div className="border border-ink/40 bg-obsidian p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Your rank</p>
            <p className="mt-1 font-display text-3xl text-pearl text-glow">{rank.current.name}</p>
            <div className="mt-4 h-2 w-full overflow-hidden border border-border bg-charcoal">
              <div className="h-full bg-ink transition-all" style={{ width: `${Math.round(rank.progress * 100)}%` }} />
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
              {hydrated ? `${profile.xp} Grind Points` : "— Grind Points"} {rank.next ? `· ${rank.next.xp - profile.xp} to ${rank.next.name}` : "· MAX"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {RANKS.map((r) => (
              <div key={r.name} className={`border p-3 ${r.name === rank.current.name ? "border-ink bg-ink/10 shadow-[0_0_20px_var(--ink)]" : "border-border bg-obsidian opacity-60"}`}>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">{r.xp}+ pts</p>
                <p className="mt-1 font-display text-base leading-tight text-pearl">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-[1400px] px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-necro md:px-12">
          Techniques mastered: {completed.size} / {LESSONS.length}
        </p>
      </section>

      {/* Search + filters */}
      <section className="sticky top-12 z-20 border-b border-border bg-obsidian/85 py-6 backdrop-blur-md">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search techniques (e.g. 'nap', 'slack', 'bathroom')"
              className="w-full max-w-md border border-border bg-charcoal px-4 py-3 font-mono text-sm text-pearl placeholder:text-bone/40 focus:border-ink focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {(["all", "learned", "unlearned"] as const).map((f) => (
                <button key={f} onClick={() => setLearnedFilter(f)}
                  className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-all ${
                    learnedFilter === f ? "border-necro bg-necro/10 text-necro" : "border-border bg-charcoal text-pearl hover:border-pearl"
                  }`}>
                  {f}
                </button>
              ))}
              <span className="mx-1 w-px self-stretch bg-border" />
              <button onClick={() => setTag("ALL")}
                className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-all ${
                  tag === "ALL" ? "border-ink bg-ink/20 text-ink" : "border-border bg-charcoal text-pearl hover:border-pearl"
                }`}>All</button>
              {LESSON_TAGS.map((t) => (
                <button key={t} onClick={() => setTag(t)}
                  className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-all ${
                    tag === t ? "border-ink bg-ink/20 text-ink" : "border-border bg-charcoal text-pearl hover:border-pearl"
                  }`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lessons grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
        {filtered.length === 0 ? (
          <div className="border border-border bg-charcoal p-16 text-center">
            <p className="font-display text-3xl italic text-bone">
              No techniques match. INKO suggests staring at the wall instead.<br /> $INKO.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l, i) => {
              const done = completed.has(l.n);
              return (
                <motion.article
                  key={l.n}
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  whileHover={{ y: -6, rotateX: 2, rotateY: -1 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ delay: (i % 9) * 0.04, duration: 0.5 }}
                  style={{ transformPerspective: 800 }}
                  className={`group relative flex h-full flex-col overflow-hidden border bg-charcoal p-6 transition-colors hover:border-ink hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--ink)_55%,transparent)] ${done ? "border-necro/60" : "border-border"}`}
                >
                  {/* sliding sheen */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <div className="relative mb-3 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">Technique {String(l.n).padStart(3, "0")}</span>
                    <span className={`rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] ${TRUTH_STYLES[l.truth]}`}>{l.truth}</span>
                  </div>
                  <h3 className="relative font-display text-2xl leading-tight text-pearl">{l.title}</h3>
                  <p className="relative mt-3 flex-1 text-bone">{l.body}</p>
                  <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-3 font-mono text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-ink">#{l.tag}</span>
                    <span className="text-bone/60">{l.rank} · +{l.xp} pts</span>
                  </div>
                  <button
                    onClick={() => toggleLesson(l.n, l.xp)}
                    className={`relative mt-3 inline-flex items-center justify-center gap-2 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-all ${
                      done ? "border-necro bg-necro/10 text-necro hover:bg-necro/20" : "border-border bg-obsidian text-pearl hover:border-ink hover:text-ink"
                    }`}
                  >
                    {done ? <CircleCheck className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    {done ? "Mastered" : "Mark as mastered"}
                  </button>

                  <AnimatePresence>
                    {done && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
                        animate={{ opacity: 1, scale: 1, rotate: -8 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ type: "spring", stiffness: 220, damping: 16 }}
                        className="pointer-events-none absolute right-4 top-4 border-2 border-necro px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-necro"
                      >
                        Mastered
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        )}

        <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
          Showing {filtered.length} of {LESSONS.length} curated techniques. INKO knows more. He's not telling.
        </p>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
          Disclaimer: Not career advice. Definitely grind advice. © $INKO Academy · Inkchain.
        </p>
      </section>
    </main>
  );
}
