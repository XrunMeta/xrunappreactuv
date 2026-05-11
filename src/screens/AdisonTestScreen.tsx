import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeView, Header } from '../components';
import { useAppNavigation } from '../navigation';
import { COLORS, FONTS, SIZES, COMMON_STYLES } from '../constants';

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

const CASES: { num: 1 | 2 | 3 | 4 | 5; label: string; expected: number; desc: string }[] = [
  { num: 1, label: '1. 성공 (200)', expected: 200, desc: '정상 적립 요청' },
  { num: 2, label: '2. HMAC 실패 (101)', expected: 101, desc: '잘못된 서명' },
  { num: 3, label: '3. 파라미터 오류 (102)', expected: 102, desc: 'click_key/uid 누락' },
  { num: 4, label: '4. 잘못된 UID (103)', expected: 103, desc: '존재하지 않는 uid' },
  { num: 5, label: '5. click_key 중복 (104)', expected: 104, desc: '같은 key 2회 호출' },
];

const API_BASE = 'https://oth-path-gw.example.invalid/oth-path';

export const AdisonTestScreen: React.FC = () => {
  const { goBack } = useAppNavigation();
  const [results, setResults] = useState<Record<number, CaseResult | { error: string } | 'running'>>({});
  const [secret, setSecret] = useState<{ dev: boolean; prd: boolean } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/secret-check`)
      .then((r) => r.json())
      .then(setSecret)
      .catch(() => setSecret(null));
  }, []);

  const runOne = async (n: 1 | 2 | 3 | 4 | 5) => {
    setResults((r) => ({ ...r, [n]: 'running' }));
    try {
      const res = await fetch(`${API_BASE}/${n}`, { method: 'POST' });
      const json = (await res.json()) as CaseResult & { error?: string };
      if (json.error) {
        setResults((r) => ({ ...r, [n]: { error: json.error || 'unknown' } }));
      } else {
        setResults((r) => ({ ...r, [n]: json }));
      }
    } catch (e: any) {
      setResults((r) => ({ ...r, [n]: { error: e?.message || String(e) } }));
    }
  };

  const runAll = async () => {
    for (const c of CASES) {
      await runOne(c.num);
    }
  };

  const renderResult = (n: number) => {
    const r = results[n];
    if (!r) return <Text style={styles.notRun}>미실행</Text>;
    if (r === 'running') return <ActivityIndicator size="small" color={COLORS.primary} />;
    if ('error' in r) return <Text style={styles.error}>ERROR: {r.error}</Text>;
    const ok = r.code === r.expected;
    return (
      <View>
        <Text style={[styles.resultHead, { color: ok ? '#22c55e' : '#ef4444' }]}>
          {ok ? '✓ PASS' : '✗ FAIL'} — code={r.code} (expected={r.expected}), status={r.status}
        </Text>
        <Text style={styles.resultMsg}>message: {r.message}</Text>
        {r.firstCallResult && (
          <Text style={styles.resultSub}>
            1차 호출: code={r.firstCallResult.code} — {r.firstCallResult.message}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeView style={COMMON_STYLES.container}>
      <Header title="Adison 적립 테스트" onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.desc}>
          파트너센터 PRD 연동 재승인용 dev 테스트 이력 생성 도구입니다.{'\n'}
          서버가 ADISON_HMAC_SECRET_DEV 로 서명해 /callbackAdison 을 self-call 합니다.
        </Text>

        {secret && (
          <View style={styles.secretCard}>
            <Text style={styles.secretText}>HMAC 시크릿 상태</Text>
            <View style={styles.secretRow}>
              <Text style={{ color: secret.dev ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                DEV: {secret.dev ? '✓' : '✗'}
              </Text>
              <Text style={{ color: secret.prd ? '#22c55e' : '#ef4444', fontWeight: '600', marginLeft: 16 }}>
                PRD: {secret.prd ? '✓' : '✗'}
              </Text>
            </View>
            {!secret.dev && !secret.prd && (
              <Text style={styles.warn}>
                ⚠️ 시크릿 미설정 — 테스트 전부 실패합니다.
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.runAllBtn} onPress={runAll}>
          <Text style={styles.runAllText}>전체 테스트 실행 (1 → 5)</Text>
        </TouchableOpacity>

        {CASES.map((c) => (
          <View key={c.num} style={styles.caseCard}>
            <View style={styles.caseHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.caseLabel}>{c.label}</Text>
                <Text style={styles.caseDesc}>{c.desc}</Text>
              </View>
              <TouchableOpacity style={styles.runBtn} onPress={() => runOne(c.num)}>
                <Text style={styles.runBtnText}>실행</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.resultBox}>{renderResult(c.num)}</View>
          </View>
        ))}
      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: { padding: SIZES.medium, paddingBottom: 40 },
  desc: { fontSize: 12, color: COLORS.gray, marginBottom: 12, lineHeight: 18 },
  secretCard: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  secretText: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  secretRow: { flexDirection: 'row', marginTop: 6 },
  warn: { color: '#ef4444', fontSize: 11, marginTop: 6 },
  runAllBtn: {
    backgroundColor: COLORS.primary,
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
  caseLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  caseDesc: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  runBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  runBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  resultBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  notRun: { fontSize: 12, color: COLORS.gray },
  error: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  resultHead: { fontSize: 13, fontWeight: '700' },
  resultMsg: { fontSize: 11, color: COLORS.text, marginTop: 4, fontFamily: FONTS.family.regular },
  resultSub: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
});
