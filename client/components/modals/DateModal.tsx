// components/DatePickerModal.tsx
import React from "react";
import { Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface Props {
  visible: boolean;
  date: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

export default function DatePickerModal({
  visible,
  date,
  onChange,
  onClose,
}: Props) {
  if (!visible) return null;

  const parsedDate = date ? new Date(date) : new Date();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    onClose();
    if (event.type === "set" && selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      onChange(formatted);
    }
  };

  return (
    <DateTimePicker
      value={parsedDate}
      mode="date"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={handleChange}
    />
  );
}
