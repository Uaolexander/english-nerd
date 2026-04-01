import type { Metadata } from "next";
import RethinkingIntelligenceClient from "./RethinkingIntelligenceClient";

export const metadata: Metadata = {
  title: "Rethinking Intelligence | C1 Reading | English Nerd",
  description:
    "C1 reading exercise. Read what four researchers say about intelligence and cognitive ability. True or false?",
  alternates: { canonical: "/reading/c1/rethinking-intelligence" },
};

export default function RethinkingIntelligencePage() {
  return <RethinkingIntelligenceClient />;
}
