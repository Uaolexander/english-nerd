import LessonSchema from "@/components/LessonSchema";
import ModalPerfectLessonClient from "./ModalPerfectLessonClient";

export const metadata = {
  title: "Modal Verbs: Perfect — B2 Grammar — English Nerd",
  description:
    "Learn modal perfect structures in English: must have been, should have done, needn't have, could have, might have. B2 grammar covering deduction, criticism, and possibility about the past. 4 exercises.",
  alternates: { canonical: "/grammar/b2/modal-perfect" },
};

export default function ModalPerfectPage() {
  return <ModalPerfectLessonClient />;
}
