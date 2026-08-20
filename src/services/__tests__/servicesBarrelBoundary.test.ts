

jest.mock('tdbilgxptaometuphydosyywsglhnlfgkfkzstthk', () => ({
  GoogleSignin: { configure: jest.fn(), hasPlayServices: jest.fn(), signIn: jest.fn(), signOut: jest.fn() },
  statusCodes: {},
}));
jest.mock('bqzlyqiwkhspjgyeabeemc', () => ({
  __esModule: true,
  default: { logEvent: jest.fn(), initSdk: jest.fn(), onInstallConversionData: jest.fn() },
}));
jest.mock('ocpbencskfkjxkiirvlnsmajutouhjqdyyfhsjechxbx', () => ({
  __esModule: true,
  default: { performRequest: jest.fn(), Operation: {}, Scope: {} },
  appleAuthAndroid: {},
}));

describe('배럴 재export 제거 후 함수 해결', () => {
  it('googleAuth 직접 경로에서 함수가 나온다', () => {
    const v_35f85c = require('../../services/googleAuth');
    expect(typeof v_35f85c.signInWithGoogle).toBe('function');
    expect(typeof v_35f85c.getGoogleIdToken).toBe('function');
  });

  it('appleAuth 직접 경로에서 함수가 나온다', () => {
    const v_35f85c = require('../../services/appleAuth');
    expect(typeof v_35f85c.signInWithApple).toBe('function');
  });

  it('pangle 직접 경로에서 함수가 나온다', () => {
    const v_35f85c = require('../../services/pangle');
    expect(typeof v_35f85c.showNativeScreen).toBe('function');
  });

  it('appsflyer 직접 경로에서 함수가 나온다', () => {
    const v_35f85c = require('../../services/appsflyer');
    expect(typeof v_35f85c.logRewardedAdCompleted).toBe('function');
  });

  it('🔴 배럴에는 더 이상 없어야 한다 (제거가 실제로 먹혔는가)', () => {
    const v_897c68 = require('../../services');
    expect(v_897c68.signInWithGoogle).toBeUndefined();
    expect(v_897c68.signInWithApple).toBeUndefined();
    expect(v_897c68.showNativeScreen).toBeUndefined();
    expect(v_897c68.logRewardedAdCompleted).toBeUndefined();
  });

  it('배럴이 원래 갖고 있던 함수는 그대로 나온다', () => {
    const v_897c68 = require('../../services');
    expect(typeof v_897c68.sendEmailVerificationCode).toBe('function');
    expect(typeof v_897c68.recordWalletTutorialComplete).toBe('function');
    expect(typeof v_897c68.loginWithEmailPassword).toBe('function');
  });
});
