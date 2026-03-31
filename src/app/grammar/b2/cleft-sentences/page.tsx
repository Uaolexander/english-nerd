import CleftSentencesLessonClient from "./CleftSentencesLessonClient";

export const metadata = {
  title: "Cleft Sentences — B2 Grammar — English Nerd",
  description:
    "Learn cleft sentences in English: It-clefts (It was John who called) and wh-clefts (What I need is time). B2 grammar for emphasis and focus. 4 exercises.",
  alternates: { canonical: "/grammar/b2/cleft-sentences" },
};

export default function CleftSentencesPage() {
  return <CleftSentencesLessonClient />;
}
