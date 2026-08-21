

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: { configure: jest.fn(), signIn: jest.fn(), signOut: jest.fn() },
  statusCodes: {},
}));
jest.mock('@invertase/react-native-apple-authentication', () => ({
  __esModule: true,
  default: { performRequest: jest.fn() },
}));

jest.mock('react-native-appsflyer', () => ({
  __esModule: true,
  default: {
    initSdk: jest.fn(),
    logEvent: jest.fn(),
    setAppInviteOneLinkID: jest.fn(),
    onInstallConversionData: jest.fn(),
    onDeepLink: jest.fn(),
  },
}));

const mockPost = jest.fn().mockResolvedValue({ data: { data: [{ status: true }] } });
jest.mock('axios', () => {
  const actual = jest.requireActual('axios');
  return {
    __esModule: true,
    default: {
      ...actual.default,
      create: jest.fn(() => ({
        post: mockPost,
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })),
    },
    AxiosError: actual.AxiosError,
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

import { collectDeviceSignals } from '../../utils/deviceSignals';
import { loadEnvSync } from '../../utils/env';

describe('sendEmailVerificationCode', () => {
  beforeAll(() => {

    loadEnvSync();
  });

  beforeEach(() => {
    mockPost.mockClear();
    mockPost.mockResolvedValue({ data: { data: [{ status: true }] } });
    (collectDeviceSignals as jest.Mock).mockClear();
  });

  it("purpose='signup' 이면 body 에 purpose 와 기기 신호(device_key/platform/app_build)를 함께 싣는다", async () => {
    const { sendEmailVerificationCode } = require('../index');
    await sendEmailVerificationCode('oth-staff@example.invalid', 'signup');

    expect(mockPost).toHaveBeenCalledTimes(1);
    const [url, body] = mockPost.mock.calls[0];
    expect(url).toBe('/check-02-email');
    expect(body.email).toBe('oth-staff@example.invalid');
    expect(body.purpose).toBe('signup');
    expect(body.device_key).toBe('test-device-key');
    expect(body.platform).toBe('ios');
    expect(body.app_build).toBe(410);
    expect(collectDeviceSignals).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['restore'],
    ['email_change'],
    ['login'],
    ['send_confirm'],
  ] as const)("purpose='%s' 이면 purpose 만 싣고 기기 신호는 싣지 않는다 (서버 게이트 우회)", async (purpose) => {
    const { sendEmailVerificationCode } = require('../index');
    await sendEmailVerificationCode('oth-staff@example.invalid', purpose);

    expect(mockPost).toHaveBeenCalledTimes(1);
    const [, body] = mockPost.mock.calls[0];
    expect(body.purpose).toBe(purpose);
    expect(body.device_key).toBeUndefined();
    expect(body.platform).toBeUndefined();
    expect(body.app_build).toBeUndefined();
    expect(collectDeviceSignals).not.toHaveBeenCalled();
  });

  it('지갑 복원 경로(restore)는 기기 신호 없이도 정상적으로 발송 요청을 보낸다 — 차단된 기기라도 막히면 안 됨', async () => {
    const { sendEmailVerificationCode } = require('../index');
    const result = await sendEmailVerificationCode('oth-staff@example.invalid', 'restore');

    expect(result).toBe(true);
    const [, body] = mockPost.mock.calls[0];
    expect(body.purpose).toBe('restore');
  });
});
