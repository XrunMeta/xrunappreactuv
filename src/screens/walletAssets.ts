

import type { CombinedAsset, CustomToken, WalletData } from '../types';
import { isAfterlifeEnabled } from '../utils/afterlifeWhitelist';

export const AFTERLIFE_CURRENCY = 1901;

function pickRawAmount(...candidates: Array<string | number | null | undefined>): string {
  for (const c of candidates) {
    if (c === null || c === undefined) continue;
    const s = String(c);
    if (s !== '') return s;
  }
  return '0';
}

export function combineTokenData(
  walletData: WalletData[],
  customTokens: CustomToken[],
  adXrunAmount: number,
  referralAmount: number,
  userEmail?: string | null,
): CombinedAsset[] {

  const walletAssets: CombinedAsset[] = walletData.map((item) => ({
    id: item.currency,
    symbol: item.symbol,
    name: item.currencyname,
    subCurrencyName: item.subCurrencyName,
    amount: pickRawAmount(item.Wamount, item.amount),
    icon: item.file || '',
    currency: item.currency,
    isCustom: false,
    contractAddress: item.address,
    subcurrency: item.subcurrency,
    originalData: item,
  }));

  const primaryPolygonAddr =
    walletAssets.find((w) => Number(w.currency) === 1)?.contractAddress?.trim() || '';
  if (primaryPolygonAddr) {
    walletAssets.forEach((a) => {
      if (![16, 18].includes(Number(a.currency))) return;
      const cur = (a.contractAddress || '').trim();
      if (cur) return;
      a.contractAddress = primaryPolygonAddr;
      if (a.originalData && typeof a.originalData === 'object') {
        a.originalData = { ...a.originalData, address: primaryPolygonAddr };
      }
    });
  }

  const customAssets: CombinedAsset[] = customTokens.map((token) => {
    const matchingWalletData = walletData.find((wallet) => wallet.currency === token.currency);

    return {
      id: token.currency,
      symbol: token.symbol,
      name: token.name,
      amount: pickRawAmount(token.amount),
      icon: matchingWalletData
        ? `data:image/png;base64,${matchingWalletData.symbolimg?.replace(/(\r\n|\n|\r)/gm, '') || ''}`
        : 'https://via.placeholder.com/24',
      currency: token.currency,
      subCurrencyName: token.subCurrencyName,
      isCustom: true,
      contractAddress: token.contractAddress,
      decimals: token.decimals,
      subcurrency: matchingWalletData?.subcurrency,
      originalData: token,
    };
  });

  const allAssets = [...walletAssets, ...customAssets];

  const adXrunItem: CombinedAsset = {
    id: 19,
    symbol: 'XRUN',
    name: 'AD XRUN',
    amount: pickRawAmount(adXrunAmount),
    icon: require('../../assets/ad-round-logo.png'),
    currency: 19,
    isCustom: false,
    subCurrencyName: 'AD XRUN',
    contractAddress: '',
    subcurrency: undefined,
    originalData: undefined,
  };
  allAssets.push(adXrunItem);

  const rfItem: CombinedAsset = {
    id: 1900,
    symbol: 'XRUN',
    name: 'REFERAL XRUN',
    amount: pickRawAmount(referralAmount),
    icon: '__RF__' as any,
    currency: 1900,
    isCustom: false,
    subCurrencyName: 'REFERAL XRUN',
    contractAddress: '',
    subcurrency: undefined,
    originalData: undefined,
  };
  allAssets.push(rfItem);

  if (isAfterlifeEnabled(userEmail)) {
    const afterlifeItem: CombinedAsset = {
      id: AFTERLIFE_CURRENCY,
      symbol: 'Afterlife',
      name: 'Afterlife',
      amount: '0',
      icon: '__AL__' as any,
      currency: AFTERLIFE_CURRENCY,
      isCustom: false,
      subCurrencyName: 'Afterlife',
      contractAddress: '',
      subcurrency: undefined,
      originalData: undefined,
    };
    allAssets.push(afterlifeItem);
  }

  const uniqueAssets = allAssets.reduce((acc: CombinedAsset[], current: CombinedAsset) => {
    const existingIndex = acc.findIndex((item) => {

      if (!current.isCustom && !item.isCustom) {
        return item.currency === current.currency;
      }

      if (current.isCustom && item.isCustom) {
        return item.contractAddress?.toLowerCase() === current.contractAddress?.toLowerCase();
      }

      return (
        item.currency === current.currency ||
        (item.contractAddress?.toLowerCase() === current.contractAddress?.toLowerCase() &&
          current.contractAddress &&
          item.contractAddress)
      );
    });

    if (existingIndex === -1) {
      return [...acc, current];
    } else {

      if (!current.isCustom && acc[existingIndex].isCustom) {
        acc[existingIndex] = current;
      }
      return acc;
    }
  }, []);

  const sortedAssets = uniqueAssets.sort((a, b) => {
    const priorityOrder = [18, 16, 19, 1900, AFTERLIFE_CURRENCY, 1, 2]; 

    const aPriority = priorityOrder.indexOf(a.currency);
    const bPriority = priorityOrder.indexOf(b.currency);

    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }

    if (aPriority !== -1) return -1;

    if (bPriority !== -1) return 1;

    return a.symbol.localeCompare(b.symbol);
  });

  return sortedAssets;
}
