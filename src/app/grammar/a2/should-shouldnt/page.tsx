import LessonSchema from "@/components/LessonSchema";
import ShouldShouldntLessonClient from "./ShouldShouldntLessonClient";

export const metadata = {
  title: "Should / Shouldn't — A2 Grammar — English Nerd",
  description:
    "Learn to use should and shouldn't in English for giving advice, recommendations and opinions. A2 grammar lesson covering should vs must vs have to. 4 exercises.",
  alternates: { canonical: "/grammar/a2/should-shouldnt" },
};

export default function ShouldShouldntPage() {
  return <ShouldShouldntLessonClient />;
}
