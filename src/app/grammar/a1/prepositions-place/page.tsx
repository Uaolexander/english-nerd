import LessonSchema from "@/components/LessonSchema";
import type { Metadata } from "next";
import PrepositionsOfPlaceLessonClient from "./PrepositionsOfPlaceLessonClient";

export const metadata: Metadata = {
  title: "Prepositions of Place Exercises with Answers for Beginners (A1)",
  description:
    "Learn English prepositions of place: in, on, under, next to, behind, between and more. A1 grammar lesson with pictures, rules and exercises.",
  alternates: { canonical: "/grammar/a1/prepositions-place" },
};

export default function Page() {
  return (
    <>
      <LessonSchema
        title="Prepositions of Place Exercises with Answers for Beginners (A1)"
        description="Learn English prepositions of place: in, on, under, next to, behind, between and more. A1 grammar lesson with pictures, rules and exercises."
        url="https://englishnerd.cc/grammar/a1/prepositions-place"
        level="A1"
      />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PrepositionsOfPlaceLessonClient />
    </main>
    </>
  );
}