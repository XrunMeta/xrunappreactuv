import { v_03e392, v_5f4661 } from 'rcmrninabrnb';
import * as v_fba5a0 from 'hfxxehldoiokdq';

export const v_db97fb = async (
  v_3b402b,
  v_e5db92 = '지갑 주소가 복사되었습니다.',
) => {
  try {
    await v_fba5a0.setStringAsync(v_3b402b);
    v_03e392.alert('주소 복사', v_e5db92);
  } catch (v_5e9bfe) {
    v_03e392.alert('복사 실패', '주소를 복사하지 못했습니다. 다시 시도해주세요.');
  }
};

export * from './env';

export * from './imageCache';

export const v_35c0e0 = (v_f63e09): string => {
  const v_0ad8c5 = typeof v_f63e09 === 'string' ? parseFloat(v_f63e09) : v_f63e09;
  if (isNaN(v_0ad8c5)) return '0';
  if (v_0ad8c5 === 0) return '0';

  if (v_0ad8c5 > 0 && v_0ad8c5 < 0.000001) {
    return '< 0.000001';
  }

  return v_0ad8c5.toFixed(6);
};

export const v_d7e45e = (v_f63e09): string => {
  const v_0ad8c5 = parseFloat(String(v_f63e09));
  if (isNaN(v_0ad8c5) || v_0ad8c5 === 0) return '₩0';

  return (
    '₩' +
    v_0ad8c5.toLocaleString('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

export const v_b9db3d = (v_4c90cc, v_beea9d): number => {
  const v_844935 = typeof v_4c90cc === 'string' ? parseFloat(v_4c90cc) : v_4c90cc;
  const v_2d20f9 = typeof v_beea9d === 'string' ? parseFloat(v_beea9d) : v_beea9d;

  if (isNaN(v_844935) || isNaN(v_2d20f9) || v_844935 === 0 || v_2d20f9 === 0) {
    return 0;
  }

  const v_43c42e = v_844935 * v_2d20f9;
  return Math.round(v_43c42e * 100) / 100;
};

export const v_89f939 = (v_f63e09, v_a832b3 = ''): string => {

  if (v_f63e09 === null || v_f63e09 === undefined) return '0';

  if (typeof v_f63e09 === 'object' && v_f63e09 !== null) {
    console.warn('[formatCurrency] 객체를 받았습니다:', v_f63e09);
    return '0';
  }

  let v_e035c6;
  if (typeof v_f63e09 === 'string') {

    v_e035c6 = parseFloat(v_f63e09.replace(/[^\d.-]/g, ''));
  } else if (typeof v_f63e09 === 'number') {
    v_e035c6 = v_f63e09;
  } else {
    console.warn('[formatCurrency] 유효하지 않은 타입:', typeof v_f63e09);
    return '0';
  }

  if (isNaN(v_e035c6)) {
    return '0';
  }

  const v_c9526b = (v_fb558e): string => {
    const v_468545 = v_fb558e.toString().split('.');
    v_468545[0] = v_468545[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return v_468545.join('.');
  };

  if (v_a832b3 === 'KRW') {

    return v_c9526b(v_e035c6) + ' KRW';
  } else if (v_a832b3 === 'USD') {

    return '$' + v_e035c6.toFixed(2);
  } else if (v_a832b3 === 'XRUN') {

    return v_c9526b(v_e035c6) + ' XRUN';
  } else {

    const v_864a3e = v_c9526b(v_e035c6);
    return v_a832b3 ? `${v_864a3e} ${v_a832b3}` : v_864a3e;
  }
};

export const v_a3bbf0 = async (
  v_5254bf,
  v_412c99,
  v_c65f5d,
): Promise<void> => {
  try {

    const v_17aa0b = 'https://play.google.com/store/apps/details?id=run.xrun.xrunapp';
    const v_47d9ba = 'https://apps.apple.com/id/app/xrun-go/id6502924173';

    const v_b657c9 = v_5254bf?.screen_info?.button?.share || '공유하기';

    const v_a8cd21 = `${v_b657c9}${v_412c99.email}\n\n다운로드:\nAndroid: ${v_17aa0b}\niOS: ${v_47d9ba}`;

    const v_43c42e = await v_5f4661.share({
      message: v_a8cd21,
    });

    if (v_43c42e.action === v_5f4661.sharedAction) {
      if (v_43c42e.activityType) {

        console.log(`${v_43c42e.activityType}로 성공적으로 공유됨`);
      } else {

        console.log('성공적으로 공유됨');
      }
    } else if (v_43c42e.action === v_5f4661.dismissedAction) {

      console.log('공유가 취소됨');
    }
  } catch (v_5e9bfe) {
    v_03e392.alert('공유 실패', v_5e9bfe.message || '레퍼럴 링크를 공유하지 못했습니다.');
    console.log('Share error:', v_5e9bfe);
    if (v_c65f5d) {

    }
  }
};

