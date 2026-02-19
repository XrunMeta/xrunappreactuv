import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_cf9c33,
  v_4623af,
  v_39a996,
  v_122070,
} from 'rcmrninabrnb';
import { v_5ade23 } from 'xbfwaaanosqvazmrqoah';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_556baf } from '../components';
import { v_729608, v_4c7b5d } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_a61db3, v_843035, v_1bfbd0, v_9b1a04 } from '../constants';
import { v_fb2e96 } from '../services';

const v_10664a = require('../../assets/xplay_symbol.png');
const v_10a702 = require('../../assets/images/blur_yellow.png');

const v_288e0b = require('../../assets/images/zone1.png');
const v_3ce185 = require('../../assets/images/zone2.png');
const v_3d184e = require('../../assets/images/quest.png');

export const v_f7bdb9 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const [v_19c59c, v_97ae62] = v_5ab095<number | null>(null);
  const [v_747a87, v_3e37d1] = v_5ab095(false);
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);

  const v_fff133 = v_de06a3(async () => {
    try {
      const v_f24fd5 = await v_e84827.getItem('userData');
      if (v_f24fd5) {
        const v_ef7306 = JSON.parse(v_f24fd5);
        if (v_ef7306.member) {
          const v_c7b8cc = String(v_ef7306.member);
          v_9d6aeb(v_c7b8cc);
          v_3e37d1(true);
          try {
            const v_43c42e = await v_fb2e96(v_c7b8cc, v_9b57fc);
            v_97ae62(v_43c42e.current_p_balance ?? 0);
          } catch {
            v_97ae62(0);
          } finally {
            v_3e37d1(false);
          }
        }
      }
    } catch {
      v_97ae62(0);
    }
  }, []);

  v_c4deb2(() => {
    v_fff133();
  }, [v_fff133]);

  const v_ac1f2a = v_19c59c !== null ? v_19c59c : 300200000;

  return (
    <SafeView style={v_d81136.container}>
      <Header title="Xplay" onBackPress={v_c7ac57} showBackButton />

      <ScrollView
        style={v_d81136.scrollView}
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={v_d81136.balanceCardWrapper}>
          <LinearGradient
            colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={v_d81136.balanceCard}
          >
            <Image source={v_10a702} style={v_d81136.balanceBlurRight} resizeMode="cover" />
            <View style={v_d81136.balanceContent}>
              <View style={v_d81136.balanceLeft}>
                <Text style={v_d81136.balanceLabel}>내 잔액</Text>
                <View style={v_d81136.balanceAmountRow}>
                  <View style={v_d81136.balanceXplayIconContainer}>
                    <Image source={v_10664a} style={v_d81136.balanceXplayIcon} resizeMode="contain" />
                  </View>
                  {v_747a87 ? (
                    <ActivityIndicator size="small" color={v_1bfbd0.text} style={v_d81136.balanceLoader} />
                  ) : (
                    <Text style={v_d81136.balanceAmount}>{v_ac1f2a.toLocaleString()}</Text>
                  )}
                </View>
              </View>
              <View style={v_d81136.xplayTag}>
                <Text style={v_d81136.xplayTagText}>Xplay</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {}
        <View style={v_d81136.zonesRow}>
          <TouchableOpacity
            style={v_d81136.zoneCard}
            activeOpacity={0.85}
            onPress={() => v_9b57fc(v_ce4741.ayetOffersXplay)}
          >
            <Image source={v_288e0b} style={v_d81136.zoneImage} resizeMode="contain" />
            <Text style={v_d81136.zoneCardTitle}>Xplay Zone 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={v_d81136.zoneCard}
            activeOpacity={0.85}
            onPress={() => v_9b57fc(v_ce4741.tapjoyList)}
          >
            <Image source={v_3ce185} style={v_d81136.zoneImage} resizeMode="contain" />
            <Text style={v_d81136.zoneCardTitle}>Xplay Zone 2</Text>
          </TouchableOpacity>
        </View>

        {}
        <Text style={v_d81136.questSectionTitle}>퀘스트</Text>
        <TouchableOpacity
          style={v_d81136.questCard}
          activeOpacity={0.9}
          onPress={() => v_9b57fc(v_ce4741.referralMyGroup)}
        >
          <Image source={v_3d184e} style={v_d81136.questImage} resizeMode="cover" />
          <View style={v_d81136.questOverlay}>
            <Text style={v_d81136.questCta}>친구를 초대하고 5 XRUN 씩 받자!</Text>
          </View>
        </TouchableOpacity>

        <View style={v_d81136.bottomSpacer} />
      </ScrollView>

      {}
      <View style={v_d81136.taboolaContainer}>
        <TaboolaBanner placementType="shop" />
      </View>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: v_9b1a04.medium,
    paddingTop: v_9b1a04.small,
    paddingBottom: v_9b1a04.large,
  },
  balanceCardWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  balanceCard: {
    height: 100,
    borderRadius: 16,
    borderWidth: 1.108,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  balanceBlurRight: {
    position: 'absolute',
    right: -10,
    top: -20,
    width: 170,
    height: 170,
    borderRadius: 37170400,
    opacity: 1,
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: v_9b1a04.large,
    height: '100%',
  },
  balanceLeft: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#6a7282',
    marginBottom: 4,
  },
  balanceAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceXplayIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 17,
    borderWidth: 1.108,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceXplayIcon: {
    width: 28,
    height: 28,
  },
  balanceLoader: {
    marginLeft: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontFamily: 'Roboto-SemiBold',
    color: '#343a5a',
    letterSpacing: -0.75,
  },
  xplayTag: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  xplayTagText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#343a5a',
  },
  zonesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: v_9b1a04.xlarge,
  },
  zoneCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  zoneImage: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  zoneCardTitle: {
    fontSize: v_843035.size.ssmall,
    fontFamily: v_843035.family.semibold,
    color: v_1bfbd0.text,
  },
  questSectionTitle: {
    fontSize: v_843035.size.medium,
    fontFamily: v_843035.family.bold,
    color: v_1bfbd0.text,
    marginBottom: v_9b1a04.small,
  },
  questCard: {
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 140,
    position: 'relative',
  },
  questImage: {
    width: '100%',
    minHeight: 140,
    borderRadius: 16,
  },
  questOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  questCta: {
    fontSize: v_843035.size.large,
    fontFamily: v_843035.family.bold,
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 16,
  },
  taboolaContainer: {
    minHeight: 80,
    backgroundColor: '#F5F5F5',
  },
});
