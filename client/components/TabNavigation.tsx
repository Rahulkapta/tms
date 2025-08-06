import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  tabs?: Tab[];
}

export default function TabNavigation({ activeTab, onTabPress, tabs }: TabNavigationProps) {
  const defaultTabs = [
    { id: 'Todo', label: 'Todo' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Done', label: 'Done' },
  ]; 

  const tabList = tabs || defaultTabs;

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabList.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
          >
            <Text style={[
              styles.tabLabel,
              activeTab === tab.id ? styles.activeTabLabel : styles.inactiveTabLabel
            ]}>
              {tab.label}
            </Text>
            <View style={[
              styles.tabIndicator,
              activeTab === tab.id ? styles.activeTabIndicator : styles.inactiveTabIndicator
            ]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dbe0e6',
    paddingHorizontal: 16,
    gap: 32,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 13,
    paddingTop: 16,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.015,
  },
  activeTabLabel: {
    color: '#111418',
  },
  inactiveTabLabel: {
    color: '#60758a',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
  },
  activeTabIndicator: {
    backgroundColor: '#111418',
  },
  inactiveTabIndicator: {
    backgroundColor: 'transparent',
  },
}); 