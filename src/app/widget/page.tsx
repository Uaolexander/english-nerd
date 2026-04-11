import type { Metadata } from "next";
import { getAllWidgets } from "@/lib/widgetData";
import WidgetGalleryClient from "./WidgetGalleryClient";

export const metadata: Metadata = {
  title: "Free Embeddable English Grammar Widgets — English Nerd",
  description: "Add free interactive English grammar quizzes to your website or blog. Copy one line of code and embed instantly. A1–B2 levels.",
  alternates: { canonical: "/widget" },
};

export default function WidgetPage() {
  const widgets = getAllWidgets();
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <WidgetGalleryClient widgets={widgets} />
    </main>
  );
}
