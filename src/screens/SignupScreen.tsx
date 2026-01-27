import v_a3453e, { v_5ab095, v_df9f57 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_326be8,
  v_4623af,
  v_39a996,
  v_122070,
  v_700696,
  v_aa7413,
  v_9cabcb,
  v_79c4f2,
} from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import {
  v_fa3feb,
  v_368e80,
  v_570c34,
  v_729608,
  v_89c10a,
  v_cb41de,
  v_c2fdd1,
  v_ecee91,
} from '../components';
import { v_1bfbd0, v_9b1a04, v_843035 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_9553a4, v_6946fd, v_369014, v_789afd, v_a61db3, v_bae512, v_52495e, v_1bd8ad } from '../constants';
import { v_da1883 } from '../types';
import { v_9dd03c } from '../types';
import { v_96abff } from '../utils';
import { v_11e39e, v_60f557 } from '../services';
import { v_5c7129, v_107459, v_151d5f } from '../utils/countryUtils';

import {
  v_60e3a5,
  v_01332e,
  v_35200c,
  v_9d2541,
  v_91bb22,
  v_4dba02,
  v_a5170b,
  v_ea3493,
} from '../services';
import { v_7af6c9 } from '../services/appleAuth';
import { v_3333d3 } from 'imsks';

const v_0c96f7 = ['0', '10', '20', '30', '40', '50+'] as const;

type GenderValue = 'male' | 'female' | '0';
type AgeValue = (typeof v_0c96f7)[number];

