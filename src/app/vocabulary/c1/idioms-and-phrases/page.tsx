import type { Metadata } from "next";
import IdiomsPhrasesClient from "./IdiomsPhrasesClient";

export const metadata: Metadata = {
  title: "Idioms & Phrases — C1 Vocabulary — English Nerd",
  description:
    "C1 vocabulary exercises about idioms and phrases. Three activities: multiple choice, choose the phrase, and fill in the blanks. Advanced level.",
  alternates: { canonical: "/vocabulary/c1/idioms-and-phrases" },
};

export default function IdiomsPhrasesPage() {
  return <IdiomsPhrasesClient />;
}
