import { v_5f4661, v_326be8, v_405151, v_03e392 } from 'rcmrninabrnb';
import * as v_fba5a0 from 'hfxxehldoiokdq';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import * as v_a928e1 from 'yvptvjtrs';

export const v_cba33f = (v_a8cd21) => {
  if (v_326be8.OS === 'android') {
    v_405151.show(v_a8cd21, v_405151.SHORT);
  } else {

    v_03e392.alert('', v_a8cd21, [{ text: '확인' }]);
  }
};

export const v_db97fb = async (
  v_3b402b,
  v_889fad,
  v_e5db92 = '지갑 주소가 복사되었습니다.',
) => {
  try {
    await v_fba5a0.setStringAsync(v_3b402b);

    v_cba33f(v_e5db92);
  } catch (v_5e9bfe) {

    v_cba33f('주소를 복사하지 못했습니다. 다시 시도해주세요.');
  }
};

export * from './env';

export * from './imageCache';

export * from './input';

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
  v_8d41d7,
  v_412c99,
  v_889fad,
  v_c65f5d,
): Promise<void> => {
  try {

    const v_17aa0b = 'https://play.google.com/store/apps/details?id=run.xrun.xrunapp';
    const v_47d9ba = 'https://apps.apple.com/id/app/xrun-go/id6502924173';

    const v_c79b94 = encodeURIComponent(v_412c99.email);
    const v_25f202 = `https://www.xrun.run/invite?referral=${v_c79b94}`;

    const v_b657c9 = v_8d41d7('screens.referral.share.shareText');
    const v_542b81 = v_8d41d7('screens.referral.share.download');

    const v_a8cd21 = `${v_b657c9}${v_412c99.email}\n\n🔗 바로가기 ${v_25f202}`;

    const v_43c42e = await v_5f4661.share({ message: v_a8cd21 });
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
    await v_889fad(v_8d41d7('screens.referral.share.shareFailed'), v_5e9bfe.message || v_8d41d7('screens.referral.share.shareFailedMessage'));
    console.log('Share error:', v_5e9bfe);
    if (v_c65f5d) {

    }
  }
};

export const v_8cf86b = (v_e0c7e8): string => {

  if (!v_e0c7e8 || typeof v_e0c7e8 !== 'string' || !v_e0c7e8.includes('@')) {
    return v_e0c7e8; 
  }

  const [v_2abccc, v_52b478] = v_e0c7e8.split('@');

  if (!v_2abccc || v_2abccc.length === 0) {
    return v_e0c7e8;
  }

  const v_d7216b = Math.min(2, v_2abccc.length);
  const v_0a0e7f = v_2abccc.substring(0, v_d7216b);

  const v_993e85 = Math.floor(Math.random() * 5) + 5; 
  const v_4e6bb2 = '*'.repeat(v_993e85);

  return `${v_0a0e7f}${v_4e6bb2}@${v_52b478}`;
};

export const v_3414e3 = (v_660822, v_e0c7e8): string => {
  const v_e75c90 = `${v_660822}${v_e0c7e8}`;
  return v_a928e1.SHA256(v_e75c90).toString();
};

export const v_989c00 = async (
  v_660822,
  v_e0c7e8,
  v_ef86b6,
): Promise<void> => {
  if (!v_660822) return;

  const v_598405 = v_3414e3(v_660822, v_e0c7e8);
  await v_e84827.setItem(`customTokens_${v_598405}`, JSON.stringify(v_ef86b6));
};

export const v_506ca9 = async (
  v_660822,
  v_e0c7e8,
): Promise<any[]> => {
  if (!v_660822) return [];

  const v_598405 = v_3414e3(v_660822, v_e0c7e8);
  const v_ef86b6 = await v_e84827.getItem(`customTokens_${v_598405}`);
  return v_ef86b6 ? JSON.parse(v_ef86b6) : [];
};

