import { isRpcRefetchableCurrency, pickRpcBalance, mergeRpcBalances } from '../rpcBalance';

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

describe('mergeRpcBalances', () => {
  const cards = [
    { currency: 1, subcurrency: 5000, amount: '0.00000000', Wamount: '0.00000000' },
    { currency: 2, subcurrency: 5000, amount: '0.00000000', Wamount: '0.00000000' },
    { currency: 16, subcurrency: 5200, amount: '0.00688751', Wamount: '0.00688751' },
    { currency: 18, subcurrency: 5200, amount: '27.26280417', Wamount: '27.26280417' },
  ];

  it('status ok 인 통화만 amount/Wamount 를 덮어쓴다', () => {
    const { cards: next } = mergeRpcBalances(cards, [
      { currency: 1, rpcAmount: '162858.0', status: 'ok' },
      { currency: 2, rpcAmount: null, status: 'rpc_error' },
    ]);
    expect(next[0].amount).toBe('162858.0');
    expect(next[0].Wamount).toBe('162858.0');

    expect(next[1].amount).toBe('0.00000000');
  });

  it('갱신 성공한 통화 목록을 함께 돌려준다 (재시도 종료 판정용)', () => {
    const { okCurrencies } = mergeRpcBalances(cards, [
      { currency: 1, rpcAmount: '1.0', status: 'ok' },
      { currency: 16, rpcAmount: null, status: 'rpc_error' },
      { currency: 18, rpcAmount: '2.0', status: 'ok' },
    ]);
    expect(okCurrencies.sort()).toEqual([1, 18]);
  });

  it('AD XRUN(subcurrency=5100) row 는 같은 currency 여도 덮어쓰지 않는다', () => {
    const withAdXrun = [
      { currency: 18, subcurrency: 5200, amount: '27.0', Wamount: '27.0' },
      { currency: 18, subcurrency: 5100, amount: '105.2', Wamount: '105.2' },
    ];
    const { cards: next } = mergeRpcBalances(withAdXrun, [
      { currency: 18, rpcAmount: '99.9', status: 'ok' },
    ]);
    expect(next[0].amount).toBe('99.9');
    expect(next[1].amount).toBe('105.2'); 
  });

  it('값이 같으면 원본 객체 참조를 유지한다 (불필요한 리렌더 방지)', () => {
    const { cards: next } = mergeRpcBalances(cards, [
      { currency: 18, rpcAmount: '27.26280417', status: 'ok' },
    ]);
    expect(next[3]).toBe(cards[3]);
  });

  it('빈 응답·잘못된 형식이면 원본 배열을 그대로 돌려준다', () => {
    expect(mergeRpcBalances(cards, []).cards).toBe(cards);
    expect(mergeRpcBalances(cards, undefined).cards).toBe(cards);
    expect(mergeRpcBalances(cards, null as any).okCurrencies).toEqual([]);
  });

  it('조회 대상 밖 통화(19 AD XRUN 등)는 무시한다', () => {
    const { cards: next, okCurrencies } = mergeRpcBalances(cards, [
      { currency: 19, rpcAmount: '500', status: 'ok' },
    ]);
    expect(next).toBe(cards);
    expect(okCurrencies).toEqual([]);
  });
});
