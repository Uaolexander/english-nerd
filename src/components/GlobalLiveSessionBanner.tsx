"use client";

/**
 * Renders a slim banner at the top of the page content area whenever
 * a live session is active. Rendered directly from LiveSessionActive
 * (a client component) so context propagation works correctly with RSC.
 */
export default function GlobalLiveSessionBanner({
  status,
  isTeacher,
  partnerOnline,
}: {
  status: "loading" | "ready" | "error" | "expired";
  isTeacher: boolean;
  partnerOnline: boolean;
}) {
  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <svg
          className="h-3.5 w-3.5 animate-spin shrink-0 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-xs text-slate-500">Connecting to live session…</p>
      </div>
    );
  }

  if (status === "error" || status === "expired") {
    return (
      <div className="flex items-center gap-3 border-b border-red-200 bg-red-50 px-4 py-2.5">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs font-semibold text-red-700">
          {status === "expired"
            ? "Live session expired. Please start a new one."
            : "Live session not found. The link may be invalid."}
        </p>
      </div>
    );
  }

  // ready
  return (
    <div className="flex items-center gap-3 border-b border-violet-200 bg-violet-50 px-4 py-2.5">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
      </span>

      <p className="flex-1 min-w-0 text-xs font-bold text-violet-800">
        Live session {isTeacher ? "with student" : "with teacher"}
        <span className="ml-2 font-normal text-violet-600">
          {partnerOnline
            ? "· answers sync in real time"
            : "· waiting for the other participant…"}
        </span>
      </p>

      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            partnerOnline ? "bg-emerald-400" : "bg-slate-300"
          }`}
        />
        <span className="text-[10px] font-semibold text-violet-600">
          {partnerOnline ? "Connected" : "Offline"}
        </span>
      </div>
    </div>
  );
}
