import type { Metadata } from "next";
import MyWeekendClient from "./MyWeekendClient";

export const metadata: Metadata = {
  title: "My Weekend — A2 Vocabulary — English Nerd",
  description:
    "A2 vocabulary exercise: read a dialogue about weekend plans and choose the correct word in each gap. 10 questions, elementary level.",
  alternates: { canonical: "/vocabulary/a2/my-weekend" },
};

export default function MyWeekendPage() {
  return <MyWeekendClient />;
}
