/** Shared formatters for the music page. */

/** Compact large counts (1847 → "1.8k", 47043 → "47k"). */
export function fmtNum(n: number): string {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
  return n.toLocaleString();
}

/** Unix seconds → 4-digit year, or "—". */
export function fmtYear(unixSeconds?: number): string {
  if (!unixSeconds) return '—';
  return String(new Date(unixSeconds * 1000).getFullYear());
}
