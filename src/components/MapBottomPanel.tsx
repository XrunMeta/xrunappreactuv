import v_a3453e, { v_c4deb2, v_e662ae } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_cf9c33,
  v_09d0e5,
  v_a2349e,
  v_cdbae1,
  v_472849,
  v_326be8,
} from 'rcmrninabrnb';
import { v_f71847 } from '../types';

let v_622407 = null;
let v_8c4b15 = null;

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

interface MapBottomPanelProps {
  visible: boolean;
  spotData: v_f71847 | null;
  deviceHeading: number | null; 
  onClose: () => void;
}

export const MapBottomPanel: v_a3453e.FC<MapBottomPanelProps> = ({
  visible: v_cf55be,
  spotData: v_1d0937,
  deviceHeading: v_4b9594,
  onClose: v_0890f8,
}) => {

  const v_8f79f8 = v_e662ae(new v_a2349e.Value(20)).current;

  v_c4deb2(() => {
    if (v_cf55be) {
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
  }, [v_cf55be, v_8f79f8]);

  if (!v_1d0937) {
    return null;
  }

  return (
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
            if (v_cf55be) {
              console.log('📱 하단 패널 배경 터치 - 패널 닫기');
              v_0890f8();
            }
          }}
          style={[
            v_d81136.bottomPanel,
            {
              minHeight: v_cf55be ? 100 : 35,
            },
          ]}>
          {}
          {v_cf55be && (
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
          {v_cf55be && (
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
                {v_622407 && (() => {

                  let v_e70ec4 = v_1d0937.direction || 0;
                  if (v_4b9594 !== null && v_4b9594 !== undefined) {
                    v_e70ec4 = (v_1d0937.direction || 0) - v_4b9594;

                    while (v_e70ec4 > 180) v_e70ec4 -= 360;
                    while (v_e70ec4 < -180) v_e70ec4 += 360;
                  }

                  return (
                    <View
                      style={{
                        width: 33,
                        height: 33,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        transform: [{ rotate: `${v_e70ec4}deg` }],
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
                  );
                })()}

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
                    {v_1d0937.distance.toFixed(2)}m
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      fontSize: 12,
                      color: '#4c4e55',
                      lineHeight: 15,
                      letterSpacing: 0.06,
                    }}>
                    XRun으로 리워드를 획득하세요
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
                  v_0890f8();
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
  );
};

const v_d81136 = v_472849.create({
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

