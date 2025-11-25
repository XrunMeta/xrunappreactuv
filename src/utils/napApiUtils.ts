

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { DeviceInfo } from '../types';

const ADVERTISING_ID_STORAGE_KEY = 'xrun_advertising_id';
const ADVERTISING_ID_TIMESTAMP_KEY = 'xrun_advertising_id_timestamp';

async function getStoredAdvertisingId(): Promise<string | null> {
  try {
    const storedId = await AsyncStorage.getItem(ADVERTISING_ID_STORAGE_KEY);
    const timestamp = await AsyncStorage.getItem(ADVERTISING_ID_TIMESTAMP_KEY);

    if (storedId && timestamp) {
      const storedTime = parseInt(timestamp, 10);
      const currentTime = Date.now();
      const daysSinceStored = (currentTime - storedTime) / (1000 * 60 * 60 * 24);

      if (daysSinceStored <= 30) {
        console.log('✅ 저장된 광고 식별자 사용:', storedId);
        console.log(`저장된 지 ${Math.floor(daysSinceStored)}일 경과`);
        return storedId;
      } else {
        console.log('⚠️ 저장된 광고 식별자가 30일 경과, 새로 생성');

        await AsyncStorage.removeItem(ADVERTISING_ID_STORAGE_KEY);
        await AsyncStorage.removeItem(ADVERTISING_ID_TIMESTAMP_KEY);
      }
    }

    return null;
  } catch (error) {
    console.error('저장된 광고 식별자 가져오기 실패:', error);
    return null;
  }
}

async function storeAdvertisingId(adId: string): Promise<void> {
  try {
    const timestamp = Date.now().toString();
    await AsyncStorage.setItem(ADVERTISING_ID_STORAGE_KEY, adId);
    await AsyncStorage.setItem(ADVERTISING_ID_TIMESTAMP_KEY, timestamp);
    console.log('✅ 광고 식별자 저장 완료:', adId);
  } catch (error) {
    console.error('광고 식별자 저장 실패:', error);
  }
}

