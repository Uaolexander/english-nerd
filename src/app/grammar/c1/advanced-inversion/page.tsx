import LessonSchema from "@/components/LessonSchema";
import AdvancedInversionLessonClient from "./AdvancedInversionLessonClient";

export const metadata = {
  title: "Advanced Inversion — C1 Grammar — English Nerd",
  description:
    "Learn advanced inversion in English: negative adverbials (Never, Rarely, Not only, Hardly, No sooner), fronted prepositional phrases, so/such inversion, comparative inversion. C1 grammar. 4 exercises.",
  alternates: { canonical: "/grammar/c1/advanced-inversion" },
};

export default function AdvancedInversionPage() {
  return <AdvancedInversionLessonClient />;
}
