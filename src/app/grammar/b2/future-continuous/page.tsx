import LessonSchema from "@/components/LessonSchema";
import FutureContinuousLessonClient from "./FutureContinuousLessonClient";

export const metadata = {
  title: "Future Continuous — B2 Grammar — English Nerd",
  description:
    "Learn the Future Continuous tense in English: will be + -ing. B2 grammar lesson covering actions in progress at a future time, polite questions, and contrast with will and going to. 4 exercises.",
  alternates: { canonical: "/grammar/b2/future-continuous" },
};

export default function FutureContinuousPage() {
  return <FutureContinuousLessonClient />;
}
