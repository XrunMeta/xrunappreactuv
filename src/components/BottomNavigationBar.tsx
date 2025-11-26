import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { COLORS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { getIosWalletShowStatus } from '../services';

const { width } = Dimensions.get('window');

const TEST_PLATFORM_OS: 'ios' | 'android' | null = null ; 

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
  const { navigate } = useAppNavigation();

  const currentPlatformOS = TEST_PLATFORM_OS || Platform.OS;
  const [showWallet, setShowWallet] = useState(currentPlatformOS === 'android');

  useEffect(() => {
    const abortController = new AbortController();

    const getShowWalletStatus = async () => {
      console.log('[BottomNavigationBar] 현재 플랫폼 OS:', currentPlatformOS, '(실제 Platform.OS:', Platform.OS, ')');

      if (currentPlatformOS === 'ios') {
        try {
          console.log('[BottomNavigationBar] iOS 지갑 표시 상태 확인 시작');
          const iosOnWallet = await getIosWalletShowStatus(navigate);
          console.log('[BottomNavigationBar] iOS 지갑 표시 상태 확인 결과:', {
            iosOnWallet,
            showWallet: iosOnWallet,
            timestamp: new Date().toISOString(),
          });
          setShowWallet(iosOnWallet);
        } catch (error) {
          console.error('[BottomNavigationBar] 지갑 표시 상태 가져오기 오류:', error);
          setShowWallet(false);
        }
      } else {
        setShowWallet(true); 
        console.log('[BottomNavigationBar] Android 플랫폼 - 지갑 항상 표시');
      }
    };

    getShowWalletStatus();

    const interval = setInterval(() => {
      getShowWalletStatus();
    }, 30000); 

    return () => {
      clearInterval(interval);
      abortController.abort();
    };
  }, [navigate]);

  const processedItems = items.map(item => {
    if (item.id === 'wallet') {

      let iconXrunBlack: any = null;
      try {
        iconXrunBlack = require('../../assets/images/icon_xrun_black.png');
      } catch (e) {
        console.warn('icon_xrun_black.png not found');
      }

      return {
        ...item,
        label: showWallet 
          ? item.label 
          : 'XRUN',
        icon: showWallet
          ? item.icon
          : iconXrunBlack,
      };
    }
    return item;
  });

  const handleItemPress = (itemId: string) => {
    if (itemId === 'wallet') {
      if (currentPlatformOS === 'android') {
        navigate(ROUTES.wallet);
      } else if (currentPlatformOS === 'ios' && showWallet) {
        navigate(ROUTES.wallet);
      } else {

        navigate(ROUTES.xrunInfo);
      }
      return;
    }

    onItemPress?.(itemId);
  };

  const getItemPadding = () => {
    const basePadding = width * 0.04; 
    const minPadding = 8;
    const maxPadding = 20;
    return Math.max(minPadding, Math.min(maxPadding, basePadding));
  };

  const itemPadding = getItemPadding();

  const renderCenterItem = () => {

    return (
      <View
        style={styles.centerButtonContainer}>
        {}
        <TouchableOpacity
          style={[
            styles.centerButton,
            activeTab === 'Map' && styles.centerButtonActive,
          ]}
          onPress={() => onTabChange?.('Map')}
          activeOpacity={0.7}>
          {iconMap && iconMapWhite ? (
            <Image
              source={activeTab === 'Map' ? iconMap : iconMapWhite}
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
          {iconCamera && iconCameraWhite ? (
            <Image
              source={activeTab === 'Camera' ? iconCamera : iconCameraWhite}
              resizeMode="contain"
              style={styles.centerIcon}
            />
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderRegularItem = (item: BottomNavItem) => {
    if (item.id === 'map' || item.id === 'camera') {
      return null;
    }

    const isActive = activeItemId === item.id;

    const iconSource = item.icon;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.navItem}
        onPress={() => handleItemPress(item.id)}
        activeOpacity={0.7}>
        <View style={styles.iconContainer}>
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
          style={[styles.label, isActive && styles.labelActive]}
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
        <View style={styles.content}>
          {processedItems.map((item, index) => {
            if (item.id === 'map' || item.id === 'camera') {

              return <React.Fragment key="center-buttons">{renderCenterItem()}</React.Fragment>;
            }
            return renderRegularItem(item);
          })}
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
    minHeight: 104,
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 60,
    paddingVertical: 5,
    flexShrink: 0,
    paddingHorizontal: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 12,
    fontWeight: '700',
    color: '#4C4E55',
    textAlign: 'center',
    letterSpacing: 0.06,
    maxWidth: '100%',
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
    width: 100,
    marginHorizontal: -5,
    alignSelf: 'center',
    flexShrink: 0,
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

