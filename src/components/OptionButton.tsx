import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../constants';

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  flex?: number;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  selected,
  onPress,
  style,
  flex,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected && styles.selected,
        typeof flex === 'number' && { flex },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    minWidth: 56,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e9ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  selected: {
    backgroundColor: COLORS.buttonPrimary,
    borderColor: COLORS.buttonPrimary,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#2a2727',
  },
  labelSelected: {
    color: '#ffffff',
  },
});


