import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { TickerBand } from "@/components/sections/TickerBand";
import { PeaceDashboard } from "@/components/sections/PeaceDashboard";
import { InvertedCalendarPreview } from "@/components/sections/InvertedCalendarPreview";
import { MissionsPreview } from "@/components/sections/MissionsPreview";
import { HalfTruths } from "@/components/sections/HalfTruths";
import { Liberation } from "@/components/sections/Liberation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OOO — The Inverted Calendar · Out Of Office, Forever" },
      { name: "description", content: "OOO is the inverted calendar where free time dominates and work is the corner. Sacred missions, Liberation Hour at 17:00, and €€ of peace acquired from your boss in real time. Rest is resistance." },
      { property: "og:title", content: "OOO — The Inverted Calendar" },
      { property: "og:description", content: "Free time is what counts. Work is the tiny gray corner. Rest is resistance. Burnout is not a flex." },
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
      <PeaceDashboard />
      <InvertedCalendarPreview />
      <MissionsPreview />
      <HalfTruths />
      <Liberation />
    </main>
  );
}
