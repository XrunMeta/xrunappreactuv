import React, { useEffect, useState, useRef, useCallback } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigationBar } from '../components';
import { TokenData, SpotData } from '../types';
import { fetchMapMarkerData } from '../services';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';

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
}

const TokenComponent: React.FC<TokenComponentProps> = ({ token, onPress, animationRefs, appState }) => {
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

    const blinkSpeed = 300; 
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
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
  }, [animateObject, position, blinkAnim]);

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
        style={styles.tokenButtonContainer}
        activeOpacity={0.7}>
        <View style={styles.tokenButton}>
          {}
          {parseFloat(String(distance)) < 20 && iconCatch && (
            <Animated.Image
              source={iconCatch}
              style={[
                styles.blinkImage,
                {
                  opacity: blinkAnim,
                },
              ]}
            />
          )}
          {iconXrunWhite && (
            <Image
              source={iconXrunWhite}
              style={[styles.tokenIcon, { marginTop: 3 }]}
            />
          )}
          <View style={{ alignItems: 'center', marginTop: -4 }}>
            <Text style={styles.tokenPriceText}>
              {token?.xrunPrice ? parseFloat(String(token.xrunPrice)).toFixed(2) : '0.00'}
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
let iconBottom: any = null;
let iconCatch: any = null;

try {
  iconXrunWhite = require('../../assets/images/icon_xrun_white.png');
} catch (e) {
  console.warn('icon_xrun_white.png not found');
}

