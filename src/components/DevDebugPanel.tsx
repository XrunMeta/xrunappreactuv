

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { devDebugStore } from '../utils/devDebugStore';
import type { ApiLogEntry, BootStepEntry, LogEntry } from '../utils/devDebugStore';

const TAB_API = 'API';
const TAB_BOOT = '부팅';
const TAB_LOG = '로그';
type TabType = typeof TAB_API | typeof TAB_BOOT | typeof TAB_LOG;

export function DevDebugPanel() {
  const insets = useSafeAreaInsets();
  const [, forceUpdate] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<TabType>(TAB_API);

  useEffect(() => {
    const unsub = devDebugStore.subscribe(() => forceUpdate((n) => n + 1));
    return unsub;
  }, []);

  if (typeof __DEV__ === 'undefined' || !__DEV__) return null;

  const footerPaddingBottom = Math.max(insets.bottom, 16);

  const state = devDebugStore.getState();

  const copyCurrentTab = async () => {
    const lines: string[] = [];
    if (tab === TAB_API) {
      lines.push('=== API ===');
      state.apiCalls.forEach((e) => {
        lines.push(`${e.method} ${e.url}`);
        lines.push(`  ${e.durationMs}ms${e.status != null ? ` · ${e.status}` : ''}`);
      });
    } else if (tab === TAB_BOOT) {
      lines.push('=== 부팅 ===');
      state.bootSteps.forEach((e) => lines.push(`${e.name}\t${e.durationMs}ms`));
    } else {
      lines.push('=== 로그 ===');
      state.logs.forEach((e) => lines.push(`[${e.level}] ${e.args}`));
    }
    const text = lines.length > 1 ? lines.join('\n') : (lines[0] || '');
    if (text) await Clipboard.setStringAsync(text);
  };

  const renderApi = () => (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {state.apiCalls.length === 0 && <Text style={styles.empty}>API 호출 없음</Text>}
      {state.apiCalls.map((e: ApiLogEntry) => (
        <View key={e.id} style={styles.row}>
          <Text style={styles.method}>{e.method}</Text>
          <Text style={styles.url} numberOfLines={2}>{e.url}</Text>
          <Text style={styles.meta}>{e.durationMs}ms {e.status != null ? `· ${e.status}` : ''}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderBoot = () => (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {state.bootSteps.length === 0 && <Text style={styles.empty}>부팅 기록 없음</Text>}
      {state.bootSteps.map((e: BootStepEntry, i: number) => (
        <View key={`${e.name}-${e.at}-${i}`} style={styles.row}>
          <Text style={styles.bootName}>{e.name}</Text>
          <Text style={styles.meta}>{e.durationMs}ms</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderLog = () => (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {state.logs.length === 0 && <Text style={styles.empty}>로그 없음</Text>}
      {state.logs.map((e: LogEntry) => (
        <View key={e.id} style={[styles.row, e.level === 'error' && styles.logError, e.level === 'warn' && styles.logWarn]}>
          <Text style={styles.logLevel}>[{e.level}]</Text>
          <Text style={styles.logArgs} numberOfLines={3}>{e.args}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>DEV</Text>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <SafeAreaView style={styles.modalRoot}>
          <View style={styles.panel}>
            <View style={styles.header}>
              <Text style={styles.title}>디버그</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabs}>
              {([TAB_API, TAB_BOOT, TAB_LOG] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tab, tab === t && styles.tabActive]}
                  onPress={() => setTab(t)}
                >
                  <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {tab === TAB_API && renderApi()}
            {tab === TAB_BOOT && renderBoot()}
            {tab === TAB_LOG && renderLog()}
            <View style={[styles.footer, { paddingBottom: footerPaddingBottom }]}>
              <TouchableOpacity style={styles.copyBtn} onPress={copyCurrentTab}>
                <Text style={styles.copyText}>로그 복사하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearBtn} onPress={() => devDebugStore.clear()}>
                <Text style={styles.clearText}>전체 지우기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
