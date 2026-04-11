import LessonSchema from "@/components/LessonSchema";
import ThirdConditionalLessonClient from "./ThirdConditionalLessonClient";

export const metadata = {
  title: "Third Conditional — B2 Grammar — English Nerd",
  description:
    "Learn the Third Conditional in English: If + Past Perfect, would/could/might have + past participle. B2 grammar lesson covering hypothetical past situations, regrets, and criticism. 4 exercises.",
  alternates: { canonical: "/grammar/b2/third-conditional" },
};

export default function ThirdConditionalPage() {
  return <ThirdConditionalLessonClient />;
}
