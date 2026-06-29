

type WalletRefreshListener = () => void;

const listeners = new Set<WalletRefreshListener>();

export function subscribeWalletRefresh(listener: WalletRefreshListener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function emitWalletRefresh(reason?: string): void {
  if (reason) console.log(`[walletEvents] refresh emit — reason: ${reason}`);
  listeners.forEach((l) => {
    try { l(); } catch (e) { console.warn('[walletEvents] listener error', e); }
  });
}
