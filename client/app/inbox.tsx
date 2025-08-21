import BottomNavigation from "@/components/BottomNavigation";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import api from "@/utils/api";
import { getTimeAgo } from "@/utils/timeUtils";
import { IUser } from "./people";
import { Foundation } from "@expo/vector-icons";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "project_created" | string; // extend union as needed
  data: any;
  read: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export default function InboxScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // List of all users fetched from backend for manager/employee selection
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications");
      const result = response.data;
      if (result.success) {
        setNotifications(result.data.notifications);
      } else {
        throw new Error(result.message || "Failed to load notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users to get only employees
  const Employees = useMemo(() => {
    return users.filter((p) => p.details.designation === "Employee");
    // use optional chaining if needed: p.details?.designation === "Employee"
  }, [users]);

  const getAssigneeNames = (assigneeIds: string[]) => {
    if (!assigneeIds || assigneeIds.length === 0) {
      return "No assignees";
    }

    const names = assigneeIds.map((id) => {
      const employee = Employees.find((e) => e._id === id);
      const fullName = employee
        ? `${employee.details.name.first} ${
            employee.details.name.last ?? ""
          }`.trim()
        : "";

      return fullName;
    });
    // Filter out empty strings and join with commas
    const filtered = names.filter((name) => name.length > 0);
    return filtered.length > 0 ? filtered.join(", ") : "No assignees";
  };

  // Filter users to get only managers
  const Managers = useMemo(() => {
    return users.filter(
      (p) => p.details.designation === "Manager" || "Super Admin"
    );
  }, [users]);
  const getManagerName = (managerId: string) => {
    const manager = Managers.find((m) => m._id === managerId);
    const fullName = `${manager?.details.name.first} ${
      manager?.details.name.last ?? ""
    }`.trim();
    return manager ? fullName : "Unknown";
  };

  // Fetch users from backend endpoint on mount, to populate managers and employees lists
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get("/users");
        if (response.status === 200) {
          setUsers(response.data.data);
        } else {
          Alert.alert(
            "Error",
            response.data?.message || "Failed to load user details"
          );
        }
      } catch (error: any) {
        if (error.response) {
          const res = error.response.data;
          Alert.alert("Login Failed", res.message || "Invalid credentials");
        } else if (error.request) {
          Alert.alert(
            "Network Error",
            "Could not fetch user details. Please try again later."
          );
        } else {
          Alert.alert(
            "Error",
            error.message || "An unexpected error occurred."
          );
        }
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  const renderNotificationItem: ListRenderItem<Notification> = ({
    item: notif,
  }) => (
    <View key={notif._id} style={styles.activityItem}>
      <View style={styles.activityContent}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>
            {getManagerName(notif.userId)
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "SA"}
          </Text>
        </View>

        {/* Notification Info */}
        <View style={styles.activityInfo}>
          {notif.type === "comment_added" && (
            <View>
            <Text style={styles.activityTitle}>
              {`${getManagerName(
                notif.data.comment.createdBy
              )} commented on "${notif.data.ticketExists.title}" task:`}
            </Text>
            <Text style={styles.activityMessage} numberOfLines={2}>
            {notif.data.comment.text}
          </Text>
            </View>
            
          )}

            {notif.type !== "comment_added" && (
            <View>
            <Text style={styles.activityTitle} numberOfLines={1}>
            {notif.title}
          </Text>
          <Text style={styles.activityMessage} numberOfLines={2}>
            {notif.message}
          </Text>
            </View>
            
          )}
          

          {(notif.type === "task_created" || notif.type === "task_updated") && (
            <View style={styles.projectDetails}>
              {notif.type === "task_created" && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created by:</Text>
                  <Text style={styles.detailValue}>
                    {getManagerName(notif.userId)}
                  </Text>
                </View>
              )}
              {notif.type === "task_updated" && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Updated by:</Text>
                  <Text style={styles.detailValue}>
                    {getManagerName(notif.data.project.updatedBy)}
                  </Text>
                </View>
              )}

              {/* Assigned People */}
              {notif.data.project.assignedTo &&
                notif.data.project.assignedTo.length > 0 && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Assigned to:</Text>
                    <Text style={styles.detailValue}>
                      {getAssigneeNames(notif.data.project.assignedTo)}
                    </Text>
                  </View>
                )}

              {notif.data.project.priority && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Priority:</Text>
                  <Text style={styles.detailValue}>
                    {notif.data.project.priority}
                  </Text>
                </View>
              )}

              {notif.type === "task_updated" && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.detailValue}>
                    {notif.data.project.status}
                  </Text>
                </View>
              )}

              {/* Project Duration */}
              {notif.data.project.startDate && notif.data.project.endDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(
                      notif.data.project.startDate
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(notif.data.project.endDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Project-specific details */}
          {(notif.type === "project_created" ||
            notif.type === "project_updated") &&
            notif.data?.project && (
              <View style={styles.projectDetails}>
                {notif.type === "project_updated" && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Updated Name:</Text>
                    <Text style={styles.detailValue}>
                      {notif.data.project.name}
                    </Text>
                  </View>
                )}
                {/* Manager - Updated section */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Manager:</Text>
                  <Text style={styles.detailValue}>
                    {getManagerName(notif.data.project.manager)}
                  </Text>
                </View>

                {notif.type === "project_updated" && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Updated by:</Text>
                    <Text style={styles.detailValue}>
                      {getManagerName(notif.data.project.updatedBy)}
                    </Text>
                  </View>
                )}

                {/* Created By */}
                {notif.type === "project_created" && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Created by:</Text>
                    <Text style={styles.detailValue}>
                      {getManagerName(notif.userId)}
                    </Text>
                  </View>
                )}

                {/* Assigned People */}
                {notif.data.project.assignedPeople &&
                  notif.data.project.assignedPeople.length > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Assigned to:</Text>
                      <Text style={styles.detailValue}>
                        {getAssigneeNames(notif.data.project.assignedPeople)}
                      </Text>
                    </View>
                  )}

                {/* Project Duration */}
                {notif.data.project.startDate && notif.data.project.endDate && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(
                        notif.data.project.startDate
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        notif.data.project.endDate
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            )}
        </View>
      </View>
      <Text style={styles.activityTime}>{getTimeAgo(notif.createdAt)}</Text>
    </View>
  );

  // Empty state component
  const renderEmptyComponent = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No notifications.</Text>
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Fetch both notifications and users
      await Promise.all([
        fetchNotifications(),
      ]);
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Key extractor function
  const keyExtractor = (item: Notification) => item._id;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style ={{width:24}}></View>
          <Text style={styles.headerTitle}>Activity</Text>
          <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
            <Foundation 
              name="refresh" 
              size={24} 
              color={refreshing ? "#999" : "black"} 
            />
          </TouchableOpacity>
        </View>

        {/* Activity Feed with FlatList */}
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={keyExtractor}
          style={styles.flatList}
          contentContainerStyle={[
            styles.listContent,
            notifications.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="inbox" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  content: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row", // Horizontal layout for header elements
    alignItems: "center",
    justifyContent: "space-between", // Spacing between title and button
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111518",
    letterSpacing: -0.015,
    flex: 1,
    textAlign: "center", // Center the title text
  },
  activityList: { flex: 1 },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  activityContent: { flexDirection: "row", flex: 1 },
  activityAvatar: { width: 40, height: 40, borderRadius: 20 },
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
  activityInfo: { flex: 1, marginLeft: 12 },
  activityTitle: { fontSize: 16, fontWeight: "600" },
  activityProject: { fontSize: 14, color: "#555", marginTop: 4 },
  activityMessage: { fontSize: 12, color: "#777", marginTop: 2 },
  activityTime: { fontSize: 12, color: "#AAA", marginLeft: 8 ,padding: 6,},
  emptyState: { flex: 1, alignItems: "center", marginTop: 100 },
  emptyText: { fontSize: 16, color: "#999" },
  projectDetails: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#007bff",
  },

  projectName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  detailLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    flex: 1,
  },

  detailValue: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "400",
    flex: 2,
    textAlign: "right",
  },

  statusContainer: {
    marginTop: 6,
    alignItems: "flex-start",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  todoStatus: {
    backgroundColor: "#e3f2fd",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1976d2",
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
