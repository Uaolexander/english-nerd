import type { Metadata } from "next";
import ChangingCitiesClient from "./ChangingCitiesClient";

export const metadata: Metadata = {
  title: "Changing Cities — B2 Reading — English Nerd",
  description:
    "B2 reading exercise. Read what four urban planners say about the future of cities. True or false?",
  alternates: { canonical: "/reading/b2/changing-cities" },
};

export default function ChangingCitiesPage() {
  return <ChangingCitiesClient />;
}
