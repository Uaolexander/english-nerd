import LessonSchema from "@/components/LessonSchema";
import PastSimpleNegativeQuestionsLessonClient from "./PastSimpleNegativeQuestionsLessonClient";

export const metadata = {
  title: "Past Simple: Negatives & Questions — A2 Grammar — English Nerd",
  description:
    "Learn to form Past Simple negatives with didn't and questions with Did. A2 grammar lesson covering didn't go, Did you see?, short answers and word order. 4 exercises.",
  alternates: { canonical: "/grammar/a2/past-simple-negative-questions" },
};

export default function PastSimpleNegativeQuestionsPage() {
  return <PastSimpleNegativeQuestionsLessonClient />;
}
