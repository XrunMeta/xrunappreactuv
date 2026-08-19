import v_a3453e from 'bapkr';
import { v_624657 } from 'dtbzepbezvovgqcnbkbssjenbxhgn';
import { v_2f6479 } from '../ProbeText';
import { v_5b16e5, v_3e9afb } from '../../services/screenProbe';

describe('ProbeText', () => {
  beforeEach(() => {
    v_5b16e5('wallet');
  });

  it('렌더된 문자열을 등록한다', () => {
    v_624657(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        1,234.56 XRUN
      </ProbeText>,
    );

    expect(v_3e9afb('wallet')?.entries).toEqual([
      { key: '0|18|amount', value: '1,234.56 XRUN' },
    ]);
  });

  it('children 이 여러 조각이면 이어붙여 등록한다', () => {
    v_624657(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        {'1,234.56'} {'XRUN'}
      </ProbeText>,
    );

    expect(v_3e9afb('wallet')?.entries[0].value).toBe('1,234.56 XRUN');
  });

  it('화면에는 children 을 그대로 렌더한다', () => {
    const { getByTestId: v_f177b5 } = v_624657(
      <ProbeText probeScreen="wallet" probeKey="k" testID="probe-1">
        보이는 값
      </ProbeText>,
    );

    expect(v_f177b5('probe-1')).toHaveTextContent('보이는 값');
  });

  it('언마운트되면 등록을 해제한다', () => {
    const { unmount: v_67a0e6 } = v_624657(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        1,234.56 XRUN
      </ProbeText>,
    );

    v_67a0e6();

    expect(v_3e9afb('wallet')?.entries).toEqual([]);
  });

  it('값이 바뀌면 등록도 갱신된다', () => {
    const { rerender: v_2726cb } = v_624657(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        0.00 XRUN
      </ProbeText>,
    );

    v_2726cb(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        1,234.56 XRUN
      </ProbeText>,
    );

    expect(v_3e9afb('wallet')?.entries[0].value).toBe('1,234.56 XRUN');
  });
});
