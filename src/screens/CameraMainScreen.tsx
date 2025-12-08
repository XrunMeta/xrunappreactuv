import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
  AppState,
  Modal,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { BottomNavigationBar } from '../components';
import { FONTS } from '../constants';
import { TokenData, SpotData } from '../types';
import { fetchMapMarkerData, getStoredTopAd5 } from '../services';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { ShowNapAdScreen } from './ShowNapAdScreen';

const { width, height } = Dimensions.get('window');

const spots = [
  { spotID: 1, x: 0, y: 0 },
  { spotID: 2, x: -100, y: 50 },
  { spotID: 3, x: 100, y: 50 },
  { spotID: 4, x: -50, y: 150 },
];

const getRandomOffset = (value: number, range: number): number => {
  return value + (Math.random() * (range * 2) - range);
};

interface TokenComponentProps {
  token: TokenData;
  onPress: () => void; 
  animationRefs: React.MutableRefObject<Map<number, React.MutableRefObject<Animated.CompositeAnimation | null>>>;
  appState: string;
  rageProgress: number;
  isRageMode: boolean;
  rageColor: string;
  calculateScaleBasedOnDistance: (distance: number) => number;
}

const TokenComponent: React.FC<TokenComponentProps> = ({
  token,
  onPress,
  animationRefs,
  appState,
  rageProgress,
  isRageMode,
  rageColor,
  calculateScaleBasedOnDistance,
}) => {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const shakeAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const isAnimating = useRef(true);

  const distance = token.distance || 0;
  const decorationHeight = Math.max(40, Math.min(200, distance * 4 + 40));

  const startShakeAnimation = useCallback(() => {
    if (!isAnimating.current) {
      return;
    }

    if (shakeAnimation.current) {
      shakeAnimation.current.stop();
    }

    const bezierCurves = [
      Easing.bezier(0.25, 0.1, 0.25, 1),
      Easing.bezier(0.42, 0, 0.58, 1),
      Easing.bezier(0.5, 0, 0.75, 0.9),
      Easing.bezier(0.15, 0.85, 0.85, 0.15),
      Easing.bezier(0.68, -0.55, 0.27, 1.55),
    ];

    const randomDelay = Math.random() * (3000 - 2000) + 2000;

    shakeAnimation.current = Animated.sequence([
      Animated.timing(position, {
        toValue: {
          x: getRandomOffset(spots[token.spotID - 1]?.x || 0, 70),
          y: getRandomOffset(spots[token.spotID - 1]?.y || 0, 200),
        },
        duration: 300,
        easing: bezierCurves[0],
        useNativeDriver: true,
      }),
      Animated.delay(randomDelay),
    ]);

    shakeAnimation.current.start(() => {
      if (isAnimating.current) {
        startShakeAnimation();
      }
    });
  }, [token.spotID, position]);

  const animateObject = useCallback(() => {
    if (!isAnimating.current) {
      return;
    }

    const direction = Math.random() < 0.5 ? -1 : 1;
    const throwDistance = 400 * direction;
    const spotIndex = token.spotID - 1;
    const spot = spots[spotIndex] || spots[0];

    Animated.parallel([
      Animated.timing(position, {
        toValue: {
          x: spot.x + throwDistance,
          y: spot.y - 200,
        },
        duration: 1,
        easing: Easing.circle,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isAnimating.current) {
        startShakeAnimation();
        setTimeout(() => {
          if (isAnimating.current) {
            stopShakeAndStartExit();
          }
        }, 300000); 
      }
    });
  }, [token.spotID, position, fadeAnim, startShakeAnimation]);

  const stopShakeAndStartExit = useCallback(() => {
    if (!isAnimating.current) {
      return;
    }

    if (shakeAnimation.current) {
      shakeAnimation.current.stop();
    }

    const direction = Math.random() < 0.5 ? -1 : 1;
    const throwDistance = 400 * direction;
    const spotIndex = token.spotID - 1;
    const spot = spots[spotIndex] || spots[0];

    Animated.parallel([
      Animated.timing(position, {
        toValue: {
          x: spot.x + throwDistance,
          y: spot.y,
        },
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        if (isAnimating.current) {
          animateObject();
        }
      }, 100);
    });
  }, [token.spotID, position, animateObject]);

  useEffect(() => {
    animationRefs.current.set(token.spotID, shakeAnimation);
    return () => {
      animationRefs.current.delete(token.spotID);
    };
  }, [token.spotID, animationRefs]);

  useEffect(() => {
    if (appState === 'active') {
      isAnimating.current = true;
      if (shakeAnimation.current) {
        startShakeAnimation();
      }
    } else if (appState.match(/inactive|background/)) {
      isAnimating.current = false;
      if (shakeAnimation.current) {
        shakeAnimation.current.stop();
      }
    }
  }, [appState, startShakeAnimation]);

  useEffect(() => {
    position.setValue({
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
    });

    const blinkSpeed = Math.max(100, 300 - rageProgress * 2);
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: isRageMode ? 0.2 : 0,
          duration: blinkSpeed,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: blinkSpeed * 0.8,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    animateObject();
  }, [animateObject, position, blinkAnim, rageProgress, isRageMode]);

  const spotIndex = token.spotID - 1;
  const spot = spots[spotIndex] || spots[0];

  return (
    <Animated.View
      style={[
        styles.tokenSpot,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateX: position.x.interpolate({
                inputRange: [-200, 200],
                outputRange: [-200, 200],
              }),
            },
            {
              translateY: position.y.interpolate({
                inputRange: [-200, 200],
                outputRange: [-200, 200],
              }),
            },
          ],
        },
      ]}>
      {}
      <View
        style={{
          position: 'absolute',
          bottom: -decorationHeight + 47,
          left: '50%',
          marginLeft: -0.5,
          width: 2,
          height: decorationHeight,
          backgroundColor: 'white',
          opacity: 0.8,
          zIndex: -1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -decorationHeight + 47,
          left: '50%',
          marginLeft: -4,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'white',
          opacity: 0.9,
          zIndex: -1,
        }}
      />

      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.tokenButtonContainer,
          {
            transform: [
              { scale: calculateScaleBasedOnDistance(distance) },
            ],
          },
        ]}
        activeOpacity={0.7}>
        <View
          style={[
            styles.tokenButton,
            {
              backgroundColor: isRageMode ? '#1E40AF' : '#161d2d',
              borderColor: '#E5E5E5',
              shadowColor: isRageMode ? '#3B82F6' : '#FCD34D',
              shadowOpacity: isRageMode ? 0.8 : 0.5,
              shadowRadius: isRageMode ? 10 : 5,
              elevation: isRageMode ? 15 : 8,
            },
          ]}>
          {}
          {parseFloat(String(distance)) < 30 && (
            <Animated.Image
              source={
                isRageMode
                  ? require('../../assets/images/icon_catch_rage.png')
                  : require('../../assets/images/icon_catch.png')
              }
              style={[
                styles.blinkImage,
                {
                  opacity: blinkAnim,
                },
                isRageMode && { top: -90 },
              ]}
            />
          )}
          {iconXrunWhite && (
            <Image
              source={iconXrunWhite}
              style={[
                styles.tokenIcon,
                { marginTop: 3 },
                isRageMode && { tintColor: rageColor },
              ]}
            />
          )}
          <View style={{ alignItems: 'center', marginTop: -4 }}>
            <Text style={styles.tokenPriceText}>
              {(() => {

                const price = token?.xrunPrice || 0;
                const priceValue = parseFloat(String(price));
                console.log(`💰 [TokenComponent] 토큰 spotID=${token.spotID} 가격:`, {
                  xrunPrice: token?.xrunPrice,
                  priceValue,
                });
                return isNaN(priceValue) ? '0.00' : priceValue.toFixed(2);
              })()}
            </Text>
            <Text style={styles.tokenDistanceText}>
              {token?.distance ? parseFloat(String(token.distance)).toFixed(1) + 'm' : '0.0m'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

let iconWallet: any = null;
let iconShop: any = null;
let iconReferral: any = null;
let iconUser: any = null;
let iconMapPoint: any = null;

try {
  iconWallet = require('../../assets/images/icon_wallet.png');
} catch (e) {
  console.warn('icon_wallet.png not found');
}

try {
  iconShop = require('../../assets/images/icon_shop.png');
} catch (e) {
  console.warn('icon_shop.png not found');
}

try {
  iconReferral = require('../../assets/images/icon_referral.png');
} catch (e) {
  console.warn('icon_referral.png not found');
}

try {
  iconUser = require('../../assets/images/icon_user.png');
} catch (e) {
  console.warn('icon_user.png not found');
}

try {
  iconMapPoint = require('../../assets/images/icon_mapPoint.png');
} catch (e) {
  console.warn('icon_mapPoint.png not found');
}

let iconXrunWhite: any = null;
let iconCatch: any = null;

try {
  iconXrunWhite = require('../../assets/images/icon_xrun_white.png');
} catch (e) {
  console.warn('icon_xrun_white.png not found');
}

try {
  iconCatch = require('../../assets/images/icon_catch.png');
} catch (e) {
  console.warn('icon_catch.png not found');
}

interface CameraMainScreenProps {
  activeTab?: 'Map' | 'Camera';
  onTabChange?: (tab: 'Map' | 'Camera') => void;
}

export const CameraMainScreen: React.FC<CameraMainScreenProps> = ({
  activeTab = 'Camera',
  onTabChange,
}) => {
  const { navigate, reset } = useAppNavigation();
  const { t } = useTranslation();
  const { setAdvertisementParams } = useAppContext();
  const { showAlert } = useAlertDialog();
  const [permission, requestPermission] = useCameraPermissions();

  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);

  const bottomPanelBottom = useRef(new Animated.Value(20)).current;

  const [showAdModal, setShowAdModal] = useState(false);

  useEffect(() => {
    if (!showAdModal) {

      console.log('📱 [CameraMainScreen] 모달이 닫혔습니다. 포커스 확인 중...');
      console.log('📊 [CameraMainScreen] 현재 상태:', {
        showAdModal,
        activeTab,
        loading,
        tokensCount: tokens?.length ?? 0,
        appState,
      });

      const delay = Platform.OS === 'ios' ? 500 : 100;

      const timeoutId = setTimeout(() => {
        console.log('✅ [CameraMainScreen] 포커스 확인 완료');
        console.log('📊 [CameraMainScreen] AppState:', AppState.currentState);

        if (Platform.OS === 'ios') {
          console.log('🔄 [CameraMainScreen] iOS 강제 복원 시작');

          setRefreshKey(prev => prev + 1);

          const currentAppState = AppState.currentState;
          if (currentAppState !== 'active') {
            console.log('⚠️ [CameraMainScreen] AppState가 active가 아닙니다:', currentAppState);
          }

          setTimeout(() => {
            console.log('🔄 [CameraMainScreen] iOS 추가 리렌더링 트리거');
            setRefreshKey(prev => prev + 1);
          }, 200);
        }
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [showAdModal, activeTab, loading, tokens, appState]);

  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [coinsData, setCoinsData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const currentIndexRef = useRef(0);
  const chunkSize = 4;

  const [refreshKey, setRefreshKey] = useState(0);

  const [rageProgress, setRageProgress] = useState(0);
  const [isRageMode, setIsRageMode] = useState(false);
  const rageColor = '#60A5FA'; 

  const loadRageProgress = useCallback(async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('rageProgress');
      const lastUpdateTime = await AsyncStorage.getItem('rageProgressLastUpdate');

      if (savedProgress !== null && lastUpdateTime !== null) {
        const currentTime = Date.now();
        const lastUpdate = parseInt(lastUpdateTime);
        const timeDifference = currentTime - lastUpdate;
        const oneDayInMs = 24 * 60 * 60 * 1000; 

        if (timeDifference > oneDayInMs) {
          console.log('More than 1 day passed, resetting rage progress');
          await resetRageProgress();
        } else {
          const progress = parseFloat(savedProgress);
          setRageProgress(progress);
          setIsRageMode(progress >= 100);
          console.log(
            `Loaded rage progress: ${progress}% (last updated: ${new Date(
              lastUpdate,
            ).toLocaleString()})`,
          );
        }
      } else {

        await resetRageProgress();
      }
    } catch (error) {
      console.log('Error loading rage progress:', error);
      await resetRageProgress();
    }
  }, []);

  const saveRageProgress = useCallback(async (progress: number) => {
    try {
      const currentTime = Date.now();
      await AsyncStorage.setItem('rageProgress', progress.toString());
      await AsyncStorage.setItem(
        'rageProgressLastUpdate',
        currentTime.toString(),
      );
      console.log(
        `Saved rage progress: ${progress}% at ${new Date(
          currentTime,
        ).toLocaleString()}`,
      );
    } catch (error) {
      console.log('Error saving rage progress:', error);
    }
  }, []);

  const resetRageProgress = useCallback(async () => {
    try {
      const currentTime = Date.now();
      await AsyncStorage.setItem('rageProgress', '0');
      await AsyncStorage.setItem(
        'rageProgressLastUpdate',
        currentTime.toString(),
      );
      setRageProgress(0);
      setIsRageMode(false);
      console.log('Rage progress reset to 0');
    } catch (error) {
      console.log('Error resetting rage progress:', error);
    }
  }, []);

  const resetRageProgressOnLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('rageProgress');
      await AsyncStorage.removeItem('rageProgressLastUpdate');
      setRageProgress(0);
      setIsRageMode(false);
      console.log('Rage progress cleared on logout');
    } catch (error) {
      console.log('Error clearing rage progress on logout:', error);
    }
  }, []);

  const checkUserLoginStatus = useCallback(async () => {
    try {
      const currentUser = await AsyncStorage.getItem('userData');

      if (currentUser) {
        await loadRageProgress();
      } else {

        await resetRageProgressOnLogout();
      }
    } catch (error) {
      console.log('Error checking user login status:', error);
      await resetRageProgress();
    }
  }, [loadRageProgress, resetRageProgress, resetRageProgressOnLogout]);

  const updateRageProgress = useCallback(async (increment: number) => {
    const newProgress = Math.min(100, Math.max(0, rageProgress + increment));
    setRageProgress(newProgress);

    await saveRageProgress(newProgress);

    setIsRageMode(newProgress >= 100);

    console.log(
      `Rage progress updated: ${newProgress}% (${Math.floor(
        newProgress / 2,
      )}/50 ads)`,
    );
  }, [rageProgress, saveRageProgress]);

  const handleRageModeActivated = useCallback(() => {
    console.log('🔥 RAGE MODE ACTIVATED! Double rewards enabled!');
    setIsRageMode(true);
  }, []);

  const handleRageModeDeactivated = useCallback(() => {
    console.log('Rage mode deactivated');
    setIsRageMode(false);
  }, []);

  const animationRefs = useRef<Map<number, React.MutableRefObject<Animated.CompositeAnimation | null>>>(new Map());

  const [appState, setAppState] = useState(AppState.currentState);

  const hasLoadedDataRef = useRef(false);

  const autoAdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoAdTriggeredRef = useRef(false); 

  const hasRequestedPermissionRef = useRef(false);

  useEffect(() => {
    const requestCameraPermission = async () => {

      if (hasRequestedPermissionRef.current) {
        return;
      }

      if (permission === null) {
        return;
      }

      if (permission.granted) {
        console.log('카메라 권한이 이미 허용되어 있습니다.');
        hasRequestedPermissionRef.current = true;
        return;
      }

      console.log('카메라 권한 요청 중...');
      hasRequestedPermissionRef.current = true;
      const result = await requestPermission();
      console.log('카메라 권한 요청 결과:', result);

      if (!result.granted) {

        await showAlert(
          '카메라 권한 필요',
          '카메라를 사용하려면 카메라 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
      }
    };

    requestCameraPermission();
  }, [permission, requestPermission, showAlert]);

  const organizeData = useCallback((oCoinData: any[]) => {
    if (oCoinData.length === 0) {
      setTokens([]);
      return;
    }

    console.log('🔄 [organizeData] 호출:', {
      currentIndex: currentIndexRef.current,
      totalDataLength: oCoinData.length,
      chunkSize: chunkSize,
    });

    let nextData: any[] = [];
    let actualChunkSize = Math.min(chunkSize, oCoinData.length);

    if (currentIndexRef.current + actualChunkSize > oCoinData.length) {

      nextData = [
        ...oCoinData.slice(currentIndexRef.current),
        ...oCoinData.slice(0, (currentIndexRef.current + actualChunkSize) % oCoinData.length),
      ];
      currentIndexRef.current = (currentIndexRef.current + actualChunkSize) % oCoinData.length;
    } else {

      nextData = oCoinData.slice(currentIndexRef.current, currentIndexRef.current + actualChunkSize);
      currentIndexRef.current = (currentIndexRef.current + actualChunkSize) % oCoinData.length;
    }

    console.log('📋 [organizeData] 선택된 데이터 (처음 4개):', nextData.slice(0, 4).map((d, idx) => ({
      index: idx,
      distance: d.distance,
      advertisement: d.advertisement,
      campid: d.campid,
      name: d.name,
      xrunPrice: d.xrunPrice,
    })));

    const newOrganizedData = nextData.map((data, index) => {
      return { ...spots[index % spots.length], ...data };
    });

    console.log('✅ [organizeData] 최종 토큰 데이터:', newOrganizedData.map((t, idx) => ({
      spotID: t.spotID,
      distance: t.distance,
      advertisement: t.advertisement,
      campid: t.campid,
      name: t.name,
      xrunPrice: t.xrunPrice,
    })));

    setTokens(newOrganizedData);
  }, []);

  const loadTokenData = useCallback(async (forceRefresh: boolean = false) => {

    if (hasLoadedDataRef.current && !forceRefresh) {
      return;
    }

    try {
      setLoading(true);
      console.log('=== CameraMainScreen 데이터 로딩 시작 ===', forceRefresh ? '(강제 새로고침)' : '');

      await checkUserLoginStatus();

      if (!forceRefresh) {
        const astorCoinsData = await AsyncStorage.getItem('astorCoinsData');

        if (astorCoinsData) {
          console.log('✅ AsyncStorage에서 astorCoinsData 발견');
          try {
            const coinsData = JSON.parse(astorCoinsData);

            if (coinsData && Array.isArray(coinsData) && coinsData.length > 0) {

              const validatedCoinsData = coinsData.map((coin: any) => {

                const originalXrunPrice = coin.xrunPrice || coin.xrunprice || coin.price || coin.coins || 0;

                return {
                  ...coin, 
                  iconurl: coin.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                  joindesc: coin.joindesc || '',
                  name: coin.name || coin.title || coin.brand || 'Unknown coin',
                  xrunprice: coin.xrunprice || coin.xrunPrice || coin.price || coin.coins || '',
                  xrunPrice: originalXrunPrice, 
                  campid: coin.campid || coin.campId || '',

                  advertisement: coin.advertisement || coin.adid || coin.ad || coin.coin || '',
                };
              });

              console.log('✅ validatedCoinsData 생성 완료:', validatedCoinsData.length, '개');

              try {
                const topAd5Response = await getStoredTopAd5();
                if (topAd5Response && Array.isArray(topAd5Response) && topAd5Response.length > 0) {
                  console.log('✅ [CameraMainScreen] TopAd5 데이터 발견:', topAd5Response.length, '개');

                  console.log('🔍 [CameraMainScreen] TopAd5 데이터 구조 확인 (첫 번째 항목):', {
                    keys: Object.keys(topAd5Response[0] || {}),
                    firstItem: topAd5Response[0],
                  });

                  const sortedCoinsData = [...validatedCoinsData].sort((a, b) => {
                    const distanceA = parseFloat(String(a.distance || 0));
                    const distanceB = parseFloat(String(b.distance || 0));
                    return distanceA - distanceB; 
                  });

                  console.log('📊 [CameraMainScreen] 거리 순 정렬 완료 (가까운 순서)');

                  const mappedCoinsData = sortedCoinsData.map((coin: any, index: number) => {
                    const adIndex = index % topAd5Response.length;
                    const mappedAd = topAd5Response[adIndex];

                    console.log(`🔗 [CameraMainScreen] 토큰 ${index} 매핑:`, {
                      distance: coin.distance,
                      adIndex,
                      adName: mappedAd?.name || '없음',
                      adCompany: mappedAd?.ad_company || '없음',
                      originalAdvertisement: coin.advertisement,
                      originalCampid: coin.campid,
                      mappedAdvertisement: mappedAd?.advertisement || mappedAd?.adid || mappedAd?.ad || mappedAd?.coin,
                      mappedCampid: mappedAd?.campid,
                    });

                    return {
                      ...coin,

                      name: mappedAd?.name || coin.name || coin.title || coin.brand || 'Unknown coin',
                      iconurl: mappedAd?.iconurl || coin.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                      joindesc: mappedAd?.joindesc || coin.joindesc || '',
                      xrunPrice: mappedAd?.xrunPrice || coin.xrunPrice || coin.xrunprice || coin.price || coin.coins || 0,
                      xrunprice: mappedAd?.xrunPrice || coin.xrunprice || coin.xrunPrice || coin.price || coin.coins || '',
                      campid: mappedAd?.campid || coin.campid || coin.campId || '',

                      advertisement: mappedAd?.advertisement || mappedAd?.adid || mappedAd?.ad || (mappedAd?.campid ? String(mappedAd.campid) : '') || coin.advertisement || coin.adid || coin.ad || coin.coin || '',

                      thumbnail: mappedAd?.thumbnail || coin.thumbnail,
                      ad_company: mappedAd?.ad_company || coin.ad_company,
                      coins: mappedAd?.coins?.toString() || coin.coins,
                      brandlogo: mappedAd?.brandlogo || coin.brandlogo,
                      adthumbnail2: mappedAd?.adthumbnail2 || coin.adthumbnail2,
                      symbolimg: mappedAd?.symbolimg || coin.symbolimg,
                    };
                  });

                  console.log('✅ [CameraMainScreen] TopAd5 매핑 완료:', mappedCoinsData.length, '개 토큰');

                  console.log('🔍 [loadTokenData] mappedCoinsData 고유 데이터 확인 (처음 10개):');
                  mappedCoinsData.slice(0, 10).forEach((coin: any, idx: number) => {
                    console.log(`📋 mappedCoinsData[${idx}]:`, {
                      name: coin.name,
                      advertisement: coin.advertisement,
                      campid: coin.campid,
                      xrunPrice: coin.xrunPrice,
                      distance: coin.distance,
                      coin: coin.coin,
                      brand: coin.brand,
                    });
                  });

                  const allAdvertisements = mappedCoinsData.map((c: any) => c.advertisement).filter((v: any) => v != null && v !== undefined && v !== '');
                  const allCampids = mappedCoinsData.map((c: any) => c.campid).filter((v: any) => v != null && v !== undefined && v !== '');
                  const uniqueAllAds = Array.from(new Set(allAdvertisements));
                  const uniqueAllCampids = Array.from(new Set(allCampids));
                  console.log('📊 [loadTokenData] 전체 데이터 고유값 통계:', {
                    total: mappedCoinsData.length,
                    uniqueAdvertisements: uniqueAllAds.length,
                    uniqueCampids: uniqueAllCampids.length,
                    advertisementValues: uniqueAllAds.slice(0, 10),
                    campidValues: uniqueAllCampids.slice(0, 10),
                  });

                  setCoinsData(mappedCoinsData);

                  currentIndexRef.current = 0;
                  console.log('🔄 [CameraMainScreen] TopAd5 매핑 후 인덱스 리셋 (항상 처음 4개 사용)');

                  organizeData(mappedCoinsData);
                } else {
                  console.log('⚠️ [CameraMainScreen] TopAd5 데이터 없음, 기존 데이터 사용');

                  console.log('🔍 [loadTokenData] validatedCoinsData 고유 데이터 확인 (처음 10개):');
                  validatedCoinsData.slice(0, 10).forEach((coin: any, idx: number) => {
                    console.log(`📋 validatedCoinsData[${idx}]:`, {
                      name: coin.name,
                      advertisement: coin.advertisement,
                      campid: coin.campid,
                      xrunPrice: coin.xrunPrice,
                      coin: coin.coin,
                      brand: coin.brand,
                    });
                  });

                  const allAdvertisements = validatedCoinsData.map((c: any) => c.advertisement).filter((v: any) => v != null && v !== undefined && v !== '');
                  const allCampids = validatedCoinsData.map((c: any) => c.campid).filter((v: any) => v != null && v !== undefined && v !== '');
                  const uniqueAllAds = Array.from(new Set(allAdvertisements));
                  const uniqueAllCampids = Array.from(new Set(allCampids));
                  console.log('📊 [loadTokenData] 전체 데이터 고유값 통계:', {
                    total: validatedCoinsData.length,
                    uniqueAdvertisements: uniqueAllAds.length,
                    uniqueCampids: uniqueAllCampids.length,
                    advertisementValues: uniqueAllAds.slice(0, 10),
                    campidValues: uniqueAllCampids.slice(0, 10),
                  });

                  setCoinsData(validatedCoinsData);

                  organizeData(validatedCoinsData);
                }
              } catch (topAd5Error) {
                console.error('❌ [CameraMainScreen] TopAd5 데이터 가져오기 실패:', topAd5Error);
                console.log('⚠️ 기존 데이터 사용');

                console.log('🔍 [loadTokenData] validatedCoinsData 고유 데이터 확인 (처음 10개):');
                validatedCoinsData.slice(0, 10).forEach((coin: any, idx: number) => {
                  console.log(`📋 validatedCoinsData[${idx}]:`, {
                    name: coin.name,
                    advertisement: coin.advertisement,
                    campid: coin.campid,
                    xrunPrice: coin.xrunPrice,
                    coin: coin.coin,
                    brand: coin.brand,
                  });
                });

                const allAdvertisements = validatedCoinsData.map((c: any) => c.advertisement).filter((v: any) => v != null && v !== undefined && v !== '');
                const allCampids = validatedCoinsData.map((c: any) => c.campid).filter((v: any) => v != null && v !== undefined && v !== '');
                const uniqueAllAds = Array.from(new Set(allAdvertisements));
                const uniqueAllCampids = Array.from(new Set(allCampids));
                console.log('📊 [loadTokenData] 전체 데이터 고유값 통계:', {
                  total: validatedCoinsData.length,
                  uniqueAdvertisements: uniqueAllAds.length,
                  uniqueCampids: uniqueAllCampids.length,
                  advertisementValues: uniqueAllAds.slice(0, 10),
                  campidValues: uniqueAllCampids.slice(0, 10),
                });

                setCoinsData(validatedCoinsData);

                organizeData(validatedCoinsData);
              }

              hasLoadedDataRef.current = true;
              setLoading(false);
              return;
            }
          } catch (parseError) {
            console.error('astorCoinsData 파싱 오류:', parseError);
          }
        }
      }

      if (forceRefresh) {
        console.log('🔄 서버에서 새 데이터 가져오기');
      } else {
        console.log('⚠️ AsyncStorage에 데이터 없음, API 호출');
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('위치 권한이 없습니다.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        console.log('userData가 없습니다.');
        setLoading(false);
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member?.toString() || '';
      if (!member) {
        console.log('userData에 member가 없습니다.');
        setLoading(false);
        return;
      }

      const markerData = await fetchMapMarkerData(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        member,
        navigate,
      );

      if (markerData && markerData.length > 0) {

        await AsyncStorage.setItem('astorCoinsData', JSON.stringify(markerData));

        const validatedCoinsData = markerData.map((coin: any) => {

          const originalXrunPrice = coin.xrunPrice || coin.xrunprice || coin.price || coin.coins || 0;

          console.log(`🔍 [loadTokenData API] 코인 원본 데이터 확인:`, {
            coin: coin.coin,
            advertisement: coin.advertisement,
            xrunPrice: coin.xrunPrice,
            xrunprice: coin.xrunprice,
            price: coin.price,
            coins: coin.coins,
            originalXrunPrice,
          });

          return {
            ...coin, 
            iconurl: coin.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
            joindesc: coin.joindesc || '',
            name: coin.name || coin.title || coin.brand || 'Unknown coin',
            xrunprice: coin.xrunprice || coin.xrunPrice || coin.price || coin.coins || '',
            xrunPrice: originalXrunPrice, 
            campid: coin.campid || coin.campId || '',

            advertisement: coin.advertisement || coin.adid || coin.ad || coin.coin || '',
          };
        });

        try {
          const topAd5Response = await getStoredTopAd5();
          if (topAd5Response && Array.isArray(topAd5Response) && topAd5Response.length > 0) {
            console.log('✅ [CameraMainScreen API] TopAd5 데이터 발견:', topAd5Response.length, '개');

            console.log('🔍 [CameraMainScreen API] TopAd5 데이터 구조 확인 (첫 번째 항목):', {
              keys: Object.keys(topAd5Response[0] || {}),
              firstItem: topAd5Response[0],
            });

            const sortedCoinsData = [...validatedCoinsData].sort((a, b) => {
              const distanceA = parseFloat(String(a.distance || 0));
              const distanceB = parseFloat(String(b.distance || 0));
              return distanceA - distanceB; 
            });

            console.log('📊 [CameraMainScreen API] 거리 순 정렬 완료 (가까운 순서)');

            const mappedCoinsData = sortedCoinsData.map((coin: any, index: number) => {
              const adIndex = index % topAd5Response.length;
              const mappedAd = topAd5Response[adIndex];

              console.log(`🔗 [CameraMainScreen API] 토큰 ${index} 매핑:`, {
                distance: coin.distance,
                adIndex,
                adName: mappedAd?.name || '없음',
                adCompany: mappedAd?.ad_company || '없음',
                originalAdvertisement: coin.advertisement,
                originalCampid: coin.campid,
                mappedAdvertisement: mappedAd?.advertisement || mappedAd?.adid || mappedAd?.ad || mappedAd?.coin,
                mappedCampid: mappedAd?.campid,
              });

              return {
                ...coin,

                name: mappedAd?.name || coin.name || coin.title || coin.brand || 'Unknown coin',
                iconurl: mappedAd?.iconurl || coin.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: mappedAd?.joindesc || coin.joindesc || '',
                xrunPrice: mappedAd?.xrunPrice || coin.xrunPrice || coin.xrunprice || coin.price || coin.coins || 0,
                xrunprice: mappedAd?.xrunPrice || coin.xrunprice || coin.xrunPrice || coin.price || coin.coins || '',
                campid: mappedAd?.campid || coin.campid || coin.campId || '',

                advertisement: mappedAd?.advertisement || mappedAd?.adid || mappedAd?.ad || (mappedAd?.campid ? String(mappedAd.campid) : '') || coin.advertisement || coin.adid || coin.ad || coin.coin || '',

                thumbnail: mappedAd?.thumbnail || coin.thumbnail,
                ad_company: mappedAd?.ad_company || coin.ad_company,
                coins: mappedAd?.coins?.toString() || coin.coins,
                brandlogo: mappedAd?.brandlogo || coin.brandlogo,
                adthumbnail2: mappedAd?.adthumbnail2 || coin.adthumbnail2,
                symbolimg: mappedAd?.symbolimg || coin.symbolimg,
              };
            });

            console.log('✅ [CameraMainScreen API] TopAd5 매핑 완료:', mappedCoinsData.length, '개 토큰');

            setCoinsData(mappedCoinsData);

            currentIndexRef.current = 0;
            console.log('🔄 [CameraMainScreen API] TopAd5 매핑 후 인덱스 리셋 (항상 처음 4개 사용)');

            organizeData(mappedCoinsData);
          } else {
            console.log('⚠️ [CameraMainScreen API] TopAd5 데이터 없음, 기존 데이터 사용');

            setCoinsData(validatedCoinsData);

            organizeData(validatedCoinsData);
          }
        } catch (topAd5Error) {
          console.error('❌ [CameraMainScreen API] TopAd5 데이터 가져오기 실패:', topAd5Error);
          console.log('⚠️ 기존 데이터 사용');

          setCoinsData(validatedCoinsData);

          organizeData(validatedCoinsData);
        }
      } else {
        setCoinsData([]);
        setTokens([]);
      }

      hasLoadedDataRef.current = true;
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const calculateScaleBasedOnDistance = useCallback((distance: number): number => {
    const dist = parseFloat(String(distance));
    const minScale = 0.9; 
    const maxScale = 1.0; 
    const maxDistance = 30; 

    if (dist <= 0) return maxScale;
    if (dist >= maxDistance) return minScale;

    return maxScale - (maxScale - minScale) * (dist / maxDistance);
  }, []);

  const pauseAllAnimations = useCallback(() => {
    animationRefs.current.forEach((animationRef, spotID) => {
      if (animationRef && animationRef.current) {
        animationRef.current.stop();
        console.log(`⏸️ 토큰 ${spotID} 애니메이션 일시정지`);
      }
    });
  }, []);

  const resumeAllAnimations = useCallback(() => {
    animationRefs.current.forEach((animationRef, spotID) => {
      if (animationRef && animationRef.current) {

        console.log(`🔄 토큰 ${spotID} 애니메이션 재시작 준비`);
      }
    });
  }, []);

  useEffect(() => {
    const initializeData = async () => {

      await checkUserLoginStatus();

      if (!hasLoadedDataRef.current) {
        loadTokenData(false); 
      }
    };

    initializeData();
  }, []); 

  useEffect(() => {

    const interval = setInterval(() => {
      console.log('⏰ 3분 경과 - 다른 코인들로 교체');
      if (coinsData.length > 0) {
        organizeData(coinsData);
      }
    }, 180000); 

    return () => clearInterval(interval); 
  }, [coinsData, organizeData]); 

  useEffect(() => {
    const handleAppStateChange = (nextAppState: typeof appState) => {
      console.log('📱 AppState 변경:', appState, '->', nextAppState);

      if (appState.match(/inactive|background/) && nextAppState === 'active') {

        console.log('🔄 앱 활성화 - 토큰 애니메이션 재시작');
        resumeAllAnimations();
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {

        console.log('⏸️ 앱 비활성화 - 토큰 애니메이션 일시정지');
        pauseAllAnimations();
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [appState, pauseAllAnimations, resumeAllAnimations]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshKey(prevKey => prevKey + 1);
      console.log('🔄 [CameraMainScreen] 3분 경과 - 컴포넌트 리프레시 (refreshKey 증가)');
    }, 180000); 

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    return () => {
      if (autoAdTimeoutRef.current) {
        clearTimeout(autoAdTimeoutRef.current);
        autoAdTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log('🔄 selectedToken 변경 감지:', {
      spotID: selectedToken?.spotID,
      advertisement: selectedToken?.advertisement,
      campid: selectedToken?.campid,
      coin: selectedToken?.coin,
      xrunPrice: selectedToken?.xrunPrice,
      name: selectedToken?.name,
    });
    hasAutoAdTriggeredRef.current = false;
  }, [selectedToken]);

  useEffect(() => {
    console.log('📱 CameraMainScreen 포커스 받음');

    return () => {
      console.log('📱 CameraMainScreen 포커스 잃음 - 광고 초기화 중단');

      if (autoAdTimeoutRef.current) {
        clearTimeout(autoAdTimeoutRef.current);
        autoAdTimeoutRef.current = null;
        console.log('⏹️ 자동 광고 이동 타이머 정리됨');
      }

      hasAutoAdTriggeredRef.current = false;
      console.log('🔄 자동 광고 트리거 상태 리셋됨');
    };
  }, []); 

  useEffect(() => {
    if (showBottomPanel && selectedToken) {

      Animated.timing(bottomPanelBottom, {
        toValue: 140, 
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start();
    } else {

      Animated.timing(bottomPanelBottom, {
        toValue: 20, 
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start();
    }
  }, [showBottomPanel, selectedToken, bottomPanelBottom]);

  const handleNavItemPress = (itemId: string) => {
    console.log('Navigation item pressed:', itemId);

    switch (itemId) {
      case 'wallet':
        navigate(ROUTES.wallet);
        break;
      case 'shop':
        navigate(ROUTES.shopTicket);
        break;
      case 'referral':
        navigate(ROUTES.referralSettlement);
        break;
      case 'info':
        navigate(ROUTES.myInfo);
        break;
      default:
        console.log('Unknown navigation item:', itemId);
    }
  };

  const handleTabChange = (tab: 'Map' | 'Camera') => {
    onTabChange?.(tab);
  };

  const showAdInModal = useCallback(async (token: TokenData) => {
    try {
      console.log('=== showAdInModal 함수 시작 ===');
      console.log('📥 전달받은 토큰 원본:', JSON.stringify(token, null, 2));

      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        console.log('userData가 없습니다.');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member?.toString() || '';

      if (!member) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      const advertisement = token.advertisement
        ? String(token.advertisement)
        : (token.coin ? String(token.coin) : '');
      const campid = token.campid ? String(token.campid) : '';

      if (!advertisement || advertisement === '' || advertisement === 'undefined') {
        console.error('❌ advertisement가 유효하지 않습니다');
        return;
      }

      if (!campid || campid === '' || campid === 'undefined') {
        console.error('❌ campid가 유효하지 않습니다');
        return;
      }

      const adParams = {
        member: member,
        advertisement: advertisement,
        coin: token.coin ? String(token.coin) : '',
        campid: campid,
        joindesc: token.joindesc || '',
        name: token.name || 'XRUN coin',
        xrunPrice: token.xrunPrice || 0,
        coinScreen: true,
      };

      console.log('✅ showAdInModal 최종 파라미터:', JSON.stringify(adParams, null, 2));

      setAdvertisementParams(adParams);

      setTimeout(() => {
        console.log('🔄 Context 업데이트 완료 - 모달 표시');
        setShowAdModal(true);
      }, 100);
    } catch (error) {
      console.error('❌ showAdInModal 오류:', error);
    }
  }, [setAdvertisementParams]);

  const navigateToAd = useCallback(async (token: TokenData) => {
    try {
      console.log('=== navigateToAd 함수 시작 ===');
      console.log('📥 전달받은 토큰 원본:', JSON.stringify(token, null, 2));
      console.log('🔍 navigateToAd 토큰 상세:', {
        spotID: token.spotID,
        advertisement: token.advertisement,
        campid: token.campid,
        coin: token.coin,
        xrunPrice: token.xrunPrice,
        name: token.name,
        brand: token.brand,
      });

      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        console.log('userData가 없습니다.');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member?.toString() || '';

      if (!member) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      const advertisement = token.advertisement
        ? String(token.advertisement)
        : (token.coin ? String(token.coin) : '');
      const campid = token.campid ? String(token.campid) : '';

      console.log('🔍 navigateToAd - advertisement/campid 추출:', {
        tokenAdvertisement: token.advertisement,
        tokenCampid: token.campid,
        extractedAdvertisement: advertisement,
        extractedCampid: campid,
        tokenSpotID: token.spotID,
        tokenCoin: token.coin,
      });

      if (!advertisement || advertisement === '' || advertisement === 'undefined') {
        console.error('❌ advertisement가 유효하지 않습니다:', {
          advertisement,
          tokenAdvertisement: token.advertisement,
          tokenCoin: token.coin,
        });
        return;
      }

      if (!campid || campid === '' || campid === 'undefined') {
        console.error('❌ campid가 유효하지 않습니다:', {
          campid,
          tokenCampid: token.campid,
          tokenSpotID: token.spotID,
        });
        return;
      }

      const adParams = {
        member: member,
        advertisement: advertisement,
        coin: token.coin ? String(token.coin) : '',
        campid: campid,
        joindesc: token.joindesc || '',
        name: token.name || 'XRUN coin',
        xrunPrice: token.xrunPrice || 0,
        coinScreen: true,
      };

      console.log('✅ navigateToAd 최종 파라미터:', JSON.stringify(adParams, null, 2));
      console.log('🔍 파라미터 상세:', {
        member,
        advertisement,
        campid,
        coin: token.coin,
        name: token.name,
        xrunPrice: token.xrunPrice,
        joindesc: token.joindesc,
      });

      console.log('🔄 Context에 광고 파라미터 설정 전:', {
        advertisement: adParams.advertisement,
        campid: adParams.campid,
        coin: adParams.coin,
        name: adParams.name,
      });
      setAdvertisementParams(adParams);
      console.log('✅ Context에 광고 파라미터 설정 완료:', {
        advertisement: adParams.advertisement,
        campid: adParams.campid,
        coin: adParams.coin,
        name: adParams.name,
      });

      console.log('🚀 ShowNapAd 화면으로 이동 시작 (reset 사용)...');
      console.log('🔍 이동 시 전달할 파라미터:', {
        advertisement: adParams.advertisement,
        campid: adParams.campid,
        coin: adParams.coin,
        name: adParams.name,
      });
      reset(ROUTES.showNapAd);
      console.log('✅ ShowNapAd 화면으로 이동 완료');
    } catch (error) {
      console.error('❌ navigateToAd 오류:', error);
    }
  }, [navigate, reset, setAdvertisementParams]);

  useEffect(() => {
    if (showBottomPanel && selectedToken && !hasAutoAdTriggeredRef.current) {

      const currentToken: TokenData = {
        ...selectedToken,
        advertisement: selectedToken.advertisement,
        campid: selectedToken.campid,
        coin: selectedToken.coin,
        xrunPrice: selectedToken.xrunPrice,
        name: selectedToken.name,
        iconurl: selectedToken.iconurl,
        joindesc: selectedToken.joindesc,
        brand: selectedToken.brand,
      };

      console.log('📱 하단 패널 열림 - 20초 후 자동 광고 이동 타이머 설정');
      console.log('🔍 자동 광고 이동 대상 토큰 (현재 selectedToken):', {
        advertisement: currentToken.advertisement,
        campid: currentToken.campid,
        coin: currentToken.coin,
        name: currentToken.name,
        spotID: currentToken.spotID,
      });
      hasAutoAdTriggeredRef.current = true;
      autoAdTimeoutRef.current = setTimeout(() => {
        console.log('⏰ 20초 경과 - 자동으로 광고 화면으로 이동');
        console.log('🔍 자동 이동 시 토큰 정보 (저장된 currentToken):', {
          advertisement: currentToken.advertisement,
          campid: currentToken.campid,
          coin: currentToken.coin,
          name: currentToken.name,
          spotID: currentToken.spotID,
        });
        navigateToAd(currentToken);
      }, 20000); 
    } else {

      if (autoAdTimeoutRef.current) {
        console.log('📱 하단 패널 닫힘 또는 토큰 변경 - 자동 광고 이동 타이머 정리');
        clearTimeout(autoAdTimeoutRef.current);
        autoAdTimeoutRef.current = null;
      }
    }

    return () => {
      if (autoAdTimeoutRef.current) {
        clearTimeout(autoAdTimeoutRef.current);
        autoAdTimeoutRef.current = null;
      }
    };
  }, [showBottomPanel, selectedToken, navigateToAd]);

  const handleTokenClick = useCallback((token: TokenData) => {
    console.log('=== 토큰 클릭 이벤트 발생 ===');
    console.log('클릭된 토큰 정보:', JSON.stringify(token, null, 2));
    console.log('🔍 클릭된 토큰 상세:', {
      spotID: token.spotID,
      advertisement: token.advertisement,
      campid: token.campid,
      coin: token.coin,
      xrunPrice: token.xrunPrice,
      name: token.name,
    });

    if (autoAdTimeoutRef.current) {
      console.log('🔄 다른 토큰 클릭 - 이전 자동 광고 이동 타이머 정리');
      clearTimeout(autoAdTimeoutRef.current);
      autoAdTimeoutRef.current = null;
    }
    hasAutoAdTriggeredRef.current = false; 

    const tokenCopy: TokenData = {
      ...token,
      advertisement: token.advertisement,
      campid: token.campid,
      coin: token.coin,
      xrunPrice: token.xrunPrice,
      name: token.name,
      iconurl: token.iconurl,
      joindesc: token.joindesc,
      brand: token.brand,
    };

    console.log('🔍 tokenCopy 상세 검증:', {
      spotID: tokenCopy.spotID,
      advertisement: tokenCopy.advertisement,
      campid: tokenCopy.campid,
      coin: tokenCopy.coin,
      name: tokenCopy.name,
    });

    setSelectedToken(tokenCopy);
    setShowBottomPanel(true); 

    setTimeout(() => {
      console.log('⏱️ selectedToken 업데이트 확인 (100ms 후):', {
        advertisement: tokenCopy.advertisement,
        campid: tokenCopy.campid,
        coin: tokenCopy.coin,
      });
    }, 100);
  }, []);

  const bottomNavItems = [
    { id: 'wallet', label: t('components.bottomNavigationBar.wallet'), icon: iconWallet },
    { id: 'shop', label: t('components.bottomNavigationBar.shop'), icon: iconShop },
    { id: 'map', label: '' }, 
    { id: 'referral', label: t('components.bottomNavigationBar.referral'), icon: iconReferral },
    { id: 'info', label: t('components.bottomNavigationBar.info'), icon: iconUser },
  ];

  if (!permission) {

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!permission.granted) {

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.permissionContainer}>
          {}
        </View>
      </View>
    );
  }

  return (
    <View key={refreshKey} style={styles.container}>
      <StatusBar style="light" />

      {}
      <View style={styles.statusBar}>
        <View style={styles.statusBarContent}>
          <View style={styles.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
        >
          {}
          {iconMapPoint && (
            <View style={styles.mapPinButton}>
              <Image
                source={iconMapPoint}
                style={styles.mapPinIcon}
                resizeMode="contain"
              />
            </View>
          )}
        </CameraView>

        {}
        {

}
        {loading ? (
          <View style={[styles.tokenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: 'white' }}>Loading...</Text>
          </View>
        ) : (
          <View style={[styles.tokenContainer, { bottom: showBottomPanel && selectedToken ? 200 : 110 }]}>
            {(() => {

              console.log('🔍 [렌더링 전] 토큰 정보 검증:');
              tokens.forEach((t) => {
                console.log('토큰:', {
                  spotID: t.spotID,
                  advertisement: t.advertisement,
                  campid: t.campid,
                  coin: t.coin,
                  xrunPrice: t.xrunPrice,
                  distance: t.distance,
                });
              });

              return tokens
                .sort((a, b) => (b.distance || 0) - (a.distance || 0)) 
                .map((token) => {

                  const handleClick = () => {
                    console.log('🖱️ [TokenComponent] 토큰 클릭됨:', {
                      spotID: token.spotID,
                      advertisement: token.advertisement,
                      campid: token.campid,
                      coin: token.coin,
                      name: token.name,
                    });
                    handleTokenClick(token);
                  };

                  return (
                    <TokenComponent
                      key={token.spotID}
                      token={token}
                      onPress={handleClick} 
                      animationRefs={animationRefs}
                      appState={appState}
                      rageProgress={rageProgress}
                      isRageMode={isRageMode}
                      rageColor={rageColor}
                      calculateScaleBasedOnDistance={calculateScaleBasedOnDistance}
                    />
                  );
                });
            })()}
          </View>
        )}

        {}
        {

}
        {}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: bottomPanelBottom, 
              left: 0,
              right: 0,
              zIndex: 3, 
              pointerEvents: showBottomPanel ? 'box-none' : 'none', 
            },
          ]}>
          <Pressable
            onPress={() => {
              if (showBottomPanel) {
                console.log('📱 하단 패널 배경 터치 - 패널 닫기');
                setShowBottomPanel(false);
              }
            }}
            style={[
              {
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 0,
                paddingVertical: 0,
                borderTopStartRadius: 33,
                borderTopEndRadius: 33,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
                minHeight: showBottomPanel && selectedToken ? 100 : 35,
              },
            ]}>
            {}
            {showBottomPanel && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 8,
                  paddingBottom: 0, 
                }}>
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: '#D9D9D9',
                    borderRadius: 2,
                  }}
                />
              </View>
            )}
            {}
            {showBottomPanel && selectedToken && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 20,
                  paddingTop: 0,
                  paddingBottom: 12,
                  pointerEvents: 'box-none', 
                }}>
                {}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  {}
                  {!selectedToken?.iconurl ||
                    selectedToken?.iconurl.toString().trim() === '' ||
                    typeof selectedToken?.iconurl !== 'string' ? (
                    iconXrunWhite && (
                      <Image
                        source={iconXrunWhite}
                        resizeMode="contain"
                        style={{
                          width: 44,
                          height: 44,
                          marginRight: 12,
                        }}
                      />
                    )
                  ) : (
                    <Image
                      source={{ uri: selectedToken?.iconurl }}
                      resizeMode="contain"
                      style={{
                        width: 44,
                        height: 44,
                        marginRight: 12,
                        borderRadius: 8,
                      }}
                    />
                  )}

                  {}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        fontSize: FONTS.size.medium,
                        color: '#4c4e55',
                        lineHeight: 24,
                        marginTop: 20,
                        marginBottom: 4,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {!selectedToken?.name ||
                        selectedToken?.name.toString().trim() === ''
                        ? 'XRUN coin'
                        : selectedToken?.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: FONTS.size.small,
                        color: '#4c4e55',
                        lineHeight: 15,
                        letterSpacing: 0.06,
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {!selectedToken?.joindesc ||
                        selectedToken?.joindesc.toString().trim() === ''
                        ? 'XRUN으로 리워드를 획득하세요'
                        : selectedToken?.joindesc}
                    </Text>
                  </View>
                </View>

                {}
                <TouchableOpacity
                  onPress={async () => {
                    console.log('=== View ad 버튼 클릭 ===');
                    console.log('현재 selectedToken:', JSON.stringify(selectedToken, null, 2));

                    if (autoAdTimeoutRef.current) {
                      clearTimeout(autoAdTimeoutRef.current);
                      autoAdTimeoutRef.current = null;
                    }
                    hasAutoAdTriggeredRef.current = true; 

                    if (selectedToken) {
                      await showAdInModal(selectedToken);
                    } else {
                      console.error('❌ View ad 버튼 - selectedToken이 없습니다!');
                    }
                  }}
                  style={{
                    backgroundColor: '#FFDC04',
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 8,
                    marginLeft: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: FONTS.size.msmall,
                      fontFamily: 'Roboto-Bold',
                      color: '#000000',
                    }}>
                    View ad
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </View>

      {}
      {}
      <View style={{ zIndex: 4 }}>
        <BottomNavigationBar
          items={bottomNavItems}
          activeItemId="map"
          activeTab={activeTab}
          onItemPress={handleNavItemPress}
          onTabChange={handleTabChange}
        />
      </View>

      {}
      <Modal
        visible={showAdModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          console.log('모달 닫기 요청');
          setShowAdModal(false);
        }}
        onDismiss={() => {

          console.log('📱 [CameraMainScreen] 모달이 완전히 닫혔습니다 (onDismiss)');
          console.log('📊 [CameraMainScreen] 현재 상태 확인:', {
            showAdModal,
            activeTab,
            loading,
            tokensCount: tokens?.length ?? 0,
            appState: AppState.currentState,
          });

          if (Platform.OS === 'ios') {
            console.log('🔄 [CameraMainScreen] onDismiss에서 iOS 복원 트리거');
            setTimeout(() => {
              setRefreshKey(prev => prev + 1);
            }, 100);
          }
        }}>
        <ShowNapAdScreen
          onClose={() => {
            console.log('ShowNapAdScreen 모달 닫기');
            setShowAdModal(false);

          }}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onPress={() => {
            console.log('모달 닫기 버튼 클릭');
            setShowAdModal(false);
          }}>
          <Text style={{ color: '#FFFFFF', fontSize: FONTS.size.xlarge, fontWeight: 'bold' }}>×</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  statusBar: {
    height: 44,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 21,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4, 
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {

  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1, 
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  mapPinButton: {
    position: 'absolute',
    top: 61,
    right: 16,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinIcon: {
    width: 25,
    height: 25,
  },

  tokenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2, 
  },

  tokenSpot: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 150,
    height: 175,
    borderRadius: 150,
  },

  tokenButtonContainer: {
    height: 94,
    width: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tokenButton: {
    height: 94,
    width: 94,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161d2d',
    borderRadius: 47,
    borderWidth: 3,
    borderColor: '#E5E5E5',
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },

  tokenIcon: {
    height: '60%',
    width: '60%',
  },

  tokenPriceText: {
    color: 'white',
    fontSize: FONTS.size.small,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tokenDistanceText: {
    color: '#CCCCCC',
    fontSize: FONTS.size.xxsmall,
    marginTop: -2,
    textAlign: 'center',
  },

  blinkImage: {
    resizeMode: 'contain',
    height: 100,
    width: 100,
    position: 'absolute',
    top: -80,
  },
});

