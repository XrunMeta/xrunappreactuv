import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { FONTS } from '../constants';

interface TokenListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle: string;
  amount: string;
  suffix?: string;
  badgeLabel?: string;
  iconSource?: ImageSourcePropType;
  fallbackLabel?: string;
  fallbackColors?: {
    background: string;
    text: string;
  };
}

export const TokenListItem: React.FC<TokenListItemProps> = ({
  title,
  subtitle,
  amount,
  suffix,
  badgeLabel,
  iconSource,
  fallbackLabel,
  fallbackColors = {
    background: '#EDEDED',
    text: '#343434',
  },
  onPress,
  ...touchableProps
}) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={onPress ? 0.85 : 1} onPress={onPress} {...touchableProps}>
      <View style={styles.left}>
        <View style={[styles.iconWrapper, { backgroundColor: fallbackColors.background }]}>
          {iconSource ? (
            <Image source={iconSource} style={styles.iconImage} resizeMode="contain" />
          ) : (
            <Text style={[styles.iconText, { color: fallbackColors.text }]}>
              {fallbackLabel?.slice(0, 2).toUpperCase()}
            </Text>
          )}
        </View>
        {badgeLabel ? <View style={styles.badge}><Text style={styles.badgeText}>{badgeLabel}</Text></View> : null}
      </View>
      <View style={styles.middle}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{amount}</Text>
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#3629B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 16,
  },
  left: {
    marginRight: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  iconText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: FONTS.size.xxsmall,
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
  middle: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#343434',
  },
  subtitle: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#979797',
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FONTS.size.ssmall,
    fontFamily: 'Roboto-Bold',
    color: '#363636',
  },
  suffix: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#979797',
  },
});


