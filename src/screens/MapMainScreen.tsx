import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import {

  View,

  StyleSheet,

  Platform,

  Dimensions,

  Text,

  Image,

  AppState,

  Pressable,

  ActivityIndicator,

} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import MapView, { MapStyleElement, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import * as Location from 'expo-location';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from 'react-i18next';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavigationBar, MapBottomPanel, SafeView, LevelNotification, WalletKeyPinSetupModal } from '../components';

import { CameraMainScreen } from './CameraMainScreen';

import { ROUTES, useAppNavigation } from '../navigation';

import { useAlertDialog } from '../context/AlertDialogContext';
import { useOTAUpdate } from '../context/OTAUpdateContext';

import { SpotData } from '../types';

import { fetchMapMarkerData, gatewayNodeJS, fetchVirtualCoin, getCoinNasPrice, getTopAd5, getStoredTopAd5, validateTopAd5Urls, getNasmobAds, getPockAds, removeAdFromTopAd5, getCompletedAdsSet, getApiBaseUrl } from '../services';
import { jwtPayloadSub, findEntriesForUser } from '../services/walletKeyStore';
import { preloadTaboolaHTML } from '../services/taboola';

import { cashingimages } from '../utils/imageCache';
import { getEnv } from '../utils/env';
import { COMMON_STYLES, FONTS } from '../constants';
import { collectDeviceInfo, getMinimalDeviceInfo } from '../utils/napApiUtils';
import { showToast } from '../utils';
import {
  shouldShowTutorial,
  TUTORIAL_PENDING_KEY,
  TUTORIAL_COMPLETED_KEY,
} from './walletKeyTutorialHelpers';

interface LocationData {

  latitude: number;

  longitude: number;

}

interface TopAd5Item {
  brandlogo: string;
  adthumbnail2: string;
  symbolimg: string;
  thumbnail: string;
  coins: number;
  nasPrice: number;
  campid: string;
  xrunPrice: number;
  gopaxPrice: number;
  iconurl: string;
  joindesc: string;
  name: string;
  ad_company: string;
}

let iconWallet: any = null;

let iconShop: any = null;

let iconReferral: any = null;

let iconUser: any = null;

let iconXplay: any = null;

let iconXrun: any = null;

let iconAdvertise: any = null;

let iconBell: any = null;

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

  iconAdvertise = require('../../assets/images/icon_advertisement.png');

} catch (e) {

  console.warn('icon_advertisement.png not found');

}

try {

  iconBell = require('../../assets/images/icon_bell.png');

} catch (e) {

  console.warn('icon_bell.png not found');

}

let iconMapPoint: any = null;

try {

  iconMapPoint = require('../../assets/images/locationpin2.png');

} catch (e) {

  console.warn('locationpin2.png not found');

}

let logoTempMarker: any = null;

try {

  logoTempMarker = require('../../assets/logo_tempMarker.png');

} catch (e) {

  console.warn('❌ [MapMainScreen] logo_tempMarker.png not found:', e);

  try {
    logoTempMarker = require('../../assets/icon_xrun_round_logo.png');

  } catch (e2) {
    console.warn('❌ [MapMainScreen] 대체 마커 이미지도 없음:', e2);
  }
}

let logoHorizontal: any = null;

try {
  logoHorizontal = require('../../assets/xrun-horizontal-logo.png');
  console.log('✅ [MapMainScreen] 상단 로고 이미지 로드 성공');
} catch (e) {
  console.warn('❌ [MapMainScreen] xrun-horizontal-logo.png not found:', e);
}

