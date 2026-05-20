import { createFileRoute, Link } from "@tanstack/react-router";
import { useProfile, setProfile, removeExternalCalendar, rankFor, RANKS } from "@/lib/profile";
import { LESSONS } from "@/lib/academy";
import { Calendar as CalIcon, AppleIcon, Trash2, Download, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — $INKO" },
      { name: "description", content: "Your rank, Grind Points, salary, and connected calendars. Local-first. Yours." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [profile, hydrated] = useProfile();
  const rank = rankFor(profile.xp);
  const mastered = profile.completedLessons.length;

  function exportProfile() {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `inko-profile-${Date.now()}.json`;
    a.click();
  }
  function resetProfile() {
    if (!confirm("Wipe local profile? Real bookings synced from calendars will be lost too.")) return;
    localStorage.removeItem("inko.profile.v1");
    location.reload();
  }

  return (
    <main className="pt-24">
      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Identity · Local Profile</p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-pearl md:text-7xl text-glow">
            Your<br /><em>Grind Profile.</em>
          </h1>
          <p className="mt-6 max-w-xl text-bone">
            Stored locally on this device. No account, no cloud, no leaks. INKO respects your privacy. INKO also doesn't care.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-6 px-6 py-12 md:grid-cols-2 md:px-12">
        {/* Identity card */}
        <div className="border border-ink/40 bg-charcoal p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Handle</p>
          <input
            value={profile.handle}
            onChange={(e) => setProfile({ handle: e.target.value })}
            className="mt-2 w-full bg-transparent font-display text-3xl text-pearl outline-none"
          />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Annual salary (USD)</p>
          <input
            type="number" min={0} step={1000} value={profile.salary}
            onChange={(e) => setProfile({ salary: Math.max(0, Number(e.target.value) || 0) })}
            className="mt-2 w-full border border-border bg-obsidian px-3 py-2 font-mono text-pearl outline-none focus:border-ink"
          />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
            Grinding since {hydrated && profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : "—"}
          </p>
        </div>

        {/* XP card */}
        <div className="border border-border bg-charcoal p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">Rank</p>
          <p className="mt-1 font-display text-4xl text-pearl text-glow">{rank.current.name}</p>
          <div className="mt-4 h-2 w-full overflow-hidden border border-border bg-obsidian">
            <div className="h-full bg-ink" style={{ width: `${Math.round(rank.progress * 100)}%` }} />
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
            {profile.xp} Grind Points {rank.next ? `· ${rank.next.xp - profile.xp} to ${rank.next.name}` : "· MAX"}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="border border-border bg-obsidian p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">Mastered</p>
              <p className="mt-1 font-display text-2xl text-necro">{mastered} / {LESSONS.length}</p>
            </div>
            <div className="border border-border bg-obsidian p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">Calendars</p>
              <p className="mt-1 font-display text-2xl text-ink">{profile.externalCalendars.length}</p>
            </div>
          </div>
          <Link to="/academy" className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-ink hover:underline">
            Earn more Grind Points →
          </Link>
        </div>

        {/* Rank ladder */}
        <div className="md:col-span-2 border border-border bg-charcoal p-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-violet">Rank ladder</p>
          <div className="grid gap-3 md:grid-cols-6">
            {RANKS.map((r) => (
              <div key={r.name} className={`border p-4 ${r.name === rank.current.name ? "border-ink bg-ink/10 shadow-[0_0_20px_var(--ink)]" : "border-border bg-obsidian opacity-60"}`}>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/60">{r.xp}+ pts</p>
                <p className="mt-1 font-display text-lg leading-tight text-pearl">{r.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connected calendars */}
        <div className="md:col-span-2 border border-border bg-charcoal">
          <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
            <span>Connected calendars</span>
            <Link to="/calendar" className="text-ink hover:underline">manage in /calendar →</Link>
          </div>
          {profile.externalCalendars.length === 0 ? (
            <p className="p-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
              No calendars connected. Head to /calendar to connect Google or Apple.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {profile.externalCalendars.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 font-mono text-[11px] text-pearl">
                  <span className="flex items-center gap-3 truncate">
                    {c.provider === "apple" ? <AppleIcon className="h-4 w-4 text-ink" /> : <CalIcon className="h-4 w-4 text-ink" />}
                    <span className="truncate">{c.name}</span>
                  </span>
                  <button onClick={() => removeExternalCalendar(c.id)} className="border border-border px-2 py-1 hover:border-pink hover:text-pink" title="Remove">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Danger / Export */}
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button onClick={exportProfile} className="inline-flex items-center gap-2 border border-border bg-charcoal px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl hover:border-ink hover:text-ink">
            <Download className="h-3.5 w-3.5" /> Export profile (JSON)
          </button>
          <button onClick={resetProfile} className="inline-flex items-center gap-2 border border-pink/50 bg-pink/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pink hover:bg-pink/20">
            <RotateCcw className="h-3.5 w-3.5" /> Reset profile
          </button>
        </div>
      </section>
    </main>
  );
}
