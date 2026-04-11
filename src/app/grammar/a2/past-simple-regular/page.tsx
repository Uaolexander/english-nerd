import LessonSchema from "@/components/LessonSchema";
import PastSimpleRegularLessonClient from "./PastSimpleRegularLessonClient";

export const metadata = {
  title: "Past Simple: Regular Verbs — A2 Grammar — English Nerd",
  description:
    "Learn how to form the past simple of regular verbs in English: -ed endings, spelling rules (CVC doubling, y→ied), and pronunciation (/t/, /d/, /ɪd/). A2 level exercises.",
  alternates: { canonical: "/grammar/a2/past-simple-regular" },
};

export default function PastSimpleRegularPage() {
  return <PastSimpleRegularLessonClient />;
}
