import type { Metadata } from "next";
import PresentSimpleQuestionsLessonClient from "./PresentSimpleQuestionsLessonClient";

export const metadata: Metadata = {
  title: "Present Simple: Questions (Do/Does) — A1 Grammar — English Nerd",
  description:
    "Learn to ask Present Simple questions with Do and Does. A1 grammar exercises covering yes/no questions, short answers and common mistakes.",
  alternates: { canonical: "/grammar/a1/present-simple-questions" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PresentSimpleQuestionsLessonClient />
    </main>
  );
}