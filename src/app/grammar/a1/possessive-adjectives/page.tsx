import LessonSchema from "@/components/LessonSchema";
import type { Metadata } from "next";
import PossessiveAdjectivesLessonClient from "./PossessiveAdjectivesLessonClient";

export const metadata: Metadata = {
  title: "Possessive Adjectives Exercises with Answers for Beginners (A1)",
  description:
    "Learn English possessive adjectives: my, your, his, her, its, our, their. A1 lesson with rules, examples and 4 exercises to practise ownership.",
  alternates: { canonical: "/grammar/a1/possessive-adjectives" },
};

export default function Page() {
  return (
    <>
      <LessonSchema
        title="Possessive Adjectives Exercises with Answers for Beginners (A1)"
        description="Learn English possessive adjectives: my, your, his, her, its, our, their. A1 lesson with rules, examples and 4 exercises to practise ownership."
        url="https://englishnerd.cc/grammar/a1/possessive-adjectives"
        level="A1"
      />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PossessiveAdjectivesLessonClient />
    </main>
    </>
  );
}