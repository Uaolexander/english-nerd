"use client";
import { useEffect } from "react";

export default function ScrollToPricing() {
  useEffect(() => {
    // Only auto-scroll if there's no existing hash in the URL
    if (window.location.hash) return;
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);
  return null;
}
