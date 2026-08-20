

import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_122070, v_472849, v_09d0e5 } from 'rcmrninabrnb';
import { v_b2c639 } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_4b64f4 } from '../../src/context';
import { v_00e8f9 } from '../../src/navigation';
import { v_0c450d } from '../../src/context/AlertDialogContext';

import { v_f4f851 } from '../../src/screens/LoginScreen';
import { v_667a00 } from '../../src/screens/VerificationCodeScreen';
import { v_540580 } from '../../src/screens/ShowPockAdScreen';
import { v_287831 } from '../../src/screens/ShowNapAdScreen';

import { v_fda57c } from '../../src/services/appsflyer';
import { v_2683ec, v_73716f } from '../../src/services/googleAuth';
import { v_7af6c9 } from '../../src/services/appleAuth';
import { v_a763e6 } from '../../src/services/pangle';

type ScreenKey = 'login' | 'verification' | 'pock-ad' | 'nap-ad';

const v_f9af6a = (v_d5dda0) => ({ dataSet: v_d5dda0 }) as object;

const SCREENS: Array<{ key: ScreenKey; label: string; Comp: v_a3453e.ComponentType<any> }> = [
  { key: 'login', label: 'LoginScreen', Comp: v_f4f851 },
  { key: 'verification', label: 'VerificationCodeScreen', Comp: v_667a00 },
  { key: 'pock-ad', label: 'ShowPockAdScreen', Comp: v_540580 },
  { key: 'nap-ad', label: 'ShowNapAdScreen', Comp: v_287831 },
];

const v_923806 = [
  { name: 'signInWithGoogle', fn: v_2683ec, from: 'services/googleAuth' },
  { name: 'getGoogleIdToken', fn: v_73716f, from: 'services/googleAuth' },
  { name: 'signInWithApple', fn: v_7af6c9, from: 'services/appleAuth' },
  { name: 'showNativeScreen', fn: v_a763e6, from: 'services/pangle' },
  { name: 'logRewardedAdCompleted', fn: v_fda57c, from: 'services/appsflyer' },
];

export default function v_8f5973() {
  const [v_f8b770, v_64efbc] = v_5ab095<ScreenKey | null>(null);

  const [v_53c7ab, v_e8162b] = v_5ab095('미실행');

  const v_a024ef = v_f8b770 ? v_c50908.find((v_fd5f43) => v_fd5f43.key === v_f8b770)?.Comp : null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationProvider>
          <AlertDialogProvider>
            <View style={v_d81136.root} testID="changed-imports-harness">
              {}
              <ScrollView style={v_d81136.bindings} contentContainerStyle={v_d81136.bindingsContent}>
                <Text style={v_d81136.h}>직접 경로 바인딩</Text>
                {v_923806.map((v_148ff6) => (
                  <View
                    key={v_148ff6.name}
                    testID={`binding-${v_148ff6.name}`}

                    {...v_f9af6a({ type: typeof v_148ff6.fn, from: v_148ff6.from })}
                    style={v_d81136.row}
                  >
                    <Text style={v_d81136.rowName}>{v_148ff6.name}</Text>
                    <Text style={typeof v_148ff6.fn === 'function' ? v_d81136.ok : v_d81136.bad}>
                      {typeof v_148ff6.fn}
                    </Text>
                  </View>
                ))}

                <Text style={v_d81136.h}>화면 마운트</Text>
                {v_c50908.map((v_fd5f43) => (
                  <Pressable
                    key={v_fd5f43.key}
                    testID={`mount-${v_fd5f43.key}`}
                    onPress={() => v_64efbc(v_fd5f43.key)}
                    style={v_d81136.btn}
                  >
                    <Text style={v_d81136.btnText}>{v_fd5f43.label}</Text>
                  </Pressable>
                ))}
                <Pressable testID="mount-none" onPress={() => v_64efbc(null)} style={v_d81136.btn}>
                  <Text style={v_d81136.btnText}>내리기</Text>
                </Pressable>

                {}
                <Text style={v_d81136.h}>모듈 직접 실행</Text>
                <Pressable
                  testID="invoke-logRewardedAdCompleted"
                  onPress={() => v_fda57c('point_click')}
                  style={v_d81136.btn}
                >
                  <Text style={v_d81136.btnText}>logRewardedAdCompleted('point_click')</Text>
                </Pressable>
                {
}
                <Pressable
                  testID="invoke-signInWithApple"
                  onPress={() => {
                    v_e8162b('실행중');
                    v_7af6c9()
                      .then((v_cb35cb) => v_e8162b(v_cb35cb?.code ?? '코드없음'))
                      .catch((v_9e86fd) => v_e8162b(`throw:${(v_9e86fd as Error).message}`));
                  }}
                  style={v_d81136.btn}
                >
                  <Text style={v_d81136.btnText}>signInWithApple()</Text>
                </Pressable>
                <View testID="apple-result" {...v_f9af6a({ code: v_53c7ab })}>
                  <Text style={v_d81136.btnText}>{`결과: ${v_53c7ab}`}</Text>
                </View>
              </ScrollView>

              {

}
              <View
                style={v_d81136.stage}
                testID="harness-stage"
                {...v_f9af6a({ active: v_f8b770 ?? 'none', resolved: typeof v_a024ef })}
              >
                {v_a024ef ? <Active /> : <Text style={v_d81136.hint}>화면을 고르세요</Text>}
              </View>
            </View>
          </AlertDialogProvider>
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const v_d81136 = v_472849.create({
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
