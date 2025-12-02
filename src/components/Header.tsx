import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';

const { width } = Dimensions.get('window');

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightComponent,
}) => {
  const { goBack, reset, canGoBack, currentScreen } = useAppNavigation();
  const shouldShowBackButton = showBackButton;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    const isMyInfoScreen = currentScreen?.startsWith('myInfo');

    if (isMyInfoScreen) {

      if (canGoBack) {
        goBack();
      } else {

        reset(ROUTES.map);
      }
    } else {

      reset(ROUTES.map);
    }
  };

  const renderBackArea = () =>
    shouldShowBackButton ? (
      <TouchableOpacity
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
    <View style={styles.container}>
      <View style={styles.content}>
        {renderBackArea()}
        <View style={styles.titleWrapper} pointerEvents="none">
          <Text style={styles.title}>{title}</Text>
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
    height: 96,
    width: width,
    marginTop:10,
    paddingTop: 44,
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.09,
    shadowRadius: 3,
    elevation: 3, 
    justifyContent: 'center',
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
    backgroundColor: 'transparent',
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
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    color: COLORS.headerText,
    fontFamily: 'Roboto-Bold', 
    textAlign: 'center',
  },
});

