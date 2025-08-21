import Input from "@/components/Input";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import api from "@/utils/api";
import { Entypo } from "@expo/vector-icons";

const ROLES = ["ADMIN", "EMPLOYEE", "CUSTOMER"];
const DESIGNATIONS = ["Manager", "Employee"]; // example items

export default function AddPeopleScreen() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    designation: "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [pickerField, setPickerField] = useState<"role" | "designation" | null>(
    null
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showPicker = (field: "role" | "designation") => {
    setPickerField(field);
  };
  const selectPickerValue = (value: string) => {
    if (pickerField) {
      handleInputChange(pickerField, value);
      setPickerField(null);
    }
  };

  const handleAddPerson = async () => {
    // 1. Detailed field validation
    if (!formData.firstName.trim()) {
      Alert.alert("Validation Error", "First name is required.");
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert("Validation Error", "Email address is required.");
      return;
    }
    if (!formData.role.trim()) {
      Alert.alert(
        "Validation Error",
        "Please select a role (ADMIN, EMPLOYEE, or CUSTOMER)."
      );
      return;
    }
    if (!formData.mobileNumber.trim()) {
      Alert.alert("Validation Error", "Mobile number is required.");
      return;
    }

    setLoading(true);

    try {
      const { data: res } = await api.post("/auth/register", formData);

      // 2. Success: include first name and role in message
      if (res.httpStatus === 200 || res.httpStatus === 201) {
        Alert.alert(
          "User Added",
          `${formData.firstName} ${formData.lastName} (${formData.role}) has been successfully registered.`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        // 3a. API-level failure
        Alert.alert(
          "Registration Failed",
          res.message || "Unable to add the user. Please try again."
        );
      }
    } catch (error: any) {
      // 3b. Network or unexpected error
      if (error.response) {
        const serverMsg = error.response.data?.message;
        Alert.alert(
          "Server Error",
          serverMsg || "Failed to register. Try again later."
        );
      } else if (error.request) {
        Alert.alert(
          "Network Error",
          "Cannot reach server. Check your connection and try again."
        );
      } else {
        Alert.alert(
          "Unexpected Error",
          error.message || "An error occurred. Please try again."
        );
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.firstName.trim() &&
    formData.email.trim() &&
    formData.role &&
    formData.mobileNumber.trim();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Entypo name="cross" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Person</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <Input
              placeholder="Enter first name"
              value={formData.firstName}
              onChangeText={(val) => handleInputChange("firstName", val)}
              style={styles.roundedInput}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <Input
              placeholder="Enter last name"
              value={formData.lastName}
              onChangeText={(val) => handleInputChange("lastName", val)}
              style={styles.roundedInput}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <Input
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(val) => handleInputChange("email", val)}
              style={styles.roundedInput}
            />
          </View>

          {/* Role */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <TouchableOpacity
              style={[styles.roundedInput, styles.selectContainer]}
              onPress={() => showPicker("role")}
            >
              <Text
                style={
                  formData.role ? styles.selectText : styles.placeholderText
                }
              >
                {formData.role || "Select role"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Designation */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Designation</Text>
            <TouchableOpacity
              style={[styles.roundedInput, styles.selectContainer]}
              onPress={() => showPicker("designation")}
            >
              <Text
                style={
                  formData.designation
                    ? styles.selectText
                    : styles.placeholderText
                }
              >
                {formData.designation || "Select designation"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mobile Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <Input
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              value={formData.mobileNumber}
              onChangeText={(val) => handleInputChange("mobileNumber", val)}
              style={styles.roundedInput}
            />
          </View>
        </ScrollView>
      </View>

      {/* Add Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            loading && styles.buttonDisabled,
            !isFormValid && styles.buttonDisabled,
          ]}
          onPress={handleAddPerson}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Picker Modal */}
      <Modal visible={!!pickerField} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setPickerField(null)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={pickerField === "role" ? ROLES : DESIGNATIONS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => selectPickerValue(item)}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
 
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: { width: 48 },
  form: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 6, fontSize: 16, fontWeight: "500", color: "#111518" },
  roundedInput: {
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    color: "#111518",
  },
  selectContainer: { justifyContent: "center" },
  selectText: { color: "#111518" },
  placeholderText: { color: "#60768a" },
  buttonContainer: { padding: 16, backgroundColor: "#fff" },
  addButton: {
    backgroundColor: "#0b80ee",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  // addButtonDisabled: { backgroundColor: "#ccc" },
  buttonDisabled: {
    backgroundColor: "#a1c6ff",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
});
