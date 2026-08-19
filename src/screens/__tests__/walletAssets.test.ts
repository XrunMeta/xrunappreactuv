import { combineTokenData } from '../walletAssets';
import type { CustomToken, WalletData } from '../../types';

const wallet = (over: Partial<WalletData>): WalletData =>
  ({ currency: 18, symbol: 'XRUN', currencyname: 'XRUN', amount: '0', Wamount: '0', ...over }) as WalletData;

describe('combineTokenData — amount 원본 불변식', () => {
  it('🔴 출력의 amount 에는 콤마가 없다 (표시 포맷이 섞여 들어오면 실패한다)', () => {
    const assets = combineTokenData(
      [
        wallet({ currency: 18, Wamount: '162858.00000000' }),
        wallet({ currency: 1, symbol: 'XRUN', currencyname: 'XRUN eth', Wamount: '1234567.89' }),
        wallet({ currency: 16, symbol: 'POL', currencyname: 'Polygon', Wamount: '27.26280417' }),
      ],
      [],
      9_999_999,
      1_000_000,
    );

    expect(assets.length).toBeGreaterThan(0);
    for (const a of assets) {
      expect(a.amount).not.toContain(',');

      expect(Number.isNaN(Number(a.amount))).toBe(false);
    }
  });

  it('잔액을 절삭하지 않고 원본 그대로 넘긴다', () => {
    const [a] = combineTokenData([wallet({ currency: 18, Wamount: '162858.00000000' })], [], 0, 0);
    expect(a.amount).toBe('162858.00000000');
  });

  it('Wamount 가 우선, 없으면 amount, 둘 다 없으면 "0"', () => {
    const byW = combineTokenData([wallet({ currency: 18, Wamount: '10', amount: '99' })], [], 0, 0);
    expect(byW.find((x) => x.currency === 18)?.amount).toBe('10');

    const byA = combineTokenData([wallet({ currency: 18, Wamount: '', amount: '99' })], [], 0, 0);
    expect(byA.find((x) => x.currency === 18)?.amount).toBe('99');

    const neither = combineTokenData([wallet({ currency: 18, Wamount: '', amount: '' })], [], 0, 0);
    expect(neither.find((x) => x.currency === 18)?.amount).toBe('0');
  });

  it('AD XRUN(19) · RF(1900) 합성 잔액도 원본 문자열이다', () => {
    const assets = combineTokenData([], [], 1234567, 89012);
    expect(assets.find((a) => a.currency === 19)?.amount).toBe('1234567');
    expect(assets.find((a) => a.currency === 1900)?.amount).toBe('89012');
  });

  it('커스텀 토큰 잔액도 원본 그대로다', () => {
    const token = {
      id: 'c1', contractAddress: '0xabc', symbol: 'TST', name: 'Test',
      amount: '5000.5', decimals: 18, icon: '', currency: 77, address: '0xwallet',
    } as CustomToken;
    const assets = combineTokenData([], [token], 0, 0);
    expect(assets.find((a) => a.currency === 77)?.amount).toBe('5000.5');
  });
});

describe('combineTokenData — 기존 동작 보존', () => {
  it('우선순위 정렬을 유지한다 (18 · 16 · 19 · 1900 · 1 · 2)', () => {
    const assets = combineTokenData(
      [
        wallet({ currency: 2, symbol: 'ETH', currencyname: 'Ethereum' }),
        wallet({ currency: 1, symbol: 'XRUN', currencyname: 'XRUN eth' }),
        wallet({ currency: 16, symbol: 'POL', currencyname: 'Polygon' }),
        wallet({ currency: 18, symbol: 'XRUN', currencyname: 'XRUN' }),
      ],
      [],
      0,
      0,
    );
    expect(assets.map((a) => a.currency)).toEqual([18, 16, 19, 1900, 1, 2]);
  });

  it('AD XRUN 과 RF 를 항상 합성해 넣는다', () => {
    const assets = combineTokenData([], [], 0, 0);
    expect(assets.find((a) => a.currency === 19)?.name).toBe('AD XRUN');
    expect(assets.find((a) => a.currency === 1900)?.name).toBe('REFERAL XRUN');
  });

  it('같은 currency 는 하나로 합친다', () => {
    const assets = combineTokenData(
      [wallet({ currency: 18, Wamount: '1' }), wallet({ currency: 18, Wamount: '2' })],
      [],
      0,
      0,
    );
    expect(assets.filter((a) => a.currency === 18)).toHaveLength(1);
  });

  it('currency 1 의 주소를 16 · 18 에 전파한다 (주소 비어 있을 때만)', () => {
    const assets = combineTokenData(
      [
        wallet({ currency: 1, address: '0xPRIMARY' }),
        wallet({ currency: 16, address: '' }),
        wallet({ currency: 18, address: '0xOWN' }),
      ],
      [],
      0,
      0,
    );
    expect(assets.find((a) => a.currency === 16)?.contractAddress).toBe('0xPRIMARY');

    expect(assets.find((a) => a.currency === 18)?.contractAddress).toBe('0xOWN');
  });
});
