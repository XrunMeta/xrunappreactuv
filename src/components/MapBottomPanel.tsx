import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
  Platform,
} from 'react-native';
import { SpotData } from '../types';
import { FONTS } from '../constants';

let iconArrow: any = null;
let iconXrunLogo: any = null;

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

interface MapBottomPanelProps {
  visible: boolean;
  spotData: SpotData | null;
  deviceHeading: number | null; 
  onClose: () => void;
  onExpand?: () => void; 
}

export const MapBottomPanel: React.FC<MapBottomPanelProps> = ({
  visible,
  spotData,
  deviceHeading,
  onClose,
  onExpand,
}) => {

  const [iconLoadError, setIconLoadError] = React.useState(false);

  React.useEffect(() => {
    setIconLoadError(false);
  }, [spotData?.iconurl]);

  const bottomPanelBottom = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(bottomPanelBottom, {
        toValue: 110, 
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, 
      }).start();
    } else {
      Animated.timing(bottomPanelBottom, {
        toValue: 100, 
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, 
      }).start();
    }
  }, [visible, bottomPanelBottom]);

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
            bottom: bottomPanelBottom, 
            left: 0,
            right: 0,
            zIndex: 1,
            pointerEvents: 'auto', 
          },
        ]}>
        <Pressable
          onPress={() => {
            if (visible) {
              console.log('📱 하단 패널 배경 터치 - 패널 닫기');
              onClose();
            } else if (onExpand && spotData) {
              console.log('📱 하단 패널 클릭 - 패널 확장');
              onExpand();
            }
          }}
          style={[
            styles.bottomPanel,
            {
              minHeight: visible ? 40 : 35,
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
          {spotData && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 20,
                paddingTop: visible ? 0 : 8,
                paddingBottom: visible ? 12 : 8,
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
                {iconArrow && (() => {

                  let arrowRotation = spotData.direction || 0;
                  if (deviceHeading !== null && deviceHeading !== undefined) {
                    arrowRotation = (spotData.direction || 0) - deviceHeading;

                    while (arrowRotation > 180) arrowRotation -= 360;
                    while (arrowRotation < -180) arrowRotation += 360;
                  }

                  return (
                    <View
                      style={{
                        width: 33,
                        height: 33,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        transform: [{ rotate: `${arrowRotation}deg` }],
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
                  );
                })()}

                {}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Medium',
                      fontSize: FONTS.size.medium,
                      color: '#4c4e55',
                      lineHeight: 24,
                      marginBottom: visible ? 4 : 0,
                    }}>
                    {spotData.distance.toFixed(2)}m
                  </Text>
                  {visible && (
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: FONTS.size.small,
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
                {spotData.iconurl && !iconLoadError ? (
                  <Image
                    source={{ uri: spotData.iconurl }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                    onError={() => {
                      console.warn('[MapBottomPanel] 아이콘 이미지 로드 실패:', spotData.iconurl);
                      setIconLoadError(true);
                    }}
                  />
                ) : iconXrunLogo ? (
                  <Image
                    source={iconXrunLogo}
                    style={{
                      width: 44,
                      height: 44,
                    }}
                    resizeMode="contain"
                  />
                ) : null}
              </View>

              {}
              {visible && (
                <Pressable
                  onPress={() => {
                    console.log('📱 하단 패널 닫기 버튼 클릭');
                    onClose();
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
              )}
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
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

