import LessonSchema from "@/components/LessonSchema";
import PassivePresentLessonClient from "./PassivePresentLessonClient";

export const metadata = {
  title: "Present Simple Passive Voice — B1 Grammar Exercises — English Nerd",
  description:
    "Practice the Present Simple Passive: am/is/are + past participle. B1 grammar lesson with exercises on active vs passive transformations, agent with 'by', and when to use the passive. 4 exercises.",
  alternates: { canonical: "/grammar/b1/passive-present" },
};

export default function PassivePresentPage() {
  return <PassivePresentLessonClient />;
}
