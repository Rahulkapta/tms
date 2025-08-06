import BottomNavigation from "@/components/BottomNavigation";
import { getInitials } from "@/utils/common.utils";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AntDesign } from "@expo/vector-icons";
const user = {
  id: "1",
  email:"sophia.carter@email.com",
  name: "Sophia Chen",
  firstName: "Sophia",
  lastName: "Chen",
  role: "Product Designer",
  avatar: "",
};


export default function SettingsScreen() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const handleLogout = () => {
    // Handle logout functionality
    console.log("Logout pressed");
    // Navigate to login screen
    router.replace("/");
  };

  const handleAddProfilePhoto = () => {
    // Handle adding profile photo
    console.log("Add profile photo pressed");
  };

  const handleChangeName = () => {
    // Handle changing name
    console.log("Change name pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileInitialsCircle}>
                  <Text style={styles.profileInitialsText}>
                    {getInitials(currentUser?.userDetails.name.first, currentUser?.userDetails.name.last)}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{`${currentUser?.userDetails.name.first} ${currentUser?.userDetails.name.last}`}</Text>
              <Text style={styles.profileEmail}>{currentUser?.email}</Text>
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleAddProfilePhoto}
          >
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>📷</Text>
            </View>
            <Text style={styles.settingText}>Add profile photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangeName}
          >
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>✏️</Text>
            </View>
            <Text style={styles.settingText}>Change name</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#111518",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111518",
    letterSpacing: -0.015,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 48,
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
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  profileInitialsCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.iconContainer.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitialsText: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.iconContainer.icon,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111518",
    letterSpacing: -0.015,
    textAlign: "center",
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: "400",
    color: "#60768a",
    textAlign: "center",
  },
  settingsList: {
    flex: 1,
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
