import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "@/utils/api";
import { IUser } from "@/app/(main)/people";
import { TaskData } from "@/app/new-task";


export interface Comment {
  __v: number;
  _id: string;
  attachments: any[];
  authorId: string;
  createdAt: string;
  createdBy: string;
  text: string;
  ticketId: string;
  updatedAt: string;
  updatedBy: string;
}

export function useTaskDetail() {
  const {
    task: taskParam,
    employees: employeesParam,
    projectId,
    users: usersParam,
  } = useLocalSearchParams<{
    task?: string;
    employees?: string;
    projectId?: string;
    users?: string;
  }>();

  const [employeeList, setEmployeeList] = useState<IUser[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [task, setTask] = useState<TaskData>({
    _id: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: [],
    status: "",
    priority: "",
  });
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [dateError, setDateError] = useState("");

  // Parse URL params and update states
  useEffect(() => {
    if (usersParam) {
      try {
        setUsers(JSON.parse(usersParam));
      } catch {
        setUsers([]);
      }
    }
    if (employeesParam) {
      try {
        setEmployeeList(JSON.parse(employeesParam));
      } catch {
        setEmployeeList([]);
      }
    }
    if (taskParam) {
      try {
        const parsedTask = JSON.parse(taskParam);
        setTask((prev) => ({ ...prev, ...parsedTask }));
  setSelectedAssignees(parsedTask.assignedTo);
      } catch (error) {
        console.error("Failed to parse taskParam", error);
      }
    }
  }, [taskParam, employeesParam, usersParam]);

  // Sync selectedAssignees to task.assignedTo
  useEffect(() => {
    setTask((prev) => ({ ...prev, assignedTo: selectedAssignees }));
  }, [selectedAssignees]);

  // Fetch comments whenever task._id or newComment changes
  useEffect(() => {
    if (task._id) {
      fetchComments();
    }
  }, [task._id, newComment]);

  async function fetchComments() {
    try {
      const res = await api.get(`/${task._id}/comments`);
      if (res.status === 200) {
        setComments(res.data.data.comments);
      } else {
        Alert.alert("Error", res.data.message || "Failed to load comments");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Network error loading comments"
      );
    }
  }

  // Handle input changes with date validation
  function handleInputChange(field: keyof TaskData, value: string) {
    const updated = { ...task, [field]: value };

    const start = field === "startDate" ? value : updated.startDate;
    const end = field === "endDate" ? value : updated.endDate;

    if (start && end && new Date(start) > new Date(end)) {
      setDateError("Start date must be earlier than end date.");
      return;
    } else {
      setDateError("");
    }

    setTask(updated);
  }

  // Save updated task to API
  async function handleSaveTask() {
    const payload = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      assignedTo: task.assignedTo,
    };
    try {
      await api.patch(`/${projectId}/tasks/${task._id}`, payload);
      Alert.alert("Success", "Task updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || error.message || "Failed to update task"
      );
    }
  }

  // Add new comment to task
  async function handleAddComment() {
    const trimmed = newComment.trim();
    if (!trimmed) {
      Alert.alert("Validation", "Please enter a comment before sending.");
      return;
    }
    try {
      const payload = { text: trimmed };
      const res = await api.post(`/${task._id}/comments`, payload);
      if (res.status === 201 || res.status === 200) {
        setNewComment("");
      } else {
        Alert.alert("Error", res.data.message || "Failed to post comment");
      }
    } catch (error: any) {
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.message || "Failed to post comment"
        );
      } else {
        Alert.alert("Network Error", "Could not connect to server");
      }
    }
  }

  return {
    task,
    setTask,
    employeeList,
    users,
    selectedAssignees,
    setSelectedAssignees,
    assigneeSearch,
    setAssigneeSearch,
    newComment,
    setNewComment,
    comments,
    dateError,
    handleInputChange,
    handleSaveTask,
    handleAddComment,
  };
}
