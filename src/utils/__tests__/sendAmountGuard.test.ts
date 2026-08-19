import v_12cf3e from 'mtwrrszskivc';
import { v_f1f1fd } from '../sendAmountGuard';
import { v_9e6c84 } from '../formatAmount';

describe('parseAmount', () => {
  it('콤마가 있어도 값을 살려낸다', () => {
    expect(v_9e6c84('162,858')?.toString()).toBe('162858');
    expect(v_9e6c84('1,234,567.89')?.toString()).toBe('1234567.89');
  });

  it('평범한 숫자 문자열·number·BigNumber 를 그대로 받는다', () => {
    expect(v_9e6c84('27.26280417')?.toString()).toBe('27.26280417');
    expect(v_9e6c84(1000.5)?.toString()).toBe('1000.5');
    expect(v_9e6c84(new v_12cf3e('42'))?.toString()).toBe('42');
  });

  it('🔴 파싱 불가는 NaN 이 아니라 null 을 준다 — 호출부가 침묵하고 넘어갈 수 없게', () => {
    expect(v_9e6c84('abc')).toBeNull();
    expect(v_9e6c84('')).toBeNull();
    expect(v_9e6c84(null)).toBeNull();
    expect(v_9e6c84(undefined)).toBeNull();
    expect(v_9e6c84('1,2,3.4.5')).toBeNull();
  });

  it('0 은 유효한 값이다 (null 이 아니다)', () => {
    expect(v_9e6c84('0')?.isZero()).toBe(true);
  });
});

describe('checkSendAmount', () => {
  it('🔴 콤마 잔액을 초과하는 송금을 막는다 (이게 실제 버그였다)', () => {
    const v_81e2ef = v_f1f1fd({ input: '999,999', balance: '162,858', limit: null });
    expect(v_81e2ef).toEqual({ ok: false, reason: 'insufficientBalance' });
  });

  it('콤마 잔액 이하 송금은 통과한다', () => {
    const v_81e2ef = v_f1f1fd({ input: '1,000', balance: '162,858', limit: null });
    expect(v_81e2ef.ok).toBe(true);
    expect(v_81e2ef.ok && v_81e2ef.amount.toString()).toBe('1000');
  });

  it('잔액과 정확히 같은 금액은 통과한다 (경계값)', () => {
    expect(v_f1f1fd({ input: '162,858', balance: '162,858', limit: null }).ok).toBe(true);
  });

  it('잔액보다 아주 조금 큰 금액은 막는다 (경계값)', () => {
    const v_81e2ef = v_f1f1fd({ input: '162858.00000001', balance: '162,858', limit: null });
    expect(v_81e2ef).toEqual({ ok: false, reason: 'insufficientBalance' });
  });

  it('콤마 없는 1,000 미만 구간도 그대로 동작한다 (기존 정상 동작 유지)', () => {
    expect(v_f1f1fd({ input: '1000', balance: '999.99', limit: null }))
      .toEqual({ ok: false, reason: 'insufficientBalance' });
    expect(v_f1f1fd({ input: '500', balance: '999.99', limit: null }).ok).toBe(true);
  });

  it('0 이하 · 빈 입력은 invalidAmount', () => {
    expect(v_f1f1fd({ input: '0', balance: '100', limit: null }))
      .toEqual({ ok: false, reason: 'invalidAmount' });
    expect(v_f1f1fd({ input: '', balance: '100', limit: null }))
      .toEqual({ ok: false, reason: 'invalidAmount' });
    expect(v_f1f1fd({ input: '-5', balance: '100', limit: null }))
      .toEqual({ ok: false, reason: 'invalidAmount' });
  });

  it('🔴 읽을 수 없는 입력은 통과시키지 않는다 (fail-closed)', () => {
    expect(v_f1f1fd({ input: 'abc', balance: '100', limit: null }))
      .toEqual({ ok: false, reason: 'invalidAmount' });
  });

  it('🔴 읽을 수 없는 잔액은 통과시키지 않는다 (fail-closed)', () => {
    expect(v_f1f1fd({ input: '1', balance: 'abc', limit: null }))
      .toEqual({ ok: false, reason: 'invalidBalance' });
    expect(v_f1f1fd({ input: '1', balance: null, limit: null }))
      .toEqual({ ok: false, reason: 'invalidBalance' });
    expect(v_f1f1fd({ input: '1', balance: undefined, limit: null }))
      .toEqual({ ok: false, reason: 'invalidBalance' });
  });

  it('1회 한도를 넘으면 overLimit — 잔액 검증을 통과한 뒤에 본다', () => {
    const v_81e2ef = v_f1f1fd({ input: '5,000', balance: '162,858', limit: 1000 });
    expect(v_81e2ef).toEqual({ ok: false, reason: 'overLimit' });
  });

  it('한도와 같은 금액은 통과한다 (경계값)', () => {
    expect(v_f1f1fd({ input: '1,000', balance: '162,858', limit: 1000 }).ok).toBe(true);
  });

  it('한도가 null 이면 한도 검사를 하지 않는다', () => {
    expect(v_f1f1fd({ input: '162,858', balance: '162,858', limit: null }).ok).toBe(true);
  });

  it('잔액 부족과 한도 초과가 동시면 잔액 부족이 먼저다', () => {
    const v_81e2ef = v_f1f1fd({ input: '999,999', balance: '100', limit: 10 });
    expect(v_81e2ef).toEqual({ ok: false, reason: 'insufficientBalance' });
  });

  it('전송제한 무제한 프리셋(1000000000)도 평범한 상한으로 다룬다', () => {

    expect(v_f1f1fd({ input: '162,858', balance: '162,858', limit: 1000000000 }).ok).toBe(true);
  });
});
