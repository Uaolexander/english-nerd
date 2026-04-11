"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useIsPro } from "@/lib/ProContext";
import { useIsStudent } from "@/lib/StudentContext";
import { useIsTeacher } from "@/lib/TeacherContext";

const HIDDEN_PATHS = ["/pro", "/account", "/login", "/register", "/teacher"];
const SESSION_KEY = "pro_banner_dismissed";

export default function MobileProBanner() {
  const pathname = usePathname();
  const isPro = useIsPro();
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    setDismissed(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  function dismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
  }

  if (isPro || isStudent || isTeacher) return null;
  if (HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;
  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[35] lg:hidden">
      <div
        className="flex items-center gap-3 border-t border-white/8 bg-[#0B0B0D]/95 px-4 pt-3 backdrop-blur-sm"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))' }}
      >
        <a href="/pro" className="flex flex-1 items-center gap-3 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F5DA20] text-sm">
            👑
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-black text-white">English Nerd PRO</span>
            <span className="ml-1.5 text-xs text-white/55">· No ads · SpeedRound · PDFs</span>
          </div>
          <span className="shrink-0 rounded-lg bg-[#F5DA20] px-3 py-1.5 text-[11px] font-black text-black">
            $2.50/mo →
          </span>
        </a>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-white/30 transition hover:text-white/70 active:text-white/70"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
