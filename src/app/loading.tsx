export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Title bar */}
        <div className="space-y-3">
          <div className="h-8 w-48 rounded-xl bg-white/[0.07] skeleton-pulse" />
          <div className="h-4 w-72 rounded-lg bg-white/[0.04] skeleton-pulse" />
        </div>

        {/* Card rows */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-3 skeleton-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/[0.07] shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 rounded-md bg-white/[0.07]" style={{ width: `${55 + i * 10}%` }} />
                <div className="h-3 rounded-md bg-white/[0.04]" style={{ width: `${30 + i * 8}%` }} />
              </div>
              <div className="h-7 w-20 rounded-lg bg-white/[0.05] shrink-0" />
            </div>
            {i % 2 === 0 && (
              <div className="flex gap-2 pt-1">
                {[60, 45, 75].map((w, j) => (
                  <div key={j} className="h-6 rounded-full bg-white/[0.04]" style={{ width: `${w}px` }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
