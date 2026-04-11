import LessonSchema from "@/components/LessonSchema";
import ComplexNounPhrasesLessonClient from "./ComplexNounPhrasesLessonClient";

export const metadata = {
  title: "Complex Noun Phrases — C1 Grammar — English Nerd",
  description:
    "Learn complex noun phrases in English: pre- and post-modification, noun + of-phrase, apposition, noun + to-infinitive, noun + that-clause, stacked premodifiers. C1 grammar for academic writing. 4 exercises.",
  alternates: { canonical: "/grammar/c1/complex-noun-phrases" },
};

export default function ComplexNounPhrasesPage() {
  return <ComplexNounPhrasesLessonClient />;
}
