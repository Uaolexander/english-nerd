import LessonSchema from "@/components/LessonSchema";
import EllipsisSubstitutionLessonClient from "./EllipsisSubstitutionLessonClient";

export const metadata = {
  title: "Ellipsis & Substitution — C1 Grammar — English Nerd",
  description:
    "Learn ellipsis and substitution in English: so do I, neither did she, I think so, do so, auxiliary substitution — avoiding repetition in formal and informal English. C1 grammar. 4 exercises.",
  alternates: { canonical: "/grammar/c1/ellipsis-substitution" },
};

export default function EllipsisSubstitutionPage() {
  return <EllipsisSubstitutionLessonClient />;
}
