import type { Metadata } from "next";
import VocabularyTestClient from "./VocabularyTestClient";

export const metadata: Metadata = {
  title: "Vocabulary Size Test (English) – How Many Words Do You Know? Free Online Test",
  description: "Estimate your English vocabulary size with our free online test. Check words across A1 to C2 levels and find out how many English words you know.",
  keywords: ["vocabulary size test", "how many words do you know", "English vocabulary test", "English word test", "vocabulary level", "free vocabulary test"],
  openGraph: {
    title: "Vocabulary Size Test (English) – How Many Words Do You Know?",
    description: "How many English words do you know? Take the free online vocabulary size test and find out.",
    type: "website",
  },
  alternates: {
    canonical: "/tests/vocabulary",
  },
};

export default function VocabularyTestPage() {
  return <VocabularyTestClient />;
}
