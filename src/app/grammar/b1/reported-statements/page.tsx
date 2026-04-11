import LessonSchema from "@/components/LessonSchema";
import ReportedStatementsLessonClient from "./ReportedStatementsLessonClient";

export const metadata = {
  title: "Reported Speech — Statements — B1 Grammar Exercises — English Nerd",
  description:
    "Practice reported speech statements in English: say/tell + that clause, tense backshift. B1 grammar lesson with exercises on converting direct speech to indirect speech.",
  alternates: { canonical: "/grammar/b1/reported-statements" },
};

export default function ReportedStatementsPage() {
  return <ReportedStatementsLessonClient />;
}
