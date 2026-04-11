import LessonSchema from "@/components/LessonSchema";
import WouldPastHabitsLessonClient from "./WouldPastHabitsLessonClient";

export const metadata = {
  title: "Would for Past Habits and Routines — B1 Grammar Exercises — English Nerd",
  description:
    "Practice using 'would' for past habits and repeated actions: would + infinitive. B1 grammar lesson covering the difference from 'used to', time expressions, and typical contexts. 4 exercises.",
  alternates: { canonical: "/grammar/b1/would-past-habits" },
};

export default function WouldPastHabitsPage() {
  return <WouldPastHabitsLessonClient />;
}
