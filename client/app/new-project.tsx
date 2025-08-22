// NewProjectScreen.tsx

import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";

// Custom UI components for form inputs, buttons, and modals
import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import ManagerModal from "@/components/modals/ManagerModal";
import EmployeeModal from "@/components/modals/EmployeeModal";

import api from "@/utils/api"; // axios instance configured with baseURL
import { IUser } from "./people"; // User type
import DateRangePicker from "@/components/DateRangePicker";

export default function NewProjectScreen() {
  // ---------------------- State Definitions ----------------------

  // List of all users fetched from backend for manager/employee selection
  const [users, setUsers] = useState<IUser[]>([]);

  // Form data for creating new project
  const [projectData, setProjectData] = useState({
    name: "", // Project name/title
    description: "",
    status: "Todo", // Default project status
    manager: "", // Manager _id selected for project
    startDate: "",
    endDate: "",
    assignedPeople: [] as string[], // Employee IDs assigned to project
  });

  // Modal visibility states & search queries
  const [isManagerModalVisible, setIsManagerModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");

  // Selected manager's ID and their display name (for showing in the Input)
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [selectedManagerName, setSelectedManagerName] = useState<string>("");

  // Selected employees' IDs
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Validation error for date inputs
  const [dateError, setDateError] = useState("");

  // ---------------------- Effects ----------------------

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

  // When selectedManagerId changes, update the selectedManagerName display and sync manager ID in form data
  useEffect(() => {
    if (selectedManagerId) {
      // Find manager by selected ID
      const manager = Managers.find((m) => m._id === selectedManagerId);
      if (manager) {
        const fullName = `${manager.details.name.first} ${
          manager.details.name.last ?? ""
        }`.trim();
        setSelectedManagerName(fullName);

        // Sync manager ID into project data (not name)
        setProjectData((prev) => ({ ...prev, manager: selectedManagerId }));
      }
    } else {
      // Clear selection and form manager field if no selection
      setSelectedManagerName("");
      setProjectData((prev) => ({ ...prev, manager: "" }));
    }
  }, [selectedManagerId]);

  // When selected employees change, sync their IDs into form data
  useEffect(() => {
    setProjectData((prev) => ({ ...prev, assignedPeople: selectedEmployees }));
  }, [selectedEmployees]);

  // ---------------------- Memoized filtered user lists ----------------------

  // Filter users to get only employees
  const Employees = useMemo(() => {
    return users.filter((p) => p.details.designation === "Employee");
    // use optional chaining if needed: p.details?.designation === "Employee"
  }, [users]);

  // Filter users to get only managers
  const Managers = useMemo(() => {
    return users.filter((p) => p.details.designation === "Manager");
  }, [users]);

  // ---------------------- Handlers ----------------------

  // Handle updates for form fields; includes date validation
  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...projectData, [field]: value };

    // Validate that start date is before end date
    const start = field === "startDate" ? value : updatedData.startDate;
    const end = field === "endDate" ? value : updatedData.endDate;

    if (start && end && new Date(start) > new Date(end)) {
      setDateError("Start date must be earlier than end date.");
      return;
    } else {
      setDateError("");
    }
    setProjectData(updatedData);
  };

  // Async handler to submit form data and create project via POST request
  const handleCreateProject = async () => {
    // Validate required fields
    if (!isFormValid) {
      Alert.alert("Validation", "Please fill all required fields correctly.");
      return;
    }

    try {
      const payload = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        manager: projectData.manager,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        assignedPeople: projectData.assignedPeople,
      };

      // Send POST request to create project
      const response = await api.post("/projects", payload);

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Project created successfully.");
        router.back();
      } else {
        Alert.alert(
          "Error",
          response.data?.message || "Failed to create project."
        );
      }
    } catch (error: any) {
      if (error.response) {
        const res = error.response.data;
        Alert.alert(
          "Failed to create project",
          res.message || "Invalid credentials"
        );
      } else if (error.request) {
        Alert.alert(
          "Network Error",
          "Failed to connect to server. Please try again later."
        );
      } else {
        Alert.alert("Error", error.message || "An unexpected error occurred.");
      }
    }
  };

  // Validate if form inputs are filled and there is no date error
  const isFormValid =
    projectData.name.trim() &&
    projectData.description.trim() &&
    projectData.manager.trim() &&
    !dateError;

  // ---------------------- Render ----------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Entypo name="cross" size={28} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Project</Text>
            <View style={{width:24}}></View>

          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Project Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Project Title</Text>
              <Input
                placeholder="Enter project title"
                value={projectData.name}
                onChangeText={(value) => handleInputChange("name", value)}
              />
            </View>

            {/* Project Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextArea
                placeholder="Enter project description"
                value={projectData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
              />
            </View>
 {/* Dates Section */}
            <DateRangePicker
              startDate={projectData.startDate}
              endDate={projectData.endDate}
              onStartChange={(date) => handleInputChange("startDate", date)}
              onEndChange={(date) => handleInputChange("endDate", date)}
              dateError={dateError}
            />

            {/* Manager Selection Input (Disabled): shows selected manager name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Manager</Text>
              <TouchableOpacity onPress={() => setIsManagerModalVisible(true)}>
                <View
                  style={[
                    styles.inputWrapper,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                >
                  <Input
                    style={[
                      styles.chip,
                      {
                        backgroundColor: projectData.manager
                          ? "#e0e0e0"
                          : "transparent",
                      },
                    ]}
                    placeholder="Select manager"
                    value={selectedManagerName}
                    editable={false}
                    pointerEvents="none"
                  />
                  {projectData.manager !== "" && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedManagerName("");
                        handleInputChange("manager", "");
                      }}
                      style={styles.clearIcon}
                    >
                      <Entypo name="cross" size={28} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Employees Selection: shows chips of selected employees or prompt */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Employees</Text>
              <View style={styles.inputWrapper}>
                {selectedEmployees.length === 0 ? (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setIsEmployeeModalVisible(true)}
                  >
                    <Text style={styles.placeholder}>Select employees</Text>
                  </TouchableOpacity>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                    style={styles.employeeScroll}
                  >
                    {selectedEmployees.map((id) => {
                      const employee = Employees.find((e) => e._id === id);
                      const fullName = employee
                        ? `${employee.details.name.first} ${
                            employee.details.name.last ?? ""
                          }`.trim()
                        : "";
                      return (
                        <TouchableOpacity
                          key={id}
                          onPress={() => setIsEmployeeModalVisible(true)}
                          style={styles.chip}
                        >
                          <Text style={styles.chipText}>{fullName}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}

                {/* Buttons to add more or clear selected employees */}
                {selectedEmployees.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setIsEmployeeModalVisible(true)}
                    style={styles.clearIcon}
                  >
                    <Entypo name="plus" size={28} color="black" />
                  </TouchableOpacity>
                )}
                {selectedEmployees.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSelectedEmployees([])}
                    style={styles.clearIcon}
                  >
                    <Entypo name="cross" size={28} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Manager Modal for selecting manager */}
      <ManagerModal
        visible={isManagerModalVisible}
        onClose={() => {
          setIsManagerModalVisible(false);
          setSearchQuery("");
        }}
        managers={Managers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelect={(manager) => setSelectedManagerId(manager)} // onSelect saves manager's ID
      />

      {/* Employee Modal for multi-selection of employees */}
      <EmployeeModal
        title="Select Employees"
        visible={isEmployeeModalVisible}
        onClose={() => {
          setIsEmployeeModalVisible(false);
          setEmployeeSearchQuery("");
        }}
        employees={Employees}
        selected={selectedEmployees}
        setSelected={setSelectedEmployees}
        searchQuery={employeeSearchQuery}
        setSearchQuery={setEmployeeSearchQuery}
      />

      {/* Create Project button */}
      <View style={styles.footer}>
        <Button
          title="Create Project"
          onPress={handleCreateProject}
          disabled={!isFormValid}
        />
      </View>
    </SafeAreaView>
  );
}

// ---------------------- Styles ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  scrollView: {
    flex: 1,
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

  closeButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    fontSize: 24,
    color: "#111418",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#111418",
  },

  form: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  inputGroup: {
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111418",
    marginBottom: 8,
  },

  dateContainer: {
    flexDirection: "row",
    gap: 10,
  },

  halfWidth: {
    flex: 1,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#f0f2f5",
    height: 56,
    minHeight: 45,
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  selectedDate: {
    fontSize: 16,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginVertical: 4,
  },

  clearIcon: {
    marginRight: 8,
  },

  placeholder: {
    color: "#60758a",
    fontSize: 16,
    marginLeft: 12,
  },

  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },

  employeeScroll: {
    flex: 1,
  },

  chip: {
    backgroundColor: "#e0e0e0",
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
  },

  chipText: {
    fontSize: 16,
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
});
