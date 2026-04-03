"use client";

import dynamic from "next/dynamic";

type Word = { word: string; pos: string; meaning: string; example: string };
type Level = "A1" | "A2" | "B1" | "B2" | "C1";

const DownloadPDFButton = dynamic(() => import("./DownloadPDFButton"), { ssr: false });

export default function DownloadPDFWrapper(props: {
  words: Word[];
  level: Level;
  title: string;
  meta: string;
  tip: string;
  isPro: boolean;
}) {
  return <DownloadPDFButton {...props} />;
}
