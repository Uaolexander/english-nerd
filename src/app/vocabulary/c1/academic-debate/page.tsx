import type { Metadata } from "next";
import AcademicDebateClient from "./AcademicDebateClient";

export const metadata: Metadata = {
  title: "An Academic Debate — C1 Vocabulary — English Nerd",
  description:
    "C1 vocabulary exercise: professors discuss research methodology and academic publishing. Read the dialogue and choose the correct word. 10 questions, advanced level.",
  alternates: { canonical: "/vocabulary/c1/academic-debate" },
};

export default function AcademicDebatePage() {
  return <AcademicDebateClient />;
}
