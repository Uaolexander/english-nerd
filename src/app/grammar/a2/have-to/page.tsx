import LessonSchema from "@/components/LessonSchema";
import HaveToLessonClient from "./HaveToLessonClient";

export const metadata = {
  title: "Have to / Don't have to — A2 Grammar — English Nerd",
  description:
    "Learn when to use have to, has to, don't have to and doesn't have to in English. A2 grammar lesson covering obligation, no obligation, and the difference from must and mustn't. 4 exercises.",
  alternates: { canonical: "/grammar/a2/have-to" },
};

export default function HaveToPage() {
  return <HaveToLessonClient />;
}
