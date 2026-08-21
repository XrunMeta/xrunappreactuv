

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initI18nSync } from '../../src/locales';
import { AppProvider } from '../../src/context';
import { NavigationProvider } from '../../src/navigation';
import { AlertDialogProvider } from '../../src/context/AlertDialogContext';
import { ReferralMyGroupScreen } from '../../src/screens/ReferralMyGroupScreen';
import { getApiBaseUrl } from '../../src/services';

initI18nSync();

const TARGET_MEMBER = 2624;

function isLocalHost(host: string): boolean {
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;

  return /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
}

export default function ReferralMyGroupHarness() {
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState('준비 중');

  const baseURL = (() => {
    try { return getApiBaseUrl(); } catch { return '(확인 실패)'; }
  })();
  const host = (() => {
    const m = baseURL.match(/^https?:\/\/([^/:]+)/);
    return m ? m[1] : '';
  })();
  const localOk = isLocalHost(host);

  useEffect(() => {
    if (!localOk) return; 
    (async () => {

      await AsyncStorage.setItem('userData', JSON.stringify({ member: TARGET_MEMBER }));

      const hadJwt = (await AsyncStorage.getItem('jwt')) != null;
      await AsyncStorage.removeItem('jwt');
      setNote(`member=${TARGET_MEMBER} 주입 · 기존 jwt ${hadJwt ? '제거함' : '없음'}`);
      setReady(true);
    })();
  }, [localOk]);

  if (!localOk) {
    return (
      <SafeAreaProvider>
        <ScrollView contentContainerStyle={styles.blockBody} testID="referral-mygroup-harness-blocked">
          <Text style={styles.blockTitle}>실행 차단됨 — 로컬 전용 하니스</Text>
          <Text style={styles.blockText}>
            {`이 하니스는 로컬 API 로만 돌린다. 지금 baseURL 은 로컬이 아니다.\n\n`}
            {`baseURL: ${baseURL}\nhost   : ${host || '(파싱 실패)'}\n\n`}
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
            <View style={styles.root} testID="referral-mygroup-harness">
              <Text style={styles.banner}>{`[로컬 진단] ${note} · ${host}`}</Text>
              {ready ? (
                <View style={styles.stage} testID="referral-stage">
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  banner: { fontSize: 11, color: '#a00', padding: 6, paddingTop: 40, backgroundColor: '#fee' },
  stage: { flex: 1 },
  blockBody: { padding: 24, paddingTop: 80, backgroundColor: '#fff5f5', flexGrow: 1 },
  blockTitle: { fontSize: 18, fontWeight: '700', color: '#a00', marginBottom: 12 },
  blockText: { fontSize: 13, lineHeight: 20, color: '#333' },
});
