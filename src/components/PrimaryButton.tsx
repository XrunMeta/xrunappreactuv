import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, GestureResponderEvent } from 'react-native';
import { COLORS, FONTS } from '../constants';
import { trackEvent } from '../services/clickTracker';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  fullWidth?: boolean;

  trackKey?: string;

  trackParams?: Record<string, unknown>;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  fullWidth = false,
  style,
  disabled,
  trackKey,
  trackParams,
  onPress,
  ...props
}) => {
  const handlePress = (e: GestureResponderEvent) => {
    if (trackKey) {
      trackEvent('primary_button_click', {
        category: 'button',
        elementKey: trackKey,
        elementText: title,
        params: trackParams,
      });
    }
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      activeOpacity={0.8}
      onPress={handlePress}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    width: 780,
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: FONTS.size.medium,
    fontWeight: '500',
    lineHeight: 24,
    fontFamily: 'Roboto-Medium', 
  },
});