try {
  iconBottom = require('../../assets/images/icon_bottom.png');
} catch (e) {
  console.warn('icon_bottom.png not found');
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
  const { setAdvertisementParams } = useAppContext();
  const [permission, requestPermission] = useCameraPermissions();

  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);

  const bottomPanelBottom = useRef(new Animated.Value(20)).current;

  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const currentIndexRef = useRef(0);
  const chunkSize = 4;

  const animationRefs = useRef<Map<number, React.MutableRefObject<Animated.CompositeAnimation | null>>>(new Map());

  const [appState, setAppState] = useState(AppState.currentState);

  const hasLoadedDataRef = useRef(false);

  const autoAdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoAdTriggeredRef = useRef(false); 

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const convertSpotDataToTokenData = (spotData: SpotData[], startIndex: number): TokenData[] => {
    const actualChunkSize = Math.min(chunkSize, spotData.length);
    let nextData: SpotData[] = [];

    if (startIndex + actualChunkSize > spotData.length) {
      nextData = [
        ...spotData.slice(startIndex),
        ...spotData.slice(0, (startIndex + actualChunkSize) % spotData.length),
      ];
    } else {
      nextData = spotData.slice(startIndex, startIndex + actualChunkSize);
    }

    return nextData.map((data, index) => {
      const spot = spots[index % spots.length];
      return {
        spotID: spot.spotID,
        x: spot.x,
        y: spot.y,
        xrunPrice: data.xrunPrice || 0,
        distance: data.distance || 0,
        name: data.name || 'XRUN coin',
        iconurl: data.iconurl || '',
        joindesc: data.joindesc || '',
        brand: data.brand || '',
        advertisement: data.coin || '',
        coin: data.coin || '',
        member: '',
        campid: data.coin || '', 
      };
    });
  };

  const loadTokenData = useCallback(async (forceRefresh: boolean = false) => {

    if (hasLoadedDataRef.current && !forceRefresh) {
      return;
    }

    try {
      setLoading(true);
      console.log('=== CameraMainScreen 데이터 로딩 시작 ===', forceRefresh ? '(강제 새로고침)' : '');

      if (!forceRefresh) {
        const astorCoinsData = await AsyncStorage.getItem('astorCoinsData');

        if (astorCoinsData) {
          console.log('✅ AsyncStorage에서 astorCoinsData 발견');
          try {
            const coinsData = JSON.parse(astorCoinsData);

            if (coinsData && Array.isArray(coinsData) && coinsData.length > 0) {

              const spotDataArray: SpotData[] = coinsData.map((coin: any) => ({
                spotID: coin.spotid || coin.spotID || coin.id || 0,
                distance: coin.distance || 0,
                direction: coin.direction || 0,
                name: coin.name || coin.title || coin.brand || 'XRUN coin',
                latitude: coin.latitude || coin.lat,
                longitude: coin.longitude || coin.lng,
                xrunPrice: coin.xrunprice || coin.xrunPrice || coin.price || 0,
                iconurl: coin.iconurl || '',
                joindesc: coin.joindesc || '',
                brand: coin.brand || coin.coin || '',
                coins: coin.coins || coin.coin || '',
                coin: coin.coin || '',
              }));

              if (spotDataArray.length > 0) {
                const newTokens = convertSpotDataToTokenData(spotDataArray, currentIndexRef.current);
                setTokens(newTokens);
                currentIndexRef.current = (currentIndexRef.current + Math.min(chunkSize, spotDataArray.length)) % spotDataArray.length;
              } else {
                setTokens([]);
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

        const newTokens = convertSpotDataToTokenData(markerData, currentIndexRef.current);
        setTokens(newTokens);
        currentIndexRef.current = (currentIndexRef.current + Math.min(chunkSize, markerData.length)) % markerData.length;
      } else {
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

  useEffect(() => {
    if (!hasLoadedDataRef.current) {
      loadTokenData(false); 
    }
  }, []); 

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ 20초 경과 - 서버에서 새 데이터 가져오기');
      loadTokenData(true); 
    }, 20000); 

    return () => clearInterval(interval);
  }, []); 

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });

    return () => {
      subscription?.remove();
    };
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

  const handleNavItemPress = (itemId: string) => {
    console.log('Navigation item pressed:', itemId);

  };

  const handleTabChange = (tab: 'Map' | 'Camera') => {
    onTabChange?.(tab);
  };

  const handleToggleBottomPanel = () => {
    if (showBottomPanel) {

      setShowBottomPanel(false);
    } else {

      if (!selectedToken) {
        console.log('selectedToken이 없어서 하단 패널을 열 수 없습니다.');
        return;
      }
      setShowBottomPanel(true);
    }
  };

  useEffect(() => {
    if (showBottomPanel) {
      Animated.timing(bottomPanelBottom, {
        toValue: 90, 
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
  }, [showBottomPanel]);

  const navigateToAd = useCallback(async (token: TokenData) => {
    try {

      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        console.log('userData가 없습니다.');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member?.toString() || '';

      setAdvertisementParams({
        member: member,
        advertisement: token.advertisement || token.coin || '',
        coin: token.coin || '',
        campid: token.campid || token.coin || '',
        joindesc: token.joindesc || '',
        name: token.name || 'XRUN coin',
        xrunPrice: token.xrunPrice || 0,
        coinScreen: true,
      });

      reset(ROUTES.showNapAd);
    } catch (error) {
      console.error('광고 화면 이동 실패:', error);
    }
  }, [setAdvertisementParams, reset]);

  const handleTokenClick = useCallback((token: TokenData) => {
    setSelectedToken(token);
    if (!showBottomPanel) {
      setShowBottomPanel(true);
    }

    const distance = parseFloat(String(token.distance || 0));
    if (distance < 20) {
      console.log('✅ 토큰 거리 20미터 이내 - 2초 후 광고 화면으로 이동');

      if (autoAdTimeoutRef.current) {
        clearTimeout(autoAdTimeoutRef.current);
        autoAdTimeoutRef.current = null;
      }

      hasAutoAdTriggeredRef.current = false;

      if (!hasAutoAdTriggeredRef.current) {
        hasAutoAdTriggeredRef.current = true;
        autoAdTimeoutRef.current = setTimeout(() => {
          navigateToAd(token);
        }, 2000);
      }
    } else {
      console.log('⚠️ 토큰 거리 20미터 초과 - 광고 화면으로 이동하지 않음');
    }
  }, [showBottomPanel, navigateToAd]);

  const bottomNavItems = [
    { id: 'wallet', label: 'Wallet', icon: iconWallet },
    { id: 'shop', label: 'Shop', icon: iconShop },
    { id: 'map', label: '' }, 
    { id: 'referral', label: 'Referral', icon: iconReferral },
    { id: 'info', label: 'Info', icon: iconUser },
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
            {tokens
              .sort((a, b) => (b.distance || 0) - (a.distance || 0)) 
              .map((token) => (
                <TokenComponent
                  key={token.spotID}
                  token={token}
                  onPress={() => handleTokenClick(token)}
                  animationRefs={animationRefs}
                  appState={appState}
                />
              ))}
          </View>
        )}

        {}
        {

}
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 0,
            top: 0,
            left: 0,
            zIndex: 5, 
          }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: bottomPanelBottom, 
                left: 0,
                right: 0,
                zIndex: 1,
              },
            ]}>
            <Pressable
              onPress={() => {
                if (showBottomPanel) {
                  console.log('📱 하단 패널 배경 터치 - 패널 닫기');
                  setShowBottomPanel(false);
                }
              }}
              style={{
                backgroundColor: showBottomPanel && selectedToken ? '#EFF4F5' : '#adadad',
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderTopStartRadius: 30,
                borderTopEndRadius: 30,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: showBottomPanel && selectedToken ? 150 : 35,
                paddingBottom: showBottomPanel && selectedToken ? 40 : 15,
                zIndex: 1,
                position: 'relative',
              }}>
              {}
              {showBottomPanel && selectedToken && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    paddingTop: 0,
                    gap: 10,
                    zIndex: 1,
                    pointerEvents: 'box-none', 
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
                          marginLeft: 10,
                          height: 65,
                          width: 65,
                          borderRadius: 10,
                          backgroundColor: '#161d2d',
                          padding: 10,
                        }}
                      />
                    )
                  ) : (
                    <Image
                      source={{ uri: selectedToken?.iconurl }}
                      resizeMode="contain"
                      style={{
                        marginLeft: 10,
                        height: 65,
                        width: 65,
                        borderRadius: 10,
                      }}
                    />
                  )}

                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        fontSize: 20,
                        color: '#343a59',
                        marginBottom: -9,
                        marginTop: -3,
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
                        fontFamily: 'Roboto-Medium',
                        fontSize: 16,
                        color: '#343a59',
                        marginTop: 10,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {!selectedToken?.joindesc ||
                      selectedToken?.joindesc.toString().trim() === ''
                        ? 'XRUN coin'
                        : selectedToken?.joindesc}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 12,
                        color: '#666',
                        marginTop: 5,
                      }}>
                      {(selectedToken?.xrunPrice || 0).toFixed(2)} {selectedToken?.brand || ''}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {

                      if (autoAdTimeoutRef.current) {
                        clearTimeout(autoAdTimeoutRef.current);
                        autoAdTimeoutRef.current = null;
                      }
                      hasAutoAdTriggeredRef.current = true; 

                      if (selectedToken) {
                        navigateToAd(selectedToken);
                      }
                    }}
                    style={{
                      backgroundColor: '#FFDC04',
                      paddingHorizontal: 15,
                      paddingVertical: 8,
                      borderColor: '#D9D9D9',
                      borderWidth: 1,
                      alignSelf: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-Bold',
                        color: 'black',
                      }}>
                      View ad
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </View>

      {}
      {}
      <View style={{ zIndex: 10 }}>
        <BottomNavigationBar
          items={bottomNavItems}
          activeItemId="map"
          activeTab={activeTab}
          onItemPress={handleNavItemPress}
          onTabChange={handleTabChange}
        />
      </View>
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
    zIndex: 10,
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
    zIndex: 100, 
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
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tokenDistanceText: {
    color: '#CCCCCC',
    fontSize: 10,
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

