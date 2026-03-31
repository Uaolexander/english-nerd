import type { Metadata } from "next";
import PresentSimpleNegativeLessonClient from "./PresentSimpleNegativeLessonClient";

export const metadata: Metadata = {
  title: "Present Simple: Negative (don't / doesn't) — A1 Grammar — English Nerd",
  description:
    "Learn to form Present Simple negatives with don't and doesn't. A1 grammar lesson with rules, examples and 4 exercises for all subject pronouns.",
  alternates: { canonical: "/grammar/a1/present-simple-negative" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PresentSimpleNegativeLessonClient />
    </main>
  );
}