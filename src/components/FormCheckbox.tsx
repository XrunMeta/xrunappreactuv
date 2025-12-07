import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../constants';
import { FONTS } from '../constants';

type CheckboxVariant = 'square' | 'circle';

interface FormCheckboxProps {
  label?: string;
  checked: boolean;
  onToggle: () => void;
  variant?: CheckboxVariant;
  style?: StyleProp<ViewStyle>;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  checked,
  onToggle,
  variant = 'square',
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.indicatorBase,
          variant === 'circle' ? styles.circle : styles.square,
          checked && styles.indicatorChecked,
          variant === 'circle' && checked && styles.circleChecked,
        ]}
      >
        {checked &&
          (variant === 'circle' ? (
            <View style={styles.circleDot} />
          ) : (
            <View style={styles.squareCheck} />
          ))}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indicatorBase: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: 12,
  },
  square: {
    borderRadius: 8,
  },
  indicatorChecked: {
    borderColor: COLORS.buttonPrimary,
    backgroundColor: COLORS.buttonPrimary,
  },
  circleChecked: {
    backgroundColor: 'transparent',
  },
  circleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.buttonPrimary,
  },
  squareCheck: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderLeftColor: '#ffffff',
    borderBottomColor: '#ffffff',
    transform: [{ rotate: '-45deg' }],
  },
  label: {
    fontSize: FONTS.size.ssmall,
    color: '#2a2727',
    fontFamily: 'Roboto-Bold',
  },
});


