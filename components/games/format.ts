/** Shared formatters for the games page. */

/** Steam playtimes come in minutes; render as compact hours. */
export function fmtHours(minutes: number): string {
  const hours = minutes / 60;
  if (hours >= 100) return `${Math.round(hours).toLocaleString()}h`;
  return `${Math.round(hours * 10) / 10}h`;
}

/** Compact large counts (1847 → "1.8k"). */
export function fmtNum(n: number): string {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
  return n.toLocaleString();
}

/** Unix seconds → "Mar 2024". */
export function fmtMonthYear(unixSeconds?: number): string {
  if (!unixSeconds) return '';
  return new Date(unixSeconds * 1000).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

/** Unix seconds → coarse relative label ("2d ago", "3w ago"). */
export function fmtRelative(unixSeconds: number): string {
  const days = Math.floor((Date.now() - unixSeconds * 1000) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 35) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
