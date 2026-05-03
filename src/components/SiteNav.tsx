import { Link } from "@tanstack/react-router";

const ITEMS = [
  { to: "/", label: "Today", exact: true },
  { to: "/calendar", label: "Calendar" },
  { to: "/missions", label: "Missions" },
  { to: "/academy", label: "Academy" },
  { to: "/ticker", label: "$OOO" },
] as const;

export function SiteNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-border/40 bg-obsidian/60 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-pearl/90">
          <span className="inline-block h-2 w-2 rounded-full bg-ink shadow-[0_0_12px_var(--ink)]" />
          OOO <span className="text-bone/50">// Inverted Calendar</span>
        </Link>
        <nav className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] md:gap-6">
          {ITEMS.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={"exact" in it && it.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-ink" }}
              className="text-pearl/80 hover:text-ink transition-colors"
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
