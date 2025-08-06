import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
} from 'react-native';
import { formStyles } from './ui/formStyles';  // import shared styles

interface InputProps extends TextInputProps {
  error?: boolean;
}

export default function Input({ error, style, ...props }: InputProps) {
  return (
    <TextInput
      style={[
        formStyles.input,   //apply shared input style
        error && styles.inputError,
        style,
      ]}
      placeholderTextColor="#60758a"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  inputError: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
});
