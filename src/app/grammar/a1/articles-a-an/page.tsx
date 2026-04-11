import LessonSchema from "@/components/LessonSchema";
import type { Metadata } from "next";
import ArticlesLessonClient from "./ArticlesLessonClient";

export const metadata: Metadata = {
  title: "Articles (A, An) Exercises with Answers for Beginners (A1)",
  description:
    "Master the English articles a and an. Learn when to use each with vowel and consonant sounds. A1 grammar lesson with exercises and spelling rules.",
  alternates: { canonical: "/grammar/a1/articles-a-an" },
};

export default function Page() {
  return (
    <>
      <LessonSchema
        title="Articles (A, An) Exercises with Answers for Beginners (A1)"
        description="Master the English articles a and an. Learn when to use each with vowel and consonant sounds. A1 grammar lesson with exercises and spelling rules."
        url="https://englishnerd.cc/grammar/a1/articles-a-an"
        level="A1"
      />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <ArticlesLessonClient />
    </main>
    </>
  );
}