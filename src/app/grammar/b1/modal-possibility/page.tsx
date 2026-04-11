import LessonSchema from "@/components/LessonSchema";
import ModalPossibilityLessonClient from "./ModalPossibilityLessonClient";

export const metadata = {
  title: "Modal Verbs — Possibility: might, may, could — B1 Grammar Exercises — English Nerd",
  description:
    "Practice modal verbs for possibility in English: might, may, could. B1 grammar lesson with exercises on expressing different degrees of certainty about present and future situations.",
  alternates: { canonical: "/grammar/b1/modal-possibility" },
};

export default function ModalPossibilityPage() {
  return <ModalPossibilityLessonClient />;
}
