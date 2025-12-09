import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { FONTS, SIZES } from '../constants';

type QuickAction = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconImage?: ImageSourcePropType;
  iconSvg?: string;
  onPress: () => void;
};

interface WalletHeaderCardProps {
  title: string;
  address: string;
  cardStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onCopy?: () => void;
  actions: QuickAction[];
  mainValueLabel?: string;
  mainValue?: string;
  subValue?: string; 
  theme?: {
    background: string;
    accentOne?: string;
    accentTwo?: string;
  };
}

export const WalletHeaderCard: React.FC<WalletHeaderCardProps> = ({
  title,
  address,
  onPress,
  cardStyle,
  onCopy,
  actions,
  mainValueLabel,
  mainValue,
  subValue,
  theme = {
    background: '#27345c',
    accentOne: 'rgba(255,255,255,0.12)',
    accentTwo: 'rgba(255,255,255,0.08)',
  },
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.background }, cardStyle]} activeOpacity={0.9} onPress={onPress}>
        <View style={[styles.accentOne, { backgroundColor: theme.accentOne }]} />
        <View style={[styles.accentTwo, { backgroundColor: theme.accentTwo }]} />

        <View style={styles.cardContent}>
          {}
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{title}</Text>
            {address ? (
              <View style={styles.addressContainer}>
                <Text style={styles.cardAddressInline} numberOfLines={1} ellipsizeMode="middle">
                  {address}
                </Text>
                <TouchableOpacity style={styles.copyButtonInline} onPress={onCopy} activeOpacity={0.7}>
                  <Ionicons name="copy-outline" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {}
          {mainValue ? (
            <View style={styles.balanceContainer}>
              {mainValueLabel ? <Text style={styles.balanceLabel}>{mainValueLabel}</Text> : null}
              <Text style={styles.balanceValue}>{mainValue}</Text>
              {subValue ? <Text style={styles.subValue}>{subValue}</Text> : null}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      {actions.length > 0 && (
        <View style={styles.quickActions}>
          {actions.map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionButton} activeOpacity={0.8} onPress={action.onPress}>
              {action.iconSvg ? (
                <SvgXml xml={action.iconSvg} width={32} height={32} style={styles.actionIcon} />
              ) : action.iconImage ? (
                <Image source={action.iconImage} style={[styles.actionIcon, styles.actionIconImage]} resizeMode="contain" />
              ) : action.icon ? (
                <Ionicons name={action.icon} size={24} color="#343a5a" style={styles.actionIcon} />
              ) : null}
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    zIndex: 10,
  },
  card: {
    borderRadius: SIZES.medium,
    padding: 24,
    minHeight: 160,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    zIndex: 1,
  },
  accentOne: {
    position: 'absolute',
    width: 140,
    height: 300,
    top: -120,
    left: -40,
    transform: [{ rotate: '-20deg' }],
    zIndex: 0,
  },
  accentTwo: {
    position: 'absolute',
    width: 100,
    height: 260,
    top: -80,
    right: -30,
    transform: [{ rotate: '-15deg' }],
    zIndex: 0,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: FONTS.size.medium,
    color: '#ffffff',
    fontFamily: 'Roboto-Medium',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-end',
  },
  cardAddressInline: {
    fontSize: FONTS.size.small,
    color: '#f0f3ff',
    fontFamily: 'Roboto-Regular',
    maxWidth: '80%',
  },
  copyButtonInline: {
    marginLeft: 6,
    padding: 4,
  },
  balanceContainer: {
    marginTop: 4,
  },
  balanceLabel: {
    fontSize: FONTS.size.msmall,
    color: '#ebebff',
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },

  balanceValue: {
    marginTop: 0,
    fontSize: FONTS.size.xxxlarge,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.8,
  },
  subValue: {
    marginTop: 0,
    fontSize: FONTS.size.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto-Regular',
    opacity: 0.9,
  },

  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5,
    marginTop: -24,
    marginHorizontal: 16,
    zIndex: 20,
    position: 'relative',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  actionIcon: {
    marginBottom: 6,
  },
  actionIconImage: {
    width: 24,
    height: 24,

  },
  actionLabel: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#454545',
  },
});

