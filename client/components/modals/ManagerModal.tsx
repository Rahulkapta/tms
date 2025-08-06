import React from "react";
import {
  Modal,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Input from "@/components/Input";
import { filtered } from "@/utils/common.utils";
import { IUser } from "@/app/people";

// --- Props type for ManagerModal component ---
interface ManagerModalProps {
  visible: boolean;                           // Controls visibility of the modal
  onClose: () => void;                        // Callback to close the modal
  managers: IUser[];                          // Array of potential manager users
  searchQuery: string;                        // Current search query value
  setSearchQuery: (text: string) => void;     // Callback to update the search query value
  onSelect: (managerId: string) => void;      // Callback to handle manager selection (by manager's _id)
}

// --- Modal for selecting a manager from a searchable list ---
export default function ManagerModal({
  visible,
  onClose,
  managers,
  searchQuery,
  setSearchQuery,
  onSelect,
}: ManagerModalProps) {
  // --- Filter managers by search query ---
  const filteredManagers = filtered(managers, searchQuery);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay: dark blurred background, closes modal on tap */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Modal content: prevent propagation on tap inside */}
        <Pressable style={styles.modal} onPress={() => {}}>
          {/* --- Header with Title and Close button --- */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Manager</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>
          {/* Search input for filtering managers */}
          <Input
            placeholder="Search manager"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ marginBottom: 12 }}
          />
          {/* --- List of filtered managers --- */}
          <FlatList
            data={filteredManagers}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  onSelect(item._id); // Return manager's _id
                  onClose();          // Close modal after selection
                }}
              >
                <Text style={styles.itemText}>
                  {`${item.details.name.first} ${item.details.name.last ?? ""}`.trim()}
                </Text>
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  // Background overlay, darkens and disables interaction behind modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Modal window container
  modal: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  // Header row: title and close button
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  // Modal title styling
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  // Close button ("✕")
  close: {
    fontSize: 24,
    color: "#111",
  },
  // List item (single manager row)
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  // Manager name text
  itemText: {
    fontSize: 16,
  },
});
