import type { Metadata } from "next";
import EconomicChallengesClient from "./EconomicChallengesClient";

export const metadata: Metadata = {
  title: "Economic Challenges — C1 Vocabulary — English Nerd",
  description:
    "C1 vocabulary exercise: two economists debate major economic issues. Read the dialogue and choose the correct word in each gap. 10 questions, advanced level.",
  alternates: { canonical: "/vocabulary/c1/economic-challenges" },
};

export default function EconomicChallengesPage() {
  return <EconomicChallengesClient />;
}
