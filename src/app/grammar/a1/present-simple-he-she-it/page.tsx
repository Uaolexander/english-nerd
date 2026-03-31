import type { Metadata } from "next";
import PresentSimpleHeSheItLessonClient from "./PresentSimpleHeSheItLessonClient";

export const metadata: Metadata = {
  title: "Present Simple: he/she/it (-s endings) — A1 Grammar — English Nerd",
  description:
    "Learn Present Simple for he, she and it with -s endings and spelling rules. A1 grammar exercises covering works, watches, studies and more.",
  alternates: { canonical: "/grammar/a1/present-simple-he-she-it" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <PresentSimpleHeSheItLessonClient />
    </main>
  );
}