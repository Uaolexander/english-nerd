import type { Metadata } from "next";
import ThisThatTheseThoseLessonClient from "./ThisThatTheseThoseLessonClient";

export const metadata: Metadata = {
  title: "This, That, These, Those Exercises with Answers for Beginners (A1)",
  description:
    "Learn to use this, that, these and those in English. Near and far, singular and plural demonstratives explained with A1 exercises and examples.",
  alternates: { canonical: "/grammar/a1/this-that-these-those" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <ThisThatTheseThoseLessonClient />
    </main>
  );
}