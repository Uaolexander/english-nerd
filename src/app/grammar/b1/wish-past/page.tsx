import LessonSchema from "@/components/LessonSchema";
import WishPastLessonClient from "./WishPastLessonClient";

export const metadata = {
  title: "Wish + Past Simple — B1 Grammar Exercises — English Nerd",
  description:
    "Practice wish + past simple in English: I wish I knew, I wish I had more time. B1 grammar lesson with exercises on expressing regrets and wishes about the present. 4 exercises.",
  alternates: { canonical: "/grammar/b1/wish-past" },
};

export default function WishPastPage() {
  return <WishPastLessonClient />;
}
