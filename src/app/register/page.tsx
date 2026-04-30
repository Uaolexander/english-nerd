import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Register — English Nerd",
  description: "Create a free English Nerd account.",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterClient />
    </Suspense>
  );
}
