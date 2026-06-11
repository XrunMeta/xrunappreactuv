

import { ethers } from 'ethers';
import { getEnv } from '../utils/env';
import type { WalletKey } from './walletKeyStore';
import { getApiBaseUrl, getAuthHeader } from './index';

let _pendingWallets: WalletKey[] | null = null;

export function stagePendingWallets(wallets: WalletKey[]): void {
  console.log('[송금-로컬] 임시 wallet stage 완료, count=', wallets.length);
  _pendingWallets = wallets;
}

export function consumePendingWallets(): WalletKey[] | null {
  const w = _pendingWallets;
  _pendingWallets = null;
  if (w) console.log('[송금-로컬] 임시 wallet consume, count=', w.length);
  return w;
}

export function clearPendingWallets(): void {
  if (_pendingWallets) {
    console.log('[송금-로컬] 임시 wallet 강제 clear');
    _pendingWallets = null;
  }
}

const POLYGON_RPC_URLS = [
  'https://polygon-bor-rpc.publicnode.com',
  'https://polygon.llamarpc.com',
  'https://polygon.drpc.org',
  'https://1rpc.io/matic',
  'https://polygon-rpc.com',
];
const POLYGON_CHAIN_ID = 137;

async function pickHealthyPolygonRpc(): Promise<ethers.JsonRpcProvider> {
  for (const url of POLYGON_RPC_URLS) {
    try {
      console.log('[송금-로컬] RPC 시도:', url);
      const provider = new ethers.JsonRpcProvider(url, POLYGON_CHAIN_ID);
      const chainId = await provider.getNetwork().then(n => Number(n.chainId));
      if (chainId === POLYGON_CHAIN_ID) {
        console.log('[송금-로컬] RPC 정상:', url);
        return provider;
      }
      console.warn('[송금-로컬] RPC chainId 불일치:', { url, chainId });
    } catch (e: any) {
      const msg = String(e?.message ?? e ?? '').slice(0, 100);
      console.warn('[송금-로컬] RPC 실패:', url, msg);
    }
  }
  throw new Error('No healthy Polygon RPC available');
}

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
];

export interface SendLocalParams {
  privateKey: string;          
  fromAddress: string;
  toAddress: string;
  amount: string;              
  currency: number;            
}

export interface SendLocalResult {
  ok: true;
  txHash: string;
  blockNumber: number;
  network: 'POL';
  currency: number;
}

export type SendLocalError =
  | { ok: false; reason: 'unsupported-currency' }
  | { ok: false; reason: 'rpc-init-failed'; detail: string }
  | { ok: false; reason: 'invalid-private-key' }
  | { ok: false; reason: 'address-mismatch'; expected: string; actual: string }
  | { ok: false; reason: 'broadcast-failed'; detail: string }
  | { ok: false; reason: 'wait-failed'; detail: string };

