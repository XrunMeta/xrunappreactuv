import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_122070,
  v_39a996,
} from 'rcmrninabrnb';
import { v_556baf, v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_1bfbd0, v_843035, v_9b1a04, v_a61db3 } from '../constants';

type CaseResult = {
  case: number;
  label: string;
  expected: number;
  status: number;
  code: number;
  message: string;
  sentBody: Record<string, unknown>;
  rawResponse: string;
  firstCallResult?: { code: number; message: string };
};

const v_9754a5 = [
  { num: 1, label: '1. 성공 (200)', expected: 200, desc: '정상 적립 요청' },
  { num: 2, label: '2. HMAC 실패 (101)', expected: 101, desc: '잘못된 서명' },
  { num: 3, label: '3. 파라미터 오류 (102)', expected: 102, desc: 'click_key/uid 누락' },
  { num: 4, label: '4. 잘못된 UID (103)', expected: 103, desc: '존재하지 않는 uid' },
  { num: 5, label: '5. click_key 중복 (104)', expected: 104, desc: '같은 key 2회 호출' },
];

const v_cc9198 = 'https://oth-path-f0013c.example.invalid/oth-path';

export const AdisonTestScreen: v_a3453e.FC = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_a7f568, v_54074f] = v_5ab095<Record<number, CaseResult | { error: string } | 'running'>>({});
  const [v_43fd42, v_4b53a1] = v_5ab095<{ dev: boolean; prd: boolean } | null>(null);

  v_c4deb2(() => {
    fetch(`${v_cc9198}/secret-check`)
      .then((v_cb35cb) => v_cb35cb.json())
      .then(v_4b53a1)
      .catch(() => v_4b53a1(null));
  }, []);

  const v_4e0e97 = async (v_f4e98d) => {
    v_54074f((v_cb35cb) => ({ ...v_cb35cb, [v_f4e98d]: 'running' }));
    try {
      const v_8f00b9 = await fetch(`${v_cc9198}/${v_f4e98d}`, { method: 'POST' });
      const v_7ecfd1 = (await v_8f00b9.json()) as CaseResult & { error?: string };
      if (v_7ecfd1.error) {
        v_54074f((v_cb35cb) => ({ ...v_cb35cb, [v_f4e98d]: { error: v_7ecfd1.error || 'unknown' } }));
      } else {
        v_54074f((v_cb35cb) => ({ ...v_cb35cb, [v_f4e98d]: v_7ecfd1 }));
      }
    } catch (v_9e86fd) {
      v_54074f((v_cb35cb) => ({ ...v_cb35cb, [v_f4e98d]: { error: v_9e86fd?.message || String(v_9e86fd) } }));
    }
  };

  const v_95b6d3 = async () => {
    for (const v_3f4e2e of v_9754a5) {
      await v_4e0e97(v_3f4e2e.num);
    }
  };

  const v_b83e21 = (v_f4e98d) => {
    const v_cb35cb = v_a7f568[v_f4e98d];
    if (!v_cb35cb) return <Text style={v_d81136.notRun}>미실행</Text>;
    if (v_cb35cb === 'running') return <ActivityIndicator size="small" color={v_1bfbd0.primary} />;
    if ('error' in v_cb35cb) return <Text style={v_d81136.error}>ERROR: {v_cb35cb.error}</Text>;
    const v_3ed4c3 = v_cb35cb.code === v_cb35cb.expected;
    return (
      <View>
        <Text style={[v_d81136.resultHead, { color: v_3ed4c3 ? '#22c55e' : '#ef4444' }]}>
          {v_3ed4c3 ? '✓ PASS' : '✗ FAIL'} — code={v_cb35cb.code} (expected={v_cb35cb.expected}), status={v_cb35cb.status}
        </Text>
        <Text style={v_d81136.resultMsg}>message: {v_cb35cb.message}</Text>
        {v_cb35cb.firstCallResult && (
          <Text style={v_d81136.resultSub}>
            1차 호출: code={v_cb35cb.firstCallResult.code} — {v_cb35cb.firstCallResult.message}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeView style={v_a61db3.container}>
      <Header title="Adison 적립 테스트" onBackPress={v_c7ac57} showBackButton />
      <ScrollView contentContainerStyle={v_d81136.container}>
        <Text style={v_d81136.desc}>
          파트너센터 PRD 연동 재승인용 dev 테스트 이력 생성 도구입니다.{'\n'}
          서버가 ADISON_HMAC_SECRET_DEV 로 서명해 /callbackAdison 을 self-call 합니다.
        </Text>

        {v_43fd42 && (
          <View style={v_d81136.secretCard}>
            <Text style={v_d81136.secretText}>HMAC 시크릿 상태</Text>
            <View style={v_d81136.secretRow}>
              <Text style={{ color: v_43fd42.dev ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                DEV: {v_43fd42.dev ? '✓' : '✗'}
              </Text>
              <Text style={{ color: v_43fd42.prd ? '#22c55e' : '#ef4444', fontWeight: '600', marginLeft: 16 }}>
                PRD: {v_43fd42.prd ? '✓' : '✗'}
              </Text>
            </View>
            {!v_43fd42.dev && !v_43fd42.prd && (
              <Text style={v_d81136.warn}>
                ⚠️ 시크릿 미설정 — 테스트 전부 실패합니다.
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity style={v_d81136.runAllBtn} onPress={v_95b6d3}>
          <Text style={v_d81136.runAllText}>전체 테스트 실행 (1 → 5)</Text>
        </TouchableOpacity>

        {v_9754a5.map((v_3f4e2e) => (
          <View key={v_3f4e2e.num} style={v_d81136.caseCard}>
            <View style={v_d81136.caseHeader}>
              <View style={{ flex: 1 }}>
                <Text style={v_d81136.caseLabel}>{v_3f4e2e.label}</Text>
                <Text style={v_d81136.caseDesc}>{v_3f4e2e.desc}</Text>
              </View>
              <TouchableOpacity style={v_d81136.runBtn} onPress={() => v_4e0e97(v_3f4e2e.num)}>
                <Text style={v_d81136.runBtnText}>실행</Text>
              </TouchableOpacity>
            </View>
            <View style={v_d81136.resultBox}>{v_b83e21(v_3f4e2e.num)}</View>
          </View>
        ))}
      </ScrollView>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: { padding: v_9b1a04.medium, paddingBottom: 40 },
  desc: { fontSize: 12, color: v_1bfbd0.gray, marginBottom: 12, lineHeight: 18 },
  secretCard: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  secretText: { fontSize: 12, color: v_1bfbd0.text, fontWeight: '600' },
  secretRow: { flexDirection: 'row', marginTop: 6 },
  warn: { color: '#ef4444', fontSize: 11, marginTop: 6 },
  runAllBtn: {
    backgroundColor: v_1bfbd0.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  runAllText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  caseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  caseHeader: { flexDirection: 'row', alignItems: 'center' },
  caseLabel: { fontSize: 14, fontWeight: '700', color: v_1bfbd0.text },
  caseDesc: { fontSize: 11, color: v_1bfbd0.gray, marginTop: 2 },
  runBtn: {
    backgroundColor: v_1bfbd0.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  runBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  resultBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  notRun: { fontSize: 12, color: v_1bfbd0.gray },
  error: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  resultHead: { fontSize: 13, fontWeight: '700' },
  resultMsg: { fontSize: 11, color: v_1bfbd0.text, marginTop: 4, fontFamily: v_843035.family.regular },
  resultSub: { fontSize: 10, color: v_1bfbd0.gray, marginTop: 4 },
});
