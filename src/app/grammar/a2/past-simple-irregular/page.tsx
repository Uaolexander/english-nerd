import LessonSchema from "@/components/LessonSchema";
import PastSimpleIrregularLessonClient from "./PastSimpleIrregularLessonClient";

export const metadata = {
  title: "Past Simple: Irregular Verbs — A2 Grammar — English Nerd",
  description:
    "Learn the most common English irregular verbs in the past simple: went, came, saw, got, took and more. A2 level with 4 exercises and a full reference table.",
  alternates: { canonical: "/grammar/a2/past-simple-irregular" },
};

export default function PastSimpleIrregularPage() {
  return <PastSimpleIrregularLessonClient />;
}
