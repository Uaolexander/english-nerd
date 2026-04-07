"use client";

import { usePathname } from "next/navigation";
import { useIsPro } from "@/lib/ProContext";
import { useIsStudent } from "@/lib/StudentContext";
import { useIsTeacher } from "@/lib/TeacherContext";

const HIDDEN_PATHS = ["/pro", "/account", "/login", "/register", "/teacher"];

export default function MobileProBanner() {
  const pathname = usePathname();
  const isPro = useIsPro();
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();

  // Hide for PRO / students / teachers and on certain pages
  if (isPro || isStudent || isTeacher) return null;
  if (HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[35] lg:hidden">
      <a
        href="/pro"
        className="flex items-center gap-3 border-t border-white/8 bg-[#0B0B0D]/95 px-4 pt-3 backdrop-blur-sm"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F5DA20] text-sm">
          👑
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-black text-white">English Nerd PRO</span>
          <span className="ml-1.5 text-xs text-white/40">· No ads · SpeedRound · PDFs</span>
        </div>
        <span className="shrink-0 rounded-lg bg-[#F5DA20] px-3 py-1.5 text-[11px] font-black text-black">
          $2.50/mo →
        </span>
      </a>
    </div>
  );
}
