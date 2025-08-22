import { Colors } from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TaskCardProps {
  id: string;
  title: string;
  assignedTo: string;
  status: string;
  onPress?: () => void;
}

export default function TaskCard({ 
  title, 
  assignedTo, 
  onPress 
}: TaskCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Entypo name="circle" size={20} color={Colors.iconContainer.icon} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.assignedTo} numberOfLines={2}>
          Assigned to: {assignedTo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.iconContainer.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111418',
    lineHeight: 20,
  },
  assignedTo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#60758a',
    lineHeight: 18,
  },
}); 