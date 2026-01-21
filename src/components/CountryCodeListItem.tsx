import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CountryDialCode } from '../types';
import { COLORS, FONTS } from '../constants';

type Props = {
  country: CountryDialCode;
  isSelected?: boolean;
  onPress?: (country: CountryDialCode) => void;
  hideDialCode?: boolean;
};

export const CountryCodeListItem: React.FC<Props> = ({
  country,
  isSelected = false,
  onPress,
  hideDialCode = false,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selected,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(country)}
    >
      <View style={styles.flagBadge}>
        <Text style={styles.flagText}>{country.flagEmoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.countryName}>{country.name}</Text>
        <Text style={styles.isoText}>{country.iso2.toUpperCase()}</Text>
      </View>
      {!hideDialCode && <Text style={styles.dialCode}>{country.dialCode}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selected: {
    borderColor: COLORS.buttonPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
  flagBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f9fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagText: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  countryName: {
    fontSize: FONTS.size.medium,
    color: COLORS.headerText,
    fontFamily: 'Roboto-Medium',
  },
  isoText: {
    fontSize: FONTS.size.small,
    color: '#8e9bae',
    textTransform: 'uppercase',
    fontFamily: 'Roboto-Regular',
  },
  dialCode: {
    fontSize: FONTS.size.medium,
    color: '#1f2933',
    fontFamily: 'Roboto-Bold',
  },
});

