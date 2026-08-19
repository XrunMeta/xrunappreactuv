

import type { CombinedAsset } from '../types';
import { getTokenIcon } from '../constants/tokenMeta';
import { fmtBalance } from '../utils/formatAmount';

const WALLET_LIST_DARK_DISKS = new Set(['#000000', '#111111', '#25292C', '#8347E6']);

function getWalletListDiskBackground(asset: CombinedAsset): string {
  const sym = (asset.symbol || '').toUpperCase();
  const sub = (asset.subCurrencyName || asset.name || '').toLowerCase();
  if (sym === 'XRUN' && sub.includes('ethereum')) {
    return '#FFFFFF';
  }
  switch (asset.currency) {
    case 1:
      return '#000000';
    case 2:
      return '#EFF4F5';
    case 11:
      return '#EFF4F5';
    case 16:
      return '#8347E6';
    case 18:
      return '#111111';
    case 19:
      return '#25292C';
    case 1900:

      return '#000000';
    default:
      return '#EFF4F5';
  }
}

function resolveWalletListIconSource(asset: CombinedAsset): any | null {
  const sym = (asset.symbol || '').toUpperCase();
  const sub = (asset.subCurrencyName || asset.name || '').toLowerCase();

  if (asset.currency === 1900 || asset.currency === 19) {
    return null;
  }
  if (sym === 'ETH' || asset.currency === 2) {
    if (typeof asset.icon === 'string' && /^https?:\/\//.test(asset.icon.trim())) {
      return { uri: asset.icon.trim() };
    }
    return require('../../assets/images/ethereum_thumb.png');
  }
  if (sym === 'POL' || asset.currency === 16) {
    return getTokenIcon('POL');
  }
  if (sym === 'XRUN') {
    if (sub.includes('ethereum')) {
      return getTokenIcon('XRUN', 'Ethereum');
    }
    return require('../../assets/xrun-round-logo.png');
  }

  if (typeof asset.icon === 'string' && /^https?:\/\//.test(asset.icon.trim())) {
    return { uri: asset.icon.trim() };
  }
  return null;
}

export interface TokenListItemData extends CombinedAsset {
  title: string;
  subtitle: string;

  amount: string;

  amountDisplay: string;
  suffix?: string;
  iconSource?: any;
  fallbackLabel?: string;
  fallbackColors?: {
    background: string;
    text: string;
  };

  listIndex?: number;
}

export function convertAssetToTokenListItem(asset: CombinedAsset): TokenListItemData {
  const diskBg = getWalletListDiskBackground(asset);
  const iconSource = resolveWalletListIconSource(asset);
  const textOnDisk = WALLET_LIST_DARK_DISKS.has(diskBg) ? '#FFFFFF' : '#343434';

  return {
    ...asset,
    title: asset.symbol,
    subtitle: asset.subCurrencyName || asset.name,

    amount: asset.amount || '0',
    amountDisplay: fmtBalance(asset.amount),
    suffix: asset.symbol,
    iconSource,

    fallbackLabel:
      asset.currency === 1900 ? 'RF'
      : asset.currency === 19 ? 'AD'
      : asset.symbol.slice(0, 2).toUpperCase(),
    fallbackColors: {
      background: diskBg,
      text: textOnDisk,
    },
  };
}

export function resolveDiskColors(asset: CombinedAsset): { background: string; text: string } {
  const background = getWalletListDiskBackground(asset);
  return {
    background,
    text: WALLET_LIST_DARK_DISKS.has(background) ? '#FFFFFF' : '#343434',
  };
}
