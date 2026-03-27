import v_a3453e, { v_5ab095, v_c4deb2, v_df9f57 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_19b633,
  v_4623af,
  v_39a996,
  v_9cabcb,
  v_aa7413,
  v_122070,
  v_2d4718,
  v_326be8,
  v_700696,
  v_79c4f2,
} from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de, v_89c10a, v_c2fdd1, v_570c34, v_ecee91 } from '../components';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_bae512, v_843035, v_202d44, v_789afd, v_1bd8ad, v_369014 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import {
  v_a7ab3c,
  v_152d53,
  v_7f8c9e,
  v_53d723,
  v_71d37e,
  v_07f367,
  v_60f557,
  v_11e39e,
  v_4296b8,
  v_7af6c9,
  v_8025d1,
} from '../services';
import { v_151d5f, v_5c7129, v_107459 } from '../utils/countryUtils';
import { v_58c98d } from '../utils/countryStateCityUtils';
import { v_da1883 } from '../types';

const v_0c96f7 = ['select', '10', '20', '30', '40', '50+'] as const;

export type GenderOption = 'male' | 'female' | 'select';

const v_a1244c = (v_c3eac4): number => {
  if (v_c3eac4 === 'female') return 2111;
  if (v_c3eac4 === 'select') return 2112;
  return 2110; 
};

const v_d6877d = (v_c3eac4): GenderOption => {
  if (v_c3eac4 === null || v_c3eac4 === undefined) return 'male';
  let v_7ac969;
  if (typeof v_c3eac4 === 'string') v_7ac969 = parseInt(v_c3eac4, 10);
  else v_7ac969 = v_c3eac4;
  if (isNaN(v_7ac969) || v_7ac969 === 0) return 'male';
  if (v_7ac969 === 2111) return 'female';
  if (v_7ac969 === 2112) return 'select';
  return 'male'; 
};

const v_e9394b = (age: (typeof v_0c96f7)[number]): number => {
  if (v_2694bd === 'select') return 0;
  const v_c3889d = {
    '10': 2210,
    '20': 2220,
    '30': 2230,
    '40': 2240,
    '50+': 2250,
  };
  return v_c3889d[v_2694bd] ?? 2210;
};

const v_596588 = (v_2694bd): (typeof v_0c96f7)[number] => {
  if (v_2694bd === 0 || v_2694bd === null || v_2694bd === undefined) return 'select';
  const ageMap: Record<number, (typeof v_0c96f7)[number]> = {
    2210: '10',
    2220: '20',
    2230: '30',
    2240: '40',
    2250: '50+',
  };
  return v_c3889d[v_2694bd] ?? 'select';
};

