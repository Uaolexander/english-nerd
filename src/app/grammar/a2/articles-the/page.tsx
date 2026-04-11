import LessonSchema from "@/components/LessonSchema";
import ArticlesTheLessonClient from "./ArticlesTheLessonClient";

export const metadata = {
  title: "Articles: a / an / the / zero — A2 Grammar — English Nerd",
  description:
    "Learn when to use a, an, the or no article in English. A2 grammar lesson covering first vs second mention, general vs specific, and common article rules. 4 interactive exercises.",
  alternates: { canonical: "/grammar/a2/articles-the" },
};

export default function ArticlesThePage() {
  return <ArticlesTheLessonClient />;
}
