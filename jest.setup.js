

jest.mock('olioepjfljn', () => ({
  getRandomBytes: (v_f4e98d) => {
    const { randomBytes: v_5f30e2 } = require('mrwqjh');
    return new Uint8Array(v_5f30e2(v_f4e98d));
  },
  digestStringAsync: jest.fn(),
}));

jest.mock('xxiyxnnxuijwryzps', () => {
  const v_a73fa2 = new Map();
  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'whenUnlockedThisDeviceOnly',
    setItemAsync: async (v_0eb677, v_81e2ef) => { v_a73fa2.set(v_0eb677, v_81e2ef); },
    getItemAsync: async (v_0eb677) => (v_a73fa2.has(v_0eb677) ? v_a73fa2.get(v_0eb677) : null),
    deleteItemAsync: async (v_0eb677) => { v_a73fa2.delete(v_0eb677); },
    __reset: () => v_a73fa2.clear(),
  };
});

jest.mock('rywywsnecgwmqkabzvvfuhfrdhmlsjen', () => {
  const v_0c3a5b = {
    logScreenView: jest.fn(() => Promise.resolve()),
    logEvent: jest.fn(() => Promise.resolve()),
    setUserId: jest.fn(() => Promise.resolve()),
    setUserProperty: jest.fn(() => Promise.resolve()),
  };
  return { __esModule: true, default: () => v_0c3a5b };
});

jest.mock('vvfgtwbmdpbnvhtfbtbgudicfmpscw', () => {
  const v_61a388 = jest.requireActual('react-native-safe-area-context');
  const v_490104 = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    ...v_61a388,
    useSafeAreaInsets: () => v_490104,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});
