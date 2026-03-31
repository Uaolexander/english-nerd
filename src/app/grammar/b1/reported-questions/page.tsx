import ReportedQuestionsLessonClient from "./ReportedQuestionsLessonClient";

export const metadata = {
  title: "Reported Speech — Questions — B1 Grammar Exercises — English Nerd",
  description:
    "Practice reported questions in English: ask + if/whether for yes/no questions, wh-word + statement order. B1 grammar lesson with exercises on converting direct questions to indirect speech.",
  alternates: { canonical: "/grammar/b1/reported-questions" },
};

export default function ReportedQuestionsPage() {
  return <ReportedQuestionsLessonClient />;
}
