import LessonSchema from "@/components/LessonSchema";
import type { Metadata } from "next";
import HaveHasGotLessonClient from "./HaveHasGotLessonClient";

export const metadata: Metadata = {
  title: "Have Got / Has Got Exercises with Answers (A1 Beginner Grammar)",
  description:
    "Learn have got and has got for possession in English. A1 grammar lesson covering I've got, she's got, negatives and questions with 4 exercises.",
  alternates: { canonical: "/grammar/a1/have-has-got" },
};

export default function Page() {
  return (
    <>
      <LessonSchema
        title="Have Got / Has Got Exercises with Answers (A1 Beginner Grammar)"
        description="Learn have got and has got for possession in English. A1 grammar lesson covering I"
        url="https://englishnerd.cc/grammar/a1/have-has-got"
        level="A1"
      />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <HaveHasGotLessonClient />
    </main>
    </>
  );
}