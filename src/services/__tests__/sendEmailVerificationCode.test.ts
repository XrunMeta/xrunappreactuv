

jest.mock('tdbilgxptaometuphydosyywsglhnlfgkfkzstthk', () => ({
  GoogleSignin: { configure: jest.fn(), signIn: jest.fn(), signOut: jest.fn() },
  statusCodes: {},
}));
jest.mock('ocpbencskfkjxkiirvlnsmajutouhjqdyyfhsjechxbx', () => ({
  __esModule: true,
  default: { performRequest: jest.fn() },
}));

jest.mock('bqzlyqiwkhspjgyeabeemc', () => ({
  __esModule: true,
  default: {
    initSdk: jest.fn(),
    logEvent: jest.fn(),
    setAppInviteOneLinkID: jest.fn(),
    onInstallConversionData: jest.fn(),
    onDeepLink: jest.fn(),
  },
}));

const v_483091 = jest.fn().mockResolvedValue({ data: { data: [{ status: true }] } });
jest.mock('imsks', () => {
  const v_61a388 = jest.requireActual('axios');
  return {
    __esModule: true,
    default: {
      ...v_61a388.default,
      create: jest.fn(() => ({
        post: v_483091,
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })),
    },
    AxiosError: v_61a388.AxiosError,
  };
});

jest.mock('../../utils/deviceSignals', () => ({
  collectDeviceSignals: jest.fn(async () => ({
    device_key: 'test-device-key',
    install_uuid: 'test-install-uuid',
    device_id: 'test-install-uuid',
    platform: 'ios',
    app_build: 410,
  })),
}));

import { v_716927 } from '../../utils/deviceSignals';
import { v_8ecf08 } from '../../utils/env';

describe('sendEmailVerificationCode', () => {
  beforeAll(() => {

    v_8ecf08();
  });

  beforeEach(() => {
    v_483091.mockClear();
    v_483091.mockResolvedValue({ data: { data: [{ status: true }] } });
    (v_716927 as jest.Mock).mockClear();
  });

  it("purpose='signup' 이면 body 에 purpose 와 기기 신호(device_key/platform/app_build)를 함께 싣는다", async () => {
    const { sendEmailVerificationCode: v_8025d1 } = require('../index');
    await v_8025d1('oth-staff@example.invalid', 'signup');

    expect(v_483091).toHaveBeenCalledTimes(1);
    const [v_f71b56, v_4d33b2] = v_483091.mock.calls[0];
    expect(v_f71b56).toBe('/check-02-email');
    expect(v_4d33b2.email).toBe('oth-staff@example.invalid');
    expect(v_4d33b2.purpose).toBe('signup');
    expect(v_4d33b2.device_key).toBe('test-device-key');
    expect(v_4d33b2.platform).toBe('ios');
    expect(v_4d33b2.app_build).toBe(410);
    expect(v_716927).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['restore'],
    ['email_change'],
    ['login'],
    ['send_confirm'],
  ] as const)("purpose='%s' 이면 purpose 만 싣고 기기 신호는 싣지 않는다 (서버 게이트 우회)", async (v_fa63e0) => {
    const { sendEmailVerificationCode: v_8025d1 } = require('../index');
    await v_8025d1('oth-staff@example.invalid', v_fa63e0);

    expect(v_483091).toHaveBeenCalledTimes(1);
    const [, v_4d33b2] = v_483091.mock.calls[0];
    expect(v_4d33b2.purpose).toBe(v_fa63e0);
    expect(v_4d33b2.device_key).toBeUndefined();
    expect(v_4d33b2.platform).toBeUndefined();
    expect(v_4d33b2.app_build).toBeUndefined();
    expect(v_716927).not.toHaveBeenCalled();
  });

  it('지갑 복원 경로(restore)는 기기 신호 없이도 정상적으로 발송 요청을 보낸다 — 차단된 기기라도 막히면 안 됨', async () => {
    const { sendEmailVerificationCode: v_8025d1 } = require('../index');
    const v_43c42e = await v_8025d1('oth-staff@example.invalid', 'restore');

    expect(v_43c42e).toBe(true);
    const [, v_4d33b2] = v_483091.mock.calls[0];
    expect(v_4d33b2.purpose).toBe('restore');
  });
});
