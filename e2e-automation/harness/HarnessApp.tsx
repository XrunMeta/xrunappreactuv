

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { WalletHeaderCard } from '../../src/components/WalletHeaderCard';
import { fmtBalance } from '../../src/utils/formatAmount';
import { SIZES } from '../../src/constants/index';

export const BALANCE_CASES: Array<{ id: string; raw: string; symbol: string; note: string }> = [
  { id: 'small', raw: '1.947489020886791807', symbol: 'XRUN', note: '1 이상 — 정상 구간' },
  { id: 'sub-one', raw: '0.08562265141102381', symbol: 'POL', note: '1 미만' },
  { id: 'thousand', raw: '1000', symbol: 'XRUN', note: '콤마 첫 등장' },
  { id: 'hundred-k', raw: '162858.00000000', symbol: 'XRUN', note: 'T-528 실측 값' },
  { id: 'million', raw: '1000000', symbol: 'XRUN', note: '보고된 문제 구간 시작' },
  { id: 'member-2624', raw: '10000000.0', symbol: 'XRUN', note: '실사용자 2624 currency 1' },
  { id: 'hundred-million', raw: '123456789.12', symbol: 'XRUN', note: '1억대 + 소수' },
  { id: 'billion', raw: '1234567890.12', symbol: 'XRUN', note: '10억대 + 소수' },
];

export const VIEWPORT_CASES = [320, 375, 390, 430];

export default function HarnessApp() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.rootContent}>
      {VIEWPORT_CASES.map((width) => (
        <View key={width} testID={`viewport-${width}`} style={[styles.viewport, { width }]}>
          <Text style={styles.viewportLabel}>{`화면폭 ${width}px`}</Text>
          <View style={styles.content}>
            {BALANCE_CASES.map((c) => (
              <View key={c.id} testID={`case-${width}-${c.id}`} style={styles.caseWrap}>
                <Text style={styles.caseLabel}>{`${c.id} — ${c.note}`}</Text>
                <WalletHeaderCard
                  title="내 잔액"
                  mainValue={`${fmtBalance(c.raw)} ${c.symbol}`}
                  subValue="KRW 1,234,567"
                  address="0x1234...abcdef"
                  onCopy={() => {}}
                  actions={[]}
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f2f2f7' },
  rootContent: { flexDirection: 'row', alignItems: 'flex-start' },
  viewport: { borderRightWidth: 1, borderRightColor: '#c8c8cc' },
  viewportLabel: { fontSize: 12, padding: 4, color: '#333' },

  content: { paddingHorizontal: SIZES.xlarge, paddingVertical: SIZES.xlarge },
  caseWrap: { marginBottom: 16 },
  caseLabel: { fontSize: 10, color: '#666', marginBottom: 2 },
});
