import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeView } from '../components';
import { Header, TaboolaBanner } from '../components';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppNavigation, ROUTES } from '../navigation';
import { COMMON_STYLES, FONTS, COLORS, SIZES } from '../constants';
import { getAyetPointsBalance } from '../services';
import { shareReferralLink } from '../utils';
import { requestAutoShowTapjoy } from '../services/tapjoy';
import { useTranslation } from 'react-i18next';

const xplaySymbol = require('../../assets/xplay_symbol.png');
const blurYellow = require('../../assets/images/blur_yellow.png');
const zone1Image = require('../../assets/images/zone1.png');
const zone2Image = require('../../assets/images/zone2.png');
const questImage = require('../../assets/images/quest.png');

export const XplayInfoScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { t } = useTranslation();
  const [pointsBalance, setPointsBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const loadUserAndBalance = useCallback(async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData.email) {
          setUserEmail(userData.email);
        }
        if (userData.member) {
          const member = userData.member;
          setMemberId(String(member));
          setBalanceLoading(true);
          try {
            const result = await getAyetPointsBalance(member, undefined);
            setPointsBalance(result.total_ayet_points ?? 0);
          } catch {
            setPointsBalance(0);
          } finally {
            setBalanceLoading(false);
          }
        } else {
          setPointsBalance(null);
        }
      } else {
        setPointsBalance(null);
      }
    } catch {
      setPointsBalance(null);
    }
  }, []);

  useEffect(() => {
    loadUserAndBalance();
  }, [loadUserAndBalance]);

  const displayBalance = pointsBalance !== null ? pointsBalance : 0;
  const balanceText = balanceLoading ? '' : displayBalance.toLocaleString();

  const handleQuestShare = useCallback(async () => {
    if (!userEmail) {
      await showAlert(t('screens.xplayInfo.alerts.notification'), t('screens.xplayInfo.alerts.userInfoUnavailable'));
      return;
    }
    await shareReferralLink(t, { email: userEmail }, showAlert, navigate);
  }, [userEmail, showAlert, t, navigate]);

  return (
    <SafeView style={styles.container}>
      <Header title="Xplay" onBackPress={goBack} showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.balanceCardWrapper}>
          <LinearGradient
            colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <Image source={blurYellow} style={styles.balanceBlurRight} resizeMode="cover" />
            <View style={styles.balanceContent}>
              <View style={styles.balanceLeft}>
                <Text style={styles.balanceLabel}>{t('screens.xplayInfo.totalPaidAmount')}</Text>
                <View style={styles.balanceAmountRow}>
                  <View style={styles.balanceXplayIconContainer}>
                    <Image source={xplaySymbol} style={styles.balanceXplayIcon} resizeMode="contain" />
                  </View>
                  {balanceLoading ? (
                    <ActivityIndicator size="small" color="#343a5a" style={styles.balanceLoader} />
                  ) : (
                    <Text style={styles.balanceAmount} numberOfLines={1}>
                      {balanceText}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.xplayTag}>
                <Text style={styles.xplayTagText}>Xplay</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {}
        <View style={styles.zonesRow}>
          <TouchableOpacity
            style={styles.zoneCard}
            activeOpacity={0.85}
            onPress={() => navigate(ROUTES.ayetOffersXplay)}
          >
            <Image source={zone1Image} style={styles.zoneImage} resizeMode="contain" />
            <Text style={styles.zoneCardTitle}>Xplay Zone 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneCard}
            activeOpacity={0.85}
            onPress={() => {
              requestAutoShowTapjoy();
              navigate(ROUTES.tapjoyList);
            }}
          >
            <Image source={zone2Image} style={styles.zoneImage} resizeMode="contain" />
            <Text style={styles.zoneCardTitle}>Xplay Zone 2</Text>
          </TouchableOpacity>
        </View>

        {}
        <Text style={styles.questSectionTitle}>{t('screens.xplayInfo.quest')}</Text>
        <TouchableOpacity
          style={styles.questCard}
          activeOpacity={0.9}
          onPress={handleQuestShare}
        >
          <Image source={questImage} style={styles.questImage} resizeMode="cover" />
          <View style={styles.questOverlay}>
            <Text style={styles.questCta}>{t('screens.xplayInfo.inviteCta')}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {}
      <View style={styles.taboolaContainer}>
        <TaboolaBanner placementType="shop" />
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.small,
    paddingBottom: SIZES.large,
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
    paddingHorizontal: SIZES.large,
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
    fontWeight: '600',
    color: '#343a5a',
    letterSpacing: -0.75,
    minWidth: 60,
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
    marginBottom: SIZES.xlarge,
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
  zoneCardDisabled: {
    backgroundColor: 'rgba(128, 128, 128, 0.18)',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.35)',
  },
  zoneImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  zoneCardTitle: {
    fontSize: FONTS.size.ssmall,
    fontFamily: FONTS.family.semibold,
    color: COLORS.text,
  },
  questSectionTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: FONTS.family.bold,
    color: COLORS.text,
    marginBottom: SIZES.small,
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
    fontSize: FONTS.size.large,
    fontFamily: FONTS.family.bold,
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
