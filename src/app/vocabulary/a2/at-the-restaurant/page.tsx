import type { Metadata } from "next";
import AtTheRestaurantClient from "./AtTheRestaurantClient";

export const metadata: Metadata = {
  title: "At the Restaurant — A2 Vocabulary — English Nerd",
  description:
    "A2 vocabulary exercise: read a dialogue at a restaurant and choose the correct word in each gap. 10 questions, elementary level.",
  alternates: { canonical: "/vocabulary/a2/at-the-restaurant" },
};

export default function AtTheRestaurantPage() {
  return <AtTheRestaurantClient />;
}
