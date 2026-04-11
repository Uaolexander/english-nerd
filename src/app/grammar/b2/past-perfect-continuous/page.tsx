import LessonSchema from "@/components/LessonSchema";
import PastPerfectContinuousLessonClient from "./PastPerfectContinuousLessonClient";

export const metadata = {
  title: "Past Perfect Continuous — B2 Grammar — English Nerd",
  description:
    "Learn the Past Perfect Continuous tense in English: had been + -ing. B2 grammar lesson covering duration before a past event, reasons for past states, and contrast with Past Perfect. 4 exercises.",
  alternates: { canonical: "/grammar/b2/past-perfect-continuous" },
};

export default function PastPerfectContinuousPage() {
  return <PastPerfectContinuousLessonClient />;
}
