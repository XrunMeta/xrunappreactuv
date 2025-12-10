import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_4623af } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_729608, v_814266 } from '../components';
import { v_a61db3, v_9b1a04, v_1bfbd0 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';

const v_18b8bf = Array.from({ length: 7 }, (v_37eab7, v_a56041) => ({
  rank: v_a56041 === 0 ? 2 : 1,
  email: 'user1@user.com',
  date: '2025.05.05',
  highlight: v_a56041 === 0,
}));

export const v_8c15c4 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { reset: v_487a25, goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { selectedReferralMember: v_f87030, setSelectedReferralMember: v_779227 } = v_700ef9();

  const v_98c1d0 = v_f87030?.depth || 2;

  const v_7f2e65 = () => {
    v_487a25(v_ce4741.referralMyGroup);
  };

  const v_6ca26b = () => {
    if (v_98c1d0 > 2) {

      v_779227({
        ...v_f87030,
        member: v_f87030?.member || '',
        email: v_f87030?.email || '',
        depth: v_98c1d0 - 1,
      });
      v_c7ac57();
    } else {

      v_c7ac57();
    }
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header
        title={`${v_8d41d7('screens.referralDepthTwo.title')} ${v_98c1d0}`}
        showBackButton={true}
        onBackPress={v_6ca26b}
        rightComponent={
          <TouchableOpacity
            style={v_d81136.closeButton}
            onPress={v_7f2e65}
            activeOpacity={0.7}
          >
            <Feather name="x" size={20} color={v_1bfbd0.headerText} />
          </TouchableOpacity>
        }
      />
      <SafeScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          {v_18b8bf.map((v_3ac7e7, v_a56041) => (
            <ReferralMemberRow
              key={`${v_3ac7e7.email}-${v_a56041}`}
              email={v_3ac7e7.email}
              date={v_3ac7e7.date}
              hideRank={true}
              hideHighlightBorder={true}
            />
          ))}
        </View>
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
  },
  wrapper: {
    paddingVertical: v_9b1a04.small,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: v_1bfbd0.headerIconBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

