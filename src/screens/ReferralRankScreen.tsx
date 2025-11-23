import v_a3453e, { v_df9f57 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_19b633 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608, v_814266, v_f16775, v_b34ce5 } from '../components';
import { v_ce4741, v_a0daa8 } from '../navigation';

const v_f76b8a = [
  { rank: 1, email: '****12@user.com', highlight: true },
  { rank: 2, email: '****1@user.com' },
  { rank: 3, email: 'u**1@user.com' },
  { rank: 4, email: 'us****@user.com' },
  { rank: 6, email: 'u**1@user.com' },
  { rank: 7, email: 'us****@user.com' },
];

export const v_f57686 = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const v_1c4d31 = v_df9f57(
    () => [
      { label: 'My Group', value: 'group' },
      { label: '정산목록', value: 'settlement' },
      { label: 'Rank', value: 'rank' },
    ] as const,
    [],
  );

  const v_c411e0 = (value: typeof v_1c4d31[number]['value']) => {
    if (v_3b402b === 'group') {
      v_9b57fc(v_ce4741.referralMyGroup);
    } else if (v_3b402b === 'settlement') {
      v_9b57fc(v_ce4741.referralSettlement);
    }
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Referral" />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          <ReferralStatsCard title="My Rank">
            <View style={v_d81136.rankCardContent}>
              <View style={v_d81136.rankLeft}>
                <Text style={v_d81136.rankEmail}>oth-test@example.invalid</Text>
                <Text style={v_d81136.rankHelper}>My Rank</Text>
              </View>
              <View style={v_d81136.rankDivider} />
              <Text style={v_d81136.rankValue}>512,000,000</Text>
            </View>
          </ReferralStatsCard>

          <SegmentedControl
            options={v_1c4d31}
            value="rank"
            onChange={v_c411e0}
            containerStyle={v_d81136.segmented}
          />

          <View style={v_d81136.list}>
            {v_f76b8a.map((v_8c0b26) => (
              <ReferralMemberRow
                key={`${v_8c0b26.rank}-${v_8c0b26.email}`}
                rank={v_8c0b26.rank}
                email={v_8c0b26.email}
                highlight={v_8c0b26.highlight}
                onPress={() => v_9b57fc(v_ce4741.referralDepthOne)}
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
  rankCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rankLeft: {
    flex: 1,
  },
  rankEmail: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
  },
  rankHelper: {
    marginTop: 4,
    fontSize: 14,
    color: '#d2edf4',
    fontFamily: 'Roboto-Regular',
  },
  rankDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 20,
  },
  rankValue: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
});


