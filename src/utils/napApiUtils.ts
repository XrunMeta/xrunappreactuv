

import { v_326be8 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import * as v_a06ea0 from 'wtbgvqvuebu';
import { v_719e34 } from '../types';

const v_13865d = 'xrun_advertising_id';
const v_2d5e01 = 'xrun_advertising_id_timestamp';

async function v_7f7612(): Promise<string | null> {
  try {
    const v_d9661b = await v_e84827.getItem(v_13865d);
    const v_42044e = await v_e84827.getItem(v_2d5e01);

    if (v_d9661b && v_42044e) {
      const v_4f43a8 = parseInt(v_42044e, 10);
      const v_dcebe9 = Date.now();
      const v_cb087a = (v_dcebe9 - v_4f43a8) / (1000 * 60 * 60 * 24);

      if (v_cb087a <= 30) {
        console.log('✅ 저장된 광고 식별자 사용:', v_d9661b);
        console.log(`저장된 지 ${Math.floor(v_cb087a)}일 경과`);
        return v_d9661b;
      } else {
        console.log('⚠️ 저장된 광고 식별자가 30일 경과, 새로 생성');

        await v_e84827.removeItem(v_13865d);
        await v_e84827.removeItem(v_2d5e01);
      }
    }

    return null;
  } catch (v_5e9bfe) {
    console.error('저장된 광고 식별자 가져오기 실패:', v_5e9bfe);
    return null;
  }
}

async function v_7ecd61(v_36e78d): Promise<void> {
  try {
    const v_42044e = Date.now().toString();
    await v_e84827.setItem(v_13865d, v_36e78d);
    await v_e84827.setItem(v_2d5e01, v_42044e);
    console.log('✅ 광고 식별자 저장 완료:', v_36e78d);
  } catch (v_5e9bfe) {
    console.error('광고 식별자 저장 실패:', v_5e9bfe);
  }
}

const v_312c59 = 5 * 60 * 1000; 
let v_4b75b8 = null;

async function v_285ae6(): Promise<string> {
  const v_5c2f9f = Date.now();
  if (v_4b75b8 && v_5c2f9f - v_4b75b8.at < v_312c59) {
    return v_4b75b8.ip;
  }
  try {
    console.log('=== 실제 IP 주소 가져오기 시작 ===');

    const v_4cf7da = [
      'https://oth-path.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://oth-path.my-ip.io/ip.json',
      'https://ipinfo.io/json',
    ];

    for (const v_273dc4 of v_4cf7da) {
      try {
        console.log(`IP 서비스 시도: ${v_273dc4}`);

        const v_4fc7c7 = new AbortController();
        const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), 2500);

        const v_3393e3 = await fetch(v_273dc4, {
          method: 'GET',
          signal: v_4fc7c7.signal,
        });

        clearTimeout(v_3894d5);

        if (v_3393e3.ok) {
          const v_9390e8 = await v_3393e3.json();
          let v_b8cf29 = null;

          if (v_9390e8.ip) {
            v_b8cf29 = v_9390e8.ip;
          } else if (v_9390e8.query) {
            v_b8cf29 = v_9390e8.query;
          } else if (v_9390e8.ipAddress) {
            v_b8cf29 = v_9390e8.ipAddress;
          }

          if (v_b8cf29 && v_101757(v_b8cf29)) {
            console.log(`✅ 실제 IP 주소 가져오기 성공: ${v_b8cf29}`);
            v_4b75b8 = { ip: v_b8cf29, at: Date.now() };
            return v_b8cf29;
          }
        }
      } catch (v_779bc5) {
        console.log(`IP 서비스 실패: ${v_273dc4}`, v_779bc5.message);
        continue;
      }
    }

    console.log('⚠️ 모든 IP 서비스 실패 - 기본 IP 사용');
    return '127.0.0.1';

  } catch (v_5e9bfe) {
    console.error('❌ IP 주소 가져오기 실패:', v_5e9bfe);
    return '127.0.0.1';
  }
}

function v_101757(v_70cac0): boolean {
  if (!v_70cac0 || typeof v_70cac0 !== 'string') return false;

  const v_ea7802 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  const v_d4768b = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return v_ea7802.test(v_70cac0) || v_d4768b.test(v_70cac0);
}

const v_9f8705 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(v_3f4e2e) {
    const v_cb35cb = Math.random() * 16 | 0;
    const v_81e2ef = v_3f4e2e === 'x' ? v_cb35cb : (v_cb35cb & 0x3 | 0x8);
    return v_81e2ef.toString(16);
  });
};

