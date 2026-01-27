import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CountryDialCode } from '../types';
import { COLORS, FONTS } from '../constants';

type Props = {
  country: CountryDialCode;
  isSelected?: boolean;
  onPress?: (country: CountryDialCode) => void;
  hideDialCode?: boolean;
};

const getRegionTranslationKey = (country: CountryDialCode): string | null => {

  if (country.iso2 === 'select' || country.dialCode === '0' || !country.countryCode || !country.dialCode) {
    return null;
  }

  return `${country.countryCode}_${country.dialCode}`;
};

export const CountryCodeListItem: React.FC<Props> = ({
  country,
  isSelected = false,
  onPress,
  hideDialCode = false,
}) => {
  const { t, i18n } = useTranslation();

  const displayName = React.useMemo(() => {

    const regionTranslationKey = getRegionTranslationKey(country);
    if (regionTranslationKey) {
      return country.name;
    }

    if (country.iso2 && country.iso2 !== 'select' && country.iso2 !== 'global' && country.iso2.length === 2) {
      const countryKey = `countries.${country.iso2.toUpperCase()}`;
      try {
        const translated = t(countryKey);

        if (translated && translated !== countryKey) {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 국가 번역 성공:', {
              key: countryKey,
              translated,
              original: country.name,
              iso2: country.iso2,
              language: i18n.language,
            });
          }
          return translated;
        } else {
          if (__DEV__) {
            console.warn('[CountryCodeListItem] 국가 번역 키 없음:', {
              key: countryKey,
              iso2: country.iso2,
              original: country.name,
              translated,
              language: i18n.language,
            });
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[CountryCodeListItem] 국가 번역 오류:', error, {
            key: countryKey,
            iso2: country.iso2,
            original: country.name,
            language: i18n.language,
          });
        }
      }
    }

    return country.name;
  }, [country, t, i18n.language]);

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
        <Text style={styles.countryName}>{displayName}</Text>
        {(() => {

          const translationKey = getRegionTranslationKey(country);
          if (translationKey) {
            return null;
          }

          return <Text style={styles.isoText}>{country.iso2.toUpperCase()}</Text>;
        })()}
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

