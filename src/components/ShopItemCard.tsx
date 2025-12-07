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
} from 'rcmrninabrnb';
import { v_1bfbd0, v_843035 } from '../constants';

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

  v_a3453e.useEffect(() => {
    if (typeof v_c322f7 === 'object' && 'uri' in v_c322f7) {
      v_0cc1b6(true);
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
        <Image
          source={v_a4d130}
          style={v_d81136.logo}
          resizeMode="contain"
          onError={() => {
            console.log('[ShopItemCard] 이미지 로딩 실패:', v_f904ba ? (v_c322f7 as { uri: string }).uri : 'local');
            v_e6d26a(true);
          }}
        />
      </View>
      <View style={v_d81136.infoWrapper}>
        <Text style={v_d81136.title}>{v_9f1622}</Text>
        {v_dda473 ? <Text style={v_d81136.subtitle}>{v_dda473}</Text> : null}
        <Text style={v_d81136.price}>{v_5b0162}</Text>
      </View>
      {v_63f02c ? (
        <Text style={[v_d81136.quantity, v_ca637d ? { color: v_ca637d } : null]}>
          {v_63f02c}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const v_d81136 = v_472849.create({
  card: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: v_1bfbd0.background,
    flexDirection: 'row',
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#d5dde0',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  logoWrapper: {
    width: 64,
    height: 64,
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
  },
  title: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    marginBottom: 4,
  },
  price: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#1a2e35',
  },
  quantity: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#1a2e35',
    alignSelf: 'center',
  },
});

