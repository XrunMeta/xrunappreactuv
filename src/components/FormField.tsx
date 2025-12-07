import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useKeyboardScroll } from '../context/KeyboardScrollContext';
import { FONTS } from '../constants';

interface FormFieldProps extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightAccessory?: React.ReactNode;
  leftAccessory?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  containerStyle,
  rightAccessory,
  leftAccessory,
  style,
  placeholderTextColor = '#dedede',
  onFocus,
  ...inputProps
}) => {
  const keyboardScroll = useKeyboardScroll();

  const handleFocus = (event: any) => {

    if (keyboardScroll) {
      keyboardScroll.scrollToFocusedInput(event);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {leftAccessory ? <View style={styles.leftAccessory}>{leftAccessory}</View> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={placeholderTextColor}
          onFocus={handleFocus}
          {...inputProps}
        />
        {rightAccessory ? (
          <View style={styles.rightAccessory}>{rightAccessory}</View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',

  },
  label: {
    fontSize: FONTS.fontSize.medium,
    lineHeight: 24,
    color: '#2a2727',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dedede',
    backgroundColor: '#fefefe',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: FONTS.fontSize.msmall,
    color: '#2a2727',
    fontFamily: 'Roboto-Bold',
    paddingVertical: 0,
  },
  leftAccessory: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAccessory: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

