import type { Metadata } from "next";
import EvidencePredictionsClient from "./EvidencePredictionsClient";

export const metadata: Metadata = {
  title: "Be Going To: Evidence-Based Predictions — English Nerd",
  description:
    "Practise using be going to for evidence-based predictions with 40 multiple-choice questions. Learn when to use going to (visible signs) vs will (opinion). Free B1 interactive English exercise.",
  alternates: { canonical: "/tenses/be-going-to/evidence-predictions" },
};

export default function Page() {
  return <EvidencePredictionsClient />;
}
