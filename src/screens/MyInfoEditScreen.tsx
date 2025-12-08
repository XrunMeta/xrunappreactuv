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
} from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de, v_89c10a, v_c2fdd1, v_570c34 } from '../components';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_bae512, v_843035 } from '../constants';
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
  v_8025d1,
} from '../services';

const v_0c96f7 = ['10', '20', '30', '40', '50+'] as const;

const v_a1244c = (v_c3eac4): number => {
  return v_c3eac4 === 'male' ? 2110 : 2111;
};

const v_d6877d = (v_c3eac4): 'male' | 'female' => {
  return v_c3eac4 === 2111 ? 'female' : 'male';
};

const v_e9394b = (v_2694bd): number => {
  const v_c3889d = {
    '10': 2210,
    '20': 2220,
    '30': 2230,
    '40': 2240,
    '50+': 2250,
  };
  return v_c3889d[v_2694bd] || 2210;
};

const v_596588 = (v_2694bd): (typeof v_0c96f7)[number] => {
  const ageMap: Record<number, (typeof v_0c96f7)[number]> = {
    2210: '10',
    2220: '20',
    2230: '30',
    2240: '40',
    2250: '50+',
  };
  return v_c3889d[v_2694bd || 2210] || '10';
};

export const v_cdb169 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { reset: v_487a25, canGoBack: v_7e32fb, goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const { selectedCountryDialCode: v_459d5e, setVerificationEmail: v_b572c3, setVerificationSuccessRoute: v_8f89f3, setSelectMode: v_67ab1c } = v_700ef9();

  const v_798085 = [
    { value: 'male' as const, label: v_8d41d7('screens.myInfoEdit.genderMale') },
    { value: 'female' as const, label: v_8d41d7('screens.myInfoEdit.genderFemale') },
  ];
  const [v_a32a50, v_4944f5] = v_5ab095('');
  const [v_328bb4, v_b7613d] = v_5ab095('');
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_d74a81, v_fcce73] = v_5ab095('010 2487 6746');
  const [v_a6c30b, v_c030e3] = v_5ab095('대한민국 서울');
  const [v_222917, v_b8bf44] = v_5ab095<number | null>(null);
  const [v_a4d981, v_9b1714] = v_5ab095<number | null>(null);
  const [v_c3eac4, v_bdc43c] = v_5ab095<'male' | 'female'>('male');
  const [v_2694bd, v_6e5c76] = v_5ab095<(typeof v_0c96f7)[number]>('10');
  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_e495db, v_433822] = v_5ab095(false);
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);
  const [v_e94fdf, v_59ad99] = v_5ab095<Array<{ description?: string; subcode?: number; rCode?: number; rName?: string }>>([]);
  const [v_0908db, v_1c41ce] = v_5ab095(false);

  const [v_add96c, v_85a493] = v_5ab095<{ cDesc: string; cCode: number | null }>({ cDesc: '', cCode: null });
  const [v_167c8b, v_655be9] = v_5ab095<{ rDesc: string; rCode: number | null }>({ rDesc: '', rCode: null });

  const [v_3a64df, v_c73419] = v_5ab095(false);
  const [v_db24c7, v_a0f6fa] = v_5ab095<string | null>(null);

  const [v_9d09f1, v_d0e79e] = v_5ab095('');
  const [v_b6daf3, v_c94311] = v_5ab095('');
  const [v_318eac, v_edd340] = v_5ab095<'male' | 'female'>('male');
  const [v_30922c, v_27ff98] = v_5ab095<(typeof v_0c96f7)[number]>('10');
  const [v_b6505c, v_4a9b82] = v_5ab095<number | null>(null);
  const [v_6e1588, v_8656e3] = v_5ab095<number | null>(null);

  const v_ea3fa6 = async (v_587901 = true) => {
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

            v_4944f5(v_898d5f);
            v_b7613d(v_8e4db1);
            v_fedf34(v_625c74.email || '');

            v_d0e79e(v_898d5f);
            v_c94311(v_8e4db1);
            v_edd340(v_df7343);
            v_27ff98(v_9c69cf);

            if (v_625c74.mobile) {
              v_fcce73(v_625c74.mobile.replace(/\s/g, ''));
            }

            v_bdc43c(v_df7343);

            v_6e5c76(v_9c69cf);

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

                const v_a54b0c = v_3a56f1.find((v_3f4e2e) => {
                  const v_d50b6d = typeof v_3f4e2e.cCode === 'string' ? parseInt(v_3f4e2e.cCode, 10) : v_3f4e2e.cCode;
                  const v_2ce1e2 = typeof v_3f4e2e.callnumber === 'string' ? parseInt(v_3f4e2e.callnumber, 10) : v_3f4e2e.callnumber;
                  return v_d50b6d === v_851a40 || v_2ce1e2 === v_851a40;
                });

                const v_67cb9c = v_a54b0c?.country || v_a54b0c?.cName || '';
                const v_a4d981 = v_a54b0c?.callnumber || v_a54b0c?.cCode || v_851a40;

                console.log('[정보수정] 국가 매칭 결과:', {
                  userCountry: v_851a40,
                  countryItem: v_a54b0c,
                  countryName: v_67cb9c,
                  countryCode: v_a4d981,
                });

                v_85a493({ cDesc: v_67cb9c, cCode: v_a4d981 });
                console.log('[정보수정] tempCountry 설정됨:', { cDesc: v_67cb9c, cCode: v_a4d981 });

                if (v_23b15e !== undefined && v_23b15e !== null && !isNaN(v_23b15e)) {
                  const v_5cf162 = typeof v_23b15e === 'string' ? parseInt(v_23b15e, 10) : v_23b15e;
                  v_b8bf44(v_5cf162);
                  v_8656e3(v_5cf162);

                  console.log('[정보수정] 지역 정보 설정:', { regionNum: v_5cf162, regionType: typeof v_5cf162 });

                  if (v_5cf162 === 0) {
                    const v_dbcc10 = v_8d41d7('screens.myInfoEdit.allRegions');
                    v_655be9({ rDesc: v_dbcc10, rCode: 0 });
                    v_a0f6fa(v_dbcc10);
                    console.log('[정보수정] 전체지역 설정됨 (region: 0)');
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

                      if (v_638c4d) {
                        v_655be9({ rDesc: v_638c4d, rCode: v_5cf162 });
                        v_a0f6fa(v_638c4d);
                        console.log('[정보수정] 초기 로드 - 지역 이름 찾음:', { rDesc: v_638c4d, rCode: v_5cf162 });
                      } else {
                        v_655be9({ rDesc: 'Please Select', rCode: v_5cf162 });
                        v_a0f6fa(null);
                        console.log('[정보수정] 초기 로드 - 지역 이름 없음:', { rCode: v_5cf162 });
                      }
                      v_1c41ce(false);
                    } catch (v_5e9bfe) {
                      console.error('[정보수정] 초기 로드 - 지역 목록 로드 실패:', v_5e9bfe);
                      v_655be9({ rDesc: 'Please Select', rCode: v_5cf162 });
                      v_a0f6fa(null);
                      v_1c41ce(false);
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
    v_ea3fa6();
  }, [v_9b57fc, v_8d41d7]);

  const v_1b8283 = async () => {

    if (!v_a32a50.trim()) {
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.firstNameRequired'));
      return;
    }

    if (!v_328bb4.trim()) {
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.lastNameRequired'));
      return;
    }

    if (!v_717992) {
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.userDataNotFound'));
      return;
    }

    v_433822(true);

    try {
      console.log('[정보수정] 정보 수정 시도:', {
        memberId: v_717992,
        firstName: v_a32a50.trim(),
        lastName: v_328bb4.trim(),
        phone: v_d74a81.replace(/\s/g, ''),
        gender: v_a1244c(v_c3eac4),
        age: v_e9394b(v_2694bd),
      });

      const v_e01f71 = [];

      if (v_a32a50.trim() !== v_9d09f1.trim()) {
        console.log('[정보수정] 이름 변경 감지:', { original: v_9d09f1, new: v_a32a50.trim() });
        v_e01f71.push(v_152d53(v_717992, v_a32a50.trim(), v_9b57fc));
      }

      if (v_328bb4.trim() !== v_b6daf3.trim()) {
        console.log('[정보수정] 성 변경 감지:', { original: v_b6daf3, new: v_328bb4.trim() });
        v_e01f71.push(v_7f8c9e(v_717992, v_328bb4.trim(), v_9b57fc));
      }

      const v_d199d8 = v_a1244c(v_c3eac4);
      const v_9f4b02 = v_a1244c(v_318eac);
      if (v_d199d8 !== undefined && v_d199d8 !== null && v_d199d8 !== v_9f4b02) {
        console.log('[정보수정] 성별 변경 감지:', { original: v_9f4b02, new: v_d199d8 });
        v_e01f71.push(v_71d37e(v_717992, v_d199d8, v_9b57fc));
      }

      const v_2d2cbc = v_e9394b(v_2694bd);
      const v_08fe20 = v_e9394b(v_30922c);
      if (v_2d2cbc !== undefined && v_2d2cbc !== null && v_2d2cbc !== v_08fe20) {
        console.log('[정보수정] 나이 변경 감지:', { original: v_08fe20, new: v_2d2cbc });
        v_e01f71.push(v_07f367(v_717992, v_2d2cbc, v_9b57fc));
      }

      if (v_add96c.cCode !== null && v_167c8b.rCode !== null && v_167c8b.rCode !== 0 && v_167c8b.rCode !== -1) {
        const v_ca520f = v_add96c.cCode;
        const v_c61e4f = v_167c8b.rCode;
        if (v_ca520f !== v_b6505c || v_c61e4f !== v_6e1588) {
          console.log('[정보수정] 국가/지역 변경 감지:', {
            original: { country: v_b6505c, region: v_6e1588 },
            new: { country: v_ca520f, region: v_c61e4f },
          });
          v_e01f71.push(v_4296b8(v_717992, v_ca520f, v_c61e4f, v_9b57fc));
        }
      }

      if (v_e01f71.length > 0) {

        await Promise.all(v_e01f71);

        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.saveSuccess'), v_8d41d7('screens.myInfoEdit.alerts.saveSuccessMessage'));

        await v_ea3fa6(false);
      } else {

        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.noChanges'));
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

      v_67ab1c('country');
      v_9b57fc('countryCodeSelect');
    } catch (v_5e9bfe) {
      console.error('[정보수정] 국가 선택 화면 이동 실패:', v_5e9bfe);
    }
  };

  const v_801fea = async () => {
    if (!v_e0c7e8) {
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.emailNotFound'));
      return;
    }

    try {

      const v_b97179 = async () => {
        try {
          return await v_8025d1(v_e0c7e8, v_9b57fc);
        } catch (v_5e9bfe) {
          console.error('[정보수정] 이메일 인증 코드 발송 오류:', v_5e9bfe);
          return false;
        }
      };

      const v_43c42e = await Promise.race([
        v_b97179(),
        new Promise<boolean>((v_6f7712) => setTimeout(() => v_6f7712(false), 5000)),
      ]);

      if (v_43c42e) {

        v_b572c3(v_e0c7e8);
        v_8f89f3(v_ce4741.myInfoPhoneEdit); 
        v_9b57fc(v_ce4741.verificationCode);
      } else {
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.emailSendFailed'), [
          {
            text: v_8d41d7('screens.myInfoEdit.alerts.confirm'),
            onPress: () => {

            },
          },
        ]);
      }
    } catch (v_5e9bfe) {
      console.error('[정보수정] 전화번호 수정 인증 오류:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.verificationError'));
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

  const v_477add = (v_2f03bc) => {
    const v_222917 = v_2f03bc.subcode || v_2f03bc.rCode || 0;
    const v_5a7a4f = v_2f03bc.description || v_2f03bc.rName || '';

    console.log('[정보수정] 지역 선택:', { regionCode: v_222917, regionDesc: v_5a7a4f, selectedRegion: v_2f03bc });

    if (!v_5a7a4f) {
      console.warn('[정보수정] 지역 설명이 없습니다:', v_2f03bc);

      const v_2d5696 = 'Unknown';
      v_655be9({
        rDesc: v_2d5696,
        rCode: v_222917,
      });
      v_a0f6fa(v_2d5696);
    } else {

      if (v_222917 === -1) {
        v_655be9({
          rDesc: v_5a7a4f,
          rCode: -1, 
        });
        console.log('[정보수정] 전체 지역 선택됨:', v_5a7a4f);
      } else {
        v_655be9({
          rDesc: v_5a7a4f,
          rCode: v_222917,
        });
        console.log('[정보수정] 지역 선택됨:', { rDesc: v_5a7a4f, rCode: v_222917 });
      }

      v_a0f6fa(v_5a7a4f);
    }

    v_c73419(false);

    setTimeout(() => {
      console.log('[정보수정] 지역 선택 후 상태 확인:', {
        tempCountry: v_add96c,
        tempRegion: { rDesc: v_5a7a4f || 'Unknown', rCode: v_222917 },
        selectedRegionId: v_5a7a4f || 'Unknown',
      });
    }, 100);
  };

  const v_c0d2d4 = async () => {
    console.log('handleOpenRegionModal');

    if (!v_459d5e || !v_459d5e.dialCode) {
      await v_889fad(
        v_8d41d7('screens.myInfoEdit.alerts.error'),
        v_8d41d7('screens.myInfoEdit.alerts.selectCountryFirst')
      );

      v_261e69();
      return;
    }

    const v_a4d981 = v_bec697(v_459d5e.dialCode); 
    if (!v_a4d981) {
      await v_889fad(
        v_8d41d7('screens.myInfoEdit.alerts.error'),
        v_8d41d7('screens.myInfoEdit.alerts.invalidCountryCode')
      );
      return;
    }

    const v_ca520f = v_add96c.cCode;
    if (v_e94fdf.length === 0 || v_ca520f !== v_a4d981) {
      v_1c41ce(true);
      try {
        console.log('[정보수정] 지역 목록 조회:', { countryCode: v_a4d981, dialCode: v_459d5e.dialCode });

        const v_878b8c = await v_11e39e(v_a4d981, v_9b57fc);
        const v_13de92 = v_878b8c.data || [];
        v_59ad99(v_13de92);

        v_85a493({
          cDesc: v_459d5e.name,
          cCode: v_a4d981,
        });

        if (v_13de92.length === 0) {
          console.log('[정보수정] 지역 목록이 없습니다. 전체 지역을 선택할 수 있습니다.');
          v_59ad99([{
            description: v_8d41d7('screens.myInfoEdit.allRegions'),
            subcode: -1,
            rCode: -1,
            rName: v_8d41d7('screens.myInfoEdit.allRegions'),
          }]);
        }
      } catch (v_5e9bfe) {
        console.error('[정보수정] 지역 목록 로드 실패:', v_5e9bfe);

        v_59ad99([{
          description: v_8d41d7('screens.myInfoEdit.allRegions'),
          subcode: -1,
          rCode: -1,
          rName: v_8d41d7('screens.myInfoEdit.allRegions'),
        }]);
      } finally {
        v_1c41ce(false);
      }
    }

    v_c73419(true);
  };

  v_c4deb2(() => {
    console.log('[정보수정] useEffect 트리거됨 - selectedCountryDialCode 변경 감지:', {
      selectedCountryDialCode: v_459d5e,
      iso2: v_459d5e?.iso2,
      isLoading: v_cd31a8,
      조건체크: v_459d5e && !v_cd31a8,
    });
    console.log('selectedCountryDialCode', v_459d5e);
    console.log('isLoading', v_cd31a8);
    console.log('selectedCountryDialCode && !isLoading', v_459d5e && !v_cd31a8);

      console.log('[정보수정] 전화번호 국가 선택됨 (CountryCodeSelectScreen에서):', {
        iso2: v_459d5e.iso2,
        name: v_459d5e.name,
        dialCode: v_459d5e.dialCode,
        flagEmoji: v_459d5e.flagEmoji,
      });

      const v_a4d981 = v_bec697(v_459d5e.dialCode);
      console.log('[정보수정] 추출된 국가 코드:', { dialCode: v_459d5e.dialCode, countryCode: v_a4d981 });

      if (v_a4d981) {

        v_85a493({
          cDesc: v_459d5e.name,
          cCode: v_a4d981,
        });
        console.log('[정보수정] tempCountry 업데이트 완료:', {
          cDesc: v_459d5e.name,
          cCode: v_a4d981,
        });

        v_59ad99([]);

        if (v_167c8b.rCode !== null && v_167c8b.rCode !== 0) {
          v_655be9({ rDesc: 'Please Select', rCode: 0 });
          v_a0f6fa(null);
        } 
    }
  }, [v_459d5e?.iso2]);

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
              value={v_a32a50}
              onChangeText={v_4944f5}
              placeholder={v_8d41d7('screens.myInfoEdit.firstNamePlaceholder')}
              editable={!v_e495db}
              containerStyle={v_d81136.fieldContainer}
            />

            <FormField
              label={v_8d41d7('screens.myInfoEdit.lastName')}
              value={v_328bb4}
              onChangeText={v_b7613d}
              placeholder={v_8d41d7('screens.myInfoEdit.lastNamePlaceholder')}
              editable={!v_e495db}
              containerStyle={v_d81136.fieldContainer}
            />

            <View style={v_d81136.fieldContainer}>
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.email')}</Text>
              <View style={v_d81136.disabledInput}>
                <Text style={v_d81136.disabledText}>{v_e0c7e8 || v_8d41d7('screens.myInfoEdit.email')}</Text>
              </View>
            </View>

            <View style={v_d81136.inlineLabelRow}>
              <Text style={v_d81136.sectionLabel}>{v_8d41d7('screens.myInfoEdit.password')}</Text>
              <TouchableOpacity onPress={v_c09605}>
                <Text style={v_d81136.linkText}>{v_8d41d7('screens.myInfoEdit.changePassword')}</Text>
              </TouchableOpacity>
            </View>
            <View style={v_d81136.readonlyInput}>
              <Text style={v_d81136.readonlyText}>
                {v_8d41d7('screens.myInfoEdit.lastPasswordChangeDateLabel', { date: '2025.05.02' })}
              </Text>
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
            <View style={v_d81136.fieldContainer}>
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.region')}</Text>
              <TouchableOpacity
                style={v_d81136.regionField}
                onPress={v_c0d2d4}
                activeOpacity={0.7}
                disabled={v_e495db || v_0908db}
              >
                <Text style={[v_d81136.regionValue, (!v_add96c.cDesc || !v_167c8b.rDesc || v_167c8b.rCode === 0 || v_167c8b.rCode === null || v_167c8b.rCode === -1) && v_d81136.regionPlaceholder]}>
                  {v_add96c.cDesc && v_167c8b.rDesc && v_167c8b.rDesc !== 'Please Select' && v_167c8b.rCode !== null && v_167c8b.rCode !== 0 && v_167c8b.rCode !== -1
                    ? `${v_add96c.cDesc}, ${v_167c8b.rDesc}`
                    : v_add96c.cDesc
                      ? `${v_add96c.cDesc}, ${v_8d41d7('screens.myInfoEdit.pleaseSelect')}`
                      : v_8d41d7('screens.myInfoEdit.selectCountryAndRegion')}
                </Text>
                <Text style={v_d81136.arrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={v_d81136.fieldContainer}>
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.gender')}</Text>
              <View style={v_d81136.inlineOptions}>
                {v_798085.map((v_0bd920) => (
                  <OptionButton
                    key={v_0bd920.value}
                    label={v_0bd920.label}
                    selected={v_c3eac4 === v_0bd920.value}
                    onPress={() => v_bdc43c(v_0bd920.value)}
                    disabled={v_e495db}
                  />
                ))}
              </View>
            </View>

            <View style={v_d81136.fieldContainer}>
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.age')}</Text>
              <View style={[v_d81136.inlineOptions, v_d81136.ageOptionsRow]}>
                {v_0c96f7.map((v_0bd920, v_a56041) => {
                  return (
                    <OptionButton
                      key={v_0bd920}
                      label={v_0bd920}
                      selected={v_2694bd === v_0bd920}
                      onPress={() => v_6e5c76(v_0bd920)}
                      flex={1}
                      disabled={v_e495db}
                    />
                  );
                })}
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
        visible={v_3a64df}
        onRequestClose={() => v_c73419(false)}
      >
        <View style={v_d81136.modalOverlay}>
          <TouchableOpacity
            style={v_d81136.modalBackdrop}
            activeOpacity={1}
            onPress={() => v_c73419(false)}
          />
          <View style={v_d81136.modalContent}>
            <View style={v_d81136.modalHeader}>
              <Text style={v_d81136.modalTitle}>
                {v_add96c.cDesc ? `${v_8d41d7('screens.myInfoEdit.selectRegion')} - ${v_add96c.cDesc}` : v_8d41d7('screens.myInfoEdit.selectRegion')}
              </Text>
              <TouchableOpacity onPress={() => v_c73419(false)}>
                <Text style={v_d81136.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            {v_0908db ? (
              <View style={v_d81136.modalLoadingContainer}>
                <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
              </View>
            ) : (
              <ScrollView style={v_d81136.modalScrollView}>
                {v_e94fdf.length > 0 ? (
                  v_e94fdf.map((v_a6c30b) => (
                    <TouchableOpacity
                      key={v_a6c30b.subcode || v_a6c30b.rCode || v_a6c30b.description}
                      style={[
                        v_d81136.modalItem,
                        v_db24c7 === (v_a6c30b.description || v_a6c30b.rName) && v_d81136.modalItemSelected,
                      ]}
                      onPress={() => v_477add(v_a6c30b)}
                    >
                      <Text style={v_d81136.modalItemText}>
                        {v_a6c30b.description || v_a6c30b.rName || 'Unknown'}
                      </Text>
                      {v_db24c7 === (v_a6c30b.description || v_a6c30b.rName) && (
                        <Text style={v_d81136.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={v_d81136.emptyContainer}>
                    <Text style={v_d81136.emptyText}>{v_8d41d7('screens.myInfoEdit.noRegions')}</Text>
                    <Text style={v_d81136.emptyTextSub}>{v_8d41d7('screens.myInfoEdit.selectAllRegions')}</Text>
                  </View>
                )}
              </ScrollView>
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
    marginBottom: 8,
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
  checkmark: {
    fontSize: v_843035.size.mmedium,
    color: v_1bfbd0.buttonPrimary,
    fontFamily: 'Roboto-Bold',
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
    maxHeight: '80%',
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
  modalScrollView: {
    maxHeight: 400,
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
});

