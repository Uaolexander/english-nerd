"use client";

export default function LiveSessionBanner({
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
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <svg className="h-4 w-4 animate-spin text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-sm text-slate-500">Connecting to live session…</p>
      </div>
    );
  }

  if (status === "error" || status === "expired") {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
        <svg className="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-sm text-red-700 font-semibold">
          {status === "expired" ? "Live session expired. Please start a new one." : "Live session not found. The link may be invalid."}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
      {/* Live indicator */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-500" />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-violet-800">
          Live session {isTeacher ? "with student" : "with teacher"}
        </p>
        <p className="text-xs text-violet-500">
          {partnerOnline
            ? isTeacher
              ? "Student is connected — answers sync in real time"
              : "Teacher is connected — answers sync in real time"
            : "Waiting for the other participant to connect…"}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`h-2 w-2 rounded-full ${partnerOnline ? "bg-emerald-400" : "bg-slate-300"}`} />
        <span className="text-xs font-semibold text-violet-600">
          {partnerOnline ? "Connected" : "Offline"}
        </span>
      </div>
    </div>
  );
}
