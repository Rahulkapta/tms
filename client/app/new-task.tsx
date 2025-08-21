// Screen component for creating a new task under the currently selected project.
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import api from "@/utils/api";
import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import PriorityModal from "@/components/modals/SelectModal";

import { RootState } from "@/store";
import { IUser } from "./people";
import DateRangePicker from "@/components/DateRangePicker";
import AssigneeSelector from "@/components/AssigneeSelector";

// Interface defining the shape of our form data
export interface TaskData {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assignedTo: string[];
  status: string;
  priority: string;
}

export default function NewTaskScreen() {
  // Read the serialized employees JSON string from params
  const { employees: employeesParam } = useLocalSearchParams<{
    employees?: string;
  }>();

  const [employeeList, setEmployeeList] = useState<IUser[]>([]);

  // Retrieve the currently selected project from Redux store
  const selectedProject = useSelector(
    (state: RootState) => state.project.selectedProject
  );

  // Local state for form fields and modals
  const [taskData, setTaskData] = useState<TaskData>({
    _id: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: [],
    status: "To Do",
    priority: "",
  });
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");

  const [isAssigneeModalVisible, setIsAssigneeModalVisible] = useState(false);
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);

  const [dateError, setDateError] = useState("");

  // Deserialize into array of IUser objects, or default to empty array
  useEffect(() => {
    if (employeesParam) {
      try {
        const parsed = JSON.parse(employeesParam) as IUser[];
        setEmployeeList(parsed);
      } catch {
        console.warn("Invalid employees param, defaulting to empty list");
        setEmployeeList([]);
      }
    }
  }, [employeesParam]);

  // Sync the array of selected assignee IDs into our form data
  useEffect(() => {
    setTaskData((prev) => ({ ...prev, assignedTo: selectedAssignees }));
  }, [selectedAssignees]);

  // Generic handler for input and date changes with validation
  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...taskData, [field]: value };

    // Two-way date validation: ensure start <= end
    const start = field === "startDate" ? value : updatedData.startDate;
    const end = field === "endDate" ? value : updatedData.endDate;

    if (start && end && new Date(start) > new Date(end)) {
      setDateError("Start date must be earlier than end date.");
      return;
    } else {
      setDateError(""); // Clear error if dates are valid
    }

    setTaskData(updatedData);
  };

  // Submit the form: validate, call API, then navigate back on success
  const handleCreateTask = async () => {
    // Prevent submission without a selected project
    if (!selectedProject?._id) {
      Alert.alert("Error", "No project selected. Cannot create task.");
      return;
    }

    // Trim and validate
    const title = taskData.title.trim();
    const description = taskData.description.trim();
    const priority = taskData.priority.trim();

    if (!title || !description || !priority || dateError) {
      Alert.alert("Validation", "Please fill all fields correctly.");
      return;
    }

    // Construct request payload
    const payload = {
      title,
      description,
      status: taskData.status,
      priority,
      startDate: taskData.startDate,
      endDate: taskData.endDate,
      assignedTo: taskData.assignedTo,
    };
    try {
      const response = await api.post(`/${selectedProject._id}/tasks`, payload);
      if (response.status === 201) {
        Alert.alert("Success", "Task created successfully.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.data?.message || "Unable to create task."
        );
      }
    } catch (error: any) {
      if (error.response) {
        Alert.alert("Error", error.response.data?.message || "Server error.");
      } else if (error.request) {
        Alert.alert("Network Error", "Please check your connection.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  // Determine if the form is valid for enabling the Submit button
  const isFormValid =
    taskData.title.trim() &&
    taskData.description.trim() &&
    taskData.priority.trim() &&
    !dateError;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Task</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Task Title */}
            <View style={styles.inputGroup}>
              <Input
                placeholder="Task Title"
                value={taskData.title}
                onChangeText={(value) => handleInputChange("title", value)}
                style={styles.roundedInput}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <TextArea
                placeholder="Description"
                value={taskData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                style={styles.roundedTextArea}
              />
            </View>

            {/* Dates Section */}
            <DateRangePicker
              startDate={taskData.startDate}
              endDate={taskData.endDate}
              onStartChange={(date) => handleInputChange("startDate", date)}
              onEndChange={(date) => handleInputChange("endDate", date)}
              dateError={dateError}
            />

            {/* Assignee Section */}

            <AssigneeSelector
              employeeList={employeeList}
              selectedAssignees={selectedAssignees}
              setSelectedAssignees={setSelectedAssignees}
              isAssigneeModalVisible={isAssigneeModalVisible}
              setIsAssigneeModalVisible={setIsAssigneeModalVisible}
              assigneeSearch={assigneeSearch}
              setAssigneeSearch={setAssigneeSearch}
            />

            {/* Priority Section */}
            <Text style={styles.sectionTitle}>Priority</Text>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                style={styles.selectItem}
                onPress={() => setIsPriorityModalVisible(true)}
              >
                <Text style={styles.selectText}>
                  {taskData.priority || "Select Priority"}
                </Text>
                <Entypo name="chevron-down" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Priority modal */}
      <PriorityModal
        title="Select Priority"
        visible={isPriorityModalVisible}
        onClose={() => setIsPriorityModalVisible(false)}
        onSelect={(priority) => handleInputChange("priority", priority)}
        selected={taskData.priority}
        options={["High", "Medium", "Low"]}
      />

      {/* Footer create button */}
      <View style={styles.footer}>
        <Button
          title="Create Task"
          onPress={handleCreateTask}
          disabled={!isFormValid}
          // variant="secondary"
          // style={styles.createButton}
        />
      </View>
    </SafeAreaView>
  );
}

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

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121416",
    letterSpacing: -0.015,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 48,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121416",
    letterSpacing: -0.015,
    marginTop: 16,
    marginBottom: 8,
  },
  roundedInput: {
    borderRadius: 16,
    backgroundColor: "#f1f2f4",
    color: "#121416",
  },
  roundedTextArea: {
    borderRadius: 16,
    backgroundColor: "#f1f2f4",
    color: "#121416",
  },
  selectItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  selectText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#121416",
    flex: 1,
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
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
});
