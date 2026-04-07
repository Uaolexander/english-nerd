import type { Metadata } from "next";
import PresentSimpleIYouWeTheyLessonClient from "./PresentSimpleIYouWeTheyLessonClient";

export const metadata: Metadata = {
  title: "Present Simple Exercises (I, You, We, They) with Answers (A1)",
  description:
    "Learn Present Simple affirmative for I, you, we and they. A1 grammar lesson covering habits, routines and facts with 4 interactive exercises.",
  alternates: { canonical: "/grammar/a1/present-simple-i-you-we-they" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PresentSimpleIYouWeTheyLessonClient />
    </main>
  );
}