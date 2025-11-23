import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_122070 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608, v_814266 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';

const v_18b8bf = Array.from({ length: 7 }, (v_37eab7, v_a56041) => ({
  rank: 1,
  email: 'user1@user.com',
  date: '2025.05.05',
}));

export const v_5b4c5a = () => {
  const { navigate: v_9b57fc } = v_a0daa8();

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="1 Depth" />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          {v_18b8bf.map((v_3ac7e7, v_a56041) => (
            <ReferralMemberRow
              key={`${v_3ac7e7.email}-${v_a56041}`}
              rank={v_3ac7e7.rank}
              email={v_3ac7e7.email}
              date={v_3ac7e7.date}
              highlight={v_a56041 === 0}
              onPress={() => v_9b57fc(v_ce4741.referralDepthTwo)}
            />
          ))}
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
});


