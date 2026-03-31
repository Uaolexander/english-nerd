import type { Metadata } from "next";
import ArticlesLessonClient from "./ArticlesLessonClient";

export const metadata: Metadata = {
  title: "Articles: a / an — A1 Grammar — English Nerd",
  description:
    "Master the English articles a and an. Learn when to use each with vowel and consonant sounds. A1 grammar lesson with exercises and spelling rules.",
  alternates: { canonical: "/grammar/a1/articles-a-an" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <ArticlesLessonClient />
    </main>
  );
}