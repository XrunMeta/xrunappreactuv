import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';

const { width } = Dimensions.get('window');

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const BackIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>‹</Text>
  </View>
);

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightComponent,
}) => {
  const { goBack, canGoBack } = useAppNavigation();
  const shouldShowBackButton = showBackButton && (canGoBack || !!onBackPress);
  const handleBackPress = onBackPress ?? (canGoBack ? goBack : undefined);

  const renderBackArea = () =>
    shouldShowBackButton ? (
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
        disabled={!handleBackPress}
      >
        <BackIcon />
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
    height: 92,
    width: width,
    paddingTop: 30,
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
    backgroundColor: COLORS.headerIconBg,
    borderRadius: 16,
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
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
    color: COLORS.headerText,
    fontWeight: '300',
    lineHeight: 24,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: COLORS.headerText,
    fontFamily: 'Roboto-Bold', 
    textAlign: 'center',
  },
});

