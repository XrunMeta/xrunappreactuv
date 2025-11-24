import v_a3453e, { v_df9f57, v_e662ae } from 'bapkr';
import { v_3094a2, v_472849, v_4623af, v_5f4661 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_729608, v_814266, v_f16775, v_b34ce5, v_60b263, v_029581 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_5b0045, v_ae32ae } from '../types/pagination';

interface MemberData {
  rank: number;
  email: string;
  date: string;
  highlight?: boolean;
}

const v_0692e4 = (v_2365e9, v_f70bce): MemberData[] => {
  const v_6e5804 = (v_2365e9 - 1) * v_f70bce;
  const v_1eb7a6 = 610; 
  const v_4622b9 = [];

  for (let v_ebec57 = 0; v_ebec57 < v_f70bce && v_6e5804 + v_ebec57 < v_1eb7a6; v_ebec57++) {
    v_4622b9.push({
      rank: v_6e5804 + v_ebec57 + 1,
      email: `user${v_6e5804 + v_ebec57 + 1}@user.com`,
      date: '2025.05.05' + v_ebec57 + ' 14:00',
      highlight: v_6e5804 + v_ebec57 === 0, 
    });
  }

  return v_4622b9;
};

const v_e5b428 = async (
  params: v_5b0045
): Promise<v_ae32ae<MemberData>> => {

  return new Promise((v_6f7712) => {

    setTimeout(() => {
      const v_9390e8 = v_0692e4(v_24baff.page, v_24baff.pageSize);
      const v_c83285 = 610;
      const v_6bbe19 = v_24baff.page * v_24baff.pageSize < v_c83285;

      v_6f7712({
        data: v_9390e8,
        total: v_c83285,
        hasMore: v_6bbe19,
      });
    }, 500); 
  });
};

export const v_58584a = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const v_e5fc4b = v_e662ae<v_029581>(null);

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
    } else if (v_3b402b === 'group') {

      v_e5fc4b.current?.reloadData();
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
      <View style={v_d81136.content}>
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
        </View>

        <View style={v_d81136.listContainer}>
          <DataList<MemberData>
            ref={v_e5fc4b}
            fetchData={v_e5b428}
            ItemComponent={v_814266}
            pageSize={20}
            keyExtractor={(v_8c0b26, v_a56041) => `member-${v_8c0b26.rank}-${v_8c0b26.email}-${v_a56041}`}
            onItemPress={() => v_9b57fc(v_ce4741.referralDepthOne)}
            contentContainerStyle={v_d81136.listContent}
          />
        </View>
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  content: {
    flex: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
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
    marginBottom: 0,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 32,
  },
});

