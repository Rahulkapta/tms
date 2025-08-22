import BottomNavigation from "@/components/BottomNavigation";
import { getInitials } from "@/utils/common.utils";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          console.log("Logout confirmed");
          SecureStore.deleteItemAsync("access_token");
          router.replace("/(auth)");
        },
      },
    ]);
  };
  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing is coming soon!", [
      { text: "OK" },
    ]);
    // Navigate to edit profile screen
  };

  const handleChangePassword = () => {
    Alert.alert("Change Password", "Change Password is coming soon!", [
      { text: "OK" },
    ]);

    // Navigate to change password screen
  };

  const handleNotificationSettings = () => {
    Alert.alert(
      "Notification Setting",
      "Notification Setting is coming soon!",
      [{ text: "OK" }]
    );
    // Navigate to notification settings
  };

  const handlePrivacySettings = () => {
    Alert.alert("Privacy Setting", "Privacy Setting is coming soon!", [
      { text: "OK" },
    ]);
    // Navigate to privacy settings
  };

  const handleSupport = () => {
    Alert.alert("Support ", "This is coming soon!", [{ text: "OK" }]);
    // Navigate to support/help
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileContainer}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileInitialsCircle}>
                  <Text style={styles.profileInitialsText}>
                    {getInitials(
                      currentUser?.userDetails.name.first,
                      currentUser?.userDetails.name.last
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text
                  style={styles.profileName}
                >{`${currentUser?.userDetails.name.first} ${currentUser?.userDetails.name.last}`}</Text>
                <View style={styles.designationContainer}>
                  <MaterialIcons
                    name="work"
                    size={16}
                    color={Colors.iconContainer.icon}
                  />
                  <Text style={styles.designation}>
                    {currentUser?.userDetails.designation}
                  </Text>
                </View>
                <Text style={styles.profileEmail}>{currentUser?.email}</Text>
              </View>
            </View>
          </View>
          {/* Contact Information Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Feather
                  name="mail"
                  size={18}
                  color={Colors.iconContainer.icon}
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{currentUser?.email}</Text>
              </View>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Feather
                  name="phone"
                  size={18}
                  color={Colors.iconContainer.icon}
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Mobile</Text>
                <Text style={styles.contactValue}>
                  {currentUser?.userDetails.mobileNumber}
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Options */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleEditProfile}
            >
              <View style={styles.settingIcon}>
                <Feather
                  name="edit-3"
                  size={20}
                  color={Colors.iconContainer.icon}
                />
              </View>
              <Text style={styles.settingText}>Edit Profile</Text>
              <AntDesign name="right" size={16} color={"#9ca3af"} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleChangePassword}
            >
              <View style={styles.settingIcon}>
                <Feather
                  name="lock"
                  size={20}
                  color={Colors.iconContainer.icon}
                />
              </View>
              <Text style={styles.settingText}>Change Password</Text>
              <AntDesign name="right" size={16} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleNotificationSettings}
            >
              <View style={styles.settingIcon}>
                <Feather
                  name="bell"
                  size={20}
                  color={Colors.iconContainer.icon}
                />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
              <AntDesign name="right" size={16} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handlePrivacySettings}
            >
              <View style={styles.settingIcon}>
                <Feather
                  name="shield"
                  size={20}
                  color={Colors.iconContainer.icon}
                />
              </View>
              <Text style={styles.settingText}>Privacy & Security</Text>
              <AntDesign name="right" size={16} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleSupport}
            >
              <View style={styles.settingIcon}>
                <Feather
                  name="help-circle"
                  size={20}
                  color={Colors.iconContainer.icon}
                />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
              <AntDesign name="right" size={16} color="#9ca3af" />
            </TouchableOpacity>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="settings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111518",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },

  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileContainer: {
    alignItems: "center",
    gap: 16,
  },
  profileImageContainer: {
    alignItems: "center",
  },

  profileInitialsCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.iconContainer.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitialsText: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.iconContainer.icon,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111518",
    marginBottom: 8,
  },
  designationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  designation: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.iconContainer.icon,
    marginLeft: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#64748b",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.iconContainer.iconBackground,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.iconContainer.iconBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  iconText: {
    fontSize: 20,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111518",
    flex: 1,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  logoutButton: {
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111518",
    letterSpacing: 0.015,
  },
});
