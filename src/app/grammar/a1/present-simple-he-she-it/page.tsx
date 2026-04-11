import LessonSchema from "@/components/LessonSchema";
import type { Metadata } from "next";
import PresentSimpleHeSheItLessonClient from "./PresentSimpleHeSheItLessonClient";

export const metadata: Metadata = {
  title: "Present Simple (He, She, It) Exercises with Answers (A1)",
  description:
    "Learn Present Simple for he, she and it with -s endings and spelling rules. A1 grammar exercises covering works, watches, studies and more.",
  alternates: { canonical: "/grammar/a1/present-simple-he-she-it" },
};

export default function Page() {
  return (
    <>
      <LessonSchema
        title="Present Simple (He, She, It) Exercises with Answers (A1)"
        description="Learn Present Simple for he, she and it with -s endings and spelling rules. A1 grammar exercises covering works, watches, studies and more."
        url="https://englishnerd.cc/grammar/a1/present-simple-he-she-it"
        level="A1"
      />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PresentSimpleHeSheItLessonClient />
    </main>
    </>
  );
}