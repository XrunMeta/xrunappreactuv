import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants';

interface ReferralStatsCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  helperText?: string;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  gradientColors?: [string, string, ...string[]];
}

export const ReferralStatsCard: React.FC<ReferralStatsCardProps> = ({
  title,
  subtitle,
  value,
  helperText,
  children,
  containerStyle,
  icon = 'trending-up',
  iconColor = '#FFFFFF',
  gradientColors = ['#6366F1', '#8B5CF6', '#A855F7'],
}) => {
  return (
    <View style={[styles.card, containerStyle]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {}
        <View style={styles.backgroundIcon}>
          <Ionicons name={icon} size={120} color={iconColor} style={styles.iconStyle} />
        </View>

        {}
        <View style={styles.content}>
          {(title && title.trim()) || subtitle ? (
            <View style={styles.titleRow}>
              <View style={styles.titleLeft}>
                {icon && (
                  <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={20} color={iconColor} />
                  </View>
                )}
                {title && title.trim() ? <Text style={styles.title}>{title}</Text> : null}
              </View>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          ) : null}
          {children ? (
            children
          ) : (
            <>
              {value ? <Text style={styles.value}>{value}</Text> : null}
              {helperText && helperText.trim() ? <Text style={styles.helper}>{helperText}</Text> : null}
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 780,
    borderRadius: 28,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    height: 140,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 28,
    position: 'relative',
  },
  backgroundIcon: {
    position: 'absolute',
    right: -20,
    top: -20,
    opacity: 0.15,
  },
  iconStyle: {
    transform: [{ rotate: '-15deg' }],
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-SemiBold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: FONTS.size.small,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto-Medium',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  value: {
    marginTop: 4,
    fontSize: FONTS.size.xxxlarge,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.8,
  },
  helper: {
    marginTop: 0,
    fontSize: FONTS.size.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto-Regular',
    opacity: 0.9,

  },
});

