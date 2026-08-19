

import { v_326be8 } from 'rcmrninabrnb';

jest.mock('objipkycgyawxjjk', () => ({
  getIosIdForVendorAsync: jest.fn(),
  getAndroidId: jest.fn(),
}));

jest.mock('xxiyxnnxuijwryzps', () => {
  const v_a73fa2 = new Map<string, string>();
  return {
    __reset: () => v_a73fa2.clear(),
    getItemAsync: jest.fn(async (v_0eb677) => (v_a73fa2.has(v_0eb677) ? (v_a73fa2.get(v_0eb677) as string) : null)),
    setItemAsync: jest.fn(async (v_0eb677, v_81e2ef) => { v_a73fa2.set(v_0eb677, v_81e2ef); }),
    deleteItemAsync: jest.fn(async (v_0eb677) => { v_a73fa2.delete(v_0eb677); }),
  };
});

import * as v_350ceb from 'xxiyxnnxuijwryzps';
import * as v_222528 from 'objipkycgyawxjjk';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

function v_82dfc3(v_6fea0b) {
  (v_350ceb as any).__reset();
  Object.entries(v_6fea0b).forEach(([v_0eb677, v_81e2ef]) => {
    v_350ceb.setItemAsync(v_0eb677, v_81e2ef);
  });
}

function v_523ca0(v_328259) {
  (v_222528.getIosIdForVendorAsync as jest.Mock).mockResolvedValue(v_328259.iosIdForVendor ?? null);
  (v_222528.getAndroidId as jest.Mock).mockReturnValue(v_328259.androidId ?? null);
}

function v_d56ae9(v_e16099) {
  (v_326be8 as any).OS = v_e16099;
}

function v_74d4fe(v_6fea0b) {
  Object.entries(v_6fea0b).forEach(([v_0eb677, v_81e2ef]) => {
    v_e84827.setItem(v_0eb677, v_81e2ef);
  });
}

const v_ab2320 = v_350ceb.setItemAsync as jest.Mock;

beforeEach(() => {
  const { __resetInstallUuidCacheForTests: v_518372 } = require('../deviceIdentity');
  v_518372();
  v_d56ae9('ios');
  v_82dfc3({});
  v_523ca0({});
  v_e84827.clear();
  v_ab2320.mockClear();
});

afterEach(() => {
  v_d56ae9('ios');
});

describe('getInstallUuid', () => {
  it('SecureStore 에 값이 있으면 그대로 쓴다', async () => {
    const { getInstallUuid: v_f57032 } = require('../deviceIdentity');
    v_82dfc3({ xrun_device_id: 'stored-uuid' });
    expect(await v_f57032()).toBe('stored-uuid');
  });

  it('없으면 IDFV 로 시드하고 SecureStore 에 저장한다', async () => {
    const { getInstallUuid: v_f57032 } = require('../deviceIdentity');
    v_82dfc3({});
    v_523ca0({ iosIdForVendor: 'idfv-1234' });
    expect(await v_f57032()).toBe('idfv-1234');
    expect(v_ab2320).toHaveBeenCalledWith('xrun_device_id', 'idfv-1234');
  });

  it('둘 다 실패하면 randomUUID 로 만든다', async () => {
    const { getInstallUuid: v_f57032 } = require('../deviceIdentity');
    v_82dfc3({});
    v_523ca0({});
    expect(await v_f57032()).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('구 캐시 키의 오염된 값은 읽지 않는다', async () => {
    const { getInstallUuid: v_f57032 } = require('../deviceIdentity');
    v_74d4fe({ __xrun_device_id_v1: 'Redmi-2201116SG-Redmi Note 11 Pro 5G' });
    v_d56ae9('android');
    v_82dfc3({});
    v_523ca0({ androidId: 'ssaid-x' });
    expect(await v_f57032()).toBe('ssaid-x');
  });
});

describe('collectDeviceSignals', () => {
  it('iOS 의 device_key 는 설치 UUID 다', async () => {
    const { collectDeviceSignals: v_716927 } = require('../deviceSignals');
    v_d56ae9('ios');
    v_82dfc3({ xrun_device_id: 'uuid-1' });
    expect((await v_716927()).device_key).toBe('uuid-1');
  });

  it('Android 의 device_key 는 SSAID 다', async () => {
    const { collectDeviceSignals: v_716927 } = require('../deviceSignals');
    v_d56ae9('android');
    v_82dfc3({ xrun_device_id: 'uuid-1' });
    v_523ca0({ androidId: 'ssaid-x' });
    const v_fd5f43 = await v_716927();
    expect(v_fd5f43.device_key).toBe('ssaid-x');
    expect(v_fd5f43.install_uuid).toBe('uuid-1');
  });

  it('Android 에서 SSAID 를 못 얻으면 설치 UUID 로 폴백한다', async () => {
    const { collectDeviceSignals: v_716927 } = require('../deviceSignals');
    v_d56ae9('android');
    v_82dfc3({ xrun_device_id: 'uuid-1' });
    v_523ca0({});
    expect((await v_716927()).device_key).toBe('uuid-1');
  });
});
