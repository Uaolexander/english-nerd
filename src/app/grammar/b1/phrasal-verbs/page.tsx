import LessonSchema from "@/components/LessonSchema";
import PhrasalVerbsLessonClient from "./PhrasalVerbsLessonClient";

export const metadata = {
  title: "Phrasal Verbs — B1 Grammar Exercises — English Nerd",
  description:
    "Practice the most common B1 phrasal verbs in English: give up, look after, find out, put off and more. B1 grammar lesson with exercises on meaning and usage in context. 4 exercises.",
  alternates: { canonical: "/grammar/b1/phrasal-verbs" },
};

export default function PhrasalVerbsPage() {
  return <PhrasalVerbsLessonClient />;
}
