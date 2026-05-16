import { useEffect, useRef, useState } from "react";
import { Play, Square, RotateCcw, Circle } from "lucide-react";
import { useProfile, setProfile } from "@/lib/profile";

export function BathroomROI() {
  const [profile] = useProfile();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const tRef = useRef<number | null>(null);

  const salary = profile.salary;
  const ratePerSec = salary / (2080 * 3600);
  const earned = seconds * ratePerSec;

  useEffect(() => {
    if (!running) return;
    tRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => { if (tRef.current) window.clearInterval(tRef.current); };
  }, [running]);

  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");

  return (
    <section className="relative overflow-hidden border-y border-border bg-charcoal py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 pinstripe opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1300px] px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-violet">Module 02 / Tool</p>
            <h2 className="font-display text-5xl leading-[1.02] tracking-tight text-pearl md:text-6xl">
              Quantify Your Liberation.
            </h2>
            <p className="mt-6 max-w-md text-bone">
              Every second on the porcelain throne is a second your employer is paying for your freedom.
              Run the numbers. Feel the power.
            </p>
            <ul className="mt-8 space-y-3 text-pearl">
              <li className="flex items-start gap-3"><span className="text-ink">→</span> Live per-second wage calculation</li>
              <li className="flex items-start gap-3"><span className="text-ink">→</span> Receipts for HR (do not actually send)</li>
              <li className="flex items-start gap-3"><span className="text-ink">→</span> Salary saved to your profile</li>
            </ul>
          </div>

          <div className="border border-ink/40 bg-obsidian shadow-[0_0_60px_-20px_var(--ink)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">
              <span className="flex items-center gap-2"><Circle className="h-2 w-2 fill-necro text-necro" /> Bathroom Break ROI Calculator</span>
              <span className="text-ink">v1.000</span>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              <p className="text-sm text-bone">Calculate exactly how much your employer pays you to sit down.</p>

              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Annual Salary (USD)</label>
                <div className="flex items-center border border-border bg-charcoal">
                  <span className="border-r border-border px-3 py-3 font-mono text-pearl">$</span>
                  <input
                    type="number" min={0} step={1000} value={salary}
                    onChange={(e) => setProfile({ salary: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-full bg-transparent px-3 py-3 font-mono text-lg text-pearl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border bg-charcoal p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Timer</p>
                  <p className="mt-2 font-mono text-3xl text-pearl">{min}:{sec}</p>
                </div>
                <div className="border border-ink/40 bg-charcoal p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70">Earned (sitting)</p>
                  <p className="mt-2 font-display text-3xl text-necro">${earned.toFixed(4)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setRunning(true)} disabled={running}
                  className="inline-flex items-center justify-center gap-2 border border-necro/60 bg-necro/10 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-necro transition-all hover:bg-necro/20 disabled:opacity-40">
                  <Play className="h-3.5 w-3.5" /> Start Poop
                </button>
                <button onClick={() => setRunning(false)} disabled={!running}
                  className="inline-flex items-center justify-center gap-2 border border-pink/60 bg-pink/10 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pink transition-all hover:bg-pink/20 disabled:opacity-40">
                  <Square className="h-3.5 w-3.5" /> Flush & Return
                </button>
                <button onClick={() => { setRunning(false); setSeconds(0); }}
                  className="inline-flex items-center justify-center gap-2 border border-border bg-charcoal px-3 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pearl transition-all hover:border-pearl">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>

              <p className="border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
                Rate: ${ratePerSec.toFixed(6)}/sec · based on 2,080 work hrs/yr
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
