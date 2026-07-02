

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

export function hasPendingWallets(): boolean {
  return _pendingWallets !== null && _pendingWallets.length > 0;
}

const POLYGON_RPC_URLS = [
  'https://polygon-bor-rpc.publicnode.com',
  'https://polygon.llamarpc.com',
  'https://polygon.drpc.org',
  'https://1rpc.io/matic',
  'https://polygon-rpc.com',
];
const ETHEREUM_RPC_URLS = [
  'https://ethereum-rpc.publicnode.com',
  'https://eth.llamarpc.com',
  'https://eth.drpc.org',
  'https://1rpc.io/eth',
  'https://rpc.ankr.com/eth',
];
const POLYGON_CHAIN_ID = 137;
const ETHEREUM_CHAIN_ID = 1;

type ChainNetwork = 'POL' | 'ETH';

interface ChainConfig {
  rpcUrls: string[];
  chainId: number;
  network: ChainNetwork;
}

const CHAIN_BY_CURRENCY: Record<number, ChainConfig> = {
  1: { rpcUrls: ETHEREUM_RPC_URLS, chainId: ETHEREUM_CHAIN_ID, network: 'ETH' },  
  2: { rpcUrls: ETHEREUM_RPC_URLS, chainId: ETHEREUM_CHAIN_ID, network: 'ETH' },  
  16: { rpcUrls: POLYGON_RPC_URLS, chainId: POLYGON_CHAIN_ID, network: 'POL' },   
  18: { rpcUrls: POLYGON_RPC_URLS, chainId: POLYGON_CHAIN_ID, network: 'POL' },   
};

async function pickHealthyRpc(config: ChainConfig): Promise<ethers.JsonRpcProvider> {
  for (const url of config.rpcUrls) {
    try {
      console.log(`[송금-로컬] RPC 시도 (${config.network}):`, url);
      const provider = new ethers.JsonRpcProvider(url, config.chainId);
      const chainId = await provider.getNetwork().then(n => Number(n.chainId));
      if (chainId === config.chainId) {
        console.log(`[송금-로컬] RPC 정상 (${config.network}):`, url);
        return provider;
      }
      console.warn(`[송금-로컬] RPC chainId 불일치 (${config.network}):`, { url, chainId });
    } catch (e: any) {
      const msg = String(e?.message ?? e ?? '').slice(0, 100);
      console.warn(`[송금-로컬] RPC 실패 (${config.network}):`, url, msg);
    }
  }
  throw new Error(`No healthy ${config.network} RPC available`);
}

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address owner) view returns (uint256)',
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
  network: ChainNetwork;
  currency: number;
}

export type SendLocalError =
  | { ok: false; reason: 'unsupported-currency' }
  | { ok: false; reason: 'rpc-init-failed'; detail: string }
  | { ok: false; reason: 'invalid-private-key' }
  | { ok: false; reason: 'address-mismatch'; expected: string; actual: string }
  | { ok: false; reason: 'broadcast-failed'; detail: string }
  | { ok: false; reason: 'wait-failed'; detail: string };

