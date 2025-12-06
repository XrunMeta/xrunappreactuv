import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_19b633,
  v_4623af,
  v_39a996,
  v_9cabcb,
} from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de, v_89c10a, v_c2fdd1, v_570c34 } from '../components';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_bae512 } from '../constants';
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
  const [v_6c7bef, v_7a68da] = v_5ab095<Array<{ country?: string; callnumber?: number; cCode?: number; cName?: string }>>([]);
  const [v_e94fdf, v_59ad99] = v_5ab095<Array<{ description?: string; subcode?: number; rCode?: number; rName?: string }>>([]);
  const [v_0899ab, v_3400e8] = v_5ab095<number | null>(null);
  const [v_2f03bc, v_2f2d51] = v_5ab095<number | null>(null);
  const [v_0908db, v_1c41ce] = v_5ab095(false);

  const [v_add96c, v_85a493] = v_5ab095<{ cDesc: string; cCode: number | null }>({ cDesc: '', cCode: null });
  const [v_167c8b, v_655be9] = v_5ab095<{ rDesc: string; rCode: number | null }>({ rDesc: '', rCode: null });

  v_c4deb2(() => {
    const v_ea3fa6 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          const v_660822 = v_ef7306.member;

          if (v_660822) {
            v_9d6aeb(v_660822);
            const v_3393e3 = await v_a7ab3c(v_660822, v_9b57fc);
            const v_625c74 = v_3393e3.data[0];

            if (v_625c74) {
              v_4944f5(v_625c74.firstname || '');
              v_b7613d(v_625c74.lastname || '');
              v_fedf34(v_625c74.email || '');

              if (v_625c74.mobile) {
                v_fcce73(v_625c74.mobile.replace(/\s/g, ''));
              }

              v_bdc43c(v_d6877d(v_625c74.gender));

              v_6e5c76(v_596588(v_625c74.ages));

              if (v_625c74.country) {
                v_9b1714(v_625c74.country);
                v_3400e8(v_625c74.country);

                try {
                  const v_e7edd4 = await v_60f557(v_9b57fc);
                  const v_3a56f1 = v_e7edd4.data || [];
                  v_7a68da(v_3a56f1);

                  const v_a54b0c = v_3a56f1.find((v_3f4e2e) => (v_3f4e2e.cCode === v_625c74.country || v_3f4e2e.callnumber === v_625c74.country));
                  const v_67cb9c = v_a54b0c?.country || v_a54b0c?.cName || '';
                  const v_a4d981 = v_a54b0c?.callnumber || v_a54b0c?.cCode || v_625c74.country;

                  v_85a493({ cDesc: v_67cb9c, cCode: v_a4d981 });

                  if (v_625c74.region) {
                    v_b8bf44(v_625c74.region);
                    v_2f2d51(v_625c74.region);

                    const v_878b8c = await v_11e39e(v_625c74.country, v_9b57fc);
                    const v_13de92 = v_878b8c.data || [];
                    v_59ad99(v_13de92);

                    const v_8098b2 = v_13de92.find((v_cb35cb) => (v_cb35cb.subcode === v_625c74.region || v_cb35cb.rCode === v_625c74.region));
                    const v_638c4d = v_8098b2?.description || v_8098b2?.rName || '';
                    const v_222917 = v_8098b2?.subcode || v_8098b2?.rCode || v_625c74.region;

                    v_655be9({ rDesc: v_638c4d, rCode: v_222917 });

                    if (v_638c4d) {
                      v_c030e3(`${v_67cb9c} ${v_638c4d}`);
                    }
                  } else {

                    v_655be9({ rDesc: 'Please Select', rCode: 0 });
                  }
                } catch (v_5e9bfe) {
                  console.error('[정보수정] 국가/지역 정보 로드 실패:', v_5e9bfe);
                }
              } else if (v_625c74.region) {
                v_b8bf44(v_625c74.region);
              } else {

                v_85a493({ cDesc: '', cCode: null });
                v_655be9({ rDesc: 'Please Select', rCode: 0 });
              }
            }
          }
        }
      } catch (v_5e9bfe) {
        console.error('[정보수정] 사용자 정보 로드 실패:', v_5e9bfe);
        await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.error'), v_8d41d7('screens.myInfoEdit.alerts.loadFailed'));
      } finally {
        v_deef62(false);
      }
    };

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

      if (v_a32a50.trim()) {
        v_e01f71.push(v_152d53(v_717992, v_a32a50.trim(), v_9b57fc));
      }

      if (v_328bb4.trim()) {
        v_e01f71.push(v_7f8c9e(v_717992, v_328bb4.trim(), v_9b57fc));
      }

      const v_d199d8 = v_a1244c(v_c3eac4);
      if (v_d199d8 !== undefined && v_d199d8 !== null) {
        v_e01f71.push(v_71d37e(v_717992, v_d199d8, v_9b57fc));
      } else {
        console.warn('[정보수정] 성별 값이 유효하지 않습니다:', v_c3eac4);
      }

      const v_2d2cbc = v_e9394b(v_2694bd);
      if (v_2d2cbc !== undefined && v_2d2cbc !== null) {
        v_e01f71.push(v_07f367(v_717992, v_2d2cbc, v_9b57fc));
      } else {
        console.warn('[정보수정] 나이 값이 유효하지 않습니다:', v_2694bd);
      }

      await Promise.all(v_e01f71);

      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.saveSuccess'), v_8d41d7('screens.myInfoEdit.alerts.saveSuccessMessage'), [
        {
          text: v_8d41d7('screens.myInfoEdit.alerts.confirm'),
          onPress: () => {

            if (v_7e32fb) {
              v_c7ac57();
            } else {
              v_487a25(v_ce4741.myInfo);
            }
          },
        },
      ]);
    } catch (v_5e9bfe) {
      console.error('[정보수정] 정보 수정 실패:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.saveFailed'), v_8d41d7('screens.myInfoEdit.alerts.saveFailedMessage'));
    } finally {
      v_433822(false);
    }
  };

  const v_c09605 = async () => {
    await v_889fad(v_8d41d7('screens.myInfoEdit.alerts.passwordChange'), v_8d41d7('screens.myInfoEdit.alerts.passwordChangeMessage'));
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

  const v_261e69 = async () => {
    try {

      v_67ab1c('country');
      v_9b57fc('countryCodeSelect');
    } catch (v_5e9bfe) {
      console.error('[정보수정] 국가 선택 화면 이동 실패:', v_5e9bfe);
    }
  };

  v_c4deb2(() => {
    const v_545028 = async () => {
      if (!v_459d5e || v_0908db) {
        return;
      }

      try {

        const v_277926 = parseInt(v_459d5e.dialCode.replace('+', ''), 10);

        if (!v_277926) {
          return;
        }

        if (v_6c7bef.length === 0) {
          const v_e7edd4 = await v_60f557(v_9b57fc);
          const v_3a56f1 = v_e7edd4.data || [];
          v_7a68da(v_3a56f1);

          const v_a54b0c = v_3a56f1.find(
            (v_3f4e2e) => (v_3f4e2e.callnumber === v_277926 || v_3f4e2e.cCode === v_277926)
          );

          if (v_a54b0c) {
            const v_a4d981 = v_a54b0c.callnumber || v_a54b0c.cCode;
            const v_67cb9c = v_a54b0c.country || v_a54b0c.cName || v_459d5e.name;

            v_85a493({
              cDesc: v_67cb9c,
              cCode: v_a4d981 || v_277926,
            });

          } else {

            v_85a493({
              cDesc: v_459d5e.name,
              cCode: v_277926,
            });

          }
        } else {

          const v_a54b0c = v_6c7bef.find(
            (v_3f4e2e) => (v_3f4e2e.callnumber === v_277926 || v_3f4e2e.cCode === v_277926)
          );

          if (v_a54b0c) {
            const v_a4d981 = v_a54b0c.callnumber || v_a54b0c.cCode;
            const v_67cb9c = v_a54b0c.country || v_a54b0c.cName || v_459d5e.name;

            v_85a493({
              cDesc: v_67cb9c,
              cCode: v_a4d981 || v_277926,
            });

          }
        }
      } catch (v_5e9bfe) {
        console.error('[정보수정] 국가 정보 업데이트 실패:', v_5e9bfe);
      } finally {
        v_1c41ce(false);
      }
    };

    if (v_459d5e && !v_cd31a8) {

      const v_cb36b1 = setTimeout(() => {
        v_545028();
      }, 100);

      return () => clearTimeout(v_cb36b1);
    }
  }, [v_459d5e?.iso2, v_9b57fc]); 

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

            <View style={v_d81136.fieldContainer}>
              <View style={v_d81136.inlineLabelRow}>
                <Text style={v_d81136.sectionLabel}>Password</Text>
                <TouchableOpacity onPress={v_c09605}>
                  <Text style={v_d81136.linkText}>Change Password</Text>
                </TouchableOpacity>
              </View>
              <View style={v_d81136.readonlyInput}>
                <Text style={v_d81136.readonlyText}>
                  {v_8d41d7('screens.myInfoEdit.lastPasswordChangeDateLabel', { date: '2025.05.02' })}
                </Text>
              </View>
            </View>

            <View style={v_d81136.fieldContainer} >
              <Text style={v_d81136.label}>{v_8d41d7('screens.myInfoEdit.phone')}</Text>
              <View style={v_d81136.phoneFieldContainer}>
                {}
                <View style={v_d81136.phonePrefixDisabled}>
                  <Text style={v_d81136.flagEmoji}>{v_459d5e.flagEmoji}</Text>
                  <Text style={v_d81136.phonePrefixTextDisabled}>
                    +{v_459d5e.dialCode.replace('+', '')}
                  </Text>
                </View>
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

            <View style={v_d81136.fieldContainer}>
              <Text style={v_d81136.label}>Country</Text>
              <TouchableOpacity
                style={v_d81136.regionField}
                onPress={v_261e69}
                activeOpacity={0.7}
                disabled={v_e495db}
              >
                <Text style={[v_d81136.regionValue, !v_add96c.cDesc && v_d81136.regionPlaceholder]}>
                  {v_add96c.cDesc
                    ? `${v_add96c.cDesc} (+${v_add96c.cCode})`
                    : v_459d5e
                      ? `${v_459d5e.name} (${v_459d5e.dialCode})`
                      : '국가를 선택하세요'}
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

    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
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
    fontSize: 16,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
  },
  linkText: {
    fontSize: 12,
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
    fontSize: 13,
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
  phonePrefixDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ededed',
    backgroundColor: '#f5f5f5',
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  phonePrefixTextDisabled: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#a8a8a7',
  },
  phoneValueContainer: {
    flex: 1,
    paddingHorizontal: 16,
    minHeight: 52, 
    justifyContent: 'center',
  },
  phoneValue: {
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
    marginLeft: 12,
  },
  editHint: {
    fontSize: 12,
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
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
  },
  regionPlaceholder: {
    color: '#dedede',
  },
  arrow: {
    fontSize: 24,
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
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  checkmark: {
    fontSize: 18,
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
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#9e9e9e',
  },
});

