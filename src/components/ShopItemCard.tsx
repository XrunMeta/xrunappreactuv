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
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';

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
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (typeof imageSource === 'object' && 'uri' in imageSource) {
      setIsUri(true);
      setIsLoading(true);
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
        {isLoading && !imageError && isUri ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Image
            source={finalImageSource}
            style={styles.logo}
            resizeMode="contain"
            onError={() => {
              console.log('[ShopItemCard] 이미지 로딩 실패:', isUri ? (imageSource as { uri: string }).uri : 'local');
              setImageError(true);
              setIsLoading(false);
            }}
            onLoad={() => {
              setIsLoading(false);
            }}
          />
        )}
      </View>

      <View style={styles.infoWrapper}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {priceLabel ? <Text style={styles.price}>{priceLabel}</Text> : null}
        {quantityLabel ? (
          <Text style={[styles.quantity, quantityColor ? { color: quantityColor } : null]}>
            {quantityLabel}
          </Text>
        ) : null}
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    padding: SIZES.medium,
    borderWidth: 0.5,
    borderColor: '#d5dde0',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: SIZES.small,
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 4,
  },
  title: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
  },
  subtitle: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
  },
  price: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
    height: 'auto',
  },
  quantity: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
});

