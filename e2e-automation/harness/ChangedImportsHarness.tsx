

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../../src/context';
import { NavigationProvider } from '../../src/navigation';
import { AlertDialogProvider } from '../../src/context/AlertDialogContext';

import { LoginScreen } from '../../src/screens/LoginScreen';
import { VerificationCodeScreen } from '../../src/screens/VerificationCodeScreen';
import { ShowPockAdScreen } from '../../src/screens/ShowPockAdScreen';
import { ShowNapAdScreen } from '../../src/screens/ShowNapAdScreen';

import { logRewardedAdCompleted } from '../../src/services/appsflyer';
import { signInWithGoogle, getGoogleIdToken } from '../../src/services/googleAuth';
import { signInWithApple } from '../../src/services/appleAuth';
import { showNativeScreen } from '../../src/services/pangle';

type ScreenKey = 'login' | 'verification' | 'pock-ad' | 'nap-ad';

const dataProps = (d: Record<string, string>) => ({ dataSet: d }) as object;

const SCREENS: Array<{ key: ScreenKey; label: string; Comp: React.ComponentType<any> }> = [
  { key: 'login', label: 'LoginScreen', Comp: LoginScreen },
  { key: 'verification', label: 'VerificationCodeScreen', Comp: VerificationCodeScreen },
  { key: 'pock-ad', label: 'ShowPockAdScreen', Comp: ShowPockAdScreen },
  { key: 'nap-ad', label: 'ShowNapAdScreen', Comp: ShowNapAdScreen },
];

const BINDINGS: Array<{ name: string; fn: unknown; from: string }> = [
  { name: 'signInWithGoogle', fn: signInWithGoogle, from: 'services/googleAuth' },
  { name: 'getGoogleIdToken', fn: getGoogleIdToken, from: 'services/googleAuth' },
  { name: 'signInWithApple', fn: signInWithApple, from: 'services/appleAuth' },
  { name: 'showNativeScreen', fn: showNativeScreen, from: 'services/pangle' },
  { name: 'logRewardedAdCompleted', fn: logRewardedAdCompleted, from: 'services/appsflyer' },
];

export default function ChangedImportsHarness() {
  const [active, setActive] = useState<ScreenKey | null>(null);

  const [appleCode, setAppleCode] = useState('미실행');

  const Active = active ? SCREENS.find((s) => s.key === active)?.Comp : null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationProvider>
          <AlertDialogProvider>
            <View style={styles.root} testID="changed-imports-harness">
              {}
              <ScrollView style={styles.bindings} contentContainerStyle={styles.bindingsContent}>
                <Text style={styles.h}>직접 경로 바인딩</Text>
                {BINDINGS.map((b) => (
                  <View
                    key={b.name}
                    testID={`binding-${b.name}`}

                    {...dataProps({ type: typeof b.fn, from: b.from })}
                    style={styles.row}
                  >
                    <Text style={styles.rowName}>{b.name}</Text>
                    <Text style={typeof b.fn === 'function' ? styles.ok : styles.bad}>
                      {typeof b.fn}
                    </Text>
                  </View>
                ))}

                <Text style={styles.h}>화면 마운트</Text>
                {SCREENS.map((s) => (
                  <Pressable
                    key={s.key}
                    testID={`mount-${s.key}`}
                    onPress={() => setActive(s.key)}
                    style={styles.btn}
                  >
                    <Text style={styles.btnText}>{s.label}</Text>
                  </Pressable>
                ))}
                <Pressable testID="mount-none" onPress={() => setActive(null)} style={styles.btn}>
                  <Text style={styles.btnText}>내리기</Text>
                </Pressable>

                {}
                <Text style={styles.h}>모듈 직접 실행</Text>
                <Pressable
                  testID="invoke-logRewardedAdCompleted"
                  onPress={() => logRewardedAdCompleted('point_click')}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>logRewardedAdCompleted('point_click')</Text>
                </Pressable>
                {
}
                <Pressable
                  testID="invoke-signInWithApple"
                  onPress={() => {
                    setAppleCode('실행중');
                    signInWithApple()
                      .then((r) => setAppleCode(r?.code ?? '코드없음'))
                      .catch((e) => setAppleCode(`throw:${(e as Error).message}`));
                  }}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>signInWithApple()</Text>
                </Pressable>
                <View testID="apple-result" {...dataProps({ code: appleCode })}>
                  <Text style={styles.btnText}>{`결과: ${appleCode}`}</Text>
                </View>
              </ScrollView>

              {

}
              <View
                style={styles.stage}
                testID="harness-stage"
                {...dataProps({ active: active ?? 'none', resolved: typeof Active })}
              >
                {Active ? <Active /> : <Text style={styles.hint}>화면을 고르세요</Text>}
              </View>
            </View>
          </AlertDialogProvider>
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: '#f2f2f7' },
  bindings: { width: 320, borderRightWidth: 1, borderRightColor: '#c8c8cc' },
  bindingsContent: { padding: 12 },
  h: { fontSize: 13, fontWeight: '700', marginTop: 12, marginBottom: 6, color: '#111' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowName: { fontSize: 11, color: '#333' },
  ok: { fontSize: 11, color: '#0a7' },
  bad: { fontSize: 11, color: '#e00', fontWeight: '700' },
  btn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#c8c8cc', padding: 8, marginBottom: 6 },
  btnText: { fontSize: 11, color: '#111' },
  stage: { flex: 1, maxWidth: 430 },
  hint: { padding: 20, color: '#666', fontSize: 12 },
});
