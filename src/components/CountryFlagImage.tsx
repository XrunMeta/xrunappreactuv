

import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_cf9c33, v_02846d, v_472849, v_19b633, v_3094a2, v_7e4944 } from 'rcmrninabrnb';

type Props = {
  isoCode: string; 
  flagEmoji?: string; 
  size?: number; 
  style?: v_7e4944 | v_02846d;
};

export const CountryFlagImage: v_a3453e.FC<Props> = ({
  isoCode: v_52c475,
  flagEmoji: v_3e963a = '🌐',
  size: v_05b441 = 40,
  style: v_7fa4e4,
}) => {
  const [v_f08647, v_d4d91d] = v_5ab095(false);
  const [v_e3c18f, v_e6d26a] = v_5ab095(false);

  if (!v_52c475 || v_52c475.length !== 2) {
    return (
      <View style={[v_d81136.container, { width: v_05b441, height: v_05b441 }, v_7fa4e4]}>
        <Text style={[v_d81136.emoji, { fontSize: v_05b441 * 0.55 }]}>{v_3e963a}</Text>
      </View>
    );
  }

  if (v_f08647 || v_e3c18f) {
    return (
      <View style={[v_d81136.container, { width: v_05b441, height: v_05b441 }, v_7fa4e4]}>
        <Text style={[v_d81136.emoji, { fontSize: v_05b441 * 0.55 }]}>{v_3e963a}</Text>
      </View>
    );
  }

  const v_8a33c8 = `https://flagcdn.com/w${v_05b441}/${v_52c475.toLowerCase()}.png`;

  return (
    <View style={[v_d81136.container, { width: v_05b441, height: v_05b441 }, v_7fa4e4]}>
      <Image
        source={{ uri: v_8a33c8 }}
        style={[v_d81136.image, { width: v_05b441, height: v_05b441 }]}
        onError={() => {
          if (__DEV__) {
            console.warn('[CountryFlagImage] 이미지 로드 실패, emoji fallback 사용:', {
              isoCode: v_52c475,
              imageUrl: v_8a33c8,
            });
          }
          v_e6d26a(true);
          v_d4d91d(true);
        }}
        resizeMode="contain"
      />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    borderRadius: 4,
  },
  emoji: {
    textAlign: 'center',
  },
});

