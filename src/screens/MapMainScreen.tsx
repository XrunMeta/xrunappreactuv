import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_326be8,
  v_03e392,
  v_700696,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import v_2b5678, { v_65a8f9, v_b4043e } from 'voblsepvtvpzyatxk';
import * as v_8a44cb from 'zryrlwvgokjhz';
import { v_f4e704 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_cc3e1f } from './CameraMainScreen';

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

export const MapMainScreen: v_a3453e.FC = () => {
  const [v_a55f0b, v_0326b2] = v_5ab095<LocationData | null>(null);
  const [v_976e82, v_a7e4fc] = v_5ab095<string | null>(null);
  const [v_ac1d22, v_02dd63] = v_5ab095<'Map' | 'Camera'>('Map');
  const [v_434ce4, v_ed2516] = v_5ab095({
    latitude: 37.5665, 
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
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
        v_a7e4fc('위치를 가져오는 중 오류가 발생했습니다.');
        console.error('Location error:', v_5e9bfe);
      }
    })();
  }, []);

  const v_6a213b = (v_6e55b1) => {
    console.log('Navigation item pressed:', v_6e55b1);

  };

  const v_42b5ed = (v_11083e) => {
    v_02dd63(v_11083e);
    console.log('Tab changed to:', v_11083e);
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
        <View style={v_d81136.mapPinButton}>
          <View style={v_d81136.mapPinIcon} />
        </View>
      </View>

      {}
      <BottomNavigationBar
        items={v_fce460}
        activeItemId="map"
        activeTab={v_ac1d22}
        onItemPress={v_6a213b}
        onTabChange={v_42b5ed}
      />
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
    backgroundColor: 'transparent',

  },
});

