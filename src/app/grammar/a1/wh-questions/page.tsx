import type { Metadata } from "next";
import WhQuestionsLessonClient from "./Wh-QuestionsLessonClient";

export const metadata: Metadata = {
  title: "Questions (What, Where, When, Why, Who, How) Exercises with Answers for Beginners (A1)",
  description:
    "Learn to ask Wh-questions in English: What, Where, When, Why, Who and How. A1 grammar lesson with 4 exercises and real-life question examples.",
  alternates: { canonical: "/grammar/a1/wh-questions" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <WhQuestionsLessonClient />
    </main>
  );
}