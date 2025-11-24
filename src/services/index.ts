
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_ce4741 } from '../navigation';
import { v_96ef47 } from '../types';
import { v_e4a763 } from '../utils/env';

const v_8a74cb = 20000;

const v_e4d665 = async (v_c65f5d) => {
  try {
    const v_042a8b = await v_e84827.getItem('isLoggedIn');
    if (v_c65f5d) {
      if (v_042a8b === 'true') {

        v_c65f5d.reset({
          index: 0,
          routes: [{ name: v_ce4741.map }],
        });
      } else {

        v_c65f5d.reset({
          index: 0,
          routes: [{ name: v_ce4741.login }],
        });
      }
    }
  } catch (v_5e9bfe) {
    console.error('타임아웃 처리 중 오류:', v_5e9bfe);
    if (v_c65f5d) {

      v_c65f5d.reset({
        index: 0,
        routes: [{ name: v_ce4741.login }],
      });
    }
  }
};

export const v_d61bb8 = async (
  v_f71b56,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_4fc7c7 = new AbortController();
  const v_3894d5 = setTimeout(() => v_4fc7c7.abort(), v_8a74cb);

  try {
    const v_3393e3 = await fetch(v_f71b56, {
      ...v_b36f96,
      signal: v_4fc7c7.signal,
    });
    clearTimeout(v_3894d5);
    return v_3393e3;
  } catch (v_5e9bfe) {
    clearTimeout(v_3894d5);
    if (v_5e9bfe instanceof Error && v_5e9bfe.name === 'AbortError') {

      if (v_c65f5d) {
        await v_e4d665(v_c65f5d);
      }
      throw new Error('API request timeout');
    }
    throw v_5e9bfe;
  }
};

export const v_0a1127 = async (
  v_09dafd,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_c9c489 = v_e4a763();
  const v_36dd9e = v_c9c489.GATEWAY_AUTH_CODE;
  const v_7dac96 = `${v_c9c489.GATEWAY}${v_36dd9e}&endpoint=${v_09dafd}`;

  return v_d61bb8(v_7dac96, v_b36f96, v_c65f5d);
};

export const v_12a388 = async (
  v_09dafd,
  v_b36f96 = {},
  v_c65f5d,
): Promise<Response> => {
  const v_c9c489 = v_e4a763();
  const v_c01615 = v_c9c489.GATEWAY_NODEJS;
  const v_f71b56 = v_09dafd.startsWith('/') 
    ? `${v_c01615}${v_09dafd}` 
    : `${v_c01615}/${v_09dafd}`;

  return v_d61bb8(v_f71b56, v_b36f96, v_c65f5d);
};

export const v_495832 = async (
  v_c65f5d,
): Promise<v_96ef47> => {

  return Promise.resolve({
    success: true,
    emergencyStop: {
      enabled: false, 
      message: undefined,
      link: undefined,
    },
  });

};