export const v_f40fc5 = () => {
  const { t: v_8d41d7, i18n: v_9c213b } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc, reset: v_487a25 } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const {
    selectedCountryDialCode: v_459d5e,
    setSelectedCountryDialCode: v_f693e7,
    selectedRegion: v_2f03bc,
    setSelectedRegion: v_2f2d51,
    setSelectMode: v_67ab1c,
    signupFormData: v_8d7bc8,
    setSignupFormData: v_eee6b0,
    resetSignupFormData: v_4df356,
    setVerificationEmail: v_b572c3,
    setVerificationSuccessRoute: v_8f89f3,
  } = v_700ef9();

  const [v_f142d8, v_6dde2f] = v_5ab095(v_8d7bc8.familyName);
  const [v_a7c7b7, v_15ded5] = v_5ab095(v_8d7bc8.givenName);
  const [v_05b02f, v_ef747e] = v_5ab095(
    v_8d7bc8.familyName || v_8d7bc8.givenName
      ? `${v_8d7bc8.familyName || ''} ${v_8d7bc8.givenName || ''}`.trim()
      : ''
  );
  const [v_e0c7e8, v_fedf34] = v_5ab095(v_8d7bc8.email);
  const [v_adc076, v_52b279] = v_5ab095(v_8d7bc8.password);
  const [v_1e51a9, v_014c88] = v_5ab095('');
  const [v_f872c3, v_c6fe9e] = v_5ab095(false);
  const [v_99a8a8, v_ed3503] = v_5ab095(false);
  const [v_3a6ac4, v_f768f9] = v_5ab095(v_8d7bc8.phoneNumber);
  const [v_9bf12c, v_fb6bbb] = v_5ab095(v_8d7bc8.referralEmail);
  const [v_88dca2, v_e33ec0] = v_5ab095(false);
  const [v_47b466, v_dee9cd] = v_5ab095(false);
  const [v_d0472c, v_5d25dd] = v_5ab095(false);

  const [v_c3eac4, v_bdc43c] = v_5ab095<GenderValue>(
    v_d0472c ? '0' : (v_8d7bc8.gender || 'male')
  );
  const [v_f83808, v_64a312] = v_5ab095<AgeValue>(
    v_d0472c ? '0' : (v_8d7bc8.ageRange || '10')
  );
  const [v_471e49, v_7f4d53] = v_5ab095(false);
  const [v_68a5a9, v_8e53ad] = v_5ab095(false);
  const [v_e55f34, v_f932c8] = v_5ab095(false);

  const v_b1f14f = v_471e49 && v_68a5a9 && v_e55f34;

  const [v_7dc79d, v_1bdbba] = v_5ab095(false);
  const [v_90b6e5, v_e23b14] = v_5ab095<v_9dd03c>('service');
  const [v_e23171, v_4f9463] = v_5ab095<string>('');
  const [v_295e3d, v_522fa7] = v_5ab095(false);
  const [v_528eae, v_f33b38] = v_5ab095<string | null>(null);
  const [v_3a64df, v_c73419] = v_5ab095(false);
  const [v_7962f1, v_6a0bf8] = v_5ab095('');
  const [v_963133, v_24b641] = v_5ab095<v_da1883[]>(v_52495e);
  const [v_5f1e0e, v_dad6ca] = v_5ab095<boolean>(true); 
  const [v_0908db, v_1c41ce] = v_5ab095(false);

  const [v_b67b40, v_a259be] = v_5ab095(false);
  const [v_bd30a1, v_e03dd9] = v_5ab095('');
  const [v_335974, v_88450b] = v_5ab095<v_da1883[]>(v_1bd8ad);
  const [v_d6cff0, v_677cd9] = v_5ab095(false);

  const v_5a46cd = (clauseId: v_9dd03c) => {
    if (v_111946 === 'service') {
      v_7f4d53(true);
    } else if (v_111946 === 'location') {
      v_8e53ad(true);
    } else if (v_111946 === 'personal') {
      v_f932c8(true);
    }
    v_1bdbba(false);
  };

  const v_ccb639 = async (clauseId: v_9dd03c) => {
    v_e23b14(v_111946);
    v_1bdbba(true);
    v_522fa7(true);
    v_f33b38(null);
    v_4f9463('');

    try {

      let v_7c5e9b = v_9c213b.language || 'ko';
      if (v_7c5e9b === 'zh' || v_7c5e9b === 'zhCN' || v_7c5e9b === 'zh-CN') {
        v_7c5e9b = 'zh-CN';
      }

      const v_4898e2 = v_111946 as 'service' | 'location' | 'personal';
      const v_75fec9 = await v_4dba02(v_4898e2, v_7c5e9b, v_9b57fc);

      if (v_75fec9) {
        v_4f9463(v_75fec9);
      } else {
        v_f33b38(v_8d41d7('screens.myInfoClauses.loadFailed'));
      }
    } catch (v_49263d) {
      console.error('[회원가입] 약관 내용 로드 오류:', v_49263d);
      v_f33b38(v_8d41d7('screens.myInfoClauses.loadError'));
    } finally {
      v_522fa7(false);
    }
  };

  const v_05a7b9 = () => {
    v_1bdbba(false);
  };

  const v_590486 = v_459d5e?.iso2?.toLowerCase() === 'kr';

  const v_90ad93 = [82, 81, 86, 1, 62]; 
  const v_56ad9c = v_459d5e?.countryCode ? v_90ad93.includes(v_459d5e.countryCode) : false;

  const v_56743f = v_a3453e.useMemo(() => {

    if (!v_56ad9c) {
      return v_789afd.name;
    }

    if (v_2f03bc && (v_2f03bc.iso2 === 'select' || v_2f03bc.dialCode === '0')) {
      return '';
    }

    let v_3b402b = '';
    if (v_2f03bc) {

      v_3b402b = v_2f03bc.name;
    } else {
      v_3b402b = v_590486 ? '' : v_789afd.name;
    }
    if (__DEV__) {
      console.log('[회원가입] regionDisplayValue 계산:', {
        selectedRegion: v_2f03bc,
        selectedRegionName: v_2f03bc?.name,
        selectedRegionIso2: v_2f03bc?.iso2,
        selectedRegionDialCode: v_2f03bc?.dialCode,
        isKoreaSelected: v_590486,
        isCountryWithRegions: v_56ad9c,
        value: v_3b402b,
      });
    }
    return v_3b402b;
  }, [v_2f03bc, v_590486, v_56ad9c]);

  v_a3453e.useEffect(() => {
    const v_91c5e2 = async () => {
      if (!v_459d5e?.countryCode) return;

      v_1c41ce(true);
      try {
        const result: v_107459 = await v_5c7129(
          (v_b9bbbd) => v_11e39e(v_b9bbbd, v_9b57fc),
          v_459d5e.countryCode || 0,
          v_369014(v_459d5e.iso2)
        );
        v_24b641(v_43c42e.regions);
        v_dad6ca(v_43c42e.hasRegions);

        if (v_43c42e.hasRegions && v_43c42e.regions.length > 0) {

          if (v_2f03bc && v_2f03bc.dialCode !== '0' && v_2f03bc.iso2 !== 'select') {
            const v_d2a53b = v_43c42e.regions.some(
              (v_cb35cb) => v_cb35cb.iso2 === v_2f03bc.iso2 && v_cb35cb.dialCode === v_2f03bc.dialCode
            );
            if (!v_d2a53b) {
              console.log('[회원가입] 선택된 지역이 새로운 목록에 없음, 첫 번째 지역으로 변경');
              v_2f2d51(v_43c42e.regions[0]);
            } else {
              console.log('[회원가입] 선택된 지역 유지:', v_2f03bc.name);
            }
          } else if (!v_2f03bc || v_2f03bc.iso2 === 'select' || v_2f03bc.dialCode === '0') {

            console.log('[회원가입] 지역 자동 선택 건너뜀 (사용자 선택 대기)');
          }
        } else {

          v_2f2d51(v_789afd);
        }
      } catch (v_5e9bfe) {
        console.error('[회원가입] 지역 목록 로드 실패:', v_5e9bfe);
        const v_80d56a = v_369014(v_459d5e.iso2);
        v_24b641(v_80d56a);

        v_dad6ca(v_80d56a.length > 0 && v_80d56a[0].iso2 !== 'global');
      } finally {
        v_1c41ce(false);
      }
    };

    v_91c5e2();

  }, [v_459d5e, v_9b57fc]);

  v_a3453e.useEffect(() => {
    if (v_b67b40) {
      const v_dc6060 = async () => {
        v_677cd9(true);
        try {
          const v_058836 = await v_151d5f(
            () => v_60f557(v_9b57fc),
            v_1bd8ad
          );
          v_88450b(v_058836);
        } catch (v_5e9bfe) {
          console.error('[회원가입] 국가 목록 로드 실패:', v_5e9bfe);
          v_88450b(v_1bd8ad);
        } finally {
          v_677cd9(false);
        }
      };
      v_dc6060();
    }
  }, [v_b67b40, v_9b57fc]);

  const v_daa71c = v_df9f57(() => {
    if (!v_bd30a1.trim()) {
      return v_335974;
    }
    const v_470e34 = v_bd30a1.trim().toLowerCase();
    return v_335974.filter((v_8c0b26) => {
      const v_cd2b74 = v_8c0b26.name.toLowerCase();
      const v_73b9dc = v_8c0b26.iso2.toLowerCase();
      const v_bed18d = v_8c0b26.dialCode.toLowerCase();
      return v_cd2b74.includes(v_470e34) || v_73b9dc.includes(v_470e34) || v_bed18d.includes(v_470e34);
    });
  }, [v_bd30a1, v_335974]);

  const v_de5bf5 = (country: v_da1883) => {
    console.log('[회원가입] 국가 선택:', {
      country: v_b9bbbd,
      iso2: v_b9bbbd.iso2,
      name: v_b9bbbd.name,
      dialCode: v_b9bbbd.dialCode,
      countryCode: v_b9bbbd.countryCode,
    });
    v_f693e7(v_b9bbbd);
    v_a259be(false);
    v_e03dd9('');
  };

  const selectOption: v_da1883 = v_df9f57(() => ({
    iso2: 'select',
    name: v_8d41d7('screens.countryCodeSelect.selectOption') || '선택',
    dialCode: '0',
    flagEmoji: '📍',
    countryCode: 0,
  }), [v_8d41d7]);

  const v_904f1e = v_df9f57(() => {

    return v_d0472c ? [v_a35839, ...v_963133] : v_963133;
  }, [v_a35839, v_963133, v_d0472c]);

  const v_4e187d = v_df9f57(() => {
    if (!v_7962f1.trim()) {
      return v_904f1e;
    }
    const v_470e34 = v_7962f1.trim().toLowerCase();
    return v_904f1e.filter((v_8c0b26) => {
      const v_cd2b74 = v_8c0b26.name.toLowerCase();
      const v_73b9dc = v_8c0b26.iso2.toLowerCase();
      return v_cd2b74.includes(v_470e34) || v_73b9dc.includes(v_470e34);
    });
  }, [v_7962f1, v_904f1e]);

  const v_477add = (region: v_da1883) => {
    console.log('[회원가입] 지역 선택:', {
      region: v_a6c30b,
      iso2: v_a6c30b.iso2,
      name: v_a6c30b.name,
      dialCode: v_a6c30b.dialCode,
      countryCode: v_a6c30b.countryCode,
    });

    if (v_a6c30b.iso2 === 'select' || v_a6c30b.dialCode === '0') {
      console.log('[회원가입] "선택" 옵션 선택 - null로 설정');
      v_2f2d51(null);
    } else {
      console.log('[회원가입] 지역 선택:', v_a6c30b.name);
      v_2f2d51(v_a6c30b);
    }
    v_c73419(false);
    v_6a0bf8('');
  };

  const v_2ca208 = v_a3453e.useRef(false);

  v_a3453e.useEffect(() => {
    const v_b2b2a0 = async () => {
      try {

        const v_ea9ffe = await v_e84827.getItem('googleSignupRequired');
        if (v_ea9ffe === 'true') {
          v_dee9cd(true);
          const v_3639b5 = await v_e84827.getItem('googleSignupEmail');
          if (v_3639b5) {
            v_fedf34(v_3639b5);
            console.log('[회원가입] 구글 회원가입 모드, 이메일 자동 입력:', v_3639b5);
          }
          return; 
        }

        const v_45c706 = await v_e84827.getItem('appleSignupRequired');
        if (v_45c706 === 'true') {
          v_5d25dd(true);
          const v_743678 = await v_e84827.getItem('appleSignupEmail');
          if (v_743678) {
            v_fedf34(v_743678);
            console.log('[회원가입] 애플 회원가입 모드, 이메일 자동 입력:', v_743678);
          }

          const v_ed69bf = await v_e84827.getItem('appleSignupFullName');
          const v_356af8 = await v_e84827.getItem('appleSignupGivenName');
          const v_cf1b6a = await v_e84827.getItem('appleSignupFamilyName');

          if (v_ed69bf || v_356af8 || v_cf1b6a) {

            const v_82f022 = v_ed69bf || `${v_cf1b6a || ''} ${v_356af8 || ''}`.trim();
            if (v_82f022) {
              v_ef747e(v_82f022);
              v_15ded5(v_356af8 || '');
              v_6dde2f(v_cf1b6a || '');
              console.log('[회원가입] 애플 회원가입 모드, 이름 자동 입력:', { fullName: v_82f022, givenName: v_356af8, familyName: v_cf1b6a });
            }
          }

          v_bdc43c('0');
          v_64a312('0');

          if (v_2f2d51) {

            const v_90f713 = !v_2f03bc || 
              (v_2f03bc.iso2 === '서울' && v_2f03bc.countryCode === 82) ||
              (v_2f03bc.iso2 === 'global' && v_2f03bc.dialCode === '0');

            if (v_90f713) {
              const v_031f8c = {
                iso2: 'select',
                name: v_8d41d7('screens.signup.genderSelect') || '선택',
                dialCode: '0',
                flagEmoji: '📍',
                countryCode: 0,
              };
              v_2f2d51(v_031f8c);
              console.log('[회원가입] 애플 회원가입 모드, 지역 "선택" 옵션 설정:', v_031f8c);
            } else {
              console.log('[회원가입] 애플 회원가입 모드 - 이미 지역이 선택되어 있음, 유지:', v_2f03bc?.name);
            }
          }
        }
      } catch (v_5e9bfe) {
        console.error('[회원가입] 소셜 회원가입 모드 확인 실패:', v_5e9bfe);
      }
    };

    v_b2b2a0();
  }, [v_8d41d7]); 

  const v_788ac5 = v_a3453e.useRef(false);
  v_a3453e.useEffect(() => {

    if (v_d0472c && v_2f2d51 && !v_788ac5.current) {

      if (!v_2f03bc || (v_2f03bc.iso2 !== 'select' && v_2f03bc.dialCode !== '0')) {

        const v_efb878 = v_2f03bc && (
          (v_2f03bc.iso2 === '서울' && v_2f03bc.countryCode === 82) || 
          v_2f03bc.iso2 === 'global' ||
          (!v_2f03bc.countryCode && v_2f03bc.dialCode !== '0' && v_2f03bc.iso2 !== 'select')
        );

        if (v_efb878 || !v_2f03bc) {
          const v_031f8c = {
            iso2: 'select',
            name: v_8d41d7('screens.signup.genderSelect') || '선택',
            dialCode: '0',
            flagEmoji: '📍',
            countryCode: 0,
          };
          v_2f2d51(v_031f8c);
          v_788ac5.current = true;
          console.log('[회원가입] 애플 회원가입 모드 - 지역을 "선택"으로 초기 설정');
        } else {

          v_788ac5.current = true;
          console.log('[회원가입] 애플 회원가입 모드 - 이미 지역이 선택되어 있음, 유지:', v_2f03bc.name);
        }
      } else {

        v_788ac5.current = true;
      }
    }
  }, [v_d0472c, v_2f03bc, v_2f2d51, v_8d41d7]); 

  v_a3453e.useEffect(() => {
    const v_c9d3c8 = async () => {
      try {
        const v_4b1c8e = await v_e84827.getItem('processed_install_referrer');
        if (v_4b1c8e) {

          const v_24baff = new URLSearchParams(v_4b1c8e);
          const v_a560de = v_24baff.get('utm_source');
          const v_2c9a0c = v_24baff.get('utm_content');

          if (v_a560de === 'referral' && v_2c9a0c) {
            const v_571452 = decodeURIComponent(v_2c9a0c);

            if (!v_8d7bc8.referralEmail || v_8d7bc8.referralEmail === '') {
              v_fb6bbb(v_571452);
              console.log('[회원가입] processed_install_referrer에서 추천인 이메일 로드:', v_571452);
            }
          }
        }
      } catch (v_5e9bfe) {
        console.error('[회원가입] processed_install_referrer 로드 실패:', v_5e9bfe);
      }
    };

    v_c9d3c8();
  }, [v_8d7bc8.referralEmail]);

  v_a3453e.useEffect(() => {
      if (!v_2ca208.current) {

        if (!v_47b466 && !v_d0472c) {
          v_fedf34(v_8d7bc8.email);
        }
      v_6dde2f(v_8d7bc8.familyName);
      v_15ded5(v_8d7bc8.givenName);

      const v_419da8 = `${v_8d7bc8.familyName || ''} ${v_8d7bc8.givenName || ''}`.trim();
      v_ef747e(v_419da8);
      v_52b279(v_8d7bc8.password);
      v_014c88('');
      v_c6fe9e(false);
      v_ed3503(false);
      v_f768f9(v_8d7bc8.phoneNumber);
      v_fb6bbb(v_8d7bc8.referralEmail);

      v_bdc43c(v_d0472c ? v_8d7bc8.gender : (v_8d7bc8.gender || 'male'));
      v_64a312(v_d0472c ? v_8d7bc8.ageRange : (v_8d7bc8.ageRange || '10'));

      v_7f4d53(false);
      v_8e53ad(false);
      v_f932c8(false);
      v_2ca208.current = true;
    }
  }, [v_8d7bc8, v_47b466, v_d0472c]);

  v_a3453e.useEffect(() => {
    if (!v_2ca208.current) return;

    v_eee6b0({
      familyName: v_f142d8,
      givenName: v_a7c7b7,
      email: v_e0c7e8,
      password: v_adc076,
      phoneNumber: v_3a6ac4,
      region: v_2f03bc ? v_2f03bc.iso2 : '',
      referralEmail: v_9bf12c,
      gender: v_c3eac4,
      ageRange: v_f83808,
      termsAccepted: v_b1f14f,
    });
  }, [
    v_f142d8,
    v_a7c7b7,
    v_e0c7e8,
    v_adc076,
    v_3a6ac4,
    v_2f03bc,
    v_9bf12c,
    v_c3eac4,
    v_f83808,
    v_b1f14f,

  ]);

  const v_585b02 = async () => {

    const v_b63249 = v_05b02f.trim().split(/\s+/);
    let v_c0da8d = '';
    let v_eb8dd4 = '';

    if (v_b63249.length === 0) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.nameRequired'));
      return;
    } else if (v_b63249.length === 1) {

      v_c0da8d = v_b63249[0];
      v_eb8dd4 = '';
    } else {

      v_eb8dd4 = v_b63249[0];
      v_c0da8d = v_b63249.slice(1).join(' ');
    }

    if (!v_c0da8d.trim()) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.nameRequired'));
      return;
    }

    if (!v_e0c7e8.trim()) {
      await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.emailRequired'));
      return;
    }

    if (!v_d0472c) {
      if (!v_adc076.trim()) {
        await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.passwordRequired'));
        return;
      }

      const v_b947d5 = v_adc076.length >= 7;
      const v_5af9de = /\d/.test(v_adc076);
      const v_f18523 = /[a-z]/.test(v_adc076);
      const v_f6f742 = /[A-Z]/.test(v_adc076);

      if (!(v_b947d5 && v_5af9de && v_f18523 && v_f6f742)) {
        await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.passwordPolicy'));
        return;
      }

      if (!v_1e51a9.trim()) {
        await v_889fad(
          v_8d41d7('screens.signup.alerts.inputError'),
          v_8d41d7('screens.signup.errors.passwordConfirmRequired'),
        );
        return;
      }

      if (v_adc076 !== v_1e51a9) {
        await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.passwordMismatch'));
        return;
      }
    }

    if (!v_d0472c) {
      if (!v_3a6ac4.trim()) {
        await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.phoneRequired'));
        return;
      }

      if (v_5f1e0e && v_590486 && (!v_2f03bc || v_2f03bc.dialCode === '0')) {
        await v_889fad(v_8d41d7('screens.signup.alerts.inputError'), v_8d41d7('screens.signup.errors.regionRequired'));
        return;
      }
    }

    if (!v_b1f14f) {
      await v_889fad(v_8d41d7('screens.signup.alerts.termsRequired'), v_8d41d7('screens.signup.errors.termsRequired'));
      return;
    }

    v_e33ec0(true);

    try {

      if (!v_47b466 && !v_d0472c) {
        console.log('[회원가입] 1단계: 이메일 중복 확인 시작');
        const v_d854e8 = await v_60e3a5(v_e0c7e8.trim(), v_9b57fc);

        if (!v_d854e8) {
          await v_889fad(v_8d41d7('screens.signup.alerts.emailDuplicate'), v_8d41d7('screens.signup.errors.emailDuplicate'));
          v_e33ec0(false);
          return;
        }
      } else {
        console.log('[회원가입] 소셜 회원가입 모드 - 이메일 중복 확인 스킵');
      }

      let v_65bdb1 = 0;
      if (v_9bf12c.trim()) {
        console.log('[회원가입] 2단계: 추천인 이메일 확인 시작');
        const v_8aae3c = await v_01332e(v_9bf12c.trim(), v_9b57fc);
        if (v_8aae3c !== null) {
          v_65bdb1 = v_8aae3c;
        } else {

          const v_af3e48 = await v_889fad(
            v_8d41d7('screens.signup.alerts.referralConfirm'),
            v_8d41d7('screens.signup.errors.referralInvalid'),
            [
              {
                text: v_8d41d7('screens.signup.alerts.cancel'),
                style: 'cancel',
                onPress: () => {
                  v_e33ec0(false);
                },
              },
              {
                text: v_8d41d7('screens.signup.alerts.continue'),
                onPress: () => {

                },
              },
            ],
          );

          if (v_af3e48 === 0) {
            return;
          }

        }
      } else {

        console.log('[회원가입] 2단계: 추천인 이메일이 비어있음 - 알림 표시');
        const v_9f1622 = v_8d41d7('screens.signup.alerts.referralEmpty');
        const v_a8cd21 = v_8d41d7('screens.signup.errors.referralEmpty');
        const v_dde6e9 = v_8d41d7('screens.signup.alerts.inputReferral');
        const v_1b6aa4 = v_8d41d7('screens.signup.alerts.confirm');

        console.log('[회원가입] 알림 파라미터:', { title: v_9f1622, message: v_a8cd21, button1Text: v_dde6e9, button2Text: v_1b6aa4 });

        try {
          const v_af3e48 = await v_889fad(
            v_9f1622,
            v_a8cd21,
            [
              {
                text: v_dde6e9,
                style: 'cancel',
                onPress: () => {
                  console.log('[회원가입] 입력하기 버튼 클릭');
                  v_e33ec0(false);
                },
              },
              {
                text: v_1b6aa4,
                onPress: () => {
                  console.log('[회원가입] 확인 버튼 클릭');

                },
              },
            ],
          );

          console.log('[회원가입] 알림 버튼 인덱스:', v_af3e48);

          if (v_af3e48 === 0) {
            console.log('[회원가입] 입력하기 선택 - 회원가입 중단');
            return;
          }

          console.log('[회원가입] 확인 선택 - 계속 진행');
        } catch (v_5e9bfe) {
          console.error('[회원가입] 알림 표시 오류:', v_5e9bfe);

        }
      }

      if (v_d0472c) {
        console.log('[회원가입] 애플 회원가입 모드 - 이메일 인증 건너뛰고 바로 회원가입 진행');

        try {

          const v_6c3a47 = parseInt(v_459d5e.dialCode.replace('+', ''), 10) || 82;
          const v_a4d981 = v_459d5e.iso2 || 'KR';

          const v_94bdf5 = v_5f1e0e && v_2f03bc
            ? parseInt(v_2f03bc.dialCode, 10) || 0
            : 0;

          const v_df7dab = {
            email: v_e0c7e8.trim(),
            pin: '', 
            firstname: v_c0da8d.trim(),
            lastname: v_eb8dd4.trim() || '',
            gender: v_91bb22.getGenderCode(v_c3eac4 || '0'),
            mobile: v_3a6ac4.trim() || '',
            mobilecode: v_6c3a47,
            countrycode: v_a4d981,
            country: v_6c3a47,
            region: v_94bdf5,
            age: v_91bb22.getAgeCode(v_f83808 || '0'),
            recommand: v_65bdb1 || 0,
            os: v_91bb22.getOSCode(),
            social_code: 2052, 
          };

          console.log('[회원가입] 애플 회원가입 API 호출 시작');

          let v_d0b446 = false;
          try {
            v_d0b446 = await v_35200c(v_df7dab, v_9b57fc);
          } catch (v_788ec0) {

            if (v_788ec0 instanceof v_3333d3 && v_788ec0.response?.status === 409) {
              console.log('[회원가입] 이미 사용중인 이메일 (409) - 애플 로그인으로 로그인 안내');
              await v_889fad(
                v_8d41d7('screens.signup.alerts.emailDuplicate') || '이미 가입된 이메일',
                v_8d41d7('screens.signup.errors.emailDuplicate') || '이미 가입된 이메일입니다. 애플 로그인으로 로그인해주세요.',
                [
                  {
                    text: v_8d41d7('screens.signup.success.confirm') || '확인',
                    onPress: () => {
                      v_487a25(v_ce4741.authLanding);
                      v_9b57fc(v_ce4741.login);
                    },
                  },
                ],
              );
              v_e33ec0(false);
              return;
            }
            throw v_788ec0;
          }

          if (!v_d0b446) {
            await v_889fad(
              v_8d41d7('screens.signup.alerts.signupFailed') || '회원가입 실패',
              v_8d41d7('screens.signup.errors.signupFailed') || '회원가입에 실패했습니다. 다시 시도해주세요.',
            );
            v_e33ec0(false);
            return;
          }

          await v_e84827.setItem('appleSignupCompleted', 'true');
          await v_e84827.setItem('appleSignupCompletedEmail', v_e0c7e8.trim());
          console.log('[회원가입] 애플 회원가입 완료 플래그 저장:', v_e0c7e8.trim());

          await v_e84827.removeItem('appleSignupRequired');
          await v_e84827.removeItem('appleSignupEmail');

          console.log('[회원가입] 애플 회원가입 완료 - 자동 로그인 시작');

          const v_25c481 = await v_7af6c9(v_9b57fc);

          if (!v_25c481.success || !v_25c481.data) {
            console.error('[회원가입] 애플 자동 로그인 실패:', v_25c481.message);
            await v_889fad(
              v_8d41d7('screens.signup.alerts.error') || '오류',
              v_8d41d7('screens.signup.errors.autoLoginFailed') || '회원가입은 완료되었지만 자동 로그인에 실패했습니다. 로그인 화면에서 다시 시도해주세요.',
              [
                {
                  text: v_8d41d7('screens.signup.success.confirm') || '확인',
                  onPress: () => {
                    v_487a25(v_ce4741.authLanding);
                    v_9b57fc(v_ce4741.login);
                  },
                },
              ],
            );
            v_e33ec0(false);
            return;
          }

          const { memberId: v_717992, email: v_eab62a, name: v_1833e7, accessToken: v_2ca7e0, refreshToken: v_dfaee3 } = v_25c481.data;

          console.log('[회원가입] 애플 자동 로그인 성공:', { memberId: v_717992, email: v_eab62a });

          const v_ef7306 = {
            member: v_717992,
            email: v_eab62a,
            firstname: v_1833e7 ? (v_1833e7.split(' ')[0] || v_1833e7) : '',
            lastname: v_1833e7 ? v_1833e7.split(' ').slice(1).join(' ') : '',
            extrastr: v_2ca7e0 || '',
          };

          if (v_2ca7e0 && v_717992) {
            const v_06cee6 = v_a5170b(v_2ca7e0);
            const v_aa0ad8 = await v_ea3493(v_717992, v_06cee6, v_9b57fc);
            if (!v_aa0ad8) {
              console.warn('[회원가입] 세션 저장 실패');
            }
          }

          await v_e84827.removeItem('userData');
          await v_e84827.removeItem('userSessionToken');
          await v_e84827.setItem('userEmail', v_eab62a);
          await v_e84827.setItem('userData', JSON.stringify(v_ef7306));
          await v_e84827.setItem('userSessionToken', v_2ca7e0 || '');
          await v_e84827.setItem('isLoggedIn', 'true');
          await v_e84827.setItem('rememberMe', 'true');
          await v_e84827.setItem('loginType', 'apple');

          if (v_dfaee3) {
            await v_e84827.setItem('refreshToken', v_dfaee3);
          }

          console.log('[회원가입] 애플 자동 로그인 완료 - 맵 페이지로 이동');

          v_e33ec0(false);
          v_487a25(v_ce4741.map);
          return;
        } catch (v_5e9bfe) {
          console.error('[회원가입] 애플 회원가입 처리 중 오류:', v_5e9bfe);
          await v_889fad(
            v_8d41d7('screens.signup.alerts.error'),
            v_8d41d7('screens.signup.errors.error') || '회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
          );
          v_e33ec0(false);
          return;
        }
      }

      console.log('[회원가입] 3단계: 회원가입 데이터 저장 및 이메일 인증 화면 이동');

      try {

        const v_0e0310 = {
          email: v_e0c7e8.trim(),
          password: v_adc076,
          familyName: v_eb8dd4.trim(),
          givenName: v_c0da8d.trim(),
          phoneNumber: v_3a6ac4.trim(),
          selectedCountryDialCode: {
            iso2: v_459d5e.iso2,
            dialCode: v_459d5e.dialCode,
            flagEmoji: v_459d5e.flagEmoji,
            name: v_459d5e.name,
          },
          selectedRegion: v_2f03bc
            ? {
                iso2: v_2f03bc.iso2,
                dialCode: v_2f03bc.dialCode,
                flagEmoji: v_2f03bc.flagEmoji,
                name: v_2f03bc.name,
              }
            : null,
          hasRegions: v_5f1e0e, 
          referralMemberId: v_65bdb1,
          gender: v_c3eac4,
          ageRange: v_f83808,
          isAppleSignupMode: false,
        };

        await v_e84827.setItem('pendingSignupData', JSON.stringify(v_0e0310));
        console.log('[회원가입] AsyncStorage에 회원가입 데이터 저장 완료');

        v_b572c3(v_e0c7e8.trim());
        v_8f89f3(v_ce4741.signup); 

        v_e33ec0(false);
        v_9b57fc(v_ce4741.emailVerification);
      } catch (v_df17d5) {
        console.error('[회원가입] AsyncStorage 저장 실패:', v_df17d5);
        await v_889fad(
          v_8d41d7('screens.signup.alerts.error'),
          v_8d41d7('screens.signup.errors.error') || '데이터 저장에 실패했습니다. 다시 시도해주세요.',
        );
        v_e33ec0(false);
        return;
      }
    } catch (v_5e9bfe) {
      console.error('[회원가입] 전체 프로세스 실패:', v_5e9bfe);

      try {
        await v_e84827.removeItem('pendingSignupData');
        console.log('[회원가입] 에러 발생으로 인한 AsyncStorage 정리 완료');
      } catch (v_df17d5) {
        console.error('[회원가입] AsyncStorage 정리 실패:', v_df17d5);
      }

      const v_1744b9 =
        v_5e9bfe.response?.data?.message ||
        v_5e9bfe.message ||
        v_8d41d7('screens.signup.errors.error');
      await v_889fad(v_8d41d7('screens.signup.alerts.error'), v_1744b9);
    } finally {
      v_e33ec0(false);
    }
  };

  const clauseTitleMap: Record<v_9dd03c, string> = {
    service: v_8d41d7('screens.myInfoClauses.serviceClause'),
    location: v_8d41d7('screens.myInfoClauses.locationClause'),
    personal: v_8d41d7('screens.myInfoClauses.personalClause'),
  };

  const v_4c70c4 = Math.min(520, Math.round(v_700696.get('window').height * 0.55));

  const v_648e0d = async () => {

    console.log('[회원가입] 뒤로가기 (구글 회원가입 모드:', v_47b466, ', 애플 회원가입 모드:', v_d0472c, ')');

    if (v_47b466 || v_d0472c) {

      await v_e84827.removeItem('googleSignupRequired');
      await v_e84827.removeItem('googleSignupEmail');
      await v_e84827.removeItem('appleSignupRequired');
      await v_e84827.removeItem('appleSignupEmail');
      v_9b57fc(v_ce4741.login);
    } else {

      v_c7ac57();
    }
  };

  return (
    <View style={v_d81136.container}>
        <Header
          title={v_47b466 ? '구글 회원가입' : v_d0472c ? '애플 회원가입' : v_8d41d7('screens.signup.title')}
          onBackPress={v_648e0d}
          showBackButton={true}
        />
      <Dialog
        visible={v_7dc79d}
        title={v_c6eb94[v_90b6e5]}
        onClose={v_05a7b9}
        actions={[
          {
            label: v_8d41d7('screens.signup.agreeButton'),
            onPress: () => v_5a46cd(v_90b6e5),
            variant: 'primary',
          },
          {
            label: v_8d41d7('common.buttons.close'),
            onPress: v_05a7b9,
            variant: 'secondary',
          },
        ]}
        containerStyle={v_d81136.clauseDialogContainer}
      >
        <View style={{ maxHeight: v_4c70c4 }}>
          {v_295e3d ? (
            <View style={v_d81136.clauseLoadingContainer}>
              <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
              <Text style={v_d81136.clauseLoadingText}>{v_8d41d7('screens.myInfoClauses.loading')}</Text>
            </View>
          ) : v_528eae ? (
            <Text style={v_d81136.clauseErrorText}>{v_528eae}</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={true}>
              <Text style={v_d81136.clauseContentText}>{v_e23171}</Text>
            </ScrollView>
          )}
        </View>
      </Dialog>

      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={v_d81136.formFieldContainer}>
          <FormField
            label={v_8d41d7('screens.signup.givenNameLabel')}
            placeholder={v_8d41d7('screens.signup.givenNamePlaceholder')}
            value={v_05b02f}
            onChangeText={(v_9b6134) => {
              v_ef747e(v_9b6134);

              const v_b63249 = v_9b6134.trim().split(/\s+/);
              if (v_b63249.length === 0) {
                v_6dde2f('');
                v_15ded5('');
              } else if (v_b63249.length === 1) {
                v_6dde2f('');
                v_15ded5(v_b63249[0]);
              } else {
                v_6dde2f(v_b63249[0]);
                v_15ded5(v_b63249.slice(1).join(' '));
              }
            }}
            autoCapitalize="none"
            containerStyle={v_d81136.fieldContainer}
          />

          <FormField
            label={v_8d41d7('screens.signup.emailLabel')}
            placeholder={v_8d41d7('screens.signup.emailPlaceholder')}
            value={v_e0c7e8}
            onChangeText={v_fedf34}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={v_d81136.fieldContainer}
            editable={!v_47b466 && !v_d0472c}
          />

          {}
          {!v_d0472c && (
            <>
              <FormField
                label={v_8d41d7('screens.signup.passwordLabel')}
                placeholder={v_8d41d7('screens.signup.passwordPlaceholder')}
                value={v_adc076}
                onChangeText={(v_9b6134) => v_52b279(v_96abff(v_9b6134))}
                secureTextEntry={!v_f872c3}
                autoCapitalize="none"
                containerStyle={v_d81136.fieldContainer}
                rightAccessory={
                  <TouchableOpacity
                    style={v_d81136.eyeButton}
                    onPress={() => v_c6fe9e((v_ba2215) => !v_ba2215)}
                    activeOpacity={0.7}
                    disabled={v_88dca2}
                  >
                    <Ionicons
                      name={v_f872c3 ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#666666"
                    />
                  </TouchableOpacity>
                }
              />

              <FormField
                label={v_8d41d7('screens.signup.passwordConfirmLabel')}
                placeholder={v_8d41d7('screens.signup.passwordConfirmPlaceholder')}
                value={v_1e51a9}
                onChangeText={(v_9b6134) => v_014c88(v_96abff(v_9b6134))}
                secureTextEntry={!v_99a8a8}
                autoCapitalize="none"
                containerStyle={v_d81136.fieldContainer}
                rightAccessory={
                  <TouchableOpacity
                    style={v_d81136.eyeButton}
                    onPress={() => v_ed3503((v_ba2215) => !v_ba2215)}
                    activeOpacity={0.7}
                    disabled={v_88dca2}
                  >
                    <Ionicons
                      name={v_99a8a8 ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#666666"
                    />
                  </TouchableOpacity>
                }
              />
            </>
          )}

          <FormField
            containerStyle={v_d81136.fieldContainer}
            label={v_d0472c ? `${v_8d41d7('screens.signup.phoneNumberLabel')} (${v_8d41d7('screens.signup.optional') || '선택사항'})` : v_8d41d7('screens.signup.phoneNumberLabel')}
            placeholder={v_8d41d7('screens.signup.phoneNumberPlaceholder')}
            keyboardType="phone-pad"
            value={v_3a6ac4}
            onChangeText={v_f768f9}
            leftAccessory={
              <TouchableOpacity
                style={v_d81136.phonePrefix}
                onPress={() => {
                  v_a259be(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.flagEmoji}>{v_459d5e.flagEmoji}</Text>
                <Text style={v_d81136.countryCode}>{v_459d5e.dialCode}</Text>
              </TouchableOpacity>
            }
          />

          {}
          <View style={v_d81136.fieldContainer}>
            <FormField
              label={v_d0472c ? `${v_8d41d7('screens.signup.regionLabel')} (${v_8d41d7('screens.signup.optional') || '선택사항'})` : v_8d41d7('screens.signup.regionLabel')}
              placeholder={v_8d41d7('screens.signup.regionPlaceholder')}
              value={v_56743f}
              editable={false}
              showDisabledStyle={false}
              onPress={() => {

                if (!v_5f1e0e || v_88dca2) {
                  return;
                }
                v_c73419(true);
              }}
            />
            {}
            {!v_56ad9c && (
              <Text style={v_d81136.regionHelper}>
                {v_8d41d7('screens.signup.regionHelper') || 'Global 지역이 자동으로 적용됩니다.'}
              </Text>
            )}
          </View>

          <View style={v_d81136.fieldContainer}>
            <Text style={v_d81136.label}>
              {v_d0472c 
                ? `${v_8d41d7('screens.signup.genderLabel')} (${v_8d41d7('screens.signup.optional') || '선택사항'})`
                : v_8d41d7('screens.signup.genderLabel')}
            </Text>
            <View style={[v_d81136.inlineOptions]}>
              {v_a3453e.useMemo(() => {
                const v_a35839 = { value: '0' as const, label: v_8d41d7('screens.signup.genderSelect') || '선택' };
                const v_16f845 = { value: 'male' as const, label: v_8d41d7('screens.signup.genderMale') };
                const v_bb39f9 = { value: 'female' as const, label: v_8d41d7('screens.signup.genderFemale') };

                return v_d0472c
                  ? [v_a35839, v_16f845, v_bb39f9]
                  : [v_16f845, v_bb39f9];
              }, [v_d0472c, v_8d41d7]).map((v_0bd920) => {
                const v_26dce6 = v_c3eac4 === v_0bd920.value;
                return (
                  <OptionButton
                    key={v_0bd920.value}
                    label={v_0bd920.value === '0' ? (v_8d41d7('screens.signup.genderSelect') || '선택') : v_0bd920.label}
                    selected={v_26dce6}
                    onPress={() => v_bdc43c(v_0bd920.value)}
                  />
                );
              })}
            </View>
          </View>

          <View style={v_d81136.fieldContainer}>
            <Text style={v_d81136.label}>
              {v_d0472c 
                ? `${v_8d41d7('screens.signup.ageLabel')} (${v_8d41d7('screens.signup.optional') || '선택사항'})`
                : v_8d41d7('screens.signup.ageLabel')}
            </Text>
            <View style={[v_d81136.inlineOptions]}>
              {v_a3453e.useMemo(() => {
                return v_d0472c 
                  ? v_0c96f7 
                  : v_0c96f7.filter(v_0bd920 => v_0bd920 !== '0');
              }, [v_d0472c]).map((v_0bd920, v_a56041, v_09228c) => {
                const v_26dce6 = v_f83808 === v_0bd920;
                const v_0d0d82 = v_a56041 === v_09228c.length - 1;
                return (
                  <OptionButton
                    key={v_0bd920}
                    label={v_0bd920 === '0' ? (v_8d41d7('screens.signup.ageSelect') || '선택') : v_0bd920}
                    selected={v_26dce6}
                    onPress={() => v_64a312(v_0bd920)}
                    flex={1}
                  />
                );
              })}
            </View>
          </View>

          <FormField
            label={v_8d41d7('screens.signup.referralEmailLabel')}
            placeholder={v_8d41d7('screens.signup.referralEmailPlaceholder')}
            value={v_9bf12c}
            onChangeText={v_fb6bbb}
            autoCapitalize="none"
            containerStyle={v_d81136.fieldContainer}
          />

          {}
          <View style={v_d81136.termsRow}>
            <FormCheckbox
              checked={v_471e49}
              onToggle={() => v_7f4d53((v_ba2215) => !v_ba2215)}
              variant="square"
            />
            <Text style={v_d81136.termsText}>
              <Text style={v_d81136.termsHighlight} onPress={() => v_ccb639('service')}>
                {v_8d41d7('screens.signup.terms.service')}
              </Text>{' '}
              {v_8d41d7('screens.signup.termsAgree')}
            </Text>
          </View>

          {}
          <View style={v_d81136.termsRow}>
            <FormCheckbox
              checked={v_68a5a9}
              onToggle={() => v_8e53ad((v_ba2215) => !v_ba2215)}
              variant="square"
            />
            <Text style={v_d81136.termsText}>
              <Text style={v_d81136.termsHighlight} onPress={() => v_ccb639('location')}>
                {v_8d41d7('screens.signup.terms.location')}
              </Text>{' '}
              {v_8d41d7('screens.signup.termsAgree')}
            </Text>
          </View>

          {}
          <View style={v_d81136.termsRow}>
            <FormCheckbox
              checked={v_e55f34}
              onToggle={() => v_f932c8((v_ba2215) => !v_ba2215)}
              variant="square"
            />
            <Text style={v_d81136.termsText}>
              <Text style={v_d81136.termsHighlight} onPress={() => v_ccb639('personal')}>
                {v_8d41d7('screens.signup.terms.privacy')}
              </Text>{' '}
              {v_8d41d7('screens.signup.termsAgree')}
            </Text>
          </View>

          <View style={v_d81136.buttonWrapper}>
            <PrimaryButton
              title={v_88dca2 ? v_8d41d7('screens.signup.submitting') : v_8d41d7('screens.signup.submitButton')}
              fullWidth
              onPress={v_585b02}
              disabled={v_88dca2}
            />
            {v_88dca2 && (
              <View style={v_d81136.loadingContainer}>
                <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
              </View>
            )}
          </View>
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
                {v_8d41d7('screens.countryCodeSelect.countrySelectTitle') || '국가 선택'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  v_a259be(false);
                  v_e03dd9('');
                }}
              >
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
                renderItem={({ item: v_8c0b26 }) => (
                  <CountryCodeListItem
                    country={v_8c0b26}
                    isSelected={v_8c0b26.iso2 === v_459d5e?.iso2 && v_8c0b26.dialCode === v_459d5e?.dialCode}
                    onPress={v_de5bf5}
                    hideDialCode={false}
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
                data={v_4e187d}
                keyExtractor={(v_8c0b26, v_a56041) => `${v_8c0b26.iso2}-${v_8c0b26.dialCode}-${v_8c0b26.name}-${v_a56041}`}
                renderItem={({ item: v_8c0b26 }) => (
                  <CountryCodeListItem
                    country={v_8c0b26}
                    isSelected={v_8c0b26.iso2 === v_2f03bc?.iso2 && v_8c0b26.dialCode === v_2f03bc?.dialCode}
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
    ...v_a61db3.scrollContent,
  },
  formFieldContainer: {
    ...v_bae512.fieldContainer,
  },
  fieldContainer: {
    borderWidth: 0,
  },
  label: {
    ...v_bae512.label,
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: '#ededed',
  },
  flagEmoji: {
    fontSize: v_843035.size.large,
    marginRight: 6,
  },
  countryCode: {
    fontSize: v_843035.size.medium,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    gap: 8,
    width: '100%',
  },
  eyeButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: v_843035.size.msmall,
    lineHeight: 15,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
  },
  termsHighlight: {
    fontFamily: 'Roboto-SemiBold',
    color: '#343A5A',
  },
  buttonWrapper: {
    ...v_a61db3.bottomButtonContainer,
  },
  loadingContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  regionHelper: {
    fontSize: v_843035.size.small,
    lineHeight: 18,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
  },
  clauseDialogContainer: {
    maxWidth: 420,
  },
  clauseLoadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clauseLoadingText: {
    fontSize: v_843035.size.small,
    lineHeight: 18,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  clauseErrorText: {
    fontSize: v_843035.size.small,
    lineHeight: 18,
    color: '#ff6b6b',
    fontFamily: 'Roboto-Regular',
  },
  clauseContentText: {
    fontSize: v_843035.size.small,
    lineHeight: 20,
    color: '#333333',
    fontFamily: 'Roboto-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: v_700696.get('window').height * 0.8,
    paddingBottom: v_326be8.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.headerText,
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#8e9bae',
    lineHeight: 24,
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
  modalLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});

