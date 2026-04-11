import LessonSchema from "@/components/LessonSchema";
import type { Metadata } from "next";
import ManyMuchLessonClient from "./ManyMuchLessonClient";

export const metadata: Metadata = {
  title: "Much vs Many Exercises with Answers (A1)",
  description:
    "Learn to use much and many in English. A1 grammar lesson: many apples (countable) vs much water (uncountable). Rules and 4 interactive exercises.",
  alternates: { canonical: "/grammar/a1/much-many-basic" },
};

export default function Page() {
  return (
    <>
      <LessonSchema
        title="Much vs Many Exercises with Answers (A1)"
        description="Learn to use much and many in English. A1 grammar lesson: many apples (countable) vs much water (uncountable). Rules and 4 interactive exercises."
        url="https://englishnerd.cc/grammar/a1/much-many-basic"
        level="A1"
      />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <ManyMuchLessonClient />
    </main>
    </>
  );
}