function v_a68321(v_bdb39e): string {

  let v_8fb131 = v_bdb39e;
  const v_7d9783 = (v_43e24b, v_d2c6bf): number => {
    v_8fb131 = (v_8fb131 * 9301 + 49297) % 233280;
    return v_43e24b + (v_8fb131 / 233280) * (v_d2c6bf - v_43e24b);
  };

  const v_993b31 = '0123456789abcdef';
  let v_07ba85 = '';

  for (let v_ebec57 = 0; v_ebec57 < 36; v_ebec57++) {
    if (v_ebec57 === 8 || v_ebec57 === 13 || v_ebec57 === 18 || v_ebec57 === 23) {
      v_07ba85 += '-';
    } else if (v_ebec57 === 14) {
      v_07ba85 += '4'; 
    } else if (v_ebec57 === 19) {
      v_07ba85 += v_993b31[Math.floor(v_7d9783(8, 12))]; 
    } else {
      v_07ba85 += v_993b31[Math.floor(v_7d9783(0, 16))];
    }
  }

  return v_07ba85;
}

function v_a0989d(v_fba864): number {
  let v_598405 = 0;
  for (let v_ebec57 = 0; v_ebec57 < v_fba864.length; v_ebec57++) {
    const v_620da0 = v_fba864.charCodeAt(v_ebec57);
    v_598405 = ((v_598405 << 5) - v_598405) + v_620da0;
    v_598405 = v_598405 & v_598405; 
  }
  return Math.abs(v_598405);
}

function v_05b125(v_36e78d): string {
  if (!v_36e78d || typeof v_36e78d !== 'string') {
    console.log('유효하지 않은 광고 식별자, 새로 생성');
    return v_9f8705();
  }

  if (v_36e78d.length === 36 && v_36e78d.includes('-')) {
    console.log('이미 올바른 형식의 광고 식별자');
    return v_36e78d;
  }

  if (/^\d+$/.test(v_36e78d)) {
    console.log('숫자 형식의 광고 식별자를 UUID로 변환');

    const v_bdb39e = parseInt(v_36e78d.slice(-8), 10); 
    return v_a68321(v_bdb39e);
  }

  if (v_36e78d.length > 0) {
    console.log('문자열 형식의 광고 식별자를 UUID로 변환');

    const v_598405 = v_a0989d(v_36e78d);
    return v_a68321(v_598405);
  }

  console.log('알 수 없는 형식의 광고 식별자, 새로 생성');
  return v_9f8705();
}

async function v_088885(): Promise<string> {
  try {
    console.log('=== 광고 식별자 가져오기 시작 ===');

    const v_3271c9 = await v_7f7612();
    if (v_3271c9) {
      return v_3271c9;
    }

    const v_86658f = !v_a06ea0.isDevice;
    if (v_86658f) {
      console.log('📱 에뮬레이터에서 실행 중 - 테스트용 광고 ID 사용');
      const v_3f8c9b = '00000000-0000-0000-0000-000000000000';
      console.log('테스트용 광고 ID:', v_3f8c9b);
      await v_7ecd61(v_3f8c9b); 
      return v_3f8c9b;
    }

    try {

      const v_b6fcfe = v_a06ea0.modelName || '';
      const v_ea6cbd = v_a06ea0.brand || '';
      const v_6ba929 = v_a06ea0.deviceName || '';
      const v_929b58 = `${v_ea6cbd}-${v_b6fcfe}-${v_6ba929}` || 'unknown';
      console.log('Device 정보:', { modelName: v_b6fcfe, brand: v_ea6cbd, deviceName: v_6ba929, deviceId: v_929b58 });

      if (v_929b58 && v_929b58 !== 'unknown') {
        console.log('✅ 디바이스 정보 사용:', v_929b58);

        const v_513054 = v_05b125(v_929b58);
        console.log('✅ 광고 식별자 형식 변환 완료:', v_513054);
        await v_7ecd61(v_513054); 
        return v_513054;
      }
    } catch (v_eb8c5e) {
      console.log('Device 정보 가져오기 실패:', v_eb8c5e);
    }

    const v_95b37f = v_9f8705();
    console.log('⚠️ 광고 식별자를 가져올 수 없어 랜덤 UUID 사용:', v_95b37f);
    await v_7ecd61(v_95b37f); 
    return v_95b37f;
  } catch (v_5e9bfe) {
    console.error('❌ 광고 식별자 가져오기 실패:', v_5e9bfe);

    const v_fedb63 = v_9f8705();
    console.log('에러 시 최종 대체 UUID:', v_fedb63);
    await v_7ecd61(v_fedb63); 
    return v_fedb63;
  }
}

async function v_264aa2(): Promise<void> {
  try {
    await v_e84827.removeItem(v_13865d);
    await v_e84827.removeItem(v_2d5e01);
    console.log('✅ 저장된 광고 식별자 삭제 완료');
  } catch (v_5e9bfe) {
    console.error('저장된 광고 식별자 삭제 실패:', v_5e9bfe);
  }
}

