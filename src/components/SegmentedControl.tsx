import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedControlOption<T>>;
  value: T;
  onChange: (value: T) => void;
  containerStyle?: ViewStyle;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  containerStyle,
}: SegmentedControlProps<T>) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.optionWrapper, isActive && styles.optionActive]}
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
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    gap: 8,
  },
  optionWrapper: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
  optionLabelActive: {
    color: '#111111',
  },
  optionLabelInactive: {
    color: '#747474',
  },
});


