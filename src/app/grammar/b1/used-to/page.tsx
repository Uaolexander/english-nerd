import LessonSchema from "@/components/LessonSchema";
import UsedToLessonClient from "./UsedToLessonClient";

export const metadata = {
  title: "Used to — B1 Grammar — English Nerd",
  description:
    "Learn 'used to' for past habits and states: used to + infinitive. B1 grammar lesson covering affirmative, negative, and question forms, plus the difference from Past Simple. 4 exercises.",
  alternates: { canonical: "/grammar/b1/used-to" },
};

export default function UsedToPage() {
  return <UsedToLessonClient />;
}
