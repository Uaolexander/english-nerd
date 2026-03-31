import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Log in — English Nerd",
  description: "Log in to your English Nerd account.",
};

export default function LoginPage() {
  return <LoginClient />;
}
