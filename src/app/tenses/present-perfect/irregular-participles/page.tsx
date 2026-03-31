import type { Metadata } from "next";
import IrregularParticiplesClient from "./IrregularParticiplesClient";

export const metadata: Metadata = {
  title: "Present Perfect: Irregular Past Participles — English Nerd",
  description:
    "Master irregular past participles used in Present Perfect: gone, seen, eaten, written, bought, broken and 40 more. 40 multiple-choice questions across four sets.",
  alternates: { canonical: "/tenses/present-perfect/irregular-participles" },
};

export default function Page() {
  return <IrregularParticiplesClient />;
}
