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

  if (v_b9bbbd.iso2 === 'select' || v_b9bbbd.dialCode === '0' || !v_b9bbbd.countryCode || !v_b9bbbd.dialCode) {
    return null;
  }

  return `${v_b9bbbd.countryCode}_${v_b9bbbd.dialCode}`;
};

export const CountryCodeListItem: v_a3453e.FC<Props> = ({
  country: v_b9bbbd,
  isSelected: v_599a41 = false,
  onPress: v_719eed,
  hideDialCode: v_6e9efc = false,
}) => {
  const { t: v_8d41d7 } = v_772971();

  const v_8a1355 = v_a3453e.useMemo(() => {
    const v_f5d8ad = v_ebcf70(v_b9bbbd);
    if (v_f5d8ad) {
      const v_75aa17 = `regions.${v_f5d8ad}`;
      try {

        const v_6dce25 = v_8d41d7(v_75aa17);

        if (v_6dce25 && v_6dce25 !== v_75aa17) {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 지역 번역 성공:', {
              key: v_75aa17,
              translated: v_6dce25,
              original: v_b9bbbd.name,
              countryCode: v_b9bbbd.countryCode,
              dialCode: v_b9bbbd.dialCode,
            });
          }
          return v_6dce25;
        } else {
          if (__DEV__) {
            console.log('[CountryCodeListItem] 지역 번역 키 없음 (원본 사용):', {
              key: v_75aa17,
              translated: v_6dce25,
              original: v_b9bbbd.name,
              countryCode: v_b9bbbd.countryCode,
              dialCode: v_b9bbbd.dialCode,
            });
          }
        }
      } catch (v_5e9bfe) {
        if (__DEV__) {
          console.warn('[CountryCodeListItem] 지역 번역 오류:', v_5e9bfe);
        }
      }
    }

    return v_b9bbbd.name;
  }, [v_b9bbbd, v_8d41d7]);

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
          if (v_f5d8ad && v_b9bbbd.name && v_b9bbbd.name !== v_8a1355) {

            const v_a4d981 = v_b9bbbd.countryCode;
            if (v_a4d981 === 82 || v_a4d981 === 1 || v_a4d981 === 86 || v_a4d981 === 62) {
              return null;
            }

            return <Text style={v_d81136.isoText}>{v_b9bbbd.name}</Text>;
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

