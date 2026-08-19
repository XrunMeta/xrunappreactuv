

import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_4623af,
  v_aa7413,
  v_122070,
  v_472849,
  v_acfdec,
} from 'rcmrninabrnb';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import * as v_fba5a0 from 'hfxxehldoiokdq';
import { v_92d279 } from '../utils/devDebugStore';
import type { v_121170, v_2b38ef, v_59b1e9 } from '../utils/devDebugStore';
import { v_5401ae } from '../testIDs';

const v_904bda = 'API';
const v_973d8b = '부팅';
const v_ec2b4b = '로그';
type TabType = typeof v_904bda | typeof v_973d8b | typeof v_ec2b4b;

export function v_6b4f38() {
  const v_033e14 = v_e0068c();
  const [, v_3b79d8] = v_5ab095(0);
  const [v_cf55be, v_72f90e] = v_5ab095(false);
  const [v_11083e, v_94ee83] = v_5ab095<TabType>(v_904bda);

  v_c4deb2(() => {
    const v_69c966 = v_92d279.subscribe(() => v_3b79d8((v_f4e98d) => v_f4e98d + 1));
    return v_69c966;
  }, []);

  if (typeof __DEV__ === 'undefined' || !__DEV__) return null;

  const v_747d00 = Math.max(v_033e14.bottom, 16);

  const v_b6e533 = v_92d279.getState();

  const v_ebfdcc = async () => {
    const v_a52412 = [];
    if (v_11083e === v_904bda) {
      v_a52412.push('=== API ===');
      v_b6e533.apiCalls.forEach((v_9e86fd) => {
        v_a52412.push(`${v_9e86fd.method} ${v_9e86fd.url}`);
        v_a52412.push(`  ${v_9e86fd.durationMs}ms${v_9e86fd.status != null ? ` · ${v_9e86fd.status}` : ''}`);
      });
    } else if (v_11083e === v_973d8b) {
      v_a52412.push('=== 부팅 ===');
      v_b6e533.bootSteps.forEach((v_9e86fd) => v_a52412.push(`${v_9e86fd.name}\t${v_9e86fd.durationMs}ms`));
    } else {
      v_a52412.push('=== 로그 ===');
      v_b6e533.logs.forEach((v_9e86fd) => v_a52412.push(`[${v_9e86fd.level}] ${v_9e86fd.args}`));
    }
    const v_9b6134 = v_a52412.length > 1 ? v_a52412.join('\n') : (v_a52412[0] || '');
    if (v_9b6134) await v_fba5a0.setStringAsync(v_9b6134);
  };

  const v_33e90f = () => (
    <ScrollView style={v_d81136.list} contentContainerStyle={v_d81136.listContent}>
      {v_b6e533.apiCalls.length === 0 && <Text style={v_d81136.empty}>API 호출 없음</Text>}
      {v_b6e533.apiCalls.map((e: v_121170) => (
        <View key={v_9e86fd.id} style={v_d81136.row}>
          <Text style={v_d81136.method}>{v_9e86fd.method}</Text>
          <Text style={v_d81136.url} numberOfLines={2}>{v_9e86fd.url}</Text>
          <Text style={v_d81136.meta}>{v_9e86fd.durationMs}ms {v_9e86fd.status != null ? `· ${v_9e86fd.status}` : ''}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const v_54f58e = () => (
    <ScrollView style={v_d81136.list} contentContainerStyle={v_d81136.listContent}>
      {v_b6e533.bootSteps.length === 0 && <Text style={v_d81136.empty}>부팅 기록 없음</Text>}
      {v_b6e533.bootSteps.map((e: v_2b38ef, v_ebec57) => (
        <View key={`${v_9e86fd.name}-${v_9e86fd.at}-${v_ebec57}`} style={v_d81136.row}>
          <Text style={v_d81136.bootName}>{v_9e86fd.name}</Text>
          <Text style={v_d81136.meta}>{v_9e86fd.durationMs}ms</Text>
        </View>
      ))}
    </ScrollView>
  );

  const v_671d07 = () => (
    <ScrollView style={v_d81136.list} contentContainerStyle={v_d81136.listContent}>
      {v_b6e533.logs.length === 0 && <Text style={v_d81136.empty}>로그 없음</Text>}
      {v_b6e533.logs.map((e: v_59b1e9) => (
        <View key={v_9e86fd.id} style={[v_d81136.row, v_9e86fd.level === 'error' && v_d81136.logError, v_9e86fd.level === 'warn' && v_d81136.logWarn]}>
          <Text style={v_d81136.logLevel}>[{v_9e86fd.level}]</Text>
          <Text style={v_d81136.logArgs} numberOfLines={3}>{v_9e86fd.args}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <>
      <TouchableOpacity
        style={v_d81136.fab}
        onPress={() => v_72f90e(true)}
        activeOpacity={0.8}
      >
        <Text style={v_d81136.fabText}>DEV</Text>
      </TouchableOpacity>

      <Modal transparent visible={v_cf55be} animationType="slide" onRequestClose={() => v_72f90e(false)}>
        <SafeAreaView style={v_d81136.modalRoot}>
          <View style={v_d81136.panel}>
            <View style={v_d81136.header}>
              <Text style={v_d81136.title}>디버그</Text>
              <TouchableOpacity onPress={() => v_72f90e(false)} style={v_d81136.closeBtn}>
                <Text style={v_d81136.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>
            <View style={v_d81136.tabs}>
              {([v_904bda, v_973d8b, v_ec2b4b] as const).map((v_8d41d7) => (
                <TouchableOpacity
                  key={v_8d41d7}
                  style={[v_d81136.tab, v_11083e === v_8d41d7 && v_d81136.tabActive]}
                  onPress={() => v_94ee83(v_8d41d7)}
                >
                  <Text style={[v_d81136.tabText, v_11083e === v_8d41d7 && v_d81136.tabTextActive]}>{v_8d41d7}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {v_11083e === v_904bda && v_33e90f()}
            {v_11083e === v_973d8b && v_54f58e()}
            {v_11083e === v_ec2b4b && v_671d07()}
            <View style={[v_d81136.footer, { paddingBottom: v_747d00 }]}>
              <TouchableOpacity testID={v_5401ae.devDebugPanel.copyCurrentTab} style={v_d81136.copyBtn} onPress={v_ebfdcc}>
                <Text style={v_d81136.copyText}>로그 복사하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={v_d81136.clearBtn} onPress={() => v_92d279.clear()}>
                <Text style={v_d81136.clearText}>전체 지우기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const v_d81136 = v_472849.create({
  fab: {
    position: 'absolute',
    right: 12,
    bottom: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  modalRoot: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
    minHeight: 280,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  closeBtn: { padding: 8 },
  closeText: { color: '#6eb5ff', fontSize: 16 },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#6eb5ff' },
  tabText: { color: '#888', fontSize: 14 },
  tabTextActive: { color: '#6eb5ff', fontWeight: '600' },
  list: { maxHeight: 320 },
  listContent: { padding: 12, paddingBottom: 24 },
  empty: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 24 },
  row: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  method: { color: '#9cdcfe', fontSize: 12, fontWeight: '600', marginBottom: 2 },
  url: { color: '#ce9178', fontSize: 11 },
  meta: { color: '#858585', fontSize: 11, marginTop: 2 },
  bootName: { color: '#d4d4d4', fontSize: 13 },
  logLevel: { color: '#858585', fontSize: 11, marginBottom: 2 },
  logArgs: { color: '#d4d4d4', fontSize: 12 },
  logError: { backgroundColor: 'rgba(180,60,60,0.2)' },
  logWarn: { backgroundColor: 'rgba(180,140,60,0.15)' },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  copyBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  copyText: { color: '#6eb5ff', fontSize: 14 },
  clearBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  clearText: { color: '#888', fontSize: 14 },
});
