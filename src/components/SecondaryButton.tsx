import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle } from 'react-native';
import { COLORS, FONTS } from '../constants';

interface SecondaryButtonProps extends TouchableOpacityProps {
  title: string;
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
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
    backgroundColor: COLORS.buttonSecondary,
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
    color: '#000000',
    fontSize: FONTS.fontSize.medium,
    fontWeight: '500',
    lineHeight: 24,
    fontFamily: 'Roboto-Medium', 
  },
});

