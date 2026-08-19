

import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_122070, v_472849 } from 'rcmrninabrnb';
import { v_a50748 } from '../../src/components/WalletHeaderCard';
import { v_7353e1 } from '../../src/utils/formatAmount';
import { v_9b1a04 } from '../../src/constants/index';

export const v_5847a7 = [
  { id: 'small', raw: '1.947489020886791807', symbol: 'XRUN', note: '1 이상 — 정상 구간' },
  { id: 'sub-one', raw: '0.08562265141102381', symbol: 'POL', note: '1 미만' },
  { id: 'thousand', raw: '1000', symbol: 'XRUN', note: '콤마 첫 등장' },
  { id: 'hundred-k', raw: '162858.00000000', symbol: 'XRUN', note: 'T-528 실측 값' },
  { id: 'million', raw: '1000000', symbol: 'XRUN', note: '보고된 문제 구간 시작' },
  { id: 'member-2624', raw: '10000000.0', symbol: 'XRUN', note: '실사용자 2624 currency 1' },
  { id: 'hundred-million', raw: '123456789.12', symbol: 'XRUN', note: '1억대 + 소수' },
  { id: 'billion', raw: '1234567890.12', symbol: 'XRUN', note: '10억대 + 소수' },
];

export const v_a9e2b4 = [320, 375, 390, 430];

export default function v_0803f5() {
  return (
    <ScrollView style={v_d81136.root} contentContainerStyle={v_d81136.rootContent}>
      {v_a9e2b4.map((v_8e4fb6) => (
        <View key={v_8e4fb6} testID={`viewport-${v_8e4fb6}`} style={[v_d81136.viewport, { width: v_8e4fb6 }]}>
          <Text style={v_d81136.viewportLabel}>{`화면폭 ${v_8e4fb6}px`}</Text>
          <View style={v_d81136.content}>
            {v_5847a7.map((v_3f4e2e) => (
              <View key={v_3f4e2e.id} testID={`case-${v_8e4fb6}-${v_3f4e2e.id}`} style={v_d81136.caseWrap}>
                <Text style={v_d81136.caseLabel}>{`${v_3f4e2e.id} — ${v_3f4e2e.note}`}</Text>
                <WalletHeaderCard
                  title="내 잔액"
                  mainValue={`${v_7353e1(v_3f4e2e.raw)} ${v_3f4e2e.symbol}`}
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

const v_d81136 = v_472849.create({
  root: { flex: 1, backgroundColor: '#f2f2f7' },
  rootContent: { flexDirection: 'row', alignItems: 'flex-start' },
  viewport: { borderRightWidth: 1, borderRightColor: '#c8c8cc' },
  viewportLabel: { fontSize: 12, padding: 4, color: '#333' },

  content: { paddingHorizontal: v_9b1a04.xlarge, paddingVertical: v_9b1a04.xlarge },
  caseWrap: { marginBottom: 16 },
  caseLabel: { fontSize: 10, color: '#666', marginBottom: 2 },
});
