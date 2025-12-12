import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Linking,
  AppState,
  Modal,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context';
import { useAppNavigation, ROUTES } from '../navigation';
import { collectDeviceInfo } from '../utils/napApiUtils';
import { getPockAds, getPointClickAds, gatewayNodeJSApp3100 } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaboolaBanner, SafeScrollView } from '../components';
import { FONTS } from '../constants';
import { PockAdsResponse } from '../types';

const SequentialDots: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot(prev => (prev + 1) % 3);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flexDirection: 'row', marginTop: 20}}>
      {[0, 1, 2].map(index => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: activeDot === index ? '#388Dc8' : '#ccc',
            marginHorizontal: 4,
          }}
        />
      ))}
    </View>
  );
};

interface ShowPockAdScreenProps {
  onClose?: () => void; 
}

export const ShowPockAdScreen: React.FC<ShowPockAdScreenProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { advertisementParams, resetAdvertisementParams } = useAppContext();
  const { navigate, reset, goBack } = useAppNavigation();

  const handleClose = useCallback(() => {
    resetAdvertisementParams();
    console.log('handleClose');
    console.log('onClose', onClose);
    if (onClose) {

      onClose();
    } else {

      if (Platform.OS === 'ios') {

        if (goBack) {
          goBack();
        } else if (reset) {
          reset(ROUTES.map);
        }
      } else {

        if (reset) {
          reset(ROUTES.map);
        }
      }
    }
  }, [onClose, resetAdvertisementParams, goBack, reset]);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pockAdData, setPockAdData] = useState<PockAdsResponse['data'] | null>(null);
  const [adCallFailedModalVisible, setAdCallFailedModalVisible] = useState(false);
  const [showAlternativeAdButton, setShowAlternativeAdButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [hasOpenedUrl, setHasOpenedUrl] = useState(false);
  const [waitingForWebSocketResponse, setWaitingForWebSocketResponse] = useState(false);
  const [member, setMember] = useState<string>('');
  const [isTaboolaLoaded, setIsTaboolaLoaded] = useState(false);

  const rewardProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rewardProcessingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('=== ShowPockAdScreen 컴포넌트 마운트/업데이트 ===');
    console.log('advertisementParams:', advertisementParams ? '있음' : '없음');
    console.log('advertisementParams 상세:', JSON.stringify(advertisementParams, null, 2));
    console.log('🔍 [ShowPockAdScreen] advertisementParams 값 검증:', {
      advertisement: advertisementParams?.advertisement,
      campid: advertisementParams?.campid,
      coin: advertisementParams?.coin,
      name: advertisementParams?.name,
      xrunPrice: advertisementParams?.xrunPrice,
      member: advertisementParams?.member,
    });

    if (!advertisementParams) {
      console.log('⚠️ [ShowPockAdScreen] 광고 파라미터가 없습니다. 화면을 렌더링하지 않습니다.');
      console.log('🔄 모달을 닫습니다.');

      const delay = Platform.OS === 'ios' && onClose ? 100 : 0;

      const timeoutId = setTimeout(() => {
        handleClose();
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    console.log('✅ [ShowPockAdScreen] 광고 파라미터 확인 완료:', {
      advertisement: advertisementParams.advertisement,
      campid: advertisementParams.campid,
      coin: advertisementParams.coin,
      name: advertisementParams.name,
      xrunPrice: advertisementParams.xrunPrice,
    });
  }, [advertisementParams, handleClose]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (advertisementParams?.member) {
          setMember(advertisementParams.member);
          return;
        }

        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const userDataObject = JSON.parse(userData);
          const userMember = userDataObject.member?.toString() || '';
          setMember(userMember);
        } else {
          setMember('userTest');
        }
      } catch (error) {
        console.error('userData 가져오기 실패:', error);
        setMember('userTest');
      }
    };

    getUserData();
  }, [advertisementParams]);

  const initPockAd = async (params?: typeof advertisementParams) => {
    try {

      const currentParams = params || advertisementParams;

      console.log('Starting Pock advertisement initialization');
      setIsLoading(true);

      console.log('=== ShowPockAdScreen 진입 advertisementParams ===');
      console.log('advertisement:', currentParams?.advertisement);
      console.log('coin:', currentParams?.coin);
      console.log('campid:', currentParams?.campid);
      console.log('name:', currentParams?.name);
      console.log('xrunPrice:', currentParams?.xrunPrice);
      console.log('joindesc:', currentParams?.joindesc);
      console.log('전체 advertisementParams:', JSON.stringify(currentParams, null, 2));
      console.log('=== ShowPockAdScreen 진입 advertisementParams 끝 ===');

      if (!currentParams || !currentParams.campid || currentParams.campid === '') {
        console.error('❌ [ShowPockAdScreen] campid가 유효하지 않습니다:', {
          campid: currentParams?.campid,
          advertisement: currentParams?.advertisement,
          fullParams: JSON.stringify(currentParams, null, 2),
        });
        setIsLoading(false);
        handleClose();
        return;
      }

      const deviceInfo = await collectDeviceInfo();

      const campid = currentParams.campid || '';
      console.log('=== ShowPockAdScreen API 호출 정보 ===');
      console.log('member:', member);
      console.log('adid:', deviceInfo.adid);
      console.log('campid:', campid);
      console.log('advertisementParams (currentParams):', JSON.stringify(currentParams, null, 2));
      console.log('deviceInfo:', JSON.stringify(deviceInfo, null, 2));
      console.log('🔍 [ShowPockAdScreen] 최종 API 호출 campid 검증:', {
        campid,
        advertisement: currentParams?.advertisement,
        coin: currentParams?.coin,
        name: currentParams?.name,
      });
      console.log('=== API 호출 정보 끝 ===');

      const result = await getPockAds(
        member,
        deviceInfo.adid,
        deviceInfo,
        campid,
        onClose ? undefined : navigate, 
      );

      if (result.code === 200 && result.data && result.data.landing_url) {
        setPockAdData(result.data);
        setIsLoading(false);
        return;
      } else {
        throw new Error(`Pock 광고 API 응답 실패: code=${result.code}`);
      }
    } catch (error: any) {
      console.error('Pock 광고 초기화 실패:', error);

      console.log('❌ 광고 초기화 실패 - 팝업 표시');
      setIsLoading(false);
      setAdCallFailedModalVisible(true);
    }
  };

  const previousParamsRef = useRef<{ advertisement?: string; campid?: string } | null>(null);

  useEffect(() => {
    if (advertisementParams) {
      const currentKey = `${advertisementParams.advertisement}-${advertisementParams.campid}`;
      const previousKey = previousParamsRef.current
        ? `${previousParamsRef.current.advertisement}-${previousParamsRef.current.campid}`
        : null;

      if (previousKey && currentKey !== previousKey) {
        console.log('🔄 [ShowPockAdScreen] advertisementParams 변경 감지 - 상태 초기화');
        console.log('🔍 이전 파라미터:', previousParamsRef.current);
        console.log('🔍 새로운 파라미터:', {
          advertisement: advertisementParams.advertisement,
          campid: advertisementParams.campid,
          coin: advertisementParams.coin,
          name: advertisementParams.name,
        });

        setPockAdData(null);
        setIsLoading(true);
        setIsProcessing(false);
        setAdCallFailedModalVisible(false);
        setShowAlternativeAdButton(false);
        setShowBackButton(false);
        setHasOpenedUrl(false);
        setWaitingForWebSocketResponse(false);

        if (rewardProcessingTimeoutRef.current) {
          clearTimeout(rewardProcessingTimeoutRef.current);
          rewardProcessingTimeoutRef.current = null;
        }
        if (rewardProcessingIntervalRef.current) {
          clearInterval(rewardProcessingIntervalRef.current);
          rewardProcessingIntervalRef.current = null;
        }

        console.log('✅ [ShowPockAdScreen] 상태 초기화 완료');
      }

      previousParamsRef.current = {
        advertisement: advertisementParams.advertisement,
        campid: advertisementParams.campid,
      };
    }
  }, [advertisementParams?.advertisement, advertisementParams?.campid]);

  useEffect(() => {
    console.log('=== ShowPockAdScreen 광고 초기화 체크 ===');
    console.log('member:', member ? `있음 (${member})` : '없음');
    console.log('advertisementParams:', advertisementParams ? '있음' : '없음');
    console.log('🔍 [ShowPockAdScreen] advertisementParams 상세:', {
      advertisement: advertisementParams?.advertisement,
      campid: advertisementParams?.campid,
      coin: advertisementParams?.coin,
      name: advertisementParams?.name,
      xrunPrice: advertisementParams?.xrunPrice,
    });

    if (member && advertisementParams) {
      console.log('✅ member와 advertisementParams 모두 있음 - initPockAd 호출');
      console.log('🔍 [ShowPockAdScreen] initPockAd에 전달할 campid:', advertisementParams.campid);

      initPockAd(advertisementParams);
    } else {
      console.log('⏳ member 또는 advertisementParams 대기 중...');
      if (!member) {
        console.log('  - member가 아직 설정되지 않음');
      }
      if (!advertisementParams) {
        console.log('  - advertisementParams가 아직 설정되지 않음');
      }
    }
  }, [member, advertisementParams]);

  useEffect(() => {
    return () => {
      if (rewardProcessingTimeoutRef.current) {
        clearTimeout(rewardProcessingTimeoutRef.current);
        rewardProcessingTimeoutRef.current = null;
      }
      if (rewardProcessingIntervalRef.current) {
        clearInterval(rewardProcessingIntervalRef.current);
        rewardProcessingIntervalRef.current = null;
      }
    };
  }, []);

  const openLandingUrl = async (url: string) => {
    try {
      console.log('URL 이동 시도:', url);

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        console.log('✅ URL 이동 성공 - 리워드 처리 대기');
        setHasOpenedUrl(true);
        setIsLoading(false);
        setIsProcessing(true);
        setWaitingForWebSocketResponse(true); 

      } else {
        console.error('❌ 지원하지 않는 URL:', url);
        throw new Error(t('screens.showNapAd.unsupportedUrl'));
      }
    } catch (error) {
      console.error('❌ URL 이동 실패:', error);
      throw error;
    }
  };

  const handleAdCompletion = async () => {
    try {
      setIsProcessing(true);

      if (!pockAdData?.landing_url) {
        throw new Error(t('screens.showNapAd.noAdUrl'));
      }

      console.log('=== 광고 완료 처리 정보 ===');
      console.log('joindesc:', advertisementParams?.joindesc);
      console.log('name:', advertisementParams?.name);
      console.log('xrunPrice:', advertisementParams?.xrunPrice);
      console.log('pockAdData:', pockAdData);

      try {

        const adIdRaw = advertisementParams?.advertisement;

        if (!adIdRaw) {
          console.error('[ShowPockAdScreen] ❌ advertisement가 비어있습니다. 이 상태로는 올바른 리워드를 줄 수 없습니다.', {
            advertisementParams,
            advertisement: advertisementParams?.advertisement,
            coin: advertisementParams?.coin,
            campid: advertisementParams?.campid,
            name: advertisementParams?.name,
          });

          resetAdvertisementParams();
          handleClose();
          setIsProcessing(false);
          setWaitingForWebSocketResponse(false);
          return;
        }

        const adId = parseInt(String(adIdRaw), 10);

        if (isNaN(adId) || adId === 0) {
          console.error('[ShowPockAdScreen] ❌ advertisement가 유효하지 않은 값입니다.', {
            adIdRaw,
            adId,
            advertisementParams,
          });

          resetAdvertisementParams();
          handleClose();
          setIsProcessing(false);
          setWaitingForWebSocketResponse(false);
          return;
        }

        console.log('[ShowPockAdScreen] ✅ advertisement 검증 통과:', {
          adIdRaw,
          adId,
          coin: advertisementParams?.coin || '0',
          member,
        });

        const response = await gatewayNodeJSApp3100(
          adId,
          advertisementParams?.coin || '0',
          member,
          advertisementParams?.joindesc || '',
          advertisementParams?.name || '',
          advertisementParams?.xrunPrice || 0,
          navigate,
        );

        if (response && response.data) {
          console.log('API response received:', response);
          setIsProcessing(false);

          console.log('✅ 리워드 처리 완료 - 사용자 버튼 클릭 대기');
          setWaitingForWebSocketResponse(true);
        }
      } catch (error) {
        console.error('Error calling API:', error);
        setIsProcessing(false);

        console.log('✅ 리워드 처리 완료 (에러 발생) - 사용자 버튼 클릭 대기');
        setWaitingForWebSocketResponse(true);
      }
    } catch (error) {
      console.error('Error in ad completion process:', error);
      setIsProcessing(false);

      if (rewardProcessingTimeoutRef.current) {
        clearTimeout(rewardProcessingTimeoutRef.current);
        rewardProcessingTimeoutRef.current = null;
      }
      if (rewardProcessingIntervalRef.current) {
        clearInterval(rewardProcessingIntervalRef.current);
        rewardProcessingIntervalRef.current = null;
      }

      setWaitingForWebSocketResponse(true);
      console.log('✅ 리워드 처리 완료 (전체 에러) - 사용자 버튼 클릭 대기');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      console.log('App state change:', appState, '->', nextAppState);

      if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active' &&
        hasOpenedUrl &&
        pockAdData &&
        !waitingForWebSocketResponse &&
        !adCallFailedModalVisible
      ) {
        console.log('✅ App returned from ad - processing completion');
        await handleAdCompletion();
      }

      setAppState(nextAppState as 'active' | 'background' | 'inactive' | 'unknown' | 'extension');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [appState, hasOpenedUrl, pockAdData, waitingForWebSocketResponse, adCallFailedModalVisible]);

  const handleBackButtonPress = () => {
    console.log('뒤로가기 버튼 클릭 - CameraMainScreen으로 이동');
    setShowBackButton(false);
    resetAdvertisementParams();
    handleClose();
  };

  const handleAdCallFailedOK = () => {
    console.log('광고 호출 실패 확인 버튼 클릭 - CameraMainScreen으로 이동');
    setAdCallFailedModalVisible(false);
    resetAdvertisementParams();
    handleClose();
  };

  const handleAlternativeAdButton = () => {
    console.log('다른 광고 보기 버튼 클릭 - CameraMainScreen으로 이동');
    resetAdvertisementParams();
    handleClose();
  };

  const handleCancel = () => {
    console.log('취소 버튼 클릭 - CameraMainScreen으로 이동');
    resetAdvertisementParams();
    handleClose();
  };

  const handleGoToMap = () => {
    console.log('맵으로 이동 버튼 클릭 - MapMainScreen으로 이동');

    if (rewardProcessingTimeoutRef.current) {
      clearTimeout(rewardProcessingTimeoutRef.current);
      rewardProcessingTimeoutRef.current = null;
    }
    if (rewardProcessingIntervalRef.current) {
      clearInterval(rewardProcessingIntervalRef.current);
      rewardProcessingIntervalRef.current = null;
    }
    setWaitingForWebSocketResponse(false);
    resetAdvertisementParams();
    handleClose();
  };

  const handleWatchAd = useCallback(async () => {
    console.log('광고 보기 버튼 클릭');

    try {

      const adCompany = advertisementParams?.ad_company || 'pock';
      if (adCompany === 'pock') {
        const deviceInfo = await collectDeviceInfo();
        const ad_key = advertisementParams?.campid || '';
        console.log(`[광고보기] getPointClickAds 호출 - ad_key: ${ad_key}`);

        try {
          const result = await getPointClickAds(
            member,
            deviceInfo.adid,
            deviceInfo,
            ad_key,
            onClose ? undefined : navigate,
          );
          console.log('[광고보기] getPointClickAds 응답:', result);
        } catch (apiError) {
          console.error('[광고보기] getPointClickAds 호출 실패:', apiError);

        }
      }

      if (pockAdData?.landing_url) {
        await openLandingUrl(pockAdData.landing_url);
      } else {
        console.error('[광고보기] landing_url이 없습니다.');
        setAdCallFailedModalVisible(true);
      }
    } catch (error) {
      console.error('[광고보기] URL 열기 실패:', error);
      setAdCallFailedModalVisible(true);
    }
  }, [pockAdData, openLandingUrl, advertisementParams, member, onClose, navigate]);

  if (!advertisementParams) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {}
      {!isLoading && !isProcessing && !waitingForWebSocketResponse && !adCallFailedModalVisible && pockAdData && (
        <Pressable
          style={styles.topClickArea}
          onPress={handleWatchAd}
        />
      )}

      {}
      {(isLoading || isProcessing || waitingForWebSocketResponse) && (
        <View style={styles.loadingContainer}>
          {!waitingForWebSocketResponse || !isTaboolaLoaded ? (
            <>
              <SequentialDots />
              <Text style={styles.loadingText}>
                {waitingForWebSocketResponse
                  ? t('screens.showNapAd.processingReward')
                  : t('screens.showNapAd.loading')}
              </Text>

              {waitingForWebSocketResponse && <SequentialDots />}
            </>
          ) : null}

          {waitingForWebSocketResponse && (
            <TouchableOpacity
              onPress={isTaboolaLoaded ? handleGoToMap : undefined}
              activeOpacity={isTaboolaLoaded ? 0.7 : 1}
              disabled={!isTaboolaLoaded}
              style={styles.goToMapLinkContainer}
            >
              <Text
                style={[
                  styles.goToMapLink,
                  !isTaboolaLoaded && styles.goToMapLinkDisabled,
                ]}
              >
                {t('screens.showNapAd.goToMap')}
              </Text>
            </TouchableOpacity>
          )}

          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackButtonPress}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>{t('screens.showNapAd.back')}</Text>
            </TouchableOpacity>
          )}

          {showAlternativeAdButton && (
            <TouchableOpacity
              style={styles.alternativeAdButton}
              onPress={handleAlternativeAdButton}
              activeOpacity={0.7}
            >
              <Text style={styles.alternativeAdButtonText}>{t('screens.showNapAd.alternativeAd')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {}
      {!isLoading && !isProcessing && !waitingForWebSocketResponse && adCallFailedModalVisible && (
        <View style={[styles.campaignContainer, styles.errorContainer]}>
          <Text style={styles.modalText}>
            {t('screens.showNapAd.adCallFailed')}
          </Text>
          <Text style={styles.modalSubText}>
            {t('screens.showNapAd.adCallFailedSub')}
          </Text>
          <View style={[styles.buttonContainer, { justifyContent: 'center', marginTop: 20 }]}>
            <TouchableOpacity onPress={handleAdCallFailedOK} style={[styles.okButton, { flex: 0, minWidth: 200 }]}>
              <Text style={styles.okButtonText}>{t('screens.showNapAd.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      {!isLoading && !isProcessing && !waitingForWebSocketResponse && !adCallFailedModalVisible && pockAdData && (
        <View style={styles.campaignContainer}>
          <Text style={styles.campaignTitle}>
            {pockAdData.ad_name || advertisementParams.name || t('screens.showNapAd.campaignInfo')}
          </Text>
          <Text style={styles.campaignReward}>
            {t('screens.showNapAd.reward')} : {(advertisementParams.xrunPrice || 0).toFixed(2)} XRUN
          </Text>
          <Text style={styles.campaignDesc}>
            {pockAdData.ad_description || t('screens.showNapAd.campaignDesc')}
          </Text>

          {}
          {advertisementParams.joindesc && advertisementParams.joindesc !== '' && (
            <View style={styles.joinDescContainer}>
              <Text style={styles.joinDescTitle}>{t('screens.showNapAd.joinMethod')}</Text>
              <SafeScrollView
                style={styles.joinDescScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <Text style={styles.joinDescText}>
                  {advertisementParams.joindesc}
                </Text>
              </SafeScrollView>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.watchAdButton}
              onPress={handleWatchAd}
              activeOpacity={0.7}
            >
              <Text style={styles.watchAdButtonText}>{t('screens.showNapAd.watchAd')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{t('screens.showNapAd.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      {waitingForWebSocketResponse && (
        <View style={styles.bannerContainer}>
          <TaboolaBanner
            placementType="reward_OS_395x80"
            onLoadComplete={() => {
              console.log('[ShowPockAdScreen] Taboola 배너 로딩 완료');
              setIsTaboolaLoaded(true);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    flex: 1,
    paddingBottom: 100, 
  },
  loadingText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FONTS.size.medium,
    color: 'grey',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
    flexWrap: 'wrap',
  },
  retryText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FONTS.size.msmall,
    color: '#388Dc8',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
    flexWrap: 'wrap',
  },
  alternativeAdButton: {
    backgroundColor: '#FFDC04',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alternativeAdButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#343a59',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
    width: '60%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
  goToMapLinkContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
  goToMapLink: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#388Dc8',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  goToMapLinkDisabled: {
    color: '#999',
    textDecorationLine: 'none',
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 65,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    position: 'absolute',
    width: '85%',
    paddingTop: 24,
    marginHorizontal: 'auto',
  },
  modalText: {
    fontSize: FONTS.size.mmedium,
    fontFamily: 'Roboto-Regular',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  modalSubText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  okButton: {
    backgroundColor: '#388Dc8',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    width: 110,
    alignSelf: 'center',
    marginTop: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  okButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
  },
  campaignContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginHorizontal: 20,
    alignItems: 'center',
    height: '70%',
    justifyContent: 'flex-start',
  },
  campaignTitle: {
    fontSize: FONTS.size.mmedium,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
    color: '#343a59',
    textAlign: 'center',
  },
  campaignReward: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
    color: '#388Dc8',
    textAlign: 'center',
  },
  campaignDesc: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
    gap: 15,
    paddingTop: 10,
  },
  watchAdButton: {
    backgroundColor: '#FFDC04',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  watchAdButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#343a59',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#666',
    textAlign: 'center',
  },
  joinDescContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 15,
    flex: 1,
  },
  joinDescTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#343a59',
    textAlign: 'center',
    marginBottom: 8,
  },
  joinDescScrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 20,
  },
  joinDescText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#495057',
    lineHeight: 18,
    textAlign: 'left',
  },
  errorContainer: {
    height: 'auto',
    minHeight: 200,
    maxHeight: 300,
    maxWidth: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  topClickArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});
