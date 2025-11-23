import v_a3453e, { v_5ab095, v_c4deb2, v_e662ae } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_326be8,
  v_03e392,
  v_700696,
  v_19b633,
  v_cf9c33,
  v_09d0e5,
  v_a2349e,
  v_cdbae1,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import v_2b5678, { v_65a8f9, v_b4043e } from 'voblsepvtvpzyatxk';
import * as v_8a44cb from 'zryrlwvgokjhz';
import { v_f4e704 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_cc3e1f } from './CameraMainScreen';
import { v_ce4741, v_a0daa8 } from '../navigation';

const { width: v_8e4fb6, height: v_c86e33 } = v_700696.get('window');

interface LocationData {
  latitude: number;
  longitude: number;
}

let v_8daafe = null;
let v_e96568 = null;
let v_79011b = null;
let v_b636c9 = null;
let v_86146a = null;
let v_800dd2 = null;

try {
  v_8daafe = require('../../assets/images/icon_wallet.png');
} catch (v_9e86fd) {
  console.warn('icon_wallet.png not found');
}

try {
  v_e96568 = require('../../assets/images/icon_shop.png');
} catch (v_9e86fd) {
  console.warn('icon_shop.png not found');
}

try {
  v_79011b = require('../../assets/images/icon_referral.png');
} catch (v_9e86fd) {
  console.warn('icon_referral.png not found');
}

try {
  v_b636c9 = require('../../assets/images/icon_user.png');
} catch (v_9e86fd) {
  console.warn('icon_user.png not found');
}

try {
  v_86146a = require('../../assets/images/icon_advertisement.png');
} catch (v_9e86fd) {
  console.warn('icon_advertisement.png not found');
}

try {
  v_800dd2 = require('../../assets/images/icon_bell.png');
} catch (v_9e86fd) {
  console.warn('icon_bell.png not found');
}

let v_622407 = null;
let v_8c4b15 = null;
let v_16772f = null;

try {
  v_622407 = require('../../assets/images/icon_arrow.png');
} catch (v_9e86fd) {
  console.warn('icon_arrow.png not found');
}

try {
  v_8c4b15 = require('../../assets/images/logoMain_XRUN.png');
} catch (v_9e86fd) {
  console.warn('logoMain_XRUN.png not found');
}

try {
  v_16772f = require('../../assets/images/icon_mapPoint.png');
} catch (v_9e86fd) {
  console.warn('icon_mapPoint.png not found');
}

