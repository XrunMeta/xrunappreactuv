import v_a3453e, { v_c4deb2 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_cf9c33 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608, v_556baf } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_d7d5a2 } from '../services';
import { v_21ef1f } from '../services/adison';
import { v_a61db3, v_843035 } from '../constants';

const v_16cea9 = require('../../assets/xrun-horizontal-logo.png');

export const v_865e57 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { reset: v_487a25 } = v_a0daa8();

  const v_03cae9 = async () => {
    try {

      const v_f24fd5 = await v_e84827.getItem('userData');
      if (v_f24fd5) {
        const v_ef7306 = JSON.parse(v_f24fd5);
        const v_660822 = v_ef7306.member;

        if (v_660822) {

          try {
            await v_d7d5a2(v_660822);
          } catch (v_5e9bfe) {
            console.error('[회원 탈퇴] 로그아웃 API 호출 실패:', v_5e9bfe);

          }
        }
      }

      try { v_21ef1f(); } catch (v_37eab7) {}

      await v_e84827.removeItem('isLoggedIn');
      await v_e84827.removeItem('userEmail');
      await v_e84827.removeItem('userData');
      await v_e84827.removeItem('rageProgress');
      await v_e84827.removeItem('userTickets');
      await v_e84827.removeItem('rageProgressLastUpdate');
      await v_e84827.removeItem('userSessionToken');

      await v_e84827.removeItem('appleSignupCompleted');
      await v_e84827.removeItem('appleSignupCompletedEmail');
      await v_e84827.removeItem('appleSignupRequired');
      await v_e84827.removeItem('appleSignupEmail');
      await v_e84827.removeItem('googleSignupRequired');
      await v_e84827.removeItem('googleSignupEmail');

      v_487a25(v_ce4741.login);
    } catch (v_5e9bfe) {
      console.error('[회원 탈퇴] 로그아웃 처리 중 오류:', v_5e9bfe);

      try {
        await v_e84827.removeItem('isLoggedIn');
        await v_e84827.removeItem('userEmail');
        await v_e84827.removeItem('userData');
        await v_e84827.removeItem('rageProgress');
        await v_e84827.removeItem('userTickets');
        await v_e84827.removeItem('rageProgressLastUpdate');
        await v_e84827.removeItem('userSessionToken');

        await v_e84827.removeItem('appleSignupCompleted');
        await v_e84827.removeItem('appleSignupCompletedEmail');
        await v_e84827.removeItem('appleSignupRequired');
        await v_e84827.removeItem('appleSignupEmail');
        await v_e84827.removeItem('googleSignupRequired');
        await v_e84827.removeItem('googleSignupEmail');
      } catch (v_df17d5) {
        console.error('[회원 탈퇴] AsyncStorage 삭제 중 오류:', v_df17d5);
      }
      v_487a25(v_ce4741.login);
    }
  };

  return (
    <SafeView style={v_d81136.container} backgroundColor={"#f7f7fb"}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.myInfoCloseMembershipSuccess.title')} showBackButton={false} />
      <View style={v_d81136.overlay}>
        <View style={v_d81136.card}>
          <Image source={v_16cea9} style={v_d81136.logo} resizeMode="contain" />
          <Text style={v_d81136.message}>{v_8d41d7('screens.myInfoCloseMembershipSuccess.message')}</Text>
          <Text style={v_d81136.subMessage}>
            {v_8d41d7('screens.myInfoCloseMembershipSuccess.subMessage')}
          </Text>
          <TouchableOpacity style={v_d81136.button} onPress={v_03cae9}>
            <Text style={v_d81136.buttonText}>{v_8d41d7('screens.myInfoCloseMembershipSuccess.confirmButton')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    maxWidth: 320,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  logo: {
    width: 88,
    height: 28,
    marginBottom: 16,
  },
  message: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
    marginBottom: 12,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: '#343a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
});

