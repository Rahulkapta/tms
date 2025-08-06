import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = () => {
    if (phoneNumber.trim()) {
      // Navigate to OTP verification screen
      router.push('/otp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <Header title="ProjectFlow" />

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            
            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Input
                placeholder="Phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            {/* Send OTP Button */}
            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              disabled={!phoneNumber.trim()}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111418',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.015,
  },
  inputContainer: {
    marginBottom: 16,
  },
  footer: {
    paddingBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#60758a',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 