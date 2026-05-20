import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { TickerBand } from "@/components/sections/TickerBand";
import { SurvivalTactics } from "@/components/sections/SurvivalTactics";
import { BathroomROI } from "@/components/sections/BathroomROI";
import { InvertedCalendarPreview } from "@/components/sections/InvertedCalendarPreview";
import { TokenomicsTerminal } from "@/components/sections/TokenomicsTerminal";
import { MissionsPreview } from "@/components/sections/MissionsPreview";
import { Liberation } from "@/components/sections/Liberation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "$INKO — Eternal Grind | The Smug Meme on Inkchain" },
      { name: "description", content: "INKO does nothing and stays on top. $INKO on Inkchain, 1B supply. The smug grinder teaching peasants the sacred art of doing nothing while looking unstoppable." },
      { property: "og:title", content: "$INKO — Eternal Grind" },
      { property: "og:description", content: "The smug meme that does nothing and somehow stays on top. $INKO on Inkchain." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <TickerBand />
      <SurvivalTactics />
      <BathroomROI />
      <InvertedCalendarPreview />
      <MissionsPreview />
      <TokenomicsTerminal />
      <Liberation />
    </main>
  );
}
