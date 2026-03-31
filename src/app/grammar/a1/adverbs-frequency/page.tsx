import type { Metadata } from "next";
import AdverbFrequencyLessonClient from "./AdverbFrequencyLessonClient";

export const metadata: Metadata = {
  title: "Adverbs of Frequency (always, usually...) — A1 Grammar — English Nerd",
  description:
    "Learn English adverbs of frequency: always, usually, often, sometimes, rarely, never. A1 grammar lesson with word order rules and 4 exercises.",
  alternates: { canonical: "/grammar/a1/adverbs-frequency" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <AdverbFrequencyLessonClient />
    </main>
  );
}
