import LessonSchema from "@/components/LessonSchema";
import ExtrapositionLessonClient from "./ExtrapositionLessonClient";

export const metadata = {
  title: "Extraposition — C1 Grammar — English Nerd",
  description:
    "Learn extraposition in English: It is + adjective + that/to-inf, It seems/appears/turns out that, postponed subject clauses, extraposition with gerunds and infinitives. C1 grammar. 4 exercises.",
  alternates: { canonical: "/grammar/c1/extraposition" },
};

export default function ExtrapositionPage() {
  return <ExtrapositionLessonClient />;
}
