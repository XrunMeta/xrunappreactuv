import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  AppState,
  Modal,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppNavigation, ROUTES } from '../navigation';
import { collectDeviceInfo } from '../utils/napApiUtils';
import { getNasmobAds, sendNasmobCallback, processAdReward, getPockAds, removeAdFromTopAd5, getCompletedAds, getTopAd5, addToCompletedAdsCache, logRewardedAdCompleted } from '../services';
import { NAP_CONFIG } from '../config/napConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaboolaBanner, SafeScrollView } from '../components';
import { FONTS } from '../constants';
import { Ionicons } from '@expo/vector-icons';

const SequentialDots: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot(prev => (prev + 1) % 3);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flexDirection: 'row', marginTop: 20 }}>
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

interface CampaignData {
  urlResult: number;
  urlAD?: string;
  campid?: string;
  price?: number;
  name?: string;
  rewarddesc?: string;
  cbparam?: string;
}

interface ShowNapAdScreenProps {
  onClose?: () => void; 
  isModal?: boolean; 
}

export const ShowNapAdScreen: React.FC<ShowNapAdScreenProps> = ({ onClose, isModal = false }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { advertisementParams, resetAdvertisementParams } = useAppContext();
  const { showAlert } = useAlertDialog();
  const { navigate, reset, goBack } = useAppNavigation();

  const handleClose = useCallback(() => {
    resetAdvertisementParams();

    setHasOpenedUrl(false);
    isWatchingAdRef.current = false;
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
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [adCallFailedModalVisible, setAdCallFailedModalVisible] = useState(false);
  const [showAlternativeAdButton, setShowAlternativeAdButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [hasOpenedUrl, setHasOpenedUrl] = useState(false);
  const [waitingForWebSocketResponse, setWaitingForWebSocketResponse] = useState(false);
  const [member, setMember] = useState<string>('');
  const [isTaboolaLoaded, setIsTaboolaLoaded] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const webViewRef = useRef<WebView>(null);
  const originalWebViewUrlRef = useRef<string>(''); 

  const rewardProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rewardProcessingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);
  const isWatchingAdRef = useRef(false); 

  useEffect(() => {
    console.log('=== ShowNapAdScreen 컴포넌트 마운트/업데이트 ===');
    console.log('advertisementParams:', advertisementParams ? '있음' : '없음');
    console.log('advertisementParams 상세:', JSON.stringify(advertisementParams, null, 2));
    console.log('🔍 [ShowNapAdScreen] advertisementParams 값 검증:', {
      advertisement: advertisementParams?.advertisement,
      campid: advertisementParams?.campid,
      coin: advertisementParams?.coin,
      name: advertisementParams?.name,
      xrunPrice: advertisementParams?.xrunPrice,
      member: advertisementParams?.member,
    });

    if (!advertisementParams) {
      console.log('⚠️ [ShowNapAdScreen] 광고 파라미터가 없습니다. 화면을 렌더링하지 않습니다.');
      console.log('🔄 모달을 닫습니다.');

      const delay = Platform.OS === 'ios' && onClose ? 100 : 0;

      const timeoutId = setTimeout(() => {
        handleClose();
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    console.log('✅ [ShowNapAdScreen] 광고 파라미터 확인 완료:', {
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

  const initNStationAd = async (params?: typeof advertisementParams) => {
    try {

      const currentParams = params || advertisementParams;
      const campid = currentParams?.campid || '';

      console.log('Starting NStation advertisement initialization');

      if (isFetchingRef.current) {
        console.log('[ShowNapAdScreen] 이미 광고 데이터를 가져오는 중입니다.');
        return;
      }

      if (!currentParams || campid === '') {
        console.error('❌ [ShowNapAdScreen] campid가 유효하지 않습니다:', {
          campid: campid,
          advertisement: currentParams?.advertisement,
          fullParams: JSON.stringify(currentParams, null, 2),
        });
        setIsLoading(false);
        await showAlert(
          t('screens.showNapAd.alerts.error', { defaultValue: '알림' }),
          t('screens.showNapAd.alerts.invalidCampaign', { defaultValue: '광고 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.' }),
          [{ text: t('screens.showNapAd.alerts.confirm', { defaultValue: '확인' }), onPress: handleClose }],
        );
        return;
      }

      if (!campaignData) {
        console.log('✅ [ShowNapAdScreen] 기본 정보로 UI 우선 표시');
        setCampaignData({
          urlResult: 200,
          urlAD: currentParams.urlAD || '',
          campid: campid.toString(),
          name: currentParams.name || '',
          rewarddesc: '', 
        });
        setIsLoading(false); 
      }

      if (currentParams?.urlAD && currentParams.urlAD !== '') {
        console.log('✅ [ShowNapAdScreen] urlAD 사용, API 호출 불필요');

        if (campaignData) {
          setCampaignData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              urlAD: currentParams.urlAD || prev.urlAD,
            };
          });
        }
        return;
      }

      console.warn('⚠️ [ShowNapAdScreen] urlAD가 없습니다. 서버 응답 확인 필요');
      setIsLoading(false);
    } catch (error: any) {
      console.error('NStation 광고 초기화 실패:', error);
      setIsLoading(false);

      if (!campaignData?.urlAD) {
        console.log('❌ 광고 초기화 실패 - 팝업 표시');
        setAdCallFailedModalVisible(true);
      }
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
        console.log('🔄 [ShowNapAdScreen] advertisementParams 변경 감지 - 상태 초기화');
        console.log('🔍 이전 파라미터:', previousParamsRef.current);
        console.log('🔍 새로운 파라미터:', {
          advertisement: advertisementParams.advertisement,
          campid: advertisementParams.campid,
          coin: advertisementParams.coin,
          name: advertisementParams.name,
        });

        setCampaignData(null);
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

        console.log('✅ [ShowNapAdScreen] 상태 초기화 완료');
      }

      previousParamsRef.current = {
        advertisement: advertisementParams.advertisement,
        campid: advertisementParams.campid,
      };
    }
  }, [advertisementParams?.advertisement, advertisementParams?.campid]);

  useEffect(() => {
    console.log('=== ShowNapAdScreen 광고 초기화 체크 ===');
    console.log('member:', member ? `있음 (${member})` : '없음');
    console.log('advertisementParams:', advertisementParams ? '있음' : '없음');
    console.log('🔍 [ShowNapAdScreen] advertisementParams 상세:', {
      advertisement: advertisementParams?.advertisement,
      campid: advertisementParams?.campid,
      coin: advertisementParams?.coin,
      name: advertisementParams?.name,
      xrunPrice: advertisementParams?.xrunPrice,
    });

    if (member && advertisementParams) {
      console.log('✅ member와 advertisementParams 모두 있음 - initNStationAd 호출');
      console.log('🔍 [ShowNapAdScreen] initNStationAd에 전달할 campid:', advertisementParams.campid);

      initNStationAd(advertisementParams);
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

  const getQueryParam = (url: string, param: string): string | null => {
    const match = url.match(new RegExp(`[?&]${param}=([^&#]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const openUrlAD = async (url: string) => {
    try {
      console.log('WebView로 URL 표시:', url);

      setWebViewUrl(url);
      originalWebViewUrlRef.current = url; 
      setShowWebView(true);
      console.log('✅ WebView 모달 표시');
    } catch (error) {
      console.error('❌ WebView 표시 실패:', error);
      throw error;
    }
  };

  const handleWebViewClose = useCallback(async () => {
    console.log('[WebView] 닫기 버튼 클릭');
    setShowWebView(false);
    setWebViewUrl('');
    originalWebViewUrlRef.current = ''; 
    isWatchingAdRef.current = false;
    setHasOpenedUrl(false);

    console.log('[WebView 닫기] 광고 모달 닫기 및 AR 화면으로 이동');
    resetAdvertisementParams();
    handleClose();

    if (navigate) {
      navigate(ROUTES.map);
    }
  }, [navigate, resetAdvertisementParams, handleClose]);

  const callAdApi = async () => {
    try {
      const adCompany = advertisementParams?.ad_company || 'nas';
      const deviceInfo = await collectDeviceInfo();

      console.log(`[callAdApi] 광고 API 호출 시작 - ad_company: ${adCompany}`);

      if (adCompany === 'nas') {

        const campid = advertisementParams?.campid || '';
        console.log(`[callAdApi] getNasmobAds 호출 - campid: ${campid}`);

        isFetchingRef.current = true;
        const result = await getNasmobAds(
          member,
          deviceInfo.adid,
          deviceInfo,
          campid,
          onClose ? undefined : navigate,
        );
        isFetchingRef.current = false;
        console.log('[callAdApi] getNasmobAds 응답:', result);
        return result;

      } else if (adCompany === 'pointclick' || adCompany === 'pock') {

        const ad_key = advertisementParams?.campid || '';
        console.log(`[callAdApi] getPockAds 호출 - ad_key: ${ad_key}`);

        isFetchingRef.current = true;
        const result = await getPockAds(
          member,
          deviceInfo.adid,
          deviceInfo,
          ad_key,
          onClose ? undefined : navigate,
        );
        isFetchingRef.current = false;
        console.log('[callAdApi] getPockAds 응답:', result);
        return result;

      } else {

        console.log(`[callAdApi] 알 수 없는 ad_company(${adCompany}), 기본 getNasmobAds 호출`);
        const campid = advertisementParams?.campid || '';

        isFetchingRef.current = true;
        const result = await getNasmobAds(
          member,
          deviceInfo.adid,
          deviceInfo,
          campid,
          onClose ? undefined : navigate,
        );
        isFetchingRef.current = false;
        console.log('[callAdApi] getNasmobAds 응답:', result);
        return result;
      }
    } catch (error: any) {
      console.error('[callAdApi] 광고 API 호출 실패:', error);
      isFetchingRef.current = false;

      if (error.is403) {
        console.warn(`[callAdApi] 블록리스트된 캠페인: ${error.campid || 'N/A'} - ${error.message}`);

        throw error;
      }

      throw error;
    }
  };

  const handleAdCompletion = async () => {
    try {
      setIsProcessing(true);
      const deviceInfo = await collectDeviceInfo();

      if (!campaignData?.urlAD) {
        throw new Error(t('screens.showNapAd.noAdUrl'));
      }

      const urlAD = campaignData.urlAD;
      const nstkey = getQueryParam(urlAD, 'nstkey');
      const subparam = getQueryParam(urlAD, 'subparam');

      console.log('=== 광고 완료 처리 정보 ===');
      console.log('joindesc:', advertisementParams?.joindesc);
      console.log('name:', advertisementParams?.name);
      console.log('xrunPrice:', advertisementParams?.xrunPrice);
      console.log('campaignData:', campaignData);

      const callbackResponse = await sendNasmobCallback(
        {
          cbparam: campaignData.cbparam || NAP_CONFIG.CB_PARAM,
          mkey: NAP_CONFIG.MKEY,
          mckey: NAP_CONFIG.MCKEY,
          nstkey: nstkey || null,
          subparam: subparam || null,
          userid: member.toString(),
          campid: (campaignData.campid || advertisementParams?.campid || '').toString(),
          adid: deviceInfo.adid,
          price: ((campaignData.price || 0) / 2).toString(),
          total_sales: (campaignData.price || 0).toString(),
          postback_type: null,
          postback_rewardtype: null,
          raw_response: campaignData,
        },
        navigate,
      );

      console.log('Callback response:', callbackResponse);

      if (callbackResponse.status === 'success') {
        console.log('✅ Nasmob 콜백 전송 성공');

      }

      try {
        console.log('[광고완료] TopAd5 새로고침 시작');
        await getTopAd5(navigate, true); 
        console.log('[광고완료] TopAd5 새로고침 완료');
      } catch (topAd5Error) {
        console.warn('[광고완료] TopAd5 새로고침 실패 (무시):', topAd5Error);
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
        campaignData &&
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
  }, [appState, hasOpenedUrl, campaignData, waitingForWebSocketResponse, adCallFailedModalVisible]);

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

  const handleCancel = async () => {
    console.log('취소 버튼 클릭 - AR 화면으로 이동');
    resetAdvertisementParams();

    await AsyncStorage.setItem('shouldNavigateToCamera', 'true');
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

    if (isWatchingAdRef.current) {
      console.log('⚠️ [광고보기] 이미 처리 중입니다. 중복 호출 무시');
      return;
    }

    console.log('광고 보기 버튼 클릭 (AsyncStorage URL 사용)');
    console.log(`[광고보기] ad_company: ${advertisementParams?.ad_company}`);
    isWatchingAdRef.current = true;

    try {
      const campid = advertisementParams?.campid || campaignData?.campid || '';

      if (!campid || campid === '') {
        console.error('[광고보기] campid가 없습니다.');
        setAdCallFailedModalVisible(true);
        isWatchingAdRef.current = false;
        return;
      }

      let urlAD = advertisementParams?.urlAD || campaignData?.urlAD || '';

      if (!urlAD) {
        try {
          const cachedAdStr = await AsyncStorage.getItem('cached_AD');
          if (cachedAdStr) {
            const cachedAd = JSON.parse(cachedAdStr);
            const campidForCache = advertisementParams?.campid || campaignData?.campid || '';
            if (cachedAd[campidForCache]?.urlAD) {
              urlAD = cachedAd[campidForCache].urlAD;
              console.log('[광고보기] AsyncStorage cached_AD에서 urlAD 가져옴:', urlAD);

              if (urlAD.startsWith('market://') || urlAD.startsWith('intent://')) {
                console.warn('[광고보기] 캐시에 market:// 또는 intent:// 발견 - 백엔드에서 변환되어야 함. 캐시에서 제거:', campidForCache);
                delete cachedAd[campidForCache];
                await AsyncStorage.setItem('cached_AD', JSON.stringify(cachedAd));
                urlAD = ''; 
              }
            }
          }
        } catch (cacheError) {
          console.warn('[광고보기] 캐시 확인 실패:', cacheError);
        }
      }

      if (!urlAD || urlAD === '') {
        console.error('[광고보기] urlAD가 없습니다. 서버 응답 확인 필요');
        setAdCallFailedModalVisible(true);
        isWatchingAdRef.current = false;
        return;
      }

      console.log('[광고보기] [1-1] URL로 이동:', urlAD);
      setHasOpenedUrl(true);
      await openUrlAD(urlAD);
      console.log('[광고보기] [1-1] WebView 모달 표시 완료');

      console.log('[광고보기] [1-2] TopAd5 새로고침 시작 (백그라운드)');
      getTopAd5(navigate, true).catch((topAd5Error) => {
        console.warn('[광고보기] [1-2] TopAd5 새로고침 실패 (무시):', topAd5Error);
      });

      (async () => {
        try {

          try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
              const parsedUserData = JSON.parse(userData);
              const member = parsedUserData?.member;
              if (member) {
                console.log('[광고보기] processAdReward 호출 시작 (백그라운드)');
                const rewardResult = await processAdReward(
                  parseInt(member, 10),
                  campid,
                  'nas',
                  navigate,
                );
                console.log('[광고보기] processAdReward 응답:', rewardResult);
              }
            }
          } catch (rewardError: any) {
            if (rewardError?.code === 404 || rewardError?.message?.includes('404')) {
              console.log('[광고보기] 이미 본 광고 (404) - 정상 처리');
            } else {
              console.warn('[광고보기] processAdReward 실패 (무시):', rewardError);
            }
          }

          try {
            console.log('[광고보기] removeAdFromTopAd5 호출 (백그라운드)');
            await removeAdFromTopAd5(campid, navigate);
            console.log('[광고보기] removeAdFromTopAd5 완료');
          } catch (removeError) {
            console.warn('[광고보기] removeAdFromTopAd5 실패 (무시):', removeError);
          }

          await addToCompletedAdsCache(campid);
          logRewardedAdCompleted('nasmedia');

          await AsyncStorage.setItem('isAdCompleted', 'true');
          await AsyncStorage.setItem('shouldRefreshTopAd5', 'true');
          await AsyncStorage.setItem('shouldNavigateToCamera', 'true');
          await AsyncStorage.setItem('completedAdCampid', campid);
          console.log('[광고보기] [2단계] 백그라운드 처리 완료');

        } catch (bgError) {
          console.warn('[광고보기] 백그라운드 처리 실패:', bgError);
        }
      })();
    } catch (error) {
      console.error('[광고보기] URL 열기 실패:', error);
      setAdCallFailedModalVisible(true);
    } finally {

      isWatchingAdRef.current = false;
    }
  }, [campaignData, openUrlAD, advertisementParams, onClose, resetAdvertisementParams, handleClose]);

  if (!advertisementParams) {
    return null;
  }

  return (
    <View style={[styles.root, isModal && styles.modalRoot]}>
      {!isModal && <StatusBar style="dark" />}

      {}

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
          <View style={[styles.buttonContainers]}>
            <TouchableOpacity onPress={handleAdCallFailedOK} style={[styles.okButton, { flex: 0, minWidth: 200 }]}>
              <Text style={styles.okButtonText}>{t('screens.showNapAd.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      {!isLoading && !isProcessing && !waitingForWebSocketResponse && !adCallFailedModalVisible && campaignData && (
        <View style={[styles.campaignContainer, isModal && styles.modalCampaignContainer]}>
          {}
          {isModal && (
            <TouchableOpacity
              onPress={handleClose}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                padding: 8,
                backgroundColor: 'transparent',
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          )}
          <View style={styles.campaignBox}>
            <Text style={styles.campaignTitle}>
              {campaignData.name || t('screens.showNapAd.campaignInfo')}
            </Text>
          </View>
          <Text style={styles.campaignReward}>
            {t('screens.showNapAd.reward')} : {(() => {
              const price = advertisementParams?.xrunPrice || 0;
              const priceValue = parseFloat(String(price));

              return isNaN(priceValue) ? '0' : String(parseFloat(priceValue.toFixed(2)));
            })()} XRUN
          </Text>
          <Text style={styles.campaignDesc}>
            {campaignData.rewarddesc || ''}
          </Text>

          {}
          {(campaignData.rewarddesc || advertisementParams.joindesc) && (
            <View style={styles.joinDescContainer}>
              <Text style={styles.joinDescTitle}>{t('screens.showNapAd.joinMethod')}</Text>
              <SafeScrollView
                style={styles.joinDescScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 20 }}
                showBottomBackground={false}
              >
                <Text style={styles.joinDescText}>
                  {campaignData.rewarddesc || advertisementParams.joindesc}
                </Text>
              </SafeScrollView>
            </View>
          )}

        </View>
      )}

      {

}

      {}
      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={handleWebViewClose}
        presentationStyle="fullScreen"
      >
        <View style={styles.webViewContainer}>
          <StatusBar style="dark" />
          <View style={[styles.webViewHeader, { paddingTop: insets.top + 12 }]}>
            <Text
              style={styles.webViewTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {campaignData?.name || advertisementParams?.name || '광고 보기'}
            </Text>
          </View>
          {webViewUrl ? (
            <View style={styles.webViewWrapper}>
              <WebView
                ref={webViewRef}
                source={{ uri: webViewUrl }}
                style={styles.webView}
              onNavigationStateChange={(navState) => {
                console.log('[WebView] 네비게이션:', navState.url);

                const originalUrl = originalWebViewUrlRef.current;
                if (originalUrl && (originalUrl.includes('buzzvil.com') || originalUrl.includes('appsflyer.com'))) {
                  if (navState.url && (navState.url.startsWith('market://') || navState.url.startsWith('intent://'))) {
                    console.warn('[WebView] ⚠️ 광고 URL이 마켓으로 리다이렉트됨. 원래 URL로 되돌림:', {
                      originalUrl,
                      redirectedUrl: navState.url,
                    });

                    setWebViewUrl(originalUrl);
                    return;
                  }

                  if (navState.url && (navState.url.includes('play.google.com') || navState.url.includes('apps.apple.com'))) {

                    if (!originalUrl.includes('play.google.com') && !originalUrl.includes('apps.apple.com')) {
                      console.warn('[WebView] ⚠️ 광고 URL이 마켓으로 리다이렉트됨. 원래 URL로 되돌림:', {
                        originalUrl,
                        redirectedUrl: navState.url,
                      });

                      setWebViewUrl(originalUrl);
                      return;
                    }
                  }
                }

                if (navState.url && navState.url.startsWith('market://')) {
                  try {
                    const idMatch = navState.url.match(/[?&]id=([^&?#]+)/);
                    if (idMatch) {
                      const packageId = idMatch[1];
                      const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                      console.log('[WebView] market://를 play.google.com으로 변환 (onNavigationStateChange):', playStoreUrl);
                      setWebViewUrl(playStoreUrl);
                    }
                  } catch (error) {
                    console.error('[WebView] market:// 변환 실패:', error);
                  }
                } else if (navState.url && navState.url.startsWith('intent://')) {
                  try {
                    let packageId = '';
                    const idMatch = navState.url.match(/[?&]id=([^&?#]+)/);
                    if (idMatch) {
                      packageId = idMatch[1];
                    } else {
                      const packageMatch = navState.url.match(/package=([^;]+)/);
                      if (packageMatch) {
                        packageId = packageMatch[1];
                      }
                    }
                    if (packageId) {
                      const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                      console.log('[WebView] intent://를 play.google.com으로 변환 (onNavigationStateChange):', playStoreUrl);
                      setWebViewUrl(playStoreUrl);
                    }
                  } catch (error) {
                    console.error('[WebView] intent:// 변환 실패:', error);
                  }
                }
              }}
              onShouldStartLoadWithRequest={(request) => {
                const { url } = request;
                console.log('[WebView] 네비게이션 요청:', url);

                const originalUrl = originalWebViewUrlRef.current;
                if (originalUrl && (originalUrl.includes('buzzvil.com') || originalUrl.includes('appsflyer.com'))) {
                  if (url.startsWith('market://') || url.startsWith('intent://')) {
                    console.warn('[WebView] ⚠️ 광고 URL이 마켓으로 리다이렉트됨. 차단:', {
                      originalUrl,
                      redirectedUrl: url,
                    });
                    return false; 
                  }

                  if (url.includes('play.google.com') || url.includes('apps.apple.com')) {

                    if (!originalUrl.includes('play.google.com') && !originalUrl.includes('apps.apple.com')) {
                      console.warn('[WebView] ⚠️ 광고 URL이 마켓으로 리다이렉트됨. 차단:', {
                        originalUrl,
                        redirectedUrl: url,
                      });
                      return false; 
                    }
                  }
                }

                if (url.startsWith('market://') || url.startsWith('intent://')) {
                  console.warn('[WebView] market:// 또는 intent:// 스킴 감지 - 백엔드에서 변환되어야 함:', url);
                  return false; 
                }

                const appSchemes = [
                  'coupang://', 'coupangapp://', 
                  '11st://', 'auction://', 'gmarket://', 'tmon://', 'wemakeprice://', 
                  'lotteon://', 'ssg://', 'shinsegae://', 
                  'instagram://', 'kakao://', 'kakaotalk://', 'line://', 'tiktok://', 
                  'youtube://', 'twitter://', 'x://', 
                  'netflix://', 'disneyplus://', 'watcha://', 
                  'kakaopay://', 'naverpay://', 'toss://', 'payco://', 
                ];

                for (const scheme of appSchemes) {
                  if (url.startsWith(scheme)) {
                    console.log(`[WebView] ${scheme} 앱 스킴 감지, 외부 앱으로 열기:`, url);
                    Linking.openURL(url).catch((err) => {
                      console.error(`[WebView] ${scheme} 앱 열기 실패:`, err);
                    });
                    return false; 
                  }
                }

                if (url.startsWith('tel:') || 
                    url.startsWith('mailto:') ||
                    url.startsWith('sms:') ||
                    url.startsWith('fb://') ||
                    url.startsWith('facebook://')) {
                  console.log('[WebView] 커스텀 스킴 감지, 외부 앱으로 열기:', url);
                  Linking.openURL(url).catch((err) => {
                    console.error('[WebView] 외부 앱 열기 실패:', err);
                  });
                  return false; 
                }

                if (url.includes('facebook.com') && !url.startsWith('http://') && !url.startsWith('https://')) {
                  console.log('[WebView] 페이스북 링크 감지, 외부 앱으로 열기 시도:', url);
                  Linking.openURL(url).catch((err) => {
                    console.error('[WebView] 페이스북 앱 열기 실패, WebView에서 계속 로드:', err);
                  });
                  return false;
                }

                return true;
              }}
              onLoadStart={() => {
                console.log('[WebView] 로딩 시작');
              }}
              onLoadEnd={() => {
                console.log('[WebView] 로딩 완료');
              }}

              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('[WebView] 에러:', nativeEvent);

                if (nativeEvent.code === -10 && nativeEvent.url) {
                  const url = nativeEvent.url;
                  console.log('[WebView] ERR_UNKNOWN_URL_SCHEME 감지:', url);

                  if (url.startsWith('market://') || url.startsWith('intent://')) {
                    console.warn('[WebView] market:// 또는 intent:// 스킴 감지 - 백엔드에서 변환되어야 함:', url);
                  }

                  else {
                    const appSchemes = [
                      'tel:', 'mailto:', 'sms:', 'fb://', 'facebook://',
                      'coupang://', 'coupangapp://', '11st://', 'auction://', 'gmarket://',
                      'tmon://', 'wemakeprice://', 'lotteon://', 'ssg://', 'shinsegae://',
                      'instagram://', 'kakao://', 'kakaotalk://', 'line://', 'tiktok://',
                      'youtube://', 'twitter://', 'x://', 'netflix://', 'disneyplus://',
                      'watcha://', 'kakaopay://', 'naverpay://', 'toss://', 'payco://',
                    ];

                    const isAppScheme = appSchemes.some(scheme => url.startsWith(scheme));
                    if (isAppScheme) {
                      Linking.openURL(url).catch((err) => {
                        console.error('[WebView] 외부 앱 열기 실패:', err);
                      });
                    }
                  }
                }
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              mixedContentMode="always"
              originWhitelist={['*']}
              thirdPartyCookiesEnabled={true}
              sharedCookiesEnabled={true}
              />
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalRoot: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: '100%',
  },
  modalCampaignContainer: {
    paddingTop: 20, 
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 0,
    marginTop: 0,
    position: 'relative', 
    width: '100%',
    maxWidth: '100%',
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
  campaignBox: {
    width: '75%',
    alignSelf: 'center',
    padding: 10,
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
  buttonContainers: {
    justifyContent: 'center',
    width: '100%',
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
  webViewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
    marginTop: 0,
  },
  webViewCloseButton: {
    padding: 8,
    minWidth: 50,
  },
  webViewCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Roboto-Regular',
  },
  webViewTitle: {
    fontSize: FONTS.size.mmedium,
    fontFamily: 'Roboto-Bold',
    color: '#343a59',
    textAlign: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  webViewWrapper: {
    flex: 1,
    padding: 10,
    paddingBottom: Platform.OS === 'android' ? 40 : 10, 
  },
  webView: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

