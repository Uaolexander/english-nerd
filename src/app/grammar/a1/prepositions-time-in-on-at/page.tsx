import type { Metadata } from "next";
import PrepositionsTimeInOnAtLessonClient from "./PrepositionsTimeInOnAtLessonClient";

export const metadata: Metadata = {
  title: "Prepositions of Time: in, on, at — A1 Grammar — English Nerd",
  description:
    "Learn when to use in, on and at for time in English. A1 grammar lesson: in June, on Monday, at 8 o'clock — rules and 4 interactive exercises.",
  alternates: { canonical: "/grammar/a1/prepositions-time-in-on-at" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PrepositionsTimeInOnAtLessonClient />
    </main>
  );
}