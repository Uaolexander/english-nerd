import LessonSchema from "@/components/LessonSchema";
import type { Metadata } from "next";
import PresentSimpleNegativeLessonClient from "./PresentSimpleNegativeLessonClient";

export const metadata: Metadata = {
  title: "Present Simple Negative (Don't / Doesn't) Exercises with Answers for Beginners (A1)",
  description:
    "Learn to form Present Simple negatives with don't and doesn't. A1 grammar lesson with rules, examples and 4 exercises for all subject pronouns.",
  alternates: { canonical: "/grammar/a1/present-simple-negative" },
};

export default function Page() {
  return (
    <>
      <LessonSchema
        title="Present Simple Negative (Don"
        description="Learn to form Present Simple negatives with don"
        url="https://englishnerd.cc/grammar/a1/present-simple-negative"
        level="A1"
      />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PresentSimpleNegativeLessonClient />
    </main>
    </>
  );
}