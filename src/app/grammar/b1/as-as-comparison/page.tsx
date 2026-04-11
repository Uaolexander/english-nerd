import LessonSchema from "@/components/LessonSchema";
import AsAsComparisonLessonClient from "./AsAsComparisonLessonClient";

export const metadata = {
  title: "As … as Comparisons — B1 Grammar Exercises — English Nerd",
  description:
    "Practice as…as comparisons in English: as tall as, not as fast as, twice as big as. B1 grammar lesson with exercises on equal and unequal comparisons. 4 exercises.",
  alternates: { canonical: "/grammar/b1/as-as-comparison" },
};

export default function AsAsComparisonPage() {
  return <AsAsComparisonLessonClient />;
}
