import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import TabNavigation from "@/components/TabNavigation";
import TaskCard from "@/components/TaskCard";
import { Icons } from "@/assets/icons";

import api from "@/utils/api";
import { IUser } from "./people";
import { AntDesign, Entypo } from "@expo/vector-icons";

/**
 * Interface representing attachments related to a ticket.
 * Adjust fields to fit the real attachment schema.
 */
interface IAttachment {
  filename: string;
  url: string;
  mimetype?: string;
  size?: number;
}

/**
 * Interface representing a ticket/task as per the project's data schema.
 */
export interface ITicket {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assignedTo?: string[];
  startDate?: Date;
  endDate?: Date;
  createdBy: string;
  updatedBy?: string;
  tags: string[];
  attachments: IAttachment[];
  createdAt?: Date; // added by timestamps
  updatedAt?: Date; // added by timestamps
}

/**
 * Screen component to display and manage tasks for a selected project.
 */
export default function ProjectTasksScreen() {
  // Get the currently selected project from the Redux store
  const selectedProject = useSelector(
    (state: RootState) => state.project.selectedProject
  );

  const currentUser = useSelector((state: RootState) => state.auth.user);

  // ---------------------- Permission & Add task Mode ----------------------
  const userRole = currentUser?.role; // This should ideally come from auth state
  const canAddTask = userRole === "ADMIN" || userRole === "SUPER ADMIN";

  // State to hold list of tasks fetched from the API
  const [tasks, setTasks] = useState<ITicket[]>([]);

  // State to track the currently active tab
  const [activeTab, setActiveTab] = useState("To Do");

  // Loading and error states for async task fetching
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [users, setUsers] = useState<IUser[]>([]);

  //fetch users and store them in users state
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

  // Filter users to get only employees
  const Employees = useMemo(() => {
    return users.filter(
      (user) =>
        user.details.designation === "Employee" &&
        selectedProject?.assignedPeople.includes(user._id)
    );
  }, [users, selectedProject?.assignedPeople]);

  // Inside your component, before return:
  // Helper to map IDs → names
  const getAssigneeNames = (ids: string[]) => {
    if (!ids.length) return "Unassigned";
    const names = ids
      .map((id) => {
        const emp = Employees.find((e) => e._id === id);
        if (!emp) return null;
        const { first, last } = emp.details.name;
        return last ? `${first} ${last}` : first;
      })
      .filter(Boolean) as string[];
    return names.join(", ");
  };

  /**
   * Effect hook to fetch tasks whenever the selected project changes.
   */
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchTasks = async () => {
        if (!selectedProject?._id) {
          if (isActive) {
            setTasks([]);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        setError("");

        try {
          const resp = await api.get(`/${selectedProject._id}/tasks`);
          if (isActive) {
            setTasks(resp.data.data);
          }
        } catch (err: any) {
          console.error("Fetch tasks error:", err);
          if (isActive) {
            setError("Failed to load tasks. Please try again.");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchTasks();

      // Cleanup flag when unfocused
      return () => {
        isActive = false;
      };
    }, [selectedProject?._id])
  );

  const getTasksByStatus = (status: string) => {
    return tasks?.filter((task) => task.status === status);
  };

  /**
   * Handler to navigate to screen for adding a new task.
   */
  const handleAddTask = () => {
    router.push({
      pathname: "/new-task",
      params: {
        employees: JSON.stringify(Employees),
      },
    });
  };

  /**
   * Handler to navigate to task details screen.
   */
  const handleTaskPress = (task: ITicket) => {
    router.push({
      pathname: "/task-detail",
      params: {
        task: JSON.stringify(task),
        employees: JSON.stringify(Employees),
        projectId: selectedProject?._id,
        users: JSON.stringify(users),
      },
    });
  };

  // Show error message and retry option if loading tasks failed
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            setError("");
            api
              .get(`/${selectedProject?._id}/tasks`)
              .then((r) => setTasks(r.data.data))
              .catch(() => setError("Failed to load tasks. Please try again."))
              .finally(() => setLoading(false));
          }}
        >
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flexOne}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header with back button, title, and settings icon */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {selectedProject?.name || "Project Tasks"}
            </Text>

            <TouchableOpacity onPress={() => router.push("/update-project")}>
              <Icons.settings width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* Tab navigation for task statuses */}
          <TabNavigation
            activeTab={activeTab}
            onTabPress={setActiveTab}
            tabs={[
              { id: "To Do", label: "To Do" },
              { id: "In Progress", label: "In Progress" },
              { id: "Completed", label: "Completed" },
            ]}
          />

          {/* Task list filtered by active tab status */}
          {loading ? (
            <ActivityIndicator
              style={{ marginTop: 400 }}
              size="large"
              color="#007AFF"
            />
          ) : (
            <ScrollView
              style={styles.taskList}
              showsVerticalScrollIndicator={false}
            >
              {getTasksByStatus(activeTab).length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No tasks found for "{activeTab}"
                  </Text>
                </View>
              ) : (
                getTasksByStatus(activeTab).map((task) => (
                  <TaskCard
                    key={task._id}
                    id={task._id}
                    title={task.title}
                    assignedTo={getAssigneeNames(task.assignedTo ?? [])}
                    status={task.status}
                    onPress={() => handleTaskPress(task)}
                  />
                ))
              )}
            </ScrollView>
          )}
        </View>

        {/* Floating action button for adding new tasks */}
        {canAddTask && (
          <View style={styles.floatingButton}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
              <Entypo name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // General container style with white background
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Utility flex container to occupy full height
  flexOne: {
    flex: 1,
  },

  // Centered container for loading and error screens
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  // Text style for error messages
  errorText: {
    color: "red",
    marginBottom: 8,
  },

  // Text style for retry button
  retryText: {
    color: "#0c7ff2",
  },

  // Container shown when no tasks available for the filtered status
  emptyContainer: {
    flex: 1,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Text style for empty state message
  emptyText: {
    fontSize: 16,
    color: "#888",
  },

  // Main content container, takes all available space
  content: {
    flex: 1,
  },

  // Header container for back button, title, and settings icon
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },

  // Style for back button icon/text
  backButtonText: {
    fontSize: 24,
    color: "#111418",
  },

  // Header title text style, centered and bold
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111418",
    letterSpacing: -0.015,
    flex: 1,
    textAlign: "center",
  },

  // Task list container style
  taskList: {
    flex: 1,
  },

  // Container for floating add button
  floatingButton: {
    position: "absolute",
    bottom: 40,
    right: 30,
  },

  // Style of the add button itself
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0c7ff2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Text style for the "+" icon in add button
  addButtonText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
});
