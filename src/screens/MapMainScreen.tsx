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
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { BottomNavigationBar, ChoiceDialog } from '../components';
import { COLORS } from '../constants';
import { CameraMainScreen } from './CameraMainScreen';
import { ROUTES, useAppNavigation } from '../navigation';

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

  const [showBottomPanel, setShowBottomPanel] = useState(true);

  const bottomPanelBottom = useRef(new Animated.Value(90)).current; 

  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showMultiStepDialog, setShowMultiStepDialog] = useState(false);

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
    })();
  }, []);

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

        {}
        <View style={styles.testButtonContainer}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => setShowTestDialog(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.testButtonText}>테스트 팝업</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.testButton, styles.testButtonSecondary]}
            onPress={() => setShowMultiStepDialog(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.testButtonText}>다단계 팝업</Text>
          </TouchableOpacity>
        </View>
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

      {}
      <ChoiceDialog
        visible={showTestDialog}
        title="테스트 팝업"
        message="이것은 ChoiceDialog 테스트 팝업입니다. 두 개의 버튼을 테스트할 수 있습니다."
        button1Label="취소"
        button1Action={() => {
          Alert.alert('취소', '취소 버튼이 클릭되었습니다.');
          setShowTestDialog(false);
        }}
        button2Label="확인"
        button2Action={async () => {
          Alert.alert('확인', '확인 버튼이 클릭되었습니다.');
          setShowTestDialog(false);
        }}
        onClose={() => setShowTestDialog(false)}
      />

      {}
      <ChoiceDialog
        visible={showMultiStepDialog}
        steps={[
          {
            title: "1단계",
            message: "첫 번째 단계입니다. 다음 단계로 진행하시겠습니까?",
            button1Label: "취소",
            button1Action: (_, __, closeDialog) => {
              Alert.alert('취소', '1단계에서 취소되었습니다.');
              closeDialog();
            },
            button2Label: "다음",
            button2Action: (goToNextStep) => {
              goToNextStep();
            },
          },
          {
            title: "2단계",
            message: "두 번째 단계입니다. 이전 단계로 돌아가거나 완료할 수 있습니다.",
            children: (
              <View style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, marginTop: 8 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  이것은 children으로 추가된 커스텀 컨텐츠입니다.
                </Text>
              </View>
            ),
            button1Label: "이전",
            button1Action: (_, goToPrevStep) => {
              goToPrevStep();
            },
            button2Label: "완료",
            button2Action: async (_, __, closeDialog) => {
              Alert.alert('완료', '모든 단계가 완료되었습니다!');
              closeDialog();
            },
          },
        ]}
        onClose={() => setShowMultiStepDialog(false)}
      />
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

  testButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -25 }],
    flexDirection: 'row',
    gap: 12,
    zIndex: 100,
  },
  testButton: {
    backgroundColor: '#343a5a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonSecondary: {
    backgroundColor: '#ffdc04',
  },
  testButtonText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});

