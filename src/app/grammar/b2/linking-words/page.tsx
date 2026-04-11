import LessonSchema from "@/components/LessonSchema";
import LinkingWordsLessonClient from "./LinkingWordsLessonClient";

export const metadata = {
  title: "Linking Words & Discourse Markers — B2 Grammar — English Nerd",
  description:
    "Learn linking words and discourse markers in English: however, moreover, despite, in spite of, although, nevertheless, therefore. B2 grammar for formal and informal writing. 4 exercises.",
  alternates: { canonical: "/grammar/b2/linking-words" },
};

export default function LinkingWordsPage() {
  return <LinkingWordsLessonClient />;
}
