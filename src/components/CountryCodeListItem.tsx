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
  const { t } = useTranslation();

  const displayName = React.useMemo(() => {
    const translationKey = getRegionTranslationKey(country);
    if (translationKey) {
      const fullKey = `regions.${translationKey}`;
      try {

        const translated = t(fullKey);

        if (translated && translated !== fullKey) {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 지역 번역 성공:', {
              key: fullKey,
              translated,
              original: country.name,
              countryCode: country.countryCode,
              dialCode: country.dialCode,
            });
          }
          return translated;
        } else {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 지역 번역 키 없음 (원본 사용):', {
              key: fullKey,
              translated,
              original: country.name,
              countryCode: country.countryCode,
              dialCode: country.dialCode,
            });
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[CountryCodeListItem] 지역 번역 오류:', error);
        }
      }
    }

    return country.name;
  }, [country, t]);

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
          if (translationKey && country.name && country.name !== displayName) {

            const countryCode = country.countryCode;
            if (countryCode === 82 || countryCode === 1 || countryCode === 86 || countryCode === 62) {
              return null;
            }

            return <Text style={styles.isoText}>{country.name}</Text>;
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

