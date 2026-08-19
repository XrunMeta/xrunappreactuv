import { v_100fd8 } from '../fiatValue';

const v_b34f99 = { KR: 1400, IDR: 16000 };

describe('formatFiatValue', () => {
  it('🔴 콤마가 든 잔액도 환산한다 (이게 실제 버그였다)', () => {
    const v_81e2ef = v_100fd8({ amount: '162,858', xrunPriceKrw: 1.5, lang: 'ko', rates: v_b34f99 });
    expect(v_81e2ef).toBe('KRW 244,287');
    expect(v_81e2ef).not.toContain('NaN');
  });

  it('콤마 없는 값도 같은 결과를 낸다', () => {
    expect(v_100fd8({ amount: '162858', xrunPriceKrw: 1.5, lang: 'ko', rates: v_b34f99 }))
      .toBe('KRW 244,287');
  });

  it('ko 는 KRW, 소수점 없음 + 천단위 콤마', () => {
    expect(v_100fd8({ amount: '1000', xrunPriceKrw: 2, lang: 'ko', rates: v_b34f99 }))
      .toBe('KRW 2,000');
  });

  it('id 는 IDR — USD 를 거쳐 환산', () => {

    expect(v_100fd8({ amount: '1,000', xrunPriceKrw: 1.4, lang: 'id', rates: v_b34f99 }))
      .toBe('IDR 16,000');
  });

  it('그 외 언어는 USD, 소수점 2자리 고정', () => {

    expect(v_100fd8({ amount: '1,000', xrunPriceKrw: 1.4, lang: 'en', rates: v_b34f99 }))
      .toBe('USD 1.00');
  });

  it('KRW 환율이 없으면 USD 는 0 으로 둔다 (기존 동작 유지)', () => {
    expect(v_100fd8({ amount: '1,000', xrunPriceKrw: 1.4, lang: 'en', rates: { IDR: 16000 } }))
      .toBe('USD 0.00');
  });

  it('🔴 읽을 수 없는 잔액은 NaN 문자열을 만들지 않고 null 을 준다', () => {
    for (const v_0af197 of ['abc', '', null, undefined]) {
      expect(v_100fd8({ amount: v_0af197, xrunPriceKrw: 1.5, lang: 'ko', rates: v_b34f99 })).toBeNull();
    }
  });

  it('가격이 없으면 null — 0 원으로 단정하지 않는다', () => {
    expect(v_100fd8({ amount: '1,000', xrunPriceKrw: null, lang: 'ko', rates: v_b34f99 })).toBeNull();
    expect(v_100fd8({ amount: '1,000', xrunPriceKrw: 0, lang: 'ko', rates: v_b34f99 })).toBeNull();
  });

  it('잔액 0 은 유효하다 — 0 으로 환산한다', () => {
    expect(v_100fd8({ amount: '0', xrunPriceKrw: 1.5, lang: 'ko', rates: v_b34f99 }))
      .toBe('KRW 0');
  });

  it('언어 코드는 앞부분만 본다 (ko-KR · id-ID)', () => {
    expect(v_100fd8({ amount: '1000', xrunPriceKrw: 2, lang: 'ko-KR', rates: v_b34f99 }))
      .toBe('KRW 2,000');
    expect(v_100fd8({ amount: '1000', xrunPriceKrw: 1.4, lang: 'ID-id', rates: v_b34f99 }))
      .toBe('IDR 16,000');
  });

  it('환율이 문자열로 들어와도 처리한다 (API 응답 형태)', () => {
    expect(v_100fd8({ amount: '1000', xrunPriceKrw: 1.4, lang: 'en', rates: { KR: '1400', IDR: '16000' } }))
      .toBe('USD 1.00');
  });
});
