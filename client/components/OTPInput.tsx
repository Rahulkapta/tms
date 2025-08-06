import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  onOtpChange?: (otp: string[]) => void;
}

export default function OTPInput({ length, onComplete, onOtpChange }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Call the onOtpChange callback if provided
    if (onOtpChange) {
      onOtpChange(newOtp);
    }

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={styles.input}
          value={digit}
          onChangeText={(text) => handleOtpChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          textAlign="center"
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  input: {
    width: 48,
    height: 56,
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    fontSize: 16,
    color: '#111418',
    borderWidth: 2,
    borderColor: 'transparent',
  },
}); 