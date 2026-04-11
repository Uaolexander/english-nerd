import LessonSchema from "@/components/LessonSchema";
import InversionLessonClient from "./InversionLessonClient";

export const metadata = {
  title: "Inversion — B2 Grammar — English Nerd",
  description:
    "Learn formal inversion in English: Never have I seen, Not only did he lie, Rarely do we see. B2 grammar lesson with negative adverbials and inverted structures. 4 exercises.",
  alternates: { canonical: "/grammar/b2/inversion" },
};

export default function InversionPage() {
  return <InversionLessonClient />;
}
