import LessonSchema from "@/components/LessonSchema";
import PastContinuousLessonClient from "./PastContinuousLessonClient";

export const metadata = {
  title: "Past Continuous — B1 Grammar — English Nerd",
  description:
    "Learn the Past Continuous tense in English: was/were + -ing. B1 grammar lesson covering actions in progress in the past, interrupted actions, and Past Continuous vs Past Simple. 4 exercises.",
  alternates: { canonical: "/grammar/b1/past-continuous" },
};

export default function PastContinuousPage() {
  return <PastContinuousLessonClient />;
}
