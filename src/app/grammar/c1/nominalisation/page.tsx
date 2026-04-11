import LessonSchema from "@/components/LessonSchema";
import NominalisationLessonClient from "./NominalisationLessonClient";

export const metadata = {
  title: "Nominalisation — C1 Grammar — English Nerd",
  description:
    "Learn nominalisation in English: turning verbs and adjectives into noun phrases. The increase in prices, a reduction in costs, the decision to leave. C1 grammar for academic and formal writing. 4 exercises.",
  alternates: { canonical: "/grammar/c1/nominalisation" },
};

export default function NominalisationPage() {
  return <NominalisationLessonClient />;
}
