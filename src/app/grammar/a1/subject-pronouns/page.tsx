import type { Metadata } from "next";
import SubjectPronounsLessonClient from "./SubjectPronounsLessonClient";

export const metadata: Metadata = {
  title: "Subject Pronouns Exercises with Answers for Beginners (A1)",
  description:
    "Learn English subject pronouns: I, you, he, she, it, we, they. A1 grammar lesson with explanations and 4 interactive exercises for beginners.",
  alternates: { canonical: "/grammar/a1/subject-pronouns" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <SubjectPronounsLessonClient />
    </main>
  );
}