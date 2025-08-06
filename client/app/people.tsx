import BottomNavigation from "@/components/BottomNavigation";
import { getInitials } from "@/utils/common.utils";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Entypo } from "@expo/vector-icons";

export interface IUser {
  _id: string;
  email: string;
  roleId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  details: {
    name: {
      first: string;
      last: string;
    };
    mobileNumber: string;
    designation: string;
  };
}

export default function PeopleScreen() {
  // State to hold the list of users fetched from the backend
  const [users, setUsers] = useState<IUser[]>([]);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  // ---------------------- Permission & Add project Mode ----------------------
  const userRole = currentUser?.role; // This should ideally come from auth state
  const canAddProject = userRole === "ADMIN" || userRole === "SUPER ADMIN";

  // useFocusEffect is similar to useEffect but runs when this screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Async function to fetch user details from API endpoint
      const fetchUserDetails = async () => {
        try {
          const response = await api.get("/users"); // Fetch list of users
          if (response.status === 200) {
            // Success: update users state with received data
            setUsers(response.data.data);
          } else {
            // API responded with an error status
            Alert.alert(
              "Error",
              response.data?.message || "Failed to load user details"
            );
          }
        } catch (error: any) {
          // Handle different types of errors and show user-friendly alerts
          if (error.response) {
            // Received response with error status from server
            const res = error.response.data;
            Alert.alert("Login Failed", res.message || "Invalid credentials");
          } else if (error.request) {
            // No response received after making request
            Alert.alert(
              "Network Error",
              "Could not fetch user details. Please try again later."
            );
          } else {
            // Other unexpected errors
            Alert.alert(
              "Error",
              error.message || "An unexpected error occurred."
            );
          }
        }
      };

      // Trigger the API call when the screen is focused
      fetchUserDetails();
    }, [])
  );

  // Navigates to the 'Add People' screen when invoked
  const handleAddPerson = () => {
    router.push("/add-people");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section with Title and Add button */}
        <View style={styles.header}>
          <View style={{ width: 24 }}></View>
          <Text style={styles.headerTitle}>People</Text>
          {canAddProject ? (
            <TouchableOpacity onPress={handleAddPerson}>
              <Entypo name="plus" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        {/* Scrollable list of users */}
        <ScrollView
          style={styles.membersList}
          showsVerticalScrollIndicator={false}
        >
          {users.map((member) => {
            // Get initials from user's first and last name for display fallback

            const initials = getInitials(
              member.details.name.first,
              member.details.name.last
            );

            return (
              <View key={member._id} style={styles.memberItem}>
                {/* Display avatar if available, else show initials */}
                {member.avatar ? (
                  <Image
                    source={{ uri: member.avatar }}
                    style={styles.memberAvatar}
                  />
                ) : (
                  <View style={styles.initialsCircle}>
                    <Text style={styles.initialsText}>{initials}</Text>
                  </View>
                )}

                {/* User's name and designation */}
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName} numberOfLines={1}>
                    {member.details.name.first} {member.details.name.last}
                  </Text>
                  <Text style={styles.memberRole} numberOfLines={2}>
                    {member.details.designation}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Bottom tab navigation with active tab highlighted */}
      <BottomNavigation activeTab="people" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Screen background color
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row", // Horizontal layout for header elements
    alignItems: "center",
    justifyContent: "space-between", // Spacing between title and button
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  headerSpacer: {
    width: 48, // Empty space to balance the header layout
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111518",
    letterSpacing: -0.015,
    flex: 1,
    textAlign: "center", // Center the title text
  },
  addButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#111518",
    fontWeight: "bold",
  },
  membersList: {
    flex: 1,
  },
  memberItem: {
    flexDirection: "row", // Horizontal layout for avatar and user info
    alignItems: "center",
    gap: 16,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 8,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28, // Circular avatar
  },
  initialsCircle: {
    width: 56,
    height: 56,
    borderRadius: 28, // Circular background for initials
    backgroundColor: Colors.iconContainer.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 20,
    color: Colors.iconContainer.icon,
    fontWeight: "bold",
  },
  memberInfo: {
    flex: 1,
    justifyContent: "center",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111518",
    lineHeight: 20,
  },
  memberRole: {
    fontSize: 14,
    fontWeight: "400",
    color: "#60768a",
    lineHeight: 18,
  },
});
