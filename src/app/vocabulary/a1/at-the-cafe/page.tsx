import type { Metadata } from "next";
import AtTheCafeClient from "./AtTheCafeClient";

export const metadata: Metadata = {
  title: "At the Café — A1 Vocabulary — English Nerd",
  description:
    "A1 vocabulary exercise: read a dialogue at a café and choose the correct word in each gap. 10 questions, beginner level.",
  alternates: { canonical: "/vocabulary/a1/at-the-cafe" },
};

export default function AtTheCafePage() {
  return <AtTheCafeClient />;
}
