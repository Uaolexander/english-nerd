import type { Metadata } from "next";
import GrammarTestClient from "./GrammarTestClient";

export const metadata: Metadata = {
  title: "English Grammar Placement Test — Find Your Level — English Nerd",
  description: "Take a free 60-question English grammar placement test and discover your level from A1 to C1. Instant results, level explanation and a downloadable certificate.",
  keywords: ["English grammar test", "grammar placement test", "English level test", "A1 B1 C1 test", "free English test"],
  openGraph: {
    title: "English Grammar Placement Test — English Nerd",
    description: "Discover your English grammar level with 60 questions. Get instant results and a free certificate.",
    type: "website",
  },
  alternates: {
    canonical: "/tests/grammar",
  },
};

export default function GrammarTestPage() {
  return <GrammarTestClient />;
}
