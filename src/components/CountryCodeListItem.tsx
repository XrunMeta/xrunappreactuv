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

  if (country.iso2 === 'select' || country.iso2 === 'global' || country.dialCode === '0' || !country.countryCode || !country.dialCode) {
    return null;
  }

  if (country.dialCode.startsWith('+')) {
    return null;
  }

  const COUNTRIES_WITH_REGIONS = [82, 81, 86, 1, 62];
  const dialCodeNum = parseInt(country.dialCode, 10);
  if (!isNaN(dialCodeNum) && COUNTRIES_WITH_REGIONS.includes(country.countryCode)) {

    return `${country.countryCode}_${dialCodeNum}`;
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

    if (__DEV__) {
      console.log('[CountryCodeListItem] displayName 계산 시작:', {
        iso2: country.iso2,
        name: country.name,
        language: i18n.language,
        countryCode: country.countryCode,
        dialCode: country.dialCode,
      });
    }

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
          if (__DEV__) {
            console.warn('[CountryCodeListItem] 지역 번역 키 없음:', {
              key: regionKey,
              countryCode: country.countryCode,
              dialCode: country.dialCode,
              original: country.name,
              translated,
              language: i18n.language,
            });
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[CountryCodeListItem] 지역 번역 오류:', error, {
            key: regionKey,
            countryCode: country.countryCode,
            dialCode: country.dialCode,
            original: country.name,
            language: i18n.language,
          });
        }
      }

      return country.name;
    }

    if (country.iso2 && country.iso2 !== 'select' && country.iso2 !== 'global' && country.iso2.length === 2) {
      const iso2Upper = country.iso2.toUpperCase();
      const countryKey = `countries.${iso2Upper}`;
      try {

        let translated = t(countryKey);

        if (translated && translated !== countryKey) {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 국가 번역 성공 (직접 키):', {
              key: countryKey,
              translated,
              original: country.name,
              iso2: country.iso2,
              iso2Upper,
              language: i18n.language,
            });
          }
          return translated;
        }

        try {
          const countriesObj = t('countries', { returnObjects: true });
          if (countriesObj && typeof countriesObj === 'object' && !Array.isArray(countriesObj)) {
            const countryName = (countriesObj as Record<string, string>)[iso2Upper];
            if (countryName && typeof countryName === 'string' && countryName !== iso2Upper) {
              if (__DEV__) {
                console.log('[CountryCodeListItem] 국가 번역 성공 (객체 접근):', {
                  key: countryKey,
                  translated: countryName,
                  original: country.name,
                  iso2: country.iso2,
                  iso2Upper,
                  language: i18n.language,
                });
              }
              return countryName;
            }
          }
        } catch (objError) {
          if (__DEV__) {
            console.warn('[CountryCodeListItem] countries 객체 접근 실패:', objError);
          }
        }

        if (__DEV__) {
          console.warn('[CountryCodeListItem] 국가 번역 실패 - 원본 사용:', {
            key: countryKey,
            iso2: country.iso2,
            iso2Upper,
            original: country.name,
            translated,
            language: i18n.language,

            countriesObj: t('countries', { returnObjects: true }),
          });
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[CountryCodeListItem] 국가 번역 오류:', error, {
            key: countryKey,
            iso2: country.iso2,
            iso2Upper,
            original: country.name,
            language: i18n.language,
          });
        }
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

