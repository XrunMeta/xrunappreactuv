

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
