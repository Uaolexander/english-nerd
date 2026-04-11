import LessonSchema from "@/components/LessonSchema";
import PassiveAdvancedLessonClient from "./PassiveAdvancedLessonClient";

export const metadata = {
  title: "Passive Voice: Advanced — B2 Grammar — English Nerd",
  description:
    "Advanced Passive Voice in English: perfect passive, passive with reporting verbs, passive infinitives. B2 grammar lesson covering has/have been done, is said to be, is thought to have. 4 exercises.",
  alternates: { canonical: "/grammar/b2/passive-advanced" },
};

export default function PassiveAdvancedPage() {
  return <PassiveAdvancedLessonClient />;
}
