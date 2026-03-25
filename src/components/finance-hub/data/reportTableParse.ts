/** Parse currency cells for sorting (aligned with standardReportModel / display strings). */
export function parseReportCurrency(s: string): number | null {
  if (!s || s.trim() === '' || s === '—') return null;
  const trimmed = s.trim();
  const parenNeg = trimmed.includes('(') && trimmed.includes(')');
  const minusNeg = trimmed.startsWith('-');
  const n = parseFloat(trimmed.replace(/[$,%]/g, '').replace(/[()]/g, ''));
  if (Number.isNaN(n)) return null;
  const neg = parenNeg || minusNeg;
  return neg ? -Math.abs(n) : n;
}

/** Parse percentage like "12.3%" for sorting */
export function parseReportPercent(s: string): number | null {
  if (!s || s.trim() === '' || s === '—') return null;
  const n = parseFloat(s.replace(/%/g, '').trim());
  return Number.isNaN(n) ? null : n;
}
