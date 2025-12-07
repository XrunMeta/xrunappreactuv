import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SIZES } from '../constants';

type QuickAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

interface WalletHeaderCardProps {
  title: string;
  address: string;
  onPress?: () => void;
  onCopy?: () => void;
  actions: QuickAction[];
  mainValueLabel?: string;
  mainValue?: string;
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
  onCopy,
  actions,
  mainValueLabel,
  mainValue,
  theme = {
    background: '#27345c',
    accentOne: 'rgba(255,255,255,0.12)',
    accentTwo: 'rgba(255,255,255,0.08)',
  },
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.background }]} activeOpacity={0.9} onPress={onPress}>
        <View style={[styles.accentOne, { backgroundColor: theme.accentOne }]} />
        <View style={[styles.accentTwo, { backgroundColor: theme.accentTwo }]} />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          {mainValue ? (
            <>
              {mainValueLabel ? <Text style={styles.balanceLabel}>{mainValueLabel}</Text> : null}
              <Text style={styles.balanceValue}>{mainValue}</Text>
            </>
          ) : null}
          {address ? (
            <Text style={styles.cardAddress} numberOfLines={2} ellipsizeMode="middle">
              {address}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.copyButton} onPress={onCopy} activeOpacity={0.7}>
          <Ionicons name="copy-outline" size={18} color="#ffffff" />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.quickActions}>
        {actions.map((action) => (
          <TouchableOpacity key={action.label} style={styles.actionButton} activeOpacity={0.8} onPress={action.onPress}>
            <Ionicons name={action.icon} size={24} color="#343a5a" style={styles.actionIcon} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    minHeight: 170,
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
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: FONTS.size.medium,
    color: '#ffffff',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  cardAddress: {
    fontSize: FONTS.size.small,
    color: '#f0f3ff',
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
    textAlign: 'left',
  },
  balanceLabel: {
    fontSize: FONTS.size.msmall,
    color: '#ebebff',
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: FONTS.size.xlarge,
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
  copyButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 1,
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
  actionLabel: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#454545',
  },
});


