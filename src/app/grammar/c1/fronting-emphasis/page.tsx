import LessonSchema from "@/components/LessonSchema";
import FrontingEmphasisLessonClient from "./FrontingEmphasisLessonClient";

export const metadata = {
  title: "Fronting & Emphasis — C1 Grammar — English Nerd",
  description:
    "Learn fronting and emphasis structures in English: fronted adverbials, object fronting, topicalisation, emphatic do/does/did, all-clefts and what-clefts. C1 grammar. 4 exercises.",
  alternates: { canonical: "/grammar/c1/fronting-emphasis" },
};

export default function FrontingEmphasisPage() {
  return <FrontingEmphasisLessonClient />;
}
