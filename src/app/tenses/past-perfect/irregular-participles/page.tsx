import type { Metadata } from "next";
import IrregularParticiplesClient from "./IrregularParticiplesClient";

export const metadata: Metadata = {
  title: "Past Perfect: Irregular Participles — English Nerd",
  description:
    "Master irregular past participles in Past Perfect context: gone, seen, written, bought, put, and more. 40 interactive multiple-choice questions across four sets.",
  alternates: { canonical: "/tenses/past-perfect/irregular-participles" },
};

export default function Page() {
  return <IrregularParticiplesClient />;
}
