import LessonSchema from "@/components/LessonSchema";
import GoingToLessonClient from "./GoingToLessonClient";

export const metadata = {
  title: "Going to (Future Plans) — A2 Grammar — English Nerd",
  description:
    "Learn to use 'going to' in English to talk about future plans and intentions. A2 grammar lesson: am/is/are going to + verb, negatives, questions, and going to vs will. 4 exercises.",
  alternates: { canonical: "/grammar/a2/going-to" },
};

export default function GoingToPage() {
  return <GoingToLessonClient />;
}
