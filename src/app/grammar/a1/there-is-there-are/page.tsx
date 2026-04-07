import type { Metadata } from "next";
import ThereIsThereAreLessonClient from "./ThereIsThereAreLessonClient";

export const metadata: Metadata = {
  title: "There is / There are Exercises with Answers for Beginners (A1)",
  description:
    "Learn to use there is and there are in English. A1 grammar lesson covering affirmative, negative and questions with 4 interactive exercises.",
  alternates: { canonical: "/grammar/a1/there-is-there-are" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <ThereIsThereAreLessonClient />
    </main>
  );
}