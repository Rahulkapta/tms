import React from "react";

import { StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";




interface ProjectCardProps {
  id: string;
  title: string;
  taskCount: number;
  onPress?: () => void;
}

export default function ProjectCard({
  title,
  taskCount,
  onPress,
}: ProjectCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
       <View style={styles.iconContainer}>
      <MaterialIcons name="folder" size={32} color={Colors.iconContainer.icon} />
    </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.taskCount} numberOfLines={2}>
          {taskCount} tasks
        </Text>
      </View>
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
});
