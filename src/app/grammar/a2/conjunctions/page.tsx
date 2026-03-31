import ConjunctionsLessonClient from "./ConjunctionsLessonClient";

export const metadata = {
  title: "Conjunctions — A2 Grammar — English Nerd",
  description:
    "Learn English conjunctions: and, but, or, so, because, although, when, while, before, after. A2 grammar lesson covering how to join sentences and express cause, contrast, and time. 4 exercises.",
  alternates: { canonical: "/grammar/a2/conjunctions" },
};

export default function ConjunctionsPage() {
  return <ConjunctionsLessonClient />;
}
