import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { FONTS, SIZES } from '../constants';

interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedControlOption<T>>;
  value: T;
  onChange: (value: T) => void;
  containerStyle?: ViewStyle;
  hideIndicator?: boolean;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  containerStyle,
  hideIndicator = false,
}: SegmentedControlProps<T>) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionWrapper,
              isActive && styles.optionActive,
              isActive && !hideIndicator && styles.optionActiveWithIndicator,
            ]}
            activeOpacity={0.85}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.optionLabel, isActive ? styles.optionLabelActive : styles.optionLabelInactive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ebeff5',
    borderWidth: 1,
    borderColor: '#dfe3eb',
    borderRadius: SIZES.small,
    padding: 4,
    gap: 8,
  },
  optionWrapper: {
    flex: 1,
    height: 40,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: SIZES.small,
    elevation: 2,
  },
  optionActiveWithIndicator: {
    borderBottomWidth: 3,
    borderBottomColor: '#ffdc04',
  },
  optionLabel: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    textAlign: 'center',
  },
  optionLabelActive: {
    color: '#111111',
  },
  optionLabelInactive: {
    color: '#a3adc2',
  },
});


