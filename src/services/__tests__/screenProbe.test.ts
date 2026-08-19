import {
  probeReset,
  probeRegister,
  probeUnregister,
  probeSnapshot,
  probeSubscribe,
} from '../screenProbe';

describe('screenProbe', () => {
  beforeEach(() => {
    probeReset('wallet');
  });

  it('등록한 값이 스냅샷에 등록 순서대로 담긴다', () => {
    probeRegister('wallet', '0|18|amount', '1,234.56 XRUN');
    probeRegister('wallet', '1|16|amount', '0.00 POL');

    const snap = probeSnapshot('wallet');
    expect(snap?.entries).toEqual([
      { key: '0|18|amount', value: '1,234.56 XRUN' },
      { key: '1|16|amount', value: '0.00 POL' },
    ]);
  });

  it('같은 값을 다시 등록하면 구독자를 부르지 않는다', () => {
    const cb = jest.fn();
    const off = probeSubscribe('wallet', cb);

    probeRegister('wallet', '0|18|amount', '1,234.56 XRUN');
    expect(cb).toHaveBeenCalledTimes(1);

    probeRegister('wallet', '0|18|amount', '1,234.56 XRUN');
    expect(cb).toHaveBeenCalledTimes(1);
    off();
  });

  it('값이 달라지면 구독자를 다시 부른다', () => {
    const cb = jest.fn();
    const off = probeSubscribe('wallet', cb);

    probeRegister('wallet', '0|18|amount', '0.00 XRUN');
    probeRegister('wallet', '0|18|amount', '1,234.56 XRUN');

    expect(cb).toHaveBeenCalledTimes(2);
    off();
  });

  it('등록 해제하면 스냅샷에서 사라지고 구독자를 부른다', () => {
    probeRegister('wallet', '0|18|amount', '1,234.56 XRUN');
    const cb = jest.fn();
    const off = probeSubscribe('wallet', cb);

    probeUnregister('wallet', '0|18|amount');

    expect(probeSnapshot('wallet')?.entries).toEqual([]);
    expect(cb).toHaveBeenCalledTimes(1);
    off();
  });

  it('없는 키를 해제해도 구독자를 부르지 않는다', () => {
    const cb = jest.fn();
    const off = probeSubscribe('wallet', cb);

    probeUnregister('wallet', 'nope');

    expect(cb).not.toHaveBeenCalled();
    off();
  });

  it('reset 하면 값이 비고 새 sessionId 가 발급된다', () => {
    probeRegister('wallet', '0|18|amount', '1,234.56 XRUN');
    const first = probeSnapshot('wallet')?.sessionId;

    const second = probeReset('wallet');

    expect(probeSnapshot('wallet')?.entries).toEqual([]);
    expect(second).not.toBe(first);
  });

  it('구독 해제 후에는 부르지 않는다', () => {
    const cb = jest.fn();
    const off = probeSubscribe('wallet', cb);
    off();

    probeRegister('wallet', '0|18|amount', 'x');

    expect(cb).not.toHaveBeenCalled();
  });

  it('화면이 다르면 서로 간섭하지 않는다', () => {
    probeReset('other');
    probeRegister('wallet', 'a', '1');
    probeRegister('other', 'b', '2');

    expect(probeSnapshot('wallet')?.entries).toEqual([{ key: 'a', value: '1' }]);
    expect(probeSnapshot('other')?.entries).toEqual([{ key: 'b', value: '2' }]);
  });
});
