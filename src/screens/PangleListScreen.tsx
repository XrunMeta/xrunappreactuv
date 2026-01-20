import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { loadAndShowRewardedAd, getPangleRewardedAdUnitId, isPangleReady, isPangleReadySync, initializePangle } from '../services/pangle';
import { collectDeviceInfo } from '../utils/napApiUtils';
import { getEnvValue } from '../utils/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../utils';

interface PangleAd {
  campid: string | number;
  name: string;
  coins: number | string;
  xrunPrice: number;
  thumbnail?: string;
  iconurl?: string;
  joindesc?: string;
  ad_company: string;
  adUnitId?: string; 
}

export const PangleListScreen = () => {
  const { goBack } = useAppNavigation();
  const { t } = useTranslation();
  const [pangleAds, setPangleAds] = useState<PangleAd[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPangleAds = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[PangleListScreen] 팽글 광고 로드 시작');

      const pangleAppId = Platform.OS === 'ios' ? getEnvValue('PANGLE_APPID_IOS') : (getEnvValue('PANGLE_APP_ID') || '8747763');
      const pangleAdUnitId = getPangleRewardedAdUnitId();
      const defaultReward = 0.07422680412371134; 
      const defaultThumbnail = 'https://www.xrun.run/assets/images/logo_visual_black.png';

      const virtualPangleAds: PangleAd[] = Array.from({ length: 3 }, (_, index) => ({
        campid: `pangle_${pangleAppId}_${index + 1}`,
        name: `팽글 보상형 광고 ${index + 1}`,
        coins: '0.19',
        xrunPrice: defaultReward,
        thumbnail: defaultThumbnail,
        iconurl: defaultThumbnail,
        joindesc: '동영상 광고를 시청하시면 리워드가 지급됩니다.',
        ad_company: 'pangle',

        adUnitId: pangleAdUnitId,
      }));

      console.log('[PangleListScreen] 동적 팽글 광고 생성 완료:', {
        생성된_개수: virtualPangleAds.length,
        pangleAppId,
        adUnitId: virtualPangleAds[0].adUnitId,
      });

      setPangleAds(virtualPangleAds);
    } catch (error) {
      console.error('[PangleListScreen] 팽글 광고 로드 실패:', error);
      showToast('팽글 광고를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPangleAds();
  }, [loadPangleAds]);

  const handleAdClick = useCallback(async (ad: PangleAd) => {
    try {
      console.log('[PangleListScreen] 팽글 광고 클릭:', ad);

      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        showToast('로그인이 필요합니다.');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member?.toString() || '';

      if (!member) {
        showToast('로그인이 필요합니다.');
        return;
      }

      let pangleReady = await isPangleReady();

      if (!pangleReady) {
        console.log('[PangleListScreen] Pangle 초기화 시도');
        try {
          await initializePangle();

          pangleReady = await isPangleReady();
        } catch (initError) {
          console.error('[PangleListScreen] Pangle 초기화 실패:', initError);
        }
      }

      if (pangleReady) {
        console.log('[PangleListScreen] Pangle 보상형 광고 표시');
        try {

          const deviceInfo = await collectDeviceInfo();

          const adUnitId = ad.adUnitId || getPangleRewardedAdUnitId();
          console.log('[PangleListScreen] 사용할 광고 단위 ID:', adUnitId);

          await loadAndShowRewardedAd(
            adUnitId,
            member,
            deviceInfo,
            (reward) => {
              console.log('[PangleListScreen] 보상 수령:', reward);
              showToast(`보상 수령: ${reward.amount} ${reward.type}`);
            },
            () => {
              console.log('[PangleListScreen] 광고 닫힘');
            },
            (error) => {
              console.error('[PangleListScreen] 광고 로드 실패:', error);
              showToast('광고를 불러올 수 없습니다.');
            }
          );
        } catch (error) {
          console.error('[PangleListScreen] 광고 표시 오류:', error);
          showToast('광고를 표시할 수 없습니다.');
        }
      } else {
        console.warn('[PangleListScreen] Pangle이 준비되지 않았습니다.');
        showToast('광고를 준비하는 중입니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('[PangleListScreen] 광고 클릭 처리 오류:', error);
      showToast('오류가 발생했습니다.');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header title="팽글 광고" onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>팽글 광고를 불러오는 중...</Text>
          </View>
        ) : pangleAds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>표시할 팽글 광고가 없습니다.</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {pangleAds.map((ad, index) => (
              <TouchableOpacity
                key={`${ad.campid}-${index}`}
                style={styles.adCard}
                activeOpacity={0.7}
                onPress={() => handleAdClick(ad)}
              >
                {ad.thumbnail || ad.iconurl ? (
                  <Image
                    source={{ uri: ad.thumbnail || ad.iconurl }}
                    style={styles.adImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.adImagePlaceholder}>
                    <Text style={styles.adImagePlaceholderText}>이미지 없음</Text>
                  </View>
                )}
                <View style={styles.adContent}>
                  <Text style={styles.adName} numberOfLines={2}>
                    {ad.name || '팽글 광고'}
                  </Text>
                  <View style={styles.adReward}>
                    <Text style={styles.adRewardText}>
                      보상: {ad.xrunPrice?.toFixed(4) || ad.coins || '0'} XRUN
                    </Text>
                  </View>
                  {ad.joindesc && (
                    <Text style={styles.adDesc} numberOfLines={2}>
                      {ad.joindesc}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    ...COMMON_STYLES.scrollContent,
    paddingHorizontal: SIZES.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xlarge * 2,
  },
  loadingText: {
    marginTop: SIZES.medium,
    fontSize: FONTS.size.medium,
    fontFamily: FONTS.family.regular,
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xlarge * 2,
  },
  emptyText: {
    fontSize: FONTS.size.medium,
    fontFamily: FONTS.family.regular,
    color: COLORS.text,
  },
  listContainer: {
    paddingVertical: SIZES.medium,
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: SIZES.medium,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.background,
  },
  adImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adImagePlaceholderText: {
    fontSize: FONTS.size.small,
    fontFamily: FONTS.family.regular,
    color: COLORS.text,
    opacity: 0.5,
  },
  adContent: {
    padding: SIZES.medium,
  },
  adName: {
    fontSize: FONTS.size.medium,
    fontFamily: FONTS.family.bold,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  adReward: {
    marginBottom: SIZES.small,
  },
  adRewardText: {
    fontSize: FONTS.size.medium,
    fontFamily: FONTS.family.semibold,
    color: COLORS.primary,
  },
  adDesc: {
    fontSize: FONTS.size.small,
    fontFamily: FONTS.family.regular,
    color: COLORS.text,
    opacity: 0.7,
  },
});

