import type { Metadata } from "next";
import CountableUncountableLessonClient from "./CountableUncountableLessonClient";

export const metadata: Metadata = {
  title: "Countable and Uncountable Nouns Exercises with Answers (A1)",
  description:
    "Learn the difference between countable and uncountable nouns in English. A1 grammar lesson with examples like apple/water and 4 practice exercises.",
  alternates: { canonical: "/grammar/a1/countable-uncountable" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <CountableUncountableLessonClient />
    </main>
  );
}