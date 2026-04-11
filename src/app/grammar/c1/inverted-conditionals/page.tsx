import LessonSchema from "@/components/LessonSchema";
import InvertedConditionalsLessonClient from "./InvertedConditionalsLessonClient";

export const metadata = {
  title: "Inverted Conditionals — C1 Grammar — English Nerd",
  description:
    "Learn inverted conditionals in English: Were I to go, Had she known, Should you need help — formal inversion instead of if-clauses. C1 grammar with 4 exercises.",
  alternates: { canonical: "/grammar/c1/inverted-conditionals" },
};

export default function InvertedConditionalsPage() {
  return <InvertedConditionalsLessonClient />;
}
