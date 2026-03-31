import ObjectPronounsLessonClient from "./ObjectPronounsLessonClient";

export const metadata = {
  title: "Object Pronouns — A2 Grammar — English Nerd",
  description:
    "Learn English object pronouns: me, you, him, her, it, us, them. A2 grammar lesson with 4 interactive exercises covering object pronoun usage after verbs and prepositions.",
  alternates: { canonical: "/grammar/a2/object-pronouns" },
};

export default function ObjectPronounsPage() {
  return <ObjectPronounsLessonClient />;
}
