import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BottomNavigationBar } from '../components';
import { TokenData } from '../types';

const { width, height } = Dimensions.get('window');

interface TokenComponentProps {
  token: TokenData;
  onPress: () => void;
}

const TokenComponent: React.FC<TokenComponentProps> = ({ token, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, []);

  const distance = token.distance || 0;
  const decorationHeight = Math.max(40, Math.min(200, distance * 4 + 40));

  return (
    <Animated.View
      style={[
        styles.tokenSpot,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: token.x },
            { translateY: token.y },
          ],
        },
      ]}>
      {}
      <View
        style={{
          position: 'absolute',
          bottom: -decorationHeight + 47,
          left: '50%',
          marginLeft: -0.5,
          width: 2,
          height: decorationHeight,
          backgroundColor: 'white',
          opacity: 0.8,
          zIndex: -1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -decorationHeight + 47,
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
        onPress={onPress}
        style={styles.tokenButtonContainer}
        activeOpacity={0.7}>
        <View style={styles.tokenButton}>
          {iconXrunWhite && (
            <Image
              source={iconXrunWhite}
              style={[styles.tokenIcon, { marginTop: 3 }]}
            />
          )}
          <View style={{ alignItems: 'center', marginTop: -4 }}>
            <Text style={styles.tokenPriceText}>
              {token?.xrunPrice ? parseFloat(String(token.xrunPrice)).toFixed(2) : '0.00'}
            </Text>
            <Text style={styles.tokenDistanceText}>
              {token?.distance ? parseFloat(String(token.distance)).toFixed(1) + 'm' : '0.0m'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

let iconWallet: any = null;
let iconShop: any = null;
let iconReferral: any = null;
let iconUser: any = null;
let iconMapPoint: any = null;

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
  iconMapPoint = require('../../assets/images/icon_mapPoint.png');
} catch (e) {
  console.warn('icon_mapPoint.png not found');
}

let iconXrunWhite: any = null;
let iconBottom: any = null;

try {
  iconXrunWhite = require('../../assets/images/icon_xrun_white.png');
} catch (e) {
  console.warn('icon_xrun_white.png not found');
}

try {
  iconBottom = require('../../assets/images/icon_bottom.png');
} catch (e) {
  console.warn('icon_bottom.png not found');
}

interface CameraMainScreenProps {
  activeTab?: 'Map' | 'Camera';
  onTabChange?: (tab: 'Map' | 'Camera') => void;
}

export const CameraMainScreen: React.FC<CameraMainScreenProps> = ({
  activeTab = 'Camera',
  onTabChange,
}) => {
  const [permission, requestPermission] = useCameraPermissions();

  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);

  const bottomPanelBottom = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleNavItemPress = (itemId: string) => {
    console.log('Navigation item pressed:', itemId);

  };

  const handleTabChange = (tab: 'Map' | 'Camera') => {
    onTabChange?.(tab);
  };

  const handleToggleBottomPanel = () => {
    if (showBottomPanel) {

      setShowBottomPanel(false);
    } else {

      if (!selectedToken) {
        console.log('selectedToken이 없어서 하단 패널을 열 수 없습니다.');
        return;
      }
      setShowBottomPanel(true);
    }
  };

  useEffect(() => {
    if (showBottomPanel) {
      Animated.timing(bottomPanelBottom, {
        toValue: 90, 
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

  const handleTokenClick = (token: TokenData) => {
    setSelectedToken(token);
    if (!showBottomPanel) {
      setShowBottomPanel(true);
    }
  };

  const initialTokens: TokenData[] = [
    { spotID: 1, x: 0, y: 0, xrunPrice: 0.00, distance: 0.0, name: 'XRUN coin' },
    { spotID: 2, x: -100, y: -50, xrunPrice: 0.00, distance: 0.0, name: 'XRUN coin' },
    { spotID: 3, x: 100, y: -50, xrunPrice: 0.00, distance: 0.0, name: 'XRUN coin' },
    { spotID: 4, x: -50, y: 100, xrunPrice: 0.00, distance: 0.0, name: 'XRUN coin' },
  ];

  const bottomNavItems = [
    { id: 'wallet', label: 'Wallet', icon: iconWallet },
    { id: 'shop', label: 'Shop', icon: iconShop },
    { id: 'map', label: '' }, 
    { id: 'referral', label: 'Referral', icon: iconReferral },
    { id: 'info', label: 'Info', icon: iconUser },
  ];

  if (!permission) {

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!permission.granted) {

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.permissionContainer}>
          {}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {}
      <View style={styles.statusBar}>
        <View style={styles.statusBarContent}>
          <View style={styles.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
        >
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
        </CameraView>

        {}
        {

}
        <View style={[styles.tokenContainer, { bottom: showBottomPanel && selectedToken ? 200 : 110 }]}>
          {initialTokens.map((token) => (
            <TokenComponent
              key={token.spotID}
              token={token}
              onPress={() => handleTokenClick(token)}
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
                bottom: bottomPanelBottom, 
                left: 0,
                right: 0,
                zIndex: 1,
              },
            ]}>
            <Pressable
              onPress={() => {
                if (showBottomPanel) {
                  console.log('📱 하단 패널 배경 터치 - 패널 닫기');
                  setShowBottomPanel(false);
                }
              }}
              style={{
                backgroundColor: showBottomPanel && selectedToken ? '#EFF4F5' : '#adadad',
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderTopStartRadius: 30,
                borderTopEndRadius: 30,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: showBottomPanel && selectedToken ? 150 : 35,
                paddingBottom: showBottomPanel && selectedToken ? 40 : 15,
                zIndex: 1,
                position: 'relative',
              }}>
              {}
              {showBottomPanel && selectedToken && (
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
                  {!selectedToken?.iconurl ||
                  selectedToken?.iconurl.toString().trim() === '' ||
                  typeof selectedToken?.iconurl !== 'string' ? (
                    iconXrunWhite && (
                      <Image
                        source={iconXrunWhite}
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
                      source={{ uri: selectedToken?.iconurl }}
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
                      {!selectedToken?.name ||
                      selectedToken?.name.toString().trim() === ''
                        ? 'XRUN coin'
                        : selectedToken?.name}
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
                      {!selectedToken?.joindesc ||
                      selectedToken?.joindesc.toString().trim() === ''
                        ? 'XRUN coin'
                        : selectedToken?.joindesc}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 12,
                        color: '#666',
                        marginTop: 5,
                      }}>
                      {(selectedToken?.xrunPrice || 0).toFixed(2)} {selectedToken?.brand || ''}
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

