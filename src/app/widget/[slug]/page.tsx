import { notFound } from "next/navigation";
import { getWidget, getAllWidgets } from "@/lib/widgetData";
import WidgetQuiz from "./WidgetQuiz";
import type { Metadata } from "next";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllWidgets().map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const widget = getWidget(params.slug);
  if (!widget) return {};
  return {
    title: `${widget.title} Quiz — English Nerd`,
    robots: { index: false, follow: false },
  };
}

export default function WidgetPage({ params }: { params: { slug: string } }) {
  const widget = getWidget(params.slug);
  if (!widget) notFound();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#fff", overflow: "hidden" }}>
      <WidgetQuiz widget={widget} />
    </div>
  );
}
