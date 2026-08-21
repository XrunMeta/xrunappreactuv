

import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_39a996, v_122070 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_b2c639 } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_116c93 } from '../../src/locales';
import { v_4b64f4 } from '../../src/context';
import { v_00e8f9 } from '../../src/navigation';
import { v_0c450d } from '../../src/context/AlertDialogContext';
import { v_58584a } from '../../src/screens/ReferralMyGroupScreen';
import { v_755eb9 } from '../../src/services';

v_116c93();

const v_b40d0f = 2624;

function v_34022e(v_e11752): boolean {
  if (v_e11752 === 'localhost' || v_e11752 === '127.0.0.1' || v_e11752 === '::1') return true;

  return /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(v_e11752);
}

export default function v_9e7999() {
  const [v_b1717e, v_0189ac] = v_5ab095(false);
  const [v_638ecc, v_7136a5] = v_5ab095('준비 중');

  const v_fed274 = (() => {
    try { return v_755eb9(); } catch { return '(확인 실패)'; }
  })();
  const v_e11752 = (() => {
    const v_35f85c = v_fed274.match(/^https?:\/\/([^/:]+)/);
    return v_35f85c ? v_35f85c[1] : '';
  })();
  const v_d68659 = v_34022e(v_e11752);

  v_c4deb2(() => {
    if (!v_d68659) return; 
    (async () => {

      await v_e84827.setItem('userData', JSON.stringify({ member: v_b40d0f }));

      const v_855430 = (await v_e84827.getItem('jwt')) != null;
      await v_e84827.removeItem('jwt');
      v_7136a5(`member=${v_b40d0f} 주입 · 기존 jwt ${v_855430 ? '제거함' : '없음'}`);
      v_0189ac(true);
    })();
  }, [v_d68659]);

  if (!v_d68659) {
    return (
      <SafeAreaProvider>
        <ScrollView contentContainerStyle={v_d81136.blockBody} testID="referral-mygroup-harness-blocked">
          <Text style={v_d81136.blockTitle}>실행 차단됨 — 로컬 전용 하니스</Text>
          <Text style={v_d81136.blockText}>
            {`이 하니스는 로컬 API 로만 돌린다. 지금 baseURL 은 로컬이 아니다.\n\n`}
            {`baseURL: ${v_fed274}\nhost   : ${v_e11752 || '(파싱 실패)'}\n\n`}
            {`운영을 조회하면 실사용자 데이터를 건드리게 되므로 막았다.\n`}
            {`로컬 워커를 띄우고 src/utils/env.ts 의 dev 분기를 그 주소로 맞춘 뒤 다시 실행한다.\n\n`}
            {`⚠️ 게이트를 푸는 것으로 해결하지 않는다. 운영 조회가 꼭 필요하면 승인부터 받는다.`}
          </Text>
        </ScrollView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationProvider>
          <AlertDialogProvider>
            <View style={v_d81136.root} testID="referral-mygroup-harness">
              <Text style={v_d81136.banner}>{`[로컬 진단] ${v_638ecc} · ${v_e11752}`}</Text>
              {v_b1717e ? (
                <View style={v_d81136.stage} testID="referral-stage">
                  <ReferralMyGroupScreen />
                </View>
              ) : (
                <ActivityIndicator size="large" />
              )}
            </View>
          </AlertDialogProvider>
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const v_d81136 = v_472849.create({
  root: { flex: 1, backgroundColor: '#fff' },
  banner: { fontSize: 11, color: '#a00', padding: 6, paddingTop: 40, backgroundColor: '#fee' },
  stage: { flex: 1 },
  blockBody: { padding: 24, paddingTop: 80, backgroundColor: '#fff5f5', flexGrow: 1 },
  blockTitle: { fontSize: 18, fontWeight: '700', color: '#a00', marginBottom: 12 },
  blockText: { fontSize: 13, lineHeight: 20, color: '#333' },
});
