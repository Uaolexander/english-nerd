import LessonSchema from "@/components/LessonSchema";
import VerbIngLessonClient from "./VerbIngLessonClient";

export const metadata = {
  title: "Verb + -ing (Gerund) — A2 Grammar — English Nerd",
  description:
    "Learn which English verbs are followed by -ing: enjoy, finish, avoid, mind, miss, keep, look forward to. A2 grammar lesson with spelling rules for -ing forms. 4 exercises.",
  alternates: { canonical: "/grammar/a2/verb-ing" },
};

export default function VerbIngPage() {
  return <VerbIngLessonClient />;
}
