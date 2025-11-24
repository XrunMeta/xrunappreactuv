import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  Text,
  Image,
  AppState,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigationBar, MapBottomPanel } from '../components';
import { CameraMainScreen } from './CameraMainScreen';
import { ROUTES, useAppNavigation } from '../navigation';
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

export const MapMainScreen: React.FC = () => {
  const { navigate } = useAppNavigation();
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

  const [markers, setMarkers] = useState<SpotData[]>([]);
  const [loadingMarkers, setLoadingMarkers] = useState(false);

  let iconXrunBlack: any = null;
  try {
    iconXrunBlack = require('../../assets/images/icon_xrun_black.png');
  } catch (e) {
    console.warn('icon_xrun_black.png not found');
  }

  useEffect(() => {
    let watchId: number | null = null;

    const startLocationTracking = async () => {

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('위치 권한이 거부되었습니다.');
        Alert.alert(
          '위치 권한 필요',
          '지도를 사용하려면 위치 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
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
        setMapRegion({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        await AsyncStorage.setItem('selfCoordinate', JSON.stringify(newLocation));

        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          try {
            const parsedUserData = JSON.parse(userData);
            const member = parsedUserData?.member;
            if (member) {
              setLoadingMarkers(true);
              console.log('=== 맵 마커 데이터 가져오기 시작 ===');
              const markerData = await fetchMapMarkerData(
                newLocation.latitude,
                newLocation.longitude,
                member,
                navigate,
              );
              console.log('=== 맵 마커 데이터 가져오기 완료 ===');
              console.log('마커 개수:', markerData.length);
              setMarkers(markerData);
              setLoadingMarkers(false);
            } else {
              console.log('userData에 member가 없습니다.');
            }
          } catch (parseError) {
            console.error('userData 파싱 오류:', parseError);
          }
        } else {
          console.log('userData가 없습니다. 로그인이 필요할 수 있습니다.');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        setErrorMsg('위치를 가져오는 중 오류가 발생했습니다.');
        console.error('Location error:', error);

        if (errorMessage.includes('location services') || errorMessage.includes('unavailable')) {
          Alert.alert(
            '위치 서비스 오류',
            '위치 정보를 가져올 수 없습니다.\n\n다음 사항을 확인해주세요:\n• 기기의 위치 서비스(GPS)가 켜져 있는지\n• 네트워크 위치 서비스가 활성화되어 있는지\n• 실내에서는 GPS 신호가 약할 수 있습니다.',
            [
              { text: '기본 위치 사용', onPress: () => {

                const defaultLocation: LocationData = {
                  latitude: 37.5665,
                  longitude: 126.9780,
                };
                setLocation(defaultLocation);
                setMapRegion({
                  latitude: defaultLocation.latitude,
                  longitude: defaultLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
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
          setMapRegion({
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    };

    startLocationTracking();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {

        startLocationTracking();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [navigate]);

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

  const handleMarkerPress = (spot: SpotData) => {
    setSelectedSpot(spot);
    if (!showBottomPanel) {
      setShowBottomPanel(true);
    }
  };

  const bottomNavItems = [
    { id: 'wallet', label: 'Wallet', icon: iconWallet },
    { id: 'shop', label: 'Shop', icon: iconShop },
    { id: 'map', label: '' }, 
    { id: 'referral', label: 'Referral', icon: iconReferral },
    { id: 'info', label: 'Info', icon: iconUser },
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
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChangeComplete={setMapRegion}
          >
            {}
            {markers
              .filter((marker) => marker.latitude && marker.longitude) 
              .map((marker) => (
              <Marker
                key={marker.spotID}
                coordinate={{
                  latitude: marker.latitude!,
                  longitude: marker.longitude!,
                }}
                onPress={() => handleMarkerPress(marker)}
              >
                {}
                <Callout tooltip>
                  <View style={styles.calloutContainer}>
                    <View style={styles.calloutLeft}>
                      {}
                      {marker.iconurl ? (
                        <Image
                          source={{ uri: marker.iconurl }}
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
                        {marker.distance.toFixed(2)}m
                      </Text>
                    </View>
                    <View style={styles.calloutRight}>
                      <Text style={styles.calloutBrand}>
                        {marker.brand || marker.name} available
                      </Text>
                      <Text style={styles.calloutCoins}>
                        {marker.coins || '0'} {marker.brand || ''}
                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
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
      </View>

      {}
      <MapBottomPanel
        visible={showBottomPanel}
        spotData={selectedSpot}
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

  calloutContainer: {
    backgroundColor: 'white',
    borderColor: '#ffdc04',
    borderWidth: 3,
    flexDirection: 'row',
    width: 270,
    height: 70,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 15,
    gap: 3,
    elevation: 4,
    marginBottom: Platform.OS === 'ios' ? -14 : 0,
  },
  calloutLeft: {
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  calloutImage: {
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
});

