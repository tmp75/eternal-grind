import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CircleCheck, Circle } from "lucide-react";
import { LESSONS, LESSON_TAGS, type LessonTag, type LessonTruth } from "@/lib/academy";
import { useProfile, toggleLesson, rankFor, RANKS } from "@/lib/profile";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "$OOO Academy — 100 Lessons in Looking Busy" },
      { name: "description", content: "100 sarcastic, dark-humor lessons on looking busy and earning while doing nothing. Half-truths, half-lies, all freedom." },
      { property: "og:title", content: "$OOO Academy" },
      { property: "og:description", content: "100 lessons. Half-truths. Half-lies. Zero accountability." },
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
            ← back to /sanctuary
          </Link>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">$OOO ACADEMY · v1.000</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Curriculum 2026 · 100 Lessons</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
            The Academy of<br /><em>Doing Nothing.</em>
          </h1>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            One hundred field-tested techniques for looking busy, sounding important, and getting paid for the
            privilege of breathing. Half-truths. Half-lies. Zero accountability.
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
              {hydrated ? `${profile.xp} XP` : "— XP"} {rank.next ? `· ${rank.next.xp - profile.xp} to ${rank.next.name}` : "· MAX"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {RANKS.map((r) => (
              <div key={r.name} className={`border p-3 ${r.name === rank.current.name ? "border-ink bg-ink/10 shadow-[0_0_20px_var(--ink)]" : "border-border bg-obsidian opacity-60"}`}>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">{r.xp}+ pts</p>
                <p className="mt-1 font-display text-lg text-pearl">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-[1400px] px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-necro md:px-12">
          Lessons mastered: {completed.size} / {LESSONS.length}
        </p>
      </section>

      {/* Search + filters */}
      <section className="sticky top-12 z-20 border-b border-border bg-obsidian/85 py-6 backdrop-blur-md">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search lessons (e.g. 'nap', 'slack', 'bathroom')"
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
              No lessons match. Probably a sign you should take a break.<br /> Touch grass. $OOO.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l, i) => {
              const done = completed.has(l.n);
              return (
                <motion.article
                  key={l.n}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ delay: (i % 9) * 0.04, duration: 0.5 }}
                  className={`group flex h-full flex-col border bg-charcoal p-6 transition-all hover:border-ink hover:shadow-[0_0_30px_color-mix(in_oklab,var(--ink)_30%,transparent)] ${done ? "border-necro/60" : "border-border"}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">Lesson {String(l.n).padStart(3, "0")}</span>
                    <span className={`rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] ${TRUTH_STYLES[l.truth]}`}>{l.truth}</span>
                  </div>
                  <h3 className="font-display text-2xl leading-tight text-pearl">{l.title}</h3>
                  <p className="mt-3 flex-1 text-bone">{l.body}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 font-mono text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-ink">#{l.tag}</span>
                    <span className="text-bone/60">{l.rank} · +{l.xp} XP</span>
                  </div>
                  <button
                    onClick={() => toggleLesson(l.n, l.xp)}
                    className={`mt-3 inline-flex items-center justify-center gap-2 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-all ${
                      done ? "border-necro bg-necro/10 text-necro hover:bg-necro/20" : "border-border bg-obsidian text-pearl hover:border-ink hover:text-ink"
                    }`}
                  >
                    {done ? <CircleCheck className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    {done ? "Mastered" : "Mark as learned"}
                  </button>
                </motion.article>
              );
            })}
          </div>
        )}

        <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
          Showing {filtered.length} of {LESSONS.length} curated lessons. 50 more sealed in the abyss — they unlock when you do not need them.
        </p>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
          Disclaimer: Not career advice. Definitely lifestyle advice. © $OOO Academy.
        </p>
      </section>
    </main>
  );
}
