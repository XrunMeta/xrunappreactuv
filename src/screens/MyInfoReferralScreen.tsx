import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_122070, v_03e392 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608, v_368e80, v_cb41de } from '../components';
import { v_1bfbd0, v_a61db3 } from '../constants';
import { v_a0daa8 } from '../navigation';

export const v_6086b6 = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_e0c7e8, v_fedf34] = v_5ab095('');

  const v_03cae9 = () => {
    if (!v_e0c7e8.trim()) {
      v_03e392.alert('이메일 입력', '새 레퍼럴 이메일을 입력해주세요.');
      return;
    }
    v_03e392.alert('신청 완료', '레퍼럴 변경 요청이 전송되었습니다.');
    v_fedf34('');
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="레퍼럴 수정" onBackPress={v_c7ac57} showBackButton />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.inner}>
          <Text style={v_d81136.sectionLabel}>현재 레퍼럴</Text>
          <View style={v_d81136.card}>
            <Text style={v_d81136.cardName}>WWWWWW</Text>
            <Text style={v_d81136.cardEmail}>w****w@ww.www</Text>
          </View>

          <FormField
            label="새 레퍼럴 이메일"
            value={v_e0c7e8}
            onChangeText={v_fedf34}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="새 레퍼럴 이메일을 입력해주세요."
          />
        </View>

        <View style={v_d81136.bottomSection}>
          <PrimaryButton
            title="Confirm"
            fullWidth
            onPress={v_03cae9}
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
    backgroundColor: '#f2f2f7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#2a2727',
    marginBottom: 12,
  },
  card: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 32,
    shadowColor: '#3629b7',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardName: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: '#33395b',
    marginBottom: 6,
  },
  cardEmail: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#bababa',
  },
  bottomSection: {
    ...v_a61db3.bottomSection,
  },
  primaryButton: {
    width: '100%',
  },
});


