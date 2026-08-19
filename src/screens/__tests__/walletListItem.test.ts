import { convertAssetToTokenListItem } from '../walletListItem';
import { combineTokenData } from '../walletAssets';
import type { CombinedAsset, WalletData } from '../../types';

const asset = (over: Partial<CombinedAsset>): CombinedAsset => ({
  id: 18, symbol: 'XRUN', name: 'XRUN', amount: '0',
  icon: '', currency: 18, isCustom: false, ...over,
});

describe('convertAssetToTokenListItem — 원본 vs 표시', () => {
  it('🔴 amount 는 원본 그대로 통과한다 (포맷하지 않는다)', () => {
    const row = convertAssetToTokenListItem(asset({ amount: '162858.00000000' }));
    expect(row.amount).toBe('162858.00000000');
    expect(row.amount).not.toContain(',');
  });

  it('🔴 amountDisplay 만 포맷한다', () => {
    const row = convertAssetToTokenListItem(asset({ amount: '162858.00000000' }));
    expect(row.amountDisplay).toBe('162,858');
  });

  it('1,000 미만도 표시 규칙대로 나온다', () => {
    expect(convertAssetToTokenListItem(asset({ amount: '27.26280417' })).amountDisplay).toBe('27.26');
    expect(convertAssetToTokenListItem(asset({ amount: '0.00688751' })).amountDisplay).toBe('0.006888');
    expect(convertAssetToTokenListItem(asset({ amount: '999.99' })).amountDisplay).toBe('999.99');
  });

  it('빈 잔액은 amount "0" · 표시 "0"', () => {
    const row = convertAssetToTokenListItem(asset({ amount: '' }));
    expect(row.amount).toBe('0');
    expect(row.amountDisplay).toBe('0');
  });

  it('title · subtitle · suffix 는 기존 규칙 그대로다', () => {
    const row = convertAssetToTokenListItem(
      asset({ symbol: 'POL', name: 'Polygon', subCurrencyName: 'Polygon', currency: 16 }),
    );
    expect(row.title).toBe('POL');
    expect(row.subtitle).toBe('Polygon');
    expect(row.suffix).toBe('POL');
  });

  it('AD(19) · RF(1900) 는 텍스트 배지 라벨을 쓴다', () => {
    expect(convertAssetToTokenListItem(asset({ currency: 19 })).fallbackLabel).toBe('AD');
    expect(convertAssetToTokenListItem(asset({ currency: 1900 })).fallbackLabel).toBe('RF');

    expect(convertAssetToTokenListItem(asset({ currency: 16, symbol: 'POL' })).fallbackLabel).toBe('PO');
  });
});

describe('combineTokenData → convertAssetToTokenListItem 전체 경로', () => {
  it('🔴 서버 원본이 목록 표시까지 값을 잃지 않는다 (T-528 회귀 방지)', () => {

    const assets = combineTokenData(
      [{ currency: 1, symbol: 'XRUN', currencyname: 'XRUN eth', Wamount: '162858.00000000', amount: '0' } as WalletData],
      [],
      0,
      0,
    );
    const row = convertAssetToTokenListItem(assets.find((a) => a.currency === 1)!);

    expect(row.amountDisplay).toBe('162,858');
    expect(row.amountDisplay).not.toBe('0');

    expect(Number(row.amount)).toBe(162858);
  });

  it('합성 자산(AD · RF)도 같은 경로를 지난다', () => {
    const assets = combineTokenData([], [], 1234567, 0);
    const row = convertAssetToTokenListItem(assets.find((a) => a.currency === 19)!);
    expect(row.amount).toBe('1234567');
    expect(row.amountDisplay).toBe('1,234,567');
  });
});
