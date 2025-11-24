import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_122070,
  v_19b633,
  v_4623af,
  v_03e392,
  v_39a996,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_368e80, v_cb41de, v_89c10a } from '../components';
import { v_1bfbd0, v_a61db3 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_a7ab3c, v_152d53 } from '../services';

const v_798085 = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
] as const;

const v_0c96f7 = ['10', '20', '30', '40', '50+'] as const;

export const v_cdb169 = () => {
  const { reset: v_487a25, canGoBack: v_7e32fb, goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { selectedCountryDialCode: v_459d5e } = v_700ef9();
  const [v_a32a50, v_4944f5] = v_5ab095('');
  const [v_328bb4, v_b7613d] = v_5ab095('');
  const [v_e0c7e8, v_fedf34] = v_5ab095('');
  const [v_d74a81, v_fcce73] = v_5ab095('010 2487 6746');
  const [v_a6c30b, v_c030e3] = v_5ab095('대한민국 서울');
  const [v_c3eac4, v_bdc43c] = v_5ab095<'male' | 'female'>('male');
  const [v_2694bd, v_6e5c76] = v_5ab095<(typeof v_0c96f7)[number]>('10');
  const [v_cd31a8, v_deef62] = v_5ab095(true);
  const [v_e495db, v_433822] = v_5ab095(false);
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);

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

            }
          }
        }
      } catch (v_5e9bfe) {
        console.error('[정보수정] 사용자 정보 로드 실패:', v_5e9bfe);
        v_03e392.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        v_deef62(false);
      }
    };

    v_ea3fa6();
  }, [v_9b57fc]);

  const v_1b8283 = async () => {

    if (!v_a32a50.trim()) {
      v_03e392.alert('오류', '이름을 입력해주세요.');
      return;
    }

    if (!v_717992) {
      v_03e392.alert('오류', '사용자 정보를 불러올 수 없습니다.');
      return;
    }

    v_433822(true);

    try {
      console.log('[정보수정] 이름 수정 시도:', { memberId: v_717992, firstname: v_a32a50 });

      await v_152d53(v_717992, v_a32a50.trim(), v_9b57fc);

      v_03e392.alert('저장 완료', '변경 사항이 저장되었습니다.', [
        {
          text: '확인',
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
      console.error('[정보수정] 이름 수정 실패:', v_5e9bfe);
      v_03e392.alert('저장 실패', '이름 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      v_433822(false);
    }
  };

  const v_c09605 = () => {
    v_03e392.alert('비밀번호 변경', '비밀번호 변경 프로세스는 추후 연동됩니다.');
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header
        title="Edit My Info"
        onBackPress={v_7e32fb ? v_c7ac57 : () => v_487a25(v_ce4741.myInfo)}
        showBackButton
      />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {v_cd31a8 ? (
          <View style={v_d81136.loadingContainer}>
            <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
          </View>
        ) : (
          <View style={v_d81136.formWrapper}>
            <FormField
              label="First Name"
              value={v_a32a50}
              onChangeText={v_4944f5}
              placeholder="Enter first name"
              editable={!v_e495db}
            />
            <FormField
              label="Last Name"
              value={v_328bb4}
              onChangeText={v_b7613d}
              placeholder="Enter last name"
              editable={!v_e495db}
            />
            <FormField
              label="Email"
              value={v_e0c7e8}
              onChangeText={v_fedf34}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter email address"
              editable={!v_e495db}
            />

          <View style={v_d81136.inlineLabelRow}>
            <Text style={v_d81136.sectionLabel}>Password</Text>
            <TouchableOpacity onPress={v_c09605}>
              <Text style={v_d81136.linkText}>Change Password</Text>
            </TouchableOpacity>
          </View>
          <View style={v_d81136.readonlyInput}>
            <Text style={v_d81136.readonlyText}>최종변경날짜  : 2025.05.02</Text>
          </View>

            <FormField
              label="Phone Number"
              value={v_d74a81}
              onChangeText={v_fcce73}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              editable={!v_e495db}
              leftAccessory={
                <TouchableOpacity
                  style={v_d81136.phonePrefix}
                  onPress={() => v_9b57fc('countryCodeSelect')}
                  activeOpacity={0.7}
                  disabled={v_e495db}
                >
                  <Text style={v_d81136.flagEmoji}>{v_459d5e.flagEmoji}</Text>
                  <Text style={v_d81136.phonePrefixText}>{v_459d5e.dialCode}</Text>
                </TouchableOpacity>
              }
            />

            <FormField
              label="Region"
              value={v_a6c30b}
              onChangeText={v_c030e3}
              placeholder="지역을 입력하세요"
              editable={!v_e495db}
            />

            <View style={v_d81136.formGroup}>
              <Text style={v_d81136.sectionLabel}>성별</Text>
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

            <View style={v_d81136.formGroup}>
              <Text style={v_d81136.sectionLabel}>나이</Text>
              <View style={[v_d81136.inlineOptions, v_d81136.ageOptionsRow]}>
                {v_0c96f7.map((v_0bd920, v_a56041) => {
                  const v_0d0d82 = v_a56041 === v_0c96f7.length - 1;
                  return (
                    <OptionButton
                      key={v_0bd920}
                      label={v_0bd920}
                      selected={v_2694bd === v_0bd920}
                      onPress={() => v_6e5c76(v_0bd920)}
                      flex={1}
                      disabled={v_e495db}
                      style={[
                        v_d81136.ageOptionButton,
                        !v_0d0d82 && v_d81136.ageOptionSpacing,
                      ]}
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
              title="Save Changes"
              fullWidth
              onPress={v_1b8283}
              style={v_d81136.primaryButton}
              disabled={v_cd31a8}
            />
          )}
        </View>
      </ScrollView>
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
  formWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
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
    paddingVertical: 16,
    marginBottom: 24,
  },
  readonlyText: {
    fontSize: 13,
    color: '#1a2e35',
    fontFamily: 'Roboto-Bold',
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
    fontSize: 20,
    marginRight: 6,
  },
  phonePrefixText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  formGroup: {
    marginTop: 24,
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
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
    ...v_a61db3.bottomSection,
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
});

