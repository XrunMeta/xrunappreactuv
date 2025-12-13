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
import { v_843035 } from '../constants';

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
  onExpand?: () => void; 
}

export const MapBottomPanel: v_a3453e.FC<MapBottomPanelProps> = ({
  visible: v_cf55be,
  spotData: v_1d0937,
  deviceHeading: v_4b9594,
  onClose: v_0890f8,
  onExpand: v_37d7de,
}) => {

  const [v_2aafc0, v_e0cda8] = v_a3453e.useState(false);

  v_a3453e.useEffect(() => {
    v_e0cda8(false);
  }, [v_1d0937?.iconurl]);

  const v_8f79f8 = v_e662ae(new v_a2349e.Value(80)).current;

  v_c4deb2(() => {
    if (v_cf55be) {
      v_a2349e.timing(v_8f79f8, {
        toValue: 110, 
        duration: 600,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, 
      }).start();
    } else {
      v_a2349e.timing(v_8f79f8, {
        toValue: 100, 
        duration: 300,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, 
      }).start();
    }
  }, [v_cf55be, v_8f79f8]);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
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
            } else if (v_37d7de && v_1d0937) {
              console.log('📱 하단 패널 클릭 - 패널 확장');
              v_37d7de();
            }
          }}
          style={[
            v_d81136.bottomPanel,
            {
              minHeight: v_cf55be ? 40 : 35,
            },
          ]}>
          {}

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

          {}
          {v_1d0937 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 20,
                paddingTop: v_cf55be ? 0 : 8,
                paddingBottom: v_cf55be ? 12 : 8,
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
                      fontSize: v_843035.size.medium,
                      color: '#4c4e55',
                      lineHeight: 24,
                      marginBottom: v_cf55be ? 4 : 0,
                    }}>
                    {v_1d0937.distance.toFixed(2)}m
                  </Text>
                  {v_cf55be && (
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: v_843035.size.small,
                        color: '#4c4e55',
                        lineHeight: 15,
                        letterSpacing: 0.06,
                      }}>
                      XRun으로 리워드를 획득하세요
                    </Text>
                  )}
                </View>
              </View>

              {}
              <View
                style={{
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 12,
                }}>
                {v_1d0937.iconurl && !v_2aafc0 ? (
                  <Image
                    source={{ uri: v_1d0937.iconurl }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                    onError={() => {
                      console.warn('[MapBottomPanel] 아이콘 이미지 로드 실패:', v_1d0937.iconurl);
                      v_e0cda8(true);
                    }}
                  />
                ) : v_8c4b15 ? (
                  <Image
                    source={v_8c4b15}
                    style={{
                      width: 44,
                      height: 44,
                    }}
                    resizeMode="contain"
                  />
                ) : null}
              </View>

              {}
              {v_cf55be && (
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
              )}
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
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
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

