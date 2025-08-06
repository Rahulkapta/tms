import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import DatePickerModal from "./modals/DateModal";

// Import your DatePickerModal here
 // Adjust path as needed

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  dateError?: string; 
}

const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().slice(0, 10); // Format YYYY-MM-DD
      };

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  dateError = "",
}) => {
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);

  return (
    <>
      <View style={styles.dateContainer}>
        {/* Start Date */}
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Start Date</Text>
          <View style={[styles.inputWrapper, { justifyContent: "space-between" }]}>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.inputContainer}
            >
              <Text
                style={[
                  styles.selectedDate,
                  { color: startDate ? "#000" : "#60758a" },
                ]}
              >
                {formatDate(startDate) || "Select start date"}
              </Text>
              {startDate === "" && (
                <AntDesign name="calendar" size={24} color="black" />
              )}
            </TouchableOpacity>
            {startDate !== "" && (
              <TouchableOpacity
                onPress={() => onStartChange("")}
                style={styles.clearIcon}
              >
                <Entypo name="cross" size={28} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* End Date */}
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>End Date</Text>
          <View style={[styles.inputWrapper, { justifyContent: "space-between" }]}>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.inputContainer}
            >
              <Text
                style={[
                  styles.selectedDate,
                  { color: endDate ? "#000" : "#60758a" },
                ]}
              >
                {formatDate(endDate) || "Select end date"}
              </Text>
              {endDate === "" && (
                <AntDesign name="calendar" size={24} color="black" />
              )}
            </TouchableOpacity>
            {endDate !== "" && (
              <TouchableOpacity
                onPress={() => onEndChange("")}
                style={styles.clearIcon}
              >
                <Entypo name="cross" size={28} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {dateError !== "" && (
        <Text style={styles.errorText}>{dateError}</Text>
      )}

      <DatePickerModal
        visible={showStartPicker}
        date={startDate}
        onClose={() => setShowStartPicker(false)}
        onChange={(formatted) => {
          onStartChange(formatted);
        }}
      />
      <DatePickerModal
        visible={showEndPicker}
        date={endDate}
        onClose={() => setShowEndPicker(false)}
        onChange={(formatted) => {
          onEndChange(formatted);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
 dateContainer: {
    flexDirection: "row",
    gap: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111418",
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
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedDate: {
    fontSize: 16,
  },
  clearIcon: {
    marginRight: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginVertical: 4,
  },
});

export default DateRangePicker;
