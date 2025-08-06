import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "@/components/Input";
import { filtered } from "@/utils/common.utils";
import { IUser } from "@/app/people";

// --- Props Type Definition ---
interface Props {
  title: string;                              // Modal title
  visible: boolean;                           // Modal visibility control
  onClose: () => void;                        // Handler to close the modal
  employees: IUser[];                         // All employee objects to display and select from
  selected: string[];                         // Currently selected employee IDs
  setSelected: (ids: string[]) => void;       // Callback to update selected employees
  searchQuery: string;                        // Current value of search input
  setSearchQuery: (query: string) => void;    // Callback to update search query
}

// --- Employee Selection Modal Component ---
export default function EmployeeModal({
  title,
  visible,
  onClose,
  employees,
  selected,
  setSelected,
  searchQuery,
  setSearchQuery,
}: Props) {
  // --- Toggle select/deselect of an employee by ID ---
  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((e) => e !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // --- Filter employees based on search ---
  const filteredEmployees = filtered(employees, searchQuery);

  // --- Render ---
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dismiss modal when tapping overlay background */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Prevent background press close when touching modal content */}
        <Pressable style={styles.content} onPress={() => {}}>
          {/* --- Modal Header --- */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* --- Search Input --- */}
          <Input
            placeholder={
              title.toLowerCase().includes("assignee")
                ? "Search Assignee"
                : "Search Employee"
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ marginBottom: 12 }}
          />

          {/* --- Employee List --- */}
          <FlatList
            data={filteredEmployees}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item._id);
              return (
                <TouchableOpacity
                  style={[styles.item, isSelected && styles.selected]}
                  onPress={() => toggleSelect(item._id)}
                >
                  <Text style={styles.itemText}>
                    {`${item.details.name.first} ${item.details.name.last ?? ""}`.trim()}
                  </Text>
                  {isSelected && <Text>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  // Background overlay for modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  // The modal content container
  content: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  // Header row containing the title and close button
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  // Modal title
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  // Close ("✕") button
  close: {
    fontSize: 20,
    color: "#333",
  },
  // Each employee row
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Employee name text
  itemText: {
    fontSize: 16,
  },
  // Style for selected item
  selected: {
    backgroundColor: "#e6f0ff",
  },
});
