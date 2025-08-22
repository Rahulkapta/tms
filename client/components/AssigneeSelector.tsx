import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Entypo } from '@expo/vector-icons';
import EmployeeModal from "./modals/EmployeeModal"; // Assuming path to your modal
import { IUser } from "@/app/(main)/people";
interface AssigneeSelectorProps {
  employeeList: IUser[];
  selectedAssignees: string[];
  setSelectedAssignees: React.Dispatch<React.SetStateAction<string[]>>;
  isAssigneeModalVisible: boolean;
  setIsAssigneeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  assigneeSearch: string;
  setAssigneeSearch: React.Dispatch<React.SetStateAction<string>>;
}


const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
    employeeList,
  selectedAssignees,
  setSelectedAssignees,
  isAssigneeModalVisible,
  setIsAssigneeModalVisible,
  assigneeSearch,
  setAssigneeSearch,
}) => {


 
    
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.sectionTitle}>Assignee</Text>
      <View style={styles.inputWrapper}>
        {selectedAssignees?.length === 0? (
          <TouchableOpacity
            onPress={() => setIsAssigneeModalVisible(true)}
            style={styles.selectItem}
          >
            <Text style={styles.selectText}>Select Assignee(s)</Text>
            <Entypo name="chevron-down" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            style={styles.employeeScroll}
          >
            {selectedAssignees.map((id) => {
              const employee = employeeList.find((e) => e._id === id);
              const fullName = employee
                ? `${employee.details.name.first} ${
                    employee.details.name.last ?? ""
                  }`.trim()
                : "";
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => setIsAssigneeModalVisible(true)}
                  style={styles.chip}
                >
                  <Text style={styles.chipText}>{fullName}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        {selectedAssignees?.length > 0 && (
          <>
            <TouchableOpacity
              onPress={() => setIsAssigneeModalVisible(true)}
              style={styles.clearIcon}
            >
              <Entypo name="plus" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedAssignees([])}
              style={styles.clearIcon}
            >
              <Entypo name="cross" size={28} color="black" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Use existing EmployeeModal */}
      <EmployeeModal
        title="Select Assignees"
        visible={isAssigneeModalVisible}
        onClose={() => setIsAssigneeModalVisible(false)}
        employees={employeeList}
        selected={selectedAssignees}
        setSelected={setSelectedAssignees}
        searchQuery={assigneeSearch}
        setSearchQuery={setAssigneeSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 12,
  },
 sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121416",
    letterSpacing: -0.015,
    marginTop: 16,
    marginBottom: 8,
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
  clearIcon: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AssigneeSelector;
