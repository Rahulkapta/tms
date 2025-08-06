import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
} from 'react-native';

interface TextAreaProps extends TextInputProps {
  error?: boolean;
}

export default function TextArea({ error, style, ...props }: TextAreaProps) {
  return (
    <TextInput
      style={[
        styles.textArea,
        error && styles.textAreaError,
        style,
      ]}
      placeholderTextColor="#60758a"
      multiline
      textAlignVertical="top"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textArea: {
    minHeight: 144,
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111418',
    borderWidth: 0,
  },
  textAreaError: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
}); 