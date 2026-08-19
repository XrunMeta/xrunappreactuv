import React from 'react';
import { render } from '@testing-library/react-native';
import { ProbeText } from '../../components/ProbeText';
import { probeReset, probeSnapshot } from '../../services/screenProbe';
import { buildWalletReportRows } from '../../services/walletScreenReport';
import { TID } from '../../testIDs';

jest.mock('../../services/index', () => ({
  getApiBaseUrl: () => 'https://oth-path.test',
  getAuthHeader: async () => 'Bearer test-jwt',
}));

jest.mock('../../services/versionCheck', () => ({
  getCurrentAppVersion: () => '4.10.14',
}));

function Row({ index, currency, symbol, amount }: {
  index: number; currency: number; symbol: string; amount: string;
}) {
  return (
    <>
      <ProbeText
        probeScreen="wallet"
        probeKey={`${index}|${currency}|title`}
        testID={`${TID.wallet.titleLabel}-${currency}`}
      >
        {symbol}
      </ProbeText>
      <ProbeText
        probeScreen="wallet"
        probeKey={`${index}|${currency}|amount`}
        testID={`${TID.wallet.amountLabel}-${currency}`}
      >
        {amount} {symbol}
      </ProbeText>
    </>
  );
}

describe('지갑 리스트 행 계약', () => {
  beforeEach(() => probeReset('wallet'));

  it('행마다 통화가 붙은 testID 를 갖는다', () => {
    const { getByTestId } = render(
      <>
        <Row index={0} currency={18} symbol="XRUN" amount="1,234.56" />
        <Row index={1} currency={16} symbol="POL" amount="0.00" />
      </>,
    );

    expect(getByTestId('wallet-amount-label-18')).toBeTruthy();
    expect(getByTestId('wallet-amount-label-16')).toBeTruthy();
  });

  it('렌더된 두 행이 리포트 행 2개로 조립된다', () => {
    render(
      <>
        <Row index={0} currency={18} symbol="XRUN" amount="1,234.56" />
        <Row index={1} currency={16} symbol="POL" amount="0.00" />
      </>,
    );

    const rows = buildWalletReportRows(probeSnapshot('wallet')!);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ i: 0, currency: 18, title: 'XRUN', amount: '1,234.56 XRUN' });
    expect(rows[1]).toMatchObject({ i: 1, currency: 16, title: 'POL', amount: '0.00 POL' });
  });

  it('행이 사라지면 리포트에서도 빠진다', () => {
    const { rerender } = render(
      <>
        <Row index={0} currency={18} symbol="XRUN" amount="1,234.56" />
        <Row index={1} currency={16} symbol="POL" amount="0.00" />
      </>,
    );

    rerender(<Row index={0} currency={18} symbol="XRUN" amount="1,234.56" />);

    const rows = buildWalletReportRows(probeSnapshot('wallet')!);
    expect(rows).toHaveLength(1);
    expect(rows[0].currency).toBe(18);
  });
});
