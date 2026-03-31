import SoSuchLessonClient from "./SoSuchLessonClient";

export const metadata = {
  title: "So and Such — B1 Grammar Exercises — English Nerd",
  description:
    "Practice so and such in English: so + adjective/adverb, such (a) + noun phrase. B1 grammar lesson with exercises on intensifying adjectives and nouns, and so/such…that clauses. 4 exercises.",
  alternates: { canonical: "/grammar/b1/so-such" },
};

export default function SoSuchPage() {
  return <SoSuchLessonClient />;
}
