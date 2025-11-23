import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { BottomNavigationBar } from '../components';
import { COLORS } from '../constants';
import { CameraMainScreen } from './CameraMainScreen';

const { width, height } = Dimensions.get('window');

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

let iconArrow: any = null;
let iconXrunLogo: any = null;
let iconMapPoint: any = null;

try {
  iconArrow = require('../../assets/images/icon_arrow.png');
} catch (e) {
  console.warn('icon_arrow.png not found');
}

try {
  iconXrunLogo = require('../../assets/images/logoMain_XRUN.png');
} catch (e) {
  console.warn('logoMain_XRUN.png not found');
}

try {
  iconMapPoint = require('../../assets/images/icon_mapPoint.png');
} catch (e) {
  console.warn('icon_mapPoint.png not found');
}

export const MapMainScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Map' | 'Camera'>('Map');
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665, 
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [showBottomPanel, setShowBottomPanel] = useState(true);

  const bottomPanelBottom = useRef(new Animated.Value(90)).current; 

  const [dummySpotData] = useState({
    distance: 2.53, 
    direction: 45, 
    name: 'Earn rewards with XRUN here',
  });

  useEffect(() => {
    (async () => {

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
      } catch (error) {
        setErrorMsg('위치를 가져오는 중 오류가 발생했습니다.');
        console.error('Location error:', error);
      }
    })();
  }, []);

  const handleNavItemPress = (itemId: string) => {
    console.log('Navigation item pressed:', itemId);

  };

  const handleTabChange = (tab: 'Map' | 'Camera') => {
    setActiveTab(tab);
    console.log('Tab changed to:', tab);
  };

  useEffect(() => {
    if (showBottomPanel) {
      Animated.timing(bottomPanelBottom, {
        toValue: 80, 
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
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="현재 위치"
            />
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
          pointerEvents: 'box-none', 
        }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: bottomPanelBottom, 
              left: 0,
              right: 0,
              zIndex: 1,
              pointerEvents: 'auto', 
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
              styles.bottomPanel,
              {
                minHeight: showBottomPanel ? 100 : 35,
              },
            ]}>
            {}
            {showBottomPanel && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 8,
                  paddingBottom: 4,
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
            {showBottomPanel && (
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
                  {iconArrow && (
                    <View
                      style={{
                        width: 33,
                        height: 33,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        transform: [{ rotate: `${dummySpotData.direction}deg` }],
                      }}>
                      <Image
                        source={iconArrow}
                        style={{
                          width: 23,
                          height: 23,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  )}

                  {}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        fontSize: 16,
                        color: '#4c4e55',
                        lineHeight: 24,
                        marginBottom: 4,
                      }}>
                      {dummySpotData.distance.toFixed(2)}m
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 12,
                        color: '#4c4e55',
                        lineHeight: 15,
                        letterSpacing: 0.06,
                      }}>
                      {dummySpotData.name}
                    </Text>
                  </View>
                </View>

                {}
                {iconXrunLogo && (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 12,
                    }}>
                    <Image
                      source={iconXrunLogo}
                      style={{
                        width: 44,
                        height: 44,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                )}

                {}
                <Pressable
                  onPress={() => {
                    console.log('📱 하단 패널 닫기 버튼 클릭');
                    setShowBottomPanel(false);
                  }}
                  style={{
                    width: 14,
                    height: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                  }}>
                  {iconArrow && (
                    <View
                      style={{
                        transform: [{ rotate: '270deg' }],
                      }}>
                      <Image
                        source={iconArrow}
                        style={{
                          width: 14,
                          height: 14,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </Pressable>
              </View>
            )}
          </Pressable>
        </Animated.View>
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

  bottomPanel: {
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
  },
});

