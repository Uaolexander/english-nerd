import type { Metadata } from "next";
import HaveHasGotLessonClient from "./HaveHasGotLessonClient";

export const metadata: Metadata = {
  title: "Have got / Has got (Possession) — A1 Grammar — English Nerd",
  description:
    "Learn have got and has got for possession in English. A1 grammar lesson covering I've got, she's got, negatives and questions with 4 exercises.",
  alternates: { canonical: "/grammar/a1/have-has-got" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <HaveHasGotLessonClient />
    </main>
  );
}