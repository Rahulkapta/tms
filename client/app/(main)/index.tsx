import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "@/store/slices/projectSlice";
import { router, useFocusEffect } from "expo-router";
import api from "@/utils/api";
import BottomNavigation from "@/components/BottomNavigation";
import ProjectCard from "@/components/ProjectCard";
import TabNavigation from "@/components/TabNavigation";
import { RootState } from "@/store";
import { Entypo } from "@expo/vector-icons";

// --- Types ---
export interface ApiProject {
  _id: string;
  assignedPeople: string[];
  createdAt: string;
  createdBy: string;
  description: string;
  endDate: string;
  name: string;
  startDate: string;
  status: string;
  manager: string;
  team: any[];
  updatedAt: string;
  updatedBy: string;
  taskCount: number;
}

// --- Main Projects Screen ---
export default function ProjectsScreen() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // ---------------------- Permission & Add project Mode ----------------------
  const userRole = currentUser?.role; // This should ideally come from auth state
  const canAddProject = userRole === "ADMIN" || userRole === "SUPER ADMIN";

  // --- State Variables ---
  const [activeFilter, setActiveFilter] = useState("Todo"); // Filter status tab (e.g., "Todo")
  const [projects, setProjects] = useState<ApiProject[]>([]); // All fetched projects
  const [loading, setLoading] = useState(true); // Loading state for API fetch

  // --- Fetch Projects on Screen Focus ---
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchProjects = async () => {
        setLoading(true);
        try {
          const response = await api.get("/projects");
          if (response.status === 200 && isActive) {
            setProjects(response.data.data);
          } else if (isActive) {
            Alert.alert("Error", "Failed to load projects");
          }
        } catch {
          if (isActive) {
            Alert.alert(
              "Network Error",
              "Could not fetch projects. Please try again."
            );
          }
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchProjects();
      return () => {
        // Cleanup: avoid state updates if unmounted
        isActive = false;
      };
    }, [])
  );

  // --- Memoize Filtered Project List (only recomputes if `projects` or `activeFilter` changes) ---
  const filteredProjects = useMemo(() => {
    // Matches projects by their status field
    return projects.filter((p) => p.status === activeFilter);
  }, [projects, activeFilter]);

  // --- Handlers ---
  // Navigate to project tasks screen, saving selected project to Redux
  const handleProjectPress = (project: ApiProject) => {
    dispatch(setSelectedProject(project));
    router.push("/project-tasks");
  };

  // Navigate to new project creation screen
  const handleAddProject = () => {
    router.push("/new-project");
  };

  // --- Render ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* --- Header: Title + Add Button --- */}

        <View style={styles.header}>
          <View style={{ width: 24 }}></View>
          <Text style={styles.headerTitle}>Projects</Text>
          {canAddProject ? (
            <TouchableOpacity onPress={handleAddProject}>
              <Entypo name="plus" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        {/* --- Tabs: Project Status Filters --- */}
        <TabNavigation activeTab={activeFilter} onTabPress={setActiveFilter} />

        {/* --- Main Project List or Loading State --- */}
        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 400 }}
            size="large"
            color="#007AFF"
          />
        ) : (
          <ScrollView
            style={styles.projectList}
            showsVerticalScrollIndicator={false}
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  id={project._id}
                  title={project.name}
                  taskCount={project.taskCount}
                  onPress={() => handleProjectPress(project)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>
                No "{activeFilter}" projects found.
              </Text>
            )}
          </ScrollView>
        )}
      </View>

      {/* --- Bottom Navigation Bar --- */}
      <BottomNavigation activeTab="projects" />
    </SafeAreaView>
  );
}

// --- Styles ---
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111418",
    flex: 1,
    textAlign: "center",
  },
  projectList: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 16,
  },
});
