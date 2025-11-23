import v_a3453e, { v_c4deb2, v_5ab095, v_e662ae } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_700696,
  v_cf9c33,
  v_19b633,
  v_4623af,
  v_09d0e5,
  v_a2349e,
  v_cdbae1,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_78ceb7, v_d4f1cc } from 'mbgbsytfgyr';
import { v_f4e704 } from '../components';
import { v_60c7c3 } from '../types';

const { width: v_8e4fb6, height: v_c86e33 } = v_700696.get('window');

interface TokenComponentProps {
  token: v_60c7c3;
  onPress: () => void;
}

const TokenComponent: v_a3453e.FC<TokenComponentProps> = ({ token: v_21cc31, onPress: v_719eed }) => {
  const v_e28e12 = v_e662ae(new v_a2349e.Value(0)).current;

  v_c4deb2(() => {

    v_a2349e.timing(v_e28e12, {
      toValue: 1,
      duration: 200,
      easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, []);

  const v_926d1c = v_21cc31.distance || 0;
  const v_ec1ad7 = Math.max(40, Math.min(200, v_926d1c * 4 + 40));

  return (
    <Animated.View
      style={[
        v_d81136.tokenSpot,
        {
          opacity: v_e28e12,
          transform: [
            { translateX: v_21cc31.x },
            { translateY: v_21cc31.y },
          ],
        },
      ]}>
      {}
      <View
        style={{
          position: 'absolute',
          bottom: -v_ec1ad7 + 47,
          left: '50%',
          marginLeft: -0.5,
          width: 2,
          height: v_ec1ad7,
          backgroundColor: 'white',
          opacity: 0.8,
          zIndex: -1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -v_ec1ad7 + 47,
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
        onPress={v_719eed}
        style={v_d81136.tokenButtonContainer}
        activeOpacity={0.7}>
        <View style={v_d81136.tokenButton}>
          {v_ed24ee && (
            <Image
              source={v_ed24ee}
              style={[v_d81136.tokenIcon, { marginTop: 3 }]}
            />
          )}
          <View style={{ alignItems: 'center', marginTop: -4 }}>
            <Text style={v_d81136.tokenPriceText}>
              {v_21cc31?.xrunPrice ? parseFloat(String(v_21cc31.xrunPrice)).toFixed(2) : '0.00'}
            </Text>
            <Text style={v_d81136.tokenDistanceText}>
              {v_21cc31?.distance ? parseFloat(String(v_21cc31.distance)).toFixed(1) + 'm' : '0.0m'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

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

let v_ed24ee = null;
let v_5be6d0 = null;

try {
  v_ed24ee = require('../../assets/images/icon_xrun_white.png');
} catch (v_9e86fd) {
  console.warn('icon_xrun_white.png not found');
}

try {
  v_5be6d0 = require('../../assets/images/icon_bottom.png');
} catch (v_9e86fd) {
  console.warn('icon_bottom.png not found');
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

  const [v_572bd3, v_6a4dcd] = v_5ab095(false);
  const [v_04cb77, v_96a9ed] = v_5ab095<v_60c7c3 | null>(null);

  const v_8f79f8 = v_e662ae(new v_a2349e.Value(20)).current;

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

  const v_eb5fc7 = () => {
    if (v_572bd3) {

      v_6a4dcd(false);
    } else {

      if (!v_04cb77) {
        console.log('selectedToken이 없어서 하단 패널을 열 수 없습니다.');
        return;
      }
      v_6a4dcd(true);
    }
  };

  v_c4deb2(() => {
    if (v_572bd3) {
      v_a2349e.timing(v_8f79f8, {
        toValue: 90, 
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

  const v_eed806 = (token: v_60c7c3) => {
    v_96a9ed(v_21cc31);
    if (!v_572bd3) {
      v_6a4dcd(true);
    }
  };

  const initialTokens: v_60c7c3[] = [
    { spotID: 1, x: 0, y: 0, xrunPrice: 0.00, distance: 0.0, name: 'XRUN coin' },
    { spotID: 2, x: -100, y: -50, xrunPrice: 0.00, distance: 0.0, name: 'XRUN coin' },
    { spotID: 3, x: 100, y: -50, xrunPrice: 0.00, distance: 0.0, name: 'XRUN coin' },
    { spotID: 4, x: -50, y: 100, xrunPrice: 0.00, distance: 0.0, name: 'XRUN coin' },
  ];

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

        {}
        {

}
        <View style={[v_d81136.tokenContainer, { bottom: v_572bd3 && v_04cb77 ? 200 : 110 }]}>
          {v_3696ca.map((v_21cc31) => (
            <TokenComponent
              key={v_21cc31.spotID}
              token={v_21cc31}
              onPress={() => v_eed806(v_21cc31)}
            />
          ))}
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
          }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: v_8f79f8, 
                left: 0,
                right: 0,
                zIndex: 1,
              },
            ]}>
            <Pressable
              onPress={() => {
                if (v_572bd3) {
                  console.log('📱 하단 패널 배경 터치 - 패널 닫기');
                  v_6a4dcd(false);
                }
              }}
              style={{
                backgroundColor: v_572bd3 && v_04cb77 ? '#EFF4F5' : '#adadad',
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderTopStartRadius: 30,
                borderTopEndRadius: 30,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: v_572bd3 && v_04cb77 ? 150 : 35,
                paddingBottom: v_572bd3 && v_04cb77 ? 40 : 15,
                zIndex: 1,
                position: 'relative',
              }}>
              {}
              {v_572bd3 && v_04cb77 && (
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
                  {!v_04cb77?.iconurl ||
                  v_04cb77?.iconurl.toString().trim() === '' ||
                  typeof v_04cb77?.iconurl !== 'string' ? (
                    v_ed24ee && (
                      <Image
                        source={v_ed24ee}
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
                      source={{ uri: v_04cb77?.iconurl }}
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
                      {!v_04cb77?.name ||
                      v_04cb77?.name.toString().trim() === ''
                        ? 'XRUN coin'
                        : v_04cb77?.name}
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
                      {!v_04cb77?.joindesc ||
                      v_04cb77?.joindesc.toString().trim() === ''
                        ? 'XRUN coin'
                        : v_04cb77?.joindesc}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 12,
                        color: '#666',
                        marginTop: 5,
                      }}>
                      {(v_04cb77?.xrunPrice || 0).toFixed(2)} {v_04cb77?.brand || ''}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {

                      console.log('View ad pressed');
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
});