export const v_cdb169 = () => {
  const { t: v_8d41d7, i18n: v_9c213b } = v_772971();
  const { reset: v_487a25, canGoBack: v_7e32fb, goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const { selectedCountryDialCode: v_459d5e, setSelectedCountryDialCode: v_f693e7, setVerificationEmail: v_b572c3, setVerificationSuccessRoute: v_8f89f3, setSelectMode: v_67ab1c } = v_700ef9();

  const v_00d52a = v_a3453e.useRef(false);
  const v_2ca208 = v_a3453e.useRef(false);

  const v_6bee17 = v_a3453e.useRef(0);

  const v_df691e = v_326be8.OS === 'ios';

  const v_798085 = v_df691e
    ? [
        { value: 'select', label: v_8d41d7('screens.myInfoEdit.genderSelect') },
        { value: 'male', label: v_8d41d7('screens.myInfoEdit.genderMale') },
        { value: 'female', label: v_8d41d7('screens.myInfoEdit.genderFemale') },
      ]
    : [
        { value: 'male', label: v_8d41d7('screens.myInfoEdit.genderMale') },
        { value: 'female', label: v_8d41d7('screens.myInfoEdit.genderFemale') },
      ];
  const v_8b5eb1 = v_df691e ? v_0c96f7 : (['10', '20', '30', '40', '50+'] as const);
  const [v_a32a50, v_4944f5] = v_5ab095('');
  const [v_328bb4, v_b7613d] = v_5ab095('');
  const [v_05b02f, v_ef747e] = v_5ab095('');
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_3535cd, v_9f928c] = v_5ab095<string>('');
  const [v_d74a81, v_fcce73] = v_5ab095('');
  const [v_a6c30b, v_c030e3] = v_5ab095('대한민국 서울');
  const [v_222917, v_b8bf44] = v_5ab095<number | null>(null);
  const [v_a4d981, v_9b1714] = v_5ab095<number | null>(null);
  const [v_c3eac4, v_bdc43c] = v_5ab095<GenderOption>('male');
  const [v_2694bd, v_6e5c76] = v_5ab095<(typeof v_0c96f7)[number]>('10');
  const [v_cd31a8, v_deef62] = v_5ab095(true);

  const v_c7a4de = 'myInfoEdit_formData';

  const [v_e495db, v_433822] = v_5ab095(false);
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);
  const [v_e94fdf, v_59ad99] = v_5ab095<Array<{ description?: string; subcode?: number; rCode?: number; rName?: string }>>([]);
  const [v_0908db, v_1c41ce] = v_5ab095(false);

  const [v_add96c, v_85a493] = v_5ab095<{ cDesc: string; cCode: number | null }>({ cDesc: '', cCode: null });
  const [v_167c8b, v_655be9] = v_5ab095<{ rDesc: string; rCode: number | null }>({ rDesc: '', rCode: null });

  const [v_3a64df, v_c73419] = v_5ab095(false);
  const [v_db24c7, v_a0f6fa] = v_5ab095<string | null>(null);
  const [v_7962f1, v_6a0bf8] = v_5ab095('');
  const [v_963133, v_24b641] = v_5ab095<v_da1883[]>([]);
  const [v_5f1e0e, v_dad6ca] = v_5ab095<boolean>(false);
  const [v_2f03bc, v_2f2d51] = v_5ab095<v_da1883 | null>(null);

  const [v_b67b40, v_a259be] = v_5ab095(false);
  const [v_6c7bef, v_7a68da] = v_5ab095<v_da1883[]>(v_1bd8ad);
  const [v_d6cff0, v_677cd9] = v_5ab095(false);
  const [v_bd30a1, v_e03dd9] = v_5ab095('');

  const v_2d5c3d = v_a3453e.useCallback((v_5a7a4f, v_222917, v_a4d981): string => {

    if (v_222917 === 0) {
      return v_8d41d7('screens.myInfoEdit.allRegions');
    }

    if (v_a4d981 && v_222917 !== null && v_222917 !== undefined && v_222917 > 0) {

      const v_9ad700 = [82, 81, 86, 1, 62];
      let v_b5249e;

      if (v_9ad700.includes(v_a4d981)) {

        v_b5249e = `regions.${v_a4d981}_${v_222917}`;
      } else {

        const v_1581b6 = v_5a7a4f
          .replace(/[^a-zA-Z0-9\s]/g, '') 
          .replace(/\s+/g, '_') 
          .toLowerCase();
        v_b5249e = `regions.${v_a4d981}_${v_1581b6}`;
      }

      try {
        const v_6dce25 = v_8d41d7(v_b5249e);

        if (v_6dce25 && v_6dce25 !== v_b5249e) {
          if (__DEV__) {
            console.log('[정보수정] 지역 번역 성공:', {
              key: v_b5249e,
              translated: v_6dce25,
              original: v_5a7a4f,
              countryCode: v_a4d981,
              regionCode: v_222917,
            });
          }
          return v_6dce25;
        } else {
          if (__DEV__) {
            console.warn('[정보수정] 지역 번역 키 없음:', {
              key: v_b5249e,
              countryCode: v_a4d981,
              regionCode: v_222917,
              original: v_5a7a4f,
              translated: v_6dce25,
            });
          }
        }
      } catch (v_5e9bfe) {
        if (__DEV__) {
          console.warn('[정보수정] 지역 번역 오류:', v_5e9bfe, {
            key: v_b5249e,
            countryCode: v_a4d981,
            regionCode: v_222917,
            original: v_5a7a4f,
          });
        }
      }
    }

    return v_5a7a4f;
  }, [v_8d41d7, v_9c213b.language]);

  const v_e1e7b1 = v_a3453e.useCallback((v_67cb9c, v_cc0c7d): string => {
    if (!v_67cb9c) return '';

    if (v_cc0c7d && v_cc0c7d !== 'select' && v_cc0c7d !== 'global' && v_cc0c7d.length === 2) {
      const v_4d2349 = `countries.${v_cc0c7d.toUpperCase()}`;
      try {
        const v_6dce25 = v_8d41d7(v_4d2349);
        if (v_6dce25 && v_6dce25 !== v_4d2349) {
          return v_6dce25;
        }
      } catch (v_5e9bfe) {
        if (__DEV__) {
          console.warn('[정보수정] 국가 번역 오류:', v_5e9bfe);
        }
      }
    }

    return v_67cb9c;
  }, [v_8d41d7]);

  const [v_9d09f1, v_d0e79e] = v_5ab095('');
  const [v_b6daf3, v_c94311] = v_5ab095('');
  const [v_318eac, v_edd340] = v_5ab095<GenderOption>('male');
  const [v_30922c, v_27ff98] = v_5ab095<(typeof v_0c96f7)[number]>('10');
  const [v_b6505c, v_4a9b82] = v_5ab095<number | null>(null);
  const [v_6e1588, v_8656e3] = v_5ab095<number | null>(null);

  const [v_e5393e, v_797964] = v_5ab095(false);

  const v_2c39d5 = async () => {
    try {
      const v_2e7cbb = {

        firstName: v_a32a50,
        lastName: v_328bb4,
        fullName: v_05b02f,
        phone: v_d74a81,
        gender: v_c3eac4,
        age: v_2694bd,
        tempCountry: v_add96c,
        tempRegion: v_167c8b,
        regionCode: v_222917,
        countryCode: v_a4d981,

        originalFirstName: v_9d09f1,
        originalLastName: v_b6daf3,
        originalGender: v_318eac,
        originalAge: v_30922c,
        originalCountryCode: v_b6505c,
        originalRegionCode: v_6e1588,
      };
      await v_e84827.setItem(v_c7a4de, JSON.stringify(v_2e7cbb));
      console.log('[정보수정] ✅ 입력값 저장 완료');
    } catch (v_5e9bfe) {
      console.error('[정보수정] 입력값 저장 실패:', v_5e9bfe);
    }
  };

  const v_f26975 = async (v_a1e5e9 = false) => {
    try {
      const v_3467c8 = await v_e84827.getItem(v_c7a4de);
      if (v_3467c8) {
        const v_f1d91d = JSON.parse(v_3467c8);

        if (v_f1d91d.firstName) {
          v_4944f5(v_f1d91d.firstName);
        }
        if (v_f1d91d.lastName) {
          v_b7613d(v_f1d91d.lastName);
        }

        if (v_f1d91d.fullName) {
          v_ef747e(v_f1d91d.fullName);
        } else if (v_f1d91d.firstName || v_f1d91d.lastName) {

          const v_419da8 = `${v_f1d91d.lastName || ''} ${v_f1d91d.firstName || ''}`.trim();
          v_ef747e(v_419da8);
        }
        if (v_f1d91d.phone) v_fcce73(v_f1d91d.phone);
        if (v_f1d91d.gender) v_bdc43c(v_f1d91d.gender);
        if (v_f1d91d.age) v_6e5c76(v_f1d91d.age);

        if (v_f1d91d.originalFirstName !== undefined) {
          v_d0e79e(v_f1d91d.originalFirstName);
        }
        if (v_f1d91d.originalLastName !== undefined) {
          v_c94311(v_f1d91d.originalLastName);
        }
        if (v_f1d91d.originalGender !== undefined) {
          v_edd340(v_f1d91d.originalGender);
        }
        if (v_f1d91d.originalAge !== undefined) {
          v_27ff98(v_f1d91d.originalAge);
        }
        if (v_f1d91d.originalCountryCode !== undefined) {
          v_4a9b82(v_f1d91d.originalCountryCode);
        }
        if (v_f1d91d.originalRegionCode !== undefined) {
          v_8656e3(v_f1d91d.originalRegionCode);
        }

        if (v_a1e5e9) {

          v_655be9({ rDesc: '', rCode: null });
          v_a0f6fa(null);
          v_b8bf44(null);
        } else {

          if (v_f1d91d.tempCountry) {
            v_85a493(v_f1d91d.tempCountry);
          }
          if (v_f1d91d.tempRegion) {
            v_655be9(v_f1d91d.tempRegion);
          }
          if (v_f1d91d.regionCode !== undefined) {
            v_b8bf44(v_f1d91d.regionCode);
          }
          if (v_f1d91d.countryCode !== undefined) {
            v_9b1714(v_f1d91d.countryCode);
          }
        }

        return true; 
      }
      console.log('[정보수정] ⚠️ 저장된 입력값 없음');
      return false; 
    } catch (v_5e9bfe) {
      console.error('[정보수정] 입력값 복원 실패:', v_5e9bfe);
      return false;
    }
  };

  const v_306e20 = async () => {
    try {
      await v_e84827.removeItem(v_c7a4de);
      await v_e84827.removeItem('PREV_COUNTRY_ISO2');
    } catch (v_5e9bfe) {
      console.error('[정보수정] 입력값 삭제 실패:', v_5e9bfe);
    }
  };

  v_c4deb2(() => {

    if (v_cd31a8 || !v_00d52a.current) {
      return;
    }

    const v_c28392 =
      v_a32a50 !== v_9d09f1 ||
      v_328bb4 !== v_b6daf3 ||
      v_c3eac4 !== v_318eac ||
      v_2694bd !== v_30922c;

    if (v_c28392 || v_add96c.cDesc || v_167c8b.rDesc) {
      v_2c39d5();
    }
  }, [v_a32a50, v_328bb4, v_05b02f, v_d74a81, v_c3eac4, v_2694bd, v_add96c, v_167c8b, v_222917, v_a4d981, v_cd31a8]);

  const v_ea3fa6 = async (v_587901 = true) => {
    const v_96aafe = new Error().stack;
    const v_dbc741 = v_96aafe?.split('\n')[2]?.trim() || 'unknown';

    if (!v_587901 && v_00d52a.current) {
      console.warn('[정보수정] ⚠️ 경고: 나라 선택 후 loadUserInfo가 호출되었습니다!');
    }

    try {
      if (v_587901) {
        v_deef62(true);
      }
      const v_f24fd5 = await v_e84827.getItem('userData');
      if (v_f24fd5) {
        const v_ef7306 = JSON.parse(v_f24fd5);
        const v_660822 = v_ef7306.member;

        if (v_660822) {
          v_9d6aeb(v_660822);
          const v_3393e3 = await v_a7ab3c(v_660822, v_9b57fc);
          const v_625c74 = v_3393e3.data[0];

          if (v_625c74) {
            const v_898d5f = v_625c74.firstname || '';
            const v_8e4db1 = v_625c74.lastname || '';
            const v_df7343 = v_d6877d(v_625c74.gender);
            const v_9c69cf = v_596588(v_625c74.ages);

            const v_c5dc47 = v_df691e ? v_df7343 : (v_df7343 === 'select' ? 'male' : v_df7343);
            const v_423966 = v_df691e ? v_9c69cf : (v_9c69cf === 'select' ? '10' : v_9c69cf);

            v_4944f5(v_898d5f);
            v_b7613d(v_8e4db1);

            const v_419da8 = `${v_8e4db1 || ''} ${v_898d5f || ''}`.trim();
            v_ef747e(v_419da8);
            v_fedf34(v_625c74.email || '');
            v_9f928c(v_625c74.datepinchanged || '');

            v_d0e79e(v_898d5f);
            v_c94311(v_8e4db1);
            v_edd340(v_c5dc47);
            v_27ff98(v_423966);

            if (v_625c74.mobile) {
              v_fcce73(v_625c74.mobile.replace(/\s/g, ''));
            }

            v_bdc43c(v_c5dc47);
            v_6e5c76(v_423966);

            let v_af0247 = '';
            let v_551ac0 = null;
            let v_565f82 = '';
            let v_8622c9 = null;

            console.log('[정보수정] 사용자 국가/지역 정보 (원본):', { country: v_625c74.country, region: v_625c74.region, countryType: typeof v_625c74.country, regionType: typeof v_625c74.region });

            const v_851a40 = typeof v_625c74.country === 'string' ? parseInt(v_625c74.country, 10) : v_625c74.country;
            const v_23b15e = typeof v_625c74.region === 'string' ? parseInt(v_625c74.region, 10) : v_625c74.region;

            console.log('[정보수정] 변환된 국가/지역 정보:', { country: v_851a40, region: v_23b15e, countryType: typeof v_851a40, regionType: typeof v_23b15e });

            if (v_851a40 && !isNaN(v_851a40)) {
              v_9b1714(v_851a40);
              v_4a9b82(v_851a40);

              try {
                const v_e7edd4 = await v_60f557(v_9b57fc);
                const v_3a56f1 = v_e7edd4.data || [];

                const v_058836 = await v_151d5f(
                  () => Promise.resolve(v_e7edd4),
                  v_1bd8ad
                );
                v_7a68da(v_058836);

                const v_a54b0c = v_3a56f1.find((v_3f4e2e) => {
                  const v_d50b6d = typeof v_3f4e2e.cCode === 'string' ? parseInt(v_3f4e2e.cCode, 10) : v_3f4e2e.cCode;
                  const v_2ce1e2 = typeof v_3f4e2e.callnumber === 'string' ? parseInt(v_3f4e2e.callnumber, 10) : v_3f4e2e.callnumber;
                  return v_d50b6d === v_851a40 || v_2ce1e2 === v_851a40;
                });

                const v_67cb9c = v_a54b0c?.country || v_a54b0c?.cName || '';
                const v_a4d981 = v_a54b0c?.callnumber || v_a54b0c?.cCode || v_851a40;

                v_af0247 = v_67cb9c;
                v_551ac0 = v_a4d981;

                v_85a493({ cDesc: v_67cb9c, cCode: v_a4d981 });
                console.log('[정보수정] tempCountry 설정됨:', { cDesc: v_67cb9c, cCode: v_a4d981 });

                const v_639818 = v_625c74.mobilecode ? String(v_625c74.mobilecode).replace('+', '') : '';
                const v_66dc00 = v_639818 ? `+${v_639818}` : `+${v_a4d981}`;
                console.log('[정보수정] dialCode 매칭 시도:', { mobilecode: v_639818, countryCode: v_a4d981, dialCodeStr: v_66dc00 });
                const v_21ec18 = v_202d44.find((v_fb6f45) => v_fb6f45.dialCode === v_66dc00);
                let matchingByNumber: v_da1883 | undefined;
                if (v_21ec18) {
                  v_f693e7(v_21ec18);
                  console.log('[정보수정] selectedCountryDialCode 설정됨:', v_21ec18);
                } else {

                  const v_fd2c6b = parseInt(v_639818 || v_a4d981.toString().replace('+', ''), 10);
                  v_93a7da = v_202d44.find((v_fb6f45) => {
                    const v_32ca78 = parseInt(v_fb6f45.dialCode.replace('+', ''), 10);
                    return v_32ca78 === v_fd2c6b;
                  });
                  if (v_93a7da) {
                    v_f693e7(v_93a7da);
                    console.log('[정보수정] selectedCountryDialCode 설정됨 (숫자 비교):', v_93a7da);
                  }
                }

                if (v_23b15e !== undefined && v_23b15e !== null && !isNaN(v_23b15e)) {
                  const v_5cf162 = typeof v_23b15e === 'string' ? parseInt(v_23b15e, 10) : v_23b15e;
                  v_b8bf44(v_5cf162);
                  v_8656e3(v_5cf162);

                  console.log('[정보수정] 지역 정보 설정:', { regionNum: v_5cf162, regionType: typeof v_5cf162 });

                  if (v_5cf162 === 0) {
                    const v_dbcc10 = v_8d41d7('screens.myInfoEdit.allRegions');
                    v_655be9({ rDesc: v_dbcc10, rCode: 0 });
                    v_a0f6fa(v_dbcc10);

                    v_797964(false);
                    console.log('[정보수정] 전체지역 설정됨 (region: 0)');
                  } else {

                    const v_41c051 = v_21ec18 || v_93a7da;
                    if (v_41c051) {
                      try {
                        v_1c41ce(true);
                        const result: v_107459 = await v_5c7129(
                          (v_b9bbbd) => v_11e39e(v_b9bbbd, v_9b57fc),
                          v_a4d981,
                          v_41c051.iso2 || '',
                          v_369014(v_41c051.iso2 || '')
                        );
                        v_24b641(v_43c42e.regions);
                        v_dad6ca(v_43c42e.hasRegions);
                        v_59ad99(v_43c42e.regions.map(v_cb35cb => ({
                          description: v_cb35cb.name,
                          subcode: parseInt(v_cb35cb.dialCode, 10) || 0,
                          rCode: parseInt(v_cb35cb.dialCode, 10) || 0,
                          rName: v_cb35cb.name
                        })));

                        const v_416db8 = v_43c42e.regions.find(
                          (v_cb35cb) => parseInt(v_cb35cb.dialCode, 10) === v_5cf162
                        );

                        const v_638c4d = v_416db8?.name || '';

                        const v_6f4ea0 = v_2d5c3d(v_638c4d, v_5cf162, v_a4d981);

                        v_565f82 = v_6f4ea0;
                        v_8622c9 = v_5cf162;

                        if (v_638c4d) {
                          v_655be9({ rDesc: v_6f4ea0, rCode: v_5cf162 });
                          v_a0f6fa(v_6f4ea0);
                          if (v_416db8) {
                            v_2f2d51(v_416db8);
                          }

                          v_797964(false);
                          console.log('[정보수정] 초기 로드 - 지역 이름 찾음:', { rDesc: v_6f4ea0, rCode: v_5cf162, original: v_638c4d });
                        } else {
                          v_655be9({ rDesc: 'Please Select', rCode: v_5cf162 });
                          v_a0f6fa(null);
                          console.log('[정보수정] 초기 로드 - 지역 이름 없음:', { rCode: v_5cf162 });
                          v_565f82 = '알 수 없음';
                          v_8622c9 = v_5cf162;
                        }
                        v_1c41ce(false);
                      } catch (v_5e9bfe) {
                        console.error('[정보수정] 초기 로드 - 지역 목록 로드 실패:', v_5e9bfe);
                        v_655be9({ rDesc: 'Please Select', rCode: v_5cf162 });
                        v_a0f6fa(null);
                        v_1c41ce(false);

                        try {
                          const v_878b8c = await v_11e39e(v_a4d981, v_9b57fc);
                          const v_13de92 = v_878b8c.data || [];
                          v_59ad99(v_13de92);
                          const v_80d56a = v_369014(v_41c051.iso2 || '');
                          v_24b641(v_80d56a);
                          v_dad6ca(v_80d56a.length > 0 && v_80d56a[0].iso2 !== 'global');
                        } catch (v_741f30) {
                          console.error('[정보수정] 폴백 지역 목록 로드 실패:', v_741f30);
                        }
                      }
                    } else {

                      try {
                        v_1c41ce(true);
                        const v_878b8c = await v_11e39e(v_a4d981, v_9b57fc);
                        const v_13de92 = v_878b8c.data || [];
                        v_59ad99(v_13de92);

                        const v_8098b2 = v_13de92.find((v_cb35cb) => {
                          const v_781183 = typeof v_cb35cb.subcode === 'string' ? parseInt(v_cb35cb.subcode, 10) : v_cb35cb.subcode;
                          const v_34b52f = typeof v_cb35cb.rCode === 'string' ? parseInt(v_cb35cb.rCode, 10) : v_cb35cb.rCode;
                          return v_781183 === v_5cf162 || v_34b52f === v_5cf162;
                        });

                        const v_638c4d = v_8098b2?.description || v_8098b2?.rName || '';

                        const v_6f4ea0 = v_2d5c3d(v_638c4d, v_5cf162, v_a4d981);

                        v_565f82 = v_6f4ea0;
                        v_8622c9 = v_5cf162;

                        if (v_638c4d) {
                          v_655be9({ rDesc: v_6f4ea0, rCode: v_5cf162 });
                          v_a0f6fa(v_6f4ea0);

                          v_797964(false);
                          console.log('[정보수정] 초기 로드 - 지역 이름 찾음:', { rDesc: v_6f4ea0, rCode: v_5cf162, original: v_638c4d });
                        } else {
                          v_655be9({ rDesc: 'Please Select', rCode: v_5cf162 });
                          v_a0f6fa(null);
                          console.log('[정보수정] 초기 로드 - 지역 이름 없음:', { rCode: v_5cf162 });
                          v_565f82 = '알 수 없음';
                          v_8622c9 = v_5cf162;
                        }
                        v_1c41ce(false);
                      } catch (v_5e9bfe) {
                        console.error('[정보수정] 초기 로드 - 지역 목록 로드 실패:', v_5e9bfe);
                        v_655be9({ rDesc: 'Please Select', rCode: v_5cf162 });
                        v_a0f6fa(null);
                        v_1c41ce(false);
                      }
                    }
                  }
                } else {

                  v_655be9({ rDesc: 'Please Select', rCode: 0 });
                  v_a0f6fa(null);
                  console.log('[정보수정] 지역 정보 없음 - 초기화');
                }
              } catch (v_5e9bfe) {
                console.error('[정보수정] 국가/지역 정보 로드 실패:', v_5e9bfe);
              }

            } else {

              if (v_23b15e !== undefined && v_23b15e !== null && !isNaN(v_23b15e)) {
                const v_5cf162 = typeof v_23b15e === 'string' ? parseInt(v_23b15e, 10) : v_23b15e;
                v_b8bf44(v_5cf162);
                v_8656e3(v_5cf162);

                if (v_5cf162 === 0) {
                  const v_dbcc10 = v_8d41d7('screens.myInfoEdit.allRegions');
                  v_655be9({ rDesc: v_dbcc10, rCode: 0 });
                  v_a0f6fa(v_dbcc10);
                  console.log('[정보수정] 전체지역 설정됨 (region: 0, country 없음)');
                } else {
                  v_655be9({ rDesc: 'Please Select', rCode: v_5cf162 });
                  v_a0f6fa(null);
                }
              } else {

                v_85a493({ cDesc: '', cCode: null });
                v_655be9({ rDesc: 'Please Select', rCode: 0 });
                v_a0f6fa(null);
                console.log('[정보수정] 국가와 지역 모두 없음 - 초기화');
              }
            }
          }
        }
      }
    } catch (v_5e9bfe) {
      console.error('[정보수정] 사용자 정보 로드 실패:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.loadFailed'));
    } finally {
      if (v_587901) {
        v_deef62(false);
      }
    }
  };

  v_c4deb2(() => {
    const v_a0bd1c = async () => {
      try {

        const v_6d31f9 = await v_e84827.getItem('PREV_COUNTRY_ISO2');
        const v_f34a8d = v_6d31f9 !== null;

        if (v_f34a8d) {

          const v_f24fd5 = await v_e84827.getItem('userData');
          if (v_f24fd5) {
            const v_ef7306 = JSON.parse(v_f24fd5);
            const v_660822 = v_ef7306.member;
            if (v_660822) {
              v_9d6aeb(v_660822);
            }
          }

          const v_395426 = v_459d5e?.iso2;

          const v_a70697 = Boolean(v_395426 && v_6d31f9 !== v_395426);

          const v_b53d24 = await v_f26975(v_a70697);

          if (v_a70697 && v_459d5e) {

            const v_32c8b6 = v_bec697(v_459d5e.dialCode);
            if (v_32c8b6 !== null) {
              v_85a493({
                cDesc: v_459d5e.name,
                cCode: v_32c8b6,
              });
            }
            v_797964(true);
            v_655be9({ rDesc: '', rCode: null });
            v_a0f6fa(null);
            v_b8bf44(null);
            v_59ad99([]);
          }

          if (v_395426) {
            v_f4c074.current = v_395426;
          }

          await v_e84827.removeItem('PREV_COUNTRY_ISO2');

          v_2ca208.current = true;

          await v_ea3fa6(false);

          await v_f26975(v_a70697);

          console.log('[정보수정] ✅ 나라 선택 후 돌아옴 - 데이터 로드 및 입력값 복원 완료');

          v_deef62(false);
          return;
        }

        if (v_2ca208.current && v_00d52a.current) {
          console.log('[정보수정] ✅ 이미 초기 로드 완료 - 스킵');
          return;
        }

        v_2ca208.current = true;
        console.log('[정보수정] 🚀 화면 진입 - 사용자 정보 로드 시작 (초기 로드)');

        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          const v_660822 = v_ef7306.member;
          if (v_660822) {
            v_9d6aeb(v_660822);

            if (!v_00d52a.current) {

              await v_ea3fa6();
              v_00d52a.current = true;

              v_797964(false);

              if (v_459d5e?.iso2) {
                v_f4c074.current = v_459d5e.iso2;
              } else {

                v_f4c074.current = '';
              }
            } else {

              const v_6d31f9 = await v_e84827.getItem('PREV_COUNTRY_ISO2');
              const v_f34a8d = v_6d31f9 !== null;

              if (!v_f34a8d) {

                await v_ea3fa6(false);
              }

            }

            console.log('[정보수정] ✅ loadUserInfo 완료, hasLoadedUserInfoRef = true로 설정');

            const v_861648 = await v_e84827.getItem('loginType');
            if (v_861648 === 'apple') {
              if (v_326be8.OS === 'ios') {

                v_2d4718.runAfterInteractions(() => {
                  setTimeout(() => {
                    v_889fad(
                      v_8d41d7('screens.myInfoEdit.alerts.appleLoginInfo') || '알림',
                      v_8d41d7('screens.myInfoEdit.alerts.appleLoginMessage') || '애플 로그인 시 비밀번호, 전화번호 수정은 필수입니다.'
                    );
                  }, 300);
                });
              } else {

                await v_889fad(
                  v_8d41d7('screens.myInfoEdit.alerts.appleLoginInfo') || '알림',
                  v_8d41d7('screens.myInfoEdit.alerts.appleLoginMessage') || '애플 로그인 시 비밀번호, 전화번호 수정은 필수입니다.'
                );
              }
            }
          } else {
            console.warn('[정보수정] 초기화 - member ID가 없습니다.');
            v_deef62(false);
          }
        } else {
          console.warn('[정보수정] 초기화 - userData가 AsyncStorage에 없습니다.');
          v_deef62(false);
        }
      } catch (v_5e9bfe) {
        console.error('[정보수정] 초기화 실패:', v_5e9bfe);
        v_deef62(false);
      }
    };

    v_a0bd1c();
  }, []); 

  const v_1b8283 = async () => {

    const v_b63249 = v_05b02f.trim().split(/\s+/);
    let v_f8f949 = '';
    let v_480d4b = '';

    if (v_b63249.length === 0) {
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.firstNameRequired'));
      return;
    } else if (v_b63249.length === 1) {

      v_f8f949 = v_b63249[0];
      v_480d4b = '';
    } else {

      v_480d4b = v_b63249[0];
      v_f8f949 = v_b63249.slice(1).join(' ');
    }

    if (!v_f8f949.trim()) {
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.firstNameRequired'));
      return;
    }

    if (!v_717992) {
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.userDataNotFound'));
      return;
    }

    if (!v_df691e) {
      if (v_c3eac4 === 'select') {
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.genderRequired') || '성별을 선택해주세요.');
        return;
      }
      if (v_2694bd === 'select') {
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.ageRequired') || '연령대를 선택해주세요.');
        return;
      }
      if (v_167c8b.rCode === null || v_167c8b.rCode === undefined || v_167c8b.rCode === -1) {
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.regionRequired') || '지역을 선택해주세요.');
        return;
      }
      if (v_add96c.cCode === null || v_add96c.cCode === undefined) {
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.countryRequired') || '국가를 선택해주세요.');
        return;
      }
    }

    v_433822(true);

    try {

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[정보수정] 📋 저장 버튼 클릭 - 현재 저장된 회원 정보 (원본)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(JSON.stringify({
        memberId: v_717992,
        원본이름: v_9d09f1,
        원본성: v_b6daf3,
        원본성별: {
          UI값: v_318eac,
          API코드: v_a1244c(v_318eac),
        },
        원본나이: {
          UI값: v_30922c,
          API코드: v_e9394b(v_30922c),
        },
        원본국가: {
          국가코드: v_b6505c,
          국가명: v_add96c.cDesc || '알 수 없음',
        },
        원본지역: {
          지역코드: v_6e1588,
          지역명: v_167c8b.rDesc || '알 수 없음',
        },
      }, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[정보수정] ✏️ 현재 입력된 값');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(JSON.stringify({
        memberId: v_717992,
        입력이름: v_a32a50.trim(),
        입력성: v_328bb4.trim(),
        입력성별: {
          UI값: v_c3eac4,
          API코드: v_a1244c(v_c3eac4),
        },
        입력나이: {
          UI값: v_2694bd,
          API코드: v_e9394b(v_2694bd),
        },
        입력국가: {
          국가코드: v_add96c.cCode,
          국가명: v_add96c.cDesc || '알 수 없음',
        },
        입력지역: {
          지역코드: v_167c8b.rCode,
          지역명: v_167c8b.rDesc || '알 수 없음',
        },
      }, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const v_e01f71 = [];
      const v_57285d = [];

      const v_6dd5fa = v_f8f949.trim() !== v_9d09f1.trim();
      const v_ac3974 = v_480d4b.trim() !== v_b6daf3.trim();

      if (v_6dd5fa || v_ac3974) {

        if (v_6dd5fa) {
          const v_576f5a = { member: v_717992, firstname: v_f8f949.trim() };
          v_57285d.push({ name: '이름', request: v_576f5a });
          v_e01f71.push(v_152d53(v_717992, v_f8f949.trim(), v_9b57fc).then(v_3393e3 => {
            console.log('[정보수정] 📥 이름 수정 API 응답:', v_3393e3);
            return v_3393e3;
          }));
        }

        if (v_ac3974) {
          const v_576f5a = { member: v_717992, lastname: v_480d4b.trim() };
          v_57285d.push({ name: '성', request: v_576f5a });
          v_e01f71.push(v_7f8c9e(v_717992, v_480d4b.trim(), v_9b57fc).then(v_3393e3 => {
            console.log('[정보수정] 📥 성 수정 API 응답:', v_3393e3);
            return v_3393e3;
          }));
        }
      } else {
        console.log('[정보수정] ❌ 이름 변경 없음:', {
          원본FirstName: v_9d09f1,
          현재FirstName: v_f8f949.trim(),
          원본LastName: v_b6daf3,
          현재LastName: v_480d4b.trim()
        });
      }

      const v_d199d8 = v_a1244c(v_c3eac4);
      const v_9f4b02 = v_a1244c(v_318eac);
      if (v_d199d8 !== undefined && v_d199d8 !== null && v_d199d8 !== v_9f4b02) {
        const v_576f5a = { member: v_717992, gender: v_d199d8 };
        v_57285d.push({ name: '성별', request: v_576f5a });
        v_e01f71.push(v_71d37e(v_717992, v_d199d8, v_9b57fc).then(v_3393e3 => {
          console.log('[정보수정] 📥 성별 수정 API 응답:', v_3393e3);
          return v_3393e3;
        }));
      } else {
        console.log('[정보수정] ❌ 성별 변경 없음:', {
          원본: v_9f4b02,
          현재: v_d199d8
        });
      }

      const v_2d2cbc = v_e9394b(v_2694bd);
      const v_08fe20 = v_e9394b(v_30922c);
      if (v_2d2cbc !== undefined && v_2d2cbc !== null && v_2d2cbc !== v_08fe20) {
        const v_576f5a = { member: v_717992, ages: v_2d2cbc };
        v_57285d.push({ name: '나이', request: v_576f5a });
        v_e01f71.push(v_07f367(v_717992, v_2d2cbc, v_9b57fc).then(v_3393e3 => {
          console.log('[정보수정] 📥 나이 수정 API 응답:', v_3393e3);
          return v_3393e3;
        }));
      } else {
        console.log('[정보수정] ❌ 나이 변경 없음:', {
          원본: v_08fe20,
          현재: v_2d2cbc
        });
      }

      console.log('[정보수정] 🔍 국가/지역 저장 조건 확인:', {
        tempCountry: v_add96c,
        tempRegion: v_167c8b,
        originalCountryCode: v_b6505c,
        originalRegionCode: v_6e1588,
        memberId: v_717992,
        조건1: v_add96c.cCode !== null && v_add96c.cCode !== undefined,
        조건2: v_167c8b.rCode !== null && v_167c8b.rCode !== undefined,
        조건3: v_167c8b.rCode !== -1,
      });

      if (v_add96c.cCode !== null && v_add96c.cCode !== undefined &&
        v_167c8b.rCode !== -1) {
        const v_ca520f = v_add96c.cCode;
        const v_c61e4f = v_167c8b.rCode === null || v_167c8b.rCode === undefined ? 0 : v_167c8b.rCode;

        if (!v_717992 || v_717992 === null || v_717992 === undefined) {
          console.error('[정보수정] ❌ memberId가 유효하지 않습니다:', v_717992);
          throw new Error('회원 ID가 유효하지 않습니다.');
        }

        const v_4f5607 = Number(v_ca520f);
        const v_e1db8a = Number(v_c61e4f);

        if (isNaN(v_4f5607)) {
          console.error('[정보수정] ❌ 국가 코드가 유효하지 않습니다:', v_ca520f, '변환 후:', v_4f5607);
          throw new Error('국가 코드가 유효하지 않습니다.');
        }

        if (isNaN(v_e1db8a)) {
          console.error('[정보수정] ❌ 지역 코드가 유효하지 않습니다:', v_c61e4f, '변환 후:', v_e1db8a);
          throw new Error('지역 코드가 유효하지 않습니다.');
        }

        const v_ca7297 = v_b6505c ?? null;
        const v_bbbc5d = v_6e1588 ?? null;
        const v_e5393e = v_4f5607 !== v_ca7297;
        const v_c0f7d6 = v_e1db8a !== v_bbbc5d;

        if (v_e5393e || v_c0f7d6) {

          const v_90772d = Number(v_717992);
          const v_f6907d = v_4f5607;
          const v_5cf162 = v_e1db8a;

          const v_3f1fb1 = v_459d5e?.dialCode
            ? parseInt(v_459d5e.dialCode.replace('+', ''), 10)
            : null;

          const v_f6504f = v_3f1fb1;

          const v_576f5a = {
            member: v_90772d,
            country: v_f6907d,
            region: v_5cf162,
          };

          if (v_3f1fb1 && !isNaN(v_3f1fb1)) {
            v_576f5a.mobilecode = v_3f1fb1;

            v_576f5a.countrycode = v_3f1fb1;
          }

          const v_b36f96 = {};
          if (v_f6504f !== null && v_f6504f !== undefined && !isNaN(v_f6504f)) {
            v_b36f96.countrycode = v_f6504f;
          }
          if (v_3f1fb1 !== null && v_3f1fb1 !== undefined && !isNaN(v_3f1fb1)) {
            v_b36f96.mobilecode = v_3f1fb1;
          }

          v_e01f71.push(v_4296b8(
            v_90772d,
            v_f6907d,
            v_5cf162,
            v_9b57fc,
            Object.keys(v_b36f96).length > 0 ? v_b36f96 : undefined 
          ).then(v_3393e3 => {
            console.log('[정보수정] 📥 국가/지역 수정 API 응답:', v_3393e3);
            return v_3393e3;
          }).catch(v_5e9bfe => {
            console.error('[정보수정] ❌ 국가/지역 수정 API 에러:', v_5e9bfe);
            console.error('[정보수정] 에러 발생 시점의 요청 데이터:', {
              member: v_90772d,
              country: v_f6907d,
              region: v_5cf162,
            });
            throw v_5e9bfe;
          }));
        } else {
          console.log('[정보수정] ❌ 국가/지역 변경 없음:', {
            original: { country: v_b6505c, region: v_6e1588 },
            current: { country: v_ca520f, region: v_c61e4f },
          });
        }
      } else {
        console.log('[정보수정] ❌ 국가/지역 유효하지 않음:', {
          tempCountry: v_add96c,
          tempRegion: v_167c8b,
          reason: v_add96c.cCode === null || v_add96c.cCode === undefined ? 'countryCode가 null/undefined' :
            v_167c8b.rCode === null || v_167c8b.rCode === undefined ? 'regionCode가 null/undefined' :
              v_167c8b.rCode === -1 ? 'regionCode가 -1 (유효하지 않음)' : '알 수 없음',
        });
      }

      if (v_e01f71.length > 0) {

        const v_6961e0 = {
          이름: v_9d09f1,
          성: v_b6daf3,
          성별: v_318eac,
          성별코드: v_a1244c(v_318eac),
          나이: v_30922c,
          나이코드: v_e9394b(v_30922c),
        };

        await v_306e20();

        await v_ea3fa6(false);

        setTimeout(() => {
          const v_03a7be = {
            이름: v_a32a50,
            성: v_328bb4,
            성별: v_c3eac4,
            성별코드: v_a1244c(v_c3eac4),
            나이: v_2694bd,
            나이코드: v_e9394b(v_2694bd),
          };

          const v_58ab64 = {
            이름변경됨: v_a32a50 !== v_6961e0.이름,
            성변경됨: v_328bb4 !== v_6961e0.성,
            성별변경됨: v_c3eac4 !== v_6961e0.성별,
            나이변경됨: v_2694bd !== v_6961e0.나이,
          };

          const v_0e3ee0 = v_58ab64.이름변경됨 || v_58ab64.성변경됨 || v_58ab64.성별변경됨 || v_58ab64.나이변경됨;

          if (v_0e3ee0) {
            console.log('[정보수정] ✅ 수정이 성공적으로 반영되었습니다!');
            const v_e371c8 = Object.entries(v_58ab64)
              .filter(([v_37eab7, v_40eb63]) => v_40eb63)
              .map(([v_b24339, v_37eab7]) => v_b24339);
            console.log('변경된 항목:', v_e371c8.join(', '));
          } else {
            console.warn('[정보수정] ⚠️ 수정이 반영되지 않았습니다.');
            console.warn('가능한 원인:');
            console.warn('1. API 응답이 실패했을 수 있습니다 (위 API 응답 로그 확인)');
            console.warn('2. 서버에서 데이터를 업데이트하지 못했을 수 있습니다');
            console.warn('3. 새로고침이 너무 빨리 발생했을 수 있습니다 (500ms 후 다시 확인)');
          }

          v_889fad(
            v_8d41d7('screens.myInfoEdit.alerts.saveSuccess'),
            v_8d41d7('screens.myInfoEdit.alerts.saveSuccessMessage'),
            [
              {
                text: v_8d41d7('screens.myInfoEdit.alerts.confirm') || '확인',
                onPress: () => {

                  if (v_7e32fb) {
                    v_c7ac57();
                  } else {
                    v_487a25(v_ce4741.myInfo);
                  }
                },
              },
            ],
          );
        }, 1000);
      } else {

        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.noChanges'), [
          {
            text: v_8d41d7('screens.myInfoEdit.alerts.confirm'),
            onPress: () => {
              v_487a25(v_ce4741.myInfo);
            },
          },
        ]);
      }
    } catch (v_5e9bfe) {
      console.error('[정보수정] 정보 수정 실패:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.saveFailed'), v_8d41d7('screens.myInfoEdit.alerts.saveFailedMessage'));
    } finally {
      v_433822(false);
    }
  };

  const v_c09605 = async () => {
    v_9b57fc(v_ce4741.myInfoChangePassword);
  };

  const v_261e69 = async () => {
    try {

      const v_395426 = v_459d5e?.iso2 || '';
      await v_e84827.setItem('PREV_COUNTRY_ISO2', v_395426);
      console.log('[정보수정] 나라 선택 전 현재 나라 저장:', v_395426);

      await v_2c39d5();

      if (v_6c7bef.length === 0 || (v_6c7bef.length === v_1bd8ad.length && v_6c7bef[0]?.iso2 === v_1bd8ad[0]?.iso2)) {
        v_677cd9(true);
        try {
          const v_058836 = await v_151d5f(
            () => v_60f557(v_9b57fc),
            v_1bd8ad
          );
          v_7a68da(v_058836);
        } catch (v_5e9bfe) {
          console.error('[정보수정] 국가 목록 로드 실패:', v_5e9bfe);
          v_7a68da(v_1bd8ad);
        } finally {
          v_677cd9(false);
        }
      }

      v_a259be(true);
    } catch (v_5e9bfe) {
      console.error('[정보수정] 국가 선택 모달 열기 실패:', v_5e9bfe);
    }
  };

  const v_daa71c = v_df9f57(() => {
    if (!v_bd30a1.trim()) {
      return v_6c7bef;
    }
    const v_470e34 = v_bd30a1.trim().toLowerCase();
    return v_6c7bef.filter((v_8c0b26) => {

      const v_cd2b74 = v_8c0b26.name.toLowerCase();

      const v_73b9dc = v_8c0b26.iso2.toLowerCase();

      const v_bed18d = v_8c0b26.dialCode.toLowerCase();

      let v_a2493c = '';
      if (v_8c0b26.iso2 && v_8c0b26.iso2 !== 'select' && v_8c0b26.iso2 !== 'global' && v_8c0b26.iso2.length === 2) {
        const v_4d2349 = `countries.${v_8c0b26.iso2.toUpperCase()}`;
        const v_6dce25 = v_8d41d7(v_4d2349);
        if (v_6dce25 && v_6dce25 !== v_4d2349) {
          v_a2493c = v_6dce25.toLowerCase();
        }
      }

      const v_ae5dba = v_73b9dc === v_470e34;

      const v_8cb36b = v_cd2b74.includes(v_470e34);

      const v_ee6e33 = v_a2493c && v_a2493c.includes(v_470e34);

      let v_f2229a = false;
      if (v_470e34.match(/^\d+$/)) {

        const v_c78cbd = v_bed18d.replace(/[^0-9]/g, '');
        v_f2229a = v_c78cbd.includes(v_470e34);
      } else if (v_470e34.startsWith('+')) {

        v_f2229a = v_bed18d.includes(v_470e34);
      }

      return (
        v_ae5dba ||
        v_8cb36b ||
        v_ee6e33 ||
        v_f2229a
      );
    });
  }, [v_bd30a1, v_6c7bef, v_8d41d7]);

  const v_de5bf5 = async (country: v_da1883) => {
    console.log('[정보수정] 국가 선택:', v_b9bbbd);
    v_f693e7(v_b9bbbd);
    v_e03dd9('');
    v_a259be(false);

    await v_e84827.removeItem('PREV_COUNTRY_ISO2');
  };

  const v_f4c074 = v_a3453e.useRef<string | undefined>(undefined);

  v_c4deb2(() => {
    const v_395426 = v_459d5e?.iso2;
    const v_41bf88 = v_f4c074.current;

    if (v_cd31a8 || !v_00d52a.current) {

      if (v_395426) {
        v_f4c074.current = v_395426;
      }
      return;
    }

    if (v_41bf88 === undefined) {
      if (v_395426) {
        v_f4c074.current = v_395426;
      }
      return;
    }

    const v_a70697 = v_395426 && v_41bf88 && v_395426 !== v_41bf88;

    if (v_a70697 && v_459d5e) {
      console.log('[정보수정] ✅ useEffect 나라 변경 감지 - 지역 화면 표시 초기화:', {
        이전나라: v_41bf88,
        현재나라: v_395426,
        현재화면표시: v_167c8b.rDesc,
      });

      const v_32c8b6 = v_bec697(v_459d5e.dialCode);
      if (v_32c8b6 !== null) {
        v_85a493({
          cDesc: v_459d5e.name,
          cCode: v_32c8b6,
        });
      }

      v_797964(true);

      console.log('[정보수정] ✅ 나라 변경으로 지역 필드 초기화 - placeholder 표시');
      v_655be9({ rDesc: '', rCode: null }); 
      v_a0f6fa(null);
      v_b8bf44(null);
      v_59ad99([]);

      setTimeout(async () => {
        await v_2c39d5();
      }, 0);

    }

    if (v_395426) {
      v_f4c074.current = v_395426;
    }
  }, [v_459d5e?.iso2, v_459d5e?.name, v_459d5e?.dialCode, v_cd31a8]);

  const v_801fea = async () => {

    const v_861648 = await v_e84827.getItem('loginType');
    const v_1fa4eb = v_861648 === 'apple';

    if (v_1fa4eb) {

      console.log('[정보수정] 애플 로그인 사용자 - 애플 로그인으로 인증 시작');

      try {
        const v_25c481 = await v_7af6c9(v_9b57fc);

        if (!v_25c481.success || !v_25c481.data) {
          console.error('[정보수정] 애플 로그인 인증 실패:', v_25c481.message);
          await v_889fad(
            v_8d41d7('screens.myInfoEdit.alerts.error'),
            v_8d41d7('screens.myInfoEdit.alerts.verificationError') || '인증에 실패했습니다. 다시 시도해주세요.',
          );
          return;
        }

        console.log('[정보수정] 애플 로그인 인증 성공 - 전화번호 수정 화면으로 이동');
        v_9b57fc(v_ce4741.myInfoPhoneEdit);
      } catch (v_5e9bfe) {
        console.error('[정보수정] 애플 로그인 인증 오류:', v_5e9bfe);
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.verificationError'));
      }
    } else {

      if (!v_e0c7e8) {
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.emailNotFound'));
        return;
      }

      try {
        console.log('[정보수정] 이메일 인증 코드 발송 요청:', v_e0c7e8);
        const v_593e63 = await v_8025d1(v_e0c7e8, v_9b57fc);
        if (v_593e63) {
          v_b572c3(v_e0c7e8);
          v_8f89f3(v_ce4741.myInfoPhoneEdit);
          v_9b57fc(v_ce4741.verificationCode);
        } else {
          await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.verificationError') || '인증 코드 발송에 실패했습니다.');
        }
      } catch (v_5e9bfe) {
        console.error('[정보수정] 이메일 인증 오류:', v_5e9bfe);
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.verificationError') || '인증 오류가 발생했습니다.');
      }
    }
  };

  const v_bec697 = (v_146092): number | null => {

    try {

      const v_277926 = parseInt(v_146092.replace('+', ''), 10);
      return v_277926 || null;
    } catch (v_5e9bfe) {
      console.error('[정보수정] 국가 코드 추출 실패:', v_5e9bfe);
      return null;
    }
  };

  const regionSelectOption: v_da1883 = v_df9f57(() => ({
    iso2: 'select',
    name: v_8d41d7('screens.myInfoEdit.regionSelect'),
    dialCode: '0',
    flagEmoji: '📍',
    countryCode: 0,
  }), [v_8d41d7]);

  const v_4e187d = v_df9f57(() => {
    if (!v_7962f1.trim()) {
      return v_963133;
    }
    const v_470e34 = v_7962f1.trim().toLowerCase();
    return v_963133.filter((v_8c0b26) => {

      const v_cd2b74 = v_8c0b26.name.toLowerCase();

      const v_73b9dc = v_8c0b26.iso2.toLowerCase();

      let v_a2493c = '';
      if (v_8c0b26.countryCode && v_8c0b26.dialCode) {
        const v_222917 = parseInt(v_8c0b26.dialCode, 10);
        if (!isNaN(v_222917) && v_222917 > 0) {
          const v_9ad700 = [82, 81, 86, 1, 62];
          if (v_9ad700.includes(v_8c0b26.countryCode)) {
            const v_b5249e = `regions.${v_8c0b26.countryCode}_${v_222917}`;
            const v_6dce25 = v_8d41d7(v_b5249e);
            if (v_6dce25 && v_6dce25 !== v_b5249e) {
              v_a2493c = v_6dce25.toLowerCase();
            }
          }
        }
      }

      return (
        v_cd2b74.includes(v_470e34) ||
        v_a2493c.includes(v_470e34) ||
        v_73b9dc.includes(v_470e34)
      );
    }      );
  }, [v_7962f1, v_963133, v_8d41d7]);

  const v_9ea51e = v_df9f57(
    () => (v_df691e ? [v_f58a22, ...v_4e187d] : v_4e187d),
    [v_df691e, v_f58a22, v_4e187d]
  );

  const v_477add = (region: v_da1883) => {
    console.log('[정보수정] 지역 선택:', {
      region: v_a6c30b,
      iso2: v_a6c30b.iso2,
      name: v_a6c30b.name,
      dialCode: v_a6c30b.dialCode,
      countryCode: v_a6c30b.countryCode,
    });

    if (v_a6c30b.iso2 === 'select' || v_a6c30b.dialCode === '0') {
      console.log('[정보수정] "선택" 옵션 선택 - null로 설정');
      v_2f2d51(null);
      v_655be9({
        rDesc: '',
        rCode: null,
      });
      v_a0f6fa(null);
      v_b8bf44(null);
    } else {
      console.log('[정보수정] 지역 선택:', v_a6c30b.name);
      v_2f2d51(v_a6c30b);
      const v_222917 = parseInt(v_a6c30b.dialCode, 10) || 0;

      const v_a4d981 = (v_459d5e?.countryCode
        ?? (v_459d5e?.dialCode ? v_bec697(v_459d5e.dialCode) : null))
        || v_a6c30b.countryCode || null;
      let v_6f4ea0 = v_a6c30b.name; 

      if (v_a4d981 && v_222917 > 0) {
        const v_9ad700 = [82, 81, 86, 1, 62];
        let v_b5249e;

        if (v_9ad700.includes(v_a4d981)) {

          v_b5249e = `regions.${v_a4d981}_${v_222917}`;
        } else {

          const v_1581b6 = v_a6c30b.name
            .replace(/[^a-zA-Z0-9\s]/g, '') 
            .replace(/\s+/g, '_') 
            .toLowerCase();
          v_b5249e = `regions.${v_a4d981}_${v_1581b6}`;
        }

        try {
          const v_6dce25 = v_8d41d7(v_b5249e);
          if (v_6dce25 && v_6dce25 !== v_b5249e) {
            v_6f4ea0 = v_6dce25;
            if (__DEV__) {
              console.log('[정보수정] 지역 선택 - 번역 성공:', {
                key: v_b5249e,
                translated: v_6f4ea0,
                original: v_a6c30b.name,
                countryCode: v_a4d981,
                regionCode: v_222917,
              });
            }
          } else {
            if (__DEV__) {
              console.warn('[정보수정] 지역 선택 - 번역 키 없음:', {
                key: v_b5249e,
                original: v_a6c30b.name,
                countryCode: v_a4d981,
                regionCode: v_222917,
              });
            }
          }
        } catch (v_5e9bfe) {
          if (__DEV__) {
            console.warn('[정보수정] 지역 선택 - 번역 오류:', v_5e9bfe, {
              key: v_b5249e,
              original: v_a6c30b.name,
              countryCode: v_a4d981,
              regionCode: v_222917,
            });
          }
        }
      }

      v_655be9({
        rDesc: v_6f4ea0,
        rCode: v_222917,
      });
      v_a0f6fa(v_6f4ea0);
    }
    v_797964(false);
    v_c73419(false);
    v_6a0bf8('');
  };

  v_a3453e.useEffect(() => {
    const v_91c5e2 = async () => {
      const v_a4d981 = v_459d5e?.countryCode
        ?? (v_459d5e?.dialCode ? v_bec697(v_459d5e.dialCode) : null);
      if (!v_a4d981 || !v_459d5e?.iso2) return;

      v_1c41ce(true);
      try {
        const result: v_107459 = await v_5c7129(
          (v_b9bbbd) => v_11e39e(v_b9bbbd, v_9b57fc),
          v_a4d981,
          v_459d5e.iso2,
          v_369014(v_459d5e.iso2)
        );
        v_24b641(v_43c42e.regions);
        v_dad6ca(v_43c42e.hasRegions);

        if (v_43c42e.hasRegions && v_43c42e.regions.length > 0 && v_167c8b.rCode !== null) {
          const v_416db8 = v_43c42e.regions.find(
            (v_cb35cb) => parseInt(v_cb35cb.dialCode, 10) === v_167c8b.rCode
          );
          if (v_416db8) {
            v_2f2d51(v_416db8);

            const v_6f4ea0 = v_2d5c3d(
              v_416db8.name,
              v_167c8b.rCode,
              v_a4d981
            );
            v_a0f6fa(v_6f4ea0);

            v_655be9({
              rDesc: v_6f4ea0,
              rCode: v_167c8b.rCode,
            });
          }
        } else if (!v_43c42e.hasRegions) {
          v_2f2d51(v_789afd);
          v_a0f6fa(v_789afd.name);
        }
      } catch (v_5e9bfe) {
        console.error('[정보수정] 지역 목록 로드 실패:', v_5e9bfe);
        const v_80d56a = v_369014(v_459d5e.iso2);
        v_24b641(v_80d56a);
        v_dad6ca(v_80d56a.length > 0 && v_80d56a[0].iso2 !== 'global');
      } finally {
        v_1c41ce(false);
      }
    };

    v_91c5e2();
  }, [v_459d5e, v_9b57fc]);

  const v_c0d2d4 = async () => {
    if (!v_459d5e || !v_459d5e.dialCode) {
      await v_889fad(
        v_8d41d7('screens.myInfoEdit.alerts.error'),
        v_8d41d7('screens.myInfoEdit.alerts.selectCountryFirst')
      );
      v_261e69();
      return;
    }

    if (!v_5f1e0e || v_963133.length === 0) {
      return;
    }

    v_c73419(true);
  };

  return (
    <View style={v_d81136.container}>
      <Header
        title={v_8d41d7('screens.myInfoEdit.title')}
        onBackPress={() => {
          if (v_7e32fb) {
            v_c7ac57();
          } else {
            v_487a25(v_ce4741.myInfo);
          }
        }}
        showBackButton
      />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        {v_cd31a8 ? (
          <View style={v_d81136.loadingContainer}>
            <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
          </View>
        ) : (
          <View style={v_d81136.formFieldContainer}>

            <FormField
              label={v_8d41d7('screens.myInfoEdit.firstName')}
              value={v_05b02f}
              onChangeText={(v_9b6134) => {
                v_ef747e(v_9b6134);

                const v_b63249 = v_9b6134.trim().split(/\s+/);
                if (v_b63249.length === 0) {
                  v_4944f5('');
                  v_b7613d('');
                } else if (v_b63249.length === 1) {
                  v_4944f5(v_b63249[0]);
                  v_b7613d('');
                } else {
                  v_b7613d(v_b63249[0]);
                  v_4944f5(v_b63249.slice(1).join(' '));
                }
              }}
              placeholder={v_8d41d7('screens.myInfoEdit.firstNamePlaceholder')}
              editable={!v_e495db}
              containerStyle={v_d81136.fieldContainer}
            />

            <View style={v_d81136.fieldContainer}>
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.email')}</Text>
              <View style={v_d81136.disabledInput}>
                <Text style={v_d81136.disabledText}>{v_e0c7e8 || v_8d41d7('screens.myInfoEdit.email')}</Text>
              </View>
            </View>
            <View style={v_d81136.fieldContainer}>
              <View style={[{ ...v_d81136.inlineLabelRow, ...v_d81136.label }]}>
                <Text style={v_d81136.sectionLabel}>{v_8d41d7('screens.myInfoEdit.password')}</Text>
                <TouchableOpacity onPress={v_c09605} style={v_d81136.linkTextContainer}>
                  <Text style={v_d81136.linkText}>{v_8d41d7('screens.myInfoEdit.changePassword')}</Text>
                </TouchableOpacity>
              </View>
              <View style={[{ ...v_d81136.readonlyInput }, { marginTop: 0 }]}>
                <Text style={v_d81136.readonlyText}>
                  {v_8d41d7('screens.myInfoEdit.lastPasswordChangeDateLabel', 'e', { date: v_3535cd || '-' })}
                </Text>
              </View>
            </View>
            <View style={v_d81136.fieldContainer} >
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.phone')}</Text>
              <View style={v_d81136.phoneFieldContainer}>
                {}
                <TouchableOpacity
                  style={v_d81136.phonePrefix}
                  onPress={v_261e69}
                  activeOpacity={0.7}
                  disabled={v_e495db}
                >
                  <Text style={v_d81136.flagEmoji}>{v_459d5e.flagEmoji}</Text>
                  <Text style={v_d81136.phonePrefixText}>
                    {v_459d5e.dialCode}
                  </Text>
                </TouchableOpacity>
                {}
                <TouchableOpacity
                  style={v_d81136.phoneValueContainer}
                  onPress={v_801fea}
                  activeOpacity={0.7}
                  disabled={v_e495db}
                >
                  <Text style={v_d81136.phoneValue}>{v_d74a81}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {}
            {(() => {
              const v_a4d981 = v_459d5e?.countryCode
                ?? (v_459d5e?.dialCode ? v_bec697(v_459d5e.dialCode) : null);
              const v_cc0c7d = v_459d5e?.iso2;
              const v_56ad9c = (v_a4d981 != null && v_cc0c7d)
                ? v_58c98d(v_a4d981, v_cc0c7d)
                : false;
              return v_5f1e0e || v_56ad9c;
            })() && (
              <View style={v_d81136.fieldContainer}>
                <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.region')}</Text>
                <TouchableOpacity
                  style={v_d81136.regionField}
                  onPress={v_c0d2d4}
                  activeOpacity={0.7}
                  disabled={v_e495db || v_0908db}
                >
                  <Text style={v_d81136.regionValue}>
                    {(() => {

                      if (!v_2f03bc || v_167c8b.rCode === null || v_167c8b.rCode === 0) {
                        return v_8d41d7('screens.myInfoEdit.regionSelect') || '선택';
                      }

                      if (v_167c8b.rDesc && v_167c8b.rDesc !== 'Please Select') {
                        const v_7b1417 = v_8d41d7('screens.myInfoEdit.allRegions');
                        if (v_167c8b.rDesc === v_7b1417 || v_167c8b.rCode === 0) {
                          return v_8d41d7('screens.myInfoEdit.regionSelect') || '선택';
                        }
                        return v_167c8b.rDesc;
                      }

                      if (v_2f03bc && v_2f03bc.iso2 !== 'select' && v_2f03bc.dialCode !== '0') {

                        const v_222917 = v_2f03bc.dialCode ? parseInt(v_2f03bc.dialCode, 10) : null;
                        const v_a4d981 = v_459d5e?.countryCode
                          ?? (v_459d5e?.dialCode ? v_bec697(v_459d5e.dialCode) : null);

                        if (v_222917 === 0) {
                          return v_8d41d7('screens.myInfoEdit.regionSelect') || '선택';
                        } else if (v_a4d981 && v_222917 !== null && v_222917 !== undefined && v_222917 > 0) {

                          const v_9ad700 = [82, 81, 86, 1, 62];
                          let v_b5249e;

                          if (v_9ad700.includes(v_a4d981)) {

                            v_b5249e = `regions.${v_a4d981}_${v_222917}`;
                          } else {

                            const v_1581b6 = v_2f03bc.name
                              .replace(/[^a-zA-Z0-9\s]/g, '') 
                              .replace(/\s+/g, '_') 
                              .toLowerCase();
                            v_b5249e = `regions.${v_a4d981}_${v_1581b6}`;
                          }

                          try {
                            const v_6dce25 = v_8d41d7(v_b5249e);
                            if (v_6dce25 && v_6dce25 !== v_b5249e) {
                              return v_6dce25;
                            } else {

                              return v_2f03bc.name;
                            }
                          } catch (v_5e9bfe) {

                            return v_2f03bc.name;
                          }
                        } else {

                          return v_2f03bc.name;
                        }
                      }

                      return v_8d41d7('screens.myInfoEdit.regionSelect') || '선택';
                    })()}
                  </Text>
                  <Text style={v_d81136.arrow}>›</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={v_d81136.fieldContainer}>
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.gender')}</Text>
              <View style={v_d81136.inlineOptions}>
                {v_798085.map((v_0bd920) => {
                  const v_599a41 = v_c3eac4 === v_0bd920.value;
                  if (__DEV__) {
                    console.log(`[정보수정] 성별 옵션 렌더링: ${v_0bd920.label} (${v_0bd920.value})`, {
                      현재gender: v_c3eac4,
                      옵션value: v_0bd920.value,
                      선택됨: v_599a41,
                    });
                  }
                  return (
                    <OptionButton
                      key={v_0bd920.value}
                      label={v_0bd920.label}
                      selected={v_599a41}
                      onPress={() => {
                        console.log('[정보수정] 성별 선택됨:', { 이전: v_c3eac4, 선택: v_0bd920.value });
                        v_bdc43c(v_0bd920.value);
                      }}
                      disabled={v_e495db}
                    />
                  );
                })}
              </View>
            </View>

            <View style={v_d81136.fieldContainer}>
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.age')}</Text>
              <View style={[v_d81136.inlineOptions, v_d81136.ageOptionsRow]}>
                {v_8b5eb1.map((v_0bd920) => (
                  <OptionButton
                    key={v_0bd920}
                    label={v_0bd920 === 'select' ? v_8d41d7('screens.myInfoEdit.ageSelect') : v_0bd920}
                    selected={v_2694bd === v_0bd920}
                    onPress={() => v_6e5c76(v_0bd920)}
                    flex={1}
                    disabled={v_e495db}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={v_d81136.bottomSection}>
          {v_e495db ? (
            <View style={v_d81136.loadingButtonContainer}>
              <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title={v_8d41d7('screens.myInfoEdit.save')}
              fullWidth
              onPress={v_1b8283}
              style={v_d81136.primaryButton}
              disabled={v_cd31a8}
            />
          )}
        </View>
      </SafeScrollView>

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={v_b67b40}
        onRequestClose={() => v_a259be(false)}
      >
        <View style={v_d81136.modalOverlay}>
          <TouchableOpacity
            style={v_d81136.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              v_a259be(false);
              v_e03dd9('');
            }}
          />
          <View style={v_d81136.modalContent}>
            <View style={v_d81136.modalHeader}>
              <Text style={v_d81136.modalTitle}>
                {v_8d41d7('screens.myInfoEdit.selectCountry')}
              </Text>
              <TouchableOpacity onPress={() => {
                v_a259be(false);
                v_e03dd9('');
              }}>
                <Text style={v_d81136.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={v_d81136.modalSearchBox}>
              <Ionicons name="search" size={18} color="#9ca3af" />
              <TextInput
                style={v_d81136.modalSearchInput}
                value={v_bd30a1}
                onChangeText={v_e03dd9}
                placeholder={v_8d41d7('screens.countryCodeSelect.countrySearchPlaceholder') || '국가 검색'}
                placeholderTextColor="#c4c7d1"
                autoCorrect={false}
              />
            </View>
            {v_d6cff0 ? (
              <View style={v_d81136.modalLoadingContainer}>
                <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
              </View>
            ) : (
              <FlatList
                data={v_daa71c}
                keyExtractor={(v_8c0b26, v_a56041) => `${v_8c0b26.iso2}-${v_8c0b26.dialCode}-${v_8c0b26.name}-${v_a56041}`}
                renderItem={({ item: v_b9bbbd }) => (
                  <TouchableOpacity
                    style={[
                      v_d81136.modalItem,
                      v_459d5e?.iso2 === v_b9bbbd.iso2 && v_d81136.modalItemSelected,
                    ]}
                    onPress={() => v_de5bf5(v_b9bbbd)}
                  >
                    <View style={v_d81136.modalItemContent}>
                      <Text style={v_d81136.modalItemFlag}>{v_b9bbbd.flagEmoji}</Text>
                      <View style={v_d81136.modalItemInfo}>
                        <Text style={v_d81136.modalItemText}>
                          {(() => {

                            if (v_b9bbbd.iso2 && v_b9bbbd.iso2 !== 'select' && v_b9bbbd.iso2 !== 'global' && v_b9bbbd.iso2.length === 2) {
                              const v_4d2349 = `countries.${v_b9bbbd.iso2.toUpperCase()}`;
                              const v_6dce25 = v_8d41d7(v_4d2349);
                              return v_6dce25 && v_6dce25 !== v_4d2349 ? v_6dce25 : v_b9bbbd.name;
                            }
                            return v_b9bbbd.name;
                          })()}
                        </Text>
                        <Text style={v_d81136.modalItemDialCode}>{v_b9bbbd.dialCode}</Text>
                      </View>
                    </View>
                    {v_459d5e?.iso2 === v_b9bbbd.iso2 && (
                      <Text style={v_d81136.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={v_d81136.modalScrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View style={v_d81136.emptyContainer}>
                    <Text style={v_d81136.emptyText}>
                      {v_8d41d7('screens.countryCodeSelect.noResults') || '검색 결과가 없습니다.'}
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={v_3a64df}
        onRequestClose={() => v_c73419(false)}
      >
        <View style={v_d81136.modalOverlay}>
          <TouchableOpacity
            style={v_d81136.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              v_c73419(false);
              v_6a0bf8('');
            }}
          />
          <View style={v_d81136.modalContent}>
            <View style={v_d81136.modalHeader}>
              <Text style={v_d81136.modalTitle}>
                {v_8d41d7('screens.countryCodeSelect.regionSelectTitle') || '지역 선택'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  v_c73419(false);
                  v_6a0bf8('');
                }}
              >
                <Text style={v_d81136.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={v_d81136.modalSearchBox}>
              <Ionicons name="search" size={18} color="#9ca3af" />
              <TextInput
                style={v_d81136.modalSearchInput}
                value={v_7962f1}
                onChangeText={v_6a0bf8}
                placeholder={v_8d41d7('screens.countryCodeSelect.regionSearchPlaceholder') || '지역 검색'}
                placeholderTextColor="#c4c7d1"
                autoCorrect={false}
              />
            </View>
            {v_0908db ? (
              <View style={v_d81136.modalLoadingContainer}>
                <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
              </View>
            ) : (
              <FlatList
                data={v_9ea51e}
                keyExtractor={(v_8c0b26, v_a56041) => `${v_8c0b26.iso2}-${v_8c0b26.dialCode}-${v_8c0b26.name}-${v_a56041}`}
                renderItem={({ item: v_8c0b26 }) => (
                  <CountryCodeListItem
                    country={v_8c0b26}
                    isSelected={(v_8c0b26.iso2 === 'select' && v_8c0b26.dialCode === '0' && !v_2f03bc) || (v_8c0b26.iso2 === v_2f03bc?.iso2 && v_8c0b26.dialCode === v_2f03bc?.dialCode)}
                    onPress={v_477add}
                    hideDialCode={true}
                  />
                )}
                contentContainerStyle={v_d81136.modalListContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View style={v_d81136.modalEmptyState}>
                    <Text style={v_d81136.modalEmptyText}>
                      {v_8d41d7('screens.countryCodeSelect.noResults') || '검색 결과가 없습니다.'}
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },
  formFieldContainer: {
    ...v_bae512.fieldContainer,
  },
  inlineLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: v_843035.size.medium,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
  },
  linkText: {
    fontSize: v_843035.size.small,
    color: '#707070',
    fontFamily: 'Roboto-SemiBold',
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
  },
  readonlyText: {
    fontSize: v_843035.size.ssmall,
    color: '#1a2e35',
    fontFamily: 'Roboto-Bold',
  },
  phoneFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fefefe',
    minHeight: 52, 
    overflow: 'hidden',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ededed',
    backgroundColor: '#fefefe',
  },
  flagEmoji: {
    fontSize: v_843035.size.large,
    marginRight: 6,
  },
  phonePrefixText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#343a59',
  },
  phoneValueContainer: {
    flex: 1,
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
  },
  phoneValue: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#343a59',
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    gap: 8,
    width: '100%',
  },
  ageOptionsRow: {
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  ageOptionButton: {
    marginRight: 0,
    marginBottom: 0,
  },
  ageOptionSpacing: {
    marginRight: 8,
  },
  bottomSection: {
    ...v_a61db3.bottomButtonContainer,
    marginTop: v_9b1a04.large,
  },
  primaryButton: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  loadingButtonContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContainer: {
    borderWidth: 0,
  },
  label: {
    fontSize: v_843035.size.medium,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  phoneValueText: {
    flex: 1,
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
    marginLeft: 12,
  },
  editHint: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#707070',
    marginLeft: 8,
  },
  regionFieldContainer: {
    gap: 12,
  },
  regionField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    minHeight: 52, 
  },
  regionValue: {
    flex: 1,
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
  },
  regionPlaceholder: {
    color: '#dedede',
  },
  arrow: {
    fontSize: v_843035.size.xlarge,
    color: '#747474',
    marginLeft: 8,
  },
  regionHelper: {
    fontSize: v_843035.size.small,
    lineHeight: 18,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
  },
  dialogContainer: {
    maxWidth: 400,
    maxHeight: 600,
  },
  listContainer: {
    paddingVertical: 8,
    maxHeight: 400,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  listItemSelected: {
    borderColor: v_1bfbd0.buttonPrimary,
    backgroundColor: '#f5f6fa',
  },
  listItemDisabled: {
    opacity: 0.5,
  },
  listItemText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
  },
  emptyTextSub: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    height: v_700696.get('window').height * 0.8,
    minHeight: v_700696.get('window').height * 0.6,
    maxHeight: v_700696.get('window').height * 0.8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  modalTitle: {
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#1a2e35',
    flex: 1,
  },
  modalCloseButton: {
    fontSize: v_843035.size.xlarge,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    height: 48,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: v_1bfbd0.headerText,
  },
  modalScrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalEmptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  modalEmptyText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  modalScrollViewOld: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalLoadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  modalItemSelected: {
    borderColor: v_1bfbd0.buttonPrimary,
    backgroundColor: '#f5f6fa',
  },
  modalItemText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    flex: 1,
  },
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalItemFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  modalItemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemDialCode: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.buttonPrimary,
    marginLeft: 8,
  },
  checkmark: {
    fontSize: v_843035.size.large,
    color: v_1bfbd0.buttonPrimary,
    fontFamily: 'Roboto-Bold',
    marginLeft: 8,
  },
  linkTextContainer: {
    marginBottom: 0,
  },
});