export async function sendOnchainLocal(
  params: SendLocalParams,
): Promise<SendLocalResult | SendLocalError> {
  const { privateKey, fromAddress, toAddress, amount, currency } = params;

  console.log('[송금-로컬] 시작', {
    from: fromAddress, to: toAddress, amount, currency,
  });

  const chainConfig = CHAIN_BY_CURRENCY[currency];
  if (!chainConfig) {
    console.warn('[송금-로컬] 지원 안 하는 currency:', currency);
    return { ok: false, reason: 'unsupported-currency' };
  }
  console.log('[송금-로컬] 체인 결정:', chainConfig.network);

  let provider: ethers.JsonRpcProvider;
  try {
    console.log('[송금-로컬] 1/6 RPC provider 헬스체크 시작');
    provider = await pickHealthyRpc(chainConfig);
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
  const isNative = currency === 2 || currency === 16;

  if (!isNative) {
    try {
      const env = getEnv();
      const tokenAddr = currency === 1 ? env.CONTRACT_ADDRESS_ETH : env.CONTRACT_ADDRESS_POLYGON;
      const tokenContract = new ethers.Contract(tokenAddr, ERC20_ABI, provider);
      const [nativeBal, gasPrice, tokenBal, tokenDecimals] = await Promise.all([
        provider.getBalance(wallet.address),
        provider.getFeeData().then(d => d.gasPrice ?? d.maxFeePerGas ?? 0n),
        tokenContract.balanceOf(wallet.address) as Promise<bigint>,
        tokenContract.decimals().then((n: any) => Number(n)).catch(() => 18),
      ]);

      const requiredAmount = ethers.parseUnits(String(amount), tokenDecimals);
      if (tokenBal < requiredAmount) {
        const tokenName = currency === 1 || currency === 18 ? 'XRUN' : 'TOKEN';
        const haveFmt = Number(ethers.formatUnits(tokenBal, tokenDecimals)).toFixed(4);
        const needFmt = Number(ethers.formatUnits(requiredAmount, tokenDecimals)).toFixed(4);
        console.error(`[송금-로컬] 토큰 잔액 부족: ${tokenName} 보유 ${haveFmt} < 필요 ${needFmt}`);
        return {
          ok: false,
          reason: 'broadcast-failed',
          detail: `${tokenName} 잔액이 부족해요.\n보유: ${haveFmt} ${tokenName} / 필요: ${needFmt} ${tokenName}`,
        };
      }

      const estimatedFee = BigInt(gasPrice) * 130_000n;
      if (nativeBal < estimatedFee) {
        const nativeName = currency === 1 ? 'ETH' : 'POL';
        const needFmt = Number(ethers.formatEther(estimatedFee)).toFixed(6);
        const haveFmt = Number(ethers.formatEther(nativeBal)).toFixed(6);
        console.error(`[송금-로컬] 가스비 부족: ${nativeName} 보유 ${haveFmt} < 필요 ${needFmt}`);
        return {
          ok: false,
          reason: 'broadcast-failed',
          detail: '송금에 필요한 네트워크 수수료가 부족해요.\n관리자가 곧 처리해드릴 예정이니\n잠시 후 다시 시도해주세요.',
        };
      }
    } catch (gasErr: any) {
      console.warn('[송금-로컬] 잔액/가스 사전 체크 실패, broadcast 시도 진행:', gasErr?.message);
    }
  }

  try {
    if (isNative) {
      const tokenName = currency === 2 ? 'ETH' : 'POL';
      const valueWei = ethers.parseEther(String(amount));
      console.log(`[송금-로컬] 3/6 ${tokenName} native 송금 준비:`, {
        value: amount, valueWei: valueWei.toString(),
      });
      txResponse = await wallet.sendTransaction({
        to: toAddress,
        value: valueWei,
      });
    } else {

      const env = getEnv();
      const contractAddress = currency === 1 ? env.CONTRACT_ADDRESS_ETH : env.CONTRACT_ADDRESS_POLYGON;
      console.log(`[송금-로컬] 3/6 XRUN ERC-20 송금 준비 (${chainConfig.network}):`, {
        contract: contractAddress, amount,
      });
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, wallet);
      const amountWei = ethers.parseUnits(String(amount), 18);
      txResponse = await contract.transfer(toAddress, amountWei);
    }
    console.log('[송금-로컬] 4/6 broadcast 완료, txHash=', txResponse.hash);
  } catch (e: any) {
    const msg = String(e?.message ?? e ?? 'unknown').slice(0, 300);

    if (/insufficient funds/i.test(msg)) {
      console.error('[송금-로컬] 가스비 부족 broadcast 실패');
      return {
        ok: false,
        reason: 'broadcast-failed',
        detail: '송금에 필요한 네트워크 수수료가 부족해요.\n관리자가 곧 처리해드릴 예정이니\n잠시 후 다시 시도해주세요.',
      };
    }
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
    txHash: receipt.hash, blockNumber: receipt.blockNumber, network: chainConfig.network,
  });

  return {
    ok: true,
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    network: chainConfig.network,
    currency,
  };
}

export const sendPolygonLocal = sendOnchainLocal;

export function isLocalSendEnabledForUser(email: string | null | undefined): boolean {
  const LOCAL_SEND_DEV_EMAILS = ['oth-test@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-staff@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid'];
  const normEmail = (email ?? '').toLowerCase().trim();
  return LOCAL_SEND_DEV_EMAILS.includes(normEmail);
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

