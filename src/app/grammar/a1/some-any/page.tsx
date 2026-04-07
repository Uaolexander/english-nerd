import type { Metadata } from "next";
import SomeAnyLessonClient from "./SomeAnyLessonClient";

export const metadata: Metadata = {
  title: "Some vs Any Exercises with Answers (A1)",
  description:
    "Learn to use some and any in English. A1 grammar lesson covering affirmative sentences, questions and negatives with countable and uncountable nouns.",
  alternates: { canonical: "/grammar/a1/some-any" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <SomeAnyLessonClient />
    </main>
  );
}