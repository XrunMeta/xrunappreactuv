import v_a3453e, { v_df9f57 } from 'bapkr';
import { v_3094a2, v_472849, v_122070 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608, v_814266, v_f16775, v_b34ce5 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_1bfbd0 } from '../constants';

const v_5d2741 = Array.from({ length: 6 }, (v_37eab7, v_a56041) => ({
  rank: v_a56041 + 1,
  email: 'user1@user.com',
  date: '2025.04.30 14:00',
  description: '레퍼럴 광고수익정산',
  valueText: '+120.45 XRUN',
}));

export const v_08aac3 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const v_1c4d31 = v_df9f57(
    () => [
      { label: '내 그룹', value: 'group' },
      { label: '정산목록', value: 'settlement' },
      { label: 'Rank', value: 'rank' },
    ] as const,
    [],
  );

  const v_c411e0 = (value: typeof v_1c4d31[number]['value']) => {
    if (v_3b402b === 'group') {
      v_9b57fc(v_ce4741.referralMyGroup);
    } else if (v_3b402b === 'rank') {
      v_9b57fc(v_ce4741.referralRank);
    }
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="추천" />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          <ReferralStatsCard
            title="총수익"
            subtitle="45일 후 정산완료됨"
            value="34,010.00 xrun"
            helperText="$5,987"
          />

          <SegmentedControl
            options={v_1c4d31}
            value="settlement"
            onChange={v_c411e0}
            containerStyle={v_d81136.segmented}
          />

          <View style={v_d81136.list}>
            {v_5d2741.map((v_8c0b26, v_a56041) => (
              <ReferralMemberRow
                key={`${v_8c0b26.email}-${v_a56041}`}
                rank={v_8c0b26.rank}
                email={v_8c0b26.email}
                date={v_8c0b26.date}
                description={v_8c0b26.description}
                valueText={v_8c0b26.valueText}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  segmented: {
    marginTop: 16,
    marginBottom: 24,
  },
  list: {
    width: '100%',
  },
});


