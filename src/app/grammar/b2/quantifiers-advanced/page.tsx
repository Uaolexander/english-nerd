import LessonSchema from "@/components/LessonSchema";
import QuantifiersAdvancedLessonClient from "./QuantifiersAdvancedLessonClient";

export const metadata = {
  title: "Quantifiers: Advanced — B2 Grammar — English Nerd",
  description:
    "Learn advanced quantifiers in English: each, every, either, neither, both, all, none, every vs each. B2 grammar lesson with precise usage and common mistakes. 4 exercises.",
  alternates: { canonical: "/grammar/b2/quantifiers-advanced" },
};

export default function QuantifiersAdvancedPage() {
  return <QuantifiersAdvancedLessonClient />;
}
