import v_a3453e, { v_c4deb2 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_700696,
  v_cf9c33,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_78ceb7, v_d4f1cc } from 'mbgbsytfgyr';
import { v_f4e704 } from '../components';

const { width: v_8e4fb6, height: v_c86e33 } = v_700696.get('window');

let v_8daafe = null;
let v_e96568 = null;
let v_79011b = null;
let v_b636c9 = null;
let v_16772f = null;

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
  v_16772f = require('../../assets/images/icon_mapPoint.png');
} catch (v_9e86fd) {
  console.warn('icon_mapPoint.png not found');
}

interface CameraMainScreenProps {
  activeTab?: 'Map' | 'Camera';
  onTabChange?: (tab: 'Map' | 'Camera') => void;
}

export const CameraMainScreen: v_a3453e.FC<CameraMainScreenProps> = ({
  activeTab: v_ac1d22 = 'Camera',
  onTabChange: v_d52709,
}) => {
  const [v_d1a6bb, v_1e66f0] = v_d4f1cc();

  v_c4deb2(() => {
    if (v_d1a6bb && !v_d1a6bb.granted) {
      v_1e66f0();
    }
  }, [v_d1a6bb]);

  const v_6a213b = (v_6e55b1) => {
    console.log('Navigation item pressed:', v_6e55b1);

  };

  const v_42b5ed = (v_11083e) => {
    v_d52709?.(v_11083e);
  };

  const v_fce460 = [
    { id: 'wallet', label: 'Wallet', icon: v_8daafe },
    { id: 'shop', label: 'Shop', icon: v_e96568 },
    { id: 'map', label: '' }, 
    { id: 'referral', label: 'Referral', icon: v_79011b },
    { id: 'info', label: 'Info', icon: v_b636c9 },
  ];

  if (!v_d1a6bb) {

    return (
      <View style={v_d81136.container}>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!v_d1a6bb.granted) {

    return (
      <View style={v_d81136.container}>
        <StatusBar style="light" />
        <View style={v_d81136.permissionContainer}>
          {}
        </View>
      </View>
    );
  }

  return (
    <View style={v_d81136.container}>
      <StatusBar style="light" />

      {}
      <View style={v_d81136.statusBar}>
        <View style={v_d81136.statusBarContent}>
          <View style={v_d81136.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}
      <View style={v_d81136.cameraContainer}>
        <CameraView
          style={v_d81136.camera}
          facing="back"
        >
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
        </CameraView>
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
});

