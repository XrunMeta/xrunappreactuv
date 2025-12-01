import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Text,
  Image,
  AppState,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { BottomNavigationBar, MapBottomPanel } from '../components';
import { CameraMainScreen } from './CameraMainScreen';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { SpotData } from '../types';
import { fetchMapMarkerData } from '../services';

interface LocationData {
  latitude: number;
  longitude: number;
}

let iconWallet: any = null;
let iconShop: any = null;
let iconReferral: any = null;
let iconUser: any = null;
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
  iconMapPoint = require('../../assets/images/icon_mapPoint.png');
} catch (e) {
  console.warn('icon_mapPoint.png not found');
}

let logoTempMarker: any = null;

try {
  logoTempMarker = require('../../assets/logo_tempMarker.png');
} catch (e) {
  console.warn('logo_tempMarker.png not found');
}

export const MapMainScreen: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Map' | 'Camera'>('Map');
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665, 
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<SpotData | null>(null);

  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const deviceHeadingRef = useRef<number | null>(null);

  const [markers, setMarkers] = useState<SpotData[]>([]);
  const [loadingMarkers, setLoadingMarkers] = useState(false);
  const loadingMarkersRef = useRef(false); 

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

  const mapRegionRef = useRef(mapRegion);

  const isProgrammaticMoveRef = useRef(false);

  const isUserTouchRef = useRef(false);

  const lastUpdatedRegionRef = useRef<{ latitude: number; longitude: number } | null>(null);

  let iconXrunBlack: any = null;
  try {
    iconXrunBlack = require('../../assets/images/icon_xrun_black.png');
  } catch (e) {
    console.warn('icon_xrun_black.png not found');
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

  const loadMarkersForLocation = useCallback(async (targetLocation: LocationData) => {

    if (loadingMarkersRef.current) {
      console.log('=== 맵 마커 로딩 중, 중복 호출 방지 ===');
      return;
    }

    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      console.log('userData가 없습니다. 로그인이 필요할 수 있습니다.');
      return;
    }

    try {
      const parsedUserData = JSON.parse(userData);
      const member = parsedUserData?.member;
      if (!member) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      loadingMarkersRef.current = true;
      setLoadingMarkers(true);
      console.log('=== 맵 마커 데이터 가져오기 시작 ===');
      console.log('위치:', targetLocation.latitude, targetLocation.longitude);
      const markerData = await fetchMapMarkerData(
        targetLocation.latitude,
        targetLocation.longitude,
        member,
        navigate,
      );
      console.log('=== 맵 마커 데이터 가져오기 완료 ===');
      console.log('마커 개수:', markerData.length);
      setMarkers(markerData);
      setLastFetchedLocation(targetLocation);
      lastFetchedLocationRef.current = targetLocation;

      if (markerData.length > 0) {
        try {
          await AsyncStorage.setItem('astorCoinsData', JSON.stringify(markerData));
          console.log('✅ astorCoinsData AsyncStorage에 저장 완료');
        } catch (storageError) {
          console.error('AsyncStorage 저장 오류:', storageError);
        }
      }
    } catch (parseError) {
      console.error('userData 파싱 오류:', parseError);
    } finally {

      loadingMarkersRef.current = false;
      setLoadingMarkers(false);
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
    setMapRegion(newRegion);
    mapRegionRef.current = newRegion;

    await loadMarkersForLocation(currentInitialLocation);
  }, [initialLocation, loadMarkersForLocation]);

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
      console.log('=== [3초마다 위치 확인] 맵 위치 변경 감지 ===');
      console.log('  현재 위치:', currentLocation.latitude.toFixed(6), currentLocation.longitude.toFixed(6));
      console.log('  마지막 마커 로드 위치:', currentLastFetchedLocation.latitude.toFixed(6), currentLastFetchedLocation.longitude.toFixed(6));
      console.log('  거리:', distance.toFixed(2), 'm');
      console.log('  프로그램 이동 플래그:', isProgrammaticMoveRef.current);
    }

    if (distance >= 500) {
      console.log('=== 200m 이상 이동, 새로운 위치에서 마커 로드 ===');
      await loadMarkersForLocation(currentLocation);
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
    let watchId: number | null = null;

    const startLocationTracking = async () => {

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t('common.messages.locationPermissionMessage'));
        await showAlert(
          t('common.messages.locationPermissionRequired'),
          t('common.messages.locationPermissionMessage'),
          [{ text: t('common.buttons.confirm') }]
        );
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

        setLocation(newLocation);
        const newRegion = {
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setMapRegion(newRegion);
        mapRegionRef.current = newRegion;

        if (!initialLocation) {
          setInitialLocation(newLocation);
          setLastFetchedLocation(newLocation);
          initialLocationRef.current = newLocation;
          lastFetchedLocationRef.current = newLocation;

          lastUpdatedRegionRef.current = {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          };
          console.log('=== 초기 위치 저장 ===', newLocation);
        }

        await AsyncStorage.setItem('selfCoordinate', JSON.stringify(newLocation));

        if (!initialLocation || 
            (lastFetchedLocation && 
             lastFetchedLocation.latitude === newLocation.latitude && 
             lastFetchedLocation.longitude === newLocation.longitude)) {
          await loadMarkersForLocation(newLocation);
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
              { text: '기본 위치 사용', onPress: async () => {

                const defaultLocation: LocationData = {
                  latitude: 37.5665,
                  longitude: 126.9780,
                };
                setLocation(defaultLocation);
                const newRegion = {
                  latitude: defaultLocation.latitude,
                  longitude: defaultLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                setMapRegion(newRegion);
                mapRegionRef.current = newRegion;

                if (!initialLocation) {
                  setInitialLocation(defaultLocation);
                  setLastFetchedLocation(defaultLocation);
                  initialLocationRef.current = defaultLocation;
                  lastFetchedLocationRef.current = defaultLocation;

                  lastUpdatedRegionRef.current = {
                    latitude: defaultLocation.latitude,
                    longitude: defaultLocation.longitude,
                  };
                }

                await loadMarkersForLocation(defaultLocation);
              }},
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
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setMapRegion(newRegion);
          mapRegionRef.current = newRegion;

          if (!initialLocation) {
            setInitialLocation(defaultLocation);
            setLastFetchedLocation(defaultLocation);
            initialLocationRef.current = defaultLocation;
            lastFetchedLocationRef.current = defaultLocation;

            lastUpdatedRegionRef.current = {
              latitude: defaultLocation.latitude,
              longitude: defaultLocation.longitude,
            };
          }

          await loadMarkersForLocation(defaultLocation);
        }
      }
    };

    startLocationTracking();

    const startHeadingTracking = async (): Promise<Location.LocationSubscription | null> => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return null;
        }

        const headingSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,

            timeInterval: 0, 
            distanceInterval: 0, 
          },
          (location) => {

            const heading = location.coords.heading;

            if (heading !== null && heading !== undefined && !isNaN(heading)) {
              const previousHeading = deviceHeadingRef.current;

              if (previousHeading === null || heading !== previousHeading) {

                setDeviceHeading(heading);
                deviceHeadingRef.current = heading;
              }
            }
          }
        );

        return headingSubscription;
      } catch (error) {
        console.error('헤딩 추적 오류:', error);
        return null;
      }
    };

    let headingSubscription: Location.LocationSubscription | null = null;
    startHeadingTracking().then((subscription) => {
      headingSubscription = subscription;
    });

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {

        startLocationTracking();

        startHeadingTracking().then((sub) => {
          if (headingSubscription) {
            headingSubscription.remove();
          }
          headingSubscription = sub || null;
        });
      }
    });

    return () => {
      subscription?.remove();

      if (headingSubscription) {
        headingSubscription.remove();
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
  }, [navigate]);

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
    }, 3000); 

    lastLocationChangeTimeRef.current = Date.now();

    return () => {

      if (locationCheckTimerRef.current) {
        clearInterval(locationCheckTimerRef.current);
        locationCheckTimerRef.current = null;
      }
    };
  }, [initialLocation, lastFetchedLocation, checkMapLocation]);

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
        navigate(ROUTES.referralMyGroup);
        break;
      case 'info':
        navigate(ROUTES.myInfo);
        break;
      case 'map':

        break;
      default:
        console.log('Unknown navigation item:', itemId);
    }
  };

  const handleTabChange = (tab: 'Map' | 'Camera') => {
    setActiveTab(tab);
    console.log('Tab changed to:', tab);
  };

  const handleMarkerPress = (spot: SpotData, index: number) => {
    console.log('Marker pressed:', spot);
    setSelectedSpot(spot);
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
      setMapRegion(newRegion);
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
              setCalloutData(spot);
              setShowCalloutPopup(true);
            }
          }).catch((error) => {
            console.error('좌표 변환 오류:', error);

            const { width } = Dimensions.get('window');
            setCalloutPosition({
              x: (width - 220) / 2, 
              y: 100, 
            });
            setCalloutData(spot);
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
      setCalloutData(spot);
      setShowCalloutPopup(true);
    }
  };

  const handleMapPress = (event: any) => {

    const clickedCoordinate = event.nativeEvent.coordinate;
    if (!clickedCoordinate || !clickedCoordinate.latitude || !clickedCoordinate.longitude) {

      setShowCalloutPopup(false);
      setCalloutData(null);
      return;
    }

    if (markers.length === 0) {
      setShowCalloutPopup(false);
      setCalloutData(null);
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

    if (nearestMarker === null) {

      setShowCalloutPopup(false);
      setCalloutData(null);
      return;
    }

    const marker: SpotData = nearestMarker;
    if (!marker.latitude || !marker.longitude) {

      setShowCalloutPopup(false);
      setCalloutData(null);
      return;
    }

    console.log('=== 맵 클릭: 가장 가까운 마커 찾기 ===');
    console.log('클릭한 위치:', clickedCoordinate.latitude, clickedCoordinate.longitude);
    console.log('가장 가까운 마커:', marker.name || 'Unknown', '거리:', minDistance.toFixed(2), 'm');

    setSelectedSpot(marker);
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
    setMapRegion(newRegion);
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
            setCalloutData(marker);
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

  const handleRegionChangeComplete = (region: any) => {
    const isProgrammatic = isProgrammaticMoveRef.current;
    const platform = Platform.OS;
    const lastUpdated = lastUpdatedRegionRef.current;

    console.log('=== [맵 이동 완료 이벤트] ===');
    console.log('플랫폼:', platform);
    console.log('프로그램 이동 플래그:', isProgrammatic);
    console.log('사용자 터치 플래그:', isUserTouchRef.current);
    console.log('새로운 위치:', region.latitude.toFixed(6), region.longitude.toFixed(6));
    console.log('현재 mapRegionRef 위치:', mapRegionRef.current.latitude.toFixed(6), mapRegionRef.current.longitude.toFixed(6));

    if (Platform.OS === 'ios' && isProgrammaticMoveRef.current) {
      console.log('⚠️ [iOS] 프로그램 이동 감지 - mapRegionRef 업데이트 건너뛰기');

      setMapRegion(region);

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

      console.log('  위치 변경 차이:', 'latDiff:', latDiff.toFixed(6), 'lonDiff:', lonDiff.toFixed(6));

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

      console.log('  [iOS] 첫 위치 업데이트 (lastUpdated가 null)');
    }

    if (Platform.OS === 'ios') {
      console.log('✅ [iOS] 사용자 터치 + 위치 변경 확인 - mapRegionRef 업데이트');
    } else {
      console.log('✅ [Android] 사용자 드래그 감지 - mapRegionRef 업데이트');
    }

    setMapRegion(region);
    mapRegionRef.current = region;
    lastUpdatedRegionRef.current = {
      latitude: region.latitude,
      longitude: region.longitude,
    };

    lastLocationChangeTimeRef.current = Date.now();

    isUserTouchRef.current = false;
  };

  const bottomNavItems = [
    { id: 'wallet', label: t('components.bottomNavigationBar.wallet'), icon: iconWallet },
    { id: 'shop', label: t('components.bottomNavigationBar.shop'), icon: iconShop },
    { id: 'map', label: '' }, 
    { id: 'referral', label: t('components.bottomNavigationBar.referral'), icon: iconReferral },
    { id: 'info', label: t('components.bottomNavigationBar.info'), icon: iconUser },
  ];

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
        {location ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChange={handleRegionChange}
            onRegionChangeComplete={handleRegionChangeComplete}
            onPanDrag={handlePanDrag}
            onPress={handleMapPress}
          >
            {}
            {markers
              .filter((marker) => marker.latitude && marker.longitude) 
              .map((marker, index) => {

                const uniqueKey = marker.coin || `marker-${marker.latitude}-${marker.longitude}`;

                return (
                <Marker
                  key={uniqueKey}
                  coordinate={{
                    latitude: marker.latitude!,
                    longitude: marker.longitude!,
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onPress={() => handleMarkerPress(marker, index)}
                >
                  {}
                  {logoTempMarker && (
                    <Image
                      source={logoTempMarker}
                      style={styles.markerImage}
                      resizeMode="contain"
                    />
                  )}
                </Marker>
              );
              })}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            {}
          </View>
        )}

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
                <Text style={styles.calloutBrand}>
                  {calloutData.brand || calloutData.name} 획득 가능합니다.
                </Text>
                <Text style={styles.calloutCoins}>
                  {calloutData.xrunPrice?.toFixed(2) || '0'} {calloutData.brand || 'XRUN'}
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

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
    marginLeft: 8,
    width: 32,
    height: 32,
  },
  calloutDistance: {
    fontSize: 12,
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
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },
  calloutCoins: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },

  markerImage: {
    width: 40,
    height: 40,
  },
});

