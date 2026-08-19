import {
  buildWalletReportRows,
  startWalletScreenReporter,
} from '../walletScreenReport';
import { probeReset, probeRegister, probeSnapshot } from '../screenProbe';

jest.mock('../index', () => ({
  getApiBaseUrl: () => 'https://oth-path.test',
  getAuthHeader: async () => 'Bearer test-jwt',
}));

jest.mock('../versionCheck', () => ({
  getCurrentAppVersion: () => '4.10.14',
}));

function registerRow(i: number, currency: number, symbol: string, amount: string) {
  probeRegister('wallet', `${i}|${currency}|title`, symbol);
  probeRegister('wallet', `${i}|${currency}|symbol`, symbol);
  probeRegister('wallet', `${i}|${currency}|amount`, amount);
  probeRegister('wallet', `${i}|${currency}|suffix`, symbol);
}

function snap() {
  const s = probeSnapshot('wallet');
  if (!s) throw new Error('snapshot 없음');
  return s;
}

describe('buildWalletReportRows', () => {
  beforeEach(() => probeReset('wallet'));

  it('probe 키를 행으로 묶고 표시 순서대로 정렬한다', () => {
    registerRow(1, 16, 'POL', '0.00');
    registerRow(0, 18, 'XRUN', '1,234.56');

    expect(buildWalletReportRows(snap())).toEqual([
      { i: 0, currency: 18, symbol: 'XRUN', title: 'XRUN', amount: '1,234.56', suffix: 'XRUN' },
      { i: 1, currency: 16, symbol: 'POL', title: 'POL', amount: '0.00', suffix: 'POL' },
    ]);
  });

  it('표시 금액을 파싱하지 않고 문자열 그대로 담는다', () => {
    registerRow(0, 18, 'XRUN', '1,234.56');
    expect(buildWalletReportRows(snap())[0].amount).toBe('1,234.56');
  });

  it('일부 필드만 등록돼도 빈 문자열로 채워 행을 만든다', () => {
    probeRegister('wallet', '0|18|amount', '1,234.56');

    expect(buildWalletReportRows(snap())).toEqual([
      { i: 0, currency: 18, symbol: '', title: '', amount: '1,234.56', suffix: '' },
    ]);
  });

  it('규약에 안 맞는 키는 무시한다', () => {
    probeRegister('wallet', 'garbage-key', 'x');
    expect(buildWalletReportRows(snap())).toEqual([]);
  });
});

describe('startWalletScreenReporter', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    probeReset('wallet');
    fetchMock = jest.fn(async () => ({ ok: true, json: async () => ({}) }));
    (global as any).fetch = fetchMock;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const ctx = () => ({ isLoading: false, addressMasked: '0x62b8...3f9a21', staleCurrencies: [1] });

  it('값 변화 뒤 1.5초가 지나면 한 번 보낸다', async () => {
    const stop = startWalletScreenReporter(ctx);
    registerRow(0, 18, 'XRUN', '1,234.56');

    expect(fetchMock).not.toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(1500);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://oth-path.test/walletScreenReport');
    const sent = JSON.parse(init.body);
    expect(sent.seq).toBe(1);
    expect(sent.rows).toHaveLength(1);
    expect(sent.rows[0].amount).toBe('1,234.56');
    expect(sent.addressMasked).toBe('0x62b8...3f9a21');
    expect(sent.staleCurrencies).toEqual([1]);
    expect(sent.app.version).toBe('4.10.14');
    expect(sent.member).toBeUndefined();
    stop();
  });

  it('디바운스 안에서 여러 번 바뀌면 한 번만 보낸다', async () => {
    const stop = startWalletScreenReporter(ctx);

    registerRow(0, 18, 'XRUN', '0.00');
    await jest.advanceTimersByTimeAsync(500);
    registerRow(0, 18, 'XRUN', '1,234.56');
    await jest.advanceTimersByTimeAsync(1500);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).rows[0].amount).toBe('1,234.56');
    stop();
  });

  it('나중에 또 바뀌면 seq 를 올려 다시 보낸다', async () => {
    const stop = startWalletScreenReporter(ctx);

    registerRow(0, 18, 'XRUN', '0.00');
    await jest.advanceTimersByTimeAsync(1500);

    registerRow(0, 18, 'XRUN', '1,234.56');
    await jest.advanceTimersByTimeAsync(1500);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).seq).toBe(2);
    stop();
  });

  it('60초까지 행이 하나도 없으면 빈 리포트를 한 번 보낸다', async () => {
    const stop = startWalletScreenReporter(() => ({
      isLoading: true,
      addressMasked: null,
      staleCurrencies: [],
    }));

    await jest.advanceTimersByTimeAsync(60000);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.rows).toEqual([]);
    expect(sent.isLoading).toBe(true);
    stop();
  });

  it('행이 이미 왔으면 60초 타이머는 보내지 않는다', async () => {
    const stop = startWalletScreenReporter(ctx);

    registerRow(0, 18, 'XRUN', '1,234.56');
    await jest.advanceTimersByTimeAsync(60000);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    stop();
  });

  it('시작 전에 이미 등록된 값이 있으면 그것도 보낸다', async () => {
    registerRow(0, 18, 'XRUN', '1,234.56');

    const stop = startWalletScreenReporter(ctx);
    await jest.advanceTimersByTimeAsync(1500);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).rows).toHaveLength(1);
    stop();
  });

  it('전송이 실패해도 던지지 않는다', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));
    const stop = startWalletScreenReporter(ctx);

    registerRow(0, 18, 'XRUN', '1,234.56');
    await expect(jest.advanceTimersByTimeAsync(1500)).resolves.not.toThrow();

    stop();
  });

  it('정지 후에는 보내지 않는다', async () => {
    const stop = startWalletScreenReporter(ctx);
    stop();

    registerRow(0, 18, 'XRUN', '1,234.56');
    await jest.advanceTimersByTimeAsync(60000);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
