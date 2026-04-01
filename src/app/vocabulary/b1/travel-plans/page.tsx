import type { Metadata } from "next";
import TravelPlansClient from "./TravelPlansClient";

export const metadata: Metadata = {
  title: "Travel Plans — B1 Vocabulary — English Nerd",
  description:
    "B1 vocabulary exercise: read a travel planning dialogue and choose the correct word in each gap. 10 questions, intermediate level.",
  alternates: { canonical: "/vocabulary/b1/travel-plans" },
};

export default function TravelPlansPage() {
  return <TravelPlansClient />;
}
