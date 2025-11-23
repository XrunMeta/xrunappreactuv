import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_122070,
  v_19b633,
  v_4623af,
  v_cf9c33,
  v_03e392,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608, v_368e80, v_cb41de, v_89c10a } from '../components';
import { v_1bfbd0, v_a61db3 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';

const v_0e5a30 = require('../../assets/flag-kr.png');

const v_798085 = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
] as const;

const v_0c96f7 = ['10', '20', '30', '40', '50+'] as const;

export const v_cdb169 = () => {
  const { reset: v_487a25, canGoBack: v_7e32fb, goBack: v_c7ac57 } = v_a0daa8();
  const [v_a32a50, v_4944f5] = v_5ab095('XRUN');
  const [v_328bb4, v_b7613d] = v_5ab095('X');
  const [v_e0c7e8, v_fedf34] = v_5ab095('oth-staff@example.invalid');
  const [v_d74a81, v_fcce73] = v_5ab095('010 2487 6746');
  const [v_a6c30b, v_c030e3] = v_5ab095('대한민국 서울');
  const [v_c3eac4, v_bdc43c] = v_5ab095<'male' | 'female'>('male');
  const [v_2694bd, v_6e5c76] = v_5ab095<(typeof v_0c96f7)[number]>('10');

  const v_1b8283 = () => {
    v_03e392.alert('저장 완료', '변경 사항이 저장되었습니다.');
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
        <View style={v_d81136.formWrapper}>
          <FormField
            label="First Name"
            value={v_a32a50}
            onChangeText={v_4944f5}
            placeholder="Enter first name"
          />
          <FormField
            label="Last Name"
            value={v_328bb4}
            onChangeText={v_b7613d}
            placeholder="Enter last name"
          />
          <FormField
            label="Email"
            value={v_e0c7e8}
            onChangeText={v_fedf34}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter email address"
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
            leftAccessory={
              <View style={v_d81136.phonePrefix}>
                <Image source={v_0e5a30} style={v_d81136.flagIcon} />
                <Text style={v_d81136.phonePrefixText}>+82</Text>
              </View>
            }
          />

          <FormField
            label="Region"
            value={v_a6c30b}
            onChangeText={v_c030e3}
            placeholder="지역을 입력하세요"
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

        <View style={v_d81136.bottomSection}>
          <PrimaryButton
            title="Save Changes"
            fullWidth
            onPress={v_1b8283}
            style={v_d81136.primaryButton}
          />
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
    gap: 6,
  },
  flagIcon: {
    width: 20,
    height: 14,
    borderRadius: 2,
  },
  phonePrefixText: {
    fontSize: 14,
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
});


