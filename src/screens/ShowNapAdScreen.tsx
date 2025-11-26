import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  AppState,
  Modal,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context';
import { useAppNavigation, ROUTES } from '../navigation';
import { collectDeviceInfo } from '../utils/napApiUtils';
import { getNasmobAds, sendNasmobCallback, gatewayNodeJS } from '../services';
import { NAP_CONFIG } from '../config/napConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const ShowNapAdScreen: React.FC = () => {
  const { advertisementParams, resetAdvertisementParams } = useAppContext();
  const { navigate, reset } = useAppNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);
  const [adCallFailedModalVisible, setAdCallFailedModalVisible] = useState(false);
  const [showAlternativeAdButton, setShowAlternativeAdButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [hasOpenedUrl, setHasOpenedUrl] = useState(false);
  const [waitingForWebSocketResponse, setWaitingForWebSocketResponse] = useState(false);
  const [member, setMember] = useState<string>('');

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rewardProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rewardProcessingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<number>(2);

  useEffect(() => {
    if (!advertisementParams) {
      console.log('광고 파라미터가 없습니다. 이전 화면으로 이동');
      reset(ROUTES.map);
      return;
    }
  }, [advertisementParams, reset]);

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

  const initNStationAd = async (currentRetryCount: number = 0) => {
    try {
      console.log('Starting NStation advertisement initialization');
      setIsLoading(true);

      const deviceInfo = await collectDeviceInfo();

      const campid = advertisementParams?.campid || '';
      console.log('=== ShowNapAdScreen API 호출 정보 ===');
      console.log('member:', member);
      console.log('adid:', deviceInfo.adid);
      console.log('campid:', campid);
      console.log('advertisementParams:', JSON.stringify(advertisementParams, null, 2));
      console.log('deviceInfo:', JSON.stringify(deviceInfo, null, 2));
      console.log('=== API 호출 정보 끝 ===');

      const result = await getNasmobAds(
        member,
        deviceInfo.adid,
        deviceInfo,
        campid,
        navigate,
      );

      if (result.data && result.data.urlResult === 200 && result.data.urlAD) {
        setCampaignData(result.data);
        setIsLoading(false);
        return;
      } else {
        throw new Error(`URL 결과 실패: ${result.data?.urlResult}`);
      }
    } catch (error: any) {
      console.error(`NStation 광고 초기화 실패 (${currentRetryCount + 1}번째 시도):`, error);

      if (currentRetryCount < maxRetries) {
        console.log(`🔄 재시도 ${currentRetryCount + 1}/${maxRetries} - 에러: ${error.message}`);
        setRetryCount(currentRetryCount + 1);
        setIsRetrying(true);

        if (currentRetryCount > 15) {
          setShowAlternativeAdButton(true);
        }

        retryTimeoutRef.current = setTimeout(() => {
          initNStationAd(currentRetryCount + 1);
        }, 2000);
        return;
      }

      console.log(`❌ 최대 재시도 횟수(${maxRetries}) 초과 - 총 ${currentRetryCount}번 시도`);
      setIsLoading(false);
      setAdCallFailedModalVisible(true);
    }
  };

  useEffect(() => {
    if (member && advertisementParams) {
      initNStationAd();
    }
  }, [member, advertisementParams]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
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
      console.log('URL 이동 시도:', url);

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        console.log('✅ URL 이동 성공 - Map 화면으로 이동');
        setHasOpenedUrl(true);
        setIsLoading(false);

        resetAdvertisementParams();
        reset(ROUTES.map);
      } else {
        console.error('❌ 지원하지 않는 URL:', url);
        throw new Error('지원하지 않는 URL입니다.');
      }
    } catch (error) {
      console.error('❌ URL 이동 실패:', error);
      throw error;
    }
  };

  const handleAdCompletion = async () => {
    try {
      setIsProcessing(true);
      const deviceInfo = await collectDeviceInfo();

      if (!campaignData?.urlAD) {
        throw new Error('광고 URL이 없습니다.');
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
        setWaitingForWebSocketResponse(true);

        if (rewardProcessingTimeoutRef.current) {
          clearTimeout(rewardProcessingTimeoutRef.current);
          rewardProcessingTimeoutRef.current = null;
        }
        if (rewardProcessingIntervalRef.current) {
          clearInterval(rewardProcessingIntervalRef.current);
          rewardProcessingIntervalRef.current = null;
        }

        try {
          const response = await gatewayNodeJS(
            parseInt(advertisementParams?.advertisement || '0'),
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

            console.log('⏰ Processing your reward... 카운트다운 시작');
            countdownRef.current = 2;
            console.log(`⏱️ ${countdownRef.current}초 후 MapMainScreen으로 이동`);

            rewardProcessingIntervalRef.current = setInterval(() => {
              countdownRef.current--;
              if (countdownRef.current > 0) {
                console.log(`⏱️ ${countdownRef.current}초 후 MapMainScreen으로 이동`);
              } else {
                console.log('✅ 카운트다운 완료 - MapMainScreen으로 이동');
                if (rewardProcessingIntervalRef.current) {
                  clearInterval(rewardProcessingIntervalRef.current);
                  rewardProcessingIntervalRef.current = null;
                }
              }
            }, 1000);

            rewardProcessingTimeoutRef.current = setTimeout(() => {
              if (rewardProcessingIntervalRef.current) {
                clearInterval(rewardProcessingIntervalRef.current);
                rewardProcessingIntervalRef.current = null;
              }
              setWaitingForWebSocketResponse(false);
              resetAdvertisementParams();
              reset(ROUTES.map);
              rewardProcessingTimeoutRef.current = null;
            }, 2000);
          }
        } catch (error) {
          console.error('Error calling API:', error);
          setIsProcessing(false);

          console.log('⏰ Processing your reward... 카운트다운 시작 (에러 발생)');
          countdownRef.current = 2;
          console.log(`⏱️ ${countdownRef.current}초 후 MapMainScreen으로 이동`);

          rewardProcessingIntervalRef.current = setInterval(() => {
            countdownRef.current--;
            if (countdownRef.current > 0) {
              console.log(`⏱️ ${countdownRef.current}초 후 MapMainScreen으로 이동`);
            } else {
              console.log('✅ 카운트다운 완료 - MapMainScreen으로 이동');
              if (rewardProcessingIntervalRef.current) {
                clearInterval(rewardProcessingIntervalRef.current);
                rewardProcessingIntervalRef.current = null;
              }
            }
          }, 1000);

          rewardProcessingTimeoutRef.current = setTimeout(() => {
            if (rewardProcessingIntervalRef.current) {
              clearInterval(rewardProcessingIntervalRef.current);
              rewardProcessingIntervalRef.current = null;
            }
            setWaitingForWebSocketResponse(false);
            resetAdvertisementParams();
            reset(ROUTES.map);
            rewardProcessingTimeoutRef.current = null;
          }, 2000);
        }
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
      console.log('⏰ Processing your reward... 카운트다운 시작 (전체 에러)');
      countdownRef.current = 2;
      console.log(`⏱️ ${countdownRef.current}초 후 MapMainScreen으로 이동`);

      rewardProcessingIntervalRef.current = setInterval(() => {
        countdownRef.current--;
        if (countdownRef.current > 0) {
          console.log(`⏱️ ${countdownRef.current}초 후 MapMainScreen으로 이동`);
        } else {
          console.log('✅ 카운트다운 완료 - MapMainScreen으로 이동');
          if (rewardProcessingIntervalRef.current) {
            clearInterval(rewardProcessingIntervalRef.current);
            rewardProcessingIntervalRef.current = null;
          }
        }
      }, 1000);

      rewardProcessingTimeoutRef.current = setTimeout(() => {
        if (rewardProcessingIntervalRef.current) {
          clearInterval(rewardProcessingIntervalRef.current);
          rewardProcessingIntervalRef.current = null;
        }
        setWaitingForWebSocketResponse(false);
        resetAdvertisementParams();
        reset(ROUTES.map);
        rewardProcessingTimeoutRef.current = null;
      }, 2000);
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
    setIsRetrying(false);
    setShowBackButton(false);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    resetAdvertisementParams();
    reset(ROUTES.map);
  };

  const handleAdCallFailedOK = () => {
    console.log('광고 호출 실패 확인 버튼 클릭 - CameraMainScreen으로 이동');
    setAdCallFailedModalVisible(false);
    resetAdvertisementParams();
    reset(ROUTES.map);
  };

  const handleAlternativeAdButton = () => {
    console.log('다른 광고 보기 버튼 클릭 - CameraMainScreen으로 이동');
    resetAdvertisementParams();
    reset(ROUTES.map);
  };

  const handleCancel = () => {
    console.log('취소 버튼 클릭 - CameraMainScreen으로 이동');
    resetAdvertisementParams();
    reset(ROUTES.map);
  };

  if (!advertisementParams) {
    return null;
  }

  return (
    <View style={[styles.root, { backgroundColor: adCallFailedModalVisible ? '#000000A5' : 'white' }]}>
      <StatusBar style="dark" />

      {}
      {(isLoading || isProcessing || waitingForWebSocketResponse) && (
        <View style={styles.loadingContainer}>
          <SequentialDots />
          <Text style={styles.loadingText}>
            {waitingForWebSocketResponse
              ? 'Processing your reward...'
              : '광고를 불러오는중입니다. 광고의 리워드는 해당 광고 완료후 진행됩니다. 완료후 약간의 시간 지연이 있습니다'}
          </Text>

          {waitingForWebSocketResponse && <SequentialDots />}

          {retryCount > 0 && (
            <Text style={styles.retryText}>
              광고 확인중입니다
            </Text>
          )}

          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackButtonPress}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          )}

          {showAlternativeAdButton && (
            <TouchableOpacity
              style={styles.alternativeAdButton}
              onPress={handleAlternativeAdButton}
              activeOpacity={0.7}
            >
              <Text style={styles.alternativeAdButtonText}>다른 광고 보기</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {}
      {!isLoading && !isProcessing && !waitingForWebSocketResponse && campaignData && (
        <View style={styles.campaignContainer}>
          <Text style={styles.campaignTitle}>
            {campaignData.name || '캠페인 정보'}
          </Text>
          <Text style={styles.campaignReward}>
            reward : {(advertisementParams.xrunPrice || 0).toFixed(2)} XRUN
          </Text>
          <Text style={styles.campaignDesc}>
            {campaignData.rewarddesc || '캠페인 설명'}
          </Text>

          {}
          {advertisementParams.joindesc && advertisementParams.joindesc !== '' && (
            <View style={styles.joinDescContainer}>
              <Text style={styles.joinDescTitle}>참여 방법</Text>
              <ScrollView 
                style={styles.joinDescScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <Text style={styles.joinDescText}>
                  {advertisementParams.joindesc}
                </Text>
              </ScrollView>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.watchAdButton}
              onPress={() => {
                console.log('광고 보기 버튼 클릭');
                if (campaignData.urlAD) {
                  openUrlAD(campaignData.urlAD);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.watchAdButtonText}>광고 보기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      <Modal
        transparent
        animationType="slide"
        visible={adCallFailedModalVisible}
        onRequestClose={() => setAdCallFailedModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              광고 호출에 실패했습니다
            </Text>
            <Text style={styles.modalSubText}>
              여러 번 시도했으나 광고 호출에 실패했습니다. 이전 페이지로 이동합니다.
            </Text>
            <TouchableOpacity onPress={handleAdCallFailedOK} style={styles.okButton}>
              <Text style={styles.okButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000A5',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  loadingText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
    flexWrap: 'wrap',
  },
  retryText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'center',
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
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  modalSubText: {
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
    color: '#343a59',
    textAlign: 'center',
  },
  campaignReward: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
    color: '#388Dc8',
    textAlign: 'center',
  },
  campaignDesc: {
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#495057',
    lineHeight: 18,
    textAlign: 'left',
  },
});

