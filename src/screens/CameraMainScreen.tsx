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
import { BottomNavigationBar, LevelNotification, Dialog, OptionButton } from '../components';
import { FONTS } from '../constants';
import { TokenData, SpotData } from '../types';
import { fetchMapMarkerData, getStoredTopAd5, getTopAd5, getMyPageUserInfo, updateGender, updateAge, getNasmobAds, getPockAds } from '../services';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { ShowNapAdScreen } from './ShowNapAdScreen';
import { ShowPockAdScreen } from './ShowPockAdScreen';
import { showToast } from '../utils';
import { collectDeviceInfo } from '../utils/napApiUtils';

const { width, height } = Dimensions.get('window');

const spots = [
  { spotID: 1, x: 0, y: 0 },
  { spotID: 2, x: -100, y: 50 },
  { spotID: 3, x: 100, y: 50 },
  { spotID: 4, x: -50, y: 150 },
  { spotID: 5, x: 50, y: 150 },
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
  iconMapPoint = require('../../assets/images/locationpin2.png');
} catch (e) {
  console.warn('locationpin2.png not found');
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

let logoHorizontal: any = null;

try {
  logoHorizontal = require('../../assets/xrun-horizontal-logo.png');
  console.log('✅ [CameraMainScreen] 상단 로고 이미지 로드 성공');
} catch (e) {
  console.warn('❌ [CameraMainScreen] xrun-horizontal-logo.png not found:', e);
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
  const { advertisementParams, setAdvertisementParams } = useAppContext();
  const { showAlert } = useAlertDialog();
  const [permission, requestPermission] = useCameraPermissions();

  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);

  const bottomPanelBottom = useRef(new Animated.Value(20)).current;

  const [showAdModal, setShowAdModal] = useState(false);

  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [coinsData, setCoinsData] = useState<any[]>([]); 
  const [cachedAds, setCachedAds] = useState<{ [key: string]: any }>({}); 
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);

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

        }
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [showAdModal, activeTab, loading, tokens, appState]);

  const currentIndexRef = useRef(0);
  const chunkSize = 5;

  const [rageProgress, setRageProgress] = useState(0);
  const [isRageMode, setIsRageMode] = useState(false);
  const rageColor = '#60A5FA'; 

  const [genderAgeDialogVisible, setGenderAgeDialogVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedAge, setSelectedAge] = useState<'10' | '20' | '30' | '40' | '50+'>('10');
  const [isUpdatingGenderAge, setIsUpdatingGenderAge] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);

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

  const hasLoadedDataRef = useRef(false);
  const isPreFetchingRef = useRef(false);

  const loadCachedAds = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem('cached_AD');
      console.log('📂 [CameraMainScreen] AsyncStorage raw cached_AD:', cached ? '데이터 있음' : '데이터 없음(null)');

      if (cached) {
        const parsed = JSON.parse(cached);
        setCachedAds(parsed);

        const keys = Object.keys(parsed);
        console.log(`💾 [CameraMainScreen] 캐시된 광고 데이터 로드 완료: ${keys.length}개`);
        console.log('📦 [CameraMainScreen] 전체 캐시 데이터:', JSON.stringify(parsed, null, 2));

        return parsed;
      } else {
        console.warn('⚠️ [CameraMainScreen] cached_AD가 비어있습니다 (null). Map 화면에서 저장이 안 되었거나 초기화되었습니다.');
      }
      return {};
    } catch (e) {
      console.error('❌ [CameraMainScreen] 캐시 로드 실패:', e);
      return {};
    }
  }, []);

  const saveCachedAd = useCallback(async (campid: string, data: any) => {
    try {
      const currentCacheStr = await AsyncStorage.getItem('cached_AD');
      const currentCache = currentCacheStr ? JSON.parse(currentCacheStr) : {};

      const newCache = {
        ...currentCache,
        [campid]: data,
      };

      await AsyncStorage.setItem('cached_AD', JSON.stringify(newCache));
      console.log(`💾 [CameraMainScreen][saveCachedAd] 캐시 저장 성공: key=${campid}, 현재 총 키 수=${Object.keys(newCache).length}`);

      setCachedAds(newCache);
    } catch (e) {
      console.error('❌ [CameraMainScreen] 캐시 저장 실패:', e);
    }
  }, []);

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

  const organizeData = useCallback((oCoinData: any[], externalCache?: any) => {

    const effectiveCache = externalCache || cachedAds;

    const enrichedData = oCoinData.map(d => {

      if (d.urlAD && d.urlAD !== '') return d;

      const key = String(d.campid || '');
      const cached = effectiveCache[key]; 
      if (cached && cached.urlAD) {
        console.log(`✨ [organizeData] 캐시에서 누락된 정보 보완: ${key}`);
        return {
          ...d,
          urlAD: cached.urlAD,
          landing_url: cached.urlAD, 
          joindesc: cached.joindesc || d.joindesc,
          name: cached.name || d.name,
          xrunPrice: cached.xrunPrice || d.xrunPrice,
        };
      }
      return d;
    });

    console.log("ℹ️ [organizeData] 사용된 캐시 소스:", externalCache ? "External (Latest)" : "State (May be stale)");
    console.log("ℹ️ [organizeData] 캐시 데이터 수:", Object.keys(effectiveCache).length);

    const validData = enrichedData;

    console.log('📋 [organizeData] 선택된 데이터 (처음 5개):', validData.slice(0, 5).map((d, idx) => ({
      ...d,
      urlAD: d.urlAD || '없음',
      landing_url: d.landing_url || '없음',
    })));

    if (validData.length === 0) {
      console.log('⚠️ [organizeData] 표시할 유효한(URL이 있는) 광고가 없습니다.');

      console.log(`🔍 [organizeData] 현재 캐시 키 목록: ${Object.keys(cachedAds).join(', ')}`);
      setTokens([]);
      return;
    }

    console.log('🔄 [organizeData] 호출:', {
      currentIndex: currentIndexRef.current,
      totalDataLength: validData.length,
      originalLength: oCoinData.length,
      chunkSize: chunkSize,
      cachedAdsCount: Object.keys(cachedAds).length
    });

    let nextData: any[] = [];
    let actualChunkSize = Math.min(chunkSize, validData.length);

    if (currentIndexRef.current + actualChunkSize > validData.length) {

      nextData = [
        ...validData.slice(currentIndexRef.current),
        ...validData.slice(0, (currentIndexRef.current + actualChunkSize) % validData.length),
      ];
      currentIndexRef.current = (currentIndexRef.current + actualChunkSize) % validData.length;
    } else {

      nextData = validData.slice(currentIndexRef.current, currentIndexRef.current + actualChunkSize);
      currentIndexRef.current = (currentIndexRef.current + actualChunkSize) % validData.length;
    }

    console.log('📋 [organizeData] 선택된 데이터 (처음 5개):', nextData.slice(0, 5).map((d, idx) => ({
      index: idx,
      distance: d.distance,
      advertisement: d.advertisement,
      campid: d.campid,
      name: d.name,
      xrunPrice: d.xrunPrice,
      urlAD: d.urlAD ? 'Yes' : 'No'
    })));

    const newOrganizedData = nextData.map((data, index) => {
      return { ...spots[index % spots.length], ...data };
    });

    console.log('✅ [organizeData] 최종 토큰 데이터:', newOrganizedData.map((t, idx) => ({
      spotID: t.spotID,
      distance: t.distance,
      advertisement: t.advertisement,
      urlAD: t.urlAD
    })));

    setTokens(newOrganizedData);
  }, [chunkSize, cachedAds]);

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

                console.log('[CameraMainScreen] 1단계: TopAd5 데이터 새로고침 시작');
                let topAd5Response = await getTopAd5();

                if (!topAd5Response || !Array.isArray(topAd5Response) || topAd5Response.length === 0) {
                  console.warn('[CameraMainScreen] TopAd5 API 데이터가 없습니다. 저장된 데이터 사용 시도');
                  topAd5Response = await getStoredTopAd5();
                }

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
                  console.log('🔄 [CameraMainScreen] TopAd5 매핑 후 인덱스 리셋 (항상 처음 5개 사용)');

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

      console.log('📍 [Trace] 0. loadTokenData 진입, 마커 데이터 요청 시작');
      const markerData = await fetchMapMarkerData(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        member,
        navigate,
      );
      console.log('📍 [Trace] 1. 마커 데이터 요청 완료. 개수:', markerData ? markerData.length : 0);

      if (markerData && markerData.length > 0) {
        console.log('📍 [Trace] 2. 데이터 유효, 로컬 저장 시작');

        await AsyncStorage.setItem('astorCoinsData', JSON.stringify(markerData));

        const validatedCoinsData = markerData.map((coin: any) => {

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

        try {
          console.log('📍 [Trace] 3. 초기 캐시 로드 시작');

          let loadedCache: any = {};
          try {
            const rawCache = await AsyncStorage.getItem('cached_AD');
            console.warn('📂 [CameraMainScreen][Direct] raw cached_AD:', rawCache ? '데이터 있음' : 'NULL');
            if (rawCache) {
              loadedCache = JSON.parse(rawCache);
              console.warn('📦 [CameraMainScreen][Direct] 파싱된 캐시 키 수:', Object.keys(loadedCache).length);
            }
          } catch (err) {
            console.error('❌ [CameraMainScreen][Direct] 캐시 직접 로드 실패:', err);
          }

          console.log('[CameraMainScreen API] 1단계: TopAd5 데이터 새로고침 시작');
          let topAd5Response = await getTopAd5();

          if (!topAd5Response || !Array.isArray(topAd5Response) || topAd5Response.length === 0) {
            console.warn('[CameraMainScreen API] TopAd5 API 데이터가 없습니다. 저장된 데이터 사용 시도');
            topAd5Response = await getStoredTopAd5();
          }

          if (topAd5Response && Array.isArray(topAd5Response) && topAd5Response.length > 0) {
            console.warn('🚦 [CameraMainScreen API] TopAd5 조건 충족. 로직 진입. 개수:', topAd5Response.length);
            console.log('✅ [CameraMainScreen API] TopAd5 데이터 발견:', topAd5Response.length, '개');

            for (const ad of topAd5Response) {
              if (ad.campid && ad.urlAD) {
                const cacheKey = String(ad.campid);

                const adData = {
                  urlAD: ad.urlAD,
                  joindesc: ad.joindesc || '',
                  name: ad.name || '',
                  xrunPrice: ad.xrunPrice || 0
                };
                await saveCachedAd(cacheKey, adData);
                console.log(`💾 [CameraMainScreen API] TopAd5 데이터 캐시 저장 완료: ${cacheKey}`);
              }
            }

            try {
              const rawLatest = await AsyncStorage.getItem('cached_AD');
              if (rawLatest) {
                const latestCache = JSON.parse(rawLatest);
                Object.assign(loadedCache, latestCache); 
                console.warn('🔄 [CameraMainScreen][Direct] 캐시 갱신 완료. 키 수:', Object.keys(loadedCache).length);
              }
            } catch (e) {
              console.error('❌ [CameraMainScreen][Direct] 캐시 갱신 로드 실패:', e);
            }
            console.log('🔄 [CameraMainScreen API] TopAd5 저장 후 캐시 객체 업데이트 완료');

            console.log('🔍 [CameraMainScreen API] TopAd5 데이터 구조 확인 (첫 번째 항목):', {
              item: topAd5Response[0],
              hasUrlAD: !!topAd5Response[0].urlAD,
              urlAD_preview: topAd5Response[0].urlAD ? topAd5Response[0].urlAD.substring(0, 30) + '...' : 'MISSING'
            });

            const sortedCoinsData = [...validatedCoinsData].sort((a, b) => {
              const distanceA = parseFloat(String(a.distance || 0));
              const distanceB = parseFloat(String(b.distance || 0));
              return distanceA - distanceB; 
            });

            console.log('📊 [CameraMainScreen API] 거리 순 정렬 완료 (가까운 순서)');

            console.log('📍 [Trace] 5. 매핑 시작');
            const mappedCoinsData = sortedCoinsData.map((coin: any, index: number) => {
              const adIndex = index % topAd5Response.length;
              const mappedAd = topAd5Response[adIndex];

              console.log(`🔗 [CameraMainScreen API] 토큰 ${index} 매핑 상세:`, {
                adIndex,
                adCompany: mappedAd?.ad_company,
                campid: mappedAd?.campid,
                hasUrlAD: !!mappedAd?.urlAD,
                urlAD_val: mappedAd?.urlAD || 'EMPTY'
              });

              const adKey = String(mappedAd?.campid || '');
              const cachedItem = loadedCache[adKey];
              if (cachedItem) {
                console.log(`💾 [CameraMainScreen API] 매핑 중 캐시 데이터 발견: ${adKey}`);
              }

              return {
                ...coin,

                name: cachedItem?.name || mappedAd?.name || coin.name || coin.title || coin.brand || 'Unknown coin',
                iconurl: mappedAd?.iconurl || coin.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: cachedItem?.joindesc || mappedAd?.joindesc || coin.joindesc || '',
                xrunPrice: cachedItem?.xrunPrice || mappedAd?.xrunPrice || coin.xrunPrice || coin.xrunprice || coin.price || coin.coins || 0,
                xrunprice: cachedItem?.xrunPrice || mappedAd?.xrunPrice || coin.xrunprice || coin.xrunPrice || coin.price || coin.coins || '',
                campid: mappedAd?.campid || coin.campid || coin.campId || '',

                advertisement: mappedAd?.advertisement || mappedAd?.adid || mappedAd?.ad || (mappedAd?.campid ? String(mappedAd.campid) : '') || coin.advertisement || coin.adid || coin.ad || coin.coin || '',

                urlAD: cachedItem?.urlAD || mappedAd?.urlAD || coin.urlAD || '',
                landing_url: cachedItem?.urlAD || mappedAd?.urlAD || coin.urlAD || '', 
                thumbnail: mappedAd?.thumbnail || coin.thumbnail,
                ad_company: mappedAd?.ad_company || coin.ad_company,
                coins: mappedAd?.coins?.toString() || coin.coins,
                brandlogo: mappedAd?.brandlogo || coin.brandlogo,
                adthumbnail2: mappedAd?.adthumbnail2 || coin.adthumbnail2,
                symbolimg: mappedAd?.symbolimg || coin.symbolimg,
              };
            });

            console.log('✅ [CameraMainScreen API] TopAd5 매핑 완료:', mappedCoinsData.length, '개 토큰');
            console.log('📍 [Trace] 6. 매핑 완료. 개수:', mappedCoinsData.length);

            setCoinsData(mappedCoinsData);

            currentIndexRef.current = 0;
            console.log('🔄 [CameraMainScreen API] TopAd5 매핑 후 인덱스 리셋 (항상 처음 5개 사용)');

            try {
              console.log('📍 [Trace] 7-1. organizeData 호출 시작');
              organizeData(mappedCoinsData, loadedCache);
              console.log('📍 [Trace] 7-2. organizeData 호출 완료');
            } catch (organizeErr) {
              console.error('❌ [CameraMainScreen API] organizeData 실행 중 오류:', organizeErr);
            }

            console.warn('📍 [Trace] 8. Pre-fetch 로직 진입점 도달 (여기 안 보이면 앞 단계 오류)');
            const startPreFetch = async (cache: { [key: string]: any }) => {
              console.log('🏁 [PreFetch] 함수 진입. isPreFetching:', isPreFetchingRef.current);

              if (isPreFetchingRef.current) {
                console.log('🚫 [PreFetch] 이미 실행 중이라 중단됨');
                return;
              }
              isPreFetchingRef.current = true;

              try {
                console.log('🔍 [PreFetch] 캐시 키 목록 확인:', Object.keys(cache).length, '개');
                const deviceInfo = await collectDeviceInfo();

                const adsToFetch = topAd5Response.filter((ad: any) => {
                  const key = String(ad.campid || '');

                  if (cache[key] && cache[key].urlAD) return false;

                  if (ad.urlAD) return false;
                  return ad.campid;
                });

                console.log(`🔍 [CameraMainScreen API] 고유 광고 pre-fetch 대상: ${adsToFetch.length}개`);

                let updatedCoinsData = [...mappedCoinsData];

                let currentPreFetchCache = { ...cache };

                for (const ad of adsToFetch) {
                  try {

                    const cacheKey = String(ad.campid || '');
                    const company = (ad.ad_company || '').toLowerCase(); 

                    console.log(`🚀 [PreFetch] 처리 시작: campid=${ad.campid}, company=${company}`);

                    if (cacheKey && cachedAds[cacheKey] && cachedAds[cacheKey].urlAD) {
                      console.log(`💾 [PreFetch] 캐시 HIT: ${cacheKey}`);

                      const cachedItem = cachedAds[cacheKey];

                      currentPreFetchCache[cacheKey] = cachedItem;

                      updatedCoinsData = updatedCoinsData.map(c =>
                        (c.campid === ad.campid) ? {
                          ...c,
                          urlAD: cachedItem.urlAD,
                          landing_url: cachedItem.urlAD,
                          joindesc: cachedItem.joindesc || c.joindesc,
                          name: cachedItem.name || c.name,
                          xrunPrice: cachedItem.xrunPrice || c.xrunPrice,
                        } : c
                      );

                      continue;
                    }

                    let result;

                    const checkUrl = ad.ad_check_url;
                    let fetchedData = null;

                    if (checkUrl) {
                      try {
                        console.log(`🌐 [PreFetch] 요청 시작 (${company}):`, checkUrl);
                        const response = await fetch(checkUrl);
                        const jsonResponse = await response.json();

                        if (company === 'nas') {
                          const resCode = typeof jsonResponse.result === 'string' ? parseInt(jsonResponse.result, 10) : jsonResponse.result;
                          if (resCode === 200 && jsonResponse.lurl) {
                            fetchedData = {
                              urlAD: jsonResponse.lurl,
                              name: jsonResponse.name
                            };
                          } else {
                            console.warn(`⚠️ [PreFetch] NAS 실패: result=${resCode}`);
                          }
                        } else if (company === 'pointclick') {
                          if (jsonResponse.result_code === 200 && jsonResponse.landing_url) {
                            fetchedData = {
                              urlAD: jsonResponse.landing_url,
                              name: jsonResponse.ad_name
                            };
                          } else {
                            console.warn(`⚠️ [PreFetch] Pock 실패: code=${jsonResponse.result_code}`);
                          }
                        }
                      } catch (fetchErr) {
                        console.error(`❌ [PreFetch] Fetch 오류:`, fetchErr);
                      }
                    } else {
                      console.warn(`⚠️ [PreFetch] ad_check_url 없음: ${ad.campid}`);
                    }

                    if (fetchedData && fetchedData.urlAD) {

                      console.log(`✅ [PreFetch] 성공: ${ad.campid}`);
                      const newData = {
                        urlAD: fetchedData.urlAD,
                        joindesc: ad.joindesc, 
                        name: fetchedData.name || ad.name,
                        xrunPrice: ad.xrunPrice
                      };

                      await saveCachedAd(cacheKey, newData);

                      currentPreFetchCache[cacheKey] = newData;

                      updatedCoinsData = updatedCoinsData.map(c =>
                        (c.campid === ad.campid) ? {
                          ...c,
                          urlAD: newData.urlAD,
                          landing_url: newData.urlAD,
                          name: newData.name || c.name,
                        } : c
                      );
                    }
                  } catch (e) {
                    console.log(`⚠️ [CameraMainScreen API] ${ad.campid} pre-fetch 실패:`, e);
                  }
                } 

                console.log('🏁 [PreFetch] 모든 처리 완료. organizeData 호출하여 AR 갱신');
                setCoinsData(updatedCoinsData);

                organizeData(updatedCoinsData, currentPreFetchCache);

              } catch (err) {
                console.error('❌ [CameraMainScreen API] 백그라운드 pre-fetch 오류:', err);
              }
            };

            console.warn('🚀 [CameraMainScreen API] startPreFetch 호출 직전');

            startPreFetch(loadedCache).catch(e => console.error('❌ startPreFetch 호출 실패:', e));
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

  const checkGenderAndAge = useCallback(async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        console.log('[AR 화면] userData 없음 - 성별/연령대 검증 스킵');
        return; 
      }

      const userData = JSON.parse(userDataStr);
      const member = userData.member;
      if (!member) {
        console.log('[AR 화면] member ID 없음 - 성별/연령대 검증 스킵');
        return;
      }

      console.log('[AR 화면] 성별/연령대 검증 시작, member:', member);
      setMemberId(member);
      const response = await getMyPageUserInfo(member, navigate);

      console.log('[AR 화면] getMyPageUserInfo 응답:', {
        hasData: !!response.data,
        dataLength: response.data?.length,
        firstItem: response.data?.[0],
      });

      const user = response.data?.[0];

      if (!user) {
        console.log('[AR 화면] 사용자 정보 없음 - 성별/연령대 검증 스킵');
        return;
      }

      console.log('[AR 화면] 사용자 정보:', {
        gender: user.gender,
        ages: user.ages,
        genderType: typeof user.gender,
        agesType: typeof user.ages,
      });

      const gender = typeof user.gender === 'string' ? parseInt(user.gender, 10) : (user.gender ?? 0);
      const ages = typeof user.ages === 'string' ? parseInt(user.ages, 10) : (user.ages ?? 0);

      console.log('[AR 화면] 성별/연령대 확인 결과:', {
        gender,
        ages,
        genderOriginal: user.gender,
        agesOriginal: user.ages,
        shouldShowDialog: gender === 0 || ages === 0,
      });

      if (gender === 0 || ages === 0) {
        console.log('[AR 화면] 성별/연령대가 0 - Dialog 표시');

        setSelectedGender(gender === 0 ? 'male' : (gender === 2111 ? 'female' : 'male'));
        const ageMap: Record<number, '10' | '20' | '30' | '40' | '50+'> = {
          2210: '10',
          2220: '20',
          2230: '30',
          2240: '40',
          2250: '50+',
        };

        setSelectedAge(ages === 0 ? '10' : (ageMap[ages] || '10'));
        setGenderAgeDialogVisible(true);
        console.log('[AR 화면] Dialog 표시 완료, genderAgeDialogVisible:', true);
      } else {
        console.log('[AR 화면] 성별/연령대가 모두 설정됨 - Dialog 표시 안 함');
      }
    } catch (error) {
      console.error('[AR 화면] 성별/연령대 확인 실패:', error);
    }
  }, [navigate]);

  const handleUpdateGenderAge = useCallback(async () => {
    if (!memberId || !selectedGender || !selectedAge) {
      await showAlert(t('common.messages.error') || '오류', '성별과 연령대를 모두 선택해주세요.');
      return;
    }

    setIsUpdatingGenderAge(true);
    try {
      const genderCode = selectedGender === 'male' ? 2110 : 2111;
      const ageMap: Record<string, number> = {
        '10': 2210,
        '20': 2220,
        '30': 2230,
        '40': 2240,
        '50+': 2250,
      };
      const ageCode = ageMap[selectedAge] || 0;

      await Promise.all([
        updateGender(memberId, genderCode, navigate),
        updateAge(memberId, ageCode, navigate),
      ]);

      setGenderAgeDialogVisible(false);
      await showAlert(t('common.messages.success') || '성공', '성별과 연령대가 업데이트되었습니다.');
    } catch (error) {
      console.error('[AR 화면] 성별/연령대 업데이트 실패:', error);
      await showAlert(t('common.messages.error') || '오류', '업데이트에 실패했습니다.');
    } finally {
      setIsUpdatingGenderAge(false);
    }
  }, [memberId, selectedGender, selectedAge, navigate, showAlert, t]);

  useEffect(() => {
    const initializeData = async () => {

      await checkUserLoginStatus();

      await checkGenderAndAge();

      if (!hasLoadedDataRef.current) {
        loadTokenData(false); 
      }
    };

    initializeData();
  }, []); 

  useEffect(() => {
    const checkCacheDirectly = async () => {
      try {
        const rawCache = await AsyncStorage.getItem('cached_AD');
        console.warn('🕵️ [DEBUG] 마운트 시 cached_AD 직접 확인:', rawCache ? '데이터 있음' : 'NULL');
        if (rawCache) {
          console.warn('🕵️ [DEBUG] 캐시 내용:', rawCache);
        }
      } catch (err) {
        console.error('🕵️ [DEBUG] 캐시 확인 실패:', err);
      }
    };
    checkCacheDirectly();
  }, []);

  useEffect(() => {
    if (coinsData && coinsData.length > 0) {
      console.log('🔄 [Effect] coinsData 업데이트됨 -> organizeData 호출');
      organizeData(coinsData);
    }
  }, [coinsData, organizeData]);

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
        toValue: 105, 
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start();
    } else {

      Animated.timing(bottomPanelBottom, {
        toValue: 100, 
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

      const adCompany = token.ad_company || 'nas';
      console.log('🔍 ad_company 확인:', adCompany);

      const adParams = {
        member: member,
        advertisement: advertisement,
        coin: token.coin ? String(token.coin) : '',
        campid: campid,
        joindesc: token.joindesc || '',
        name: token.name || 'XRUN coin',
        xrunPrice: token.xrunPrice || 0,
        coinScreen: true,
        ad_company: adCompany,
        urlAD: token.urlAD || '',
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
        ad_company: token.ad_company,
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
        tokenAdCompany: token.ad_company,
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

      const adCompany = token.ad_company || 'nas';
      console.log('🔍 ad_company 확인:', adCompany);

      const adParams = {
        member: member,
        advertisement: advertisement,
        coin: token.coin ? String(token.coin) : '',
        campid: campid,
        joindesc: token.joindesc || '',
        name: token.name || 'XRUN coin',
        xrunPrice: token.xrunPrice || 0,
        coinScreen: true,
        ad_company: adCompany,
        urlAD: token.urlAD || '',
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
        ad_company: adCompany,
      });

      console.log('🔄 Context에 광고 파라미터 설정 전:', {
        advertisement: adParams.advertisement,
        campid: adParams.campid,
        coin: adParams.coin,
        name: adParams.name,
        ad_company: adParams.ad_company,
      });
      setAdvertisementParams(adParams);
      console.log('✅ Context에 광고 파라미터 설정 완료:', {
        advertisement: adParams.advertisement,
        campid: adParams.campid,
        coin: adParams.coin,
        name: adParams.name,
        ad_company: adParams.ad_company,
      });

      if (adCompany === 'pock' || adCompany === 'pointclick' || adCompany === 'POCK') {

        console.log('🚀 ShowPockAd 화면으로 이동 시작 (reset 사용)...');
        console.log('🔍 이동 시 전달할 파라미터:', {
          advertisement: adParams.advertisement,
          campid: adParams.campid,
          coin: adParams.coin,
          name: adParams.name,
          ad_company: adParams.ad_company,
        });
        reset(ROUTES.showPockAd);
        console.log('✅ ShowPockAd 화면으로 이동 완료');
      } else {

        console.log('🚀 ShowNapAd 화면으로 이동 시작 (reset 사용)...');
        console.log('🔍 이동 시 전달할 파라미터:', {
          advertisement: adParams.advertisement,
          campid: adParams.campid,
          coin: adParams.coin,
          name: adParams.name,
          ad_company: adParams.ad_company,
        });
        reset(ROUTES.showNapAd);
        console.log('✅ ShowNapAd 화면으로 이동 완료');
      }
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

      console.log('📱 하단 패널 열림 - 3초 후 자동 광고 이동 타이머 설정');
      console.log('🔍 자동 광고 이동 대상 토큰 (현재 selectedToken):', {
        advertisement: currentToken.advertisement,
        campid: currentToken.campid,
        coin: currentToken.coin,
        name: currentToken.name,
        spotID: currentToken.spotID,
      });
      hasAutoAdTriggeredRef.current = true;
      autoAdTimeoutRef.current = setTimeout(() => {
        console.log('⏰ 3초 경과 - 자동으로 광고 화면으로 이동');
        console.log('🔍 자동 이동 시 토큰 정보 (저장된 currentToken):', {
          advertisement: currentToken.advertisement,
          campid: currentToken.campid,
          coin: currentToken.coin,
          name: currentToken.name,
          spotID: currentToken.spotID,
        });
        navigateToAd(currentToken);
      }, 3000); 
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
        ad_company: tokenCopy.ad_company,
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
    <View style={styles.container}>
      <StatusBar style="light" />

      {}
      <LevelNotification navigation={navigate} />

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
          {

}
        </CameraView>

        {}
        {

}

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

              tokens.forEach((t) => {
                console.log('토큰:', {
                  spotID: t.spotID,
                  advertisement: t.advertisement,
                  campid: t.campid,
                  coin: t.coin,
                  xrunPrice: t.xrunPrice,
                  distance: t.distance,
                  ad_company: t.ad_company,
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
                borderTopStartRadius: 20,
                borderTopEndRadius: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
                minHeight: showBottomPanel && selectedToken ? 100 : 35,
                maxHeight: showBottomPanel && selectedToken ? 150 : 35, 
              },
            ]}>
            {}
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
        {(() => {
          const adCompany = advertisementParams?.ad_company || 'nas';
          console.log('🔍 모달 내부 ad_company 확인:', adCompany);

          if (adCompany === 'pock' || adCompany === 'pointclick' || adCompany === 'POCK') {
            return (
              <ShowPockAdScreen
                onClose={() => {
                  console.log('ShowPockAdScreen 모달 닫기');
                  setShowAdModal(false);

                }}
              />
            );
          } else {
            return (
              <ShowNapAdScreen
                onClose={() => {
                  console.log('ShowNapAdScreen 모달 닫기');
                  setShowAdModal(false);

                }}
              />
            );
          }
        })()}
        {

}
      </Modal>

      {}
      <Dialog
        visible={genderAgeDialogVisible}
        title={t('screens.camera.genderAgeRequired') || '성별과 연령대를 입력해주세요'}
        actions={[
          {
            label: t('common.buttons.confirm') || '확인',
            onPress: handleUpdateGenderAge,
            variant: 'primary',
            disabled: isUpdatingGenderAge || !selectedGender || !selectedAge,
          },
        ]}
      >
        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ fontSize: 14, marginBottom: 8, color: '#333' }}>
              {t('screens.camera.genderLabel') || '성별'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <OptionButton
                label={t('screens.signup.genderMale') || '남성'}
                selected={selectedGender === 'male'}
                onPress={() => setSelectedGender('male')}
              />
              <OptionButton
                label={t('screens.signup.genderFemale') || '여성'}
                selected={selectedGender === 'female'}
                onPress={() => setSelectedGender('female')}
              />
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 14, marginBottom: 8, color: '#333' }}>
              {t('screens.camera.ageLabel') || '연령대'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {(['10', '20', '30', '40', '50+'] as const).map((age) => (
                <OptionButton
                  key={age}
                  label={age}
                  selected={selectedAge === age}
                  onPress={() => setSelectedAge(age)}
                  flex={age !== '50+' ? 1 : undefined}
                />
              ))}
            </View>
          </View>
        </View>
      </Dialog>
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
    marginTop: 42,
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
    zIndex: 5, 
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
  topLogo: {
    position: 'absolute',
    top: 76,
    left: 8,
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').width / 4,
    zIndex: 10, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

