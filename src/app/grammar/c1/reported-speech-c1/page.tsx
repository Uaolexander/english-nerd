import LessonSchema from "@/components/LessonSchema";
import ReportedSpeechC1LessonClient from "./ReportedSpeechC1LessonClient";

export const metadata = {
  title: "Reported Speech: Advanced — C1 Grammar — English Nerd",
  description:
    "Learn advanced reported speech in English: complex reporting verbs (insist on, warn against, object to), tense shifts in context, reporting questions and imperatives, mixed reporting structures. C1 grammar. 4 exercises.",
  alternates: { canonical: "/grammar/c1/reported-speech-c1" },
};

export default function ReportedSpeechC1Page() {
  return <ReportedSpeechC1LessonClient />;
}
