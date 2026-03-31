import type { Metadata } from "next";
import PossessiveAdjectivesLessonClient from "./PossessiveAdjectivesLessonClient";

export const metadata: Metadata = {
  title: "Possessive Adjectives (my, your, his...) — A1 Grammar — English Nerd",
  description:
    "Learn English possessive adjectives: my, your, his, her, its, our, their. A1 lesson with rules, examples and 4 exercises to practise ownership.",
  alternates: { canonical: "/grammar/a1/possessive-adjectives" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PossessiveAdjectivesLessonClient />
    </main>
  );
}