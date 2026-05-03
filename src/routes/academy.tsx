import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ACADEMY_LESSONS } from "@/lib/ooo";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "OOO Academy — Lich Points" },
      { name: "description", content: "100 lessons of corporate half-truths. Earn Lich Points. Climb from Intern to Office Drone, Senior Slacker, Apprentice, Lich CEO." },
      { property: "og:title", content: "OOO Academy" },
      { property: "og:description", content: "Corporate half-truths, taught with absolute seriousness." },
    ],
  }),
  component: AcademyPage,
});

const RANKS = [
  { name: "Intern", xp: 0 },
  { name: "Office Drone", xp: 100 },
  { name: "Senior Slacker", xp: 300 },
  { name: "Apprentice", xp: 700 },
  { name: "Lich CEO", xp: 1500 },
];

function AcademyPage() {
  return (
    <main className="pt-24">
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">— Curriculum of the void —</p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-8xl text-glow">
            OOO<br /><em>Academy.</em>
          </h1>
          <p className="mt-8 max-w-2xl font-display text-xl italic text-bone md:text-2xl">
            100 lessons. One promise: you will never work harder than you have to. Earn <span className="text-ink">Lich Points</span> as you ascend.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-charcoal py-16">
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">XP Ladder</p>
          <div className="grid gap-3 md:grid-cols-5">
            {RANKS.map((r, i) => (
              <div key={r.name} className="border border-border bg-obsidian p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">Rank 0{i + 1}</p>
                <p className="mt-2 font-display text-2xl text-pearl">{r.name}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-necro">{r.xp}+ Lich pts</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-16 md:px-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Lessons · sample syllabus</p>
        <div className="space-y-5">
          {ACADEMY_LESSONS.map((l, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: (i % 5) * 0.06, duration: 0.6 }}
              className="grid grid-cols-[80px_1fr] gap-6 border border-border bg-charcoal p-6 md:grid-cols-[120px_1fr_180px]"
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">Lesson</p>
                <p className="mt-1 font-display text-3xl text-ink">{String(i + 1).padStart(2, "0")}</p>
              </div>
              <div>
                <p className="font-display text-2xl text-pearl">{l.title}</p>
                <p className="mt-2 text-bone">{l.lesson}</p>
              </div>
              <div className="md:text-right">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">Rank</p>
                <p className="mt-1 font-display text-xl text-pearl">{l.rank}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-necro">+{l.xp} Lich pts</p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
          90 more lessons sealed in the abyss. They unlock when you do not need them.
        </p>
      </section>
    </main>
  );
}
