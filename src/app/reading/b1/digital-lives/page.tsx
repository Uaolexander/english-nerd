import type { Metadata } from "next";
import DigitalLivesClient from "./DigitalLivesClient";

export const metadata: Metadata = {
  title: "Digital Lives | B1 Reading | English Nerd",
  description:
    "B1 reading exercise. Read what four young people say about social media and technology. True or false?",
  alternates: { canonical: "/reading/b1/digital-lives" },
};

export default function DigitalLivesPage() {
  return <DigitalLivesClient />;
}