export const MapMainScreen: v_a3453e.FC = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const [v_a55f0b, v_0326b2] = v_5ab095<LocationData | null>(null);
  const [v_976e82, v_a7e4fc] = v_5ab095<string | null>(null);
  const [v_ac1d22, v_02dd63] = v_5ab095<'Map' | 'Camera'>('Map');
  const [v_434ce4, v_ed2516] = v_5ab095({
    latitude: 37.5665, 
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [v_572bd3, v_6a4dcd] = v_5ab095(true);

  const v_8f79f8 = v_e662ae(new v_a2349e.Value(90)).current; 

  const [v_24cc8e] = v_5ab095({
    distance: 2.53, 
    direction: 45, 
    name: 'Earn rewards with XRUN here',
  });

  v_c4deb2(() => {
    (async () => {

      const { status: v_d308b5 } = await v_8a44cb.requestForegroundPermissionsAsync();
      if (v_d308b5 !== 'granted') {
        v_a7e4fc('위치 권한이 거부되었습니다.');
        v_03e392.alert(
          '위치 권한 필요',
          '지도를 사용하려면 위치 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
        return;
      }

      try {

        const v_7dd198 = await v_8a44cb.getCurrentPositionAsync({
          accuracy: v_8a44cb.Accuracy.High,
        });

        const v_4a8217 = {
          latitude: v_7dd198.coords.latitude,
          longitude: v_7dd198.coords.longitude,
        };

        v_0326b2(v_4a8217);
        v_ed2516({
          latitude: v_4a8217.latitude,
          longitude: v_4a8217.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (v_5e9bfe) {
        const v_1744b9 = v_5e9bfe instanceof Error ? v_5e9bfe.message : '알 수 없는 오류';
        v_a7e4fc('위치를 가져오는 중 오류가 발생했습니다.');
        console.error('Location error:', v_5e9bfe);

        if (v_1744b9.includes('location services') || v_1744b9.includes('unavailable')) {
          v_03e392.alert(
            '위치 서비스 오류',
            '위치 정보를 가져올 수 없습니다.\n\n다음 사항을 확인해주세요:\n• 기기의 위치 서비스(GPS)가 켜져 있는지\n• 네트워크 위치 서비스가 활성화되어 있는지\n• 실내에서는 GPS 신호가 약할 수 있습니다.',
            [
              { text: '기본 위치 사용', onPress: () => {

                const v_3a1065 = {
                  latitude: 37.5665,
                  longitude: 126.9780,
                };
                v_0326b2(v_3a1065);
                v_ed2516({
                  latitude: v_3a1065.latitude,
                  longitude: v_3a1065.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }},
              { text: '확인', style: 'cancel' }
            ]
          );
        } else {

          const v_3a1065 = {
            latitude: 37.5665,
            longitude: 126.9780,
          };
          v_0326b2(v_3a1065);
          v_ed2516({
            latitude: v_3a1065.latitude,
            longitude: v_3a1065.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    })();
  }, []);

  const v_6a213b = (v_6e55b1) => {
    console.log('Navigation item pressed:', v_6e55b1);
    switch (v_6e55b1) {
      case 'wallet':
        v_9b57fc(v_ce4741.wallet);
        break;
      case 'shop':
        v_9b57fc(v_ce4741.shopTicket);
        break;
      case 'referral':
        v_9b57fc(v_ce4741.referralMyGroup);
        break;
      case 'info':
        v_9b57fc(v_ce4741.myInfo);
        break;
      case 'map':

        break;
      default:
        console.log('Unknown navigation item:', v_6e55b1);
    }
  };

  const v_42b5ed = (v_11083e) => {
    v_02dd63(v_11083e);
    console.log('Tab changed to:', v_11083e);
  };

  v_c4deb2(() => {
    if (v_572bd3) {
      v_a2349e.timing(v_8f79f8, {
        toValue: 80, 
        duration: 300,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, 
      }).start();
    } else {
      v_a2349e.timing(v_8f79f8, {
        toValue: 20, 
        duration: 300,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, 
      }).start();
    }
  }, [v_572bd3]);

  const v_fce460 = [
    { id: 'wallet', label: 'Wallet', icon: v_8daafe },
    { id: 'shop', label: 'Shop', icon: v_e96568 },
    { id: 'map', label: '' }, 
    { id: 'referral', label: 'Referral', icon: v_79011b },
    { id: 'info', label: 'Info', icon: v_b636c9 },
  ];

  if (v_ac1d22 === 'Camera') {
    return (
      <CameraMainScreen
        activeTab={v_ac1d22}
        onTabChange={v_42b5ed}
      />
    );
  }

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />

      {}
      <View style={v_d81136.statusBar}>
        <View style={v_d81136.statusBarContent}>
          <View style={v_d81136.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}
      <View style={v_d81136.mapContainer}>
        {v_a55f0b ? (
          <MapView
            provider={v_b4043e}
            style={v_d81136.map}
            region={v_434ce4}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChangeComplete={v_ed2516}
          >
            <Marker
              coordinate={{
                latitude: v_a55f0b.latitude,
                longitude: v_a55f0b.longitude,
              }}
              title="현재 위치"
            />
          </MapView>
        ) : (
          <View style={v_d81136.mapPlaceholder}>
            {}
          </View>
        )}

        {}
        {v_16772f && (
          <View style={v_d81136.mapPinButton}>
            <Image
              source={v_16772f}
              style={v_d81136.mapPinIcon}
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
              bottom: v_8f79f8, 
              left: 0,
              right: 0,
              zIndex: 1,
              pointerEvents: 'auto', 
            },
          ]}>
          <Pressable
            onPress={() => {
              if (v_572bd3) {
                console.log('📱 하단 패널 배경 터치 - 패널 닫기');
                v_6a4dcd(false);
              }
            }}
            style={[
              v_d81136.bottomPanel,
              {
                minHeight: v_572bd3 ? 100 : 35,
              },
            ]}>
            {}
            {v_572bd3 && (
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
            {v_572bd3 && (
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
                  {v_622407 && (
                    <View
                      style={{
                        width: 33,
                        height: 33,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        transform: [{ rotate: `${v_24cc8e.direction}deg` }],
                      }}>
                      <Image
                        source={v_622407}
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
                      {v_24cc8e.distance.toFixed(2)}m
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 12,
                        color: '#4c4e55',
                        lineHeight: 15,
                        letterSpacing: 0.06,
                      }}>
                      {v_24cc8e.name}
                    </Text>
                  </View>
                </View>

                {}
                {v_8c4b15 && (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 12,
                    }}>
                    <Image
                      source={v_8c4b15}
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
                    v_6a4dcd(false);
                  }}
                  style={{
                    width: 14,
                    height: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                  }}>
                  {v_622407 && (
                    <View
                      style={{
                        transform: [{ rotate: '270deg' }],
                      }}>
                      <Image
                        source={v_622407}
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
          items={v_fce460}
          activeItemId="map"
          activeTab={v_ac1d22}
          onItemPress={v_6a213b}
          onTabChange={v_42b5ed}
        />
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
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

