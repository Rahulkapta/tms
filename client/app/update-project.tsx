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

import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import ManagerModal from "@/components/modals/ManagerModal";
import EmployeeModal from "@/components/modals/EmployeeModal";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import { IUser } from "./people";
import { setSelectedProject } from "@/store/slices/projectSlice";
import StatusModal from "@/components/modals/SelectModal";
import DateRangePicker from "@/components/DateRangePicker";

export default function UpdateProjectScreen() {
  const dispatch = useDispatch();

  // ---------------------- Redux State ----------------------
  const selectedProject = useSelector(
    (state: RootState) => state.project.selectedProject
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // ---------------------- Permission & Edit Mode ----------------------
  const userRole = currentUser?.role; // This should ideally come from auth state
  const canEditProject = userRole === "ADMIN" || userRole === "SUPER ADMIN";

  // ---------------------- Local State ----------------------
  // Holds edited project fields for the form
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    manager: "",
    status: "",
    employees: [] as string[], // Employee names for display
  });

  // List of all users fetched from backend (managers and employees)
  const [users, setUsers] = useState<IUser[]>([]);

  // UI state for  modals
  const [isManagerModalVisible, setIsManagerModalVisible] = useState(false);
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  // Search/filter queries for modals
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");

  // Selected manager and employees' IDs (IDs used for backend updates)
  const [managerId, setManagerId] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Validation and change tracking
  const [dateError, setDateError] = useState("");
  const [changed, setChanged] = useState(false);

  // ---------------------- Fetch Users From Backend ----------------------
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
          Alert.alert(
            "Error",
            error.response.data.message || "Invalid request"
          );
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

  // ---------------------- Memoized User Lists ----------------------
  const Employees = useMemo(
    () => users.filter((u) => u.details?.designation === "Employee"),
    [users]
  );

  const Managers = useMemo(
    () => users.filter((u) => u.details?.designation === "Manager"),
    [users]
  );

  // ---------------------- Update Project Data When Dependencies Change ----------------------
  useEffect(() => {
    // Wait for selectedProject and Managers to be loaded before mapping
    if (selectedProject && Managers.length > 0 && Employees.length > 0) {
      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().slice(0, 10); // Format YYYY-MM-DD
      };

      // Find full name of assigned manager by ID
      const managerObj = Managers.find(
        (m) => m._id === selectedProject.manager
      );
      const managerName = managerObj
        ? `${managerObj.details.name.first} ${
            managerObj.details.name.last ?? ""
          }`.trim()
        : "";

      setManagerId(selectedProject.manager); // Store manager ID for backend

      // Map assigned employee IDs to their full names
      const assignedEmployeeIds = selectedProject.assignedPeople ?? [];
      const assignedEmployeeNames = assignedEmployeeIds
        .map((id) => {
          const emp = Employees.find((e) => e._id === id);
          return emp
            ? `${emp.details.name.first} ${emp.details.name.last ?? ""}`.trim()
            : null;
        })
        .filter(Boolean) as string[];

      setSelectedEmployees(assignedEmployeeIds); // Store employee IDs

      // Update project data state for UI inputs
      setProjectData({
        title: selectedProject.name ?? "",
        description: selectedProject.description ?? "",
        startDate: formatDate(selectedProject.startDate ?? ""),
        endDate: formatDate(selectedProject.endDate ?? ""),
        manager: managerName,
        employees: assignedEmployeeNames,
        status: selectedProject.status,
      });

      setChanged(false); // Reset change tracker on load
      setDateError(""); // Clear date errors on load
    }
  }, [selectedProject, Managers, Employees]);

  // Update projectData employees when selectedEmployees change (map IDs to names)
  useEffect(() => {
    const selectedNames = selectedEmployees
      .map((id) =>
        Employees.find((e) => e._id === id)
          ? `${Employees.find((e) => e._id === id)?.details.name.first} ${
              Employees.find((e) => e._id === id)?.details.name.last ?? ""
            }`.trim()
          : null
      )
      .filter(Boolean) as string[];

    setProjectData((prev) => ({ ...prev, employees: selectedNames }));
  }, [selectedEmployees, Employees]);

  // ---------------------- Handlers ----------------------

  // Generic handler for input changes with date validation
  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...projectData, [field]: value };

    // Validate that startDate <= endDate
    const start = field === "startDate" ? value : updatedData.startDate;
    const end = field === "endDate" ? value : updatedData.endDate;

    if (start && end && new Date(start) > new Date(end)) {
      setDateError("Start date must be earlier than end date.");
      return;
    } else {
      setDateError(""); // Clear error if valid
    }

    setProjectData(updatedData);
    setChanged(true);
  };

  // When a manager is selected from modal, update both ID and name in state
  const handleManagerSelect = (id: string) => {
    setManagerId(id);
    const manager = Managers.find((m) => m._id === id);
    const managerName = manager
      ? `${manager.details.name.first} ${
          manager.details.name.last ?? ""
        }`.trim()
      : "";
    handleInputChange("manager", managerName);
  };

  // PATCH update project to backend
  const updateProject = async () => {
    if (!selectedProject?._id) {
      Alert.alert("Error", "No project selected to update.");
      return;
    }

    try {
      // Prepare the payload matching your API expected fields
      const payload = {
        name: projectData.title,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        manager: managerId, // Use manager ID not name
        assignedPeople: selectedEmployees,
        status: projectData.status,
        // Add other fields as necessary
      };

      // Call the API, adjust URL if your baseURL or endpoint differs
      const response = await api.patch(
        `/projects/${selectedProject._id}`,
        payload
      );

      if (response.status === 200) {
        Alert.alert(
          "Success",
          "Project updated successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                setChanged(false);
                if (response.data.data) {
                  dispatch(setSelectedProject(response.data.data));
                }
                router.back();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Error",
          response.data?.message || "Failed to update project"
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred."
      );
    }
  };

  // Use this inside your button press handler
  const handleUpdateProject = () => {
    updateProject();
  };

  // Check if form is valid to enable the Update button
  const isFormValid =
    changed &&
    projectData.title.trim() !== "" &&
    projectData.description.trim() !== "" &&
    managerId.trim() !== "" &&
    dateError === "";

  // ---------------------- Render ----------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header with close button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Update Project</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Project Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Project Title</Text>
              <View style={{ opacity: canEditProject ? 1 : 0.5 }}>
                <Input
                  placeholder="Enter project title"
                  value={projectData.title}
                  onChangeText={(value) => handleInputChange("title", value)}
                  editable={canEditProject}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={{ opacity: canEditProject ? 1 : 0.5 }}>
                <TextArea
                  placeholder="Enter project description"
                  value={projectData.description}
                  onChangeText={(value) =>
                    handleInputChange("description", value)
                  }
                  editable={canEditProject}
                />
              </View>
            </View>

            {/* Dates Section */}
            <DateRangePicker
              startDate={projectData.startDate}
              endDate={projectData.endDate}
              onStartChange={(date) => handleInputChange("startDate", date)}
              onEndChange={(date) => handleInputChange("endDate", date)}
              dateError={dateError}
            />

            {/* Manager selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Manager</Text>
              <View style={{ opacity: canEditProject ? 1 : 0.5 }}>
                <TouchableOpacity
                  disabled={!canEditProject}
                  onPress={() =>
                    canEditProject && setIsManagerModalVisible(true)
                  }
                >
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
                      value={projectData.manager}
                      editable={false}
                      pointerEvents="none"
                    />
                    {canEditProject && projectData.manager !== "" && (
                      <TouchableOpacity
                        onPress={() => {
                          setManagerId("");
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
            </View>

            {/* Employees selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Employees</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { opacity: canEditProject ? 1 : 0.5 },
                ]}
              >
                {selectedEmployees.length === 0 ? (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    disabled={!canEditProject}
                    onPress={() =>
                      canEditProject && setIsEmployeeModalVisible(true)
                    }
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
                      const emp = Employees.find((e) => e._id === id);
                      const name = emp
                        ? `${emp.details.name.first} ${
                            emp.details.name.last ?? ""
                          }`.trim()
                        : "";
                      return (
                        <TouchableOpacity
                          key={id}
                          disabled={!canEditProject}
                          onPress={() =>
                            canEditProject && setIsEmployeeModalVisible(true)
                          }
                          style={styles.chip}
                        >
                          <Text style={styles.chipText}>{name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
                {canEditProject && selectedEmployees.length > 0 && (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        canEditProject && setIsEmployeeModalVisible(true)
                      }
                      style={styles.clearIcon}
                    >
                      <Entypo name="plus" size={28} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSelectedEmployees([])}
                      style={styles.clearIcon}
                    >
                      <Entypo name="cross" size={28} color="black" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* Status Section */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Project Status</Text>
              <TouchableOpacity
                style={[
                  styles.inputWrapper,
                  { opacity: canEditProject ? 1 : 0.5 }, // Reduce opacity when not editable
                ]}
                onPress={() => setIsStatusModalVisible(true)}
                disabled={!canEditProject}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 15,
                    gap: 350,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{projectData.status}</Text>
                  <Entypo name="chevron-down" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Manager selection modal */}
      <ManagerModal
        visible={isManagerModalVisible}
        managers={Managers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClose={() => {
          setIsManagerModalVisible(false);
          setSearchQuery("");
        }}
        onSelect={handleManagerSelect}
      />

      {/* Employees selection modal */}
      <EmployeeModal
        title="Select Employees"
        visible={isEmployeeModalVisible}
        employees={Employees}
        selected={selectedEmployees}
        setSelected={(newSelected) => {
          setSelectedEmployees(newSelected);
          setChanged(true);
        }}
        searchQuery={employeeSearchQuery}
        setSearchQuery={setEmployeeSearchQuery}
        onClose={() => {
          setIsEmployeeModalVisible(false);
          setEmployeeSearchQuery("");
        }}
      />
      {/* Status selection modal */}
      <StatusModal
        title="Select Status"
        visible={isStatusModalVisible}
        selected={projectData.status}
        onSelect={(status) => handleInputChange("status", status)}
        onClose={() => setIsStatusModalVisible(false)}
        options={["Todo", "In Progress", "Done"]}
      />

      {/* Footer with update button */}
      <View style={styles.footer}>
        <Button
          title="Update Project"
          onPress={handleUpdateProject}
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
    fontSize: 18,
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
    marginHorizontal: 8,
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
