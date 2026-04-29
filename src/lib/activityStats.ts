const MS_PER_DAY = 86_400_000;

export function computeStreak(dates: string[], freezeDates: string[] = []): number {
  if (!dates.length && !freezeDates.length) return 0;
  const days = Array.from(new Set([
    ...dates.map((d) => d.slice(0, 10)),
    ...freezeDates,
  ])).sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - MS_PER_DAY).toISOString().slice(0, 10);
  if (days[0] !== today && days[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round(
      (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / MS_PER_DAY
    );
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export function weeklyActivity(dates: string[]): { day: string; label: string; count: number }[] {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Build a lookup map for O(1) access instead of filtering 7 times
  const countByDay = new Map<string, number>();
  for (const d of dates) {
    const key = d.slice(0, 10);
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  }
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * MS_PER_DAY);
    const iso = d.toISOString().slice(0, 10);
    result.push({ day: iso, label: dayNames[d.getDay()], count: countByDay.get(iso) ?? 0 });
  }
  return result;
}
