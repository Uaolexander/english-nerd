import LessonSchema from "@/components/LessonSchema";
import AllConditionalsLessonClient from "./AllConditionalsLessonClient";

export const metadata = {
  title: "All Conditionals: Zero, First and Second — B1 Grammar Exercises — English Nerd",
  description:
    "Mixed practice for all three conditionals: zero, first, and second conditional. B1 grammar exercises to distinguish between facts, real future situations, and hypothetical scenarios.",
  alternates: { canonical: "/grammar/b1/all-conditionals" },
};

export default function AllConditionalsPage() {
  return <AllConditionalsLessonClient />;
}
