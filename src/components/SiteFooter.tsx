import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-charcoal pinstripe">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">— Auto-reply —</p>
            <p className="mt-4 font-display text-2xl text-pearl">Out of Office</p>
            <p className="mt-1 text-sm text-bone">Returning: never · Available: in spirit</p>
            <p className="text-sm text-bone">Liberation Hour · 17:00 daily</p>
            <p className="mt-3 italic text-bone/70">"Rest is resistance. Burnout is not a flex."</p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">Departments</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/calendar" className="text-pearl hover:text-ink transition-colors">→ Inverted Calendar</Link></li>
              <li><Link to="/missions" className="text-pearl hover:text-ink transition-colors">→ Sacred Missions</Link></li>
              <li><Link to="/academy" className="text-pearl hover:text-ink transition-colors">→ OOO Academy</Link></li>
              <li><Link to="/ticker" className="text-pearl hover:text-ink transition-colors">→ $OOO Ticker</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">Disclaimer</p>
            <p className="mt-4 text-[11px] leading-relaxed text-bone/60">
              OOO is a satire. The doctor's note is parody. Lich Points have no monetary value. The market is
              imaginary. The rest, however, is real. Take it. By scrolling you agree to leave on time.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border/40 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50 md:flex-row md:items-center">
          <span>© ∞ OOO — All hours reclaimed.</span>
          <span>The Inverted Calendar // Out of Office</span>
        </div>
      </div>
    </footer>
  );
}
