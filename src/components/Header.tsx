import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { useHeaderDimensions } from '../hooks';
import { useAppNavigation, ROUTES } from '../navigation';
import { resolveBackAction } from '../navigation/backNavigationPolicy';
import { FONTS } from '../constants';
import { TID } from '../testIDs';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightComponent,
  containerStyle,
}) => {
  const { goBack, reset, canGoBack, currentScreen } = useAppNavigation();
  const shouldShowBackButton = showBackButton;

  const { topPadding, headerHeight } = useHeaderDimensions();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    const action = resolveBackAction({ screen: currentScreen, canGoBack, source: 'header' });

    if (action === 'goBack') {
      goBack();
    } else if (action === 'resetWallet') {
      reset(ROUTES.wallet);
    } else {
      reset(ROUTES.map);
    }
  };

  const renderBackArea = () =>
    shouldShowBackButton ? (
      <TouchableOpacity testID={TID.header.back}
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Feather name="arrow-left" size={20} color={COLORS.headerText} />
      </TouchableOpacity>
    ) : (
      <View style={styles.backButtonPlaceholder} />
    );

  return (
    <View style={[styles.container, { height: headerHeight + 10, paddingTop: topPadding }, containerStyle]}>
      <View style={styles.content}>
        {renderBackArea()}
        <View style={styles.titleWrapper} pointerEvents="none">
          <Text testID={TID.header.titleLabel} style={styles.title}>{title}</Text>
        </View>
        {rightComponent ? (
          <View style={styles.rightComponent}>{rightComponent}</View>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',

    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, 
    justifyContent: 'center',
    zIndex: 10, 
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    height: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.headerIconBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  rightComponent: {
    minWidth: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.size.mmedium,
    fontWeight: '700',
    lineHeight: 22,
    color: COLORS.headerText,
    fontFamily: 'Roboto-Bold', 
    textAlign: 'center',
  },
});

