import React, { useState } from "react";

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import api from "@/utils/api";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ProjectCardProps {
  id: string;
  title: string;
  taskCount: number;
  onPress?: () => void;
}

export default function ProjectCard({
  id,
  title,
  taskCount,
  onPress,
}: ProjectCardProps) {
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [modelvisible, setmodelvisible] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const userRole = currentUser?.role; 
  const canDeleteProject = userRole === "ADMIN" || userRole === "SUPER ADMIN";


  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={taskToDelete === id ? 1 : 0.2}
      onPress={onPress}
      onLongPress={() => {
        if (canDeleteProject) {
          setTaskToDelete(id);
          setmodelvisible(true);
          
        }
      }}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name="folder"
          size={32}
          color={Colors.iconContainer.icon}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.taskCount} numberOfLines={2}>
          {taskCount} tasks
        </Text>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={modelvisible}
        onRequestClose={() => setmodelvisible(false)} // For Android back button
      >
        <TouchableOpacity
          style={styles.modalOverlay} // covers full screen
          activeOpacity={1}
          onPress={() => setmodelvisible(false)} // close modal on backdrop press
        >
          <View style={styles.modalContent} pointerEvents="box-none">
            {/* Your modal inner content */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Confirm Delete",
                  "Are you sure you want to delete this project?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                      onPress: () => {
                        // Do nothing on cancel
                        console.log("Delete cancelled");
                      },
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          // Call your API delete endpoint here, passing taskToDelete or project id
                          await api.delete(`/projects/${taskToDelete}`);

                          // Optionally close the modal and update UI state
                          setmodelvisible(false);
                          setTaskToDelete(null);
                         router.replace("/project")
                          // Update parent state to remove project from list if applicable
                        } catch (error:any) {
                          Alert.alert(
                            "Failed to delete the project. Please try again.", error
                          );
                        }
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }}
            >
              <Entypo name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.iconContainer.iconBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111418",
    lineHeight: 20,
  },
  taskCount: {
    fontSize: 14,
    fontWeight: "400",
    color: "#60758a",
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    // Add width/height or other styles as needed
  },
});