export async function sendPolygonLocal(
  params: SendLocalParams,
): Promise<SendLocalResult | SendLocalError> {
  const { privateKey, fromAddress, toAddress, amount, currency } = params;

  console.log('[송금-로컬] 시작', {
    from: fromAddress, to: toAddress, amount, currency,
  });

  if (currency !== 16 && currency !== 18) {
    console.warn('[송금-로컬] 지원 안 하는 currency:', currency);
    return { ok: false, reason: 'unsupported-currency' };
  }

  let provider: ethers.JsonRpcProvider;
  try {
    console.log('[송금-로컬] 1/6 RPC provider 헬스체크 시작');
    provider = await pickHealthyPolygonRpc();
  } catch (e: any) {
    console.error('[송금-로컬] RPC 초기화 실패:', e?.message);
    return { ok: false, reason: 'rpc-init-failed', detail: String(e?.message ?? e) };
  }

  let wallet: ethers.Wallet;
  try {
    console.log('[송금-로컬] 2/6 Wallet 생성 (PK → 메모리)');
    wallet = new ethers.Wallet(privateKey, provider);
  } catch {
    console.error('[송금-로컬] PK 형식 오류');
    return { ok: false, reason: 'invalid-private-key' };
  }

  if (wallet.address.toLowerCase() !== fromAddress.toLowerCase()) {
    console.error('[송금-로컬] 주소 mismatch:', { expected: fromAddress, actual: wallet.address });
    return { ok: false, reason: 'address-mismatch', expected: fromAddress, actual: wallet.address };
  }

  let txResponse: ethers.TransactionResponse;

  try {
    if (currency === 16) {

      const valueWei = ethers.parseEther(String(amount));
      console.log('[송금-로컬] 3/6 POL native 송금 준비:', {
        value: amount, valueWei: valueWei.toString(),
      });
      txResponse = await wallet.sendTransaction({
        to: toAddress,
        value: valueWei,
      });
    } else {

      const env = getEnv();
      const contractAddress = env.CONTRACT_ADDRESS_POLYGON;
      console.log('[송금-로컬] 3/6 XRUN ERC-20 송금 준비:', {
        contract: contractAddress, amount,
      });
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, wallet);

      const amountWei = ethers.parseUnits(String(amount), 18);
      txResponse = await contract.transfer(toAddress, amountWei);
    }
    console.log('[송금-로컬] 4/6 broadcast 완료, txHash=', txResponse.hash);
  } catch (e: any) {
    const msg = String(e?.message ?? e ?? 'unknown').slice(0, 300);
    console.error('[송금-로컬] broadcast 실패:', msg);
    return { ok: false, reason: 'broadcast-failed', detail: msg };
  }

  let receipt: ethers.TransactionReceipt | null;
  try {
    console.log('[송금-로컬] 5/6 confirm 대기 (tx.wait(1))...');
    receipt = await txResponse.wait(1);
    if (!receipt) throw new Error('null receipt');
  } catch (e: any) {
    const msg = String(e?.message ?? e ?? 'unknown').slice(0, 300);
    console.error('[송금-로컬] confirm 실패:', msg);
    return { ok: false, reason: 'wait-failed', detail: msg };
  }

  console.log('[송금-로컬] 6/6 완료', {
    txHash: receipt.hash, blockNumber: receipt.blockNumber,
  });

  return {
    ok: true,
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    network: 'POL',
    currency,
  };
}

export function isLocalSendEnabledForUser(email: string | null | undefined): boolean {
  const normEmail = (email ?? '').toLowerCase().trim();
  return normEmail === 'oth-test@example.invalid' || normEmail === 'oth-user@example.invalid';
}

export async function recordOnchainTransfer(params: {
  member: number;
  from: string;
  to: string;
  amount: string;
  currency: number;
  network: 'POL' | 'ETH';
  txHash: string;
  blockNumber?: number;
}): Promise<{ ok: boolean }> {
  try {
    console.log('[송금-로컬] 서버 로그 기록 시도', { txHash: params.txHash });
    const baseUrl = getApiBaseUrl();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: await getAuthHeader(),
    };
    const res = await fetch(`${baseUrl}/recordOnchainTransfer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      console.warn('[송금-로컬] 서버 로그 응답 비정상:', res.status);
      return { ok: false };
    }
    const json = await res.json().catch(() => null);
    const ok = json?.status === 'success';
    console.log('[송금-로컬] 서버 로그 기록 결과:', ok ? '성공' : '실패');
    return { ok };
  } catch (e: any) {
    console.warn('[송금-로컬] 서버 로그 예외:', e?.message);
    return { ok: false };
  }
}

export async function getTransferLimitEnabled(): Promise<boolean> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/transferLimitEnabled`, {
      method: 'GET',
      headers: { Authorization: await getAuthHeader() },
    });
    if (!res.ok) return true;
    const json = await res.json().catch(() => null);
    const enabled = json?.data?.[0]?.enabled;
    console.log('[송금-로컬] 전송제한 토글 상태:', enabled);
    return enabled !== false;
  } catch {
    return true;
  }
}
