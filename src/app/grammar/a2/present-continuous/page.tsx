import LessonSchema from "@/components/LessonSchema";
import PresentContinuousLessonClient from "./PresentContinuousLessonClient";

export const metadata = {
  title: "Present Continuous — A2 Grammar — English Nerd",
  description:
    "Learn the Present Continuous tense in English: am/is/are + verb-ing. A2 grammar lesson covering spelling rules, usage for actions happening now and temporary situations. 4 exercises.",
  alternates: { canonical: "/grammar/a2/present-continuous" },
};

export default function PresentContinuousPage() {
  return <PresentContinuousLessonClient />;
}
