import { v_e830d4, v_480e99, v_bd4c8c } from '../rpcBalance';

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

describe('mergeRpcBalances', () => {
  const v_4552ca = [
    { currency: 1, subcurrency: 5000, amount: '0.00000000', Wamount: '0.00000000' },
    { currency: 2, subcurrency: 5000, amount: '0.00000000', Wamount: '0.00000000' },
    { currency: 16, subcurrency: 5200, amount: '0.00688751', Wamount: '0.00688751' },
    { currency: 18, subcurrency: 5200, amount: '27.26280417', Wamount: '27.26280417' },
  ];

  it('status ok 인 통화만 amount/Wamount 를 덮어쓴다', () => {
    const { cards: v_a448ad } = v_bd4c8c(v_4552ca, [
      { currency: 1, rpcAmount: '162858.0', status: 'ok' },
      { currency: 2, rpcAmount: null, status: 'rpc_error' },
    ]);
    expect(v_a448ad[0].amount).toBe('162858.0');
    expect(v_a448ad[0].Wamount).toBe('162858.0');

    expect(v_a448ad[1].amount).toBe('0.00000000');
  });

  it('갱신 성공한 통화 목록을 함께 돌려준다 (재시도 종료 판정용)', () => {
    const { okCurrencies: v_8cab55 } = v_bd4c8c(v_4552ca, [
      { currency: 1, rpcAmount: '1.0', status: 'ok' },
      { currency: 16, rpcAmount: null, status: 'rpc_error' },
      { currency: 18, rpcAmount: '2.0', status: 'ok' },
    ]);
    expect(v_8cab55.sort()).toEqual([1, 18]);
  });

  it('AD XRUN(subcurrency=5100) row 는 같은 currency 여도 덮어쓰지 않는다', () => {
    const v_dd3980 = [
      { currency: 18, subcurrency: 5200, amount: '27.0', Wamount: '27.0' },
      { currency: 18, subcurrency: 5100, amount: '105.2', Wamount: '105.2' },
    ];
    const { cards: v_a448ad } = v_bd4c8c(v_dd3980, [
      { currency: 18, rpcAmount: '99.9', status: 'ok' },
    ]);
    expect(v_a448ad[0].amount).toBe('99.9');
    expect(v_a448ad[1].amount).toBe('105.2'); 
  });

  it('값이 같으면 원본 객체 참조를 유지한다 (불필요한 리렌더 방지)', () => {
    const { cards: v_a448ad } = v_bd4c8c(v_4552ca, [
      { currency: 18, rpcAmount: '27.26280417', status: 'ok' },
    ]);
    expect(v_a448ad[3]).toBe(v_4552ca[3]);
  });

  it('빈 응답·잘못된 형식이면 원본 배열을 그대로 돌려준다', () => {
    expect(v_bd4c8c(v_4552ca, []).cards).toBe(v_4552ca);
    expect(v_bd4c8c(v_4552ca, undefined).cards).toBe(v_4552ca);
    expect(v_bd4c8c(v_4552ca, null as any).okCurrencies).toEqual([]);
  });

  it('조회 대상 밖 통화(19 AD XRUN 등)는 무시한다', () => {
    const { cards: v_a448ad, okCurrencies: v_8cab55 } = v_bd4c8c(v_4552ca, [
      { currency: 19, rpcAmount: '500', status: 'ok' },
    ]);
    expect(v_a448ad).toBe(v_4552ca);
    expect(v_8cab55).toEqual([]);
  });
});
