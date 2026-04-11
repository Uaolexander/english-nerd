import LessonSchema from "@/components/LessonSchema";
import SuperlativeAdjectivesLessonClient from "./SuperlativeAdjectivesLessonClient";

export const metadata = {
  title: "Superlative Adjectives — A2 Grammar — English Nerd",
  description:
    "Learn superlative adjectives in English: the biggest, the most beautiful, the best, the worst. A2 grammar lesson covering spelling rules, irregular superlatives and 4 interactive exercises.",
  alternates: { canonical: "/grammar/a2/superlative-adjectives" },
};

export default function SuperlativeAdjectivesPage() {
  return <SuperlativeAdjectivesLessonClient />;
}
