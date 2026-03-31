import type { Metadata } from "next";
import ResetPasswordClient from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Set New Password — English Nerd",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