export const v_bebb2d = async (): Promise<{ isColdStart: boolean; elapsedSeconds: number } | null> => {
  try {

    const v_48b589 = await v_e84827.getItem('coldStartChecked');
    const v_1809fa = await v_e84827.getItem('app_last_background_timestamp');
    const v_b10cff = await v_e84827.getItem('checkedTimestamp');

    const v_3a7b16 = Math.floor(Date.now() / 1000);

    console.log('[Utils] checkColdStart 시작:', {
      coldStartChecked: v_48b589,
      lastBackgroundTimestamp: v_1809fa,
      checkedTimestamp: v_b10cff,
      currentTimestamp: v_3a7b16,
      currentTimeISO: new Date(v_3a7b16 * 1000).toISOString(),
    });

    if (v_48b589 === 'true' && v_b10cff) {

      if (!v_1809fa) {

        const v_3281b5 = await v_e84827.getItem('isColdStart');
        const v_720111 = await v_e84827.getItem('elapsedSeconds');
        const v_79cdcd = v_720111 ? parseInt(v_720111, 10) : 0;
        console.log('[Utils] 백그라운드 타임스탬프 없음 - 기존 결과 반환:', {
          isColdStart: v_3281b5,
          elapsedSeconds: v_79cdcd,
        });
        return {
          isColdStart: v_3281b5 === 'true',
          elapsedSeconds: v_79cdcd,
        };
      }

      let v_3d8bda;

      const v_d77ee3 = /^\d+$/.test(v_1809fa);
      if (!v_d77ee3) {

        console.warn('[Utils] 백그라운드 타임스탬프가 숫자 형식이 아닙니다:', v_1809fa, '(날짜 형식으로 변환 시도)');
        try {

          const v_9cb421 = new Date(v_1809fa);
          const v_b08759 = Math.floor(v_9cb421.getTime() / 1000);

          if (isNaN(v_b08759) || v_b08759 <= 0 || v_b08759 > v_3a7b16) {

            console.warn('[Utils] 날짜 형식 변환 실패 또는 유효하지 않은 값:', v_1809fa, '(콜드스타트로 간주합니다.)');
            await v_e84827.removeItem('app_last_background_timestamp');
            await v_e84827.setItem('isColdStart', 'true');
            await v_e84827.setItem('elapsedSeconds', '0');
            await v_e84827.setItem('checkedTimestamp', v_3a7b16.toString());
            return { isColdStart: true, elapsedSeconds: 0 };
          }

          v_3d8bda = v_b08759;
          await v_e84827.setItem('app_last_background_timestamp', v_3d8bda.toString());
          console.log('[Utils] 날짜 형식을 타임스탬프(초 단위)로 변환하여 저장:', v_1809fa, '->', v_3d8bda);
        } catch (v_5e9bfe) {

          console.warn('[Utils] 날짜 형식 변환 중 오류:', v_5e9bfe, '(콜드스타트로 간주합니다.)');
          await v_e84827.removeItem('app_last_background_timestamp');
          await v_e84827.setItem('isColdStart', 'true');
          await v_e84827.setItem('elapsedSeconds', '0');
          await v_e84827.setItem('checkedTimestamp', v_3a7b16.toString());
          return { isColdStart: true, elapsedSeconds: 0 };
        }
      } else {

        let v_8be971 = parseInt(v_1809fa, 10);

        if (v_8be971 >= 1000000000000) {
          console.log('[Utils] 밀리초 형식 감지, 초 단위로 변환:', v_8be971, '->', Math.floor(v_8be971 / 1000));
          v_8be971 = Math.floor(v_8be971 / 1000);

          await v_e84827.setItem('app_last_background_timestamp', v_8be971.toString());
        }

        v_3d8bda = v_8be971;
        if (isNaN(v_3d8bda) || v_3d8bda <= 0 || v_3d8bda > v_3a7b16) {

          console.warn('[Utils] 백그라운드 타임스탬프가 유효하지 않습니다:', v_1809fa, '(콜드스타트로 간주합니다.)');
          await v_e84827.removeItem('app_last_background_timestamp');
          await v_e84827.setItem('isColdStart', 'true');
          await v_e84827.setItem('elapsedSeconds', '0');
          await v_e84827.setItem('checkedTimestamp', v_3a7b16.toString());
          return { isColdStart: true, elapsedSeconds: 0 };
        }
      }

      let v_93b8e4 = parseInt(v_b10cff, 10);

      if (v_93b8e4 >= 1000000000000) {
        console.log('[Utils] checkedTimestamp 밀리초 형식 감지, 초 단위로 변환:', v_93b8e4, '->', Math.floor(v_93b8e4 / 1000));
        v_93b8e4 = Math.floor(v_93b8e4 / 1000);

        await v_e84827.setItem('checkedTimestamp', v_93b8e4.toString());
      }

      console.log('[Utils] 타임스탬프 비교:', {
        backgroundTimestamp: v_3d8bda,
        checkedTimestampNum: v_93b8e4,
        currentTimestamp: v_3a7b16,
        backgroundTimeISO: new Date(v_3d8bda * 1000).toISOString(),
        checkedTimeISO: v_93b8e4 > 0 ? new Date(v_93b8e4 * 1000).toISOString() : 'invalid',
        currentTimeISO: new Date(v_3a7b16 * 1000).toISOString(),
      });

      const v_79cdcd = v_3a7b16 - v_3d8bda;
      const v_3281b5 = v_79cdcd >= 600; 

      console.log('[Utils] 경과 시간 재계산:', {
        currentTimestamp: v_3a7b16,
        backgroundTimestamp: v_3d8bda,
        elapsedSeconds: v_79cdcd,
        isColdStart: v_3281b5,
        backgroundTimeISO: new Date(v_3d8bda * 1000).toISOString(),
        currentTimeISO: new Date(v_3a7b16 * 1000).toISOString(),
      });

      if (!isNaN(v_93b8e4) && v_93b8e4 > 0 && v_3d8bda <= v_93b8e4) {
        const v_9e6dda = await v_e84827.getItem('isColdStart');
        const v_fd28ae = await v_e84827.getItem('elapsedSeconds');
        const v_c2ebad = v_fd28ae ? parseInt(v_fd28ae, 10) : 0;
        console.log('[Utils] 백그라운드 시간이 체크 시간 이전 - 기존 결과 반환:', {
          savedIsColdStart: v_9e6dda,
          savedElapsedSeconds: v_c2ebad,
          calculatedElapsedSeconds: v_79cdcd,
          backgroundTimestamp: v_3d8bda,
          checkedTimestampNum: v_93b8e4,
        });
        return {
          isColdStart: v_9e6dda === 'true',
          elapsedSeconds: v_c2ebad,
        };
      }

      await v_e84827.setItem('isColdStart', v_3281b5 ? 'true' : 'false');
      await v_e84827.setItem('elapsedSeconds', v_79cdcd.toString());
      await v_e84827.setItem('checkedTimestamp', v_3a7b16.toString());

      const v_c2ebad = await v_e84827.getItem('elapsedSeconds');
      const v_9e6dda = await v_e84827.getItem('isColdStart');
      console.log('[Utils] 재계산 결과 저장 완료:', {
        savedElapsedSeconds: v_c2ebad,
        savedIsColdStart: v_9e6dda,
        calculatedElapsedSeconds: v_79cdcd,
        calculatedIsColdStart: v_3281b5,
      });

      return { isColdStart: v_3281b5, elapsedSeconds: v_79cdcd };
    }

    let v_3281b5 = false;
    let v_79cdcd = 0;

    if (!v_1809fa) {

      v_3281b5 = true;
      v_79cdcd = 0;
    } else {

      let v_3d8bda;

      const v_d77ee3 = /^\d+$/.test(v_1809fa);
      if (!v_d77ee3) {

        console.warn('[Utils] 백그라운드 타임스탬프가 숫자 형식이 아닙니다:', v_1809fa, '(날짜 형식으로 변환 시도)');
        try {

          const v_9cb421 = new Date(v_1809fa);
          const v_b08759 = Math.floor(v_9cb421.getTime() / 1000);

          if (isNaN(v_b08759) || v_b08759 <= 0 || v_b08759 > v_3a7b16) {

            console.warn('[Utils] 날짜 형식 변환 실패 또는 유효하지 않은 값:', v_1809fa, '(콜드스타트로 간주합니다.)');
            await v_e84827.removeItem('app_last_background_timestamp');
            v_3281b5 = true;
            v_79cdcd = 0;
          } else {

            v_3d8bda = v_b08759;
            await v_e84827.setItem('app_last_background_timestamp', v_3d8bda.toString());
            console.log('[Utils] 날짜 형식을 타임스탬프(초 단위)로 변환하여 저장:', v_1809fa, '->', v_3d8bda);

            v_79cdcd = v_3a7b16 - v_3d8bda;

            v_3281b5 = v_79cdcd >= 600;
          }
        } catch (v_5e9bfe) {

          console.warn('[Utils] 날짜 형식 변환 중 오류:', v_5e9bfe, '(콜드스타트로 간주합니다.)');
          await v_e84827.removeItem('app_last_background_timestamp');
          v_3281b5 = true;
          v_79cdcd = 0;
        }
      } else {

        let v_8be971 = parseInt(v_1809fa, 10);

        if (v_8be971 >= 1000000000000) {
          console.log('[Utils] 밀리초 형식 감지, 초 단위로 변환:', v_8be971, '->', Math.floor(v_8be971 / 1000));
          v_8be971 = Math.floor(v_8be971 / 1000);

          await v_e84827.setItem('app_last_background_timestamp', v_8be971.toString());
        }

        v_3d8bda = v_8be971;
        if (isNaN(v_3d8bda) || v_3d8bda <= 0 || v_3d8bda > v_3a7b16) {

          console.warn('[Utils] 백그라운드 타임스탬프가 유효하지 않습니다:', v_1809fa, '(콜드스타트로 간주합니다.)');
          await v_e84827.removeItem('app_last_background_timestamp');
          v_3281b5 = true;
          v_79cdcd = 0;
        } else {

          v_79cdcd = v_3a7b16 - v_3d8bda;

          v_3281b5 = v_79cdcd >= 600;

          console.log('[Utils] 새로 체크 - 경과 시간 계산:', {
            currentTimestamp: v_3a7b16,
            backgroundTimestamp: v_3d8bda,
            elapsedSeconds: v_79cdcd,
            isColdStart: v_3281b5,
            backgroundTimeISO: new Date(v_3d8bda * 1000).toISOString(),
            currentTimeISO: new Date(v_3a7b16 * 1000).toISOString(),
          });
        }
      }
    }

    await v_e84827.setItem('coldStartChecked', 'true');
    await v_e84827.setItem('isColdStart', v_3281b5 ? 'true' : 'false');
    await v_e84827.setItem('elapsedSeconds', v_79cdcd.toString());
    await v_e84827.setItem('checkedTimestamp', v_3a7b16.toString());

    const v_c2ebad = await v_e84827.getItem('elapsedSeconds');
    const v_9e6dda = await v_e84827.getItem('isColdStart');
    console.log('[Utils] 최종 저장 확인:', {
      savedElapsedSeconds: v_c2ebad,
      savedIsColdStart: v_9e6dda,
      elapsedSeconds: v_79cdcd,
      isColdStart: v_3281b5,
    });

    return { isColdStart: v_3281b5, elapsedSeconds: v_79cdcd };
  } catch (v_5e9bfe) {
    console.error('[Utils] 콜드스타트 감지 실패:', v_5e9bfe);

    await v_e84827.setItem('coldStartChecked', 'true');
    await v_e84827.setItem('isColdStart', 'true');
    await v_e84827.setItem('elapsedSeconds', '0');
    return { isColdStart: true, elapsedSeconds: 0 };
  }
};

export const v_f1ee1a = async (): Promise<{ isColdStart: boolean; elapsedSeconds: number } | null> => {
  try {
    const v_48b589 = await v_e84827.getItem('coldStartChecked');
    if (v_48b589 !== 'true') {

      return null;
    }

    const v_3281b5 = await v_e84827.getItem('isColdStart');
    const v_720111 = await v_e84827.getItem('elapsedSeconds');
    const v_79cdcd = v_720111 ? parseInt(v_720111, 10) : 0;

    return {
      isColdStart: v_3281b5 === 'true',
      elapsedSeconds: v_79cdcd,
    };
  } catch (v_5e9bfe) {
    console.error('[Utils] 콜드스타트 결과 가져오기 실패:', v_5e9bfe);
    return null;
  }
};

