import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CountryDialCode } from '../types';
import { COLORS, FONTS } from '../constants';
import { CountryFlagImage } from './CountryFlagImage';

type Props = {
  country: CountryDialCode;
  isSelected?: boolean;
  onPress?: (country: CountryDialCode) => void;
  hideDialCode?: boolean;
};

const getRegionTranslationKey = (country: CountryDialCode): string | null => {

  if (country.iso2 === 'select' || country.iso2 === 'global' || country.dialCode === '0' || !country.countryCode || !country.dialCode) {
    return null;
  }

  if (country.dialCode.startsWith('+')) {
    return null;
  }

  const dialCodeNum = parseInt(country.dialCode, 10);
  if (!isNaN(dialCodeNum) && dialCodeNum > 0) {

    const COUNTRIES_WITH_MAPPING = [82, 81, 86, 1, 62];
    if (COUNTRIES_WITH_MAPPING.includes(country.countryCode)) {

      return `${country.countryCode}_${dialCodeNum}`;
    }

    const regionNameKey = country.name
      .replace(/[^a-zA-Z0-9\s]/g, '') 
      .replace(/\s+/g, '_') 
      .toLowerCase();

    return `${country.countryCode}_${regionNameKey}`;
  }

  return null;
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
      const regionKey = `regions.${regionTranslationKey}`;
      try {
        const translated = t(regionKey);

        if (translated && translated !== regionKey) {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 지역 번역 성공:', {
              key: regionKey,
              translated,
              original: country.name,
              countryCode: country.countryCode,
              dialCode: country.dialCode,
              language: i18n.language,
            });
          }
          return translated;
        } else {

        }
      } catch (error) {

      }

      return country.name;
    }

    if (country.iso2 && country.iso2 !== 'select' && country.iso2 !== 'global' && country.iso2.length === 2) {
      const iso2Upper = country.iso2.toUpperCase();
      const countryKey = `countries.${iso2Upper}`;
      try {

        let translated = t(countryKey);

        if (translated && translated !== countryKey) {

          return translated;
        }

        try {
          const countriesObj = t('countries', { returnObjects: true });
          if (countriesObj && typeof countriesObj === 'object' && !Array.isArray(countriesObj)) {
            const countryName = (countriesObj as Record<string, string>)[iso2Upper];
            if (countryName && typeof countryName === 'string' && countryName !== iso2Upper) {

              return countryName;
            }
          }
        } catch (objError) {

        }

      } catch (error) {

      }
    }

    return country.name;
  }, [country, t, i18n.language, i18n]);

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
        <CountryFlagImage
          isoCode={country.iso2}
          flagEmoji={country.flagEmoji}
          size={40}
        />
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
    overflow: 'hidden',
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

