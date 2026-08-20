

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function formatUtcIsoToKstDate(iso: string | null | undefined): string | null {
  if (!iso || typeof iso !== 'string') return null;

  const utcMs = Date.parse(iso);
  if (Number.isNaN(utcMs)) return null;

  const kst = new Date(utcMs + KST_OFFSET_MS);
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}
