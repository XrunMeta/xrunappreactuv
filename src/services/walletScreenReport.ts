

import { Platform } from 'react-native';
import { probeSubscribe, probeSnapshot, ProbeSnapshot } from './screenProbe';
import { getApiBaseUrl, getAuthHeader } from './index';
import { getCurrentAppVersion } from './versionCheck';

const SCREEN = 'wallet';
const DEBOUNCE_MS = 1500;

const EMPTY_REPORT_AFTER_MS = 60000;

export type WalletReportRow = {
  i: number;
  currency: number;
  title: string;
  subtitle: string;
  amount: string;
};

export type WalletReportContext = {
  isLoading: boolean;
  addressMasked: string | null;
  staleCurrencies: number[];
};

type RowField = 'title' | 'subtitle' | 'amount';
const ROW_FIELDS: RowField[] = ['title', 'subtitle', 'amount'];

export function buildWalletReportRows(snap: ProbeSnapshot): WalletReportRow[] {
  const byRow = new Map<string, WalletReportRow>();

  for (const { key, value } of snap.entries) {
    const parts = key.split('|');
    if (parts.length !== 3) continue;

    const i = Number(parts[0]);
    const currency = Number(parts[1]);
    const field = parts[2] as RowField;
    if (!Number.isFinite(i) || !Number.isFinite(currency)) continue;
    if (!ROW_FIELDS.includes(field)) continue;

    const rowKey = `${i}|${currency}`;
    let row = byRow.get(rowKey);
    if (!row) {
      row = { i, currency, title: '', subtitle: '', amount: '' };
      byRow.set(rowKey, row);
    }
    row[field] = value;
  }

  return Array.from(byRow.values()).sort((a, b) => a.i - b.i);
}

async function send(
  rows: WalletReportRow[],
  snap: ProbeSnapshot,
  ctx: WalletReportContext,
  seq: number,
): Promise<void> {
  try {
    const baseUrl = getApiBaseUrl();
    const payload = {
      sessionId: snap.sessionId,
      seq,
      elapsedMs: Date.now() - snap.startedAt,
      isLoading: ctx.isLoading,
      addressMasked: ctx.addressMasked,
      staleCurrencies: ctx.staleCurrencies,
      rows,
      app: {
        version: getCurrentAppVersion(),
        platform: Platform.OS,
        osVersion: String(Platform.Version),
      },
    };

    await fetch(`${baseUrl}/walletScreenReport`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: await getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
  } catch {

  }
}

export function startWalletScreenReporter(
  getContext: () => WalletReportContext,
): () => void {
  let stopped = false;
  let seq = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    if (stopped) return;
    const snap = probeSnapshot(SCREEN);
    if (!snap) return;
    const rows = buildWalletReportRows(snap);
    seq += 1;
    void send(rows, snap, getContext(), seq);
  };

  const unsubscribe = probeSubscribe(SCREEN, () => {
    if (stopped) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(flush, DEBOUNCE_MS);
  });

  const initial = probeSnapshot(SCREEN);
  if (initial && initial.entries.length > 0) {
    debounceTimer = setTimeout(flush, DEBOUNCE_MS);
  }

  const emptyTimer = setTimeout(() => {
    if (stopped || seq > 0) return;
    const snap = probeSnapshot(SCREEN);
    if (!snap || snap.entries.length > 0) return;
    seq += 1;
    void send([], snap, getContext(), seq);
  }, EMPTY_REPORT_AFTER_MS);

  return () => {
    stopped = true;
    unsubscribe();
    if (debounceTimer) clearTimeout(debounceTimer);
    clearTimeout(emptyTimer);
  };
}
