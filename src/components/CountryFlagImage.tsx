

import React, { useState } from 'react';
import { Image, ImageStyle, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  isoCode: string; 
  flagEmoji?: string; 
  size?: number; 
  style?: ViewStyle | ImageStyle;
};

export const CountryFlagImage: React.FC<Props> = ({
  isoCode,
  flagEmoji = '🌐',
  size = 40,
  style,
}) => {
  const [useEmoji, setUseEmoji] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!isoCode || isoCode.length !== 2) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Text style={[styles.emoji, { fontSize: size * 0.55 }]}>{flagEmoji}</Text>
      </View>
    );
  }

  if (useEmoji || imageError) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Text style={[styles.emoji, { fontSize: size * 0.55 }]}>{flagEmoji}</Text>
      </View>
    );
  }

  const imageUrl = `https://flagcdn.com/w${size}/${isoCode.toLowerCase()}.png`;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { width: size, height: size }]}
        onError={() => {
          if (__DEV__) {
            console.warn('[CountryFlagImage] 이미지 로드 실패, emoji fallback 사용:', {
              isoCode,
              imageUrl,
            });
          }
          setImageError(true);
          setUseEmoji(true);
        }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
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

