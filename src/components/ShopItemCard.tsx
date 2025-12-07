import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS, FONTS } from '../constants';

export interface ShopItemCardProps {
  title: string;
  subtitle?: string;
  priceLabel: string;
  imageSource: ImageSourcePropType;
  onPress?: () => void;
  quantityLabel?: string;
  quantityColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({
  title,
  subtitle,
  priceLabel,
  imageSource,
  onPress,
  quantityLabel,
  quantityColor,
  containerStyle,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isUri, setIsUri] = useState(false);

  React.useEffect(() => {
    if (typeof imageSource === 'object' && 'uri' in imageSource) {
      setIsUri(true);
    }
  }, [imageSource]);

  const defaultImage = require('../../assets/xrun-horizontal-logo.png');
  const finalImageSource = imageError ? defaultImage : imageSource;

  return (
    <TouchableOpacity
      style={[styles.card, containerStyle]}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.logoWrapper}>
        <Image
          source={finalImageSource}
          style={styles.logo}
          resizeMode="contain"
          onError={() => {
            console.log('[ShopItemCard] 이미지 로딩 실패:', isUri ? (imageSource as { uri: string }).uri : 'local');
            setImageError(true);
          }}
        />
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <Text style={styles.price}>{priceLabel}</Text>
      </View>
      {quantityLabel ? (
        <Text style={[styles.quantity, quantityColor ? { color: quantityColor } : null]}>
          {quantityLabel}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: COLORS.background,
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
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    marginBottom: 4,
  },
  price: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#1a2e35',
  },
  quantity: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#1a2e35',
    alignSelf: 'center',
  },
});

