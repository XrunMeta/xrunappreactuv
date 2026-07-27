import { isRpcRefetchableCurrency, pickRpcBalance } from '../rpcBalance';

describe('isRpcRefetchableCurrency', () => {
  it('온체인 조회가 가능한 통화(1·2·16·18)는 true', () => {
    expect(isRpcRefetchableCurrency(1)).toBe(true);
    expect(isRpcRefetchableCurrency(2)).toBe(true);
    expect(isRpcRefetchableCurrency(16)).toBe(true);
    expect(isRpcRefetchableCurrency(18)).toBe(true);
  });

  it('AD XRUN(19) 등 합성 자산은 false', () => {
    expect(isRpcRefetchableCurrency(19)).toBe(false);
    expect(isRpcRefetchableCurrency(undefined)).toBe(false);
  });
});

describe('pickRpcBalance', () => {
  const results = [
    { currency: 1, address: '0xA', rpcAmount: '10.5', status: 'ok' },
    { currency: 2, address: '0xA', rpcAmount: null, status: 'rpc_error' },
    { currency: 18, address: '0xB', rpcAmount: '113.43000000', status: 'ok' },
  ];

  it('해당 통화의 정상 잔액을 반환한다', () => {
    expect(pickRpcBalance(results, 18)).toBe('113.43000000');
  });

  it('status 가 ok 가 아니면 null (기존 값 폴백용)', () => {
    expect(pickRpcBalance(results, 2)).toBeNull();
  });

  it('응답에 없는 통화는 null', () => {
    expect(pickRpcBalance(results, 16)).toBeNull();
  });

  it('응답이 비었거나 형식이 다르면 null', () => {
    expect(pickRpcBalance([], 18)).toBeNull();
    expect(pickRpcBalance(undefined, 18)).toBeNull();
  });
});
