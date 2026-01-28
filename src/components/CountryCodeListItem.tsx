import v_a3453e from 'bapkr';
import { v_09d0e5, v_472849, v_19b633, v_3094a2 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_da1883 } from '../types';
import { v_1bfbd0, v_843035 } from '../constants';
import { v_496111 } from './CountryFlagImage';

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

  const v_fd2c6b = parseInt(v_b9bbbd.dialCode, 10);
  if (!isNaN(v_fd2c6b) && v_fd2c6b > 0) {

    const v_9ad700 = [82, 81, 86, 1, 62];
    if (v_9ad700.includes(v_b9bbbd.countryCode)) {

      return `${v_b9bbbd.countryCode}_${v_fd2c6b}`;
    }

    const v_1581b6 = v_b9bbbd.name
      .replace(/[^a-zA-Z0-9\s]/g, '') 
      .replace(/\s+/g, '_') 
      .toLowerCase();

    return `${v_b9bbbd.countryCode}_${v_1581b6}`;
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
            console.log('[CountryCodeListItem] 지역 번역 키 없음 (원본 사용):', {
              key: v_b5249e,
              translated: v_6dce25,
              original: v_b9bbbd.name,
              countryCode: v_b9bbbd.countryCode,
              dialCode: v_b9bbbd.dialCode,
              language: v_9c213b.language,
            });
          }
        }
      } catch (v_5e9bfe) {

      }

      return v_b9bbbd.name;
    }

    if (v_b9bbbd.iso2 && v_b9bbbd.iso2 !== 'select' && v_b9bbbd.iso2 !== 'global' && v_b9bbbd.iso2.length === 2) {
      const v_79864f = v_b9bbbd.iso2.toUpperCase();
      const v_4d2349 = `countries.${v_79864f}`;
      try {

        let v_6dce25 = v_8d41d7(v_4d2349);

        if (v_6dce25 && v_6dce25 !== v_4d2349) {

          return v_6dce25;
        }

        try {
          const v_b1c827 = v_8d41d7('countries', { returnObjects: true });
          if (v_b1c827 && typeof v_b1c827 === 'object' && !Array.isArray(v_b1c827)) {
            const v_67cb9c = (v_b1c827 as Record<string, string>)[v_79864f];
            if (v_67cb9c && typeof v_67cb9c === 'string' && v_67cb9c !== v_79864f) {

              return v_67cb9c;
            }
          }
        } catch (v_2d7a46) {

        }

      } catch (v_5e9bfe) {

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
        <CountryFlagImage
          isoCode={v_b9bbbd.iso2}
          flagEmoji={v_b9bbbd.flagEmoji}
          size={40}
        />
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
    overflow: 'hidden',
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

