import type { Metadata } from "next";
import ToBeLessonClient from "./ToBeLessonClient";

export const metadata: Metadata = {
  title: "Verb to Be (Am, Is, Are) Exercises for Beginners with Answers (A1)",
  description:
    "Learn to use am, is and are in English. A1 grammar lesson with 4 exercises: affirmative, negative, questions and short answers. Free interactive practice.",
  alternates: { canonical: "/grammar/a1/to-be-am-is-are" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <ToBeLessonClient />
    </main>
  );
}