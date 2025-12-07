import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS } from '../constants';


interface OptionButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  flex?: number;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  selected,
  onPress,
  style,
  flex,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected && styles.selected,
        disabled && styles.disabled,
        typeof flex === 'number' && { flex },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.label, selected && styles.labelSelected, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    minWidth: 60,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e9ed',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  selected: {
    backgroundColor: COLORS.buttonPrimary,
    borderColor: COLORS.buttonPrimary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: FONTS.size.ssmall,
    fontFamily: 'Roboto-Bold',
    color: '#2a2727',
  },
  labelSelected: {
    color: '#ffffff',
  },
  labelDisabled: {
    opacity: 0.6,
  },
});


