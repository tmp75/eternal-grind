import { Marquee } from "@/components/Marquee";
import { TICKER_TOP, TICKER_BOT } from "@/lib/ooo";

export function TickerBand() {
  return (
    <section className="relative border-y border-border bg-charcoal py-3">
      <Marquee items={TICKER_TOP} className="border-b border-border/40 pb-3" itemClassName="text-pearl" />
      <Marquee items={TICKER_BOT} reverse className="pt-3" itemClassName="text-ink" />
    </section>
  );
}
