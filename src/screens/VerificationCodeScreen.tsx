import v_a3453e, { v_c4deb2, v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_4623af,
  v_326be8,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608, v_cb41de } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';

const v_683bb6 = 6;
const v_ef7132 = 300;

const v_79c59a = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '⌫']];

export const v_667a00 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const [v_c99bd2, v_537cbb] = v_5ab095('');
  const [v_ae68cd, v_83fe8f] = v_5ab095(v_ef7132);

  v_c4deb2(() => {
    if (v_ae68cd <= 0) {
      return;
    }
    const v_cb36b1 = setInterval(() => v_83fe8f((v_fd5f43) => v_fd5f43 - 1), 1000);
    return () => clearInterval(v_cb36b1);
  }, [v_ae68cd]);

  const v_8813df = v_df9f57(() => {
    const v_ef3543 = Math.floor(v_ae68cd / 60)
      .toString()
      .padStart(2, '0');
    const v_ec1a55 = (v_ae68cd % 60).toString().padStart(2, '0');
    return `${v_ef3543}:${v_ec1a55}`;
  }, [v_ae68cd]);

  const v_fceada = (v_3b402b) => {
    if (v_3b402b === '⌫') {
      v_537cbb((v_ba2215) => v_ba2215.slice(0, -1));
      return;
    }
    if (v_3b402b === '' || v_c99bd2.length >= v_683bb6) {
      return;
    }
    v_537cbb((v_ba2215) => v_ba2215 + v_3b402b);
  };

  const v_83b05b = () => {
    console.log('코드 확인', v_c99bd2);
    v_9b57fc(v_ce4741.login);
  };

  const v_cf9840 = () => {
    v_83fe8f(v_ef7132);
    v_537cbb('');
    console.log('코드 재전송 요청');
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="인증코드를 입력하세요" onBackPress={v_c7ac57} showBackButton />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.descriptionWrapper}>
          <Text style={v_d81136.description}>
            oth-staff@example.invalid 이메일로{'\n'}보내드린 6자리 코드를 입력하세요.
          </Text>
        </View>

        <View style={v_d81136.codeRow}>
          {Array.from({ length: v_683bb6 }).map((v_37eab7, v_a56041) => {
            const v_5f701e = v_c99bd2[v_a56041] ?? '';
            return (
              <View key={v_a56041} style={v_d81136.codeBox}>
                <Text style={v_d81136.codeText}>{v_5f701e}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={v_d81136.resendWrapper}
          onPress={v_ae68cd <= 0 ? v_cf9840 : undefined}
          activeOpacity={v_ae68cd <= 0 ? 0.7 : 1}
        >
          <Text style={v_d81136.resendText}>
            코드 재전송{' '}
            <Text style={v_d81136.resendTimer} numberOfLines={1}>
              {v_8813df}
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={v_d81136.buttonWrapper}>
          <PrimaryButton
            title="Verify"
            onPress={v_83b05b}
            fullWidth
            disabled={v_c99bd2.length !== v_683bb6}
          />
        </View>

        <View style={v_d81136.keyboardContainer}>
          {v_79c59a.map((v_3ac7e7, v_554071) => (
            <View key={v_554071} style={v_d81136.keyboardRow}>
              {v_3ac7e7.map((v_3b402b, v_a667ee) => (
                <TouchableOpacity
                  key={v_a667ee}
                  style={[v_d81136.keyButton, v_3b402b === '' && v_d81136.keyButtonPlaceholder]}
                  activeOpacity={v_3b402b ? 0.6 : 1}
                  onPress={() => v_3b402b && v_fceada(v_3b402b)}
                >
                  {v_3b402b !== '' && <Text style={v_d81136.keyText}>{v_3b402b}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {v_326be8.OS === 'ios' && (
        <View style={v_d81136.homeIndicator}>
          <View style={v_d81136.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 60,
  },
  descriptionWrapper: {
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
    marginBottom: 24,
  },
  codeBox: {
    width: 45,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  codeText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.headerText,
  },
  resendWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 16,
    lineHeight: 24,
    color: v_1bfbd0.headerText,
    fontFamily: 'Roboto-Medium',
  },
  resendTimer: {
    color: '#2873ff',
    fontFamily: 'Roboto-Medium',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 32,
  },
  keyboardContainer: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  keyButton: {
    flex: 1,
    marginHorizontal: 4,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyButtonPlaceholder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  keyText: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
});


