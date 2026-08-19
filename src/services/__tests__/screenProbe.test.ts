import {
  v_5b16e5,
  v_c980a8,
  v_eae756,
  v_3e9afb,
  v_8bb844,
} from '../screenProbe';

describe('screenProbe', () => {
  beforeEach(() => {
    v_5b16e5('wallet');
  });

  it('등록한 값이 스냅샷에 등록 순서대로 담긴다', () => {
    v_c980a8('wallet', '0|18|amount', '1,234.56 XRUN');
    v_c980a8('wallet', '1|16|amount', '0.00 POL');

    const v_a13bfb = v_3e9afb('wallet');
    expect(v_a13bfb?.entries).toEqual([
      { key: '0|18|amount', value: '1,234.56 XRUN' },
      { key: '1|16|amount', value: '0.00 POL' },
    ]);
  });

  it('같은 값을 다시 등록하면 구독자를 부르지 않는다', () => {
    const v_16dbdb = jest.fn();
    const v_fa04a0 = v_8bb844('wallet', v_16dbdb);

    v_c980a8('wallet', '0|18|amount', '1,234.56 XRUN');
    expect(v_16dbdb).toHaveBeenCalledTimes(1);

    v_c980a8('wallet', '0|18|amount', '1,234.56 XRUN');
    expect(v_16dbdb).toHaveBeenCalledTimes(1);
    v_fa04a0();
  });

  it('값이 달라지면 구독자를 다시 부른다', () => {
    const v_16dbdb = jest.fn();
    const v_fa04a0 = v_8bb844('wallet', v_16dbdb);

    v_c980a8('wallet', '0|18|amount', '0.00 XRUN');
    v_c980a8('wallet', '0|18|amount', '1,234.56 XRUN');

    expect(v_16dbdb).toHaveBeenCalledTimes(2);
    v_fa04a0();
  });

  it('등록 해제하면 스냅샷에서 사라지고 구독자를 부른다', () => {
    v_c980a8('wallet', '0|18|amount', '1,234.56 XRUN');
    const v_16dbdb = jest.fn();
    const v_fa04a0 = v_8bb844('wallet', v_16dbdb);

    v_eae756('wallet', '0|18|amount');

    expect(v_3e9afb('wallet')?.entries).toEqual([]);
    expect(v_16dbdb).toHaveBeenCalledTimes(1);
    v_fa04a0();
  });

  it('없는 키를 해제해도 구독자를 부르지 않는다', () => {
    const v_16dbdb = jest.fn();
    const v_fa04a0 = v_8bb844('wallet', v_16dbdb);

    v_eae756('wallet', 'nope');

    expect(v_16dbdb).not.toHaveBeenCalled();
    v_fa04a0();
  });

  it('reset 하면 값이 비고 새 sessionId 가 발급된다', () => {
    v_c980a8('wallet', '0|18|amount', '1,234.56 XRUN');
    const v_ea719c = v_3e9afb('wallet')?.sessionId;

    const v_486a80 = v_5b16e5('wallet');

    expect(v_3e9afb('wallet')?.entries).toEqual([]);
    expect(v_486a80).not.toBe(v_ea719c);
  });

  it('구독 해제 후에는 부르지 않는다', () => {
    const v_16dbdb = jest.fn();
    const v_fa04a0 = v_8bb844('wallet', v_16dbdb);
    v_fa04a0();

    v_c980a8('wallet', '0|18|amount', 'x');

    expect(v_16dbdb).not.toHaveBeenCalled();
  });

  it('화면이 다르면 서로 간섭하지 않는다', () => {
    v_5b16e5('other');
    v_c980a8('wallet', 'a', '1');
    v_c980a8('other', 'b', '2');

    expect(v_3e9afb('wallet')?.entries).toEqual([{ key: 'a', value: '1' }]);
    expect(v_3e9afb('other')?.entries).toEqual([{ key: 'b', value: '2' }]);
  });
});
