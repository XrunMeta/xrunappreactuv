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

interface TransactionListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle: string;
  timestamp: string;
  amount: string;
  suffix?: string;
  iconSource?: ImageSourcePropType;
  fallbackLabel?: string;
  fallbackColors?: {
    background: string;
    text: string;
  };
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({
  title,
  subtitle,
  timestamp,
  amount,
  suffix,
  iconSource,
  onPress,
  fallbackLabel,
  fallbackColors = { background: '#f2f2f2', text: '#343434' },
  ...touchableProps
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      {...touchableProps}
    >
      <View style={styles.left}>
        {iconSource ? (
          <Image source={iconSource} style={styles.icon} />
        ) : (
          <View
            style={[
              styles.icon,
              styles.fallbackIcon,
              { backgroundColor: fallbackColors.background },
            ]}
          >
            {fallbackLabel ? (
              <Text style={[styles.fallbackLabel, { color: fallbackColors.text }]}>
                {fallbackLabel}
              </Text>
            ) : null}
          </View>
        )}
      </View>
      <View style={styles.middle}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <Text style={styles.amount}>{suffix ? `${amount} ${suffix}` : amount}</Text>
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#3629B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 12,
  },
  left: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  fallbackIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackLabel: {
    fontSize: FONTS.size.ssmall,
    fontFamily: 'Roboto-Bold',
  },
  middle: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.size.medium,
    color: '#343434',
    fontFamily: 'Roboto-Medium',
  },
  subtitle: {
    fontSize: FONTS.size.small,
    color: '#979797',
    fontFamily: 'Roboto-Regular',
  },
  right: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: FONTS.size.xxsmall,
    color: '#aeaeae',
    fontFamily: 'Roboto-Medium',
    marginBottom: 6,
  },
  amount: {
    fontSize: FONTS.size.ssmall,
    color: '#363636',
    fontFamily: 'Roboto-Bold',
  },
});