export const MapMainScreen: React.FC = () => {

  const { navigate, previousScreen } = useAppNavigation();

  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const { checkForUpdate } = useOTAUpdate();

  const prevScreenRef = useRef<string | null>(null);

  const tutorialGuardChecked = useRef(false);

  useEffect(() => {
    if (tutorialGuardChecked.current) return;
    tutorialGuardChecked.current = true;
    (async () => {
      try {
        const pending = await AsyncStorage.getItem(TUTORIAL_PENDING_KEY);
        const completed = await AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY);
        if (shouldShowTutorial(pending, completed)) {
          await AsyncStorage.removeItem(TUTORIAL_PENDING_KEY);
          navigate(ROUTES.walletKeyTutorial);
        }
      } catch (e) {
        console.warn('[MapMain] 튜토리얼 가드 확인 실패:', e);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  useEffect(() => {
    if (logoTempMarker) {
      console.log('✅ [MapMainScreen] 마커 이미지 사용 가능');
    } else {
      console.warn('⚠️ [MapMainScreen] 마커 이미지 없음 - 기본 마커 사용');
    }
  }, []);

  const { showAlert } = useAlertDialog();

  const [location, setLocation] = useState<LocationData | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'Map' | 'Camera'>('Map');

  const [showBottomPanel, setShowBottomPanel] = useState(false);

  const [selectedSpot, setSelectedSpot] = useState<SpotData | null>(null);

  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);

  const deviceHeadingRef = useRef<number | null>(null);

  const [markers, setMarkers] = useState<SpotData[]>([]);

  const [loadingMarkers, setLoadingMarkers] = useState(false);

  const loadingMarkersRef = useRef(false); 

  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const [topAd5Data, setTopAd5Data] = useState<TopAd5Item[]>([]);
  const topAd5DataRef = useRef<TopAd5Item[]>([]); 
  const isFetchingTopAd5Ref = useRef(false); 

  const [showCalloutPopup, setShowCalloutPopup] = useState(false);

  const [calloutPosition, setCalloutPosition] = useState({ x: 0, y: 0 });

  const [calloutData, setCalloutData] = useState<SpotData | null>(null);

  const mapRef = useRef<MapView>(null);

  const [initialLocation, setInitialLocation] = useState<LocationData | null>(null);

  const [lastFetchedLocation, setLastFetchedLocation] = useState<LocationData | null>(null);

  const lastFetchedLocationRef = useRef<LocationData | null>(null);

  const initialLocationRef = useRef<LocationData | null>(null);

  const dragTimerRef = useRef<NodeJS.Timeout | null>(null);

  const locationCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  const lastLocationChangeTimeRef = useRef<number>(Date.now());

  const lastMarkerRefreshTimeRef = useRef<number>(0);

  const mapRegionRef = useRef({
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const isProgrammaticMoveRef = useRef(false);

  const isUserTouchRef = useRef(false);

  const lastUpdatedRegionRef = useRef<{ latitude: number; longitude: number } | null>(null);

  const [mappingLocation, setMappingLocation] = useState<LocationData | null>(null);

  const lastMappingLocationRef = useRef<LocationData | null>(null);

  const lastMappingTimeRef = useRef<number>(0);

  const MAPPING_MIN_DISTANCE = 500;

  const MAPPING_MIN_INTERVAL = 10000; 

  const DEFAULT_LATITUDE_DELTA = 0.005;
  const DEFAULT_LONGITUDE_DELTA = 0.005;

  const hasMovedToCurrentLocationRef = useRef(false);

  const hasRequestedLocationPermissionRef = useRef(false);

  const headingSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const LAST_GPS_LOCATION_KEY = 'lastGpsLocationForMapMove';
  const LAST_GPS_LOCATION_TIMESTAMP_KEY = 'lastGpsLocationTimestamp';
  const LOCATION_REUSE_TIME = 60 * 1000; 
  const LOCATION_REUSE_DISTANCE = 500; 
  const LAST_MARKER_CALCULATION_LOCATION_KEY = 'lastMarkerCalculationLocation';
  const MARKER_RECALCULATION_DISTANCE = 500; 

  const hasLoadedLastGpsLocationRef = useRef(false);

  const hasCompletedInitialLoadRef = useRef(false);

  const hasMovedToGpsAfterInitialLoadRef = useRef(false);

  const hasMovedToFirstMarkerOnInitialLoadRef = useRef(false);

  const hasMapReadyRef = useRef(false);

  const hasCheckedMarkersOnEnterRef = useRef(false);

  const preFetchingCampidsRef = useRef<Set<string>>(new Set());
  const isPreFetchingRef = useRef(false);

  const failedPreFetchCampidsRef = useRef<Set<string>>(new Set());

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinModalProps, setPinModalProps] = useState<{ memberId: number; email: string } | null>(null);

  useEffect(() => {
    const loadFailedCampids = async () => {
      try {
        const stored = await AsyncStorage.getItem('failedPreFetchCampids');
        if (stored) {
          const failedArray = JSON.parse(stored) as string[];
          const failedSet = new Set<string>(failedArray);
          failedPreFetchCampidsRef.current = failedSet;
          console.log(`[MapMainScreen] 저장된 pre-fetch 실패 정보 로드: ${failedSet.size}개`);
        }
      } catch (error) {
        console.error('[MapMainScreen] 실패 정보 로드 실패:', error);
      }
    };
    loadFailedCampids();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let prevAppState: string = AppState.currentState;

    const checkWalletPinSetup = async () => {
      try {

        const jwt = await AsyncStorage.getItem('jwt');
        const memberId = jwt ? jwtPayloadSub(jwt) : null;

        let emailRaw = await AsyncStorage.getItem('userEmail');
        if (!emailRaw) {
          try {
            const ud = await AsyncStorage.getItem('userData');
            if (ud) emailRaw = (JSON.parse(ud) as { email?: string })?.email ?? null;
          } catch {

          }
        }

        if (memberId == null || !emailRaw) return;

        const PIN_DEV_EMAILS = ['oth-test@example.invalid', 'oth-user@example.invalid', 'oth-user@example.invalid'];
        const normEmail = emailRaw.toLowerCase().trim();
        if (!PIN_DEV_EMAILS.includes(normEmail)) return;

        const entries = await findEntriesForUser(emailRaw, memberId);
        const needPinSetup = (e: { s: string; h?: string } | null) =>
          e !== null && e.s === 's0' && !e.h;
        const triggerNeeded = needPinSetup(entries.eth) || needPinSetup(entries.pol);

        if (cancelled) return;
        if (triggerNeeded) {

          setPinModalProps((prev) => {
            if (prev && prev.memberId === memberId && prev.email === normEmail) return prev;
            return { memberId, email: normEmail };
          });
          setShowPinModal(true);
        }

      } catch {

      }
    };

    checkWalletPinSetup();

    const sub = AppState.addEventListener('change', (nextState) => {
      const wasBackground = !!prevAppState.match(/inactive|background/);
      const isNowActive = nextState === 'active';
      prevAppState = nextState;
      if (wasBackground && isNowActive) {
        checkWalletPinSetup();
      }
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  const startPreFetchAdUrls = useCallback(async (ads: any[]) => {

    if (isPreFetchingRef.current) {
      console.log('⚠️ [MapMainScreen] pre-fetch가 이미 실행 중입니다. 중복 실행 방지');
      return;
    }

    try {
      isPreFetchingRef.current = true;
      console.log('🚀 [MapMainScreen] 백그라운드 urlAD pre-fetch 시작');
      const userData = await AsyncStorage.getItem('userData');
      const parsedUserData = userData ? JSON.parse(userData) : null;
      const memberId = parsedUserData?.member;

      if (!memberId) {
        console.log('[MapMainScreen] memberId가 없어 pre-fetch를 중단합니다.');
        return;
      }

      const deviceInfo = await collectDeviceInfo();

      const adsToFetch = ads.filter((ad: any) => {
        const campid = String(ad.campid || '');
        return campid && !ad.urlAD && !preFetchingCampidsRef.current.has(campid);
      });

      console.log(`🔍 [MapMainScreen] 고유 광고 pre-fetch 대상: ${adsToFetch.length}개`);

      adsToFetch.forEach((ad, i) => console.log(`📋 [PreFetch] 대상 ${i}: id=${ad.campid}, company=${ad.ad_company}`));

      for (const ad of adsToFetch) {
        const campid = String(ad.campid || '');
        try {

          if (preFetchingCampidsRef.current.has(campid)) {
            console.log(`⏭️ [MapMainScreen] ${campid}는 이미 처리 중입니다. 건너뜀`);
            continue;
          }

          preFetchingCampidsRef.current.add(campid);

          const checkUrl = ad.ad_check_url;
          let fetchedData = null;
          const company = (ad.ad_company || '').toLowerCase();

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
                    name: jsonResponse.name,
                    joindesc: jsonResponse.rewarddesc,
                    xrunPrice: jsonResponse.price ? (jsonResponse.price / 2) : undefined
                  };
                } else {
                  console.warn(`⚠️ [PreFetch] NAS 실패: result=${resCode}`);
                }
              } else if (company === 'pointclick') {
                if (jsonResponse.result_code === 200 && jsonResponse.landing_url) {
                  fetchedData = {
                    urlAD: jsonResponse.landing_url,
                    name: jsonResponse.ad_name,
                    joindesc: jsonResponse.ad_participation,
                    xrunPrice: jsonResponse.ad_profit
                  };
                } else {
                  console.warn(`⚠️ [PreFetch] PointClick 실패: code=${jsonResponse.result_code}`);
                }
              }
            } catch (fetchErr) {
              console.error(`❌ [PreFetch] Fetch 오류:`, fetchErr);
            }
          } else {
            console.warn(`⚠️ [PreFetch] ad_check_url 없음: ${ad.campid}`);
          }

          if (fetchedData && fetchedData.urlAD) {

            const fetchedUrl = fetchedData.urlAD;

            setTopAd5Data(prev => {
              const updated = prev.map(item =>
                (item.campid === ad.campid) ? { ...item, urlAD: fetchedUrl } : item
              );
              topAd5DataRef.current = updated; 
              return updated;
            });

            setMarkers(prev => prev.map(m =>
              (m.campid === ad.campid) ? { ...m, urlAD: fetchedUrl } : m
            ));

            try {
              const currentCacheStr = await AsyncStorage.getItem('cached_AD');
              const currentCache = currentCacheStr ? JSON.parse(currentCacheStr) : {};

              const newData = {
                urlAD: fetchedUrl,
                joindesc: fetchedData.joindesc || ad.joindesc || '',
                name: fetchedData.name || ad.name || '',
                xrunPrice: fetchedData.xrunPrice !== undefined ? fetchedData.xrunPrice : (ad.xrunPrice || 0)
              };

              currentCache[ad.campid] = newData;
              await AsyncStorage.setItem('cached_AD', JSON.stringify(currentCache));
              console.log(`💾 [MapMainScreen] 캐시 저장 완료: ${ad.campid}`);
            } catch (cacheErr) {
              console.error('❌ [MapMainScreen] 캐시 저장 실패:', cacheErr);
            }

            console.log(`✅ [MapMainScreen] PointClick pre-fetch 성공: ${ad.campid}`);
          } else {
            console.log(`⚠️ [MapMainScreen] 알 수 없는 회사 타입: ${company}, campid: ${ad.campid}`);
          }
        } catch (e) {
          console.log(`⚠️ [MapMainScreen] ${ad.campid} pre-fetch 실패:`, e);

          failedPreFetchCampidsRef.current.add(campid);

          try {
            const failedArray = Array.from(failedPreFetchCampidsRef.current);
            await AsyncStorage.setItem('failedPreFetchCampids', JSON.stringify(failedArray));
          } catch (saveError) {
            console.error('[MapMainScreen] 실패 정보 저장 실패:', saveError);
          }
        } finally {

          preFetchingCampidsRef.current.delete(campid);
        }
      }
    } catch (err) {
      console.error('❌ [MapMainScreen] 백그라운드 pre-fetch 오류:', err);
    } finally {

      isPreFetchingRef.current = false;
      console.log('✅ [MapMainScreen] 백그라운드 urlAD pre-fetch 완료');
    }
  }, []);

  let iconXrunBlack: any = null;
  let iconXrunLogo: any = null;

  try {

    iconXrunBlack = require('../../assets/images/icon_xrun_black.png');

  } catch (e) {

    console.warn('icon_xrun_black.png not found');

  }

  try {

    iconXrunLogo = require('../../assets/images/logoMain_XRUN.png');

  } catch (e) {

    console.warn('logoMain_XRUN.png not found');

  }

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

  const loadMarkersForLocation = useCallback(async (targetLocation: LocationData, forceRefresh: boolean = false, currentGpsLocation?: LocationData | null, retryCount: number = 0) => {
    console.log('🚀 [loadMarkersForLocation] 시작:', { targetLocation, forceRefresh, hasCurrentGpsLocation: !!currentGpsLocation });

    if (loadingMarkersRef.current) {
      console.log('=== 맵 마커 로딩 중, 중복 호출 방지 ===');
      return;
    }

    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      console.log('❌ [loadMarkersForLocation] userData가 없습니다. 로그인이 필요할 수 있습니다.');
      return;
    }

    try {

      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member;
      if (!member) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      if (!forceRefresh) {
        const astorCoinsData = await AsyncStorage.getItem('astorCoinsData');
        if (astorCoinsData) {

          try {
            const coinsData = JSON.parse(astorCoinsData);
            if (coinsData && Array.isArray(coinsData) && coinsData.length > 0) {

              let shouldRecalculate = true;
              try {
                const lastCalcLocationStr = await AsyncStorage.getItem(LAST_MARKER_CALCULATION_LOCATION_KEY);
                if (lastCalcLocationStr) {
                  const lastCalcLocation: LocationData = JSON.parse(lastCalcLocationStr);
                  const distance = calculateDistance(
                    targetLocation.latitude,
                    targetLocation.longitude,
                    lastCalcLocation.latitude,
                    lastCalcLocation.longitude
                  );

                  if (distance < MARKER_RECALCULATION_DISTANCE) {

                    const hasDistanceInfo = coinsData.some((coin: any) => typeof coin.distance === 'number');
                    if (hasDistanceInfo) {
                      shouldRecalculate = false;
                      console.log(`✅ [MapMainScreen] 거리 재계산 생략 (${distance.toFixed(0)}m < ${MARKER_RECALCULATION_DISTANCE}m, 기존 거리 정보 사용)`);
                    }
                  } else {
                    console.log(`🔄 [MapMainScreen] 거리 재계산 필요 (${distance.toFixed(0)}m >= ${MARKER_RECALCULATION_DISTANCE}m)`);
                  }
                } else {
                  console.log('🔄 [MapMainScreen] 마지막 계산 위치 없음, 거리 재계산');
                }
              } catch (calcLocationError) {
                console.error('[MapMainScreen] 마지막 계산 위치 확인 실패:', calcLocationError);
              }

              const sortedCoinsData = coinsData
                .map((coin: any) => {
                  const lat = coin.latitude || coin.lat;
                  const lng = coin.longitude || coin.lng;

                  if (lat && lng) {

                    const distance = shouldRecalculate
                      ? calculateDistance(
                        targetLocation.latitude,
                        targetLocation.longitude,
                        lat,
                        lng
                      )
                      : (coin.distance || 0);
                    return {
                      ...coin,
                      distance: distance, 
                    };
                  } else {

                    return {
                      ...coin,
                      distance: coin.distance || Infinity,
                    };
                  }
                })
                .sort((a: any, b: any) => {

                  return (a.distance || Infinity) - (b.distance || Infinity);
                });

              if (shouldRecalculate) {
                try {
                  await AsyncStorage.setItem(LAST_MARKER_CALCULATION_LOCATION_KEY, JSON.stringify(targetLocation));
                  await AsyncStorage.setItem('astorCoinsData', JSON.stringify(sortedCoinsData));
                  console.log('✅ [MapMainScreen] 캐시 데이터 거리 재계산 후 저장 완료');
                } catch (sortError) {
                  console.error('[MapMainScreen] 캐시 데이터 정렬 후 저장 오류:', sortError);
                }
              } else {

                console.log('✅ [MapMainScreen] 거리 재계산 생략, 저장 생략');
              }

              const spotDataArray: SpotData[] = sortedCoinsData.map((coin: any) => ({

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
                campid: coin.campid || coin.campId || '',
              } as SpotData & { campid?: string }));

              console.log('✅ [MapMainScreen] 캐시된 마커 데이터 사용 (개수:', spotDataArray.length, ', 거리순 정렬됨)');
              console.log('📌 [MapMainScreen] setMarkers 호출 (캐시 데이터):', spotDataArray.length, '개');
              setMarkers(spotDataArray);
              setLastFetchedLocation(targetLocation);
              lastFetchedLocationRef.current = targetLocation;
              lastMarkerRefreshTimeRef.current = Date.now(); 

              const firstMarker = spotDataArray.find(marker => marker.latitude && marker.longitude);
              if (firstMarker && firstMarker.latitude && firstMarker.longitude) {
                if (!mapRef.current) return;
                console.log('📍 [MapMainScreen] 캐시 데이터 사용 시 첫 번째 마커 위치로 맵 이동:', firstMarker.latitude, firstMarker.longitude);

                isProgrammaticMoveRef.current = true;
                mapRef.current.animateToRegion({
                  latitude: firstMarker.latitude,
                  longitude: firstMarker.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }, 500);

                mapRegionRef.current = {
                  latitude: firstMarker.latitude,
                  longitude: firstMarker.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                };

                setTimeout(() => {
                  isProgrammaticMoveRef.current = false;
                }, 600);

                if (currentGpsLocation) {
                  setTimeout(() => {
                    console.log('📍 [MapMainScreen] 마커 위치 이동 후 현재 GPS 위치로 이동:', currentGpsLocation.latitude, currentGpsLocation.longitude);

                    if (!mapRef.current) return;
                    isProgrammaticMoveRef.current = true;

                    mapRef.current.animateToRegion({
                      latitude: currentGpsLocation.latitude,
                      longitude: currentGpsLocation.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }, 500);
                    mapRegionRef.current = {
                      latitude: currentGpsLocation.latitude,
                      longitude: currentGpsLocation.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    };
                    setTimeout(() => {
                      isProgrammaticMoveRef.current = false;
                    }, 600);
                  }, 1000); 
                }
              } else if (!firstMarker && currentGpsLocation && mapRef.current) {

                console.log('📍 [MapMainScreen] 캐시 데이터에 마커 없음 - 현재 GPS 위치로 이동:', currentGpsLocation.latitude, currentGpsLocation.longitude);
                isProgrammaticMoveRef.current = true;
                mapRef.current.animateToRegion({
                  latitude: currentGpsLocation.latitude,
                  longitude: currentGpsLocation.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }, 500);
                mapRegionRef.current = {
                  latitude: currentGpsLocation.latitude,
                  longitude: currentGpsLocation.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                };
                setTimeout(() => {
                  isProgrammaticMoveRef.current = false;
                }, 600);
              }

              loadingMarkersRef.current = false;

              setLoadingMarkers(false);

              return;

            }

          } catch (parseError) {

            console.error('[MapMainScreen] astorCoinsData 파싱 오류:', parseError);

          }

        }

      }

      if (forceRefresh) {
        console.log('🔄 [MapMainScreen] 서버에서 새 데이터 가져오기');
      } else {

      }

      loadingMarkersRef.current = true;

      setLoadingMarkers(true);

      loadingMarkersRef.current = true;
      setLoadingMarkers(true);
      console.log('=== 맵 마커 데이터 가져오기 시작 ===');
      console.log('위치:', targetLocation.latitude, targetLocation.longitude);

      const deviceInfoData = await Promise.race([
        collectDeviceInfo(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('collectDeviceInfo timeout')), 2500)),
      ]).catch(() => getMinimalDeviceInfo());

      console.log('🚀 [loadMarkersForLocation] app2000-01 호출 시작 (마커 선표시)');
      let markerData: any[] = [];
      try {
        markerData = await fetchMapMarkerData(
          targetLocation.latitude,
          targetLocation.longitude,
          member,
          navigate,
          {
            adid: deviceInfoData.adid,
            ip: deviceInfoData.ipAddress,
            osver: deviceInfoData.osVersion,
            devid: deviceInfoData.deviceId,
            devmodel: deviceInfoData.model,
            devbrand: deviceInfoData.manufacturer,
            mnetwork: deviceInfoData.mnetwork,
            carrier: deviceInfoData.carrier
          }
        ) || [];
      } catch (markerError) {
        console.warn('❌ [loadMarkersForLocation] app2000-01 실패:', markerError);
      }
      console.log('✅ [loadMarkersForLocation] app2000-01 완료, 마커 개수:', markerData.length);

      Promise.allSettled([
        fetchVirtualCoin(member, targetLocation.latitude, targetLocation.longitude, navigate).catch((e) => {
          console.warn('❌ [loadMarkersForLocation] virtualCoin 실패:', e);
          return { data: [] };
        }),
        getCoinNasPrice(navigate).catch((e) => {
          console.warn('❌ [loadMarkersForLocation] getCoinNasPrice 실패:', e);
          return { data: { coins: 0 } };
        }),
      ]).then(([virtualCoinResponse, nasPriceResponse]) => {
        const virtualCoin = virtualCoinResponse.status === 'fulfilled' ? virtualCoinResponse.value : { data: [] };
        const nasPrice = nasPriceResponse.status === 'fulfilled' ? nasPriceResponse.value : { data: { coins: 0 } };
        const calculatedNasPrice = nasPrice?.data?.coins || 0;
        const coinsDataVt = virtualCoin?.data && Array.isArray(virtualCoin.data)
          ? virtualCoin.data
            .slice(0, Math.random() < 0.5 ? 1 : 2)
            .map((item: any, index: number, array: any[]) => {
              if (array.length === 2 && index === 1) {
                return {
                  ...item,
                  coin: 1,
                  lat: 0,
                  lng: 0,
                  title: item.title,
                  distance: (Math.random() * (10 - 0.1) + 0.1).toFixed(2),
                  advertisement: item.advertisement,
                  coins: item.coins,
                  iconurl: item.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                  joindesc: item.joindesc || '가상 코인 설명',
                  name: item.name || item.title || item.brand,
                  campid: item.campid || item.campId || '',
                  xrunPrice: item.xrunPrice || item.xrunprice || 0,
                };
              }
              return {
                ...item,
                currency: 18,
                lat: 0,
                lng: 0,
                title: item.title,
                distance: (Math.random() * (10 - 0.1) + 0.1).toFixed(2),
                coins: calculatedNasPrice,
                advertisement: 672,
                iconurl: item.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: item.joindesc || 'Virtual coin description',
                name: item.name || item.title || item.brand,
                campid: item.campid || item.campId || '',
                xrunPrice: item.xrunPrice || item.xrunprice || 0,
              };
            })
          : [];
        const combinedCoinsData = [...coinsDataVt, ...markerData];
        const uniqueFileIds: (string | number)[] = [];
        combinedCoinsData.forEach((item) => {
          const it = item as any;
          if (it.brandlogo_file) uniqueFileIds.push(it.brandlogo_file);
          if (it.adthumbnail2_file) uniqueFileIds.push(it.adthumbnail2_file);
          if (it.symbolimg_file) uniqueFileIds.push(it.symbolimg_file);
        });
        if (uniqueFileIds.length > 0) {
          const envForCache = getEnv();
          cashingimages.downloadMultipleImages(uniqueFileIds, getApiBaseUrl())
            .then(() => console.log('✅ 이미지 캐싱 완료 (백그라운드)'))
            .catch((imageCacheError) => console.error('이미지 캐싱 오류:', imageCacheError));
        }
        if (combinedCoinsData.length > 0) {
          const sortedCoinsData = combinedCoinsData
            .map((coin: any) => {
              const lat = coin.latitude || coin.lat;
              const lng = coin.longitude || coin.lng;
              if (lat && lng) {
                return { ...coin, distance: calculateDistance(targetLocation.latitude, targetLocation.longitude, lat, lng) };
              }
              return { ...coin, distance: coin.distance || Infinity };
            })
            .sort((a: any, b: any) => (a.distance || Infinity) - (b.distance || Infinity));
          AsyncStorage.setItem('astorCoinsData', JSON.stringify(sortedCoinsData))
            .then(() => console.log('✅ astorCoinsData AsyncStorage 저장 완료 (virtualCoin 반영):', sortedCoinsData.length))
            .catch((storageError) => console.error('AsyncStorage 저장 오류:', storageError));
        } else if (coinsDataVt.length > 0) {
          const sortedCoinsDataVt = coinsDataVt
            .map((coin: any) => {
              const lat = coin.latitude || coin.lat;
              const lng = coin.longitude || coin.lng;
              if (lat && lng) {
                return { ...coin, distance: calculateDistance(targetLocation.latitude, targetLocation.longitude, lat, lng) };
              }
              return { ...coin, distance: coin.distance || Infinity };
            })
            .sort((a: any, b: any) => (a.distance || Infinity) - (b.distance || Infinity));
          AsyncStorage.setItem('astorCoinsData', JSON.stringify(sortedCoinsDataVt))
            .then(() => console.log('✅ astorCoinsData AsyncStorage 저장 (coinsDataVt):', sortedCoinsDataVt.length))
            .catch((storageError) => console.error('AsyncStorage 저장 오류:', storageError));
        }
      });

      const uniqueMarkers = markerData.reduce((acc: any[], current: any) => {

        const currentKey = current.coin || `${current.latitude}-${current.longitude}`;
        const existingIndex = acc.findIndex((m: any) => {
          const mKey = m.coin || `${m.latitude}-${m.longitude}`;
          return mKey === currentKey;
        });

        if (existingIndex === -1) {

          acc.push(current);
        } else {

          const keyType = current.coin ? 'coin ID' : '좌표';
          console.warn(`⚠️ 중복 마커 발견: ${keyType}=${currentKey}, 기존 마커 유지`);
        }
        return acc;
      }, []);

      console.log('📊 [MapMainScreen] 서버 원본 마커 데이터 사용:', {
        원본개수: markerData.length,
        중복제거후개수: uniqueMarkers.length,
        제거된개수: markerData.length - uniqueMarkers.length,
      });

      const markerFileIds: (string | number)[] = [];
      uniqueMarkers.forEach((item) => {
        const it = item as any;
        if (it.brandlogo_file) markerFileIds.push(it.brandlogo_file);
        if (it.adthumbnail2_file) markerFileIds.push(it.adthumbnail2_file);
        if (it.symbolimg_file) markerFileIds.push(it.symbolimg_file);
      });
      if (markerFileIds.length > 0) {
        const envForCache = getEnv();
        cashingimages.downloadMultipleImages(markerFileIds, getApiBaseUrl())
          .then(() => console.log('✅ 마커 이미지 캐싱 완료 (백그라운드)'))
          .catch((imageCacheError) => console.error('이미지 캐싱 오류:', imageCacheError));
      }

      uniqueMarkers.slice(0, 5).forEach((marker: any, idx: number) => {

      });

      console.log('📌 [MapMainScreen] setMarkers 호출 (서버 데이터):', uniqueMarkers.length, '개');
      setMarkers(uniqueMarkers);
      setLastFetchedLocation(targetLocation);
      lastFetchedLocationRef.current = targetLocation;
      lastMarkerRefreshTimeRef.current = Date.now(); 

      if (uniqueMarkers.length === 0 && retryCount < 1) {
        console.log(`⚠️ [MapMainScreen] 마커가 0개입니다. 2초 후 재시도합니다. (시도 ${retryCount + 1}/1)`);
        setTimeout(() => {
          loadMarkersForLocation(targetLocation, true, currentGpsLocation, retryCount + 1);
        }, 2000);
      }

      const firstMarker = uniqueMarkers.find(marker => marker.latitude && marker.longitude);
      if (firstMarker && firstMarker.latitude && firstMarker.longitude) {
        if (!mapRef.current) return;

        isProgrammaticMoveRef.current = true;
        mapRef.current.animateToRegion({
          latitude: firstMarker.latitude,
          longitude: firstMarker.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);

        mapRegionRef.current = {
          latitude: firstMarker.latitude,
          longitude: firstMarker.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setTimeout(() => {
          isProgrammaticMoveRef.current = false;
        }, 600);

        if (currentGpsLocation) {
          setTimeout(() => {
            console.log('📍 [MapMainScreen] 마커 위치 이동 후 현재 GPS 위치로 이동:', currentGpsLocation.latitude, currentGpsLocation.longitude);

            if (!mapRef.current) return;
            isProgrammaticMoveRef.current = true;
            mapRef.current.animateToRegion({
              latitude: currentGpsLocation.latitude,
              longitude: currentGpsLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }, 500);
            mapRegionRef.current = {
              latitude: currentGpsLocation.latitude,
              longitude: currentGpsLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
            setTimeout(() => {
              isProgrammaticMoveRef.current = false;
            }, 600);
          }, 1000); 
        }
      } else if (!firstMarker && currentGpsLocation && mapRef.current) {

        isProgrammaticMoveRef.current = true;
        mapRef.current.animateToRegion({
          latitude: currentGpsLocation.latitude,
          longitude: currentGpsLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);
        mapRegionRef.current = {
          latitude: currentGpsLocation.latitude,
          longitude: currentGpsLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setTimeout(() => {
          isProgrammaticMoveRef.current = false;
        }, 600);
      }

    } catch (error) {
      console.error('❌ [loadMarkersForLocation] 에러 발생:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ [loadMarkersForLocation] 에러 상세:', errorMessage);

      console.warn('[loadMarkersForLocation] 에러 발생, 기존 마커 유지');
    } finally {

      loadingMarkersRef.current = false;
      setLoadingMarkers(false);
      setShowLoadingOverlay(false); 

      hasCheckedMarkersOnEnterRef.current = false;
    }
  }, [navigate]);

  const returnToInitialLocation = useCallback(async () => {

    if (loadingMarkersRef.current) {

      return;

    }

    const currentInitialLocation = initialLocation;

    if (!currentInitialLocation) {

      console.log('초기 위치가 없습니다.');

      return;

    }

    console.log('=== 20초 동안 드래그 없음, 초기 위치로 복귀 ===');

    const currentMapRegion = mapRegionRef.current;

    isProgrammaticMoveRef.current = true;

    console.log('📍 [프로그램 이동] 초기 위치로 복귀 시작');

    console.log('  현재 위치:', currentMapRegion.latitude.toFixed(6), currentMapRegion.longitude.toFixed(6));

    console.log('  목표 위치:', currentInitialLocation.latitude.toFixed(6), currentInitialLocation.longitude.toFixed(6));

    if (mapRef.current) {

      mapRef.current.animateToRegion({

        latitude: currentInitialLocation.latitude,

        longitude: currentInitialLocation.longitude,

        latitudeDelta: currentMapRegion.latitudeDelta,

        longitudeDelta: currentMapRegion.longitudeDelta,

      }, 500);

      setTimeout(() => {

        isProgrammaticMoveRef.current = false;

        console.log('📍 [프로그램 이동] 플래그 리셋 완료');

      }, 600);

    }

    const newRegion = {

      latitude: currentInitialLocation.latitude,

      longitude: currentInitialLocation.longitude,

      latitudeDelta: currentMapRegion.latitudeDelta,

      longitudeDelta: currentMapRegion.longitudeDelta,

    };

    mapRegionRef.current = newRegion;

    await loadMarkersForLocation(currentInitialLocation);

  }, [initialLocation, loadMarkersForLocation]);

  const goToCurrentLocation = useCallback(() => {
    if (!location) {
      console.log('📍 현재 위치가 없습니다.');
      return;
    }

    if (!mapRef.current) {
      console.log('📍 맵 ref가 없습니다.');
      return;
    }

    console.log('📍 현재 위치로 이동:', location.latitude, location.longitude);

    isProgrammaticMoveRef.current = true;
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 500);

    mapRegionRef.current = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setTimeout(() => {
      isProgrammaticMoveRef.current = false;
      console.log('📍 현재 위치 이동 완료');
    }, 600);
  }, [location]);

  const goToGpsLocation = useCallback(async () => {
    try {
      console.log('📍 [GPS 위치 가져오기] 최신 GPS 위치 요청');
      const currentGpsLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const gpsLocation: LocationData = {
        latitude: currentGpsLocation.coords.latitude,
        longitude: currentGpsLocation.coords.longitude,
      };

      console.log('📍 [GPS 위치 가져오기] GPS 위치:', gpsLocation);

      if (!mapRef.current) {
        console.log('📍 맵 ref가 없습니다.');
        return;
      }

      isProgrammaticMoveRef.current = true;

      mapRef.current.animateToRegion({
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);

      mapRegionRef.current = {
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setLocation(gpsLocation);

      await AsyncStorage.setItem(LAST_GPS_LOCATION_KEY, JSON.stringify(gpsLocation));

      setTimeout(() => {
        isProgrammaticMoveRef.current = false;
        console.log('📍 GPS 위치로 이동 완료');
      }, 600);
    } catch (error) {
      console.error('📍 [GPS 위치 가져오기] 실패:', error);

      if (location) {
        goToCurrentLocation();
      }
    }
  }, [location, goToCurrentLocation]);

  const handleMapReady = useCallback(async () => {

    hasMapReadyRef.current = true;
    console.log('📍 [handleMapReady] 지도 로드 완료 - 최초 위치 이동 시작');

    if (!mapRef.current) {
      console.error('❌ [handleMapReady] mapRef가 없습니다.');
      return;
    }

    let targetLocation: LocationData | null = null;
    let locationSource = '';

    try {

      try {
        const storedLocation = await AsyncStorage.getItem(LAST_GPS_LOCATION_KEY);
        if (storedLocation) {
          const lastGpsLocation: LocationData = JSON.parse(storedLocation);
          if (lastGpsLocation.latitude && lastGpsLocation.longitude) {
            targetLocation = lastGpsLocation;
            locationSource = 'AsyncStorage 마지막 위치';
            console.log('✅ [handleMapReady] AsyncStorage에서 마지막 위치 발견:', lastGpsLocation);
          }
        }
      } catch (storageError) {
        console.error('❌ [handleMapReady] AsyncStorage 읽기 실패:', storageError);
      }

      if (!targetLocation) {
        try {

          const { status } = await Location.getForegroundPermissionsAsync();
          if (status === 'granted') {
            const currentGpsLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });
            targetLocation = {
              latitude: currentGpsLocation.coords.latitude,
              longitude: currentGpsLocation.coords.longitude,
            };
            locationSource = '현재 GPS 위치';
            console.log('✅ [handleMapReady] 현재 GPS 위치 가져오기 성공:', targetLocation);

            await AsyncStorage.setItem(LAST_GPS_LOCATION_KEY, JSON.stringify(targetLocation));
          } else {
            console.log('⚠️ [handleMapReady] 위치 권한 없음 - 다음 우선순위로');
          }
        } catch (gpsError) {
          console.error('❌ [handleMapReady] GPS 위치 가져오기 실패:', gpsError);
        }
      }

      if (!targetLocation) {
        try {
          const astorCoinsData = await AsyncStorage.getItem('astorCoinsData');
          if (astorCoinsData) {
            const coinsData = JSON.parse(astorCoinsData);
            if (Array.isArray(coinsData) && coinsData.length > 0) {

              const firstMarker = coinsData.find((coin: any) =>
                (coin.latitude || coin.lat) && (coin.longitude || coin.lng)
              );

              if (firstMarker) {
                targetLocation = {
                  latitude: firstMarker.latitude || firstMarker.lat,
                  longitude: firstMarker.longitude || firstMarker.lng,
                };
                locationSource = '저장된 마커 중 첫 번째 마커';
                console.log('✅ [handleMapReady] 저장된 마커에서 첫 번째 마커 위치 발견:', targetLocation);
              }
            }
          }
        } catch (markerError) {
          console.error('❌ [handleMapReady] 저장된 마커 읽기 실패:', markerError);
        }
      }

      if (!targetLocation) {
        targetLocation = {
          latitude: 37.5665,
          longitude: 126.9780,
        };
        locationSource = '기본 위치(서울)';
        console.log('✅ [handleMapReady] 기본 위치(서울) 사용:', targetLocation);
      }

      if (targetLocation) {
        console.log(`📍 [handleMapReady] ${locationSource}로 이동:`, targetLocation);

        isProgrammaticMoveRef.current = true;

        const map = mapRef.current;
        if (!map || typeof map.animateToRegion !== 'function') {
          console.warn('⚠️ [handleMapReady] animateToRegion 호출 불가: mapRef가 null이거나 메서드가 없습니다.');
          isProgrammaticMoveRef.current = false;
          return;
        }

        map.animateToRegion({
          latitude: targetLocation.latitude,
          longitude: targetLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);

        mapRegionRef.current = {
          latitude: targetLocation.latitude,
          longitude: targetLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setLocation(targetLocation);

        if (!initialLocationRef.current) {
          setInitialLocation(targetLocation);
          setLastFetchedLocation(targetLocation);
          initialLocationRef.current = targetLocation;
          lastFetchedLocationRef.current = targetLocation;
          lastUpdatedRegionRef.current = {
            latitude: targetLocation.latitude,
            longitude: targetLocation.longitude,
          };
        }

        console.log('🔄 [handleMapReady] 마커 로드 시작');
        lastMarkerRefreshTimeRef.current = Date.now();
        await loadMarkersForLocation(targetLocation, false);
        console.log('✅ [handleMapReady] 마커 로드 완료');

        hasCompletedInitialLoadRef.current = true;

        setTimeout(() => {
          isProgrammaticMoveRef.current = false;
          console.log('✅ [handleMapReady] 지도 이동 완료');
        }, 600);
      } else {
        console.error('❌ [handleMapReady] 이동할 위치를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('❌ [handleMapReady] 오류 발생:', error);

      const defaultLocation: LocationData = {
        latitude: 37.5665,
        longitude: 126.9780,
      };

      if (mapRef.current) {
        isProgrammaticMoveRef.current = true;
        if (typeof mapRef.current.animateToRegion !== 'function') {
          console.warn('⚠️ [handleMapReady] fallback animateToRegion 호출 불가');
          isProgrammaticMoveRef.current = false;
          return;
        }
        mapRef.current.animateToRegion({
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);

        mapRegionRef.current = {
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setLocation(defaultLocation);

        if (!initialLocationRef.current) {
          setInitialLocation(defaultLocation);
          setLastFetchedLocation(defaultLocation);
          initialLocationRef.current = defaultLocation;
          lastFetchedLocationRef.current = defaultLocation;
        }

        await loadMarkersForLocation(defaultLocation, false);

        setTimeout(() => {
          isProgrammaticMoveRef.current = false;
        }, 600);
      }
    }
  }, [loadMarkersForLocation]);

  const checkMapLocation = useCallback(async () => {

    if (loadingMarkersRef.current) {

      return;

    }

    const currentInitialLocation = initialLocationRef.current;

    const currentLastFetchedLocation = lastFetchedLocationRef.current;

    if (!currentInitialLocation || !currentLastFetchedLocation) {

      return;

    }

    const currentRegion = mapRegionRef.current;

    const currentLocation: LocationData = {

      latitude: currentRegion.latitude,

      longitude: currentRegion.longitude,

    };

    const distance = calculateDistance(

      currentLocation.latitude,

      currentLocation.longitude,

      currentLastFetchedLocation.latitude,

      currentLastFetchedLocation.longitude

    );

    const currentTime = Date.now();

    const locationChanged =

      Math.abs(currentLocation.latitude - currentLastFetchedLocation.latitude) > 0.0001 ||

      Math.abs(currentLocation.longitude - currentLastFetchedLocation.longitude) > 0.0001;

    if (locationChanged) {

      lastLocationChangeTimeRef.current = currentTime;

    }

    if (
      hasCompletedInitialLoadRef.current &&
      !hasMovedToGpsAfterInitialLoadRef.current &&
      isProgrammaticMoveRef.current &&
      locationChanged
    ) {
      console.log('=== [초기 로드 후 첫 GPS 위치 이동] 거리 상관없이 마커 로드 ===');
      console.log('  현재 위치:', currentLocation.latitude.toFixed(6), currentLocation.longitude.toFixed(6));
      console.log('  마지막 마커 로드 위치:', currentLastFetchedLocation.latitude.toFixed(6), currentLastFetchedLocation.longitude.toFixed(6));
      console.log('  거리:', distance.toFixed(2), 'm');

      await loadMarkersForLocation(currentLocation, true);

      hasMovedToGpsAfterInitialLoadRef.current = true;
      console.log('✅ [초기 로드 후 첫 GPS 위치 이동] 마커 로드 완료');
      return; 
    }

    if (distance >= 500) {

      console.log('=== 200m 이상 이동, 새로운 위치에서 마커 로드 ===');

      await loadMarkersForLocation(currentLocation, true);

    }

    const timeSinceLastChange = currentTime - lastLocationChangeTimeRef.current;

    if (timeSinceLastChange >= 20000) {

      const distanceFromInitial = calculateDistance(

        currentLocation.latitude,

        currentLocation.longitude,

        currentInitialLocation.latitude,

        currentInitialLocation.longitude

      );

      if (distanceFromInitial > 50) { 

        console.log('=== 20초 동안 위치 변경 없음, 초기 위치로 복귀 ===');

        await returnToInitialLocation();

        lastLocationChangeTimeRef.current = Date.now(); 

      }

    }

  }, [loadMarkersForLocation, returnToInitialLocation]);

  useEffect(() => {

    const preloadTaboola = async () => {

      try {

        console.log('[MapMainScreen] Taboola HTML 프리로드 시작');

        await preloadTaboolaHTML();

        console.log('[MapMainScreen] Taboola HTML 프리로드 완료');

        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

      } catch (error) {

        console.error('[MapMainScreen] Taboola HTML 프리로드 실패:', error);

      }

    };

    preloadTaboola();
  }, []); 

  const refreshTopAd5AndMapMarkers = useCallback(async (forceRefresh: boolean = false) => {

    if (isFetchingTopAd5Ref.current) {
      console.log('[MapMainScreen] refreshTopAd5AndMapMarkers 이미 실행 중입니다. 중복 호출 무시');
      return;
    }

    isFetchingTopAd5Ref.current = true;
    const bootSlowLog = '[!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!부팅 느림]';
    const refreshStartAt = Date.now();
    console.log(bootSlowLog, '[MapMainScreen] refreshTopAd5AndMapMarkers 시작 (마커+TopAd5 로드)');
    try {

      let completedAdsSet = new Set<string>();
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const member = parsedUserData?.member;
          if (member) {
            completedAdsSet = await getCompletedAdsSet(member, navigate);
            console.log(`[MapMainScreen] 완료된 광고 목록: ${completedAdsSet.size}개`);
          }
        }
      } catch (error) {
        console.warn('[MapMainScreen] 완료된 광고 목록 조회 실패 (무시):', error);
      }

      const astorCoinsData = await AsyncStorage.getItem('astorCoinsData');
      if (astorCoinsData) {
        const coinsData = JSON.parse(astorCoinsData);
        if (Array.isArray(coinsData) && coinsData.length > 0) {

          const spotDataArray: SpotData[] = coinsData
            .filter((coin: any) => {

              const lat = coin.latitude || coin.lat;
              const lng = coin.longitude || coin.lng;
              return lat != null && lng != null && lat !== 0 && lng !== 0;
            })
            .map((coin: any) => ({
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
              campid: coin.campid || coin.campId || '',
              ad_company: coin.ad_company || '',
              urlAD: coin.urlAD || '',
            } as SpotData));

          if (spotDataArray.length > 0) {
            setMarkers(spotDataArray);
            console.log('[MapMainScreen] 캐시된 마커 먼저 표시:', spotDataArray.length, '개 (본 광고 제외)');
          }
        }
      }

      const storedTopAd5 = await getStoredTopAd5();
      if (storedTopAd5 && Array.isArray(storedTopAd5) && storedTopAd5.length > 0) {
        setTopAd5Data(storedTopAd5);
        topAd5DataRef.current = storedTopAd5;
        console.log('[MapMainScreen] 캐시된 TopAd5 먼저 표시:', storedTopAd5.length, '개 (API 응답 대기)');
      }

      const topAd5StartAt = Date.now();
      console.log(bootSlowLog, '[MapMainScreen] 1단계: TopAd5 API 호출 시작');
      let topAd5Response: any[] | null = null;

      topAd5Response = await getTopAd5(undefined, forceRefresh);
      console.log(bootSlowLog, '[MapMainScreen] 1단계: TopAd5 API 호출 완료', `${Date.now() - topAd5StartAt}ms`);

      if (!topAd5Response || !Array.isArray(topAd5Response) || topAd5Response.length === 0) {
        console.warn('[MapMainScreen] TopAd5 API 데이터가 없습니다. 캐시 유지.');
        return;
      }

      const filteredTopAd5 = topAd5Response;

      if (filteredTopAd5.length === 0) {
        console.warn('[MapMainScreen] TopAd5 데이터가 없습니다.');
        return;
      }

      if (topAd5Response.length === 0) {
        console.warn('[MapMainScreen] 유효한 TopAd5 데이터가 없습니다 (모두 URL 검증 실패 또는 이미 본 광고)');
        return;
      }

      console.log('[MapMainScreen] 3단계: TopAd5 데이터 상태 저장:', topAd5Response.length, '개 광고');
      setTopAd5Data(topAd5Response);
      topAd5DataRef.current = topAd5Response; 

      if (!astorCoinsData) {
        console.log('[MapMainScreen] 마커 데이터 없음 - 매핑 건너뛰기');
        return;
      }

      const coinsData = JSON.parse(astorCoinsData);
      if (!Array.isArray(coinsData) || coinsData.length === 0) {
        console.log('[MapMainScreen] 마커 데이터가 배열이 아니거나 비어있음 - 매핑 건너뛰기');
        return;
      }

      console.log('[MapMainScreen] 4단계: TopAd5 매핑 최적화 시작');
      const currentCampids = topAd5Response.map((ad: any) => ad.campid).filter((id: any) => id != null && id !== '');
      const previousCampids = topAd5DataRef.current.map((ad: any) => ad.campid).filter((id: any) => id != null && id !== '');

      const currentCampidsSet = new Set(currentCampids);
      const previousCampidsSet = new Set(previousCampids);
      const isChanged =
        currentCampids.length !== previousCampids.length ||
        currentCampids.some((id: any) => !previousCampidsSet.has(id)) ||
        previousCampids.some((id: any) => !currentCampidsSet.has(id));

      let finalCoinsData: any[] = coinsData;

      if (!isChanged && previousCampids.length > 0) {
        console.log('[MapMainScreen] TopAd5 데이터 변경 없음, 매핑 생략');

        finalCoinsData = coinsData;
      } else {
        console.log('[MapMainScreen] TopAd5 데이터 변경됨, 매핑 시작');

        const validTopAd5 = topAd5Response.filter((ad: any) => {
          const campid = String(ad.campid || '');
          const isFailed = failedPreFetchCampidsRef.current.has(campid);
          if (isFailed) {
            console.log(`⚠️ [MapMainScreen] ${campid}는 pre-fetch 실패로 매핑에서 제외`);
          }
          return !isFailed;
        });

        if (validTopAd5.length === 0) {
          console.warn('[MapMainScreen] 유효한 TopAd5 데이터가 없습니다 (모두 pre-fetch 실패)');

          finalCoinsData = coinsData;
        } else {
          console.log(`[MapMainScreen] 유효한 TopAd5 데이터: ${validTopAd5.length}/${topAd5Response.length}개 (${topAd5Response.length - validTopAd5.length}개 제외)`);

          console.log('[MapMainScreen] 5단계: 마커-광고 매핑 시작 (전체 마커에 대해 순차 매핑)');

          const mappedCoinsData = coinsData.map((marker: any, index: number) => {

            if (validTopAd5.length > 0) {
              const adIndex = index % validTopAd5.length;
              const mappedAd = validTopAd5[adIndex];

              return {
                ...marker,

                name: mappedAd?.name || marker.name,
                iconurl: mappedAd?.iconurl || marker.iconurl,
                joindesc: mappedAd?.joindesc || marker.joindesc,
                xrunPrice: mappedAd?.xrunPrice || marker.xrunPrice || marker.xrunprice || 0,
                campid: mappedAd?.campid || marker.campid || marker.campId || '',

                thumbnail: mappedAd?.thumbnail || marker.thumbnail,
                ad_company: mappedAd?.ad_company || marker.ad_company,
                coins: mappedAd?.coins?.toString() || marker.coins,
                brandlogo: mappedAd?.brandlogo || marker.brandlogo,
                adthumbnail2: mappedAd?.adthumbnail2 || marker.adthumbnail2,
                symbolimg: mappedAd?.symbolimg || marker.symbolimg,
              };
            }

            return marker;
          });

          console.log('[MapMainScreen] 6단계: 매핑된 마커 데이터 저장 시작');
          await AsyncStorage.setItem('astorCoinsData', JSON.stringify(mappedCoinsData));
          finalCoinsData = mappedCoinsData;
        }
      }

      console.log('[MapMainScreen] 7단계: 화면에 마커 표시 시작');
      console.log('[MapMainScreen] finalCoinsData 개수:', finalCoinsData.length);

      if (finalCoinsData.length === 0) {
        console.warn('[MapMainScreen] finalCoinsData가 비어있음, 기존 마커 유지');
        return; 
      }

      const spotDataArray: SpotData[] = finalCoinsData
        .filter((coin: any) => {

          const lat = coin.latitude || coin.lat;
          const lng = coin.longitude || coin.lng;
          return lat != null && lng != null && lat !== 0 && lng !== 0;
        })
        .map((coin: any) => ({
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
          campid: coin.campid || coin.campId || '',
          ad_company: coin.ad_company || '',
          urlAD: coin.urlAD || '',
        } as SpotData));

      console.log('[MapMainScreen] spotDataArray 개수:', spotDataArray.length);

      if (spotDataArray.length === 0) {
        console.warn('[MapMainScreen] spotDataArray가 비어있음, 기존 마커 유지');
        return; 
      }

      setMarkers(spotDataArray);
      console.log('[MapMainScreen] 화면에 마커 표시 완료:', spotDataArray.length, '개 마커');

      console.log('[MapMainScreen] TopAd5 데이터 새로고침 및 마커 매핑 완료');

      const topAd5CampidsSet = new Set(topAd5Response.map((ad: any) => String(ad.campid || '')));
      const filteredFailed = Array.from(failedPreFetchCampidsRef.current).filter(campid => topAd5CampidsSet.has(campid));
      failedPreFetchCampidsRef.current = new Set(filteredFailed);
      try {
        await AsyncStorage.setItem('failedPreFetchCampids', JSON.stringify(filteredFailed));
      } catch (error) {
        console.error('[MapMainScreen] 실패 정보 업데이트 실패:', error);
      }
      startPreFetchAdUrls(topAd5Response);
    } catch (error) {
      console.error('[MapMainScreen] TopAd5 데이터 새로고침 실패:', error);

      try {
        const storedData = await getStoredTopAd5();
        if (storedData && Array.isArray(storedData) && storedData.length > 0) {
          setTopAd5Data(storedData);
          topAd5DataRef.current = storedData; 
          console.log('[MapMainScreen] Fall over: 기존 TopAd5 데이터 사용:', storedData.length, '개 광고');
        }
      } catch (fallbackError) {
        console.error('[MapMainScreen] Fall over 실패:', fallbackError);
      }
    } finally {

      isFetchingTopAd5Ref.current = false;
    }
  }, [activeTab, location, navigate, startPreFetchAdUrls]); 

  useEffect(() => {

    if (activeTab !== 'Map') {
      return;
    }

    if (isFetchingTopAd5Ref.current) {
      return;
    }
    refreshTopAd5AndMapMarkers();
  }, [activeTab]); 

  useEffect(() => {

    if (activeTab !== 'Map') {

      hasCheckedMarkersOnEnterRef.current = false;
      return;
    }

    const checkMarkersAndLoad = async () => {
      try {

        let currentLocation: LocationData | null = null;

        if (!location) {

          console.log('📍 [MapMainScreen] 위치 정보 없음 - 위치 정보 대기 중...');
          setShowLoadingOverlay(true);

          try {
            const position = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });
            currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(currentLocation);
            console.log('📍 [MapMainScreen] 위치 정보 수신:', currentLocation);

            hasCheckedMarkersOnEnterRef.current = false;
          } catch (locationError) {
            console.warn('⚠️ [MapMainScreen] 위치 정보 가져오기 실패:', locationError);
            setShowLoadingOverlay(false);
            return;
          }
        } else {
          currentLocation = location;
        }

        if (hasCheckedMarkersOnEnterRef.current && currentLocation) {
          return;
        }

        hasCheckedMarkersOnEnterRef.current = true;

        const currentMarkers = markers;
        if (currentMarkers.length === 0) {

          console.log('📍 [MapMainScreen] 마커 없음 - 현재 위치 기준으로 마커 로드 시작');
          setShowLoadingOverlay(true);

          if (currentLocation) {
            await loadMarkersForLocation(currentLocation, true);
          }
          return;
        }

        const firstMarker = currentMarkers.find(marker => marker.latitude && marker.longitude);
        if (firstMarker && firstMarker.latitude && firstMarker.longitude && currentLocation) {
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            firstMarker.latitude,
            firstMarker.longitude
          );

          if (distance >= 500) {

            console.log(`📍 [MapMainScreen] 첫번째 마커와 현재 위치 거리: ${distance.toFixed(2)}m (500m 이상) - 마커 재로드 시작`);
            setShowLoadingOverlay(true);
            await loadMarkersForLocation(currentLocation, true);
            return;
          }
        }

        setShowLoadingOverlay(false);
      } catch (error) {
        console.error('❌ [MapMainScreen] 마커 체크 중 오류:', error);
        setShowLoadingOverlay(false);
        hasCheckedMarkersOnEnterRef.current = false; 
      }
    };

    checkMarkersAndLoad();
  }, [activeTab, location, loadMarkersForLocation]); 

  useEffect(() => {
    if (!location) return;
    const now = Date.now();
    const lastLocation = lastMappingLocationRef.current;
    const lastTime = lastMappingTimeRef.current;

    if (!lastLocation) {
      console.log('[MapMainScreen] 매핑 위치 초기 설정');
      setMappingLocation(location);
      lastMappingLocationRef.current = location;
      lastMappingTimeRef.current = now;
      return;
    }

    const timeSinceLastMapping = now - lastTime;
    if (timeSinceLastMapping < MAPPING_MIN_INTERVAL) {

      return;
    }

    const distance = calculateDistance(
      lastLocation.latitude,
      lastLocation.longitude,
      location.latitude,
      location.longitude
    );
    if (distance >= MAPPING_MIN_DISTANCE) {
      console.log(`[MapMainScreen] 매핑 위치 업데이트: ${distance.toFixed(0)}m 이동, ${(timeSinceLastMapping / 1000).toFixed(1)}초 경과`);
      setMappingLocation(location);
      lastMappingLocationRef.current = location;
      lastMappingTimeRef.current = now;
    }
  }, [location]);

  useEffect(() => {

    let watchId: number | null = null;

    const startLocationTracking = async () => {

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        hasRequestedLocationPermissionRef.current = true;
      }

      if (status !== 'granted') {

        setErrorMsg(t('common.messages.locationPermissionMessage'));
        await showAlert(
          t('common.messages.locationPermissionRequired'),
          t('common.messages.locationPermissionMessage'),
          [{ text: t('common.buttons.confirm') }]
        );

        console.log('📍 위치 권한 거부 - 기본 위치(서울)로 마커 로드');
        const defaultLocation: LocationData = {
          latitude: 37.5665,
          longitude: 126.9780,
        };
        setLocation(defaultLocation);

        const newRegion = {
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        mapRegionRef.current = newRegion;

        if (!initialLocationRef.current) {
          setInitialLocation(defaultLocation);
          setLastFetchedLocation(defaultLocation);
          initialLocationRef.current = defaultLocation;
          lastFetchedLocationRef.current = defaultLocation;
          lastUpdatedRegionRef.current = {
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
          };
        }

        console.log('📍 [MapMainScreen] 권한 거부 - 기본 위치로 마커 로드 시작');
        lastMarkerRefreshTimeRef.current = Date.now();
        await loadMarkersForLocation(defaultLocation);
        console.log('✅ [MapMainScreen] 권한 거부 - 기본 위치로 마커 로드 완료');
        return;

      }

      try {

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const newLocation: LocationData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        let locationToUse: LocationData = newLocation;
        const isInitialLoad = !initialLocationRef.current;

        try {

          const storedLocation = await AsyncStorage.getItem(LAST_GPS_LOCATION_KEY);
          const storedTimestamp = await AsyncStorage.getItem(LAST_GPS_LOCATION_TIMESTAMP_KEY);

          if (storedLocation && storedTimestamp) {
            const lastGpsLocation: LocationData = JSON.parse(storedLocation);
            const lastTimestamp = parseInt(storedTimestamp, 10);
            const now = Date.now();
            const elapsed = now - lastTimestamp;

            if (elapsed < LOCATION_REUSE_TIME) {

              const distance = calculateDistance(
                newLocation.latitude,
                newLocation.longitude,
                lastGpsLocation.latitude,
                lastGpsLocation.longitude
              );

              if (distance < LOCATION_REUSE_DISTANCE) {
                locationToUse = lastGpsLocation;
                console.log(`📍 [위치 재사용] 마지막 위치 사용 (${Math.floor(elapsed / 1000)}초 전, ${distance.toFixed(0)}m)`);
              } else {
                console.log(`📍 [위치 재사용] 거리 초과 (${distance.toFixed(0)}m > ${LOCATION_REUSE_DISTANCE}m), 새 위치 사용`);
              }
            } else {
              console.log(`📍 [위치 재사용] 시간 초과 (${Math.floor(elapsed / 1000)}초 > ${LOCATION_REUSE_TIME / 1000}초), 새 위치 사용`);
            }
          } else {
            console.log('📍 [위치 재사용] 저장된 위치 없음, 새 위치 사용');
          }
        } catch (storageError) {
          console.error('📍 [위치 재사용] AsyncStorage 확인 실패:', storageError);
        }

        await AsyncStorage.setItem(LAST_GPS_LOCATION_KEY, JSON.stringify(locationToUse));
        await AsyncStorage.setItem(LAST_GPS_LOCATION_TIMESTAMP_KEY, Date.now().toString());
        await AsyncStorage.setItem('selfCoordinate', JSON.stringify(locationToUse));

        if (isInitialLoad) {
          setInitialLocation(locationToUse);
          setLastFetchedLocation(locationToUse);
          initialLocationRef.current = locationToUse;
          lastFetchedLocationRef.current = locationToUse;
          lastUpdatedRegionRef.current = {
            latitude: locationToUse.latitude,
            longitude: locationToUse.longitude,
          };
          console.log('=== 초기 위치 저장 ===', locationToUse);
        }

        setLocation(newLocation);

        const locationForMap = isInitialLoad ? locationToUse : newLocation;
        const newRegion = {
          latitude: locationForMap.latitude,
          longitude: locationForMap.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        mapRegionRef.current = newRegion;

        const timeSinceLastRefresh = Date.now() - lastMarkerRefreshTimeRef.current;
        const shouldLoadMarkers = isInitialLoad || (timeSinceLastRefresh >= 30000 && lastMarkerRefreshTimeRef.current > 0);
        console.log('🔍 [MapMainScreen] 마커 로드 조건 확인:', {
          isInitialLoad,
          timeSinceLastRefresh,
          lastMarkerRefreshTime: lastMarkerRefreshTimeRef.current,
          shouldLoadMarkers,
        });

        if (isInitialLoad) {
          console.log('🔄 [MapMainScreen] 초기 로드 - 마커 로드 시작 (재사용된 위치 사용)');
          lastMarkerRefreshTimeRef.current = Date.now();
          await loadMarkersForLocation(locationToUse, false, newLocation);

          hasCompletedInitialLoadRef.current = true;
          console.log('✅ [MapMainScreen] 초기 로드 완료 플래그 설정');
        } else if (timeSinceLastRefresh >= 30000 && lastMarkerRefreshTimeRef.current > 0) {

          console.log('🔄 [MapMainScreen] 시간 경과 후 갱신 - 마커 로드 시작');
          lastMarkerRefreshTimeRef.current = Date.now();
          await loadMarkersForLocation(newLocation);
        } else {
          console.log('⚠️ [MapMainScreen] 마커 로드 건너뜀:', {
            isInitialLoad,
            timeSinceLastRefresh,
            lastMarkerRefreshTime: lastMarkerRefreshTimeRef.current,
            reason: isInitialLoad ? 'none' : (timeSinceLastRefresh < 30000 ? '시간 미경과' : '이전 로드 기록 없음'),
          });
        }

      } catch (error) {

        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';

        setErrorMsg('위치를 가져오는 중 오류가 발생했습니다.');

        console.error('Location error:', error);

        if (errorMessage.includes('location services') || errorMessage.includes('unavailable')) {

          await showAlert(

            '위치 서비스 오류',

            '위치 정보를 가져올 수 없습니다.\n\n다음 사항을 확인해주세요:\n• 기기의 위치 서비스(GPS)가 켜져 있는지\n• 네트워크 위치 서비스가 활성화되어 있는지\n• 실내에서는 GPS 신호가 약할 수 있습니다.',

            [

              {
                text: '기본 위치 사용', onPress: async () => {

                  const defaultLocation: LocationData = {

                    latitude: 37.5665,

                    longitude: 126.9780,

                  };

                  setLocation(defaultLocation);
                  const newRegion = {
                    latitude: defaultLocation.latitude,
                    longitude: defaultLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  };

                  mapRegionRef.current = newRegion;

                  const isInitialLoadFallback = !initialLocationRef.current;
                  if (isInitialLoadFallback) {
                    setInitialLocation(defaultLocation);
                    setLastFetchedLocation(defaultLocation);
                    initialLocationRef.current = defaultLocation;
                    lastFetchedLocationRef.current = defaultLocation;

                    lastUpdatedRegionRef.current = {
                      latitude: defaultLocation.latitude,
                      longitude: defaultLocation.longitude,
                    };
                  }

                  const timeSinceLastRefreshFallback = Date.now() - lastMarkerRefreshTimeRef.current;
                  if (isInitialLoadFallback || (timeSinceLastRefreshFallback >= 30000 && lastMarkerRefreshTimeRef.current > 0)) {
                    lastMarkerRefreshTimeRef.current = Date.now();
                    await loadMarkersForLocation(defaultLocation);
                  }

                }
              },

              { text: '확인', style: 'cancel' }

            ]

          );

        } else {

          const defaultLocation: LocationData = {

            latitude: 37.5665,

            longitude: 126.9780,

          };

          setLocation(defaultLocation);
          const newRegion = {
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };

          mapRegionRef.current = newRegion;

          const isInitialLoadError = !initialLocationRef.current;
          if (isInitialLoadError) {
            setInitialLocation(defaultLocation);
            setLastFetchedLocation(defaultLocation);
            initialLocationRef.current = defaultLocation;
            lastFetchedLocationRef.current = defaultLocation;

            lastUpdatedRegionRef.current = {
              latitude: defaultLocation.latitude,
              longitude: defaultLocation.longitude,
            };
          }

          const timeSinceLastRefreshError = Date.now() - lastMarkerRefreshTimeRef.current;
          if (isInitialLoadError || (timeSinceLastRefreshError >= 30000 && lastMarkerRefreshTimeRef.current > 0)) {
            lastMarkerRefreshTimeRef.current = Date.now();
            await loadMarkersForLocation(defaultLocation);
          }

        }

      }

    };

    startLocationTracking();

    const startHeadingTracking = async (): Promise<Location.LocationSubscription | null> => {
      try {

        if (headingSubscriptionRef.current) {
          headingSubscriptionRef.current.remove();
          headingSubscriptionRef.current = null;
        }

        const permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted) {
          return null;
        }

        const headingSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Low, 

            timeInterval: 2000, 

            distanceInterval: 10, 
          },
          (location) => {

            const heading = location.coords.heading;

            if (heading !== null && heading !== undefined && !isNaN(heading)) {
              const previousHeading = deviceHeadingRef.current;

              const MIN_HEADING_CHANGE = 5;
              const headingDiff = previousHeading === null
                ? MIN_HEADING_CHANGE + 1
                : Math.abs(heading - previousHeading);
              if (headingDiff >= MIN_HEADING_CHANGE) {

                deviceHeadingRef.current = heading;

                setDeviceHeading(heading);
              }
            }
          }
        );
        headingSubscriptionRef.current = headingSubscription;
        return headingSubscription;
      } catch (error) {
        console.error('헤딩 추적 오류:', error);
        return null;
      }
    };

    startHeadingTracking();

    let prevAppState = AppState.currentState;

    const subscription = AppState.addEventListener('change', (nextAppState) => {

      if (prevAppState === nextAppState) {
        return;
      }

      if (prevAppState.match(/inactive|background/) && nextAppState === 'active') {

        if (activeTab === 'Map') {
          const refreshTopAd5 = async () => {
            try {

              const shouldNavigateToCamera = await AsyncStorage.getItem('shouldNavigateToCamera');
              if (shouldNavigateToCamera === 'true') {
                console.log('[MapMainScreen] 광고보기 완료 감지 - AR 화면으로 이동');
                await AsyncStorage.removeItem('shouldNavigateToCamera');

                setActiveTab('Camera');

                setTimeout(async () => {

                  const shouldRefresh = await AsyncStorage.getItem('shouldRefreshTopAd5');
                  if (shouldRefresh === 'true') {
                    await AsyncStorage.removeItem('shouldRefreshTopAd5');

                    const completedAdCampid = await AsyncStorage.getItem('completedAdCampid');
                    if (completedAdCampid) {
                      await AsyncStorage.removeItem('completedAdCampid');
                      console.log(`[MapMainScreen] 완료된 광고 제거 및 대체 시작: ${completedAdCampid}`);

                      await removeAdFromTopAd5(completedAdCampid, navigate);
                    }

                    await refreshTopAd5AndMapMarkers(true);
                  }
                }, 300);
                return; 
              }

              const shouldRefresh = await AsyncStorage.getItem('shouldRefreshTopAd5');
              if (shouldRefresh === 'true') {
                console.log('[MapMainScreen] 광고보기 완료 감지 - TopAd5 및 마커 전체 새로고침');
                await AsyncStorage.removeItem('shouldRefreshTopAd5');

                const completedAdCampid = await AsyncStorage.getItem('completedAdCampid');
                if (completedAdCampid) {
                  await AsyncStorage.removeItem('completedAdCampid');
                  console.log(`[MapMainScreen] 완료된 광고 제거 및 대체 시작: ${completedAdCampid}`);

                  await removeAdFromTopAd5(completedAdCampid, navigate);
                }

                setTimeout(async () => {
                  await refreshTopAd5AndMapMarkers(true);
                }, 500);
              } else {

                const topAd5Response = await getTopAd5();
                if (topAd5Response && Array.isArray(topAd5Response) && topAd5Response.length > 0) {

                  const filteredTopAd5 = topAd5Response.filter((ad: any) => {
                    const urlAD = ad.urlAD;

                    if (!urlAD || typeof urlAD !== 'string' || urlAD.trim() === '' || urlAD === '없음' || urlAD === 'No') {
                      console.warn('[MapMainScreen] ⚠️ 백엔드에서 필터링되지 않은 항목 발견:', {
                        campid: ad.campid,
                        urlAD: urlAD,
                      });
                      return false;
                    }
                    return true;
                  });
                  if (filteredTopAd5.length > 0) {
                    setTopAd5Data(filteredTopAd5);
                    topAd5DataRef.current = filteredTopAd5; 
                    console.log('[MapMainScreen] AppState active - TopAd5 업데이트:', filteredTopAd5.length, '개');
                  }
                }
              }
            } catch (error) {
              console.error('[MapMainScreen] AppState active - TopAd5 새로고침 실패:', error);
            }
          };

          setTimeout(refreshTopAd5, 500);
        }

        Location.getForegroundPermissionsAsync().then((permission) => {
          if (permission.granted) {

            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            }).then((currentLocation) => {
              const newLocation: LocationData = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              };
              setLocation(newLocation);
              mapRegionRef.current = {
                latitude: newLocation.latitude,
                longitude: newLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              };
            }).catch((error) => {

              console.log('포그라운드 복귀 시 위치 가져오기 실패 (무시):', error.message);
            });

            startHeadingTracking();
          } else {

            console.log('📍 포그라운드 복귀 시 권한 없음 - 권한 재요청');
            hasRequestedLocationPermissionRef.current = false;
            startLocationTracking();
          }
        }).catch(() => {

          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          }).then((currentLocation) => {
            const newLocation: LocationData = {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            };
            setLocation(newLocation);
            mapRegionRef.current = {
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
          }).catch(() => {

          });
        });
      }

      prevAppState = nextAppState;
    });

    return () => {
      subscription?.remove();

      if (headingSubscriptionRef.current) {
        headingSubscriptionRef.current.remove();
        headingSubscriptionRef.current = null;
      }

      if (dragTimerRef.current) {
        clearTimeout(dragTimerRef.current);
        dragTimerRef.current = null;
      }

      if (locationCheckTimerRef.current) {
        clearInterval(locationCheckTimerRef.current);
        locationCheckTimerRef.current = null;
      }
    };
  }, []); 

  useEffect(() => {

    if (!initialLocation || !lastFetchedLocation) {
      return;
    }

    if (locationCheckTimerRef.current) {

      clearInterval(locationCheckTimerRef.current);

      locationCheckTimerRef.current = null;

    }

    locationCheckTimerRef.current = setInterval(() => {
      checkMapLocation();
    }, 5000); 

    lastLocationChangeTimeRef.current = Date.now();
    return () => {

      if (locationCheckTimerRef.current) {

        clearInterval(locationCheckTimerRef.current);

        locationCheckTimerRef.current = null;

      }

    };

  }, [initialLocation, lastFetchedLocation, checkMapLocation]);

  useEffect(() => {

    if (
      previousScreen &&
      previousScreen !== 'map' &&
      prevScreenRef.current !== previousScreen
    ) {
      console.log('[MapMainScreen] 화면 이동 감지:', previousScreen, '→ map');

      setShowCalloutPopup(false);
      setCalloutData(null);

      goToGpsLocation();
    }

    prevScreenRef.current = previousScreen;
  }, [previousScreen, goToGpsLocation]);

  const markerAdMapping = useMemo(() => {

    if (!mappingLocation || markers.length === 0) {
      return new Map<string, TopAd5Item | null>();
    }

    if (topAd5Data.length === 0) {
      console.log('[MapMainScreen] TopAd5 광고 없음, getTopAd5 재호출 시도');
      return new Map<string, TopAd5Item | null>();
    }

    const sortedMarkers = [...markers]
      .filter(marker => marker.latitude && marker.longitude)
      .map(marker => ({
        marker,
        distance: calculateDistance(
          mappingLocation.latitude,
          mappingLocation.longitude,
          marker.latitude!,
          marker.longitude!
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    const mapping = new Map<string, TopAd5Item | null>();
    sortedMarkers.forEach(({ marker }, index) => {

      let markerKey: string;
      if (marker.spotID !== undefined && marker.spotID !== null && marker.spotID !== 0) {

        markerKey = `spot-${marker.spotID}`;
      } else if (marker.coin !== undefined && marker.coin !== null) {

        markerKey = `coin-${marker.coin}`;
      } else {

        const lat = marker.latitude?.toFixed(6) ?? '0';
        const lng = marker.longitude?.toFixed(6) ?? '0';
        markerKey = `marker-${lat}-${lng}`;
      }

      const uniqueKey = `${markerKey}-${index}`;

      if (index < 16 && topAd5Data.length > 0) {
        const adIndex = index % topAd5Data.length;
        const mappedAd = topAd5Data[adIndex];
        mapping.set(uniqueKey, mappedAd);
      } else {

        mapping.set(uniqueKey, null);
      }

      if (index < 10) {

      }
    });
    console.log('[MapMainScreen] 마커-광고 매핑 완료:', mapping.size, '개 마커, TopAd5 개수:', topAd5Data.length);
    return mapping;
  }, [mappingLocation, markers, topAd5Data]);

  useEffect(() => {

    if (
      activeTab === 'Map' &&
      topAd5Data.length === 0 &&
      mappingLocation &&
      markers.length > 0 &&
      !isFetchingTopAd5Ref.current 
    ) {
      console.log('[MapMainScreen] TopAd5 광고 없음 감지, getTopAd5 재호출 시작');
      const retryGetTopAd5 = async () => {

        if (isFetchingTopAd5Ref.current) {
          console.log('[MapMainScreen] getTopAd5 이미 호출 중입니다. 중복 호출 무시');
          return;
        }

        isFetchingTopAd5Ref.current = true;
        try {
          const topAd5Response = await getTopAd5();
          if (topAd5Response && Array.isArray(topAd5Response) && topAd5Response.length > 0) {
            console.log('[MapMainScreen] TopAd5 재호출 성공:', topAd5Response.length, '개 광고');
            setTopAd5Data(topAd5Response);
            topAd5DataRef.current = topAd5Response; 

            startPreFetchAdUrls(topAd5Response);
          } else {
            console.warn('[MapMainScreen] TopAd5 재호출 결과: 데이터 없음');

            const storedData = await getStoredTopAd5();
            if (storedData && Array.isArray(storedData) && storedData.length > 0) {
              setTopAd5Data(storedData);
              topAd5DataRef.current = storedData; 
              console.log('[MapMainScreen] 저장된 TopAd5 데이터 사용:', storedData.length, '개 광고');
            }
          }
        } catch (error) {
          console.error('[MapMainScreen] TopAd5 재호출 실패:', error);
        } finally {

          isFetchingTopAd5Ref.current = false;
        }
      };
      retryGetTopAd5();
    }
  }, [activeTab, topAd5Data.length, mappingLocation, markers.length]);

  const getMarkerKey = useCallback((marker: SpotData): string => {

    if (marker.spotID !== undefined && marker.spotID !== null && marker.spotID !== 0) {
      return `spot-${marker.spotID}`;
    } else if (marker.coin !== undefined && marker.coin !== null) {
      return `coin-${marker.coin}`;
    } else {

      const lat = marker.latitude?.toFixed(6) ?? '0';
      const lng = marker.longitude?.toFixed(6) ?? '0';
      return `marker-${lat}-${lng}`;
    }
  }, []);

  const getMappedAd = useCallback((marker: SpotData): TopAd5Item | null | undefined => {
    const baseKey = getMarkerKey(marker);

    for (const [key, ad] of markerAdMapping.entries()) {
      if (key.startsWith(baseKey + '-')) {
        return ad;
      }
    }
    return undefined;
  }, [markerAdMapping, getMarkerKey]);

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
        console.log('[MapMainScreen] shop 클릭됨, ROUTES.shop으로 이동:', ROUTES.shop);
        navigate(ROUTES.shop);
        break;

      case 'referral':

        navigate(ROUTES.referralMyGroup);

        break;

      case 'info':

        navigate(ROUTES.myInfo);

        break;

      case 'map':

        console.log('📍 [하단 메뉴] 맵 클릭 - GPS 위치로 이동 및 콜아웃 숨기기');

        setShowCalloutPopup(false);
        setCalloutData(null);

        if (activeTab === 'Map') {
          goToGpsLocation();
        } else {

          setActiveTab('Map');
          setTimeout(() => {
            goToGpsLocation();
          }, 100);
        }
        break;

      default:

        console.log('Unknown navigation item:', itemId);

    }

  };

  const handleTabChange = (tab: 'Map' | 'Camera') => {
    setActiveTab(tab);
    console.log('Tab changed to:', tab);

    if (tab === 'Map') {

      setShowCalloutPopup(false);
      setCalloutData(null);

      setTimeout(() => {
        goToGpsLocation();
      }, 100);
    }
  };

  const handleMarkerPress = async (spot: SpotData) => {

    const campid = String(spot.campid || '');
    if (campid) {
      try {

      } catch (error) {
        console.warn('[MapMainScreen] 본 광고 확인 실패 (무시):', error);
      }
    }

    const markerKey = getMarkerKey(spot);
    const mappedAd = getMappedAd(spot);

    console.log('🎯 마커 클릭 - 매핑 확인:', {
      markerKey,
      spotID: spot.spotID,
      coin: spot.coin,
      latitude: spot.latitude,
      longitude: spot.longitude,
      hasMappedAd: !!mappedAd,
      mappedAdName: mappedAd?.name || '없음',
      mappedAdCompany: mappedAd?.ad_company || '없음',
      mappingSize: markerAdMapping.size,
    });

    if (spot.latitude && spot.longitude) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 [임시 작업] 현재 마커와 주변 5개 마커 광고명');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const currentAdName = mappedAd?.name || spot.name || '광고 없음';
      console.log(`[현재 마커] ${currentAdName} (거리: 0m)`);

      const nearbyMarkers = markers
        .filter(marker =>
          marker.latitude &&
          marker.longitude &&
          !(marker.spotID === spot.spotID && marker.latitude === spot.latitude && marker.longitude === spot.longitude) 
        )
        .map(marker => {
          const distance = calculateDistance(
            spot.latitude!,
            spot.longitude!,
            marker.latitude!,
            marker.longitude!
          );
          const ad = getMappedAd(marker);
          return {
            marker,
            distance,
            adName: ad?.name || marker.name || '광고 없음',
            adCompany: ad?.ad_company || '없음',
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5); 

      nearbyMarkers.forEach((item, index) => {
        console.log(`[주변 ${index + 1}] ${item.adName} (거리: ${item.distance.toFixed(2)}m, 회사: ${item.adCompany})`);
      });

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    const spotWithMappedAd = mappedAd ? {
      ...spot,
      name: mappedAd.name || spot.name,
      iconurl: mappedAd.iconurl || spot.iconurl,
      joindesc: mappedAd.joindesc || spot.joindesc,
      xrunPrice: mappedAd.xrunPrice || spot.xrunPrice,
      brand: spot.brand, 

      advertisement: spot.advertisement,
      campid: mappedAd.campid || spot.campid,

      thumbnail: mappedAd.thumbnail,
      ad_company: mappedAd.ad_company,
      coins: mappedAd.coins?.toString() || spot.coins,
    } as SpotData & { thumbnail?: string; ad_company?: string } : spot;
    console.log('🎯 마커 클릭 - 전달된 데이터:', {
      markerKey: markerKey,
      hasMappedAd: !!mappedAd,
      name: spotWithMappedAd.name,
      brand: spotWithMappedAd.brand,
      xrunPrice: spotWithMappedAd.xrunPrice,
      iconurl: spotWithMappedAd.iconurl,
      advertisement: spotWithMappedAd.advertisement,
      campid: (spotWithMappedAd as any).campid,
      coin: spotWithMappedAd.coin,
      joindesc: spotWithMappedAd.joindesc,
      ad_company: (spotWithMappedAd as any).ad_company,
    });
    setSelectedSpot(spotWithMappedAd);

    if (!showBottomPanel) {

      setShowBottomPanel(true);

    }

    if (mapRef.current && spot.latitude && spot.longitude) {

      const currentRegion = mapRegionRef.current;

      isProgrammaticMoveRef.current = true;

      console.log('📍 [프로그램 이동] 마커 클릭으로 맵 이동 시작');

      console.log('  현재 위치:', currentRegion.latitude.toFixed(6), currentRegion.longitude.toFixed(6));

      console.log('  목표 위치:', spot.latitude.toFixed(6), spot.longitude.toFixed(6));

      mapRef.current.animateToRegion({

        latitude: spot.latitude,

        longitude: spot.longitude,

        latitudeDelta: currentRegion.latitudeDelta,

        longitudeDelta: currentRegion.longitudeDelta,

      }, 500); 

      const newRegion = {

        latitude: spot.latitude,

        longitude: spot.longitude,

        latitudeDelta: currentRegion.latitudeDelta,

        longitudeDelta: currentRegion.longitudeDelta,

      };
      mapRegionRef.current = newRegion;

      lastLocationChangeTimeRef.current = Date.now();

      setTimeout(() => {

        isProgrammaticMoveRef.current = false;

        console.log('📍 [프로그램 이동] 마커 클릭 이동 플래그 리셋 완료');

      }, 600);

      setTimeout(() => {

        if (mapRef.current && spot.latitude && spot.longitude) {

          mapRef.current.pointForCoordinate({

            latitude: spot.latitude!,

            longitude: spot.longitude!,

          }).then((point) => {

            if (point) {

              setCalloutPosition({

                x: point.x - 110, 

                y: Math.max(50, point.y - 80), 

              });

              console.log('🎯 중앙 팝업 표시 데이터:', {
                name: spotWithMappedAd.name,

                xrunPrice: spotWithMappedAd.xrunPrice,
                advertisement: spotWithMappedAd.advertisement,
                campid: (spotWithMappedAd as any).campid,
                iconurl: spotWithMappedAd.iconurl,

                ad_company: (spotWithMappedAd as any).ad_company,
              });
              setCalloutData(spotWithMappedAd);

              setShowCalloutPopup(true);

            }

          }).catch((error) => {

            console.error('좌표 변환 오류:', error);

            const { width } = Dimensions.get('window');

            setCalloutPosition({

              x: (width - 220) / 2, 

              y: 100, 

            });

            console.log('🎯 중앙 팝업 표시 데이터 (좌표 변환 실패):', {
              name: spotWithMappedAd.name,
              brand: spotWithMappedAd.brand,
              xrunPrice: spotWithMappedAd.xrunPrice,
              advertisement: spotWithMappedAd.advertisement,
              campid: (spotWithMappedAd as any).campid,
              iconurl: spotWithMappedAd.iconurl,
              joindesc: spotWithMappedAd.joindesc,
              ad_company: (spotWithMappedAd as any).ad_company,
            });
            setCalloutData(spotWithMappedAd);

            setShowCalloutPopup(true);

          });

        }

      }, 600); 

    } else {

      const { width } = Dimensions.get('window');

      setCalloutPosition({

        x: (width - 220) / 2, 

        y: 100,

      });

      console.log('🎯 중앙 팝업 표시 데이터 (맵 미준비):', {
        name: spotWithMappedAd.name,
        brand: spotWithMappedAd.brand,
        xrunPrice: spotWithMappedAd.xrunPrice,
        advertisement: spotWithMappedAd.advertisement,
        campid: (spotWithMappedAd as any).campid,
        iconurl: spotWithMappedAd.iconurl,
        joindesc: spotWithMappedAd.joindesc,
        ad_company: (spotWithMappedAd as any).ad_company,
      });
      setCalloutData(spotWithMappedAd);

      setShowCalloutPopup(true);

    }

  };

  const handleMapPress = (event: any) => {

    const clickedCoordinate = event.nativeEvent.coordinate;

    if (!clickedCoordinate || !clickedCoordinate.latitude || !clickedCoordinate.longitude) {

      setShowCalloutPopup(false);

      setCalloutData(null);
      setShowBottomPanel(false);
      setSelectedSpot(null);

      return;

    }

    if (markers.length === 0) {

      setShowCalloutPopup(false);

      setCalloutData(null);
      setShowBottomPanel(false);
      setSelectedSpot(null);

      return;

    }

    let nearestMarker: SpotData | null = null;

    let minDistance = Infinity;

    markers.forEach((marker) => {

      if (!marker.latitude || !marker.longitude) {

        return;

      }

      const distance = calculateDistance(

        clickedCoordinate.latitude,

        clickedCoordinate.longitude,

        marker.latitude,

        marker.longitude

      );

      if (distance < minDistance) {

        minDistance = distance;

        nearestMarker = marker;

      }

    });

    if (nearestMarker === null || minDistance > 100) {

      setShowCalloutPopup(false);
      setCalloutData(null);
      setShowBottomPanel(false);
      setSelectedSpot(null);
      console.log('=== 맵 클릭: 100미터 이내 마커 없음 - 콜아웃 및 하단 패널 닫기 ===');
      console.log('가장 가까운 마커 거리:', minDistance === Infinity ? '없음' : `${minDistance.toFixed(2)}m`);
      return;
    }

    const marker: SpotData = nearestMarker;

    if (!marker.latitude || !marker.longitude) {

      setShowCalloutPopup(false);
      setCalloutData(null);
      setShowBottomPanel(false);
      setSelectedSpot(null);
      return;
    }

    const markerKey = getMarkerKey(marker);
    const mappedAd = getMappedAd(marker);

    const markerWithMappedAd = mappedAd ? {
      ...marker,
      name: mappedAd.name || marker.name,
      iconurl: mappedAd.iconurl || marker.iconurl,
      joindesc: mappedAd.joindesc || marker.joindesc,
      xrunPrice: mappedAd.xrunPrice || marker.xrunPrice,
      brand: marker.brand,
      advertisement: marker.advertisement,
      campid: mappedAd.campid || marker.campid,
      thumbnail: mappedAd.thumbnail,
      ad_company: mappedAd.ad_company,
      coins: mappedAd.coins?.toString() || marker.coins,
    } as SpotData & { thumbnail?: string; ad_company?: string } : marker;
    console.log('=== 맵 클릭: 가장 가까운 마커 찾기 ===');
    console.log('클릭한 위치:', clickedCoordinate.latitude, clickedCoordinate.longitude);
    console.log('가장 가까운 마커:', markerWithMappedAd.name || 'Unknown', '거리:', minDistance.toFixed(2), 'm');
    console.log('매핑된 광고 여부:', !!mappedAd, 'ad_company:', (markerWithMappedAd as any).ad_company);

    setSelectedSpot(markerWithMappedAd);

    if (!showBottomPanel) {

      setShowBottomPanel(true);

    }

    const currentRegion = mapRegionRef.current;

    if (mapRef.current && marker.latitude && marker.longitude) {

      isProgrammaticMoveRef.current = true;

      console.log('📍 [프로그램 이동] 맵 클릭으로 맵 이동 시작');

      console.log('  현재 위치:', currentRegion.latitude.toFixed(6), currentRegion.longitude.toFixed(6));

      console.log('  목표 위치:', marker.latitude.toFixed(6), marker.longitude.toFixed(6));

      mapRef.current.animateToRegion({

        latitude: marker.latitude,

        longitude: marker.longitude,

        latitudeDelta: currentRegion.latitudeDelta,

        longitudeDelta: currentRegion.longitudeDelta,

      }, 500); 

      setTimeout(() => {

        isProgrammaticMoveRef.current = false;

        console.log('📍 [프로그램 이동] 맵 클릭 이동 플래그 리셋 완료');

      }, 600);

    }

    const newRegion = {

      latitude: marker.latitude!,

      longitude: marker.longitude!,

      latitudeDelta: currentRegion.latitudeDelta,

      longitudeDelta: currentRegion.longitudeDelta,

    };
    mapRegionRef.current = newRegion;

    lastLocationChangeTimeRef.current = Date.now();

    setTimeout(() => {

      if (mapRef.current && marker.latitude && marker.longitude) {

        mapRef.current.pointForCoordinate({

          latitude: marker.latitude,

          longitude: marker.longitude,

        }).then((point) => {

          if (point) {

            setCalloutPosition({

              x: point.x - 110, 

              y: Math.max(50, point.y - 80), 

            });

            setCalloutData(markerWithMappedAd);

            setShowCalloutPopup(true);

          }

        }).catch((error) => {

          console.error('좌표 변환 오류:', error);

          const { width } = Dimensions.get('window');

          setCalloutPosition({

            x: (width - 220) / 2, 

            y: 100, 

          });

          setCalloutData(marker);

          setShowCalloutPopup(true);

        });

      }

    }, 600); 

  };

  const updateCalloutPosition = (spot: SpotData) => {

    if (mapRef.current && spot.latitude && spot.longitude) {

      mapRef.current.pointForCoordinate({

        latitude: spot.latitude!,

        longitude: spot.longitude!,

      }).then((point) => {

        if (point) {

          setCalloutPosition({

            x: point.x - 135, 

            y: Math.max(50, point.y - 80), 

          });

        }

      }).catch((error) => {

        console.error('좌표 변환 오류:', error);

      });

    }

  };

  const handleRegionChange = (region: any) => {

  };

  const handlePanDrag = () => {

    if (Platform.OS === 'ios') {

      console.log('👆 [iOS] 사용자 드래그 시작 감지');

      isUserTouchRef.current = true;

    }

  };

  const handleRegionChangeComplete = async (region: any) => {

    const isProgrammatic = isProgrammaticMoveRef.current;
    const platform = Platform.OS;
    const lastUpdated = lastUpdatedRegionRef.current;

    if (Platform.OS === 'ios' && isProgrammaticMoveRef.current) {
      console.log('⚠️ [iOS] 프로그램 이동 감지 - mapRegionRef 업데이트 건너뛰기');

      mapRegionRef.current = region;

      isProgrammaticMoveRef.current = false;
      return;
    }

    if (Platform.OS === 'ios' && !isUserTouchRef.current) {
      console.log('⚠️ [iOS] 사용자 터치 없음 - mapRegionRef 업데이트 건너뛰기 및 지도 위치 복귀');

      if (mapRef.current) {
        const currentRegion = mapRegionRef.current;
        mapRef.current.animateToRegion({
          latitude: currentRegion.latitude,
          longitude: currentRegion.longitude,
          latitudeDelta: currentRegion.latitudeDelta,
          longitudeDelta: currentRegion.longitudeDelta,
        }, 100); 
      }

      return;
    }

    if (Platform.OS === 'ios' && lastUpdated) {

      const latDiff = Math.abs(region.latitude - lastUpdated.latitude);

      const lonDiff = Math.abs(region.longitude - lastUpdated.longitude);

      const minChange = 0.0001; 

      if (latDiff < minChange && lonDiff < minChange) {

        console.log('⚠️ [iOS] 위치 변경이 너무 작음 - 무시 및 지도 위치 복귀');

        if (mapRef.current && lastUpdated) {

          mapRef.current.animateToRegion({

            latitude: lastUpdated.latitude,

            longitude: lastUpdated.longitude,

            latitudeDelta: mapRegionRef.current.latitudeDelta,

            longitudeDelta: mapRegionRef.current.longitudeDelta,

          }, 100); 

        }

        return;

      }

    } else if (Platform.OS === 'ios' && !lastUpdated) {

    }

    if (Platform.OS === 'ios') {

    } else {

    }

    mapRegionRef.current = region;

    lastUpdatedRegionRef.current = {

      latitude: region.latitude,

      longitude: region.longitude,

    };

    lastLocationChangeTimeRef.current = Date.now();

    isUserTouchRef.current = false;

  };

  const stableInitialRegion = useMemo(() => {
    return mapRegionRef.current;
  }, []); 

  const stableShowsUserLocation = useMemo(() => {
    return !!location;
  }, [location]);

  const memoizedMarkers = useMemo(() => {

    const filtered = markers.filter((marker) => marker.latitude && marker.longitude); 

    const mapped = filtered.map((marker) => {

      const campId = marker.campid ?? '';
      const coinValue = marker.coin ?? '';
      const spotId = marker.spotID ?? '';
      const lat = marker.latitude!.toFixed(6);
      const lng = marker.longitude!.toFixed(6);
      const uniqueKey = `marker-${campId}-${coinValue}-${spotId}-${lat}-${lng}`;
      return {
        ...marker,
        uniqueKey,
      };
    });
    console.log('✅ [memoizedMarkers] 최종 마커 개수:', mapped.length);
    return mapped;
  }, [markers]);

  useEffect(() => {
    console.log('📊 [markers 상태 변경] markers 개수:', markers.length);
    if (markers.length > 0) {
      console.log('✅ [markers 상태 변경] 마커 데이터 있음, 첫 번째 마커:', {
        coin: markers[0].coin,
        name: markers[0].name,
        latitude: markers[0].latitude,
        longitude: markers[0].longitude,
      });

      if (
        hasCompletedInitialLoadRef.current &&
        !hasMovedToFirstMarkerOnInitialLoadRef.current &&
        markers[0].latitude &&
        markers[0].longitude &&
        mapRef.current
      ) {
        console.log('📍 [초기 로드] 첫 번째 마커 위치로 맵 이동:', markers[0].latitude, markers[0].longitude);

        isProgrammaticMoveRef.current = true;
        mapRef.current.animateToRegion({
          latitude: markers[0].latitude,
          longitude: markers[0].longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);

        mapRegionRef.current = {
          latitude: markers[0].latitude,
          longitude: markers[0].longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        hasMovedToFirstMarkerOnInitialLoadRef.current = true;

        setTimeout(() => {
          isProgrammaticMoveRef.current = false;
        }, 600);
      }
    } else {
      console.log('⚠️ [markers 상태 변경] 마커 데이터 없음 (빈 배열)');
    }
  }, [markers]);

  const bottomNavItems = [

    { id: 'xplay', label: t('components.bottomNavigationBar.xplay'), icon: iconXplay },

    { id: 'shop', label: t('components.bottomNavigationBar.shop'), icon: iconShop },

    { id: 'map', label: '' }, 

    { id: 'wallet', label: t('components.bottomNavigationBar.wallet'), icon: iconWallet },

    { id: 'info', label: t('components.bottomNavigationBar.info'), icon: iconUser },

  ];

  const LIGHT_MAP_ID = "93440b14d54bef4d8c7f9ddf";

  if (activeTab === 'Camera') {

    return (

      <CameraMainScreen

        activeTab={activeTab}

        onTabChange={handleTabChange}

      />

    );

  }

  return (

    <View style={styles.container}>

      {}
      <LevelNotification navigation={navigate} />

      <StatusBar style="dark" />
      {}

      <View style={styles.statusBar}>
        <View style={styles.statusBarContent}>
          <View style={styles.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}

      <View style={styles.mapContainer}>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          userInterfaceStyle="light"
          initialRegion={stableInitialRegion}
          showsUserLocation={stableShowsUserLocation}
          showsMyLocationButton={false}
          onMapReady={handleMapReady}
          onRegionChange={handleRegionChange}
          onRegionChangeComplete={handleRegionChangeComplete}
          onPanDrag={handlePanDrag}
          onPress={handleMapPress}
          googleMapId={LIGHT_MAP_ID}
        >

          {}

          {memoizedMarkers.map((marker) => {
            return (
              <Marker

                key={marker.uniqueKey}

                coordinate={{
                  latitude: marker.latitude!,
                  longitude: marker.longitude!,
                }}

                anchor={{ x: 0.5, y: 0.5 }}
                onPress={() => handleMarkerPress(marker)}
                tracksViewChanges={true}
              >

                {}
                {logoTempMarker ? (
                  <View style={styles.markerImageContainer}>
                    <Image
                      source={logoTempMarker}
                      style={styles.markerImage}
                      resizeMode="contain"
                    />
                  </View>
                ) : (

                  <View style={styles.defaultMarker} />
                )}

              </Marker>
            );
          })}
        </MapView>

        {}
        {

}

        {}
        <Pressable
          style={styles.mapPinButton}
          onPress={goToCurrentLocation}
        >
          <Image
            source={require('../../assets/images/locationpin2.png')}
            style={styles.mapPinIcon}
            resizeMode="contain"
          />
        </Pressable>

        {}

        {showCalloutPopup && calloutData && (

          <View
            style={[
              styles.calloutPopup,
              {
                left: calloutPosition.x,
                top: calloutPosition.y,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.calloutContainer}>
              <View style={styles.calloutLeft}>
                {}
                {calloutData.iconurl ? (
                  <Image
                    source={{ uri: calloutData.iconurl }}
                    style={[styles.calloutImage, { borderRadius: 6 }]}
                    resizeMode="cover"
                  />
                ) : iconXrunLogo ? (
                  <Image
                    source={iconXrunLogo}
                    style={styles.calloutImage}
                    resizeMode="contain"
                  />
                ) : (
                  iconXrunBlack && (
                    <Image
                      source={iconXrunBlack}
                      style={styles.calloutImage}
                      resizeMode="contain"
                    />
                  )
                )}

                {}

                <Text style={styles.calloutDistance}>
                  {calloutData.distance.toFixed(2)}m
                </Text>
              </View>

              <View style={styles.calloutRight}>
                <Text style={styles.calloutBrand} numberOfLines={2}>
                  {calloutData.name || calloutData.brand || 'XRUN'} 획득 가능합니다.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {}

      <MapBottomPanel

        visible={showBottomPanel}

        spotData={selectedSpot}

        deviceHeading={deviceHeading}

        onClose={() => {

          setShowBottomPanel(false);

          setSelectedSpot(null);

        }}

        onExpand={() => {

          setShowBottomPanel(true);

        }}

      />

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

      {}

      {showLoadingOverlay && (

        <View style={styles.loadingOverlay}>

          <View style={styles.loadingContainer}>

            <ActivityIndicator size="large" color="#343a5a" />

            <Text style={styles.loadingText}>{t('common.messages.loading')}</Text>

          </View>

        </View>

      )}

      {}
      {pinModalProps != null && (
        <WalletKeyPinSetupModal
          memberId={pinModalProps.memberId}
          email={pinModalProps.email}
          visible={showPinModal}
          onSuccess={() => {
            setShowPinModal(false);
            setPinModalProps(null);
          }}
        />
      )}

    </View>

  );

};

const styles = StyleSheet.create({

  container: {
    ...COMMON_STYLES.container,

  },

  statusBar: {

    height: 44,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',

    paddingHorizontal: 21,

  },

  statusBarContent: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  timeContainer: {

  },

  mapContainer: {

    flex: 1,

    position: 'relative',

  },

  map: {

    flex: 1,

    width: '100%',

    height: '100%',

  },

  mapPlaceholder: {

    flex: 1,

    backgroundColor: '#F8F8F8',

  },

  mapPinButton: {
    position: 'absolute',
    top: 26,
    right: 16,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapPinIcon: {
    width: 40,
    height: 40,
  },

  topLogo: {
    position: 'absolute',
    top: 32,
    left: 8,
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').width / 4,
    zIndex: 10, 
    alignItems: 'center',
    justifyContent: 'center',
  },

  calloutPopup: {

    position: 'absolute',

    zIndex: 1000,

    pointerEvents: 'box-none',

  },

  calloutContainer: {

    backgroundColor: 'white',

    borderColor: '#ffdc04',

    borderWidth: 5,

    flexDirection: 'row',

    width: 220,

    minHeight: 70,

    paddingVertical: 8,

    paddingHorizontal: 10,

    borderRadius: 15,

    alignItems: 'center',

    elevation: 10,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.25,

    shadowRadius: 3.84,

  },

  calloutLeft: {
    justifyContent: 'space-between',
    marginLeft: 0,
  },

  calloutImage: {
    marginLeft: 4,
    width: 32,
    height: 32,
  },

  calloutDistance: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: 'black',
    textAlign: 'center',
    marginBottom: 2,
  },

  calloutRight: {
    paddingLeft: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },

  calloutBrand: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },

  markerImageContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  markerImage: {
    width: 20,
    height: 20,
  },

  defaultMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff0000',
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, 
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#10192d',
  },

});

