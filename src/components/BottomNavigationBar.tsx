import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { getIosWalletShowStatus, getAndroidWalletShowStatus } from '../services';

let iconMap: any = null;
let iconMapWhite: any = null;
let iconCamera: any = null;
let iconCameraWhite: any = null;

try {
  iconMap = require('../../assets/images/icon_map.png');
} catch (e) {
  console.warn('icon_map.png not found');
}

try {
  iconMapWhite = require('../../assets/images/icon_map_white.png');
} catch (e) {
  console.warn('icon_map_white.png not found');
}

try {
  iconCamera = require('../../assets/images/icon_camera.png');
} catch (e) {
  console.warn('icon_camera.png not found');
}

try {
  iconCameraWhite = require('../../assets/images/icon_camera_white.png');
} catch (e) {
  console.warn('icon_camera_white.png not found');
}

interface BottomNavItem {
  id: string;
  label: string;
  icon?: any;
  isActive?: boolean;
  onPress?: () => void;
}

interface BottomNavigationBarProps {
  items: BottomNavItem[];
  activeItemId?: string;
  activeTab?: 'Map' | 'Camera';
  onItemPress?: (itemId: string) => void;
  onTabChange?: (tab: 'Map' | 'Camera') => void;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  items,
  activeItemId,
  activeTab = 'Map',
  onItemPress,
  onTabChange,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { navigate } = useAppNavigation();

  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (Platform.OS === 'ios') {
          const iosOnWallet = await getIosWalletShowStatus(navigate);
          setShowWallet(iosOnWallet);
        } else {
          const androidOnWallet = await getAndroidWalletShowStatus(navigate);
          setShowWallet(androidOnWallet);
        }
      } catch (error) {
        console.error('[BottomNavigationBar] 지갑 표시 상태 오류:', error);
        setShowWallet(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  let iconXrunBlack: any = null;
  try {
    iconXrunBlack = require('../../assets/images/icon_xrun_black.png');
  } catch (_) {}
  const processedItems = items.map(item => {
    if (item.id === 'wallet') {
      return {
        ...item,
        label: showWallet ? item.label : 'XRUN',
        icon: showWallet ? item.icon : iconXrunBlack,
      };
    }
    return item;
  });

  const handleItemPress = (itemId: string) => {
    if (itemId === 'wallet') {
      if (showWallet) {
        navigate(ROUTES.wallet);
      } else {
        navigate(ROUTES.xrunInfo);
      }
      return;
    }
    onItemPress?.(itemId);
  };

  const centerButtonWidth = windowWidth < 360 ? 92 : windowWidth < 400 ? 98 : 104;

  const baseHorizontalPad = windowWidth < 360 ? 4 : windowWidth < 400 ? 6 : 4;

  const padLeft = Math.max(baseHorizontalPad, insets.left);
  const padRight = Math.max(baseHorizontalPad, insets.right);

  const itemById = (id: string) => processedItems.find((i) => i.id === id);

  const rowInnerWidth = windowWidth - padLeft - padRight;

  const centerShadowBleed = Platform.OS === 'ios' ? 14 : 10;
  const centerSlotWidth = centerButtonWidth + centerShadowBleed;
  const tabColumnWidth = Math.max(40, (rowInnerWidth - centerSlotWidth) / 4);

  const mapIconSource = activeTab === 'Map'
    ? (iconMap || iconMapWhite)
    : (iconMapWhite || iconMap);

  const cameraIconSource = activeTab === 'Camera'
    ? (iconCamera || iconCameraWhite)
    : (iconCameraWhite || iconCamera);

  const renderCenterItem = () => {
    return (
      <>
        {}
        <TouchableOpacity
          style={[
            styles.centerButton,
            activeTab === 'Map' && styles.centerButtonActive,
          ]}
          onPress={() => onTabChange?.('Map')}
          activeOpacity={0.7}>
          {mapIconSource ? (
            <Image
              source={mapIconSource}
              resizeMode="contain"
              style={styles.centerIcon}
            />
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </TouchableOpacity>

        {}
        <TouchableOpacity
          style={[
            styles.centerButton,
            activeTab === 'Camera' && styles.centerButtonActive,
          ]}
          onPress={() => onTabChange?.('Camera')}
          activeOpacity={0.7}>
          {cameraIconSource ? (
            <Image
              source={cameraIconSource}
              resizeMode="contain"
              style={styles.centerIcon}
            />
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </TouchableOpacity>
      </>
    );
  };

  const renderRegularItem = (item: BottomNavItem) => {
    if (item.id === 'map' || item.id === 'camera') {
      return null;
    }

    const isActive = activeItemId === item.id;
    const iconSource = item.icon;
    const isXplay = item.id === 'xplay';

    return (
      <TouchableOpacity
        style={[styles.navItem, isXplay && styles.navItemXplayNudge]}
        onPress={() => handleItemPress(item.id)}
        activeOpacity={0.7}>
        <View style={[styles.iconContainer, isXplay && styles.iconContainerXplayNudge]}>
          {iconSource ? (
            <Image
              source={iconSource}
              resizeMode="contain"
              style={styles.navIcon}
            />
          ) : (
            <View style={[styles.iconPlaceholder, isActive && styles.iconPlaceholderActive]} />
          )}
        </View>
        <Text
          style={[
            styles.label,
            isActive && styles.labelActive,
            {
              fontSize: windowWidth < 360 ? 11 : 13,
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.bottomSection}>
        <View
          style={[
            styles.content,
            {
              paddingLeft: padLeft,
              paddingRight: padRight,
            },
          ]}>
          <View style={styles.navRowInner}>
            {(['xplay', 'shop'] as const).map((id) => {
              const item = itemById(id);
              return item ? (
                <View key={id} style={[styles.navColumn, { width: tabColumnWidth }]}>
                  {renderRegularItem(item)}
                </View>
              ) : null;
            })}
            <View style={[styles.navColumnCenter, { width: centerSlotWidth }]}>
              <View style={[styles.centerButtonContainer, { width: centerButtonWidth }]}>
                {renderCenterItem()}
              </View>
            </View>
            {(['wallet', 'info'] as const).map((id) => {
              const item = itemById(id);
              return item ? (
                <View key={id} style={[styles.navColumn, { width: tabColumnWidth }]}>
                  {renderRegularItem(item)}
                </View>
              ) : null;
            })}
          </View>
        </View>
      </View>
      {}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 18,
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'visible',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 20,
    minHeight: 80,
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'visible',
  },
  navRowInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    overflow: 'visible',
  },
  navColumn: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  navColumnCenter: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  navItem: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
  },

  navItemXplayNudge: {
    paddingVertical: 4,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconContainerXplayNudge: {
    marginBottom: 3,
  },
  navIcon: {
    width: 20,
    height: 20,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4C4E55',
  },
  iconPlaceholderActive: {
    borderColor: COLORS.buttonPrimary,
  },
  label: {
    fontSize: FONTS.size.small,
    fontWeight: '500',
    color: '#4C4E55',
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
    letterSpacing: 0.06,
    overflow: 'hidden',
  },
  labelActive: {
    color: COLORS.buttonPrimary,
  },
  centerButtonContainer: {
    flexDirection: 'row',
    backgroundColor: '#343a59',
    borderRadius: 50,
    height: 50,
    alignSelf: 'center',
    flexShrink: 1,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  centerButtonActive: {
    backgroundColor: '#ffdc04',
    borderRadius: 50,
  },
  centerIcon: {
    width: 20,
    height: 20,
  },
  homeIndicator: {
    height: 18,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
    backgroundColor: '#FFFFFF',
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: COLORS.headerText,
  },
});

