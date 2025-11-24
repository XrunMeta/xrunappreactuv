import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_326be8,
  v_03e392,
  v_700696,
  v_19b633,
  v_cf9c33,
  v_6b5698,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import v_2b5678, { v_65a8f9, v_12e0dc, v_b4043e } from 'voblsepvtvpzyatxk';
import * as v_8a44cb from 'zryrlwvgokjhz';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_f4e704, v_a77ce6 } from '../components';
import { v_cc3e1f } from './CameraMainScreen';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_f71847 } from '../types';
import { v_f84ef5 } from '../services';

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

let v_16772f = null;

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

  const [v_572bd3, v_6a4dcd] = v_5ab095(false);
  const [v_27aea1, v_22f943] = v_5ab095<v_f71847 | null>(null);

  const [v_b4d4c5, v_14dd24] = v_5ab095<v_f71847[]>([]);
  const [v_818f4d, v_e1bb1a] = v_5ab095(false);

  let v_be97ff = null;
  try {
    v_be97ff = require('../../assets/images/icon_xrun_black.png');
  } catch (v_9e86fd) {
    console.warn('icon_xrun_black.png not found');
  }

  v_c4deb2(() => {
    let v_fd434d = null;

    const v_169317 = async () => {

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

        await v_e84827.setItem('selfCoordinate', JSON.stringify(v_4a8217));

        const v_ef7306 = await v_e84827.getItem('userData');
        if (v_ef7306) {
          try {
            const v_ff39bc = JSON.parse(v_ef7306);
            const v_660822 = v_ff39bc?.member;
            if (v_660822) {
              v_e1bb1a(true);
              console.log('=== 맵 마커 데이터 가져오기 시작 ===');
              const v_003147 = await v_f84ef5(
                v_4a8217.latitude,
                v_4a8217.longitude,
                v_660822,
                v_9b57fc,
              );
              console.log('=== 맵 마커 데이터 가져오기 완료 ===');
              console.log('마커 개수:', v_003147.length);
              v_14dd24(v_003147);
              v_e1bb1a(false);
            } else {
              console.log('userData에 member가 없습니다.');
            }
          } catch (v_5f9add) {
            console.error('userData 파싱 오류:', v_5f9add);
          }
        } else {
          console.log('userData가 없습니다. 로그인이 필요할 수 있습니다.');
        }
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
    };

    v_169317();

    const v_269481 = v_6b5698.addEventListener('change', (v_3b10d8) => {
      if (v_3b10d8 === 'active') {

        v_169317();
      }
    });

    return () => {
      v_269481?.remove();
    };
  }, [v_9b57fc]);

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

  const v_fc58d0 = (spot: v_f71847) => {
    v_22f943(v_c5ac8b);
    if (!v_572bd3) {
      v_6a4dcd(true);
    }
  };

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
            {}
            {v_b4d4c5
              .filter((v_5e3dbb) => v_5e3dbb.latitude && v_5e3dbb.longitude) 
              .map((v_5e3dbb) => (
              <Marker
                key={v_5e3dbb.spotID}
                coordinate={{
                  latitude: v_5e3dbb.latitude!,
                  longitude: v_5e3dbb.longitude!,
                }}
                onPress={() => v_fc58d0(v_5e3dbb)}
              >
                {}
                <Callout tooltip>
                  <View style={v_d81136.calloutContainer}>
                    <View style={v_d81136.calloutLeft}>
                      {}
                      {v_5e3dbb.iconurl ? (
                        <Image
                          source={{ uri: v_5e3dbb.iconurl }}
                          style={v_d81136.calloutImage}
                          resizeMode="contain"
                        />
                      ) : (
                        v_be97ff && (
                          <Image
                            source={v_be97ff}
                            style={v_d81136.calloutImage}
                            resizeMode="contain"
                          />
                        )
                      )}
                      {}
                      <Text style={v_d81136.calloutDistance}>
                        {v_5e3dbb.distance.toFixed(2)}m
                      </Text>
                    </View>
                    <View style={v_d81136.calloutRight}>
                      <Text style={v_d81136.calloutBrand}>
                        {v_5e3dbb.brand || v_5e3dbb.name} available
                      </Text>
                      <Text style={v_d81136.calloutCoins}>
                        {v_5e3dbb.coins || '0'} {v_5e3dbb.brand || ''}
                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
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
      <MapBottomPanel
        visible={v_572bd3}
        spotData={v_27aea1}
        onClose={() => {
          v_6a4dcd(false);
          v_22f943(null);
        }}
      />

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
    marginBottom: v_326be8.OS === 'ios' ? -14 : 0,
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

