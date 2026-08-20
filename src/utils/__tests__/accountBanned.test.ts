

import { isAccountBannedResponse, presentAccountBannedAlert } from '../accountBanned';

function makeT() {
  return jest.fn((key: string, opts?: any) => {
    if (opts?.date) return `${key}::${opts.date}`;
    return key;
  });
}

describe('isAccountBannedResponse', () => {
  it('reason 이 account_banned 이면 true', () => {
    expect(isAccountBannedResponse({ reason: 'account_banned' })).toBe(true);
  });

  it('reason 이 다르면 false', () => {
    expect(isAccountBannedResponse({ reason: 'session_invalidated' })).toBe(false);
  });

  it('data 가 없으면 false', () => {
    expect(isAccountBannedResponse(undefined)).toBe(false);
    expect(isAccountBannedResponse(null)).toBe(false);
  });
});

describe('presentAccountBannedAlert', () => {
  it('bannedAt 이 있으면 WithDate 문구 + KST 날짜로 알림을 띄운다', async () => {
    const showAlert = jest.fn().mockResolvedValue(0);
    const t = makeT();

    await presentAccountBannedAlert('2026-08-20T04:33:12.000Z', showAlert, t);

    expect(showAlert).toHaveBeenCalledTimes(1);
    const [title, body, buttons, options] = showAlert.mock.calls[0];
    expect(title).toBe('screens.deviceBinding.accountBannedTitle');
    expect(body).toBe('screens.deviceBinding.accountBannedBodyWithDate::2026.08.20');
    expect(buttons).toHaveLength(1);
    expect(options).toEqual({ hideCloseButton: true });
  });

  it('bannedAt 이 없으면(undefined) NoDate 문구로 폴백한다', async () => {
    const showAlert = jest.fn().mockResolvedValue(0);
    const t = makeT();

    await presentAccountBannedAlert(undefined, showAlert, t);

    const [, body] = showAlert.mock.calls[0];
    expect(body).toBe('screens.deviceBinding.accountBannedBodyNoDate');
  });

  it('bannedAt 이 null 이어도 NoDate 문구로 폴백한다', async () => {
    const showAlert = jest.fn().mockResolvedValue(0);
    const t = makeT();

    await presentAccountBannedAlert(null, showAlert, t);

    const [, body] = showAlert.mock.calls[0];
    expect(body).toBe('screens.deviceBinding.accountBannedBodyNoDate');
  });

  it('🔴 bannedAt 이 잘못된 문자열이어도 예외 없이 NoDate 문구로 폴백한다', async () => {
    const showAlert = jest.fn().mockResolvedValue(0);
    const t = makeT();

    await expect(
      presentAccountBannedAlert('not-a-valid-date', showAlert, t),
    ).resolves.toBeUndefined();

    const [, body] = showAlert.mock.calls[0];
    expect(body).toBe('screens.deviceBinding.accountBannedBodyNoDate');
  });
});
