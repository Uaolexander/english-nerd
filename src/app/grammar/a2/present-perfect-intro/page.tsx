import LessonSchema from "@/components/LessonSchema";
import PresentPerfectIntroLessonClient from "./PresentPerfectIntroLessonClient";

export const metadata = {
  title: "Present Perfect: Introduction — A2 Grammar — English Nerd",
  description:
    "Learn the English Present Perfect tense: have/has + past participle. A2 grammar lesson covering how to form it and the key difference from Past Simple. 4 exercises.",
  alternates: { canonical: "/grammar/a2/present-perfect-intro" },
};

export default function PresentPerfectIntroPage() {
  return <PresentPerfectIntroLessonClient />;
}
