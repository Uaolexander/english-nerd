import type { Metadata } from "next";
import GrammarTestClient from "./GrammarTestClient";

export const metadata: Metadata = {
  title: "Free English Placement Test (A1–B2) – Grammar Test with Answers",
  description: "Take a free 60-question English grammar placement test and discover your level from A1 to B2. Instant results with answers, level explanation and a downloadable certificate.",
  keywords: ["English grammar test", "grammar placement test", "English level test", "A1 B2 test", "free English test", "English placement test"],
  openGraph: {
    title: "Free English Placement Test (A1–B2) – Grammar Test with Answers",
    description: "Take a free English grammar placement test and discover your level from A1 to B2. Instant results with answers.",
    type: "website",
  },
  alternates: {
    canonical: "/tests/grammar",
  },
};

export default function GrammarTestPage() {
  return <GrammarTestClient />;
}
