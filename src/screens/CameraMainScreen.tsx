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
  Linking,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { BottomNavigationBar, LevelNotification, Dialog, OptionButton } from '../components';
import { FONTS } from '../constants';
import { TokenData, SpotData } from '../types';
import { fetchMapMarkerData, getStoredTopAd5, getTopAd5, getMyPageUserInfo, updateGender, updateAge, getNasmobAds, getPockAds, getCompletedAdsSet, processAdReward, removeAdFromTopAd5, validateTopAd5Urls, addToCompletedAdsCache } from '../services';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { ShowNapAdScreen } from './ShowNapAdScreen';
import { ShowPockAdScreen } from './ShowPockAdScreen';
import { showToast } from '../utils';
import { collectDeviceInfo } from '../utils/napApiUtils';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

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
  isCompleted?: boolean;
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
  isCompleted = false,
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
          pointerEvents: 'none', 
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
          pointerEvents: 'none', 
        }}
      />

      <TouchableOpacity
        onPress={onPress}
        disabled={false}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} 
        pressRetentionOffset={{ top: 20, bottom: 20, left: 20, right: 20 }} 
        style={[
          styles.tokenButtonContainer,
          {
            transform: [
              { scale: calculateScaleBasedOnDistance(distance) },
            ],
            opacity: 1, 
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
            <View 
              pointerEvents="none" 
              style={{ 
                position: 'absolute', 
                width: 100, 
                height: 100, 
                top: isRageMode ? -90 : -80,
                left: '50%',
                marginLeft: -50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
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
                  { position: 'relative', top: 0 }, 
                ]}
              />
            </View>
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
let iconXplay: any = null;
let iconXrun: any = null;
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
  iconXplay = require('../../assets/images/icon_xplay.png');
} catch (e) {
  console.warn('icon_xplay.png not found');
}

try {
  iconXrun = require('../../assets/images/icon_xrun_black.png');
} catch (e) {
  console.warn('icon_xrun_black.png not found');
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

  const [showWebViewModal, setShowWebViewModal] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [webViewTitle, setWebViewTitle] = useState('');
  const [webViewError, setWebViewError] = useState(false);
  const [webViewCanGoBack, setWebViewCanGoBack] = useState(false);
  const webViewModalRef = useRef<WebView>(null);

  const webViewTokenRef = useRef<TokenData | null>(null);
  const webViewAdParamsRef = useRef<any>(null);

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

      setShowBottomPanel(false);
      setSelectedToken(null);

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
  const completedAdsSetRef = useRef<Set<string>>(new Set<string>());

  const loggedUrlMissingCampidsRef = useRef<Set<string>>(new Set<string>());

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
  const tokenClickTimeoutRef = useRef<NodeJS.Timeout | null>(null); 
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

    const beforeCompletedFilter = enrichedData.length;
    const filteredByCompleted = enrichedData.filter((d) => {
      const campid = String(d.campid || '');
      if (campid && campid !== '' && campid !== 'undefined' && completedAdsSetRef.current) {
        const isCompleted = completedAdsSetRef.current.has(campid);
        if (isCompleted) {
          return false;
        }
      }
      return true;
    });

    const beforeDedupFilter = filteredByCompleted.length;
    const seenCampids = new Set<string>();
    let duplicateCount = 0;
    const deduplicatedData = filteredByCompleted.filter((d) => {
      const campid = String(d.campid || '');
      if (!campid || campid === '' || campid === 'undefined') {
        return true; 
      }

      if (seenCampids.has(campid)) {
        duplicateCount++;
        return false;
      }

      seenCampids.add(campid);
      return true;
    });

    const validData = deduplicatedData;

    if (validData.length === 0) {
      setTokens([]);
      return;
    }

    let nextData: any[] = [];

    const targetSize = chunkSize; 

    if (validData.length === 0) {
      setTokens([]);
      return;
    }

    const fillCount = Math.min(targetSize, validData.length);
    for (let i = 0; i < fillCount; i++) {
      const index = (currentIndexRef.current + i) % validData.length;
      nextData.push(validData[index]);
    }

    currentIndexRef.current = (currentIndexRef.current + fillCount) % validData.length;

    const newOrganizedData = nextData.map((data, index) => {
      return { ...spots[index % spots.length], ...data };
    });

    console.log('==========토큰 렌더링==========');
    console.log('');

    newOrganizedData.forEach((token: any, index: number) => {
      const urlAD = token.urlAD || '';
      const truncatedUrl = urlAD.length > 60 ? urlAD.substring(0, 60) + '...' : urlAD;

      console.log(`[${index + 1}] 광고 상세 정보:`);
      console.log(`  - campid: ${token.campid || 'N/A'}`);
      console.log(`  - name: ${token.name || 'N/A'}`);
      console.log(`  - ad_company: ${token.ad_company || 'N/A'}`);
      console.log(`  - priority: ${token.priority || 'N/A'}`);
      console.log(`  - coins: ${token.coins || '0'}`);
      console.log(`  - xrunPrice: ${token.xrunPrice || '0'}`);
      console.log(`  - urlAD: ${truncatedUrl || '없음'}`);
      console.log(`  - iconurl: ${token.iconurl || '없음'}`);
      if (index < newOrganizedData.length - 1) {
        console.log('');
      }
    });

    console.log('');
    console.log('========== [getTopAd5] 광고 목록 출력 완료 ==========');

    setTokens(newOrganizedData);
  }, [chunkSize, cachedAds]);

  const loadTokenData = useCallback(async (forceRefresh: boolean = false) => {

    if (hasLoadedDataRef.current && !forceRefresh) {
      return;
    }

    try {
      setLoading(true);
      console.log('=== CameraMainScreen 데이터 로딩 시작 ===', forceRefresh ? '(강제 새로고침)' : '');

      const [userData, _] = await Promise.all([
        AsyncStorage.getItem('userData'),
        checkUserLoginStatus(),
      ]);

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

      let currentLocation = {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      };

      const locationPromise = (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {

          const LAST_GPS_LOCATION_KEY = 'lastGpsLocationForMapMove';
          const LAST_GPS_LOCATION_TIMESTAMP_KEY = 'lastGpsLocationTimestamp';
          const LOCATION_REUSE_TIME = 60 * 1000; 
          const LOCATION_REUSE_DISTANCE = 500; 

          const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
            const R = 6371000; 
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          const locationAccuracy = Platform.OS === 'ios' ? Location.Accuracy.Low : Location.Accuracy.High;
          const newLocation = await Location.getCurrentPositionAsync({
            accuracy: locationAccuracy,
          });

          const newLocationData = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };

          let locationToUse = newLocationData;
          try {

            const storedLocation = await AsyncStorage.getItem(LAST_GPS_LOCATION_KEY);
            const storedTimestamp = await AsyncStorage.getItem(LAST_GPS_LOCATION_TIMESTAMP_KEY);

            if (storedLocation && storedTimestamp) {
              const lastGpsLocation = JSON.parse(storedLocation);
              const lastTimestamp = parseInt(storedTimestamp, 10);
              const now = Date.now();
              const elapsed = now - lastTimestamp;

              if (elapsed < LOCATION_REUSE_TIME) {

                const distance = calculateDistance(
                  newLocationData.latitude,
                  newLocationData.longitude,
                  lastGpsLocation.latitude,
                  lastGpsLocation.longitude
                );

                if (distance < LOCATION_REUSE_DISTANCE) {
                  locationToUse = lastGpsLocation;
                  console.log(`📍 [AR 화면 위치 재사용] 마지막 위치 사용 (${Math.floor(elapsed / 1000)}초 전, ${distance.toFixed(0)}m)`);
                } else {
                  console.log(`📍 [AR 화면 위치 재사용] 거리 초과 (${distance.toFixed(0)}m > ${LOCATION_REUSE_DISTANCE}m), 새 위치 사용`);
                }
              } else {
                console.log(`📍 [AR 화면 위치 재사용] 시간 초과 (${Math.floor(elapsed / 1000)}초 > ${LOCATION_REUSE_TIME / 1000}초), 새 위치 사용`);
              }
            } else {
              console.log('📍 [AR 화면 위치 재사용] 저장된 위치 없음, 새 위치 사용');
            }
          } catch (storageError) {
            console.error('📍 [AR 화면 위치 재사용] AsyncStorage 확인 실패:', storageError);
          }

            await AsyncStorage.setItem(LAST_GPS_LOCATION_KEY, JSON.stringify(locationToUse));
            await AsyncStorage.setItem(LAST_GPS_LOCATION_TIMESTAMP_KEY, Date.now().toString());

            return {
              coords: {
                latitude: locationToUse.latitude,
                longitude: locationToUse.longitude,
              },
            };
          } else {
            console.log('📍 [AR 화면] 위치 권한이 없습니다. AR 화면에서는 거리 정보가 필요 없으므로 계속 진행합니다.');
          }
        } catch (locationError) {
          console.warn('📍 [AR 화면] 위치 정보 가져오기 실패 (계속 진행):', locationError);
        }
        return null;
      })();

      const useCache = !forceRefresh;
      let topAd5Response = await getTopAd5(undefined, !useCache, true);

      if (!topAd5Response || !Array.isArray(topAd5Response) || topAd5Response.length === 0) {
        console.warn('[CameraMainScreen] TopAd5 데이터 없음');
        setLoading(false);
        return;
      }

      const markerData = topAd5Response.map((ad: any, index: number) => ({
        advertisement: ad.advertisement || ad.adid || ad.ad || String(ad.campid || ''),
        campid: ad.campid || '',
        name: ad.name || '',
        iconurl: ad.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
        joindesc: ad.joindesc || '',
        xrunPrice: ad.xrunPrice || 0,
        xrunprice: ad.xrunPrice || 0,
        distance: 0, 
        urlAD: ad.urlAD || '',
        ad_company: ad.ad_company || '',
        coins: ad.coins || '0',
        thumbnail: ad.thumbnail || '',
        brandlogo: ad.brandlogo || '',
        adthumbnail2: ad.adthumbnail2 || '',
        symbolimg: ad.symbolimg || '',
      }));

      if (markerData && markerData.length > 0) {

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

        let completedAdsSet = new Set<string>();
        try {

          const existingCompletedAds = completedAdsSetRef.current ? new Set(completedAdsSetRef.current) : new Set<string>();

          completedAdsSet = await getCompletedAdsSet(member, navigate);
          console.log(`[CameraMainScreen] 완료된 광고 목록: ${completedAdsSet.size}개`);

          const mergedSet = new Set<string>();
          existingCompletedAds.forEach(campid => mergedSet.add(campid));
          completedAdsSet.forEach(campid => mergedSet.add(campid));

          completedAdsSetRef.current = mergedSet;
          console.log(`[CameraMainScreen] 완료된 광고 목록 병합: 기존 ${existingCompletedAds.size}개 + 새로 ${completedAdsSet.size}개 = 총 ${mergedSet.size}개`);
        } catch (error) {
          console.warn('[CameraMainScreen] 완료된 광고 목록 조회 실패 (무시):', error);

          if (!completedAdsSetRef.current) {
            completedAdsSetRef.current = new Set<string>();
          }
        }

        const filteredValidatedCoinsData = validatedCoinsData;

        try {

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

          console.log('[CameraMainScreen API] 1단계: TopAd5 데이터 확인 시작');
          const storedTopAd5 = await getStoredTopAd5();

          if (!topAd5Response || !Array.isArray(topAd5Response) || topAd5Response.length === 0) {
            console.warn('[CameraMainScreen API] TopAd5 API 호출 실패 또는 빈 배열. 저장된 데이터 사용 시도 (오래되었어도)');
            const storedData = await getStoredTopAd5();
            if (storedData && Array.isArray(storedData) && storedData.length > 0) {
              topAd5Response = storedData;
            }
          }

          if (topAd5Response && Array.isArray(topAd5Response) && topAd5Response.length > 0) {
            console.warn('🚦 [CameraMainScreen API] TopAd5 조건 충족. 로직 진입. 개수:', topAd5Response.length);
            console.log('✅ [CameraMainScreen API] TopAd5 데이터 발견:', topAd5Response.length, '개');

            if (topAd5Response.length > 0) {
              const firstAd = topAd5Response[0];
              console.log('[CameraMainScreen API] 첫 번째 광고 urlAD 확인:', {
                campid: firstAd?.campid,
                ad_company: firstAd?.ad_company,
                urlAD: firstAd?.urlAD || '없음',
                urlAD_type: typeof firstAd?.urlAD,
                urlAD_length: firstAd?.urlAD?.length || 0,
                allKeys: Object.keys(firstAd || {}),
              });
            }

            if (topAd5Response.length === 0) {
              console.warn('[CameraMainScreen] TopAd5 데이터가 없습니다.');
              topAd5Response = null;
            }
          }

          if (topAd5Response && Array.isArray(topAd5Response) && topAd5Response.length > 0) {

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

            const sortedCoinsData = [...filteredValidatedCoinsData].sort((a, b) => {
              const distanceA = parseFloat(String(a.distance || 0));
              const distanceB = parseFloat(String(b.distance || 0));
              return distanceA - distanceB; 
            });

            console.log('📊 [CameraMainScreen API] 거리 순 정렬 완료 (가까운 순서)');

            const MAX_TOKENS_PER_CAMPAIGN = 5;
            const maxMappedTokens = topAd5Response.length * MAX_TOKENS_PER_CAMPAIGN;

            const campaignTokenCount = new Map<number, number>();

            const mappedCoinsData = sortedCoinsData.map((coin: any, index: number) => {

              if (index >= maxMappedTokens) {
                return coin;
              }

              const adIndex = index % topAd5Response.length;
              const mappedAd = topAd5Response[adIndex];

              const mappedCampid = (mappedAd?.campid !== undefined && mappedAd?.campid !== null) ? String(mappedAd.campid) : '';
              const campid = mappedCampid || coin.campid || coin.campId || '';

              const adKey = mappedCampid || String(coin.campid || coin.campId || '');
              const cachedItem = loadedCache[adKey];
              let finalUrlAD = cachedItem?.urlAD || mappedAd?.urlAD || mappedAd?.landing_url || coin.urlAD || coin.landing_url || '';

              if (finalUrlAD === '없음') {
                finalUrlAD = '';
              }

              if (!finalUrlAD || finalUrlAD === '') {
                console.log(`⚠️ [CameraMainScreen API] ${campid}는 urlAD가 없지만 매핑은 진행 (나중에 pre-fetch 예정)`);
                console.log(`🔍 [CameraMainScreen API] urlAD 확인 상세:`, {
                  cachedItem_urlAD: cachedItem?.urlAD,
                  mappedAd_urlAD: mappedAd?.urlAD,
                  mappedAd_landing_url: mappedAd?.landing_url,
                  coin_urlAD: coin.urlAD,
                  coin_landing_url: coin.landing_url,
                });
              }

              if (campid) {
                const currentCount = campaignTokenCount.get(campid) || 0;
                if (currentCount >= MAX_TOKENS_PER_CAMPAIGN) {
                  return coin;
                }
                campaignTokenCount.set(campid, currentCount + 1);
              }

              console.log(`🔗 [CameraMainScreen API] 토큰 ${index} 매핑 상세:`, {
                adIndex,
                adCompany: mappedAd?.ad_company,
                mappedAd_campid: mappedAd?.campid,
                mappedCampid,
                coin_campid: coin.campid,
                final_campid: campid,
                mappedAd_urlAD: mappedAd?.urlAD || '없음',
                cachedItem_urlAD: cachedItem?.urlAD || '없음',
                coin_urlAD: coin.urlAD || '없음',
                finalUrlAD: finalUrlAD || 'EMPTY',
                hasUrlAD: !!finalUrlAD,
              });

              if (cachedItem) {
                console.log(`💾 [CameraMainScreen API] 매핑 중 캐시 데이터 발견: ${adKey}`);
              }

              return {
                ...coin,

                distance: Number(coin.distance) || 0,

                name: cachedItem?.name || mappedAd?.name || coin.name || coin.title || coin.brand || 'Unknown coin',
                iconurl: mappedAd?.iconurl || coin.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: cachedItem?.joindesc || mappedAd?.joindesc || coin.joindesc || '',
                xrunPrice: cachedItem?.xrunPrice || mappedAd?.xrunPrice || coin.xrunPrice || coin.xrunprice || coin.price || coin.coins || 0,
                xrunprice: cachedItem?.xrunPrice || mappedAd?.xrunPrice || coin.xrunprice || coin.xrunPrice || coin.price || coin.coins || '',

                campid: (mappedAd?.campid !== undefined && mappedAd?.campid !== null) 
                  ? String(mappedAd.campid) 
                  : (coin.campid || coin.campId || ''),

                advertisement: mappedAd?.advertisement || mappedAd?.adid || mappedAd?.ad || (mappedAd?.campid ? String(mappedAd.campid) : '') || coin.advertisement || coin.adid || coin.ad || coin.coin || '',

                urlAD: finalUrlAD && finalUrlAD !== '없음' ? finalUrlAD : '', 
                landing_url: finalUrlAD && finalUrlAD !== '없음' ? finalUrlAD : '', 
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

            if (currentIndexRef.current !== 0) {
              currentIndexRef.current = 0;
              console.log('🔄 [CameraMainScreen API] TopAd5 매핑 후 인덱스 리셋 (항상 처음 5개 사용)');
            }

            try {
              organizeData(mappedCoinsData, loadedCache);
            } catch (organizeErr) {
              console.error('❌ [CameraMainScreen API] organizeData 실행 중 오류:', organizeErr);
            }

            const startPreFetch = async (cache: { [key: string]: any }) => {

              if (isPreFetchingRef.current) {
                console.log('🚫 [PreFetch] 이미 실행 중이라 중단됨');
                return;
              }
              isPreFetchingRef.current = true;

              try {
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

                    if (cacheKey && cachedAds[cacheKey] && cachedAds[cacheKey].urlAD) {

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
                        const response = await fetch(checkUrl);
                        const jsonResponse = await response.json();

                        if (company === 'nas') {
                          const resCode = typeof jsonResponse.result === 'string' ? parseInt(jsonResponse.result, 10) : jsonResponse.result;
                          if (resCode === 200 && jsonResponse.lurl) {
                            fetchedData = {
                              urlAD: jsonResponse.lurl,
                              name: jsonResponse.name
                            };
                          }
                        } else if (company === 'pointclick') {
                          if (jsonResponse.result_code === 200 && jsonResponse.landing_url) {
                            fetchedData = {
                              urlAD: jsonResponse.landing_url,
                              name: jsonResponse.ad_name
                            };
                          }
                        }
                      } catch (fetchErr) {
                        console.error(`❌ [PreFetch] Fetch 오류:`, fetchErr);
                      }
                    }

                    if (fetchedData && fetchedData.urlAD) {

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

                setCoinsData(updatedCoinsData);

                organizeData(updatedCoinsData, currentPreFetchCache);

              } catch (err) {
                console.error('❌ [CameraMainScreen API] 백그라운드 pre-fetch 오류:', err);
              }
            };

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

      if (useCache) {
        console.log(`[${Platform.OS} AR 화면] 캐시 사용 완료, 백그라운드에서 최신 데이터 업데이트 시작`);

        getTopAd5(undefined, true, true).then((latestResponse) => {
          if (latestResponse && Array.isArray(latestResponse) && latestResponse.length > 0) {
            console.log(`[${Platform.OS} AR 화면] 백그라운드 업데이트 완료:`, latestResponse.length, '개 광고');

            const latestMarkerData = latestResponse.map((ad: any, index: number) => ({
              advertisement: ad.advertisement || ad.adid || ad.ad || String(ad.campid || ''),
              campid: ad.campid || '',
              name: ad.name || '',
              iconurl: ad.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
              joindesc: ad.joindesc || '',
              xrunPrice: ad.xrunPrice || 0,
              xrunprice: ad.xrunPrice || 0,
              distance: 0,
              urlAD: ad.urlAD || '',
              ad_company: ad.ad_company || '',
              coins: ad.coins || '0',
              thumbnail: ad.thumbnail || '',
              brandlogo: ad.brandlogo || '',
              adthumbnail2: ad.adthumbnail2 || '',
              symbolimg: ad.symbolimg || '',
            }));

            if (latestMarkerData && latestMarkerData.length > 0) {
              const validatedLatestCoinsData = latestMarkerData.map((coin: any) => ({
                ...coin,
                iconurl: coin.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: coin.joindesc || '',
                name: coin.name || coin.title || coin.brand || 'Unknown coin',
                xrunprice: coin.xrunprice || coin.xrunPrice || coin.price || coin.coins || '',
                xrunPrice: coin.xrunPrice || coin.xrunprice || coin.price || coin.coins || 0,
                campid: coin.campid || coin.campId || '',
                advertisement: coin.advertisement || coin.adid || coin.ad || coin.coin || '',
              }));

              setCoinsData(validatedLatestCoinsData);
              organizeData(validatedLatestCoinsData);
            }
          }
        }).catch((updateError) => {
          console.warn(`[${Platform.OS} AR 화면] 백그라운드 업데이트 실패 (무시):`, updateError);
        });
      }
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [navigate, organizeData]);

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

      AsyncStorage.getItem('cached_AD').then((cachedStr) => {
        if (cachedStr) {
          try {
            const latestCache = JSON.parse(cachedStr);
            organizeData(coinsData, latestCache);
          } catch (e) {
            organizeData(coinsData);
          }
        } else {
          organizeData(coinsData);
        }
      }).catch(() => {
        organizeData(coinsData);
      });
    }
  }, [coinsData, organizeData]);

  const refreshTopAd5Data = useCallback(async () => {
    try {
      console.log('[CameraMainScreen] 10분 주기: 최신 데이터 가져오기 시작');

      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        console.warn('[CameraMainScreen] 백그라운드: userData 없음');
        return;
      }
      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member?.toString() || '';
      if (!member) {
        console.warn('[CameraMainScreen] 백그라운드: member 없음');
        return;
      }

      const [topAd5Response, completedAdsSet] = await Promise.all([
        getTopAd5(navigate, true, true).catch(() => null), 
        getCompletedAdsSet(member, navigate).catch(() => new Set<string>()),
      ]);

      if (completedAdsSet && completedAdsSet.size > 0) {
        completedAdsSetRef.current = completedAdsSet;
        console.log(`[CameraMainScreen] 백그라운드: 완료된 광고 목록 업데이트: ${completedAdsSet.size}개`);
      }

      if (topAd5Response && Array.isArray(topAd5Response) && topAd5Response.length > 0) {
        console.log('[CameraMainScreen] 백그라운드: TopAd5 데이터 가져옴 (캐시 또는 API):', topAd5Response.length, '개');

        if (topAd5Response.length > 0) {

          setCoinsData((prevCoinsData) => {
            if (!prevCoinsData || prevCoinsData.length === 0) {
              return prevCoinsData;
            }

            const sortedCoinsData = [...prevCoinsData].sort((a, b) => {
              const distanceA = parseFloat(String(a.distance || 0));
              const distanceB = parseFloat(String(b.distance || 0));
              return distanceA - distanceB;
            });

            const MAX_TOKENS_PER_CAMPAIGN = 5;
            const maxMappedTokens = topAd5Response.length * MAX_TOKENS_PER_CAMPAIGN;
            const campaignTokenCount = new Map<number, number>();

            const updatedCoinsData = sortedCoinsData.map((coin: any, index: number) => {
              if (index >= maxMappedTokens) {
                return coin;
              }

              const adIndex = index % topAd5Response.length;
              const mappedAd = topAd5Response[adIndex];
              const campid = mappedAd?.campid;

              if (campid) {
                const currentCount = campaignTokenCount.get(campid) || 0;
                if (currentCount >= MAX_TOKENS_PER_CAMPAIGN) {
                  return coin;
                }
                campaignTokenCount.set(campid, currentCount + 1);
              }

              return {
                ...coin,
                distance: Number(coin.distance) || 0,
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
                urlAD: mappedAd?.urlAD || coin.urlAD || '',
              };
            });

            currentIndexRef.current = 0;

            setTimeout(() => {
              organizeData(updatedCoinsData);
            }, 0);
            console.log('[CameraMainScreen] 백그라운드: 최신 데이터로 토큰 업데이트 완료');
            return updatedCoinsData;
          });
        }
      }
    } catch (bgError) {
      console.warn('[CameraMainScreen] 백그라운드 업데이트 실패:', bgError);
    }
  }, [navigate, organizeData]);

  useEffect(() => {
    if (activeTab !== 'Camera') {
      return; 
    }

    console.log('⏰ [CameraMainScreen] 10분 주기 광고 목록 갱신 타이머 시작');
    const interval = setInterval(() => {
      console.log('⏰ 10분 경과 - 광고 목록 갱신 시작');
      refreshTopAd5Data();
    }, 10 * 60 * 1000); 

    return () => {
      console.log('⏰ [CameraMainScreen] 10분 주기 광고 목록 갱신 타이머 정리');
      clearInterval(interval);
    };
  }, [activeTab, refreshTopAd5Data]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: typeof appState) => {
      console.log('📱 AppState 변경:', appState, '->', nextAppState);

      if (appState.match(/inactive|background/) && nextAppState === 'active') {

        console.log('🔄 앱 활성화 - 토큰 애니메이션 재시작');
        resumeAllAnimations();

        if (activeTab === 'Camera') {
          const checkAndRefresh = async () => {
            try {

              const shouldNavigateToCamera = await AsyncStorage.getItem('shouldNavigateToCamera');
              if (shouldNavigateToCamera === 'true') {
                console.log('[CameraMainScreen] 광고보기 완료 감지 - 이미 AR 화면에 있음');
                await AsyncStorage.removeItem('shouldNavigateToCamera');
              }

              const shouldRefresh = await AsyncStorage.getItem('shouldRefreshTopAd5');
              if (shouldRefresh === 'true') {
                console.log('[CameraMainScreen] 광고보기 완료 감지 - TopAd5 및 토큰 데이터 새로고침');

                await AsyncStorage.removeItem('shouldRefreshTopAd5');

                const completedAdCampid = await AsyncStorage.getItem('completedAdCampid');
                if (completedAdCampid) {
                  await AsyncStorage.removeItem('completedAdCampid');
                  console.log(`[CameraMainScreen] 완료된 광고 제거 및 대체 시작: ${completedAdCampid}`);

                  try {
                    const cachedStr = await AsyncStorage.getItem('completedAdsCache');
                    if (cachedStr) {
                      const cached = JSON.parse(cachedStr);
                      if (Array.isArray(cached)) {
                        completedAdsSetRef.current = new Set(cached);
                        console.log(`[CameraMainScreen] completedAdsCache에서 로드: ${cached.length}개 (${completedAdCampid} 포함 여부: ${cached.includes(completedAdCampid)})`);
                      }
                    }
                  } catch (cacheError) {
                    console.warn('[CameraMainScreen] completedAdsCache 읽기 실패:', cacheError);
                  }

                  if (!completedAdsSetRef.current) {
                    completedAdsSetRef.current = new Set<string>();
                  }
                  if (!completedAdsSetRef.current.has(completedAdCampid)) {
                    completedAdsSetRef.current.add(completedAdCampid);
                    console.log(`[CameraMainScreen] completedAdsSetRef에 추가: ${completedAdCampid} (현재 크기: ${completedAdsSetRef.current.size})`);
                  }

                  setTokens(prevTokens => [...prevTokens]);

                  await removeAdFromTopAd5(completedAdCampid, navigate);
                }

                try {

                  const userData = await AsyncStorage.getItem('userData');
                  if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    const member = parsedUserData?.member;
                    if (member) {

                      const completedAdsSet = await getCompletedAdsSet(member, navigate, true);
                      completedAdsSetRef.current = completedAdsSet;
                      console.log(`[CameraMainScreen] 완료된 광고 목록 업데이트: ${completedAdsSet.size}개`);

                      setTokens(prevTokens => [...prevTokens]);
                    }
                  }

                  console.log('[CameraMainScreen] TopAd5 및 토큰 데이터 새로고침 시작');
                  await loadTokenData(true);
                  console.log('[CameraMainScreen] TopAd5 및 토큰 데이터 새로고침 완료');
                } catch (error) {
                  console.error('[CameraMainScreen] TopAd5 새로고침 실패:', error);
                }
              }
            } catch (error) {
              console.error('[CameraMainScreen] 광고보기 완료 후 리프레시 실패:', error);
            }
          };

          setTimeout(checkAndRefresh, 500);
        }
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
  }, [appState, pauseAllAnimations, resumeAllAnimations, activeTab, loadTokenData]);

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
    hasAutoAdTriggeredRef.current = false;
  }, [selectedToken]);

  useEffect(() => {
    return () => {
      if (autoAdTimeoutRef.current) {
        clearTimeout(autoAdTimeoutRef.current);
        autoAdTimeoutRef.current = null;
      }

      if (tokenClickTimeoutRef.current) {
        clearTimeout(tokenClickTimeoutRef.current);
        tokenClickTimeoutRef.current = null;
      }

      hasAutoAdTriggeredRef.current = false;
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
      case 'xplay':
        navigate(ROUTES.xplayInfo);
        break;
      case 'wallet':
        navigate(ROUTES.wallet);
        break;
      case 'shop':
        navigate(ROUTES.shop);
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

      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member?.toString() || '';

      if (!member) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      const adCompany = token.ad_company || 'nas';
      console.log('🔍 ad_company 확인:', adCompany);

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

      let urlAD = token.urlAD || '';

      if (urlAD === '없음') {
        urlAD = '';
      }

      if (!urlAD || urlAD === '') {
        try {
          const storedAds = await getStoredTopAd5();
          if (storedAds && Array.isArray(storedAds)) {
            const foundAd = storedAds.find(ad => 
              ad.campid === campid || 
              String(ad.campid) === String(campid) ||
              ad.advertisement === advertisement ||
              String(ad.advertisement) === String(advertisement)
            );
            if (foundAd) {
              urlAD = foundAd.urlAD || foundAd.landing_url || '';

              if (urlAD === '없음') {
                urlAD = '';
              }
              if (urlAD) {
                console.log(`✅ [showAdInModal] getStoredTopAd5에서 urlAD 찾음:`, urlAD);
              }
            }
          }
        } catch (error) {
          console.warn('[showAdInModal] getStoredTopAd5에서 urlAD 찾기 실패:', error);
        }
      }

      if (!urlAD || urlAD === '') {
        console.error('❌ urlAD가 없습니다. WebView 모달을 표시할 수 없습니다.');
        showToast('광고 URL을 찾을 수 없습니다.');
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
        ad_company: adCompany,
        urlAD: urlAD && urlAD !== '없음' ? urlAD : '',
      };

      console.log('✅ showAdInModal 최종 파라미터:', JSON.stringify(adParams, null, 2));

      setSelectedToken(token);

      setAdvertisementParams(adParams);

      if (Platform.OS === 'ios') {

        navigate(ROUTES.showWebView);
      } else {

        webViewTokenRef.current = token;
        webViewAdParamsRef.current = adParams;

        setWebViewTitle(token.name || '광고');
        setWebViewError(false);
        setWebViewCanGoBack(false);
        setShowWebViewModal(true);

        (async () => {
          try {
            const resp = await fetch(urlAD, { method: 'GET' });
            const contentType = resp.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const json = await resp.json();
              if (json.lurl) {
                console.log('[WebView Modal] JSON lurl 추출:', json.lurl);
                setWebViewUrl(json.lurl);
                return;
              }
            }
          } catch {

          }
          setWebViewUrl(urlAD);
        })();
      }

      (async () => {
        try {

          try {
            const adType = adCompany === 'pock' || adCompany === 'pointclick' || adCompany === 'POCK' ? 'pointclick' : 'nas';
            await processAdReward(
              parseInt(member, 10),
              campid,
              adType,
              navigate,
            );
          } catch (rewardError: any) {
            if (rewardError?.code !== 404 && !rewardError?.message?.includes('404')) {
              console.warn('[WebView 모달] processAdReward 실패:', rewardError);
            }
          }

          try {
            await removeAdFromTopAd5(campid, navigate);
          } catch (removeError) {
            console.warn('[WebView 모달] removeAdFromTopAd5 실패:', removeError);
          }

          await addToCompletedAdsCache(campid);

          await AsyncStorage.setItem('isAdCompleted', 'true');
          await AsyncStorage.setItem('shouldRefreshTopAd5', 'true');
          await AsyncStorage.setItem('shouldNavigateToCamera', 'true');
          await AsyncStorage.setItem('completedAdCampid', campid);
        } catch (bgError) {
          console.warn('[WebView 모달] 리워드 처리 실패:', bgError);
        }
      })();
    } catch (error) {
      console.error('❌ showAdInModal 오류:', error);
    }
  }, [setAdvertisementParams, navigate]);

  const handleWebViewClose = useCallback(() => {
    console.log('[WebView] 닫기 버튼 클릭');
    setShowWebViewModal(false);
    setWebViewUrl('');
    setWebViewError(false); 
    setWebViewTitle('');
    setShowBottomPanel(false);
    setSelectedToken(null);

    webViewTokenRef.current = null;
    webViewAdParamsRef.current = null;
  }, []);

  const handleInfoIconPress = useCallback(async () => {

    if (!advertisementParams && !selectedToken && showWebViewModal) {

      if (webViewTokenRef.current && webViewAdParamsRef.current) {
        setSelectedToken(webViewTokenRef.current);
        setAdvertisementParams(webViewAdParamsRef.current);

        setTimeout(() => {
          setShowAdModal(true);
          console.log('✅ 광고 상세 모달 표시 완료 (ref 사용)');
        }, 100);
        return;
      }

      if (!webViewUrl) {
        console.error('❌ webViewUrl도 없습니다.');
        showToast('광고 정보를 찾을 수 없습니다.');
        return;
      }

      try {
        const storedAds = await getStoredTopAd5();
        console.log(`[i 아이콘] 저장된 광고 개수: ${storedAds?.length || 0}`);
        console.log(`[i 아이콘] 찾을 WebView URL: ${webViewUrl}`);

        if (storedAds && Array.isArray(storedAds)) {

          storedAds.forEach((ad, index) => {
            const adUrl = ad.urlAD || ad.landing_url || '';
            console.log(`[i 아이콘] 저장된 광고 ${index + 1}:`, {
              campid: ad.campid,
              urlAD: adUrl,
              name: ad.name,
            });
          });

          const normalizeUrl = (url: string): string => {
            try {
              const urlObj = new URL(url);

              return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
            } catch {

              return url;
            }
          };

          let foundAd = storedAds.find(ad => 
            ad.urlAD === webViewUrl || ad.landing_url === webViewUrl
          );

          if (!foundAd) {
            const normalizedWebViewUrl = normalizeUrl(webViewUrl);
            foundAd = storedAds.find(ad => {
              const adUrl = ad.urlAD || ad.landing_url || '';
              if (!adUrl) return false;
              const normalizedAdUrl = normalizeUrl(adUrl);
              return normalizedAdUrl === normalizedWebViewUrl;
            });
          }

          if (!foundAd) {
            const webViewDomain = webViewUrl.match(/https?:\/\/([^\/]+)/)?.[1];
            const webViewPath = webViewUrl.match(/https?:\/\/[^\/]+(\/[^?]*)/)?.[1];

            if (webViewDomain) {
              foundAd = storedAds.find(ad => {
                const adUrl = ad.urlAD || ad.landing_url || '';
                if (!adUrl) return false;
                return adUrl.includes(webViewDomain) && 
                       (webViewPath ? adUrl.includes(webViewPath) : true);
              });
            }
          }

          if (foundAd) {
            console.log('✅ WebView URL로 광고 정보 찾음:', foundAd);

            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
              const parsedUserData = JSON.parse(userData);
              const member = parsedUserData?.member?.toString() || '';

              if (member) {
                const adParams = {
                  member: member,
                  advertisement: foundAd.advertisement || foundAd.coin || '',
                  coin: foundAd.coin || '',
                  campid: foundAd.campid || '',
                  joindesc: foundAd.joindesc || '',
                  name: foundAd.name || webViewTitle || 'XRUN coin',
                  xrunPrice: foundAd.xrunPrice || 0,
                  coinScreen: true,
                  ad_company: foundAd.ad_company || 'nas',
                  urlAD: webViewUrl,
                };

                setAdvertisementParams(adParams);
                console.log('✅ advertisementParams 재설정 완료');
              }
            }
          } else {
            console.error('❌ WebView URL로 광고 정보를 찾을 수 없습니다.');
            showToast('광고 정보를 찾을 수 없습니다.');
            return;
          }
        }
      } catch (error) {
        console.error('❌ 광고 정보 재구성 실패:', error);
        showToast('광고 정보를 찾을 수 없습니다.');
        return;
      }
    } else if (!advertisementParams && !selectedToken) {
      console.error('❌ i 아이콘 클릭 - advertisementParams와 selectedToken이 모두 없습니다.');
      showToast('광고 정보를 찾을 수 없습니다.');
      return;
    }

    setTimeout(() => {
      setShowAdModal(true);
      console.log('✅ 광고 상세 모달 표시 완료');
    }, 100);
  }, [showAdModal, showWebViewModal, advertisementParams, selectedToken, webViewUrl, webViewTitle, setAdvertisementParams]);

  const navigateToAd = useCallback(async (token: TokenData) => {
    try {

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

      let urlAD = token.urlAD || '';

      if (urlAD === '없음') {
        urlAD = '';
      }

      if (!urlAD || urlAD === '') {
        try {
          const storedAds = await getStoredTopAd5();
          if (storedAds && Array.isArray(storedAds)) {
            const foundAd = storedAds.find(ad => 
              ad.campid === campid || 
              String(ad.campid) === String(campid) ||
              ad.advertisement === advertisement ||
              String(ad.advertisement) === String(advertisement)
            );
            if (foundAd) {
              urlAD = foundAd.urlAD || foundAd.landing_url || '';

              if (urlAD === '없음') {
                urlAD = '';
              }

            }
          }
        } catch (error) {
          console.warn('[navigateToAd] getStoredTopAd5에서 urlAD 찾기 실패:', error);
        }
      }

      if (!urlAD || urlAD === '') {
        console.error('❌ urlAD가 없습니다. WebView 모달을 표시할 수 없습니다.');
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
        ad_company: adCompany,
        urlAD: urlAD && urlAD !== '없음' ? urlAD : '',
      };

      setSelectedToken(token);

      setAdvertisementParams(adParams);

      if (Platform.OS === 'ios') {

        navigate(ROUTES.showWebView);
      } else {

        webViewTokenRef.current = token;
        webViewAdParamsRef.current = adParams;

        setWebViewUrl(urlAD);
        setWebViewTitle(token.name || '광고');
        setShowWebViewModal(true);
      }

      (async () => {
        try {

          try {
            const adType = adCompany === 'pock' || adCompany === 'pointclick' || adCompany === 'POCK' ? 'pointclick' : 'nas';
            await processAdReward(
              parseInt(member, 10),
              campid,
              adType,
              navigate,
            );
          } catch (rewardError: any) {
            if (rewardError?.code !== 404 && !rewardError?.message?.includes('404')) {
              console.warn('[navigateToAd] processAdReward 실패:', rewardError);
            }
          }

          try {
            await removeAdFromTopAd5(campid, navigate);
          } catch (removeError) {
            console.warn('[navigateToAd] removeAdFromTopAd5 실패:', removeError);
          }

          await addToCompletedAdsCache(campid);

          await AsyncStorage.setItem('isAdCompleted', 'true');
          await AsyncStorage.setItem('shouldRefreshTopAd5', 'true');
          await AsyncStorage.setItem('shouldNavigateToCamera', 'true');
          await AsyncStorage.setItem('completedAdCampid', campid);
        } catch (bgError) {
          console.warn('[navigateToAd] 리워드 처리 실패:', bgError);
        }
      })();
    } catch (error) {
      console.error('❌ navigateToAd 오류:', error);
    }
  }, [setAdvertisementParams, navigate]);

  useEffect(() => {
    if (showBottomPanel && selectedToken && !hasAutoAdTriggeredRef.current) {

      const campid = String(selectedToken.campid || '');
      if (campid && campid !== '' && campid !== 'undefined') {

        if (completedAdsSetRef.current && completedAdsSetRef.current.has(campid)) {
          return; 
        }
      }

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

      hasAutoAdTriggeredRef.current = true;
      autoAdTimeoutRef.current = setTimeout(() => {
        navigateToAd(currentToken);
      }, 3000); 
    } else {

      if (autoAdTimeoutRef.current) {
        clearTimeout(autoAdTimeoutRef.current);
        autoAdTimeoutRef.current = null;
      }
      if (tokenClickTimeoutRef.current) {
        clearTimeout(tokenClickTimeoutRef.current);
        tokenClickTimeoutRef.current = null;
      }
    }

    return () => {
      if (autoAdTimeoutRef.current) {
        clearTimeout(autoAdTimeoutRef.current);
        autoAdTimeoutRef.current = null;
      }
      if (tokenClickTimeoutRef.current) {
        clearTimeout(tokenClickTimeoutRef.current);
        tokenClickTimeoutRef.current = null;
      }
    };
  }, [showBottomPanel, selectedToken, navigateToAd]);

  const handleTokenClick = useCallback((token: TokenData) => {

    if (autoAdTimeoutRef.current) {
      clearTimeout(autoAdTimeoutRef.current);
      autoAdTimeoutRef.current = null;
    }
    if (tokenClickTimeoutRef.current) {
      clearTimeout(tokenClickTimeoutRef.current);
      tokenClickTimeoutRef.current = null;
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

    setSelectedToken(tokenCopy);
    setShowBottomPanel(true); 

    tokenClickTimeoutRef.current = setTimeout(() => {
      tokenClickTimeoutRef.current = null; 
      showAdInModal(tokenCopy);
    }, 2000);
  }, [showAdInModal]);

  const bottomNavItems = [
    { id: 'xplay', label: t('components.bottomNavigationBar.xplay'), icon: iconXplay },
    { id: 'shop', label: t('components.bottomNavigationBar.shop'), icon: iconShop },
    { id: 'map', label: '' }, 
    { id: 'wallet', label: t('components.bottomNavigationBar.wallet'), icon: iconWallet },
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

              return tokens
                .sort((a, b) => (b.distance || 0) - (a.distance || 0)) 
                .map((token) => {

                  const campid = String(token.campid || '');

                  const isCompleted = campid && campid !== '' && campid !== 'undefined' && completedAdsSetRef.current
                    ? completedAdsSetRef.current.has(campid) 
                    : false;

                  const handleClick = () => {
                    console.log('🖱️ [TokenComponent] 토큰 클릭됨:', {
                      spotID: token.spotID,
                      advertisement: token.advertisement,
                      campid: token.campid,
                      coin: token.coin,
                      name: token.name,
                      isCompleted: isCompleted,
                    });

                    handleTokenClick(token);
                  };

                  const uniqueKey = `token-${token.spotID}-${campid}-${token.coin || ''}`;

                  return (
                    <TokenComponent
                      key={uniqueKey}
                      token={token}
                      onPress={handleClick} 
                      animationRefs={animationRefs}
                      appState={appState}
                      rageProgress={rageProgress}
                      isRageMode={isRageMode}
                      rageColor={rageColor}
                      calculateScaleBasedOnDistance={calculateScaleBasedOnDistance}
                      isCompleted={isCompleted}
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
              zIndex: 100, 
              pointerEvents: showBottomPanel ? 'box-none' : 'none', 
            },
          ]}>
          <Pressable
            onPress={() => {
              if (showBottomPanel) {
                setShowBottomPanel(false);

                if (autoAdTimeoutRef.current) {
                  clearTimeout(autoAdTimeoutRef.current);
                  autoAdTimeoutRef.current = null;
                }
                if (tokenClickTimeoutRef.current) {
                  clearTimeout(tokenClickTimeoutRef.current);
                  tokenClickTimeoutRef.current = null;
                }
                hasAutoAdTriggeredRef.current = false;
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
        visible={showWebViewModal}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        onRequestClose={handleWebViewClose}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' ,
            paddingBottom: Platform.OS === 'ios' ? 0 : 40,}}>
          {}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: Platform.OS === 'ios' ? 20 : 40,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            backgroundColor: '#fff',
          }}>
            {}
            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  if (webViewCanGoBack && webViewModalRef.current) {
                    webViewModalRef.current.goBack();
                  } else {
                    handleWebViewClose();
                  }
                }}
                style={{ padding: 4 }}
              >
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {}
            <Text 
              style={{
                fontSize: 18,
                fontFamily: 'Roboto-Bold',
                color: '#000',
                flex: 8,
                textAlign: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}
              numberOfLines={1}
              ellipsizeMode="tail"

            >
              {webViewTitle}
            </Text>

            {}
            <TouchableOpacity
              onPress={handleInfoIconPress}
              style={{
                flex: 2,
                alignItems: 'flex-end',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <Ionicons name="information-circle-outline" size={24} color="#388Dc8" />
            </TouchableOpacity>
          </View>

          {}
          {webViewUrl && !webViewError ? (
            <WebView
              ref={webViewModalRef}
              key={webViewUrl}
              source={{ uri: webViewUrl }}
              style={{ flex: 1 }}
              injectedJavaScript={`
                (function() {
                  let currentUrl = window.location.href;
                  const checkUrl = function() {
                    if (window.location.href !== currentUrl) {
                      const newUrl = window.location.href;
                      currentUrl = newUrl;
                      if (newUrl.startsWith('market://')) {
                        try {
                          const idMatch = newUrl.match(/[?&]id=([^&?#]+)/);
                          if (idMatch) {
                            const packageId = idMatch[1];
                            console.log('[injectedJS] window.location market:// 감지, React Native에 알림:', packageId);
                            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'marketRedirect',
                                packageId: packageId
                              }));
                            }
                            const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                            window.location.href = playStoreUrl;
                            return;
                          }
                        } catch (error) {
                          console.error('[injectedJS] market:// 변환 실패:', error);
                        }
                      }
                    }
                  };

                  setInterval(checkUrl, 100);

                  function convertMarketLinks() {
                    const links = document.querySelectorAll('a[href]');
                    links.forEach(function(link) {
                      const href = link.getAttribute('href');
                      if (href && href.startsWith('market://')) {
                        try {
                          const idMatch = href.match(/[?&]id=([^&?#]+)/);
                          if (idMatch) {
                            const packageId = idMatch[1];
                            const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                            link.setAttribute('href', playStoreUrl);
                            console.log('[injectedJS] market://를 play.google.com으로 변환:', playStoreUrl);
                          }
                        } catch (error) {
                          console.error('[injectedJS] market:// 변환 실패:', error);
                        }
                      }
                    });
                  }

                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', convertMarketLinks);
                  } else {
                    convertMarketLinks();
                  }

                  const observer = new MutationObserver(function(mutations) {
                    convertMarketLinks();
                  });

                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });

                  document.addEventListener('click', function(e) {
                    let target = e.target;
                    while (target && target !== document.body) {
                      if (target.tagName === 'A' && target.href) {
                        const url = target.href;
                        if (url.startsWith('market://')) {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            const idMatch = url.match(/[?&]id=([^&?#]+)/);
                            if (idMatch) {
                              const packageId = idMatch[1];
                              const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                              console.log('[injectedJS] market:// 클릭 가로채기, 변환:', playStoreUrl);
                              window.location.href = playStoreUrl;
                            }
                          } catch (error) {
                            console.error('[injectedJS] market:// 변환 실패:', error);
                          }
                          return false;
                        } else if (url.startsWith('intent://')) {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            const intentIndex = url.indexOf('#Intent');
                            const urlParamStart = url.indexOf('url=');
                            if (urlParamStart !== -1) {
                              const urlValueStart = urlParamStart + 4;
                              const urlValueEnd = intentIndex !== -1 ? intentIndex : url.length;
                              let urlValue = url.substring(urlValueStart, urlValueEnd);
                              const nextParamIndex = urlValue.indexOf('&');
                              if (nextParamIndex !== -1) {
                                urlValue = urlValue.substring(0, nextParamIndex);
                              }
                              if (urlValue) {
                                let decodedUrl = decodeURIComponent(urlValue);
                                if (decodedUrl.includes('%')) {
                                  decodedUrl = decodeURIComponent(decodedUrl);
                                }
                                console.log('[injectedJS] intent://에서 url 파라미터 추출:', decodedUrl);
                                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                                  window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'intentUrl',
                                    url: decodedUrl
                                  }));
                                }
                                return false;
                              }
                            }
                            const idMatch = url.match(/[?&]id=([^&?#]+)/);
                            if (idMatch) {
                              const packageId = idMatch[1];
                              const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                              console.log('[injectedJS] intent://에서 id 추출, Play Store URL:', playStoreUrl);
                              window.location.href = playStoreUrl;
                            }
                          } catch (error) {
                            console.error('[injectedJS] intent:// 변환 실패:', error);
                          }
                          return false;
                        }
                      }
                      target = target.parentElement;
                    }
                  }, true);
                })();
                true;
              `}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'marketRedirect') {
                    const playStoreUrl = `https://play.google.com/store/apps/details?id=${data.packageId}`;
                    console.log('[WebView] onMessage에서 market:// 변환:', playStoreUrl);
                    setWebViewUrl(playStoreUrl);
                  } else if (data.type === 'intentUrl') {
                    console.log('[WebView] onMessage에서 intent:// url 파라미터:', data.url);
                    Linking.openURL(data.url).catch((err) => {
                      console.error('[WebView] intent:// url 파라미터로 열기 실패:', err);
                    });
                  }
                } catch (error) {

                }
              }}
              onNavigationStateChange={(navState) => {
                setWebViewCanGoBack(navState.canGoBack);
                console.log('[WebView] 네비게이션:', navState.url);

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

                    const intentIndex = navState.url.indexOf('#Intent');
                    const urlParamStart = navState.url.indexOf('url=');
                    if (urlParamStart !== -1) {

                      const urlValueStart = urlParamStart + 4;

                      const urlValueEnd = intentIndex !== -1 ? intentIndex : navState.url.length;

                      let urlValue = navState.url.substring(urlValueStart, urlValueEnd);
                      const nextParamIndex = urlValue.indexOf('&');
                      if (nextParamIndex !== -1) {
                        urlValue = urlValue.substring(0, nextParamIndex);
                      }

                      if (urlValue) {
                        let decodedUrl = urlValue;
                        try {
                          decodedUrl = decodeURIComponent(urlValue);

                          if (decodedUrl.includes('%')) {
                            decodedUrl = decodeURIComponent(decodedUrl);
                          }
                        } catch (e) {

                          decodedUrl = urlValue;
                        }

                        console.log('[WebView] intent://에서 url 파라미터 추출 (onNavigationStateChange):', decodedUrl);
                        Linking.openURL(decodedUrl).catch((err) => {
                          console.error('[WebView] url 파라미터로 열기 실패:', err);

                          const idMatch = navState.url.match(/[?&]id=([^&?#]+)/);
                          if (idMatch) {
                            const packageId = idMatch[1];
                            const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                            console.log('[WebView] Play Store URL로 폴백:', playStoreUrl);
                            setWebViewUrl(playStoreUrl);
                          }
                        });
                        return;
                      }
                    }

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

                if (url.startsWith('market://')) {
                  console.warn('[WebView] market:// 스킴 감지 - 백엔드에서 변환되어야 함:', url);
                  return false; 
                }

                if (url.startsWith('intent://')) {
                  console.log('[WebView] intent:// 스킴 감지:', url);

                  try {

                    const intentIndex = url.indexOf('#Intent');
                    const urlParamStart = url.indexOf('url=');
                    if (urlParamStart !== -1) {

                      const urlValueStart = urlParamStart + 4;

                      const urlValueEnd = intentIndex !== -1 ? intentIndex : url.length;

                      let urlValue = url.substring(urlValueStart, urlValueEnd);
                      const nextParamIndex = urlValue.indexOf('&');
                      if (nextParamIndex !== -1) {
                        urlValue = urlValue.substring(0, nextParamIndex);
                      }

                      if (urlValue) {
                        let decodedUrl = urlValue;
                        try {
                          decodedUrl = decodeURIComponent(urlValue);

                          if (decodedUrl.includes('%')) {
                            decodedUrl = decodeURIComponent(decodedUrl);
                          }
                        } catch (e) {

                          decodedUrl = urlValue;
                        }

                        console.log('[WebView] intent://에서 url 파라미터 추출:', decodedUrl);

                        Linking.openURL(decodedUrl).catch((err) => {
                          console.error('[WebView] url 파라미터로 열기 실패:', err);

                          const idMatch = url.match(/[?&]id=([^&?#]+)/);
                          if (idMatch) {
                            const packageId = idMatch[1];
                            const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                            console.log('[WebView] Play Store URL로 폴백:', playStoreUrl);
                            Linking.openURL(playStoreUrl).catch((playStoreErr) => {
                              console.error('[WebView] Play Store URL 열기 실패:', playStoreErr);
                            });
                          }
                        });

                        return false;
                      }
                    }

                    const schemeMatch = url.match(/scheme=([^;]+)/);
                    const hostMatch = url.match(/intent:\/\/([^#]+)/);

                    if (schemeMatch && hostMatch) {
                      const scheme = schemeMatch[1];
                      const host = hostMatch[1];
                      const convertedUrl = `${scheme}://${host}`;

                      console.log('[WebView] intent://를 일반 URL로 변환:', convertedUrl);

                      Linking.openURL(convertedUrl).catch((err) => {
                        console.error('[WebView] 변환된 URL 열기 실패:', err);

                        Linking.openURL(url).catch((intentErr) => {
                          console.error('[WebView] Intent URL 열기 실패:', intentErr);
                        });
                      });

                      return false;
                    }

                    const packageMatch = url.match(/package=([^;]+)/);
                    if (packageMatch) {
                      const packageName = packageMatch[1];
                      const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
                      console.log('[WebView] package 파라미터로 Play Store URL 생성:', playStoreUrl);

                      Linking.openURL(playStoreUrl).catch((err) => {
                        console.error('[WebView] Play Store URL 열기 실패:', err);

                        Linking.openURL(url).catch((intentErr) => {
                          console.error('[WebView] Intent URL 열기 실패:', intentErr);
                        });
                      });

                      return false;
                    }

                    console.log('[WebView] intent:// 파싱 실패, 원본 Intent URL로 열기 시도');
                    Linking.openURL(url).catch((err) => {
                      console.error('[WebView] Intent URL 열기 실패:', err);
                    });
                  } catch (error) {
                    console.error('[WebView] intent:// 처리 중 오류:', error);

                    Linking.openURL(url).catch((err) => {
                      console.error('[WebView] Intent URL 열기 실패:', err);
                    });
                  }

                  return false; 
                }

                if (url.startsWith('whale://')) {
                  console.log('[WebView] whale:// 스킴 감지:', url);

                  try {
                    const urlMatch = url.match(/url=([^&]+)/);
                    if (urlMatch) {
                      const decodedUrl = decodeURIComponent(urlMatch[1]);
                      console.log('[WebView] whale://에서 URL 추출:', decodedUrl);

                      Linking.openURL(decodedUrl).catch((err) => {
                        console.error('[WebView] 추출된 URL 열기 실패:', err);
                      });
                    } else {

                      Linking.openURL(url).catch((err) => {
                        console.error('[WebView] whale:// URL 열기 실패:', err);
                      });
                    }
                  } catch (error) {
                    console.error('[WebView] whale:// 처리 중 오류:', error);

                    Linking.openURL(url).catch((err) => {
                      console.error('[WebView] whale:// URL 열기 실패:', err);
                    });
                  }

                  return false; 
                }

                if (url.startsWith('http://') || url.startsWith('https://')) {
                  return true;
                }

                return false;
              }}
              renderError={(errorDomain, errorCode, errorDesc) => {

                return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
              }}
              onError={async (syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView 오류:', nativeEvent);

                if (nativeEvent.code === -10 && nativeEvent.url) {
                  const url = nativeEvent.url;
                  console.log('[WebView] ERR_UNKNOWN_URL_SCHEME 감지:', url);

                  if (url.startsWith('intent://')) {
                    try {

                      const intentIndex = url.indexOf('#Intent');
                      const urlParamStart = url.indexOf('url=');
                      if (urlParamStart !== -1) {
                        const urlValueStart = urlParamStart + 4;
                        const urlValueEnd = intentIndex !== -1 ? intentIndex : url.length;
                        let urlValue = url.substring(urlValueStart, urlValueEnd);
                        const nextParamIndex = urlValue.indexOf('&');
                        if (nextParamIndex !== -1) {
                          urlValue = urlValue.substring(0, nextParamIndex);
                        }
                        if (urlValue) {
                          let decodedUrl = urlValue;
                          try {
                            decodedUrl = decodeURIComponent(urlValue);
                            if (decodedUrl.includes('%')) {
                              decodedUrl = decodeURIComponent(decodedUrl);
                            }
                          } catch (e) {
                            decodedUrl = urlValue;
                          }
                          console.log('[WebView] onError에서 intent:// url 파라미터 추출:', decodedUrl);
                          Linking.openURL(decodedUrl).catch((err) => {
                            console.error('[WebView] intent:// url 파라미터로 열기 실패:', err);
                          });
                          return; 
                        }
                      }

                      const idMatch = url.match(/[?&]id=([^&?#]+)/);
                      if (idMatch) {
                        const packageId = idMatch[1];
                        const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                        console.log('[WebView] onError에서 intent:// id 추출, Play Store URL:', playStoreUrl);
                        setWebViewUrl(playStoreUrl);
                        return; 
                      }
                    } catch (error) {
                      console.error('[WebView] onError에서 intent:// 처리 실패:', error);
                    }
                  } else if (url.startsWith('market://')) {
                    try {
                      const idMatch = url.match(/[?&]id=([^&?#]+)/);
                      if (idMatch) {
                        const packageId = idMatch[1];
                        const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
                        console.log('[WebView] onError에서 market:// 변환:', playStoreUrl);
                        setWebViewUrl(playStoreUrl);
                        return; 
                      }
                    } catch (error) {
                      console.error('[WebView] onError에서 market:// 처리 실패:', error);
                    }
                  }
                }

                setWebViewError(true);

                if (Platform.OS === 'ios' && (nativeEvent.code === -1022 || nativeEvent.code === -1200)) {
                  const errorType = nativeEvent.code === -1022 ? 'ATS' : 'TLS';
                  console.error(`[WebView] ${errorType} 오류 감지 (${nativeEvent.code}):`, nativeEvent.url || webViewUrl);

                  let url = nativeEvent.url || webViewUrl;

                  if (url && url.startsWith('http://')) {
                    const httpsUrl = url.replace('http://', 'https://');
                    console.log('[WebView] HTTP를 HTTPS로 변환 시도:', httpsUrl);

                    try {
                      setWebViewError(false); 
                      setWebViewUrl(httpsUrl);
                      return; 
                    } catch (error) {
                      console.error('[WebView] HTTPS 변환 후 재시도 실패:', error);
                      url = httpsUrl; 
                    }
                  }

                  if (url) {
                    await showAlert(
                      errorType === 'ATS' ? '보안 연결 오류' : '보안 연결 오류',
                      errorType === 'ATS' 
                        ? '이 페이지는 보안 연결(HTTPS)을 사용하지 않아 로드할 수 없습니다. 외부 브라우저로 열까요?'
                        : '이 페이지는 보안 연결을 사용할 수 없습니다. 외부 브라우저로 열까요?',
                      [
                        {
                          text: '취소',
                          style: 'cancel',
                          onPress: () => {

                            handleWebViewClose();
                          },
                        },
                        {
                          text: '외부 브라우저로 열기',
                          onPress: () => {
                            Linking.openURL(url).catch((err) => {
                              console.error('[WebView] 외부 브라우저 열기 실패:', err);
                            });

                            handleWebViewClose();
                          },
                        },
                      ],
                    );
                  }
                }
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView HTTP 오류:', nativeEvent);
              }}
            />
          ) : null}
        </View>
      </Modal>

      {}
      <Modal
        visible={showAdModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {

          setShowAdModal(false);
        }}
        onDismiss={() => {

          console.log('📱 [CameraMainScreen] 광고 상세 모달이 완전히 닫혔습니다 (onDismiss)');

          if (Platform.OS === 'ios') {
            console.log('🔄 [CameraMainScreen] onDismiss에서 iOS 복원 트리거');
            setTimeout(() => {
              setRefreshKey(prev => prev + 1);
            }, 100);
          }
        }}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          {(() => {

            const adCompany = advertisementParams?.ad_company || selectedToken?.ad_company || 'nas';
            console.log('🔍 모달 내부 ad_company 확인:', adCompany, {
              fromParams: advertisementParams?.ad_company,
              fromToken: selectedToken?.ad_company,
              final: adCompany,
            });

            if (adCompany === 'pock' || adCompany === 'pointclick' || adCompany === 'POCK') {
              return (
                <ShowPockAdScreen
                  onClose={async () => {
                    setShowAdModal(false);

                    if (autoAdTimeoutRef.current) {
                      clearTimeout(autoAdTimeoutRef.current);
                      autoAdTimeoutRef.current = null;
                    }
                    if (tokenClickTimeoutRef.current) {
                      clearTimeout(tokenClickTimeoutRef.current);
                      tokenClickTimeoutRef.current = null;
                    }
                    hasAutoAdTriggeredRef.current = false;

                    const shouldNavigateToCamera = await AsyncStorage.getItem('shouldNavigateToCamera');
                    if (shouldNavigateToCamera === 'true') {
                      await AsyncStorage.removeItem('shouldNavigateToCamera');

                    }
                  }}
                  isModal={true}
                />
              );
            } else {
              return (
                <ShowNapAdScreen
                  onClose={async () => {
                    setShowAdModal(false);

                    if (autoAdTimeoutRef.current) {
                      clearTimeout(autoAdTimeoutRef.current);
                      autoAdTimeoutRef.current = null;
                    }
                    if (tokenClickTimeoutRef.current) {
                      clearTimeout(tokenClickTimeoutRef.current);
                      tokenClickTimeoutRef.current = null;
                    }
                    hasAutoAdTriggeredRef.current = false;

                    const shouldNavigateToCamera = await AsyncStorage.getItem('shouldNavigateToCamera');
                    if (shouldNavigateToCamera === 'true') {
                      await AsyncStorage.removeItem('shouldNavigateToCamera');

                    }
                  }}
                  isModal={true}
                />
              );
            }
          })()}
        </View>
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

