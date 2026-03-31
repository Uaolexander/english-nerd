import type { Metadata } from "next";
import VocabularyTestClient from "./VocabularyTestClient";

export const metadata: Metadata = {
  title: "English Vocabulary Size Test — How Many Words Do You Know? — English Nerd",
  description: "Estimate your English vocabulary size with our free test. Check words across A1 to C2 levels and find out how many English words you know.",
  keywords: ["English vocabulary test", "vocabulary size test", "how many words", "English word test", "vocabulary level"],
  openGraph: {
    title: "English Vocabulary Size Test — English Nerd",
    description: "How many English words do you know? Take the free vocabulary size test and find out.",
    type: "website",
  },
  alternates: {
    canonical: "/tests/vocabulary",
  },
};

export default function VocabularyTestPage() {
  return <VocabularyTestClient />;
}
