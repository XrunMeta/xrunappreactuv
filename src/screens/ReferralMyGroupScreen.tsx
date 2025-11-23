import v_a3453e, { v_df9f57 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_4623af, v_5f4661 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_729608, v_814266, v_f16775, v_b34ce5 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';

const v_8673d6 = Array.from({ length: 8 }, (v_37eab7, v_a56041) => ({
  rank: v_a56041 + 1,
  email: 'user1@user.com',
  date: '2025.05.05',
}));

export const v_58584a = () => {
  const { navigate: v_9b57fc } = v_a0daa8();

  const v_1c4d31 = v_df9f57(
    () => [
      { label: '내 그룹', value: 'group' },
      { label: '정산목록', value: 'settlement' },
      { label: '순위', value: 'rank' },
    ] as const,
    [],
  );

  const v_c411e0 = (value: typeof v_1c4d31[number]['value']) => {
    if (v_3b402b === 'settlement') {
      v_9b57fc(v_ce4741.referralSettlement);
    } else if (v_3b402b === 'rank') {
      v_9b57fc(v_ce4741.referralRank);
    }
  };

  const v_22cd2d = async () => {
    try {
      await v_5f4661.share({
        message: 'XRUN referral 링크를 공유해 보세요!',
      });
    } catch (v_5e9bfe) {
      console.warn(v_5e9bfe);
    }
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="추천" />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          <View style={v_d81136.topRow}>
            <ReferralStatsCard title="내 그룹 맴버" value="610 맴버" helperText=" " />
            <TouchableOpacity style={v_d81136.iconButton} onPress={v_22cd2d} activeOpacity={0.7}>
              <Feather name="share-2" size={18} color={v_1bfbd0.headerText} />
            </TouchableOpacity>
          </View>

          <SegmentedControl
            options={v_1c4d31}
            value="group"
            onChange={v_c411e0}
            containerStyle={v_d81136.segmented}
          />

          <View style={v_d81136.list}>
            {v_8673d6.map((v_8c0b26) => (
              <ReferralMemberRow
                key={`${v_8c0b26.rank}-${v_8c0b26.email}`}
                rank={v_8c0b26.rank}
                email={v_8c0b26.email}
                date={v_8c0b26.date}
                highlight={v_8c0b26.rank === 1}
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
  topRow: {
    position: 'relative',
    marginBottom: 24,
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmented: {
    marginTop: 16,
    marginBottom: 24,
  },
  list: {
    width: '100%',
  },
});


