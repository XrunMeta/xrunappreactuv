import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, SegmentedControl } from '../components';
import { COLORS } from '../constants';

type AdEntry = {
  id: string;
  status: string;
  date: string;
  rows: {
    label: string;
    amount: string;
    amountColor?: string;
  }[];
};

const PENDING_ENTRIES: AdEntry[] = [
  {
    id: 'pending-1',
    status: '심사중',
    date: '2025.05.30 14:00',
    rows: [
      { label: '예상광고수익', amount: '+20 XRUN', amountColor: '#707070' },
      { label: '광고수익정산', amount: '- XRUN', amountColor: '#343434' },
    ],
  },
  {
    id: 'pending-2',
    status: '심사중',
    date: '2025.05.30 13:58',
    rows: [
      { label: '예상광고수익', amount: '+10 XRUN', amountColor: '#707070' },
      { label: '광고수익정산', amount: '- XRUN', amountColor: '#343434' },
    ],
  },
  {
    id: 'pending-3',
    status: '심사중',
    date: '2025.05.30 13:40',
    rows: [
      { label: '예상광고수익', amount: '+10 XRUN', amountColor: '#707070' },
      { label: '광고수익정산', amount: '- XRUN', amountColor: '#343434' },
    ],
  },
];

const SETTLED_ENTRIES: AdEntry[] = [
  {
    id: 'settled-1',
    status: '정산완료',
    date: '2025.05.30 14:00',
    rows: [
      { label: '예상광고수익', amount: '+1500 XRUN', amountColor: '#111111' },
      { label: '광고수익정산', amount: '+1500 XRUN', amountColor: '#111111' },
    ],
  },
  {
    id: 'settled-2',
    status: '조건 불충족',
    date: '2025.04.20 16:00',
    rows: [
      { label: '예상광고수익', amount: '+10 XRUN', amountColor: '#707070' },
      { label: '광고수익정산', amount: '- XRUN', amountColor: '#343434' },
    ],
  },
  {
    id: 'settled-3',
    status: '정산완료',
    date: '2025.04.19 15:00',
    rows: [
      { label: '예상광고수익', amount: '+10 XRUN', amountColor: '#707070' },
      { label: '광고수익정산', amount: '- XRUN', amountColor: '#343434' },
    ],
  },
];

const TABS = [
  { label: '심사중', value: 'pending' },
  { label: '정산완료', value: 'settled' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

export const AdWalletScreen = () => {
  const [tab, setTab] = useState<TabValue>('pending');
  const entries = useMemo(() => (tab === 'pending' ? PENDING_ENTRIES : SETTLED_ENTRIES), [tab]);
  const summaryLabel = tab === 'pending' ? '예상금액' : '확정금액';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="AD" showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.cardAccentOne} />
          <View style={styles.cardAccentTwo} />
          <Text style={styles.summaryLabel}>{summaryLabel}</Text>
          <Text style={styles.summaryValue}>3,400.00 xrun</Text>
          <Text style={styles.summaryExtra}>$5,987</Text>
        </View>

        <SegmentedControl
          options={TABS}
          value={tab}
          onChange={setTab}
          containerStyle={styles.segmentedControl}
        />

        <View style={styles.listWrapper}>
          {entries.map((entry) => (
            <View key={entry.id} style={styles.adCard}>
              <View style={styles.adCardHeader}>
                <Text style={styles.adCardStatus}>{entry.status}</Text>
                <Text style={styles.adCardDate}>{entry.date}</Text>
              </View>
              {entry.rows.map((row, index) => (
                <View key={`${entry.id}-${index}`} style={styles.adCardRow}>
                  <Text style={styles.adCardRowLabel}>{row.label}</Text>
                  <Text style={[styles.adCardRowAmount, { color: row.amountColor ?? '#343434' }]}>
                    {row.amount}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  summaryCard: {
    height: 128,
    borderRadius: 20,
    backgroundColor: '#353A5B',
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  cardAccentOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -40,
    right: -80,
    borderRadius: 100,
  },
  cardAccentTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.15)',
    bottom: -60,
    left: -40,
    borderRadius: 70,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#E6E6E6',
    fontFamily: 'Roboto-SemiBold',
  },
  summaryValue: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  summaryExtra: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  segmentedControl: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 24,
  },
  listWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    gap: 12,
  },
  adCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#3629B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 30,
    elevation: 5,
  },
  adCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  adCardStatus: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  adCardDate: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  adCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  adCardRowLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#979797',
  },
  adCardRowAmount: {
    fontSize: 12,
    fontFamily: 'Roboto-SemiBold',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
});


