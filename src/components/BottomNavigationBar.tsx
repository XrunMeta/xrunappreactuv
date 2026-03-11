import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { COLORS, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';

const { width } = Dimensions.get('window');

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

  const handleItemPress = (itemId: string) => {
    if (itemId === 'wallet') {
      navigate(ROUTES.wallet);
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

  const getHorizontalPadding = () => {
    if (width < 360) {

      return 4;
    } else if (width < 400) {

      return 8;
    } else {

      return 10;
    }
  };

  const getCenterButtonWidth = () => {
    if (width < 360) {
      return 90; 
    } else if (width < 400) {
      return 95;
    } else {
      return 100;
    }
  };

  const itemPadding = getItemPadding();
  const horizontalPadding = getHorizontalPadding();
  const centerButtonWidth = getCenterButtonWidth();

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

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.navItem,
          { minWidth: width < 360 ? 50 : 55 }
        ]}
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
          style={[
            styles.label,
            isActive && styles.labelActive,
            { fontSize: width < 360 ? 12 : 14 }
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
        <View style={[
          styles.content,
          {
            paddingHorizontal: horizontalPadding,
            gap: width < 360 ? 4 : width < 400 ? 6 : 8,
          }
        ]}>
          {items.map((item, index) => {
            if (item.id === 'map' || item.id === 'camera') {

              return (
                <React.Fragment key="center-buttons">
                  <View style={[
                    styles.centerButtonContainer,
                    {
                      width: centerButtonWidth,
                      marginHorizontal: width < 360 ? -2 : -3,
                    }
                  ]}>
                    {renderCenterItem()}
                  </View>
                </React.Fragment>
              );
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
    paddingTop: 4,
    paddingBottom: 20,
    minHeight: 80,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 5,
    flexShrink: 1,
    paddingHorizontal: 2,
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
    fontSize: FONTS.size.small,
    fontWeight: '500',
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

