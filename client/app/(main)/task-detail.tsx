import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import DateRangePicker from "@/components/DateRangePicker";
import PriorityModal from "@/components/modals/SelectModal";
import AssigneeSelector from "@/components/AssigneeSelector";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getInitials } from "@/utils/common.utils";
import { Colors } from "@/constants/Colors";
import { getTimeAgo } from "@/utils/timeUtils";

import { useTaskDetail } from "@/hooks/useTaskDetail";
import { router } from "expo-router";

export default function TaskDetailScreen() {
  const {
    task,
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
  } = useTaskDetail();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const CurrentUserInitials = getInitials(
    currentUser?.userDetails.name.first,
    currentUser?.userDetails.name.last
  );

  // Local UI states for modals
  const [isAssigneeModalVisible, setIsAssigneeModalVisible] = useState(false);
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity onPress={handleSaveTask} style={{ margin: 10 }}>
          <Entypo name="check" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.form}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <Input
                value={task.title}
                onChangeText={(v) => handleInputChange("title", v)}
                style={styles.roundedInput}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextArea
                value={task.description}
                onChangeText={(v) => handleInputChange("description", v)}
                style={styles.roundedTextArea}
              />
            </View>

            {/* Date Range Picker */}
            <DateRangePicker
              startDate={task.startDate}
              endDate={task.endDate}
              onStartChange={(d) => handleInputChange("startDate", d)}
              onEndChange={(d) => handleInputChange("endDate", d)}
              dateError={dateError}
            />

            {/* Assignee Selector */}
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
                  {task.priority || "Select Priority"}
                </Text>
                <Entypo name="chevron-down" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <PriorityModal
              title="Select Priority"
              visible={isPriorityModalVisible}
              onClose={() => setIsPriorityModalVisible(false)}
              onSelect={(priority) => handleInputChange("priority", priority)}
              selected={task.priority}
              options={["High", "Medium", "Low"]}
            />

            {/* Status Section */}
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                style={styles.selectItem}
                onPress={() => setIsStatusModalVisible(true)}
              >
                <Text style={styles.selectText}>
                  {task.status || "Select Status"}
                </Text>
                <Entypo name="chevron-down" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <PriorityModal
              title="Select Status"
              visible={isStatusModalVisible}
              onClose={() => setIsStatusModalVisible(false)}
              onSelect={(status) => handleInputChange("status", status)}
              selected={task.status}
              options={["To Do", "In Progress", "Completed"]}
            />

            {/* Comments Section */}
            <Text style={styles.sectionTitle}>Comments</Text>
            {comments.map((comment) => {
              const author = users.find((u) => u._id === comment.authorId);
              const authorName = author
                ? `${author.details.name.first} ${
                    author.details.name.last ?? ""
                  }`.trim()
                : "Unknown User";
              return (
                <View key={comment._id} style={styles.commentItem}>
                  <View style={styles.initialsCircle}>
                    <Text style={styles.initialsText}>
                      {getInitials(
                        author?.details.name.first,
                        author?.details.name.last
                      )}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "column", width: 410, padding: 3 }}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <Text style={styles.commentAuthor}>{authorName}</Text>
                      <Text style={styles.commentTime}>
                        {getTimeAgo(comment.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Comment Input Section */}
      <View style={styles.commentInput}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{CurrentUserInitials}</Text>
        </View>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInputField}
            placeholder="Add a comment"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            placeholderTextColor="#60768a"
          />
          <TouchableOpacity style={styles.attachButton} onPress={handleAddComment}>
            <Ionicons name="send" size={22} color="#4A90E2" />
          </TouchableOpacity>
        </View>
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
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111518",
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
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111518",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111518",
    letterSpacing: -0.015,
    marginTop: 16,
    marginBottom: 8,
  },
  roundedInput: {
    backgroundColor: "#f0f2f5",
    color: "#111518",
  },
  roundedTextArea: {
    backgroundColor: "#f0f2f5",
    color: "#111518",
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

  initialsCircle: {
    width: 48,
    height: 48,
    borderRadius: 28, 
    backgroundColor: Colors.iconContainer.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 18,
    color: Colors.iconContainer.icon,
    fontWeight: "bold",
  },
  commentItem: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    flexShrink: 0,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111518",
    letterSpacing: 0.015,
  },
  commentTime: {
    fontSize: 14,
    fontWeight: "400",
    color: "#60768a",
  },
  commentText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#111518",
    lineHeight: 20,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  commentInputAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    flexShrink: 0,
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 25,
    height: 48,
  },
  commentInputField: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111518",
    maxHeight: 80,
  },
  attachButton: {
    marginHorizontal: 20,
  },
  attachIcon: {
    fontSize: 20,
    color: "#60768a",
  },
});
