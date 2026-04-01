import type { Metadata } from "next";
import PsychologyHabitsClient from "./PsychologyHabitsClient";

export const metadata: Metadata = {
  title: "The Psychology of Habits — B2 Reading — English Nerd",
  description:
    "B2 reading exercise. Read the article about how habits form and are broken, then answer comprehension questions.",
  alternates: { canonical: "/reading/b2/the-psychology-of-habits" },
};

export default function PsychologyHabitsPage() {
  return <PsychologyHabitsClient />;
}
