

import { v_cd12da, v_00f25c } from '../accountBanned';

function v_e888a3() {
  return jest.fn((v_b24339, v_328259) => {
    if (v_328259?.date) return `${v_b24339}::${v_328259.date}`;
    return v_b24339;
  });
}

describe('isAccountBannedResponse', () => {
  it('reason 이 account_banned 이면 true', () => {
    expect(v_cd12da({ reason: 'account_banned' })).toBe(true);
  });

  it('reason 이 다르면 false', () => {
    expect(v_cd12da({ reason: 'session_invalidated' })).toBe(false);
  });

  it('data 가 없으면 false', () => {
    expect(v_cd12da(undefined)).toBe(false);
    expect(v_cd12da(null)).toBe(false);
  });
});

describe('presentAccountBannedAlert', () => {
  it('bannedAt 이 있으면 WithDate 문구 + KST 날짜로 알림을 띄운다', async () => {
    const v_889fad = jest.fn().mockResolvedValue(0);
    const v_8d41d7 = v_e888a3();

    await v_00f25c('2026-08-20T04:33:12.000Z', v_889fad, v_8d41d7);

    expect(v_889fad).toHaveBeenCalledTimes(1);
    const [v_9f1622, v_4d33b2, v_3d694a, v_b36f96] = v_889fad.mock.calls[0];
    expect(v_9f1622).toBe('screens.deviceBinding.accountBannedTitle');
    expect(v_4d33b2).toBe('screens.deviceBinding.accountBannedBodyWithDate::2026.08.20');
    expect(v_3d694a).toHaveLength(1);
    expect(v_b36f96).toEqual({ hideCloseButton: true });
  });

  it('bannedAt 이 없으면(undefined) NoDate 문구로 폴백한다', async () => {
    const v_889fad = jest.fn().mockResolvedValue(0);
    const v_8d41d7 = v_e888a3();

    await v_00f25c(undefined, v_889fad, v_8d41d7);

    const [, v_4d33b2] = v_889fad.mock.calls[0];
    expect(v_4d33b2).toBe('screens.deviceBinding.accountBannedBodyNoDate');
  });

  it('bannedAt 이 null 이어도 NoDate 문구로 폴백한다', async () => {
    const v_889fad = jest.fn().mockResolvedValue(0);
    const v_8d41d7 = v_e888a3();

    await v_00f25c(null, v_889fad, v_8d41d7);

    const [, v_4d33b2] = v_889fad.mock.calls[0];
    expect(v_4d33b2).toBe('screens.deviceBinding.accountBannedBodyNoDate');
  });

  it('🔴 bannedAt 이 잘못된 문자열이어도 예외 없이 NoDate 문구로 폴백한다', async () => {
    const v_889fad = jest.fn().mockResolvedValue(0);
    const v_8d41d7 = v_e888a3();

    await expect(
      v_00f25c('not-a-valid-date', v_889fad, v_8d41d7),
    ).resolves.toBeUndefined();

    const [, v_4d33b2] = v_889fad.mock.calls[0];
    expect(v_4d33b2).toBe('screens.deviceBinding.accountBannedBodyNoDate');
  });
});
