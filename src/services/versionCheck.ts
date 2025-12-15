import { v_326be8 } from 'rcmrninabrnb';
import * as v_222528 from 'objipkycgyawxjjk';
import * as v_f2c756 from 'rddjsfilumpz';
import v_c9be60 from 'qfrscldecidiqs';

const v_d929eb = 'run.xrun.xrunapps';

const v_a36c92 = 'run.xrun.xrunapp';

const v_b010c2 = async (): Promise<string | null> => {
  try {
    const v_f71b56 = `https://itunes.apple.com/lookup?bundleId=${v_d929eb}`;
    const v_3393e3 = await fetch(v_f71b56);
    const v_9390e8 = await v_3393e3.json();

    if (v_9390e8.results && v_9390e8.results.length > 0) {
      const v_14feb2 = v_9390e8.results[0].version;
      return v_14feb2;
    }
    return null;
  } catch (v_5e9bfe) {
    console.error('[VersionCheck] iOS 버전 확인 실패:', v_5e9bfe);
    return null;
  }
};

const v_49143f = async (): Promise<string | null> => {
  try {

    return null;
  } catch (v_5e9bfe) {
    console.error('[VersionCheck] Android 버전 확인 실패:', v_5e9bfe);
    return null;
  }
};

export const v_deac27 = (): string => {
  try {

    const v_0e1851 = v_222528.nativeApplicationVersion;
    return v_0e1851 || v_c9be60.expoConfig?.version || '1.0.0';
  } catch (v_5e9bfe) {
    console.error('[VersionCheck] 현재 앱 버전 가져오기 실패:', v_5e9bfe);
    return '1.0.0';
  }
};

export const v_f16a74 = async (): Promise<string | null> => {
  if (v_326be8.OS === 'ios') {
    return await v_b010c2();
  } else if (v_326be8.OS === 'android') {
    return await v_49143f();
  }
  return null;
};

export const v_790b4f = (v_4587b3, v_14feb2): boolean => {
  if (!v_14feb2) return false;

  const v_544473 = (v_0e1851): number[] => {
    return v_0e1851.split('.').map(Number);
  };

  const v_275ccd = v_544473(v_4587b3);
  const v_1300ee = v_544473(v_14feb2);

  for (let v_ebec57 = 0; v_ebec57 < Math.max(v_275ccd.length, v_1300ee.length); v_ebec57++) {
    const v_52a830 = v_275ccd[v_ebec57] || 0;
    const v_fea0bb = v_1300ee[v_ebec57] || 0;

    if (v_fea0bb > v_52a830) {
      return true;
    } else if (v_fea0bb < v_52a830) {
      return false;
    }
  }

  return false; 
};

export const v_e8b9c4 = (): string => {
  if (v_326be8.OS === 'ios') {

    return `https://apps.apple.com/app/bundle-id/${v_d929eb}`;
  } else if (v_326be8.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${v_a36c92}`;
  }
  return '';
};

export const v_4503ee = async (): Promise<void> => {
  try {
    const v_b71a74 = v_e8b9c4();
    if (v_b71a74) {
      const v_20e8d1 = await v_f2c756.canOpenURL(v_b71a74);
      if (v_20e8d1) {
        await v_f2c756.openURL(v_b71a74);
      } else {
        console.error('[VersionCheck] 스토어 링크를 열 수 없습니다:', v_b71a74);
      }
    }
  } catch (v_5e9bfe) {
    console.error('[VersionCheck] 스토어로 이동 실패:', v_5e9bfe);
  }
};
