import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_073f91 } from '../components';
import { v_1bfbd0, v_731ab4, v_704d15, v_a61db3 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';

export const v_4a40b2 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const [v_7b4f11, v_7f8510] = v_5ab095(false);

  return (
    <View style={v_d81136.container}>
      <Header title="Setting" onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.inner}>
          {v_731ab4 && (
            <TouchableOpacity
              style={v_d81136.card}
              activeOpacity={0.85}
              onPress={() => v_7f8510(true)}
            >
              <Text style={v_d81136.cardText}>🌐 언어 선택 (개발 모드)</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={v_d81136.card}
            activeOpacity={0.85}
            onPress={() => v_9b57fc(v_ce4741.myInfoCloseMembership)}
          >
            <Text style={v_d81136.cardText}>Close Membership</Text>
          </TouchableOpacity>
        </View>
      </SafeScrollView>
      {v_731ab4 && (
        <LanguageSelector
          visible={v_7b4f11}
          onClose={() => v_7f8510(false)}
        />
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
  },
  inner: {
    ...v_704d15.small,
  },
  card: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#3629b7',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
});


