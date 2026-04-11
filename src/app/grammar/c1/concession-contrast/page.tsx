import LessonSchema from "@/components/LessonSchema";
import ConcessionContrastLessonClient from "./ConcessionContrastLessonClient";

export const metadata = {
  title: "Concession & Contrast — C1 Grammar — English Nerd",
  description:
    "Learn advanced concession and contrast structures in English: although/though/even though, however/nevertheless/nonetheless, despite/in spite of, while/whereas, granted/admittedly, no matter how. C1 grammar. 4 exercises.",
  alternates: { canonical: "/grammar/c1/concession-contrast" },
};

export default function ConcessionContrastPage() {
  return <ConcessionContrastLessonClient />;
}
