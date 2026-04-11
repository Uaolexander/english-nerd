import LessonSchema from "@/components/LessonSchema";
import HedgingLanguageLessonClient from "./HedgingLanguageLessonClient";

export const metadata = {
  title: "Hedging Language — C1 Grammar — English Nerd",
  description:
    "Learn hedging language in English: modal verbs for uncertainty, tentative verbs (seem, appear, tend), adverbs (apparently, presumably, arguably), it would appear, to some extent, qualifying claims. C1 grammar. 4 exercises.",
  alternates: { canonical: "/grammar/c1/hedging-language" },
};

export default function HedgingLanguagePage() {
  return <HedgingLanguageLessonClient />;
}
