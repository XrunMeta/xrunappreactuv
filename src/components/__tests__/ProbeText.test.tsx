import React from 'react';
import { render } from '@testing-library/react-native';
import { ProbeText } from '../ProbeText';
import { probeReset, probeSnapshot } from '../../services/screenProbe';

describe('ProbeText', () => {
  beforeEach(() => {
    probeReset('wallet');
  });

  it('렌더된 문자열을 등록한다', () => {
    render(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        1,234.56 XRUN
      </ProbeText>,
    );

    expect(probeSnapshot('wallet')?.entries).toEqual([
      { key: '0|18|amount', value: '1,234.56 XRUN' },
    ]);
  });

  it('children 이 여러 조각이면 이어붙여 등록한다', () => {
    render(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        {'1,234.56'} {'XRUN'}
      </ProbeText>,
    );

    expect(probeSnapshot('wallet')?.entries[0].value).toBe('1,234.56 XRUN');
  });

  it('화면에는 children 을 그대로 렌더한다', () => {
    const { getByTestId } = render(
      <ProbeText probeScreen="wallet" probeKey="k" testID="probe-1">
        보이는 값
      </ProbeText>,
    );

    expect(getByTestId('probe-1')).toHaveTextContent('보이는 값');
  });

  it('언마운트되면 등록을 해제한다', () => {
    const { unmount } = render(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        1,234.56 XRUN
      </ProbeText>,
    );

    unmount();

    expect(probeSnapshot('wallet')?.entries).toEqual([]);
  });

  it('값이 바뀌면 등록도 갱신된다', () => {
    const { rerender } = render(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        0.00 XRUN
      </ProbeText>,
    );

    rerender(
      <ProbeText probeScreen="wallet" probeKey="0|18|amount">
        1,234.56 XRUN
      </ProbeText>,
    );

    expect(probeSnapshot('wallet')?.entries[0].value).toBe('1,234.56 XRUN');
  });
});
