"use client";

/** Banner shown at the top of an exercise during a live collaborative session */
export default function LiveSessionBanner({
  isTeacher,
  partnerOnline,
}: {
  isTeacher: boolean;
  partnerOnline: boolean;
}) {
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
              ? "Student is connected — you can both answer questions together"
              : "Teacher is connected — complete the exercise together"
            : "Waiting for the other participant to connect…"}
        </p>
      </div>

      {/* Partner status dot */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={`h-2 w-2 rounded-full ${partnerOnline ? "bg-emerald-400" : "bg-slate-300"}`}
        />
        <span className="text-xs font-semibold text-violet-600">
          {partnerOnline ? "Connected" : "Offline"}
        </span>
      </div>
    </div>
  );
}
