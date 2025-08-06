import { loginSuccess } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import api from "@/utils/api";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function LoginScreen() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [otpPin, setOtpPin] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedOtpPin = otpPin.trim();
    if (!trimmedEmail || !trimmedOtpPin) {
      Alert.alert("Validation", "Please enter both email and OTP pin.");
      return;
    }

    setLoading(true);

    try {
      const { data: res } = await api.post("/auth/login", {
        email: trimmedEmail,
        otpPin: trimmedOtpPin,
      });

      if (res.httpStatus === 200) {
        const user = res.data.user;
        // Store in Redux
        dispatch(loginSuccess(user));

        router.replace( "/project");
      } else {
        Alert.alert("Login Failed", res.message || "Invalid credentials");
      }
    } catch (error: any) {
      if (error.response) {
        const res = error.response.data;
        Alert.alert("Login Failed", res.message || "Invalid credentials");
      } else if (error.request) {
        Alert.alert(
          "Network Error",
          "Failed to connect to server. Please try again later."
        );
      } else {
        Alert.alert("Error", error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.appTitle}>TMS</Text>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="OTP Pin"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={otpPin}
          onChangeText={setOtpPin}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f6f8fa",
    paddingVertical: 40,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: "#a1c6ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#555",
    fontSize: 16,
  },
  registerLink: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
