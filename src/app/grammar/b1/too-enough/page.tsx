import LessonSchema from "@/components/LessonSchema";
import TooEnoughLessonClient from "./TooEnoughLessonClient";

export const metadata = {
  title: "Too and Enough — B1 Grammar Exercises — English Nerd",
  description:
    "Practice too and enough in English: too + adjective, adjective + enough, enough + noun. B1 grammar lesson with exercises on expressing excess and sufficiency. 4 exercises.",
  alternates: { canonical: "/grammar/b1/too-enough" },
};

export default function TooEnoughPage() {
  return <TooEnoughLessonClient />;
}
