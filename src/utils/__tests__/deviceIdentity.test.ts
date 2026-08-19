

import { Platform } from 'react-native';

jest.mock('expo-application', () => ({
  getIosIdForVendorAsync: jest.fn(),
  getAndroidId: jest.fn(),
}));

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    __reset: () => store.clear(),
    getItemAsync: jest.fn(async (k: string) => (store.has(k) ? (store.get(k) as string) : null)),
    setItemAsync: jest.fn(async (k: string, v: string) => { store.set(k, v); }),
    deleteItemAsync: jest.fn(async (k: string) => { store.delete(k); }),
  };
});

import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';

function mockSecureStore(values: Record<string, string>) {
  (SecureStore as any).__reset();
  Object.entries(values).forEach(([k, v]) => {
    SecureStore.setItemAsync(k, v);
  });
}

function mockApplication(opts: { iosIdForVendor?: string; androidId?: string }) {
  (Application.getIosIdForVendorAsync as jest.Mock).mockResolvedValue(opts.iosIdForVendor ?? null);
  (Application.getAndroidId as jest.Mock).mockReturnValue(opts.androidId ?? null);
}

function mockPlatform(os: 'ios' | 'android') {
  (Platform as any).OS = os;
}

function mockAsyncStorage(values: Record<string, string>) {
  Object.entries(values).forEach(([k, v]) => {
    AsyncStorage.setItem(k, v);
  });
}

const secureStoreSetSpy = SecureStore.setItemAsync as jest.Mock;

beforeEach(() => {
  const { __resetInstallUuidCacheForTests } = require('../deviceIdentity');
  __resetInstallUuidCacheForTests();
  mockPlatform('ios');
  mockSecureStore({});
  mockApplication({});
  AsyncStorage.clear();
  secureStoreSetSpy.mockClear();
});

afterEach(() => {
  mockPlatform('ios');
});

describe('getInstallUuid', () => {
  it('SecureStore 에 값이 있으면 그대로 쓴다', async () => {
    const { getInstallUuid } = require('../deviceIdentity');
    mockSecureStore({ xrun_device_id: 'stored-uuid' });
    expect(await getInstallUuid()).toBe('stored-uuid');
  });

  it('없으면 IDFV 로 시드하고 SecureStore 에 저장한다', async () => {
    const { getInstallUuid } = require('../deviceIdentity');
    mockSecureStore({});
    mockApplication({ iosIdForVendor: 'idfv-1234' });
    expect(await getInstallUuid()).toBe('idfv-1234');
    expect(secureStoreSetSpy).toHaveBeenCalledWith('xrun_device_id', 'idfv-1234');
  });

  it('둘 다 실패하면 randomUUID 로 만든다', async () => {
    const { getInstallUuid } = require('../deviceIdentity');
    mockSecureStore({});
    mockApplication({});
    expect(await getInstallUuid()).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('구 캐시 키의 오염된 값은 읽지 않는다', async () => {
    const { getInstallUuid } = require('../deviceIdentity');
    mockAsyncStorage({ __xrun_device_id_v1: 'Redmi-2201116SG-Redmi Note 11 Pro 5G' });
    mockPlatform('android');
    mockSecureStore({});
    mockApplication({ androidId: 'ssaid-x' });
    expect(await getInstallUuid()).toBe('ssaid-x');
  });
});

describe('collectDeviceSignals', () => {
  it('iOS 의 device_key 는 설치 UUID 다', async () => {
    const { collectDeviceSignals } = require('../deviceSignals');
    mockPlatform('ios');
    mockSecureStore({ xrun_device_id: 'uuid-1' });
    expect((await collectDeviceSignals()).device_key).toBe('uuid-1');
  });

  it('Android 의 device_key 는 SSAID 다', async () => {
    const { collectDeviceSignals } = require('../deviceSignals');
    mockPlatform('android');
    mockSecureStore({ xrun_device_id: 'uuid-1' });
    mockApplication({ androidId: 'ssaid-x' });
    const s = await collectDeviceSignals();
    expect(s.device_key).toBe('ssaid-x');
    expect(s.install_uuid).toBe('uuid-1');
  });

  it('Android 에서 SSAID 를 못 얻으면 설치 UUID 로 폴백한다', async () => {
    const { collectDeviceSignals } = require('../deviceSignals');
    mockPlatform('android');
    mockSecureStore({ xrun_device_id: 'uuid-1' });
    mockApplication({});
    expect((await collectDeviceSignals()).device_key).toBe('uuid-1');
  });
});
