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
      { title: "$OOO — Out Of Office | The Anti-Work Meme on Solana" },
      { name: "description", content: "A digital sanctuary for the burnt-out corporate soul. $OOO on Solana via Pump.fun. The only asset that appreciates when you're not working." },
      { property: "og:title", content: "$OOO — Out Of Office" },
      { property: "og:description", content: "Mint your freedom. The only asset that appreciates when you're not working." },
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
