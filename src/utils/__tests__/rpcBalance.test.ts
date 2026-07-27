import { v_e830d4, v_480e99 } from '../rpcBalance';

describe('isRpcRefetchableCurrency', () => {
  it('온체인 조회가 가능한 통화(1·2·16·18)는 true', () => {
    expect(v_e830d4(1)).toBe(true);
    expect(v_e830d4(2)).toBe(true);
    expect(v_e830d4(16)).toBe(true);
    expect(v_e830d4(18)).toBe(true);
  });

  it('AD XRUN(19) 등 합성 자산은 false', () => {
    expect(v_e830d4(19)).toBe(false);
    expect(v_e830d4(undefined)).toBe(false);
  });
});

describe('pickRpcBalance', () => {
  const v_a7f568 = [
    { currency: 1, address: '0xA', rpcAmount: '10.5', status: 'ok' },
    { currency: 2, address: '0xA', rpcAmount: null, status: 'rpc_error' },
    { currency: 18, address: '0xB', rpcAmount: '113.43000000', status: 'ok' },
  ];

  it('해당 통화의 정상 잔액을 반환한다', () => {
    expect(v_480e99(v_a7f568, 18)).toBe('113.43000000');
  });

  it('status 가 ok 가 아니면 null (기존 값 폴백용)', () => {
    expect(v_480e99(v_a7f568, 2)).toBeNull();
  });

  it('응답에 없는 통화는 null', () => {
    expect(v_480e99(v_a7f568, 16)).toBeNull();
  });

  it('응답이 비었거나 형식이 다르면 null', () => {
    expect(v_480e99([], 18)).toBeNull();
    expect(v_480e99(undefined, 18)).toBeNull();
  });
});
