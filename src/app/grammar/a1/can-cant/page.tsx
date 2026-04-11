import LessonSchema from "@/components/LessonSchema";
import type { Metadata } from "next";
import CanCantLessonClient from "./CanCantLessonClient";

export const metadata: Metadata = {
  title: "Can / Can't Exercises with Answers for Beginners (A1)",
  description:
    "Learn to use can and can't in English for ability and permission. A1 grammar lesson with affirmative, negative and question forms plus exercises.",
  alternates: { canonical: "/grammar/a1/can-cant" },
};

export default function Page() {
  return (
    <>
      <LessonSchema
        title="Can / Can"
        description="Learn to use can and can"
        url="https://englishnerd.cc/grammar/a1/can-cant"
        level="A1"
      />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <CanCantLessonClient />
    </main>
    </>
  );
}