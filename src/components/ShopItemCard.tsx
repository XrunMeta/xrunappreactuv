import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_cf9c33,
  v_4623af,
  v_07a341,
  v_7e4944,
  v_961e77,
  v_39a996,
} from 'rcmrninabrnb';
import { v_1bfbd0, v_843035, v_9b1a04 } from '../constants';
import { v_5401ae } from '../testIDs';

export interface ShopItemCardProps {
  title: string;
  subtitle?: string;
  priceLabel: string;
  imageSource: v_07a341;
  onPress?: () => void;
  quantityLabel?: string;
  quantityColor?: string;
  containerStyle?: v_961e77<v_7e4944>;
}

export const ShopItemCard: v_a3453e.FC<ShopItemCardProps> = ({
  title: v_9f1622,
  subtitle: v_dda473,
  priceLabel: v_5b0162,
  imageSource: v_c322f7,
  onPress: v_719eed,
  quantityLabel: v_63f02c,
  quantityColor: v_ca637d,
  containerStyle: v_4affe9,
}) => {
  const [v_e3c18f, v_e6d26a] = v_5ab095(false);
  const [v_f904ba, v_0cc1b6] = v_5ab095(false);
  const [v_cd31a8, v_deef62] = v_5ab095(false);

  v_a3453e.useEffect(() => {
    if (typeof v_c322f7 === 'object' && 'uri' in v_c322f7) {
      v_0cc1b6(true);
      v_e6d26a(false); 

      const v_cd1446 = (v_c322f7 as { uri: string }).uri;
      if (v_cd1446.startsWith('data:image')) {
        console.log('[ShopItemCard] base64 이미지 감지, URI 길이:', v_cd1446.length);

        const v_41e0ce = v_cd1446.split(',')[1];
        if (!v_41e0ce || v_41e0ce.length < 100) {
          console.warn('[ShopItemCard] ⚠️ base64 데이터가 너무 짧거나 없음');
          v_deef62(false); 
        } else {

          v_deef62(false);
        }
      } else {

        v_deef62(true);

        const v_3894d5 = setTimeout(() => {
          console.warn('[ShopItemCard] ⚠️ 이미지 로딩 타임아웃, 로딩 상태 해제');
          v_deef62(false);
        }, 5000);

        return () => {
          clearTimeout(v_3894d5);
        };
      }
    } else {
      v_0cc1b6(false);
      v_deef62(false);
    }
  }, [v_c322f7]);

  const v_ad411c = require('../../assets/xrun-horizontal-logo.png');
  const v_a4d130 = v_e3c18f ? v_ad411c : v_c322f7;

  return (
    <TouchableOpacity
      style={[v_d81136.card, v_4affe9]}
      activeOpacity={v_719eed ? 0.85 : 1}
      onPress={v_719eed}
      disabled={!v_719eed}
    >
      <View style={v_d81136.logoWrapper}>
        {v_cd31a8 && !v_e3c18f && v_f904ba ? (
          <ActivityIndicator size="small" color={v_1bfbd0.primary} />
        ) : (
          <Image
            source={v_a4d130}
            style={v_d81136.logo}
            resizeMode="contain"
            onError={(v_5e9bfe) => {
              const v_cd1446 = v_f904ba ? (v_c322f7 as { uri: string }).uri : 'local';
              console.error('[ShopItemCard] ❌ 이미지 로딩 실패:', {
                uri: v_cd1446.substring(0, 100) + (v_cd1446.length > 100 ? '...' : ''),
                uriLength: v_cd1446.length,
                isBase64: v_cd1446.startsWith('data:image'),
                error: v_5e9bfe.nativeEvent?.error || 'Unknown error',
              });
              v_e6d26a(true);
              v_deef62(false);
            }}
            onLoad={() => {
              console.log('[ShopItemCard] ✅ 이미지 로딩 성공');
              v_deef62(false);
              v_e6d26a(false);
            }}
            onLoadStart={() => {
              console.log('[ShopItemCard] 이미지 로딩 시작');

              const v_cd1446 = v_f904ba ? (v_c322f7 as { uri: string }).uri : '';
              if (!v_cd1446.startsWith('data:image')) {
                v_deef62(true);
              }
            }}
          />
        )}
      </View>

      <View style={v_d81136.infoWrapper}>
        <Text testID={v_5401ae.shopItemCard.titleLabel} style={v_d81136.title}>{v_9f1622}</Text>
        {v_dda473 ? <Text style={v_d81136.subtitle}>{v_dda473}</Text> : null}
        {v_5b0162 ? <Text style={v_d81136.price}>{v_5b0162}</Text> : null}
        {v_63f02c ? (
          <Text style={[v_d81136.quantity, v_ca637d ? { color: v_ca637d } : null]}>
            {v_63f02c}
          </Text>
        ) : null}
      </View>

    </TouchableOpacity>
  );
};

const v_d81136 = v_472849.create({
  card: {
    borderRadius: 18,
    backgroundColor: v_1bfbd0.background,
    flexDirection: 'row',
    padding: v_9b1a04.medium,
    borderWidth: 0.5,
    borderColor: '#d5dde0',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: v_9b1a04.small,
  },
  logoWrapper: {
    width: 64,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#d5dde0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 48,
    height: 32,
  },
  infoWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 4,
  },
  title: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  subtitle: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
  },
  price: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    height: 'auto',
  },
  quantity: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
});

