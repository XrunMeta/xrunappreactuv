import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, SIZES } from '../constants';

interface ReferralStatsCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  helperText?: string;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ReferralStatsCard: React.FC<ReferralStatsCardProps> = ({
  title,
  subtitle,
  value,
  helperText,
  children,
  containerStyle,
}) => {
  return (
    <View style={[styles.card, containerStyle]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children ? (
        children
      ) : (
        <>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 780,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#2F7389',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#EBF6FF',
  },
  subtitle: {
    fontSize: 12,
    color: '#D6E6EE',
    fontFamily: 'Roboto-Medium',
  },
  value: {
    marginTop: 4,
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: COLORS.background,
  },
  helper: {
    marginTop: 4,
    fontSize: SIZES.small,
    color: '#D6E6EE',
    fontFamily: 'Roboto-Regular',
  },
});


