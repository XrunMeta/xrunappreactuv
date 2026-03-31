import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af, v_cf9c33 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_a61db3, v_843035, v_1bfbd0 } from '../constants';
import { v_592061 } from '../services/tapjoy';

let v_10664a = null;
try {
  v_10664a = require('../../assets/xplay_symbol.png');
} catch (v_9e86fd) {
  console.warn('xplay_symbol.png not found');
}

export const v_26fe4c = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { setSelectedShopItem: v_d0fbad } = v_700ef9();

  const v_41672c = () => {
    v_d0fbad({ shopTab: 'xplayShop' } as any);
    v_9b57fc(v_ce4741.shop);
  };

  const v_7c70b9 = () => {
    v_592061();
    v_9b57fc(v_ce4741.tapjoyList);
  };

  return (
    <View style={v_d81136.container}>
      <Header title="Xplay" onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {v_10664a && (
          <View style={v_d81136.logoContainer}>
            <Image source={v_10664a} style={v_d81136.logo} resizeMode="contain" />
          </View>
        )}
        <Text style={v_d81136.title}>Xplay Zone</Text>
        <Text style={v_d81136.subtitle}>진입할 Zone을 선택하세요</Text>

        <TouchableOpacity
          style={v_d81136.zoneCard}
          activeOpacity={0.8}
          onPress={v_41672c}
        >
          <Text style={v_d81136.zoneTitle}>Xplay Zone 1</Text>
          <Text style={v_d81136.zoneDescription}>Xplay Shop · 리워드 상품</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={v_d81136.zoneCard}
          activeOpacity={0.8}
          onPress={v_7c70b9}
        >
          <Text style={v_d81136.zoneTitle}>Xplay Zone 2</Text>
          <Text style={v_d81136.zoneDescription}>탭조이 오퍼월 · 리워드 적립</Text>
        </TouchableOpacity>
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    flexGrow: 1,
    ...v_a61db3.scrollContent,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logo: {
    width: 72,
    height: 72,
  },
  title: {
    fontSize: v_843035.size.xlarge,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: v_1bfbd0.headerText,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  zoneCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  zoneTitle: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: v_1bfbd0.headerText,
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#64748B',
  },
});