async function getRealIPAddress(): Promise<string> {
  try {
    console.log('=== 실제 IP 주소 가져오기 시작 ===');

    const ipServices = [
      'https://oth-path.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://oth-path.my-ip.io/ip.json',
      'https://ipinfo.io/json',
    ];

    for (const service of ipServices) {
      try {
        console.log(`IP 서비스 시도: ${service}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(service, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          let ipAddress: string | null = null;

          if (data.ip) {
            ipAddress = data.ip;
          } else if (data.query) {
            ipAddress = data.query;
          } else if (data.ipAddress) {
            ipAddress = data.ipAddress;
          }

          if (ipAddress && isValidIPAddress(ipAddress)) {
            console.log(`✅ 실제 IP 주소 가져오기 성공: ${ipAddress}`);
            return ipAddress;
          }
        }
      } catch (serviceError: any) {
        console.log(`IP 서비스 실패: ${service}`, serviceError.message);
        continue;
      }
    }

    console.log('⚠️ 모든 IP 서비스 실패 - 기본 IP 사용');
    return '127.0.0.1';

  } catch (error) {
    console.error('❌ IP 주소 가져오기 실패:', error);
    return '127.0.0.1';
  }
}

function isValidIPAddress(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;

  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function generateSeededUUID(seed: number): string {

  let currentSeed = seed;
  const seededRandom = (min: number, max: number): number => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return min + (currentSeed / 233280) * (max - min);
  };

  const hex = '0123456789abcdef';
  let uuid = '';

  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4'; 
    } else if (i === 19) {
      uuid += hex[Math.floor(seededRandom(8, 12))]; 
    } else {
      uuid += hex[Math.floor(seededRandom(0, 16))];
    }
  }

  return uuid;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return Math.abs(hash);
}

function formatAdvertisingId(adId: string): string {
  if (!adId || typeof adId !== 'string') {
    console.log('유효하지 않은 광고 식별자, 새로 생성');
    return generateUUID();
  }

  if (adId.length === 36 && adId.includes('-')) {
    console.log('이미 올바른 형식의 광고 식별자');
    return adId;
  }

  if (/^\d+$/.test(adId)) {
    console.log('숫자 형식의 광고 식별자를 UUID로 변환');

    const seed = parseInt(adId.slice(-8), 10); 
    return generateSeededUUID(seed);
  }

  if (adId.length > 0) {
    console.log('문자열 형식의 광고 식별자를 UUID로 변환');

    const hash = simpleHash(adId);
    return generateSeededUUID(hash);
  }

  console.log('알 수 없는 형식의 광고 식별자, 새로 생성');
  return generateUUID();
}

async function getAdvertisingId(): Promise<string> {
  try {
    console.log('=== 광고 식별자 가져오기 시작 ===');

    const storedAdId = await getStoredAdvertisingId();
    if (storedAdId) {
      return storedAdId;
    }

    const isEmulator = !Device.isDevice;
    if (isEmulator) {
      console.log('📱 에뮬레이터에서 실행 중 - 테스트용 광고 ID 사용');
      const testAdId = '00000000-0000-0000-0000-000000000000';
      console.log('테스트용 광고 ID:', testAdId);
      await storeAdvertisingId(testAdId); 
      return testAdId;
    }

    try {

      const modelName = Device.modelName || '';
      const brand = Device.brand || '';
      const deviceName = Device.deviceName || '';
      const deviceId = `${brand}-${modelName}-${deviceName}` || 'unknown';
      console.log('Device 정보:', { modelName, brand, deviceName, deviceId });

      if (deviceId && deviceId !== 'unknown') {
        console.log('✅ 디바이스 정보 사용:', deviceId);

        const formattedAdId = formatAdvertisingId(deviceId);
        console.log('✅ 광고 식별자 형식 변환 완료:', formattedAdId);
        await storeAdvertisingId(formattedAdId); 
        return formattedAdId;
      }
    } catch (deviceError) {
      console.log('Device 정보 가져오기 실패:', deviceError);
    }

    const fallbackUuid = generateUUID();
    console.log('⚠️ 광고 식별자를 가져올 수 없어 랜덤 UUID 사용:', fallbackUuid);
    await storeAdvertisingId(fallbackUuid); 
    return fallbackUuid;
  } catch (error) {
    console.error('❌ 광고 식별자 가져오기 실패:', error);

    const emergencyUuid = generateUUID();
    console.log('에러 시 최종 대체 UUID:', emergencyUuid);
    await storeAdvertisingId(emergencyUuid); 
    return emergencyUuid;
  }
}

async function clearStoredAdvertisingId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ADVERTISING_ID_STORAGE_KEY);
    await AsyncStorage.removeItem(ADVERTISING_ID_TIMESTAMP_KEY);
    console.log('✅ 저장된 광고 식별자 삭제 완료');
  } catch (error) {
    console.error('저장된 광고 식별자 삭제 실패:', error);
  }
}

export async function collectDeviceInfo(): Promise<DeviceInfo> {
  try {

    const realIPAddress = await getRealIPAddress();

    const modelName = Device.modelName || 'unknown';
    const brand = Device.brand || 'unknown';
    const deviceName = Device.deviceName || 'unknown';
    const deviceId = `${brand}-${modelName}-${deviceName}`;
    const adid = await getAdvertisingId();
    const model = modelName;
    const manufacturer = brand;
    const osVersion = Device.osVersion || 'unknown';
    const appVersion = Device.osVersion || 'unknown';
    const buildNumber = Device.osBuildId || 'unknown';
    const bundleId = Device.osInternalBuildId || 'unknown';
    const isTablet = Device.deviceType === Device.DeviceType.TABLET;

    const carrier: string | null = null;

    const deviceInfo: DeviceInfo = {
      deviceId: deviceId,
      adid: adid,
      ipAddress: realIPAddress,
      model: model,
      manufacturer: manufacturer,
      osVersion: osVersion,
      carrier: carrier,
      appVersion: appVersion,
      buildNumber: buildNumber,
      bundleId: bundleId,
      deviceName: deviceName,
      userAgent: `${Platform.OS}/${osVersion}`,
      isTablet: isTablet,
      isLocationEnabled: true, 
      timestamp: Math.floor(Date.now() / 1000),
    };

    deviceInfo.networkType = 'CELLULAR';
    deviceInfo.isConnected = true;
    deviceInfo.isInternetReachable = true;
    deviceInfo.cellularGeneration = '4g'; 
    deviceInfo.carrierName = carrier;
    deviceInfo.ssid = null;
    deviceInfo.bssid = null;

    console.log('네트워크 정보 (기본값):', {
      type: deviceInfo.networkType,
      isConnected: deviceInfo.isConnected,
      isInternetReachable: deviceInfo.isInternetReachable,
      carrierName: deviceInfo.carrierName,
      cellularGeneration: deviceInfo.cellularGeneration,
    });

    deviceInfo.mnetwork = '4'; 

    deviceInfo.carrierCode = '1'; 

    console.log('수집된 디바이스 정보:', deviceInfo);
    return deviceInfo;
  } catch (error) {
    console.error('디바이스 정보 수집 실패:', error);
    throw error;
  }
}

export { getStoredAdvertisingId, storeAdvertisingId, clearStoredAdvertisingId };

