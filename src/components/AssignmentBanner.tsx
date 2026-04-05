"use client";

import { useSearchParams } from "next/navigation";

export default function AssignmentBanner() {
  const params = useSearchParams();
  const assigned = params.get("assigned");
  if (!assigned) return null;

  const nums = assigned.split(",").map(Number).filter((n) => n >= 1 && n <= 4).sort((a, b) => a - b);
  if (nums.length === 0) return null;

  const label = nums.length === 1
    ? `Exercise ${nums[0]}`
    : `Exercises ${nums.slice(0, -1).join(", ")} and ${nums[nums.length - 1]}`;

  return (
    <div className="sticky top-0 z-40 flex items-center justify-center gap-2.5 bg-[#F5DA20] px-4 py-2.5 shadow-sm">
      <svg className="h-4 w-4 shrink-0 text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      <p className="text-sm font-bold text-amber-900">
        Your teacher assigned: <span className="font-black">{label}</span>
      </p>
    </div>
  );
}
