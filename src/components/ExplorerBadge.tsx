import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { FONTS } from '../constants';

interface ExplorerBadgeProps {
  label: string;
  caption?: string;
  iconSource: ImageSourcePropType;
  onPress?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  captionStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
}

export const ExplorerBadge: React.FC<ExplorerBadgeProps> = ({
  label,
  caption,
  iconSource,
  onPress,
  compact = false,
  style,
  labelStyle,
  captionStyle,
  iconStyle,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, compact && styles.compactContainer, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image
        source={iconSource}
        style={[styles.icon, compact && styles.compactIcon, iconStyle]}
        resizeMode="contain"
      />
      <View style={styles.textColumn}>
        <Text
          style={[styles.label, compact && styles.compactLabel, labelStyle]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {caption ? (
          <Text
            style={[
              styles.caption,
              compact && styles.compactCaption,
              captionStyle,
            ]}
            numberOfLines={1}
          >
            {caption}
          </Text>
        ) : null}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  compactContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  icon: {
    width: 24,
    height: 24,
  },
  compactIcon: {
    width: 18,
    height: 18,
  },
  label: {
    fontSize: FONTS.fontSize.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  caption: {
    fontSize: FONTS.fontSize.small,
    fontFamily: 'Roboto-Regular',
    color: '#5f6478',
  },
  compactLabel: {
    fontSize: FONTS.fontSize.ssmall,
    color: '#1f6880',
  },
  compactCaption: {
    fontSize: FONTS.fontSize.xsmall,
  },
  textColumn: {
    justifyContent: 'center',
  },
});


