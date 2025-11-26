import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_122070 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_814266 } from '../components';

const v_18b8bf = Array.from({ length: 7 }, (v_37eab7, v_a56041) => ({
  rank: v_a56041 === 0 ? 2 : 1,
  email: 'user1@user.com',
  date: '2025.05.05',
  highlight: v_a56041 === 0,
}));

export const v_8c15c4 = () => {
  const { t: v_8d41d7 } = v_772971();
  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.referralDepthTwo.title')} />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          {v_18b8bf.map((v_3ac7e7, v_a56041) => (
            <ReferralMemberRow
              key={`${v_3ac7e7.email}-${v_a56041}`}
              rank={v_3ac7e7.rank}
              email={v_3ac7e7.email}
              date={v_3ac7e7.date}
              highlight={v_3ac7e7.highlight}
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