export async function v_a4e2ac(): Promise<v_719e34> {
  const v_b6fcfe = v_a06ea0.modelName || 'unknown';
  const v_ea6cbd = v_a06ea0.brand || 'unknown';
  const v_6ba929 = v_a06ea0.deviceName || 'unknown';
  const v_929b58 = `${v_ea6cbd}-${v_b6fcfe}-${v_6ba929}`;
  const v_a4f17b = (await v_7f7612()) || '';
  const v_e69562 = v_a06ea0.osVersion || 'unknown';
  const deviceInfo: v_719e34 = {
    deviceId: v_929b58,
    adid: v_a4f17b,
    ipAddress: '',
    model: v_b6fcfe,
    manufacturer: v_ea6cbd,
    osVersion: v_e69562,
    carrier: null,
    appVersion: v_a06ea0.osVersion || 'unknown',
    buildNumber: v_a06ea0.osBuildId || 'unknown',
    bundleId: v_a06ea0.osInternalBuildId || 'unknown',
    deviceName: v_6ba929,
    userAgent: `${v_326be8.OS}/${v_e69562}`,
    isTablet: v_a06ea0.deviceType === v_a06ea0.DeviceType.TABLET,
    isLocationEnabled: true,
    timestamp: Math.floor(Date.now() / 1000),
    os: v_326be8.OS,
  };
  v_e7f87b.networkType = 'CELLULAR';
  v_e7f87b.isConnected = true;
  v_e7f87b.isInternetReachable = true;
  v_e7f87b.cellularGeneration = '4g';
  v_e7f87b.carrierName = null;
  v_e7f87b.ssid = null;
  v_e7f87b.bssid = null;
  v_e7f87b.mnetwork = '4';
  v_e7f87b.carrierCode = '1';
  return v_e7f87b;
}

export async function v_f3de6d(): Promise<v_719e34> {
  try {

    const v_10a7f9 = await v_285ae6();

    const v_b6fcfe = v_a06ea0.modelName || 'unknown';
    const v_ea6cbd = v_a06ea0.brand || 'unknown';
    const v_6ba929 = v_a06ea0.deviceName || 'unknown';
    const v_929b58 = `${v_ea6cbd}-${v_b6fcfe}-${v_6ba929}`;
    const v_a4f17b = await v_088885();
    const v_768389 = v_b6fcfe;
    const v_ba9e66 = v_ea6cbd;
    const v_e69562 = v_a06ea0.osVersion || 'unknown';
    const v_298be1 = v_a06ea0.osVersion || 'unknown';
    const v_f229e4 = v_a06ea0.osBuildId || 'unknown';
    const v_ff0ad4 = v_a06ea0.osInternalBuildId || 'unknown';
    const v_76eb7f = v_a06ea0.deviceType === v_a06ea0.DeviceType.TABLET;

    const v_4bf16f = null;

    const deviceInfo: v_719e34 = {
      deviceId: v_929b58,
      adid: v_a4f17b,
      ipAddress: v_10a7f9,
      model: v_768389,
      manufacturer: v_ba9e66,
      osVersion: v_e69562,
      carrier: v_4bf16f,
      appVersion: v_298be1,
      buildNumber: v_f229e4,
      bundleId: v_ff0ad4,
      deviceName: v_6ba929,
      userAgent: `${v_326be8.OS}/${v_e69562}`,
      isTablet: v_76eb7f,
      isLocationEnabled: true, 
      timestamp: Math.floor(Date.now() / 1000),
    };

    v_e7f87b.networkType = 'CELLULAR';
    v_e7f87b.isConnected = true;
    v_e7f87b.isInternetReachable = true;
    v_e7f87b.cellularGeneration = '4g'; 
    v_e7f87b.carrierName = v_4bf16f;
    v_e7f87b.ssid = null;
    v_e7f87b.bssid = null;

    console.log('네트워크 정보 (기본값):', {
      type: v_e7f87b.networkType,
      isConnected: v_e7f87b.isConnected,
      isInternetReachable: v_e7f87b.isInternetReachable,
      carrierName: v_e7f87b.carrierName,
      cellularGeneration: v_e7f87b.cellularGeneration,
    });

    v_e7f87b.mnetwork = '4'; 

    v_e7f87b.carrierCode = '1'; 

    console.log('수집된 디바이스 정보:', v_e7f87b);
    return v_e7f87b;
  } catch (v_5e9bfe) {
    console.error('디바이스 정보 수집 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
}

export { v_7f7612, v_7ecd61, v_264aa2 };

