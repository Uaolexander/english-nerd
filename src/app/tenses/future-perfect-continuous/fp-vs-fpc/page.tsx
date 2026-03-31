import type { Metadata } from "next";
import FpVsFpcClient from "./FpVsFpcClient";

export const metadata: Metadata = {
  title: "Future Perfect vs Future Perfect Continuous — English Nerd",
  description:
    "40 questions distinguishing Future Perfect (will have done) from Future Perfect Continuous (will have been doing). Result/completion vs ongoing process. Free C1 English exercise.",
  alternates: { canonical: "/tenses/future-perfect-continuous/fp-vs-fpc" },
};

export default function Page() {
  return <FpVsFpcClient />;
}
