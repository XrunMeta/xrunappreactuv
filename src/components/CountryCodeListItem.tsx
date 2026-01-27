import v_a3453e from 'bapkr';
import { v_09d0e5, v_472849, v_19b633, v_3094a2 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_da1883 } from '../types';
import { v_1bfbd0, v_843035 } from '../constants';

type Props = {
  country: v_da1883;
  isSelected?: boolean;
  onPress?: (country: v_da1883) => void;
  hideDialCode?: boolean;
};

const v_ebcf70 = (country: v_da1883): string | null => {

  if (v_b9bbbd.iso2 === 'select' || v_b9bbbd.iso2 === 'global' || v_b9bbbd.dialCode === '0' || !v_b9bbbd.countryCode || !v_b9bbbd.dialCode) {
    return null;
  }

  if (v_b9bbbd.dialCode.startsWith('+')) {
    return null;
  }

  const v_90ad93 = [82, 81, 86, 1, 62];
  const v_fd2c6b = parseInt(v_b9bbbd.dialCode, 10);
  if (!isNaN(v_fd2c6b) && v_90ad93.includes(v_b9bbbd.countryCode)) {

    return `${v_b9bbbd.countryCode}_${v_fd2c6b}`;
  }

  return null;
};

export const CountryCodeListItem: v_a3453e.FC<Props> = ({
  country: v_b9bbbd,
  isSelected: v_599a41 = false,
  onPress: v_719eed,
  hideDialCode: v_6e9efc = false,
}) => {
  const { t: v_8d41d7, i18n: v_9c213b } = v_772971();

  const v_8a1355 = v_a3453e.useMemo(() => {

    if (__DEV__) {
      console.log('[CountryCodeListItem] displayName 계산 시작:', {
        iso2: v_b9bbbd.iso2,
        name: v_b9bbbd.name,
        language: v_9c213b.language,
        countryCode: v_b9bbbd.countryCode,
        dialCode: v_b9bbbd.dialCode,
      });
    }

    const v_82170f = v_ebcf70(v_b9bbbd);
    if (v_82170f) {
      const v_b5249e = `regions.${v_82170f}`;
      try {
        const v_6dce25 = v_8d41d7(v_b5249e);

        if (v_6dce25 && v_6dce25 !== v_b5249e) {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 지역 번역 성공:', {
              key: v_b5249e,
              translated: v_6dce25,
              original: v_b9bbbd.name,
              countryCode: v_b9bbbd.countryCode,
              dialCode: v_b9bbbd.dialCode,
              language: v_9c213b.language,
            });
          }
          return v_6dce25;
        } else {
          if (__DEV__) {
            console.warn('[CountryCodeListItem] 지역 번역 키 없음:', {
              key: v_b5249e,
              countryCode: v_b9bbbd.countryCode,
              dialCode: v_b9bbbd.dialCode,
              original: v_b9bbbd.name,
              translated: v_6dce25,
              language: v_9c213b.language,
            });
          }
        }
      } catch (v_5e9bfe) {
        if (__DEV__) {
          console.warn('[CountryCodeListItem] 지역 번역 오류:', v_5e9bfe, {
            key: v_b5249e,
            countryCode: v_b9bbbd.countryCode,
            dialCode: v_b9bbbd.dialCode,
            original: v_b9bbbd.name,
            language: v_9c213b.language,
          });
        }
      }

      return v_b9bbbd.name;
    }

    if (v_b9bbbd.iso2 && v_b9bbbd.iso2 !== 'select' && v_b9bbbd.iso2 !== 'global' && v_b9bbbd.iso2.length === 2) {
      const v_79864f = v_b9bbbd.iso2.toUpperCase();
      const v_4d2349 = `countries.${v_79864f}`;
      try {

        let v_6dce25 = v_8d41d7(v_4d2349);

        if (v_6dce25 && v_6dce25 !== v_4d2349) {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 국가 번역 성공 (직접 키):', {
              key: v_4d2349,
              translated: v_6dce25,
              original: v_b9bbbd.name,
              iso2: v_b9bbbd.iso2,
              iso2Upper: v_79864f,
              language: v_9c213b.language,
            });
          }
          return v_6dce25;
        }

        try {
          const v_b1c827 = v_8d41d7('countries', { returnObjects: true });
          if (v_b1c827 && typeof v_b1c827 === 'object' && !Array.isArray(v_b1c827)) {
            const v_67cb9c = (v_b1c827 as Record<string, string>)[v_79864f];
            if (v_67cb9c && typeof v_67cb9c === 'string' && v_67cb9c !== v_79864f) {
              if (__DEV__) {
                console.log('[CountryCodeListItem] 국가 번역 성공 (객체 접근):', {
                  key: v_4d2349,
                  translated: v_67cb9c,
                  original: v_b9bbbd.name,
                  iso2: v_b9bbbd.iso2,
                  iso2Upper: v_79864f,
                  language: v_9c213b.language,
                });
              }
              return v_67cb9c;
            }
          }
        } catch (v_2d7a46) {
          if (__DEV__) {
            console.warn('[CountryCodeListItem] countries 객체 접근 실패:', v_2d7a46);
          }
        }

        if (__DEV__) {
          console.warn('[CountryCodeListItem] 국가 번역 실패 - 원본 사용:', {
            key: v_4d2349,
            iso2: v_b9bbbd.iso2,
            iso2Upper: v_79864f,
            original: v_b9bbbd.name,
            translated: v_6dce25,
            language: v_9c213b.language,

            countriesObj: v_8d41d7('countries', { returnObjects: true }),
          });
        }
      } catch (v_5e9bfe) {
        if (__DEV__) {
          console.warn('[CountryCodeListItem] 국가 번역 오류:', v_5e9bfe, {
            key: v_4d2349,
            iso2: v_b9bbbd.iso2,
            iso2Upper: v_79864f,
            original: v_b9bbbd.name,
            language: v_9c213b.language,
          });
        }
      }
    }

    return v_b9bbbd.name;
  }, [v_b9bbbd, v_8d41d7, v_9c213b.language, v_9c213b]);

  return (
    <Pressable
      style={({ pressed: v_aba1d2 }) => [
        v_d81136.container,
        v_599a41 && v_d81136.selected,
        v_aba1d2 && v_d81136.pressed,
      ]}
      onPress={() => v_719eed?.(v_b9bbbd)}
    >
      <View style={v_d81136.flagBadge}>
        <Text style={v_d81136.flagText}>{v_b9bbbd.flagEmoji}</Text>
      </View>
      <View style={v_d81136.info}>
        <Text style={v_d81136.countryName}>{v_8a1355}</Text>
        {(() => {

          const v_f5d8ad = v_ebcf70(v_b9bbbd);
          if (v_f5d8ad) {
            return null;
          }

          return <Text style={v_d81136.isoText}>{v_b9bbbd.iso2.toUpperCase()}</Text>;
        })()}
      </View>
      {!v_6e9efc && <Text style={v_d81136.dialCode}>{v_b9bbbd.dialCode}</Text>}
    </Pressable>
  );
};

const v_d81136 = v_472849.create({
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
    borderColor: v_1bfbd0.buttonPrimary,
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
    fontSize: v_843035.size.medium,
    color: v_1bfbd0.headerText,
    fontFamily: 'Roboto-Medium',
  },
  isoText: {
    fontSize: v_843035.size.small,
    color: '#8e9bae',
    textTransform: 'uppercase',
    fontFamily: 'Roboto-Regular',
  },
  dialCode: {
    fontSize: v_843035.size.medium,
    color: '#1f2933',
    fontFamily: 'Roboto-Bold',
  },
});

