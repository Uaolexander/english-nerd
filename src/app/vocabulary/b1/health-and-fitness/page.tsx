import type { Metadata } from "next";
import HealthFitnessClient from "./HealthFitnessClient";

export const metadata: Metadata = {
  title: "Health & Fitness — B1 Vocabulary — English Nerd",
  description:
    "B1 vocabulary exercises about health and fitness. Three activities: multiple choice, choose the correct word, and fill in the blanks.",
  alternates: { canonical: "/vocabulary/b1/health-and-fitness" },
};

export default function HealthFitnessPage() {
  return <HealthFitnessClient />;
}
