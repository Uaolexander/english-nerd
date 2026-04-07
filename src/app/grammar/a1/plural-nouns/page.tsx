import type { Metadata } from "next";
import PluralNounsLessonClient from "./PluralNounsLessonClient";

export const metadata: Metadata = {
  title: "Plural Nouns Exercises with Answers for Beginners (A1)",
  description:
    "Learn to form English plural nouns: regular -s endings, -es rules, irregular plurals and uncountable nouns. A1 grammar exercises with instant feedback.",
  alternates: { canonical: "/grammar/a1/plural-nouns" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PluralNounsLessonClient />
    </main>
  );
}