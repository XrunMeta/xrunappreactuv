import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

interface BottomNavItem {
  id: string;
  label: string;
  icon?: string;
  isActive?: boolean;
  onPress?: () => void;
}

interface BottomNavigationBarProps {
  items: BottomNavItem[];
  activeItemId?: string;
  onItemPress?: (itemId: string) => void;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  items,
  activeItemId,
  onItemPress,
}) => {

  const getItemPadding = () => {
    const basePadding = width * 0.04; 
    const minPadding = 8;
    const maxPadding = 20;
    return Math.max(minPadding, Math.min(maxPadding, basePadding));
  };

  const itemPadding = getItemPadding();

  const renderCenterItem = (item: BottomNavItem) => {
    if (item.id === 'map' || item.id === 'camera') {
      return (
        <TouchableOpacity
          key={item.id}
          style={[styles.centerItemContainer, { paddingHorizontal: itemPadding }]}
          onPress={() => onItemPress?.(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.centerItemWrapper}>
            <View style={styles.mapIconContainer}>
              <View style={styles.mapIconCircle}>
                {}
                <View style={styles.mapIcon} />
              </View>
            </View>
            <View style={styles.cameraIconContainer}>
              <View style={styles.cameraIconCircle}>
                {}
                <View style={styles.cameraIcon} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderRegularItem = (item: BottomNavItem) => {
    if (item.id === 'map' || item.id === 'camera') {
      return null;
    }

    const isActive = activeItemId === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.navItem, { paddingHorizontal: itemPadding }]}
        onPress={() => onItemPress?.(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {}
          <View style={[styles.iconPlaceholder, isActive && styles.iconPlaceholderActive]} />
        </View>
        <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.topSection} />
      {}
      <View style={styles.bottomSection}>
        <View style={styles.content}>
          {items.map((item) => {
            if (item.id === 'map' || item.id === 'camera') {
              return renderCenterItem(item);
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
  topSection: {
    height: 32,
    backgroundColor: '#EFF4F5',
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    minHeight: 104,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 60,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  labelActive: {
    color: COLORS.buttonPrimary,
  },
  centerItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  centerItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIconContainer: {
    marginRight: 4,
  },
  mapIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.buttonSecondary, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  cameraIconContainer: {
    marginLeft: 4,
  },
  cameraIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#33395B', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
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

