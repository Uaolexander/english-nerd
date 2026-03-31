import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password — English Nerd",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
