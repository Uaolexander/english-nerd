import WordFormationLessonClient from "./WordFormationLessonClient";

export const metadata = {
  title: "Word Formation — C1 Grammar — English Nerd",
  description:
    "Learn advanced word formation in English: prefixes (mis-, over-, under-, re-), suffixes (-tion, -ness, -ity, -ous, -ify), compounding, conversion, and word families. C1 grammar. 4 exercises.",
  alternates: { canonical: "/grammar/c1/word-formation" },
};

export default function WordFormationPage() {
  return <WordFormationLessonClient />;
}
